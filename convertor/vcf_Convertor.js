var exec = require('child_process').exec;
var fs = require("fs");
/*
module.exports = function(filePath)
{
	var returnPath = function(stout)
	{
		return stdout;
	}


	var outPutFilePath = "";
	console.log(__dirname);
	var convertor = __dirname+"/vcf/vcf_parse.py";
	var exe = exec('python'+' '+convertor+' '+filePath);
	exe.
    /*exec('python'+' '+convertor+' '+filePath,function(err,stdout,stderr){
    if(err){
        console.log('stderr',err);
    }
    if(stdout){
        console.log("stdout",stdout);
        fs.unlinkSync(filePath);
        outPutFilePath = stdout;
    }
    });
    console.log(outPutFilePath);
    return outPutFilePath;
};
*/

function callPythonFile(filePath,callback)
{
	//var out = null
	//console.log(__dirname);
	var convertor = __dirname+"/vcf/vcf_parse.py";
    exec('python'+' '+convertor+' '+filePath,function(err,stdout,stderr){
    if(err){
        callback(err);
    }
    out = stdout;
    callback(null, stdout);
    fs.unlinkSync(filePath);
    });
};


callPythonFile("D:\\superhot-FHIR\\public\\file\\temp\\5Os4PkfYV3le4FVkveeGoM7L.vcf" , function (err, out) {
  console.log("vcf_Convertor.js",out);
});
