# -*- coding: utf-8 -*-
"""
Created on Thu Aug  9 13:07:36 2018

@author: Jungang Zou
"""

from pymongo import MongoClient
import re
import time
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
    Split function for a metadata line.
    For example, a string is <ID=RGQ,Number=1,Type=Integer,Description="Unconditional reference genotype confidence, encoded as a phred quality -10*log10 p(genotype call is wrong)">
    Since there are commas in description,if we simply use split(",") to split the line,
    We can`t get what we want.

    Input:a string of metadata
    Output:a list of substrings splited correctly.

"""
def split_(string):
    comma = [-1]
    quota = False
    for pos in range(len(string)):
        if string[pos] == "," and quota == False:
            comma.append(pos)
        elif string[pos] == "\"":
            quota = not quota
    comma.append(-1)
    substring = []
    for pos in range(len(comma)-1):
        substring.append(string[comma[pos]+1:comma[pos+1]])
    return substring


"""
    Function to parse metadata for VCF files.

    Input:a list of metadata, every element in the list is a string of metadata without "##"
    Output:a list of sublist, the first element in every sublist is key and the second one is value.

"""
def parseMetaData(metaData):
    valueList = []
    for row in metaData:
        line = row.split("=",1)
        key = line[0].replace(".","")
        value = line[1]
        #print(value)
        if value.startswith("<"):
            value = split_(value[1:])
            #print(value)
            subValueDic = {}
            for subValue in value:
                if subValue is None:
                    continue
                if "=" not in subValue:
                    continue
                attr = subValue.split("=",1)
                #print(attr)
                if attr[1].startswith("\"") and attr[1].endswith("\""):
                    subValueDic[attr[0]] = attr[1][1:-1]
                else:
                    subValueDic[attr[0]] = attr[1]
            value = subValueDic
        if type(value) == str and value.startswith("\"") and value.endswith("\""):
            valueList.append([key,value[1:-1]])
        else:
            valueList.append([key,value])
    return valueList

        
"""
    Function to parse data lines for VCF files.

    Input:a list of data lines, the first sublist is field, other sublists are data lines.
    Output:a list of sublist, each element is a key-value mapping of each row fo data.

"""
def parseDataLine(dataLine):
    parsedData = []
    field = re.split("[\t ]+",dataLine[0])
    for row in dataLine[1:]:
        row_split = re.split("[\t ]+",row[:-1])
        dic = {}
        #print(g)
        for key in range(len(field)):
            dic[field[key]] = row_split[key]
        parsedData.append(dic)
    return parsedData
    

"""
    The main function to parse VCF files and store the parsed data in MongoDB database.

    Input:a file path of VCF file.
    Output: stored key-value mapping data.

"""
def parseVCF(filePath,createTime = True):
    keyValueDic = {}                         #key-value mapping
    dataLine = []                            #a list of data lines which is delivered to parseData(data).
    metaData = []                            #a list of metadata which is delivered to parseMetaData(metaData).


    #open file and put different line in different list. 
    with open(filePath) as f:
        for line in f:
            if line == "\n":
                continue
            if line.startswith("##"):
                metaData.append(line[2:-1])
            elif line.startswith("#"):
                dataLine.append(line[:-1])
            else:
                dataLine.append(line[:-1])

    #parse metadata. If there are data with same key, it will merge them into a list.
    metaDataList = parseMetaData(metaData)
    for line in metaDataList:
        if line[0] in keyValueDic:
            lineValue = keyValueDic[line[0]]
            if type(lineValue) == list:
                lineValue.append(line[1])
                keyValueDic[line[0]] = lineValue
            else:
                lineValue = [lineValue]
                lineValue.append(line[1])
                keyValueDic[line[0]] = lineValue
        else:
            keyValueDic[line[0]] = line[1]
       
    #parse data lines. If there is just one line, it will be a object instead of a list stored in database.     
    dataList = parseDataLine(dataLine)
    if len(dataList) == 1:
        dataList = dataList[0]
        keyValueDic["data"] = dataList
    elif len(dataList) == 0:
        pass
    else:
        keyValueDic["data"] = dataList
    
    #store the created time for this file.
    if createTime:
        keyValueDic["createTime"] = int(time.time())
    keyValueDic["filePath"] =  filePath 
    
    #print(keyValueDic)   
    #insert the record into database.
    collection.insert_one(keyValueDic)


parseVCF(dataBaseInfo["filePath"])
# =============================================================================
# for item in collection.find():
#     print(item)
# =============================================================================
#if __name__ == "__main__":
#    parseVCF(r"D:\superhot-FHIR\convertor\vcf\vcf_sample_data\FT.vcf")