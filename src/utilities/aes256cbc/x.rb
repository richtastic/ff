




openssl  aes-256-cbc  -kfile password.txt  -in ./test.ttf  -out encrypted_data
openssl  aes-256-cbc  -d  -kfile password.txt  -in ./encrypted_data  -out out.ttf



date | shasum -a 256
022a755fcff6c8908466e13de63ddb2496ee424af783a73dba6a4ea2869fa2cc  -


























































