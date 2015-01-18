// Manual3DR.js

function Manual3DR(){
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
	this._canvas3D = new Canvas(null,0,0,Canvas.STAGE_FIT_FILL,false,true);
	this._stage3D = new StageGL(this._canvas3D, 1000.0/20.0, this.getVertexShaders1(), this.getFragmentShaders1());
  	this._stage3D.setBackgroundColor(0x00000000);
	this._stage3D.frustrumAngle(60);
	this._stage3D.enableDepthTest();
this._stage3D.addFunction(StageGL.EVENT_ON_ENTER_FRAME, this.onEnterFrameFxn3D, this);
	// this._stage3D.start();
	this._spherePointBegin = null;
	this._spherePointEnd = null;
	this._sphereMatrix = new Matrix3D();
	this._sphereMatrix.identity();
	this._userInteractionMatrix = new Matrix3D();
	this._userInteractionMatrix.identity();
	this._canvas3D.addFunction(Canvas.EVENT_MOUSE_DOWN, this.onMouseDownFxn3D, this);
	this._canvas3D.addFunction(Canvas.EVENT_MOUSE_UP, this.onMouseUpFxn3D, this);
	this._canvas3D.addFunction(Canvas.EVENT_MOUSE_MOVE, this.onMouseMoveFxn3D, this);
	this._canvas3D.addFunction(Canvas.EVENT_MOUSE_WHEEL, this.onMouseWheelFxn3D, this);
	this._canvas3D.addFunction(Canvas.EVENT_MOUSE_CLICK, this.onMouseClickFxn3D, this);
	//
	var imageList, imageLoader;
	// calibration images:
//	imageList = ["calibration1-0.jpg","calibration1-1.jpg","calibration1-2.jpg"];
//	imageLoader = new ImageLoader("./images/",imageList, this,this.handleCalibrationImagesLoaded,null);
//	imageLoader.load();
	// import image to work with
	imageList = ["caseStudy1-0.jpg","caseStudy1-26.jpg"];
	imageLoader = new ImageLoader("./images/",imageList, this,this.handleSceneImagesLoaded,null);
	imageLoader.load();
//this.distortionStuff();
}
Manual3DR.prototype.distortionStuff = function(){
	var d, i, j, k, x, y, img, arr, index, X, Y, u, v, w;
	var wid = 400;
	var hei = 300;
	var dia = Math.sqrt(wid*wid+hei*hei);
	var colLineVer = 0xFFFF0000;
	var colLineHor = 0xFF0000FF;
	var colLineRad = 0xFF00FF00;
	var countVertical = 13;
	var countHorizontal = 11;
	var countRadial = 8;
	// create example image to display
	d = new DO();
	d.graphics().clear();
	// BG
	d.graphics().setFill(0xFFFFFFFF);
	d.graphics().beginPath();
	d.graphics().drawRect(0,0,wid,hei);
	d.graphics().endPath();
	d.graphics().fill();
	// vertical stripes
	for(i=0;i<countVertical;++i){
		x = wid*(i/(countVertical-1));
		d.graphics().setLine(2.0, colLineVer);
		d.graphics().beginPath();
		d.graphics().moveTo(x,0);
		d.graphics().lineTo(x,hei);
		d.graphics().endPath();
		d.graphics().strokeLine();
	}
	// horizontal stripes
	for(i=0;i<countHorizontal;++i){
		y = hei*(i/(countHorizontal-1));
		d.graphics().setLine(2.0, colLineHor);
		d.graphics().beginPath();
		d.graphics().moveTo(0,y);
		d.graphics().lineTo(wid,y);
		d.graphics().endPath();
		d.graphics().strokeLine();
	}
	// radial stripes
	for(i=0;i<countRadial;++i){
		r = dia*(i/(countRadial-1))*0.5; // Math.max(wid,hei)
		d.graphics().setLine(2.0, colLineRad);
		d.graphics().beginPath();
		d.graphics().drawCircle(wid*0.5,hei*0.5,r);
		d.graphics().endPath();
		d.graphics().strokeLine();
	}
	// convert to image
	// img = this._stage.renderImage(wid,hei,d);
	// d = new DOImage(img);
	// convert to pixel array:
	arr = this._stage.getDOAsARGB(d,wid,hei);
	img = this._stage.getARGBAsImage(arr, wid,hei);
	img.setAttribute("style","z-index:9999999; position:relative; top:0; left:0; padding:0; margin:0; border:0;");
	document.body.appendChild(img);
	//
	var disArr = Code.newArrayZeros(wid*hei);
	index = 0;
	var maxDim = Math.max(wid,hei);
	var k0, k1, k2, k3, p1, p2, p3, x2, y2;
	var r2, r4, r6, xc, yc, xP, yP;
xc = 0.20;
yc = 0.30;
k0 = 1.0;
k1 = 1.0;
k2 = 0.0;
k3 = 0.0;
p1 = 0.0;
p2 = 0.0;

var systemPoints = {"original":
						[new V2D(0,0),
						new V2D(wid*0.5,0),
						new V2D(wid,0),
						new V2D(wid*0.5,hei*0.5),
						new V2D(wid*0.5,0),
						new V2D(wid*0.5,hei),
						new V2D(wid,0),
						new V2D(wid,hei*0.5),
						new V2D(wid,hei)],
					"distorted":[]};
	var pts = systemPoints["original"];
	var nxt = systemPoints["distorted"];
	for(i=0;i<pts.length;++i){
		v = pts[i];
		nxt[i] = this.pointFromDistortion(wid,hei,maxDim, v.x,v.y, xc,yc, k0,k1,k2,k3,p1,p2);
	}

var matA = new ImageMat(wid,hei);
matA.setFromArrayARGB(arr);
var col = new V3D();
	for(j=0;j<hei;++j){
		for(i=0;i<wid;++i,++index){
			v = this.pointFromDistortion(wid,hei,maxDim, i,j, xc,yc, k0,k1,k2,k3,p1,p2);
			// INTERPOLATE
			matA.getPoint(col, v.x,v.y);
			disArr[index] = Code.getColARGBFromFloat(1.0,col.x,col.y,col.z);
			// NEAREST NEIGHBOR
			// X = Math.round(v.x);
			// Y = Math.round(v.y);
			// if(0<=X && X<wid  && 0<=Y && Y<hei){
			// 	ind = Y*wid + X;
			// 	disArr[index] = arr[ind];
			// }else{
			// 	disArr[index] = 0xFF000000;
			// }
		}
	}
	// index = Math.round(hei*0.5 + (maxDim/hei)*yc)*wid + Math.round(wid*0.5*(wid/maxDim)*xc);
	// disArr[index] = 0xFFFFFF00;
	// disArr[index+1] = 0xFF000000;
	// disArr[index+2] = 0xFF000000;
	//
	//img = this._stage.getARGBAsImage(arr, wid,hei);
	img = this._stage.getARGBAsImage(disArr, wid,hei);
	img.setAttribute("style","z-index:9999999; position:relative; top:0; left:0; padding:0; margin:0; border:0;");
	document.body.appendChild(img);

	// recovery

// TODO: LINEAR STEP TO FIRST APPROXIMATE X VALUES
xc = 0.0;
yc = 0.0;
k0 = 1.0;
k1 = 0.0;
k2 = 0.0;
k3 = 0.0;
p1 = 0.0;
p2 = 0.0;

	var iterations, iterationsMax = 20;
	var error, errorPrev, errorNext, errorMag, delta, dist, result, currentResult, errorMinimum;
	var jacobian, Jinv, epsilon = 1E-8, err = 0, prevErr = 0;
	errorMinimum = 1E-10;
	error = new Matrix();
var unknowns = 8;
var h = new Matrix(unknowns,1); // 
var he = new Matrix(unknowns,1); // 
var jacobian = new Matrix(pts.length,unknowns); // k1,k2,k3
var lambda = 1E10;
var lambdaScale = 10.0;
h.setFromArray([xc,yc,k0,k1,k2,k3,p1,p2]);
	for(i=0;i<iterationsMax;++i){
		// y
		currentResult = this.cameraResultsFromSet(pts,nxt, wid,hei,maxDim, h.toArray()).result;
		// dy = squared error
		error = this.cameraResultsFromSet(pts,nxt, wid,hei,maxDim, h.toArray()).error;
		//console.log("        ??? "+error.toArray());
		errorMag = error.getNorm();
		console.log("ERROR: "+errorMag);
		if(errorMag<errorMinimum){
			console.log("converge");
			break;
		}
		errorPrev = errorMag;
		// dy => jacobian
		for(k=0;k<h.rows();++k){
			he.copy(h); he.set(k,0, he.get(k,0)+epsilon );
			result = this.cameraResultsFromSet(pts,nxt, wid,hei,maxDim, he.toArray()).result;
			var delY = Matrix.sub(result,currentResult);
			jacobian.setColFromCol(k, delY,0);
		}
		jacobian.scale(1.0/epsilon);
		// LM dx = f(jacobian,error,lambda)
		// h += dx
// dx
var jt = Matrix.transpose(jacobian);
var jj = Matrix.mult(jt,jacobian);
var L = new Matrix(jacobian.cols(),jacobian.cols()).identity();
L.scale(lambda);
var ji = Matrix.add(jj,L);
ji = Matrix.inverse(ji);
Jinv = Matrix.mult(ji,jt);
delta = Matrix.mult(Jinv, error);
// x += dx [?]
var potentialH = Matrix.add(h,delta); // putative
//console.log(potentialH.toArray()+" .........");
errorNext = this.cameraResultsFromSet(pts,nxt, wid,hei,maxDim, potentialH.toArray()).error.getNorm();
//console.log("=> "+errorNext);
		// check
		if(errorNext<errorPrev){
			Matrix.add(h, h,delta);
			lambda /= lambdaScale;
		}else{
			lambda *= lambdaScale;
		}
//console.log(h.toArray()+"  ");
	}
/*

*/


console.log("        => "+h.toArray());
xc = h.get(0,0);
yc = h.get(1,0);
k0 = h.get(2,0);
k1 = h.get(3,0);
k2 = h.get(4,0);
k3 = h.get(5,0);
p1 = h.get(6,0);
p2 = h.get(7,0);
	var recArr = Code.newArrayZeros(wid*hei);
matA.setFromArrayARGB(disArr);
	index = 0;
	for(j=0;j<hei;++j){
		for(i=0;i<wid;++i,++index){
			v = this.pointFromDistortion(wid,hei,maxDim, i,j, xc,yc, k0,k1,k2,k3,p1,p2);
			// INTERPOLATE
			matA.getPoint(col, v.x,v.y);
			recArr[index] = Code.getColARGBFromFloat(1.0,col.x,col.y,col.z);
			// NEAREST NEIGHBOR
			// X = Math.round(v.x);
			// Y = Math.round(v.y);
			// if(0<=X && X<wid  && 0<=Y && Y<hei){
			// 	ind = Y*wid + X;
			// 	recArr[index] = disArr[ind]; // INTERPOLATE
			// }else{
			// 	recArr[index] = 0xFF000000;
			// }
		}
	}

	img = this._stage.getARGBAsImage(recArr, wid,hei);
	img.setAttribute("style","z-index:9999999; position:relative; top:0; left:0; padding:0; margin:0; border:0;");
	document.body.appendChild(img);

	//d = new DOImage(img);
	//console.log(arr)
	// 
	
	// this._root.addChild(d);
	//
}
Manual3DR.prototype.cameraResultsFromSet = function(fr,to, wid,hei,sca, params){
	var xc = params[0];
	var yc = params[1];
	var k0 = params[2];
	var k1 = params[3];
	var k2 = params[4];
	var k3 = params[5];
	var p1 = params.length>4?params[6] : 0.0;
	var p2 = params.length>5?params[7] : 0.0;
// xc = 0;
// yc = 0;
	var u, v, w, dist;
	var error = new Matrix(fr.length*2,1);
	var result = new Matrix(fr.length*2,1);
	for(j=0;j<fr.length;++j){
		v = fr[j];
		u = to[j];
		w = this.pointFromDistortion(wid,hei,sca, u.x,u.y, xc,yc, k0,k1,k2,k3,p1,p2);
		// error.set(j*2+0,0, (w.x-w.x) );
		// error.set(j*2+1,0, (w.y-w.y) );
		error.set(j*2+0,0, (v.x-w.x) );
		error.set(j*2+1,0, (v.y-w.y) );
		//error.set(j*2+0,0, Math.pow(w.x-v.x,2) );
		//error.set(j*2+1,0, Math.pow(w.y-v.y,2) );
		result.set(j*2+0,0, w.x);
		result.set(j*2+1,0, w.y);
	}
	return {"error":error,"result":result};
}
Manual3DR.prototype.pointFromDistortion = function(wid,hei,sca, x,y, xc,yc, k0,k1,k2,k3,p1,p2){
	p1 = p1!==undefined?p1:0.0;
	p2 = p2!==undefined?p2:0.0;
	x = (x-wid/2)/sca;
	y = (y-hei/2)/sca;
	var xP = x + xc*0.5;
	var yP = y + yc*0.5;
	var x2 = xP*xP;
	var y2 = yP*yP;
	var r2 = xP*xP + yP*yP;
	var r4 = r2*r2;
	var r6 = r4*r2;
	//var r = Math.sqrt(r2);
	 // var X = x/(1.0 + k1*r2 + k2*r4 + k3*r6);// + 2*p1*x*y + p2*(r2 + 2*x2);
	 // var Y = y/(1.0 + k1*r2 + k2*r4 + k3*r6);// + 2*p1*x*y + p2*(r2 + 2*y2);
	var X = x*(1.0 + k1*r2 + k2*r4 + k3*r6);
	var Y = y*(1.0 + k1*r2 + k2*r4 + k3*r6);
	// var X = x*(1.0 + k1*r2 + k2*r4 + k3*r6) + 2*p1*x*y + p2*(r2 + 2*x2);
	// var Y = y*(1.0 + k1*r2 + k2*r4 + k3*r6) + 2*p1*x*y + p2*(r2 + 2*y2);
	X = wid/2 - (X*sca);
	Y = hei/2 - (Y*sca);
	return new V3D(X,Y);
}
Manual3DR.prototype.getVertexShaders1 = function(){
	return ["\
		attribute vec3 aVertexPosition; \
		attribute vec4 aVertexColor; \
		varying vec4 vColor; \
		uniform mat4 uMVMatrix; \
		uniform mat4 uPMatrix; \
		void main(void) { \
			gl_PointSize = 2.0; \
			gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0); \
			vColor = aVertexColor; \
		} \
    	",
    	"\
    	attribute vec3 aVertexPosition; \
		attribute vec2 aTextureCoord; \
		uniform mat4 uMVMatrix; \
		uniform mat4 uPMatrix; \
		varying vec2 vTextureCoord; \
		void main(void) { \
			gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0); \
			vTextureCoord = aTextureCoord; \
		} \
		",
		" \
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
Manual3DR.prototype.getFragmentShaders1 = function(){
    return ["\
		precision highp float; \
		varying vec4 vColor; \
		void main(void){ \
			gl_FragColor = vColor; \
		} \
		",
		"\
		precision mediump float; \
		varying vec2 vTextureCoord; \
		uniform sampler2D uSampler; \
		void main(void){ \
			gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t)); \
		} \
    	",
    	"\
		precision highp float; \
		varying vec4 vColor; \
		void main(void){ \
			gl_FragColor = vColor; \
		} \
    "];
}
Manual3DR.prototype.onEnterFrameFxn3D = function(e){
	this.render3DScene();
}
Manual3DR.prototype.onMouseDownFxn3D = function(e){
	var point = e;
	point = this.spherePointFromRectPoint(point);
	this._spherePointBegin = point;
	this._spherePointEnd = point.copy();
}
Manual3DR.prototype.onMouseMoveFxn3D = function(e){
	if(this._spherePointBegin){
		var point = e;
		point = this.spherePointFromRectPoint(point);
		this._spherePointEnd = point;
		this.updateSphereMatrixFromPoints(this._spherePointBegin, this._spherePointEnd);
	}
}
Manual3DR.prototype.onMouseUpFxn3D = function(e){
	// apply
	var point = e;
	point = this.spherePointFromRectPoint(point);
	this._spherePointEnd = point;
	this.updateSphereMatrixFromPoints(this._spherePointBegin, this._spherePointEnd);
	this._userInteractionMatrix.mult(this._userInteractionMatrix, this._sphereMatrix);
	//this._userInteractionMatrix.mult(this._sphereMatrix, this._userInteractionMatrix);
		// reset
	this._spherePointBegin = null;
	this._spherePointEnd = null;
	this._sphereMatrix.identity();
}
Manual3DR.prototype.onMouseWheelFxn3D = function(e){
	//
}
Manual3DR.prototype.onMouseClickFxn3D = function(e){
return;
	var wid = 512;//texture.image.width;
	var hei = 512;//texture.image.height;
	var size = 4 * wid * hei;

	var gl = this._canvas3D.context();
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

//
	// CREATE TEXTURE TO HOLD RESULT
	var dataArray = Code.newArrayZeros(size); // 0 rgba array
var i;
for(i=0;i<size;++i){
	dataArray[i] = Math.floor(Math.random()*256.0);
}
	var dataTypedArray = new Uint8Array(dataArray);
	var dataType = gl.RGBA;
	var texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(gl.TEXTURE_2D, 0, dataType, wid, hei, 0, dataType, gl.UNSIGNED_BYTE, dataTypedArray);
	//gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, wid, hei, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
	console.log(texture);

	// CREATE RENDER BUFFER
	console.log(gl)
	var renderBuffer = gl.createRenderbuffer();
	gl.bindRenderbuffer(gl.RENDERBUFFER, renderBuffer);
	gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, frameBuffer, wid, hei);

	// CREATE FRAME BUFFER TO HOLD CURRENT SCENE
	var frameBuffer = gl.createFramebuffer();
	gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

 	// RENDER
 	gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderBuffer);



console.log("RENDER HERE");
gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
this.render3DScene();
gl.bindFramebuffer(gl.FRAMEBUFFER, null);

	// COPY OUT FRAME BUFFER INTO DATA CONTAINER
	var data = new Uint8Array(size);
	gl.readPixels(0,0, wid,hei, gl.RGBA, gl.UNSIGNED_BYTE, data);
	// gl.bindRenderbuffer(gl.RENDERBUFFER, null);
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	gl.deleteFramebuffer(frameBuffer);

gl.bindRenderbuffer(gl.RENDERBUFFER, null);
//gl.deleteFramebuffer(renderBuffer);

gl.bindTexture(gl.TEXTURE_2D, null);
//gl.deleteTexture(texture);

// capturing a different rect than I think I am
	
	var i, j, index, inde2, temp, wo2=Math.floor(wid/2), ho2=Math.floor(hei/2);
	// // flip horizontal
	// for(j=0;j<hei;++j){
	// 	for(i=0;i<wo2;++i){
	// 		index = j*wid + i;
	// 		inde2 = j*wid + wid-1 - i;
	// 		temp = data[index]; 
	// 		data[index] = data[inde2];
	// 		data[inde2] = temp;
	// 	}
	// }
	// flip vertical
	for(j=0;j<ho2;++j){
		for(i=0;i<wid;++i){
			index = j*wid*4 + i*4;
			inde2 = (hei-1-j)*wid*4 + i*4;
			// R
			temp = data[index]; 
			data[index] = data[inde2];
			data[inde2] = temp;
			// G
			temp = data[index+1]; 
			data[index+1] = data[inde2+1];
			data[inde2+1] = temp;
			// B
			temp = data[index+2]; 
			data[index+2] = data[inde2+2];
			data[inde2+2] = temp;
			// A
			temp = data[index+3]; 
			data[index+3] = data[inde2+3];
			data[inde2+3] = temp;
		}
	}
	// 
	// var context = this._canvas.context();
	// var imageData = context.createImageData(wid,hei);
 //    imageData.data.set(data);
 //    context.putImageData(imageData, 0, 0);

 	// convert to usable array
	var argb = new Array();
	for(index=0;index<size;++index){
		argb[index] = Code.getColARGB(data[index*4+3],data[index*4+0],data[index*4+1],data[index*4+2]);
	}
	// convert to image
	var img = this._stage.getARGBAsImage(argb, wid,hei);
	document.body.appendChild(img);
	//img.style = "z-index:9999999; position:absolute; top:0; left:0; padding:0; margin:0; border:0;";
	img.setAttribute("style","z-index:9999999; position:absolute; top:0; left:0; padding:0; margin:0; border:0;");

	console.log("OUT");

//this._canvas3D._context.bindTexture(this._canvas3D._context.TEXTURE_2D,this._texture);

	// texture.image.onload = function(){
	// 	console.log("loaded");
	// }
}

Manual3DR.prototype.spherePointFromRectPoint = function(point){
	var wid = this._canvas3D.width();
	var hei = this._canvas3D.height();
	point = Code.spherePointFrom2DRect(0,0,wid,hei, point.x,point.y);
	return point;
}
Manual3DR.prototype.updateSphereMatrixFromPoints = function(pointA,pointB){
	var angle = V3D.angle(pointA,pointB);
	angle = -angle;
	if(angle!=0){
		var direction = V3D.cross(pointA,pointB);
		direction.norm();
		this._sphereMatrix.identity();
		this._sphereMatrix.rotateVector(direction,angle);
	}
}

//
Manual3DR.prototype.handleCalibrationImagesLoaded = function(imageInfo){
	console.log("calibrated");
	var i, j, len, d, img, imgs, o, obj, p, v;
	var imageSources = imageInfo.images;
	// show image sources
	len = imageSources.length;
	for(i=0;i<len;++i){
		img = imageSources[i];
		if(i==0){
			imagePixelWidth = img.width;
			imagePixelHeight = img.height;
		}
		d = new DOImage(img);
if(i==2){
		this._root.addChild(d);
}
		d.matrix().translate(0,0);
	}
	// 0
	points0 = {	"pos2D":
				[new V2D(110,225),
				new V2D(343,224.5),
				new V2D(332,31),
				new V2D(109.5,58),
				new V2D(155.5,174.5),
				new V2D(281.5,169.5),
				new V2D(278,90),
				new V2D(154,101),
				new V2D(204,198.5),
				new V2D(229,197.5),
				new V2D(225,70),
				new V2D(200,72)],
				"pos3D":
				[new V3D(0,0,1),
				new V3D(9,0,1),
				new V3D(9,7,1),
				new V3D(0,7,1),
				new V3D(2,2,1),
				new V3D(7,2,1),
				new V3D(7,5,1),
				new V3D(2,5,1),
				new V3D(4,1,1),
				new V3D(5,1,1),
				new V3D(5,6,1),
				new V3D(4,6,1)]
			};
	// 1
	points1 = {	"pos2D":
				[new V2D(83,184),
				new V2D(232,269.5),
				new V2D(341,163.5),
				new V2D(242,19),
				new V2D(168,168.5),
				new V2D(240.8,223.5),
				new V2D(291,174),
				new V2D(229.8,106),
				new V2D(183,212),
				new V2D(198,222.5),
				new V2D(288.5,132.5),
				new V2D(277,118)],
				"pos3D":
				[new V3D(0,0,1),
				new V3D(9,0,1),
				new V3D(9,7,1),
				new V3D(0,7,1),
				new V3D(2,2,1),
				new V3D(7,2,1),
				new V3D(7,5,1),
				new V3D(2,5,1),
				new V3D(4,1,1),
				new V3D(5,1,1),
				new V3D(5,6,1),
				new V3D(4,6,1)]
			};
	// 2
	points2 = {	"pos2D":
				[new V2D(73.5,245.5),
				new V2D(311.5,219),
				new V2D(366,46.5),
				new V2D(26,58),
				new V2D(127,199),
				new V2D(270.5,185.5),
				new V2D(285,112.5),
				new V2D(118,123),
				new V2D(186,214.5),
				new V2D(214,212),
				new V2D(224,86),
				new V2D(188.5,88)],
				"pos3D":
				[new V3D(0,0,1),
				new V3D(9,0,1),
				new V3D(9,7,1),
				new V3D(0,7,1),
				new V3D(2,2,1),
				new V3D(7,2,1),
				new V3D(7,5,1),
				new V3D(2,5,1),
				new V3D(4,1,1),
				new V3D(5,1,1),
				new V3D(5,6,1),
				new V3D(4,6,1)]
			};
	// var points = {	"pos2D":
	// 				[new V2D(0,0),
	// 				new V2D(0,0),
	// 				new V2D(0,0),
	// 				new V2D(0,0)],
	// 				"pos3D":
	// 				[new V3D(0,0,0),
	// 				new V3D(0,0,0),
	// 				new V3D(0,0,0),
	// 				new V3D(0,0,0)]
	// 			};
	var points = points2;
	// draw spots on image for verification:
	list = points.pos2D;
	for(i=0;i<list.length;++i){
		v = list[i];
		d = R3D.drawPointAt(v.x,v.y, 0xFF,0x00,0x00);
		this._root.addChild(d);
	}
}
/*
Calibration Image 0:

*/
Manual3DR.prototype.handleSceneImagesLoaded = function(imageInfo){
	var imageList = imageInfo.images;
	var i, list = [];
	for(i=0;i<imageList.length;++i){
		list[i] = imageList[i];
	}
this._resource.testImage = list[0];
	this._imageSources = list;
this.calibrateCameraMatrix();
	this.handleLoaded();
	//this.render3DScene();
	this._stage3D.start();
}
Manual3DR.prototype.handleMouseClickFxn = function(e){
	console.log(e.x,e.y)
}
Manual3DR.prototype.calibrateCameraMatrix = function(){
	var i, j, rows, cols;
	var points0, points1, points2, H0, H1, H2;
	// 0
	points0 = {	"pos2D":
				[new V3D(110,225, 1),
				new V3D(343,224.5, 1),
				new V3D(332,31, 1),
				new V3D(109.5,58, 1),
				new V3D(155.5,174.5, 1),
				new V3D(281.5,169.5, 1),
				new V3D(278,90, 1),
				new V3D(154,101, 1),
				new V3D(204,198.5, 1),
				new V3D(229,197.5, 1),
				new V3D(225,70, 1),
				new V3D(200,72, 1)],
				"pos3D":
				[new V3D(0,0,1),
				new V3D(9,0,1),
				new V3D(9,7,1),
				new V3D(0,7,1),
				new V3D(2,2,1),
				new V3D(7,2,1),
				new V3D(7,5,1),
				new V3D(2,5,1),
				new V3D(4,1,1),
				new V3D(5,1,1),
				new V3D(5,6,1),
				new V3D(4,6,1)]
			};
	// 1
	points1 = {	"pos2D":
				[new V3D(83,184, 1),
				new V3D(232,269.5, 1),
				new V3D(341,163.5, 1),
				new V3D(242,19, 1),
				new V3D(168,168.5, 1),
				new V3D(240.8,223.5, 1),
				new V3D(291,174, 1),
				new V3D(229.8,106, 1),
				new V3D(183,212, 1),
				new V3D(198,222.5, 1),
				new V3D(288.5,132.5, 1),
				new V3D(277,118, 1)],
				"pos3D":
				[new V3D(0,0,1),
				new V3D(9,0,1),
				new V3D(9,7,1),
				new V3D(0,7,1),
				new V3D(2,2,1),
				new V3D(7,2,1),
				new V3D(7,5,1),
				new V3D(2,5,1),
				new V3D(4,1,1),
				new V3D(5,1,1),
				new V3D(5,6,1),
				new V3D(4,6,1)]
			};
	// 2
	points2 = {	"pos2D":
				[new V3D(73.5,245.5, 1),
				new V3D(311.5,219, 1),
				new V3D(366,46.5, 1),
				new V3D(26,58, 1),
				new V3D(127,199, 1),
				new V3D(270.5,185.5, 1),
				new V3D(285,112.5, 1),
				new V3D(118,123, 1),
				new V3D(186,214.5, 1),
				new V3D(214,212, 1),
				new V3D(224,86, 1),
				new V3D(188.5,88, 1)],
				"pos3D":
				[new V3D(0,0,1),
				new V3D(9,0,1),
				new V3D(9,7,1),
				new V3D(0,7,1),
				new V3D(2,2,1),
				new V3D(7,2,1),
				new V3D(7,5,1),
				new V3D(2,5,1),
				new V3D(4,1,1),
				new V3D(5,1,1),
				new V3D(5,6,1),
				new V3D(4,6,1)]
			};
	// homography - projection matrices  ----  pointsFr,pointsTo

	// H0 = R3D.projectiveDLT(points0.pos3D,points0.pos2D);
	// H1 = R3D.projectiveDLT(points1.pos3D,points1.pos2D);
	// H2 = R3D.projectiveDLT(points2.pos3D,points2.pos2D);

points0.norm = R3D.calculateNormalizedPoints([points0.pos2D,points0.pos3D]);
points1.norm = R3D.calculateNormalizedPoints([points1.pos2D,points1.pos3D]);
points2.norm = R3D.calculateNormalizedPoints([points2.pos2D,points2.pos3D]);
// points0.norm = R3D.calculateNormalizedPoints([points0.pos3D,points0.pos2D]);
// points1.norm = R3D.calculateNormalizedPoints([points1.pos3D,points1.pos2D]);
// points2.norm = R3D.calculateNormalizedPoints([points2.pos3D,points2.pos2D]);
	H0 = R3D.projectiveDLT(points0.norm.normalized[0],points0.norm.normalized[1]);
	H1 = R3D.projectiveDLT(points1.norm.normalized[0],points1.norm.normalized[1]);
	H2 = R3D.projectiveDLT(points2.norm.normalized[0],points2.norm.normalized[1]);
//=> Levenberg Marquardt nonlinear minimization goes here

//var x = new Matrix().fromArray(H0.toArray());
var fxn = this.lmMinProjectionFxn;
var args = [ points0.norm.normalized[0], points0.norm.normalized[1] ];
var xVals = H0.toArray();
var yVals = Code.newArrayZeros(args[0].length*4); // from and to points
console.log("A: "+xVals.toString());
Matrix.lmMinimize( fxn, args, yVals.length,xVals.length, xVals, yVals );
// Matrix.lmMinimize = function(fxn, m, n, xInitial, yFinal, maxIterations, fTolerance, xTolerance){ 
console.log("B: "+xVals.toString());

	// unnormalize:
	var H, forward, reverse;
	// 0
	forward = points0.norm.forward[0];
	reverse = points0.norm.reverse[1];
	H = H0;
	H = Matrix.mult(H,forward);
	H = Matrix.mult(reverse,H);
	H0 = H;
	// 1
	forward = points1.norm.forward[0];
	reverse = points1.norm.reverse[1];
	H = H1;
	H = Matrix.mult(H,forward);
	H = Matrix.mult(reverse,H);
	H1 = H;
	// 2
	forward = points2.norm.forward[0];
	reverse = points2.norm.reverse[1];
	H = H2;
	H = Matrix.mult(H,forward);
	H = Matrix.mult(reverse,H);
	H2 = H;

	// arbitrary scale last element
	H0.scale(1.0/H0.get(2,2));
	H1.scale(1.0/H1.get(2,2));
	H2.scale(1.0/H2.get(2,2));

	var listH = [H0,H1,H2];
	var hCount = listH.length;
	// CONSTRUCT V:
	var V = new Matrix(2*hCount,6);//.setFromArrayMatrix(vArr);
	var h00, h01, h10, h11, h20, h21;
	for(i=0;i<hCount;++i){ // row,col: 0i*0j, 0i*1j + 1i*0j, 1i*1j, 2i*0j + 0i*2j, 2i*1j + 1i*2j, 2i*2j
		H = listH[i];
		h00 = H.get(0,0); // 0
		h01 = H.get(0,1); // 1
		h10 = H.get(1,0); // 3
		h11 = H.get(1,1); // 4
		h20 = H.get(2,0); // 6
		h21 = H.get(2,1); // 7
		// v01
		V.set(i*2+0,0, h00*h01 );
		V.set(i*2+0,1, h00*h11 + h10*h01 );
		V.set(i*2+0,2, h10*h11 );
		V.set(i*2+0,3, h20*h01 + h00*h21 );
		V.set(i*2+0,4, h20*h11 + h10*h21 );
		V.set(i*2+0,5, h20*h21 );
		// v00 - v11
		V.set(i*2+1,0, h00*h00 - h01*h01 );
		V.set(i*2+1,1, 2.0*(h00*h10 - h01*h11) );
		V.set(i*2+1,2, h10*h10 - h11*h11 );
		V.set(i*2+1,3, 2.0*(h20*h00 - h21*h01) );
 		V.set(i*2+1,4, 2.0*(h20*h10 - h21*h11) );
 		V.set(i*2+1,5, h20*h20 - h21*h21 );
// normalize row ? 
	}
	//console.log("V.toString()");
	//console.log(V.toString());
	// SVD: V * b = 0
	var svd = Matrix.SVD(V);
	var coeff = svd.V.colToArray(5);
	//console.log(coeff)
	var b00 = coeff[0];
	var b01 = coeff[1];
	var b11 = coeff[2];
	var b02 = coeff[3];
	var b12 = coeff[4];
	var b22 = coeff[5];
	// compute K properties - requirements: den1!=0, b00!=0, fy>0
		var num1 = b01*b02 - b00*b12;
		var den1 = b00*b11 - b01*b01;
	var v0 = num1/den1;
	var lambda = b22 - ((b02*b02 + v0*num1)/b00);
	var fx = Math.sqrt( Math.abs( lambda/b00 ) ); // Math.abs(
	var fy = Math.sqrt( Math.abs( (lambda*b00)/den1 ) ); // Math.abs(
	var s = -b01*fx*fx*fy/lambda;
	var u0 = ((s*v0)/fx) - ((b02*fx*fx)/lambda);
	//console.log(lambda,b00,den1,fx,fy)
	// construct K
	var K = new Matrix(3,3).setFromArray([fx,s,u0, 0,fy,v0, 0,0,1]);
	console.log("K: ");
	console.log(K.toString());
	this._intrinsicK = K;

	// radial distortion time ....

	//
	console.log("estimated example: ");
	console.log( (new Matrix(3,3).setFromArray([200,0,100, 0,300,150, 0,0,1])).toString() );
	console.log("..........................................");
/*
* normalize image points: x,y in [-1,1] based on image width/height, image center is origin
* find homography between model points and image points
	* use DLT for initial points
	* use LM for refinement
	* scale homography to last element = 1
* find B
	* find V
	* SVD V*b=0
	* B = [b]
* find K
	* from B coefficients
	* correct K (if need to undo point normalization)

*/
}
Manual3DR.prototype.lmMinProjectionFxn = function(args, xMatrix,yMatrix,eMatrix){ // x:nx1, y:1xm, e:1xm
	var ptsFr = args[0];
	var ptsTo = args[1];
	var unknowns = 9;
	var fr, to, frB=new V3D(), toB=new V3D();
	var Hinv = new Matrix(3,3), H = new Matrix(3,3);
	var i, len = ptsFr.length;
	var rows = 2*2*len;
	// convert unknown list to matrix
	for(i=0;i<unknowns;++i){
		H.set( Math.floor(i/3),i%3, xMatrix.get(i,0) );
	}
	Hinv = Matrix.inverse(H);
	// find forward / reverse transforms
 	for(i=0;i<len;++i){
		fr = ptsFr[i];
		to = ptsTo[i];
		H.multV3DtoV3D(toB,fr);
		Hinv.multV3DtoV3D(frB,to);
		frB.homo();
		toB.homo();
 		if(yMatrix){
 			yMatrix.set(i*4+0,0, frB.x);
 			yMatrix.set(i*4+1,0, frB.y);
 			yMatrix.set(i*4+2,0, toB.x);
 			yMatrix.set(i*4+3,0, toB.y);
 		}
 		if(eMatrix){
 			eMatrix.set(i*4+0,0, Math.pow(frB.x-fr.x,2) );
 			eMatrix.set(i*4+1,0, Math.pow(frB.y-fr.y,2) );
 			eMatrix.set(i*4+2,0, Math.pow(toB.x-to.x,2) );
 			eMatrix.set(i*4+3,0, Math.pow(toB.y-to.y,2) );
 		}
 	}
 	if(eMatrix){
 		//console.log(eMatrix.toString())
 		//console.log(eMatrix.getNorm()+"")
 	}
}
// var v01 = Manual3DR.vRowFromCols(h_0_0,h_0_1,h_0_2, h_1_0,h_1_1,h_1_2);
Manual3DR.vRowFromCols = function(hi0,hi1,hi2, hj0,hj1,hj2){
	var arr = [];
	arr.push( Matrix.dot(hi0,hj0) );
	arr.push( Matrix.dot(hi0,hj1) + Matrix.dot(hi1,hj0) );
	arr.push( Matrix.dot(hi1,hj1) );
	arr.push( Matrix.dot(hi2,hj0) + Matrix.dot(hi0,hj2) );
	arr.push( Matrix.dot(hi2,hj1) + Matrix.dot(hi1,hj2) );
	arr.push( Matrix.dot(hi2,hj2) );
	return new Matrix(1,6).setFromArray(arr);
}
Manual3DR.prototype.handleLoaded = function(){
	var imagePixelWidth, imagePixelHeight;
	var i, j, len, d, img, imgs, o, obj, p, v;
	var imageSources = this._imageSources;
	var offsetX = 0; offsetY = 0;
	// show image sources
	len = imageSources.length;
	/*
	for(i=0;i<len;++i){
		img = imageSources[i];
		if(i==0){
			imagePixelWidth = img.width;
			imagePixelHeight = img.height;
		}
		d = new DOImage(img);
		this._root.addChild(d);
		d.matrix().translate(offsetX,offsetY);
		offsetX += d.image().width;
	}
	*/
	// determined point pairs:
	var pointList = [];
	// origin
	obj = {}
	obj.pos3D = new V3D(0,0,0);
	obj.pos2D = [new V2D(172,107), new V2D(191,145.5)];
	pointList.push(obj);
	// full y
	obj = {}
	obj.pos3D = new V3D(0,4,0);
	obj.pos2D = [new V2D(203,116), new V2D(231.5,152.5)];
	pointList.push(obj);
	// full z
	obj = {}
	obj.pos3D = new V3D(0,0,4);
	obj.pos2D = [new V2D(171.5,69), new V2D(192.5,100.5)];
	pointList.push(obj);
	// full xy
	obj = {}
	obj.pos3D = new V3D(4,4,0);
	obj.pos2D = [new V2D(176,128), new V2D(203,159.5)];
	pointList.push(obj);
	// full yz
	obj = {}
	obj.pos3D = new V3D(0,4,4);
	obj.pos2D = [new V2D(204,75.5), new V2D(234,103.5)];
	pointList.push(obj);
	// mid xz
	obj = {}
	obj.pos3D = new V3D(2,0,2);
	obj.pos2D = [new V2D(158.5,92.5), new V2D(178,124.5)];
	pointList.push(obj);
	// unknown correspondences:
	pointList.push({"pos3D":null,"pos2D":[new V2D(128,94), new V2D(157,99)]});
	pointList.push({"pos3D":null,"pos2D":[new V2D(189.5,180), new V2D(268.5,177)]});
	pointList.push({"pos3D":null,"pos2D":[new V2D(58,158), new V2D(65.5,165)]});
	// display point pairs:
	len = pointList.length;
	/*
	for(i=0;i<len;++i){
		imgs = pointList[i].pos2D;
		for(j=0;j<imgs.length;++j){
			v = imgs[j];
			if(pointList[i].pos3D){
				d = R3D.drawPointAt(v.x,v.y, 0xFF,0x00,0x00);
			}else{
				d = R3D.drawPointAt(v.x,v.y, 0x00,0x00,0xFF);
			}
			d.matrix().translate(j*400,0);
			this._root.addChild(d);
		}
	}
	*/
	// calculate fundamental matrix
	var pointsA = [];
	var pointsB = [];
	len = pointList.length;
	for(i=0;i<len;++i){
		imgs = pointList[i].pos2D;
		v = imgs[0];
		pointsA.push( new V3D(v.x,v.y,1) );
		v = imgs[1];
		pointsB.push( new V3D(v.x,v.y,1) );
	}
	// calculate Fundamental matrix from 2D correspondences
	var fundamental = R3D.fundamentalMatrix(pointsA,pointsB);
	console.log("F:");
	console.log(fundamental.toString())

	// already got intrinsic camera matrix
	var K = this._intrinsicK;
	console.log("K")
	console.log(K.toString())
	var Kinv = Matrix.inverse(K);
	console.log("K^-1")
	console.log(Kinv.toString())

	// calculate essential matrix
	var Kt = Matrix.transpose(K);
	var essential = Matrix.mult(Kt, Matrix.mult(fundamental,K) );
	console.log("E:")
	console.log(essential.toString())

	// need to work in normalized points inv(K) * x'
	var pointsNormA = new Array();
	var pointsNormB = new Array();
	len = pointsA.length;
	for(i=0;i<len;++i){
		v = pointsA[i];
		v = Kinv.multV3DtoV3D(new V3D(), v);
		pointsNormA.push( v );
		v = pointsB[i];
		v = Kinv.multV3DtoV3D(new V3D(), v);
		pointsNormB.push( v );
	}

	// 
	var W = new Matrix(3,3).setFromArray([0,-1,0, 1,0,0, 0,0,1]);
	var Wt = Matrix.transpose(W);
	//var Z = new Matrix(3,3).setFromArray([0,1,0, -1,0,0, 0,0,0]);
	var diag110 = new Matrix(3,3).setFromArray([1,0,0, 0,1,0, 0,0,0]);

	// force D = 1,1,0
	var svd = Matrix.SVD(essential);
	var U = svd.U;
	var S = svd.S;
	var V = svd.V;
	var Vt = Matrix.transpose(V);
	var t = U.getCol(2);
	var tNeg = t.copy().scale(-1.0);
	console.log("t:");
	console.log(t.toString())
	console.log(tNeg.toString())

	// one of 4 possible solutions
	var det;
	var possibleA = Matrix.mult(U,Matrix.mult(W,Vt));
	det = possibleA.det();
	if(det<0){
		console.log("FLIP1: "+det);
		possibleA.scale(-1.0);
	}
	var possibleB = Matrix.mult(U,Matrix.mult(Wt,Vt));
	det = possibleB.det();
	if(det<0){
		console.log("FLIP2: "+det);
		possibleB.scale(-1.0);
	}

	// 4x4 matrices
	var possibles = new Array();
	m = possibleA.copy().appendColFromArray(t.toArray());//.appendRowFromArray([0,0,0,1]);
	possibles.push( m );
	m = possibleA.copy().appendColFromArray(tNeg.toArray());//.appendRowFromArray([0,0,0,1]);
	possibles.push( m );
	m = possibleB.copy().appendColFromArray(t.toArray());//.appendRowFromArray([0,0,0,1]);
	possibles.push( m );
	m = possibleB.copy().appendColFromArray(tNeg.toArray());//.appendRowFromArray([0,0,0,1]);
	possibles.push( m );

	// find single matrix that results in 3D point in front of both cameras Z>0
	var pA = pointsNormA[0];
	var pB = pointsNormB[0];
	var pAx = Matrix.crossMatrixFromV3D( pA );
	var pBx = Matrix.crossMatrixFromV3D( pB );

var M1 = new Matrix(3,4).setFromArray([1,0,0,0, 0,1,0,0, 0,0,1,0]);
	var projection = null;
	len = possibles.length;
	for(i=0;i<len;++i){
		//var M1 = possibles[i];
		//var M2 = Matrix.inverse(M1);
			var M2 = possibles[i];
		//console.log(M1.toString());
		//console.log(M2.toString());
		var pAM = Matrix.mult(pAx,M1);
		var pBM = Matrix.mult(pBx,M2);
		// console.log(pAM.toString());
		// console.log(pBM.toString());
		// console.log("...");
		var A = pAM.copy().appendMatrixBottom(pBM);
		//console.log("svd");
		svd = Matrix.SVD(A);
		//console.log(svd);
		//console.log(svd.V.toString());
		
		var P1 = svd.V.getCol(3);
		var p1Norm = new V4D().setFromArray(P1.toArray());
		//console.log(p1Norm.toString());
		p1Norm.homo();
		//console.log(p1Norm.toString());
		var P2 = new Matrix(4,1).setFromArray( p1Norm.toArray() );
		//console.log(P2.toString());
M2 = M2.copy().appendRowFromArray([0,0,0,1]);
		P2 = Matrix.mult(M2,P2);
		//console.log(P2.toString());
		var p2Norm = new V4D().setFromArray(P2.toArray());
		//console.log(p2Norm.toString());
		p2Norm.homo();
		console.log(p1Norm.z+" && "+p2Norm.z);
		if(p1Norm.z>0 && p2Norm.z>0){
			console.log(".......................>>XXX");
			projection = M2;
			break;
		}
	}
	if(projection){
		console.log("projection:");
		console.log(projection.toString());
	}
this._cameras = [];
this._cameras.push({"extrinsic":new Matrix(4,4).identity(),
					"center":new V3D(0,0,0), // center of camera on image (not image center)
					"topLeft":new V3D(-1,1,0), // top left corner of image location
					"xAxis":new V3D(1,0,0), // top side of image
					"yAxis":new V3D(0,-1,0), // left side of image
					"points":[], // list of interest points to put lines thru
					"focalLength":1.0000,
					"screenWidth":1.0000,
					"screenHeight":1.0000,
					});
this._cameras.push({"extrinsic":projection
					});

	// // calculate projective camera matrix
	// len = pointList.length;
	// for(i=0;i<len;++i){
	// 	norms = [];
	// 	pointList[i].norm2D = norms;
	// 	imgs = pointList[i].pos2D;
	// 	for(j=0;j<imgs.length;++j){
	// 		v = imgs[j];
	// 		v = R3D.screenNormalizedPointFromPixelPoint(v, imagePixelWidth, imagePixelHeight);
	// 		// R3D.screenNormalizedAspectPointFromPixelPoint
	// 		norms[j] = v;
	// 	}
	// }
	//console.log(norms)

	//R3D.screenNormalizedPointsFromPixelPoints
	// ... - calculate projective reconstuction

	// calculate metric camera matrix
	// ...- upgrade to metric from known 3D position of 5+ points

	// dense back-project
	// ... midpoints

	// generate depth map
	// ... image A/B
}
Manual3DR.prototype.addCameraVisual = function(matrix){ // point/direction
	//...
	var pointsL = this._renderPointsList;
	var colorsL = this._renderColorsList;
	var linePoints = this._renderLinePointsList;//[0,0, 5,5];
	var lineColors = this._renderLineColorsList;//[0.5,0,0,1, 0.5,0,0,1];
	this._vertexPositionAttrib = this._stage3D.enableVertexAttribute("aVertexPosition");
	this._vertexColorAttrib = this._stage3D.enableVertexAttribute("aVertexColor");
	//
	// var i;
	// for(i=0;i<300;++i){
	// 	pointsL.push(Math.random()*3.0-1.5,Math.random()*3.0-1.5,Math.random()*3.0-1.5);
	// 	colorsL.push(0.0,Math.random()*1.0,0.50, 1.0);
	// }
	// 
	var i, j, len, tri, col;
	var c = [];
	var t = [];
	var lp = [];
	var lc = [];
	c.push(0xFFFF0000);
	t.push(Tri.fromList(0.0,0.0,0.0, 0.5,-0.5,1.0,  -0.5,-0.5,1.0));
	c.push(0xFF00CC00);
	t.push(Tri.fromList(0.0,0.0,0.0, 0.5,0.5,1.0, 0.5,-0.5,1.0));
	c.push(0xFF0000FF);
	t.push(Tri.fromList(0.0,0.0,0.0, -0.5,0.5,1.0, 0.5,0.5,1.0));
	c.push(0xFFFFCC00);
	t.push(Tri.fromList(0.0,0.0,0.0, -0.5,-0.5,1.0, -0.5,0.5,1.0));
	c.push(0xFFCCCCCC);
	t.push(Tri.fromList(0.5,-0.5,1.0, 0.5,0.5,1.0, -0.5,0.5,1.0));
	c.push(0xFF999999);
	t.push(Tri.fromList(0.5,-0.5,1.0, -0.5,0.5,1.0, -0.5,-0.5,1.0));
	// lines
	lp.push(new V3D(0,0,0), new V3D(0,0,10));
	lc.push(0xFF990000, 0xFF990000);

var v = new V3D();
	len = c.length;
	for(i=0;i<len;++i){
		col = c[i];
		tri = t[i];
		matrix.multV3DtoV3D(v,tri.A());
		pointsL.push(v.x,v.y,v.z);
		matrix.multV3DtoV3D(v,tri.B());
		pointsL.push(v.x,v.y,v.z);
		matrix.multV3DtoV3D(v,tri.C());
		pointsL.push(v.x,v.y,v.z);
		for(j=0;j<3;++j){
			colorsL.push( Code.getFloatRedARGB(col),Code.getFloatGrnARGB(col),Code.getFloatBluARGB(col),Code.getFloatAlpARGB(col) );
		}
	}
	//
	//
	len = lp.length;
	for(i=0;i<len;++i){
		col = lc[i];
		v = lp[i];
		v = matrix.multV3DtoV3D(v,v);
		linePoints.push(v.x,v.y,v.z);
		lineColors.push( Code.getFloatRedARGB(col),Code.getFloatGrnARGB(col),Code.getFloatBluARGB(col),Code.getFloatAlpARGB(col) );
	}
	//
}
Manual3DR.prototype.render3DScene = function(){
	var e = this.e?this.e:0;
	this.e = e; ++this.e;
	this._stage3D.setViewport(StageGL.VIEWPORT_MODE_FULL_SIZE);
	this._stage3D.clear();
	// 
	//this._userMatrix.rotateY(0.03);
	this._stage3D.matrixIdentity();
	//this._stage3D.matrixRotate(e*0.01, 0,1,0);
	//this._stage3D.matrixTranslate(0.0,0.0,-3.0*Math.pow(2,this._userScale) );
	this._stage3D.matrixTranslate(0.0,0.0,-5.0);
//	this._stage3D.matrixRotate(-Math.PI*0.5, 1,0,0);
	//this._stage3D.matrixRotate(Math.PI*0.5, 0,1,0);
//	this._stage3D.matrixRotate(e*0.0, e*0.0,0,1);

this._stage3D.matrixMultM3D(this._sphereMatrix);
this._stage3D.matrixMultM3D(this._userInteractionMatrix);


//this._stage3D.matrixMultM3DPre(this._sphereMatrix);
//this._sphereMatrix
	//this._stage3D.matrixPush();
	//this._stage3D.matrixMultM3D(this._userMatrixTemp);
	//this._stage3D.matrixMultM3D(this._userMatrix);
	//this._stage3D.matrixRotate(e*0.13, 0,1,0);
	// points
	// if(this._displayPoints){
	// 	this._stage3D.bindArrayFloatBuffer(this._vertexPositionAttrib, this._spherePointBuffer);
	// 	this._stage3D.bindArrayFloatBuffer(this._vertexColorAttrib, this._sphereColorBuffer);
	// 	this._stage3D.drawPoints(this._vertexPositionAttrib, this._spherePointBuffer);
	// }
	// triangles
	//console.log("rendering");
	if(this._planeTriangleVertexList){
		
// TRIANGLES
this._stage3D.selectProgram(0);
this._stage3D.enableCulling();
this._stage3D.matrixReset();
		//this._canvas3D._context.activeTexture(null);
		this._stage3D.bindArrayFloatBuffer(this._vertexPositionAttrib, this._planeTriangleVertexList);
		this._stage3D.bindArrayFloatBuffer(this._vertexColorAttrib, this._planeTriangleColorsList);
		this._stage3D.drawTriangles(this._vertexPositionAttrib, this._planeTriangleVertexList);

this._stage3D.disableCulling();

//this._stage3D.enableCulling();
this._stage3D.selectProgram(1);
this._stage3D.matrixReset();
		this._stage3D.bindArrayFloatBuffer(this._textureCoordAttrib, this._texturePoints);
		this._stage3D.bindArrayFloatBuffer(this._vertexPositionAttrib, this._vertexPoints);

		this._canvas3D._context.activeTexture(this._canvas3D._context.TEXTURE0);
		this._canvas3D._context.bindTexture(this._canvas3D._context.TEXTURE_2D,this._texture);
		this._canvas3D._context.uniform1i(this._canvas3D._program.samplerUniform, 0); // 
		this._stage3D.drawTriangles(this._vertexPositionAttrib, this._vertexPoints);
//

// RENDER LINES
this._stage3D.selectProgram(2);
this._stage3D.disableCulling();
this._stage3D.matrixReset();

this._stage3D.bindArrayFloatBuffer(this._programLineVertexPositionAttrib, this._programLinePoints);
this._stage3D.bindArrayFloatBuffer(this._programLineVertexColorAttrib, this._programLineColors);
this._stage3D.drawLines(this._programLineVertexPositionAttrib, this._programLinePoints);


//this._stage3D.matrixReset();
	}else{
this._stage3D.selectProgram(0);
this._renderPointsList = [];
this._renderColorsList = [];
this._renderLinePointsList = [];
this._renderLineColorsList = [];
		// do stuff
var matrix = new Matrix(4,4);

var i, len = this._cameras.length;
/*
var m = new Matrix3D();
m.identity();
this._cameras[0]["extrinsic"] = Matrix3D.matrixFromMatrix3D(m);//(new Matrix(4,4)).identity();
//console.log(this._cameras[0]["extrinsic"])
m.identity();
m.rotateVector(new V3D(0,1,0).norm(), Math.PI*0.25);
this._cameras[1]["extrinsic"] = Matrix3D.matrixFromMatrix3D(m);//Matrix.transform3DRotateX( Matrix.transform3DTranslate((new Matrix(4,4)).identity(), 0,1,0), Math.PI*0.25);
//console.log(this._cameras[1]["extrinsic"].toString())
*/
for(i=0;i<len;++i){
	var camera = this._cameras[i];
	matrix.copy(camera["extrinsic"]);
	this.addCameraVisual(matrix);
}
/*
matrix.identity();
matrix = Matrix.transform3DTranslate(matrix,0,0,0);
matrix = Matrix.transform3DRotateX(matrix, Math.PI*0.0);
this.addCameraVisual(matrix);
*/
		// done
		this._planeTriangleVertexList = this._stage3D.getBufferFloat32Array(this._renderPointsList,3);
		this._planeTriangleColorsList = this._stage3D.getBufferFloat32Array(this._renderColorsList,4);
		console.log(this._planeTriangleVertexList)
		console.log(this._planeTriangleColorsList)




//this._planeTriangleVertexList = 1
// TEXTURES
this._stage3D.selectProgram(1);

		var texture = this._resource.testImage;
		var program = this._canvas3D._program;
		var gl = this._canvas3D._context;
		//gl.bindTexture(gl.TEXTURE_2D, texture);

var obj = new DOImage(texture);
this._root.addChild(obj);
var wid = texture.width;
var hei = texture.height;
var origWid = wid;
var origHei = hei;
wid = Math.pow(2, Math.ceil(Math.log(wid)/Math.log(2)) );
hei = Math.pow(2, Math.ceil(Math.log(hei)/Math.log(2)) );
console.log(wid,hei);
wid = Math.max(wid,hei);
hei = wid;
var origWid = origWid/wid;
var origHei = origHei/hei;
texture = this._stage.renderImage(wid,hei,obj, null);
obj.removeParent();

this._texture = this._canvas3D.bindTextureImageRGBA(texture);
var vert = 1-origHei;
var horz = origWid;
		// 
		var texturePoints = [];
		var vertexPoints = [];
		// do stuff
		texturePoints.push(0,vert, horz,vert, 0,1,        horz,vert, horz,1, 0,1);
		vertexPoints.push(0,-1,0, 3,-1,0, 0,1,0,  3,-1,0, 3,1,0, 0,1,0);
		// set
		this._vertexPositionAttrib = this._stage3D.enableVertexAttribute("aVertexPosition");
		this._textureCoordAttrib = this._stage3D.enableVertexAttribute("aTextureCoord");
		this._texturePoints = this._stage3D.getBufferFloat32Array(texturePoints, 2);
		this._vertexPoints = this._stage3D.getBufferFloat32Array(vertexPoints, 3);



		// LINES
		this._stage3D.selectProgram(2);
		this._programLineVertexPositionAttrib = this._stage3D.enableVertexAttribute("aVertexPosition");
		this._programLineVertexColorAttrib = this._stage3D.enableVertexAttribute("aVertexColor");
		// ....
		this._programLinePoints = this._stage3D.getBufferFloat32Array(this._renderLinePointsList, 3);
		this._programLineColors = this._stage3D.getBufferFloat32Array(this._renderLineColorsList, 4);
	}
	// lines
	// put cameras in 3D world
	// put projected images in 2D world
	// 3D world mouse/keyboard navigation

}
Manual3DR.prototype.handleEnterFrame = function(e){ // 2D canvas
	//console.log(e);
}




