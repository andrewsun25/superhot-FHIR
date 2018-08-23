var exec = require('child_process').exec;
var fs = require("fs");


module.exports = function(dataBaseInfo,callback){
	callPythonFile(dataBaseInfo,callback);
};




function callPythonFile(dataBaseInfo,callback)
{
	//var out = null
	//console.log(__dirname);
	var convertor = __dirname+"\\mongoDB\\"+dataBaseInfo['fileExtension']+"_store.py";
    console.log(convertor);
     exec('python'+' '+convertor+' '+' '+JSON.stringify(dataBaseInfo),function(err,stdout,stderr){
     if(err){
         console.error(err);
         callback(null,err);
     }
     //console.log(stdout);
     //out = stdout;
     callback(stdout,null);
     //fs.unlinkSync(dataBaseInfo['filePath']);
     });
};