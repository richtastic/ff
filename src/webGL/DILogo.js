// DILogo.js

function DILogo(){
	var frameRate = 1000/50;
  	this._canvas = new Canvas(null,40,40,Canvas.STAGE_FIT_FILL,false,true);
  	//this._canvas = new Canvas(null,600,500,Canvas.STAGE_FIT_FIXED,false,true);
    this._stage = new StageGL(this._canvas, frameRate, this.getVertexShaders1(), this.getFragmentShaders1());
    this._canvas.addListeners();
  	this._stage.setBackgroundColor(1.0,1.0,1.0,1.0);
  	this._stage.frustrumAngle(25);
	this._stage.enableDepthTest();
	this.loadResources();
}
// ------------------------------------------------------------------------------------------------------------------------ 
// ------------------------------------------------------------------------------------------------------------------------ 
// ------------------------------------------------------------------------------------------------------------------------ Lessons  
DILogo.prototype.loadResources = function(e){
	//var loader = new ImageLoader("http://learningwebgl.com/",["lessons/lesson05/nehe.gif"],this,this.handleResourcesLoaded,null);
	//var loader = new ImageLoader("./",["mickey.png"],this,this.handleResourcesLoaded,null);
	//loader.load();
	this.handleResourcesLoaded();
}
DILogo.prototype.handleResourcesLoaded = function(e){
	//var images = e.images;
	//this._resourceAImage = images[0];
	this.setupFxn();
}
DILogo.prototype.icosahedron = function(){ // 20-sided, centered at 0,0,0, radius 1
	var i, j, x,y,z, rad, ang,tmp, arr, tri, list = [];
	// points:
	var points = [];
	ang = Math.PI/6.0; // Math.PI/3.0
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
		tri = new Tri(points[0][0], points[1][i], points[1][(i+1)%5]);
		list.push(tri);
	}
	// mid-top
	for(i=0;i<5;++i){
		tri = new Tri(points[1][i], points[2][i], points[1][(i+1)%5]);
		list.push(tri);
	}
	// mid-bot
	for(i=0;i<5;++i){
		tri = new Tri(points[2][i], points[2][(i+1)%5], points[1][(i+1)%5]);
		list.push(tri);
	}
	// bot
	for(i=0;i<5;++i){
		tri = new Tri(points[3][0], points[2][(i+1)%5], points[2][i]);
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
		tri = new Tri(points[0][0],points[1][i],points[1][(i+1)%4]);
		list.push(tri);
	}
	// mid
	for(i=0;i<4;++i){ // each 'side'
		j = i*2;
		list.push( new Tri(points[1][i],points[2][j],points[1][(i+1)%4]) ); // top
		list.push( new Tri(points[1][i],points[2][(j+8-1)%8],points[2][j]) ); // t-l
		list.push( new Tri(points[1][(i+1)%4],points[2][j],points[2][(j+1)%8]) ); // t-r
		list.push( new Tri(points[3][i],points[3][(i+1)%4],points[2][j]) ); // bot
		list.push( new Tri(points[3][i],points[2][j],points[2][(j+8-1)%8]) ); // b-l
		list.push( new Tri(points[2][j],points[3][(i+1)%4],points[2][(j+1)%8]) ); // b-r
	}
	// bot
	for(i=0;i<4;++i){
		tri = new Tri(points[4][0],points[3][(i+1)%4],points[3][i]);
		list.push(tri);
	}
	return list;
}
// RED EAR
DILogo.COLOR_RED_TOP_BRI = 0xFFFF9999;
DILogo.COLOR_RED_TOP_HIG = 0xFFFF6666;
DILogo.COLOR_RED_TOP_MED = 0xFFBB3333;
DILogo.COLOR_RED_TOP_LOW = 0xFFCC2233;

DILogo.COLOR_RED_MID_BRI = 0xFFFF6666;
DILogo.COLOR_RED_MID_HIG = 0xFFFF3333;
DILogo.COLOR_RED_MID_MED = 0xFFDD2233;
DILogo.COLOR_RED_MID_LOW = 0xFFCC1133;
DILogo.COLOR_RED_MID_DAR = 0xFFBB1122;
DILogo.COLOR_RED_MID_OFF = 0xFFFF2244;

DILogo.COLOR_RED_BOT_HIG = 0xFFEE4444;
DILogo.COLOR_RED_BOT_MED = 0xFFDD2233;
DILogo.COLOR_RED_BOT_LOW = 0xFFBB1122;
DILogo.COLOR_RED_BOT_DAR = 0xFF990000;
// PINK EAR
DILogo.COLOR_PIN_TOP_BRI = 0xFFFF88CC;
DILogo.COLOR_PIN_TOP_HIG = 0xFFFF77DD;
DILogo.COLOR_PIN_TOP_MED = 0xFFFF66BB;
DILogo.COLOR_PIN_TOP_LOW = 0xFFFF55AA;

DILogo.COLOR_PIN_MID_BRI = 0xFFFF77DD;
DILogo.COLOR_PIN_MID_HIG = 0xFFDD33CC;
DILogo.COLOR_PIN_MID_MED = 0xFFFF4499;
DILogo.COLOR_PIN_MID_LOW = 0xFFAA33CC;
DILogo.COLOR_PIN_MID_DAR = 0xFFBB3388;
DILogo.COLOR_PIN_MID_OFF = 0xFFDD33DD;

DILogo.COLOR_PIN_BOT_HIG = 0xFF9933AA;
DILogo.COLOR_PIN_BOT_MED = 0xFF8822CC;
DILogo.COLOR_PIN_BOT_LOW = 0xFF441199;
DILogo.COLOR_PIN_BOT_DAR = 0xFF220088;
// BODY-YELLOW
DILogo.COLOR_YLW_MID_HIG = 0xFFFFDD33;
DILogo.COLOR_YLW_MID_MED = 0xFFFFBB00;
DILogo.COLOR_YLW_MID_LOW = 0xFFFF8822;
DILogo.COLOR_YLW_MID_DRK = 0xFFEE5533;
// BODY-GREEN
DILogo.COLOR_GRN_MID_HIG = 0xFF88EE66;
DILogo.COLOR_GRN_MID_MED = 0xFF33CC33;
DILogo.COLOR_GRN_MID_LOW = 0xFF009933;
DILogo.COLOR_GRN_MID_DRK = 0xFF005533;
// BODY-PURPLE
DILogo.COLOR_PRP_MID_HIG = 0xFF7722FF;
DILogo.COLOR_PRP_MID_MED = 0xFF5522DD;
DILogo.COLOR_PRP_MID_LOW = 0xFF3322CC;
DILogo.COLOR_PRP_MID_DRK = 0xFF2200CC;
// BODY-BLUE
DILogo.COLOR_BLU_MID_HIG = 0xFF3377FF;
DILogo.COLOR_BLU_MID_MED = 0xFF0033CC;
DILogo.COLOR_BLU_MID_LOW = 0xFF1100BB;
DILogo.COLOR_BLU_MID_DRK = 0xFF000088;

DILogo.prototype.colorsEarPink = function(){
	var colors = [DILogo.COLOR_PIN_TOP_BRI,DILogo.COLOR_PIN_TOP_MED,DILogo.COLOR_PIN_TOP_LOW,DILogo.COLOR_PIN_TOP_MED,DILogo.COLOR_PIN_TOP_HIG,
				  DILogo.COLOR_PIN_MID_BRI,DILogo.COLOR_PIN_MID_MED,DILogo.COLOR_PIN_MID_DAR,DILogo.COLOR_PIN_MID_MED,DILogo.COLOR_PIN_MID_MED,
				  DILogo.COLOR_PIN_MID_HIG,DILogo.COLOR_PIN_MID_LOW,DILogo.COLOR_PIN_MID_LOW,DILogo.COLOR_PIN_MID_HIG,DILogo.COLOR_PIN_MID_OFF,
				  DILogo.COLOR_PIN_BOT_HIG,DILogo.COLOR_PIN_BOT_LOW,DILogo.COLOR_PIN_BOT_DAR,DILogo.COLOR_PIN_BOT_LOW,DILogo.COLOR_PIN_BOT_MED];
	return colors;
}
DILogo.prototype.colorsEarRed = function(){
	var colors = [DILogo.COLOR_RED_TOP_BRI,DILogo.COLOR_RED_TOP_MED,DILogo.COLOR_RED_TOP_LOW,DILogo.COLOR_RED_TOP_MED,DILogo.COLOR_RED_TOP_HIG,
				  DILogo.COLOR_RED_MID_HIG,DILogo.COLOR_RED_MID_HIG,DILogo.COLOR_RED_MID_DAR,DILogo.COLOR_RED_MID_HIG,DILogo.COLOR_RED_MID_BRI,
				  DILogo.COLOR_RED_MID_MED,DILogo.COLOR_RED_MID_LOW,DILogo.COLOR_RED_MID_LOW,DILogo.COLOR_RED_MID_MED,DILogo.COLOR_RED_MID_OFF,
				  DILogo.COLOR_RED_BOT_LOW,DILogo.COLOR_RED_BOT_MED,DILogo.COLOR_RED_BOT_HIG,DILogo.COLOR_RED_BOT_LOW,DILogo.COLOR_RED_BOT_DAR];
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
DILogo.prototype.bufferTrisAndColors = function(listTris,listColors){
	var ret, i, tri, col, cols;
	var triBuffer = [];
	var triColorBuffer = [];
	for(i=0;i<listTris.length;++i){
		tri = listTris[i];
		triBuffer.push(tri.A().x,tri.A().y,tri.A().z, tri.B().x,tri.B().y,tri.B().z, tri.C().x,tri.C().y,tri.C().z);
		col = listColors[i];
		cols = Code.getFloatArrayARGBFromARGB(col);
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
	// START
    this._stage.addFunction(StageGL.EVENT_ON_ENTER_FRAME, this.onEnterFrameFxn, this);
    this._stage.start();
}
DILogo.prototype.onEnterFrameFxn = function(count, time){
	var e = time;
	var sca, zDistHead = -18.0, zDistEars = -20.0;
	var rateEar1 = 0.0008;
	var rateEar2 = -Math.PI*(1.0/7.0);
	var rateHead = 0.0004;
	var earOffsetX = 2.8;
	var earOffsetY = 2.4;
	// RESET
	this._stage.setViewport(StageGL.VIEWPORT_MODE_FULL_SIZE);
	this._stage.clear();

	// BODY
	this._stage.matrixIdentity();
	this._stage.matrixTranslate(0.0,0.0,zDistHead);
	this._stage.matrixRotate(-e*rateHead, 0,1,0);
	sca = 2.3; this._stage.matrixScale(sca,sca,sca);
	this._stage.bindArrayFloatBuffer(this._vertexPositionAttrib, this._headTriBuffer);
	this._stage.bindArrayFloatBuffer(this._vertexColorAttrib, this._headTriColorBuffer);
	this._stage.matrixReset();
	this._stage.drawTriangles(this._vertexPositionAttrib, this._headTriBuffer);

	// PINK EAR
	this._stage.matrixIdentity();
	this._stage.matrixTranslate(-earOffsetX,earOffsetY,zDistEars);
	this._stage.matrixRotate(e*rateEar1, 0,1,0);
	this._stage.matrixRotate(-rateEar2, 1,0,0);
	this._stage.matrixRotate(Math.PI, 0,1,0);
	sca = 1.0; this._stage.matrixScale(sca,sca,sca);
	this._stage.bindArrayFloatBuffer(this._vertexPositionAttrib, this._pinkTriBuffer);
	this._stage.bindArrayFloatBuffer(this._vertexColorAttrib, this._pinkTriColorBuffer);
	this._stage.matrixReset();
	this._stage.drawTriangles(this._vertexPositionAttrib, this._pinkTriBuffer);

	// RED EAR
	this._stage.matrixIdentity();
	this._stage.matrixTranslate(earOffsetX,earOffsetY,zDistEars);
	this._stage.matrixRotate(-e*rateEar1, 0,1,0);
	this._stage.matrixRotate(rateEar2, 1,0,0);
	sca = 1.0; this._stage.matrixScale(sca,sca,sca);
	this._stage.bindArrayFloatBuffer(this._vertexPositionAttrib, this._redTriBuffer);
	this._stage.bindArrayFloatBuffer(this._vertexColorAttrib, this._redTriColorBuffer);
	this._stage.matrixReset();
	this._stage.drawTriangles(this._vertexPositionAttrib, this._redTriBuffer);

	// OUT
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





