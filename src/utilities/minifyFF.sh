#!/bin/bash
# minifyFF.sh

# DOES THE DEPENDENCY ORDER MATTER?

ls -lah ../code/*.js
# yui-compressor ../code/*.js > FF.min.js

yui-compressor ../code/*.js > ../code/FF.min.js
exit 0

for file in ../code/*.js; do 
	echo $file
	yui-compressor $file > ../code/FF.min.js
done



#yui-compressor ../code/Code.js > FF.min.js
