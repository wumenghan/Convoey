from tornado import ioloop, web, gen, concurrent
import logging, sys, os, json, time

PORT	   = 8010
URL_PREFIX = r'/%02d'%(PORT % 100)
DEBUG	   = True

g_location_infos = {} 
g_waiters = set()


class MainHandler(web.RequestHandler):
	def get(self):
		self.render("index.html")

class NewHandler(web.RequestHandler):
	""" Add new marker """
	def post(self):
		user = self.get_argument("user")
		user_position = self.get_argument("user_position")
		print "new user ", user
		print "user position", user_position
		g_location_infos[user] = json.loads(user_position)

		logging.info("Sending new location to %r listeners", len(g_waiters))

		for future in g_waiters:
			future.set_result(g_location_infos)

		g_waiters.clear()
	
class UpdateHandler(web.RequestHandler):
	""" Update marker postition """
	_user = ""
	@gen.coroutine
	def post(self):
		user = self.get_argument("user")
		_user = user
		user_position = self.get_argument("user_position")
		g_location_infos[user] = json.loads(user_position)
		g_user = int(self.get_argument("g_user", 0))
		print "update postitions ", user_position
		print "all user ", g_location_infos
		if g_user == len(g_location_infos):
			self._future = concurrent.Future()
			g_waiters.add(self._future)
			yield self._future

		if not self.request.connection.stream.closed():
			self.write({"locations":g_location_infos})

	def on_connection_close(self):
		g_waiters.remove(self._future)
		self._future.set_result([])
	#	del g_location_infos[self._user]	

def main():
	static_path = os.path.join(os.path.dirname(__file__), "static")
	app = web.Application(
		[ ((URL_PREFIX+r"/"),			 	  			  MainHandler),
		  ((URL_PREFIX+r"/new_user"),     	  			  NewHandler),
		  ((URL_PREFIX+r"/update_user_location"),      	  UpdateHandler),
		  ((URL_PREFIX+r'/static/(.*)'), web.StaticFileHandler, {'path': static_path}),
		  ],
		template_path = os.path.join(os.path.dirname(__file__), "templates"),
		debug		  = DEBUG,
	)
	
	app.listen(address="127.0.0.1", port=PORT)
	sys.stderr.write("Starting server at http://serverhost:%d\n"%PORT)
	ioloop.IOLoop.instance().start()

if __name__ == "__main__":
	main()
