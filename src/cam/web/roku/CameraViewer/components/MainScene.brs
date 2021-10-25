' Mainscene.brs
sub init()
	print("init - MainScene - xml")
	
	' get display settings
	resolution = m.top.currentDesignResolution
    'print("scene size: "+resolution.width.ToStr()+" x "+resolution.height.ToStr())
    
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
	
	
	' start infinite loop
	getPosterImage()
	
	' overlay
	  
	' channel selection
	showChannelSelection()
	
	
	
    ' list
    getCameraList()
	
	
end sub

function min(a,b)
    if a<b 
        return a
    end if
    return b
end function


function max(a,b)
    if a>b 
        return a
    end if
    return b
end function

function round(a)
    min = Int(a)
    max = Int(a+1)
    dif = a - min
    if dif > 0.5
        return max
    end if
    return min
end function

function showChannelSelection()
    print "RICHIE - showChannelSelection"
    
    
    insetPercent = 0.05
    'gridSizeX = 3
    'gridSizeY = 2
    
    gridSizeX = 4
    gridSizeY = 3
    
    gridSpacingPercent = 0.05
    
    entryCount = 7
    
    
    
    m.selectedChannelIndex = 0
    m.channelColCount = gridSizeX
    m.channelRowCount = gridSizeY
    
    
    resolution = m.top.currentDesignResolution
    
    insetAbsolute = round(insetPercent*resolution.height)
    
    overlayWidth = resolution.width - insetAbsolute*2
    overlayHeight = resolution.height - insetAbsolute*2
    
    gridSpacing = round(overlayHeight*gridSpacingPercent)
    cellWidth = round((overlayWidth - (gridSizeX+1)*gridSpacing)/gridSizeX)
    cellHeight = round((overlayHeight - (gridSizeY+1)*gridSpacing)/gridSizeY)
    
    ' poster = CreateObject("roSGNode", "Poster")
    poster = createObject("roSGNode","Rectangle")
    poster.id="ChannelListRoot"
    m.top.appendChild(poster)
    ' poster.uri="pkg:/images/temp_hd.png"
    ' poster.loadDisplayMode="scaleToZoom"
    ' size to fill screen
    'poster.backgroundURI = ""
    'poster.backgroundColor = &hFFFFFF99
    poster.color = &H000000CC ' rectangle
    
    poster.width = overlayWidth
    poster.height = overlayHeight
    poster.translation="["+insetAbsolute.ToStr()+","+insetAbsolute.ToStr()+"]"
    
    'offY = 0
    for y = 0 to gridSizeY - 1
        'offX = 0
        offY = y*cellHeight + (y+1)*(gridSpacing)
        for x = 0 to gridSizeX - 1
            print "->"+x.ToStr()+","+y.ToStr()
            offX = x*cellWidth + (x+1)*(gridSpacing) 
            cell = createObject("roSGNode","Rectangle")
            'poster.id="ChannelListRoot"
            poster.appendChild(cell)
                ' poster.uri="pkg:/images/temp_hd.png"
                ' poster.loadDisplayMode="scaleToZoom"
                ' size to fill screen
                'poster.backgroundURI = ""
                'poster.backgroundColor = &hFFFFFF99
            cell.color = &HFF0000FF ' rectangle
            cell.width = cellWidth
            cell.height = cellHeight
            cell.translation="["+offX.ToStr()+","+offY.ToStr()+"]"
            ' cell.translation="[0,0]"
                
        end for
        'offY += 
    end for
    
    ' highlight button
    
    
    
    testSelect()
    
end function

function getPosterImage()
    task = CreateObject("roSGNode", "Networking")
    task.observeField("status","requestStatusChange")
    task.cameraID = "rasp_1_cam_0"
    task.poster = m.nextPoster
    task.control = "RUN"
end function


function getCameraList()
    task = CreateObject("roSGNode", "Networking")
    task.observeField("status","requestStatusChange")
    task.cameraID = ""
'    task.cameraID = "rasp_1_cam_0"
'    task.poster = m.nextPoster
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
    ' infinite loop
    ' getPosterImage()
end function

function testSelect()
    print "testSelect"
    
    focusID = "_main_focus_"
    
    focus = createObject("roSGNode","Rectangle")
    m.top.appendChild(focus)
    focus.id = focusID
    ' focus.color = &HFFFFFFFF ' rectangle
    focus.color = &H00000000
    focus.width = 200
    focus.height = 100
    focus.translation="[10,10]"
    
    anim = createObject("roSGNode","Animation")
    anim.duration = 1
    anim.repeat = true
    anim.easeFunction = "linear"
    
    'interp = createObject("roSGNode","Vector2DFieldInterpolator")
    ' 
    'interp = createObject("roSGNode","FloatFieldInterpolator")
    'interp.key = "[0.0, 0.5, 1.0]"
    'interp.keyValue = "[1.0, 0.0, 1.0]"
    'interp.fieldToInterp = focusID+".opacity"
    
    interp = createObject("roSGNode","Vector2DFieldInterpolator")
    interp.key="[0.0, 1.0]"
    interp.keyValue="[ [10.0, 10.0], [200.0, 110.0] ]"
    interp.fieldToInterp = focusID+".translation"
    
    '<FloatFieldInterpolator 
    'key = "[ 0.0, 0.5, 1.0 ]" 
    'keyValue = "[ 1.0, 0.0, 1.0 ]" 
    'fieldToInterp = "examplePoster.opacity" /
    
    focus.appendChild(anim)
    anim.appendChild(interp)
    
    
    rectLID = focusID+"l"
    rectRID = focusID+"r"
    rectTID = focusID+"t"
    rectBID = focusID+"b"
    
    colorSelect = &HFFFFFFFF
    
    rectL = createObject("roSGNode","Rectangle")
    focus.appendChild(rectL)
    rectL.id = rectLID
    ' rectL.color = &H0000FFFF
    rectL.color = colorSelect
    rectL.width = 0
    rectL.height = 0
    rectL.translation="[0,0]"
    
    rectR = createObject("roSGNode","Rectangle")
    focus.appendChild(rectR)
    rectR.id = rectRID
    'rectR.color = &H00FF00FF
    rectR.color = colorSelect
    rectR.width = 0
    rectR.height = 0
    rectR.translation="[0,0]"
    
    rectT = createObject("roSGNode","Rectangle")
    focus.appendChild(rectT)
    rectT.id = rectTID
    'rectT.color = &HFF00FFFF
    rectT.color = colorSelect
    rectT.width = 0
    rectT.height = 0
    rectT.translation="[0,0]"
    
    rectB = createObject("roSGNode","Rectangle")
    focus.appendChild(rectB)
    rectB.id = rectBID
    'rectB.color = &H00FFFFFF
    rectB.color = colorSelect
    rectB.width = 0
    rectB.height = 0
    rectB.translation="[0,0]"
    
    
    

    ' anim.control = "start"
    
    
    setSelectionBox(120,200, 400,300, 5)
    
end function


function setSelectionBox(x,y,wid,hei, thickness)
    focusID = "_main_focus_"
    
    rectLID = focusID+"l"
    rectRID = focusID+"r"
    rectTID = focusID+"t"
    rectBID = focusID+"b"
    
    focus = m.top.findNode(focusID)
    rectL = focus.findNode(rectLID)
    rectR = focus.findNode(rectRID)
    rectT = focus.findNode(rectTID)
    rectB = focus.findNode(rectBID)
    
    focus.width = wid
    focus.height = hei
    focus.translation="["+x.ToStr()+","+y.ToStr()+"]"
    
    
    rectL.width = thickness
    rectL.height = hei
    
    rectR.width = thickness
    rectR.height = hei
    rectR.translation="["+(wid-thickness).ToStr()+",0]"
    
    rectT.width = wid
    rectT.height = thickness
    
    rectB.width = wid
    rectB.height = thickness
    rectB.translation="[0,"+(hei-thickness).ToStr()+"]"
    
    
end function

function goRight()

    print "cols "+m.channelColCount.ToStr()
    print "rows "+m.channelRowCount.ToStr()
    print "index "+m.selectedChannelIndex.ToStr()
    cols = m.channelColCount
    rows = m.channelRowCount
    
    indexCurr = m.selectedChannelIndex
    indexNext = indexCurr + 1
    if indexNext > cols
        ' modulo
    end if
    
    print "goRight()"
    
    setSelectionBox(indexNext*100,10,300,200, 10)
    
    
    m.selectedChannelIndex = indexNext
    
    
end function

function onKeyEvent(key as String, press as Boolean) as Boolean
	print "inside MainScene.xml onKeyEvent: "+key.ToStr()
	if key = "OK"
	   if press = true
	       print "RICHIE - do: OK "
	   end if
	else if key = "right"
        if press = true
            print "RICHIE - do: RIGHT"
            goRight()
        end if
    else if key = "left"
        if press = true
            print "RICHIE - do: LEFT"
'            testSelect()
        end if
    else if key = "up"
        if press = true
            print "RICHIE - do: UP"
'            testSelect()
        end if
    else if key = "down"
        if press = true
            print "RICHIE - do: DN"
'            testSelect()
        end if
	end if
	'print("RICHIE - message: "+message.ToStr())
    'messageType = type(message)
    'print("RICHIE - EVENT: "+messageType.ToStr())
    'if messageType = "roSCScreenEvent"
    '  print("handle roSCScreenEvent")     
    'end if
    ' not handled
	return false
end function


