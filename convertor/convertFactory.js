var vcf_convertor = require("./vcf_Convertor");

module.exports = function(filePath,fileExtension){
	switch(fileExtension){
		case "vcf":var jsonPath = vcf_convertor(filePath);console.log("convertFactory",jsonPath);return jsonPath;
	}


};