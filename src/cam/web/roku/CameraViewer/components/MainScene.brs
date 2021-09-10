' Mainscene.brs
sub init()
	print("init - MainScene - xml")
	
	' get display settings
	resolution = m.top.currentDesignResolution
    print("scene size: "+resolution.width.ToStr()+" x "+resolution.height.ToStr())
    
    ' setup main poster image
	' poster = m.top.FindNode("CameraPoster")
	
	poster = CreateObject("roSGNode", "Poster")
	poster.id="CameraPoster"
	m.top.appendChild(poster)
	poster.uri="pkg:/images/temp_hd.png"
    poster.loadDisplayMode="scaleToZoom"
	' size to fill screen
    poster.width = resolution.width
    poster.height = resolution.height
    poster.translation="[0,0]"
    poster.setFocus(true) 
	
	' get initial image
	m.poster = poster
	
	
	prevPoster = m.poster
    poster = CreateObject("roSGNode", "Poster")
    m.top.appendChild(poster)
'    poster.uri="pkg:/images/temp_hd.png"
    poster.width=prevPoster.width
    poster.height=prevPoster.height
    poster.loadDisplayMode=prevPoster.loadDisplayMode
    poster.translation=prevPoster.translation
    poster.visible = false
    m.nextPoster = poster 
	'print poster
	'print m.poster
	getPosterImage()
	
	
	
end sub


function getPosterImage()
    task = CreateObject("roSGNode", "Networking")
    task.observeField("status","requestStatusChange")
    ' task.cameraID = "x"
    task.cameraID = "rasp_1_cam_0"
    task.poster = m.nextPoster
    task.control = "RUN"
end function

function requestStatusChange()
    print("requestStatusChange")
    
    prevPoster = m.poster
    nextPoster = m.nextPoster
    
'    prevPoster.visible = false
'    nextPoster.visible = true
    
    m.poster = nextPoster
    m.nextPoster = prevPoster
       
    waitToChangePosterImage()
    
    'waitToGetNextPosterImage()
end function

function waitToChangePosterImage()
    print "waitToChangePosterImage"
    task = CreateObject("roSGNode", "TimerTask")
    task.observeField("status","waitStatusChange")
    print "status: "+task.status
    task.time = 100
    task.control = "RUN"
end function

function waitStatusChange()
    print("waitStatusChange")
    m.poster.visible = true
    m.nextPoster.visible = false
    waitToGetNextPosterImage()
end function



function waitToGetNextPosterImage()
    print("waitToGetNextPosterImage")
    task = CreateObject("roSGNode", "TimerTask")
    task.observeField("status","timerStatusChange")
    print "status: "+task.status
    task.time = 2000
    task.control = "RUN"
end function

function timerStatusChange()
    print("timerStatusChange")
    getPosterImage()
end function

function onKeyEvent(key as String, press as Boolean) as Boolean
	print "inside MainScene.xml onKeyEvent"
	print("RICHIE - message: "+message.ToStr())
    messageType = type(message)
    print("RICHIE - EVENT: "+messageType.ToStr())
    if messageType = "roSCScreenEvent"
      print("handle roSCScreenEvent")     
    end if
    ' not handled
	return false
end function


