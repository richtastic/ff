#!/usr/bin/ruby
# test

def command comm
	return %x[ "#{comm}" ]
end


com = "curl -X POST --data \"data=...\" http://localhost/ff/crop/base64data.php > out.png"

command com

