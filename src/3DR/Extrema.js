// Extrema.js


function Extrema(){
	this._canvas = new Canvas(null,0,0,Canvas.STAGE_FIT_FILL, false,false);
	this._stage = new Stage(this._canvas, 1000/20);
	this._root = new DO();
	this._stage.addChild(this._root);
	this._canvas.addListeners();
	this._stage.addListeners();
	this._stage.start();
	this._canvas.addFunction(Canvas.EVENT_MOUSE_CLICK,this.handleMouseClickFxn,this);
	// resources
	this._resource = {};
	// 3D stage
	this._keyboard = new Keyboard();
	this._keyboard.addFunction(Keyboard.EVENT_KEY_UP,this.handleKeyboardUp,this);
	this._keyboard.addFunction(Keyboard.EVENT_KEY_DOWN,this.handleKeyboardDown,this);
	this._keyboard.addFunction(Keyboard.EVENT_KEY_STILL_DOWN,this.handleKeyboardStill,this);
	this._keyboard.addListeners();

	//this._simulate3D();
	// TESTING EXTREMA ALGORITHM
	this.testExtrema();
}
Extrema.prototype.testExtrema = function(){
	var i, j, value, index, c, d;
	var rows = 10;
	var cols = 10;
	var size = rows*cols;
	var source = new Array(size);
	for(i=0; i<size; ++i){
		var v = Code.randomFloat(1,2);
		source[i] = v;
	}
	source = Code.newArrayZeros(size);
	// source[5 + 5 * cols] = 1.0;
	// source[6 + 5 * cols] = -1.0;
	//source[5 + 4 * cols] = 1.0;
	// source[5 + 4 * cols] = 0.9;
	// source[5 + 5 * cols] = 1.0;
	// source[6 + 5 * cols] = -1.0;

	// source[4 + 4 * cols] = 3.0;		source[5 + 4 * cols] = 4.0;		source[6 + 4 * cols] = 5.9;
	// source[4 + 5 * cols] = 2.0;		source[5 + 5 * cols] = 6.0;		source[6 + 5 * cols] = 4.0;
	// source[4 + 6 * cols] = 1.0;		source[5 + 6 * cols] = 2.0;		source[6 + 6 * cols] = 3.0;
	// source[4 + 4 * cols] = 0.15;		source[5 + 4 * cols] = 0.171;		source[6 + 4 * cols] = 0.173;
	// source[4 + 5 * cols] = 0.10;		source[5 + 5 * cols] = 0.084;		source[6 + 5 * cols] = 0.086;
	// source[4 + 6 * cols] = 0.127;		source[5 + 6 * cols] = 0.125;		source[6 + 6 * cols] = 0.36;
	// this point lies outside
	// source[4 + 4 * cols] = 0.1493339386473007;		source[5 + 4 * cols] = 0.1715196129515702;		source[6 + 4 * cols] = 0.17326312762481005;
	// source[4 + 5 * cols] = 0.10375166114763062;		source[5 + 5 * cols] = 0.08443237408080274;		source[6 + 5 * cols] = 0.0863263776067152;
	// source[4 + 6 * cols] = 0.12751383099086844;		source[5 + 6 * cols] = 0.12449407779693042;		source[6 + 6 * cols] = 0.35858534419119875;

	// highly negative
	source[4 + 4 * cols] = 59.04314632546983;		source[5 + 4 * cols] = 87.8835858126867;		source[6 + 4 * cols] = 222.28943946215801;
	source[4 + 5 * cols] = 29.5914725521715030;		source[5 + 5 * cols] = 27.125555279339608;		source[6 + 5 * cols] = 271.72583636704775;
	source[4 + 6 * cols] = 69.73906681647878;		source[5 + 6 * cols] = 43.76996829874196;		source[6 + 6 * cols] = 382.22458883625865;
        

	for(i=0; i<size; ++i){
		var v = Code.randomFloat(1,2);
		source[i] *= 0.01;
	}

//Code.js:3962  0.1493339386473007 0.1715196129515702 0.17326312762481005 0.10375166114763062 0.08443237408080274 0.0863263776067152 0.12751383099086844 0.12449407779693042 0.35858534419119875 

	var extrema = Code.findExtrema2DFloat(source,cols,rows, true);
	var extrema2 = Code.findExtrema2DFloat(source,cols,rows, false);
	//console.log(source);
	//console.log(extrema);

var GLOBALSTAGE = this._stage;
var sizeX = 50;
var sizeY = 50;
var offsetX = 100;
var offsetY = 200;
var rowOffsetX = 25;
var rowOffsetY = 25;
	// data - col wize
	for(j=0; j<rows; ++j){
		var p = j/(rows-1);
		var pm1 = 1.0 - p;
		d = new DO();
		color = Code.getColARGBFromFloat(1.0,pm1,0.0,p);
		d.graphics().setLine(2.0, color);
		d.graphics().beginPath();
		for(i=0; i<cols; ++i){
			index = j*cols + i;
			value = source[index];
			if(i==0){
				d.graphics().moveTo(offsetX + j*rowOffsetX + sizeX*(i), offsetY + j*rowOffsetY - sizeY*(value));
			}else{
				d.graphics().lineTo(offsetX + j*rowOffsetX + sizeX*(i), offsetY + j*rowOffsetY - sizeY*(value));
			}
		}
		
		d.graphics().strokeLine();
		d.graphics().endPath();
		GLOBALSTAGE.addChild(d);
	}
	//
	// data - row-wise
	
	for(i=0; i<cols; ++i){
		var p = i/(rows-1);
		var pm1 = 1.0 - p;
		d = new DO();
		color = Code.getColARGBFromFloat(1.0,pm1,0.0,p);
		d.graphics().setLine(2.0, color);
		d.graphics().beginPath();
		for(j=0; j<rows; ++j){
			index = j*cols + i;
			value = source[index];
			if(j==0){
				d.graphics().moveTo(offsetX + j*rowOffsetX + sizeX*(i), offsetY + j*rowOffsetY - sizeY*(value));
			}else{
				d.graphics().lineTo(offsetX + j*rowOffsetX + sizeX*(i), offsetY + j*rowOffsetY - sizeY*(value));
			}
		}
		d.graphics().strokeLine();
		d.graphics().endPath();
		GLOBALSTAGE.addChild(d)
	}
			

	// extrema
	for(i=0; i<extrema.length; ++i){
		value = extrema[i];
		console.log(value+"");
		c = new DO();
		c.graphics().setLine(1.0, 0x99990000);
		d.graphics().setLine(2.0, color);
		c.graphics().beginPath();
		c.graphics().moveTo(offsetX + value.y*rowOffsetX + sizeX*(value.x), offsetY + value.y*rowOffsetY - sizeY*(0));
		c.graphics().lineTo(offsetX + value.y*rowOffsetX + sizeX*(value.x), offsetY + value.y*rowOffsetY - sizeY*(value.z));
		c.graphics().strokeLine();
		c.graphics().endPath();
		GLOBALSTAGE.addChild(c);
		//
		c = new DO();
		c.graphics().setLine(1.0, 0xFF990000);
		c.graphics().setFill(0xFFFF6666);
		c.graphics().beginPath();
		//c.graphics().drawCircle(sizeX*(value.x), -sizeY*(value.z), 5);
		c.graphics().drawCircle(offsetX + value.y*rowOffsetX + sizeX*(value.x), offsetY + value.y*rowOffsetY - sizeY*(value.z), 5);
		c.graphics().endPath();
		c.graphics().strokeLine();
		c.graphics().fill();
		//c.matrix().translate(offsetX + value.y*rowOffsetX, offsetY + value.y*rowOffsetY);
		GLOBALSTAGE.addChild(c);
	}

		// extrema
	for(i=0; i<extrema2.length; ++i){
		value = extrema2[i];
		c = new DO();
		console.log(value+"");
		c.graphics().setLine(1.0, 0x99000099);
		d.graphics().setLine(2.0, color);
		c.graphics().beginPath();
		c.graphics().moveTo(offsetX + value.y*rowOffsetX + sizeX*(value.x), offsetY + value.y*rowOffsetY - sizeY*(0));
		c.graphics().lineTo(offsetX + value.y*rowOffsetX + sizeX*(value.x), offsetY + value.y*rowOffsetY - sizeY*(value.z));
		c.graphics().strokeLine();
		c.graphics().endPath();
		GLOBALSTAGE.addChild(c);
		//
		c = new DO();
		c.graphics().setLine(1.0, 0xFF000099);
		c.graphics().setFill(0xFF6666FF);
		c.graphics().beginPath();
		c.graphics().drawCircle(offsetX + value.y*rowOffsetX + sizeX*(value.x), offsetY + value.y*rowOffsetY - sizeY*(value.z), 3);
		c.graphics().endPath();
		c.graphics().strokeLine();
		c.graphics().fill();
		GLOBALSTAGE.addChild(c);
	}
}

