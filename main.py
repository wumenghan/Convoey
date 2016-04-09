from tornado import ioloop, web, gen, concurrent
import logging, sys, os, json, time

PORT	   = 8010
URL_PREFIX = r'/%02d'%(PORT % 100)
DEBUG	   = True



class MainHandler(web.RequestHandler):
	def get(self):
		self.render("index.html")


def main():
	static_path = os.path.join(os.path.dirname(__file__), "static")
	app = web.Application(
		[ ((URL_PREFIX+r"/"),			 MainHandler),
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
