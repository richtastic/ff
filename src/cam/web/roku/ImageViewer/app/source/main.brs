' channel entry point
sub Main()
	
	print "start Main sub"

	' start scene graph application
	screen = CreateObject("roSGScreen")
	m.port = CreateObject("roMessagePort")
	screen.SetMessagePort(m.port)
	
	' starting scene = landing
	print "start creating landing scene"
	scene = screen.CreateScene("LandingScene")
	screen.show()
	
	print "start request"

	RequestJsonImage(scene)
	' scene  scene.top  ...
	

	print "start main loop"

	' main loop
	while(true)
		message = wait(0, m.port)
		messageType = type(message)
		if messageType = "roSCScreenEvent"
			if message.IsScreenClosed() then return
		end if
	end while

	print "end main loop"

end sub


sub RequestJsonImage(component)
	request = CreateObject("roUrlTransfer")
	request.SetURL("http://192.168.0.140/web/ff/cam/web/distributionServer/index.php?path=%2Fcamera%2F1%2Fimage")
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



	poster = component.findNode("CameraPoster")

	print "got poster"

	poster.uri = tempFilePath


	'print ("result: " + result)


	'request.AddHeader("Authorization", "Basic")    
	'request.AddHeader("app_key","username")
	'request.AddHeader("app_secret","password")
	' response = ParseJson(request.GetToString())
end sub

















