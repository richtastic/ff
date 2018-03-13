#!/usr/bin/ruby
# cipher.rb
# require "./Base64FileEncoder.rb"
# cipher.rb  -e  -i ./test  -o ./enc  -r  -b 1000  -p ./password.txt
# cipher.rb  -d  -i ./eng  -o ./out  -r  -p ./password.txt

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