#!/usr/bin/ruby
# ByteData
class ByteData
	def initialize
		@data = []
		@readHead = 0
		@readSubIndex = 0
		@writeHead = 0
		@writeSubIndex = 0
	end
# ----------------------------------------
	def fuck
		puts "fuck"
	end
# ----------------------------------------
	def read_bit
		#
	end
	def read_uint8
		#
	end
# ----------------------------------------
	def set_write_head v=0
		if @data.length==0
			@data.push(1)
		end
	end
	def write_bit v=0
		b = 0
		if v && v>0
			b = 1
		end
		val = @data[@writeHead]
		ander = 1 << @writeSubIndex
		val = val & ~ander # set to 0
		if b > 0
			val = val | ander # maybe set to 1
		end
#puts "#{@writeHead} - #{val}"
		@data[@writeHead] = val
		@writeSubIndex += 1
		if @writeSubIndex >= 8
			@writeSubIndex = 0
			@writeHead += 1
			if @data.length<=@writeHead
				@data.push(1)
			end
		end
		#puts "#{@writeHead}.#{@writeSubIndex} - - - - - - - - - - - - - - - - - - - - - - - - "
	end
	def write_uint8 v
		ander = 1 #ander = 128
		i = 0
		while i<8
			val = ander & v
			if val > 0
				write_bit 1
			else
				write_bit 0
			end
			i = i + 1
			ander <<= 1 #ander >>= 1
		end
	end
# ----------------------------------------
	def to_s v=nil
		if v==2
			return to_s_bin
		elsif v==16
			return to_s_hex
		end
		return to_s_bin
	end
	def to_s_bin
		return @data
		#return "binary"
	end
	def to_s_hex
		return "hexa"
	end
end

# http://juixe.com/techknow/index.php/2007/01/22/ruby-class-tutorial/