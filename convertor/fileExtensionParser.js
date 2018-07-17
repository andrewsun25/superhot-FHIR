var convertFactory = require("./convertFactory")

module.exports = function(filePath){
	//console.log("fileExtensionParser");
	//console.log(filePath.split(".")[filePath.split(".").length-1]);
    var fileExtension = filePath.split(".")[filePath.split(".").length-1];
    convertFactory(filePath,fileExtension);
};