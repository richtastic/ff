#!/usr/bin/ruby
# cam_controller.rb

# ruby /dev/video
# http://stackoverflow.com/questions/3474586/making-sense-of-dev-video-ouput
# http://www.wedesoft.de/hornetseye-api/file.Camera.html

i = 0
while (i < 5)
	sleep(1.0)
	puts i
	i = i + 1
	STDOUT.flush
end
puts "cam"
puts "ABC"
puts "q"

# ls /dev/video -> look for a video input

# videoFileName = "/dev/video0"
# videoFile = File.open(videoFileName,"rb")
# dat = videoFile.getc
# puts dat
# videoFile.close()
















