# source server


### run
sudo nodejs index.js


### dependencies:
node-webcam


### api

#### request data format:

```
{
	"clientID":"...",
	"clientKey":"...",
	"request":"...",
	// other params
}
```

#### response data format:

```
{
	"result":"success", // string: success | failure
	"request":"...", // user-defined or generated nonce
	"data": {
		...
	}
}
```


#### /cameras/list

response:
```
{
	"cameras": [
		{
			"id":"..."
		}
	]
}
```

#### /camera/<CAMERA ID>/image

response:
```
{
	"cameraID": "..." // camera ID
	"base64": "..." // base64 encoded binary image data
}
```

#### /camera/<CAMERA ID>/update

request:
```
	"include": true, // include the image data, default: true
```

response:
```
{
	"cameraID": "..." // camera ID
	"base64": "..." // base64 encoded binary image data
}
```


-all http status codes are 200
-all data is json


### client

curl http://192.168.0.188:8000/



...