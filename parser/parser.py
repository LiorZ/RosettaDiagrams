#!/usr/bin/python
import json
import sys

def exists_in_attributes(key,ob):
	for keyval in obj["attributes"]:
		if keyval["key"] == key:
			return True
	return False

file_name = sys.argv[1]

file_ptr = open(file_name,'r')
file_lines = file_ptr.read().split('\n');
element_arr=[]
obj={}
obj["attributes"]=[]
for line in file_lines:
	keyval = line.split(": ")
	if ( len(keyval) != 2 ):
		continue
	if ( not line.startswith('KEY:') ):
		if ( "name" in obj ):
			element_arr.append(obj)

		obj={}
		obj["attributes"]=[]
		
		if line.startswith('Mover:'):
			obj['type'] = 'mover'
		elif line.startswith('Filter:'):
			obj['type'] = 'filter'
		elif line.startswith('TOperation:'):
			obj['type'] = 'task_operation'
		obj['name'] = keyval[1]
	else:
		if ( not exists_in_attributes(keyval[1],obj) ):
			obj["attributes"].append({'key':keyval[1],'value':''})
print json.dumps(element_arr)
