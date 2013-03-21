#!/usr/bin/ruby
# base64File
require "Base64FileEncoder.rb"

# http://jimneath.org/2010/01/04/cryptic-ruby-global-variables-and-their-meanings.html
#puts "#{$0} #{$*}"

if $*.length < 1
	#puts "first argument must be file name"
	exit(1)
end
input_file_name = $*[0]
puts FileToBase64(input_file_name)


