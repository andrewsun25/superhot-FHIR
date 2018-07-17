var exec = require('child_process').exec;
var fs = require("fs");
module.exports = function(filePath)
{
	console.log(__dirname);
	var convertor = __dirname+"/vcf/vcf_parse.py";
    exec('python'+' '+convertor+' '+filePath,function(err,stdout,stderr){
    if(err){
        console.log('stderr',err);
    }

    if(stdout)
    {
        console.log('stdout',stdout);
        fs.unlinkSync(filePath);
    }
    
  });
};