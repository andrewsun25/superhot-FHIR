# -*- coding: utf-8 -*-
"""
Created on Thu Aug  9 13:07:36 2018

@author: Jungang Zou
"""

from pymongo import MongoClient
import time
import os
import sys


#parse the parameters into a key-value mapping
param = sys.argv[1][1:-1].split(',')
dataBaseInfo = {}
for key_value in param:
    key,value = key_value.split(":",1)
    dataBaseInfo[key] = value


#set the connection with MongoDB
client = MongoClient(dataBaseInfo["dataBaseURL"],int(dataBaseInfo["port"]))

#connect with the database. test is the name of table.
db=client[dataBaseInfo["dbName"]]
collection=db[dataBaseInfo["fileExtension"]]

"""
    Function to parse header for SAM files.

    Input:a list of header, every element in the list is a string of header without "@"
    Output:a key-value mapping of header.

"""
def parseHeader(header):
    valueDic = {}
    valueDic["CO"] = []
    for row in header:
        line = row.split("\t")
        if line[0] != "CO":
            subValueDic = {}
            for sub in line[1:]:
                if ":" not in sub:
                    subValueDic[sub] = ""
                    continue
                subPair = sub.split(":")
                subKey = subPair[0]
                subValue = subPair[1]
                subValueDic[subKey] = subValue
            if line[0] not in valueDic:
                valueDic[line[0]] = subValueDic
            elif line[0] in valueDic and type(valueDic[line[0]]) != list:
                valueDic[line[0]] = [valueDic[line[0]]]
                valueDic[line[0]].append(subValueDic)
            elif line[0] in valueDic and type(valueDic[line[0]]) == list:
                valueDic[line[0]].append(subValueDic)
        else:
            valueDic["CO"].append(line[1])
    if valueDic["CO"] == []:
        valueDic.pop("CO")
    elif len(valueDic["CO"]) == 1:
        valueDic["CO"] = valueDic["CO"][0]
    return valueDic



"""
    Function to parse data lines for SAM files.

    Input:a list of data lines.
    Output:a list of sublist, each element is a key-value mapping of each row fo data.

"""
def parseDataLine(dataLine):
    parsedData = []
    for line in dataLine:
        value = line.split('\t')
        dataDic = {}
        dataDic["QNAME"] = value[0]
        dataDic["FLAG"] = value[1]
        dataDic["RNAME"] = value[2]
        dataDic["POS"] = value[3]
        dataDic["MAPQ"] = value[4]
        dataDic["CIGAR"] = value[5]
        dataDic["RNEXT"] = value[6]
        dataDic["PNEXT"] = value[7]
        dataDic["TLEN"] = value[8]
        dataDic["SEQ"] = value[9]
        dataDic["QUAL"] = value[10]
        if len(value) == 12:
            dataDic["optional field"] = value[11]
        elif len(value) > 12:
            dataDic["optional field"] = value[11:]
        parsedData.append(dataDic)
    #print(parsedData)
    return parsedData
        
    

"""
    The main function to parse SAM files and store the parsed data in MongoDB database.

    Input:a file path of SAM file.
    Output: stored key-value mapping data.

"""
def parseSAM(filePath,createTime = True):
    header = []               #a list of header which is delivered to parseHeader(header).
    dataLine = []             #a list of data lines which is delivered to parseDataLine(dataLine).
    parsedData = {}           #key-value mapping which will be stored in database
    
    
    #open file and put different line in different list. 
    with open(filePath) as f:
        for line in f:
            if line == "\n":
                continue
            if line.startswith("@"):
                header.append(line[1:-1])
            else:
                dataLine.append(line[:-1])
                
                
    #parse header.            
    parsedData = parseHeader(header)
    
    #parse data lines.
    dataList = parseDataLine(dataLine)
    
    #If there is just one line, it will be a object instead of a list stored in database.    
    if len(dataList) > 1:
        parsedData["data"] = dataList
    elif len(dataList) == 1:
        parsedData["data"] = dataList[0]
    else:
        pass
    
    #If there is necessary to store time of creation, set createTime to True.
    if createTime:
        parsedData["createTime"] = int(time.time())
        
    #store raw data file path.
    parsedData["filePath"] =  filePath
    
    #insert this parsed data into database.
    collection.insert_one(parsedData)
    

parseSAM(dataBaseInfo["filePath"])
#======================================================================
#     path = "D:\\superhot-FHIR\\convertor\\sam\\sam_sample_data\\"
#     #parseSAM(path+"1_coord_sort.sam")
#     for root, dirs, files in os.walk(path):  
#         for file in files:
#             parseSAM(path+file)
# =============================================================================
