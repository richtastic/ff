// DOTri.js
function DOTri(img, triDisplay, triImage, parentDO){
	DOTri._.constructor.call(this,parentDO);
	this._image = null;
	this._triDisplay = null;
	this._triImage = null;
	this.displayTri(triDisplay);
	this.imageTri(triImage);
	this.image(img);
}
Code.inheritClass(DOTri, DO);
// ------------------------------------------------------------------------------------------------------------------------ GET/SET
DOTri.prototype.displayTri = function(t){
	if(t!==undefined){
		this._triDisplay = t;
		this.drawImageStatic();
	}
	return this._triDisplay;
}
DOTri.prototype.imageTri = function(t){
	if(t!==undefined){
		this._triImage = t;
		this.drawImageStatic();
	}
	return this._triImage;
}
DOTri.prototype.image = function(img){
	if(img!==undefined){
		this._image = img;
		this.drawImageStatic();
	}
	return this._image;
}

DOTri.prototype.drawImageStatic = function(){
	var graphics = this.graphicsIllustration();
	graphics.clear();
	var image = this._image;
	var triD = this._triDisplay;
	var triI = this._triImage;
	if(image && triD && triI){
		var wid = image.width;
		var hei = image.height;
		var trans = R3D.affineMatrixExact([triI.A(),triI.B(),triI.C()], [triD.A(),triD.B(),triD.C()]);
		//var trans = R3D.homographyFromPoints([triI.A(),triI.B(),triI.C()], [triD.A(),triD.B(),triD.C()]);
		var a = trans.toArray();
		graphics.beginPath();
		graphics.moveTo(triD.A().x,triD.A().y);
		graphics.lineTo(triD.B().x,triD.B().y);
		graphics.lineTo(triD.C().x,triD.C().y);
		graphics.lineTo(triD.A().x,triD.A().y);
		graphics.endPath();
		graphics.clipStart();
			// var matrix = new Matrix2D();
			// matrix.set(a[0],a[1],a[3],a[4],a[2],a[5]);
			// graphics.contextTransform(matrix);
			graphics.contextTransform(a[0],a[1],a[3],a[4],a[2],a[5]);
			graphics.drawImage(image,0,0,wid,hei);
		graphics.clipEnd();
		// debugging:
		// graphics.setLine(1.0,0xFFFF0000);
		// graphics.beginPath();
		// 	graphics.moveTo(triD.A().x,triD.A().y);
		// 	graphics.lineTo(triD.B().x,triD.B().y);
		// 	graphics.lineTo(triD.C().x,triD.C().y);
		// 	graphics.lineTo(triD.A().x,triD.A().y);
		// graphics.endPath();
		// graphics.strokeLine();
	}
}

// ------------------------------------------------------------------------------------------------------------------------ 
DOTri.prototype.kill = function(){
	this._image = null;
	this._triDisplay = null;
	this._triImage = null;
	DOTri._.kill.call(this);
}
		
// ------------------------------------------------------------------------------------------------------------------------ 

