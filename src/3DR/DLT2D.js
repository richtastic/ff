// DLT2D.js

function DLT2D(){
	this._canvas = new Canvas(null,0,0,Canvas.STAGE_FIT_FILL, false,false);
	this._stage = new Stage(this._canvas, 1000/20);
	this._root = new DO();
	this._stage.addChild(this._root);
	this._canvas.addListeners();
	this._stage.addListeners();
	this._stage.start();
	this._canvas.addFunction(Canvas.EVENT_MOUSE_CLICK,this.handleMouseClickFxn,this);
	// import image to work with
	var imageLoader = new ImageLoader("../matching/images/medium/",["BL.png","BLB.png"], this,this.handleImageLoaded,null);
	imageLoader.load();
	//this.handleLoaded();
}
DLT2D.prototype.handleMouseClickFxn = function(e){
	console.log(e.x,e.y)
}
DLT2D.prototype.handleImageLoaded = function(e){
	console.log("dlt: "+e.images.length);
	var i, j, a, b, c, d, p, q, x, y, img, arr;
	var widths = [];
	var heights = [];
	// display images
	x = 0;
	for(i=0;i<e.images.length;++i){
		img = e.images[i];
		d = new DOImage(img);
		d.matrix().identity();
		d.matrix().translate(x,0);
		this._root.addChild(d);
		x += img.width;
		widths.push(img.width);
		heights.push(img.height);
	}
	// 
	var points = [];
	points.push([new V2D(233,9), new V2D(200,296)]);
	points.push([new V2D(343,42), new V2D(80,249)]);
		// ...
	// show points on screen;
	for(i=0;i<points.length;++i){
		arr = points[i];
		d = new DO();
		d.graphics().clear();
		d.graphics().setFill(0x33FF0000);
		d.graphics().setLine(1.0,0xFF00FF00);
		d.graphics().beginPath();
		x = 0;
		for(j=0;j<arr.length;++j){
			p = arr[j];
			d.graphics().drawCircle(p.x+x,p.y,3.0);
			x += widths[j];
		}
		d.graphics().endPath();
		d.graphics().strokeLine();
		d.graphics().fill();
		this._root.addChild(d);
	}
	// convert to sepearte arrays:
	var pointsFr = [];
	var pointsTo = [];
	for(i=0;i<points.length;++i){
		arr = points[i];
		pointsFr.push(arr[0]);
		pointsTo.push(arr[1]);
	}
	// test with 4 points

	// Code.projectiveDLT(pointsFr,pointsTo);
	
	// test with 5+ points


	// test with 2D points
	// test with 3D points
}
DLT2D.prototype.handleEnterFrame = function(e){
	//console.log(e);
}




