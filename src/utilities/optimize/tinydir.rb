#!/usr/bin/env ruby
# tinydir.rb
# ./tinydir.rb -i inDir -o outDir -k KEY
require "optparse"
require "json"

# functions
def command cmd
	return %x[ #{cmd} ]
end

def listAllFilesDirectory directory
	oldDir = (command "pwd").chomp!
	Dir.chdir directory
	directoryListing = Dir.entries "."
	fileList = []
	directoryList = []
	directoryListing.each { |name|
		if File.exists?name
			if File.directory? name
				if name!="." && name!=".."
					directoryList.push name
				end
			else
				relativefilename = "#{directory}/#{name}"
				fileList.push [relativefilename,name]
			end
		else 
			puts "error: DNE: #{name}"
		end
	}
	Dir.chdir oldDir # go back
	return fileList
end

# internal settings
settings_filename = File.expand_path(__FILE__)
settings_basename = File.basename(settings_filename)
settings_directory = File.dirname(settings_filename)

# input parameters
# usage
usage = <<END
optimize directory using tinypng API
	#{settings_basename} -i ./in/ -o ./out/ -k KEY-HASH-HERE
END
options = {}
optparse = OptionParser.new{ |opts|
	opts.banner = usage
	opts.on("-i","--in D", "input file"){ |d|
		options["--in"] = d
	}
	opts.on("-o","--out D", "input file"){ |d|
		options["--out"] = d
	}
	opts.on("-k","--key K", "tinypng authorized key"){ |k|
		options["--key"] = k
	}
	opts.on("-h","--help", "Help - Displays Usage"){ |h|
		puts opts
		exit 1
	}
}

# parse input
optparse.parse!(ARGV)
directoryFrom = options["--in"]
directoryTo = options["--out"]
apiKey = options["--key"]

# updated settings from user input
if !directoryFrom
	puts "missing input directory"
	puts usage
	exit 1;
end
if !directoryTo
	puts "missing output directory"
	puts usage
	exit 1;
end
if !apiKey
	puts "missing input API key"
	puts usage
	exit 1;
end

if directoryFrom[directoryFrom.length-1]=="/"
	directoryFrom = directoryFrom[0, directoryFrom.length-1]
end
if directoryTo[directoryTo.length-1]=="/"
	directoryTo = directoryTo[0, directoryTo.length-1]
end

filesSource = listAllFilesDirectory directoryFrom

filesFrom = []
filesTo = []
filesSource.each do |list|
	fileName = list[1]
	filesFrom.push "#{directoryFrom}/#{fileName}"
	filesTo.push "#{directoryTo}/#{fileName}"
end

filesFrom.each_with_index do |value,key|
	from = filesFrom[key]
	to = filesTo[key]
	com = "./tinypng.rb -k \"#{apiKey}\" -f \"#{from}\" -o \"#{to}\" "
	command com
end




