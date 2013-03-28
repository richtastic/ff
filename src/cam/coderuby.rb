# Dir["/path/to/directory/*.rb"].each {|file| require file }


def GetCharUserInputNonBlock()
	instr = "asd"
	begin # non-blocking get user input
		instr = STDIN.read_nonblock(1)
	rescue Errno::EAGAIN
		instr = ""# nothing to be read
	rescue Errno::EINTR
		instr = ""# interrupted
	end
	return instr
end
def GetStringUserInputNonBlock()
	instr = ""
	c = GetCharUserInputNonBlock()
	while c!=""
		instr = "#{instr}#{c}"
		c = GetCharUserInputNonBlock()
	end
	return instr
end


def createPipeComm (name)
	cmd = "mknod #{name} p"
	ret = %x[ #{cmd} ]
	cmd = "chmod 777 #{name}"
	ret = %x[ #{cmd} ]
end

def openPipeComm (name)
	return File.open(name,File::RDWR | File::NONBLOCK)
end

def closePipeComm (file)
	return file.close()
end

def deletePipeComm (name)
	cmd = "rm #{name}"
	return %x[ #{cmd} ]
end

def writePipeComm (file,data)
	begin
		result = file.write(data)
		file.flush
		return result
	rescue Errno::EAGAIN
		#puts "NOTHING TO WRITE"
	rescue Errno::EINTR
		#puts "INTERRUPTED"
	end
	return nil
end

def readPipeSingleChar (file)
	instr = ""
	begin
		instr = file.read(1)
	rescue Errno::EAGAIN
		instr = "" # puts "NOTHING TO READ"
	rescue Errno::EINTR
		instr = "" # puts "INTERRUPTED"
	end
	return instr
end

def readPipeComm (file)
	data = ""
	#puts "single ... "
	ch = readPipeSingleChar(file)
	#puts "ch"
	while(ch!="")
		data = "#{data}#{ch}"
		ch = readPipeSingleChar(file)
	end
	return data
end
