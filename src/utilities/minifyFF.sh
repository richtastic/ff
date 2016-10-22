#!/bin/bash
# minifyFF.sh

# DOES THE DEPENDENCY ORDER MATTER?

ls -lah ../code/*.js
# yui-compressor ../code/*.js > FF.min.js

for file in ../code/*.js; do 
	echo $file
	yui-compressor $file > FF.min.js
done



#yui-compressor ../code/Code.js > FF.min.js
