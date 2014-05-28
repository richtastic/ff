// DILogo.js

function DILogo(){
	var frameRate = 1000/50;
  	//this._canvas = new Canvas(null,0,0,Canvas.STAGE_FIT_FILL,false,true);
  	this._canvas = new Canvas(null,600,400,Canvas.STAGE_FIT_FIXED,false,true);
    this._stage = new StageGL(this._canvas, frameRate, this.getVertexShaders1(), this.getFragmentShaders1());
  	this._stage.setBackgroundColor(0.0,0.5,0.0,1.0);
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
	ang = Math.PI/4.0; // Math.PI/3.0
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
	ang = Math.PIO2; rad = Math.cos(ang); y = Math.sin(ang);
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
		tmp = (i/4.0)*2.0*Math.PI;
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
	// mid-top
	for(i=0;i<4;++i){ // each 'side'
		j = i*2;
		list.push( new Tri(points[1][i],points[2][j],points[1][(i+1)%4]) ); // top
		list.push( new Tri(points[3][i],points[2][(j-1)%8],points[2][j]) ); // t-l
		list.push( new Tri(points[3][(i+1)%4],points[2][j],points[2][(j+1)%8]) ); // t-r
		list.push( new Tri(points[3][i],points[3][(i+1)%4],points[2][j]) ); // bot
		list.push( new Tri(points[3][i],points[2][j],points[2][(j-1)%8]) ); // b-l
		list.push( new Tri(points[2][j],points[3][(i+1)%4],points[2][(j+1)%8]) ); // b-r
	}
	// mid-bot
		// ...
	// bot
	for(i=0;i<4;++i){
		tri = new Tri(points[4][0],points[1][(i+1)%4],points[1][i]);
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

DILogo.COLOR_PIN_BOT_HIG = 0xFF9933AA;
DILogo.COLOR_PIN_BOT_MED = 0xFF8822CC;
DILogo.COLOR_PIN_BOT_LOW = 0xFF441199;
DILogo.COLOR_PIN_BOT_DAR = 0xFF220088;
// BODY-YELLOW
DILogo.COLOR_GRN_MID_HIG = 0xFFFFDD33;
DILogo.COLOR_GRN_MID_MED = 0xFFFFBB00;
DILogo.COLOR_GRN_MID_LOW = 0xFFFF8822;
DILogo.COLOR_GRN_MID_DRK = 0xFFEE5533;
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
	var colors = [];
	return colors;
}
DILogo.prototype.colorsEarRed = function(){
	var colors = [];
	return colors;
}
DILogo.prototype.colorsBodyHalf = function(){
	var colors = [];
	return colors;
}



DILogo.prototype.setupFxn = function(e){

/*this._angleTri = 0;
	this._vertexPositionAttrib = this._stage.enableVertexAttribute("aVertexPosition");
	this._vertexColorAttrib = this._stage.enableVertexAttribute("aVertexColor");
	this._vertexTextureAttrib = this._stage.enableVertexAttribute("aTextureCoord");
	//this._triBuffer = this._stage.getBufferFloat32Array([0.0,1.0,0.0, -1.0,-1.0,0.0, 1.0,-1.0,0.0], 3);
	this._triBuffer = this._stage.getBufferFloat32Array([
		0.0,1.0,0.0, -1.0,-1.0,1.0,   1.0,-1.0,1.0, // front
		0.0,1.0,0.0,  1.0,-1.0,1.0,  1.0,-1.0,-1.0, // right
		0.0,1.0,0.0, 1.0,-1.0,-1.0, -1.0,-1.0,-1.0, // back
		0.0,1.0,0.0, -1.0,-1.0,-1.0, -1.0,-1.0,1.0, // left
	], 3);
	this._triColorBuffer = this._stage.getBufferFloat32Array([
		1.0,0.0,0.0,1.0, 1.0,0.0,0.5,1.0, 1.0,0.0,0.5,1.0, 
		0.0,1.0,0.0,1.0, 0.5,1.0,0.0,1.0, 0.0,1.0,0.5,1.0, 
		0.0,0.0,1.0,1.0, 0.5,0.0,1.0,1.0, 0.0,0.5,1.0,1.0, 
		0.5,0.5,0.5,1.0, 0.8,0.8,0.8,1.0, 0.3,0.3,0.3,1.0, 
	], 4);
	this._squBuffer = this._stage.getBufferFloat32Array([
		-1.0,-1.0,1.0, 1.0,-1.0,1.0, 1.0,1.0,1.0, -1.0,1.0,1.0, // front
		-1.0,-1.0,-1.0, -1.0,1.0,-1.0, 1.0,1.0,-1.0, 1.0,-1.0,-1.0, // back
		-1.0,1.0,-1.0, -1.0,1.0,1.0, 1.0,1.0,1.0, 1.0,1.0,-1.0, // top
		-1.0,-1.0,-1.0, 1.0,-1.0,-1.0, 1.0,-1.0,1.0, -1.0,-1.0,1.0, // bot
		1.0,-1.0,-1.0, 1.0,1.0,-1.0, 1.0,1.0,1.0, 1.0,-1.0,1.0, // right
		-1.0,-1.0,-1.0, -1.0,-1.0,1.0, -1.0,1.0,1.0, -1.0,1.0,-1.0, // left
	], 3);
	this._squColorBuffer = this._stage.getBufferFloat32Array([
		1.0,0.0,0.0,1.0, 0.0,1.0,0.0,1.0, 0.0,0.0,1.0,1.0, 1.0,1.0,1.0,1.0, // 
		1.0,0.0,0.0,1.0, 0.0,1.0,0.0,1.0, 0.0,0.0,1.0,1.0, 1.0,1.0,1.0,1.0, // 
		1.0,0.0,0.0,1.0, 0.0,1.0,0.0,1.0, 0.0,0.0,1.0,1.0, 1.0,1.0,1.0,1.0, // 
		1.0,0.0,0.0,1.0, 0.0,1.0,0.0,1.0, 0.0,0.0,1.0,1.0, 1.0,1.0,1.0,1.0, //
		 
		1.0,0.0,0.0,1.0, 0.0,1.0,0.0,1.0, 0.0,0.0,1.0,1.0, 1.0,1.0,1.0,1.0, // 
		1.0,0.0,0.0,1.0, 0.0,1.0,0.0,1.0, 0.0,0.0,1.0,1.0, 1.0,1.0,1.0,1.0, // 
		1.0,0.0,0.0,1.0, 0.0,1.0,0.0,1.0, 0.0,0.0,1.0,1.0, 1.0,1.0,1.0,1.0, // 
		1.0,0.0,0.0,1.0, 0.0,1.0,0.0,1.0, 0.0,0.0,1.0,1.0, 1.0,1.0,1.0,1.0, // 
		
		1.0,0.0,0.0,1.0, 0.0,1.0,0.0,1.0, 0.0,0.0,1.0,1.0, 1.0,1.0,1.0,1.0, // 
		1.0,0.0,0.0,1.0, 0.0,1.0,0.0,1.0, 0.0,0.0,1.0,1.0, 1.0,1.0,1.0,1.0, // 
		1.0,0.0,0.0,1.0, 0.0,1.0,0.0,1.0, 0.0,0.0,1.0,1.0, 1.0,1.0,1.0,1.0, // 
		1.0,0.0,0.0,1.0, 0.0,1.0,0.0,1.0, 0.0,0.0,1.0,1.0, 1.0,1.0,1.0,1.0, // 
		
		1.0,0.0,0.0,1.0, 0.0,1.0,0.0,1.0, 0.0,0.0,1.0,1.0, 1.0,1.0,1.0,1.0, // 
		1.0,0.0,0.0,1.0, 0.0,1.0,0.0,1.0, 0.0,0.0,1.0,1.0, 1.0,1.0,1.0,1.0, // 
		1.0,0.0,0.0,1.0, 0.0,1.0,0.0,1.0, 0.0,0.0,1.0,1.0, 1.0,1.0,1.0,1.0, // 
		1.0,0.0,0.0,1.0, 0.0,1.0,0.0,1.0, 0.0,0.0,1.0,1.0, 1.0,1.0,1.0,1.0, // 
	], 4);
	this._squVertexBuffer = this._stage.getBufferUint16ArrayElement([
		0,1,2, 0,2,3,
		4,5,6, 4,6,7,
		8,9,10, 8,10,11,
		12,13,14, 12,14,15,
		16,17,18, 16,18,19,
		20,21,22, 20,22,23,
	], 1);
	this._squTextureBuffer = this._stage.getBufferFloat32Array([
		0.0,0.0, 1.0,0.0, 1.0,1.0, 0.0,1.0, 
		0.0,0.0, 1.0,0.0, 1.0,1.0, 0.0,1.0, 
		0.0,0.0, 1.0,0.0, 1.0,1.0, 0.0,1.0, 
		0.0,0.0, 1.0,0.0, 1.0,1.0, 0.0,1.0, 
		0.0,0.0, 1.0,0.0, 1.0,1.0, 0.0,1.0, 
		0.0,0.0, 1.0,0.0, 1.0,1.0, 0.0,1.0, 
	], 2);
	this._resourceATexture = this._stage._canvas.bindTextureImageRGBA(this._resourceAImage);
	
    this._stage.addFunction(StageGL.EVENT_ON_ENTER_FRAME, this.onEnterFrameFxn1, this);
    this._stage.start();
    */
}
DILogo.prototype.onEnterFrameFxn = function(count, time){
	/*
	var e = time;
	// RESET
	this._stage.setViewport(StageGL.VIEWPORT_MODE_FULL_SIZE);
	this._stage.clear();
	// TRIANGLE
	this._stage.matrixIdentity();
	this._stage.matrixTranslate(-1.5,0.0,-7.0);
//this._stage.matrixPush();
	this._stage.matrixRotate(e*0.002, 0,1,0);
	this._stage.matrixRotate(e*0.000667, 0,0,1);
	
	this._stage.bindArrayFloatBuffer(this._vertexPositionAttrib, this._triBuffer);
	this._stage.bindArrayFloatBuffer(this._vertexColorAttrib, this._triColorBuffer);
	
	this._stage.matrixReset();
	this._stage.drawTriangles(this._vertexPositionAttrib, this._triBuffer);
//this._stage.matrixPop();

	// SQUARE
	this._stage.matrixIdentity();
	this._stage.matrixTranslate(1.5,0.0,-7.0);
	this._stage.matrixRotate(e*0.001, 1,1,0);
	this._stage.matrixRotate(-e*0.0002, 0,0,1);
	// TEXTURE
	this._stage.bindArrayFloatBuffer(this._vertexTextureAttrib, this._squTextureBuffer);
	this._stage._canvas._context.activeTexture(this._stage._canvas._context.TEXTURE0);
	this._stage._canvas._context.bindTexture(this._stage._canvas._context.TEXTURE_2D,this._resourceATexture);
	this._stage._canvas._context.uniform1i(this._stage._canvas._program.samplerUniform, 0);
	//
	this._stage.bindArrayFloatBuffer(this._vertexPositionAttrib, this._squBuffer);
	// COLOR
	//this._stage.bindArrayFloatBuffer(this._vertexColorAttrib, this._squColorBuffer);
	this._stage.matrixReset();
	this._stage.drawElementArrayUint16Buffer(this._squVertexBuffer);
*/
}
DILogo.prototype.getVertexShaders1 = function(){
	
	return ["\
		attribute vec3 aVertexPosition; \
		attribute vec4 aVertexColor; \
		attribute vec2 aTextureCoord; \
		varying vec4 vColor; \
		varying vec2 vTextureCoord; \
		uniform mat4 uMVMatrix; \
		uniform mat4 uPMatrix; \
		void main(void) { \
			gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0); \
			vTextureCoord = aTextureCoord; \
		} \
    "];
    
}
DILogo.prototype.getFragmentShaders1 = function(){
	
    return ["\
		precision mediump float; \
		varying vec4 vColor; \
		varying vec2 vTextureCoord; \
		uniform sampler2D uSampler; \
		void main(void){ \
			gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t)); \
		} \
    "];
    
}





