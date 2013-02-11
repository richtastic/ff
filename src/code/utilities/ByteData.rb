#!/usr/bin/ruby
# ByteData
class ByteData
	@@BASE64TABLE = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","a","b","c","d",
	"e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","0","1","2","3","4","5","6","7","8","9","+","/"]
# ----------------------------------------
	def initialize
		@data = []
		@byteSize = _native_size - 1
		@readHead = 0
		@readSubIndex = @byteSize #@readSubIndex = 0
		@writeHead = 0
		@writeSubIndex = @byteSize #@writeSubIndex = 0
	end
# ----------------------------------------
	def _native_size
		return 8 #return 0.size * 8
	end
# ----------------------------------------
	def init_read p=0
		@readHead = 0
		@readSubIndex = 0
	end
	def read_bit
		val = @data[@readHead]
		ret = 0
		ander = 1<<(@byteSize - @readSubIndex)
		if (ander & val) != 0
			ret = 1
		end
		@readSubIndex = @readSubIndex + 1
		if @readSubIndex > @byteSize
			@readSubIndex = 0
			@readHead = @readHead + 1
		end
		return ret
	end
	def read_uint16
		return read_uintN 16
	end
	def read_uint8
		return read_uintN 8
	end
	def read_uint6
		return read_uintN 6
	end
	def read_uint4
		return read_uintN 4
	end
	def read_uintN c
		n = 0
		i = c-1
		while i>=0
			ander = 1<<i
			if read_bit != 0
				n |= ander
			end
			i = i-1
		end
		return n
	end
# ----------------------------------------
	def set_write_head v=0
		if @data.length==0
			@data.push(0)
		end
		@writeHead = 0;
		@writeSubIndex = 0;
	end
	def write_bit v=0
		val = @data[@writeHead]
		ander = 1 << (@byteSize - @writeSubIndex)
		val = val & ~ander # set to 0
		if v && v>0
			val = val | ander # maybe set to 1
		end
		@data[@writeHead] = val
		@writeSubIndex = @writeSubIndex + 1
		if @writeSubIndex > @byteSize
			@writeSubIndex = 0
			@writeHead += 1
			if @data.length<=@writeHead
				@data.push(0)
			end
		end
	end
	def write_uint16 v
		write_uintN 16, v
	end
	def write_uint8 v
		write_uintN 8, v
	end
	def write_uint6 v
		write_uintN 6, v
	end
	def write_uint4 v
		write_uintN 4, v
	end
	def write_uintN n,v
		ander = 1<<(n-1)
		while ander != 0
			val = ander & v
			if val != 0
				write_bit 1
			else
				write_bit 0
			end
			ander >>= 1
		end
	end
	def get_total_bits
		return (@data.length-1)*_native_size + @writeSubIndex;
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
		str = ""
		h = 0
		i = 0
		len = get_total_bits
		init_read()
		while i<len
		 	if i%8==0 && i>0
				str = "#{str}|"
			end
		 	str = "#{str}#{read_bit()}"
		 	i = i + 1
		end
		return str
	end
	def to_s_hex
		return "hexa"
	end
	def to_s_base_64_encoded
		str = ""
		i = 0
		len = get_total_bits
		len6 = (len/6.0).ceil
		rem = len6*6.0 - len
		init_read
		while i<len6
			d = read_uint6
			str = "#{str}#{@@BASE64TABLE[d]}"
			i = i + 1
		end
		if rem>=4
			str = "#{str}=="
		elsif rem>=2
			str = "#{str}="
		end
		return str
	end
	
end

# http://juixe.com/techknow/index.php/2007/01/22/ruby-class-tutorial/
