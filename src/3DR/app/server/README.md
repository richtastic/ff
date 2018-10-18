
# nodejs server README


#### install nodejs
```
brew install node
sudo  npm i -g npm  # update node packet manager
```


#### install mongo
```
brew update
brew install mongodb
sudo mkdir -p /data/db
sudo chown -R `id -un` /data/db
# start
# shell A:
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



