#!/usr/bin/ruby
# producer.rb
require '../coderuby'

if !ARGV || ARGV.length<1
	puts "$0 pipeName"
	exit(1)
end

writeFileName = ARGV[0]
writeFileHandle = nil
puts "producer - #{writeFileName}"

datum = ["A","B","C","D"]

#createPipeComm(writeFileName)
writeFileHandle = openPipeComm(writeFileName)
i = 1000
while i>0
	data = GetStringUserInputNonBlock()
	if data != ""
		puts "write ... #{data}"
		writePipeComm(writeFileHandle,data)
		i = i - 1
	end
	sleep(0.50)
end
closePipeComm(writeFileHandle)
#deletePipeComm(writeFileName)


# mknod pipeA p
# mknod pipeB p
# ./producer.rb pipeA