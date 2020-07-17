
# nodejs server README


#### install nodejs
```
brew install node
sudo  npm i -g npm  # update node packet manager
```


#### install mongo
```
brew update
brew tap mongodb/brew
brew install mongodb-community
# brew install mongodb-community@4.2
# brew install mongodb - OLD
#  sudo mkdir -p /data/db
#  sudo chown -R `id -un` /data/db
sudo mkdir -p /Users/<user>/data/db
sudo chown -R `id -un` /Users/<user>/data/db
# start
# shell A:
sudo mongod --dbpath=/Users/user/data/db
mongod
# shell B
mongo --host 127.0.0.1:27017

# ex:
show dbs # all DB
db # current DB
use nodejsdb # select / create DB

db.getCollectionNames() # show collections
db["models"].find()

# create user
db.createUser(
	{
		user: "nodejsuser",
		pwd: "qwerty",
		roles: []
	}
);

# insert
db.movie.insert({"name":"tutorials point"})
# search
db.movie.find()
db.movie.find({"name":"tutorials point"})
# delete



mongo --port 27017 -u nodejsuser -p 'qwerty' --authenticationDatabase 'admin'

mongo --port 27017 -u myUserAdmin -p 'abc123' --authenticationDatabase 'admin'

nodejsdb

```


#### run server locally
```
cd .../nodejs
node server.js
# http://127.0.0.1:8081/
````


#### help

```
npm search
npm search express
npm install express
npm install mongoose
npm install mongodb
npm install crypto


sudo npm install crypto mongoose mongodb express ejs

npm install --save @google-cloud/storage
npm install --save fast-crc32c
```


### Google App Engine (GAE)

#### GAE Setup
```
- create new project => record project ID [can take a while to create]
	nodejs01-215801

- basic app.yaml file

- create basic package.json file
```


#### GAE Deploying


setup:
```
# change user:
gcloud auth list
gcloud config set account <ACCOUNT>
# because google breaks:
gcloud auth application-default login
```

init:
```
# init project:
gcloud init
gcloud config
```

deploy
```
# deploy project
gcloud app deploy app.development.yaml
```


view:
```
gcloud app browse
https://YOUR_PROJECT_ID.appspot.com
https://nodejs01-215801.appspot.com
```


logs:
```
gcloud app logs tail -s default
```


#### links
BILLING:
https://console.cloud.google.com/billing
PROJECT/DASHBOARD:
https://console.cloud.google.com/appengine
PROJECT LIST:
https://console.cloud.google.com/iam-admin/projects
	SETTINGS > SHUTDOWN
		> LIEN
https://console.cloud.google.com/iam-admin/iam/project?project=agafas-85016


GLOUD STORAGE:
https://console.cloud.google.com/storage/browser
https://github.com/googleapis/nodejs-storage/blob/master/samples/encryption.js






https://console.dialogflow.com/api-client


GAE PROJECTS PAGE - DELETE:
https://console.cloud.google.com/cloud-resource-manager?_ga=2.52150575.-784592155.1539794025

The project has a lien against it.

Tracking Number: 5012888763351835771



gcloud alpha resource-manager liens list


GAE DASHBOARD:
https://console.cloud.google.com/home/dashboard







GAE - app.yaml:
https://cloud.google.com/appengine/docs/flexible/nodejs/configuring-your-app-with-app-yaml
https://cloud.google.com/appengine/docs/flexible/nodejs/runtime


NODE - package.json:
https://docs.npmjs.com/files/package.json
https://docs.nodejitsu.com/articles/getting-started/npm/what-is-the-file-package-json/


GAE - Node:
https://cloud.google.com/nodejs/?refresh=1
https://cloud.google.com/nodejs/getting-started/hello-world
https://cloud.google.com/appengine/docs/flexible/custom-runtimes/build


git ignore:
https://github.com/github/gitignore/blob/master/Node.gitignore




gcloud --help




### PATHS / OPERATIONS / SUCH:


- how to 'connect' temporary user w/ logged-in user?
	on login success: 'you have a local user account, would you like to connect it to the logged-in account?'
		=> substitute all userid's on projects
- how to share projects / scenes: publicly & specifically
	=> scene sharing settings
		=> search for user by email/alias ?


USER
	- id [int]
	- userid [128-character hash]
	- email <value = permanent> | else: <interim = device only>
	- alias [string]
	- encryption_seed
	- encryption_hash = sha256(encryption_seed,password)
	- settings = {} -- would like to be searchable?
	- created [timestamp]
	- modified [timestamp]

USER_SESSION
	- id [int]
	- sessionid [128-character hash]
	- userid -> map
	- created [timestamp]

PROJECT
	- id [int]
	- userid -> map <creator> <only person who can delete>
	- projectid [128-character hash]
	- encryption_key [256]
	- encryption_seed [256]
	- processes

SCENE
	- id [int]
	- sceneid [128-character hash]
	- projectid -> map
	- permissions
		- userid : level {read=4, write=2, execute=1 ?}
		- public / all ?

PROCESS
	- id [int]
	- processid [128-character hash]
	- projectid -> map
	- operation [?]

PERMISSIONS (mapping) -- user has some permission on project
	- id
	- type <scene / project / ...>
	- sceneid -> map
	- userid -> map
	- settings {} <object?>

OPS:
- create new user
	<= email, password
	=> userid
- create user session
	<= userid, password
	=> sessionid
- get list of projects
	<= userid, session, offset, count
	=> [project list]
- create new project
	<= userid, session
	=> {project contents}


==PROJECT SPECIFIC: assumed included: userid, session, projectid
	- get summary
		<= ...
		=> info
	- get status
		<= ...
		=> pending operations / progress
	- add camera
		<= image data
		=>
	- add view
		<= image data
		=>
	- get image
		<= id, desired w/h
		=>
	- get 3DR
		<= desired poly count
		=> tris / maps
	- CRUD novel views
		<= ...
		=> ...
	- CRUD novel images
		<= ...
		=> ...



INTERNAL OPS:
	- consistency check project (remove unnecessary files)
	- encryption / decryption of a file
	-

SECURITY:
	- encryption:
		- every file is encrypted using 256 hash key from project + static random 256 header seed
		- files are decrypted ON CLIENT? ON SERVER BEFORE SENT OUT ?
		TO: => user adds image file to UI => file is encrypted [secret keychain, random hash] => file is sent to server => server passes file to storage location ...
		FR: => user requests operation (eg feature points) => server requests file from storage => server decrypts file in memory to process => ... => server encrypts any files created => storage

		[CLIENT] -> ENCRYPTED IMAGES -> [SERVER] -> ENCRYPTED IMAGES -> [STORAGE]
		[CLIENT] -> REQUEST OPERATION -> [SERVER] -> ENCRYPTED DATA -> [STORAGE]
		[CLIENT] -> REQUEST DATA -> [SERVER] -> REQUEST DATA -> [STORAGE] -> ENCRYPTED DATA -> [SERVER] -> ENCRYPTED DATA -> [CLIENT]


expressjs
socketio
meteorjs



mongodb
	- tables & brief




alias | monicker | nickname | handle |

...
