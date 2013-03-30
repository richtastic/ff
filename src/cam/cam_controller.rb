#!/usr/bin/ruby
# cam_controller.rb
# http://stackoverflow.com/questions/3474586/making-sense-of-dev-video-ouput
# http://www.wedesoft.de/hornetseye-api/file.Camera.html
require "optparse"
require 'fcntl'
require 'coderuby'


# pipeName = "pipe_test"
# createPipeComm( pipeName )

# pipeWrite = openPipeComm( pipeName )
# pipeRead = openPipeComm( pipeName )

# writePipeComm( pipeWrite, "datum\n" )
# puts readPipeComm( pipeRead )

# closePipeComm( pipeWrite )
# closePipeComm( pipeRead )

# deletePipeComm( pipeName )

# exit(1)


# --------------------------------------------------------- definitions
INPUT_COMMAND_QUIT = "q"
is_child = false
is_parent = false
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
inPipeHandle = nil
outPipeHandle = nil
def start_video_program(program, video, out_image, width, height, in_pipe, out_pipe)
	if File.exist?(in_pipe)
		cmd = "rm #{in_pipe}"
		%x[ #{cmd} ]
	end
	if File.exist?(out_pipe)
		cmd = "rm #{out_pipe}"
		%x[ #{cmd} ]
	end
	# --------------------------------------------------------- separate child-cam & parent-controller
	pid = Process.fork
	if pid.nil? then # child
		puts "CHILD"
		is_child = true; is_parent = false
	else # parent
		is_child = false; is_parent = true
		#Process.detach(pid) # this stops it
		puts "PARENT"
	end
	if is_parent
		# 
	elsif is_child
		sleep(0.50)
		cmd = "#{program} #{video} #{out_image} #{width} #{height} < #{in_pipe} > #{out_pipe} 2>/dev/null " # 2>/dev/null
		puts cmd
		%x[ #{cmd} ]
		exit(0)
	end
	
	# pid = Process.fork
	# if pid.nil? then # child
	# 	puts "CHILD"
	# 	is_child = true; is_parent = false
	# else # parent
	# 	is_child = false; is_parent = true
	# 	Process.detach(pid)
	# 	puts "PARENT"
	# end
	# if is_parent
	# 	# 
	# elsif is_child
	# 	sleep(0.50)
	# 	cmd = "#{program} #{video} #{out_image} #{width} #{height} < #{in_pipe} > #{out_pipe} 2>/dev/null"
	# 	puts cmd
	# 	%x[ #{cmd} ]
	# 	exit(0)
	# end
end
# --------------------------------------------------------- find first /dev/video input
firstDevice = %x[ ls /dev | grep -iro "video[0-9]*" | sed -r s/^/\\\\/dev\\\\//g ]
firstDevice = firstDevice.split("\n")
firstDevice = firstDevice[0]
# --------------------------------------------------------- input arguments
options = {}
options[:autopilot] = true
options[:program] = "./camtoimage"
options[:width] = 640
options[:height] = 480
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
# --------------------------------------------------------- output program parameters
options.each do |key,val|
	puts "#{key} : #{val}"
end
# --------------------------------------------------------- check start
if options[:device]==nil
	puts "no input device specified"
	exit(1)
end
# --------------------------------------------------------- start

instr = GetStringUserInputNonBlock().gsub("\n","")

start_video_program(options[:program], options[:device], options[:output_ppm], options[:width], options[:height], options[:pipe_in], options[:pipe_out])
createPipeComm( options[:pipe_in] )
createPipeComm( options[:pipe_out] )
inPipeHandle = openPipeComm( options[:pipe_in] )
puts "IN PIPE HANDLE: "
puts inPipeHandle
outPipeHandle = openPipeComm( options[:pipe_out] )
puts "OUT PIPE HANDLE: "
puts inPipeHandle
# --------------------------------------------------------- wait for sign of life
result = ""
while result==""
	result = readPipeComm( outPipeHandle ).gsub(/\n/,"")
	sleep(0.5)
end
puts "LIFE '#{result}'"
# --------------------------------------------------------- input loop
jpg_dir_list = ""
result = nil
clear_interval = 5
i = 0
continue_loop = true
while(continue_loop)
# --------------------------------------------------------- pace to input rate
	sleep(0.10) #sleep(1/options[:rate])
# --------------------------------------------------------- ask to take a picture
	puts "writing to in pipe"
	writePipeComm( inPipeHandle, "s")
	puts "done"
# --------------------------------------------------------- wait for picture complete
	result = ""
	count = 0
	puts "reading from pipe"
	while result=="" && count<10
		result = readPipeComm( outPipeHandle ) #.gsub(/\n/,"")
		if result=="q" || result=="Q"
			puts "QUIT"
			continue_loop = false
		elsif result=="s" || result=="S"
			puts "SAVE"
			break;
		elsif result !=""
			puts "'#{result}'"
		end
		sleep(0.10)
		puts "RECHECK"
		count = count + 1
	end
	puts "done"
# --------------------------------------------------------- convert from ppm to png
	t = Time.now.to_f
	out_seconds = t.floor
	out_micro = (1000000*(t%1)).floor
	out_name = "#{options[:output_dir]}#{out_seconds}_#{out_micro}#{options[:output_jpg]}";
	convert_image(options[:output_ppm], out_name, options[:output_quality])
# --------------------------------------------------------- delete ppm
	cmd = "rm #{options[:output_ppm]}"
	%x[ #{cmd} ]
# --------------------------------------------------------- save info to json file
	save_info_to_json(options[:output_json], out_name, nil, nil)
# --------------------------------------------------------- remove older image files
	if i>clear_interval
		i = 0
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
# --------------------------------------------------------- user input
	if options[:autopilot]
		puts "forever"
	else
		instr = GetStringUserInputNonBlock().gsub("\n","")
		if instr!=""
			STDOUT.puts "input: '#{instr}'"
			STDOUT.flush
			if instr== INPUT_COMMAND_QUIT
				writePipeComm( inPipeHandle, "q")
				continue_loop = false
			end
		end
	end
end
puts "EXIT"
# --------------------------------------------------------- stop
puts "wait for q or Q on out_pipe"
result = ""
while result==""
	result = readPipeComm( outPipeHandle ).gsub(/\n/,"")
	sleep(0.5)
end
puts "got #{result} on out_pipe"
sleep(0.10)
closePipeComm( inPipeHandle )
closePipeComm( outPipeHandle )
deletePipeComm( options[:pipe_in] )
deletePipeComm( options[:pipe_out] )
#stop_video_program(options[:pipe_in], options[:pipe_out], inPipeHandle, outPipeHandle)













# ./cam_controller.rb < /dev/null 1&> /dev/null &
# [1] 14140
# alice@wonderland cam :) $ disown 14140
# ps aux | egrep cam | awk '{print $2}' 



