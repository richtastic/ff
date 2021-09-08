' channel entry point
sub Main()
    ' start scene graph application
	screen = CreateObject("roSGScreen")
	m.port = CreateObject("roMessagePort")
	screen.SetMessagePort(m.port)
	
	' start scene graph form main scene root
    print "start creating landing scene"
    scene = screen.CreateScene("MainScene")
    

    screen.show()
	
	' main loop
	while true
		message = wait(0, m.port)
        if message = invalid ' <>
'            print("invalid message")
        else 
    		messageType = type(message)
    		print("message: "+messageType.ToStr())
    		if messageType = "roSCScreenEvent"
                print("RICHIE - roSCScreenEvent")				
                if message.IsScreenClosed()
                  return
                end if
            end if    
		end if
	end while
	
end sub
