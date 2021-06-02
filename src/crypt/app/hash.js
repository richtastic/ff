// hash.js
// console.log("> hash.js");
// __filename
// __dirname
// process.cwd()
// process.argv


// https://nodejs.org/api/path.html

var path = require("path");
var fs = require("fs");


// node app/hash.js -i plaintext.txt -o output/ -k password.txt
// node app/hash.js -i tests/ -o output/ -k password.txt


// TODO: allow to pass regular expression to ignore(exclude) or restrict(include) files by name
// TODO: allow to pass a list of files explicitely

/*
TODO:
	- sha1 is wrong
	- save the encrypted file to storage
	- is salt needed for decrypting ?
	- original vs AWS encrypted data length is different
		https://csrc.nist.gov/csrc/media/publications/fips/197/final/documents/fips-197.pdf
	- SALT = change the input password OR the message ? (eg xor?)
	- IV = setting of the initial vector array
*/


var codeLocationRelative = "../../code/";
// FF:
var Code = require(codeLocationRelative+"Code.js");
var ByteData = require(codeLocationRelative+"ByteData.js");
var BinInt = require(codeLocationRelative+"BinInt.js");
var Crypto = require(codeLocationRelative+"Crypto.js");

var YAML = require(codeLocationRelative+"YAML.js");

var printLn = function(str){
	console.log(str);
}
// console.log(process.argv);
var argv = process.argv.join(" ");




var currentTime = Code.getTimeStampFromMilliseconds();
// console.log(" > "+currentTime);

var argumentList = null;
var argumentValues = Code.parseCommandLineArguments(argv, argumentList);

var ARG_KEY_PATH_INPUT = "i";
var ARG_KEY_PATH_OUTPUT = "o";
var ARG_KEY_PATH_KEY = "k";
var ARG_KEY_OVERWRITE = "f";
var ARG_KEY_MAINFEST = "m";

var ARG_VAL_DEFAULT_MANIFEST = "info.yaml";
var ARG_VAL_DEFAULT_OVERWRITE = "false";
var printHelpList = function (){
	printLn(""); 
	printLn(" >>> example usage <<< ");
	var scriptName = path.basename(__filename);
	//printLn(__filename);
	printLn("");
	printLn(" node "+scriptName);
	//printLn(__dirname);
	printLn("");
	printLn(" -"+ARG_KEY_PATH_INPUT+"  INPUT_PATH 	(file or directory)");
	printLn(" -"+ARG_KEY_PATH_KEY+"  KEY_PATH 		(file)");
	printLn(" -"+ARG_KEY_PATH_OUTPUT+"  OUTPUT_PATH 	(directory) [default current directory]");
	printLn(" ... ");
	printLn(" -"+ARG_KEY_OVERWRITE+"  FORCE_OVEWRITE 	(present or boolean: true/false) [default "+ARG_VAL_DEFAULT_OVERWRITE+"]");
	printLn(" -"+ARG_KEY_MAINFEST+"  MANIFEST_NAME 	(manifest file name) [default "+ARG_VAL_DEFAULT_MANIFEST+"]");
	printLn("");
}

var inputPath = argumentValues[ARG_KEY_PATH_INPUT];
var keyPath = argumentValues[ARG_KEY_PATH_KEY];
var outputPath = Code.valueOrDefault(argumentValues[ARG_KEY_PATH_OUTPUT],"./");
var manifestName = Code.valueOrDefault(argumentValues[ARG_KEY_MAINFEST], ARG_VAL_DEFAULT_MANIFEST);
var overwriteExisting = ARG_VAL_DEFAULT_OVERWRITE;
	if(Code.hasKey(argumentValues,ARG_KEY_OVERWRITE)){
		overwriteExisting = argumentValues[ARG_KEY_OVERWRITE];
		if(overwriteExisting===null){ // is present but not defined
			overwriteExisting = "true";
		}
	}
	overwriteExisting = (overwriteExisting==="true") ? true : false;

	//


// printLn(" in: "+inputPath);
// printLn("out: "+outputPath);
// printLn("key: "+keyPath);
if(!inputPath || !keyPath){
	printHelpList();
	return;
}

if(!outputPath){
	outputPath = "./";
}

// get full paths
inputPath = path.resolve(inputPath);
outputPath = path.resolve(outputPath);
keyPath = path.resolve(keyPath);
// manifestName = path.resolve(manifestName);


printLn(" in: "+inputPath);
printLn("out: "+outputPath);
printLn("key: "+keyPath);
printLn("man: "+manifestName);
printLn("ovr: "+overwriteExisting);



// read in key
var manifest = {};
var password = null;
var createManifest = function(){
	// console.log("inputPath: "+inputPath);
	manifest["created"] = Code.getTimeStampFromMilliseconds();
	var stats = fs.lstatSync(inputPath);
	// printLn("dir: "+stats.isDirectory());
	// printLn("fil: "+stats.isFile());
	
	if(stats.isDirectory()){
		printLn("get list ...");
		getRecursiveListing(inputPath, function(allFiles,allDirs){
			continueManifest(allFiles);
		});
	}else{
		printLn("single file");
		var fileList = [inputPath];
		inputPath = path.dirname(inputPath);
		continueManifest(fileList);
	}

}


var continueManifest = function(fileList){
	printLn("ALL FILES: .............. "+fileList.length);
	var fileOutputPrefix = "FILE_";
	var fileOutputCount = 0;
	var entries = [];
	for(var i=0; i<fileList.length; ++i){
		var abs = fileList[i];
		var rel = path.relative(inputPath,abs);
		printLn("abs: "+abs);
		printLn("rel: "+rel);
		var entry = {};
			entry["source"] = rel;
			entry["target"] = fileOutputPrefix+fileOutputCount;
		entries.push(entry);
	}
	// ByteData.SHA1
	manifest["files"] = entries;
	manifest["count"] = 0;
	// var yaml = YAML.parse(manifest);
	// printLn(yaml+"");
	encryptManifestFiles();
}


var encryptManifestFiles = function(){
	var entries = manifest["files"];
	var currentEntry = manifest["count"];
	console.log(currentEntry);
	console.log(entries.length);
	if(currentEntry<entries.length){
		console.log("IN");
		var entry = entries[currentEntry];
		var relSource = entry["source"];
		var relTarget = entry["target"];
		var absSource = path.join(inputPath,relSource);
		var absTarget = path.join(inputPath,relTarget);
		console.log(relSource+" .. ");
		console.log(relTarget+" .. ");
		console.log(absSource+" .. ");
		console.log(absTarget+" .. ");
		
		readFile(absSource,function(data){
			console.log("READ FILE");
			var sourceData = Code.copyArray(data); // need writeable / non-Buffer object
						
			// console.log("type: "+typeof(sha1));
			// throw "......"
			
			// console.log("hex1: "+sha1.toStringHex());
			// console.log("bin1: "+sha1.toStringBin());

			// var b = new ByteData();
			// b.writeStringHex("a9993e364706816aba3e25717850c26c9cd0d89d");
			// console.log( b.toHex() );
			// console.log( b.toStringBin() );
			// 
			// 
			var encrypted = Crypto.encryptAES(password, sourceData);
			console.log(" encrypted: "+encrypted.length);
			console.log(encrypted);
			var decrypted = Crypto.decryptAES(password, encrypted);
			console.log(" decrypted: "+decrypted.length);

			console.log(encrypted);
			console.log(encrypted.length);
			console.log(decrypted);
			console.log(decrypted.length);
			console.log(sourceData);
			console.log(sourceData.length);

			var validateEqual = Code.arrayEqual(sourceData,decrypted);
			if(!validateEqual){
				throw "before and after are not equal"
			}

			// var str="";
			// for(var i=0; i<decrypted.length; ++i){
			// 	str = str+""+ String.fromCharCode( decrypted[i] & 255 );
			// }
			// console.log(str);

			// var len = plaintext.length;
			// for(var i=0; i<len; ++i){
			// 	var a = plaintext[i];
			// 	var b = restored[i];
			// 	if(a!==b){
			// 		throw "different at byte"+i;
			// 	}
			// }
			
			// console.log(encrypted);
			// console.log(restored);

			// var sha1 = Crypto.SHA1(sourceData);
			// console.log("sha1: "+sha1.toHex());
			// encrypted = new Uint8Array(Buffer.from('Hello Node.js'));
			

			var sourceSHA1 = Crypto.SHA1(sourceData).toHex();
			var targetSHA1 = Crypto.SHA1(encrypted).toHex();



			entry["sourceSHA1"] = sourceSHA1;
			entry["targetSHA1"] = targetSHA1;

			// save target file
			// console.log("WRITE START");
			encrypted = new Uint8Array(encrypted);
			fs.writeFile(absTarget, encrypted, function(error){
				if(error){
					throw "failed to write file: "+absTarget;
				}
				console.log("WRITE COMPLETE 2");
			});

			var yaml = YAML.parse(manifest);
			printLn(yaml+"");
			// throw "here";

			
			
			// do next
			manifest["count"] = currentEntry+1;
			// encryptManifestFiles();

		});
	}else{
		console.log("done")
	}
}

var getRecursiveListing = function(directory, completionFxn){
	var directories = [directory];
	recursiveDirectories(directories, [], [], completionFxn);
}
var recursiveDirectories = function(directories, allFiles, allDirectories, completionFxn){
	if(directories.length==0){
		completionFxn(allFiles, allDirectories);
		return;
	}
	var directory = directories.shift();
	allDirectories.push(directory);
	fs.readdir(directory, function(err,files){
		if(err){
			throw "error";
		}
		for(var i=0; i<files.length; ++i){
			var file = files[i];
			var abs = path.join(directory,file);
			var stats = fs.lstatSync(abs);
			if(stats.isDirectory()){
				directories.push(abs);
			}else{
				allFiles.push(abs);
			}
		}
		recursiveDirectories(directories, allFiles, allDirectories, completionFxn);
	});
}

var readSourceFiles = function(){
	printLn("readSourceFiles");
}

var readPasswordFile = function(completeFxn){
	readFile(keyPath, function(data){
		password = data;
		completeFxn();
	});
}
var readFile = function(path,completeFxn){
	fs.readFile(path, function(err, data){
		// printLn("read in: "+err);
		if(err){
			throw "error";
		}
		printLn(" read: "+path+" : "+data.length);
		// for(var i=0; i<data.length; ++i){
		// 	var byte = data[i];
		// 	printLn( String.fromCharCode(byte & 255) );
		// }
		// password = data;
		completeFxn(data);
	});
}

readPasswordFile(function(){
	createManifest();
});
	



/*
manifest:

created: TIMESTAMP

files:
	- 
		source: ORIGINAL/PATH/NAME.txt
		target: FINAL/LOCATION/123
		shaSource: 1231231312
		shaTarget: 1231231212

*/

	// console.log("key       : "+Code.printArrayHex(key,2));
	// console.log("plaintext : "+Code.printArrayHex(plaintext,2));
	// var type = ByteData.AES_TYPE_CBC;
	// // var type = ByteData.AES_TYPE_EBC;
	// var size = ByteData.AES_SIZE_256;
	// var useSalting = true;
	// // var useSalting = false;
	// var result = ByteData.AESencrypt(key, plaintext, type, size, useSalting);
	// 	var cyphertext = result;
	// 	// var cyphertext = result["cyphertext"];
	// 	// var salt = result["salt"];
	// console.log("cyphertext: "+Code.printArrayHex(cyphertext,2));
	// var restored = ByteData.AESdecrypt(key, cyphertext, type, size, useSalting);
	// console.log("check     : "+Code.printArrayHex(restored,2));

	// ByteData.AESencrypt(key, message, type, size, useSalting, isDecrypt);
	// ByteData.AESdecrypt(key, cyphertext, type, size, useSalting);



// get complete list of files


// create manifest


// for each file => convert to 


// if at any point a destination file exists AND overwrite is false => abort




// node app/hash.js -i plaintext.txt -o output/ -k password.txt


// node crypt/app/hash.js -f FUNCTION_NAME DIRECTORY_OR_FILE --file PATH_TO_KEY_TEXT OTHER_PARAMETER  -after-tab value --novalue --item  -here	-other value \

// items / defaults


//console.log(" > "+argumentValues);


// TODO: hashing data


// ..


/*

- path to: file | directory

- create a manifest / info / dictionary / database file



node hash.js FUNCTION_NAME DIRECTORY_OR_FILE PATH_TO_KEY_TEXT OTHER_PARAMETERS:(key/hash size)


- convert key ascii text into binary array & extend to fill full N(eg 1024) bits
- get a full list of all files needing to be hashed (if dir, else just 1)
- create output file/directory (random name - time / seed)
- do hash fxn
- check fwd/bak validation

if directory: can split into a bunch of individual directories, mod 100-100 files in some number order:
ABCDEFGHIJKLMNOP/
	0/
		ABCDEF
		...
	1/
		GHIJKL
		...
	...


eg manifest (yaml?):

date: 2021-02-31 23:59:01.1234
manifest:
	- 
		source: ORIGINAL/FILE/PATH.png
		sha256: SHA_HASH
		destination: FINAL/PATH/NAME
	...



hash fxn fwd:
	- xor with key
	- AES-256
	- invert bits
	- AES-256
	- xor with key
	- remainder truncating ?
	

hash fxn rev:
	- inverse


*/