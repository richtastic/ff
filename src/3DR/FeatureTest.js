                   function FeatureTest(){
	// setup display
	this._canvas = new Canvas(null,1,1,Canvas.STAGE_FIT_FILL);
	this._stage = new Stage(this._canvas, (1/5)*1000);
	this._canvas.addListeners();
	this._stage.addListeners();
	this._stage.start();
	this._canvas.addFunction(Canvas.EVENT_MOUSE_CLICK,this.handleMouseClickFxn,this);
	this._root = new DO();
//this._root.matrix().scale(1.5);
//this._root.matrix().translate(10,50);
	this._stage.root().addChild(this._root);

//this.ransacMatches();
//return;
	// load images
	var imageList = ["caseStudy1-0.jpg","caseStudy1-26.jpg"];
	//var imageList = ["snow1.png","snow2.png"];
	//var imageList = ["F_S_1_1.jpg","F_S_1_2.jpg"];
	//var imageList = ["calibration1-0.jpg","calibration1-1.jpg"];
	//var imageList = ["../../matching/images/original.png","../../matching/images/scalex.png"];
	//var imageList = ["../../matching/images/original.png","../../matching/images/scalexy.png"];
	//var imageList = ["../../matching/images/original.png","../../matching/images/scalexrotate.png"];
	//var imageList = ["../../matching/images/original.png","../../matching/images/scalexrotateskew.png"];
	//var imageList = ["catHat.jpg","catHat.jpg"];
	new ImageLoader("./images/",imageList,this,this.imagesLoadComplete).load();
}
FeatureTest.prototype.handleMouseClickFxn = function(e){
	console.log(e.x,e.y);
}
FeatureTest.prototype.imagesLoadComplete = function(o){
	this._imageSourceList = [];
	this._imageDOList = [];
	this._imageFilnameList = [];
	this._imageFeatureList = [];
	this.displayImages(o.images,o.files);
	// this.findFeatures();
	// this.displayFeatures();
	var pts = []; //  A, B, ...
	pts.push(new V3D(228,150,1.0), new V3D(685,170,1.0)); // left leg
	pts.push(new V3D(232,105,1.0), new V3D(696,106,1.0)); // body middle
	pts.push(new V3D(233,86,1.0), new V3D(699,77,1.0)); // face middle
	pts.push(new V3D(88,208,1.0), new V3D(531,194,1.0)); // left classes dot
	pts.push(new V3D(113,216,1.0), new V3D(566,212,1.0)); // left glasses black
	pts.push(new V3D(24,167,1.0), new V3D(428,138,1.0)); // lighter red
	pts.push(new V3D(191,89,1.0), new V3D(617,120,1.0)); // grid dark blue
	pts.push(new V3D(161,76,1.0), new V3D(582,107,1.0)); // grid dark red
	pts.push(new V3D(260,170,1.0), new V3D(744,183,1.0)); // base right corner
	pts.push(new V3D(41,257,1.0), new V3D(453,266,1.0)); // 4
	pts.push(new V3D(238,256,1.0), new V3D(790.5,268,1.0)); // 
	// pts.push(new V3D(,,1.0), new V3D(,,1.0));
	var i, len = pts.length;
	var str = "";
	for(i=0;i<len;i+=2){
		var v, d;
		v = pts[i+0];
		d = R3D.drawPointAt(v.x,v.y, 0x00,0x00,0xFF);
		this._root.addChild(d);
		//d.matrix().translate(j*400,0);
		v = pts[i+1];
		d = R3D.drawPointAt(v.x,v.y, 0x00,0x00,0xFF);
		this._root.addChild(d);
		

		pts[i+0].x = (pts[i+0].x-0.0)/400.0;
		pts[i+0].y = (pts[i+0].y-0.0)/300.0;
		pts[i+1].x = (pts[i+1].x-400.0)/400.0;
		pts[i+1].y = (pts[i+1].y-0.0)/300.0;
	}
	str = "\n";
	var ptsA = [];
	var ptsB = [];
	var j = 0;
	for(i=0;i<len;i+=2){
		str += "pointsA.push( new V3D("+pts[i+0].x+","+pts[i+0].y+",1.0) ); pointsB.push( new V3D("+pts[i+1].x+","+pts[i+1].y+",1.0) );\n";
		ptsA.push(new V3D(pts[i+0].x*400,pts[i+0].y*300,1.0));
		ptsB.push(new V3D(pts[i+1].x*400,pts[i+1].y*300,1.0));
		//console.log(ptsA[j]+" "+ptsB[j])
		++j;
	}
	str += "";
//	console.log(str);
this.ransacMatches(ptsA,ptsB);
}
FeatureTest.prototype.ransacMatches = function(pointsA,pointsB){
	var imageWidth=400;
	var imageHeight=300
/*
	var pointsA = [new V3D(0.47707116489607626,0.03014735217288287,1.0),new V3D(0.734346848707403,0.8095214992040373,1.0),new V3D(0.2603040983156068,0.09556285242297957,1.0),new V3D(0.8125219213824287,0.7685001105539645,1.0),new V3D(0.6162294485184842,0.2430524709830829,1.0),new V3D(0.4741021369729052,0.8758553326200259,1.0),new V3D(0.291061901001906,0.21275041842209833,1.0),new V3D(0.23699579072223143,0.8810597652018555,1.0),new V3D(0.841449375387314,0.8534438198397032,1.0),new V3D(0.48328928059227544,0.23897240659392793,1.0),new V3D(0.26969370237813,0.8050205212538243,1.0),new V3D(0.16874578735092607,0.7650981355180863,1.0),new V3D(0.8333658132469864,0.7232573027453226,1.0),new V3D(0.23350742171993474,0.22535583972273257,1.0),new V3D(0.22858989639778637,0.21857924744211815,1.0),new V3D(0.39298875369272696,0.8229518024846969,1.0),new V3D(0.7472504094410491,0.12882917176341233,1.0),new V3D(0.2118411184269057,0.03836125369593742,1.0),new V3D(0.6078734136159086,0.9299758813816021,1.0),new V3D(0.08973496529506945,0.6102118768715644,1.0),new V3D(0.2817087417692407,0.5832243870499338,1.0),new V3D(0.8026041584414461,0.9100426259878227,1.0),new V3D(0.69498304012979,0.017945994209970725,1.0),new V3D(0.8413449988945798,0.3233089367298686,1.0),new V3D(0.8037995153205907,0.2329950219100474,1.0),new V3D(0.596002370331012,0.9243663723515672,1.0),new V3D(0.36452679317370323,0.28706886279019705,1.0),new V3D(0.6156405182871729,0.1876682907968904,1.0),new V3D(0.40216833871425256,0.7216989216840936,1.0),new V3D(0.07057551089414163,0.6669293073277655,1.0),new V3D(0.8595356146235622,0.8339878803816717,1.0),new V3D(0.9702345312889119,0.30879165792267405,1.0),new V3D(0.659054335051914,0.29098441639429284,1.0),new V3D(0.3315846144156928,0.8989080233975714,1.0),new V3D(0.20184814864109288,0.6024179691473053,1.0),new V3D(0.02019607788429412,0.893115471520595,1.0),new V3D(0.9784504334160742,0.763949296895991,1.0),new V3D(0.09443261085927812,0.029533430268774422,1.0),new V3D(0.3187480465270493,0.6535930452197318,1.0),new V3D(0.9012020182120657,0.3179545704213461,1.0),new V3D(0.3960887361600314,0.9677175010731622,1.0),new V3D(0.8621130960097915,0.7972699884504567,1.0),new V3D(0.09957173830075805,0.6424024981824912,1.0),new V3D(0.18751972945194062,0.25934020337367464,1.0),new V3D(0.12471165450697633,0.7196374289546164,1.0),new V3D(0.5949469671558764,0.20061559426024977,1.0),new V3D(0.5249677135905995,0.06977357862720365,1.0),new V3D(0.9930843566504037,0.07522719891226454,1.0),new V3D(0.38071814329433706,0.8853457555059786,1.0),new V3D(0.30145458975772527,0.38075288451785805,1.0),new V3D(0.9821898956800333,0.6706866560901317,1.0),new V3D(0.08135983564723884,0.09163267253742781,1.0),new V3D(0.5828347741258674,0.8254281068223727,1.0),new V3D(0.7447442459463961,0.12305631124518186,1.0),new V3D(0.2886397418474024,0.5315810662200235,1.0),new V3D(0.18296544261056574,0.8866087200570005,1.0),new V3D(0.6068463382389289,0.17530009638718294,1.0),new V3D(0.9483376894882469,0.35984116189029486,1.0),new V3D(0.23618700634646672,0.9102345725796395,1.0),new V3D(0.09960373778004765,0.7944273249837227,1.0),new V3D(0.12726384646661157,0.04684998276654224,1.0),new V3D(0.2223425274225785,0.2103618948316977,1.0),new V3D(0.06158122541479567,0.014221379263903421,1.0),new V3D(0.04739239171935765,0.769918725745263,1.0),new V3D(0.22492040519774834,0.8297914021084898,1.0),new V3D(0.5214132359583652,0.960788750330366,1.0),new V3D(0.25096753750002854,0.6732473482900351,1.0),new V3D(0.1844735819709417,0.6830566336630345,1.0),new V3D(0.863232092276665,0.014170238804429995,1.0),new V3D(0.03772643649574608,0.07994064383811386,1.0),new V3D(0.27880130392717384,0.9839374779941549,1.0),new V3D(0.4366438765546221,0.6177111533451832,1.0),new V3D(0.10717122371145903,0.7566760974419321,1.0),new V3D(0.3084845933440718,0.136302523261779,1.0),new V3D(0.10395684744179812,0.2762189492994075,1.0),new V3D(0.11520392456785811,0.6029435983268825,1.0),new V3D(0.8653707368021902,0.7802509012087534,1.0),new V3D(0.8973799875494559,0.6703417757087716,1.0),new V3D(0.1446111587439365,0.8195079395000309,1.0),new V3D(0.47415884027419575,0.6399559969669538,1.0),new V3D(0.40488391778084226,0.6788540525858509,1.0),new V3D(0.9140375694018849,0.6854550517845268,1.0),new V3D(0.9098991104752724,0.4879229202412872,1.0),new V3D(0.12600439405495537,0.6326134279935732,1.0),new V3D(0.1276995361122694,0.7360128087361328,1.0),new V3D(0.5199147181672432,0.8339232591983767,1.0),new V3D(0.21053364547882972,0.971637895406998,1.0),new V3D(0.381847534065605,0.7164167817099856,1.0),new V3D(0.2767123770161675,0.14827437689278603,1.0),new V3D(0.05703908508773066,0.7716337215160837,1.0),new V3D(0.10037206355940696,0.7475507650648295,1.0),new V3D(0.1874327278133627,0.17744829181615168,1.0),new V3D(0.4982022666308098,0.9459209920083854,1.0),new V3D(0.1191076996701375,0.9302050922115416,1.0),new V3D(0.5048531556771235,0.7796319699309145,1.0),new V3D(0.8733885575319142,0.048971191456249646,1.0),new V3D(0.3824919914357659,0.7915118770345684,1.0),new V3D(0.14168510578363752,0.5958235786249833,1.0),new V3D(0.8593238967084474,0.8432729621421493,1.0),new V3D(0.5122334662056569,0.8842873092482146,1.0),new V3D(0.46322581558269876,0.8803097185484756,1.0),new V3D(0.8799562747622045,0.61933748157789,1.0),new V3D(0.5313810368639369,0.8969960173732346,1.0),new V3D(0.2746816232836987,0.7193572828594345,1.0),new V3D(0.6045658347847599,0.002457332051457511,1.0),new V3D(0.029279684767068534,0.11786241213969331,1.0),new V3D(0.437297386593468,0.6642472893542959,1.0),new V3D(0.0833014505473653,0.25575085918887347,1.0),new V3D(0.894816406965856,0.21668187373587025,1.0),new V3D(0.43143897785277857,0.6972368459867256,1.0),new V3D(0.870076871290765,0.7543206185198114,1.0),new V3D(0.5788706649553366,0.2282914682011023,1.0),new V3D(0.1390483057578629,0.5735722497929746,1.0),new V3D(0.6015163133616717,0.04954627405380519,1.0),new V3D(0.5360147630118736,0.9405330981508846,1.0),new V3D(0.17938805604776853,0.04309819151818454,1.0),new V3D(0.2575264882182322,0.21896253055426712,1.0),new V3D(0.0916095473787102,0.7628558689124182,1.0),new V3D(0.08401234756416702,0.7698128815642665,1.0),new V3D(0.8335939866316295,0.7519365203105609,1.0),new V3D(0.11771845945986455,0.8183883431662997,1.0),new V3D(0.040576264660438406,0.8663069650988565,1.0),new V3D(0.9833493110477518,0.7247603610897099,1.0),new V3D(0.5184232057794669,0.8124264189691291,1.0),new V3D(0.060949732757764934,0.6259088424549331,1.0),new V3D(0.09891144630778928,0.8231774161300617,1.0),];
	var pointsB = [new V3D(0.6375898147693746,0.9703586259723977,1.0),new V3D(0.44997124889204526,0.19461935653291293,1.0),new V3D(0.7867880404577008,0.9083781895200033,1.0),new V3D(0.40153421985427806,0.22574096966012203,1.0),new V3D(0.5420720404585287,0.7572788107345059,1.0),new V3D(0.6349036289809431,0.1244500623341015,1.0),new V3D(0.7693031246745679,0.787534366692678,1.0),new V3D(0.8060892198361107,0.11867594930133132,1.0),new V3D(0.3760053930585548,0.1470039978322177,1.0),new V3D(0.6388522208149147,0.7604936013219271,1.0),new V3D(0.7867035218341181,0.19223044947698392,1.0),new V3D(0.8560710757143174,0.23724817546673108,1.0),new V3D(0.3843644893310292,0.27648309369088137,1.0),new V3D(0.8111127030606008,0.7733017484669227,1.0),new V3D(0.8137511944139105,0.7821402935576681,1.0),new V3D(0.6956742742712447,0.1765855898334488,1.0),new V3D(0.45156257817625783,0.8728366802896382,1.0),new V3D(0.831269787604546,0.9582344762335453,1.0),new V3D(0.5515416557452333,0.06933005874163155,1.0),new V3D(0.9103662147501917,0.38867016431302936,1.0),new V3D(0.775287964760221,0.41821756255307674,1.0),new V3D(0.4070571407798512,0.08886755695066856,1.0),new V3D(0.4863303277743389,0.9833742302704911,1.0),new V3D(0.3797834814794654,0.6781520182893415,1.0),new V3D(0.40904638355886225,0.7708675427927949,1.0),new V3D(0.5530012166225834,0.07514039187099565,1.0),new V3D(0.7166676939529485,0.7115220991102228,1.0),new V3D(0.5378389763071424,0.8044840303221105,1.0),new V3D(0.6901179753284995,0.27651152055196004,1.0),new V3D(0.9189107822010105,0.33264927024488017,1.0),new V3D(0.36643400420797834,0.2494318408060407,1.0),new V3D(0.1639351504678454,0.6460522843815891,1.0),new V3D(0.5040750837816287,0.7091931157441059,1.0),new V3D(0.7397197348084803,0.10615909276447652,1.0),new V3D(0.8309514312374118,0.3999593785523505,1.0),new V3D(0.9552535579746076,0.10700969547763933,1.0),new V3D(0.30460505971433216,0.34048994756927964,1.0),new V3D(0.9114968829753338,0.9551948538891698,1.0),new V3D(0.7481857082121747,0.3451375746508256,1.0),new V3D(0.10138410879042814,0.08094719924834842,1.0),new V3D(0.6957875449112391,0.03009471057468237,1.0),new V3D(0.36686719859321376,0.21433913575264485,1.0),new V3D(0.9038874054862783,0.35794585858559624,1.0),new V3D(0.837144940137475,0.740815415521189,1.0),new V3D(0.883750056962784,0.3063720325753735,1.0),new V3D(0.5593398367986986,0.7949949945153423,1.0),new V3D(0.31289671695920296,0.6886740428498409,1.0),new V3D(0.19805529384086704,0.24470470842052156,1.0),new V3D(0.7017806870385139,0.10948320164231112,1.0),new V3D(0.8028558542147849,0.679573377938942,1.0),new V3D(0.0941961375074349,0.23824722485159133,1.0),new V3D(0.9099327082106455,0.9083495766923988,1.0),new V3D(0.14102561413551576,0.5794479053507432,1.0),new V3D(0.03147883690513699,0.28454337967965787,1.0),new V3D(0.2369017010431212,0.6563559961644712,1.0),new V3D(0.7403536761721823,0.2971737414292514,1.0),new V3D(0.5436590094559591,0.8260514101556281,1.0),new V3D(0.6043691186995864,0.9436243405880004,1.0),new V3D(0.5649863435790121,0.1607001463809693,1.0),new V3D(0.9030920962700145,0.2059030792283647,1.0),new V3D(0.2024610202091954,0.6898318375998106,1.0),new V3D(0.905639678664187,0.33154321236985823,1.0),new V3D(0.26755497432953324,0.7495923902927284,1.0),new V3D(0.9349378271145727,0.23015856857492845,1.0),new V3D(0.8123909359763847,0.15390975592631392,1.0),new V3D(0.6048733136427235,0.03335162672357884,1.0),new V3D(0.8980802932360494,0.936289391138986,1.0),new V3D(0.692869950252571,0.11435297720782645,1.0),new V3D(0.36984138958010243,0.9867078178978895,1.0),new V3D(0.43502188932191843,0.7593501761190505,1.0),new V3D(0.8437503909311672,0.3262218081736945,1.0),new V3D(0.704707978241592,0.4030250735120509,1.0),new V3D(0.897164643845814,0.2437009274274252,1.0),new V3D(0.8869175858164854,0.4879760679728202,1.0),new V3D(0.7397694296990681,0.8245571999009618,1.0),new V3D(0.845542351627477,0.0853073600571387,1.0),new V3D(0.8927251091525001,0.8840168568141187,1.0),new V3D(0.3410965965146766,0.11981541362931568,1.0),new V3D(0.6677221367177001,0.04406817069660235,1.0),new V3D(0.7547582761638055,0.9514923485974892,1.0),new V3D(0.690821296388383,0.3206660967713706,1.0),new V3D(0.2613141434333652,0.8004400083389926,1.0),new V3D(0.4686524092682858,0.6456243611202347,1.0),new V3D(0.8511321420092927,0.4294154845390053,1.0),new V3D(0.8869642879583307,0.24340763183679556,1.0),new V3D(0.3858911574143148,0.6677199579211771,1.0),new V3D(0.44721897357683205,0.1370618768522244,1.0),new V3D(0.7212908424014342,0.0367606558524824,1.0),new V3D(0.7676137996890375,0.8543067248329315,1.0),new V3D(0.3688430643693188,0.023698779568867085,1.0),new V3D(0.9031801829903943,0.2525814553238621,1.0),new V3D(0.9126664764703825,0.3381654190960543,1.0),new V3D(0.9139241684414924,0.004203299373046369,1.0),new V3D(0.12201718109078569,0.9150238113317172,1.0),new V3D(0.08301019662303773,0.36070762861364825,1.0),new V3D(0.6543309205181608,0.023071805090885522,1.0),new V3D(0.7532368125930478,0.23401538314919995,1.0),new V3D(0.7695004856044793,0.31635059248216035,1.0),new V3D(0.8652338272149912,0.3844319827415072,1.0),new V3D(0.38980960571458895,0.7374447020013484,1.0),new V3D(0.36974296080315733,0.015767027148511418,1.0),new V3D(0.30204528968749417,0.16227211466418973,1.0),new V3D(0.6395310523736003,0.044131684136018284,1.0),new V3D(0.777890098495242,0.2824174629646422,1.0),new V3D(0.360407503896977,0.46437241359367043,1.0),new V3D(0.39073981513166856,0.9786036593655167,1.0),new V3D(0.7564527525662192,0.2502889768910864,1.0),new V3D(0.934718956688708,0.20027830601716684,1.0),new V3D(0.8164491238323037,0.4770989216869568,1.0),new V3D(0.8564187085338607,0.25099884889913987,1.0),new V3D(0.3646377452340889,0.22645039855934807,1.0),new V3D(0.3602757596462346,0.2547435117434274,1.0),new V3D(0.5240689342926352,0.9616640137848064,1.0),new V3D(0.056813076619015135,0.6258693531022205,1.0),new V3D(0.06112877476268963,0.038969103241211084,1.0),new V3D(0.9762267647758824,0.8346015476184697,1.0),new V3D(0.21671163715681493,0.4517996845048732,1.0),new V3D(0.914302474399389,0.23758472378027762,1.0),new V3D(0.9140796047946149,0.2230221798908368,1.0),new V3D(0.8067548299080343,0.8836884036424124,1.0),new V3D(0.6883827560533919,0.05039919773129633,1.0),new V3D(0.9144002845335415,0.04666819559588438,1.0),new V3D(0.3122282029560064,0.061292008837920305,1.0),new V3D(0.18661860395531998,0.29072983855705803,1.0),new V3D(0.08459592371627624,0.56515356958614,1.0),new V3D(0.9154223908154654,0.17703200323839766,1.0),];
	// ...
Code.emptyArray(pointsA); Code.emptyArray(pointsB);
pointsA.push( new V3D(0.57,0.5,1.0) ); pointsB.push( new V3D(0.7125,0.5666666666666667,1.0) );
pointsA.push( new V3D(0.58,0.35,1.0) ); pointsB.push( new V3D(0.74,0.35333333333333333,1.0) );
pointsA.push( new V3D(0.5825,0.2866666666666667,1.0) ); pointsB.push( new V3D(0.7475,0.25666666666666665,1.0) );
pointsA.push( new V3D(0.22,0.6933333333333334,1.0) ); pointsB.push( new V3D(0.3275,0.6466666666666666,1.0) );
pointsA.push( new V3D(0.2825,0.72,1.0) ); pointsB.push( new V3D(0.415,0.7066666666666667,1.0) );
pointsA.push( new V3D(0.06,0.5566666666666666,1.0) ); pointsB.push( new V3D(0.07,0.46,1.0) );
pointsA.push( new V3D(0.4775,0.2966666666666667,1.0) ); pointsB.push( new V3D(0.5425,0.4,1.0) );
pointsA.push( new V3D(0.4025,0.25333333333333335,1.0) ); pointsB.push( new V3D(0.455,0.3566666666666667,1.0) );
pointsA.push( new V3D(0.65,0.5666666666666667,1.0) ); pointsB.push( new V3D(0.86,0.61,1.0) );
var i, len = pointsA.length;
for(i=0;i<len;++i){
	pointsA[i] = new V3D(pointsA[i].x*imageWidth,pointsA[i].y*imageHeight,1.0);
	pointsB[i] = new V3D(pointsB[i].x*imageWidth,pointsB[i].y*imageHeight,1.0);
}
*/
	//
	//var fundamental = R3D.fundamentalRANSACFromPoints(pointsA,pointsB);
	var fundamental = R3D.fundamentalMatrix(pointsA,pointsB);
	console.log(fundamental+"");

// NONLINEAR IMPROVEMENT HERE ...
	// nonlinear estimation
	var fxn, args, xVals, yVals, maxSupportCount;
maxSupportCount = pointsA.length;
	fxn = R3D.lmMinFundamentalFxn;
	args = [pointsA,pointsB];
	xVals = fundamental.toArray();
	//args = [];//[ points1.norm.normalized[0], points1.norm.normalized[1] ];
	yVals = Code.newArrayZeros(maxSupportCount*4);
	var flip = undefined;
	//var flip = true;
	Matrix.lmMinimize( fxn, args, yVals.length, xVals.length, xVals, yVals, 30, 1E-10, 1E-10, flip );

// FORCE 7-DOF HERE ...


	console.log(fundamental+"");
//imageWidth *= 2;
for(var k=0;k<pointsA.length;++k){
//for(var k=0;k<9;++k){
//for(var k=0;k<1;++k){
//for(var k=1;k<2;++k){
//for(var k=2;k<3;++k){
//for(var k=3;k<4;++k){
//for(var k=4;k<5;++k){
//for(var k=5;k<6;++k){
//for(var k=6;k<9;++k){
	var pointA = pointsA[k];
	var pointB = pointsB[k];
	var lineA = new V3D();
	var lineB = new V3D();

	var fundamentalInverse = Matrix.transpose(fundamental);
	fundamental.multV3DtoV3D(lineA, pointA);
	fundamentalInverse.multV3DtoV3D(lineB, pointB);

	var d, v;
/*
	var nrm = new V2D(lineA.x,lineA.y);
	var org = new V2D(lineA.x,lineA.y);
	var len = org.length();
	org.norm();
	org.scale(-lineA.z/len);
	// org.x *= imageWidth;
	// org.y *= imageHeight;
	var dir = new V2D(-nrm.y,nrm.x); // rotate norm - pi/2
	// dir.x *= imageWidth;
	// dir.y *= imageHeight;
	dir.norm();
*/
	var dir = new V2D();
	var org = new V2D();
	var scale = 500;
	//
	Code.lineOriginAndDirection2DFromEquation(org,dir, lineA.x,lineA.y,lineA.z);
	dir.scale(scale);
	d = new DO();
	d.graphics().clear();
	d.graphics().setLine(1.0,0xFFFF0000);
	d.graphics().beginPath();
	d.graphics().moveTo(imageWidth+org.x-dir.x,org.y-dir.y);
	d.graphics().lineTo(imageWidth+org.x+dir.x,org.y+dir.y);
	d.graphics().endPath();
	d.graphics().strokeLine();
	this._root.addChild(d);
	//
	Code.lineOriginAndDirection2DFromEquation(org,dir, lineB.x,lineB.y,lineB.z);
	dir.scale(scale);
	d = new DO();
	d.graphics().clear();
	d.graphics().setLine(1.0,0xFFFF0000);
	d.graphics().beginPath();
	d.graphics().moveTo( 0 + org.x-dir.x,org.y-dir.y);
	d.graphics().lineTo( 0 + org.x+dir.x,org.y+dir.y);
	d.graphics().endPath();
	d.graphics().strokeLine();
	this._root.addChild(d);
	//
	// d = R3D.drawPointAt(imageWidth+org.x,org.y, 0x00,0xFF,0x00);
	// this._root.addChild(d);
	d = R3D.drawPointAt(pointA.x,pointA.y, 0xFF,0x00,0x00);
	this._root.addChild(d);
	d = R3D.drawPointAt(imageWidth+pointB.x,pointB.y, 0xFF,0x00,0x00);
	this._root.addChild(d);
}
	//
// Code.lineOriginAndDirection2DFromEquation(org,dir, a,b,c);
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
var strA = "var pointsA = [";
var strB = "var pointsB = [";
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
strA += "new V3D("+featureA.x()+","+featureA.y()+",1.0),";
strB += "new V3D("+featureB.x()+","+featureB.y()+",1.0),";
	}
strA += "];\n";
strB += "];\n";
console.log("\n"+"var imageWidth="+this._imageSourceList[0].width+";\nvar imageHeight="+this._imageSourceList[0].height+"\n"+strA+"\n"+strB);
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


