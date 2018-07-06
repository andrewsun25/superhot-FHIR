var convertFactory = require("./Convert Factory")
function FileExtensionParser(){

	this.convert = function(filePath){
		fileextension = this.fileExtensionParse(filePath);
		convertfactory = new convertFactory();
		FHIRPath = convertfactory.convert(filePath,fileextension);
		return FHIRPath;
	};


	this.fileExtensionParse = function(filePath){
		fileextension = filePath.split(".")[filePath.split(".").length-1]
		return fileextension;
	};
};

module.exports = FileExtensionParser;