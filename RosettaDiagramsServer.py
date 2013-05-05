#!/usr/bin/python
import os
import tornado.ioloop
import tornado.web
import urllib
from rosetta import *

DIRNAME = os.path.dirname(__file__)
TEMPLATE_PATH = DIRNAME

class MainHandler(tornado.web.RequestHandler):
	def post(self):
		print "Accepting connection... \n"
		pose = pose_from_pdb("/home/lior/Projects/DeAcetylase/ModifiedPdbs/2v5w_AI.pdb")
		pyobs = PyMOL_Observer() 
		pyobs.add_observer(pose) 
		
		protocol = urllib.unquote(self.get_argument('protocol'))
		f = open('temp.xml','w')
		f.write(protocol)
		f.close()
		
		
		dpp=protocols.jd2.DockDesignParser()
		main_job=protocols.jd2.Job(protocols.jd2.InnerJob("koko",1),1)
		mover=dpp.generate_mover_from_pose(main_job,pose,True,'temp.xml')
		mover.apply(pose)

		
if __name__ == "__main__":
	application = tornado.web.Application([
		(r"/static/(.*)", tornado.web.StaticFileHandler, {"path": "."}),
		(r"/apply",MainHandler)
	])
	init()
	application.listen(8000)
	tornado.ioloop.IOLoop.instance().start()
