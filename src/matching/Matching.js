// Matching.js

function Matching(){
	var self = this;
	self.imageURLList = new Array();
	self.imageObjectList = null;// = new Array();
	self.imageURLDirectory = "./images/";
	self.imageLoader = new ImageLoader();
	self.ajax = new Ajax();
	self.yaml = new YAML();
	self.resource = null;
	self.canvas = null;
	//self.blob = null;
	this.handle_ajax_success = function(e){
		//console.log("SUCCESS: ");
	}
	this.handle_ajax_failure = function(e){
		//console.log("FAIL: "+e);
	}
	/*this.loadIndex = 0;
	this.loadNext = function(){
		if(self.loadIndex>=self.imageURLList.length){
			self.handleAllImagesLoaded();
		}else{
			self.ajax.get(self.imageURLList[self.loadIndex],self.handle_ajax_success,self.handle_ajax_failure);
			++self.loadIndex;
		}
	}*/
	this.handleAllImagesLoaded = function(){
		var i, j, len, img;
		self.imageObjectList = self.imageLoader.images();
		len = self.imageObjectList.length;
		console.log("TOTAL IMAGES LOADED: "+len);
		for(i=0;i<len;++i){
			img = self.imageObjectList[i];
			//document.body.appendChild(img);
		}
		img = self.imageObjectList[0];
		self.canvas.width(img.width);
		self.canvas.height(img.height);
		self.canvas.drawImage2(img, 0,0);
		var imageData = new Array();
		/*len = img.width*img.height;
		console.log(len);
		for(i=0;i<img.width;++i){
			break;
			var col = self.canvas.getImageData(50,70,1,2);
			console.log(col.data);
			imageData[i] = col;
			break;
		}*/
		//var wid=self.canvas.width(), hei=self.canvas.height();
		//var wid=200, hei=200;
		var ox = 0, oy = 0;
		var wid=self.canvas.width(), hei=self.canvas.height();
		var scale = 2.0;
ox = 500, oy = 250, wid = 100, hei = 100, scale = 10;
//scale = 0.5;
		var dat = self.canvas.getColorArray(ox,oy,wid,hei);
		//dat = self.scaleColorArrayFloor(dat,wid,hei, scale,scale);
		//dat = self.scaleColorArrayLinear(dat,wid,hei, scale,scale);
		//dat = self.scaleColorArrayCubic(dat,wid,hei, scale,scale);
		dat = self.scaleColorArrayCubic(dat,wid,hei, scale,scale);
		wid = Math.floor(wid*scale);
		hei = Math.floor(hei*scale);
		self.canvas.width(wid);
		self.canvas.height(hei);
		self.canvas.setColorArray(dat, 0,0,wid,hei);
/*
img = Code.generateImageFromBit64encode( self.canvas.toDataURL(), function(){
	console.log("LOADED");
	self.canvas.clear();
	self.canvas.context().scale(0.5,0.5);
	self.canvas.drawImage4(img,0,0,400,400);
} ); // Canvas.IMAGE_TYPE_PNG
*/
var x = 0.5, y = 0.5;
//console.log( self.quadric1D(x,x*x,x*x*x, 1,2,3,4) );
// x,x*x,x*x*x, y,y*y,y*y*y
 //console.log( self.quadric2D(x,y, 1,2,3,4, 6,7,8,9, 8,7,6,5, 4,3,2,1) );

	};
	this.scaleColorArrayFloor = function(source, w,h, scaleX, scaleY){
		var wid = Math.floor(w*scaleX);
		var hei = Math.floor(h*scaleY);
		var data = new Array(wid*hei);
		var i, j, sJ, sI, src;
		for(j=0;j<hei;++j){
			sJ = Math.floor(j/scaleY);
			for(i=0;i<wid;++i){
				sI = Math.floor(i/scaleX);
				col = source[ sJ*w +sI ];
				data[j*wid + i] = col;
			}
		}
		return data;
	}
	this.scaleColorArrayLinear = function(source, w,h, scaleX, scaleY){
		var wid = Math.floor(w*scaleX);
		var hei = Math.floor(h*scaleY);
		var data = new Array(wid*hei);
		var i, j, x, y, sJ, sJ1, sI, sI1, colA, colB, colC, colD, r,g,b,a, t;
		var hm1 = hei-1, wm1 = w-1;
		for(j=0;j<hei;++j){
			sJ = Math.floor(j/scaleY);
			sJ1 = Math.min( Math.ceil(j/scaleY), hm1 );
			y = j/scaleY - sJ;
			for(i=0;i<wid;++i){
				sI = Math.floor(i/scaleX);
				sI1 = Math.min( Math.ceil(i/scaleX), wm1);
				x = i/scaleX - sI;
				colA = source[ sJ*w + sI ];
				colB = source[ sJ*w + sI1 ];
				colC = source[ sJ1*w +sI ];
				colD = source[ sJ1*w +sI1 ];
				r = Math.round( self.colorQuadrant(Code.getRedRGBA(colA),Code.getRedRGBA(colB),Code.getRedRGBA(colC),Code.getRedRGBA(colD), x,y) );
				g = Math.round( self.colorQuadrant(Code.getGrnRGBA(colA),Code.getGrnRGBA(colB),Code.getGrnRGBA(colC),Code.getGrnRGBA(colD), x,y) );
				b = Math.round( self.colorQuadrant(Code.getBluRGBA(colA),Code.getBluRGBA(colB),Code.getBluRGBA(colC),Code.getBluRGBA(colD), x,y) );
				a = Math.round( self.colorQuadrant(Code.getAlpRGBA(colA),Code.getAlpRGBA(colB),Code.getAlpRGBA(colC),Code.getAlpRGBA(colD), x,y) );
				col = Code.getColRGBA( r,g,b,a );
				data[j*wid + i] = col;
			}
		}
		return data;
	}
	this.scaleColorArrayCubic = function(source, w,h, scaleX, scaleY){
		var wid = Math.floor(w*scaleX);
		var hei = Math.floor(h*scaleY);
		var data = new Array(wid*hei);
		var i, j, x, y, sJ,sJ1,sJm1,sJp1, sI,sI1,sIm1,sIp1, colA,colB,colC,colD, colE,colF,colG,colH, colI,colJ,colK,colL, colM,colN,colO,colP;
		var hm1 = hei-1, wm1 = w-1;
		for(j=0;j<hei;++j){
			sJ = Math.floor(j/scaleY);
			sJ1 = Math.min( Math.ceil(j/scaleY), hm1 );
			sJm1 = Math.max(sJ-1,0);
			sJp1 = Math.min(sJ1+1,hm1);
			y = j/scaleY - sJ;
			for(i=0;i<wid;++i){
				sI = Math.floor(i/scaleX);
				sI1 = Math.min( Math.ceil(i/scaleX), wm1);
				sIm1 = Math.max(sI-1,0);
				sIp1 = Math.min(sI1+1,wm1);
				x = i/scaleX - sI;
				colA = source[ sJm1*w + sIm1 ];
				colB = source[ sJm1*w + sI ];
				colC = source[ sJm1*w + sI1 ];
				colD = source[ sJm1*w + sIp1 ];
				colE = source[ sJ*w + sIm1 ];
				colF = source[ sJ*w + sI ];
				colG = source[ sJ*w + sI1 ];
				colH = source[ sJ*w + sIp1 ];
				colI = source[ sJ1*w + sIm1 ];
				colJ = source[ sJ1*w + sI ];
				colK = source[ sJ1*w + sI1 ];
				colL = source[ sJ1*w + sIp1 ];
				colM = source[ sJp1*w + sIm1 ];
				colN = source[ sJp1*w + sI ];
				colO = source[ sJp1*w + sI1 ];
				colP = source[ sJp1*w + sIp1 ];
				col = self.colorQuadrantCubic(colA,colB,colC,colD, colE,colF,colG,colH, colI,colJ,colK,colL, colM,colN,colO,colP, x,y);
				//col = self.colorFilter(colA,colB,colC,colD, colE,colF,colG,colH, colI,colJ,colK,colL, colM,colN,colO,colP, x,y);
				data[j*wid + i] = col;
			}
		}
		return data;
	}
	this.colorQuadrant = function(colA,colB,colC,colD, x,y){
		r = colA*(1-x)+colB*(x);
		t = colC*(1-x)+colD*(x);
		return r*(1-y) + t*(y);
	}
	this.colorQuadrantCubic = function(colA,colB,colC,colD, colE,colF,colG,colH, colI,colJ,colK,colL, colM,colN,colO,colP, x,y){
		var r = self.quadric2D(x,y, Code.getRedRGBA(colA), Code.getRedRGBA(colB), Code.getRedRGBA(colC), Code.getRedRGBA(colD), 
							Code.getRedRGBA(colE), Code.getRedRGBA(colF), Code.getRedRGBA(colG), Code.getRedRGBA(colH), 
							Code.getRedRGBA(colI), Code.getRedRGBA(colJ), Code.getRedRGBA(colK), Code.getRedRGBA(colL), 
							Code.getRedRGBA(colM), Code.getRedRGBA(colN), Code.getRedRGBA(colO), Code.getRedRGBA(colP) );
		var g = self.quadric2D(x,y, Code.getGrnRGBA(colA), Code.getGrnRGBA(colB), Code.getGrnRGBA(colC), Code.getGrnRGBA(colD), 
							Code.getGrnRGBA(colE), Code.getGrnRGBA(colF), Code.getGrnRGBA(colG), Code.getGrnRGBA(colH), 
							Code.getGrnRGBA(colI), Code.getGrnRGBA(colJ), Code.getGrnRGBA(colK), Code.getGrnRGBA(colL), 
							Code.getGrnRGBA(colM), Code.getGrnRGBA(colN), Code.getGrnRGBA(colO), Code.getGrnRGBA(colP) );
		var b = self.quadric2D(x,y, Code.getBluRGBA(colA), Code.getBluRGBA(colB), Code.getBluRGBA(colC), Code.getBluRGBA(colD), 
							Code.getBluRGBA(colE), Code.getBluRGBA(colF), Code.getBluRGBA(colG), Code.getBluRGBA(colH), 
							Code.getBluRGBA(colI), Code.getBluRGBA(colJ), Code.getBluRGBA(colK), Code.getBluRGBA(colL), 
							Code.getBluRGBA(colM), Code.getBluRGBA(colN), Code.getBluRGBA(colO), Code.getBluRGBA(colP) );
		var a = self.quadric2D(x,y, Code.getAlpRGBA(colA), Code.getAlpRGBA(colB), Code.getAlpRGBA(colC), Code.getAlpRGBA(colD), 
							Code.getAlpRGBA(colE), Code.getAlpRGBA(colF), Code.getAlpRGBA(colG), Code.getAlpRGBA(colH), 
							Code.getAlpRGBA(colI), Code.getAlpRGBA(colJ), Code.getAlpRGBA(colK), Code.getAlpRGBA(colL), 
							Code.getAlpRGBA(colM), Code.getAlpRGBA(colN), Code.getAlpRGBA(colO), Code.getAlpRGBA(colP) );
		r = Code.color255(r); g = Code.color255(g); b = Code.color255(b); a = Code.color255(a);
		return Code.getColRGBA(r,g,b,a);
	}
	// https://github.com/pdjonov/hqnx/wiki
	// https://github.com/Arcnor/hqx-java/tree/master/src/hqx
	// http://www.hiend3d.com/hq3x.html
	// http://phoboslab.org/log/2010/12/hqx-scaling-in-javascript
	this.colorHQ4X = function(colA,colB,colC, colD,colE,colF, colG,colH,colI){
		return colE;
	}
	this.colorFilter = function(colA,colB,colC,colD, colE,colF,colG,colH, colI,colJ,colK,colL, colM,colN,colO,colP, x,y){
		var r = 0 + Code.getRedRGBA(colB)+ Code.getRedRGBA(colC)+ 0+ 
							Code.getRedRGBA(colE)+ Code.getRedRGBA(colF)+ Code.getRedRGBA(colG)+ Code.getRedRGBA(colH)+ 
							Code.getRedRGBA(colI)+ Code.getRedRGBA(colJ)+ Code.getRedRGBA(colK)+ Code.getRedRGBA(colL)+ 
							0+ Code.getRedRGBA(colN)+ Code.getRedRGBA(colO)+ 0;
		var g = 0+ Code.getGrnRGBA(colB)+ Code.getGrnRGBA(colC)+ 0+ 
							Code.getGrnRGBA(colE)+ Code.getGrnRGBA(colF)+ Code.getGrnRGBA(colG)+ Code.getGrnRGBA(colH)+ 
							Code.getGrnRGBA(colI)+ Code.getGrnRGBA(colJ)+ Code.getGrnRGBA(colK)+ Code.getGrnRGBA(colL)+ 
							0+ Code.getGrnRGBA(colN)+ Code.getGrnRGBA(colO)+ 0;
		var b = 0+ Code.getBluRGBA(colB)+ Code.getBluRGBA(colC)+ 0+ 
							Code.getBluRGBA(colE)+ Code.getBluRGBA(colF)+ Code.getBluRGBA(colG)+ Code.getBluRGBA(colH)+ 
							Code.getBluRGBA(colI)+ Code.getBluRGBA(colJ)+ Code.getBluRGBA(colK)+ Code.getBluRGBA(colL)+ 
							0+ Code.getBluRGBA(colN)+ Code.getBluRGBA(colO)+ 0;
		var a = 0+ Code.getAlpRGBA(colB)+ Code.getAlpRGBA(colC)+ 0+ 
							Code.getAlpRGBA(colE)+ Code.getAlpRGBA(colF)+ Code.getAlpRGBA(colG)+ Code.getAlpRGBA(colH)+ 
							Code.getAlpRGBA(colI)+ Code.getAlpRGBA(colJ)+ Code.getAlpRGBA(colK)+ Code.getAlpRGBA(colL)+ 
							0+ Code.getAlpRGBA(colN)+ Code.getAlpRGBA(colO)+ 0;
		r = Code.color255(r*0.0625); g = Code.color255(g*0.0625); b = Code.color255(b*0.0625); a = Code.color255(a*0.0625);
		return Code.getColRGBA(r,g,b,a);
	}
	this.quadric2D = function(x,y, A,B,C,D, E,F,G,H, I,J,K,L, M,N,O,P){
		var xx = x*x; var xxx = xx*x;
		var yy = y*y; var yyy = yy*y;
		var a = self.quadric1D(x,xx,xxx, A,B,C,D);
		var b = self.quadric1D(x,xx,xxx, E,F,G,H);
		var c = self.quadric1D(x,xx,xxx, I,J,K,L);
		var d = self.quadric1D(x,xx,xxx, M,N,O,P);
		return self.quadric1D(y,yy,yyy, a,b,c,d);
	};
	this.quadric1D = function(t,tt,ttt,A,B,C,D){
		var a = 3*B - 3*C + D - A;
		var b = 2*A - 5*B + 4*C - D;
		var c = B - A;
		var d = B;
		return ( a*ttt + b*tt + c*t + d );
	};
	this.quadric1DBAD = function(t,tt,ttt,A,B,C,D){ // less clear
		var mB = (C-A)/2;
		var mC = (D-B)/2;
		var a = mC + mB - 2*C + 2*B;
		var b = 3*C - mC - 2*mB - 3*B;
		var c = mB;
		var d = B;
		return ( a*ttt + b*tt + c*t + d );
	}
	this.constructor = function(){
		self.resource = new Resource();
		self.canvas = new Canvas(self.resource, null, 0,0);
		self.imageURLList.push("TGAG.jpg");
		self.imageURLList.push("BL.png");
		self.imageURLList.push("BLB.png");
		// ... 
		self.imageLoader.setLoadList(self.imageURLDirectory, self.imageURLList);
		self.imageLoader.setFxnComplete(self.handleAllImagesLoaded);
		self.imageLoader.load();
	}
	self.constructor();
}
/*

DO THIS AGAIN:
http://en.wikipedia.org/wiki/Cubic_interpolation
with HALF the slopes










pn1 = 0;
p0 = 1;
p1 = 2;
p2 = 3;

t = [0.6];
tt = t.*t;
ttt = tt.*t;

p = (-1*ttt+2*tt-t)*pn1 + (1*ttt-2*tt+1)*p0 + (-1*ttt+1*tt+1*t)*p1 + (1*ttt-1*tt)*p2

plot(t,p);





http://en.wikipedia.org/wiki/Bicubic_interpolation

a00 = p00
a01 = p00y
a02 = 
a03 = 
a10 = p00x
a11 = p00xy
a12 = 
a13 = 
a20 = 
a21 = 
a22 = 
a23 = 
a30 = 
a31 = 
a32 = 
a33 = 





p = 0.5*()



F(-1) = A
F(0) = B
F(1) = C
F(2) = D
F'(0) = (C-A)/2
F'(1) = (D-B)/2

F(t) = a*t^3 + b*t^2 + c*t + d
F'(t) = 3*a*t^2 + 2*b*t + c
F''(t) = 6*a*t + 2*b
F'''(t) = 6*a

F(-1) = -a + b - c + d
F(0) = d
F(1) = a + b + c + d
F(2) = 8*a + 4*b + 2*c + d
F'(0) = 

...
A = -a + b - c + d
B = d
C = a + b + c + d
D = 8*a + 4*b + 2*c + d
...
A = -a + b - c + d
 a = -A + b - c + B
...
C = a + b + c + d
 C = (-A + b - c + B) + b + c + B
 C = -A + 2*b + 2*B
 C + A - 2*B = 2*b
 b = C/2 + A/2 - B
...

...


 D = 8*(-A + b - c + B) + 4*(C/2 + A/2 -B) + 2*c + B
 D = -8*A + 8*b - 8*c + 8*B + 2*C + 2*A -4*B + 2*c + B
 D = -6*A + 8*b - 6*c + 5*B + 2*C
 D = -6*A + 8*(C/2 + A/2 -B) - 6*c + 5*B + 2*C
 D = -6*A + 4*C + 4*A -8*B - 6*c + 5*B + 2*C
 D = -2*A + 6*C -3*B - 6*c
 6*c = -2*A + 6*C -3*B - D
c = -A/3 + C - B/2 -D/6
F(t) = a*t^3 + b*t^2 + c*t + d
F(t) = (-A + b - c + B)*t^3 + (C/2 + A/2 -B)*t^2 + (-A/3 + C - B/2 -D/6)*t + B
------------------------------------------------------------------------------------

F(t) = a*t^3 + b*t^2 + c*t + d
F'(t) = 3*a*t^2 + 2*b*t + c
..
F(0) = B
F(1) = C
F'(0) = mB
F'(1) = mC
..
B = d
C = a + b + c + d
mB = c
mC = 3*a + 2*b + c
>>
C = a + b + mB + B
mC = 3*a + 2*b + mB
>>
b = C - a - mB - B
b = mC/2 - a*3/2 - mB/2
>>
C - a - mB - B = mC/2 - a*3/2 - mB/2
C - mB - B = mC/2 - a/2 - mB/2
C - B = mC/2 - a/2 + mB/2
a/2 = mC/2 + mB/2 - C + B
a = mC + mB - 2*C + 2*B
>>
b = C - (mC + mB - 2*C + 2*B) - mB - B
b = C - mC - mB + 2*C - 2*B - mB - B
b = 3*C - mC - 2*mB - 3*B
<><><><>
mB = (C-A)/2;
mC = (D-B)/2;
a = mC + mB - 2*C + 2*B;
b = 3*C - mC - 2*mB - 3*B;
c = mB;
d = B;
t = t;
tt = t*t;
ttt = tt*t;

F = a*ttt + b*tt + c*t + d;

------------------------------------------------------------------------------------
ACTUAL:
------------------------------------------------------------------------------------
t = t;
tt = t*t;
ttt = tt*t;
a = -A + 3*B + 3*C + D;
b = 2*A - 5*B + 4*C - D;
c = -A + B;
d = B;
0.5*( a*ttt + b*tt + c*t + d );









*/