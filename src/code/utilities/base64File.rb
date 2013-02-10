#!/usr/bin/ruby
# base64File
require "ByteData.rb"

# http://jimneath.org/2010/01/04/cryptic-ruby-global-variables-and-their-meanings.html
puts "#{$0} #{$*}"


puts "BEFORE----------------------------------------------"

bd = ByteData.new
bd.set_write_head(0)
bd.write_bit(0)
bd.write_bit(1)
bd.write_bit(0)
bd.write_bit(1)
bd.write_bit(0)
bd.write_bit(1)
bd.write_bit(0)
bd.write_bit(1)
# ---------------
bd.write_uint8(125)
# ---------------
bd.write_bit(1)
bd.write_bit(0)
bd.write_bit(1)
bd.write_bit(1)
bd.write_bit(0)

puts bd.to_s
puts bd.to_s(2)
puts bd.to_s(16)


# ander = 1 << 128
# i = 0
# while i<257
# 	puts ander
# 	ander <<= 1
# 	i = i + 1
# end

#puts 1<<512
puts "HUh?"
puts ((0.size * 8))






puts "AFTER----------------------------------------------"
exit(0)
# ----------------------------------------------------

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





