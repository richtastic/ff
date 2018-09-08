// server.js
// 
// var express = require('express');


// config file # permanent
// settings file # variable

// log file location
var port = 8080; // GAE port
var host = "0.0.0.0"; // GAE host

//var port = 8081; // localhost
//var host = "127.0.0.1"; // localhost


var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(port, host);
console.log('Server running at http://'+host+':'+port+'/');














