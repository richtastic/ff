#!/usr/bin/ruby
# cam_controller.rb
# ruby /dev/video
# http://stackoverflow.com/questions/3474586/making-sense-of-dev-video-ouput
# http://www.wedesoft.de/hornetseye-api/file.Camera.html
require "optparse"
require 'fcntl'
STDIN.fcntl(Fcntl::F_SETFL,Fcntl::O_NONBLOCK)
# Dir["/path/to/directory/*.rb"].each {|file| require file }

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
# 		S..TDOUT.puts "#{i}"
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
def save_info_to_json(filename, out_image, out_seconds, out_micro)
	if out_seconds==nil || out_micro==nil
		t = Time.now.to_f
		out_seconds = t.floor
		out_micro = (1000000*(t%1)).floor
	end
	jsonData = "{\n\t\"currentImage\": \"#{out_image}\",\n\t\"currentTimeSeconds\": \"#{out_seconds}\",\n\t\"currentTimeMicro\": \"#{out_micro}\"\n}"
	file = File.open(filename,'w')
	file.write(jsonData)
	file.flush()
	file.close()
end
def convert_image(imgA,imgB,quality)
	quality = "#{(quality*100).floor}%"
	com = "convert #{imgA} -quality #{quality} #{imgB}"
	%x[ #{com} ]
end
def start_video_program(program, video, out_image, width, height, in_pipe, out_pipe)
	if !File.exist?(in_pipe)
		cmd = "touch #{in_pipe}"
		%x[ #{cmd} ]
	end
	if !File.exist?(out_pipe)
		cmd = "touch #{out_pipe}"
		%x[ #{cmd} ]
	end
	cmd = "#{program} #{video} #{out_image} #{width} #{height} < #{in_pipe} 1> #{out_pipe} 2>/dev/null &"
	puts cmd
	%x[ #{cmd} ]
end
def stop_video_program(in_pipe, out_pipe)
	puts "output q to in_pipe"
	puts "wait for q or Q on out_pipt"
	return;
	if File.exist?(in_pipe)
		cmd = "rm #{in_pipe}"
		%x[ #{cmd} ]
	end
	if File.exist?(out_pipe)
		cmd = "rm #{out_pipe}"
		%x[ #{cmd} ]
	end
end
# --------------------------------------------------------- find first /dev/video input
firstDevice = %x[ ls /dev | grep -iro "video[0-9]*" | sed -r s/^/\\\\/dev\\\\//g ]
firstDevice = firstDevice.split("\n")
firstDevice = firstDevice[0]
# --------------------------------------------------------- input arguments
options = {}
options[:program] = "./camtoimage"
options[:width] = 320
options[:height] = 480 #240
options[:device] = firstDevice
options[:rate] = 5.0
options[:output_ppm] = "image.ppm"
options[:output_quality] = 0.80
options[:output_dir] = "./images/"
options[:output_jpg] = "image.jpg"
options[:output_json] = "image.json"
options[:pipe_in] = "pipe_in"
options[:pipe_out] = "pipe_out"
options[:quit] = "q"
optparse = OptionParser.new do |opts|
	opts.banner = "\nUsage: #{$0} [options]\n\n"
	# -d
	opts.on("-d ","--device ","\n\tinput device, eg: /dev/video1\n") do |val|
		options[:device] = val
	end
	# -s
	opts.on("-s ","--size ","\n\tresolution size, eg: 640,480\n") do |val|
		puts val
		options[:width] = val
		options[:height] = val
	end
	# -r
	opts.on("-r ","--rate ","\n\timages per second (max), eg: 3.5\n") do |val|
		options[:rate] = val.to_f
	end
	opts.on("-h","--help","\n\tPattern string of directory to check artifact timestamp against\n") do 
		puts opts
	end
end
begin
	optparse.parse!
rescue Exception=>e # no options
	#puts "\t#{e}\n\texiting...\n"
	#exit(1)
end

options.each do |key,val|
	puts "#{key} : #{val}"
end


# --------------------------------------------------------- check start
if options[:device]==nil
	puts "no input device specified"
	exit(1)
end

# --------------------------------------------------------- start
start_video_program(options[:program], options[:device], options[:output_ppm], options[:width], options[:height], options[:pipe_in], options[:pipe_out])
# --------------------------------------------------------- input loop
jpg_dir_list = ""
clear_interval = 3
i = 0
while(1)
	sleep(0.5);#sleep(1/options[:rate])
	#instr = STDIN.getc.to_s # gets.chomp # instr = STDIN.getc #instr = "w" #instr = gets
	#STDOUT.puts "'#{instr}'"
	STDOUT.print "...\n"
	STDOUT.flush
	cmd = "echo \"s\" >> #{options[:pipe_in]}"
	%x[ #{cmd} ]
#	puts "wait for s/S/Q/q on pipe_out"
		sleep(0.15)
# --------------------------------------------------------- convert from ppm to png
t = Time.now.to_f
out_seconds = t.floor
out_micro = (1000000*(t%1)).floor
out_name = "#{options[:output_dir]}#{out_seconds}_#{out_micro}#{options[:output_jpg]}";
convert_image(options[:output_ppm], out_name, options[:output_quality])
# --------------------------------------------------------- remove ppm
cmd = "rm #{options[:output_ppm]}"
%x[ #{cmd} ]
# --------------------------------------------------------- save to info json file
save_info_to_json(options[:output_json], out_name, nil, nil)
# --------------------------------------------------------- check for quit
	# if instr == "q"
	# 	cmd = "echo \"q\" >> #{options[:pipe_in]}"
	# 	%x[ #{cmd} ]
	# 	break;
	# end
	if i>clear_interval
		i = 0
		#cmd = "rm #{options[:output_dir]}*.jpg"
		jpg_dir_list.each do |img|
			cmd = "rm #{options[:output_dir]}/#{img}"
			puts %x[ #{cmd} ]
		end
		cmd = "ls #{options[:output_dir]}"
		jpg_dir_list = %x[ #{cmd} ]
		jpg_dir_list.split("\n");
		puts "DIR LIST: #{jpg_dir_list}"
	end
	i = i + 1
end
puts "EXIT"
sleep(0.5)

# --------------------------------------------------------- stop
stop_video_program(options[:pipe_in], options[:pipe_out])
















