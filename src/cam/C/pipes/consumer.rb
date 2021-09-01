#!/usr/bin/ruby
# consumer.rb
require '../coderuby'
puts ARGV.length
if !ARGV || ARGV.length<1
	puts "$0 pipeName"
	exit(1)
end

readFileName = ARGV[0]
readFileHandle = nil
puts "consumer - #{readFileName}"

readFileHandle = openPipeComm(readFileName)
data = " "
while data != ""
	i = 10000 # tries to get data
	while i>=0
		data = readPipeComm(readFileHandle)
		if data!= ""
			puts "read ... #{data}"
			break
		end
		i = i - 1
		r = rand()*0.10
		sleep(0.10+r)
	end
end
closePipeComm(readFileHandle)


# ./camtoimage /dev/video0 image.ppm 320 240 < pipes/pipeA > pipes/pipeB
# ./consumer pipeB

