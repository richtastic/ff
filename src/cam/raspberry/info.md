# camera on raspberry pi



### install nodejs


sudo apt-get update
sudo apt-get upgrade


sudo apt install nodejs
sudo apt install npm


... problems:
sudo apt update --fix-missing 

https://askubuntu.com/questions/416930/how-do-i-solve-unable-to-fetch-some-archives-maybe-run-apt-get-update-or-try-w

... other ?


node --version
uname -m
https://nodejs.org/en/download/



### run nodejs


https://www.digitalocean.com/community/tutorials/how-to-create-a-web-server-in-node-js-with-the-http-module


https://expressjs.com/en/starter/hello-world.html

npm init







### camera capture from device


npm install --save opencv4nodejs
sudo apt-get install cmake




npm install camera-capture puppeteer

npm install webcam-easy



https://www.npmjs.com/package/camera-capture




streamer -f jpeg -o image.jpeg
https://tldp.org/HOWTO/Webcam-HOWTO/framegrabbers.html

fswebcam -r 640x480 --jpeg 85 -D 1 web-cam-shot.jpg


ffmpeg -f video4linux2 -s 640x480 -i /dev/video0 -ss 0:0:2 -frames 1 /tmp/out.jpg

uvccapture -m
http://manpages.ubuntu.com/manpages/impish/en/man1/uvccapture.1.html


mplayer

vlc



MANUAL



https://askubuntu.com/questions/348838/how-to-check-available-webcams-from-the-command-line
ls -ltrh /dev/video*

To list all devices attached to USB use lsusb ; to list all devices attached to PCI use lspci




### execute commands in shell

https://stackoverflow.com/questions/20643470/execute-a-command-line-binary-with-node-js
const util = require('util');
const exec = util.promisify(require('child_process').exec);
async function ls() {
  const { stdout, stderr } = await exec('ls');
  console.log('stdout:', stdout);
  console.log('stderr:', stderr);
}
ls();



### accept requests for image



.......








### encryption















file browser: pcmanfm







---

https://stackoverflow.com/questions/52632150/show-webcam-feed-capture-images-and-save-them-locally-in-node-js


https://www.npmjs.com/package/camera-capture


https://tldp.org/HOWTO/Webcam-HOWTO/framegrabbers.html




everything:

http://www.netinstructions.com/automating-picture-capture-using-webcams-on-linuxubuntu/

https://help.ubuntu.com/community/Webcam






### video / image streaming:


video streaming
	VLC
	https://www.xmodulo.com/live-stream-video-webcam-linux.html

	http://www.vslcreations.com/2017/10/how-to-capture-ip-camera-http-stream.html
	https://askubuntu.com/questions/881305/is-there-any-way-ffmpeg-send-video-to-dev-video0-on-ubuntu

	PIPING
	https://unix.stackexchange.com/questions/2302/can-i-pipe-dev-video-over-ssh



### FASTER IMAGE TAKING

https://stackoverflow.com/questions/40336363/fastest-way-to-capture-from-webcams-linux

https://raspberrypi.stackexchange.com/questions/23953/webcam-capture-into-mp4-or-mov-ffmpeg-is-very-slow-at-this


sudo streamer -q -c /dev/video0 -s 640x480 -f jpeg -t 60 -r 12 -j 75 -w 0 -o /mnt/ramdisk/tmp.avi





### NEXT STEPS



- design some desired ideal system

- design some first iteration of the system

- 


MVP:
	- raspberry service that:
		- /camera/0/image - returns current image
		x /camera/0/update - takes new picture & becomes current image & returns current image
	- FASTER METHOD TO GET IMAGES
		- call shell
	- MORE COMPRESSED IMAGES
		- https://www.tecmint.com/optimize-and-compress-jpeg-or-png-batch-images-linux-commandline/
		- https://linuxhint.com/image-compression-apps-linux/
		- lossless:
			- jpegoptim [10%]
		- lossy 
			- convert
	- raspberry automated process that:
		- repeatidly uploads image data to internet service host
	- inernet service that:
		- /image/upload/ - accepts image data & saves it on server & overwrites existing
		- /image/download/
	- roku app that:
		- retrieves image from internet service
		- displays image on screen & max size

internet service:
	- PHP
		- http://whatever/?path=percent/encoded/path
		- have to use file (or DB) for cross-request persistent data



BEST:
	- placement of raspberry
		- mounted in safe / secure housing
		- using battery for 7+ days at a time OR permanently plugged in to power
	- rasberry services:
		- /camera/0/video - some sort of live video feed [HLS, ..., TCP/constantly open ?]
		- /camera/0/image - current most recent (live) image
		- /camera/0/update - retake & return most recent
		- /power/off - turn device off
		- /power/low - turn off all processing except /power/on response
		- /power/on - return to full services
		- /... ?
	- client app (webpage):
		- input:
			- service endpoint url base
			- secret key








- /camera/0/image
	- REQUEST:
		{
			"clientID":"ABC...", // client UID
			"clientKey":"ABC...", // client encryption key
			"requestID":"ABC...", // user-defined nonce
		}
	- RESPONSE:
		{
			"requestID":"...", // value from original request
			"image":"...", // base64 encoded image data
		}



- websocket
















ad-hoc video format ....
	- array of images
	- would have to store data in perpetuity
	- if single client:
		- constant updating of image & sending (socket / continuous connection)
	- supporting multiple clients:
		- keep last ~ 1 - 10 'seconds' of images
		- each client keep track of current index & grab next
		- just grab most recent (modulo ###)
			- need to keep a 'window' of minimum & maximum
	- 




















