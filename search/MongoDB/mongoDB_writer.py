# -*- coding: utf-8 -*-
"""
Created on Wed Aug 22 16:08:01 2018

@author: Jungang Zou
"""

import sys
import time
from pymongo import MongoClient

param = sys.argv[1:]
for i in param:
	print(i)
client = MongoClient(param[0],int(param[1]))

db = client[param[2]]

collection = db['FHIR']

with open(param[3],'r') as f:
    data = f.readline()
data = eval(data)



# data = eval(param[3])
# print(data)
data["createTime"] = int(time.time())

collection.insert_one(data)
