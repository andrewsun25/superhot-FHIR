var vcf_convertor = require("./vcf_Convertor");

module.exports = function(filePath,fileExtension){
	switch(fileExtension){
		case "vcf":vcf_convertor(filePath);break;
	}


};