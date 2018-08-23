function convert(data){
	var fhir = data;
	return fhir;
}




module.exports = function(data,dataBaseInfo,callback){
	var fhir = convert(data);
	var result = "";
	callback(fhir,fhir);
}