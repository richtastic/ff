// Norms.js
function Norms(){
	this._canvas = new Canvas(null, 400,600, Canvas.STAGE_FIT_FILL, false);
	this._stage = new Stage(this._canvas, (1/10)*1000);
	this._stage.start();
	// load images
	this._imageList = new Array();
	var imageLoader = new ImageLoader("/tankzorz/blender/prototype/textures/",
		// ["board_red_1024.png","board_grn_1024.png","board_blu_1024.png"],
		// ["wall_wood_red_1024.png","wall_wood_grn_1024.png","wall_wood_blu_1024.png"],
		["red.png","blu.png","grn.png"],
		 this,this._imageCompleteFxn,null);
	imageLoader.load();
}
Norms.prototype._imageCompleteFxn = function(o){
	var i, len;
	var imageList = o.images;
	var images = new Array();
	var argbs = new Array();
	var floats = new Array();
	var combineds = new Array();
	var rgbas; //  = new Array();
	var argb;
	for(i=0;i<imageList.length;++i){
		images[i] = new DOImage(imageList[i]);
		this._stage.root().addChild(images[i]);
	}
	var wid = images[0].width();
	var hei = images[0].height();
	console.log(wid,hei);
	for(i=0;i<images.length;++i){
		argbs[i] = this._stage.getDOAsARGB(images[i], wid,hei, null);
		floats[i] = ImageMat.getFloats01FromARGB255(argbs[i]); // to [0,1.0]
		// ImageMat.addConst(floats[i][1],-0.5); // to [-0.5,0.5]
		// ImageMat.addConst(floats[i][2],-0.5);
		// ImageMat.addConst(floats[i][3],-0.5);
			// ImageMat.normalFloat01(floats[i]);
		floats[i] = floats[i][1+i];//ImageMat.maxFloat(ImageMat.maxFloat(floats[i][1],floats[i][2]),floats[i][3]); // r + g + b => grab whichever channel(s) was(were) used
		//ImageMat.randomFloat01(floats[i]);
	}
	ImageMat.addConst(floats[0],-0.5); // to [-0.5,0.5]
	ImageMat.addConst(floats[1],-0.5);
	ImageMat.addConst(floats[2],-0.5);
	ImageMat.normFloats3D(floats[0],floats[1],floats[2]); // to [-1.0,1.0]
	ImageMat.mulConst(floats[0],0.5); // to [-0.5,0.5]
	ImageMat.mulConst(floats[1],0.5);
	ImageMat.mulConst(floats[2],0.5);
	ImageMat.addConst(floats[0],0.5); // to [0,1.0]
	ImageMat.addConst(floats[1],0.5);
	ImageMat.addConst(floats[2],0.5);
	argb = ImageMat.ARGBFromFloats(floats[0],floats[1],floats[2]);

	var img = this._stage.getARGBAsImage(argb, wid,hei);
	img.style.zIndex = 99;
	img.style.position = "absolute";
	Code.addChild(document.body, img );
	/*
	ImageMat.addConst(floats[i][1],-0.5); // to [-0.5,0.5]
		ImageMat.addConst(floats[i][2],-0.5);
		ImageMat.addConst(floats[i][3],-0.5);
		ImageMat.normFloats3D(floats[i][1],floats[i][2],floats[i][3]); // to [-1.0,1.0]
		ImageMat.multConst(floats[i][1],0.5); // to [-0.5,0.5]
		ImageMat.multConst(floats[i][2],0.5);
		ImageMat.multConst(floats[i][3],0.5);
		ImageMat.addConst(floats[i][1],0.5); // to [0,1.0]
		ImageMat.addConst(floats[i][2],0.5);
		ImageMat.addConst(floats[i][3],0.5);
	*/
}



/*


*/
