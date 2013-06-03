// RectanglePacking.js


function RectanglePacking(){
	var self = this;
	this.addListeners = function(){
		this.resource.addListeners();
		this.canvas.addListeners();
		this.stage.addListeners();
		this.keyboard.addListeners();
		this.canvas.addFunction(Canvas.EVENT_WINDOW_RESIZE,this.canvasResizeFxn);
		this.stage.addFunction(Stage.EVENT_ON_ENTER_FRAME,this.stageEnterFrameFxn);
		/*
		this.stage.addFunction(Stage.EVENT_ON_EXIT_FRAME,this.stageExitFrameFxn);
		this.canvas.addFunction(Canvas.EVENT_MOUSE_CLICK,this.canvasClickFxn);
		this.keyboard.addFunction(Keyboard.EVENT_KEY_UP,this.keyUpFxn);
		this.keyboard.addFunction(Keyboard.EVENT_KEY_DOWN,this.keyDownFxn);*/
		this.resource.alertLoadCompleteEvents();
		this.stage.start();
	};
	this.constructor = function(){
		self.canvas = new Canvas(self.resource,null,600,300,Canvas.STAGE_FIT_FILL);
		self.stage = new Stage(self.canvas, 1000/500);
		self.keyboard = new Keyboard();
		self.resource.alertLoadCompleteEvents();
		//
		self.doRoot = new DO();
		self.stage.addChild(self.doRoot);
		self.calc();
		self.addListeners();
	}
	this.rectangleBound = null;
	this.rectangleList = null;
	this.rectangleDOList = null;
	this.rectangleDOBound = null;
	this.rectangleContainer = null;
	this.calc = function(){
		var bound = new Rect(0,0, 400,400);
		var rectList = new Array();
		var r;
		// TOP
		//r = new Rect(0,0, 100,200); r.mass = -1;
		//rectList.push( r );
		/*
		rectList.push( new Rect(0,0, 200,200) );
		rectList.push( new Rect(0,0, 150,150) );
		rectList.push( new Rect(0,0, 100,150) );
		rectList.push( new Rect(0,0, 50,100) );
		rectList.push( new Rect(0,0, 150,100) );
		rectList.push( new Rect(0,0, 100,200) );
		// // //
		rectList.push( new Rect(0,0, 50,50) );
		rectList.push( new Rect(0,0, 10,50) );
		rectList.push( new Rect(0,0, 50,50) );
		rectList.push( new Rect(0,0, 60,60) );
		rectList.push( new Rect(0,0, 50,50) );
		rectList.push( new Rect(0,0, 50,20) );
		rectList.push( new Rect(0,0, 20,20) );
		*/
		for(i=0;i<50;++i){
			rectList.push( new Rect(0,0, 
				10+Math.round(Math.random()*90),
				10+Math.round(Math.random()*90) ) );
				//10+,
				//10+Math.round((Math.random()*50))
		}
		//
		var i, len = rectList.length;
		var area = 0;
		for(i=0;i<len;++i){
			// rectList[i].x( (bound.width()-rectList[i].width())*0.5 );
			// rectList[i].y( (bound.height()-rectList[i].height())*0.5 );
			// rectList[i].x( rectList[i].x()+Math.random() - 0.5);
			// rectList[i].y( rectList[i].y()+Math.random() - 0.5);
			rectList[i].x( (bound.width()-rectList[i].width())*Math.random() );
			rectList[i].y( (bound.height()-rectList[i].height())*Math.random() );
			rectList[i].vel = new V2D(0,0);
			if( !rectList[i].mass ){
				rectList[i].mass = rectList[i].area();
			}
			//rectList[i].mass = rectList[i].mass*rectList[i].mass;
			//console.log( rectList[i].x() + "," + rectList[i].y() );
			area += rectList[i].area();
		}
		// rectList[0].x(0); rectList[0].y(0);
		// rectList[1].x(200); rectList[1].y(0);
		// rectList[2].x(0); rectList[2].y(200);
		// rectList[3].x(350); rectList[3].y(0);
		//
		console.log( area + " / " + bound.area() +" = " + (area/bound.area()) );
		if(area > bound.area()){
			window.location = window.location;
		}
		var doContainer = new DO();
		self.doRoot.addChild( doContainer );
		var doBound = self.doFromRect( bound, 0xFF,0x00,0x00,0xFF, 0.75);
		doContainer.addChild(doBound);
		var doList = new Array();
		for(i=0;i<len;++i){
			doList[i] = self.doFromRect(rectList[i], 0xFF,0xFF,0x00,0xFF, 0.25)
			doBound.addChild( doList[i] );
		}
		self.rectangleBound = bound;
		self.rectangleList = rectList;
		self.rectangleDOList = doList;
		self.rectangleDOBound = doBound;
		self.rectangleContainer = doContainer;
	};
	this.stageEnterFrameFxn = function(e){
		if( self.iteration() ){
			return;//this.stage.removeFunction(Stage.EVENT_ON_ENTER_FRAME,this.stageEnterFrameFxn);
		}
		self.visualsFromData();
		var limit = self.rectangleList.length*self.rectangleList.length;
		console.log(limit);
		if(e==limit){
			window.location = window.location;
		}
	}
	this.iteration = function(){
		var i, j, arr=self.rectangleList, len=arr.length;
		var v=new V2D(), dist=0, rA, rB;
		var prop;
		for(i=0;i<len;++i){
			rA = arr[i]; rA.vel.x = 0; rA.vel.y = 0;
		}
		var touch = false;
		for(i=0;i<len;++i){
			rA = arr[i];
			for(j=i+1;j<len;++j){
				rB = arr[j];
				if( self.overlap(rA,rB) ){
					touch = true;
					prop = 1E-3;
				}else{
					prop = 1E-7;
				}
				v.x = (rB.x()+rB.width()*0.5) - (rA.x()+rA.width()*0.5); // center-to-center
				v.y = (rB.y()+rB.height()*0.5) - (rA.y()+rA.height()*0.5);
				//console.log(v.x+","+v.y);
/*
				if(v.length()<0.1){
					v.x = -1;
					v.y = -1;
				}
*/

				v.norm();
				dist = v.length();
				dist = Math.max(dist,1E-6);
				//console.log(dist);
				dist = dist * dist;
				// rA.vel.x -= prop*v.x/(dist*rA.mass);
				// rA.vel.y -= prop*v.y/(dist*rA.mass);
				// rB.vel.x += prop*v.x/(dist*rB.mass);
				// rB.vel.y += prop*v.y/(dist*rB.mass);
				var m = rA.mass*rB.mass;
				// rA.vel.x -= rB.mass*prop*v.x/(dist*rA.mass);
				// rA.vel.y -= rB.mass*prop*v.y/(dist*rA.mass);
				// rB.vel.x += rA.mass*prop*v.x/(dist*rB.mass);
				// rB.vel.y += rA.mass*prop*v.y/(dist*rB.mass);
				// rA.vel.x -= rB.mass*prop*v.x/(dist*1);
				// rA.vel.y -= rB.mass*prop*v.y/(dist*1);
				// rB.vel.x += rA.mass*prop*v.x/(dist*1);
				// rB.vel.y += rA.mass*prop*v.y/(dist*1);
				// rA.vel.x -= rA.mass*prop*v.x/(dist*1);
				// rA.vel.y -= rA.mass*prop*v.y/(dist*1);
				// rB.vel.x += rB.mass*prop*v.x/(dist*1);
				// rB.vel.y += rB.mass*prop*v.y/(dist*1);
				rA.vel.x -= rB.mass*prop*v.x/(dist*1);
				rA.vel.y -= rB.mass*prop*v.y/(dist*1);
				rB.vel.x += rA.mass*prop*v.x/(dist*1);
				rB.vel.y += rA.mass*prop*v.y/(dist*1);
			}
			//console.log(rA.vel.x+","+rA.vel.y);
		}
		if(!touch){
			return true;
		}
		for(i=0;i<len;++i){
			rA = arr[i];
			// clamp 1 pixel at a time
				// if(v.x>0){ v.x=1; }
				// else if(v.x<0){ v.x=-1; }
				// if(v.y>0){ v.y=1; }
				// else if(v.y<0){ v.y=-1; }
			rA.x( rA.x() + rA.vel.x ); rA.y( rA.y() + rA.vel.y );
			//console.log(rA.vel.x +","+ rA.vel.y );
			if( rA.x() < self.rectangleBound.x() ){
				rA.x( self.rectangleBound.x() );
				rA.vel.x = 0;
			}else if( rA.x() > self.rectangleBound.x()+self.rectangleBound.width()-rA.width() ){
				rA.x( self.rectangleBound.x()+self.rectangleBound.width()-rA.width() );
				rA.vel.x = 0;
			}
			if( rA.y() < self.rectangleBound.y() ){
				rA.y( self.rectangleBound.y() );
				rA.vel.y = 0;
			}else if( rA.y() > self.rectangleBound.y()+self.rectangleBound.height()-rA.height() ){
				rA.y( self.rectangleBound.y()+self.rectangleBound.height()-rA.height() );
				rA.vel.y = 0;
			}
			//rA.x( Math.min( Math.max( self.rectangleBound.x(), rA.x() ), self.rectangleBound.x()+self.rectangleBound.width()-rA.width() ) );
			//rA.y( Math.min( Math.max( self.rectangleBound.y(), rA.y() ), self.rectangleBound.y()+self.rectangleBound.height()-rA.height() ) );
			//rA.vel.x *= 0.5; rA.vel.y *= 0.5;
		}
		return false;
	}
	this.overlap = function(a,b){
		//if( a.x()<b.x() && b.x()< ){
			//
			// a.x()<b.x() && (a.x()+a.width())>b.x()
		// if( (a.x()<b.x() && (a.x()+a.width())>=b.x()) || (a.x()>=b.x() && (b.x()+b.width())>=a.x()) ){
		// 	if( (a.y()<=b.y() && (a.y()+a.height())>=b.y()) || (b.y()<=a.y() && (b.y()+b.height())>=a.y()) ){
		// 		//console.log(true);
		// 		return true;
		// 	}
		// }
		if( !(a.x()+a.width()<b.x() || a.x()>b.x()+b.width()) ){
			if( !(a.y()+a.height()<b.y() || a.y()>b.y()+b.height()) ){
				return true;
			}
		}
		return false;
	}
	this.visualsFromData = function(){
		var i, len = self.rectangleList.length;
		for(i=0;i<len;++i){
			self.rectangleDOList[i].matrix.identity();
			self.rectangleDOList[i].matrix.translate( self.rectangleList[i].x(), self.rectangleList[i].y() );
		}
	}
	this.canvasResizeFxn = function(e){
		self.rectangleDOBound.matrix.identity();
		self.rectangleDOBound.matrix.translate((e.x-self.rectangleBound.width())*0.5,(e.y-self.rectangleBound.height())*0.5);
		//console.log(self.canvas.getWidth()+","+self.canvas.getHeight());
	}
	this.doFromRect = function( r, re,gr,bl,al, sc){
		sc = sc?sc:0.5;
		var d = new DO();
		d.graphicsIllustration.clear();
		var col = Code.getColRGBA(re, gr, bl, al);
		d.graphicsIllustration.setLine(1.0,col);
		col = Code.getColRGBA(re, gr, bl, Math.floor(al*sc));
		d.graphicsIllustration.setFill(col);
		d.graphicsIllustration.beginPath();
		var wasX = r.x(), wasY = r.y(); r.x(0); r.y(0);
		d.graphicsIllustration.moveTo(r.x(),r.y());
		d.graphicsIllustration.lineTo(r.x()+r.width(),r.y());
		d.graphicsIllustration.lineTo(r.x()+r.width(),r.y()+r.height());
		d.graphicsIllustration.lineTo(r.x(),r.y()+r.height());
		d.graphicsIllustration.lineTo(r.x(),r.y());
		r.x(wasX); r.y(wasY);
		d.graphicsIllustration.endPath();
		d.graphicsIllustration.fill();
		d.graphicsIllustration.strokeLine();
		return d;
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