#!/usr/bin/env ruby
# tinypng.rb
# ./tinypng.rb -f bla -k KEY
require "optparse"
require "json"

# functions
def command cmd
	return %x[ #{cmd} ]
end

def commandTinyPng key, file
	com = "curl --silent --user api:\"#{key}\" --data-binary @\"#{file}\" https://api.tinypng.com/shrink"
	puts com
	result = command com
	return result
end

# default settings
imageOriginalName = nil
imageCompressedName = nil


# internal settings
settings_filename = File.expand_path(__FILE__)
settings_basename = File.basename(settings_filename)
settings_directory = File.dirname(settings_filename)

# input parameters
# usage
usage = <<END
optimize image using tinypng API
	#{settings_basename} -f ./input_filename.png -k KEY-HASH-HERE
END
options = {}
optparse = OptionParser.new{ |opts|
	opts.banner = usage
	opts.on("-f","--file F", "input file"){ |f|
		options["--file"] = f
	}
	opts.on("-k","--key K", "tinypng authorized key"){ |k|
		options["--key"] = k
	}
	opts.on("-o","--output F", "output file"){ |f|
		options["--output"] = f
	}
	opts.on("-h","--help", "Help - Displays Usage"){ |h|
		puts opts
		exit 1
	}
}

# parse input
optparse.parse!(ARGV)
userInputFilenameFrom = options["--file"]
userInputFilenameTo = options["--output"]
userInputKey = options["--key"]

# updated settings from user input
if !userInputFilenameFrom
	puts "missing input file name"
	puts usage
	exit 1;
end
if !userInputKey
	puts "missing input API key"
	puts usage
	exit 1;
end

imageOriginalName = userInputFilenameFrom
if userInputFilenameTo
	imageCompressedName = userInputFilenameTo
else
	imageCompressedName = userInputFilenameFrom
end

# make call
resultString = commandTinyPng userInputKey,imageOriginalName

puts resultString

resultJson = JSON.parse(resultString)
if !resultJson || !resultJson["output"] || !resultJson["output"]["url"]
	puts "error in json: #{resultString}"
	exit 1;
end
# download compressed image:
imageCompressedURL = resultJson["output"]["url"]
puts imageCompressedURL
resultWget = command "wget -O  #{imageCompressedName} \"#{imageCompressedURL}\""
















