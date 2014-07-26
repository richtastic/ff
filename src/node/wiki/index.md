# Some node.js server howto reference


## Installing
```
# mongo
sudo apt-key adv --keyserver keyserver.ubuntu.com --recv 7F0CEB10
echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | sudo tee /etc/apt/sources.list.d/10gen.list
sudo apt-get update
sudo apt-get install mongodb-10gen

# node  |  http://howtonode.org/how-to-install-nodejs
sudo apt-get install g++ curl libssl-dev apache2-utils
sudo apt-get install git-core

git clone git://github.com/ry/node.git
cd node
./configure
make
sudo make install

npm install mongojs
npm install bson


```

## usage

### setup mongo account
```
mongo
// show all existing databases
show dbs
// select a database from list
use demo_database
// show current working database
db
// show all collections in current db
show collections
// add user account for logging in
db.addUser('richie', 'qwerty');
db.auth('richie', 'qwerty');

```

### example node service with mongo  |  http://howtonode.org/node-js-and-mongodb-getting-started-with-mongojs
```
// myapp.js

// require libs
var http = require("http");
var mongojs = require("mongojs");

// connect to mongo
var collections = ["users", "reports"]
var uri = "mongodb://richie:qwerty@localhost:27017/demo_database";
var db = mongojs.connect(uri, collections);

// set up http server
var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello Node.js\n');
}).listen(8124, "127.0.0.1");
console.log('Server running at http://127.0.0.1:8124/');

// do semethings
db.users.save({email: "richien@gmail.com", password: "woottastic", sex: "male"}, function(err, saved) {
    if( err || !saved ){
        console.log("User not saved");
        console.log(err+"");
        console.log(saved+"");
    }else{
        console.log("User saved");
    }
});
```

### start server
```
# run app
node myapp.js
# point browser to: http://localhost:8124/
```


