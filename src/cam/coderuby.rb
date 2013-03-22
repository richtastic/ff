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