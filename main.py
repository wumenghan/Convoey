from tornado import ioloop, web, gen, concurrent
import logging, sys, os, json, time




class MainHandler(web.RequestHandler):
	def get(self):
		self.render("index.html")

class NewHandler(web.RequestHandler):
	def post(self):



class UpdateHandler(web.RequestHandler):
	@gen.coroutine
	def post(self):


if __name__ == "__main__":
	app = tornado.web.Application(
		[	(r"/",		 MainHandler),
			(r"/update", UpdateHandler)

		],


		)