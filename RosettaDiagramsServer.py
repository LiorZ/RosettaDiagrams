#!/usr/bin/python
import os
import tornado.ioloop
import tornado.web
from rosetta import *

DIRNAME = os.path.dirname(__file__)
TEMPLATE_PATH = DIRNAME

class MainHandler(tornado.web.RequestHandler):
	def post(self):
		print "Accepting connection... \n"
		pose = pose_from_pdb("/home/lior/Projects/DeAcetylase/ModifiedPdbs/2v5w_A.pdb")
		pyobs = PyMOL_Observer() 
		pyobs.add_observer(pose) 
		minimizer = protocols.simple_moves.MinMover()
		movemap = MoveMap()
		movemap.set_bb(True)
		minimizer.movemap(movemap)
		minimizer.apply(pose)
if __name__ == "__main__":
	application = tornado.web.Application([
		(r"/static/(.*)", tornado.web.StaticFileHandler, {"path": "."}),
		(r"/apply_min",MainHandler)
	])
	init()
	application.listen(8000)
	tornado.ioloop.IOLoop.instance().start()
