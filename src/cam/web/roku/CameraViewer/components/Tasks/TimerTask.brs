' TimerTask.brs

sub init()
    print("init - TimerTask")
    m.top.functionName = "waitForTime"
    m.top.time = 1000
    m.top.status = "waiting"
end sub

sub waitForTime()
    port = CreateObject("roMessagePort")
    print("waitForTime: "+m.top.time.toStr()+" & "+m.top.status)
    while true
        print("start waiting")
        Wait(m.top.time, port)
        print("done waiting")
        
        m.top.status = "complete"
        return
    end while
end sub

