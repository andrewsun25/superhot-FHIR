var mongo = require("./MongoDB/mongoDB_FHIR")
var url = require('url');


function parseURL(URL)
{
	dataBaseInfo = {"dataBase":"MongoDB",
					"dataBaseURL":"mongodb://localhost",
					"port":"27017",
					"dbName":"test",
					"format":"VCF",
					"query":URL};
	return dataBaseInfo;
}




module.exports = function(router){
router.get('/search', function(request, response) {
	URL = parseURL(url.parse(request.url, true).query)

	switch(URL["dataBase"]){
		case "MongoDB":mongo(URL,function(param){response.json(param)});break;
	}

	
});
};

// c= function(a){
// 	fs.writeFile('input.txt', a,  function(err) {
//    if (err) {
//        return console.error(err);
//    }
// });
// }


// b({"fileformat"
// :
// "VCFv4.3"},c);
