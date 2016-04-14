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
	def post(self):
		location = self.get_argument("locations")
		user = self.get_argument("user")
		g_location_infos[user] = json.loads(location)
		print type(json.loads(location)) 
		logging.info("Sending new location to %r listeners", len(g_waiters))

		for future in g_waiters:
			future.set_result(g_location_infos)

		g_waiters.clear()
	
	
class UpdateHandler(web.RequestHandler):
	@gen.coroutine
	def post(self):
		num_seen = int(self.get_argument("num_seen", 0))
		print num_seen
		print len(g_location_infos)
		if num_seen == len(g_location_infos):
			self._future = concurrent.Future()
			g_waiters.add(self._future)
			yield self._future

		if not self.request.connection.stream.closed():
			self.write({"locations":g_location_infos})

	def on_connection_close(self):
		g_waiters.remove(self._future)
		self._future.set_result([])

def main():
	static_path = os.path.join(os.path.dirname(__file__), "static")
	app = web.Application(
		[ ((URL_PREFIX+r"/"),			 MainHandler),
		  ((URL_PREFIX+r"/new"),         NewHandler),
		  ((URL_PREFIX+r"/update"),      UpdateHandler),
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
