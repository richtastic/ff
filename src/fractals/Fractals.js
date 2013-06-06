// Fractals.js

function Fractals(){
	var self = this;
	this.addListeners = function(){
		self.resource.addListeners();
		self.canvas.addListeners();
		self.stage.addListeners();
		self.keyboard.addListeners();
		self.canvas.addFunction(Canvas.EVENT_WINDOW_RESIZE,self.canvasResizeFxn);
		self.stage.addFunction(Stage.EVENT_ON_ENTER_FRAME,self.stageEnterFrameFxn);
		/*
		self.stage.addFunction(Stage.EVENT_ON_EXIT_FRAME,self.stageExitFrameFxn);
		self.canvas.addFunction(Canvas.EVENT_MOUSE_CLICK,self.canvasClickFxn);
		self.keyboard.addFunction(Keyboard.EVENT_KEY_UP,self.keyUpFxn);
		self.keyboard.addFunction(Keyboard.EVENT_KEY_DOWN,self.keyDownFxn);*/
		self.resource.alertLoadCompleteEvents();
		self.stage.start();
		// self.timer = new Ticker(1); 
		// self.timer.addFunction(Ticker.EVENT_TICK, self.timerTick);
		// self.timer.start();
	};
	this.constructor = function(){
		self.canvas = new Canvas(self.resource,null,600,300,Canvas.STAGE_FIT_FILL);
		self.stage = new Stage(self.canvas, 1000/180);
		self.keyboard = new Keyboard();
		self.resource.alertLoadCompleteEvents();
		self.doRoot = new DO();
		self.stage.addChild(self.doRoot);
		//
		self.doContainer = new DO();
		self.doSky = new DO();
		self.doSun = new DO();
		self.doOrb = new DO();
		self.doCity = new DO();
		self.doTrees = new DO();
		self.doRoot.addChild( self.doContainer );
		self.doContainer.addChild( self.doSky );
		self.doContainer.addChild( self.doSun );
		self.doContainer.addChild( self.doOrb );
		self.doContainer.addChild( self.doCity );
		self.doContainer.addChild( self.doTrees );
		// 
		self.addListeners();
		self.doContainer.addFunction(Canvas.EVENT_MOUSE_DOWN,self.handleMouseDown);
		self.doOrb.setDraggingEnabled();
		self.doOrb.startDrag(new V2D(0,0));
	};
	this.handleMouseDown = function(e){
		var pos = e[0];

	}
	this.fractalCount = 0;
	this.stageEnterFrameFxn = function(t){
		if(self.fractalCount<1000){
			++self.fractalCount;
			if(self.fractalCount%1==0){
				//self.fractalIncrement();
			}
		}
	}
	this.fractalBegin = function(){
		var i, len, sX, sY;
		var canX = self.stage.getCanvas().getWidth(), canY = self.stage.getCanvas().getHeight();
		console.log(canX,canY);
		self.fractalCount = 0;
		self.doTrees.graphics.clear();
// self.doTrees.graphics.beginPath();
		for(i=0;i<15;++i){
			Math.random();
			sX = Math.random()*canX;
			sY = canY;
			self.recursiveTree(self.doTrees.graphics, 3+Math.round(Math.random()*8.0), sX,sY, Math.PI*0.5, canY*0.009);
		}
// self.doTrees.graphics.endPath();
// self.doTrees.graphics.strokeLine();		
	}
	this.recursiveTree = function(gr,n, pX,pY, ang, sca){
		var th = Math.PI*2*0.05+(Math.random()*0.08);
		var len = n*(sca + Math.random()*6.0);
		var lX = len*Math.cos(ang);
		var lY = len*Math.sin(ang);
		var nX = pX + lX;
		var nY = pY - lY;
		if(n>1){
			self.recursiveTree(gr,n-1, nX,nY, ang+th, sca);
			self.recursiveTree(gr,n-1, nX,nY, ang-th, sca);
		}
		gr.setLine(n*1.5,0x000300FF);
		gr.beginPath();
		gr.moveTo(pX,pY);
		gr.lineTo(nX,nY);
		gr.endPath();
		gr.strokeLine();
	}
	this.fractalIncrement = function(){
		/*var canX = self.stage.getCanvas().getWidth(), canY = self.stage.getCanvas().getHeight();
		self.doTrees.graphics.beginPath();
		self.doTrees.graphics.moveTo(Math.random()*canX,Math.random()*canY);
		self.doTrees.graphics.lineTo(Math.random()*canX,Math.random()*canY);
		self.doTrees.graphics.endPath();
		self.doTrees.graphics.strokeLine();*/
	}
	this.canvasResizeFxn = function(s){
		var i, len;
		self.doSky.graphics.clear();
		self.doSky.graphics.beginPath();
		self.doSky.graphics.setLine(0,0);
		self.doSky.graphics.setLinearFill(0,0, 0,s.y, 0.0,0xBB5500FF, 0.5,0x772200FF, 1.0,0x330011FF);
		self.doSky.graphics.moveTo(0,0);
		self.doSky.graphics.lineTo(s.x,0);
		self.doSky.graphics.lineTo(s.x,s.y);
		self.doSky.graphics.lineTo(0,s.y);
		self.doSky.graphics.lineTo(0,0);
		self.doSky.graphics.endPath();
		self.doSky.graphics.fill();
		self.doSky.graphics.strokeLine();
		//
		var cX = s.x*0.5, cY = s.y*0.5;
		var rad = Math.sqrt(cX*cX+cY*cY);
		self.doSun.graphics.clear();
		self.doSun.graphics.beginPath();
		self.doSun.graphics.setLine(0,0);
		self.doSun.graphics.setRadialFill(cX,cY,0, cX,cY,rad, 0.0,0xFF000000, 0.5,0x33001144, 1.0,0x110000CC);
		self.doSun.graphics.moveTo(0,0);
		self.doSun.graphics.lineTo(s.x,0);
		self.doSun.graphics.lineTo(s.x,s.y);
		self.doSun.graphics.lineTo(0,s.y);
		self.doSun.graphics.lineTo(0,0);
		self.doSun.graphics.endPath();
		self.doSun.graphics.fill();
		self.doSun.graphics.strokeLine();
		//
		rad = rad*0.33;
		self.doOrb.graphics.clear();
		self.doOrb.graphics.beginPath();
		self.doOrb.graphics.setLine(4.0,0xFFFFCC66);
		self.doOrb.graphics.setLinearFill(0,-rad, 0,rad, 0.0,0xFFFFCCFF, 1.0,0xFFEE99FF);
		self.doOrb.graphics.arc(0,0, rad, 0,Math.PI*2, 'cw');
		self.doOrb.graphics.endPath();
		self.doOrb.graphics.fill();
		self.doOrb.graphics.strokeLine();
		self.doOrb.matrix.identity();
		self.doOrb.matrix.translate(s.x*0.5,s.y*0.75);
		//
		var top = s.y*0.5;
		var rW, rH, rX, rY;
		self.doCity.graphics.clear();
		self.doCity.graphics.setLine(1.0,0x22111166);
		self.doCity.graphics.setLinearFill(0,0, 0,s.y, 0.0,0x330000FF, 1.0,0x0C0000FF);
		len = Math.floor(s.x*0.070);
		for(i=0;i<len;++i){
		self.doCity.graphics.beginPath();
			rW = s.x*0.01+20+Math.random()*50;
			rH = top*(0.05+Math.random()*0.95) + Math.random()*50;
			rX = Math.random()*s.x - rW*0.5;
			rY = s.y;
			self.doCity.graphics.moveTo(rX,rY);
			self.doCity.graphics.lineTo(rX+rW,rY);
			self.doCity.graphics.lineTo(rX+rW,rY-rH);
			self.doCity.graphics.lineTo(rX,rY-rH);
			self.doCity.graphics.lineTo(rX,rY);
		self.doCity.graphics.endPath();
		self.doCity.graphics.fill();
		self.doCity.graphics.strokeLine();
		}
		//
		self.fractalBegin();
	}
	this.resource = new Resource();
	this.resource.setFxnComplete(this.constructor);
	this.resource.load();
}

/*
order array from [smallest .. largest] = [0 1 .. n-1 n]
	outer loop - first descision
		place 1st object
		inner loop
			push-pop scenarios
		end
		set last at first: [n-1 0 1 .. n-2]
	end

PLACEMENT:
	decide to occupy top-left corner of smallest available area
		-> this results in a vertical/horizontal slice
		-> 
	keep track of 'free'-areas


DESCISION:
	splitting of area(s) into 2 mut-ex segments - horizontal or vertical cut
	choose to split the area that results in the largest area + whatever
	
BACK-TRACK:
	if out of all available spaces, there isn't 1 large enough (in w and h) to fit the smallest 
	cannot fit current rect into current memory segments
	* rotate array (placement order) <arr>
	* swap memory tracking <v/h>
	* swap best placement <tl, tr, bl, br>
*) 
*) 
*) 
*) 
*/