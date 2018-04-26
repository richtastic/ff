/*
cd .../
node test.js
http://localhost:8080
*/
var http = require('http'); // http services
var url = require('url'); // url parsing
var fs = require('fs'); // filetystem
var events = require('events'); // events
var formidable = require('formidable'); // file uploads
var nodemailer = require('nodemailer'); // emails
var mysql = require('mysql'); // sql
var mongo = require('mongodb'); // mongo
// others: https://www.w3schools.com/nodejs/ref_modules.asp
var mymodule = require('./myModule');

http.createServer(function (req, res) {
	var urlData = url.parse(req.url, true);
	var query = urlData.query;
	// query.month / query.date
// fs.appendFile()
// fs.open()
// fs.writeFile()
// fs.appendFile()
// fs.unlink()
// fs.rename()
	// fs.readFile('demofile1.html', , function(err, data) { ... });


// built in events
	var eventEmitter = new events.EventEmitter();
	var myEventHandler = function () {
	  console.log('I hear a scream!');
	}

	eventEmitter.on('scream', myEventHandler);

	eventEmitter.emit('scream');



    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write("request url: " + req);
    res.write("The date and time are currently: " + mymodule.myDateTime());
    res.end();
}).listen(8080);

/*

 npm install upper-case
 # var uc = require('upper-case');

 npm install mongodb

*/

