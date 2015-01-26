function FeatureTest(){
	// setup display
	this._canvas = new Canvas(null,1,1,Canvas.STAGE_FIT_FILL);
	this._stage = new Stage(this._canvas, (1/5)*1000);
	this._canvas.addListeners();
	this._stage.addListeners();
	this._stage.start();
	this._root = new DO();
this._root.matrix().scale(1.5);
	this._stage.root().addChild(this._root);
	// load images
	//var imageList = ["caseStudy1-0.jpg","caseStudy1-26.jpg"];
	//var imageList = ["snow1.png","snow2.png"];
	//var imageList = ["F_S_1_1.jpg","F_S_1_2.jpg"];
	//var imageList = ["calibration1-0.jpg","calibration1-1.jpg"];
	//var imageList = ["../../matching/images/original.png","../../matching/images/scalex.png"];
	//var imageList = ["../../matching/images/original.png","../../matching/images/scalexy.png"];
	var imageList = ["../../matching/images/original.png","../../matching/images/scalexrotate.png"];
	//var imageList = ["../../matching/images/original.png","../../matching/images/scalexrotateskew.png"];
	//var imageList = ["catHat.jpg","catHat.jpg"];
	new ImageLoader("./images/",imageList,this,this.imagesLoadComplete).load();
}
FeatureTest.prototype.imagesLoadComplete = function(o){
	this._imageSourceList = [];
	this._imageDOList = [];
	this._imageFilnameList = [];
	this._imageFeatureList = [];
	this.displayImages(o.images,o.files);
	this.findFeatures();
	this.displayFeatures();
}
FeatureTest.prototype.ransacMatches = function(pointsA,pointsB){
	// ...
	var fundamental = R3D.fundamentalRANSACFromPoints(pointsA,pointsB);
	console.log(fundamental);
	
}
FeatureTest.prototype.displayImages = function(images,files){
	var i, d, len, img;
	var currentX = 0, currentY = 0;
	for(i=0;i<images.length;++i){
		img = images[i];
		d = new DOImage(img);
		d.matrix().identity();
		d.matrix().translate(currentX,currentY);
		this._root.addChild(d);
		currentX += img.width;
		this._imageSourceList.push(img);
		this._imageDOList.push(d);
		this._imageFilnameList.push(files[i]);
	}
}
FeatureTest.prototype.findFeatures = function(){
	var i, d, img, len, file, desc;
this._peaks = [];
this._scales = [];
	i = 0;
	for(i=0;i<this._imageSourceList.length;++i){
		img = this._imageSourceList[i];
		file = this._imageFilnameList[i];
		desc = ImageDescriptor.fromImageFileStage(img,file,this._stage);
		this._imageFeatureList[i] = desc;
		var scales = desc.processScaleSpace();
this._scales[i] = scales;
// var peaks = desc.processCornerSpace();
// this._peaks[i] = peaks;
		desc.describeFeatures();
		// 
		desc.dropNonUniqueFeatures();
//break;
	}
//	return;
	//
	var matcher = new ImageMatcher();
	matcher.matchDescriptors(this._imageFeatureList[0], this._imageFeatureList[1]);
	matcher.chooseBestMatches();
	
	var matches = matcher.matches();
	var obj, img, feature, featureA, featureB;
	for(i=0;i<matches.length;++i){
		img = this._imageSourceList[0];
		obj = this._imageDOList[0];
		featureA = matches[i][0];
		this.displayFeature(featureA,obj,img);
		//
		img = this._imageSourceList[1];
		obj = this._imageDOList[1];
		featureB = matches[i][1];
		this.displayFeature(featureB,obj,img);
		//
		var wid = img.width;
		var hei = img.height;
		var xA = featureA.x()*wid;
		var yA = featureA.y()*hei;
		var xB = featureB.x()*wid;
			//xB += wid; // to other image
		var yB = featureB.y()*hei;
			//yB += 0; // to other image
		var d = new DO();
		var col = Code.getColARGB(0xFF,Code.randomInt(0xFF),Code.randomInt(0xFF),Code.randomInt(0xFF));
		d.graphics().clear();
		d.graphics().setLine(1.0,col);
		d.graphics().beginPath();
		d.graphics().moveTo(xA,yA);
		d.graphics().lineTo(xB,yB);
		d.graphics().endPath();
		d.graphics().strokeLine();
		d.matrix().identity();
		this._root.addChild(d);
	}
	
}
FeatureTest.prototype.displayFeatures = function(){
	var i, j, d, img, desc, len, img, obj, fea;
	for(i=0;i<this._imageFeatureList.length;++i){
		desc = this._imageFeatureList[i];
		img = this._imageSourceList[i];
		obj = this._imageDOList[i];
		var features = desc.featureList();
		for(j=0;j<features.length;++j){
			fea = features[j];
//this.displayFeature(fea,obj,img);
		}
this._feaLocX = 0.0;
this._feaLocY = 400.0;
this._feaCount = 0;

		var scales = this._scales[i];
		if(false && i==0 && scales){
			var viz = scales["viz"];
			var arr = viz;
			var currWidth = 400*i;
			var currHeight = 300;
			// 
// 			for(j=0;j<arr.length;++j){
// j = 0
// 				var source = arr[j];
// 				var _src = source["source"];
// 				var _wid = source["width"];
// 				var _hei = source["height"];
// 				var sca = 4.0;
// 				//var _col = ImageMat.ARGBFromFloat(_src);
// 				var _img = this._stage.getFloatRGBAsImage(_src,_src,_src,_wid,_hei);
// 				d = new DOImage(_img);
// 				this._root.addChild(d);
// 				d.matrix().identity();
// 				d.matrix().scale(sca);
// 				d.matrix().translate(currWidth,currHeight);
// 				currWidth += _wid*sca;
// break;
// 			}
			// in-image circling of peak locations
			// var peaks = scales["scalePeaks"];
			// for(j=0;j<peaks.length;++j){
			// 	var peak = peaks[j];
			// 	this.displayPeak(peak,obj,true);
			// }
			// gray DOG base images
			var offScaleX = 0;
			var offScaleY = 300;
			scales = scales["images"];
			for(j=0;j<scales.length;++j){
				var source = scales[j];
				var _src = source["source"];
				var _wid = source["width"];
				var _hei = source["height"];
				_src = ImageMat.normalFloat01(_src);
				//var _col = ImageMat.ARGBFromFloat(_src);
				var _img = this._stage.getFloatRGBAsImage(_src,_src,_src,_wid,_hei);
				d = new DOImage(_img);
				d.matrix().translate(offScaleX,offScaleY);
				this._root.addChild(d);
				offScaleX += _wid;
			}
			
		}
		var peaks = this._peaks[i];
		if(peaks){
			for(j=0;j<peaks.length;++j){
				var peak = peaks[j];
				this.displayPeak(peak,obj);
			}
		}
//break;
	}
}
FeatureTest.prototype.displayPeak = function(peak,obj,scaler){
	var rad = 1.0;
	if(scaler){
		rad = 0.5*peak.value;
	}
	var d = new DO();
	var x = peak.x;
	var y = peak.y;
	//main
	d.graphics().clear();
	d.graphics().setLine(1.0,0xFFFFFF00);
	d.graphics().beginPath();
	d.graphics().setFill(0x22FF0000);
	d.graphics().moveTo(rad,0);
	d.graphics().arc(0,0, rad, 0,Math.PI*2, false);
	d.graphics().endPath();
	d.graphics().fill();
	d.graphics().strokeLine();
	d.matrix().identity();
	d.matrix().translate(x,y);
	obj.addChild(d);
}
FeatureTest.prototype.displayFeature = function(feature,obj,img){
if(obj&&img){
	var wid = img.width;
	var hei = img.height;
	var x = feature.x();
	var y = feature.y();
	var scale = feature.scale();
	x *= wid;
	y *= hei;
	//pt = new V3D(ptList[i].x*wid,ptList[i].y*hei,ptList[i].z);
	var d = new DO();
	var rad = 5.0;
	//rad = 1.0 + 5.0*Math.log(0.1*scale);
	rad = 4.0*scale;
var angles = feature.colorAngle();
var redAng = angles.redAng();
var grnAng = angles.grnAng();
var bluAng = angles.bluAng();
var gryAng = angles.gryAng();
var redMag = angles.redMag();
var grnMag = angles.grnMag();
var bluMag = angles.bluMag();
var gryMag = angles.gryMag();
	//main
	d.graphics().clear();
	d.graphics().setLine(1.0,0xFFFFFF00);
	d.graphics().beginPath();
	d.graphics().setFill(0x22FF0000);
	d.graphics().moveTo(rad,0);
	d.graphics().arc(0,0, rad, 0,Math.PI*2, false);
	d.graphics().endPath();
	d.graphics().fill();
	d.graphics().strokeLine();
	// red line
	d.graphics().setLine(1.0,0xFFFF0000);
	d.graphics().beginPath();
	d.graphics().moveTo(0,0);
	d.graphics().lineTo( rad*Math.cos(redAng)*redMag, rad*Math.sin(redAng)*redMag );
	d.graphics().endPath();
	d.graphics().strokeLine();
	// grn line
	d.graphics().setLine(1.0,0xFF00FF00);
	d.graphics().beginPath();
	d.graphics().moveTo(0,0);
	d.graphics().lineTo( rad*Math.cos(grnAng)*grnMag, rad*Math.sin(grnAng)*grnMag );
	d.graphics().endPath();
	d.graphics().strokeLine();
	// blu line
	d.graphics().setLine(1.0,0xFF0000FF);
	d.graphics().beginPath();
	d.graphics().moveTo(0,0);
	d.graphics().lineTo( rad*Math.cos(bluAng)*bluMag, rad*Math.sin(bluAng)*bluMag );
	d.graphics().endPath();
	d.graphics().strokeLine();
	// grn line
	d.graphics().setLine(1.0,0xFFFFFFFF);
	d.graphics().beginPath();
	d.graphics().moveTo(0,0);
	d.graphics().lineTo( rad*Math.cos(gryAng)*gryMag, rad*Math.sin(gryAng)*gryMag );
	d.graphics().endPath();
	d.graphics().strokeLine();

	d.matrix().identity();
	d.matrix().translate(x,y);
	obj.addChild(d);
};

//return;

//
if(this._feaLocX===undefined){
	this._feaLocX = 0.0;
	this._feaLocY = 300.0;
	this._feaCount = 0;
}
if(this._feaCount<80){
	var _red = feature._flat._red;
	var _grn = feature._flat._grn;
	var _blu = feature._flat._blu;
	var _wid = feature._flat.width();
	var _hei = feature._flat.height();
	var img = this._stage.getFloatRGBAsImage(_red,_grn,_blu,_wid,_hei);
	var sca = 2.0;
	d = new DOImage(img);
	d.matrix().identity();
	d.matrix().scale(sca);
	d.matrix().translate(this._feaLocX,this._feaLocY);
	this._feaLocX += _wid*sca;
	this._root.addChild(d);
	if(this._feaLocX>1200.0){
		this._feaLocX = 0.0;
		this._feaLocY += _hei*sca;
	}
++this._feaCount;
}
}


