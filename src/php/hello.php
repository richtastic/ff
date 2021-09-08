<?php
// hello.php

/*
MAC:
sudo vi /etc/apache2/httpd.conf and make sure the line:
...
# LoadModule php7_module libexec/apache2/libphp7.so
...
sudo apachectl restart





sudo cp /private/etc/php.ini.default /private/etc/php.ini


sudo lsof -i:80
/etc/apache2/httpd.conf
sudo launchctl unload -w /System/Library/LaunchDaemons/org.apache.httpd.plist

*/

echo "HELLO";

?>