// Matching.js

function Matching(){
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
	this._keyboard = new Keyboard();
	// this._keyboard.addFunction(Keyboard.EVENT_KEY_UP,this.handleKeyboardUp,this);
	// this._keyboard.addFunction(Keyboard.EVENT_KEY_DOWN,this.handleKeyboardDown,this);
	// this._keyboard.addFunction(Keyboard.EVENT_KEY_STILL_DOWN,this.handleKeyboardStill,this);
	// this._keyboard.addListeners();

	//var imageList = ["sunflowers_real.png"];
	//var imageList = ["sunflowers.png"];
	//var imageList = ["sunflowers.png","sunflowers.png"];
	var imageList = ["caseStudy1-0.jpg", "caseStudy1-9.jpg"];
	//var imageList = ["caseStudy1-29.jpg", "caseStudy1-9.jpg"]; // for testing bigger scale differences
	//var imageList = ["caseStudy1-29.jpg", "large.png"]; // for testing bigger scale differences
	//var imageList = ["caseStudy1-29.jpg", "stretch.png"]; // for testing bigger scale differences
	var imageLoader = new ImageLoader("./images/",imageList, this,this.handleImagesLoaded,null);
	imageLoader.load();
}
Matching.prototype.handleMouseClickFxn = function(e){
	var p = e.location;
	if(p.x>400){
		p.x -= 400;
	}
	console.log(p+"")
}
Matching.prototype.handleImagesLoaded = function(imageInfo){
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

var imageProcessingScale = 0.25;
	imageMatrixA = imageMatrixA.getScaledImage(imageProcessingScale);
	imageMatrixB = imageMatrixB.getScaledImage(imageProcessingScale);

// NOTHING
featuresA = [];
featuresB = [];

// CORNER SCALE SPACE
// var featuresA = R3D.HarrisExtract(imageMatrixA);
// var featuresB = R3D.HarrisExtract(imageMatrixB);
// SIFT SCALE SPACE
// var featuresA = R3D.SIFTExtract(imageMatrixA);
// var featuresB = R3D.SIFTExtract(imageMatrixB);


// SHOW POINTS
//var featuresB = [];
console.log("featuresA: "+featuresA.length+" | "+"featuresB: "+featuresB.length);
var lists = [featuresA,featuresB];
for(var f=0; f<lists.length; ++f){
break;
	var features = lists[f];
	for(k=0; k<features.length; ++k){
		var point = features[k];
		//console.log(""+point)
			var x = point.x * imageMatrixA.width();
			var y = point.y * imageMatrixA.height();
			var z = point.z;
		var c = new DO();
			color = 0xFFFF0000;
			c.graphics().setLine(0.50, color);
			c.graphics().beginPath();
			c.graphics().drawCircle(x, y, z);
			c.graphics().strokeLine();
			c.graphics().endPath();
			c.matrix().translate(0 + f*imageMatrixA.width(), 0);
			GLOBALSTAGE.addChild(c);
	}
}

//return;



// CONTINUE TO CREATE FEATURES:

var siftA = R3D.pointsToSIFT(imageMatrixA, featuresA);
var siftB = R3D.pointsToSIFT(imageMatrixB, featuresB);
// featuresA["features"];
// var siftB = featuresB["features"];
// 	featuresA = featuresA["points"];
// 	featuresB = featuresB["points"];

console.log("siftA: "+siftA.length+" | "+"siftB: "+siftB.length);


// visualize features in place
var lists = [[siftA,imageMatrixA],[siftA,imageMatrixB]];
var offset = new V2D();
for(var f=0; f<lists.length; ++f){
break;
	var features = lists[f][0];
	var imageMatrix = lists[f][1];
	for(k=0; k<features.length; ++k){
		var feature = features[k];
		var display = feature.visualizeInSitu(imageMatrix, offset);
			GLOBALSTAGE.addChild(display);
	}
	offset.x += imageMatrix.width();
}



var displaySize = 50;
var maxDisp = Math.min(siftA.length, 10);
for(m=0; m<maxDisp; ++m){
	var featureA = siftA[m];
	var vizA = featureA.visualize(imageMatrixA, displaySize);
	//var vizB = featureB.visualize(imageMatrixB, displaySize);
	vizA.matrix().translate(800,10 + m*displaySize);
	GLOBALSTAGE.addChild(vizA);
	//GLOBALSTAGE.addChild(vizB);
}


// return;


// ASSIGNMENT ?

var matching = SIFTDescriptor.match(siftA, siftB);
var matches = matching["matches"];
var matchesA = matching["A"];
var matchesB = matching["B"];
console.log("matches: "+matches.length);


var bestMatches = SIFTDescriptor.crossMatches(featuresA,featuresB, matches, matchesA,matchesB);
console.log("crossMatches: "+bestMatches.length);

//bestMatches = Code.copyArray(bestMatches, 0, 30); // same problems with too many
//bestMatches = Code.copyArray(bestMatches, 0, 20);
//bestMatches = Code.copyArray(bestMatches, 0, 15); // too low

//this.drawMatches(bestMatches, 0,0, 400,0);

// VISUALIZE TOP MATCHES
var displaySize = 50;
for(m=0; m<bestMatches.length; ++m){
	var match = bestMatches[m];
	var featureA = match["A"];
	var featureB = match["B"];
	var vizA = featureA.visualize(imageMatrixA, displaySize);
	var vizB = featureB.visualize(imageMatrixB, displaySize);
	vizA.matrix().translate(800,10 + m*displaySize);
	vizB.matrix().translate(800+displaySize,10 + m*displaySize);
	GLOBALSTAGE.addChild(vizA);
	GLOBALSTAGE.addChild(vizB);
	if(m>=10){
		break;
	}
}

// return;
/*
// RANSAC PREP
var pointsA = [];
var pointsB = [];
for(m=0; m<bestMatches.length; ++m){
	var match = bestMatches[m];
	var A = match["A"];
	var B = match["B"];
	pointsA.push( A.point().copy().scale(400,300) );
	pointsB.push( B.point().copy().scale(400,300) );
}

// RANSAC
console.log("RANSAC");
var ransac = R3D.fundamentalRANSACFromPoints(pointsA, pointsB, 2.5); // larger error allows for wider range use of points
var ransacMatches = ransac["matches"];
	pointsA = ransacMatches[0];
	pointsB = ransacMatches[1];
var matrixFfwd = ransac["F"];
var matrixFrev = R3D.fundamentalInverse(matrixFfwd);

console.log(matrixFfwd.toArray()+"");
*/

var matrixFfwd = new Matrix(3,3).fromArray([
	//0.000008725603920070428,-0.000010287681376109525,0.017492051721540253,0.000008336568707143996,-0.0000030546941712306783,0.006893868502814782,-0.018686314880793062,-0.0034673998830981457,-0.5033336084252676
	//-0.0000026936490116081374,0.000053351014098918076,-0.022223282499400508,-0.0000675872629154857,0.000004767046874719313,0.002260355785683234,0.0220017383051247,-0.005069558910564499,0.7406906765906947
	//0.0012890538645052851,-0.0033931611314522714,-4.962352477081496,0.007511297244601534,0.0013520510789218898,-5.3251596859181545,4.773483152006199,3.91205229363878,25.08523821187749
	//0.00010123415835172275,-0.0004194926458748483,0.25026705237695995,0.0007203828405846506,-0.0000051486687109940835,0.003270394249988104,-0.29441617613659754,0.004718880008086687,-2.896302253380877
	//0.00019290605135462158,-0.0013663161911353465,1.5674212790939541,0.002499296928223295,0.00016500728373492878,0.4113720674745211,-1.6576595189992989,-0.33070461153891223,-26.45048446322667
	//0.000005330091805790188,-0.000040672452075262593,0.031145013190095952,0.00006457555755428224,4.917586354305029e-7,0.005703610372125913,-0.03312458798558607,-0.0033403458273926993,-0.5990679465962082
	//0.0028316905322262054,-0.0022857903734016215,2.5184212206999628,0.0054433933444272276,0.00010910245041487014,0.7047208522720665,-3.755059670886561,-0.6660419327490149,56.535594862827104
	//0.0015939132111180143,-0.0029538332516167443,3.5353669816082984,0.005492266773032717,0.00011377335376161479,1.2562323695102657,-4.21258384867529,-0.9835319433313331,-12.070063102353336
	//0.00002970047401214867,-0.00003834718951717961,0.027304005234829027,0.000060295548445269374,-0.0000066978919679596104,0.008101402798494105,-0.03912360097646577,-0.004081793727297057,0.34935880642347067
	//0.0010048712055180653,-0.001465370465543868,1.06285809384958,0.002061702578744884,-0.0002606281265371199,0.33571782330080396,-1.4033148735298564,-0.16321875234099847,0.35138619908044405
	//-0.000024600509194252357,0.000033683323603525116,-0.027552724268759196,-0.00004974365965697801,0.000005331401967827317,-0.009416831708554629,0.036123754921459805,0.0054595317358457005,-0.042881618186910934
	//-0.8017337874824761,1.1396414874335363,-931.8879095776829,-1.6465995039423547,0.18705825709686152,-321.85165217553686,1203.147188001692,180.23336514460578,885.2669578408652
	//0.000030387820123378706,-0.00004401398225684127,0.03397192827367214,0.00006330249854828371,-0.000007064253765283511,0.011057455710643795,-0.044126570053115585,-0.005956316295339556,-0.030391008386748936
	//0.000029150287782834378,-0.000041272835845508875,0.031916789442833084,0.000059553011428331755,-0.000006680847405465796,0.010401386509607546,-0.04168546213254981,-0.005623461746581117,-0.010170007781177043
	//0.000019082853750995374,-0.00002813038700150432,0.022564221943391503,0.00004012166257890554,-0.0000047775275782798625,0.007575061298375405,-0.028878496716445396,-0.003885509761924703,-0.08156744774856416 // 80
	//-0.000012428881720870453,0.00002052758057480736,-0.01565906539343557,-0.00002721225508588404,0.000004153435925457325,-0.0053317131337877076,0.01955427119704501,0.0022260967021619426,0.13276128332906542 // 84
	//0.000010285967327239862,-0.000018406037058736857,0.01388681749883487,0.000024318317568990588,-0.000003618622820971085,0.004629458649339574,-0.01715307924933799,-0.0018931033946967134,-0.12303058208127739 // 89
	//0.000013719650172959019,-0.00002552372357372709,0.019368576656903513,0.000035194163079632916,-0.000004113348551602964,0.005915787861829249,-0.023914368700829337,-0.0026417763385129947,-0.14167298596505815 // 93
	

	// BEST FOR NOW:
	//0.0000027269946673859867,0.0000058666378526400515,-0.022218004013060053,-0.000013044017866634529,-0.000004253022893215171,-0.011491994391747789,0.020950228936843587,0.010483614147638562,0.38960882503981586 
	
	
	// -0.0000021282641382183547,-0.0000025208282484006327,0.015282588392599224,0.000002430338442916747,0.000001177835707433044,0.011495073134182089,-0.013071008814792071,-0.009947526076059778,-0.33474678881804865 // CLOSER TO INF
	// -0.00003056312793134558,0.0002663195394272707,-0.058489427931641115,-0.00025032765020170124,0.00006016308819630021,0.0014819204506886798,0.05544469619764387,-0.025243291719573274,2.37175268566093 // INSIDE
	//0.000015673824975906284,-0.000003816070325626309,-0.028221862837928283,-0.000009777264422075691,-0.000010832524023088601,-0.013204993887143482,0.02432594656769992,0.01313577043687154,0.6391418121077695 // IN OPPOSITE GRID CELLS
	//0.000010335607435676833,-0.00004356997460113225,-0.021883388742149613,0.0000022179534588576523,-0.000031936207612821995,-0.013736199925209124,0.02277976816153545,0.02345767592180197,-0.4069494482772368 // IN OPPOSITE GRID CELLS
	//0.0005289611427380936,-0.0000840998346695529,-1.2001094897362008,-0.0011610763018171655,-0.0007512728869154221,-0.4302121308044441,1.1022088283897775,0.5934285022659168,16.270968114548683


	-0.0002391010427254328,0.000278648500154903,0.45471667012159595,0.00023278204689539464,0.00042474144018037757,0.22912673397760688,-0.4086345253804511,-0.3319720720813846,-2.9639521048581763,
	
   ]);
var matrixFrev = R3D.fundamentalInverse(matrixFfwd);


// pointsA = featuresA;
// pointsB = featuresB;

// matches = [
// 			[new V2D(192,182), new V2D(171,181)],
// 			[new V2D(171,108), new V2D(209,46) ],
// 			[new V2D(22,168),  new V2D(50,149) ],
// 			[new V2D(361,183), new V2D(278,241)],
// 		];

var pointsA = [
				new V2D(86,209), // glasses corner left
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
				new V2D(87,193),
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

for(i=0; i<pointsA.length; ++i){
	pointsA[i].scale(imageProcessingScale);
	pointsB[i].scale(imageProcessingScale);
}
// pointsA = imageMatrixA.refineCornerPoints(pointsA);
// pointsB = imageMatrixB.refineCornerPoints(pointsB);
matrixFfwd = R3D.fundamentalMatrix(pointsA,pointsB);
matrixFfwd = R3D.fundamentalMatrixNonlinear(matrixFfwd,pointsA,pointsB);

console.log(matrixFfwd.toArray()+"");
var matrixFrev = R3D.fundamentalInverse(matrixFfwd);

matches = [];
for(i=0; i<pointsA.length; ++i){
	matches.push({"pointA":pointsA[i], "pointB":pointsB[i]});
}

console.log("showRansac");
this.showRansac(pointsA,pointsB, matrixFfwd, matrixFrev);

//return;

//GLOBALSTAGE.root().matrix().scale(2.0);
this.drawMatches(matches, 0,0, 400,0);

//return;

var epipole = R3D.getEpipolesFromF(matrixFfwd);
var epipoleA = epipole["A"];
var epipoleB = epipole["B"];

// TODO: rotate 2nd rectification by 180 if necessary
// if 1 is down and 1 is above => 180
// if 1 is left and 1 is right => 180
var rotation = R3D.polarRectificationRelativeRotation(imageMatrixA,epipoleA, imageMatrixB,epipoleB);
console.log("relative rotation:"+rotation);


//epipole = new V2D(100,100);
//epipole = new V2D(225,75);
var rectified = R3D.polarRectification(imageMatrixA,epipoleA);
	var rectifiedInfoA = rectified;
	var rectifiedA = new ImageMat(rectified.width,rectified.height, rectified.red,rectified.grn,rectified.blu);
		rectified = rectifiedA;
	var img = GLOBALSTAGE.getFloatRGBAsImage(rectified.red(), rectified.grn(), rectified.blu(), rectified.width(), rectified.height());
	var d = new DOImage(img);
	
	//d.matrix().scale(1.0);
	d.matrix().translate(0, 0);
	GLOBALSTAGE.addChild(d);

// TODO:
// IMAGES NEED TO BE ROTATED SO THAT EPIPOLES ARE IN SAME QUADRANT (GREATER THAN 90DEG)
// ROTATE TILL EPIPOLE TO IMAGE CENTER IS AT 0,0


var rectified = R3D.polarRectification(imageMatrixB,epipoleB);
	var rectifiedInfoB = rectified;
	var rectifiedB = new ImageMat(rectified.width,rectified.height, rectified.red,rectified.grn,rectified.blu);
		rectified = rectifiedB;
	var img = GLOBALSTAGE.getFloatRGBAsImage(rectified.red(), rectified.grn(), rectified.blu(), rectified.width(), rectified.height());
	var d = new DOImage(img);
	//d.matrix().scale(1.0);
	d.matrix().translate(0+rectifiedA.width(), 0);
	GLOBALSTAGE.addChild(d);

this.drawCover();
this.drawCover();
this.drawCover();

/*
//           0 1 2  3 4 5 6 7 8  9  0  1  2  3  4  5
var lineA = [2,3,4, 5,6,7,8,2,3, 4, 9, 10,14,13,12, 11];
var lineB = [4,5,6, 7,8,1,2,3,4,14,13, 12,11,10, 9,  8];
//var lineO = [0,0,0,-1,0,1,2,3,4, 0,-1, 1,  2, 3, 0,  0];
var lineO = Code.newArrayZeros(lineA.length);
// for(i=0; i<lineA.length; ++i){
// 	if(i%3==0){
// 		lineO[i] = -1;
// 	}else if(i%3==1){
// 		lineO[i] = 0;
// 	}else{
// 		lineO[i] = 1;
// 	}
// 	//lineO[i] = 0;
// }
//    1      2      3      4      5      6      7      8      9        10       11       12
// (2,0)  (3,1)  (4,2)  (5,3)  (6,4)  (7,6)  (8,7)  (9,8)  (12,9)  (13,10)  (14,11)  (15,12) 



// 97:
lineO = null;
lineA = [0.8677398131588202,0.8664173216842249,0.8650948302096296,0.8619977544552774,0.8555202113229274,0.8490165725700115,0.8433331620498198,0.836920698832507,0.8264694324511948,0.8100845690529798,0.7865139638772262,0.7669023713514956,0.7700184239203343,0.7553054950890999,0.6735688587210676,0.5483646064801289,0.4837776069108292,0.5317247261863419,0.6056911365319394,0.6871410061218711,0.704872784234125,0.6943977723035494,0.6894915385203656,0.7045199596026445,0.6993040292354564,0.6521489305003149,0.5351912397875828,0.487179334809878,0.6152894228825009,0.6704732501400246,0.4548008819479769,0.11937281228725298,0.08612441853588464,0.08555613281903675,0.19873730177758916,0.474268930208547,0.6129314323336202,0.5197155702644253,0.6223791051674156,0.7394768436878335,0.7411033718784757,0.7344582295651603,0.6712530208937428,0.3383730854340527,0.1034177372673754,0.0321289516505934,0.028538520402584002,0.02977192124622144,0.04624751035627139,0.15068037833976058,0.3911909019868798,0.40487803422495067,0.3674722476126389,0.40018194715834704,0.4302651860268821,0.4098053430875372,0.3783363412498541,0.39382806332352516,0.434698550497526,0.43290837408055055,0.3840108162163358,0.3889175772553581,0.44105374858243657,0.4607804349901204,0.4358885602405201,0.41575327323527295,0.4418715922027843,0.48770414263823253,0.8652287857274962,0.8631532468109597,0.8608881880707161,0.8581663328655881,0.8535660599797227,0.8479122208303952,0.8427363369690215,0.8365744266380055,0.827959429047735,0.8155785924285306,0.7944957795840374,0.7741276103774757,0.7665774407952126,0.7575134375742558,0.7127532570783318,0.616432981398969,0.5360879299519358,0.5425709888848833,0.5642747089956174,0.649310399118798,0.6886990793061041,0.6829019803804398,0.6755952828562349,0.6890734153405775,0.688109961820385,0.6624845340437441,0.5554765827497209,0.47417336318143016,0.6286376894799002,0.6857144316405944,0.5071724025021341,0.22880950905421338,0.08722026805947232,0.0836902445501833,0.1330284088471593,0.24523333741175138,0.27767934225365193,0.22733193590901923,0.5110976519571452,0.677013922601629,0.7245695332017602,0.7237899098703613,0.6878279247476383,0.507855001448792,0.17910502565492062,0.03448672936480008,0.02799234375581724,0.02803809749591886,0.03431118899287679,0.152151817273665,0.348693326845022,0.4044992767162853,0.3707148289982429,0.3768407254348595,0.4215696430251683,0.4218859760419555,0.36855585758979176,0.37382123780751336,0.41704953784212856,0.4273843904349826,0.39588284536725454,0.38122663999955814,0.41537939111570465,0.45425311179116706,0.4501148466382201,0.41371096678779806,0.41611132071153367,0.4727031156787272,0.49341288112371595];
lineB = [0.8601519824617078,0.8554914637930033,0.8511292445201581,0.8478905748625875,0.8438138658896438,0.839030206501102,0.8336697425886331,0.8267210098436694,0.8139060829823123,0.7947785719936226,0.7713927228201864,0.7552413316849081,0.7344345109980551,0.6180768672488494,0.5636784845716706,0.6209116210353985,0.6374829277505453,0.6493857735013135,0.6631983683754984,0.6722459825901206,0.6748477365502284,0.676023200061945,0.6480746088948001,0.5680678475614569,0.41887686588940864,0.2939136573740575,0.436276114154374,0.600730332264623,0.584987281340584,0.35502803942889966,0.09288141959662011,0.036944302724271294,0.03279944149464233,0.030691861783874775,0.03077589938019376,0.030500634849877844,0.029033555497867975,0.02955518547161178,0.030561762364169794,0.03181219124561577,0.046302257006573734,0.20060530268152257,0.42491359302718007,0.4964112023549063,0.5047629182935974,0.5118542482598692,0.5186639481849218,0.5204286664889662,0.4377893052669095,0.2792019323388343,0.2872337358697852,0.3604521912603533,0.3472910819089934,0.33997356056728045,0.31735616291425606,0.25283316584044097,0.3091374046197579,0.2756120843864496,0.26170097777751433,0.3315967934305781,0.2574157046404825,0.28156074432917183,0.33056702793218024,0.24702733146989223,0.28136287165791773,0.34482929122235223,0.27910082979421197,0.2674809052755241,0.35323816479463804,0.32044572786433595,0.25410362034115663,0.858044652533931,0.8527449629938023,0.849429830083798,0.8459568800546154,0.8424518942906841,0.8381400568678531,0.8327845788426433,0.8266882453455698,0.8163649929830278,0.7993079501071684,0.7781872705046181,0.7582919281271993,0.7362667262730852,0.6716899627978453,0.5872844946060461,0.596371696562252,0.624175082792624,0.6355792883361763,0.648020847305699,0.6613665440894797,0.6662238770067722,0.6689498684603873,0.6521352824052293,0.5847725309997327,0.4694797416276674,0.21117483298179254,0.3119832209081259,0.4529558716336189,0.6165816677099968,0.4388810863523731,0.17523398794673928,0.04876427572333775,0.034032658330308815,0.031157341672181926,0.030731861351660224,0.030080008056698693,0.029186516382504118,0.030058240119622662,0.03148474013008772,0.03384567247261588,0.077973091059385,0.24677677754337554,0.44929382814596536,0.48867130731650743,0.4970505571522226,0.5038335331761897,0.5106333638873856,0.5111635211851425,0.4494765854691077,0.26551776870473875,0.2801898890636426,0.3526888933528351,0.3442853482748241,0.33318059602049604,0.32735202709885797,0.256349069100954,0.28545066335833813,0.29129240654203786,0.2548208485075038,0.30591951268661677,0.2641950905975774,0.2708411202047021,0.3218338582525282,0.25334140712544023,0.26933511823886686,0.33164267895187977,0.2870641881876326,0.2665025371709052,0.33080930966294997,0.35634721099648575,0.30502464357275433,0.2565192052096729];

var path = R3D.bestDisparityPath(lineA, lineB, lineO);

var sequence = R3D.disparityFromPath(path, lineA,  lineB);
console.log(sequence+"");

return;
*/

//var matches = [];
//var moreMatches = R3D.mediumDensityMatches(imageMatrixA,imageMatrixB, rectifiedInfoA,rectifiedInfoB, matrixFfwd, matches);
var allMatches = R3D.highDensityMatches(imageMatrixA,imageMatrixB, rectifiedInfoA,rectifiedInfoB, matrixFfwd, matches);

//GLOBALSTAGE.root().matrix().scale(2.0);

return;


// only do matches within probable distance
matching = SIFTDescriptor.matchF(siftA, siftB, imageMatrixA,imageMatrixB, matrixFfwd, matrixFrev);
var matches = matching["matches"];
var matchesA = matching["A"];
var matchesB = matching["B"];
console.log("matches: "+matches.length);

var bestMatches = SIFTDescriptor.crossMatches(featuresA,featuresB, matches, matchesA,matchesB);
console.log("crossMatches: "+bestMatches.length);
//bestMatches = Code.copyArray(matches,0,50);
//this.drawMatches(bestMatches, 0,0, 400,0);



// RANSAC 2


// RANSAC PREP
var pointsA = [];
var pointsB = [];
for(m=0; m<bestMatches.length; ++m){
	var match = bestMatches[m];
	var A = match["A"];
	var B = match["B"];
	pointsA.push( A.point().copy().scale(400,300) );
	pointsB.push( B.point().copy().scale(400,300) );
}

// RANSAC
console.log("RANSAC");
var ransac = R3D.fundamentalRANSACFromPoints(pointsA, pointsB, 1.5, matrixFfwd);
var ransacMatches = ransac["matches"];
	pointsA = ransacMatches[0];
	pointsB = ransacMatches[1];
var matrixFfwd = ransac["F"];
var matrixFrev = R3D.fundamentalInverse(matrixFfwd);

console.log("["+Code.commaSeparatedStringFromArray(matrixFfwd.toArray())+"];");


this.showRansac(pointsA,pointsB, matrixFfwd, matrixFrev);


console.log("TODO: GIVEN F, FIND BEST MATCHES FOR A IN B & OPPOSITE");

console.log("TODO: DENSE MATCH FROM F & INITIAL MATCHES");
/*
can use a point match to divide op search frame, but what about arbitrary point->F->line ' s ?
*/

// 
//console.log("TODO: LOAD MULTIPLE IMAGES AND FIND F OF EACH");

console.log("done");
return;


	var rangeA = new AreaMap.Range(imageMatrixA,imageMatrixA.width(),imageMatrixA.height(), 10,10);
	var rangeB = new AreaMap.Range(imageMatrixB,imageMatrixB.width(),imageMatrixB.height(), 10,10);

// var img = [0,0,0,0,0,1,2,3,4,5,5,5,5,5,5];
// var his = ImageMat.histogram(img, 3,4);
// console.log(img);
// console.log(his);
// return;


// TEST OUT OPTIMUM ENTROPIES

// left tankmen toe
// var pointA = new V2D(209,149);
// var pointB = new V2D(209,133);
// right tankmen goggle
// var pointA = new V2D(250,71);
// var pointB = new V2D(245,94);
// right tankman corner
// var pointA = new V2D(248,130);
// var pointB = new V2D(252,115);
// cup right corner
// var pointA = new V2D(94,138);
// var pointB = new V2D(117,90);
// glasses center
// var pointA = new V2D(145,203);
// var pointB = new V2D(131,194);
// mouse neck
// var pointA = new V2D(348,182);
// var pointB = new V2D(270,236);
// origin
// var pointA = new V2D(172,107);
// var pointB = new V2D(212,46.5);
// grid bottom
// var pointA = new V2D(173,121);
// var pointB = new V2D(203,72);
// 12"
// var pointA = new V2D(237.5,250.5);
// var pointB = new V2D(179.5,253);
// lighter handle
// var pointA = new V2D(22,165);
// var pointB = new V2D(49,149);
// power bar - not good - noncircular
// var pointA = new V2D(134.5,86.5);
// var pointB = new V2D(156,61);
// glassed dot right
// var pointA = new V2D(189,180);
// var pointB = new V2D(170,178.5);

/// 29: - mask
// var pointA = new V2D(303,81);
// var pointB = new V2D(243,101);
/// 29 - foot
// var pointA = new V2D(195,255);
// var pointB = new V2D(209,133);
/// 29 origin - bad
// var pointA = new V2D(144.5,175);
// var pointB = new V2D(211,46);
/// 29 grid end - poor
// var pointA = new V2D(141,206);
// var pointB = new V2D(202,82);
/// 29 battery base - 
// var pointA = new V2D(60,236);
// var pointB = new V2D(166,102);
/// 29 brick corner
// var pointA = new V2D(298,243);
// var pointB = new V2D(253,133);

/// 29 grid cross
// var pointA = new V2D(182,150);
// var pointB = new V2D(229,46);


var pointsA = [
	// // large
	// new V2D(303,81),
	// new V2D(144,175),
	// new V2D(140.5,207),
	// new V2D(181,150),
	// new V2D(221,177),
	// new V2D(145.5,110),
	// new V2D(251,76),
	// new V2D(231,135),

	// ?
	// new V2D(303,81),
	// new V2D(195,255),
	// new V2D(144,175),
	// new V2D(141,206),
	// new V2D(60,236), // 5
	// new V2D(298,243),
	// new V2D(181,150),
	// new V2D(36,288),
	// new V2D(146,109),
	// new V2D(88,113), // 10
	// new V2D(55,107),


	// 1-29 testing
	new V2D(248,83),
	new V2D(208,150),
	new V2D(172,107), // 3
	new V2D(176,128),
	new V2D(144,144), // 5
	new V2D(253,149),
	new V2D(194,95),
	new V2D(148,165),
	new V2D(172,67),
	new V2D(142,76), // 10
	new V2D(136,85),
	new V2D(299,195),
	new V2D(190,179),
	// OUTLIERS:
	// new V2D(18,226),
	// new V2D(145,204),
	// new V2D(239,251),
	// new V2D(330,248),
	// new V2D(372,180),
	// new V2D(86,215),
	// new V2D(28,101),
	// new V2D(187,166),
	// new V2D(48,157),
	// new V2D(108,134),

];
var pointsB = [
	// stretch
	// new V2D(304,63),
	// new V2D(145,220),
	// new V2D(141,273),
	// new V2D(182,178), // +1 is big diff

	// // large
	// new V2D(331,95),
	// new V2D(93,235),
	// new V2D(87,284),
	// new V2D(149,198),
	// new V2D(208,239),
	// new V2D(96,138),
	// new V2D(253,88),
	// new V2D(225,175),
	

// 	// large
// 	new V2D(331,95),
// //	new V2D(209,133), // x
// 	new V2D(93,235),
// 	new V2D(87,283),
// 	// new V2D(166,102), // 5
// 	// new V2D(253,133),
// 	new V2D(149,198),
// 	// new V2D(154,138),
// 	// new V2D(213,11),
// 	// new V2D(179,24.5), // 10
// 	// new V2D(159,58),

	// 1-29 testing
	new V2D(243,101),
	new V2D(209,133),
	new V2D(211,46), // 3
	new V2D(202,83),
	new V2D(166,102), // 5
	new V2D(253,133),
	new V2D(229,46),
	new V2D(154,138),
	new V2D(213,11),
	new V2D(179,24.5), // 10
	new V2D(157,59),
	new V2D(252,209),
	new V2D(169,179),
	// OUTLIERS:
	// new V2D(271,130),
	// new V2D(80,108),
	// new V2D(221,83),
	// new V2D(15,210),
	// new V2D(322,294),
	// new V2D(170,187),
	// new V2D(115,70),
	// new V2D(253,162),
	// new V2D(116,86),
	// new V2D(369,203),

];

var index = 5;
pointsA = [pointsA[index]];
pointsB = [pointsB[index]];

// REFINE POINTS FROM MANUAL CORNER DETECTION:
pointsA = imageMatrixA.refineCornerPoints(pointsA);
pointsB = imageMatrixB.refineCornerPoints(pointsB);




// TEST RANSAC HERE
// var matches = [];
// for(i=0; i<pointsA.length; ++i){
// 	matches.push({"pointA":pointsA[i], "pointB":pointsB[i]});
// }
// this.drawMatches(matches, 0,0, 400,0);
// this.drawAround(pointsA, 0,0);
// this.drawAround(pointsB, 400,0);


// RANSAC HERE

//pointA = new V3D(42.80739301492822,228.66508665936004); // light
//pointA = new V3D(153.89768824000612,150.63907516461467); // grid area
//pointA = new V3D(207.48487376954955,225.1363595710788);// above boot
//pointA = new V3D(97.8366688192515,256.54378117045184);// open area
//pointA = new V3D(302.37055083046306,78.13764202690865); // eye corner
//pointA = new V3D(271.30243794283433,97.52262218232931); // mouth with high scale
//pointA = new V3D(152.74792531499037,214.98671609135167); // open area - corner
//pointA = new V3D(163.16450327907205,145.95838173533863); // grid with high scale
//pointA = new V3D(285.7995608466945,223.02049820508222); // knee top
//pointA = new V3D(233.52002044901178,224.04385786541434);
//pointA = new V3D(184.4083162171843,115.39080100771517); // grid corner
/*
	// BASE IMAGES
	var bestFeaturesA = R3D.bestFeatureListRGB(imageMatrixA.red(), imageMatrixA.grn(), imageMatrixA.blu(), imageMatrixA.width(), imageMatrixA.height());
	var bestFeaturesB = R3D.bestFeatureListRGB(imageMatrixB.red(), imageMatrixB.grn(), imageMatrixB.blu(), imageMatrixB.width(), imageMatrixB.height());
	// GRADIENT IMAGES
	// var bestFeaturesA = R3D.bestFeatureListRGB(imageGradARed, imageGradAGrn, imageGradABlu, imageMatrixA.width(), imageMatrixA.height());
	// var bestFeaturesB = R3D.bestFeatureListRGB(imageGradBRed, imageGradBGrn, imageGradBBlu, imageMatrixB.width(), imageMatrixB.height());
	console.log(bestFeaturesA.length);
	console.log(bestFeaturesB.length);

	bestFeaturesA = Matching.dropArrayPoints(bestFeaturesA, 0.1, "z", false);
	bestFeaturesB = Matching.dropArrayPoints(bestFeaturesB, 0.1, "z", false);
	bestFeaturesA = Code.copyArray(bestFeaturesA,0,Math.min(250,bestFeaturesA.length-1));
	bestFeaturesB = Code.copyArray(bestFeaturesB,0,Math.min(250,bestFeaturesB.length-1));

	console.log(bestFeaturesA.length);
	console.log(bestFeaturesB.length);

	this.drawAround(bestFeaturesA, 0,0);
	this.drawAround(bestFeaturesB, 400,0);


pointsA = [];
pointsB = [];
for(k=0; k<bestFeaturesA.length; ++k){
	pointsA[k] = new V2D(bestFeaturesA[k].x, bestFeaturesA[k].y);
}
for(k=0; k<bestFeaturesB.length; ++k){
	pointsB[k] = new V2D(bestFeaturesB[k].x, bestFeaturesB[k].y);
}
*/


	this.drawAround(pointsA, 0,0);
	this.drawAround(pointsB, 400,0);

var pCount = 175;
pointsA = Code.copyArray(pointsA, 0, Math.min(pointsA.length-1, pCount-1));
pointsB = Code.copyArray(pointsB, 0, Math.min(pointsB.length-1, pCount-1));

var featuresA = ZFeature.setupFeaturesFromPoints(rangeA, pointsA);
var featuresB = ZFeature.setupFeaturesFromPoints(rangeB, pointsB);

// VISUALIZE
for(k=0; k<featuresA.length; ++k){
	var perRow = 25;
	var offY = Math.floor(k/perRow);
	var offX = k%perRow;
	featuresA[k].visualize(50 + offX*51, 350 + offY*51, rangeA);
}
for(k=0; k<featuresB.length; ++k){
	var perRow = 25;
	var offY = Math.floor(k/perRow);
	var offX = k%perRow;
	var p = new V2D(50 + offX*51, 350 + 50*2+5 + offY*51);
	featuresB[k].visualize(p.x,p.y, rangeB);
	// 	var d = new DO();
	// 	d.graphics().clear();
	// 	d.graphics().setLine(1.0, 0xFFFF0000);
	// 	d.graphics().beginPath();
	// 	d.graphics().moveTo(p.x,p.y);
	// 	d.graphics().lineTo(featuresB[k].point().x + 400,featuresB[k].point().y + 0);
	// 	d.graphics().endPath();
	// 	d.graphics().strokeLine();
	// GLOBALSTAGE.addChild(d);
}


return;

/*
	//bestFeaturesA = R3D.filterFeatureListGradientRGB(bestFeaturesA, imageMatrixA.red(), imageMatrixA.grn(), imageMatrixA.blu(), imageMatrixA.width(), imageMatrixA.height());
	//bestFeaturesB = R3D.filterFeatureListGradientRGB(bestFeaturesB, imageMatrixB.red(), imageMatrixB.grn(), imageMatrixB.blu(), imageMatrixB.width(), imageMatrixB.height());
	// bestFeaturesA = R3D.filterFeatureListMoveCostRGB(bestFeaturesA, imageMatrixA.red(), imageMatrixA.grn(), imageMatrixA.blu(), imageMatrixA.width(), imageMatrixA.height());
	// bestFeaturesB = R3D.filterFeatureListMoveCostRGB(bestFeaturesB, imageMatrixB.red(), imageMatrixB.grn(), imageMatrixB.blu(), imageMatrixB.width(), imageMatrixB.height());

	bestFeaturesA = R3D.filterFeatureListRangeRGB(bestFeaturesA, imageMatrixA.red(), imageMatrixA.grn(), imageMatrixA.blu(), imageMatrixA.width(), imageMatrixA.height());
	bestFeaturesB = R3D.filterFeatureListRangeRGB(bestFeaturesB, imageMatrixB.red(), imageMatrixB.grn(), imageMatrixB.blu(), imageMatrixB.width(), imageMatrixB.height());
	console.log(bestFeaturesA.length);
	console.log(bestFeaturesB.length);

	// range
	// bestFeaturesA = Matching.dropArrayPoints(bestFeaturesA, 0.25, "z", false);
	// bestFeaturesB = Matching.dropArrayPoints(bestFeaturesB, 0.25, "z", false);
	console.log(bestFeaturesA.length);
	console.log(bestFeaturesB.length);
	this.drawCover();

	this.drawAround(bestFeaturesA, 0,0);
	this.drawAround(bestFeaturesB, 400,0);
	//bestFeaturesA = Code.copyArray(bestFeaturesA, 0,25);
*/

// COMPARE each
var featureListA = rangeA._featureList;
var featureListB = rangeB._featureList;
ZFeature.compareFeatureLists(featureListA, featureListB, false);

console.log(featureListA)

var feature = featureListA[2];
console.log(feature)
feature.visualize(50, 350, rangeA);
var matches = feature.matches().sort(ZFeature.sortingMatches);
for(k=0; k<matches.length; ++k){
	var match = matches[k];
	var A = match["A"];
	var B = match["B"];
	if(feature==B){
		B = A;
	}
	var p = new V2D(100 + k*50, 400);
	B.visualize(p.x,p.y);
	var d = new DO();
		d.graphics().clear();
		d.graphics().setLine(1.0, 0xFFFF0000);
		d.graphics().beginPath();
		d.graphics().moveTo(p.x,p.y);
		d.graphics().lineTo(B.point().x + 400,B.point().y + 0);
		d.graphics().endPath();
		d.graphics().strokeLine();
	GLOBALSTAGE.addChild(d);
}

var scores = [];
for(k=0; k<matches.length; ++k){
	scores.push(matches[k]["score"]);
}
console.log("\n\ny=["+scores+"];\n\n");


/*
// DROP HIGH-SIMILARITY RATE POINTS
ZFeature.calculateUniqueness(featureListA, featureListB);
ZFeature.dropUniqueness(featureListA, featureListB);
console.log("DROPPED:",featureListA.length, featureListB.length);
	this.drawCover();
	this.drawAround(bestFeaturesA, 0,0);
	this.drawAround(bestFeaturesB, 400,0);
// NEED TO RECOMPARE WITH NEWLY SIZED FEATURE LISTS FOR INDEXES TO BE UPDATED
ZFeature.compareFeatureLists(featureListA, featureListB);
*/
// ASSIGN each
matches = ZFeature.assignFeatureLists(featureListA, featureListB);
//matches = Code.copyArray(matches, 0, Math.floor(matches.length*0.50)); // get best results

console.log(matches);
//	matches = Code.copyArray(matches, 0, 50);
this.drawMatches(matches, 0,0, 400,0);

var scores = [];
for(k=0; k<matches.length; ++k){
	scores.push(matches[k]["score"]);
}
console.log("\n\nx=["+scores+"];\n\n");
return;

// RANSAC
console.log("RANSAC");
var ransac = R3D.fundamentalRANSACFromPoints(pointsA, pointsB, 1.5);
var ransacMatches = ransac["matches"];
	pointsA = ransacMatches[0];
	pointsB = ransacMatches[1];
var matrixFfwd = ransac["F"];
var matrixFrev = R3D.fundamentalInverse(matrixFfwd);



var matches = [];
for(i=0; i<pointsA.length; ++i){
	//console.log(" "+"pointA: "+pointsA[i]+"    pointB:"+pointsB[i]);
	matches.push({"pointA":pointsA[i], "pointB":pointsB[i]});
}
this.drawCover();
//this.drawCover();
//this.drawCover();

var colors = [0xFFFF0000, 0xFFFF9900, 0xFFFF6699, 0xFFFF00FF, 0xFF9966FF, 0xFF0000FF,  0xFF00FF00 ]; // R O M P B P G
// SHOW F LINES ON EACH
for(var k=0;k<matches.length;++k){
	var percent = k / (matches.length-1);
	//if(!pointsA[k] || !pointsB[k]){ continue; }
	var pointA = pointsA[k];
	var pointB = pointsB[k];
	pointA = new V3D(pointA.x,pointA.y,1.0);
	pointB = new V3D(pointB.x,pointB.y,1.0);
	var lineA = new V3D();
	var lineB = new V3D();

	matrixFfwd.multV3DtoV3D(lineA, pointA);
	matrixFrev.multV3DtoV3D(lineB, pointB);

	var d, v;
	var dir = new V2D();
	var org = new V2D();
	var imageWidth = 400;
	var imageHeight = 300;
	var scale = Math.sqrt(imageWidth*imageWidth + imageHeight*imageHeight); // imageWidth + imageHeight;
	//

	var color = Code.interpolateColorGradientARGB(percent, colors);
	//
	Code.lineOriginAndDirection2DFromEquation(org,dir, lineA.x,lineA.y,lineA.z);
	dir.scale(scale);
	d = new DO();
	d.graphics().clear();
	d.graphics().setLine(1.0, color);
	d.graphics().beginPath();
	d.graphics().moveTo(imageWidth+org.x-dir.x,org.y-dir.y);
	d.graphics().lineTo(imageWidth+org.x+dir.x,org.y+dir.y);
	d.graphics().endPath();
	d.graphics().strokeLine();
	GLOBALSTAGE.addChild(d);
	//
	Code.lineOriginAndDirection2DFromEquation(org,dir, lineB.x,lineB.y,lineB.z);
	dir.scale(scale);
	d = new DO();
	d.graphics().clear();
	d.graphics().setLine(1.0, color);
	d.graphics().beginPath();
	d.graphics().moveTo( 0 + org.x-dir.x,org.y-dir.y);
	d.graphics().lineTo( 0 + org.x+dir.x,org.y+dir.y);
	d.graphics().endPath();
	d.graphics().strokeLine();
	GLOBALSTAGE.addChild(d);
}
//this.drawCover();
this.drawMatches(matches, 0,0, 400,0);


// with a bare set of matches, can do limited matching between original source points to get a larger sparse set of matches
// for a given point in A, only compare using points in B that are close to F-line
// REDO Ransac with higher-confidence matches to gain more accurate F matrix / matches
// DO DENSE MATCHING ALONG F-LINES

//console.log(matrix);



return;

//











/*

pointA.scale(scaler);
pointB.scale(scaler);


// var optimumScaleA = R3D.optimumScaleForPoint(imageGradMagAGry, imageMatrixA.width(), imageMatrixA.height(), pointA.x, pointA.y);
// var optimumScaleB = R3D.optimumScaleForPoint(imageGradMagBGry, imageMatrixB.width(), imageMatrixB.height(), pointB.x, pointB.y);

// var optimumScaleA = R3D.optimumScaleForPoint(imageMatrixAGry, imageMatrixA.width(), imageMatrixA.height(), pointA.x, pointA.y);
// var optimumScaleB = R3D.optimumScaleForPoint(imageMatrixBGry, imageMatrixB.width(), imageMatrixB.height(), pointB.x, pointB.y);
// var optimumScaleA = R3D.optimumScaleForPointOLD(imageGradMagA, 21, pointA);
// var optimumScaleB = R3D.optimumScaleForPointOLD(imageGradMagB, 21, pointB);


// var optimumScaleA = R3D.optimumScaleForPoint(imageMatrixAGry, imageMatrixA.width(), imageMatrixA.height(), pointA.x, pointA.y);
// var optimumScaleB = R3D.optimumScaleForPoint(imageMatrixAGry, imageMatrixB.width(), imageMatrixB.height(), pointB.x, pointB.y);
// var optimumScaleA = R3D.optimumScaleForPointOLD(copyImageMatrixA, new V2D(5,5), pointA);
// var optimumScaleB = R3D.optimumScaleForPointOLD(copyImageMatrixB, new V2D(5,5), pointB);
// var optimumScaleA = R3D.optimumScaleForPointOLD(copyImageMatrixA, new V2D(35,35), pointA);
// var optimumScaleB = R3D.optimumScaleForPointOLD(copyImageMatrixB, new V2D(35,35), pointB);
var optimumScaleA = R3D.optimumScaleForPoint(copyImageMatrixA, pointA);
var optimumScaleB = R3D.optimumScaleForPoint(copyImageMatrixB, pointB);



console.log("     ..................... "+k+" - "+optimumScaleA+" | "+optimumScaleB);

if(optimumScaleA){
	pointA = copyPointA;
	imageMatrixA = copyImageMatrixA;
	var entropyImage = imageMatrixA.extractRectFromFloatImage(pointA.x,pointA.y, 1.0/optimumScaleA,null, referenceScale, referenceScale);
	//console.log(entropyImage);
	img = GLOBALSTAGE.getFloatRGBAsImage(entropyImage.red(), entropyImage.grn(), entropyImage.blu(), entropyImage.width(), entropyImage.height());
	d = new DOImage(img);
	d.matrix().scale(2.0);
	d.matrix().translate(300, 300 + k*referenceScale*2);
	GLOBALSTAGE.addChild(d);


// GET ASYMM SCALING
//var image = entropyImage;
var mask = ImageMat.circleMask( entropyImage.width(), entropyImage.height() );
//console.log(entropyImage.gry(), entropyImage.width(), entropyImage.height(), new V2D(entropyImage.width()*0.5,entropyImage.height()*0.5), mask);
//var dir = ImageMat.calculateCovarianceMatrix(entropyImage.gry(), entropyImage.width(), entropyImage.height(), new V2D(entropyImage.width()*0.5,entropyImage.height()*0.5), mask);

					// MORE UNSTABLE:
					// entropyImage._r = ImageMat.getNormalFloat01(entropyImage._r);
					// entropyImage._g = ImageMat.getNormalFloat01(entropyImage._g);
					// entropyImage._b = ImageMat.getNormalFloat01(entropyImage._b);
var dir = entropyImage.calculateCovariance(new V2D((entropyImage.width()-1)*0.5, (entropyImage.height()-1)*0.5), mask);
// <-0.7793007907743846,0.6266500438828828,0.09100750595704268>,<-0.6266500438828827,-0.7793007907743847,0.045722309234423164>
var v1 = dir[0];
var v2 = dir[1];
var vScale = v1.z / v2.z;
// ImageMat.calculateCovarianceMatrix = function(image, imageWidth,imageHeight, mean, maskOutCenter){
	//console.log(""+v1);
	//console.log(""+vScale);
console.log("A: "+vScale);

	var s = 15;
	var c = new DO();
		c.graphics().setLine(2.0, 0xFFFF0000);
		c.graphics().beginPath();
		c.graphics().moveTo(0,0);
		c.graphics().lineTo(v1.x*s, v1.y*s);
		c.graphics().strokeLine();
		c.graphics().endPath();
		c.graphics().setLine(2.0, 0xFF0000FF);
		c.graphics().beginPath();
		c.graphics().moveTo(0,0);
		c.graphics().lineTo(v2.x*s/vScale, v2.y*s/vScale);
		c.graphics().strokeLine();
		c.graphics().endPath();
			c.matrix().translate(300 + referenceScale, 300 + k*referenceScale*2 + referenceScale); // middle
		GLOBALSTAGE.addChild(c);
	// 

	// STRETCH:
	matrix = new Matrix(3,3).identity();
		var angleX = V2D.angleDirection(V2D.DIRX, v1);
			matrix = Matrix.transform2DRotate(matrix,-angleX);
			//matrix = Matrix.transform2DScale(matrix,vScale/2,2/vScale);
			matrix = Matrix.transform2DScale(matrix,1.0/Math.sqrt(vScale),Math.sqrt(vScale));
			//matrix = Matrix.transform2DScale(matrix,Math.sqrt(vScale),1.0/Math.sqrt(vScale));
			matrix = Matrix.transform2DRotate(matrix,angleX);
			matrix = Matrix.transform2DScale(matrix,optimumScaleA,optimumScaleA);

	var covImage = imageMatrixA.extractRectFromFloatImage(pointA.x,pointA.y, 1.0, null, referenceScale, referenceScale, matrix);
		img = GLOBALSTAGE.getFloatRGBAsImage(covImage.red(), covImage.grn(), covImage.blu(), covImage.width(), covImage.height());
		d = new DOImage(img);
		d.matrix().scale(2.0);
		d.matrix().translate(300 + referenceScale*2 + 10, 300 + k*referenceScale*2);
		GLOBALSTAGE.addChild(d);

	// ROTATE TO GRAD
	var grad = covImage.calculateGradient(null,null, true);
		//grad = V2D.angleDirection(V2D.DIRX, grad);
			//matrix = Matrix.transform2DRotate(matrix,grad);

			// TODO: BLURR
			var gaussSize = Math.round(Math.sqrt(referenceScale));
			var sigma = 1.6;
			var gauss1D = ImageMat.getGaussianWindow(gaussSize,1, sigma);
					covImage._r = ImageMat.getNormalFloat01(covImage._r);
					covImage._g = ImageMat.getNormalFloat01(covImage._g);
					covImage._b = ImageMat.getNormalFloat01(covImage._b);
			var rB = ImageMat.gaussian2DFrom1DFloat(covImage._r, referenceScale,referenceScale, gauss1D);
			var gB = ImageMat.gaussian2DFrom1DFloat(covImage._g, referenceScale,referenceScale, gauss1D);
			var bB = ImageMat.gaussian2DFrom1DFloat(covImage._b, referenceScale,referenceScale, gauss1D);
			covImage._r = rB;
			covImage._g = gB;
			covImage._b = bB;
			var bdir = entropyImage.calculateCovariance(new V2D((covImage.width()-1)*0.5, (covImage.height()-1)*0.5), mask);
			bdir = bdir[0];
			
grad = V2D.angleDirection(bdir, grad);
//console.log("GRAD: "+(grad*180/Math.PI));
if( Math.abs(grad) > Math.PI*0.5){
	//bdir.rotate(Math.PI);
	bdir.scale(-1);
}
			angleX = V2D.angleDirection(V2D.DIRX, bdir);
			matrix = Matrix.transform2DRotate(matrix,-angleX);
			var covImage = imageMatrixA.extractRectFromFloatImage(pointA.x,pointA.y, 1.0, null, referenceScale, referenceScale, matrix);
	//

		img = GLOBALSTAGE.getFloatRGBAsImage(covImage.red(), covImage.grn(), covImage.blu(), covImage.width(), covImage.height());
		d = new DOImage(img);
		d.matrix().scale(2.0);
		d.matrix().translate(300 + referenceScale*4 + 20, 300 + k*referenceScale*2);
		GLOBALSTAGE.addChild(d);
}

if(optimumScaleB){
	pointB = copyPointB;
	imageMatrixB = copyImageMatrixB;
		matrix = new Matrix(3,3).identity();
		matrix = Matrix.transform2DScale(matrix,optimumScaleB,optimumScaleB);
	var entropyImage = imageMatrixB.extractRectFromFloatImage(pointB.x,pointB.y, 1.0,null, referenceScale, referenceScale, matrix);
	img = GLOBALSTAGE.getFloatRGBAsImage(entropyImage.red(), entropyImage.grn(), entropyImage.blu(), entropyImage.width(), entropyImage.height());
	d = new DOImage(img);
	d.matrix().scale(2.0);
	d.matrix().translate(500, 300 + k*referenceScale*2);
	GLOBALSTAGE.addChild(d);



// GET ASYMM SCALING
//var image = entropyImage;
var mask = ImageMat.circleMask( entropyImage.width(), entropyImage.height() );
//console.log(entropyImage.gry(), entropyImage.width(), entropyImage.height(), new V2D(entropyImage.width()*0.5,entropyImage.height()*0.5), mask);
//var dir = ImageMat.calculateCovarianceMatrix(entropyImage.gry(), entropyImage.width(), entropyImage.height(), new V2D(entropyImage.width()*0.5,entropyImage.height()*0.5), mask);
					// MORE UNSTABLE:
					// entropyImage._r = ImageMat.getNormalFloat01(entropyImage._r);
					// entropyImage._g = ImageMat.getNormalFloat01(entropyImage._g);
					// entropyImage._b = ImageMat.getNormalFloat01(entropyImage._b);
var dir = entropyImage.calculateCovariance(new V2D((entropyImage.width()-1)*0.5, (entropyImage.height()-1)*0.5), mask);
// <-0.7793007907743846,0.6266500438828828,0.09100750595704268>,<-0.6266500438828827,-0.7793007907743847,0.045722309234423164>
var v1 = dir[0];
var v2 = dir[1];
var vScale = v1.z / v2.z;
// ImageMat.calculateCovarianceMatrix = function(image, imageWidth,imageHeight, mean, maskOutCenter){
	//console.log(""+v1);
	console.log("B: "+vScale);
// TODO: ALSO CALCULATE GRADIENT AND MAKE SURE PRIMARy COV DIR IS IN SAME DIRECTION OR FLIP BY PI

	var s = 15;
	var c = new DO();
		c.graphics().setLine(2.0, 0xFFFF0000);
		c.graphics().beginPath();
		c.graphics().moveTo(0,0);
		c.graphics().lineTo(v1.x*s, v1.y*s);
		c.graphics().strokeLine();
		c.graphics().endPath();
		c.graphics().setLine(2.0, 0xFF0000FF);
		c.graphics().beginPath();
		c.graphics().moveTo(0,0);
		c.graphics().lineTo(v2.x*s/vScale, v2.y*s/vScale);
		c.graphics().strokeLine();
		c.graphics().endPath();
			c.matrix().translate(500 + referenceScale, 300 + k*referenceScale*2 + referenceScale); // middle
		GLOBALSTAGE.addChild(c);
	// 

	// STRETCH:
	matrix = new Matrix(3,3).identity();
		var angleX = V2D.angleDirection(V2D.DIRX, v1);
			matrix = Matrix.transform2DRotate(matrix,-angleX);
			//matrix = Matrix.transform2DScale(matrix,vScale/2,2/vScale);
			matrix = Matrix.transform2DScale(matrix,1.0/Math.sqrt(vScale),Math.sqrt(vScale));
			//matrix = Matrix.transform2DScale(matrix,Math.sqrt(vScale),1.0/Math.sqrt(vScale));
			matrix = Matrix.transform2DRotate(matrix,angleX);
			matrix = Matrix.transform2DScale(matrix,optimumScaleB,optimumScaleB);
			// 
	var covImage = imageMatrixB.extractRectFromFloatImage(pointB.x,pointB.y, 1.0, null, referenceScale, referenceScale, matrix);
		img = GLOBALSTAGE.getFloatRGBAsImage(covImage.red(), covImage.grn(), covImage.blu(), covImage.width(), covImage.height());
		d = new DOImage(img);
		d.matrix().scale(2.0);
		d.matrix().translate(500 + referenceScale*2 + 10, 300 + k*referenceScale*2);
		GLOBALSTAGE.addChild(d);
	// ROTATE TO GRAD
	var grad = covImage.calculateGradient(null,null, true);
		//grad = V2D.angleDirection(V2D.DIRX, grad);
			//matrix = Matrix.transform2DRotate(matrix,grad);

			//

			// TODO: BLURR
			var gaussSize = Math.round(Math.sqrt(referenceScale));
			var sigma = 1.6;
			var gauss1D = ImageMat.getGaussianWindow(gaussSize,1, sigma);
					covImage._r = ImageMat.getNormalFloat01(covImage._r);
					covImage._g = ImageMat.getNormalFloat01(covImage._g);
					covImage._b = ImageMat.getNormalFloat01(covImage._b);
			var rB = ImageMat.gaussian2DFrom1DFloat(covImage._r, referenceScale,referenceScale, gauss1D);
			var gB = ImageMat.gaussian2DFrom1DFloat(covImage._g, referenceScale,referenceScale, gauss1D);
			var bB = ImageMat.gaussian2DFrom1DFloat(covImage._b, referenceScale,referenceScale, gauss1D);
			covImage._r = rB;
			covImage._g = gB;
			covImage._b = bB;
			var bdir = entropyImage.calculateCovariance(new V2D((covImage.width()-1)*0.5, (covImage.height()-1)*0.5), mask);
			bdir = bdir[0];
			
grad = V2D.angleDirection(bdir, grad);
//console.log("GRAD: "+(grad*180/Math.PI));
if( Math.abs(grad) > Math.PI*0.5){
	//bdir.rotate(Math.PI);
	bdir.scale(-1);
}

			angleX = V2D.angleDirection(V2D.DIRX, bdir);
			matrix = Matrix.transform2DRotate(matrix,-angleX);
			var covImage = imageMatrixB.extractRectFromFloatImage(pointB.x,pointB.y, 1.0, null, referenceScale, referenceScale, matrix);
	//
		img = GLOBALSTAGE.getFloatRGBAsImage(covImage.red(), covImage.grn(), covImage.blu(), covImage.width(), covImage.height());
		d = new DOImage(img);
		d.matrix().scale(2.0);
		d.matrix().translate(500 + referenceScale*4 + 20, 300 + k*referenceScale*2);
		GLOBALSTAGE.addChild(d);
}




}
*/

/*

var scaleA = R3D.optimumScaleForPoint(imageMatrixA, size, pointA, new V2D(810, 20));
console.log("A: "+scaleA);
var scaleB = R3D.optimumScaleForPoint(imageMatrixB, size, pointB, new V2D(850, 20));
console.log("B: "+scaleB);
// scaleA = 1/scaleA
// scaleB = 1/scaleB

this.drawAround([pointA], 0,0);
this.drawAround([pointB], 400,0);

	var zoomSize = 25
	var zoomedA = imageMatrixA.extractRectFromFloatImage(pointA.x,pointA.y,1/scaleA,null, zoomSize,zoomSize);
	var zoomedB = imageMatrixB.extractRectFromFloatImage(pointB.x,pointB.y,1/scaleB,null, zoomSize,zoomSize);

	img = GLOBALSTAGE.getFloatRGBAsImage(zoomedA.red(),zoomedA.grn(),zoomedA.blu(), zoomedA.width(),zoomedA.height());
	d = new DOImage(img);
	d.matrix().translate(100, 310);
	GLOBALSTAGE.addChild(d);

	img = GLOBALSTAGE.getFloatRGBAsImage(zoomedB.red(),zoomedB.grn(),zoomedB.blu(), zoomedB.width(),zoomedB.height());
	d = new DOImage(img);
	d.matrix().translate(200, 310);
	GLOBALSTAGE.addChild(d);

*/

return;
/*
// ENTROPY IMAGE:

var size = 10;
var entropyImage = ImageMat.entropyInWindow(imageMatrixA.red(), imageMatrixA.width(), imageMatrixA.height(), size, size);
entropyImage = entropyImage.value;
entropyImage = ImageMat.getNormalFloat01(entropyImage);

	img = GLOBALSTAGE.getFloatRGBAsImage(entropyImage, entropyImage, entropyImage, imageMatrixA.width(), imageMatrixA.height());
	d = new DOImage(img);
	d.matrix().translate(400, 300);
	GLOBALSTAGE.addChild(d);

return;

// OPTIMUM ENTROPY

	entropyImage = R3D.optimumScaleForImage(imageMatrixA);
	entropyImage = ImageMat.normalFloat01(entropyImage);
	img = GLOBALSTAGE.getFloatRGBAsImage(entropyImage, entropyImage, entropyImage, imageMatrixA.width(), imageMatrixA.height());
	d = new DOImage(img);
	d.matrix().translate(400, 300);
	GLOBALSTAGE.addChild(d);

return;

*/
//




// var data = [.1,.25,.5,.5,.75];
// var cdf = ImageMat.cdf(data);
// console.log(cdf);
// var x = cdf.x;
// var y = cdf.y;
// console.log(x);
// console.log(y);


// var probabilities = [];
// var count = 10;
// for(i=0; i<=count; ++i){
// 	var p = i/count;
// 	var prob = ImageMat.probabilityFromCDF(cdf,p);
// 	probabilities.push(prob);
// }
// console.log(probabilities);
// return;

// ideal ~ scale = 1
/*
	var scale = 1.0;
		scale = 1.0 / scale;
	var size = 16;
	var point = new V2D(200,100);
	var sample = imageMatrixA.extractRectFromFloatImage(point.x,point.y,scale,null, size,size);

	img = GLOBALSTAGE.getFloatRGBAsImage(sample.red(),sample.grn(),sample.blu(), sample.width(),sample.height());
	d = new DOImage(img);
	//d.matrix().scale(1.0);
	d.matrix().translate(100, 100);
	GLOBALSTAGE.addChild(d);


var data = sample.gry();
var cdf = ImageMat.cdf(data);
//console.log(cdf);
var x = cdf.x;
var y = cdf.y;
// console.log("x = ["+x+"];");
// console.log("y = ["+y+"];");


*/



/*
var probabilities = [];
var x = [];
var count = 16;
for(i=0; i<=count; ++i){
	var p = i/count;
	var prob = ImageMat.probabilityFromCDF(cdf,p);
	x.push(p);
	probabilities.push(prob);
}
console.log("x = ["+x+"];");
console.log("z = ["+probabilities+"];");
*/
/*
var probabilities = [];
var dx = [];
var dy = [];
var count = 50;
var u = 0;
for(i=0; i<=count; ++i){
	var p = i/count;
	var v = ImageMat.valueFromCDF(cdf,p);
	//var prob = ImageMat.probabilityFromCDF(cdf,p);
	dx.push(p);
	dy.push(v-u);
	u = v;
	//probabilities.push(prob);
}
console.log("x = ["+dx+"];");
console.log("y = ["+dy+"];");
//console.log("x = ["+x+"];");
//console.log("z = ["+probabilities+"];");

return;
*/
/*
	var histogram = ImageMat.histogram(sample.gry(), sample.width(), sample.height());
	console.log(histogram);

	var cdf = ImageMat.cdf(sample.gry(), sample.width(), sample.height());
	console.log("cdf: "+cdf);

	var entropySimple = ImageMat.entropySimple(sample.gry(), sample.width(), sample.height());
	console.log("entropySimple: "+entropySimple);

	var entropy = ImageMat.entropy(sample.gry(), sample.width(), sample.height());
	console.log("entropy: "+entropy);
*/

	//this.showComparrison(imageMatrixA, imageMatrixB);

// TEST SAD & SSD
/*

//var point = new V2D(150,115);
var point = new V2D(173,107); // origin
var sSize = 21;
var scores = [];
var i, samples;
var sampleScale = 1.0;
var testOriginal = imageMatrixA.extractRectFromFloatImage(point.x,point.y,sampleScale,null, sSize,sSize);


this.showComparrison(testOriginal, testOriginal, false);


// NOSE
samples = 10;
for(i=0; i<samples; ++i){
	var testNoisy = testOriginal.copy();
	var noiseRange = i/(samples-1);
	var noiseOffset = -noiseRange*0.5;
	var red = testNoisy.red();
	var grn = testNoisy.grn();
	var blu = testNoisy.blu();
	red = ImageMat.randomAdd(red,noiseRange,noiseOffset);
	grn = ImageMat.randomAdd(grn,noiseRange,noiseOffset);
	blu = ImageMat.randomAdd(blu,noiseRange,noiseOffset);
	red = ImageMat.clipFloat01(red);
	grn = ImageMat.clipFloat01(grn);
	blu = ImageMat.clipFloat01(blu);
	testNoisy.red(red);
	testNoisy.grn(grn);
	testNoisy.blu(blu);
	score = ImageMat.SADFloatSimpleChannelsRGB(testOriginal.red(),testOriginal.grn(),testOriginal.blu(),testOriginal.width(),testOriginal.height(), testNoisy.red(),testNoisy.grn(),testNoisy.blu());
	//scores.push(score);
}

// LIGHT
samples = 10;
for(i=0; i<samples; ++i){
	var testLight = testOriginal.copy();
	var offset = i/(samples-1);
	offset = offset * 0.5;
	var red = testLight.red();
	var grn = testLight.grn();
	var blu = testLight.blu();
	red = ImageMat.addConst(red,offset);
	grn = ImageMat.addConst(grn,offset);
	blu = ImageMat.addConst(blu,offset);
	red = ImageMat.clipFloat01(red);
	grn = ImageMat.clipFloat01(grn);
	blu = ImageMat.clipFloat01(blu);
	testLight.red(red);
	testLight.grn(grn);
	testLight.blu(blu);
	score = ImageMat.SADFloatSimpleChannelsRGB(testOriginal.red(),testOriginal.grn(),testOriginal.blu(),testOriginal.width(),testOriginal.height(), testLight.red(),testLight.grn(),testLight.blu());
	//scores.push(score);
}

// DARK
samples = 10;
for(i=0; i<samples; ++i){
	var testDark = testOriginal.copy();
	var offset = i/(samples-1);
	offset = offset * 0.5;
	var red = testDark.red();
	var grn = testDark.grn();
	var blu = testDark.blu();
	red = ImageMat.addConst(red,-offset);
	grn = ImageMat.addConst(grn,-offset);
	blu = ImageMat.addConst(blu,-offset);
	red = ImageMat.clipFloat01(red);
	grn = ImageMat.clipFloat01(grn);
	blu = ImageMat.clipFloat01(blu);
	testDark.red(red);
	testDark.grn(grn);
	testDark.blu(blu);
	score = ImageMat.SADFloatSimpleChannelsRGB(testOriginal.red(),testOriginal.grn(),testOriginal.blu(),testOriginal.width(),testOriginal.height(), testDark.red(),testDark.grn(),testDark.blu());
	//scores.push(score);
}

// RANDOM
samples = 2000;
//for(i=0; i<samples; ++i){
// for(i=100; i<200; ++i){
// 	for(j=100; j<150; ++j){
// for(i=150; i<200; ++i){
// 	for(j=100; j<125; ++j){
for(i=175; i<200; ++i){
	for(j=150; j<175; ++j){
// V2D(150,115);
	//var pRandom = new V2D( Code.randomInt(50,350),  Code.randomInt(50,250) );
	//var pRandom = new V2D( Code.randomInt(100,200),  Code.randomInt(100,150) );
	var pRandom = new V2D( i, j );
	//console.log(point+" - "+pRandom)
	if(point.x == pRandom.x && point.y == pRandom.y){
		console.log("EQUAL");
	}
	var testRandom = imageMatrixA.extractRectFromFloatImage(pRandom.x,pRandom.y,sampleScale,null, sSize,sSize);
	//var testRandom = imageMatrixA.extractRectFromFloatImage(point.x,point.y,1.0,null, sSize,sSize);
	var red = testRandom.red();
	var grn = testRandom.grn();
	var blu = testRandom.blu();
	// red = ImageMat.addConst(red,-offset);
	// grn = ImageMat.addConst(grn,-offset);
	// blu = ImageMat.addConst(blu,-offset);
	// red = ImageMat.clipFloat01(red);
	// grn = ImageMat.clipFloat01(grn);
	// blu = ImageMat.clipFloat01(blu);
	testRandom.red(red);
	testRandom.grn(grn);
	testRandom.blu(blu);
	score = ImageMat.SADFloatSimpleChannelsRGB(testOriginal.red(),testOriginal.grn(),testOriginal.blu(),testOriginal.width(),testOriginal.height(), testRandom.red(),testRandom.grn(),testRandom.blu());
	scores.push(score);
}
}

var str = "";
str = str + "x = [";
for(i=0; i<scores.length; ++i){
	//scores[i] = Math.log(scores[i]);
	scores[i] = Math.floor(scores[i]);
	if(scores[i]<0.1){
		console.log(scores[i]);
		scores[i] = 0.1;
	}
	str = str + " "+scores[i];
}
str = str + "];";
console.log(str);
*/
/*
plot(x,"r-");
semilogy(x,"r-");
*/
//var score = ImageMat.SADFloatSimpleChannelsRGB(sample.red(),sample.grn(),sample.blu(),sample.width(),sample.height(), sample.red(),sample.grn(),sample.blu());





//this.showComparrison(testOriginal, testNoisy, true);

/*
see how score reacts with various amounts of noise:
0-1 [10%]
see how score reacts with various amounts of darkness:
1.0->0.0
see how score reacts with various amounts of brightness:
0.0-1.0
see how score reacts to random other points
[10]
see how score reacts to various random static
0-1 [10%]
*/



/*	
	var imageCornerA = R3D.harrisCornerDetection(imageMatrixA.gry(), imageMatrixA.width(), imageMatrixA.height());//, konstant, sigma);
		imageCornerA = new ImageMat(imageMatrixA.width(), imageMatrixA.height(), imageCornerA);
	var imageCornerB = R3D.harrisCornerDetection(imageMatrixB.gry(), imageMatrixB.width(), imageMatrixB.height());//, konstant, sigma);
		imageCornerB = new ImageMat(imageMatrixB.width(), imageMatrixB.height(), imageCornerB);

//	this.showComparrison(imageCornerA, imageCornerB, true);

	var imageCornerA = R3D.hessianCornerDetection(imageMatrixA.gry(), imageMatrixA.width(), imageMatrixA.height());//, konstant, sigma);
		imageCornerA = new ImageMat(imageMatrixA.width(), imageMatrixA.height(), imageCornerA);
	var imageCornerB = R3D.hessianCornerDetection(imageMatrixB.gry(), imageMatrixB.width(), imageMatrixB.height());//, konstant, sigma);
		imageCornerB = new ImageMat(imageMatrixB.width(), imageMatrixB.height(), imageCornerB);
//	this.showComparrison(imageCornerA, imageCornerB, true);

		//imageCornerA = ImageMat.applyGaussianFloat(imageMatrixA.gry(),imageMatrixA.width(), imageMatrixA.height(), 1.6);
		//imageCornerA = ImageMat.secondDerivativeX(imageCornerA, imageMatrixA.width(), imageMatrixA.height()).value;
		imageCornerA = ImageMat.secondDerivativeX(imageMatrixA.gry(), imageMatrixA.width(), imageMatrixA.height()).value;
		imageCornerA = ImageMat.absFloat(imageCornerA);
			imageCornerA = ImageMat.applyGaussianFloat(imageCornerA,imageMatrixA.width(), imageMatrixA.height(), 1.6);
		imageCornerA = new ImageMat(imageMatrixA.width(), imageMatrixA.height(), imageCornerA);
		imageCornerB = ImageMat.secondDerivativeX(imageMatrixB.gry(), imageMatrixB.width(), imageMatrixB.height()).value;
		imageCornerB = ImageMat.absFloat(imageCornerB);
		imageCornerB = new ImageMat(imageMatrixB.width(), imageMatrixB.height(), imageCornerB);
//	this.showComparrison(imageCornerA, imageCornerB);

	var imageCostA = ImageMat.totalCostToMoveAny(imageMatrixA);
		imageCostA = new ImageMat(imageMatrixA.width(), imageMatrixA.height(), imageCostA);
	var imageCostB = ImageMat.totalCostToMoveAny(imageMatrixB);
		imageCostB = new ImageMat(imageMatrixB.width(), imageMatrixB.height(), imageCostB);
//	this.showComparrison(imageCostA, imageCostB);
*/

	// var imageGradARed = ImageMat.laplacian(imageMatrixA.red(), imageMatrixA.width(), imageMatrixA.height()).value;
	// var imageGradAGrn = ImageMat.laplacian(imageMatrixA.grn(), imageMatrixA.width(), imageMatrixA.height()).value;
	// var imageGradABlu = ImageMat.laplacian(imageMatrixA.blu(), imageMatrixA.width(), imageMatrixA.height()).value;
	// var imageGradA = new ImageMat(imageMatrixA.width(), imageMatrixA.height(), imageGradARed, imageGradAGrn, imageGradABlu);
	// var imageGradBRed = ImageMat.laplacian(imageMatrixB.red(), imageMatrixB.width(), imageMatrixB.height()).value;
	// var imageGradBGrn = ImageMat.laplacian(imageMatrixB.grn(), imageMatrixB.width(), imageMatrixB.height()).value;
	// var imageGradBBlu = ImageMat.laplacian(imageMatrixB.blu(), imageMatrixB.width(), imageMatrixB.height()).value;
	// var imageGradB = new ImageMat(imageMatrixB.width(), imageMatrixB.height(), imageGradBRed, imageGradBGrn, imageGradBBlu);
	// this.showComparrison(imageGradA, imageGradB);

	
	// var imageGradARed = ImageMat.gradientMagnitude(imageMatrixA.red(), imageMatrixA.width(), imageMatrixA.height()).value;
	// var imageGradAGrn = ImageMat.gradientMagnitude(imageMatrixA.grn(), imageMatrixA.width(), imageMatrixA.height()).value;
	// var imageGradABlu = ImageMat.gradientMagnitude(imageMatrixA.blu(), imageMatrixA.width(), imageMatrixA.height()).value;
	// var imageGradMagA = new ImageMat(imageMatrixA.width(), imageMatrixA.height(), imageGradARed, imageGradAGrn, imageGradABlu);
	// var imageGradBRed = ImageMat.gradientMagnitude(imageMatrixB.red(), imageMatrixB.width(), imageMatrixB.height()).value;
	// var imageGradBGrn = ImageMat.gradientMagnitude(imageMatrixB.grn(), imageMatrixB.width(), imageMatrixB.height()).value;
	// var imageGradBBlu = ImageMat.gradientMagnitude(imageMatrixB.blu(), imageMatrixB.width(), imageMatrixB.height()).value;
	// var imageGradMagB = new ImageMat(imageMatrixB.width(), imageMatrixB.height(), imageGradBRed, imageGradBGrn, imageGradBBlu);
	//this.showComparrison(imageGradMagA, imageGradMagB);

	// var imageGradARed = ImageMat.gradientAngle(imageMatrixA.red(), imageMatrixA.width(), imageMatrixA.height()).value;
	// var imageGradAGrn = ImageMat.gradientAngle(imageMatrixA.grn(), imageMatrixA.width(), imageMatrixA.height()).value;
	// var imageGradABlu = ImageMat.gradientAngle(imageMatrixA.blu(), imageMatrixA.width(), imageMatrixA.height()).value;
	// var imageGradAngA = new ImageMat(imageMatrixA.width(), imageMatrixA.height(), imageGradARed, imageGradAGrn, imageGradABlu);
	// var imageGradBRed = ImageMat.gradientAngle(imageMatrixB.red(), imageMatrixB.width(), imageMatrixB.height()).value;
	// var imageGradBGrn = ImageMat.gradientAngle(imageMatrixB.grn(), imageMatrixB.width(), imageMatrixB.height()).value;
	// var imageGradBBlu = ImageMat.gradientAngle(imageMatrixB.blu(), imageMatrixB.width(), imageMatrixB.height()).value;
	// var imageGradAngB = new ImageMat(imageMatrixB.width(), imageMatrixB.height(), imageGradBRed, imageGradBGrn, imageGradBBlu);
	//this.showComparrison(imageGradAngA, imageGradAngB);
	
/*
	var imageVariationA = ImageMat.rangeInWindow(imageMatrixA.gry(), imageMatrixA.width(), imageMatrixA.height(), 3,3).value;
		imageVariationA = new ImageMat(imageMatrixA.width(), imageMatrixA.height(), imageVariationA);
	var imageVariationB = ImageMat.rangeInWindow(imageMatrixB.gry(), imageMatrixB.width(), imageMatrixB.height(), 3,3).value;
		imageVariationB = new ImageMat(imageMatrixB.width(), imageMatrixB.height(), imageVariationB);
	this.showComparrison(imageVariationA, imageVariationB);
*/
/*
	var imageBestPointsA = R3D.bestFeatureFilterRGB(imageMatrixA.red(), imageMatrixA.grn(), imageMatrixA.blu(), imageMatrixA.width(), imageMatrixA.height());
		imageBestPointsA = new ImageMat(imageMatrixA.width(), imageMatrixA.height(), imageBestPointsA);
	var imageBestPointsB = R3D.bestFeatureFilterRGB(imageMatrixB.red(), imageMatrixB.grn(), imageMatrixB.blu(), imageMatrixB.width(), imageMatrixB.height());
		imageBestPointsB = new ImageMat(imageMatrixB.width(), imageMatrixB.height(), imageBestPointsB);
	this.showComparrison(imageBestPointsA, imageBestPointsB);
*/


// DO CHECKING

	// BASE IMAGES
	var bestFeaturesA = R3D.bestFeatureListRGB(imageMatrixA.red(), imageMatrixA.grn(), imageMatrixA.blu(), imageMatrixA.width(), imageMatrixA.height());
	var bestFeaturesB = R3D.bestFeatureListRGB(imageMatrixB.red(), imageMatrixB.grn(), imageMatrixB.blu(), imageMatrixB.width(), imageMatrixB.height());
	// GRADIENT IMAGES
	// var bestFeaturesA = R3D.bestFeatureListRGB(imageGradARed, imageGradAGrn, imageGradABlu, imageMatrixA.width(), imageMatrixA.height());
	// var bestFeaturesB = R3D.bestFeatureListRGB(imageGradBRed, imageGradBGrn, imageGradBBlu, imageMatrixB.width(), imageMatrixB.height());
	console.log(bestFeaturesA.length);
	console.log(bestFeaturesB.length);
/*
	this.drawAround(bestFeaturesA, 0,0);
	this.drawAround(bestFeaturesB, 400,0);
*/
	// drop bottom half:
	// bestFeaturesA = Matching.dropArrayPoints(bestFeaturesA, 0.01, "z", false);
	// bestFeaturesB = Matching.dropArrayPoints(bestFeaturesB, 0.01, "z", false);
	console.log(bestFeaturesA.length);
	console.log(bestFeaturesB.length);
/*
	this.drawCover();
	this.drawAround(bestFeaturesA, 0,0);
	this.drawAround(bestFeaturesB, 400,0);
*/

// return;
	//bestFeaturesA = R3D.filterFeatureListGradientRGB(bestFeaturesA, imageMatrixA.red(), imageMatrixA.grn(), imageMatrixA.blu(), imageMatrixA.width(), imageMatrixA.height());
	//bestFeaturesB = R3D.filterFeatureListGradientRGB(bestFeaturesB, imageMatrixB.red(), imageMatrixB.grn(), imageMatrixB.blu(), imageMatrixB.width(), imageMatrixB.height());
	// bestFeaturesA = R3D.filterFeatureListMoveCostRGB(bestFeaturesA, imageMatrixA.red(), imageMatrixA.grn(), imageMatrixA.blu(), imageMatrixA.width(), imageMatrixA.height());
	// bestFeaturesB = R3D.filterFeatureListMoveCostRGB(bestFeaturesB, imageMatrixB.red(), imageMatrixB.grn(), imageMatrixB.blu(), imageMatrixB.width(), imageMatrixB.height());

	bestFeaturesA = R3D.filterFeatureListRangeRGB(bestFeaturesA, imageMatrixA.red(), imageMatrixA.grn(), imageMatrixA.blu(), imageMatrixA.width(), imageMatrixA.height());
	bestFeaturesB = R3D.filterFeatureListRangeRGB(bestFeaturesB, imageMatrixB.red(), imageMatrixB.grn(), imageMatrixB.blu(), imageMatrixB.width(), imageMatrixB.height());
	console.log(bestFeaturesA.length);
	console.log(bestFeaturesB.length);

	// range
	// bestFeaturesA = Matching.dropArrayPoints(bestFeaturesA, 0.25, "z", false);
	// bestFeaturesB = Matching.dropArrayPoints(bestFeaturesB, 0.25, "z", false);
	console.log(bestFeaturesA.length);
	console.log(bestFeaturesB.length);
/*
	this.drawCover();

	this.drawAround(bestFeaturesA, 0,0);
	this.drawAround(bestFeaturesB, 400,0);
*/
	//bestFeaturesA = Code.copyArray(bestFeaturesA, 0,25);

	var rangeA = new AreaMap.Range(imageMatrixA,imageMatrixA.width(),imageMatrixA.height(), 10,10);
	var rangeB = new AreaMap.Range(imageMatrixB,imageMatrixB.width(),imageMatrixB.height(), 10,10);

	bestFeaturesA = R3D.filterFeatureListSimilarRGB(bestFeaturesA, imageMatrixA.red(), imageMatrixA.grn(), imageMatrixA.blu(), imageMatrixA.width(), imageMatrixA.height(), rangeA);
	bestFeaturesB = R3D.filterFeatureListSimilarRGB(bestFeaturesB, imageMatrixB.red(), imageMatrixB.grn(), imageMatrixB.blu(), imageMatrixB.width(), imageMatrixB.height(), rangeB);

	// bestFeaturesA = Matching.dropArrayPoints(bestFeaturesA, 0.5, "z", true);
	// bestFeaturesB = Matching.dropArrayPoints(bestFeaturesB, 0.5, "z", true);
	console.log(bestFeaturesA.length);
	console.log(bestFeaturesB.length);

// TODO: PLOT THE SCORES & DELTA SCORES 
// WHEN TO CUT OFF TO BE BASED OFF OF GRAPH
/*
	this.drawCover();
	this.drawAround(bestFeaturesA, 0,0);
	this.drawAround(bestFeaturesB, 400,0);
*/
//return;

	var sorting = function(a,b){
		if(a===b){ return 0; }
		return a["score"] < b["score"] ? -1 : 1;
	}

	// convert to local object:
	for(i=0; i<bestFeaturesA.length; ++i){
		var point = bestFeaturesA[i];
		var matches = new PriorityQueue(sorting, 10);
		var feature = {"point":point, "matches":matches};
		bestFeaturesA[i] = feature;
	}
	for(i=0; i<bestFeaturesB.length; ++i){
		var point = bestFeaturesB[i];
		var matches = new PriorityQueue(sorting, 10);
		var feature = {"point":point, "matches":matches};
		bestFeaturesB[i] = feature;
	}
	// pushed all matches, now to make a craph
	var maxLen = Math.max(bestFeaturesA.length, bestFeaturesB.length);
	var cost = Code.newArray2DZeros(maxLen,maxLen);

	console.log("RUNNING COST MATRIX");
	var zoomScale = 0.5;
	for(i=0; i<bestFeaturesA.length; ++i){
		var featureA = bestFeaturesA[i];
		var pointA = featureA["point"];
		var matchesA = featureA["matches"];
		var zA = new ZFeature();
		zA.setupWithImage(rangeA, pointA, zoomScale);
		for(j=0; j<bestFeaturesB.length; ++j){
			var featureB = bestFeaturesB[j];
			var pointB = featureB["point"];
			var matchesB = featureB["matches"];
			var zB = new ZFeature();
			zB.setupWithImage(rangeB, pointB, zoomScale);
			var score = ZFeature.compareScore(zA, zB, rangeA,rangeB);
			// var match = {"A":featureA, "B":featureB, "score": score};
			// matchesA.push(match);
			// matchesB.push(match);
			cost[i][j] = score;
		}
		console.log("  => "+i+" / "+bestFeaturesA.length);
	}

	console.log(cost);
	// convert from finding the MINIMIZED COST to finding the MAXIMIZED COST
	var info = Code.info2DArray(cost);
	var max = info["max"];
	var min = info["min"];
	var range = info["range"];
	for(i=0; i<bestFeaturesA.length; ++i){
		for(j=0; j<bestFeaturesB.length; ++j){
			cost[i][j] = max - cost[i][j];
		}
	}
	console.log("minimizing .........");

	// for(i=0; i<bestFeaturesA.length; ++i){
	// 	var featureA = bestFeaturesA[i];
	// 	var pointA = featureA["point"];
	// 	var matchesA = featureA["matches"];
	// 	for()
	// 	cost[i][j] = 
	// }
	// replace missings with 

	//Code.array2DtoString(cost);
	var result = Code.minimizedAssignmentProblem(cost);
	var edges = result["edges"];
	var cost = result["cost"];
	var sizeN = edges.length;
	var matches = [];
	console.log(bestFeaturesA.length,bestFeaturesB.length);
	for(var i=0; i<sizeN; ++i){
		var I = edges[i][0];
		var J = edges[i][1];
		console.log(i+": "+I+" => "+J);
		if(I>=bestFeaturesA.length || J>=bestFeaturesB.length){
			console.log("outside range .. donot use");
		}else{
			var featureA = bestFeaturesA[I];
			var pointA = featureA["point"];
			var featureB = bestFeaturesB[J];
			var pointB = featureB["point"];
			matches.push({"score":0, "pointA":pointA, "pointB":pointB});
		}
	}
	matches = matches.sort(function(a,b){
		return a["score"] < b["score"] ? -1 : 1
		//return a["score"] < b["score"] ? 1 : -1
	})
//	matches = Code.copyArray(matches, 0, 50);
	this.drawMatches(matches, 0,0, 400,0);
	


return;


	// compare points
	var rangeA = new AreaMap.Range(imageMatrixA,imageMatrixA.width(),imageMatrixA.height(), 10,10);
	var rangeB = new AreaMap.Range(imageMatrixB,imageMatrixB.width(),imageMatrixB.height(), 10,10);
	var scores = [];
	var i, j, k;

var zoomScale = 0.5;

// bestUniqueFeaturesA = R3D.bestUniqueFeatureList(bestFeaturesA, rangeA, bestFeaturesB, rangeB);
// bestUniqueFeaturesB = R3D.bestUniqueFeatureList(bestFeaturesB, rangeB, bestFeaturesA, rangeA);


// bestFeaturesA = Code.copyArray(bestFeaturesA,0,100);
// bestFeaturesB = Code.copyArray(bestFeaturesB,0,100);

// bestUniqueFeatures = R3D.bestUniqueFeatureList(bestFeaturesA, rangeA, bestFeaturesB, rangeB);
// bestUniqueFeaturesA = bestUniqueFeatures["A"];
// bestUniqueFeaturesB = bestUniqueFeatures["B"];

// // in own image = faster
bestUniqueFeatures = R3D.bestUniqueFeatureList(bestFeaturesA, rangeA);
bestUniqueFeaturesA = bestUniqueFeatures["A"];
bestUniqueFeatures = R3D.bestUniqueFeatureList(bestFeaturesB, rangeB);
bestUniqueFeaturesB = bestUniqueFeatures["A"];

console.log(bestUniqueFeaturesA.length);
console.log(bestUniqueFeaturesB.length);
console.log(bestUniqueFeaturesA);

// drop half
bestUniqueFeaturesA = Code.copyArray(bestUniqueFeaturesA,0,Math.round(bestUniqueFeaturesA.length*0.75));
bestUniqueFeaturesB = Code.copyArray(bestUniqueFeaturesB,0,Math.round(bestUniqueFeaturesB.length*0.75));

this.drawAround(bestUniqueFeaturesA, 0,0, "point");
this.drawAround(bestUniqueFeaturesB, 400,0, "point");
//bestUniqueFeaturesA = Code.copyArray(bestUniqueFeaturesA,0,100);
//bestUniqueFeaturesB = Code.copyArray(bestUniqueFeaturesB,0,100);



//return;

// BEST UNIQUE FEATURES SHOULD ALSO BE UNIQUE AMONG THE SEPARATE IMAGES -- or ONLY check opposite images ? -- or do same image then separate image separately

/*
var x = "x = [";
var list = bestUniqueFeaturesB;
for(i=0; i<list.length; ++i){
	x = x + " "+list[i]["score"];
}
x = x + "];";
console.log("\n"+x+"\n");
*/
/*
plot(x,"r-*");
plot(y,"b-*"");
*/


var dropThreshold = 0.001;
// 0.0001 too low
// 0.001

/*
var uA = bestUniqueFeaturesA[0];
var uB = bestUniqueFeaturesA[bestUniqueFeaturesA.length-1];
var scoreMaxA = uA["score"];
var scoreMinA = uB["score"];
var scoreRangeA = scoreMaxA - scoreMinA;
var minScoreA = scoreMinA + scoreRangeA*dropThreshold;

var uA = bestUniqueFeaturesB[0];
var uB = bestUniqueFeaturesB[bestUniqueFeaturesB.length-1];
var scoreMaxB = uA["score"];
var scoreMinB = uB["score"];
var scoreRangeB = scoreMaxB - scoreMinB;
var minScoreB = scoreMinB + scoreRangeB*dropThreshold;


// TODO: ONLY DROP ITEMS UNDER BOTTOM 50% OF MAX/MIN SCORE (excluding inf)
// while(bestUniqueFeaturesA.length>100){
// 	bestUniqueFeaturesA.pop();
// }
// while(bestUniqueFeaturesB.length>100){
// 	bestUniqueFeaturesB.pop();
// }
while(bestUniqueFeaturesA.length>0){
	var last = bestUniqueFeaturesA[bestUniqueFeaturesA.length-1];
	if(last["score"]<minScoreA){
		bestUniqueFeaturesA.pop();
	}else{
		break;
	}
}

while(bestUniqueFeaturesB.length>0){
	var last = bestUniqueFeaturesB[bestUniqueFeaturesB.length-1];
	if(last["score"]<minScoreB){
		bestUniqueFeaturesB.pop();
	}else{
		break;
	}
}
*/

// console.log(bestUniqueFeaturesA.length);
// console.log(bestUniqueFeaturesB.length);
// //bestUniqueFeaturesB = R3D.bestUniqueFeatureList(bestFeaturesB, rangeB);

// this.drawAround(bestUniqueFeaturesA, 0,0, "point");
// this.drawAround(bestUniqueFeaturesB, 400,0, "point");



//console.log(bestUniqueFeaturesA);

// var uniqueFeaturesA = [];
// for(i=0; i<list.length; ++i){
// 	var point = list[i];
// 	var feature = {};
// 	feature["point"] = point;
// 	feature["uniqueScore"] = null;
// 	uniqueFeaturesA.push(feature);
// }

// 	for(i=0; i<uniqueFeaturesA.length; ++i){
// 		var pointA = uniqueFeaturesA[i];
// 		var featureA = new ZFeature();
// 		featureA.setupWithImage(rangeA, pointA, zoomScale);
// 		uniqueFeaturesA = 
// 		for(j=i+1; j<list.length; ++j){
// 			var pointB = uniqueFeaturesA[j];
// 			var featureB = new ZFeature();
// 			featureB.setupWithImage(rangeA, pointB, zoomScale);
// 			var score = ZFeature.calculateUniqueness(featureA,featureB, rangeA, rangeA);
// 			//featureA.uniqueness();
// 			uniqueScore = featureA["uniqueScore"];
// 			uniqueScore = 
// 			featureA["uniqueScore"] = score;
// 			//console.log("unique?:"+score);
// 		}
// 		break;
// 	}


// return;


	console.log("START");
// TODO: only retain the top top match, remove dups
// TRIM OUT ITEMS THAT HAVE LOTS OF DISPARATE MATCHES (not unique) -- many matches and scores of top mathches are within % of eachother
// TRY ZOOMING OUT MORE ?

bestUniqueFeatures = bestUniqueFeaturesA;
for(i=0; i<bestUniqueFeatures.length; ++i){
	var unique = bestUniqueFeatures[i];
	unique["matches"] = [];
}
bestUniqueFeatures = bestUniqueFeaturesB;
for(i=0; i<bestUniqueFeatures.length; ++i){
	var unique = bestUniqueFeatures[i];
	unique["matches"] = [];
}

var globalMatches = [];
var zoomScale = 0.5;
	for(i=0; i<bestUniqueFeaturesA.length; ++i){
		var uniqueA = bestUniqueFeaturesA[i];
		var pointA = uniqueA["point"];
		var featureA = new ZFeature();
		featureA.setupWithImage(rangeA, pointA, zoomScale);
		for(j=0; j<bestUniqueFeaturesB.length; ++j){
			var uniqueB = bestUniqueFeaturesB[j];
			//console.log(uniqueB)
			var pointB = uniqueB["point"];
			var featureB = new ZFeature();
			featureB.setupWithImage(rangeB, pointB, zoomScale);
			var score = ZFeature.compareScore(featureA, featureB, rangeA,rangeB);
			var match = {};
				match["keep"] = true;
				match["score"] = score;
				match["A"] = uniqueA;
				match["B"] = uniqueB;
				uniqueA["matches"].push(match);
				uniqueB["matches"].push(match);
				globalMatches.push(match);
//			scores.push({"score":score, "pointA":pointA, "pointB":pointB});
			// if(j>10){
			// 	break;
			// }
		}
		//console.log(i+" / "+bestFeaturesA.length);
		console.log(i+" / "+bestUniqueFeaturesA.length);
		// if(i>10){
		// 	break;
		// }
	}
	// best matches at top
	globalMatches = globalMatches.sort(function(a,b){
		return a.score < b.score ? -1 : 1;
	});

	Matching.sortMatches(bestUniqueFeaturesA);
	Matching.sortMatches(bestUniqueFeaturesB);

// var scoresA = Matching.recordLowMatches(bestUniqueFeaturesA);
// var scoresB = Matching.recordLowMatches(bestUniqueFeaturesB);



// remove items / matches where there is high-matches

var nonUniqueRemovalList = [];
Matching.recordHighMatches(bestUniqueFeaturesA, nonUniqueRemovalList);
Matching.recordHighMatches(bestUniqueFeaturesB, nonUniqueRemovalList);
console.log("removal: "+nonUniqueRemovalList.length);
console.log(nonUniqueRemovalList);
var removalFxn = function(a){
	return a === match ? true : false;
};
for(i=0; i<nonUniqueRemovalList.length; ++i){
	var item = nonUniqueRemovalList[i];
	var matches = item["matches"];
	for(j=0; j<matches.length; ++j){
		var match = matches[j];
		//console.log(match);
		// remove MATCH from all items
		Code.removeElements(nonUniqueRemovalList, removalFxn);
		Code.removeElements(nonUniqueRemovalList, removalFxn);
		// remove ITEM from self matches?
		// remove ITEM from all other items
		var other = match["A"]!==item ? match["A"] : match["B"];
		var otherMatches = other["matches"];
		Code.removeElements( otherMatches, function(a){
			return (a["A"] === item || a["B"] === item) ? true : false;
		});
		// REMOVE FROM GLOBAL MATCH LIST
		Code.removeElements(nonUniqueRemovalList, removalFxn);
	}
	// froms self ?
	Code.emptyArray(matches);
}





/*
	for(i=0; i<bestUniqueFeaturesA.length; ++i){
		var uniqueA = bestUniqueFeaturesA[i];
		var matches = uniqueA["matches"];
		if(matches && matches.length>0){
			var minScore = matches[0]["score"];
			var maxScore = matches[matches.length-1]["score"];
			var rangeScore = maxScore - minScore;
			//var score10 = matches[9]["score"];
			var score10 = matches[3]["score"];
			var percent = (minScore - score10)/score10;
				percent = Math.abs(percent);
			console.log(i,maxScore, minScore, rangeScore, score10, percent);
			//console.log(matches);
			if(percent<0.9){ // different enough
				var match = matches[0];
				var score = match["score"];
				var uniqueA = match["A"];
				var uniqueB = match["B"];
				var pointA = uniqueA["point"];
				var pointB = uniqueB["point"];
				var score = {"score":score, "pointA":pointA, "pointB":pointB};
				scoresA.push(score);
				match["keep"] = true;
			}else{
				//match["keep"] = false;
				nonUniqueRemovalList[]
			}
		}
	}
*/
console.log("globalMatches: "+globalMatches.length); // 19460 ~ 140 matches per item
// order matches, go down list matching best features:
var totalMatchCount = 0;
var completeMatches = [];
var scores = [];
for(i=0; i<globalMatches.length; ++i){
	var match = globalMatches[i];
	var itemA = match["A"];
	var itemB = match["B"];
	var bestA = itemA["bestMatch"];
	var bestB = itemB["bestMatch"];
//	if(!bestA && !bestB){
		itemA["bestMatch"] = match;
		itemB["bestMatch"] = match;
		var pointA = itemA["point"];
		var pointB = itemB["point"];
		var score = {"score":score, "pointA":pointA, "pointB":pointB, "match":match};
		scores.push(score);
		++totalMatchCount;
//	}
	if(totalMatchCount>2000){
		break;
	}
}




/*
var scores = [];
for(i=0; i<scoresA.length; ++i){
	var score = scoresA[i];
	var match = score["match"];
	if(match["keep"]){
		scores.push(score);
	}
}

for(i=0; i<scoresB.length; ++i){
	var score = scoresB[i];
	var match = score["match"];
	if(match["keep"]){
		scores.push(score);
	}
}
console.log("matches:"+scores.length);
*/


	scores = scores.sort(function(a,b){
		return a.score < b.score ? -1 : 1;
	});
	//scores = Code.copyArray(scores,0,200);
	scores = Code.copyArray(scores,0,100);
	this.drawMatches(scores, 0,0, 400,0);



	// show top matches: & visualize
	var score = scores[0];
	var match = score["match"];
	var itemA = match["A"];
	var itemB = match["B"];
	var pointA = itemA["point"];
	var pointB = itemB["point"];
	var featureA = new ZFeature();
	var featureB = new ZFeature();
	featureA.setupWithImage(rangeA, pointA, 1.0,    true);
	featureB.setupWithImage(rangeB, pointB, 1.0,    true);
	// 
	featureA.visualize(875,200, rangeA);
	featureB.visualize(875,325, rangeB);
	//this.showComparrison(testA, testB, 0,0, 300,0);

	

this.drawAround([pointA], 0,0, null, 0xFF0000FF);
this.drawAround([pointB], 400,0, null, 0xFF0000FF);



return;


	// mouse butt
	// var featurePointA = new V2D(326.5,176);
	// var featurePointB = new V2D(256,227);
	// var loc = new V2D(240,200);
	// var siz = new V2D(60,60);
	// origin
	// var featurePointA = new V2D(173,107);
	// var featurePointB = new V2D(212,46);
	// var loc = new V2D(190,25);
	// var siz = new V2D(50,50);

	// grid point -- bad
	// var featurePointA = new V2D(195,82);
	// var featurePointB = new V2D(231,36);
	// var loc = new V2D(200,10);
	// var siz = new V2D(60,60);

	// foot point
	// var featurePointA = new V2D(211,152);
	// var featurePointB = new V2D(210,135);
	// var loc = new V2D(190,110);
	// var siz = new V2D(40,40);

	// glasses corner
	// var featurePointA = new V2D(189,180);
	// var featurePointB = new V2D(169,180);
	// var loc = new V2D(140,160);
	// var siz = new V2D(60,60);

// EMPERICAL
	// MATCH FOUND 1:
	// var featurePointA = new V2D(34,162,0.00013104349268416014);
	// var featurePointB = new V2D(56.94719580396991,115.05367402314562,0.0003274267731163911);
	// var loc = new V2D(30,100);
	// var siz = new V2D(50,50);

	// MATCH FOUND 2:
	var featurePointA = new V2D(34,162);
	var featurePointB = new V2D(67.38821449115696,110.6536037232915);
	var loc = new V2D(45,100);
	var siz = new V2D(50,50);


		this.drawAround([featurePointA], 0,0);
		this.drawAround([featurePointB], 400,0);




	var rangeA = new AreaMap.Range(imageMatrixA,imageMatrixA.width(),imageMatrixA.height(), 10,10);
	var rangeB = new AreaMap.Range(imageMatrixB,imageMatrixB.width(),imageMatrixB.height(), 10,10);

	// get a feature at a point & feature at a similar point
	var featureA = new ZFeature();
	featureA.setupWithImage(rangeA, featurePointA, 1.0,    true);
	var featureB = new ZFeature();
	featureB.setupWithImage(rangeB, featurePointB, 1.0,    true);



// TEST SAD
	var score, matrix;
	matrix = null;
	var scale = 1.0;
	var sSize = 16;
		point = featurePointA;
		// rotation = -featureA._covarianceAngle;
		// matrix = new Matrix(3,3).identity();
		// matrix = Matrix.transform2DRotate(matrix,rotation);
		// matrix = Matrix.transform2DScale(matrix,scale,scale);
		//matrix = null;
	//var testA = imageMatrixA.extractRectFromFloatImage(point.x,point.y,1.0,null, sSize,sSize, matrix);
	var testA = imageMatrixA.extractRectFromFloatImage(point.x,point.y,1.0,null, sSize,sSize);
		point = featurePointB;
		// rotation = -featureB._covarianceAngle;
		// matrix = new Matrix(3,3).identity();
		// matrix = Matrix.transform2DRotate(matrix,rotation);
		// matrix = Matrix.transform2DScale(matrix,scale,scale);
		
	//var testB = imageMatrixB.extractRectFromFloatImage(point.x,point.y,1.0,null, sSize,sSize, matrix);
	var testB = imageMatrixB.extractRectFromFloatImage(point.x,point.y,1.0,null, sSize,sSize);
	//    img = range._image.extractRectFromFloatImage(point.x,point.y,1.0,2.0,   size,size, ZFeature.MatrixWithRotation(-covariance, scale, scale));
	//var score = ImageMat.SADFloatSimpleChannelsRGB(sample.red(),sample.grn(),sample.blu(),sample.width(),sample.height(), sample.red(),sample.grn(),sample.blu());
	// score = ImageMat.SADFloatSimpleChannelsRGB(testA.red(),testA.grn(),testA.blu(),testA.width(),testA.height(), testB.red(),testB.grn(),testB.blu());
	// console.log(score);

	// SHOW
	this.showComparrison(testA, testB, 0,0, 300,0);


	featureA.visualize(875,200, rangeA);
	featureB.visualize(875,325, rangeB);

	// compare features
	var score = ZFeature.compareScore(featureA, featureB, rangeA,rangeB);
	console.log("1 & 2 score: "+score);
	var score = ZFeature.compareScore(featureA, featureA, rangeA,rangeA);
	console.log("1 & 1 score: "+score);
	var score = ZFeature.compareScore(featureB, featureB, rangeB,rangeB);
	console.log("2 & 2 score: "+score);
	// get best score in area ...

	var matches = [];
	matches.push({"score":1, "pointA":featurePointA, "pointB":featurePointB});
	Matching.prototype.drawMatches(matches, 0,0, 400,0);

return;

	// go thru board
	var gridX = 1, gridY = 1;
	var gX = Math.floor(siz.x/gridX);
	var gY = Math.floor(siz.y/gridY);
	var gridSize = gX * gY;
	var grid = Code.newArrayZeros(gridSize);
	var index = 0;
	var featureX;
	var ratioSize = gridX;
	for(j=0; j<gY; ++j){
		for(i=0; i<gX; ++i){
			index = j*gX + i;
			var p = new V2D(loc.x + i*gridX, loc.y + j*gridY);
			featureX = new ZFeature();
			featureX.setupWithImage(rangeB, p, 1.0);
			score = ZFeature.compareScore(featureA, featureX, rangeA, rangeB);
			grid[index] = score;
		}
		console.log("    "+(j/gY));
	}

	// SHOW
	grid = ImageMat.getNormalFloat01(grid);
	grid = ImageMat.invertFloat01(grid);
	//grid = ImageMat.pow(grid,2);
	//grid = ImageMat.pow(grid,20);
	grid = ImageMat.pow(grid,1000);
	img = GLOBALSTAGE.getFloatRGBAsImage(grid,grid,grid, gX,gY);
	d = new DOImage(img);
	//d.matrix().scale(ratioSize);
	//d.matrix().translate(800,0);
	d.matrix().translate(400, 0);
	d.matrix().translate(loc.x, loc.y);
	d.graphics().alpha(0.70);
	GLOBALSTAGE.addChild(d);



}
Matching.dropArrayPoints = function(array, threshold, property, isLess){
	console.log("dropArrayPoints "+isLess)
	isLess = isLess!==undefined ? isLess : true;
	var i, value, len = array.length;
	var max = null;
	var min = null;
	for(i=0; i<len; ++i){
		value = array[i];
		value = value[property];
		if(min===null || min>value){
			min = value;
		}
		if(max===null || max<value){
			max = value;
		}
	}
	var range = max - min;
	var a = [];
	if(range > 0){
		var limit = min + threshold*range;
		for(i=0; i<len; ++i){
			value = array[i];
			value = value[property];
			//console.log(value+" "+(isLess?"<":">")+" "+limit);
			if( (isLess && value < limit) || (!isLess && value > limit) ){
				a.push(array[i]);
			}
		}
	}
	return a;
}

Matching.sortMatches = function(features){
	var i, feature, matches;
	for(i=0; i<features.length; ++i){
		feature = features[i];
		matches = feature["matches"];
		feature["matches"] = matches.sort(function(a,b){
			return a["score"] < b["score"] ? -1 : 1;
		});
	}
	console.log(feature["matches"])
}
Matching.recordHighMatches = function(features, highMatchList){
	var i;
	for(i=0; i<features.length; ++i){
		var feature = features[i];
		var matches = feature["matches"];
		if(matches && matches.length>1){
			var match0 = matches[0];
			var match1 = matches[1];
			var score0 = match0["score"];
			var score1 = match1["score"];
			if(score0!==0){
				var ratio = (score1-score0)/score0;
				console.log(i+": "+ratio+"    "+(score0)+" / "+score1);
				//if(ratio < 0.1){ // low differential
				if(ratio < 0.5){ // low differential
					highMatchList.push(feature);
				}
			}
		}
	}
}

Matching.recordLowMatches = function(bestUniqueFeaturesA){
	var i;
	var scoresA = [];
	for(i=0; i<bestUniqueFeaturesA.length; ++i){
		var uniqueA = bestUniqueFeaturesA[i];
		var matches = uniqueA["matches"];
		if(matches && matches.length>0){
			var minScore = matches[0]["score"];
			var maxScore = matches[matches.length-1]["score"];
			var rangeScore = maxScore - minScore;
			//var score10 = matches[9]["score"];
			var score10 = matches[3]["score"];
			//var percent = (maxScore - score10)/score10;
				var percent = (minScore - score10)/score10;
				percent = Math.abs(percent);
			console.log(i,maxScore, minScore, rangeScore, score10, percent);
			//console.log(matches);
			//if(percent<0.9){ // different enough
			if(percent<0.50){ // different enough
				var match = matches[0];
				var keep = match["keep"];
				if(keep){
					var score = match["score"];
					var uniqueA = match["A"];
					var uniqueB = match["B"];
					var pointA = uniqueA["point"];
					var pointB = uniqueB["point"];
					var score = {"score":score, "pointA":pointA, "pointB":pointB, "match":match};
					scoresA.push(score);
					//match["keep"] = true; // keep keep
				}
			}else{
				// drop all matches because of non-uniqueness:
				for(j=0; j<matches.length; ++j){
					match = matches[j];
					match["keep"] = false;
				}
			}
		}
	}
	return scoresA;
}
Matching.prototype.drawMatches = function(matches, offXA,offYA, offXB,offYB){
	if(!matches){
		return;
	}
	var i, c;
	var sca = 1.0;
	for(i=0; i<matches.length; ++i){
		var match = matches[i];
		if(!match){
			continue;
		}
		var score = match.score;
		var pA = match.pointA;
		var pB = match.pointB;
		if(pA==undefined){
			pA = match["A"].point();
			pB = match["B"].point();
			//score = match["confidence"];
			score = match["score"];
			pA = pA.copy();
			pB = pB.copy();
			pA.x *= 400;
			pA.y *= 300;
			pB.x *= 400;
			pB.y *= 300;
		}
//console.log(i+": "+score+"  @  "+pA+"  |  "+pB);
		// var percent = (i+0.0)/((count==0?1.0:count)+0.0);
		// var percem1 = 1 - percent;
		// var p = locations[i];
		//var color = Code.getColARGBFromFloat(1.0,percem1,0,percent);
		//var color = 0x66000000;
		var color = 0x9900FF00;
		
		// A
		c = new DO();
		c.graphics().setLine(2.0, color);
		c.graphics().beginPath();
		c.graphics().drawCircle((pA.x)*sca, (pA.y)*sca,  3 + i*0.0);
		c.graphics().strokeLine();
		c.graphics().endPath();
		c.matrix().translate(offXA, offYA);
		GLOBALSTAGE.addChild(c);
		// B
		c = new DO();
		c.graphics().setLine(2.0, color);
		c.graphics().beginPath();
		c.graphics().drawCircle((pB.x)*sca, (pB.y)*sca,  3 + i*0.0);
		c.graphics().strokeLine();
		c.graphics().endPath();
		c.matrix().translate(offXB, offYB);
		GLOBALSTAGE.addChild(c);
		// line
		c = new DO();
		c.graphics().setLine(1.0, color);
		c.graphics().beginPath();
		c.graphics().moveTo(offXA + pA.x, offYA + pA.y);
		c.graphics().lineTo(offXB + pB.x, offYB + pB.y);
		c.graphics().strokeLine();
		c.graphics().endPath();
		GLOBALSTAGE.addChild(c);
	}

}
Matching.prototype.drawCover = function(wid, hei){
	wid = wid !== undefined ? wid : 1000.0;
	hei = hei !== undefined ? hei : 1000.0;
	var c = new DO();
	var color = 0xBBFFFFFF;
	c.graphics().setFill(color);
	c.graphics().beginPath();
	c.graphics().drawRect(0,0, wid, hei);
	c.graphics().endPath();
	c.graphics().fill();
	//c.matrix().translate(offX,offY);
	GLOBALSTAGE.addChild(c);
}
Matching.prototype.drawAround = function(locations, offX, offY, param, colorCircle){ // RED TO BLUE
	var i, c;
	var sca = 1.0;
	var count = Math.min(locations.length-1,2000);
	//console.log("drawAround",offX,offY)
	for(i=0;i<locations.length;++i){
		var percent = (i+0.0)/((count==0?1.0:count)+0.0);
		var percem1 = 1 - percent;
		var p = locations[i];
		if(param){
			p = p[param];
		}
		c = new DO();
		var color = Code.getColARGBFromFloat(1.0,percem1,0,percent);
		if(colorCircle){
			color = colorCircle;
		}
		//var color = 0xFF000000;
		c.graphics().setLine(2.0, color);
		c.graphics().beginPath();
		c.graphics().drawCircle((p.x)*sca, (p.y)*sca,  3 + i*0.0);
		c.graphics().strokeLine();
		c.graphics().endPath();
		//c.graphics().fill();
		//c.graphics().alpha(1.0/(i+1));
			c.matrix().translate(offX,offY);
		GLOBALSTAGE.addChild(c);
		if(i>=count){
			break;
		}
	}

}
Matching._DY = 300;
Matching.prototype.showComparrison = function(imageA, imageB, invert){
	var dy = Matching._DY;
	var red, grn, blu, d;
	
	red = Code.copyArray(imageA.red());
	grn = Code.copyArray(imageA.grn());
	blu = Code.copyArray(imageA.blu());
	red = ImageMat.normalFloat01(red);
	grn = ImageMat.normalFloat01(grn);
	blu = ImageMat.normalFloat01(blu);
	if(invert){
		red = ImageMat.invertFloat01(red);
		grn = ImageMat.invertFloat01(grn);
		blu = ImageMat.invertFloat01(blu);
	}

	img = GLOBALSTAGE.getFloatRGBAsImage(red,grn,blu, imageA.width(),imageA.height());
	d = new DOImage(img);
	d.matrix().scale(1.0);
	d.matrix().translate(0, dy);
	GLOBALSTAGE.addChild(d);

	red = Code.copyArray(imageB.red());
	grn = Code.copyArray(imageB.grn());
	blu = Code.copyArray(imageB.blu());
	red = ImageMat.normalFloat01(red);
	grn = ImageMat.normalFloat01(grn);
	blu = ImageMat.normalFloat01(blu);
	if(invert){
		red = ImageMat.invertFloat01(red);
		grn = ImageMat.invertFloat01(grn);
		blu = ImageMat.invertFloat01(blu);
	}

	img = GLOBALSTAGE.getFloatRGBAsImage(red,grn,blu, imageB.width(),imageB.height());
	d = new DOImage(img);
	d.matrix().scale(1.0);
	d.matrix().translate(400, dy);
	GLOBALSTAGE.addChild(d);

	Matching._DY += 300;
}
Matching.prototype.showRansac = function(pointsA, pointsB, matrixFfwd, matrixFrev){

	var matches = [];
	for(i=0; i<pointsA.length; ++i){
		matches.push({"pointA":pointsA[i], "pointB":pointsB[i]});
	}
	// SHOW RANSAC:

	var colors = [0xFFFF0000, 0xFFFF9900, 0xFFFF6699, 0xFFFF00FF, 0xFF9966FF, 0xFF0000FF,  0xFF00FF00 ]; // R O M P B P G
	// SHOW F LINES ON EACH
	for(var k=0;k<matches.length;++k){
		var percent = k / (matches.length-1);
		
		var pointA = pointsA[k];
		var pointB = pointsB[k];
//console.log(pointA+" - "+pointB);
		pointA = new V3D(pointA.x,pointA.y,1.0);
		pointB = new V3D(pointB.x,pointB.y,1.0);
		var lineA = new V3D();
		var lineB = new V3D();

		matrixFfwd.multV3DtoV3D(lineA, pointA);
		matrixFrev.multV3DtoV3D(lineB, pointB);

		var d, v;
		var dir = new V2D();
		var org = new V2D();
		var imageWidth = 400;
		var imageHeight = 300;
		var scale = Math.sqrt(imageWidth*imageWidth + imageHeight*imageHeight); // imageWidth + imageHeight;
		//

		var color = Code.interpolateColorGradientARGB(percent, colors);
		//
		Code.lineOriginAndDirection2DFromEquation(org,dir, lineA.x,lineA.y,lineA.z);
//console.log(org+" - "+dir);
		dir.scale(scale);
		d = new DO();
		d.graphics().clear();
		d.graphics().setLine(1.0, color);
		d.graphics().beginPath();
		d.graphics().moveTo(imageWidth+org.x-dir.x,org.y-dir.y);
		d.graphics().lineTo(imageWidth+org.x+dir.x,org.y+dir.y);
		d.graphics().endPath();
		d.graphics().strokeLine();
		GLOBALSTAGE.addChild(d);
		//
		Code.lineOriginAndDirection2DFromEquation(org,dir, lineB.x,lineB.y,lineB.z);
		dir.scale(scale);
		d = new DO();
		d.graphics().clear();
		d.graphics().setLine(1.0, color);
		d.graphics().beginPath();
		d.graphics().moveTo( 0 + org.x-dir.x,org.y-dir.y);
		d.graphics().lineTo( 0 + org.x+dir.x,org.y+dir.y);
		d.graphics().endPath();
		d.graphics().strokeLine();
		GLOBALSTAGE.addChild(d);
	}
}
/*
- get initial best points
	- VISUALIZE:
		- cornerness
		- move cost
		- local disparity (value range)
		- high gradient?
		- blobness ?
		- scale peaks
		- hessian
		- hessian detector
	- best: norm(corner)*norm(move cost)*norm(local disparity)*...
- create descriptors for points
- compare descriptors to get best match
*/