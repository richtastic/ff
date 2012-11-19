// Win.js

function Win(){
    var self = this;
    Code.extendClass(this,DO,arguments);
    this.titlebar, this.window;
    this.titleBarHeight = 25; this.winWidth = 150; this.winHeight = 100;
    this.titleBarLineColor = 0x000000FF;
    this.titleBarFillColor = 0xFF000033;
    this.winLineColor = 0x00FF00FF;
    this.winFillColor = 0x00FF0099;
    this.doMain = new DO();
    this.doMain.clearGraphics();
    this.doMain.setFillRGBA(0x0000FF99);
    this.doMain.drawRect(0,0,100,100);
    this.doMain.setLine(1.0,0x00FF00);
    this.doMain.beginPath();
    this.doMain.moveTo(0,0);
    this.doMain.lineTo(100,0);
    this.doMain.lineTo(100,100);
    this.doMain.lineTo(0,100);
    this.doMain.lineTo(0,0);
    this.doMain.strokeLine();
    this.doMain.endPath();
    /*
    this.doMain.clearGraphics();
    this.doMain.setLine(12,this.winLineColor);
    this.doMain.setFillRGBA(this.winFillColor);
    this.doMain.drawRect(0,0,this.winWidth,this.titleBarHeight);
    */
    self.addChild(this.doMain);
    this.doTitle = new DO();
    this.doTitle.clearGraphics();
    this.doTitle.setLine(1,this.titleBarLineColor);
    this.doTitle.setFillRGBA(this.titleBarFillColor);
    this.doTitle.drawRect(0,this.titleBarHeight,this.winWidth,this.winHeight);
    self.addChild(this.doTitle);
    //do1.addFunction(Canvas.EVENT_MOUSE_CLICK,this.clickWinFxn);
    //do1.matrix.rotate(Math.PI/4);
    //do1.matrix.translate(100,100);
}
/*
this.clearGraphics();
    this.setFillRGBA(0x0000FF99);
    this.drawRect(0,0,100,100);
    this.setLine(1.0,0x00FF00);
    this.beginPath();
    this.moveTo(0,0);
    this.lineTo(100,0);
    this.lineTo(100,100);
    this.lineTo(0,100);
    this.lineTo(0,0);
    this.strokeLine();
    this.endPath();
    */