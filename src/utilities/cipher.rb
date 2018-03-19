#!/usr/bin/ruby
# cipher.rb
# 
# require "./Base64FileEncoder.rb"
# cipher.rb  -e  -i ./test  -o ./enc  -r  -b 1000  -p ./password.txt
# cipher.rb  -d  -i ./eng  -o ./out  -r  -p ./password.txt

require 'optparse'

options = {}

OptionParser.new do |parser|
	# parse.on("-n", "--name NAME", "The name of the person to greet.") do |v|
	# 	options[:name] = v
	# end
end




class Cipher
	@@ENCRYPTION_TYPE = "aes-256-cbc"
	def self.ENCRYPTION_TYPE
		@@ENCRYPTION_TYPE
	end
	def self.command cmd
		return `#{cmd}` # %x[ #{cmd} ]
	end


	def self.randomPhrase64 # 64 hex = 256 bits
		strs = Cipher.command "date | shasum -a 256"
		list = strs.split " "
		return list[0]
	end


	def Cipher.encryptSSL passwordFile, sourceFile, destinationFile, force=true
		encryptionMethod = Cipher.ENCRYPTION_TYPE
		existsSource = File.file?(sourceFile)
		existsDestination = File.file?(destinationFile)
		if existsSource && !existsDestination
			Cipher.command "openssl  #{encryptionMethod}  -kfile #{passwordFile}  -in #{sourceFile}  -out #{destinationFile}"
			return true
		end
		return false
	end

	def Cipher.decryptSSL passwordFile, sourceFile, destinationFile
		encryptionMethod = Cipher.ENCRYPTION_TYPE
		existsSource = File.file?(sourceFile)
		existsDestination = File.file?(destinationFile)
		if existsSource && !existsDestination
			Cipher.command "openssl  #{encryptionMethod}  -d  -kfile #{passwordFile}  -in #{sourceFile}  -out #{destinationFile}"
			return true
		end
		return false
	end

	def Cipher.directoryList location, recursive=false
		list = []
		return list
	end

	def initialize
		@var = ""
	end

end





puts "get encrypt/decrypt"

puts "get source directory path"

puts "get destination directory path"

puts "get password file"

puts "get block size" # in bytes, eg 1000 = 1 KB, 1E6 = 1 MB, rounded up to nearest 256, some minimum

puts "get is recursive"

# for each directory:

puts "get directory listing"

puts "get table of info for each file/directory"

puts "d/f, mapping-name[#], original-name, original-size, original-crc32"

puts "   aes256 file to temp location"
puts "   read temp file into current block, create new blocks as necessary"

# decrypt

puts "   start at file named 0"
puts "   aes256 file to temp location"
puts "   read SIZE into info.info"
puts "   read SIZE into temp file"
puts "   rename as decrypted"








cipher = Cipher.new

#date = Cipher.command("date")
# puts date
#puts Cipher.ENCRYPTION_TYPE
#puts Cipher.encryptSSL
# /Users/zirbr001/dev/extRepos/ff/src/utilities/aes256cbc/test.ttf


#puts Cipher.command("ls ./aes256cbc/test.ttf")

puts Cipher.encryptSSL "./aes256cbc/password.txt", "./aes256cbc/test.ttf", "./aes256cbc/test.out"
puts Cipher.decryptSSL "./aes256cbc/password.txt", "./aes256cbc/test.out", "./aes256cbc/result.ttf"


puts Cipher.randomPhrase64


# SIZE
# index
# info.info
# - 
# SIZE
# index
# file1..
# - 
# SIZE
# index
# fileI..
# ...
# SIZE
# index
# fileN..
# trash








