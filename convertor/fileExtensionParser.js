var convertFactory = require("./convertFactory")

/*
this module is used to parse input file extension and deliver file extension to 
convertFactory which will choose the suitable convertor to parse input file.
 */

/*
input:the file path converted to FHIR file.  
output: FHIR file path.
 */
module.exports = function(filePath){
	//console.log("fileExtensionParser");
	//console.log(filePath.split(".")[filePath.split(".").length-1]);
    var fileExtension = filePath.split(".")[filePath.split(".").length-1];
    var jsonPath =  convertFactory(filePath,fileExtension);
    console.log("convertFactory.js",jsonPath);
    return jsonPath;
};