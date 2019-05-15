// server.js
//
var express = require('express');
var mongoose = require('mongoose');
	var mongodb = require('mongodb');
var googleStorage = require('@google-cloud/storage');

// var fs = require('fs');

// var crypto = require('crypto');
var config = require('./config.json');


// networking
var host = config["networking"]["ip"];
var port = config["networking"]["port"];


// data storage:
var storageConfig = config["fileserver"];
var googleStorageProjectID = storageConfig["project"];
var googleStorageBucketName = storageConfig["bucket"];
var storage = new googleStorage["Storage"]({
	"projectId": googleStorageProjectID,
});



var fileSystem = require('fs');


// https://cloud.google.com/storage/docs/how-to#working-with-objects

// list buckets:
/*
storage.getBuckets().then(function(results){
	var buckets = results[0];
	for(var i=0; i<buckets.length; ++i){
		var bucket = buckets[i];
		console.log("BUCKET: "+bucket["name"]);
	}
});
*/

// bucket.getFiles({prefix:'foo/', delimiter:'/', autoPaginate:false}, cb);

// bucket.getFiles({delimiter:'/', autoPaginate:false}, cb);



// https://cloud.google.com/storage/docs/creating-buckets#storage-create-bucket-code_samples
/*
storage.createBucket(googleStorageBucketName).then(function(){
	console.log("bucket created");
}).catch(function(error){
	console.error('ERROR:', error);
});
*/

// https://cloud.google.com/storage/docs/uploading-objects
/*
var filename = "test.png";
storage.bucket(googleStorageBucketName).upload(filename, {
	"gzip": true,
	"metadata": {
		//
	},
	"destination": "/sub/folder/filename.png"
}).then(function(){
	console.log("upload success");
}).catch(function(error){
	console.error('ERROR:', error);
});
*/

// https://cloud.google.com/storage/docs/downloading-objects
/*
var filename = "dl.png"
var options = {
	"destination": filename,
};
storage.bucket(googleStorageBucketName).file("test.png").download(options)
	.then(function(){
		console.log("downloaded");// `gs://${bucketName}/${srcFilename} downloaded to ${destFilename}.`
	})
	.catch(function(){
		console.error('ERROR:', err);
	});
*/

// https://cloud.google.com/storage/docs/deleting-objects
/*
storage.bucket(googleStorageBucketName).file("test.png").delete()
.then(function(){
	console.log("deleted file");
})
.catch(function(){
	console.error('ERROR:', err);
});
*/

// https://cloud.google.com/storage/docs/viewing-editing-metadata#storage-view-object-metadata-nodejs
// METADATA


// mongo
var mongoConfig = config["mongo"];
var mongoUser = mongoConfig["user"];
var mongoPassword = mongoConfig["password"];
var mongoHost = mongoConfig["host"];
var mongoPort = mongoConfig["port"];
var mongoDB = mongoConfig["database"];
var mongoURI = "mongodb://"+mongoUser+":"+mongoPassword+"@"+mongoHost+":"+mongoPort+"/"+mongoDB;

var mongoClient = null;
// { useNewUrlParser: true }

//mongoClient = mongodb.connect(mongoURI, { useNewUrlParser: true }, handleMongooseError);
mongoose.connect(mongoURI, { useNewUrlParser: true }).then(function(dbo){
	// console.log(dbo);
	// console.log(b);
	console.log("mongo connected: "+mongoHost+":"+mongoPort+" / "+mongoDB);
	// console.log(mongoClient);


	// var time = new Date().getTime();
	// var object = {"name": "insert test", "timestamp":time};

/*
	var Schema = mongoose.Schema;

	var mySchema = new Schema({
		"name": String,
		"timestamp": String,
	});
	var MyModel = mongoose.model("Model", mySchema);

	object = new MyModel({
		"name": "test",
		"timestamp": (new Date().getTime())+"",
	});

	object.save(function(e){
		if(e){
			console.log("error");
		}else{
			console.log("inserted");
		}
	})
*/

	// var db = mongoClient;
	// var db = dbo.db(mongoDB);
	// var collection = "test";
	// var time = new Date().getTime();
	// var object = {"name": "insert test", "timestamp":time}
	// db.collection(collection).insertOne(object, function(e,r){
	// 	if(e){
	// 		console.log("error: "+e);
	// 	}else{
	// 		console.log("inserted");
	// 	}
	// 	db.close();
	// });

}).catch(function(error){
	console.error('mongo error:', error);
});


// files




// config file # permanent
// settings file # variable

// log file location
// var port = 8080; // GAE port
// var host = "0.0.0.0"; // GAE host
// var port = 8081; // localhost
// var host = "127.0.0.1"; // localhost


/*
var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(port, host);
console.log('Server running at http://'+host+':'+port+'/');
*/



var KEY_RETURN_RESULT = "result";
var VALUE_SUCCESS = "success";
var VALUE_FAILURE = "failure";

var KEY_PAGE_OFFSET = "offset";
var KEY_PAGE_COUNT = "count";

var KEY_USER_ID = "userid";
var KEY_USER_EMAIL = "useremail";
var KEY_USER_PASSWORD = "userpassword";
var KEY_SESSION_ID = "sessionid";

var KEY_PROJECT_LIST = "projects";
var KEY_PROJECT_INFO = "project";
var KEY_PROJECT_ID = "projectid";

var KEY_VIEW_ID = "viewid";

var KEY_CAMERA_ID = "cameraid";

var KEY_IMAGE_ID = "imageid";
var KEY_IMAGE_WIDTH = "width";
var KEY_IMAGE_HEIGHT = "height";

var KEY_POLYGON_COUNT = "polycount";

var KEY_SCENE_ID = "imageid";


var app = express();
// process.env.PORT || 3000
// app.set('port', 8081);
app.set('port', port);
app.set('view engine', 'ejs');




var operation = require('./routers.js');

app.get('/test', function (req, res) {
	operation(req,res);
});


app.get('/', function (req, res) {
	// print routes
	res.render('pages/index', {"routes":app._router.stack});
	/*
	info = "";
	app._router.stack.forEach(function(operation){
		var route = operation.route;
		if(route){
			var path = route.path;
			var stack = route.stack;
			if(path && stack){
				stack.forEach(function(value,key){
					var method = value["method"];
					info = info+" "+method+" : "+path+"<br/>";
				});
			}
		}
	});
	res.send(info);
	// res.send('server.js')
	*/
});




// CREATE NEW USER:
app.get('/user/create', function(req, res){
	var userEmail = req.query[KEY_USER_EMAIL];
	var userPassword = req.query[KEY_USER_PASSWORD];
	// res.send("CREATE USER:<br/>"+userEmail+"<br/>"+userPassword+"");
	res.json({
		KEY_USER_ID:userID,
		KEY_USER_EMAIL:userEmail,
		KEY_RETURN_RESULT:VALUE_FAILURE,
	});
});

// GET USER INFO:
app.get('/user/read', function(req, res){
	var userID = req.query[KEY_USER_ID];
	var sessionID = req.query[KEY_SESSION_ID];
	// res.send("GET USER:<br/>"+userID+"<br/>"+sessionID+"");
	var userEmail = "email@gmail.com"
	res.json({
		KEY_USER_ID:userID,
		KEY_USER_EMAIL:userEmail,
		KEY_RETURN_RESULT:VALUE_FAILURE,
	});
});

// CREATE NEW SESSION
app.get('/session/create', function(req, res){
	var userID = req.query[KEY_USER_ID];
	var userPassword = req.query[KEY_USER_PASSWORD];
	// res.send("GET USER:<br/>"+usereID+"<br/>"+userPassword+"");
	var sessionID = "0123456789";
	res.json({
		KEY_USER_ID:userID,
		KEY_SESSION_ID:sessionID,
		KEY_RETURN_RESULT:VALUE_FAILURE,
	});
});

// GET LIST OF PROJECTS:
app.get('/projects/read', function(req, res){
	var userID = req.query[KEY_USER_ID];
	var sessionID = req.query[KEY_SESSION_ID];
	var offset = req.query[KEY_PAGE_OFFSET];
	var count = req.query[KEY_PAGE_COUNT];
	res.json({
		KEY_PAGE_OFFSET:offset,
		KEY_PAGE_COUNT:count,
		KEY_PROJECT_LIST:[],
		KEY_RETURN_RESULT:VALUE_FAILURE,
	});
});

// CREATE NEW PROJECT:
app.get('/project/create', function(req, res){
	var userID = req.query[KEY_USER_ID];
	var sessionID = req.query[KEY_SESSION_ID];
	var projectID = "0123456789";
	res.json({
		KEY_PROJECT_ID:projectID,
		KEY_PROJECT_INFO:{},
		KEY_RETURN_RESULT:VALUE_FAILURE,
	});
});

// GET PROJECT INFO:
app.get('/project/read', function(req, res){
	var userID = req.query[KEY_USER_ID];
	var sessionID = req.query[KEY_SESSION_ID];
	var projectID = req.query[KEY_PROJECT_ID];
	res.json({
		KEY_PROJECT_ID:projectID,
		KEY_PROJECT_INFO:{},
		KEY_RETURN_RESULT:VALUE_FAILURE,
	});
});

// CREATE PROJECT VIEW:
app.get('/project/view/image/create', function(req, res){
	var userID = req.query[KEY_USER_ID];
	var sessionID = req.query[KEY_SESSION_ID];
	var projectID = req.query[KEY_PROJECT_ID];
	var viewID = "0123456789";
	var imageData = "?";

	// get data
	throw "TODO";

	res.json({
		KEY_PROJECT_ID:projectID,
		KEY_VIEW_ID:viewID,
		KEY_RETURN_RESULT:VALUE_FAILURE,
	});
});

// CREATE PROJECT CAMERA:
app.get('/project/camera/create', function(req, res){
	var userID = req.query[KEY_USER_ID];
	var sessionID = req.query[KEY_SESSION_ID];
	var projectID = req.query[KEY_PROJECT_ID];
	var cameraID = "0123456789";
	res.json({
		KEY_PROJECT_ID:projectID,
		KEY_CAMERA_ID:cameraID,
		KEY_RETURN_RESULT:VALUE_FAILURE,
	});
});

// CREATE CAMERA IMAGE:
app.get('/project/camera/image/create', function(req, res){
	var userID = req.query[KEY_USER_ID];
	var sessionID = req.query[KEY_SESSION_ID];
	var projectID = req.query[KEY_PROJECT_ID];
	var cameraID = req.query[KEY_CAMERA_ID];
	var imageData = "?";

	// get data
	throw "TODO";

	res.json({
		KEY_PROJECT_ID:projectID,
		KEY_CAMERA_ID:cameraID,
		KEY_RETURN_RESULT:VALUE_FAILURE,
	});
});

// GET PROJECT IMAGE:
app.get('/project/image/read', function(req, res){
	var userID = req.query[KEY_USER_ID];
	var sessionID = req.query[KEY_SESSION_ID];
	var projectID = req.query[KEY_PROJECT_ID];
	var imageID = req.query[KEY_IMAGE_ID];
	var imageWidth = req.query[KEY_IMAGE_WIDTH];
	var imageHeight = req.query[KEY_IMAGE_HEIGHT];
	fileSystem.readFile('./test.png', function(error,data){
		if(error){
			res.end();
			return;
		}
		var imageData = data;
		res.contentType('image/png');
		res.end(imageData, 'binary');
	});
});

// GET RECONSTRUCTION POLYGONS / INFO
app.get('/project/image/read', function(req, res){
	var userID = req.query[KEY_USER_ID];
	var sessionID = req.query[KEY_SESSION_ID];
	var projectID = req.query[KEY_PROJECT_ID];
	var polygonCount = req.query[KEY_POLYGON_COUNT];
	var data = {};
	res.json({
		KEY_PROJECT_ID:projectID,
		KEY_RECONSTRUCTION_INFO:data,
		KEY_RETURN_RESULT:VALUE_FAILURE,
	});
});

// GET RECONSTRUCTION TEXTURE IMAGES
app.get('/project/scene/image/read', function(req, res){
	var userID = req.query[KEY_USER_ID];
	var sessionID = req.query[KEY_SESSION_ID];
	var projectID = req.query[KEY_PROJECT_ID];
	// var polygonCount = req.query[KEY_POLYGON_COUNT];

	// need image dat a?
	res.json({
		KEY_RETURN_RESULT:VALUE_FAILURE,
	});
});

// GET SCENE LIST

// GET SCENE INFO
app.get('/project/scene/image/read', function(req, res){
	var userID = req.query[KEY_USER_ID];
	var sessionID = req.query[KEY_SESSION_ID];
	var projectID = req.query[KEY_PROJECT_ID];
	var sceneID = req.query[KEY_SCENE_ID];
	// var polygonCount = req.query[KEY_POLYGON_COUNT];

	// need image dat a?
	res.json({
		KEY_RETURN_RESULT:VALUE_FAILURE,
	});
});

// GET SCENE - SNAPSHOTS


// GET PROJECT STATUS ?
// async operations


/*
how to do project permissions:
project:
	list of userids & permissions
	encryption should be based on the single project then

*/



// app.get('/user/:userid/', function (req, res) {
// 	userid = req.params["userid"];
// 	res.send("userid: "+userid);
// });

/*

==PROJECT SPECIFIC: assumed included: userid, session, projectid
	- get status
		<= ...
		=> pending operations / progress



	- CRUD novel views
		<= ...
		=> ...
	- CRUD novel images
		<= ...
		=> ...



*/



// // GET method route
// app.get('/', function (req, res) {
//   res.send('GET request to the homepage')
// })

// // POST method route
// app.post('/', function (req, res) {
//   res.send('POST request to the homepage')
// })







var readyHandler = function(){
	console.log('server running at http://'+host+':'+port+'/');
	console.log('running');
}
console.log('start');
app.listen( app.get('port'), readyHandler );


console.log('out');

/*


database/model-class
	- USER
		- id
		- created_timestamp
		- password_hash
		- encryption_key
		-
		- ...
	- SESSION
		- id
		- created_timestamp
		- hash
		- user_id
	- PROJECT
		- id
		- user_id
		- location
	- FILE
		- id
		- hashing / sha / encryption info
		- location


file-storage-class
	- USER
	- FOLDER LOCATION [bucket / storage]
	-

service API
	- LOGIN
	-
	-


*/
