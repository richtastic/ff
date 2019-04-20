// DILogo.js

function DILogo(){
	console.log("DILOGO");
	var frameRate = 1000/50;
  	this._canvas = new Canvas(null,40,40,Canvas.STAGE_FIT_FILL,false,true);
  	//this._canvas = new Canvas(null,600,500,Canvas.STAGE_FIT_FIXED,false,true);
  	// console.log(this._canvas, frameRate, this.getVertexShaders1(), this.getFragmentShaders1());
    this._stage = new StageGL(this._canvas, frameRate, this.getVertexShaders1(), this.getFragmentShaders1());
    this._canvas.addListeners();
  	this._stage.setBackgroundColor(1.0,1.0,1.0,1.0);
  	this._stage.frustrumAngle(35);
	// this._stage.frustrumAngle(20);
	this._stage.enableDepthTest();
this._stage.setViewport(0,0,this._canvas.width(),this._canvas.height());
	this.loadResources();
}
DILogo.prototype.loadResources = function(e){
	//var loader = new ImageLoader("http://learningwebgl.com/",["lessons/lesson05/nehe.gif"],this,this.handleResourcesLoaded,null);
	//var loader = new ImageLoader("./",["mickey.png"],this,this.handleResourcesLoaded,null);
	//loader.load();
	this.handleResourcesLoaded();
}
DILogo.prototype.handleResourcesLoaded = function(e){
	// var images = e.images;
	// this._resourceAImage = images[0];
	this.setupFxn();
}
DILogo.prototype.tetrahedron = function(isDouble){  // 4 sided triangle -- all edges = unit = 1
	var list = [];
	var ang60 = Code.radians(60.0);
	var lenA = 1.0;
	var lenO = Math.tan(ang60)*0.5;
	var alt = lenO*Math.sqrt(0.5);
	// base
	if(isDouble){
		var sq2 = Math.sqrt(0.5);
		var a = new V3D(        0, lenO*0.5,0);
		var b = new V3D(-lenA*0.5,-lenO*0.5,0);
		var c = new V3D( lenA*0.5,-lenO*0.5,0);
		var d = new V3D(0,0,alt*sq2); // top
		var e = new V3D(0,0,-alt*sq2); // bot
		list.push( new Tri3D(a,b,d) );
		list.push( new Tri3D(b,c,d) );
		list.push( new Tri3D(c,a,d) );
		list.push( new Tri3D(b,a,e) );
		list.push( new Tri3D(c,b,e) );
		list.push( new Tri3D(a,c,e) );
	}else{
		var a = new V3D(        0, lenO*0.5,-alt*0.5);
		var b = new V3D(-lenA*0.5,-lenO*0.5,-alt*0.5);
		var c = new V3D( lenA*0.5,-lenO*0.5,-alt*0.5);
		var d = new V3D(0,0,alt*0.5); // top
		list.push( new Tri3D(a,c,b) );
		list.push( new Tri3D(a,b,d) );
		list.push( new Tri3D(b,c,d) );
		list.push( new Tri3D(c,a,d) );
	}
	return list;
}
DILogo.prototype.cube = function(){  // 6 sided cube - SQUARES
	//
}
DILogo.prototype.triangularBipyramid = function(){  // 6 sided triangles
	return this.tetrahedron(true);
}
DILogo.prototype.octahedron = function(){  // 8 sided triangles - square bipyramid
	var list = [];
	var lenA = 1.0;
	var alt = lenA*Math.sqrt(2);
	// base
	var a = new V3D(-lenA*0.5, lenA*0.5, 0);
	var b = new V3D(-lenA*0.5,-lenA*0.5, 0);
	var c = new V3D( lenA*0.5,-lenA*0.5, 0);
	var d = new V3D( lenA*0.5, lenA*0.5, 0);
	// ends
	var e = new V3D(0,0,alt*0.5);
	var f = new V3D(0,0,-alt*0.5);
	list.push( new Tri3D(a,b,e) );
	list.push( new Tri3D(b,c,e) );
	list.push( new Tri3D(c,d,e) );
	list.push( new Tri3D(d,a,e) );
	list.push( new Tri3D(b,a,f) );
	list.push( new Tri3D(c,b,f) );
	list.push( new Tri3D(d,c,f) );
	list.push( new Tri3D(a,d,f) );
	return list;
}
DILogo.prototype.tri12Gon = function(){ // 10-12 ? --- pentagonal bipyramid = 12
	throw "?"
}
DILogo.prototype.squareBipyramid = function(){  // 16 triangles - 
		var list = [];
	var lenA = 1.0;
	var alt = lenA*Math.sqrt(2);
	var sep = Math.sqrt(0.5)*0.5; // 0.707
	var pek = lenA*Math.sqrt(2)*0.5;
	// base
	var a1 = new V3D(-lenA*0.5, lenA*0.5, sep);
	var b1 = new V3D(-lenA*0.5,-lenA*0.5, sep);
	var c1 = new V3D( lenA*0.5,-lenA*0.5, sep);
	var d1 = new V3D( lenA*0.5, lenA*0.5, sep);
	var a2 = new V3D( -alt*0.5,        0, -sep);
	var b2 = new V3D(        0, -alt*0.5, -sep);
	var c2 = new V3D(  alt*0.5,        0, -sep);
	var d2 = new V3D(        0,  alt*0.5, -sep);
	// ends
	var e1 = new V3D(0,0,pek*0.5 + sep);
	var e2 = new V3D(0,0,-pek*0.5 - sep);
	// ends
	list.push( new Tri3D(a1,b1,e1) );
	list.push( new Tri3D(b1,c1,e1) );
	list.push( new Tri3D(c1,d1,e1) );
	list.push( new Tri3D(d1,a1,e1) );
	list.push( new Tri3D(b2,a2,e2) );
	list.push( new Tri3D(c2,b2,e2) );
	list.push( new Tri3D(d2,c2,e2) );
	list.push( new Tri3D(a2,d2,e2) );
	// betweens
	list.push( new Tri3D(a1,a2,b1) );
	list.push( new Tri3D(a2,b2,b1) );
	list.push( new Tri3D(b1,b2,c1) );
	list.push( new Tri3D(b2,c2,c1) );
	list.push( new Tri3D(c1,c2,d1) );
	list.push( new Tri3D(c2,d2,d1) );
	list.push( new Tri3D(d1,d2,a1) );
	list.push( new Tri3D(d2,a2,a1) );
	return list;
}
DILogo.prototype.icosahedron = function(){ // 20-sided, centered at 0,0,0, radius 1
	var i, j, x,y,z, rad, ang,tmp, arr, tri, list = [];
	// points:
	var points = [];
	ang = Math.PI/6.5;//Math.PI/6.0; // Math.PI/3.0
	rad = Math.cos(ang);
	y = Math.sin(ang);
	// top
	points.push([new V3D(0,1,0)]);
	// mid
	for(j=0;j<2;++j){
		arr = [];
		points.push(arr);
		for(i=0;i<5;++i){
			tmp = (i/5.0)*2.0*Math.PI + (j/5.0)*Math.PI;
			z = rad*Math.cos(tmp);
			x = rad*Math.sin(tmp);
			if(j==0){
				arr.push( new V3D(x,y,z) );
			}else{
				arr.push( new V3D(x,-y,z) );
			}
		}
	}
	// bot
	points.push([new V3D(0,-1,0)]);
	// triangles:
	// top
	for(i=0;i<5;++i){
		tri = new Tri3D(points[0][0], points[1][i], points[1][(i+1)%5]);
		list.push(tri);
	}
	// mid-top
	for(i=0;i<5;++i){
		tri = new Tri3D(points[1][i], points[2][i], points[1][(i+1)%5]);
		list.push(tri);
	}
	// mid-bot
	for(i=0;i<5;++i){
		tri = new Tri3D(points[2][i], points[2][(i+1)%5], points[1][(i+1)%5]);
		list.push(tri);
	}
	// bot
	for(i=0;i<5;++i){
		tri = new Tri3D(points[3][0], points[2][(i+1)%5], points[2][i]);
		list.push(tri);
	}
	return list;
}
DILogo.prototype.icosidodecahedron = function(){ // 32-sided, centered at 0,0,0, radius 1
	var i, j, x,y,z, rad,ang,pnt,tri, list = [];
	// points:
	var points = [];
	// top
	points.push([new V3D(0,1,0)]);
	// mid-top
	ang = Math.PI/4; rad = Math.cos(ang); y = Math.sin(ang);
	arr = []; points.push(arr);
	for(i=0;i<4;++i){
		tmp = (i/4.0)*2.0*Math.PI - Math.PI/4.0;
		z = rad*Math.cos(tmp);
		x = rad*Math.sin(tmp);
		arr.push( new V3D(x,y,z) );
	}
	// mid
	ang = 0; rad = Math.cos(ang); y = Math.sin(ang);
	arr = []; points.push(arr);
	for(i=0;i<8;++i){
		tmp = (i/8.0)*2.0*Math.PI;
		z = rad*Math.cos(tmp);
		x = rad*Math.sin(tmp);
		arr.push( new V3D(x,y,z) );
	}
	// mid-bot
	arr = []; points.push(arr);
	for(i=0;i<points[1].length;++i){
		pnt = points[1][i];
		arr.push( new V3D(pnt.x,-pnt.y,pnt.z) );
	}
	// bot
	points.push([new V3D(0,-1,0)]);
	// triangles:
	// top
	for(i=0;i<4;++i){
		tri = new Tri3D(points[0][0],points[1][i],points[1][(i+1)%4]);
		list.push(tri);
	}
	// mid
	for(i=0;i<4;++i){ // each 'side'
		j = i*2;
		list.push( new Tri3D(points[1][i],points[2][j],points[1][(i+1)%4]) ); // top
		list.push( new Tri3D(points[1][i],points[2][(j+8-1)%8],points[2][j]) ); // t-l
		list.push( new Tri3D(points[1][(i+1)%4],points[2][j],points[2][(j+1)%8]) ); // t-r
		list.push( new Tri3D(points[3][i],points[3][(i+1)%4],points[2][j]) ); // bot
		list.push( new Tri3D(points[3][i],points[2][j],points[2][(j+8-1)%8]) ); // b-l
		list.push( new Tri3D(points[2][j],points[3][(i+1)%4],points[2][(j+1)%8]) ); // b-r
	}
	// bot
	for(i=0;i<4;++i){
		tri = new Tri3D(points[4][0],points[3][(i+1)%4],points[3][i]);
		list.push(tri);
	}
	return list;
}
// RED EAR
DILogo.COLOR_RED_TOP_BRI = 0xFFFF8866; // x
DILogo.COLOR_RED_TOP_HIG = 0xFFFF5500; // x
DILogo.COLOR_RED_TOP_MED = 0xFFFF5550;
DILogo.COLOR_RED_TOP_AVG = 0xFFFF6D50;
DILogo.COLOR_RED_TOP_LOW = 0xFFFF8969;

DILogo.COLOR_RED_MID_BRI = 0xFFDD3333; // x
DILogo.COLOR_RED_MID_HIG = 0xFFB02233; // x
DILogo.COLOR_RED_MID_MED = 0xFFB53035;
DILogo.COLOR_RED_MID_AVG = 0xFFC13329;
DILogo.COLOR_RED_MID_LOW = 0xFFD31C1C;
DILogo.COLOR_RED_MID_DOW = 0xFFE82A2A;
DILogo.COLOR_RED_MID_DAR = 0xFFFF5043;
DILogo.COLOR_RED_MID_OFF = 0xFFDD2822; // x
DILogo.COLOR_RED_MID_OF2 = 0xFFCC2923; // x

DILogo.COLOR_RED_BOT_HIG = 0xFFC13729;
DILogo.COLOR_RED_BOT_MED = 0xFFBB1111; // x
DILogo.COLOR_RED_BOT_LOW = 0xFFA5190A;
DILogo.COLOR_RED_BOT_DAR = 0xFF00FF00;//0xFF990000;
// PINK EAR
DILogo.COLOR_PIN_TOP_BRI = 0xFFF05090; // x
DILogo.COLOR_PIN_TOP_HIG = 0xFFF00090;//0xFFFF77DD; /////
DILogo.COLOR_PIN_TOP_MED = 0xFFEE437F;
DILogo.COLOR_PIN_TOP_AVG = 0xFFEF5F7F;
DILogo.COLOR_PIN_TOP_LOW = 0xFFEC7A8C;//0xFFFF55AA;

DILogo.COLOR_PIN_MID_BRI = 0xFFBB2277; // x
DILogo.COLOR_PIN_MID_HIG = 0xFFEE4499; // x
DILogo.COLOR_PIN_MID_MED = 0xFFCC3388;
DILogo.COLOR_PIN_MID_AVG = 0xFFEE4477;
DILogo.COLOR_PIN_MID_LOW = 0xFF993388;
DILogo.COLOR_PIN_MID_DOW = 0xFFC01B7D;
DILogo.COLOR_PIN_MID_DAR = 0xFFE23F96;
DILogo.COLOR_PIN_MID_OFF = 0xFFCC1177; // x
DILogo.COLOR_PIN_MID_OF2 = 0xFFDD3399; // x

DILogo.COLOR_PIN_BOT_HIG = 0xFF552288; // x
DILogo.COLOR_PIN_BOT_MED = 0xFF773388; // x
DILogo.COLOR_PIN_BOT_LOW = 0xFF6B1A89;
DILogo.COLOR_PIN_BOT_DAR = 0xFF7B2C89;
// BODY-YELLOW
DILogo.COLOR_YLW_MID_HIG = 0xFFFDDA00;
DILogo.COLOR_YLW_MID_MED = 0xFFFAB615;
DILogo.COLOR_YLW_MID_LOW = 0xFFFF9022;
DILogo.COLOR_YLW_MID_DRK = 0xFFED6B0A;
// BODY-GREEN
DILogo.COLOR_GRN_MID_HIG = 0xFFBBD82E;
DILogo.COLOR_GRN_MID_MED = 0xFF8BC53F;
DILogo.COLOR_GRN_MID_LOW = 0xFF66AA44;
DILogo.COLOR_GRN_MID_DRK = 0xFF447733;
// BODY-PURPLE
DILogo.COLOR_PRP_MID_HIG = 0xFFB080FF;
DILogo.COLOR_PRP_MID_MED = 0xFF9955FF;
DILogo.COLOR_PRP_MID_LOW = 0xFF7733AA;
DILogo.COLOR_PRP_MID_DRK = 0xFF5522AA;
// BODY-BLUE
DILogo.COLOR_BLU_MID_HIG = 0xFF11AABB;
DILogo.COLOR_BLU_MID_MED = 0xFF1177BB;
DILogo.COLOR_BLU_MID_LOW = 0xFF0055AA;
DILogo.COLOR_BLU_MID_DRK = 0xFF114488;

DILogo.prototype.colorsEarPink = function(){
	var colors = [DILogo.COLOR_PIN_TOP_BRI,DILogo.COLOR_PIN_TOP_MED,DILogo.COLOR_PIN_TOP_LOW,DILogo.COLOR_PIN_TOP_AVG,DILogo.COLOR_PIN_TOP_HIG,
				  DILogo.COLOR_PIN_MID_BRI,DILogo.COLOR_PIN_MID_MED,DILogo.COLOR_PIN_MID_DAR,DILogo.COLOR_PIN_MID_AVG,DILogo.COLOR_PIN_MID_OFF,
				  DILogo.COLOR_PIN_MID_HIG,DILogo.COLOR_PIN_MID_LOW,DILogo.COLOR_PIN_MID_DOW,DILogo.COLOR_PIN_MID_HIG,DILogo.COLOR_PIN_MID_OF2,
				  DILogo.COLOR_PIN_BOT_HIG,DILogo.COLOR_PIN_BOT_LOW,DILogo.COLOR_PIN_BOT_DAR,DILogo.COLOR_PIN_BOT_LOW,DILogo.COLOR_PIN_BOT_MED];
	return colors;
}
DILogo.prototype.colorsEarRed = function(){
	var colors = [DILogo.COLOR_RED_TOP_BRI,DILogo.COLOR_RED_TOP_MED,DILogo.COLOR_RED_TOP_LOW,DILogo.COLOR_RED_TOP_AVG,DILogo.COLOR_RED_TOP_HIG,
				  DILogo.COLOR_RED_MID_BRI,DILogo.COLOR_RED_MID_MED,DILogo.COLOR_RED_MID_DAR,DILogo.COLOR_RED_MID_AVG,DILogo.COLOR_RED_MID_OFF,
				  DILogo.COLOR_RED_MID_HIG,DILogo.COLOR_RED_MID_LOW,DILogo.COLOR_RED_MID_DOW,DILogo.COLOR_RED_MID_HIG,DILogo.COLOR_RED_MID_OF2,
				  DILogo.COLOR_RED_BOT_HIG,DILogo.COLOR_RED_BOT_LOW,DILogo.COLOR_RED_BOT_HIG,DILogo.COLOR_RED_BOT_LOW,DILogo.COLOR_RED_BOT_MED];
	return colors;
}
DILogo.prototype.colorsHead = function(){
	var colors = [DILogo.COLOR_YLW_MID_HIG,DILogo.COLOR_PRP_MID_HIG,DILogo.COLOR_YLW_MID_HIG,DILogo.COLOR_PRP_MID_HIG,
				  DILogo.COLOR_YLW_MID_MED,DILogo.COLOR_GRN_MID_HIG,DILogo.COLOR_YLW_MID_LOW,//1
				  DILogo.COLOR_GRN_MID_LOW,DILogo.COLOR_GRN_MID_MED,DILogo.COLOR_YLW_MID_DRK,
				  DILogo.COLOR_PRP_MID_MED,DILogo.COLOR_PRP_MID_LOW,DILogo.COLOR_BLU_MID_HIG,//2
				  DILogo.COLOR_BLU_MID_LOW,DILogo.COLOR_PRP_MID_DRK,DILogo.COLOR_BLU_MID_MED,
				  DILogo.COLOR_YLW_MID_MED,DILogo.COLOR_GRN_MID_HIG,DILogo.COLOR_YLW_MID_LOW,//3
				  DILogo.COLOR_GRN_MID_LOW,DILogo.COLOR_GRN_MID_MED,DILogo.COLOR_YLW_MID_DRK,
				  DILogo.COLOR_PRP_MID_MED,DILogo.COLOR_PRP_MID_LOW,DILogo.COLOR_BLU_MID_HIG,//4
				  DILogo.COLOR_BLU_MID_LOW,DILogo.COLOR_PRP_MID_DRK,DILogo.COLOR_BLU_MID_MED,
				  DILogo.COLOR_GRN_MID_DRK,DILogo.COLOR_BLU_MID_DRK,DILogo.COLOR_GRN_MID_DRK,DILogo.COLOR_BLU_MID_DRK];
	return colors;
}

DILogo.prototype.colorsTetrahedron = function(){
	// var colors = [DILogo.COLOR_RED_TOP_BRI,DILogo.COLOR_RED_TOP_MED,DILogo.COLOR_RED_TOP_LOW,DILogo.COLOR_RED_TOP_AVG];
	// var colors = [DILogo.COLOR_RED_MID_BRI,DILogo.COLOR_RED_TOP_MED,DILogo.COLOR_RED_TOP_LOW,DILogo.COLOR_RED_TOP_AVG];
	var colors = [0xFFFF0000, 0xFFCC00CC, 0xFF99CC33, 0xFFCC00CC];
	return colors;
}
DILogo.prototype.colorsBipyramid = function(){
	var colors = [
		DILogo.COLOR_RED_MID_BRI,DILogo.COLOR_RED_MID_MED,DILogo.COLOR_RED_MID_DAR,
		DILogo.COLOR_RED_MID_AVG,DILogo.COLOR_RED_MID_OFF,DILogo.COLOR_RED_MID_HIG,
	];
	return colors;
}
DILogo.prototype.colorsOctahedron = function(){
	var colors = [
		DILogo.COLOR_RED_MID_BRI,DILogo.COLOR_RED_MID_MED,DILogo.COLOR_RED_MID_DAR,DILogo.COLOR_RED_MID_AVG,DILogo.COLOR_RED_MID_OFF,
		DILogo.COLOR_RED_MID_HIG,DILogo.COLOR_RED_MID_LOW,DILogo.COLOR_RED_MID_DOW,DILogo.COLOR_RED_MID_HIG,DILogo.COLOR_RED_MID_OF2,
	];
	return colors;
}

DILogo.prototype.colorsSquareBipyramid = function(){
	var colors = [DILogo.COLOR_YLW_MID_HIG,DILogo.COLOR_PRP_MID_HIG,DILogo.COLOR_YLW_MID_HIG,DILogo.COLOR_PRP_MID_HIG,
				  DILogo.COLOR_YLW_MID_MED,DILogo.COLOR_GRN_MID_HIG,DILogo.COLOR_YLW_MID_LOW,//1
				  DILogo.COLOR_GRN_MID_LOW,
				  DILogo.COLOR_PRP_MID_MED,DILogo.COLOR_PRP_MID_LOW,DILogo.COLOR_BLU_MID_HIG,//2
				  DILogo.COLOR_BLU_MID_LOW,
				  DILogo.COLOR_GRN_MID_DRK,DILogo.COLOR_BLU_MID_DRK,DILogo.COLOR_GRN_MID_DRK,DILogo.COLOR_BLU_MID_DRK];
	return colors;
}

DILogo.prototype.bufferTrisAndColors = function(listTris,listColors){
	var ret, i, tri, col, cols;
	var triBuffer = [];
	var triColorBuffer = [];
	for(i=0;i<listTris.length;++i){
		tri = listTris[i];
		triBuffer.push(tri.A().x,tri.A().y,tri.A().z, tri.B().x,tri.B().y,tri.B().z, tri.C().x,tri.C().y,tri.C().z);
		col = listColors[i];
		cols = Code.getFloatARGB(col);
		triColorBuffer.push(cols[1],cols[2],cols[3],cols[0], cols[1],cols[2],cols[3],cols[0], cols[1],cols[2],cols[3],cols[0]);
	}
	var tris = this._stage.getBufferFloat32Array(triBuffer,3);
	var cols = this._stage.getBufferFloat32Array(triColorBuffer,4);
	return {tris:tris, cols:cols};
}


DILogo.prototype.setupFxn = function(e){
	//this._angleTri = 0;
	this._vertexPositionAttrib = this._stage.enableVertexAttribute("aVertexPosition");
	this._vertexColorAttrib = this._stage.enableVertexAttribute("aVertexColor");

	var i, j, len;
	// HEAD
	ret = this.bufferTrisAndColors(this.icosidodecahedron(), this.colorsHead());
	this._headTriBuffer = ret.tris;
	this._headTriColorBuffer = ret.cols;
	// PINK EAR
	ret = this.bufferTrisAndColors(this.icosahedron(), this.colorsEarPink());
	this._pinkTriBuffer = ret.tris;
	this._pinkTriColorBuffer = ret.cols;
	// RED EAR
	ret = this.bufferTrisAndColors(this.icosahedron(), this.colorsEarRed());
	this._redTriBuffer = ret.tris;
	this._redTriColorBuffer = ret.cols;


	// EXCESS 4:
	ret = this.bufferTrisAndColors(this.tetrahedron(), this.colorsTetrahedron());
	this._poly4TriBuffer = ret.tris;
	this._poly4TriColorBuffer = ret.cols;

	// EXCESS 6:
	ret = this.bufferTrisAndColors(this.triangularBipyramid(), this.colorsBipyramid());
	this._poly6TriBuffer = ret.tris;
	this._poly6TriColorBuffer = ret.cols;

	// EXCESS 8:
	ret = this.bufferTrisAndColors(this.octahedron(), this.colorsOctahedron());
	this._poly8TriBuffer = ret.tris;
	this._poly8TriColorBuffer = ret.cols;

	// EXCESS 16:
	ret = this.bufferTrisAndColors(this.squareBipyramid(), this.colorsSquareBipyramid());
	this._poly16TriBuffer = ret.tris;
	this._poly16TriColorBuffer = ret.cols;

// console.log(ret);
// throw "?"

	// EXCESS 8:

	// ...

	// START
    this._stage.addFunction(StageGL.EVENT_ON_ENTER_FRAME, this.onEnterFrameFxn, this);
    this._stage.start();
}
DILogo.prototype.onEnterFrameFxn = function(count){

if(this.RAN){
	return;
}
// this.RAN = true;
	var e = count * 10;
// e = 0;
	var rateBase = 0.0004;
	var rateHead = rateBase*1.0;
	var rateEar1 = rateBase*2.0;
	var sca, zDistHead = zDistEars = -10.0;
	var rateEar2 = -Math.PI*(1.0/14.0);
	var earTilt = Math.PI*(1.0/7.0);
	var earRotOffset = Math.PI*(1.0/18.0);
	var rateHead2 = -Math.PI*(1.0/4.0);
	var headOffset = Math.PI*(1.0/30.0);
	var earOffsetX = 2.2;
	var earOffsetY = 1.50;
	var bodyOffsetY = -0.50;
	// RESET
	this._stage.setViewport(StageGL.VIEWPORT_MODE_FULL_SIZE);
	this._stage.clear();

/*
	var cameraMatrix = mat4.create();
		// mat4.identity(cameraMatrix);
		mat4.translate(cameraMatrix, [1,0,0]);
		// mat4.rotate(cameraMatrix, Code.radians(5.0), [0,1,0]);
		mat4.rotate(cameraMatrix, Code.radians(45.0), [1,1,1]);
		*/
	var cameraMatrix = new Matrix3D();
	cameraMatrix.identity();
/*
	cameraMatrix.translate(-5,2,-10);

	// cameraMatrix.rotateVector(new V3D(1,1,1), Code.radians(25.0) );
	// cameraMatrix.rotateVector(new V3D(0,0,1),Code.radians(5.0) );
	cameraMatrix.rotateVector(new V3D(0,0,1),Code.radians(-25.0) );
	cameraMatrix.rotateVector(new V3D(1,0,0),Code.radians(-10.0) );
	cameraMatrix.rotateVector(new V3D(0,1,0),Code.radians(-5.0) );
*/

	// console.log(cameraMatrix);

	// this._stage.matrixIdentity();
	// this._stage.matrixTranslate(0.0,0.0,0.0);
	// this._stage.matrixRotate(Code.radians(25.0), 0,1,0);
	// this._stage.matrixRotate(-rateHead2, 0,1,0);
// matrixMultM3D
// matrixMultM3DPre


	// BODY
	this._stage.matrixIdentity();
	this._stage.matrixMultM3D(cameraMatrix);
	this._stage.matrixTranslate(0.0,bodyOffsetY,zDistHead);
	this._stage.matrixRotate(-headOffset - e*rateHead, 0,1,0);
	this._stage.matrixRotate(-rateHead2, 0,1,0);
	sca = 1.95; this._stage.matrixScale(sca,sca,sca);
	this._stage.bindArrayFloatBuffer(this._vertexPositionAttrib, this._headTriBuffer);
	this._stage.bindArrayFloatBuffer(this._vertexColorAttrib, this._headTriColorBuffer);
	this._stage.matrixReset();
	this._stage.drawTriangles(this._vertexPositionAttrib, this._headTriBuffer);

	// this._stage.matrixIdentity();

	// PINK EAR
	this._stage.matrixIdentity();
	this._stage.matrixMultM3D(cameraMatrix);
	this._stage.matrixTranslate(-earOffsetX,earOffsetY,zDistEars);
	this._stage.matrixRotate(e*rateEar1, 0,1,0);
	this._stage.matrixRotate(-rateEar2, 0,0,1);
	this._stage.matrixRotate(earTilt, 1,0,0);
	this._stage.matrixRotate(Math.PI + earRotOffset, 0,1,0);
	sca = 1.0; this._stage.matrixScale(sca,sca,sca);
	this._stage.bindArrayFloatBuffer(this._vertexPositionAttrib, this._pinkTriBuffer);
	this._stage.bindArrayFloatBuffer(this._vertexColorAttrib, this._pinkTriColorBuffer);
	this._stage.matrixReset();
	this._stage.drawTriangles(this._vertexPositionAttrib, this._pinkTriBuffer);

	// RED EAR
	this._stage.matrixIdentity();
	this._stage.matrixMultM3D(cameraMatrix);
	this._stage.matrixTranslate(earOffsetX,earOffsetY,zDistEars);
	this._stage.matrixRotate(-e*rateEar1, 0,1,0);
	this._stage.matrixRotate(rateEar2, 0,0,1);
	this._stage.matrixRotate(earTilt, 1,0,0);
	this._stage.matrixRotate(Math.PI - earRotOffset, 0,1,0);
	sca = 1.0; this._stage.matrixScale(sca,sca,sca);
	this._stage.bindArrayFloatBuffer(this._vertexPositionAttrib, this._redTriBuffer);
	this._stage.bindArrayFloatBuffer(this._vertexColorAttrib, this._redTriColorBuffer);
	this._stage.matrixReset();
	this._stage.drawTriangles(this._vertexPositionAttrib, this._redTriBuffer);



var ratePoly4_1 = 0.001;
var ratePoly4_2 = 0.0005;
var ratePoly4_3 = 0.0001;
	// TETRA:
	this._stage.matrixIdentity();
	this._stage.matrixMultM3D(cameraMatrix);
	this._stage.matrixTranslate(7,0,zDistEars);
	this._stage.matrixRotate(e*ratePoly4_1, 0,1,0);
	this._stage.matrixRotate(e*ratePoly4_2, 0,0,1);
	this._stage.matrixRotate(e*ratePoly4_3, 1,0,0);
	// this._stage.matrixRotate(rateEar2, 0,0,1);
	// this._stage.matrixRotate(earTilt, 1,0,0);
	// this._stage.matrixRotate(Math.PI - earRotOffset, 0,1,0);
	this._stage.matrixRotate(Code.radians(90), 1,0,0);
	sca = 1.0; this._stage.matrixScale(sca,sca,sca);
	this._stage.bindArrayFloatBuffer(this._vertexPositionAttrib, this._poly4TriBuffer);
	this._stage.bindArrayFloatBuffer(this._vertexColorAttrib, this._poly4TriColorBuffer);
	this._stage.matrixReset();
	this._stage.drawTriangles(this._vertexPositionAttrib, this._poly4TriBuffer);


var ratePoly6_1 = 0.001;
var ratePoly6_2 = 0.0002;
var ratePoly6_3 = 0.0001;
	// TETRA:
	this._stage.matrixIdentity();
	this._stage.matrixMultM3D(cameraMatrix);
	this._stage.matrixTranslate(-7,0,zDistEars);
	this._stage.matrixRotate(e*ratePoly6_1, 0,1,0);
	this._stage.matrixRotate(e*ratePoly6_2, 0,0,1);
	this._stage.matrixRotate(e*ratePoly6_3, 1,0,0);
	// this._stage.matrixRotate(rateEar2, 0,0,1);
	// this._stage.matrixRotate(earTilt, 1,0,0);
	// this._stage.matrixRotate(Math.PI - earRotOffset, 0,1,0);
	// this._stage.matrixRotate(Code.radians(90), 1,0,0);
	sca = 1.0; this._stage.matrixScale(sca,sca,sca);
	this._stage.bindArrayFloatBuffer(this._vertexPositionAttrib, this._poly6TriBuffer);
	this._stage.bindArrayFloatBuffer(this._vertexColorAttrib, this._poly6TriColorBuffer);
	this._stage.matrixReset();
	this._stage.drawTriangles(this._vertexPositionAttrib, this._poly6TriBuffer);


var ratePoly8_1 = 0.001;
var ratePoly8_2 = 0.0002;
var ratePoly8_3 = 0.0001;
	// TETRA:
	this._stage.matrixIdentity();
	this._stage.matrixMultM3D(cameraMatrix);
	this._stage.matrixTranslate(5,0,zDistEars);
	this._stage.matrixRotate(e*ratePoly8_1, 0,1,0);
	this._stage.matrixRotate(e*ratePoly8_2, 0,0,1);
	this._stage.matrixRotate(e*ratePoly8_3, 1,0,0);
	// this._stage.matrixRotate(rateEar2, 0,0,1);
	// this._stage.matrixRotate(earTilt, 1,0,0);
	// this._stage.matrixRotate(Math.PI - earRotOffset, 0,1,0);
	// this._stage.matrixRotate(Code.radians(90), 1,0,0);
	sca = 1.0; this._stage.matrixScale(sca,sca,sca);
	this._stage.bindArrayFloatBuffer(this._vertexPositionAttrib, this._poly8TriBuffer);
	this._stage.bindArrayFloatBuffer(this._vertexColorAttrib, this._poly8TriColorBuffer);
	this._stage.matrixReset();
	this._stage.drawTriangles(this._vertexPositionAttrib, this._poly8TriBuffer);


var ratePoly16_1 = 0.001;
var ratePoly16_2 = 0.0002;
var ratePoly16_3 = 0.0001;
	// TETRA:
	this._stage.matrixIdentity();
	this._stage.matrixMultM3D(cameraMatrix);
	this._stage.matrixTranslate(-5,0,zDistEars);
	this._stage.matrixRotate(e*ratePoly16_1, 0,1,0);
	this._stage.matrixRotate(e*ratePoly16_2, 0,0,1);
	this._stage.matrixRotate(e*ratePoly16_3, 1,0,0);
	// this._stage.matrixRotate(rateEar2, 0,0,1);
	// this._stage.matrixRotate(earTilt, 1,0,0);
	// this._stage.matrixRotate(Math.PI - earRotOffset, 0,1,0);
	// this._stage.matrixRotate(Code.radians(90), 1,0,0);
	sca = 1.0; this._stage.matrixScale(sca,sca,sca);
	this._stage.bindArrayFloatBuffer(this._vertexPositionAttrib, this._poly16TriBuffer);
	this._stage.bindArrayFloatBuffer(this._vertexColorAttrib, this._poly16TriColorBuffer);
	this._stage.matrixReset();
	this._stage.drawTriangles(this._vertexPositionAttrib, this._poly16TriBuffer);



	// OUT
	// this._stage.matrixPop();
	this._stage.matrixReset();
}
DILogo.prototype.getVertexShaders1 = function(){
	return ["\
		attribute vec3 aVertexPosition; \
		attribute vec4 aVertexColor; \
		varying vec4 vColor; \
		uniform mat4 uMVMatrix; \
		uniform mat4 uPMatrix; \
		void main(void) { \
			gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0); \
			vColor = aVertexColor; \
		} \
    "];

}
DILogo.prototype.getFragmentShaders1 = function(){
    return ["\
		precision mediump float; \
		varying vec4 vColor; \
		void main(void){ \
			gl_FragColor = vColor; \
		} \
    "];

}
