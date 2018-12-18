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
	// var imageLoader = new ImageLoader("./images/",imageList, this,this.handleImagesLoaded,null);

	// var imageList = ["room0.png", "room2.png"];
	// var imageList = ["bench_A.png", "bench_B.png"];
	var imageList = ["snow1.png", "snow2.png"];
	// var imageList = ["caseStudy1-20.jpg", "caseStudy1-24.jpg"];
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
		// d.graphics().alpha(0.1);
		d.graphics().alpha(0.5);
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


/*

// var imageList = ["room0.png", "room2.png"];


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

*/




/*
// var imageList = ["bench_A.png", "bench_B.png"];



var pointsA = [];
points = pointsA;
points.push( new V2D(301.85233375298054,126.81585618302164) ); // 0
points.push( new V2D(192.51212376899417,117.34596338776937) ); // 1
points.push( new V2D(189.14252707489138,135.9283746654506) ); // 2
points.push( new V2D(277.9991344369155,152.0010537634594) ); // 3
points.push( new V2D(104.9974201235626,219.00153052064994) ); // 4
points.push( new V2D(190.7907292177242,107.14967185324349) ); // 5
points.push( new V2D(240.93796922708682,203.0723761862269) ); // 6
points.push( new V2D(213.1185704241555,198.94653473049775) ); // 7
points.push( new V2D(293.99971220414847,144.00002592836464) ); // 8
points.push( new V2D(326.0821869926279,114.03312515010711) ); // 9
points.push( new V2D(33.326596344676695,230.674634920461) ); // 10
points.push( new V2D(219.92571512310678,162.96533025584844) ); // 11
points.push( new V2D(330.99773940696434,239.00143695303643) ); // 12
points.push( new V2D(371.99555031862695,287.99900691790657) ); // 13
points.push( new V2D(61.246773313036385,108.16893730747164) ); // 14
points.push( new V2D(92.69329076756864,36.9213061481344) ); // 15
points.push( new V2D(189.9999992230732,330.99998328703515) ); // 16
points.push( new V2D(322.99208158258523,250.9967811509704) ); // 17
points.push( new V2D(54.99860741518554,48.99412201550241) ); // 18
points.push( new V2D(331.99484649552693,148.00235941567854) ); // 19
points.push( new V2D(216.9056878880334,239.01887809295908) ); // 20
points.push( new V2D(477.9631564781131,332.75460420345814) ); // 21
points.push( new V2D(162.99793469974074,94.99877617398107) ); // 22
points.push( new V2D(359.0006724752813,285.9931626233931) ); // 23
points.push( new V2D(340.00017534702425,250.9984474610082) ); // 24
points.push( new V2D(368.06004560118987,262.9898337286153) ); // 25
points.push( new V2D(429.9988071729879,306.9928356073862) ); // 26
points.push( new V2D(134.0987584511251,81.93831464887654) ); // 27
points.push( new V2D(251.00059142535298,175.0011656257351) ); // 28
points.push( new V2D(182.0000818395097,335.0000195396564) ); // 29
points.push( new V2D(444.99913705487813,284.99759935744476) ); // 30
points.push( new V2D(252.99995244369595,343.00007346020595) ); // 31
points.push( new V2D(173.0001517552526,214.99524076857156) ); // 32
points.push( new V2D(80.99955872664623,257.00050407095443) ); // 33
points.push( new V2D(43.99969758209072,324.0006375209427) ); // 34
points.push( new V2D(166.9979173224859,114.99917568017302) ); // 35
points.push( new V2D(337.99995117889296,313.9997133579294) ); // 36
points.push( new V2D(341.9981185340081,138.99977763337574) ); // 37
points.push( new V2D(369.99976472135495,253.99668628394963) ); // 38
points.push( new V2D(443.9997281925473,197.99640228606606) ); // 39
points.push( new V2D(170.0041343768243,235.00557612022612) ); // 40
points.push( new V2D(301.00009762290716,303.0001450477586) ); // 41
points.push( new V2D(431.9985673493198,214.0004402847297) ); // 42
points.push( new V2D(222.9998528412367,345.0000091123191) ); // 43
points.push( new V2D(433.99983724114935,149.9998499822969) ); // 44
points.push( new V2D(298.99999936487563,334.9999986871341) ); // 45
points.push( new V2D(383.9999547670035,315.99996695384476) ); // 46
points.push( new V2D(331.0001371167643,319.0001763156921) ); // 47
points.push( new V2D(458.99964291818594,241.99918051710026) ); // 48
points.push( new V2D(202.00056019905617,258.9998595388774) ); // 49
points.push( new V2D(101.99999907211225,280.99998931408) ); // 50
points.push( new V2D(194.9999897073696,295.99999828821853) ); // 51


var pointsB = [];
points = pointsB;
points.push( new V2D(318.9403301170212,107.01383706747959) ); // 0
points.push( new V2D(234.46694901540658,96.0917981757531) ); // 1
points.push( new V2D(231.89813630360305,113.9408476919225) ); // 2
points.push( new V2D(296.99879721451975,133.00029836577647) ); // 3
points.push( new V2D(152.99457874751687,182.99937920343706) ); // 4
points.push( new V2D(233.1978820393625,86.3277678829524) ); // 5
points.push( new V2D(238.90507140443654,179.80452591595844) ); // 6
points.push( new V2D(220.60580275978137,173.5832712307657) ); // 7
points.push( new V2D(311,125.00000476372301) ); // 8
points.push( new V2D(338.8632561435061,93.75393945371337) ); // 9
points.push( new V2D(107.94617597393223,186.62411441288438) ); // 10
points.push( new V2D(313.9463384746919,139.96192088011668) ); // 11
points.push( new V2D(325.9951769433653,227.99963055096984) ); // 12
points.push( new V2D(323.9999295935838,283.00328461779765) ); // 13
points.push( new V2D(180.99989565472043,86.00200948292417) ); // 14
points.push( new V2D(176.00085411708739,24.999741013811413) ); // 15
points.push( new V2D(136.99999413713815,282.00000199858886) ); // 16
points.push( new V2D(307.00723901980865,238.00156290298827) ); // 17
points.push( new V2D(166.99992287325037,35.99997140872975) ); // 18
points.push( new V2D(342.0081252793434,131.04115775677164) ); // 19
points.push( new V2D(231.00157244326687,212.00228433594785) ); // 20
points.push( new V2D(395.00127357178104,355.56557674554386) ); // 21
points.push( new V2D(214.00057828262385,74.9966952057434) ); // 22
points.push( new V2D(314.00387886588294,277.99511483175297) ); // 23
points.push( new V2D(325.99779147450175,240.99874823491413) ); // 24
points.push( new V2D(343.0294785329164,258.04901629097196) ); // 25
points.push( new V2D(366.08727779032637,316.03003656802264) ); // 26
points.push( new V2D(204.1603175393547,63.02868203296922) ); // 27
points.push( new V2D(249.00629305976744,154.0034572021561) ); // 28
points.push( new V2D(172.00001024953974,289.00004875767286) ); // 29
points.push( new V2D(392.00038640101803,295.998854437447) ); // 30
points.push( new V2D(171.9991507661323,304.000386418374) ); // 31
points.push( new V2D(210.0447974154887,185.9359423241878) ); // 32
points.push( new V2D(116.99974843973858,210.99978476142087) ); // 33
points.push( new V2D(55.99989186785712,254.0000494609982) ); // 34
points.push( new V2D(214.99850437863643,94.00074212029128) ); // 35
points.push( new V2D(267.99990866517203,298.99963453794874) ); // 36
points.push( new V2D(473.0013902965536,119.00592632457676) ); // 37
points.push( new V2D(353.9312522091528,249.08106219978987) ); // 38
points.push( new V2D(442.00144690926754,197.99236267393346) ); // 39
points.push( new V2D(197.9975384001033,203.00034336290875) ); // 40
points.push( new V2D(243.99988819110268,281.0000514187518) ); // 41
points.push( new V2D(492.99874843304246,218.00537246808165) ); // 42
points.push( new V2D(148.99988625530023,298.9999217762466) ); // 43
points.push( new V2D(484.00054425809196,138.00107619636393) ); // 44
points.push( new V2D(213.999999767295,307.999995327955) ); // 45
points.push( new V2D(309.9999954496515,311.9999353885016) ); // 46
points.push( new V2D(256.99995657143154,301.999965746372) ); // 47
points.push( new V2D(448.99366985413775,253.00098813676007) ); // 48
points.push( new V2D(199.00027038665027,226.9998609578905) ); // 49
points.push( new V2D(68.00028322425376,227.9996371664038) ); // 50
points.push( new V2D(164.99999956654503,255.9999986085836) ); // 51

F = [-6.037043098929525e-7,-0.00000970730106456997,0.0018040397976300374,-0.000004613167521603573,0.000001299728959578859,0.012972252880251627,0.00011338592089076502,-0.009458817818843748,-0.21727587142219504];


*/




// "snow1.png", "snow2.png"

var pointsA = [];
points = pointsA;
points.push( new V2D(130.9999022735318,281.9998853538) ); // 0
points.push( new V2D(359.7710073339663,161.0885336976837) ); // 1
points.push( new V2D(344.04594799124067,201.954530666448) ); // 2
points.push( new V2D(90.99515343907262,161.05300729592688) ); // 3
points.push( new V2D(93.33324460849661,103.99631302230905) ); // 4
points.push( new V2D(111.99943542387528,221.99966157588136) ); // 5
points.push( new V2D(381.05425534704705,166.9245466028069) ); // 6
points.push( new V2D(321.99940028105624,248.06347589587037) ); // 7
points.push( new V2D(118.99667497413772,160.00560818486994) ); // 8
points.push( new V2D(241.00986567761856,222.07224159010826) ); // 9
points.push( new V2D(233.91789964747406,166.8759999655412) ); // 10
points.push( new V2D(316.0008358519483,113.99751522312634) ); // 11
points.push( new V2D(112.00073787053256,123.99758126236742) ); // 12
points.push( new V2D(379.00000116723294,282.9999992883623) ); // 13
points.push( new V2D(382.01122603734495,191.7261244132719) ); // 14
points.push( new V2D(379.00126228944015,146.00070197431805) ); // 15
points.push( new V2D(199.00001684611482,203.9999985705574) ); // 16
points.push( new V2D(378.79907199104207,198.7424764841121) ); // 17
points.push( new V2D(187.00211268432645,113.99878657762919) ); // 18
points.push( new V2D(339.9999705516257,128.00000877829987) ); // 19
points.push( new V2D(185.33178562795527,134.66831605037098) ); // 20
points.push( new V2D(257.39292388026723,214.5842889906127) ); // 21
points.push( new V2D(330.79442487684184,157.02063877979322) ); // 22
points.push( new V2D(215.00007696294324,123.00059646593296) ); // 23
points.push( new V2D(336.00291808231145,155.99506794135212) ); // 24
points.push( new V2D(264.99685776245553,137.99835406119143) ); // 25
points.push( new V2D(225.99976568355285,104.99469226337654) ); // 26
points.push( new V2D(233.99973349108615,119.99492716815605) ); // 27
points.push( new V2D(182.99487571946815,120.99938924962763) ); // 28
points.push( new V2D(152.00377123297136,160.00298782311182) ); // 29
points.push( new V2D(180.00807992575966,283.0001671355863) ); // 30
points.push( new V2D(220.96926619517043,155.07625555845405) ); // 31
points.push( new V2D(227.99929180428745,135.99800914747726) ); // 32
points.push( new V2D(103.99369668742946,119.99689795506595) ); // 33
points.push( new V2D(163.99992449095433,290.9998893451493) ); // 34
points.push( new V2D(218.66628799469513,114.66642915347218) ); // 35
points.push( new V2D(251.99481877573385,215.998628865105) ); // 36
points.push( new V2D(318.99957591532194,139.00091188399617) ); // 37
points.push( new V2D(203.91279748453545,157.09368148273762) ); // 38
points.push( new V2D(162.00419792976112,137.9961623828845) ); // 39
points.push( new V2D(193.99861220720445,249.99892461191862) ); // 40


var pointsB = [];
points = pointsB;
points.push( new V2D(60.99988332014943,271.9998915040789) ); // 0
points.push( new V2D(283.7704106285922,140.10292015047756) ); // 1
points.push( new V2D(269.99598053467685,181.85180063741282) ); // 2
points.push( new V2D(15.01013016754697,153.05239197507595) ); // 3
points.push( new V2D(14.666206035220016,95.9976293365947) ); // 4
points.push( new V2D(38.99962144539531,212.9996838863147) ); // 5
points.push( new V2D(305.06738956190674,144.9265554804068) ); // 6
points.push( new V2D(250.00183893106407,229.00917310425072) ); // 7
points.push( new V2D(43.00646018004075,151.0014983468511) ); // 8
points.push( new V2D(168.0018992839143,206.99260680000455) ); // 9
points.push( new V2D(157.9462082142645,151.9581414389743) ); // 10
points.push( new V2D(238.000587499814,94.99735309954927) ); // 11
points.push( new V2D(34.66968617154291,114.6670642395095) ); // 12
points.push( new V2D(308.0000054920573,261.00000631411723) ); // 13
points.push( new V2D(306.9562145803035,169.71969814440826) ); // 14
points.push( new V2D(302.00142021042217,124.00066597712657) ); // 15
points.push( new V2D(125.00001609639656,190.99999700867974) ); // 16
points.push( new V2D(304.8218356435196,176.79908278123094) ); // 17
points.push( new V2D(107.99947213940868,101.00089643872792) ); // 18
points.push( new V2D(263.9999289007101,108.00009799304068) ); // 19
points.push( new V2D(107.99923498665588,122.66660383200688) ); // 20
points.push( new V2D(184.40024356888523,199.7050830219114) ); // 21
points.push( new V2D(254.6656887618656,137.87611055991167) ); // 22
points.push( new V2D(137.00112357075554,109.00112678997483) ); // 23
points.push( new V2D(259.99900473594874,135.99537871477543) ); // 24
points.push( new V2D(186.67195720678868,121.32865575552053) ); // 25
points.push( new V2D(146.99796903517748,89.99465101577235) ); // 26
points.push( new V2D(155.9972304803221,105.00233049912946) ); // 27
points.push( new V2D(104.99813254071164,109.00046564000026) ); // 28
points.push( new V2D(76.05444925026248,147.9732970752933) ); // 29
points.push( new V2D(110.04500382637575,270.9656607168208) ); // 30
points.push( new V2D(144.92206971816552,141.12146952441188) ); // 31
points.push( new V2D(151.00069478082455,121.995310457925) ); // 32
points.push( new V2D(25.32447125499739,111.99657436074837) ); // 33
points.push( new V2D(93.99832550110617,278.9987982556524) ); // 34
points.push( new V2D(139.00045999586752,100.00170100386156) ); // 35
points.push( new V2D(178.06777930501565,199.95554881304912) ); // 36
points.push( new V2D(241.99934704658432,120.00138029459964) ); // 37
points.push( new V2D(128.00441055359997,144.8742805505896) ); // 38
points.push( new V2D(85.00190511892403,126.99551518777697) ); // 39
points.push( new V2D(121.99995462155192,236.00103543906792) ); // 40


F = [0.000005462227931478416,-0.00011006854725708874,0.008098590287009702,0.00010948467270919531,0.000005349907912003559,-0.017733821547636006,-0.008103769297990681,0.008222796396283668,0.6108835938091672];




/*


// "caseStudy1-20.jpg", "caseStudy1-24.jpg"


var pointsA = [];
points = pointsA;
points.push( new V2D(335.903758127633,165.15831870188708) ); // 0
points.push( new V2D(338.0713934580369,143.89395257585554) ); // 1
points.push( new V2D(206.0008299339135,77.00083242033242) ); // 2
points.push( new V2D(336.2385818105674,162.46228339319146) ); // 3
points.push( new V2D(234.00012390040234,16.00001715478541) ); // 4
points.push( new V2D(264.15405030358176,97.74104836712851) ); // 5
points.push( new V2D(244.10500612922192,117.00494856029802) ); // 6
points.push( new V2D(331.8789305404579,156.89010901870083) ); // 7
points.push( new V2D(218.00003492010129,202.0008191737316) ); // 8
points.push( new V2D(248.33031838535314,108.00871495137537) ); // 9
points.push( new V2D(247.81968182744762,96.91675556488728) ); // 10
points.push( new V2D(133.0001647514299,108.99889143916859) ); // 11
points.push( new V2D(249.9893325740045,198.88378662370354) ); // 12
points.push( new V2D(330.0109447331388,175.9341473338008) ); // 13
points.push( new V2D(209.99989734557118,122.99987243186509) ); // 14
points.push( new V2D(249.96622232216887,205.08747294191159) ); // 15
points.push( new V2D(263.10860120061045,107.99424092637098) ); // 16
points.push( new V2D(214.9977920337619,178.00092409299484) ); // 17
points.push( new V2D(247.07429833249986,126.90209025315502) ); // 18
points.push( new V2D(59.91829222414294,180.98063437034432) ); // 19
points.push( new V2D(61.99747767089701,159.99313278021359) ); // 20
points.push( new V2D(234.99983871619332,110.9996700926249) ); // 21
points.push( new V2D(232.99870363501543,200.9995245453885) ); // 22
points.push( new V2D(305.00264453641626,204.99883945608605) ); // 23
points.push( new V2D(343.1104673384145,174.93139366672446) ); // 24
points.push( new V2D(64.04366072219939,167.0463555733784) ); // 25
points.push( new V2D(283.0042545242387,205.00079868240343) ); // 26
points.push( new V2D(222.99604190738788,125.99368652301239) ); // 27
points.push( new V2D(144.00012654647082,165.99982916369717) ); // 28
points.push( new V2D(241.99998792655614,177.99998950190079) ); // 29
points.push( new V2D(263.0209346830309,198.88229740664426) ); // 30
points.push( new V2D(202.61200459921488,112.04213431666476) ); // 31
points.push( new V2D(85.99795989182842,108.00365627788788) ); // 32
points.push( new V2D(97.9998656368151,156.99986471728835) ); // 33


var pointsB = [];
points = pointsB;
points.push( new V2D(383.91497919815293,175.14174954236242) ); // 0
points.push( new V2D(386.9877859278775,154.88384177561076) ); // 1
points.push( new V2D(186.0006292680722,85.00114137847044) ); // 2
points.push( new V2D(384.2804960687915,172.45387783839175) ); // 3
points.push( new V2D(226.00009212181646,26.000239174160985) ); // 4
points.push( new V2D(278.7854449253789,109.00853301724713) ); // 5
points.push( new V2D(256.99307135712564,127.99509286453524) ); // 6
points.push( new V2D(379.78012134201475,167.18670144554835) ); // 7
points.push( new V2D(297.00006564839356,216.00010810727196) ); // 8
points.push( new V2D(261.02560924386745,118.16901978984583) ); // 9
points.push( new V2D(262.85787683065917,107.65306997327492) ); // 10
points.push( new V2D(144.9982705673391,116.9982656924064) ); // 11
points.push( new V2D(327.949396338422,210.958545221617) ); // 12
points.push( new V2D(376.0023782333833,185.99103205814228) ); // 13
points.push( new V2D(189.99965245340667,133.9995018508209) ); // 14
points.push( new V2D(327.9129592575868,218.06261412116973) ); // 15
points.push( new V2D(275.7816875979958,120.07337858258323) ); // 16
points.push( new V2D(256.99646365597096,192.00243836095777) ); // 17
points.push( new V2D(259.0077101761052,138.00553567125934) ); // 18
points.push( new V2D(97.20899977073957,199.95013602631718) ); // 19
points.push( new V2D(101.9971475651407,173.99717002496837) ); // 20
points.push( new V2D(241.99897968480394,121.99732372194954) ); // 21
points.push( new V2D(310.9985993534537,213.99976650920948) ); // 22
points.push( new V2D(376.0000958698556,215.00081594438936) ); // 23
points.push( new V2D(391.066863519563,184.90582219255208) ); // 24
points.push( new V2D(103.97822655532562,183.06108827057102) ); // 25
points.push( new V2D(357.0008652552156,215.99941727217563) ); // 26
points.push( new V2D(205.99827565232488,137.98883682936656) ); // 27
points.push( new V2D(205.00004164469118,179.99957005842094) ); // 28
points.push( new V2D(306.99996669299514,190.00004271356332) ); // 29
points.push( new V2D(339.06365764386834,210.9135857853359) ); // 30
points.push( new V2D(181.04791934691605,122.955257634879) ); // 31
points.push( new V2D(89.33303126797597,114.66558430788173) ); // 32
points.push( new V2D(120.00004345553876,171.00001236808265) ); // 33

var F = [-3.352712743715355e-7,-0.000013179191740391743,0.0014644355870591895,-0.0000031702316777767065,0.000008588003127220183,-0.02194915505542336,0.0010194085236254263,0.02466134581182565,-0.3114138743008315];


*/


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


// throw "...";

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


// throw "NOW ?"
// line in A is not single line in B ; it is interpolated -> round


var offsetRectA = ( rotationA==0 ? -minRowA : (rectifiedA.height()-maxRowA) );
var offsetRectB = ( rotationB==0 ? -minRowB : (rectifiedB.height()-maxRowB) );


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



	// var img = imageMatrixA.getRotatedImage(270);
	// console.log(img);
	// var img = GLOBALSTAGE.getFloatRGBAsImage(img.red(), img.grn(), img.blu(), img.width(), img.height());
	// var d = new DOImage(img);
	// d.matrix().translate(1200, 0);
	// GLOBALSTAGE.addChild(d);


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

// R3D._stereoBlockMatch(imageMatrixA,imageMatrixB, rectifiedA,rectifiedInfoA, rectifiedB,rectifiedInfoB, matrixFfwd, null,null);

var bestMatches = {"A":pointsA,"B":pointsB};

var result = R3D.stereoMatch(imageMatrixA,imageMatrixB, rectifiedA,rectifiedInfoA, rectifiedB,rectifiedInfoB, matrixFfwd,bestMatches, null,null);
console.log(result);
var matches = result["matches"];

for(var i=0; i<100; ++i){
// break;
	var index = Math.floor(Math.random()*matches.length);
// index = i;
	var match = matches[index];
	// console.log(match);
	var a = match["A"];
	var b = match["B"];
	// console.log(a+" => "+b);

	var c = new DO();
	c.graphics().setLine(1.0, 0xFFFF0000);
	c.graphics().beginPath();
	c.graphics().drawCircle(a.x,a.y, 5);
	c.graphics().strokeLine();
	c.graphics().endPath();

	c.graphics().setLine(1.0, 0xFFFF0000);
	c.graphics().beginPath();
	// c.graphics().drawCircle(imageMatrixA.width()+ b.x,b.y, 5);
	c.graphics().drawCircle(rectifiedA.width()+ b.x,b.y, 5);
	c.graphics().strokeLine();
	c.graphics().endPath();

	c.graphics().setLine(1.0, 0x99FF3366);
	c.graphics().beginPath();
	c.graphics().moveTo(a.x,a.y);
	// c.graphics().lineTo(imageMatrixA.width() + b.x,b.y);
	c.graphics().lineTo(rectifiedA.width() + b.x,b.y);

	c.graphics().strokeLine();
	c.graphics().endPath();

	c.matrix().translate(0, 0);
	GLOBALSTAGE.addChild(c);


}

// R3D.stereoMatch = function(sourceImageA,sourceImageB, imageMatrixA,infoA, imageMatrixB,infoB, FFwd, inputDisparity, disparityRange){

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
