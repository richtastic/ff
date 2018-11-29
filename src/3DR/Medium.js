// Medium.js

function Medium(){
	this._canvas = new Canvas(null,0,0,Canvas.STAGE_FIT_FILL, false,false);
	this._stage = new Stage(this._canvas, 1000/20);
	this._root = new DO();
	this._stage.addChild(this._root);
	this._canvas.addListeners();
	this._stage.addListeners();
	this._stage.start();
	// this._canvas.addFunction(Canvas.EVENT_MOUSE_CLICK,this.handleMouseClickFxn,this);
	this._keyboard = new Keyboard();
	// this._keyboard.addFunction(Keyboard.EVENT_KEY_UP,this.handleKeyboardUp,this);
	// this._keyboard.addFunction(Keyboard.EVENT_KEY_DOWN,this._handleKeyboardDown,this);
	// this._keyboard.addFunction(Keyboard.EVENT_KEY_STILL_DOWN,this.handleKeyboardStill,this);
	// this._keyboard.addListeners();
	// this._ticker = new Ticker(1);
	// this._ticker.addFunction(Ticker.EVENT_TICK, this.handleTickerFxn, this);
	// this._tickCount = 0;
	
	// var imageList = ["caseStudy1-0.jpg", "caseStudy1-9.jpg"];
	var imageLoader = new ImageLoader("./images/",imageList, this,this.handleImagesLoaded,null);

	var imageList = ["room0.png", "room2.png"];
	var imageLoader = new ImageLoader("./images/",imageList, this,this.handleImagesLoadedRectify,null);
	imageLoader.load();
}

Medium.prototype.handleImagesLoaded = function(imageInfo){
	var imageList = imageInfo.images;
	var fileList = imageInfo.files;
	var i, j, k, list = [];
	var x = 0;
	var y = 0;
	var images = [];
	for(i=0;i<imageList.length;++i){
		var file = fileList[i];
		var img = imageList[i];
		images[i] = img;
		var d = new DOImage(img);
		this._root.addChild(d);
		//d.graphics().alpha(0.01);
		d.graphics().alpha(1.0);
		d.matrix().translate(x,y);
		x += img.width;
	}

	GLOBALSTAGE = this._stage;

	var imageSourceA = images[0];
	var imageFloatA = GLOBALSTAGE.getImageAsFloatRGB(imageSourceA);
	var imageMatrixA = new ImageMat(imageFloatA["width"],imageFloatA["height"], imageFloatA["red"], imageFloatA["grn"], imageFloatA["blu"]);

	var imageSourceB = images[1];
	var imageFloatB = GLOBALSTAGE.getImageAsFloatRGB(imageSourceB);
	var imageMatrixB = new ImageMat(imageFloatB["width"],imageFloatB["height"], imageFloatB["red"], imageFloatB["grn"], imageFloatB["blu"]);

	var pointsA = [
				new V2D(86,208), // glasses corner left
				new V2D(190,180), // glasses corner right
				new V2D(172,107), // origin
				new V2D(22.5,166), // lighter button
				new V2D(361,183), // mouse eye
				new V2D(18,225), // bic corner left
				new V2D(37,216), // bic corner right
				new V2D(65,169), // cup 
				new V2D(226,87), // face BL
				new V2D(219,66), // glasses TL
				new V2D(250,72), // glasses TR
				new V2D(260,103), // elbow
				new V2D(216,154), // toe left
				new V2D(245,158), // toe right
				new V2D(202,127), // brick
				new V2D(240,248), // 12
				new V2D(332,249), // 16
				new V2D(145,203), // glasses center
				new V2D(172,68), // grid top
				new V2D(141,76), // grid TL
				new V2D(204,75), // grid TR
				new V2D(144,119), // grid BL
				new V2D(175,128), // grid bot
				new V2D(362,213), // U
				new V2D(326,176), // tail
				new V2D(190,173), // base left
				new V2D(265,178), // base right
				new V2D(372,181), // nose
				new V2D(129,88), // power top
				new V2D(132,141), // power bot
				new V2D(62,107), // cup
				new V2D(94,176), // glass tip left
				new V2D(131,166), // glass tip right
			];
var pointsB = [
				new V2D(87,192),
				new V2D(170,178),
				new V2D(212,46),
				new V2D(50,149),
				new V2D(278,241),
				new V2D(52,179), // left
				new V2D(64,172), // right//new V2D(18,225), // right
				new V2D(94,124), 
				new V2D(225,98), // face BL
				new V2D(221,80), // glasses TL
				new V2D(246,95), // glasses TR
				new V2D(250,121),
				new V2D(214,139), // tow left
				new V2D(237,150), // toe right
				new V2D(213,106), // brick
				new V2D(180,252), // 12
				new V2D(245,271), // 16
				new V2D(131,193), // glasses center
				new V2D(213,12), // grid top
				new V2D(177,26), // grid TL
				new V2D(239,33), // grid TR
				new V2D(180,61), // grid BL
				new V2D(202,83), // grid bot
				new V2D(282,251), // U
				new V2D(256,225), // tail
				new V2D(187,153), // base left
				new V2D(245,173), // base right
				new V2D(290,240), // nose
				new V2D(150,63), // power top
				new V2D(155,100), // power bot
				new V2D(85,92), // cup
				new V2D(113,138), // glass tip left
				new V2D(145,132), // glass tip right
			];
	var i, j, c, d, point, color, rad;
GLOBALSTAGE = this._stage;
	rad = 3;
	for(i=0; i<pointsA.length; ++i){
		point = pointsA[i];
		color = 0xFFFF0000;
		c = new DO();
		c.graphics().setLine(1.0, color);
		c.graphics().beginPath();
		c.graphics().drawCircle(point.x, point.y, rad);
		c.graphics().strokeLine();
		c.graphics().endPath();
		//GLOBALSTAGE.addChild(c);
		//
		point = pointsB[i];
		color = 0xFF0000FF;
		c = new DO();
		c.graphics().setLine(1.0, color);
		c.graphics().beginPath();
		c.graphics().drawCircle(point.x, point.y, rad);
		c.graphics().strokeLine();
		c.graphics().endPath();
		c.matrix().translate(imageMatrixA.width(), 0);
		//GLOBALSTAGE.addChild(c);
	}
	//
	this.testSearchLine(imageMatrixA,pointsA, imageMatrixB,pointsB);
	//Medium.mediumMatch(imageMatrixA,pointsA, imageMatrixB,pointsB, this);
}
Medium.prototype.testSearchLine = function(imageMatrixA,pointsA, imageMatrixB,pointsB){
	var matrixFfwd = R3D.fundamentalMatrix(pointsA,pointsB);
		matrixFfwd = R3D.fundamentalMatrixNonlinear(matrixFfwd,pointsA,pointsB);
	var matrixFrev = R3D.fundamentalInverse(matrixFfwd);
	//console.log(matrixFfwd.toArray());


	var matrixFfwd = new Matrix(3,3,[-0.00000734112314980731,0.0000014042825121461254,0.013796878168112627,0.0000122314671933435,0.000007232305118445193,0.004501805291850403,-0.011833960961180797,-0.005617128022406133,-0.3919487408251769]);
	console.log("F = "+matrixFfwd.toArray()+"; ");


	var matrixFrev = R3D.fundamentalInverse(matrixFfwd);
	console.log(matrixFfwd+"");
	//console.log(matrixFfwd.toArray()+"");

	// matches = [];
	// for(i=0; i<pointsA.length; ++i){
	// 	matches.push({"pointA":pointsA[i], "pointB":pointsB[i]});
	// }
/*
	console.log("showRansac");
	R3D.showRansac(pointsA,pointsB, matrixFfwd, matrixFrev);
*/



/*
// VARIABILITY TESTING:
console.log("VAR");
var gryA = imageMatrixA.gry();
//var gryA = imageMatrixB.gry();
var widA = imageMatrixA.width();
var heiA = imageMatrixA.height();
var blrA = gryA;
//var blrA = ImageMat.getBlurredImage(gryA,widA,heiA, 1.0);
//var blrA = ImageMat.getBlurredImage(gryA,widA,heiA, 2.0);
//var blrA = ImageMat.getBlurredImage(gryA,widA,heiA, 4.0);
//var blrA = ImageMat.getBlurredImage(gryA,widA,heiA, 8.0);
//var varA = Code.variabilityImage(blrA, widA, heiA, null, true);
//var varA = Code.variabilityImage(gryA, widA, heiA, null, true);
//var varA = ImageMat.getBlurredImage(varA,widA,heiA, 1.0);
//var crnA = R3D.cornerScaleScores(gryA,widA,heiA).value;
var crnA = R3D.cornerScaleScores(blrA,widA,heiA).value;

//var useA = varA;
var useA = crnA;
	var heat = ImageMat.normalFloat01(Code.copyArray(useA));
		//heat = ImageMat.invertFloat01(heat);
		heat = ImageMat.pow(heat,.1);
		heat = Code.grayscaleFloatToHeatMapFloat(heat);
	var img = GLOBALSTAGE.getFloatRGBAsImage(heat["red"],heat["grn"],heat["blu"], widA, heiA);
		img = new DOImage(img);
		img.matrix().scale(1.0);
		img.matrix().translate(810, 10);
		GLOBALSTAGE.addChild(img);

return;
*/


/*

//REFINE TESTING:
console.log("REFINE TESTING:");
// var pointA = new V2D();
// var pointB = new V2D();
// var scaleA = ;
// var angleA = ;
// var scaleB = ;
// var angleB = ;

// A
// var pointA = new V2D(0.4826086956521739,0.2906976744186046);
// var pointB = new V2D(0.5747126436781609,0.13409961685823754);
// var scaleA = 27.857618025475976;
// var angleA = 3.0537559696380288;
// var scaleB = 18.37917367995256;
// var angleB = 3.226816531704016;

// 7
// var pointA = new V2D(0.06,0.72);
// var pointB = new V2D(0.13478260869565217,0.5813953488372092);
// var scaleA = 64;
// var angleA = 2.933224599082247;
// var scaleB = 27.857618025475976;
// var angleB = 3.0500680222948797;

// 10
// var pointA = new V2D(0.4130434782608695,0.4069767441860465);
// var pointB = new V2D(0.4869565217391304,0.2383720930232558);
// var scaleA = 27.857618025475976;
// var angleA = 4.803505667844803;
// var scaleB = 27.857618025475976;
// var angleB = 4.798063837041702;

// 34
// var pointA = new V2D(0.35526315789473684,0.6666666666666666);
// var pointB = new V2D(0.32894736842105265,0.6403508771929824);
// var scaleA = 42.224253144732614;
// var angleA = 4.652359071438693;
// var scaleB = 42.224253144732614;
// var angleB = 4.600310944356706;

// 100 --- bad orientation
// var pointA = new V2D(0.3735632183908046,0.2796934865900383);
// var pointB = new V2D(0.4683908045977011,0.10344827586206895);
// var scaleA = 1.837917e+1;
// var angleA = 3.050936e+0;
// var scaleB = 1.837917e+1;
// var angleB = 1.150317e+0;


var scaleAToB = scaleB/scaleA;
var angleAToB = 0;
var skewXAToB = 0;
var skewYAToB = 0;
var tranXAToB = 0;
var tranYAToB = 0;
pointA.scale(imageMatrixA.width(),imageMatrixA.height());
pointB.scale(imageMatrixB.width(),imageMatrixB.height());



console.log(imageMatrixA,imageMatrixB, pointA,scaleA,angleA,skewXAToB,skewYAToB, pointB,scaleB,angleB);
var result = R3D.refineTransformNonlinearGD(imageMatrixA,imageMatrixB, pointA,scaleA,angleA, pointB,scaleB,angleB, scaleAToB,angleAToB,skewXAToB,skewYAToB,tranXAToB,tranYAToB);
//console.log(result);
var scaleAToB = result["scale"];
var angleAToB = result["angle"];
var skewXAToB = result["skewX"];
var skewYAToB = result["skewY"];
var transAToB = result["trans"];
var tranXAToB = transAToB.x;
var tranYAToB = transAToB.y;



console.log(" scale: "+scaleAToB+" | angle: "+angleAToB+" | skewX: "+skewXAToB+" |  skewY: "+skewYAToB+" | trans: "+tranXAToB+","+tranYAToB);
// show single AFTER

var compareSize = 51;
var compareScale = 1.0;


matrix = new Matrix(3,3);
var imageA = imageMatrixA;
var imageB = imageMatrixB;
	
	var matrix = new Matrix(3,3).identity();
		matrix = Matrix.transform2DTranslate(matrix, -compareSize*0.5, -compareSize*0.5);
			matrix = Matrix.transform2DScale(matrix, scaleA/compareSize);
			matrix = Matrix.transform2DRotate(matrix, -angleA);
			matrix = Matrix.transform2DScale(matrix, scaleAToB);
			matrix = Matrix.transform2DRotate(matrix, angleAToB);
			matrix = Matrix.transform2DSkewX(matrix, skewXAToB);
			matrix = Matrix.transform2DSkewY(matrix, skewYAToB);
			matrix = Matrix.transform2DTranslate(matrix, tranXAToB, tranYAToB );
		matrix = Matrix.transform2DTranslate(matrix, pointA.x, pointA.y );
	var needleA = imageA.extractRectFromMatrix(compareSize,compareSize, matrix);
	
	var matrix = new Matrix(3,3).identity();
		matrix = Matrix.transform2DTranslate(matrix, -compareSize*0.5, -compareSize*0.5);
		matrix = Matrix.transform2DScale(matrix, scaleB/compareSize);
		matrix = Matrix.transform2DRotate(matrix, -angleB);
		matrix = Matrix.transform2DTranslate(matrix, pointB.x, pointB.y );
	var needleB = imageB.extractRectFromMatrix(compareSize,compareSize, matrix);




var sca = 4.0;
	var vizA = GLOBALSTAGE.getFloatRGBAsImage(needleA.red(), needleA.grn(), needleA.blu(), needleA.width(), needleA.height());
	var vizA = new DOImage(vizA);
	var vizB = GLOBALSTAGE.getFloatRGBAsImage(needleB.red(), needleB.grn(), needleB.blu(), needleB.width(), needleB.height());
	var vizB = new DOImage(vizB);
i = 0;
	vizA.matrix().scale(sca);
	vizA.matrix().translate(810 + Math.floor(i/10)*compareSize*sca*2 + 0, 10 + (i%10)*compareSize*sca);
	vizB.matrix().scale(sca);
	vizB.matrix().translate(810 + Math.floor(i/10)*compareSize*sca* 2 + compareSize*sca, 10 + (i%10)*compareSize*sca);
	GLOBALSTAGE.addChild(vizA);
	GLOBALSTAGE.addChild(vizB);

return;


*/











}

Medium.prototype.handleImagesLoadedRectify = function(imageInfo){

	var imageList = imageInfo.images;
	var fileList = imageInfo.files;
	var i, j, k, list = [];
	var x = 0;
	var y = 0;
	var images = [];
	for(i=0;i<imageList.length;++i){
		var file = fileList[i];
		var img = imageList[i];
		images[i] = img;
		var d = new DOImage(img);
		this._root.addChild(d);
		d.graphics().alpha(0.1);
		// d.graphics().alpha(1.0);
		d.matrix().translate(x,y);
		x += img.width;
	}

	GLOBALSTAGE = this._stage;

	var imageSourceA = images[0];
	var imageFloatA = GLOBALSTAGE.getImageAsFloatRGB(imageSourceA);
	var imageMatrixA = new ImageMat(imageFloatA["width"],imageFloatA["height"], imageFloatA["red"], imageFloatA["grn"], imageFloatA["blu"]);

	var imageSourceB = images[1];
	var imageFloatB = GLOBALSTAGE.getImageAsFloatRGB(imageSourceB);
	var imageMatrixB = new ImageMat(imageFloatB["width"],imageFloatB["height"], imageFloatB["red"], imageFloatB["grn"], imageFloatB["blu"]);

var points;

var pointsA = [];
points = pointsA;
points.push( new V2D(157.00123897822408,117.99654507138962) ); // 0
points.push( new V2D(443.1484653609749,126.19073901368628) ); // 1
points.push( new V2D(221.1468444196387,158.79321513882613) ); // 2
points.push( new V2D(491.99438359511606,189.99524633931225) ); // 3
points.push( new V2D(111.99977848842428,128.99976311726115) ); // 4
points.push( new V2D(202.14890202303147,131.8189183267216) ); // 5
points.push( new V2D(390.99999402522263,159.9999154466707) ); // 6
points.push( new V2D(217.98577342208978,174.03861057084063) ); // 7
points.push( new V2D(103.00011297055039,132.999910347573) ); // 8
points.push( new V2D(192.86672649088848,182.07019010516458) ); // 9
points.push( new V2D(158.82815216208544,154.0614258306045) ); // 10
points.push( new V2D(409.9222177254667,212.11857967337374) ); // 11
points.push( new V2D(156.99456726056067,189.00292498647372) ); // 12
points.push( new V2D(64.99815963038198,182.00291322212362) ); // 13
points.push( new V2D(31.999972052730524,335.999748925472) ); // 14
points.push( new V2D(139.9927528454267,161.0065827140237) ); // 15
points.push( new V2D(391.99994483861116,143.99998950145067) ); // 16
points.push( new V2D(199.69179752263028,159.90832852846896) ); // 17
points.push( new V2D(110.00006045963997,210.00175459077374) ); // 18
points.push( new V2D(138.66622384204868,193.3374233467617) ); // 19
points.push( new V2D(327.00069558078144,217.99966352090428) ); // 20
points.push( new V2D(391.1883461896124,224.85589061123193) ); // 21
points.push( new V2D(395.99999702890653,93.99999747969858) ); // 22
points.push( new V2D(389.999868260874,174.99998098442782) ); // 23
points.push( new V2D(257.00455890734844,172.0035808592512) ); // 24
points.push( new V2D(54.99999256055244,186.0014194041345) ); // 25
points.push( new V2D(139.8035931270595,179.9950870847713) ); // 26
points.push( new V2D(280.0000108040066,130.00001690748368) ); // 27
points.push( new V2D(41.32992738817255,237.32668325085396) ); // 28
points.push( new V2D(252.9176800240253,104.05730798237428) ); // 29
points.push( new V2D(13.000467414695603,225.00391367341004) ); // 30
points.push( new V2D(58.000090040716906,343.9986268335392) ); // 31
points.push( new V2D(462.9991269118981,268.9995865540776) ); // 32
points.push( new V2D(239.99881402965678,168.99680765325346) ); // 33
points.push( new V2D(466.00027610525507,345.99992156873384) ); // 34
points.push( new V2D(282.000014846007,179.0000050571566) ); // 35
points.push( new V2D(380.9999965198589,166.00000147329138) ); // 36
points.push( new V2D(284.0018722771952,284.00093519698765) ); // 37
points.push( new V2D(178.00034086718753,255.999844050441) ); // 38
points.push( new V2D(248.99139324731098,168.99970130811812) ); // 39
points.push( new V2D(94.00017093557582,326.999580850823) ); // 40
points.push( new V2D(196.00006399797243,322.9998192430231) ); // 41
points.push( new V2D(316.99771662753614,288.99982501703914) ); // 42
points.push( new V2D(310.99974983547196,319.9998451051207) ); // 43
points.push( new V2D(293.3332921272273,93.33334354788512) ); // 44
points.push( new V2D(393.00009455649706,128.00003712502328) ); // 45
points.push( new V2D(257.9988795148508,183.00216980934118) ); // 46
points.push( new V2D(380.99999854476863,173.00000004387678) ); // 47
points.push( new V2D(171.99989952115223,320.0003235237201) ); // 48
points.push( new V2D(401.3332958307844,321.3333362518387) ); // 49
points.push( new V2D(324.0004522159073,326.6662099530253) ); // 50
points.push( new V2D(384.00000104164855,119.00000056636856) ); // 51
points.push( new V2D(326.99915908172875,324.99969679859083) ); // 52
points.push( new V2D(467.9982999877891,309.99906324120434) ); // 53
points.push( new V2D(412.00001250778854,81.33335582599041) ); // 54
points.push( new V2D(144.9999950752251,283.0000409116242) ); // 55
points.push( new V2D(169.99998807308046,260.99989740627865) ); // 56
points.push( new V2D(407.9999909119138,118.0000280255259) ); // 57
points.push( new V2D(303.0000007191145,90.00000236026952) ); // 58
points.push( new V2D(381.9999958242321,150.00000087514732) ); // 59


var pointsB = [];
points = pointsB;
points.push( new V2D(217.9982927965369,58.99719157922153) ); // 0
points.push( new V2D(497.1700170222337,70.18907252258552) ); // 1
points.push( new V2D(241.0677252849458,100.05012002200628) ); // 2
points.push( new V2D(493.09868384933105,146.93858558948276) ); // 3
points.push( new V2D(168.0001225806397,68.99916640717299) ); // 4
points.push( new V2D(231.89378039022273,72.79677943616001) ); // 5
points.push( new V2D(420.9999563810089,107.99983547146284) ); // 6
points.push( new V2D(230.94840977727426,115.08688479167982) ); // 7
points.push( new V2D(157.9994540025899,73.0001166111837) ); // 8
points.push( new V2D(204.00075358572522,122.00935112350248) ); // 9
points.push( new V2D(189.11136542650874,93.39665876319494) ); // 10
points.push( new V2D(437.9471759645499,167.96884493131296) ); // 11
points.push( new V2D(170.99587864701195,126.00349316926943) ); // 12
points.push( new V2D(83.00174559420928,115.00180234778998) ); // 13
points.push( new V2D(36.0002280625699,236.00066617276457) ); // 14
points.push( new V2D(168.7839684704845,100.03765888141596) ); // 15
points.push( new V2D(422.9997994192055,89.99985704439774) ); // 16
points.push( new V2D(220.06906149737412,100.80869543655747) ); // 17
points.push( new V2D(115.99972288448886,141.99975057075142) ); // 18
points.push( new V2D(151.99643911776437,129.33507547068504) ); // 19
points.push( new V2D(301.9997935275872,163.99976609064592) ); // 20
points.push( new V2D(423.00098379446456,180.99941544163332) ); // 21
points.push( new V2D(429.9999994263959,30.99998628550891) ); // 22
points.push( new V2D(419.000005103147,125.00000330330845) ); // 23
points.push( new V2D(283.99979746962913,116.00216412099864) ); // 24
points.push( new V2D(74.0021113107963,117.99994429886043) ); // 25
points.push( new V2D(160.98543152929994,116.9155444690823) ); // 26
points.push( new V2D(310.9999968465321,72.00004707162638) ); // 27
points.push( new V2D(28.002302620320112,157.32655867930436) ); // 28
points.push( new V2D(287.00139355537584,44.00033163106939) ); // 29
points.push( new V2D(18.029852948409154,146.94710633386123) ); // 30
points.push( new V2D(33.999858055192995,241.99969034687214) ); // 31
points.push( new V2D(425.33335549301233,229.33336296142625) ); // 32
points.push( new V2D(257.99997597678333,110.99720980228683) ); // 33
points.push( new V2D(386.6665259662911,304.0002931190142) ); // 34
points.push( new V2D(312.00000415477746,123.99999171752857) ); // 35
points.push( new V2D(410.9999975649486,114.99999986708295) ); // 36
points.push( new V2D(228.0044730470489,219.99653787800824) ); // 37
points.push( new V2D(180.9991140392407,188.99960773837532) ); // 38
points.push( new V2D(280.0024846084654,111.99455903756001) ); // 39
points.push( new V2D(81.99848639722644,236.00032410223548) ); // 40
points.push( new V2D(156.99974948545324,244.99999959938424) ); // 41
points.push( new V2D(247.9963715527518,227.99975999439485) ); // 42
points.push( new V2D(251.00004347554307,256.9999047880389) ); // 43
points.push( new V2D(323.99995220202646,32.00000746245024) ); // 44
points.push( new V2D(424.0002883751363,71.00011661587054) ); // 45
points.push( new V2D(285.00155262094677,127.00257296756783) ); // 46
points.push( new V2D(411.000000130309,122.99999949463273) ); // 47
points.push( new V2D(132.9999872947233,238.9999817950458) ); // 48
points.push( new V2D(340.0002355207096,271.9998286487727) ); // 49
points.push( new V2D(285.99703510537285,268.0007218622504) ); // 50
points.push( new V2D(412.9999998955282,61.00000232967291) ); // 51
points.push( new V2D(261.9997487694299,262.99989310651404) ); // 52
points.push( new V2D(417.99524037984213,271.9954874317487) ); // 53
points.push( new V2D(302.6666674863311,18.66666772650611) ); // 54
points.push( new V2D(139.9999618316551,208.00005750742355) ); // 55
points.push( new V2D(171.00006618904337,191.99986216027332) ); // 56
points.push( new V2D(441.99998689799884,60.00004037512646) ); // 57
points.push( new V2D(333.00000315916094,27.99999960876695) ); // 58
points.push( new V2D(411.9999963323768,96.99999813008753) ); // 59

	F = [8.81121731206021e-8,0.000010114343292779635,-0.0012512115388550813,1.0539861656966728e-7,-0.000004023737922070967,-0.01313862645804628,0.00009352376307345056,0.011747687492820876,-0.597184751416662];

	var matrixFfwd = new Matrix(3,3).fromArray(F);
	// console.log("F = "+matrixFfwd.toArray()+"; ");
	var matrixFrev = R3D.fundamentalInverse(matrixFfwd);
	// console.log(matrixFrev+"");


	var epipole = R3D.getEpipolesFromF(matrixFfwd);
	var epipoleA = epipole["A"];
	var epipoleB = epipole["B"];

	var rectified = R3D.polarRectification(imageMatrixA,epipoleA);
	console.log(rectified);
		var rectifiedInfoA = rectified;
		var rotationA = rectifiedInfoA["rotation"];
		var rectifiedA = new ImageMat(rectified.width,rectified.height, rectified.red,rectified.grn,rectified.blu);
			rectified = rectifiedA;
		var img = GLOBALSTAGE.getFloatRGBAsImage(rectified.red(), rectified.grn(), rectified.blu(), rectified.width(), rectified.height());
		var d = new DOImage(img);
		console.log(rotationA)
		if(rotationA!=0){
			d.matrix().translate(-rectifiedA.width()*0.5, -rectifiedA.height()*0.5);
			d.matrix().rotate( Code.radians(rotationA) );
			d.matrix().translate(rectifiedA.width()*0.5, rectifiedA.height()*0.5);
		}
		//d.matrix().scale(1.0);
		d.matrix().translate(0, 0);
		GLOBALSTAGE.addChild(d);



	var rectified = R3D.polarRectification(imageMatrixB,epipoleB);
	console.log(rectified);
		var rectifiedInfoB = rectified;
		var rotationB = rectifiedInfoB["rotation"];
		var rectifiedB = new ImageMat(rectified.width,rectified.height, rectified.red,rectified.grn,rectified.blu);
			rectified = rectifiedB;
		var img = GLOBALSTAGE.getFloatRGBAsImage(rectified.red(), rectified.grn(), rectified.blu(), rectified.width(), rectified.height());
		var d = new DOImage(img);
		if(rotationB!=0){
			d.matrix().translate(-rectifiedB.width()*0.5, -rectifiedB.height()*0.5);
			d.matrix().rotate( Code.radians(rotationB) );
			d.matrix().translate(rectifiedB.width()*0.5, rectifiedB.height()*0.5);
		}
		//d.matrix().scale(1.0);
		d.matrix().translate(0+rectifiedA.width(), 0);
		GLOBALSTAGE.addChild(d);

// find common areas - overlap
	var imageA = imageMatrixA;
	var imageB = imageMatrixB;

var rowSets = R3D.polarRectificationRowSets(rectifiedInfoB, matrixFfwd, imageA,imageB);
	var minRowB = rowSets[0];
	var maxRowB = rowSets[1];
	console.log(minRowB,maxRowB);
var rowSets = R3D.polarRectificationRowSets(rectifiedInfoA, matrixFrev, imageB,imageA);
	var minRowA = rowSets[0];
	var maxRowA = rowSets[1];
	console.log(minRowA,maxRowA);

// line in A is not single line in B ; it is interpolated -> round


var offsetRectA = ( rotationA==0 ? -minRowA : (rectifiedA.height()-maxRowA) );
var offsetRectB = ( rotationB==0 ? -minRowB : (rectifiedB.height()-minRowB) );


	// A SECTION:
	var d = new DO();
	d.graphics().setLine(1.0,0xFFFF00FF);
	d.graphics().beginPath();
	d.graphics().drawRect(0,offsetRectA,rectifiedA.width(), maxRowA-minRowA);
	d.graphics().strokeLine();
	d.graphics().endPath();
	GLOBALSTAGE.addChild(d);

	// B SECTION:
	var d = new DO();
	d.graphics().setLine(1.0,0xFFFF00FF);
	d.graphics().beginPath();
	d.graphics().drawRect(0,offsetRectB,rectifiedB.width(), maxRowB-minRowB);
	d.graphics().strokeLine();
	d.graphics().endPath();
	d.matrix().translate(0+rectifiedA.width(), 0);
	GLOBALSTAGE.addChild(d);



/*
	scale:
		angles
		radius
		radiusMin
		radiusMax
		F ?
	involve:
		rotation
	
	row in scaled A
	row in A
	row in B
	row in scaled B
*/

R3D._stereoBlockMatch(rectifiedA, null, rectifiedB, null, null,null);

	// if(rotationB==0){
	// 	d.matrix().translate(1100 + rectifiedA.width() + 10, offsetRectB + minRowB);
	// }else{
	// 	d.matrix().translate(1100 + rectifiedA.width() + 10, offsetRectB + rectifiedA.height() - maxRowB);
	// }
	
	




/*
	console.log("features...")
	// var featuresA = R3D.entropyExtract(imageMatrixA);
	// var featuresB = R3D.entropyExtract(imageMatrixB);
	// var featuresA = R3D.SIFTExtract(imageMatrixA);
	// var featuresB = R3D.SIFTExtract(imageMatrixB);
	// var featuresA = R3D.harrisExtract(imageMatrixA);
	// var featuresB = R3D.harrisExtract(imageMatrixB);


var transformA = function(p){
	return new V3D(p.x*imageMatrixA.width(),p.y*imageMatrixA.height(),p.z);
}
var transformB = function(p){
	return new V3D(p.x*imageMatrixB.width(),p.y*imageMatrixB.height(),p.z);
}
console.log(featuresA[0]+"");
console.log(featuresB[0]+"");
	R3D.removeDuplicatePoints(featuresA, false, null, transformA);
	R3D.removeDuplicatePoints(featuresB, false, null, transformB);
*/



	throw " ? ";


// SHOW FEATURE POINTS

// var featuresA = R3D.optimalFeaturePointsInImage(imageMatrixA);
// var featuresB = R3D.optimalFeaturePointsInImage(imageMatrixB);
var featuresA = R3D.testExtract1(imageMatrixA);
var featuresB = R3D.testExtract1(imageMatrixB);
for(i=0; i<featuresA.length; ++i){
	featuresA[i].scale(1.0/imageMatrixA.width(),1.0/imageMatrixA.height(),1.5);
}
for(i=0; i<featuresB.length; ++i){
	featuresB[i].scale(1.0/imageMatrixB.width(),1.0/imageMatrixB.height(),1.5);
}

console.log(featuresA.length+" + "+featuresB.length);
console.log(featuresA[0]+"");
//var bestMatches = R3D.optimalFeatureMatchesInImages(imageMatrixA,imageMatrixB, featuresA,featuresB);


	// var featuresA = R3D.harrisExtract(rectifiedA);
	// var featuresB = R3D.harrisExtract(rectifiedB);
	// if outside the window, drop
	// for(var k=0; f<featuresA.length; ++f){
	// 	var f = featuresA[k];
	// }
	console.log(featuresA.length);
	console.log(featuresB.length);
	//var featuresB = [];

	var lists = [featuresA,featuresB];
	//var images = [rectifiedA,rectifiedB];
	var images = [imageMatrixA,imageMatrixB];

	for(var f=0; f<lists.length; ++f){
		var features = lists[f];
		for(k=0; k<features.length; ++k){
//break;
			var point = features[k];
				var x = point.x * images[f].width();
				var y = point.y * images[f].height();
				var z = point.z;
			var c = new DO();
				color = 0xFFFF0000;
				c.graphics().setLine(0.50, color);
				c.graphics().beginPath();
				c.graphics().drawCircle(x, y, z);
				c.graphics().strokeLine();
				c.graphics().endPath();
				c.matrix().translate(0 + (f>0 ? images[f-1].width(): 0), 0);
				GLOBALSTAGE.addChild(c);
		}
	}



/*
var pointA = featuresA[20];
//pointA = point.copy().scale(imageMatrixA.width(),imageMatrixA.height(),1.0);
pointA = new V3D(pointA.x*imageMatrixA.width(),pointA.y*imageMatrixA.height(),1.0);


// convert point in rectified image A to point in rectified image B
	var pointA = featuresA[300];
	// 3   => 5
	// 100 => 5
	// 200 => 5
	// 300 => 5
	pointA = pointA.copy().scale(rectifiedA.width(),rectifiedA.height());
	console.log(pointA);
	var col = pointA.x | 0;
	var row = pointA.y | 0;
	console.log(col,row);
	var angle = rectifiedInfoA["angles"][row];
	console.log(angle);
	var radiusStart = rectifiedInfoA["radiusMin"];
	var radiusMin = rectifiedInfoA["radius"][row][0];
	var radiusMax = rectifiedInfoA["radius"][row][1];
	if(col<radiusMin || col>radiusMax){
		console.log("OUTSIDE: "+col+" | "+radiusMin+" < "+radiusMax);
	}
	var radius = radiusStart + col;
	console.log("radius: "+radius);
	console.log("angle: "+angle);
	console.log("epipole: "+epipoleA);
	angle -= rectifiedInfoA["angleOffset"];

// IN RECTIFIED IMAGE
// var c = new DO();
// color = 0xFF0000FF;
// c.graphics().setLine(2.0, color);
// c.graphics().beginPath();
// c.graphics().drawCircle(pointA.x, pointA.y, 5);
// c.graphics().strokeLine();
// c.graphics().endPath();
// c.matrix().translate(0 , 0);
// GLOBALSTAGE.addChild(c);

// IN ORIGINAL IMAGE
pointA = new V2D(1,0).scale(-radius).rotate(angle);
pointA = V2D.add(pointA,epipoleA);
console.log(pointA+"");


var c = new DO();
color = 0xFF0000FF;
c.graphics().setLine(2.0, color);
c.graphics().beginPath();
c.graphics().drawCircle(pointA.x, pointA.y, 5);
c.graphics().strokeLine();
c.graphics().endPath();
c.matrix().translate(0 , 0);
GLOBALSTAGE.addChild(c);
*/
				
/*
	pointA = V3D.copy();
	pointB = V3D.copy();
	pointA.z = 1.0;
	pointB.z = 1.0;
	var lineA = new V3D();
	var lineB = new V3D();

	matrixFfwd.multV3DtoV3D(lineA, pointA);
	matrixFrev.multV3DtoV3D(lineB, pointB);
	
	var dir = new V2D();
	var org = new V2D();
	Code.lineOriginAndDirection2DFromEquation(org,dir, lineA.x,lineA.y,lineA.z);
	console.log(org+" -> "+dir);
	var angleA = V2D.angle(V2D.DIRX,dir);
	console.log(angleA);

	lineAIndex = Code.binarySearch(rectifiedInfoA["angles"], function(a){ return a==angleA ? 0 : (a>angleA ? -1 : 1) });
	if(Code.isArray(lineAIndex)){
		lineAIndex = lineAIndex[0];
	}
*/
	//pointA = new V2D(lineAIndex);
//var lineA = R3D.rectificationLine(pointA, matrixFfwd, epipoleA, rectifiedInfoB["radiusMin"], rectifiedInfoB["radius"], rectifiedInfoB["angles"], rectifiedInfoB["angleOffset"]);
/*
var lineA = R3D.lineRayFromPointF(matrixFfwd, pointA);
console.log(lineA);
	// pointA should be in original image
	var location = R3D.rectificationLine(pointA, matrixFfwd, epipoleA, rectifiedInfoA["radiusMin"], rectifiedInfoB["radius"], rectifiedInfoB["angles"], rectifiedInfoB["angleOffset"]);
	console.log(location)
	lineAIndex = location["start"].y;
	console.log(lineAIndex);

	// find relevant B
	var errorY = 2;
	for(i=0; i<featuresB.length; ++i){
		f = featuresB[i];
		// var fx = f.x * rectifiedB.width();
		// var fy = f.y * rectifiedB.height();
		var fx = f.x * imageMatrixB.width();
		var fy = f.y * imageMatrixB.height();
		f = new V2D(fx,fy);
		//if(lineAIndex-errorY<fy && fy<lineAIndex+errorY){
		var dist = Code.distancePointRay2D(lineA.org,lineA.dir, f);
		//var dist = Code.distancePointLine2D(lineA.start,lineA.end, f);
		if(dist<errorY){
			var c = new DO();
			color = 0xFF0000FF;
			c.graphics().setLine(2.0, color);
			c.graphics().beginPath();
			c.graphics().drawCircle(fx, fy, 5);
			c.graphics().strokeLine();
			c.graphics().endPath();
			//c.matrix().translate(rectifiedA.width(), 0);
			c.matrix().translate(imageMatrixA.width(), 0);
			GLOBALSTAGE.addChild(c);
		}
	}

console.log(featuresA[0]);
*/


















console.log("creating sift points...");

var siftA = R3D.pointsToSIFT(imageMatrixA, featuresA);
var siftB = R3D.pointsToSIFT(imageMatrixB, featuresB);


console.log(siftA);
console.log(siftB);

/*
// visualize features in place
var lists = [[siftA,imageMatrixA],[siftB,imageMatrixB]];
var offset = new V2D();
for(var f=0; f<lists.length; ++f){
	var features = lists[f][0];
	console.log(features);
	var imageMatrix = lists[f][1];
	for(k=0; k<features.length; ++k){
		var feature = features[k];
		var display = feature.visualizeInSitu(imageMatrix, offset);
			GLOBALSTAGE.addChild(display);
	}
	offset.x += imageMatrix.width();
}
*/

console.log("limited search putatives");

var error = 5;
var putativeA = R3D.limitedSearchFromF(siftA,imageMatrixA,siftB,imageMatrixB,matrixFfwd, error);
var putativeB = R3D.limitedSearchFromF(siftB,imageMatrixB,siftA,imageMatrixA,matrixFrev, error);

console.log(putativeA);
console.log(putativeB);

// show potential grouping:
var p;

var index = 26;
var A = siftA[index];
var Bs = putativeA[index];

p = A.point().copy().scale(400,300);
var c = new DO();
color = 0xFF0000FF;
c.graphics().setLine(2.0, color);
c.graphics().beginPath();
c.graphics().drawCircle(p.x, p.y, 5);
c.graphics().strokeLine();
c.graphics().endPath();
c.matrix().translate(0 , 0);
GLOBALSTAGE.addChild(c);


for(i=0; i<Bs.length; ++i){
	var B = Bs[i];
	p = B.point().copy().scale(400,300);
	var c = new DO();
	color = 0xFF0000FF;
	c.graphics().setLine(2.0, color);
	c.graphics().beginPath();
	c.graphics().drawCircle(p.x, p.y, 5);
	c.graphics().strokeLine();
	c.graphics().endPath();
	c.matrix().translate(400 , 0);
	GLOBALSTAGE.addChild(c);
}

// return;


// console.log(putativeA)
// console.log(putativeB)

console.log("subset matching...");
//var matching = SIFTDescriptor.match(siftA, siftB);
var matching = SIFTDescriptor.matchSubset(siftA, putativeA, siftB, putativeB);
var matches = matching["matches"];
var matchesA = matching["A"];
var matchesB = matching["B"];
var matchesBest = matching["best"];
console.log("cross matching...");
//var bestMatches = SIFTDescriptor.crossMatches(featuresA,featuresB, matches, matchesA,matchesB, 1.00000001, 250);
//console.log("bestMatches: "+bestMatches.length);

//console.log(matchesA);


/*
// SHOW EACH SIFT'S TOP MATCH
var displaySize = 50;
var rowSize = 10;
for(m=0; m<matchesBest.length; ++m){
	var match = matchesBest[m];
	//console.log(match)
	var sA = match["A"];
	var sB = match["B"];
	var refine = match["REFINE"];
	var sadScore = match["SAD"];
	if(refine){
		Medium.displayfromRefine(sA,sB, refine, imageMatrixA,imageMatrixB, m);
	}else{
		var vizA = sA.visualize(imageMatrixA, displaySize);
		var vizB = sB.visualize(imageMatrixB, displaySize);
		vizA.matrix().translate(800 + 10 + Math.floor(m/rowSize)*2*displaySize, 10 + (m%rowSize)*displaySize);
		vizB.matrix().translate(800 + 10 + Math.floor(m/rowSize)*2*displaySize + displaySize,10 + (m%rowSize)*displaySize);
		GLOBALSTAGE.addChild(vizA);
		GLOBALSTAGE.addChild(vizB);
	}
	if(m>200){
		break;
	}
}

*/
//return;

// // SHOW EACH SIFT'S TOP MATCH
// var displaySize = 50;
// var rowSize = 10;
// for(m=0; m<matchesA.length; ++m){
// 	break;
// 	var sA = siftA[m];
// 	var ms = matchesA[m];
// 	if(ms.length>0){
// 		var ma = ms[0];
// 		var sB = ma["B"];
// 		console.log("   "+m+": score:"+ma["score"]+" > "+( ms.length>1 ? ms[1]["score"] : "" )+" > "+( ms.length>2 ? ms[2]["score"] : "" ));
// 		//var match = bestMatches[m];
// 			var vizA = sA.visualize(imageMatrixA, displaySize);
// 			var vizB = sB.visualize(imageMatrixB, displaySize);
// 			vizA.matrix().translate(800 + 10 + Math.floor(m/rowSize)*2*displaySize, 10 + (m%rowSize)*displaySize);
// 			vizB.matrix().translate(800 + 10 + Math.floor(m/rowSize)*2*displaySize + displaySize,10 + (m%rowSize)*displaySize);
// 			GLOBALSTAGE.addChild(vizA);
// 			GLOBALSTAGE.addChild(vizB);
// 	}
// 	if(m>200){
// 		break;
// 	}
// }



// REFINE BEST
for(m=0; m<matchesBest.length; ++m){
	var match = matchesBest[m];
	var sA = match["A"];
	var sB = match["B"];
	var refine = R3D.refineFromSIFT(sA,sB, imageMatrixA,imageMatrixB);
	match["REFINE"] = refine;
	//Medium.displayfromRefine(sA,sB, result, imageMatrixA,imageMatrixB, m);
	//
	var vectorA = R3D.vectorFromParameters(sA, imageMatrixA, refine);
	var vectorB = R3D.vectorFromParameters(sB, imageMatrixB);
	var siftScore = SIFTDescriptor.compareVector(vectorA,vectorB);
	//match["score"] = siftScore;

	//var scales = [-1.0,0.0,1.0];
	var scales = [0.0,0.5,1.0];
	//var scales = [0.0];
	var sadScore = 1.0;
	//var sadScore = 0.0;
	for(i=0; i<scales.length; ++i){
		var scale = scales[i];
			scale = Math.pow(2,scale);
		var compareMask = null;
		var imageA = R3D.imageFromParameters(imageMatrixA, sA.point().scale(imageMatrixA.width(),imageMatrixA.height()).add(refine["trans"]), scale*sA.scale()*refine["scale"], sA.orientation()+refine["angle"],refine["skewX"],refine["skewY"]);
		var imageB = R3D.imageFromParameters(imageMatrixB, sB.point().scale(imageMatrixB.width(),imageMatrixB.height()), scale*sB.scale(),sB.orientation(),0.0,0.0);
			// imageA = imageA.getBlurredImage(1.0);
			// imageB = imageB.getBlurredImage(1.0);
		var sad = R3D.sadRGB(imageA.red(),imageA.grn(),imageA.blu(), imageB.red(),imageB.grn(),imageB.blu(), compareMask, true);
		sadScore = sadScore * sad;
		//var variability = Code.variabilityImage(imageA.gry(), imageA.width(), imageA.height());
		// var variability = Code.variability(imageA.gry(), imageA.width(), imageA.height(), null, true);
		// sadScore /= variability;
		//sadScore = sadScore + sad;
	}
	sadScore = sadScore / scales.length;
	match["SAD"] = sadScore;

	//match["score"] = sadScore * siftScore;
	match["score"] = sadScore;
	//match["score"] = siftScore;
}
matchesBest = matchesBest.sort(function(a,b){
	return a["score"] < b["score"] ? -1 : 1;
});

var percentKeep = 0.001;
var minScore = matchesBest[0]["score"];
var maxScore = matchesBest[matchesBest.length-1]["score"];
var rangeScore = maxScore - minScore;
var maximumAllowed = minScore + percentKeep*rangeScore;

var finalSet = [];
for(m=0; m<matchesBest.length; ++m){
	var match = matchesBest[m];
	var sA = match["A"];
	var sB = match["B"];
	var refine = match["REFINE"];
	var sadScore = match["SAD"];
	var score = match["score"];
		//var score = match["score"];
//		console.log(m+": "+score+" | "+sadScore);
	if(refine["scale"]<=0.1 || refine["scale"]>=2.0 || Math.abs(refine["scaleX"])>0.5 || Math.abs(refine["scaleY"])>0.5  || sadScore > 0.01){
		continue;
	}
	if(score<=maximumAllowed){
		finalSet.push(match);
	}
}

matchesBest = finalSet;

// SHOW EACH SIFT'S TOP MATCH
var displaySize = 50;
var rowSize = 10;
for(m=0; m<matchesBest.length; ++m){
	var match = matchesBest[m];
	//console.log(match)
	var sA = match["A"];
	var sB = match["B"];
	var refine = match["REFINE"];
	var sadScore = match["SAD"];
	if(refine){
		Medium.displayfromRefine(sA,sB, refine, imageMatrixA,imageMatrixB, m);
	}else{
		var vizA = sA.visualize(imageMatrixA, displaySize);
		var vizB = sB.visualize(imageMatrixB, displaySize);
		vizA.matrix().translate(800 + 10 + Math.floor(m/rowSize)*2*displaySize, 10 + (m%rowSize)*displaySize);
		vizB.matrix().translate(800 + 10 + Math.floor(m/rowSize)*2*displaySize + displaySize,10 + (m%rowSize)*displaySize);
		GLOBALSTAGE.addChild(vizA);
		GLOBALSTAGE.addChild(vizB);
	}
	if(m>200){
		break;
	}
}
//return;

// TODO: OUTPUT TO MEDIUM HERE
var pointsA = [];
var pointsB = [];
var transforms = [];
for(i=0; i<matchesBest.length; ++i){
	var match = matchesBest[i];
	var sA = match["A"];
	var sB = match["B"];
	var refine = match["REFINE"];
	var pointA = sA.point().copy().scale(imageMatrixA.width(),imageMatrixA.height());
	var pointB = sB.point().copy().scale(imageMatrixB.width(),imageMatrixB.height());
	var transform = R3D.transformFromSiftRefine(imageMatrixA,imageMatrixB, sA,sB,refine);
	pointsA.push(pointA);
	pointsB.push(pointB);
	transforms.push(transform);


	var compareSize = 50;

	var matrix = transform.copy();
		//matrix = Matrix.transform2DTranslate(matrix, pointA.x,pointA.y);
	//var imageA = imageMatrixA.extractRectFromMatrix(compareSize,compareSize, matrix);
		var imageA = imageMatrixA.extractRectFromFloatImage(pointA.x,pointA.y,1.0,null,compareSize,compareSize, matrix);
	var matrix = new Matrix(3,3).identity();
		//matrix = Matrix.transform2DTranslate(matrix, pointB.x,pointB.y);
	//var imageB = imageMatrixA.extractRectFromMatrix(compareSize,compareSize, matrix);
		var imageB = imageMatrixB.extractRectFromFloatImage(pointB.x,pointB.y,1.0,null,compareSize,compareSize, matrix);

	var image = imageA;
	var img = GLOBALSTAGE.getFloatRGBAsImage(image.red(), image.grn(), image.blu(), image.width(), image.height());
		img = new DOImage(img);
		img.matrix().translate(10, 300 + i*compareSize);
		GLOBALSTAGE.addChild(img);
	var image = imageB;
	var img = GLOBALSTAGE.getFloatRGBAsImage(image.red(), image.grn(), image.blu(), image.width(), image.height());
		img = new DOImage(img);
		img.matrix().translate(100, 300 + i*compareSize);
		GLOBALSTAGE.addChild(img);
}
console.log("OUTPUT:");
var output = R3D.outputMediumPoints(imageMatrixA,imageMatrixB, pointsA,pointsB, transforms);
console.log(output);

return;



// put all 'top' matches into single list, 
var totalMatches = Code.arrayPushArray(Code.arrayPushArray([],matchesA), matchesB);
console.log(totalMatches.length);
var validTotalMatches = [];
for(i=0; i<totalMatches.length; ++i){
	var list = totalMatches[i];
	if(list.length>0){
		var match0 = list[0];
		var score0 = match0["score"];
		var sA = match0["A"];
		var sB = match0["B"];
		var relativeScore = 1E9;
		var matchScore = 1E9;
		if(sA && sB){
			var siftScore = score0;
			if(list.length>1){
				var match1 = list[1];
				var score1 = match1["score"];
				var delta = score1 - score0;
				relativeScore = 1.0 / delta;
				matchScore = 1.0 / matchScore;
			}
			
		var compareMask = null;
		var compareSize = 11;
		var compareScale = 1.0;//compareScales[j];
		compareScale = Math.pow(2,compareScale);
		var imageA = sA.imageFromFeature(imageMatrixA,compareSize, compareScale);
		var imageB = sB.imageFromFeature(imageMatrixB,compareSize, compareScale);
		var sadScore = R3D.sadRGB(imageA.red(),imageA.grn(),imageA.blu(), imageB.red(),imageB.grn(),imageB.blu(), compareMask);
		var nccScore = Dense.ncc(imageA.red(),imageA.grn(),imageA.blu(), imageB.red(),imageB.grn(),imageB.blu(), compareMask);
		//value = value * v;

			if(!score){
				score = 1E10;
			}
//score = matchScore;
//score = sadScore * siftScore;
//score = sadScore;
score = siftScore;
//score = relativeScore;
//score = nccScore;
			var entry = {"score":score, "A":sA, "B":sB, "SAD":sadScore, "SIFT":siftScore};
			validTotalMatches.push(entry)
		}
	}
}
totalMatches = validTotalMatches;
// remove dups:
for(i=0; i<totalMatches.length; ++i){
	var matchI = totalMatches[i];
	for(j=i+1; j<totalMatches.length; ++j){
		var matchJ = totalMatches[j];
		if(matchI["A"]==matchJ["A"] && matchI["B"]==matchJ["B"]){
			// console.log(i+" == "+j)
			totalMatches[j] = totalMatches[totalMatches.length-1];
			totalMatches.pop();
			--i;
			break;
		}
	}
}
totalMatches = totalMatches.sort(function(a,b){
	return a["score"] < b["score"] ? -1 : 1;
});

console.log("TOTAL MATCHES A & B : "+totalMatches.length);


/*

// ITERATE ON EASH TO FIND BEST
for(i=0; i<totalMatches.length; ++i){
	var match = totalMatches[i];
	var sA = match["A"];
	var sB = match["B"];
	var score = match["score"];
	var result = R3D.refineFromSIFT(sA,sB, imageMatrixA,imageMatrixB);
	var newScore = result["score"];
	console.log(i+" refining: "+score+" => "+newScore);
	match["REFINE"] = result;
	match["score"] = newScore;

	// SIFTDescriptor.fromPointGray(source, red,grn,blu, width, height, point)
	// SIFTDescriptor.vectorFromImage(source, width,height, location,optimalScale,optimalOrientation,covarianceAngle,covarianceScale)

	//if(false){
	// if(i>=0){
	// 	break;
	// }
}

totalMatches = totalMatches.sort(function(a,b){
	return a["score"] < b["score"] ? -1 : 1;
});

console.log("TEST OUT");
//return;

*/



// SHOW EACH SIFT'S TOP MATCH
var displaySize = 50;
var rowSize = 10;
for(m=0; m<totalMatches.length; ++m){
	var match = totalMatches[m];
	//console.log(match);
	//if(ms.length>0){
		var sA = match["A"];
		var sB = match["B"];
		var score = match["score"];
		var sad = match["SAD"];
		var sift = match["SIFT"];
		console.log("   "+m+" : "+Code.digits(score,5)+"  SAD: "+Code.digits(sad,5)+"  SIFT: "+Code.digits(sift,5)+" scaleA: "+Code.digits(sA.scale(),6)+" angleA: "+Code.digits(sA.orientation(),6)+" scaleB: "+Code.digits(sB.scale(),6)+" angleB: "+Code.digits(sB.orientation(),6)+"   @ "+sA.point()+" => "+sB.point());
		//var match = bestMatches[m];
		var refine = match["REFINE"];
		if(refine){
			//var compareSize = 11;
			var compareSize = displaySize;
			// 
			var pointA = sA.point().copy().scale(imageMatrixA.width(),imageMatrixA.height());
			var scaleA = sA.scale()/compareSize;
			var angleA = sA.orientation();
			var skewXA = 0;
			var skewYA = 0;
			var pointB = sB.point().copy().scale(imageMatrixB.width(),imageMatrixB.height());
			var scaleB = sB.scale()/compareSize;
			var angleB = sB.orientation();
			var skewXB = 0;
			var skewYB = 0;
			//
			scaleA = scaleA * refine["scale"];
			angleA = angleA + refine["angle"];
			skewXA = refine["skewX"];
			skewYA = refine["skewY"];
			pointA = pointA.add(refine["trans"]);
			
			var image = R3D.imageFromParameters(imageMatrixA, pointA,scaleA,angleA,skewXA,skewYA, compareSize,compareSize);
			var vizA = GLOBALSTAGE.getFloatRGBAsImage(image.red(), image.grn(), image.blu(), image.width(), image.height());
			var vizA = new DOImage(vizA);

			var image = R3D.imageFromParameters(imageMatrixB, pointB,scaleB,angleB,skewXB,skewYB, compareSize,compareSize);
			var vizB = GLOBALSTAGE.getFloatRGBAsImage(image.red(), image.grn(), image.blu(), image.width(), image.height());
			var vizB = new DOImage(vizB);
		}else{
			var vizA = sA.visualize(imageMatrixA, displaySize);
			var vizB = sB.visualize(imageMatrixB, displaySize);
			
		}
		vizA.matrix().translate(800 + 10 + Math.floor(m/rowSize)*2*displaySize, 10 + (m%rowSize)*displaySize);
		vizB.matrix().translate(800 + 10 + Math.floor(m/rowSize)*2*displaySize + displaySize,10 + (m%rowSize)*displaySize);
		GLOBALSTAGE.addChild(vizA);
		GLOBALSTAGE.addChild(vizB);
	//}
	if(m>200){
		break;
	}
}

return;

/*





console.log("REFINE AAAAA");
var index = 3;
var match = totalMatches[index];
var imageA = imageMatrixA;
var imageB = imageMatrixB;
var pointA = match["A"].point().copy().scale(imageA.width(),imageA.height());
var pointB = match["B"].point().copy().scale(imageB.width(),imageB.height());
var scaleA = match["A"].scale();
var scaleB = match["B"].scale();
var angleA = match["A"].orientation();
var angleB = match["B"].orientation();
var skewXA = 0;
var skewYA = 0;


console.log(imageA,imageB, pointA,scaleA,angleA,skewXA,skewYA, pointB,scaleB,angleB);
var result = R3D.refineTransformNonlinearGD(imageA,imageB, pointA,scaleA,angleA,skewXA,skewYA, pointB,scaleB,angleB);
var pointA = result["pointA"];
var scaleA = result["scaleA"];
var angleA = result["angleA"];
var skewXA = result["skewXA"];
var skewYA = result["skewYA"];

console.log(result);


// show single AFTER
var compareSize = 11;
var compareScale = 1.0;
compareScaleB = compareSize/scaleB;
matrix = new Matrix(3,3);

	// 	matrix.identity();
	// 	matrix = Matrix.transform2DScale(matrix, compareSize/scaleA);
	// 	matrix = Matrix.transform2DRotate(matrix, angleA);
	// 	matrix = Matrix.transform2DSkewX(matrix, skewA);
	// 	//matrix = Matrix.transform2DScale(matrix, -compareSize/scaleB);
	// var imageA = imageMatrixA.extractRectFromFloatImage(pointA.x,pointA.y,1.0,null,compareSize,compareSize, matrix);
	
	
	var matrix = new Matrix(3,3).identity();
		matrix = Matrix.transform2DTranslate(matrix, (-pointA.x) , (-pointA.y) );
		matrix = Matrix.transform2DScale(matrix, compareSize/scaleA);
		matrix = Matrix.transform2DRotate(matrix, -angleA);
		matrix = Matrix.transform2DSkewX(matrix, skewXA);
		matrix = Matrix.transform2DSkewY(matrix, skewYA);
		matrix = Matrix.transform2DTranslate(matrix, compareSize*0.5, compareSize*0.5);
		matrix = Matrix.inverse(matrix);
	var imageA = imageMatrixA.extractRectFromMatrix(compareSize,compareSize, matrix);

	// matrix.identity();
	// 	matrix = Matrix.transform2DScale(matrix, compareSize/scaleB);
	// 	matrix = Matrix.transform2DRotate(matrix, angleB);
	//var imageB = imageMatrixB.extractRectFromFloatImage(pointB.x,pointB.y,compareScaleB,null,compareSize,compareSize, null);
	var matrix = new Matrix(3,3).identity();
		matrix = Matrix.transform2DTranslate(matrix, (-pointB.x) , (-pointB.y) );
		matrix = Matrix.transform2DScale(matrix, compareSize/scaleB);
		matrix = Matrix.transform2DRotate(matrix, -angleB);
		matrix = Matrix.transform2DTranslate(matrix, compareSize*0.5, compareSize*0.5);
		matrix = Matrix.inverse(matrix);
	var imageB = imageMatrixB.extractRectFromMatrix(compareSize,compareSize, matrix);


var sca = 4.0;
	var vizA = GLOBALSTAGE.getFloatRGBAsImage(imageA.red(), imageA.grn(), imageA.blu(), imageA.width(), imageA.height());
	var vizA = new DOImage(vizA);
	var vizB = GLOBALSTAGE.getFloatRGBAsImage(imageB.red(), imageB.grn(), imageB.blu(), imageB.width(), imageB.height());
	var vizB = new DOImage(vizB);
i = 0;
	vizA.matrix().scale(sca);
	vizA.matrix().translate(810 + Math.floor(i/10)*compareSize*sca*2 + 0, 10 + (i%10)*compareSize*sca);
	vizB.matrix().scale(sca);
	vizB.matrix().translate(810 + Math.floor(i/10)*compareSize*sca* 2 + compareSize*sca, 10 + (i%10)*compareSize*sca);
	GLOBALSTAGE.addChild(vizA);
	GLOBALSTAGE.addChild(vizB);

return;



*/








console.log("DONE: "+totalMatches.length);
/*
// calculate SAD score:
var compareSize = 11;
//var compareSize = 21;
var compareScale = 1.0;
//var compareScales = Code.divSpace(-1.0,2.0, 4);
//var compareScales = Code.divSpace(-2.0,2.0, 5);
//var compareScales = Code.divSpace(-2.0,0.0, 3);
//var compareScales = Code.divSpace(0.0,2.0, 3);
//var compareScales = Code.divSpace(-1.0,2.0, 4);
var compareScales = Code.divSpace(-2.0,2.0, 5);
var compareMask = ImageMat.circleMask(compareSize);
for(i=0; i<totalMatches.length; ++i){
	var match = totalMatches[i];
	var score = match["score"];
	var sA = match["A"];
	var sB = match["B"];
	if(!sA || !sB){
		continue;
	}
	var value = 1.0;
	for(j=0; j<compareScales.length; ++j){
		var compareScale = compareScales[j];
		compareScale = Math.pow(2,compareScale);
		var imageA = sA.imageFromFeature(imageMatrixA,compareSize, compareScale);
		var imageB = sB.imageFromFeature(imageMatrixB,compareSize, compareScale);
		var v = R3D.sadRGB(imageA.red(),imageA.grn(),imageA.blu(), imageB.red(),imageB.grn(),imageB.blu(), compareMask);
		value = value * v;
		//value = value + v;
	}
	match["score"] = value;
}
totalMatches = totalMatches.sort(function(a,b){
	return a["score"] < b["score"] ? -1 : 1;
});

// there is an undefined:
for(i=0; i<totalMatches.length; ++i){
	var match = totalMatches[i];
	if(!match || !match["A"] || !match["B"] || !match["score"]){
		totalMatches[i] = totalMatches[totalMatches.length-1];
		totalMatches.pop();
		--i;
	}
}

// for each try to find optimum scale/orientation ?
var pointsA = [];
var pointsB = [];
for(i=0; i<totalMatches.length; ++i){
	var match = totalMatches[i];
	//console.log(match);
	var score = match["score"];
	var sA = match["A"];
	var sB = match["B"];
	console.log(sA);
	pointsA.push(sA.toPoint(imageMatrixA.width(),imageMatrixA.height()));
	pointsB.push(sB.toPoint(imageMatrixB.width(),imageMatrixB.height()));
}
console.log(pointsA);
//throw "X"

var refined = R3D.refinedMatchPoints(imageMatrixA,imageMatrixB, pointsA,pointsB);
console.log("refined:");
console.log(refined);
var transforms = refined["transforms"];
var pointsA = refined["pointsA"];
var pointsB = refined["pointsB"];

// add to list
var compareSize = 11;
var compareScale = 1.0;
var compareMask = ImageMat.circleMask(compareSize);
for(i=0; i<totalMatches.length; ++i){
	var match = totalMatches[i];
	var score = match["score"];
	var sA = match["A"];
	var sB = match["B"];
	var pointA = pointsA[i];
	var pointB = pointsB[i];
	var transform = transforms[i];
	match["transform"] = transform;
	//var matrix = transform;
	var matrix = null;
	// new score from SAD
	compareScaleB = compareSize/sB.scale();
	console.log("compareScaleB: "+compareScaleB);
	var imageA = imageMatrixA.extractRectFromFloatImage(pointA.x,pointA.y,compareScaleB,null,compareSize,compareSize, matrix);
	var imageB = imageMatrixB.extractRectFromFloatImage(pointB.x,pointB.y,compareScaleB,null,compareSize,compareSize, null);
	var s = R3D.sadRGB(imageA.red(),imageA.grn(),imageA.blu(), imageB.red(),imageB.grn(),imageB.blu(), compareMask);
	match["score"] = s;
//continue; // later visualization
var sca = 4.0;
	var vizA = GLOBALSTAGE.getFloatRGBAsImage(imageA.red(), imageA.grn(), imageA.blu(), imageA.width(), imageA.height());
	var vizA = new DOImage(vizA);
	var vizB = GLOBALSTAGE.getFloatRGBAsImage(imageB.red(), imageB.grn(), imageB.blu(), imageB.width(), imageB.height());
	var vizB = new DOImage(vizB);
	vizA.matrix().scale(sca);
	vizA.matrix().translate(810 + Math.floor(i/10)*compareSize*sca*2 + 0, 10 + (i%10)*compareSize*sca);
	vizB.matrix().scale(sca);
	vizB.matrix().translate(810 + Math.floor(i/10)*compareSize*sca* 2 + compareSize*sca, 10 + (i%10)*compareSize*sca);
	GLOBALSTAGE.addChild(vizA);
	GLOBALSTAGE.addChild(vizB);
if(i>200){
	break;
}
	
} // resort
totalMatches = totalMatches.sort(function(a,b){
	return a["score"] < b["score"] ? -1 : 1;
});


return;


var displaySize = 50;
var rowSize = 10;
for(m=0; m<totalMatches.length; ++m){
	var match = totalMatches[m];
	console.log(match)
	var score = match["score"];
	var sA = match["A"];
	var sB = match["B"];
	console.log("   "+m+": score:"+score+" ...");
	if(!score){
		console.log("NO SCORE")
		continue;
	}
		//var match = bestMatches[m];
		var vizA = sA.visualize(imageMatrixA, displaySize);
		var vizB = sB.visualize(imageMatrixB, displaySize);
		vizA.matrix().translate(800 + 10 + Math.floor(m/rowSize)*2*displaySize, 10 + (m%rowSize)*displaySize);
		vizB.matrix().translate(800 + 10 + Math.floor(m/rowSize)*2*displaySize + displaySize,10 + (m%rowSize)*displaySize);
		GLOBALSTAGE.addChild(vizA);
		GLOBALSTAGE.addChild(vizB);
	if(m>200){
		break;
	}
}




return;

	// VISUALIZE TOP MATCHES separately
	var displaySize = 50;
	var rowSize = 10;
	for(m=0; m<bestMatches.length; ++m){
//	break;
		var match = bestMatches[m];
		var featureA = match["A"];
		var featureB = match["B"];
		var vizA = featureA.visualize(imageMatrixA, displaySize);
		var vizB = featureB.visualize(imageMatrixB, displaySize);
		vizA.matrix().translate(800 + 10 + Math.floor(m/rowSize)*2*displaySize, 10 + (m%rowSize)*displaySize);
		vizB.matrix().translate(800 + 10 + Math.floor(m/rowSize)*2*displaySize + displaySize,10 + (m%rowSize)*displaySize);
		GLOBALSTAGE.addChild(vizA);
		GLOBALSTAGE.addChild(vizB);
		// visualize top matches in place
		// line
		// var d = new DO();
		// 	d.graphics().clear();
		// 	d.graphics().setLine(1.0, 0x99FF0000);
		// 	d.graphics().beginPath();
		// 	d.graphics().moveTo(featureA.point().x*imageMatrixA.width(),featureA.point().y*imageMatrixA.height());
		// 	d.graphics().lineTo(400 + featureB.point().x*imageMatrixB.width(),featureB.point().y*imageMatrixB.height());
		// 	d.graphics().endPath();
		// 	d.graphics().strokeLine();
		// GLOBALSTAGE.addChild(d);

		if(m>=100){
			break;
		}
	}



/*
console.log("bestMatches has double-duplicated points, remove them");
for(i=0; i<bestMatches.length; ++i){
	var matchA = bestMatches[i];
	var found = false;
	for(j=i-1; j>=0; --j){
		var matchB = bestMatches[j];
		var pAA = matchA["A"].point();
		var pAB = matchA["B"].point();
		var pBA = matchB["A"].point();
		var pBB = matchB["B"].point();
		pAA = new V2D( pAA.x*imageMatrixA.width(), pAA.y*imageMatrixA.height() );
		pAB = new V2D( pAB.x*imageMatrixB.width(), pAB.y*imageMatrixB.height() );
		pBA = new V2D( pBA.x*imageMatrixA.width(), pBA.y*imageMatrixA.height() );
		pBB = new V2D( pBB.x*imageMatrixB.width(), pBB.y*imageMatrixB.height() );
		var distA = V2D.distance(pAA,pBA);
		var distB = V2D.distance(pAB,pBB);
		var maxDist = 0.5;
		if( distA<maxDist && distB<maxDist ){
			//console.log("duplicated: "+pAA+" - "+pBA+" & "+pAB+" - "+pBB);
			Code.removeElementAtSimple(bestMatches,i);
			found = true;
			--i;
			break;
		}
	}
}

var displaySize = 50;
var lineCount = 16;
for(m=0; m<bestMatches.length; ++m){
	var match = bestMatches[m];
	var featureA = match["A"];
	var featureB = match["B"];
	var vizA = featureA.visualize(imageMatrixA, displaySize);
	var vizB = featureB.visualize(imageMatrixB, displaySize);
	var offX = (displaySize * 2 + 5) * ((m/lineCount) | 0);
	var offY = 10 + displaySize * (m%lineCount);
	vizA.matrix().translate(800+offX, 0 + offY);
	vizB.matrix().translate(800+offX+displaySize, 0 + offY);
	GLOBALSTAGE.addChild(vizA);
	GLOBALSTAGE.addChild(vizB);
	if(m>=160){
		break;
	}
}
*/
// print out for usage elsewhere
var strA = "var pointsA = [];";
var strB = "var pointsB = [];";
for(m=0; m<bestMatches.length; ++m){
	var match = bestMatches[m];
	var featureA = match["A"];
	var featureB = match["B"];
	//console.log(featureA);
	var pointA = featureA.point();
	var pointB = featureB.point();
	// _overallScale _scaleRadius _covarianceScale
	// _orientationAngle _covarianceAngle
	var scaleA = featureA._overallScale;
	var angleA = featureA._orientationAngle;
	var scaleB = featureB._overallScale;
	var angleB = featureB._orientationAngle;
	strA = strA + "pointsA.push(new V3D(" + (pointA.x*400) + "," + (pointA.y*300) + "," + scaleA + "," + angleA + "));\n";
	strB = strB + "pointsB.push(new V3D(" + (pointB.x*400) + "," + (pointB.y*300) + "," + scaleB + "," + angleB + "));\n";
}
//console.log("\n\n"+strA+"\n\n"+strB+"\n\n");


	// R3D.lineRayFromPointF

	// console.log("sift...");
	// var siftA = R3D.pointsToSIFT(rectifiedA, featuresA);
	// var siftB = R3D.pointsToSIFT(imageMatrixB, featuresB);
	// 
}
Medium.displayfromRefine = function(sA,sB, refine, imageMatrixA,imageMatrixB, m){
	m = m!==undefined ? m : 0;
	var displaySize = 50;
	var rowSize = 10;
	//var refine = match["REFINE"];
		if(refine){
			//var compareSize = 11;
			var compareSize = displaySize;
			// 
			var pointA = sA.point().copy().scale(imageMatrixA.width(),imageMatrixA.height());
			var scaleA = sA.scale()/compareSize;
			var angleA = sA.orientation();
			var skewXA = 0;
			var skewYA = 0;
			var pointB = sB.point().copy().scale(imageMatrixB.width(),imageMatrixB.height());
			var scaleB = sB.scale()/compareSize;
			var angleB = sB.orientation();
			var skewXB = 0;
			var skewYB = 0;
			//
			scaleA = scaleA * refine["scale"];
			angleA = angleA + refine["angle"];
			skewXA = refine["skewX"];
			skewYA = refine["skewY"];
			pointA = pointA.add(refine["trans"]);
			
			var image = R3D.imageFromParameters(imageMatrixA, pointA,scaleA,angleA,skewXA,skewYA, compareSize,compareSize);
			var vizA = GLOBALSTAGE.getFloatRGBAsImage(image.red(), image.grn(), image.blu(), image.width(), image.height());
			var vizA = new DOImage(vizA);

			var image = R3D.imageFromParameters(imageMatrixB, pointB,scaleB,angleB,skewXB,skewYB, compareSize,compareSize);
			var vizB = GLOBALSTAGE.getFloatRGBAsImage(image.red(), image.grn(), image.blu(), image.width(), image.height());
			var vizB = new DOImage(vizB);
		}else{
			var vizA = sA.visualize(imageMatrixA, displaySize);
			var vizB = sB.visualize(imageMatrixB, displaySize);
			
		}
		vizA.matrix().translate(800 + 10 + Math.floor(m/rowSize)*2*displaySize, 10 + (m%rowSize)*displaySize);
		vizB.matrix().translate(800 + 10 + Math.floor(m/rowSize)*2*displaySize + displaySize,10 + (m%rowSize)*displaySize);
		GLOBALSTAGE.addChild(vizA);
		GLOBALSTAGE.addChild(vizB);
	//}
}
Medium.mediumMatch = function(){
	/*
	given initial correspondence set (10~20), find a magnitude more points (100~200) to refine F
	[use F to limit search area to somewhat of a line]
	[perform on a rectified set of images]
	find best corner points (location, scale, orientation) in A and in B (each ~1000)
	create SIFT features for each of these points
	for each feature in image A
		- get row line in image B
		- restrict search to only elements that lay along line path
		- record matches
	*REPEAT FOR B->A
	do matching test
	do RANSAC F test
	*/
}


