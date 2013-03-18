#!/usr/bin/ruby
# cam_controller.rb

# ruby /dev/video
# http://stackoverflow.com/questions/3474586/making-sense-of-dev-video-ouput
# http://www.wedesoft.de/hornetseye-api/file.Camera.html

require "optparse"


# # ./cam_controller.rb < in > out 
# while(1)
# 	sleep(1.0)
# 	instr = gets
# 	STDOUT.puts "#{instr}"
# 	STDOUT.flush
# end
# exit(1)


# if ARGV.length>0
# 	puts "b"
# 	while ARGV.length>0
# 		ARGV.pop
# 	end
# 	i = 0
# 	while(1)
# 		sleep(1.0)
# 		instr = gets
# 		STDERR.puts "INPUT A: '#{instr}' "
# 		STDERR.flush
# 		STDOUT.puts "#{i}"
# 		STDOUT.flush
# 		i = i + 1
# 	end
# else
# 	i = 99
# 	while(1)
# 		sleep(1.0)
# 		instr = gets #.chomp
# 		STDERR.puts "INPUT B: '#{instr}' "
# 		STDERR.flush
# 		STDOUT.puts "#{i}"
# 		STDOUT.flush
# 		i = i - 1
# 	end
# end
# exit(1)
# # ./cam_controller.rb a < pipe | ./cam_controller.rb >> pipe


# --------------------------------------------------------- helpers
def command(ch)
	puts ch
	STDOUT.flush
end

# * set width, height
# * set saving interval
# * 
# * 
# * 

# --------------------------------------------------------- input arguments
options = {}
options[:width] = 320
options[:height] = 240
optparse = OptionParser.new do |opts|
	opts.banner = "\nUsage: #{$0} [options]\n\n"
	# -c
	opts.on("-c ","--cam ","\n\tdescription here\n") do |val|
		options[:cam] = val
	end
	opts.on("-h","--help","\n\tPattern string of directory to check artifact timestamp against\n") do 
		puts opts
	end
end
begin
	optparse.parse!
rescue Exception=>e # no options ?
	puts "\t#{e}\n\texiting...\n"
	exit(1)
end

puts options

# --------------------------------------------------------- blank start


# --------------------------------------------------------- feedback loop
# i = 0
# while (i < 5)
# 	sleep(1.0)
# 	i = i + 1
# 	command("#{i}")
# end
# puts "cam"
# puts "ABC"
# puts "q"

# ls /dev/video -> look for a video input

# videoFileName = "/dev/video0"
# videoFile = File.open(videoFileName,"rb")
# dat = videoFile.getc
# puts dat
# videoFile.close()
















