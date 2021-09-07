' channel entry point
sub Main()
	
	print "start Main sub"

	' start scene graph application
	screen = CreateObject("roSGScreen")
	port = CreateObject("roMessagePort")
	m.port = port
	screen.SetMessagePort(m.port)
	
	' starting scene = landing
	print "start creating landing scene"
	scene = screen.CreateScene("LandingScene")
	

	screen.show()
	
	print "start request"


	resolution = scene.currentDesignResolution


	print("scene size: "+resolution.width.ToStr()+" x "+resolution.height.ToStr())

	poster = scene.findNode("CameraPoster")

	poster.width = resolution.width
	poster.height = resolution.height
	poster.translation="[0,0]"


	' overlay = CreateObject("roSGRectangle")
	' overlay = scene.createChild("roSGRectangle")
	' overlay = scene.createChild("Rectangle")

''	overlay = CreateObject("roSGNode", "CustomView")


'overlayObject = createObject("RoSGNode","Rectangle")
'overlayChildObject = ContentNode_object.createChild("ContentNode")
'overlayChildObject.field_name = data
	overlay = createObject("roSGNode","Rectangle")
	' overlay.id = "RICHIE"
	scene.appendChild(overlay)

	overlay.blendingEnabled = true
	overlay.color = &H00000066
	overlay.width = resolution.width
	overlay.height = resolution.height * 0.10
	overlay.translation="[0,0]"


	timestamp = createObject("roSGNode","Label")
	overlay.appendChild(timestamp)
	hei = overlay.height
	ins = Cint(hei * 0.25)
	timestamp.color = &HFFFFFFFF
	timestamp.width = overlay.width - (ins * 2)
	timestamp.height = hei
	timestamp.font = "font:MediumSystemFont"
	' timestamp.size = Cint(overlay.height * 1.0)
	timestamp.size = 4
	timestamp.horizAlign = "left"
	timestamp.vertAlign = "center"
	timestamp.translation="["+ins.ToStr()+",0]"


	time = CreateObject("roDateTime")
	time.Mark()
	time.ToLocalTime()
	timestamp.text = "Timestamp goes here"

	' todo: prefix to fill 0s '
	' timestamp.text = time.GetYear().ToStr()+"-"+time.GetMonth().ToStr()+"-"+time.GetDayOfMonth().ToStr()+" "+time.GetHours().ToStr()+":"+time.GetMinutes().ToStr()+":"+time.GetSeconds().ToStr()+"."+time.GetMilliseconds().ToStr()
	' ToISOString()

	' Fri | Sep 3 2022 | 13:45:21.4456
	timestamp.text = time.GetYear().ToStr()+"-"+time.GetMonth().ToStr()+"-"+time.GetDayOfMonth().ToStr()+" "+time.GetHours().ToStr()+":"+time.GetMinutes().ToStr()+":"+time.GetSeconds().ToStr()+"."+time.GetMilliseconds().ToStr()


	' title_black_gradient_40x200.png


	' start timer
	' timer = CreateObject("roTimer")
'		timeout = CreateObject("roDateTime")
'		timeout.AddSeconds(10) 

print "start timer"
	timeout = CreateObject("roDateTime")
	timeout.Mark()
'	timeout.AddSeconds(5)







'm.timer = CreateObject("roSgnode", "Timer")
'm.timer.observeField("fire", "CloseVideoPlayer")
'm.timer.duration = 0.3
'm.timer.control = "start"

	'timer = CreateObject("roSGNode","Timer")
	'scene.appendChild(timer)
	'timer.SetMessagePort(m.port)
''	timer.repeat = true
	'timer.duration = 1.0
'timer.control = "start"
	'timer.ObserveField("fire", "TimerEventFxn") ' BRIGHTSCRIPT: ERROR: roSGNode.ObserveField: no active host node: pkg:/source/main.brs(102)
	' timer.ObserveField("fire", TimerEventFxn)
	'timer.control = "start"
	'm.timer = timer
	'timer.SetFocus(true)



	'timer = CreateObject("roTimer")
	' timer.SetMessagePort(port)
	'timer.SetPort(port)
	'timer.SetDateTime(timeout)
	'timer.Start()

	print "start task"

	task = CreateObject("roSGNode","Task")
	task.functionName = "MyTaskFxn"
	task.control = "RUN"


	print " set poster ..."


	RequestJsonImage(poster)


	print "start main loop"

	' main loop
	while true
		message = wait(0, m.port)
		messageType = type(message)
		print("RICHIE - EVENT: "+message.ToStr())
		if messageType = "roSCScreenEvent"
			

			
			if message.IsScreenClosed() then return

		end if
	end while

	print "end main loop"

end sub



function MyTaskFxn(e)
	print " trigger MyTaskFxn"
end function


sub TimerEventFxn(e)
	print " trigger TimerEventFxn"
end sub

sub RequestJsonImage(component)
	request = CreateObject("roUrlTransfer")
	' request.SetURL("http://192.168.0.140/web/ff/cam/web/distributionServer/index.php?path=%2Fcamera%2F1%2Fimage")
	request.SetURL("http://192.168.1.69/web/ff/cam/web/distributionServer/index.php?path=%2Fcamera%2F1%2Fimage")
	
	response = request.GetToString()
	'print ("response: " + response)
	jsonObject = ParseJson(response)
	
	result = jsonObject.result
	print ("result: " + result)

	if result = "success"
		print "SUCCESS"
	else
		print "FAILURE"
	end if

	data = jsonObject.data
	base64 = data.base64


	ba = CreateObject("roByteArray")
	ba.FromBase64String(base64)

	print "saving to file"
	tempFilePath = "tmp:/temp.png"
	ba.WriteFile(tempFilePath)

	print "done file save"

	component.uri = tempFilePath


	'print ("result: " + result)


	'request.AddHeader("Authorization", "Basic")    
	'request.AddHeader("app_key","username")
	'request.AddHeader("app_secret","password")
	' response = ParseJson(request.GetToString())
end sub

















