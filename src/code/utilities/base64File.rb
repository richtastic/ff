#!/usr/bin/ruby
# http://jimneath.org/2010/01/04/cryptic-ruby-global-variables-and-their-meanings.html
puts "#{$0} #{$*}"

if $*.length < 1
	puts "first argument must be file name"
	exit(1)
end

file_name = $*[0]
file = File.open(file_name,"r")

uint = file.getc
while uint != nil do
	bin =  "%08b" % uint
	puts bin
	uint = file.getc
end










# http://mentalized.net/journal/2010/03/08/5_ways_to_run_commands_from_ruby/
#pwd = %x[ pwd ]
#puts( pwd )

# open file
#file_name = "#{pwd}/test.txt"

# http://www.ruby-doc.org/core-1.9.3/File.html
# File ....

#file = IO.binread(file_name,"rb")
#file = File.open(file_name,"rb");

# m = IO.methods
# m.each do |mm|
# 	puts mm
# end

#dat = file.read.to_i





