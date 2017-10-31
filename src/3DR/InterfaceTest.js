// InterfaceTest.js

function InterfaceTest(){
	this._canvas = new Canvas(null,0,0,Canvas.STAGE_FIT_FILL, false,false);
	this._stage = new Stage(this._canvas, 1000/20);
	this._root = new DO();
	this._stage.addChild(this._root);
	this._canvas.addListeners();
	this._stage.addListeners();
	this._stage.start();
	// this._canvas.addFunction(Canvas.EVENT_MOUSE_CLICK,this.handleMouseClickFxn,this);
	this._canvas.addFunction(Canvas.EVENT_MOUSE_MOVE,this._handleMouseMoveFxn,this);
	this._keyboard = new Keyboard();
	// this._keyboard.addFunction(Keyboard.EVENT_KEY_UP,this.handleKeyboardUp,this);
	// this._keyboard.addFunction(Keyboard.EVENT_KEY_DOWN,this._handleKeyboardDown,this);
	// this._keyboard.addFunction(Keyboard.EVENT_KEY_STILL_DOWN,this.handleKeyboardStill,this);
	// this._keyboard.addListeners();
	// this._ticker = new Ticker(1);
	// this._ticker.addFunction(Ticker.EVENT_TICK, this.handleTickerFxn, this);
	// this._tickCount = 0;
	this.generate();
	
}
InterfaceTest.prototype._handleMouseMoveFxn = function(e){
	var location = e["location"];
//	console.log(location+"");
	var scale = 0.1;
	this._positionOffset.set(location.x*scale,location.y*scale);

	this.generateFrame();
}
InterfaceTest.prototype.generate = function(imageInfo){
	console.log("generate");
	this._positionOffset = new V2D();
	var d = new DO();
		d.graphics().clear();
		d.graphics().setFill(0xFF000000);
		//d.graphics().setLine(1.0, 0xCC990000);
		d.graphics().beginPath();
		d.graphics().drawPolygon([new V2D(-10,-10),new V2D(1E6,-10),new V2D(1E6,1E6),new V2D(-10,1E6),],true);
		d.graphics().endPath();
		d.graphics().fill();
		d.graphics().strokeLine();
	this._root.addChild(d);

	var display = new DO();
	this._root.addChild(display);
	this._display = display;
	this.generateFrame();
}
InterfaceTest.prototype.generateFrame = function(){
	var display = this._display;
	display.removeAllChildren();

	var hexigonSize = 20;
	var hexigonSizeInner = 18;
	var availableWidth = this._canvas.width();
	var availableHeight = this._canvas.height();

	var hexigonPerimeterWidth = hexigonSize*( 1 + 2*Math.cos(Code.radians(60)) );
	var hexigonPerimeterHeight = hexigonSize*( 2*Math.sin(Code.radians(60)) );

//	console.log("bb: "+hexigonPerimeterWidth+"x"+hexigonPerimeterHeight);

	var hexigonCountWidth = Math.ceil( availableWidth/hexigonPerimeterWidth );
	var hexigonCountHeight = 2*Math.ceil( availableHeight/hexigonPerimeterHeight );
		hexigonCountWidth = Math.floor(hexigonCountWidth/8);
		hexigonCountHeight = Math.floor(hexigonCountHeight/8);
		hexigonCountWidth = 4;
		hexigonCountHeight = 8;
		console.log(hexigonCountWidth,hexigonCountHeight);
	var center = new V2D(availableWidth*0.5,availableHeight*0.5);

	var i, j;
	for(j=-hexigonCountHeight; j<hexigonCountHeight; ++j){
		//console.log(j%2)
		for(i=-hexigonCountWidth; i<hexigonCountWidth; ++i){
			//var hex = new V2D(i*(hexigonPerimeterWidth+hexigonSize),j*hexigonPerimeterHeight*0.5);
			var hex = new V2D(i*(hexigonPerimeterWidth+hexigonSize),j*hexigonPerimeterHeight*0.5);
			if( Math.abs(j%2)==1){
				hex.x += hexigonSize*1.5;
			}
			//var offset = V2D.sub(hex,center);
			var offset = hex;
			//var offset = center;
			//var offset = new V2D();
			//console.log(center+"")
			//console.log(offset);
			offset.add(this._positionOffset);
			//offset.add(-availableWidth*0.1,-availableHeight*0.1);
			//console.log(offset+"")
			var d = InterfaceTest.hexigonDO(hexigonSizeInner, offset);
			//d.matrix().translate(offset.x,offset.y);
			d.matrix().translate(center.x,center.y);
			display.addChild(d);
			
		}
	}
}
InterfaceTest.rbf = function(radius){
	//return radius*radius;
	//return Math.pow(radius*0.1,3.0);
	// return radius;
	// var scale = 0.01;
	// return Math.exp(radius*scale);
	// var value = 1.0/
	// return Math.exp(radius*scale);

	// 
	//radius = radius * 1E0;
	// radius += 0.01;
	// var limitX = 2000.0;
	// if(radius>limitX){
	// 	radius = limitX;
	// }
	
	//var val = -100000.0/(radius-limitX);
	//val = 100.0*Math.exp(Math.pow(radius*0.001,2));
	//console.log(val)
	//val = radius + 10.0*Math.pow(radius,1.5);
	//radius 
	val = radius + 0.01*Math.exp(radius*0.10);
	val = val * 5.0;
	if(val<0){
		val = 0;
	}
	if(val>1E8){
		val = 1E8;
	}
	return 2.0*val;
	// 
	// spherical projection:
	var scale = 10.0;
	var R = 10;
	var D = 100;
	//var theta = Math.atan2(radius,D);
	var theta = Math.atan2(D,radius);
	//var q = R * Math.sin(theta);
	var q = R * Math.cos(theta);
	//q = Math.sqrt(q);
	//q = Math.pow(q,2);
	q = q * scale;
	q = q * Math.pow(radius*0.01,0.25);
	return q;

	// // spherical projection:
	// var scale = 20.0;
	// var R = 10;
	// var D = 100;
	// //var theta = Math.atan2(radius,D);
	// var theta = Math.atan2(D,radius);
	// var q = R * Math.cos(theta);
	// q = q * scale;
	// return q;

	/*
	radius = radius * 0.00001;
	var scale = 1000.0;
	var sphere = 10000.0;
	//var val = scale/(sphere - radius*radius);
	//var val = scale/(sphere - radius);
	var val = scale/(sphere - radius);
	if(val<0){
		val = 0;
	}
	if(val>1E6){
		val = 1E6;
	}
	val = Math.sqrt(val);
	return val;
	*/
}
InterfaceTest.hexigon = function(size, offset){
	var overallScale = 1.0;
	var widthX = size*Math.cos(Code.radians(60));
	var heightY = 2.0*size*Math.sin(Code.radians(60));
	var poly = [];
	poly.push( new V2D(-(widthX+size*0.5), 0) );
	poly.push( new V2D(-(size*0.5), (heightY*0.5)) );
	poly.push( new V2D( (size*0.5), (heightY*0.5)) );
	poly.push( new V2D( (widthX+size*0.5), 0) );
	poly.push( new V2D( (size*0.5),-(heightY*0.5)) );
	poly.push( new V2D(-(size*0.5),-(heightY*0.5)) );
	poly.push( new V2D(-(widthX+size*0.5), 0) );
	for(var i=0; i<poly.length; ++i){
		poly[i].add(offset);
		var radius = poly[i].length();
		var scale = InterfaceTest.rbf(radius);
		poly[i].scale((scale/radius) * overallScale);
		//poly[i].add(offset);
	}
	return poly;
}
InterfaceTest.hexigonDO = function(size, offset){
	var d = new DO();
	var poly = InterfaceTest.hexigon(size, offset);
	d.graphics().clear();
	d.graphics().setFill(0xCC330000);
	d.graphics().setLine(1.0, 0xCCCC0000);
	d.graphics().beginPath();
	d.graphics().drawPolygon(poly,true);
	d.graphics().endPath();
	d.graphics().fill();
	d.graphics().strokeLine();
	return d;
}

