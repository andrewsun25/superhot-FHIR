var vcf = require("./VCF_to_FHIR_convertor");
//var sam = require("./SAM_to_FHIR_convertor");




module.exports = function(data,dataBaseInfo,callback){
	switch(dataBaseInfo["format"]){
		case "VCF":vcf(data,dataBaseInfo,callback);break;
		//case "SAM":sam(data,dataBaseInfo,callback);break;
	}
}