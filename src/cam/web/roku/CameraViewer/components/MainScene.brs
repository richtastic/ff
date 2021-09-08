' Mainscene.brs
sub init()
	print("init - xml")
	poster = m.top.FindNode("CameraPoster")
	poster.setFocus(true)
end sub



function onKeyEvent(key as String, press as Boolean) as Boolean
	print "inside MainScene.xml onKeyEvent"
	return false
end function

