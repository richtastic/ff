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
	"requestID":"...",
	// other params
}
```

#### response data format:

```
{
	"result":"success", // string: success | failure
	"requestID":"...", // user-defined or generated nonce
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
	"modified": "..." // TIMESTAMP ?
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
	"modified": "..." // TIMESTAMP ?
	"base64": "..." // base64 encoded binary image data
}
```


-all http status codes are 200
-all data is json


### client

curl http://192.168.0.188:8000/





### TODO

- faster image taking
- video feed




















### /dev/video

ls -lah /dev/video**

v4l2-ctl --device=/dev/video0 --all

ffmpeg -i /dev/video0 video0.jpg

cat /sys/class/video4linux/video0/name

v4l2-ctl --list-devices

v4l2-ctl -D -d /dev/video1

v4l2-ctl --list-formats-ext -d /dev/video2
ffmpeg -f v4l2 -list_formats all -i  /dev/video0

v4l2-ctl --device /dev/video0 --all


udevadm info --name=/dev/video0



lsusb



Bus 001 Device 004: ID 1903:8328  
Bus 001 Device 003: ID 045e:07b2 Microsoft Corp. 2.4GHz Transceiver v8.0 used by mouse Wireless Desktop 900
Bus 001 Device 002: ID 05e3:0610 Genesys Logic, Inc. 4-port hub
Bus 001 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub








bcm2835-codec-decode (platform:bcm2835-codec):
	/dev/video10
	/dev/video11
	/dev/video12

bcm2835-isp (platform:bcm2835-isp):
	/dev/video13
	/dev/video14
	/dev/video15
	/dev/video16

HD camera : HD camera  (usb-20980000.usb-1.2):
	/dev/video0
	/dev/video1




Driver Info
	Device Caps
		Video Capture

YES: 0x04200001
NO:  0x04A00000

V4L2_CAP_VIDEO_CAPTURE = 0x00000001 # bit 1
V4L2_CAP_META_CAPTURE = 0x00800000 # bit 23



cat /sys/class/video4linux/video0/name
HD camera : HD camera 

cat /sys/class/video4linux/video0/device/input/input28/id/product
8328

cat /sys/class/video4linux/video0/device/input/input28/id/vendor
1903



	Bus info         : platform:bcm2835-isp
	Bus info         : usb-20980000.usb-1.2




### recording


ffprobe  /dev/video0

ffprobe -v error -show_entries stream=width,height /dev/video0

v4l2-ctl -d /dev/video2 --list-formats-ext
...
		Size: Discrete 640x480




streamer -f jpeg -o test.jpeg
ffmpeg -i /dev/video0 -s 640x480 out.jpg
ffmpeg -y -i /dev/video0 out.jpg

ffmpeg -v error -y  -i /dev/video0   video0.jpg
ffmpeg   -v error -y  -i /dev/video0  video0.jpg




1920x1080


not work:
fswebcam --save webcam.jpg --no-banner --no-overlay --no-info --device /dev/video0 --verbose


TRY:

streamer -c /dev/video0 -f jpeg -F stereo -o myvideo.avi -t 0:05



...