// Hot.js

function Hot(){
	this.handleLoaded();
}
Hot.prototype.handleLoaded = function(){
	this._canvas = new Canvas(null,600,400,Canvas.STAGE_FIT_FILL);
	this._stage = new Stage(this._canvas, 1000/20);
	this._keyboard = new Keyboard();
	this._root = new DO();
	this._stage.addChild(this._root);
this._root.matrix().translate(100,400);
	this.addListeners();
	this._refreshDisplay();
}
Hot.prototype.addListeners = function(){
	this._canvas.addFunction(Canvas.EVENT_WINDOW_RESIZE,this.handleCanvasResizeFxn,this);
	this._stage.addFunction(Stage.EVENT_ON_ENTER_FRAME,this.handleStageEnterFrameFxn,this);
	this._keyboard.addFunction(Keyboard.EVENT_KEY_UP, this.handleKeyUpFxn,this);
	this._keyboard.addFunction(Keyboard.EVENT_KEY_DOWN, this.handleKeyDownFxn,this);
	this._keyboard.addFunction(Keyboard.EVENT_KEY_STILL_DOWN, this.handleKeyDown2Fxn,this);
	this._canvas.addListeners();
	this._stage.addListeners();
	this._keyboard.addListeners();
	this._stage.start();
}
Hot.prototype._refreshDisplay = function(){
	console.log("refresh");
	if(!this._device){
		this._displayScale = 20;
		this._device = { "location":new V2D(4,1), "distance":0, "prevLocation":new V2D(), "prevDistance":0}
		this._halfPlanes = [];//
		this._beacons = [
							{ "location": new V2D(2,2) }
						];
	}
	var i, j, plane, a, b, c, o, d, p, beacon, beacons=this._beacons, device=this._device, planes=this._halfPlanes;
	this._displayScale = 100.0;
	this._root.graphics().clear();
	for(i=0; i<beacons.length; ++i){
		beacon = beacons[i];
		this.drawDot( V2D.scale(beacon.location,this._displayScale), 0x99FF0000,0xFFFF0000, 3.0);
		//this.drawDot( V2D.scale(beacon.location,this._displayScale), 0x11FF00FF,0x99FF00FF, V2D.distance(beacon.location,phone.location)*this._displayScale );
		//this.drawDot( V2D.scale(beacon.location,this._displayScale), 0x1199CC00,0x9966CC00, beacon.distance*this._displayScale );
	}
	for(i=0; i<planes.length; ++i){
		plane = planes[i];
		o = V2D.copy(plane.org);
		d = V2D.copy(plane.dir);
		o.scale(this._displayScale);
		d.scale(this._displayScale);
		p = V2D.rotate(d, -Math.PI*0.5);
		p.scale(1.0);
		var a = V2D.sub(o,p);
		var b = V2D.add(o,p);
		this.drawLine( a,b, 0x99FF0000 ); // norm
		a = V2D.add(o,d);
		this.drawLine( o,a, 0x9966CC33 ); // plane
	}
	// POLYGON FROM LIST OF PLANES
	// start off with bounding box at infinty defined by 4 points (CW)
	var boxCenter = new V2D(0,0), boxWidth = 1E4, boxHeight = 1E6;
	//var boxCenter = new V2D(6,2.5), boxWidth = 5, boxHeight = 2;
	var boxTL = new V2D(boxCenter.x-boxWidth, boxCenter.y+boxHeight);
	var boxTR = new V2D(boxCenter.x+boxWidth, boxCenter.y+boxHeight);
	var boxBR = new V2D(boxCenter.x+boxWidth, boxCenter.y-boxHeight);
	var boxBL = new V2D(boxCenter.x-boxWidth, boxCenter.y-boxHeight);
	var polygon = [boxTL,boxTR,boxBR,boxBL]; // CW
	for(i=0;i<planes.length;++i){
		plane = planes[i];
		var dropIndexStart = -1;
		var dropIndexStop = -1;
		var dropIndexForward = true;
		var intList = [];
		for(j=0;j<polygon.length;++j){
			a = polygon[j];
			b = polygon[(j+1)%polygon.length];
			c = plane.org;
			d = V2D.rotate(plane.dir, -Math.PI*0.5);
			d = V2D.add(c,d);
			var intersection = Code.lineSegLineIntersect2D(a,b, c,d);
			if(intersection){
// WEIRDNESS IF LINES ARE PARALLEL  AND  PERP+share a point
				console.log("PLANE INTERSECTION: "+intersection+"   "+a+","+b);
				if(intList.length>0){
					if(intersection.x==intList[0].x && intersection.y==intList[0].y){
						console.log("CONTINUE");
						continue;
					}
				}
				intList.push( new V2D(intersection.x,intersection.y) );
				var dot = V2D.dot(plane.dir, V2D.sub(a, plane.org) ); //
				if(dot==0){
					dot = -V2D.dot(plane.dir, V2D.sub(b, plane.org) );
				}
				console.log("dot: "+dot);
				if(dropIndexStart>=0){
					//if(dot<0){ dropIndexForward=false; }
					//if(dot>=0){ // keep b
					if(dropIndexForward){
						dropIndexStop = j; // drop a
					}else{
						dropIndexStop = j+1; // drop b
					}
					break;
				}else{
					if(dot<0){ dropIndexForward=false; }
					if(dropIndexForward){ // keep a
						dropIndexStart = j+1; // drop b
					}else{
						dropIndexStart = j; // drop a
					}
				}
			}
		}
		if(dropIndexStart>=0 && dropIndexStop>=0 && intList.length>0){
			dropIndexStart = dropIndexStart%polygon.length;
			dropIndexStop = dropIndexStop%polygon.length;
			console.log("dropping: "+dropIndexStart+" -> "+dropIndexStop);
			// if(dropIndexStart>dropIndexStop){
			// 	console.log("FLIP");
			// }
			console.log("A: "+polygon);
			if(dropIndexForward){
console.log("-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-= FORWARD");
				console.log(" "+dropIndexStart+" "+(dropIndexStop-dropIndexStart+1) );
				polygon.splice(dropIndexStart,dropIndexStop-dropIndexStart+1);
				console.log("2: "+polygon);
				Code.arrayInsertArray(polygon, dropIndexStart, intList);
			}else{ // reverse
console.log("-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-= REVERSE");
				polygon.splice(0,dropIndexStart+1);
				console.log("2: "+polygon);
				intList = intList.reverse();
				if(dropIndexStart!=dropIndexStop){ // drop multiple
					if(dropIndexStart>dropIndexStop){
						console.log("flip");
						a = dropIndexStart;
						dropIndexStart = dropIndexStop;
						dropIndexStop = a;
// FINISHED?
						//polygon.splice(dropIndexStart,dropIndexStop-dropIndexStart+1);
						Code.arrayInsertArray(polygon, dropIndexStart, intList);
					}else{
						console.log("norm: "+dropIndexStop+" "+(polygon.length-dropIndexStop+1));
						polygon.splice(dropIndexStop-dropIndexStart-1,polygon.length-dropIndexStop+1);
						console.log("3: "+polygon);
						//Code.arrayInsertArray(polygon, polygon.length-1, intList);
						Code.arrayUnshiftArray(polygon, intList);
						//Code.arrayPushArray(intList, polygon);
					}
				}else{ // drop single
					console.log("sngle");
					Code.arrayInsertArray(polygon, dropIndexStart, intList);
				}
			}
			console.log("B: "+polygon);
		}
	}
	// if resulting polygon does not contain a point on a given half plane - discard the half plane from the set
	//
	for(i=0;i<polygon.length;++i){
		a = V2D.copy(polygon[i])
		b = V2D.copy(polygon[(i+1)%polygon.length]);
		a.scale(this._displayScale);
		b.scale(this._displayScale);
		this.drawLine(a,b, 0xFF0033CC); // intersection with disaply rect?
	}
	//
	this.drawDot( V2D.scale(device.location,this._displayScale), 0xFF0000FF,0xFF000099, 5.0);
	//this.drawDot( V2D.scale(calculated.location,this._displayScale), 0x9900FF00,0xCC009900, 3.0);
	
}
Hot.prototype._checkPositions = function(){
	var i, len;
	var beacons = this._beacons;
	var beacon = beacons[0];
	var device = this._device;
	device.distance = V2D.distance(device.location,beacon.location);
	// .. 
	len = beacons.length;
	for(i=0;i<len;++i){
		//
	}
}
Hot.prototype._checkDelta = function(){
	var prev = new V2D().copy(this._device.prevLocation);
	var next = new V2D().copy(this._device.location);
	var dir = V2D.sub(next,prev);
	var prevDist = this._device.prevDistance;
	var nextDist = this._device.distance;
	var deltaDistance = nextDist - prevDist;
	var minDelta = Math.max(prevDist,nextDist)*0.0001; // some statistically significant change is distance
	var o, d;
	console.log(prev+" -> "+next)
	console.log(deltaDistance,minDelta);
	if( Math.abs(deltaDistance)>minDelta ){
		d = V2D.copy(dir).norm();
		if(deltaDistance<0){ // closer
			o = prev;
			d.scale(1.0);
		}else{ // further
			o = next;
			d.scale(-1.0);
		}
		this._halfPlanes.push( {"org":o, "dir":d} );
		// set to new
		this._moveOver();
	}
}
Hot.prototype._moveOver = function(){
	this._device.prevLocation.copy(this._device.location);
	this._device.prevDistance = this._device.distance;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
Hot.prototype.handleCanvasResizeFxn = function(e){
	//this._root.matrix().identity();
	//this._root.matrix().translate(0.0,e.y);
}
Hot.prototype.handleStageEnterFrameFxn = function(e){
	//console.log(e);
}
Hot.prototype.handleKeyUpFxn = function(e){
	// 
}
Hot.prototype.handleKeyDownFxn = function(e){
	var dist = 0.5;
	//var err = 0.1;
	if(e.keyCode==Keyboard.KEY_LET_Z){
		//this._errorDistance -= err;
		//this._errorDistance = Math.max(0,this._errorDistance);
	}else if(e.keyCode==Keyboard.KEY_LET_X){
		//this._errorDistance += err;
	}else if(e.keyCode==Keyboard.KEY_LEFT){
		this._device.location.x -= dist;
	}else if(e.keyCode==Keyboard.KEY_RIGHT){
		this._device.location.x += dist;
	}else if(e.keyCode==Keyboard.KEY_UP){
		this._device.location.y += dist;
	}else if(e.keyCode==Keyboard.KEY_DOWN){
		this._device.location.y -= dist;
	}else if(e.keyCode==Keyboard.KEY_ENTER){
		this._checkDelta();
	}else if(e.keyCode==Keyboard.KEY_SPACE){
		this._moveOver();
	}
	this._checkPositions();
	this._refreshDisplay();
}
Hot.prototype.handleKeyDown2Fxn = function(e){
	// 
}
Hot.prototype.handle = function(e){
	console.log(e);
}
Hot.prototype.drawLine = function(globalA, globalB, lin){ // flip y
	this._root.graphics().setLine(1.0,lin?lin:0xFFFF0000);
	this._root.graphics().beginPath();
	this._root.graphics().moveTo(globalA.x,-globalA.y);
	this._root.graphics().lineTo(globalB.x,-globalB.y);
	this._root.graphics().endPath();
	this._root.graphics().strokeLine();
}
Hot.prototype.drawDot = function(global, col, lin, rad){ // flip y
	this._root.graphics().setLine(1.0,lin?lin:0xFFFF0000);
	this._root.graphics().setFill(col?col:0x9900FF00);
	this._root.graphics().beginPath();
	this._root.graphics().drawCircle(global.x,-global.y, rad?rad:5.0);
	this._root.graphics().endPath();
	this._root.graphics().fill();
	this._root.graphics().strokeLine();
}
