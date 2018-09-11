// server.js
// 
var express = require('express');
var mongoose = require('mongoose');
	var mongodb = require('mongodb');
var googleStorage = require('@google-cloud/storage');

// var fs = require('fs');

var crypto = require('crypto');
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




var app = express();
// process.env.PORT || 3000
// app.set('port', 8081);
app.set('port', port);


app.get('/', function (req, res) {
  res.send('hello world')
})



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


