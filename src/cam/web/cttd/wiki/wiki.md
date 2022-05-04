
# CTTD



# website urls


+++


# services


+++

## registry (cameras)

endpoint:

`/registry/`


data is passed as a AES256 binary payload on HTTP POST requests/responses

---

### PING

endpoint:

`/ping`


request:

```
{
	"op":"ping", # required: operation
	"id":"12345" # optional: client request ID
}
```

response:

```
{
	"op":"ping", # origional operation
	"id":"12345" # client request ID (if provided)
	"result":"success", # success or failure
	"reason":"in case of failure", # reason for failure
	"data": {
		# empty
	}
}
```

---


### GET LIST

endpoint:

`/list`


request:

```
{
	"op":"list", # required: operation
	"id":"12345" # optional: client request ID
	"offset":0 # optional: index to start from
	"count":10 # optional: number of entries from start to include
	"data":{ # optional: payload
		# empty
	}
}
```

response:

```
{
	"op":"list", # origional operation
	"id":"12345" # client request ID (if provided)
	"offset": 0 # 
	"count": 0 # 
	"result":"success", # success or failure
	"reason":"in case of failure", # reason for failure
	"data":{ # payload
		"list":[ # array of objects
			{
				"id": "camera_01",
				"type": "image",
				"name":"Bird Cam",
				"description":"Bird nest",
				# no image data present
			},
			# ... other items
		]
	}
}
```

---

### UPDATE/ADD ITEM

endpoint:

`/update/SOURCE_ID`

request:

```
{
	"op":"update", # required: operation
	"id":"12345" # optional: request ID
	"data":{ # payload
		"secret": "password", # required: proof of update authority - unique for each station/camera
		"id": "camera_01", # required: identify / camera access
		"type": "image", # required: type of item to process
		"name": "Camera 1", # optional: only need to send first time
		"description":"Bird Nest", # optional: only need to send first time
		"image":"image/jpeg..." # optional: base64 binary encoded image
	}
}
```

response:

```
{
	"op":"update", # origional operation
	"id":"12345", # client request ID (if provided)
	"result":"success", # success or failure
	"reason":"in case of failure", # reason for failure
	"data":{ # payload
		"details": # single item details
			{
				"id": "camera_01",
				"type": "image",
				"name":"Camera 1",
				"description":"Bird Nest ...",
				"image":"image/jpeg..." # base64 binary encoded image
			},
		]
	}
}
```


### ITEM DETAILS


request:

```
{
	"op":"details", # required: operation
	"id":"12345", # optional: request ID
	"data":{
		"id": "cam_01" # camera ID
	}
}
```

response:

```
{
	"op":"details", # original opertion
	"id":"12345", # client request ID (if provided)
	"result":"success",
	"data":{
		"id": "camera_01",
		"type": "image",
		"name":"Camera 1",
		"description":"Bird Nest ...",
		"image":"image/jpeg..." # base64 binary encoded image
	}
}
```




### REMOVE ITEM


If an item hasnt been updated in ~ 24 hours, it will be removed from the data / listings



+++





## internals


listing yaml file:
```
registry:
	list:
		- 
			id: "cam_01"
			modified: ""
			type: "image"
			name: "Camera 1"
			description: "Bird Nest"
			image: "image.jpg"


```















...