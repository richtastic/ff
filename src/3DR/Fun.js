// Fun.js

/*

*) Fundamental matrix (14) [ch 10+14+15]
	A) direct reconstruction via measured points
	B) 	a) affine: plane at infinity
		b) metric: image of absolute conic
*) Image Rectification (14+15) [ch ]
*) Disparity map (14+15+16) [ch ]
*) Triangulation (15) [ch 11]
*) trifocal tensor (17) [ch 14+15]
*) repeat. [ch 17]
*) auto calibration [ch 18]
point triplets - define plane
*) () [ch ]
*) () [ch ]
*) () [ch ]
*) () [ch ]
*/



function Fun(){
	// setup display
	this._canvas = new Canvas(null,1,1,Canvas.STAGE_FIT_FILL);
	this._stage = new Stage(this._canvas, (1/5)*1000);
	this._canvas.addListeners();
	this._stage.addListeners();
	this._stage.start();
	this._root = new DO();
//this._root.matrix().translate(50,350);
	this._stage.root().addChild(this._root);
GLOBALSTAGE = this._stage;
	// load images
	// new ImageLoader("./images/",["F_S_1_1.jpg","F_S_1_2.jpg"],this,this.imagesLoadComplete).load();
	// new ImageLoader("./images/",["F_S_1_1.jpg","F_S_1_2.jpg"],this,this.imagesLoadCompleteFBasic).load();
	// new ImageLoader("./images/",["F_S_1_1.jpg","F_S_1_2.jpg"],this,this.imagesLoadCompleteHBasic).load();
	// new ImageLoader("./images/",["F_S_1_1.jpg","F_S_1_2.jpg"],this,this.imagesLoadCompleteDenseBasic).load();
	new ImageLoader("./images/",["F_S_1_1.jpg","F_S_1_2.jpg"],this,this.imagesLoadCompleteCOV).load();

	// this.experimentFR();
}
Fun.prototype.experimentFR = function(){




pointsA = [];
pointsA.push( new V2D(124.07144817327608,74.49371847555157) ); // 0
pointsA.push( new V2D(53.6786174497211,182.2261139501398) ); // 1
pointsA.push( new V2D(65.78894260147709,173.75709678605494) ); // 2
pointsA.push( new V2D(63.32769170477964,185.225753225886) ); // 3
pointsA.push( new V2D(79.97390718164036,168.77249674452725) ); // 4
pointsA.push( new V2D(92.22833437916577,184.79201937694523) ); // 5
pointsA.push( new V2D(106.27890147172796,146.45243956120453) ); // 6
pointsA.push( new V2D(99.83694195346256,157.1690956615513) ); // 7
pointsA.push( new V2D(123.72568041010041,159.73467979164224) ); // 8
pointsA.push( new V2D(108.7049142970954,165.9558402069414) ); // 9
pointsA.push( new V2D(104.11909094896585,172.89447265288524) ); // 10
pointsA.push( new V2D(105.31524133604356,185.02285579122574) ); // 11
pointsA.push( new V2D(112.64132309127632,175.51535532595315) ); // 12
pointsA.push( new V2D(120.93738046541263,171.19478826741306) ); // 13
pointsA.push( new V2D(206.72768270264072,92.72117942640975) ); // 14
pointsA.push( new V2D(224.82813549087075,86.71316119017071) ); // 15
pointsA.push( new V2D(234.2153298403521,86.00739382039642) ); // 16
pointsA.push( new V2D(139.81653860862517,136.35144084053346) ); // 17
pointsA.push( new V2D(143.30620053045374,154.59225922865937) ); // 18
pointsA.push( new V2D(129.00652301617973,170.0855069030469) ); // 19
pointsA.push( new V2D(139.22057864698468,168.23346602678728) ); // 20
pointsA.push( new V2D(135.75764820944553,188.31673554998227) ); // 21
pointsA.push( new V2D(163,174) ); // 22
pointsA.push( new V2D(172.64469903237466,185.5884290392577) ); // 23
pointsA.push( new V2D(214.12327438199154,96.27176842765952) ); // 24
pointsA.push( new V2D(217.80758706054868,103.13720477756733) ); // 25
pointsA.push( new V2D(215.27354452106556,114.75310688840706) ); // 26
pointsA.push( new V2D(236.50264658409398,95.97402202106578) ); // 27
pointsA.push( new V2D(246.15984321550556,96.83849590678012) ); // 28
pointsA.push( new V2D(190.08680412638122,179.91918598535372) ); // 29
pointsA.push( new V2D(55.76449151040693,201.96577656615378) ); // 30
pointsA.push( new V2D(7.122282750423322,306.31195369340884) ); // 31
pointsA.push( new V2D(163.01195212119814,195.6679966642117) ); // 32
pointsA.push( new V2D(276.9463007450829,81.6790509111656) ); // 33
pointsA.push( new V2D(305.0768231334464,80.13803958291554) ); // 34
pointsA.push( new V2D(309.500546519016,111.01434884333516) ); // 35
pointsA.push( new V2D(284.34131591598276,182.89864733406492) ); // 36
pointsA.push( new V2D(313.9258219505868,175.22075457064463) ); // 37
pointsA.push( new V2D(336.33817948036176,109.07724264911613) ); // 38
pointsA.push( new V2D(345.41057098701344,113.93024851548249) ); // 39
pointsA.push( new V2D(473.9351300863853,81.77786219133206) ); // 40
pointsA.push( new V2D(265.31502308673277,212.64796508079507) ); // 41
pointsA.push( new V2D(295.1490667944025,239.41144362250174) ); // 42
pointsA.push( new V2D(329.519491562991,223.65494007470636) ); // 43
pointsA.push( new V2D(326.1194389298533,229.1640231414859) ); // 44
pointsA.push( new V2D(341.84802402010814,218.5087520425228) ); // 45
pointsA.push( new V2D(341.98763398928645,226.96193283262716) ); // 46
pointsA.push( new V2D(343.20609286975485,235.11565398049734) ); // 47
pointsA.push( new V2D(367.5074162505461,203.35705573211794) ); // 48
pointsA.push( new V2D(354.2014177012099,216.0732929996594) ); // 49
pointsA.push( new V2D(353.1754434847485,231.22021283555176) ); // 50
pointsA.push( new V2D(367.56712771920877,215.92022896327646) ); // 51
pointsA.push( new V2D(325.4188301196647,240.97233868125983) ); // 52
pointsA.push( new V2D(374.8633696703315,237.15013108919985) ); // 53
pointsA.push( new V2D(361.3601276653745,294.58899114562615) ); // 54
pointsA.push( new V2D(391.5290443872368,238.88827311498608) ); // 55



pointsB = [];
pointsB.push( new V2D(57.15611075100422,167.8194156122558) ); // 0
pointsB.push( new V2D(17.678439705929208,303.4490843678847) ); // 1
pointsB.push( new V2D(34.270438801578955,290.79264661307974) ); // 2
pointsB.push( new V2D(28.68826262579513,304.7213332607078) ); // 3
pointsB.push( new V2D(53.71646830161355,285.6226585172581) ); // 4
pointsB.push( new V2D(82.0811018781,301.2934294318975) ); // 5
pointsB.push( new V2D(82.2216287839679,252.5819771883677) ); // 6
pointsB.push( new V2D(75.57360084980121,271.83402634114833) ); // 7
pointsB.push( new V2D(107.14219575539259,269.18051956928235) ); // 8
pointsB.push( new V2D(94.59125347985737,277.1294854681048) ); // 9
pointsB.push( new V2D(91.54243887929975,286.7566773160887) ); // 10
pointsB.push( new V2D(94.34749008282878,300.50869193775037) ); // 11
pointsB.push( new V2D(98.71599261887901,288.7568927470904) ); // 12
pointsB.push( new V2D(106.3545240487035,281.5867555749244) ); // 13
pointsB.push( new V2D(211.93779494983497,194.57678780745448) ); // 14
pointsB.push( new V2D(235.05348872110318,191.89342054886413) ); // 15
pointsB.push( new V2D(243.90923770899218,191.0907732897159) ); // 16
pointsB.push( new V2D(122.79603952603269,241.11269461592065) ); // 17
pointsB.push( new V2D(129.23686611123168,260.252914844986) ); // 18
pointsB.push( new V2D(115.43766785180571,275.29619362469293) ); // 19
pointsB.push( new V2D(127.46857824623089,273.801298962682) ); // 20
pointsB.push( new V2D(152.1743104857639,303.5690648378386) ); // 21
pointsB.push( new V2D(171.23136441894098,278.9008925555248) ); // 22
pointsB.push( new V2D(183.54577643587623,291.63245715717056) ); // 23
pointsB.push( new V2D(221.0094039622788,200.33866907231666) ); // 24
pointsB.push( new V2D(227.79674512746448,206.11658090457587) ); // 25
pointsB.push( new V2D(223.4129314571872,223.15833989735074) ); // 26
pointsB.push( new V2D(245.8937485388183,200.02125297748466) ); // 27
pointsB.push( new V2D(261.6217321193821,202.21117188387115) ); // 28
pointsB.push( new V2D(199.16749357021635,284.68633710439724) ); // 29
pointsB.push( new V2D(37.32064570518513,338.9904462917998) ); // 30
pointsB.push( new V2D(34.8373675086938,373.09928243241245) ); // 31
pointsB.push( new V2D(183.1509674355233,309.4605074242264) ); // 32
pointsB.push( new V2D(280.2202858672499,188.50176709689106) ); // 33
pointsB.push( new V2D(288.15924771353986,184.23334014159434) ); // 34
pointsB.push( new V2D(277.45456244929,208.56004642347781) ); // 35
pointsB.push( new V2D(258.41869529526736,253.66966734794926) ); // 36
pointsB.push( new V2D(353.0684724354431,278.03746273900475) ); // 37
pointsB.push( new V2D(366.9723776871345,215.93679494237637) ); // 38
pointsB.push( new V2D(379.3845870454907,221.81088794671962) ); // 39
pointsB.push( new V2D(378.75350538734597,179.55824883904535) ); // 40
pointsB.push( new V2D(304.74468004104887,316.3137387346434) ); // 41
pointsB.push( new V2D(358.91803058337507,340.812490394941) ); // 42
pointsB.push( new V2D(375.22922877267257,319.6473154470601) ); // 43
pointsB.push( new V2D(376.42613567863845,326.69146353329313) ); // 44
pointsB.push( new V2D(382.7158982826345,315.1451597938671) ); // 45
pointsB.push( new V2D(387.0796939169989,323.6659487556969) ); // 46
pointsB.push( new V2D(394.4034597886702,330.8914886214034) ); // 47
pointsB.push( new V2D(395.13701618014613,298.09192758402133) ); // 48
pointsB.push( new V2D(394.9473539076165,311.22198163172345) ); // 49
pointsB.push( new V2D(400.2393957683005,324.96197825286987) ); // 50
pointsB.push( new V2D(401.6414211550053,312.04673277554156) ); // 51
pointsB.push( new V2D(385.0026255890516,338.5340481878261) ); // 52
pointsB.push( new V2D(423.3685374826287,330.0129692206391) ); // 53
pointsB.push( new V2D(195.82263732324157,229.78889423882268) ); // 54
pointsB.push( new V2D(441.92403859361195,330.7585861572163) ); // 55


F = new Matrix(3,3);
F.fromArray([0.0000023678245545848546,0.00003867502607624484,-0.002579196651566079,-0.00004676657992759138,-0.000019399257901465315,0.007448482742669478,0.0067074971756327815,0.0003330894025836722,-0.9252096790491906]);

Ka = new Matrix(3,3);
Ka.fromArray([422.40150077200684,0.0022218460789078373,247.66575475267828,0,423.37197844793195,186.6065118019104,0,0,1]);

Kb = new Matrix(3,3);
Kb.fromArray([422.40150077200684,0.0022218460789078373,247.66575475267828,0,423.37197844793195,186.6065118019104,0,0,1]);

M1 = null;


/*

// parallel
pointsA = [];
pointsA.push( new V2D(63.34783485295071,6.361434024822344) ); // 0
pointsA.push( new V2D(216.8267663575341,76.3435424585099) ); // 1
pointsA.push( new V2D(209.70998114527896,86.58619893778811) ); // 2
pointsA.push( new V2D(164.21064083821182,106.59507240122345) ); // 3
pointsA.push( new V2D(184.16227036633057,95.50147705119879) ); // 4
pointsA.push( new V2D(186.4456591811256,101.69542170536745) ); // 5
pointsA.push( new V2D(180.77716838668542,134.7542903340466) ); // 6
pointsA.push( new V2D(192.55096587698134,117.81160630055757) ); // 7
pointsA.push( new V2D(194.92866988011025,125.30737247841992) ); // 8
pointsA.push( new V2D(211.90201315507468,147.67355053977525) ); // 9
pointsA.push( new V2D(235.20213062783586,151.5141894909016) ); // 10
pointsA.push( new V2D(250.289238397693,193.33429319346507) ); // 11
pointsA.push( new V2D(273.0289256737636,67.21115043944498) ); // 12
pointsA.push( new V2D(296.46874022270146,58.14608197580141) ); // 13
pointsA.push( new V2D(300.84161840861395,50.07780324389747) ); // 14
pointsA.push( new V2D(304.06724063351425,63.44499464724504) ); // 15
pointsA.push( new V2D(340.7523581668408,55.6397094047193) ); // 16
pointsA.push( new V2D(363.8877116209321,81.34717467227827) ); // 17
pointsA.push( new V2D(260.6147905327418,131.72798703016105) ); // 18
pointsA.push( new V2D(299.64767088096977,119.30670771195234) ); // 19
pointsA.push( new V2D(304.130980765686,138.0583191002982) ); // 20
pointsA.push( new V2D(267.9978322518259,157.07822435955185) ); // 21
pointsA.push( new V2D(274.41467179339,154.3353701448545) ); // 22
pointsA.push( new V2D(287.96651037113594,152.09137786659102) ); // 23
pointsA.push( new V2D(285.8952463606152,160.15567592834282) ); // 24
pointsA.push( new V2D(304.78629901703175,171.68213629038775) ); // 25
pointsA.push( new V2D(336.36066737192704,95.08702945442829) ); // 26
pointsA.push( new V2D(322.9426448412969,128.1313312249995) ); // 27
pointsA.push( new V2D(377.91752990040345,129.8584642645274) ); // 28
pointsA.push( new V2D(373.4410649325314,136.12421098845002) ); // 29
pointsA.push( new V2D(320.10862111830767,167.84597275911753) ); // 30
pointsA.push( new V2D(334.2348813961928,179.0270148102208) ); // 31
pointsA.push( new V2D(367.3674573022792,159.60289755040597) ); // 32
pointsA.push( new V2D(377.1798399778231,153.66017094237296) ); // 33
pointsA.push( new V2D(370.0442625521112,167.19305862907393) ); // 34
pointsA.push( new V2D(377.7227913735484,165.7897818593808) ); // 35
pointsA.push( new V2D(365.04950483066904,185.50735908127686) ); // 36
pointsA.push( new V2D(460.21860576931743,40.4292350390758) ); // 37
pointsA.push( new V2D(451.137796975013,52.22911494511438) ); // 38
pointsA.push( new V2D(452.91468774500356,70.76338287506472) ); // 39
pointsA.push( new V2D(458.5175930548032,52.404366691812456) ); // 40
pointsA.push( new V2D(470.9966988275676,49.51677350437964) ); // 41
pointsA.push( new V2D(462.1377398174996,65.40874944098687) ); // 42
pointsA.push( new V2D(457.4682599269314,83.89632734316308) ); // 43
pointsA.push( new V2D(474.83525222465374,61.11093912742583) ); // 44
pointsA.push( new V2D(416.7778409834954,96.46149409472382) ); // 45
pointsA.push( new V2D(401.54011112064205,183.3449352970471) ); // 46
pointsA.push( new V2D(445.6184860198466,109.65493121514531) ); // 47
pointsA.push( new V2D(441.42072299162743,172.80809110240645) ); // 48
pointsA.push( new V2D(448.6473900369529,176.5411271345574) ); // 49
pointsA.push( new V2D(455.49384222566175,183.07612890541353) ); // 50
pointsA.push( new V2D(258.6422597549763,203.5203352581618) ); // 51
pointsA.push( new V2D(287.796638535686,200.90209267151266) ); // 52
pointsA.push( new V2D(303.4994857489887,203.35081784464668) ); // 53
pointsA.push( new V2D(292.547888505004,222.53744412225495) ); // 54
pointsA.push( new V2D(288.85051161188267,232.02708278707425) ); // 55
pointsA.push( new V2D(314.1780655961487,222.71247350446865) ); // 56
pointsA.push( new V2D(303.1841052597846,224.68880330516743) ); // 57
pointsA.push( new V2D(312.55657952792103,231.0605025725822) ); // 58
pointsA.push( new V2D(266.99028345119876,238.26337885254097) ); // 59
pointsA.push( new V2D(263.48024558661587,273.1113324909013) ); // 60
pointsA.push( new V2D(306.39526436875605,282.9129905496621) ); // 61
pointsA.push( new V2D(327.19321324647836,205.44003575624777) ); // 62
pointsA.push( new V2D(326.5959005591291,211.98426979346888) ); // 63
pointsA.push( new V2D(337.05494674453314,201.7550262164066) ); // 64
pointsA.push( new V2D(339.6691947444549,208.71751412280952) ); // 65
pointsA.push( new V2D(346.25555240435256,208.18542187417896) ); // 66
pointsA.push( new V2D(321.9150284950111,228.75901856874177) ); // 67
pointsA.push( new V2D(331.9566169037543,222.60340041978674) ); // 68
pointsA.push( new V2D(344.8315621458287,215.53609742320825) ); // 69
pointsA.push( new V2D(337.00348823515156,228.15190924875822) ); // 70
pointsA.push( new V2D(353.4112851739782,197.1634693867882) ); // 71
pointsA.push( new V2D(353.8582369472661,209.50952736303105) ); // 72
pointsA.push( new V2D(370.5172126075125,192.9063483515782) ); // 73
pointsA.push( new V2D(359.7462663122772,212.80452516098083) ); // 74
pointsA.push( new V2D(350.3413448735554,229.1335757554131) ); // 75
pointsA.push( new V2D(356.10310637294816,235.95840339569244) ); // 76
pointsA.push( new V2D(375.10744781558833,214.1414225410746) ); // 77
pointsA.push( new V2D(362.3341602530238,227.21801173052617) ); // 78
pointsA.push( new V2D(343.11583668305383,247.3790954117602) ); // 79
pointsA.push( new V2D(339.7244740616161,257.18132232699077) ); // 80
pointsA.push( new V2D(330.3285867053968,260.13645364271173) ); // 81
pointsA.push( new V2D(355.1782009259645,243.35061802304222) ); // 82
pointsA.push( new V2D(376.9551666609072,237.94730338584532) ); // 83
pointsA.push( new V2D(368.2480984711265,250.16569930044494) ); // 84
pointsA.push( new V2D(351.7215190048008,260.45125428178125) ); // 85
pointsA.push( new V2D(371.03390614207945,268.42990833786735) ); // 86
pointsA.push( new V2D(375.74059340832576,279.45316420154586) ); // 87
pointsA.push( new V2D(274.7704897490269,318.3147091426097) ); // 88
pointsA.push( new V2D(314.18282422129846,298.7838418413272) ); // 89
pointsA.push( new V2D(312.9733217678267,331.2779058602153) ); // 90
pointsA.push( new V2D(328.3772441885637,299.6099657575505) ); // 91
pointsA.push( new V2D(335.0033012426762,305.20253311222484) ); // 92
pointsA.push( new V2D(354.56935990943674,287.9700918936873) ); // 93
pointsA.push( new V2D(367.36470952158646,284.971980407938) ); // 94
pointsA.push( new V2D(364.62471005604783,305.7752643604291) ); // 95
pointsA.push( new V2D(356.6961754347197,313.4849494466553) ); // 96
pointsA.push( new V2D(347.01031053149444,334.8607641875793) ); // 97
pointsA.push( new V2D(359.5185442254787,336.3652373238406) ); // 98
pointsA.push( new V2D(368.52163297876814,373.51037047492446) ); // 99
pointsA.push( new V2D(384.3257034745055,197.88254759928293) ); // 100
pointsA.push( new V2D(397.839283353395,208.2670480447263) ); // 101
pointsA.push( new V2D(393,214) ); // 102
pointsA.push( new V2D(393.25894959168636,226.26481725667787) ); // 103
pointsA.push( new V2D(386.8081995166632,236.02954752950023) ); // 104
pointsA.push( new V2D(397.19989351199445,219.69175179603008) ); // 105
pointsA.push( new V2D(404.7075071350495,214.7844901065038) ); // 106
pointsA.push( new V2D(399.7273231448973,231.2426505915335) ); // 107
pointsA.push( new V2D(411.17169784487413,206.20094792644906) ); // 108
pointsA.push( new V2D(437.9421768749368,203.83430384877013) ); // 109
pointsA.push( new V2D(409.7545718545367,219.8798643854014) ); // 110
pointsA.push( new V2D(422.00248223371796,217.51624814947664) ); // 111
pointsA.push( new V2D(426.42020604318134,229.44808363985666) ); // 112
pointsA.push( new V2D(391.84384504647704,246.98239728566895) ); // 113
pointsA.push( new V2D(387.61636199763694,253.75582105542875) ); // 114
pointsA.push( new V2D(394.64676266048554,237.87504655670926) ); // 115
pointsA.push( new V2D(378.1310453788889,263.42579304777144) ); // 116
pointsA.push( new V2D(387.218010640292,268.68871020214095) ); // 117
pointsA.push( new V2D(391.6747686470336,280.52129975395513) ); // 118
pointsA.push( new V2D(406.30194178221467,282.4480337316951) ); // 119
pointsA.push( new V2D(412.19652904253724,239.5224740861918) ); // 120
pointsA.push( new V2D(410.3205359792757,245.79027161928167) ); // 121
pointsA.push( new V2D(424.2996189267241,236.30788733064358) ); // 122
pointsA.push( new V2D(412.60717797452037,262.2147846352937) ); // 123
pointsA.push( new V2D(425.084905512501,260.8884672539442) ); // 124
pointsA.push( new V2D(415.0354824244117,278.1084399469382) ); // 125
pointsA.push( new V2D(425.01016431507225,271.90049937373743) ); // 126
pointsA.push( new V2D(420.37587158415585,282.7336355363842) ); // 127
pointsA.push( new V2D(436.01820485857723,264.3811704599908) ); // 128
pointsA.push( new V2D(445.162365431332,196.67412953045775) ); // 129
pointsA.push( new V2D(447.323666783537,217.1305697903316) ); // 130
pointsA.push( new V2D(453.9728223934752,218.9161385713792) ); // 131
pointsA.push( new V2D(446.51613600745713,227.04766234560825) ); // 132
pointsA.push( new V2D(455.12287341674187,229.4616177091987) ); // 133
pointsA.push( new V2D(463.1399586348874,232.14466776579658) ); // 134
pointsA.push( new V2D(469.2234947970009,224.8850545242099) ); // 135
pointsA.push( new V2D(454.60141040033494,237.93307393413463) ); // 136
pointsA.push( new V2D(462.50606019552316,241.75649275039754) ); // 137
pointsA.push( new V2D(451.1284439842076,264.4581525469694) ); // 138
pointsA.push( new V2D(449.44482990425917,271.62023265121996) ); // 139
pointsA.push( new V2D(441.24836931876035,274.0102798539091) ); // 140
pointsA.push( new V2D(474.6927248507123,237.88200426289328) ); // 141
pointsA.push( new V2D(478.10954040789267,260.52885567264855) ); // 142
pointsA.push( new V2D(392.8307100947482,288.94343838250023) ); // 143
pointsA.push( new V2D(387.9761056612949,304.89293075025336) ); // 144
pointsA.push( new V2D(403.9440932826389,288.73590393348815) ); // 145
pointsA.push( new V2D(402.7791334219611,299.00390873364995) ); // 146
pointsA.push( new V2D(401.42131888538546,314.369397099731) ); // 147
pointsA.push( new V2D(399.0123559973211,326.17742111079156) ); // 148
pointsA.push( new V2D(408.97786555004257,323.69506819994956) ); // 149
pointsA.push( new V2D(412.3538054194949,306.3840438291665) ); // 150
pointsA.push( new V2D(420.9594289128016,302.1627986137493) ); // 151
pointsA.push( new V2D(431.6767037399759,296.7593396754185) ); // 152
pointsA.push( new V2D(434.498243807545,305.18704749234155) ); // 153
pointsA.push( new V2D(420.3395669736109,313.6103095315101) ); // 154
pointsA.push( new V2D(415.15712981238016,328.8968352213385) ); // 155
pointsA.push( new V2D(425.00969583809666,330.6161044506255) ); // 156
pointsA.push( new V2D(432.74501759957303,318.7747380202957) ); // 157
pointsA.push( new V2D(440.5111610007342,320.01240102222783) ); // 158
pointsA.push( new V2D(436.98161224095713,326.8787998620225) ); // 159
pointsA.push( new V2D(402.9930328282023,333.88623223462315) ); // 160
pointsA.push( new V2D(406.7486122290377,341.6348082787798) ); // 161
pointsA.push( new V2D(418.13219469285883,341.7975197225056) ); // 162
pointsA.push( new V2D(445.8109798742686,292.51005402570075) ); // 163
pointsA.push( new V2D(448.90799813104684,285.30476073661816) ); // 164
pointsA.push( new V2D(460.06980995902376,288.25941960647145) ); // 165
pointsA.push( new V2D(469.1287612767787,292.42965369921205) ); // 166
pointsA.push( new V2D(463.0488822132714,298.20721412152585) ); // 167
pointsA.push( new V2D(448.15115527361195,310.8563700312101) ); // 168
pointsA.push( new V2D(459.0542123705948,320.06885347482324) ); // 169
pointsA.push( new V2D(458.58946087983816,327.33238570897845) ); // 170
pointsA.push( new V2D(452.8558616145355,333.3229171296038) ); // 171
pointsA.push( new V2D(456.03866441005937,344.4144239118518) ); // 172
pointsA.push( new V2D(462.2845516670672,335.01457730497134) ); // 173



pointsB = [];
pointsB.push( new V2D(8.307974056009718,32.70911095767665) ); // 0
pointsB.push( new V2D(201.00138856122385,106.41106392443972) ); // 1
pointsB.push( new V2D(196.11982198914646,116.4856507525418) ); // 2
pointsB.push( new V2D(152.84573102924094,137.08632292355557) ); // 3
pointsB.push( new V2D(174.20477851942923,124.00222151811242) ); // 4
pointsB.push( new V2D(172.72209885707832,131.26130713170642) ); // 5
pointsB.push( new V2D(170.3585067431448,165.65759615299206) ); // 6
pointsB.push( new V2D(182.8057039927982,148.8023236906914) ); // 7
pointsB.push( new V2D(183.7360822292391,156.41169455594255) ); // 8
pointsB.push( new V2D(214.86943011357891,178.51645660298323) ); // 9
pointsB.push( new V2D(241.25749995838925,181.60343447459826) ); // 10
pointsB.push( new V2D(248.38227280935766,224.14119611738812) ); // 11
pointsB.push( new V2D(250.866169324628,98.43791055199704) ); // 12
pointsB.push( new V2D(269.77522625246155,90.09847935549338) ); // 13
pointsB.push( new V2D(274.40621145001523,81.08395303793871) ); // 14
pointsB.push( new V2D(277.6069199443288,94.92701893948554) ); // 15
pointsB.push( new V2D(312.90277867875886,88.53263397517959) ); // 16
pointsB.push( new V2D(467.82986289007346,93.50296648946487) ); // 17
pointsB.push( new V2D(257.0430460036573,162.58758031767172) ); // 18
pointsB.push( new V2D(297.5790584201555,148.50432259526318) ); // 19
pointsB.push( new V2D(317.7736291950204,167.60497505411718) ); // 20
pointsB.push( new V2D(270.07569570346186,187.22681613720204) ); // 21
pointsB.push( new V2D(276.0525885054238,183.6259485647818) ); // 22
pointsB.push( new V2D(285.7998490604537,181.10814159029638) ); // 23
pointsB.push( new V2D(288.27022919875407,190.6422489455758) ); // 24
pointsB.push( new V2D(316.55757596659663,202.384316238482) ); // 25
pointsB.push( new V2D(250.5495839393042,133.23765499446765) ); // 26
pointsB.push( new V2D(328.3121949175788,155.9451244482118) ); // 27
pointsB.push( new V2D(366.78497803274854,159.28811198227743) ); // 28
pointsB.push( new V2D(364,166) ); // 29
pointsB.push( new V2D(323.04970997023736,197.1783658011931) ); // 30
pointsB.push( new V2D(330.4675936600177,207.14179590922626) ); // 31
pointsB.push( new V2D(357.7163726305406,188.71784653552706) ); // 32
pointsB.push( new V2D(370.32707363693686,181.75363553871992) ); // 33
pointsB.push( new V2D(358.22118155876973,195.5848559555293) ); // 34
pointsB.push( new V2D(368.08511204535233,192.94611746864413) ); // 35
pointsB.push( new V2D(362.086015885555,212.33150234860923) ); // 36
pointsB.push( new V2D(416.3328731614334,75.58557586193619) ); // 37
pointsB.push( new V2D(408.8043957954633,87.17259533592356) ); // 38
pointsB.push( new V2D(409.8938818102991,103.51614714077601) ); // 39
pointsB.push( new V2D(415.2487963776418,86.5654243342905) ); // 40
pointsB.push( new V2D(427.2812193200535,84.63457905666365) ); // 41
pointsB.push( new V2D(418.8111373563994,98.33727129458282) ); // 42
pointsB.push( new V2D(414.6328997084058,115.35140454794188) ); // 43
pointsB.push( new V2D(431.9711000631602,94.79432107316387) ); // 44
pointsB.push( new V2D(375.0507867312806,127.63281416269993) ); // 45
pointsB.push( new V2D(397.46242047812626,210.16784223378644) ); // 46
pointsB.push( new V2D(443.1134482644052,137.6176597116962) ); // 47
pointsB.push( new V2D(443.92369586762345,198.495703338091) ); // 48
pointsB.push( new V2D(450.29059805880695,202.710846907127) ); // 49
pointsB.push( new V2D(456.0766545291624,208.29586568791737) ); // 50
pointsB.push( new V2D(259.2024696712949,233.83441106088617) ); // 51
pointsB.push( new V2D(297.37851322536284,230.70518259132456) ); // 52
pointsB.push( new V2D(314.683430588224,234.00018081681714) ); // 53
pointsB.push( new V2D(301.86062419253875,252.1053652424328) ); // 54
pointsB.push( new V2D(301.6398529202826,261.29612984867924) ); // 55
pointsB.push( new V2D(323.03223864438354,251.51036720788176) ); // 56
pointsB.push( new V2D(313.8648868380779,253.98829512821123) ); // 57
pointsB.push( new V2D(323.76641505435407,260.0060736750733) ); // 58
pointsB.push( new V2D(280.6505487517068,269.93197647541814) ); // 59
pointsB.push( new V2D(289.4513325970723,306.35512064768074) ); // 60
pointsB.push( new V2D(336,314) ); // 61
pointsB.push( new V2D(330.42714044443454,233.70597525081462) ); // 62
pointsB.push( new V2D(331.39830285207876,240.34611320737017) ); // 63
pointsB.push( new V2D(338.3435408832675,228.97423698789797) ); // 64
pointsB.push( new V2D(342.92825714032824,236.17032954292338) ); // 65
pointsB.push( new V2D(349.61009397632927,235.67776597478175) ); // 66
pointsB.push( new V2D(332.7232831187125,257.2768428951001) ); // 67
pointsB.push( new V2D(339.8564641454278,250.65790926344383) ); // 68
pointsB.push( new V2D(349.99653735311296,242.9852513024583) ); // 69
pointsB.push( new V2D(346.8704047852789,256.21975260838457) ); // 70
pointsB.push( new V2D(351.6224976788294,224.27126048629222) ); // 71
pointsB.push( new V2D(356.71898577115826,236.7770751291777) ); // 72
pointsB.push( new V2D(370.8493161498419,219.57423637418594) ); // 73
pointsB.push( new V2D(363.7727620763979,239.7551361459125) ); // 74
pointsB.push( new V2D(362.58771632925624,257.2606534878071) ); // 75
pointsB.push( new V2D(367.97783563073705,262.73556527722866) ); // 76
pointsB.push( new V2D(378.8671775537611,240.98569918338853) ); // 77
pointsB.push( new V2D(370.4196391258761,253.82530292383524) ); // 78
pointsB.push( new V2D(359.25613994712904,275.1651820609663) ); // 79
pointsB.push( new V2D(358.6355015555699,285.2435688357351) ); // 80
pointsB.push( new V2D(349.85188779679584,289.11982913212637) ); // 81
pointsB.push( new V2D(369.7451836061225,270.42360129650984) ); // 82
pointsB.push( new V2D(389.4987445450107,264.36877027457984) ); // 83
pointsB.push( new V2D(385.87873853128923,276.715396025653) ); // 84
pointsB.push( new V2D(371.39537744569753,288.1301426495762) ); // 85
pointsB.push( new V2D(393.7855333709389,294.5984427108763) ); // 86
pointsB.push( new V2D(399.8735602487377,305.45368515636704) ); // 87
pointsB.push( new V2D(316.6578731041661,354.20746753698637) ); // 88
pointsB.push( new V2D(352.6284567349163,329.72443921234463) ); // 89
pointsB.push( new V2D(359.10516699542245,363.7875754583122) ); // 90
pointsB.push( new V2D(362.4642190650746,329.4693286392194) ); // 91
pointsB.push( new V2D(370.3167999039969,334.9721830989502) ); // 92
pointsB.push( new V2D(383.4508838660755,315.52085167959603) ); // 93
pointsB.push( new V2D(394.04953902315253,311.3128747752731) ); // 94
pointsB.push( new V2D(399.12788120293186,333.6947385800838) ); // 95
pointsB.push( new V2D(394.4358892317232,341.8084949752535) ); // 96
pointsB.push( new V2D(394.12587038104743,364.2530794847424) ); // 97
pointsB.push( new V2D(405.8091458715277,364.8739363184786) ); // 98
pointsB.push( new V2D(3.984375053638432,255.68429687938576) ); // 99
pointsB.push( new V2D(382.4971165335781,224.5520139005592) ); // 100
pointsB.push( new V2D(400.6061804528861,234.11748769494037) ); // 101
pointsB.push( new V2D(396.04408955746675,239.09941462715466) ); // 102
pointsB.push( new V2D(400.5885443487713,251.93931404599658) ); // 103
pointsB.push( new V2D(396.9844188402274,261.74169803723237) ); // 104
pointsB.push( new V2D(400.92790927787036,243.70373669797777) ); // 105
pointsB.push( new V2D(409.0516203473527,240.39298040041507) ); // 106
pointsB.push( new V2D(407.2939099643737,256.76967136989134) ); // 107
pointsB.push( new V2D(414.6342822299051,230.94421748757713) ); // 108
pointsB.push( new V2D(441.8513386443574,229.27494025119387) ); // 109
pointsB.push( new V2D(413.93555510710337,244.98957251443076) ); // 110
pointsB.push( new V2D(426.1940122941338,241.1705790130602) ); // 111
pointsB.push( new V2D(431.8507984008505,252.62833861177117) ); // 112
pointsB.push( new V2D(405.9656449804775,272.0738834665594) ); // 113
pointsB.push( new V2D(406.02555589222385,279.04043461207266) ); // 114
pointsB.push( new V2D(405.2268258677851,262.90950565821277) ); // 115
pointsB.push( new V2D(398.8691350005242,289.6711889757598) ); // 116
pointsB.push( new V2D(411.26659633388624,294.513441973087) ); // 117
pointsB.push( new V2D(416.24938692702534,304.8553536317099) ); // 118
pointsB.push( new V2D(430.5665034596834,306.42958163471394) ); // 119
pointsB.push( new V2D(421.5192910333099,262.8814463283535) ); // 120
pointsB.push( new V2D(422.49698504500253,270.38415127371456) ); // 121
pointsB.push( new V2D(433.36167478762417,260.1852418457674) ); // 122
pointsB.push( new V2D(432.08185769220324,285.2698296654572) ); // 123
pointsB.push( new V2D(444.72973450944676,283.98057968424246) ); // 124
pointsB.push( new V2D(438.5523859845156,302.08748534046805) ); // 125
pointsB.push( new V2D(446.2481738476417,294.7689075866941) ); // 126
pointsB.push( new V2D(444.70404564352106,306.2378612839946) ); // 127
pointsB.push( new V2D(452.8323601724503,286.5665356024678) ); // 128
pointsB.push( new V2D(449.43804358300656,221.46177372443623) ); // 129
pointsB.push( new V2D(452.617276641084,240.36344824910014) ); // 130
pointsB.push( new V2D(459.77142297674493,242.52484596096477) ); // 131
pointsB.push( new V2D(449.95711328336444,250.71585216617842) ); // 132
pointsB.push( new V2D(462.23118470208505,252.03732453263416) ); // 133
pointsB.push( new V2D(469.6303936184767,254.42999706144246) ); // 134
pointsB.push( new V2D(472.8011112704045,247.03950326200098) ); // 135
pointsB.push( new V2D(463.26392413156,259.8805392172456) ); // 136
pointsB.push( new V2D(469.9195099781033,262.81087684912734) ); // 137
pointsB.push( new V2D(465.9104352648721,286.15551049636895) ); // 138
pointsB.push( new V2D(466.56209463249274,293.07413532308846) ); // 139
pointsB.push( new V2D(460.6538993751651,296.6249441667368) ); // 140
pointsB.push( new V2D(479.2498125879832,259.57901796179056) ); // 141
pointsB.push( new V2D(497.6742199548818,281.22981416988085) ); // 142
pointsB.push( new V2D(419.06939109836827,313.94562770661145) ); // 143
pointsB.push( new V2D(420.3728105606851,330.09016899034754) ); // 144
pointsB.push( new V2D(429.1510579939663,313.00290361574844) ); // 145
pointsB.push( new V2D(432.9524150734467,323.54959107064263) ); // 146
pointsB.push( new V2D(436.12343728281104,339.33727663714757) ); // 147
pointsB.push( new V2D(438.6050651203225,351.4337105568631) ); // 148
pointsB.push( new V2D(445.988805782948,347.4412436579326) ); // 149
pointsB.push( new V2D(443.1223658012256,330.1717202525089) ); // 150
pointsB.push( new V2D(450.0169364654009,325.3505080979048) ); // 151
pointsB.push( new V2D(458.4545389667597,319.1551521700879) ); // 152
pointsB.push( new V2D(463.7516942543085,327.3700892608233) ); // 153
pointsB.push( new V2D(452.8519060269639,336.0156550664852) ); // 154
pointsB.push( new V2D(454.07344311877875,353.1186023969781) ); // 155
pointsB.push( new V2D(463.33593465784145,353.58131206901635) ); // 156
pointsB.push( new V2D(465.7531558090334,340.553991511617) ); // 157
pointsB.push( new V2D(473.8582945782035,341.24064736439914) ); // 158
pointsB.push( new V2D(472.58451255019764,348.94346379620043) ); // 159
pointsB.push( new V2D(444.12758443407813,357.57738976472706) ); // 160
pointsB.push( new V2D(454.075478717984,367.6874511138921) ); // 161
pointsB.push( new V2D(461.2358046420476,365.62157568422924) ); // 162
pointsB.push( new V2D(471.1488829999803,313.7652240453477) ); // 163
pointsB.push( new V2D(471.09624772937667,307.02666670559506) ); // 164
pointsB.push( new V2D(490.23434005291756,309.55569360388876) ); // 165
pointsB.push( new V2D(498.82949790452733,312.95712542210475) ); // 166
pointsB.push( new V2D(495.73487006465285,320.7039183576847) ); // 167
pointsB.push( new V2D(477.391312242569,332.0487414238252) ); // 168
pointsB.push( new V2D(489.8427526925151,339.972148081191) ); // 169
pointsB.push( new V2D(491.05716187453874,347.2082325947331) ); // 170
pointsB.push( new V2D(488.53895021195626,353.45286768151414) ); // 171
pointsB.push( new V2D(494.774740927356,364.10486101026163) ); // 172
pointsB.push( new V2D(496.94115447258775,354.2242693111611) ); // 173


F = new Matrix(3,3);
F.fromArray([-4.201205375345293e-7,0.00001636007905302558,-0.0024761873052657176,-0.000019039415596149927,-0.000003082210158484584,-0.0017872192841672562,0.0035185273017613867,0.003650564287208743,-0.126712103368466]);

Ka = new Matrix(3,3);
Ka.fromArray([422.40150077200684,0.0022218460789078373,247.66575475267828,0,423.37197844793195,186.6065118019104,0,0,1]);

Kb = new Matrix(3,3);
Kb.fromArray([422.40150077200684,0.0022218460789078373,247.66575475267828,0,423.37197844793195,186.6065118019104,0,0,1]);

M1 = null;

*/



	
	KaInv = Matrix.inverse(Ka);
	KbInv = Matrix.inverse(Kb);
	var I = new Matrix(4,4).identity();
	var P = R3D.transformFromFundamental(pointsA, pointsB, F, Ka,KaInv, Kb,KbInv);
	console.log(P);


	var result = R3D.transformCameraExtrinsicNonlinear(P, pointsA,pointsB, Ka,KaInv, Kb,KbInv);
	console.log(result);


throw "..."

	var A = Matrix.inverse(P);
	var origin = A.multV3DtoV3D(new V3D());
	var dirX = A.multV3DtoV3D(new V3D(1,0,0));
	var dirY = A.multV3DtoV3D(new V3D(0,1,0));
	var dirZ = A.multV3DtoV3D(new V3D(0,0,1));


var xList = [];
var yList = [];
var zList = [];
for(var i=0; i<pointsA.length; ++i){
	var a = pointsA[i];
	var b = pointsB[i];
	var c = R3D.triangulatePointDLT(a,b, I,P, KaInv, KbInv);
	xList.push(c.x);
	yList.push(c.y);
	zList.push(c.z);
}

var str = "\n";
str = str + Code.printArray(xList, "x");
str = str + Code.printArray(yList, "y");
str = str + Code.printArray(zList, "z");
str = str + "\n";


str = str + "hold off;\n";
str = str + "scatter3 (x(:), y(:), z(:), [], \"r\", \"filled\");\n";

str = str + "hold on;\n";

str = str + "scatter3 ("+0+", "+0+", "+0+", [], \"k\", \"\");\n";
str = str + "scatter3 (1, 0, 0, [], \"m\", \"\");\n";
str = str + "scatter3 (0, 1, 0, [], \"g\", \"\");\n";
str = str + "scatter3 (0, 0, 1, [], \"b\", \"\");\n";

str = str + "scatter3 ("+origin.x+", "+origin.y+", "+origin.z+", [], \"k\", \"filled\");\n";
str = str + "scatter3 ("+dirX.x+", "+dirX.y+", "+dirX.z+", [], \"m\", \"filled\");\n";
str = str + "scatter3 ("+dirY.x+", "+dirY.y+", "+dirY.z+", [], \"g\", \"filled\");\n";
str = str + "scatter3 ("+dirZ.x+", "+dirZ.y+", "+dirZ.z+", [], \"b\", \"filled\");\n";
str = str + "axis(\"equal\");";



str = str + "\n";


console.log(str);

	throw "experimentFR";
}
Fun.prototype.imagesLoadCompleteCOV = function(o){

	var pointCount = 200;
	var rangeX = 6;
	var rangeY = 2;
	var offsetX = 2;
	var offsetY = 5;
	var rangeXToY = rangeX/rangeY;
	var angleX = Code.radians(25);

	var points2D = [];

	for(var i=0; i<pointCount; ++i){
		
		// ring
		var ratio = 0.75; // skinny
		// var ratio = 0.5;
		// var ratio = 0.25; // thick
		var distance = ratio + Math.random()*(1.0-ratio);
		var angle = Math.random()*Math.PI2;
		var point = new V2D(distance,0);
		point.rotate(angle);
		point.scale(rangeX,rangeY);
		point.scale(2);
		point.rotate(angleX);
		point.add(offsetX,offsetY);
		points2D.push(point);
		
		// // flat disk
		// var distance = Math.random();
		// var angle = Math.random()*Math.PI2;
		// var point = new V2D(distance,0);
		// point.rotate(angle);
		// point.scale(rangeX,rangeY);
		// point.scale(2);
		// point.rotate(angleX);
		// point.add(offsetX,offsetY);
		// points2D.push(point);
		

		
		// // normal distribution
		// var dx = Code.randomNormal(rangeX);
		// var dy = Code.randomNormal(rangeY);
		// var point = new V2D(dx,dy);
		// point.rotate(angleX);
		// point.add(offsetX,offsetY);
		// points2D.push(point);
		
	}


	var x = 400;
	var y = 300;
	var scale = 10.0;


		var d = new DO();
		d.graphics().setLine(2.0, 0xFF0000FF);
		d.graphics().beginPath();
		d.graphics().moveTo(-100*scale,    -0*scale);
		d.graphics().lineTo( 100*scale,    -0*scale);
		d.graphics().moveTo(   0*scale,  100*scale);
		d.graphics().lineTo(   0*scale, -100*scale);
		d.graphics().strokeLine();
		d.graphics().endPath();
		d.matrix().translate(x,y);
		GLOBALSTAGE.addChild(d);

	for(var i=0; i<points2D.length; ++i){
		var point = points2D[i];

		var size = 3;

		var d = new DO();
		d.graphics().setLine(size, 0xFFFF0000);
		d.graphics().beginPath();
		d.graphics().drawCircle(point.x*scale, -point.y*scale, size);
		d.graphics().strokeLine();
		d.graphics().endPath();
		d.matrix().translate(x,y);
		GLOBALSTAGE.addChild(d);

	}


	var info = Code.covariance2DInfo(points2D);
	console.log(info);

	var cov = info["matrix"];
	var com = info["center"];

	var angleX = info["angleX"];
	var sigmaX = info["sigmaX"];
	var sigmaY = info["sigmaY"];

	console.log(sigmaX,sigmaY);
	console.log(com+"");

	console.log(" "+cov+"");

	// draw summary

		var d = new DO();
		d.graphics().setLine(2.0, 0xFF009900);
		d.graphics().beginPath();
		d.graphics().moveTo((com.x-10)*scale, -(com.y+ 0)*scale);
		d.graphics().lineTo((com.x+10)*scale, -(com.y+ 0)*scale);
		d.graphics().moveTo((com.x+ 0)*scale, -(com.y-10)*scale);
		d.graphics().lineTo((com.x+ 0)*scale, -(com.y+10)*scale);
		d.graphics().strokeLine();
		d.graphics().endPath();
		d.matrix().translate(x,y);
		GLOBALSTAGE.addChild(d);



		var d = new DO();
		d.graphics().setLine(2.0, 0xFF000000);
		d.graphics().beginPath();
		d.graphics().drawEllipse(0,0, 2*sigmaX*scale,2*sigmaY*scale);
		// d.graphics().lineTo((com.x+10)*scale, (com.y+ 0)*scale);
		// d.graphics().moveTo((com.x+ 0)*scale, (com.y-10)*scale);
		// d.graphics().lineTo((com.x+ 0)*scale, (com.y+10)*scale);
		d.graphics().strokeLine();
		d.graphics().endPath();
		d.matrix().rotate(-angleX);
		d.matrix().translate(com.x*scale,-com.y*scale);
		d.matrix().translate(x,y);
		GLOBALSTAGE.addChild(d);


	// undo transform to manalhabalis 
		var reverse = new Matrix2D();
		reverse.identity();
		reverse.translate(-com.x,-com.y);
		reverse.rotate(-angleX);
		reverse.scale(1.0/sigmaX,1.0/sigmaY);
		var forward = reverse.copy();
			forward.inverse();


	var info = Code.normalizedPoints2D(points2D);
	var normalized2D = info["normalized"];
	var forward = info["reverse"];
	var reverse = info["forward"];

	for(var i=0; i<points2D.length; ++i){
		var point = points2D[i];
			point = reverse.multV2DtoV2D(point);
			// point = forward.multV2DtoV2D(point);
		points2D[i] = point;
	}
	// redraw

	x += 500;

		var d = new DO();
		d.graphics().setLine(2.0, 0xFF0000FF);
		d.graphics().beginPath();
		d.graphics().moveTo(-100*scale,    -0*scale);
		d.graphics().lineTo( 100*scale,    -0*scale);
		d.graphics().moveTo(   0*scale,  100*scale);
		d.graphics().lineTo(   0*scale, -100*scale);
		d.graphics().strokeLine();
		d.graphics().endPath();
		d.matrix().translate(x,y);
		GLOBALSTAGE.addChild(d);

	for(var i=0; i<points2D.length; ++i){
		var point = points2D[i];

		var size = 3;

		var d = new DO();
		d.graphics().setLine(size, 0xFFFF0000);
		d.graphics().beginPath();
		d.graphics().drawCircle(point.x*scale, -point.y*scale, size);
		d.graphics().strokeLine();
		d.graphics().endPath();
		d.matrix().translate(x,y);
		GLOBALSTAGE.addChild(d);

	}


}





Fun.prototype.imagesLoadCompleteDenseBasic = function(o){
	var images = o.images;

	GLOBALSTAGE.root().matrix().scale(2.0);
	
	// var noisePercent = 0.0;
	// var noisePercent = 0.25;
	var noisePercent = 0.50;
	
	var imageMatrixes = [];
	for(var i=0; i<images.length; ++i){
		var image = images[i];
		var imageFloat = GLOBALSTAGE.getImageAsFloatRGB(image);
		var imageMatrix = new ImageMat(imageFloat["width"],imageFloat["height"], imageFloat["red"], imageFloat["grn"], imageFloat["blu"]);
		imageMatrixes.push(imageMatrix);
	}
	var imageMatrixA = imageMatrixes[0];
	var imageMatrixB = imageMatrixes[1];

	var putativePointsA = [ new V3D(0.235,0.075), new V3D(0.587,0.085), new V3D(0.836,0.0336), new V3D(0.430,0.440), new V3D(0.795,0.330), new V3D(0.805,0.430), new V3D(0.215,0.555), new V3D(0.880,0.580), new V3D(0.750,0.670), new V3D(0.235,0.733) ];
	var putativePointsB = [ new V3D(0.175,0.113), new V3D(0.525,0.150), new V3D(0.770,0.115), new V3D(0.370,0.490), new V3D(0.730,0.395), new V3D(0.740,0.495), new V3D(0.150,0.600), new V3D(0.820,0.635), new V3D(0.695,0.730), new V3D(0.170,0.790) ];
	
	var putatives = [putativePointsA, putativePointsB];
	for(var i=0; i<putatives.length; ++i){
		var putativePoints = putatives[i];
		var imageMatrix = imageMatrixes[i];
		for(var j=0; j<putativePoints.length; ++j){
			var p = putativePoints[j];
			putativePoints[j] = new V2D(p.x,p.y);
			putativePoints[j].scale( imageMatrix.width(), imageMatrix.height() );
		}
	}
	var pointsA = putativePointsA;
	var pointsB = putativePointsB;

	var noiseCount = Math.floor(noisePercent*pointsA.length);
	console.log("noiseCount: "+noiseCount)
	for(var i=0; i<noiseCount; ++i){

		var pointA = new V2D(Math.random()*imageMatrixA.width(), Math.random()*imageMatrixA.height());
		var pointB = new V2D(Math.random()*imageMatrixB.width(), Math.random()*imageMatrixB.height());

		pointsA.push(pointA);
		pointsB.push(pointB);
	}
	console.log(pointsA);
	console.log(pointsB);


	var affine = R3D.affineBasicFromPoints2D(pointsA,pointsB);
	console.log(affine)


// throw "?";
R3D.findLocalSupportingCornerMatches(imageMatrixA,imageMatrixB,  pointsA,pointsB);//imageCornerDensityPercent);

throw "JERE"


	// PREDICT POINTS ON GRID:

	var sizePercent = 0.10;
	var sizeX = Math.floor(imageMatrixA.width()*sizePercent);
	var sizeY = Math.floor(imageMatrixA.height()*sizePercent);
	var sizeCountX = imageMatrixA.width()/sizeX;
	var sizeCountY = imageMatrixA.height()/sizeY;
	var samplesA = [];

	for(var j=0; j<sizeCountY; ++j){
		for(var i=0; i<sizeCountX; ++i){
			var pointA = new V2D(i*sizeX, j*sizeY);
			samplesA.push(pointA);
		}
	}
	var v = new V3D();
	var samplesB = [];
	for(var i=0; i<samplesA.length; ++i){
		var pointA = samplesA[i];
		v.set(pointA.x,pointA.y,1.0);
		var u = H.multV3DtoV3D(v);
		// console.log(u+"")
			u.homo();
		// console.log(u+"")
		var pointB = new V2D(u.x,u.y);
		// var pointB = H.multV2DtoV2D(pointA);
		samplesB.push(pointB);
	}


	// Fun.colorPairPoints(imageMatrixA,pointsA, imageMatrixB,pointsB);
	Fun.colorPairPoints(imageMatrixA,samplesA, imageMatrixB,samplesB);



	GLOBALSTAGE.root().matrix().scale(2.0);
	throw "imagesLoadCompleteHBasic"

}

Fun.prototype.imagesLoadCompleteAffineBasic = function(o){

	var origin = new V2D(5,3);
	var radius = 10.0;
	// var errorPercent = 0.1;
	var errorPercent = 1.0;
	var pointCount = 10;


	var transform = new Matrix2D();
		transform.rotate(Code.radians(30.0));
		transform.translate(-1,-1);

	// source points
	var pointsA = [];
	for(var i=0; i<pointCount; ++i){
		var p = new V2D();
			p.x = (Math.random()-0.5)*radius*2.0;
			p.y = (Math.random()-0.5)*radius*2.0;
		p.add(origin);
		pointsA.push(p);
	}

	// apply actual transform
	var pointsB = [];
	for(var i=0; i<pointCount; ++i){
		var error = radius*errorPercent;
		var a = pointsA[i];
		var b = transform.multV2DtoV2D(a);
			p.x += (Math.random()-0.5)*error*2.0;
			p.y += (Math.random()-0.5)*error*2.0;
		pointsB.push(b);
	}

	// find average :


	/*
affineMatrixExact
	*/

	var affine = Code.averagePointsAffine2D(pointsA,pointsB);
	console.log(affine);
	console.log(affine+"");
	var inverse = affine.copy();
		inverse.inverse();



	// show source points:
var displayScale = 10.0;
var displayCenter = new V2D(400,300);
	for(var i=0; i<pointsA.length; ++i){
		var a = pointsA[i];
		var d = new DO();
		d.graphics().clear();
		d.graphics().setLine(4.0, 0xFFFF0000);
		d.graphics().beginPath();
		d.graphics().drawCircle(a.x*displayScale,-a.y*displayScale, 5);
		d.graphics().endPath();
		d.graphics().strokeLine();
		d.matrix().translate(displayCenter.x,displayCenter.y);
		GLOBALSTAGE.addChild(d);

		var b = affine.multV2DtoV2D(a);
		var d = new DO();
		d.graphics().clear();
		d.graphics().setLine(6.0, 0xFFFF00FF);
		d.graphics().beginPath();
		d.graphics().drawCircle(b.x*displayScale,-b.y*displayScale, 5);
		d.graphics().endPath();
		d.graphics().strokeLine();
		d.matrix().translate(displayCenter.x,displayCenter.y);
		GLOBALSTAGE.addChild(d);
	}


	for(var i=0; i<pointsB.length; ++i){
		var b = pointsB[i];
		var d = new DO();
		d.graphics().clear();
		d.graphics().setLine(2.0, 0xFF0000FF);
		d.graphics().beginPath();
		d.graphics().drawCircle(b.x*displayScale,-b.y*displayScale, 5);
		d.graphics().endPath();
		d.graphics().strokeLine();
		d.matrix().translate(displayCenter.x,displayCenter.y);
		GLOBALSTAGE.addChild(d);


		var a = inverse.multV2DtoV2D(b);
		var d = new DO();
		d.graphics().clear();
		d.graphics().setLine(6.0, 0xFF00CCCC);
		d.graphics().beginPath();
		d.graphics().drawCircle(a.x*displayScale,-a.y*displayScale, 5);
		d.graphics().endPath();
		d.graphics().strokeLine();
		d.matrix().translate(displayCenter.x,displayCenter.y);
		GLOBALSTAGE.addChild(d);
	}

	/*
	var images = o.images;
	
	// var noisePercent = 0.0;
	var noisePercent = 0.25;
	// var noisePercent = 0.0;
	
	var imageMatrixes = [];
	for(var i=0; i<images.length; ++i){
		var image = images[i];
		var imageFloat = GLOBALSTAGE.getImageAsFloatRGB(image);
		var imageMatrix = new ImageMat(imageFloat["width"],imageFloat["height"], imageFloat["red"], imageFloat["grn"], imageFloat["blu"]);
		imageMatrixes.push(imageMatrix);
	}
	var imageMatrixA = imageMatrixes[0];
	var imageMatrixB = imageMatrixes[1];

	var putativePointsA = [ new V3D(0.235,0.075), new V3D(0.587,0.085), new V3D(0.836,0.0336), new V3D(0.430,0.440), new V3D(0.795,0.330), new V3D(0.805,0.430), new V3D(0.215,0.555), new V3D(0.880,0.580), new V3D(0.750,0.670), new V3D(0.235,0.733) ];
	var putativePointsB = [ new V3D(0.175,0.113), new V3D(0.525,0.150), new V3D(0.770,0.115), new V3D(0.370,0.490), new V3D(0.730,0.395), new V3D(0.740,0.495), new V3D(0.150,0.600), new V3D(0.820,0.635), new V3D(0.695,0.730), new V3D(0.170,0.790) ];
	
	var putatives = [putativePointsA, putativePointsB];
	for(var i=0; i<putatives.length; ++i){
		var putativePoints = putatives[i];
		var imageMatrix = imageMatrixes[i];
		for(var j=0; j<putativePoints.length; ++j){
			var p = putativePoints[j];
			putativePoints[j] = new V2D(p.x,p.y);
			putativePoints[j].scale( imageMatrix.width(), imageMatrix.height() );
		}
	}
	var pointsA = putativePointsA;
	var pointsB = putativePointsB;

	var noiseCount = Math.floor(noisePercent*pointsA.length);
	console.log("noiseCount: "+noiseCount)
	for(var i=0; i<noiseCount; ++i){

		var pointA = new V2D(Math.random()*imageMatrixA.width(), Math.random()*imageMatrixA.height());
		var pointB = new V2D(Math.random()*imageMatrixB.width(), Math.random()*imageMatrixB.height());

		pointsA.push(pointA);
		pointsB.push(pointB);
	}
	console.log(pointsA);
	console.log(pointsB);
	var H = R3D.homographyMatrixFromUnnormalized(pointsA,pointsB);
	console.log("H: \n "+H);
	// ...


	// PREDICT POINTS ON GRID:

	var sizePercent = 0.10;
	var sizeX = Math.floor(imageMatrixA.width()*sizePercent);
	var sizeY = Math.floor(imageMatrixA.height()*sizePercent);
	var sizeCountX = imageMatrixA.width()/sizeX;
	var sizeCountY = imageMatrixA.height()/sizeY;
	var samplesA = [];

	for(var j=0; j<sizeCountY; ++j){
		for(var i=0; i<sizeCountX; ++i){
			var pointA = new V2D(i*sizeX, j*sizeY);
			samplesA.push(pointA);
		}
	}
	var v = new V3D();
	var samplesB = [];
	for(var i=0; i<samplesA.length; ++i){
		var pointA = samplesA[i];
		v.set(pointA.x,pointA.y,1.0);
		var u = H.multV3DtoV3D(v);
		// console.log(u+"")
			u.homo();
		// console.log(u+"")
		var pointB = new V2D(u.x,u.y);
		// var pointB = H.multV2DtoV2D(pointA);
		samplesB.push(pointB);
	}


	// Fun.colorPairPoints(imageMatrixA,pointsA, imageMatrixB,pointsB);
	Fun.colorPairPoints(imageMatrixA,samplesA, imageMatrixB,samplesB);



	GLOBALSTAGE.root().matrix().scale(2.0);


	*/



	throw "imagesLoadCompleteAffineBasic"

}


Fun.prototype.imagesLoadCompleteHBasic = function(o){
	var images = o.images;
	
	// var noisePercent = 0.0;
	var noisePercent = 0.25;
	// var noisePercent = 0.0;
	
	var imageMatrixes = [];
	for(var i=0; i<images.length; ++i){
		var image = images[i];
		var imageFloat = GLOBALSTAGE.getImageAsFloatRGB(image);
		var imageMatrix = new ImageMat(imageFloat["width"],imageFloat["height"], imageFloat["red"], imageFloat["grn"], imageFloat["blu"]);
		imageMatrixes.push(imageMatrix);
	}
	var imageMatrixA = imageMatrixes[0];
	var imageMatrixB = imageMatrixes[1];

	var putativePointsA = [ new V3D(0.235,0.075), new V3D(0.587,0.085), new V3D(0.836,0.0336), new V3D(0.430,0.440), new V3D(0.795,0.330), new V3D(0.805,0.430), new V3D(0.215,0.555), new V3D(0.880,0.580), new V3D(0.750,0.670), new V3D(0.235,0.733) ];
	var putativePointsB = [ new V3D(0.175,0.113), new V3D(0.525,0.150), new V3D(0.770,0.115), new V3D(0.370,0.490), new V3D(0.730,0.395), new V3D(0.740,0.495), new V3D(0.150,0.600), new V3D(0.820,0.635), new V3D(0.695,0.730), new V3D(0.170,0.790) ];
	
	var putatives = [putativePointsA, putativePointsB];
	for(var i=0; i<putatives.length; ++i){
		var putativePoints = putatives[i];
		var imageMatrix = imageMatrixes[i];
		for(var j=0; j<putativePoints.length; ++j){
			var p = putativePoints[j];
			putativePoints[j] = new V2D(p.x,p.y);
			putativePoints[j].scale( imageMatrix.width(), imageMatrix.height() );
		}
	}
	var pointsA = putativePointsA;
	var pointsB = putativePointsB;

	var noiseCount = Math.floor(noisePercent*pointsA.length);
	console.log("noiseCount: "+noiseCount)
	for(var i=0; i<noiseCount; ++i){

		var pointA = new V2D(Math.random()*imageMatrixA.width(), Math.random()*imageMatrixA.height());
		var pointB = new V2D(Math.random()*imageMatrixB.width(), Math.random()*imageMatrixB.height());

		pointsA.push(pointA);
		pointsB.push(pointB);
	}
	console.log(pointsA);
	console.log(pointsB);
	var H = R3D.homographyMatrixFromUnnormalized(pointsA,pointsB);
	console.log("H: \n "+H);
	// ...


	// PREDICT POINTS ON GRID:

	var sizePercent = 0.10;
	var sizeX = Math.floor(imageMatrixA.width()*sizePercent);
	var sizeY = Math.floor(imageMatrixA.height()*sizePercent);
	var sizeCountX = imageMatrixA.width()/sizeX;
	var sizeCountY = imageMatrixA.height()/sizeY;
	var samplesA = [];

	for(var j=0; j<sizeCountY; ++j){
		for(var i=0; i<sizeCountX; ++i){
			var pointA = new V2D(i*sizeX, j*sizeY);
			samplesA.push(pointA);
		}
	}
	var v = new V3D();
	var samplesB = [];
	for(var i=0; i<samplesA.length; ++i){
		var pointA = samplesA[i];
		v.set(pointA.x,pointA.y,1.0);
		var u = H.multV3DtoV3D(v);
		// console.log(u+"")
			u.homo();
		// console.log(u+"")
		var pointB = new V2D(u.x,u.y);
		// var pointB = H.multV2DtoV2D(pointA);
		samplesB.push(pointB);
	}


	// Fun.colorPairPoints(imageMatrixA,pointsA, imageMatrixB,pointsB);
	Fun.colorPairPoints(imageMatrixA,samplesA, imageMatrixB,samplesB);



	GLOBALSTAGE.root().matrix().scale(2.0);
	throw "imagesLoadCompleteHBasic"

}


Fun.colorPairPoints = function(imageMatrixA,pointsA,imageMatrixB,pointsB){

	var imageMatrixes = [imageMatrixA,imageMatrixB];
	// show images:
	var x = 0;
	var y = 0;
	var alp = 0.75;
	for(var i=0; i<imageMatrixes.length; ++i){
		var imageMatrix = imageMatrixes[i];
		var img = imageMatrix;
			img = GLOBALSTAGE.getFloatRGBAsImage(img.red(),img.grn(),img.blu(), img.width(),img.height());
		var d = new DOImage(img);
		d.graphics().alpha(alp);
		d.matrix().translate(x,y);
		GLOBALSTAGE.addChild(d);


		x += imageMatrix.width();
	}



	var color0 = new V3D(1,0,0);
	var color1 = new V3D(0,1,0);
	var color2 = new V3D(0,0,1);
	// var color3 = new V3D(1,1,1);
	var color3 = new V3D(0,0,0);
	var colors = [color0,color1,color2,color3];

	var imageScale = 1.0;
// console.log(pointsA,pointsB)
	for(var k=0; k<pointsA.length; ++k){
	// break;
		var pointA = pointsA[k];
		var pointB = pointsB[k];

		// var affine = matched["affine"];
		// do optimized sub-pixel matching:
		// var info = R3D.subpixelHaystack(imageA,imageB, pointA,pointB, affine);

		var p = pointA.copy();
		var q = pointB.copy();

		var px = (p.x/imageMatrixA.width());
		var py = (p.y/imageMatrixA.height());
		var qx = 1 - px;
		var qy = 1 - py;
		var p0 = qx*qy;
		var p1 = px*qy;
		var p2 = qx*py;
		var p3 = px*py;
		// console.log(p0,p1,p2,p3, p0+p1+p2+p3);
		var color = V3D.average(colors, [p0,p1,p2,p3]);
		color = Code.getColARGBFromFloat(1.0,color.x,color.y,color.z);
		// color = 0xFFFF0000;
		// p.scale(imageScale);
		// q.scale(imageScale);
		q.add(imageMatrixA.width(),0);

		var d = new DO();
			d.graphics().clear();
			// d.graphics().setLine(2.0, 0xFFFF0000);
			d.graphics().setLine(3.0, color);
			d.graphics().beginPath();
			d.graphics().drawCircle(p.x,p.y, 5);
			d.graphics().endPath();
			d.graphics().strokeLine();
			// 
			// d.graphics().setLine(2.0, 0xFF0000FF);
			d.graphics().setLine(3.0, color);
			d.graphics().beginPath();
			d.graphics().drawCircle(q.x,q.y, 5);
			d.graphics().endPath();
			d.graphics().strokeLine();
			// 
			// d.graphics().setLine(1.0, 0x66FF00FF);
			// d.graphics().beginPath();
			// d.graphics().moveTo(p.x,p.y);
			// d.graphics().lineTo(q.x,q.y);
			// d.graphics().endPath();
			// d.graphics().strokeLine();
		GLOBALSTAGE.addChild(d);

	}

	// var samples = Code.randomSampleRepeatsParallelArrays([pointsA,pointsB], 100);
	// samplesA = samples[0];
	// samplesB = samples[1];
	// console.log(pointsA.length)
	// console.log("R3D.showFundamental");
	// R3D.showFundamental(samplesA, samplesB, F, Finv, GLOBALSTAGE, imageMatrixA,imageMatrixB);

} // if false




Fun.prototype.imagesLoadCompleteFBasic = function(o){
	var images = o.images;
	
	
	var imageMatrixes = [];
	for(var i=0; i<images.length; ++i){
		var image = images[i];
		var imageFloat = GLOBALSTAGE.getImageAsFloatRGB(image);
		var imageMatrix = new ImageMat(imageFloat["width"],imageFloat["height"], imageFloat["red"], imageFloat["grn"], imageFloat["blu"]);
		imageMatrixes.push(imageMatrix);
	}

	// data



	var putativePointsA = [ new V3D(0.235,0.075), new V3D(0.587,0.085), new V3D(0.836,0.0336), new V3D(0.430,0.440), new V3D(0.795,0.330), new V3D(0.805,0.430), new V3D(0.215,0.555), new V3D(0.880,0.580), new V3D(0.750,0.670), new V3D(0.235,0.733) ];
	var putativePointsB = [ new V3D(0.175,0.113), new V3D(0.525,0.150), new V3D(0.770,0.115), new V3D(0.370,0.490), new V3D(0.730,0.395), new V3D(0.740,0.495), new V3D(0.150,0.600), new V3D(0.820,0.635), new V3D(0.695,0.730), new V3D(0.170,0.790) ];
	
	var putatives = [putativePointsA, putativePointsB];
	for(var i=0; i<putatives.length; ++i){
		var putativePoints = putatives[i];
		var imageMatrix = imageMatrixes[i];
		for(var j=0; j<putativePoints.length; ++j){
			putativePoints[j].scale( imageMatrix.width(), imageMatrix.height() );
		}
	}


	var pointsA = putativePointsA;
	var pointsB = putativePointsB;


	// A - 0.75
	var pointsANorm = Code.normalizedPoints2D(pointsA);
	var pointsBNorm = Code.normalizedPoints2D(pointsB);
	var F = R3D.fundamentalMatrix(pointsANorm["normalized"],pointsBNorm["normalized"]);
		F = R3D.fundamentalMatrixNonlinear(F, pointsANorm["normalized"],pointsBNorm["normalized"]);
	F = Matrix.mult(F, pointsANorm["forward"]);
	F = Matrix.mult(Matrix.transpose(pointsBNorm["forward"]), F); // FORWARD ?

/*
	// B - 0.85
	var F = R3D.fundamentalMatrix(pointsA,pointsB); // OK 
		F = R3D.fundamentalMatrixNonlinear(F, pointsA, pointsB);
*/
	

	/*
	var pointsANorm = R3D.calculateNormalizedPoints([pointsA]);
	var pointsBNorm = R3D.calculateNormalizedPoints([pointsB]);
	var F = R3D.fundamentalMatrix(pointsANorm.normalized[0],pointsBNorm.normalized[0]);
	F = Matrix.mult(F, pointsANorm.forward[0]);
	F = Matrix.mult(Matrix.transpose(pointsBNorm.forward[0]), F); // FORWARD ?
	*/

/*
R3D.fundamentalFromUnnormalized = function(pointsA,pointsB, skipNonlinear){
	skipNonlinear = skipNonlinear!==undefined ? skipNonlinear : false;
	var pointsANorm = R3D.calculateNormalizedPoints([pointsA]);
	var pointsBNorm = R3D.calculateNormalizedPoints([pointsB]);
	var F = R3D.fundamentalMatrix(pointsANorm.normalized[0],pointsBNorm.normalized[0]);
	F = Matrix.mult(F, pointsANorm.forward[0]);
	F = Matrix.mult(Matrix.transpose(pointsBNorm.forward[0]), F); // FORWARD ?
	if(!skipNonlinear){
		F = R3D.fundamentalMatrixNonlinear(F, pointsA, pointsB);
	}
	return F;
}
*/


// this increases error ?
F = R3D.fundamentalMatrixNonlinear(F, pointsA, pointsB);



	var Finv = R3D.fundamentalInverse(F);
	var Ferror = R3D.fundamentalError(F,Finv,pointsA,pointsB);
	console.log(pointsA);
	console.log(pointsB);
	console.log(F);
	console.log(Finv);
	console.log(Ferror);




	// var pointsANorm = R3D.calculateNormalizedPoints([pointsA]);
	// var pointsBNorm = R3D.calculateNormalizedPoints([pointsB]);
	// var normA = pointsANorm.normalized[0];
	// var normB = pointsBNorm.normalized[0];
	// if(!F){
	// 	F = R3D.fundamentalMatrix(normA,normB);
	// 	F = R3D.forceRank2F(F);
	// }else{ // convert F to normalized F
	// 	F = Matrix.mult(F, pointsANorm.reverse[0]);
		


	/*
	F = R3D.fundamentalFromUnnormalized(pointsA,pointsB);
	Finv = R3D.fundamentalInverse(F);
	Ferror = R3D.fundamentalError(F,Finv,pointsA,pointsB);
	console.log(pointsA);
	console.log(pointsB);
	console.log(F);
	console.log(Finv);
	console.log(Ferror);
	Ferror = Ferror["mean"] + Ferror["sigma"];
	
	console.log("Ferror: "+Ferror + " px ?")




var refinedError = Math.min(Ferror*0.25, 5.0);
console.log("refinedError: "+refinedError);

// WHY IS THIS WORSE ?

// stuff
// 100 - 1000 points
	console.log("fundamentalRANSACFromPoints ... ")
	var info = R3D.fundamentalRANSACFromPoints(pointsA,pointsB, refinedError, null, 0.99, 0.999);
	*/

	var x = 0;
	var y = 0;
	var alp = 0.75;
	for(var i=0; i<imageMatrixes.length; ++i){
		var imageMatrix = imageMatrixes[i];
		var img = imageMatrix;
			img = GLOBALSTAGE.getFloatRGBAsImage(img.red(),img.grn(),img.blu(), img.width(),img.height());
		var d = new DOImage(img);
		d.graphics().alpha(alp);
		d.matrix().translate(x,y);
		GLOBALSTAGE.addChild(d);


		var putativePoints = putatives[i];
		for(var j=0; j<putativePoints.length; ++j){
			var point = putativePoints[j];
			var size = 5;

			var d = new DO();
			d.graphics().setLine(2.0, 0xFF000000);
			d.graphics().beginPath();
			d.graphics().drawCircle(point.x, point.y, size);
				//d.graphics().moveTo(point.x, point.y);
				//d.graphics().lineTo(point.x + size*Math.cos(angle), point.y + size*Math.sin(angle));
			d.graphics().strokeLine();
			d.graphics().endPath();
			d.matrix().translate(x,y);
			GLOBALSTAGE.addChild(d);
		}

		x += imageMatrix.width();
	}


	GLOBALSTAGE.root().matrix().scale(2.0);
	throw "imagesLoadCompleteFBasic"
}



Fun.prototype.imagesLoadComplete = function(o){
	this._inputImages = o.images;
	this._inputFilenames = o.files;
	var data;
	// scene
	this._scene = new Scene3DR();
	var scene = this._scene;
	// view 1
	var viewA = new View3DR();
	viewA.putativePoints([ new V3D(0.235,0.075), new V3D(0.587,0.085), new V3D(0.836,0.0336), new V3D(0.430,0.440), new V3D(0.795,0.330), new V3D(0.805,0.430), new V3D(0.215,0.555), new V3D(0.880,0.580), new V3D(0.750,0.670), new V3D(0.235,0.733) ]);
	data = this._stage.getImageAsFloatRGB(this._inputImages[0]);
	viewA.source(data.red,data.grn,data.blu,data.width,data.height);
	scene.addView(viewA);
	// view 2
	var viewB = new View3DR();
	viewB.putativePoints([ new V3D(0.175,0.113), new V3D(0.525,0.150), new V3D(0.770,0.115), new V3D(0.370,0.490), new V3D(0.730,0.395), new V3D(0.740,0.495), new V3D(0.150,0.600), new V3D(0.820,0.635), new V3D(0.695,0.730), new V3D(0.170,0.790) ]);
	data = this._stage.getImageAsFloatRGB(this._inputImages[1]);
	viewB.source(data.red,data.grn,data.blu,data.width,data.height);
	scene.addView(viewB);
	// link
	scene.addLink(viewA, viewB);
	// 
	this.all();
	this.displayData();
}
Fun.prototype.displayData = function(){
var colLine = 0xFF000000;
	var d, wid, hei, i, accWid = 0;
	var u, v, w;
	var len = this._inputImages.length;
	// epipolar lines
	var link = this._scene.link(0);
	var A = link.A();
	var B = link.B();
	var inputPoints = [A.resolvedPoints(),B.resolvedPoints()];
	var F = link.FA();
	var Finv = link.FB();
	// visuals
	var linesDO = new DO();
	// display initial images
	console.log(len)
	for(i=0;i<len;++i){
		d = new DOImage(this._inputImages[i]);
		d.matrix().translate(accWid,0.0);
		this._root.addChild(d);
		wid = d.width();
		hei = d.height();
		// display initial points
		for(j=0;j<inputPoints[i].length;++j){
			v = inputPoints[i][j];
			this._root.addChild( R3D.drawPointAt(accWid + wid*v.x,hei*v.y,   0xFF,0x00,0x00) );
		}
		// display epipolar lines
		var pA, pB, arr, off;
		for(j=0;j<inputPoints[i].length;++j){
			v = inputPoints[i][j];
			if(i==0){
				arr = link.searchLineInBFromPointInA(v);
				off = wid;
			}else{ // i==1
				arr = link.searchLineInAFromPointInB(v);
				off = 0.0;
			}
			if(arr){
				pA = arr[0]; pA.x*= wid; pA.y*= hei;
				pB = arr[1]; pB.x*= wid; pB.y*= hei;
				var d = new DO();
				var colLine = 0xFF00FFFF;
				d.graphics().setLine(1.0, colLine );
				d.graphics().beginPath();
				d.graphics().moveTo(pA.x + off,pA.y);
				d.graphics().lineTo(pB.x + off,pB.y);
				d.graphics().endPath();
				d.graphics().fill();
				d.graphics().strokeLine();
				linesDO.addChild( d );
				//  
				// var ll = V2D.sub(pA,pB);
				// ll.norm();
				// ll.scale(400.0);
				// d = new DO();
				// d.graphics().setLine(2.0, 0xFFFF0000);
				// d.graphics().beginPath();
				// d.graphics().moveTo(pA.x + off,pA.y);
				// d.graphics().lineTo(pA.x + off + ll.x,pA.y + ll.y);
				// d.graphics().endPath();
				// d.graphics().fill();
				// d.graphics().strokeLine();
				// linesDO.addChild( d );
			}
		}
		// display final points
		// ...
		accWid += wid;
	}


this._root.addChild(linesDO);
link.calculateRectificationTables();


d = R3D.drawPointAt(link.epipoleAImage().x,link.epipoleAImage().y, 0xFF,0x00,0x00);
//d = R3D.drawPointAt(link.epipoleBImage().x,link.epipoleBImage().y, 0xFF,0x00,0x00);
this._root.addChild(d);


var i, d, r;
	// A
	r = link.rectificationB();
	i = this._stage.getFloatRGBAsImage(r.image.red(),r.image.grn(),r.image.blu(), r.width,r.height);
	d = new DOImage(i);
	d.matrix().translate(0,0);
	this._root.addChild(d);
d.graphics().alpha(0.5);
d.matrix().translate(0,350);
	// B
	r = link.rectificationA();
	i = this._stage.getFloatRGBAsImage(r.image.red(),r.image.grn(),r.image.blu(), r.width,r.height);
	d = new DOImage(i);
	d.matrix().translate(600,0);
	this._root.addChild(d);
d.graphics().alpha(0.5);
d.matrix().translate(0,350);
	
for(i=0;i<inputPoints.length;++i){
	r = link.rectificationB();
	var index;
	var searchInfo;
	var offX = 0;
	if(i==1){
		offX = 600;
		r = link.rectificationA();
	}
	for(j=0;j<inputPoints[i].length;++j){
		if(i==0){
			searchInfo = link.searchThetaRadiusInBFromPointInA(inputPoints[i][j]);
		}else{
			searchInfo = link.searchThetaRadiusInAFromPointInB(inputPoints[i][j]);
		}//
		var angle = searchInfo.angle;
		var radiusMin = searchInfo.radiusMin;
		var radiusMax = searchInfo.radiusMax;
		radiusMin = Math.floor(radiusMin);
		radiusMax = Math.ceil(radiusMax);
		// convert to lookup-table angle
		angle = R3D.angleInLimits(angle,r.minAngle,r.maxAngle);
		if(r.increasing){
			index = Code.binarySearchArray(r.angles,Code.binarySearchArrayFloatIncreasing, angle);
		}else{
			index = Code.binarySearchArray(r.angles,Code.binarySearchArrayFloatDecreasing, angle);
		}
		if(index.length==1){ // exact match (lolz)
			index = index[0];
		}else{ // interpolate to exact line (probly not necessary)
			index = Code.linear1D(Code.linear1DRatio(angle,r.angles[index[0]],r.angles[index[1]]),index[0],index[1]);
		}
		// line in rectified image
		var imageWidth = (r.radiusMax-r.radiusMin+1);
		var d = new DO();
		var colLine = 0xFF00FF00;
		d.graphics().setLine(1.5, colLine );
		d.graphics().beginPath();
		d.graphics().moveTo(offX+radiusMin-r.radiusMin,index);
		d.graphics().lineTo(offX+radiusMax-r.radiusMin,index);
		d.graphics().endPath();
		d.graphics().fill();
		d.graphics().strokeLine();
		this._root.addChild( d );
d.matrix().translate(0,350);
	}
}

var windowSize = 25;
var searchSize = 55;
var rect, from, source, sourceTwo, needle, haystack, row, angle;
var epipoleTo, epipoleFrom;
var img, di;
for(i=0;i<inputPoints.length;++i){
	from = link.rectificationA();
	rect = link.rectificationB();
	epipoleFrom = link.epipoleAImage();
	epipoleTo = link.epipoleBImage();
	source = link.A().source();
	sourceTwo = link.B().source();
	for(j=0;j<inputPoints[i].length;++j){
		point = inputPoints[i][j];
		point = new V2D(point.x*source.width(),point.y*source.height());
		// needle
// orientation is ambiguous
// needle needs to come from rectified image?
		needle = source.getSubImage(point.x,point.y, windowSize,windowSize);
		img = this._stage.getFloatRGBAsImage(needle.red(),needle.grn(),needle.blu(), needle.width(),needle.height());
		di = new DOImage(img);
		di.matrix().translate(j*windowSize,i*windowSize);
		di.matrix().scale(1.0);
//		this._root.addChild(di);
		// needle in rectified
		var toPoint = V2D.sub(point,epipoleFrom);
		radius = V2D.distance(point,epipoleFrom);
		angle = V2D.angleDirection(toPoint,V2D.DIRX);
		row = Link3DR.rectificationAngleIndex(from,angle);
		needle = from.image.getSubImage( radius - from.radiusMin,row, windowSize,windowSize);
		img = this._stage.getFloatRGBAsImage(needle.red(),needle.grn(),needle.blu(), needle.width(),needle.height());
		di = new DOImage(img);
		di.matrix().translate(j*windowSize,(i+1)*windowSize);
		di.matrix().scale(1.0);
//		this._root.addChild(di);
		

		// NEEDLE 2
		var needleInfo = link.getImagePointEpipoleFromA(point, windowSize*1,windowSize*1);
		needle = needleInfo.image;
		img = this._stage.getFloatRGBAsImage(needle.red(),needle.grn(),needle.blu(), needle.width(),needle.height());
		di = new DOImage(img);
		di.matrix().translate(j*windowSize,(i+1)*windowSize);
		di.matrix().scale(1.0);
		di.matrix().translate(0,30);
//		this._root.addChild(di);

// dot
d = R3D.drawPointAt(600+radius-from.radiusMin,row, 0xFF,0x00,0x00);
this._root.addChild( d );
d.matrix().translate(0,350);


		// haystack
		point = inputPoints[i][j];
		// A
			searchInfo = link.searchThetaRadiusInBFromPointInA(point);
			row = Link3DR.rectificationAngleIndex(rect,searchInfo.angle);
		var hayWid = Math.floor(searchInfo.radiusMax-searchInfo.radiusMin+1);
		haystack = rect.image.getSubImage( (searchInfo.radiusMin+searchInfo.radiusMax)*0.5 - rect.radiusMin,row,hayWid,searchSize);
		img = this._stage.getFloatRGBAsImage(haystack.red(),haystack.grn(),haystack.blu(), haystack.width(),haystack.height());
		di = new DOImage(img);
		di.matrix().translate(0*windowSize,(j*searchSize + 20)*2.0 + 50 );
		di.matrix().scale(1.0);
		di.matrix().translate(600,0);
//		this._root.addChild(di);
		// B
		//return {image:newImage, TL:new V2D(aX,aY), TR:new V2D(aX,aY), BR:new V2D(aX,aY), BL:new V2D(aX,aY), intersectionA:intA, intersectionB:intB, width:winWid, height:winHei};
		var haystackInfo = link.getImageLineBWithPointA(point, searchSize);
		haystack = haystackInfo.image;
		hayWid = haystack.width();
		img = this._stage.getFloatRGBAsImage(haystack.red(),haystack.grn(),haystack.blu(), haystack.width(),haystack.height());
		di = new DOImage(img);
		di.matrix().translate(0*windowSize,(j*searchSize + 20)*2.0 + 50);
		di.matrix().scale(1.0);
//		this._root.addChild(di);


// RESULTS
var grayNeedle = ImageMat.grayFromFloats( needle.red(),needle.grn(),needle.blu() );
var grayHaystack = ImageMat.grayFromFloats( haystack.red(),haystack.grn(),haystack.blu() );
// NORMALIZE FOR COMPARRISON
grayNeedle = ImageMat.normalFloat01(grayNeedle);
grayHaystack = ImageMat.normalFloat01(grayHaystack);
// ...
//var ssd = ImageMat.convolve(grayHaystack,hayWid,searchSize, grayNeedle,windowSize,windowSize);
//var ssd = ImageMat.ssd(grayHaystack,hayWid,searchSize, grayNeedle,windowSize,windowSize);
var ssd = ImageMat.ssdInner(grayHaystack,hayWid,searchSize, grayNeedle,windowSize,windowSize);
	var ssdWid = hayWid-windowSize+1;
	var ssdHei = searchSize-windowSize+1;
ssd = ImageMat.normalFloat01(ssd);
ssd = ImageMat.invertFloat01(ssd); // low is good
var fxn = function(d){
	return Math.pow(Math.pow(d,10),1.5);
}
ssd = ImageMat.normalFloat01(ssd);
ImageMat.applyFxnFloat(ssd,fxn);
// RGB
	// var ssdR, ssdG, ssdB;
	// ssdR = ImageMat.ssd(haystack.red(),hayWid,searchSize, needle.red(),windowSize,windowSize);
	// ssdG = ImageMat.ssd(haystack.grn(),hayWid,searchSize, needle.grn(),windowSize,windowSize);
	// ssdB = ImageMat.ssd(haystack.blu(),hayWid,searchSize, needle.blu(),windowSize,windowSize);
	// ssd = ImageMat.normalFloat01(ssdR,ssdG);
	// ssd = ImageMat.normalFloat01(ssdB,ssd);
	// 	ssd = ImageMat.normalFloat01(ssd);
	// 	ssd = ImageMat.invertFloat01(ssd); // low is good
	// 	ssd = ImageMat.normalFloat01(ssd);
	// 	ImageMat.applyFxnFloat(ssd,fxn);
// show
//img = this._stage.getFloatRGBAsImage(ssd,ssd,ssd, hayWid,searchSize);
img = this._stage.getFloatRGBAsImage(ssd,ssd,ssd, ssdWid,ssdHei);
di = new DOImage(img);
di.matrix().translate(0*windowSize, (j*searchSize + 47.5)*2.0  + 50);
di.matrix().scale(1.0,1.0);
//this._root.addChild(di);

// result .......................................................
// calculate peaks
var extrema = Code.findExtrema2DFloat(ssd, ssdWid,ssdHei);
var sortPeaksFxn = function(a,b){
	return b.z-a.z;
}
extrema.sort(sortPeaksFxn);
// get coords of highest peak in image
var peak = extrema[0];
//console.log(peak.toString())
	peak.x += Math.floor(windowSize/2); // shift right
	peak.y += Math.floor(windowSize/2); // shift down

// translate haystack coords to original image coords
var originalPoint = new V2D();
var t;
t = peak.x/haystack.width();
// parallel
originalPoint.x = Code.linear1D( t, haystackInfo.intersectionA.x,haystackInfo.intersectionB.x);
originalPoint.y = Code.linear1D( t, haystackInfo.intersectionA.y,haystackInfo.intersectionB.y);
// tangental
var dir = V2D.sub(haystackInfo.TL,haystackInfo.BL);
dir.setLength( peak.x - haystack.height()*0.5 ); // distance from middle
originalPoint.add(dir);
// extract original image point
var sca = 1.0;
needle = sourceTwo.getSubImage(originalPoint.x,originalPoint.y, windowSize*sca,windowSize*sca);
img = this._stage.getFloatRGBAsImage(needle.red(),needle.grn(),needle.blu(), needle.width(),needle.height());
di = new DOImage(img);
di.matrix().translate(j*windowSize*sca,i*windowSize*sca);
di.matrix().scale(sca);
//this._root.addChild(di);
di.matrix().translate(900,0);

	}
	break;
}


colLine = 0xFFFFFFFF;
d = new DO();
d.graphics().setLine(2.0, colLine );
d.graphics().beginPath();
d.graphics().setFill(0x99FFFFFF);
//d.graphics().moveTo(0,0);
d.graphics().drawRect(0,0, 1000,800);
d.graphics().endPath();
d.graphics().fill();
d.graphics().strokeLine();
//this._root.addChild(d); // transparent cover


console.log("calculateDisparity");

var dense = link.calculateDisparity();
//var dense = link.highDisparity();
console.log(dense);
// show process results:
var iii, spacingV = 90, offsetY = 300;
for(i=0;i<dense.imagesA.length;++i){
	// A
	img = this._stage.getFloatRGBAsImage(dense.imagesA[i][0],dense.imagesA[i][1],dense.imagesA[i][2], dense.imagesA[i][3],dense.imagesA[i][4]);
	di = new DOImage(img);
	di.matrix().translate(0,offsetY+i*spacingV);
//	this._root.addChild(di);
	// B
	img = this._stage.getFloatRGBAsImage(dense.imagesB[i][0],dense.imagesB[i][1],dense.imagesB[i][2], dense.imagesB[i][3],dense.imagesB[i][4]);
	di = new DOImage(img);
	di.matrix().translate(50,offsetY+i*spacingV);
//	this._root.addChild(di);
	// A line
	img = this._stage.getFloatRGBAsImage(dense.linesA[i][0],dense.linesA[i][1],dense.linesA[i][2], dense.linesA[i][3],dense.linesA[i][4]);
	di = new DOImage(img);
	di.matrix().translate(0,offsetY+i*spacingV + 50);
//	this._root.addChild(di);
	// B line
	img = this._stage.getFloatRGBAsImage(dense.linesB[i][0],dense.linesB[i][1],dense.linesB[i][2], dense.linesB[i][3],dense.linesB[i][4]);
	di = new DOImage(img);
	di.matrix().translate(  dense.linesA[i][3]  ,offsetY+i*spacingV + 50);
//	this._root.addChild(di);
	// sub-matches:
	//console.log(dense.matches[i].length)
	for(j=0;j<dense.matches[i].length;++j){
		if(dense.matches[i][j][0]){
			// A
			iii = dense.matches[i][j][0];
			img = this._stage.getFloatRGBAsImage(iii[0],iii[1],iii[2], iii[3],iii[4]);
			di = new DOImage(img);
			di.matrix().translate( 100 + j*25,offsetY+i*spacingV);
//			this._root.addChild(di);
			// B
			iii = dense.matches[i][j][1];
			if(iii){ // could be bad match
				img = this._stage.getFloatRGBAsImage(iii[0],iii[1],iii[2], iii[3],iii[4]);
				di = new DOImage(img);
				di.matrix().translate( 100 + j*25,offsetY+i*spacingV+25);
//				this._root.addChild(di);
			}
		}
	}
}
var disMap = dense.disparityB;

console.log(disMap);
// console.log(disMap.width(),disMap.height(),disMap.red(),disMap.grn(),disMap.blu())

img = this._stage.getFloatRGBAsImage(disMap.red(),disMap.grn(),disMap.blu(), disMap.width(),disMap.height());
//img = this._stage.getFloatARGBAsImage(disMap.red(), disMap.red(),disMap.grn(),disMap.blu(), disMap.width(),disMap.height());

di = new DOImage(img);
//di.matrix().translate(0,0);
di.matrix().translate(408,0);
//di.matrix().translate(1000,25);
this._root.addChild(di); // disparity
di.graphics().alpha(0.85);
console.log("done");













/*

var F = R3D.fundamentalMatrix(this._normalizedInputPoints[0],this._normalizedInputPoints[1]);
F = Matrix.mult(F,this._forwardTransforms[0]); // a normalized
F = Matrix.mult(Matrix.transpose(this._forwardTransforms[1]),F); // b denormalized
Finv = Matrix.transpose(F);

// epipoles
	var e = R3D.getEpipolesFromF(F);
	
	var rect, data, img;
	img = this._inputImages[0];
var wid = img.width;
var hei = img.height;
img = this._stage.renderImage(wid,hei, this._root);
//document.body.appendChild(img);
	data = this._stage.getImageAsFloatRGB(img);
	rect = R3D.polarRectification(data, new V2D(e.A.x*data.width,e.A.y*data.height));

var i = this._stage.getFloatRGBAsImage(rect.red,rect.grn,rect.blu, rect.width, rect.height);
var d = new DOImage(i);
d.matrix().translate(900,0);
this._stage.addChild(d);
*/
}
Fun.prototype.all = function(){
	this._scene.bundleAdjust();
	

	// ...

/*
convert point in image to point in rectified
	- radius = given
	- theta from lookup table ... 
*/

//for(i=0;i<this._inputImages.length;++i){

	// img = this._inputImages[1];
	// data = this._stage.getImageAsFloatRGB(img);
	// rect = R3D.polarRectification(data, new V2D(e.B.x*data.width,e.B.y*data.height));
	// console.log(rect);

	// image rectification for fine-reconstruction of all X
	
	// search along epipolar line (even better - search along effed F)

	// disparity

	// + camera matrices
	// + Xi
	
	/// 
}
/*
disparity searching:
A) image rectification
	+ all stereo disparity matching
	+ construct single image for each view
	- near epipoles, the location to search is 2D
B) search along rank2+ F line
	+ search location is 1D near epipoles
	- have to do this hundreds of times

*) scale can change (adaptive?)
*/


Fun.prototype.fundementalFromPoints = function(pointsA,pointB){
	// normalize points x, x'
	// solve Af = 0 : Ai = x'*x x'*y x' y'*x y'*y y' x y 1
	// F = [a b c; d e f; g h i]
	// force F to rank 2, while closestly approximating 
		// a) using last column of V in F = USV^T
		// b) iteritively start with (a), minimize geometric distance via L.M. converging f
	//
	var F = new Matrix(3,3);
	return F;
}

// Fun.prototype. = function(){
// 	//
// }

// Fun.prototype. = function(){
// 	//
// }

// Fun.prototype. = function(){
// 	//
// }


