var dataBaseMongoDB = require("./mongoDB_logic");
var MongoClient = require('mongodb').MongoClient;


function queryFHIR(dataBaseInfo,db,callback)
{
    var dbo = db.db(dataBaseInfo["dbName"]);
    dbo.collection("FHIR").findOne(dataBaseInfo["query"],function(err, result) {
        if (err) {
    	console.log(err);
    	throw err;
    }
    	if(result==null){
    		dataBaseMongoDB(dataBaseInfo,dbo,callback);
    	}
    	else{
        	callback(result);
    	}
        db.close();
    });	
}

function parseQuery(dataBaseInfo){
	dbName = "test";
	queryCondition = dataBaseInfo['query'];
	return dataBaseInfo;
}





module.exports = function(dataBaseInfo,callback){
	var url = dataBaseInfo["dataBaseURL"]+":"+dataBaseInfo["port"];
    console.log(url);
	MongoClient.connect(url, function(err, client) {
    if (err) {
    	console.error(err);
    	throw err;
    }
 	dataBaseInfo = parseQuery(dataBaseInfo);
    queryFHIR(dataBaseInfo,client,function(param) {
    client.close();
    callback(param);
    });
});
}

