// WebEx1.js

function WebEx1(){
	var frameRate = 1000/50;
  	this._canvas = new Canvas(null,600,400,Canvas.STAGE_FIT_FIXED,false,true);
    this._stage = new StageGL(this._canvas, frameRate, this.getVertexShaders1(), this.getFragmentShaders1());
  	this._stage.setBackgroundColor(0.0,0.0,0.0,1.0);
	this._stage.enableDepthTest();
	this.loadResources();
}
// ------------------------------------------------------------------------------------------------------------------------ 
// ------------------------------------------------------------------------------------------------------------------------ 
// ------------------------------------------------------------------------------------------------------------------------ Lessons  
WebEx1.prototype.loadResources = function(e){
	//var loader = new ImageLoader("http://learningwebgl.com/",["lessons/lesson05/nehe.gif"],this,this.handleResourcesLoaded,null);
	var loader = new ImageLoader("./",["mickey.png"],this,this.handleResourcesLoaded,null);
	loader.load();
}
WebEx1.prototype.handleResourcesLoaded = function(e){
	var images = e.images;
	this._resourceAImage = images[0];
	this.setupFxn1();
}

WebEx1.prototype.setupFxn1 = function(e){
//this._angleTri = 0;
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
}
WebEx1.prototype.onEnterFrameFxn1 = function(count, time){
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

}
WebEx1.prototype.getVertexShaders1 = function(){
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
/*
			vColor = aVertexColor; \
*/
WebEx1.prototype.getFragmentShaders1 = function(){
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
/*
			gl_FragColor = vColor; \
*/

// var out = new GLMAT_ARRAY_TYPE(16);

