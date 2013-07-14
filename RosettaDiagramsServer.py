#!/usr/bin/python
import os
import tornado.ioloop
import tornado.web
import urllib

from rosetta import *

DIRNAME = os.path.dirname(__file__)
TEMPLATE_PATH = DIRNAME
if not os.path.exists("results"):
	os.mkdir("results")

class MainHandler(tornado.web.RequestHandler):
	def post(self):
		print "Accepting connection... \n"
		
		fileinfo = self.request.files['pdb_file'][0]['body']
		self.write_file(fileinfo,"temp.pdb")
		is_pymol_mover = self.get_argument("pymol_vis", False)
		pose = pose_from_pdb("temp.pdb")
		
		if (is_pymol_mover):
			pyobs = PyMOL_Observer() 
			pyobs.add_observer(pose) 
		
		protocol = urllib.unquote(self.get_argument('txt_protocol'))
		self.write_file(protocol,'temp.xml')
		
		dpp=protocols.jd2.DockDesignParser()
		main_job=protocols.jd2.Job(protocols.jd2.InnerJob("koko",1),1)
		mover=dpp.generate_mover_from_pose(main_job,pose,True,'temp.xml')
		mover.apply(pose)
		file_name=str(os.urandom(16).encode('hex')) + '.pdb'
		path="results/"+file_name
		rsp = dict()
		rsp['path'] = path
		pose.dump_pdb(path)
		self.write(rsp)
		
	def write_file(self,file_str,path):
		f = open(path,'w')
		f.write(file_str)
		f.close()

if __name__ == "__main__":
	application = tornado.web.Application([
		(r"/static/(.*)", tornado.web.StaticFileHandler, {"path": "."}),
		(r"/apply",MainHandler)
	])
	init()
	application.listen(8000)
	tornado.ioloop.IOLoop.instance().start()
