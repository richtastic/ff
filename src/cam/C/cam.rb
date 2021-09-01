#!/usr/bin/ruby
# cam.rb

# ruby /dev/video
# http://stackoverflow.com/questions/3474586/making-sense-of-dev-video-ouput
# http://www.wedesoft.de/hornetseye-api/file.Camera.html
puts "cam"

# ls /dev/video -> look for a video input

videoFileName = "/dev/video0"
videoFile = File.open(videoFileName,"rb")
dat = videoFile.getc
puts dat
videoFile.close()
















