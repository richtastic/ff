# roku



https://github.com/rokudev

https://github.com/rokudev/samples#roku-sample-channels


https://www.eclipse.org/downloads/




http://devtools.web.roku.com/RokuRemote/





egrep -nirI "timer" ./



https://developer.roku.com/overview

https://developer.roku.com/docs/developer-program/getting-started/roku-dev-prog.md

https://developer.roku.com/docs/direct-publisher/getting-started.md

https://developer.roku.com/videos/courses/rsg/development-setup.md

https://blog.roku.com/developer/developer-setup-guide




https://developer.roku.com/videos/courses/rsg/intro.md x

https://developer.roku.com/videos/courses/rsg/development-setup.md
home
home
up
up
right
left
right
left
right
>>> get url for roku device
>>> enable installer

https://github.com/rokudev/hello-world

rokudev | PASSWORD

IDE:
	eclipse
	atom
	visual studio

debug console:
telnet IP.ADD.RE.SS 8085



https://developer.roku.com/videos/courses/rsg/core-concepts.md
manifest
components/
	MainScene.xml
	MainScene.brs
images/
source/
	main.brs - main()


threads
	- main
	- render
	- task node

scope
	- function []
	- component [m.]
	- global / channel [m.global]

https://developer.roku.com/videos/courses/rsg/content-feed.md
content feed
	- content node ~ data node
	- metadata

https://developer.roku.com/videos/courses/rsg/grid-screen.md
grid screen








SceneGraph
BrightScript







ROKU STEPS:

- turn on device
- setup device on device
- register device via web
- complete setup on device
- development setup code:
	home + home + home + up + up + ri + le + ri + le + + ri + le
- agree to 
- set webserver login password
- reboot
- settings -> network -> about -> ip
- in browser: goto ip, eg: 192.168.0.137
	- username: rokudev
	- password: richie

- debugger:
- telnet 192.168.0.137 8085

- packager: https://developer.roku.com/docs/developer-program/publishing/packaging-channels.md
- telnet 192.168.0.137 8080
- telnet 192.168.1.73 8080
- genkey
	................+++++
	...............................................................+++++
	Password: ...
	DevID: ...


Error 500: Internal Server Error
CGI program sent malformed or too big (>16384 bytes) HTTP headers: [init_ca_bundle_stat: stat /common/certs/ca-bundle.crt: No such file or directory
plugin_package: /build/work/f8886cd74a16a2f0/os/RokuOS/Device/Source/Crypto/Random.cpp:47: void Roku::Random::initialize_mainapp(): Assertion `len == (int)sizeof(rint)' failed.
]


https://community.roku.com/t5/Roku-Developer-Program/CGI-program-sent-malformed-or-too-big-gt-16384-bytes-HTTP-headers-init-ca-bundle-stat/m-p/711494


ROKU PUBLISHING PROCESS:

https://ottball.com/publishing-a-roku-channel/



brew install telnet


EXLIPSE ROKU EXTENSION

https://devtools.web.roku.com/ide/eclipse/plugin

https://sdkdocs-archive.roku.com/Roku-Plugin-for-Eclipse-IDE_4265458.html



https://stackoverflow.com/questions/20002854/brightscript-eclipse-plugin-not-showing-up-after-install-on-osx

https://www.youtube.com/watch?v=96s6aofHmnc






Name: DLTK
Location: http://download.eclipse.org/technology/dltk/updates-dev/5.6/

Name: Roku Plugin
Location: https://devtools.web.roku.com/ide/eclipse/plugin









image info:

splash screen:
sd  720x480
hd  1280x720
fhd 1920x1080
channel poster:
sd  214x144
hd  290x218
fhd 540x405 [also uploaded to roku web]



https://developer.roku.com/docs/references/scenegraph/scene.md

https://developer.roku.com/docs/references/brightscript/language/expressions-variables-types.md

https://developer.roku.com/docs/references/scenegraph/typographic-nodes/font.md

http://www.brightsign.es/sites/www.brightsign.es/files/BrightScript%20Reference%20Manual%20%28ver%207.1%29.pdf


 Device = CreateObject(  "roDeviceInfo" )
 RokuModel   = Device.GetModel()
 RokuVersion = Device.GetVersion()

 ti = createObject("roTimeSpan")




## brightscript - BS



print "text: " + number.ToStr() + " ... "

"10".ToInt()

?type(textstr)






