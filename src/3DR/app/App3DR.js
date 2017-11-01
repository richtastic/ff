// App3DR.js

function App3DR(){
	this._canvas = new Canvas(null,0,0,Canvas.STAGE_FIT_FILL, false,false);
	this._stage = new Stage(this._canvas, 1000/20);
	this._root = new DO();
	this._stage.addChild(this._root);
	
	this._canvas.addFunction(Canvas.EVENT_MOUSE_CLICK,this._handleMouseClickFxn,this);
	this._canvas.addFunction(Canvas.EVENT_MOUSE_MOVE,this._handleMouseMoveFxn,this);
	this._canvas.addFunction(Canvas.EVENT_WINDOW_RESIZE,this._handleCanvasResizeFxn,this);
	this._stage.addFunction(Stage.EVENT_ON_ENTER_FRAME,this._handleEnterFrameFxn,this);
	this._keyboard = new Keyboard();


	// this._keyboard.addFunction(Keyboard.EVENT_KEY_UP,this.handleKeyboardUp,this);
	// this._keyboard.addFunction(Keyboard.EVENT_KEY_DOWN,this._handleKeyboardDown,this);
	// this._keyboard.addFunction(Keyboard.EVENT_KEY_STILL_DOWN,this.handleKeyboardStill,this);
	
	// this._ticker = new Ticker(1);
	// this._ticker.addFunction(Ticker.EVENT_TICK, this.handleTickerFxn, this);
	// this._tickCount = 0;
//	this.generate();
	
	this._displayBG = new DO();
	this._displayMenu = new DO();
	this._root.addChild(this._displayBG);
	this._root.addChild(this._displayMenu);
	//GLOBALSTAGE = this._stage;

	var grid = new HexGrid();
	this._menuScale = this._canvas.presentationScale();
	grid.scale(90 * this._menuScale);
	grid.cellCountX(11);
	grid.cellCountY(7);

	this._grid = grid;



	this._canvas.addListeners();
	this._stage.addListeners();
	this._stage.start();
	this._keyboard.addListeners();
	
	this.renderMenu();

	var imageLoader = new ImageLoader("./images/",["background.png"], this,this._handleBackgroundImagesLoaded,null);
	imageLoader.load();
}
App3DR.prototype._handleCanvasResizeFxn = function(r){
	this._updateBackground();
}
App3DR.prototype._handleEnterFrameFxn = function(t){
	this.renderMenu(t);
}
App3DR.prototype._handleMouseMoveFxn = function(e){
	var location = e["location"];
}
App3DR.prototype._handleMouseClickFxn = function(e){
	var location = e["location"];
	/*
	var d = new DO();
	d.graphics().clear();
	d.graphics().setFill(0x9900FF00);
	//d.graphics().setLine(1.0, 0xCCCC0000);
	d.graphics().beginPath();
	//d.graphics().drawPolygon(poly,true);
	d.graphics().drawCircle(location.x,location.y,2.0);
	d.graphics().endPath();
	d.graphics().fill();
	d.graphics().strokeLine();
	GLOBALSTAGE.addChild(d);
	*/
}

App3DR.prototype._handleBackgroundImagesLoaded = function(imageInfo){
	var imageList = imageInfo.images;
	var fileList = imageInfo.files;
	this._imageBackground = imageList[0];
	this._updateBackground();
}
App3DR.prototype._updateBackground = function(r){
	var size = new V2D(this._canvas.width(), this._canvas.height());
	var bg = this._displayBG;
	bg.graphics().clear();
	// draw image
	var image = this._imageBackground;
	if(image){
		//console.log(image)
		bg.removeAllChildren();
		//var d = new DOImage(image);
		var d = new DO();
		d.graphics().clear();
		//console.log(image.width,image.height)
		var outside = Code.sizeToFitOutside(size.x,size.y, image.width,image.height);
		//var outside = Code.sizeToFitInside(size.x,size.y, image.width,image.height);
		// console.log(size.x,size.y)
		// console.log(outside.x,outside.y)
		var pX = (size.x-outside.x)*0.5;
		var pY = (size.y-outside.y)*0.5;
		d.graphics().drawImage(image, pX,pY,outside.x,outside.y);
		bg.addChild(d);
	}
	// draw cover
	var d = new DO();
	d.graphics().setFill(0xDD000000);
	d.graphics().beginPath();
	//d.graphics().drawPolygon(poly,true);
	d.graphics().drawRect(-1,-1, size.x+2,size.y+2);
	d.graphics().endPath();
	d.graphics().fill();
	bg.addChild(d);
}


App3DR.prototype.renderMenu = function(t){
	t = t!==undefined ? t : 0;
	var display = this._displayMenu;
	display.removeAllChildren();
	screenCenter = new V2D();
	screenCenter.set( this._canvas.width() * 0.5, this._canvas.height() * 0.5 );

	//console.log("started");
	var grid = this._grid;

	var offset = new V2D();
	offset.set(0,0);
	offset.add(0.5 + t*0.01,0 + t*0.02);

	var cells = grid.cellsAt(offset.x,offset.y);
	
	var i, j;
	for(i=0; i<cells.length; ++i){
		var cell = cells[i];
		//console.log(cell)
		var center = grid.cellLocation(offset.x,offset.y, cell.x,cell.y);
		//console.log(center);
		/*
		var d = new DO();
			d.graphics().clear();
			d.graphics().setFill(0x99330000);
			d.graphics().setLine(1.0, 0xCCCC0000);
			d.graphics().beginPath();
			//d.graphics().drawPolygon(poly,true);
			d.graphics().drawCircle(center.x,-center.y,1.0);
			d.graphics().endPath();
			d.graphics().fill();
			d.graphics().strokeLine();
			display.addChild(d);
		d.matrix().translate(screenCenter.x,screenCenter.y);
		*/
		var scaleIn = 0.9;
		var d = new DO();
		d.graphics().clear();
		display.addChild(d);
		d.matrix().translate(screenCenter.x,screenCenter.y);
		for(j=0; j<2; ++j){
			var color = 0xCCDD0000;
			scaleIn = 0.9;
			if(j==1){
				color = 0xFFFFFFFF;
				scaleIn = 0.5;
			}
			var poly = grid.cellPolygon(offset.x,offset.y, cell.x,cell.y, j, scaleIn);
			for(var k=0; k<poly.length; ++k){
				poly[k].y = -poly[k].y;
			}
			
				d.graphics().setFill(color);
				d.graphics().setLine(1.0, 0x0);
				d.graphics().beginPath();
				d.graphics().drawPolygon(poly,true);
				d.graphics().endPath();
				d.graphics().fill();
				d.graphics().strokeLine();
				
			
		}
	}
}




function HexGrid(){
	this._cellSizeWidth = 5;
	this._cellSizeHeight = 5;
	this._scale = 1.0;
}
HexGrid.prototype.cellCountX = function(c){
	if(c!==undefined){
		this._cellSizeWidth = c;
	}
	return this._cellSizeWidth;
}
HexGrid.prototype.cellCountY = function(c){
	if(c!==undefined){
		this._cellSizeHeight = c;
	}
	return this._cellSizeHeight;
}
HexGrid.prototype.scale = function(s){
	if(s!==undefined){
		this._scale = s;
	}
	return this._scale;
}
HexGrid.prototype.cellsAt = function(offsetX,offsetY){
	var i, j;
	var countI = this._cellSizeWidth;
	var countJ = this._cellSizeHeight;
	var halfSizeX = countI*0.5 | 0;
	var halfSizeY = countJ*0.5 | 0;
	var cells = [];
	var centerX = Math.round(offsetX/HexGrid._HEX_SCALE_X);
	var centerY = Math.round(offsetY);
	for(j=0; j<countJ; ++j){
		for(i=0; i<countI; ++i){
			var cell = new V2D(i+centerX-halfSizeX,j+centerY-halfSizeY);
			cells.push(cell);
		}
	}
	return cells;
}
HexGrid.prototype.pointInCell = function(offsetX,offsetY, cellX,cellY,cellZ, pX,pY){ // pX&pY in [-0.5, 0.5]
	var point = new V2D();
	var cellPosX = (cellX+pX)*HexGrid._HEX_SCALE_X;
	var cellPosY = (cellY+pY);
	if(Math.abs(cellX)%2==1){
		cellPosY += HexGrid._HEX_SHIFT_Y;
	}
	this._pointLocation(point, offsetX,offsetY, cellPosX,cellPosY,cellZ);
	return point;
}
HexGrid.prototype.cellLocation = function(offsetX,offsetY, cellX,cellY,cellZ){
	return this.pointInCell(offsetX,offsetY, cellX,cellY,cellZ,0.0,0.0);
}
HexGrid._HEX_POLYGON = [];
HexGrid._HEX_RADIUS = 1.0/Math.sqrt(3);
HexGrid._HEX_SHIFT_Y = -0.5;
HexGrid._HEX_SCALE_X = Math.cos(Math.PI/6.0);

for(var i=0; i<6; ++i){
	var r = HexGrid._HEX_RADIUS;
	var a = i*Code.radians(60.0);
	var x = r*Math.cos(a);
	var y = r*Math.sin(a);
	HexGrid._HEX_POLYGON[i] = new V2D(x,y);
}



HexGrid.prototype.cellPolygon = function(offsetX,offsetY, cellX,cellY,cellZ, scaleIn){
	scaleIn = scaleIn!==undefined ? scaleIn : 1.0;
	var polygon = HexGrid._HEX_POLYGON;
	var points = [];
	for(var i=0; i<polygon.length; ++i){
		var point = V2D.copy(polygon[i]);
		point.scale(scaleIn);
		point.add(cellX*HexGrid._HEX_SCALE_X,cellY);
		if(Math.abs(cellX)%2==1){
			point.add(0.0, HexGrid._HEX_SHIFT_Y);
		}
		this._pointLocation(point, offsetX,offsetY, point.x,point.y,cellZ);
		points.push(point);
	}
	return points;
}
HexGrid.prototype._pointLocation = function(result, offsetX,offsetY, locX,locY,locZ){
	locZ = locZ!==undefined ? locZ : 0.0;
	var diffX = locX - offsetX;
	var diffY = locY - offsetY;
	var radius = Math.sqrt(diffX*diffX + diffY*diffY);
	var pointScale = HexGrid._rbf(radius, locZ, this._scale);
	var resultX = pointScale * diffX;
	var resultY = pointScale * diffY;
	result.x = resultX;
	result.y = resultY;
}
HexGrid._rbf = function(radius,depth, scale){
	var minLim = 1E-1;
	if(radius<=minLim){
		radius = minLim;
	}
	scale = scale!==undefined ? scale : 1.0;
	depth = depth!==undefined ? depth : 0.0;
	if(depth<0){
		depth = 1.0/depth;
	}
	var depthScale = 1.0;
	var depthCurve = 1.0;
	var depthSize = 1.0;
	//var depthScale = 1.0/(1.0 + depth*0.1);
	//var depthCurve = 1.0/(1.0 + depth*0.10);
	//var depthSize = 1.0 + depth*0.01;

	//var depthScale = 1.0/(1.0 + depth*0.01);
	var depthScale = (1.0 + depth*0.10);
	var depthCurve = 1.0/(1.0 + depth*1.0);
	//var depthCurve = (1.0 + depth*0.10);
	var depthSize = (1.0 + depth*0.10);
	//var depthSize = 1.0/(1.0 + depth*0.05);

	var curviness = 0.10;
	var siziness = 1.0;
	var val = radius + depthCurve*curviness*Math.exp(radius*siziness*depthSize);
	
	if(val<0){
		val = 0;
	}
	var limit = 1E8;
	if(val>limit){
		val = limit;
	}
	return depthScale * scale * val / (0.1 + radius); // /rad ~ 0 = problematic
}


function HexSystem(){
	HexSystem._.constructor.call(this);
	this._grid = new HexGrid();
	this._pos = new V2D();
	this._rotation = 0.0;
	this._zoom = 1.0;
	this._isAnimating = false;
	this._scrollDirection = null;
	this._isDragging = false;
	this._dragStart = null;
	this._dragStop = null;
}
Code.inheritClass(HexSystem,Dispatchable);

HexSystem.EVENT_VIEW_UPDATE = "EVENT_VIEW_UPDATE";
HexSystem.EVENT_ANIMATION_START = "EVENT_ANIMATION_START";
HexSystem.EVENT_ANIMATION_END = "EVENT_ANIMATION_END";

HexSystem.prototype.goToCell = function(cellX,cellY){
	//
	return false;
}
HexSystem.prototype.goToLocation = function(locationX,locationY){
	//
	return false;
}
HexSystem.prototype.animateToCell = function(cellX,cellY, duration){
	//
	return false;
}
HexSystem.prototype.animateToLocation = function(locationX,locationY, duration){
	//
	return false;
}
HexSystem.prototype.restrictScrollDirection = function(dirX,dirY){
	//
	return false;
}
HexSystem.prototype.restrictDragDirection = function(dirX,dirY){
	return false;
	if(dirX===null){
		this._scrollDirection = null;
		return;
	}
	var dir = new V2D(dirX,dirY);
	dir.norm();
	this._scrollDirection = dir;
}
HexSystem.prototype.startDrag = function(){
	return false;
}
HexSystem.prototype.stopDrag = function(){
	return false;
}
HexSystem.prototype.x = function(){
	//
}
HexSystem.prototype._currentCells = function(){
	var cells = cellsAt(this._pos.x,this._pos.y);
	return cells;
}
// passthrough
HexSystem.prototype.cellPolygon = function(cellX,cellY,cellZ){
	return this._grid.cellPolygon(this._pos.x,this._pos.y, cellX,cellY,cellZ);
}





function HexMenu(){
	HexSystem._.constructor.call(this);
	this._grid = new HexSystem();
}
Code.inheritClass(HexSystem,Dispatchable);
HexMenu.EVENT_GET_ICON = "EVENT_GET_ICON";
HexMenu.prototype.gotoCell = function(){
	// 
}
HexMenu.prototype.x = function(){
	// 
}












