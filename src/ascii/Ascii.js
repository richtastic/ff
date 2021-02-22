// Ascii.js
Ascii.FONT_NAME_CONSOLAS = "Consolas";
Ascii.FONT_NAME_COURIER_NEW = "Courier New";
Ascii.FONT_NAME_LUCIDA_CONSOLE = "Lucida Console";
Ascii.FONT_NAME_LUCIDA_SANS = "Lucida Sans Typewriter";
Ascii.FONT_NAME_MONACO = "Monaco";
Ascii.FONT_NAME_ANDALE_MONO = "Andale Mono";
Ascii.FONT_LIST = [Ascii.FONT_NAME_CONSOLAS, Ascii.FONT_NAME_COURIER_NEW, Ascii.FONT_NAME_LUCIDA_SANS, Ascii.FONT_NAME_MONACO, Ascii.FONT_NAME_ANDALE_MONO];

function Ascii(){
	this._canvas = new Canvas(null,0,0,Canvas.STAGE_FIT_FILL, false,false);
	this._stage = new Stage(this._canvas, 1000/20);
	this._root = new DO();
	this._stage.addChild(this._root);
	this._canvas.addListeners();
	this._stage.addListeners();
	this._stage.start();
	this._canvas.addFunction(Canvas.EVENT_MOUSE_CLICK,this.handleMouseClickFxn,this);
	//this._canvas.addFunction(Canvas.EVENT_ENTER_FRAME,this.handleEnterFrame,this);
	this._stage.addFunction(Stage.EVENT_ON_ENTER_FRAME,this.handleEnterFrame,this);
	

	// var images = ["large.png"];
	// var images = ["bt.000.png"];
	// var images = ["castle.018.jpg"];
	// var images = ["catHat.jpg"];
	// var images = ["medusa_3.png"];
	// var images = ["snow1.png"];
	// var images = ["yB_small.jpg"];
	var images = ["zA_small.jpg"];
	
	
	// var images = ["bench_C.png"];
	// var images = ["iowa/8.JPG"];
	// var images = ["pika_1/image-5.png"];
	
	// var images = ["room0.png"];
	var imageLoader = new ImageLoader("../3DR/images/",images, this,this.handleImageLoaded,null);
	imageLoader.load();
}
Ascii.prototype.handleImageLoaded = function(imageInfo){
	var imageList = imageInfo["images"];
	// var i, j, list = [], d, img;
	// var featurePoints = [];
	// var features = [];
	// var matrixOffY = 10;
	// var matrixOffX = 10.0;
	// var x=0, y=0;
	//
	var display = this._root;


	var GLOBALSTAGE = this._stage;
// display.matrix().scale(1.5);

	var matrixes = [];
	var scales = [];
	for(var i=0;i<imageList.length;++i){
		var img = imageList[i];
		d = new DOImage(img);
			d.graphics().alpha(0.5);
		display.addChild(d);
		var imageMat = this._stage.getImageAsFloatRGB(img);
		var matrix = new ImageMat(imageMat["width"],imageMat["height"],imageMat["red"],imageMat["grn"],imageMat["blu"]);

		var wid = matrix.width()
		var hei = matrix.height();

		// expand color
			/*
		
		
		var siz = 25;
			var red = ImageMat.historizeLocalFloat01(matrix.red(),wid,hei, siz,siz);
			var grn = ImageMat.historizeLocalFloat01(matrix.grn(),wid,hei, siz,siz);
			var blu = ImageMat.historizeLocalFloat01(matrix.blu(),wid,hei, siz,siz);

			matrix.red(red);
			matrix.grn(grn);
			matrix.blu(blu);

			*/
		

		// perimeter blurring high

		// line focused
		var gry = matrix.gry();
		var grad = ImageMat.gradientMagnitude(gry,wid,hei);
			grad = grad["value"];
		ImageMat.normalFloat01(grad);

ImageMat.insetPerimeter(grad, 1, 0.0);


		// var siz = 25;
		// grad = ImageMat.historizeLocalFloat01(grad,wid,hei, 25,25);
		var sigma = 2.0;
		// var sigma = 3.0;
		// grad = ImageMat.getBlurredImage(grad,wid,hei, sigma);
		ImageMat.normalFloat01(grad);
		var blur = ImageMat.getBlurredImage(grad,wid,hei, sigma);
			grad = blur;
		// var sum = ImageMat.addFloat(grad,blur);
			// grad = sum;

		ImageMat.normalFloat01(grad);

		grad = new ImageMat(matrix.width(),matrix.height(),grad,grad,grad);
		matrix = grad;

		// neighborhood maximize contrast


		

		var grad = matrix;


		var img = grad;
		img = GLOBALSTAGE.getFloatRGBAsImage(img.red(),img.grn(),img.blu(), img.width(),img.height());
		var d = new DOImage(img);
			// d.matrix().scale(3.0);
			d.matrix().translate(10,10+matrix.height());
		display.addChild(d);
		
		

		
		var imageScale = new ImageMatScaled(matrix);
		// console.log(imageScale);
		matrixes.push(imageScale);


	}
	var image = matrixes[0];
	console.log(image);


	// determine output resolution:
	var imageWid = imageScale.width();
	var imageHei = imageScale.height();


	var alphabet = Ascii.alphabet();
	console.log(alphabet);
	var charWid = alphabet["width"];
	var charHei = alphabet["height"];
	var spaceX = alphabet["spacing"];
	var spaceY = alphabet["lines"];
	var lexicon = alphabet["alphabet"];


	var fullCharWid = (charWid+spaceX);
	var fullCharHei = (charHei+spaceY);


	// var countWidth = 10;
	// var countWidth = 20;
	// var countWidth = 30;
	// var countWidth = 40;
	// var countWidth = 50;
	// var countWidth = 70;
	var countWidth = 100;
	var countHeight = 10;


	var maxCountWid = Math.floor(imageWid/fullCharWid);
	var maxCountHei = Math.floor(imageHei/fullCharHei);


	console.log("image: "+imageWid+" x "+imageHei);

	console.log(maxCountWid+" x "+maxCountHei);
	

	countWidth = Math.min(countWidth,maxCountWid);
	countHeight = Math.floor( countWidth*(fullCharWid/fullCharHei)*(imageHei/imageWid) );

	console.log("size: "+countWidth+" x "+countHeight);


	// var imageToCharScale = fullCharWid/imageWid;
	var imageToCharScale = fullCharWid/(imageWid/countWidth);
	console.log("imageToCharScale: "+imageToCharScale);



	// l/r spacing & u/d spacing


	var affine = new Matrix2D();
	// affine.copy(matrix);
	var halfX = charWid*0.5;
	var halfY = charHei*0.5;


	
	var output = new ImageMat(countWidth*fullCharWid,countHeight*fullCharHei);

	// set to white
		
var sca = 10.0;
	var block = new ImageMat(charWid,charHei);
	var bestChar = new ImageMat(charWid,charHei);
	// for each block
	for(var j=0; j<countHeight; ++j){
		for(var i=0; i<countWidth; ++i){
			var offsetX = (i*fullCharWid + charWid*0.5)/imageToCharScale;
			var offsetY = (j*fullCharHei + charHei*0.5)/imageToCharScale;
			// extract
			affine.identity();
			// affine.scale(inScale);
			ImageMatScaled.affineToLocationTransform(affine,affine, halfX,halfY, offsetX,offsetY);
			// image.extractRectFast(block, 1.0/imageToCharScale, affine);
			image.extractRectFast(block, imageToCharScale, affine);

			var img = block;
				img = GLOBALSTAGE.getFloatRGBAsImage(img.red(),img.grn(),img.blu(), img.width(),img.height());
			var d = new DOImage(img);
				d.matrix().translate(-charWid*0.5,-charHei*0.5);
				d.matrix().scale(1.0/imageToCharScale);

				d.matrix().translate(offsetX,offsetY);
			display.addChild(d);






			// extract block into temporary image
			// get grayscale
				block.gry(null); // clear
			var gry = block.gry();
			var best = Ascii.bestAlphabetCharacterMatch(gry,lexicon);
			// console.log(lexicon);
			// console.log(best);
			// convert to RGB
			bestChar._r = best;
			bestChar._g = best;
			bestChar._b = best;
			

			output.setSubImage(i*fullCharWid,j*fullCharHei, bestChar);

			// throw "best ..."
			// ImageMat.prototype.setSubImage = function(offX,offY,block){
			// ???
			// find best matching alphabet block (or use mapping?)
			// 
		}
	}


	var img = output;
	img = GLOBALSTAGE.getFloatRGBAsImage(img.red(),img.grn(),img.blu(), img.width(),img.height());
	var d = new DOImage(img);
		// d.matrix().scale(3.0);
		d.matrix().scale(2.0);
		d.matrix().translate(600,10);
	display.addChild(d);

}

Ascii.prototype.handleMouseClickFxn = function(e){
	console.log(e.x,e.y)
}

Ascii.prototype.handleEnterFrame = function(e){
	//console.log(e);
}
/*

- average color
- gradient

*/

Ascii.alphabetCompareCharacter = function(imageColors,letterColors){
	var len = imageColors.length;
	var score = 0;
	for(var i=0; i<len; ++i){
		var a = imageColors[i];
		var b = letterColors[i];
		// score += Math.abs(a-b);
		score += Math.pow(a-b,2);
	}
	return score;
}
Ascii.bestAlphabetCharacterMatch = function(imageColors,alphabet){
	var bestChar = null;
	var bestScore = null;
	for(var i=0; i<alphabet.length; ++i){
		var char = alphabet[i];
		var score = Ascii.alphabetCompareCharacter(imageColors,char);
		// console.log(score);
		// console.log(char);
		if(bestChar===null || score<bestScore){
			bestChar = char;
			bestScore = score;
		}
	}
	// console.log(bestScore);
	// console.log(bestChar);
	// throw "heere";
	return bestChar;
}

//



Ascii.alphabet = function(onlyTheseChars){
	var blockSizeWidth = 5;
	var blockSizeHeight = 7;
	var elementCount = blockSizeWidth*blockSizeHeight;


	var a = {};
    //         00000111112222233333444445555566666
    // upper
	a["A"]  = " *** *   **   **   *******   **   *";
	a["B"]  = "**** *   **   ***** *   **   ***** ";
	a["C"]  = " *****    *    *    *    *     ****";
	a["D"]  = "**** *   **   **   **   **   ***** ";
	a["E"]  = "******    *    **** *    *    *****";
	a["F"]  = "******    *    **** *    *    *    ";
	a["G"]  = " *** *   **    * ****   **   * *** ";
	a["H"]  = "*   **   **   *******   **   **   *";
	a["I"]  = "*****  *    *    *    *    *  *****";
	a["J"]  = " ****    *    *    **   **   * *** ";
	a["K"]  = "*   **   **  * ***  *  * *   **   *";
	a["L"]  = "*    *    *    *    *    *    *****";
	a["M"]  = "*   *** *** * ** * **   **   **   *";
	a["N"]  = "**  ***  ** * ** * ** * **  ***  **";
	a["O"]  = " *** *   **   **   **   **   * *** ";
	a["P"]  = "**** *   **   ***** *    *    *    ";
	a["Q"]  = " *** *   **   **   ** * **  *  ** *";
	a["R"]  = "**** *   **   ***** * *  *  * *   *";
	a["S"]  = " *** *   **     ***     **   * *** ";
	a["T"]  = "*****  *    *    *    *    *    *  ";
	a["U"]  = "*   **   **   **   **   **   * *** ";
	a["V"]  = "*   **   **   **   **   * * *   *  ";
	a["W"]  = "*   **   **   ** * ** * *** ***   *";
	a["X"]  = "*   **   * * *   *   * * *   **   *";
	a["Y"]  = "*   **   **   * ***   *    *    *  ";
	a["Z"]  = "*****    *   *   *   *   *    *****";

	// lower
	a["a"]  = "      ***     * *****   **   * ****";
	a["b"]  = "*    *    **** *   **   **   ***** ";
	a["c"]  = "      *** *   **    *    *   * *** ";
	a["d"]  = "    *    * *****   **   **   * ****";
	a["e"]  = "           *** *   *******     ****";
	a["f"]  = " ***  *  * *   ***   *    *    *   ";
	a["g"]  = "           *****   * ****    ***** ";
	a["h"]  = "*    *    **** *   **   **   **   *";
	a["i"]  = "       *         *    *    *   *** ";
	a["j"]  = "         *         *    **   * *** ";
	a["k"]  = "*    *    *   **  * ***  *  * *   *";
	a["l"]  = " **    *    *    *    *    *    ** ";
	a["m"]  = "          ** * * * ** * ** * ** * *";
	a["n"]  = "          **** *   **   **   **   *";
	a["o"]  = "           *** *   **   **   * *** ";
	a["p"]  = "          **** *   ***** *    *    ";
	a["q"]  = "           *****   * ****    *    *";
	a["r"]  = "          * ** **  **    *    *    ";
	a["s"]  = "           *****     ***     ***** ";
	a["t"]  = "       *    *  *****  *    *    ** ";
	a["u"]  = "          *   **   **   **   * *** ";
	a["v"]  = "          *   **   **   * * *   *  ";
	a["w"]  = "          *   ** * ** * *** ** * * ";
	a["x"]  = "          *   * * *   *   * * *   *";
	a["y"]  = "          *   **   * ****    ***** ";
	a["z"]  = "          *****   *   *   *   *****";

	// numbers
	a["0"]  = " *** *  *** * ** * ** * ***  * *** ";
	a["1"]  = " **    *    *    *    *    *   *** ";
	a["2"]  = " *** *   *    * *** *    *    *****";
	a["3"]  = " *** *   *    * ***     **   * *** ";
	a["4"]  = "   *   **  * * *  * *****   *    * ";
	a["5"]  = "******    ****     *    **   * *** ";
	a["6"]  = " *** *   **    **** *   **   * *** ";
	a["7"]  = "*****    *    *   *   *    *    *  ";
	a["8"]  = " *** *   **   * *** *   **   * *** ";
	a["9"]  = " *** *   **   * ****    **   * *** ";
	a["%"]  = "*   *    *   *   *   *   *    *   *";

	// ?
	a["*"]  = "* * * *** ***** *** * * *          ";
	//         00000111112222233333444445555566666
	a[" "]  = "                                   ";
	a[" "]  = "                                   ";
	//         00000111112222233333444445555566666
	a[" "]  = "                                   ";
	a[" "]  = "                                   ";
	//         00000111112222233333444445555566666
	a[" "]  = "                                   ";
	a[" "]  = "                                   ";
	
	a["\\"] = "*    *     *     *     *     *    *";
	a["/"]  = "    *    *   *   *   *   *    *    ";
	// math
	a["="]  = "           ***       ***           ";
	a["+"]  = "            *   ***   *            ";
	a["-"]  = "                ***                ";
	a["mu"] = "           * *   *   * *           "; // times x

	// partial d
	// integral	
	
	// symbols
	a["_"]  = "                              *****";
	a["$"]  = "  *   ***** *   ***   * *****   *  ";
	a["@"]  = " *** *   ** **** * ** ** *     ****";
	a["^"]  = "  *   * *                          ";
	a["#"]  = "      * * ***** * * ***** * *      ";
	a["&"]  = "  *   * *   *   * ***  * *  *  ** *";
	a["|"]  = "  *    *    *    *    *    *    *  ";
	a["~"]  = " *   * * *   *                     ";
	// bracketing
	a["("]  = " *   *    *    *    *    *     *   ";
	a[")"]  = "   *     *    *    *    *    *   * ";
	a["["]  = " ***  *    *    *    *    *    *** ";
	a["]"]  = " ***    *    *    *    *    *  *** ";
	a["{"]  = "  *   *    *   **    *    *     *  ";
	a["}"]  = "  *     *    *    **   *    *   *  ";
	a[">"]  = "       *     *     *   *   *       ";
	a["<"]  = "       *   *   *     *     *       ";
	// punctuation
	a["!"]  = "       *    *    *         *       ";
	a["."]  = "                                *  ";
	a[";"]  = "                 *         *   **  ";
	a[":"]  = "            *         *            ";
	a[","]  = "                           *   **  ";
	a["?"]  = " *** *   *    *   *   *         *  ";

	//         00000111112222233333444445555566666
	a[" "]  = "                                   ";
	a[" "]  = "                                   ";
	a[" "]  = "                                   ";
	// a["  "] = "***********************************"; // filled
	a[" "]  = "                                   "; // space


	var keys = Code.keys(a);
	var b = [];
	for(var i=0; i<keys.length; ++i){
		var key = keys[i];
		var value = a[key];
		var list = [];
		for(var j=0; j<elementCount; ++j){
			// var val = value.charAt(j)==" " ? 1.0 : 0.0; // dark for 
			var val = value.charAt(j)==" " ? 0.0 : 1.0; // dark for 
			list[j] = val;
		}
		b.push(list);
	}


	return {"spacing":1, "lines":1, "alphabet":b, "width":blockSizeWidth, "height":blockSizeHeight};
}










































// ...
