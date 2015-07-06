// Stitching.js

function Stitching(){
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
	//
	var imageList, imageLoader;
	// import image to work with
	imageList = ["snow1.png","snow2.png"];
	imageLoader = new ImageLoader("./images/",imageList, this,this.handleSceneImagesLoaded,null);
	imageLoader.load();
}
Stitching.prototype.handleSceneImagesLoaded = function(imageInfo){
	var imageList = imageInfo.images;
	var i, j, list = [], d, img, x=0, y=0;
var featurePoints = [];
var features = [];
	for(i=0;i<imageList.length;++i){
		img = imageList[i];
		list[i] = img;
		d = new DOImage(img);
		this._root.addChild(d);
		d.moveToBack();
		d.enableDragging();
		d.matrix().identity();
		d.matrix().translate(x,y);
		d.graphics().setLine(1.0,0xFFFF0000);
		d.graphics().beginPath();
		d.graphics().endPath();
		d.graphics().strokeLine();
		//
		var imageMat = this._stage.getImageAsFloatGray(img);
		var points = R3D.pointsCornerDetector(imageMat.gray, imageMat.width,imageMat.height);
		var fxn = function(a,b){
			if(b.z>a.z){
				return 1;
			}else if(b.z<a.z){
				return -1;
			}
			return 0;
		}
		points = points.sort( fxn );

		Code.truncateArray(points,20);
			// var gray = this._stage.getFloatGrayAsImage(points, imageMat.width,imageMat.height, null);
			// d = new DOImage(gray);
			// d.matrix().identity().translate(x,gray.height);
			// this._root.addChild(d);
			for(j=0;j<points.length;++j){
				//console.log(points[j].z);
				var point = points[j];
				var r = 0xFF;
				var g = 0x00;
				var b = 0x00;
				var size = 1 + points[j].z*100000.0;
				var pnt = R3D.drawPointAt(point.x,point.y, r,g,b, size);
				d.addChild(pnt);
				var winSize = 25;
				var sigma = null;//1.6;
				var scale = 0.50;
				var px = point.x;
				var py = point.y;
				var matrix = null;//new Matrix(3,3).identity();
				var win = ImageMat.extractRectFromFloatImage(px,py,scale,sigma, winSize,winSize, imageMat.gray,imageMat.width,imageMat.height, matrix);
// ORIENTATE IMAGE ST PRIMARY GRADIENT DIRECTION IS HORIZONTAL IN +X
				var feature = {center:point,image:win};
					var iii = this._stage.getFloatGrayAsImage(win, winSize,winSize, null);
					var e = new DOImage(iii);
					//e.matrix().identity().translate(Math.random()*400,Math.random()*100);
					e.matrix().identity().translate(j*winSize,i*winSize);
					this._root.addChild(e);
				points[j] = feature;
			}
features.push(points);
		x += img.width;
		y += 0;
	}
	// find best matches in featuresA / B
	//for(j=0;j<features.length;++j){
		//var list = features[j];
		var featureA, featureB;
		var listA = features[0];
		var listB = features[1];
		for(i=0;i<listA.length;++i){
			featureA = listA[i];
			for(j=0;j<listB.length;++j){
				featureB = listB[j];
			}
			//console.log("feat: "+feature.center);
		}
	//}
	// show matches in display
}
Stitching.prototype.combineTriangles = function(){
	var triList = this._tris;
	var imgList = this._imgs;
	console.log(triList);
	console.log(imgList);
}
Stitching.prototype.handleEnterFrame = function(e){ // 2D canvas
	//console.log(e);
}
Stitching.prototype.handleMouseClickFxn = function(e){
	console.log(e.x%400,e.y)
}



