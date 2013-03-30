#!/usr/bin/ruby
cmd = "ps aux | egrep cam | awk '{print $2}'"
result = %x[ #{cmd} ]
result.each do |pid|
	cmd = "kill -9 #{pid}"
	result = %x[ #{cmd} ]
end