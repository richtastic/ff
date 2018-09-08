# nodejs server README


#### install nodejs
```
brew install node
sudo  npm i -g npm  # update node packet manager
```




#### run server
```
cd .../nodejs
node server.js
````


#### help

```
npm search
npm search express
npm install express

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
https://YOUR_PROJECT_ID.appspot.com:
https://nodejs01-215801.appspot.com:
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



