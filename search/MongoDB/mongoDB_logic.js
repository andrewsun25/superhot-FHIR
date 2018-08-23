var factory = require("../FHIR_convertors/./FHIR_convertor_factory");
var exec = require('child_process').exec;
var fs = require("fs");











function callPythonFile(data,dataBaseInfo,callback)
{
    data = JSON.stringify(data);
    path =Date.parse(new Date())+dataBaseInfo["port"]+dataBaseInfo["dbName"]+dataBaseInfo["format"]+".txt";
    fs.writeFile(path, data,  function(err) {
       if (err) {
           return console.error(err);
       }
       
        var writer = __dirname+"\\mongoDB_writer.py";
        //console.log('python'+' '+writer+' '+dataBaseInfo["dataBaseURL"]+":"+dataBaseInfo["port"]+' '+dataBaseInfo["dbName"]+' '+data);
        console.log(writer);
        exec('python'+' '+writer+' '+dataBaseInfo["dataBaseURL"]+" "+dataBaseInfo["port"]+' '+dataBaseInfo["dbName"]+" "+path,function(err,stdout,stderr){
        if(err){
            console.log(err)
            ;//callback(err,null);
        }
        console.log(stdout);
        //callback(null,stdout);
        fs.unlink(path, function(err) {
           if (err) {
                console.log(err);
               return console.error(err);
           }
           console.log("文件删除成功！");
        });
        });


    });
}




module.exports = function(dataBaseInfo,dbo,callback){
	dbo.collection(dataBaseInfo["format"]).findOne(dataBaseInfo["query"],function(err, result) {
        if (err) {
        console.log(err);
        throw err;
    }
        if(result==null){
            callback({"data":null});
        }
        else{
            console.log("factory");
            factory(result,dataBaseInfo,function(param,data){
                callback(param);
                callPythonFile(data,dataBaseInfo,null);
            });
    }
    }); 
}

