var MULTIPARTY = require('multiparty');
var FILE = require('fs');
var CRYPTO = require('crypto');
var PATH = require('path');
var OS = require('os');
var fileExtensionParser = require("../convertor/fileExtensionParser");

function getMd5ByFile(file_input, callback, str_encrypt_encoding) {
  //  var LOG_TAG_FUNC = LOG_TAG_FILE.replace('{method}', 'exports.getMd5ByFile = function (file_input, callback)');
    //console.log(LOG_TAG_FUNC.replace('{message}', ''));

    if (str_encrypt_encoding == undefined) {
        str_encrypt_encoding = 'hex';
    }

    var _md5 = CRYPTO.createHash('md5');
    if (callback && typeof callback === 'function') {
        var _file_stream = FILE.createReadStream(file_input);

        _file_stream.on('error', function(error) {
            return callback(error, null);
        });
        _file_stream.on('data', function(chunk) {
            try {
                _md5.update(chunk);
            } catch (error) {
                return callback(error, null);
            }
        });
        _file_stream.on('end', function() {
            return callback(null, _md5.digest(str_encrypt_encoding));
        });
    } else {
        _md5.update(FILE.readFileSync(file_input));
        return _md5.digest(str_encrypt_encoding);
    }
};

function field_validate(field) {
    var result = -1;

    try {
        if (typeof(field) == 'undefined') {
            result = -1;
        } else if (field == null) {
            result = 0;
        } else if (field === '') {
            result = 0;
        } else {
            result = 1;
        }
    } catch (e) {
        result = -1;
    }

    return result;
};

function get_path(str_md5) {
 //   var LOG_TAG_FUNC = LOG_TAG_FILE.replace('{method}', 'exports.get_path = function (str_md5)');
    //console.log(LOG_TAG_FUNC.replace('{message}', ''));

    var _str_file_path = str_md5.replace('"', '');
    var _str_new_file_path = PATH.join(__dirname,'../', '/public/file');
    while (_str_file_path.length > 0) {
        _str_new_file_path = PATH.join(_str_new_file_path, _str_file_path.substring(0, 2));
        _str_file_path = _str_file_path.substring(2, _str_file_path.length);
    }

    return _str_new_file_path;
};

function mkdirsSync(dirpath, mode) {
 //   var LOG_TAG_FUNC = LOG_TAG_FILE.replace('{method}', 'exports.mkdirsSync = function (dirpath, mode)');
    //console.log(LOG_TAG_FUNC.replace('{message}', ''));

    if (!FILE.existsSync(dirpath)) {
        var pathtmp = '';

        dirpath.split(PATH.sep).forEach(function(dirname) {
            //console.log("dirname",typeof(dirname))
            if (OS.platform() == 'win32') {
                if (pathtmp == '' && dirname.charAt(dirname.length-1) == ':') {
                    pathtmp = dirname + PATH.sep;
                } else {
                    pathtmp = PATH.join(pathtmp, dirname);
                }
            } else {
                pathtmp = PATH.join(pathtmp, dirname);
                if (dirname == '') {
                    pathtmp = PATH.sep;
                }
            }

            if (!FILE.existsSync(pathtmp)) {
                if (!FILE.mkdirSync(pathtmp, mode)) {
                    return false;
                }
            }
        });
    }

    return true;
};

module.exports = function(router) {
     //console.log(router);
 //   var LOG_TAG_FUNC = LOG_TAG_FILE.replace('{method}', 'module.exports(router)');
    //console.log(LOG_TAG_FUNC.replace('{message}', ''));
    //console.log(PATH.join(__dirname, '/public/file/temp'))
    router.post('/upload', function(request, response) {
       
    	var form = new MULTIPARTY.Form({uploadDir : PATH.join(__dirname, '../','/public/file/temp')});
        form.parse(request, function(error, fields, data) {
        	if (error) {
                console.log(error)
                return;
            }
            var obj_file = data.textfield[0];
            //console.log(data)
            //console.log(obj_file.size)
            if (obj_file.size <= 0) {
	            FILE.unlinkSync(obj_file.path);
                console.log('上传的是空文件!')
	            //reject(RESULT_UTIL.result(1, ));
	            return;
	        }
            //console.log(typeof(obj_file.path))
	        obj_file.path = obj_file.path.replace(/\\/g, '/');
	        var _str_md5 = getMd5ByFile(obj_file.path);
	        if (field_validate(_str_md5) <= 0) {
	            FILE.unlinkSync(obj_file.path);
                console.log('解析文件失败!')
	            //reject(RESULT_UTIL.result(1, '解析文件失败!'));
	            return;
	        }
	        var _str_file_path = get_path(_str_md5);
	        var _str_file_name = _str_md5;
	        var _str_file_ext = '';
	        if (obj_file.path.indexOf('.') >= 0) {
	            _str_file_ext = obj_file.path.substring(obj_file.path.indexOf('.'), obj_file.path.length).toLowerCase();
	        }
	        var _str_file_size = obj_file.size;
            /*
	        if (!FILE.existsSync(PATH.join(_str_file_path, _str_file_name))) {
	            if (!mkdirsSync(_str_file_path)) {
	                FILE.unlinkSync(obj_file.path);
	                console.log('创建目录失败!')
	                return;
	            }
	            FILE.writeFileSync(PATH.join(_str_file_path, _str_file_name), FILE.readFileSync(obj_file.path));
                
            };*/
            console.log(obj_file.path);
            fileExtensionParser(obj_file.path);
        });
    });
};