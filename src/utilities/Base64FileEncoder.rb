#!/usr/bin/ruby
# Base64FileEncoder
require "./ByteData.rb"

def FileToBase64(file_name)
	@@BASE64TABLE = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","a","b","c","d",
	"e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","0","1","2","3","4","5","6","7","8","9","+","/"]
	# # byte data
	# bd = ByteData.new
	# bd.set_write_head(0)

	# determine what file type
	file = File.open(file_name,"rb")
	file_type = ""
	prefix_arr = []
	uint = file.getc
	i = 20
	while (uint!=nil && i>0) do
		#puts "#{uint} - #{uint.chr}"
		prefix_arr.push(uint)
		uint = file.getc
		i = i-1
	end
	file.close()

	# PNG - ?PNG
	if prefix_arr.length>3 && ("PNG" == "#{prefix_arr[1].chr}#{prefix_arr[2].chr}#{prefix_arr[3].chr}")
		file_type = "image/png"
	# GIF - GIF89
	elsif prefix_arr.length>2 && ("GIF" == "#{prefix_arr[0].chr}#{prefix_arr[1].chr}#{prefix_arr[2].chr}")
		file_type = "image/gif"
	# JPG - FFD8
	elsif prefix_arr.length>2 && (prefix_arr[0]==255 && prefix_arr[1]==216)
		file_type = "image/jpeg"
	# TTF - 01000 - GUESSING
	elsif prefix_arr.length>2 && (prefix_arr[0]==0 && prefix_arr[1]==1 && prefix_arr[2]==0 && prefix_arr[3]==0 && prefix_arr[4]==0)
		file_type = "font/ttf;charset=utf-8"
	# OTF - OTTO - GUESSING
	elsif prefix_arr.length>3 && ("OTTO" == "#{prefix_arr[0].chr}#{prefix_arr[1].chr}#{prefix_arr[2].chr}#{prefix_arr[3].chr}")
		file_type = "font/otf;charset=utf-8"
	# UNKNOWN
	else
		puts "unknown file type"
		file_type = ""
	end

	# end prefix
	prefix = "data:#{file_type};base64,"

	# get base64 encoding
	buffer = 0
	byte = 0
	offset = 0
	datas = []
	file = File.open(file_name,"rb")
	uint = file.getc
	while uint != nil do
		intVal = 0
		uint.each_byte do |c| # bullshit
			intVal = c
		end
		buffer <<= 8 # room for next byte
		buffer = buffer & 0xFFFF
		buffer = buffer | intVal
		if offset==0
			num = (buffer>>2) & 0x3F
			offset = 2
		elsif offset==2
			num = (buffer>>4) & 0x3F
			offset = 4
		elsif offset==4
			num = (buffer>>6) & 0x3F
			datas.push @@BASE64TABLE[num]
			num = (buffer>>0) & 0x3F
			buffer = 0 # buffer >>= 6
			offset = 0
		end
		datas.push @@BASE64TABLE[num]
		byte += 1
		# bd.write_uint8(intVal)
		uint = file.getc
	end
	file.close()
	# remainder
	if offset==0
		# N/A
	elsif offset==2
		num = (buffer<<4) & 0x3F
		datas.push @@BASE64TABLE[num]
		datas.push "=="
	elsif offset==4
		num = (buffer<<2) & 0x3F
		datas.push @@BASE64TABLE[num]
		datas.push "="
	end
	datas = datas.join()
	return "#{prefix}#{datas}"
	# return "#{prefix}#{bd.to_s_base_64_encoded}"
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





