import json
import sys
import time 
import re
import random

if len(sys.argv)<5:
	print "generateNetwork.py <meta> <dists> <data.json> <max_dist>"
	quit()

def date2time(date):
	if re.match("\d+/\d+/\d+",date)==None:
		if date=="NA":
			return date
		else:
			print date
			quit()
	re_obj = re.match("(\d+)/(\d+)/\d*\d*(\d\d)",date)
	date = re_obj.group(1)
	month = re_obj.group(2)
	year = re_obj.group(3)
	return time.mktime(time.strptime("%s/%s/%s"%(date,month,year), "%d/%m/%y")) * 1000


def loadMeta(filename):
	meta = {}
	with open(filename) as f:
		header = f.readline().rstrip().split(",")
		for line in f:
			temp_dict = {}
			arr = line.rstrip().split(",")
#			temp_dict["id"] = arr[0]
			print arr
			temp_dict["date"] = date2time(arr[1])
			for i in range(2,len(arr)):
				temp_dict[header[i]] = arr[i]
			meta[arr[0]] = temp_dict
	return meta


def parseDists(filename):
	with open(filename) as f:
		header = [x[1:-1] for x in f.readline().rstrip().split()]
		header.insert(0,"dummy")
		nodes = []
		edges = {}
		for i in range(0,int(sys.argv[4])+1):
			edges[i] = []
		for l in f:
			arr = l.rstrip().split()
			arr[0] = arr[0][1:-1]
			sid = arr[0]
			nodes.append({"id":sid})
			arr[header.index(sid)] = 1000000 # prevent self being the best match
			arr[1:] = [float(x) for x in arr[1:]] # convert to float
			min_dist = min(arr[1:])
			closest_nodes = []
			for i in range(1,len(arr)):
				if arr[i]==min_dist:
					closest_nodes.append(header[i])
			for t in closest_nodes:
	#			if int(round(min_dist))<=int(sys.argv[5]):
				for i in range(int(round(min_dist)),int(sys.argv[4])+1):
					if i not in edges:
						continue
					edges[i].append({"source":sid,"target":t,"dist":int(round(min_dist))})

	return {"nodes":nodes,"edges":edges}

def annotate_cluster_size(edges):
	clusters = []
	print edges
	for x in edges:
		test = 0
		for c in clusters:
			if x["source"] in c or x["target"] in c:
				c.add(x["source"])
				c.add(x["target"])
				test = 1
		if test==0:
			clusters.append(set([x["source"],x["target"]]))
	for x in edges:
		for c in clusters:
			if x["source"] in c:
				x["cluster_size"] = len(c)
				break




meta_data = loadMeta(sys.argv[1])
graph = parseDists(sys.argv[2])
for snp_val in graph["edges"]:
	annotate_cluster_size(graph["edges"][snp_val])

for node in graph["nodes"]:
	nid = node["id"]
	print nid
#	node["id"] = node
	node["date"] = meta_data[nid]["date"]
	node["attributes"] = {} 
	node["gps"] = [random.randint(0,10),random.randint(0,10)]
	if nid in meta_data:
		for m in meta_data[nid]:
			if m=="date": 
				continue
			node["attributes"][m] = meta_data[node["id"]][m]


json.dump(graph,open(sys.argv[3],"w"))
