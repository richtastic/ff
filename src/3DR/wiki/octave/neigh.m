% smooth.m



% score
x = [3690.897774403847,12855.324368684349,4080.378600129323,4689.302347546418,2776.6702651087303,5552.822683465193,5443.443438164373,1940.4436613308467,4270.71275651193,3612.949395660813,1673.2121784814346,1555.6486590766074,3267.8606536395787,3634.5198637463263,20516.23592059869,4106.890167308081,8420.378874257416,5622.0875194831415,5011.852929888366,6341.431163339903,6300.389516191553,4679.444686627873,4992.125021370454,5744.4835787199,5568.764686122092,3521.2628903176023,7579.316169320329,12252.104810984378,7702.902029296178,2546.051991570063,4189.868917170128,2429.5247368953874,2987.009970671104,15167.692519646462,4825.60550856976,10032.814539729761,5647.126751895392,3851.1857171239153,3828.3969293273176,15856.610171693683,8030.510635160366,2521.3828347455474,9923.508674463214,5072.474054229949,4936.535969120305,14783.648267203253,12868.315375405276,5545.139343719918,2964.1591576303545,6629.666746565871,4312.853251425471,4919.354275065061,12645.478564704641,6415.211553178867,7933.94713264814,10567.133822888714,8287.071771098974,5562.4396066104455,7830.883410241385,7199.842407883203,24259.28161582182,9560.624998794643,9432.250240674179,3099.720709603159,8929.016407821931,14110.025059011876,5671.228156685977,5783.132453345098,2456.0101127749735,9825.229420304215,11865.395132195885,9341.365092282047,10137.403080830485,15602.965995568062,6715.973899914797,6851.167117559285,7535.204598396028,6757.962432963648,12139.107437622868,9704.505500121766,6434.286478600201,8252.13373697695,5457.454558835535,5906.78896856239,2399.98810706237,9626.04665975687,5872.2126036044565,10118.888240358776,4507.762735604615,6277.852623140795,8359.799170854061,7983.50272816127,10806.422447324332,7844.359355174215,15433.564403037228,8837.31248693899,4685.105385463698,4964.220042910335,9660.97001020951,5524.748181997293,10834.946763249207,5349.467540095742,11100.469149062405,5473.197942360948,15042.403351567627,10584.467596730301,6475.884287224742,4105.168547141446,5517.078938511305,8290.59222700252,13747.178154560424,14702.124976190618,21140.056865806826,15000.272069242965,14579.272848714678,33569.16745633138,9600.974367039147,19459.933417062784,15138.396975446514,11173.821995854929,7866.829265040403,11098.558999704128,12283.739778749503,10297.154961213673,6674.031427206509,10445.869218112875,5423.359880403741,10372.566683093655,6226.379370814191,2445.0983392526964,23859.665631272936,14673.31708012818,17896.541142630682,12760.362078073105,6037.034008804889,7619.743691379848,5988.572877926313,12807.183367312846,12503.60741901556,8192.15556549418,7725.574059019067,7627.928531674828,6613.238112906289,19039.092536563072,9996.530347004438,18798.345652605534,5301.928128248261,9289.818235054217,6644.068492587783,22592.44816436519,8209.585089538068,5139.767555535929,11915.58248492115,11089.270168909708,7154.898346630701,14146.588618024462,10789.211151189777,7194.859132140326,15442.117870051541,11697.105411333068,24051.976358039625,9961.650089940955,6861.850586299613,10305.283198204517,17107.269694119845,6670.88123692779,17959.140023512122,14067.871346119522,12754.00564210854,9253.674107750481,5185.734654627918,14258.310664592176,9752.520114975403,14844.94028820777,9649.171338159755,23190.54562613259,16254.849121546793,11679.695961552428,9727.789164525879,12190.846717969955,18222.429734492678,14961.415333452955,7409.2591319083185,12046.688828363478,12030.632050074613,19266.147967694786,4739.003738776418,8516.825641576108,12552.662406247853,11405.18417611547,9359.089894633827,15902.995449632273,5814.480409773276,13902.248743009577,11762.211194985512,19281.28493454066,10692.987696106587,14496.531380784498,7355.838496038249,13068.652770252085,11348.725896890775,15169.439926619032,5461.97536120773,7208.200171130511,26028.59436835786,9714.006718818717,13220.018799393014,12101.933141286456,5937.46833318762,10156.12351991038,16526.667822799845,10317.760385959698,5501.597388585673,6100.098485149254,11193.193414554256,9292.39800176003,11931.973911207688,31279.37008290352,25696.50752826583,18319.00660781141,18906.52464620773,13839.622907705267,14826.853809317921,12252.48511390908,12637.838608503022,19891.65395368857,7684.364878018151,13559.980861725455,18998.613504356646,14521.862830739457,9909.116263986742,19609.65890745156,15659.232003693844,14178.756376961632,9799.041868635783,18706.67127405269,16590.83996932195];

y = [4156.129074775191,6739.1876357967285,6802.775428863739,5519.213412503548,3984.9361642457948,3599.2090549724335,1898.1658740087425,3483.217134558041,2961.3339928382497,3619.605916821794,3196.7028846954922,6907.331415835639,7292.998839873126,7371.790874396707,4614.4324055323395,2892.3861341794836,5239.75516807548,2505.683681821405,3650.569285123577,2580.3874334952457,2461.1918649749173,8247.065922181157,3843.350843152881,4799.267078534792,2085.679903518735,9654.443616775034,4264.828016546917,4544.041745243652,1363.8520684075283,3988.9150541484723,4128.613060628687,3981.605263202806,4604.487270698867,7838.649502564673,2300.0943951884706,5544.718813708447,7437.652392221072,8219.511391506496,8852.203775978987,12787.343574465842,2708.369712726611,6283.497920625106,2770.5330003008594,4008.53925897937,4481.112342264081,3953.1581135095716,2964.8698611618784,3960.9417099800007,5131.335468286729,2984.397766592257,7655.897703411209,4097.364683799272,4914.297328032508,12280.270443938944,4826.234687645594,5517.99436038738,6094.728944083603,1738.6241992151836,7061.403734613948,8502.42207774671,3982.2538455898098,5567.170526919449,5849.070975013114,2158.4898588412484,8494.888567952587,8781.360762472337,10611.580494985652,4133.821764968493,13104.769449501822,5968.368137860428,4488.967248839909,5395.088689753617,5514.1256560252905,2650.564026885173,4981.270723185575,2367.4828090524093,3632.704514578084,7766.773505096167,11719.830093123288,4092.731769030337,4876.287409947634,3519.179831221786,5304.917380706881,17899.52005815432,33058.01076463522,6742.72165451101,3959.2813644760413,8747.7918160035,11973.390746575924,3267.2790869717674,6926.5645578846315,3442.955204902649,4603.395266234753,5967.74236251086,11674.60901905608,2597.763940833059,5198.581106531549,5881.867919781378,5341.767267303032,1556.694551682127,8429.573049424514,5819.666909661346,6144.965450310748,5740.754686495635,4269.3666443119355,1909.869680366247,3963.4691171088416,7265.2478763213585,3204.9702310848943,3440.5045127110257,8120.343205000833,10667.295139611424,1601.8235065587874,3523.116903233681,2642.42528331358,9722.686965337023,11012.895540202184,34808.487568642595,8227.655955739088,3018.543509003772,2310.91425778423,9850.073256641452,6562.693919553199,2420.9499245719207,9756.23641836658,4591.983381200207,4960.124304077446,17929.1691633794,7641.329463556935,4863.262344684194,3430.1623666625633,21229.79583238642,7339.045798552626,3531.5672323176022,15576.869279845767,40657.44801677615,6320.413535923184,3070.446499472639,4855.986357894528,19687.057069457926,6834.523030573913,8386.38653040517,2573.0710440003495,9280.606956796164,6514.209532943326,17748.67566462015,8642.176622638253,6770.209620738855,6329.667214080084,5237.385912132342,2049.6409628598412,4451.855405365402,3575.648053822544,15805.843340753217,12971.084162093415,2516.0065858591115,5832.562953650339,10927.259587912033,4027.1032825691773,4957.20663767893,6630.235342047842,9112.262122494336,5660.179631305997,12913.968865186904,12097.398357610049,8898.040258173349,2596.287748056799,2017.6681163121482,5266.196969624995,5741.575734696751,4781.516657121734,5661.452958191462,4855.242302276289,14727.040459569356,2956.656993516395,24920.684187230516,4915.435166995394,5339.981806410813,4438.152712809914,4017.4476655559256,8385.330575453732,17704.288295660113,6806.668100537187,2894.4511270897915,17509.74406347651,4689.049123708016,5406.401813802542,6335.421814283973,5379.156826039273,4424.672071368447,4194.9403792052435,5794.662506800869,6457.319678791681,5322.856937836748,3393.2987891715875,3660.587148016847,5308.646200141644,3919.910017632682,4083.4232664566125,12623.897937086786,14970.708970045162,10161.937770639368,3494.979349722724,5911.098311717588,2306.7325742297558,5191.1551192129045,14032.916121265429,8201.740899872682,6308.841787091507,2577.000079309082,3589.055349206615,5940.987942728931,11938.40219095916,25458.820224069605,7091.77934021593,4977.699462988032,13251.625471857913,4553.204170437458,13207.703357551896,6143.336361862119,5346.425869617118,7303.948386477316,8733.041838633802,10498.18592361373,16267.940309145853,8163.623431832107,12564.834223042533,37218.27661284427,13981.739657811786,32701.742384793317,10495.441311414319,42020.1810444164,5652.690823112514,5647.485015624118,6020.493860811039,18721.826518036247,11116.919204642896,2160.0318506618414,17085.411066610086,12045.414070866522,2562.126384240729,21208.55965635663,16260.825149393977,6067.315149784169,7719.957795748393,5843.993282903382,7937.4181943620015,5132.206952729487,7341.847899725176];

z = [12899.358420594175,16106.331464645758,7226.385781174574,6364.513819955658,8509.388461327471,7190.494427966841,10506.706785436596,10791.410439963749,6085.50609428729,5804.456880722497,18758.820675133415,4869.779022350935,10241.98564746785,4866.895370851777,4954.10781006703,10804.097818790455,10168.28393967554,9436.36218417125,4502.034234914702,5862.760920285452,17316.846835521214,9464.660090422949,9790.664869944032,9485.151160024961,11542.495886478995,19549.721480397486,8821.368887114211,5826.221335206441,14378.68711418336,7841.942427776769,5212.778119270467,11458.494194217534,10808.652392916812,7927.665231809378,5244.208352431779,7264.111499632928,4572.484447068827,7553.0451626586755,15007.237667921272,8712.151201841996,9284.022881875557,7976.4950988797555,15331.857081418446,8629.166752269566,8218.661762659993,11604.739467048941,9596.116229492181,10435.262492471129,15077.820139876072,11247.17383249398,9416.890281156448,10945.31252670555,18763.830063053912,9451.690953653964,6366.028678205359,8149.640625671698,6630.204749838931,9946.780775980193,10703.71914410748,6057.7010189104785,11778.028277112451,8030.2054654793865,18022.348536345096,18973.97395351441,15032.971293617364,13958.999765764525,22038.034114480175,15494.225636301082,16360.707290026408,20381.124912011204,11351.258171339814,31786.981970097404,17864.234574155165,23230.079322890524];


a = [17298.68451776276,13750.163017120612,10419.810720373092,4999.852776717139,5563.858385258551,5065.05312065768,5592.346995676444,36221.960744931144,9325.9897059042,7785.908184243008,16124.986406842618,8114.90059653924,6796.10888280786,7147.258290439177,5483.495089414426,7701.598308448535,34627.92363559603,14399.15540463731,11636.147642720576,5167.210958028947,4931.550029701325,4939.454141338176,20054.658626809032,14260.06424401999,4607.750708766749,26951.269746608363,5892.059893437888,4602.232974480236,13934.352896714805,3894.03500839109,5317.93440602715,6150.349175885704,6078.0457403693745,9195.109254420695,7477.650788940767,6660.153144302109,8270.547408375232,6422.944579081475,4555.683001578473,6280.742921579036,14709.103490346304,6987.195238494171,3719.7907000964246,14471.726810659902,32129.58267598461,5658.687522739422,9875.02317265899,13879.695924929129,7672.093418879403,21764.53535012371,29112.02819704025,28533.041755876213,23691.600274451404,10726.289856294428,12835.783667211083,5346.101034055735,16432.954607484484,9261.109482564512,17152.21568837767,11797.892288397745,5015.499435978982,12618.860789048942,15683.32630926729,15862.60313];




x = [24359.979148909384,32200.1071745197,12068.75832285319,9735.43447105126,9483.78840633803,12306.162814088768,6959.145012691026,23154.122167027206,10647.826953681351,39042.81029332634,7861.477700088612,8595.450059603936,34868.372775777956,10558.685158239005,12622.73125037725,15145.367965266601,18623.29259847277,15732.011386263483,7211.087572719642,11675.839743900628,7386.953075996461,13467.340204525435,20179.203868449596,21547.607729000738,18004.38889238724,6599.285644240254,7343.098975534027,17664.475870069982,15832.397399809624,22546.88339894279,5736.975482087646,7406.968524768112,18245.97343160573,14534.142588794264,4050.1957256523465,8626.809257295741,17549.715089907226,15047.862771811848,18606.681457581886,7751.460009040436,18593.578999584086,32220.441200711586,18755.737745342125,9307.500318867102,13561.981193897915,17108.300413010766,5958.264435671829,14116.683411613963,30492.78530097764,22406.47545824143,5705.701787616069,18066.968954145093,8575.634013210596,23134.696048280915,18779.813534607685,7805.915935030086,31536.539176275423,12983.163143900993,9801.724484077495];

x = [13854.862426371908,5348.4498634549345,13317.047926364887,8329.281939610635,6310.699686189017,3727.1672477459097,17505.106453675733,32728.969961258634,14306.657330130485,2984.386961369208,13680.520470822805,6405.449577847636,8877.45178547856,15499.705525226447,5703.191740814491,11788.171651221099,20441.32079599878,15022.61294120192,13469.82427418972,4835.363098343043,19776.8219098718,19759.563049528042,8831.46713840548,9407.521357630025,13205.695953589524,21064.659936088035,6124.932170674757,14469.261690083315,12985.324298320542,16991.26690994732,16701.413794442604,19409.890222148766,37710.52063482395,5987.6322683340595,12267.262910941554,12925.809369341505,9295.816712965709,12640.979177248855,18340.02455546553,8866.64859720739,25018.15022122559,9396.911130693248,8411.423583911925,7750.623928975765,9643.579019231101,15608.766097024847,14335.980835091348,21611.07533936379,16357.776902245876,10042.075575116549,40825.07041683348,21296.065638950582,28434.59015054942,14317.667359752646,17949.795149216814,12049.810820309336,20673.57529960283,9351.080503922018,16310.602788766146,20115.85159225549,14403.45988189298,12292.549401028282,6280.527047723444,16557.88999784554,15139.525226847483,20734.479320295322,31552.19932842356,11479.33802918551,45918.11680744258,31739.770277442167,17340.981758357862,10158.787179245086,4660.692486654968,11178.806758250932,25559.03160517192,25308.117737368204,9115.433372347245,19767.644282035646,17835.543480082757,13902.800598505606,21259.941172210394,15645.596645642616,11780.742453457737,15231.279923922693,12800.324821691267,3910.422290302245,19488.71949880282,11361.833639545264,14014.89883404017,14323.552361982423,16909.059576262174,11618.878065237537];
x = [6675.437032800623,10124.334530957316,12277.526398063781,20955.196935411022,6094.583188055894,6933.196617205363,10330.527904167438,13271.177144482986,12945.647634811168,5829.572685361352,15662.362052840052,7030.815383165024,6214.837331394797,19529.636567243488,14458.804554146573,14938.830717013429,7083.271123473771,13026.15450429524,19644.67454875986,15536.634570947594,7320.824299257516,27963.454073290428,11418.45546227285,19996.38286883481,12742.048913700472,7289.745976599085,9120.407968614702,24008.755205393878,24963.58626592639,6359.658900313403,11405.960566993319,12576.62522170314,29124.434541881375,14653.525721487758,28039.725453853953,11565.958104567064,11280.290636940541,19906.960375205792,17561.739563799605,16996.80134413804,11841.505004398794,12215.34324076437,14157.45052543208,11539.19438164215,14106.586411648768,12175.885274507626,13263.271862821544,14236.126468210245,13955.148593864229,19664.79296905168,10165.812758069733,11873.183487519502,18358.903103374207,13891.290646243151,25912.08331594785,17026.890335226384,32927.08546295495,13490.354152328884,17327.922761044574,14651.089181371006,30870.238373718323,31727.50493037673,18402.050280996307,13447.385026542735,17194.25184454857,10324.5953816176,29031.61539758879,14438.998666858097,17973.480247967516,9697.00255131906,25663.248747281512,22283.776997018813,19534.669273771247,15227.838498083613,16407.826608528692,13743.268190593892,30755.803681244113,20028.750526839904,14286.621581301584,22182.156508305376];

x = [9673.337985740805,7805.535736477817,11098.54924952234,28889.086403435584,16546.443912563405,9811.024457878853,7976.805618145875,9382.857880721462,11990.025343383502,9095.225084487509,11552.292989608492,7103.772997192193,7671.125901547187,11144.522924589644,5378.8535870689675,5830.920097774631,11290.352351848705,18272.224845548655,5454.134480558561,6840.101311991522,4860.445897329729,20579.056124228133,17634.02305972579,28867.8020600248,15151.471442720607,22465.425023465938,10162.325786601861,15926.377300359645,8023.929093704609,5906.024472522984,8887.774635876383,6892.539926482411,15499.060774206278,10907.329452022148,4458.25162108723,6281.823698513113,8514.775711634522,5147.2400610991635,12241.397824562793,6254.172068165073,7533.186275155024,5715.59457294829,15339.57527387744,9407.005039543223,16629.74569049285,10776.00440009495,13969.07564826695,10881.028766879848,14421.760494256994,10910.29255963029,9365.678534342625,6559.560716346022,9825.820017820932,9814.854153769144,19535.642140968932,8430.802614655437,8966.411681828651,22577.499591230866,6849.780549352426,14141.296590956215,11195.505786414009,9627.181956752784,6201.040066833698,11504.38184363221,9885.365478585805,7948.302174195868,11258.040043448655,5667.4198017777935,12451.184850322654,22307.47454558005,7378.0178916841,6507.533123989607,7003.231845254744,5463.8328356887105,18933.012337877368,11138.447945535436,9056.990778676438,14264.350183961637,8631.507458558845,14648.589953945811,17578.075641208474,28061.726929800538,22337.870972743305,10064.423586848572,9940.016545419876,11355.923725259461,16506.180246537486,10893.246090154305,9729.18649730439,15747.151900294564,16678.085331693077,24955.211574875222,12589.572260120778,29831.16804863269,20739.066855266206,16006.0985153939,19883.391208494984,19063.370813155736];

x = [9274.67948964133,7740.235991522575,7061.099727360104,22475.630692506995,10076.398575261775,8690.97469733565,11750.79877718003,15853.12528704673,18591.81017751973,8247.03925908647,6701.03130130393,5951.354034148239,5845.008008944153,9673.619048486164,10249.728691059165,7020.122105955945,18618.12862915375,19573.848089699553,11776.338527185804,12196.695492218676,9494.194000619653,11167.22865422189,8386.932710763273,9778.140692389277,25376.318135940404,8742.542647382968,11371.728953392616,11522.52370038392,12676.664523275931,9711.01293706283,6658.670576818721,5778.7904665617525,30721.990039737746,6096.044316824176,9400.636360852192,19566.300575248297,16582.870850259227,14657.287735678276,21183.549371151596,10109.92124987997,17549.564526101545,12288.085998554729,16777.887192660855,18922.890519392193,17055.184130807043,12869.858049902761,9532.957410138135,20794.67538177793,11281.224316603671,21299.17693775013,14598.91785346128,9450.431527182878,9169.822423158446,12654.19639222158,25460.451127589327,11973.319568656632,18995.28204452656,17576.690342176596,9044.43469924526,6593.382818321926,18774.712122139106,13352.339997247876,15627.619214703378,9247.813287722262,25683.157379397027,10337.968875152457,9883.084764050687,8729.58307566263,18398.53386797016,25481.727137244372,16808.60421114184,19902.57859113389,15321.27785557032,14870.53310393137,16945.79197716366,23344.639128491377,12973.748450935887,6837.994874330527,9700.098067040672,16464.2185735667,34076.234606187296,7636.352466236896,13657.226111571556,15283.632821085894,18871.785669487293,7321.452042452938,8712.894315162217,10187.493419870223,8170.943864546906,5364.977700146248,16500.130001060043,22141.192474128475,17196.329132188162,9510.963157754017,10712.20151313147,21169.097408541875,32004.28912472051,15952.641436464495,11846.568965439457,13103.134431932902,12698.48041065091,23762.60681876068,12341.212645073287,11752.216396089243,13528.589699513042,12409.449238789995,14993.891534257387,22027.445421126038,15277.054259672372,20473.302396426803,8570.005295459077,26051.74205674028,10774.911775482999,15329.007798622337,14901.99350556544,13808.161459841154,40374.946621275434,5770.608833235831,24269.70917340993,19517.0510765213,13387.312621096295,6595.925949066306,18531.074235072694,10539.097476347926,28067.587736234127,10411.819564310843,18238.221371549513,14740.039269625227,18949.595518167847,9872.197609489858,17387.886767066,27761.04922181337,6650.955371571536,22020.736627268758,11696.017751649253,24904.007495764417,17917.696570041648,16540.31877941973,24058.089371807673,12763.302769411303,10169.025002659957,16412.97706557088,17413.377419033528,18513.448193077547,15395.533816918007,18092.571813564467,28131.46155637715,14832.53240197023,24282.501420811175];

x = [16654.80715166524,16817.432247486162,14278.673107324441,15056.489642121735,13513.27683783332,18587.368692241314,20008.54607842088,15049.144750182577,14839.596023645354,16204.758275891674,12336.135766436386,13380.797643145346,16009.340678994864,12532.029320398482,10412.832565743978,13771.910155318728,13400.90213930221,14279.249688033711,20710.092117235487,12413.591996963703,22876.85562111746,16877.81042010918,14032.818471943194,17790.172914367562,13936.568856646323,13836.97026909424,12745.489336956265,18672.143767723184,15078.441009408405,15911.229596656034,16106.324329601079,9437.10653136932,12814.896768482804,11943.869914282868,9649.115843282216,18658.987732955215,15009.767091494034,19252.982431524164,18342.159297787846,20585.412593422556,11960.777762694648,16853.793639522228,23971.691588375113,20275.325958882444,15117.037038890681,22933.143451614334,26491.433452697926,19221.368339684257,15384.555299543556,17426.191171150927,10739.979163306205,10934.777015066635,13199.214624619382,11563.897056570098,12139.530298739754,15411.713469261944,14706.310781639593,16679.860929603823,13713.380955932547,11427.430330591553,21167.463689133558,14064.91310035831,14547.410139376645,16877.955158547702,12369.373542864178,15933.677705079688,17611.807598948504,12875.751585749535,9860.04504712882,20980.142740573196,13960.185329337353,17879.967877186107,14801.541018919988,13270.560779480784,15773.03281743643,20893.127915047517,11164.478095497598,20621.460964223472,14552.48349724338,13137.647233971735,9810.93071043166,9488.666023798773,17170.94687909595,21457.610513055457,15544.381713083629,16154.27961507311,17355.830390753574,16500.71741361875,12813.175431860944,10596.484130972523,15285.03770596288,16243.632565963355,13460.736557449858,18494.854742780455,16234.17076459451,15023.569438324017,9856.782150819849,9035.244343802588,19640.711832109195,10601.966957540193,13225.125823104925,16259.214741786815,16120.054655741395,11204.040028809533,15112.476889812751,12464.159255263046,17484.62304335404,16842.653519572865,13008.062227395123,13695.357324326937,18617.383159493867,18278.818985742066,8803.670646521514,14389.45012452408,10412.230398127096,13695.17958569571,17433.891908579455,17801.52318853449,17769.841178402236,15791.20918127048,21725.724276572666,6652.722709688554,22123.2839243433,12404.080291125414,20638.965222261548,16508.35614665895,15069.555650047814,12932.941440230976,15422.825848155062,13109.939095125534,25775.684676511464,11554.181951441205,10161.795925759021,18727.975734644828,13801.918735838562,19203.744916051997,18759.035511055572,15367.692382247518,17532.212344772528,14304.808199032592,17325.51684087902,17169.659193380692,14150.93534967188,16928.909723336677,15254.74088353354,14624.619396130982,21349.225720739163,13730.267640948092,13851.76500923985,23599.93927485459,19657.48768435762,15101.847870931922,10722.64233536149,11612.74254892391,25484.938702066018,10907.420494645343,19275.71929584363,15384.983116395026,20789.16316041673,11220.292926661714,16240.476152080215,16158.698276177785,16226.914818868296,10808.994439142587,21290.486692024002,21349.324889423115,15213.972543550364,21089.599423357984,18045.291939960567,19308.13622903858,10679.482702579744,16154.692503427688,9922.448643295409,18963.94867787499,16155.580355856106,14636.007556419412,17282.940918323373,13554.91234610289,18208.447937785313,20567.989138098666,9684.189125676807,27334.72729204084,10428.525661773463,17312.702155726343,18217.924150461942,20627.857294178102,10702.066714600714,26299.649594434974,27517.408665858362,15642.152596014079,20741.3060837686,16915.700268650802,21704.540175153994,16942.177946702246,23690.384868871646,22312.4197285208,12942.619177062965,22355.018380798472,17672.99780050355,24626.40908189157,13820.72101112259,16634.38621781875,18537.866577161036,18005.012521093093,8737.696195771861,17355.70436881519,20898.831765431005,30683.159557443116];


x = [4283.451895304502,6765.825134803519,3553.4723730225965,6460.827852883963,3900.702449499522,6773.2636241034625,3558.169463157841,7684.850113520939,5417.904271764745,3933.3953297621188,4932.736548493374,4036.898189516089,3351.4527339175984,7485.448407701959,4798.007703221849,9318.109647990488,5415.761906700635,5234.649666182297,4675.759412488445,4240.525287480921,4521.648639772669,6769.060233661559,4814.6927289235855,12118.119499003378,3864.0546167292296,5449.862099065618,6340.006198278819,3918.18083449919,5322.008757669656,4239.889798898735,12179.559637716045,8246.187033515032,12230.665140368536,3518.411097907683,3052.7864082864403,3710.8495191465486,7906.739747559845,9580.346729481556,7720.479758692158,6161.153473182316,8758.268547950196,13776.793616705332,5310.986061177476,7814.209296147724,6803.136965253057,8071.003852174032,7817.774123496047,7300.42889883478,8026.28591401049,18817.20366242678,4819.555012409062,5212.6651963217855,6455.881618451476,4176.051010524891,4573.6982857849525,10173.860744306474,7176.940536576645,8474.017235921301,3474.6750678762423,5971.235182809135,5515.563432256592,5355.468359127612,7991.69533734317,7555.791488748691,8986.85170126764,7571.487991558689,8720.450639190882,11105.566308051115,6531.767898444337,4695.028358857733,8747.602610416641,4419.671807783394,5520.279742485778,4361.900128027601,13062.526938151126,9366.594265133252,6850.097894456161,10335.956249110855,7425.418888915443,16717.52979439798,12348.471209208976,11924.677634694766,12404.301272302358,6542.467470906494,4539.475858622825,2426.279118273571,6502.094144810814,4808.387833777475,7008.03070663456,5679.315028716294,8505.947793791809,7787.70154072246,4919.070763579838,5848.165349332955,2931.0261611794554,6160.523100808656,4240.139155314242,10166.076270456626,12351.149075619427,7180.080990749536,9583.763125860238,3602.2332699728404,9316.450326082799,5670.203453504595,4305.582714976918,7851.487011918859,7779.741419022582,6325.045766353334,6036.544738193731,10884.730041029408,35706.513177263085,9446.375999419144,12574.358920364795,3964.6403294145675,8321.29105895288,4851.485636063451,14369.650295174157,7487.1747331446,5564.9184024576125,8701.55088260019,9612.961698078512,5358.920167342975,8485.330935925847,11462.892533341286,6022.220947172186,9596.187837426049,5421.380409392941,5777.137186696689,7829.099382642919,4546.900525607455,11611.578916076514,5928.248410854286,12796.579565086555,7705.477835468351,11638.596717150387,9912.89897928878,5931.600039064793,11513.479838416319,9074.041489072117,6978.919062174227,5021.0701262570765,7476.236234653321,5929.623230285987,9422.639903530975,8815.154695280758,4424.613770762481,8826.029551826708,6888.863901521913,10931.707143714784,11041.579444538791,7920.922940261515,13902.87200509079,5733.073671580127,7196.243946247022,8821.797376616358,10887.805018387779,10726.57876299094,7120.567493358751,11548.478862113447,7127.686444273035,5832.821305031862,8437.311136049662,6232.780202616029,8537.498911474211,7498.249102012865,7364.439102028858,6566.677339036376,6523.07594889163,7905.10733699037,7616.675231858618,10400.028280361608,7029.353560436353,6065.084575117287,4677.712334196865,8089.79356811989,10040.725168954512,10289.422693821352,6768.853981461289,8824.455120906907,8168.422914664947,7941.4547657956655,9786.018269314636,11774.107167057784,7182.083360928933,10383.813065931836,5215.139525309966,7871.589586243832,7412.365785103925,8139.787761846237,6651.021153244892,9676.400044724414,13703.53250762964,6277.799248011298,7446.613053786819,9974.59735324948,8704.886054139508,4497.067862539886,6309.591252512457,8856.948797606534,8370.313544712484,6091.424464371354,15882.964865871734,10833.964415217893,7995.448577530545,7751.107726713869,7239.673475844754,10598.865825858442,12212.180572695248,7233.344877696304,9780.951194260615,13655.84851165318,11640.545619292712,15999.511711445268,13696.324560863985,3294.208157783604,10588.814982925762,8209.372125689946,6436.971905952303,6601.1055403124965,6991.173353522843,15774.4319037722,12888.901940764943,5825.252903732609,8057.581825535588,6434.942340670091,6789.6026468671425,9116.217991600559,4875.335486912921,9964.0424927839,14844.142840486284,6520.527558771136,8213.56137539092,10482.325123338149,9825.555566465295,13457.458191850224,10025.222782127668,10335.081405891688,27127.819521929974,3446.524391017545,9113.45576140711,9437.095085925816,8742.187409697632,13033.391395461771,15205.072653540874,8472.944665712159,10423.301816803434,6661.726831715021,6547.3865530065605,19766.898270516773,5009.552480672209,7773.543592465561,8120.185574749294,7283.861736581406,10631.333223633836,16051.115792472314,19276.874700403743,6207.783702580286,6596.901932280477,8437.376226182532,11655.700686821972,15924.802969539036,18850.020453968496,7922.478591862848,13321.318043596164,13518.602214597613,11302.380857711212,10383.659199203277,9485.923883072923,7559.416839430183,5761.459069625664,6924.565081487583,7518.840531729941,7064.980009373022,6700.456696992711,7920.479248616696,7707.185448342389,12331.00326950835,9085.3702336102,9173.419642955658,17062.790931850683,13080.706313970275,6252.670947666315,16033.701998186723,17999.01156501045,13623.63737288738,11338.214810579706,6972.302225865512,12520.387901857883,16663.812625436673,7387.510718917089,5610.995252638453,9209.263079426792,11095.544826142876,11229.505248311038,5758.169459174802,16049.05660427556,8535.132739048651,12263.643987736907,8058.801317403147,10479.226173937166,11186.382005598069,7256.542020813723,14009.62949105701,24633.95236582586,7129.454647821008,14463.039687246108,17273.251600544878,17505.19895660656,13809.758413927104,20491.29592659885,11318.638348510727,9424.729997380216,12256.70162763935,14211.200305835438];







x = sort(x);
y = sort(y);
z = sort(z);
a = sort(a);

hold off;
plot(x,'r-x');
hold on;
plot(y,'m-x');
plot(z,'b-x');
plot(a,'k-x');

% semilogy(x,'r-x');

% hist(x);

xlabel('ordered neighborhood');
ylabel('success ratio');
title('neighborhood success ratio');


hold off;


% hist(x);










x = [973.0815441556701,866.0977178485632,441.2276713553818,326.4215905275218,532.1969489562147,351.96439402221506,525.3913085751919,343.55547951556446,409.79429462422075,254.81386397190224,250.23984527338033,267.17373910614157,386.6780044930776,200.13037420001137,295.65008560049375,1341.6787573229096,350.3368244997043,700.024959774169,313.45385416052613,235.00589163785884,354.52094226554647,461.02874067151055,243.816621840495,180.6065014298293,318.5512391689201,280.8340476771938,232.124380581912,139.68913201700366,131.8258082815842,155.323041284227,187.79276570670783,500.9015772735258,259.71816028160777,237.81809271329615,296.0747532918922,295.7405573031264,260.8188522293823,325.9037166532732,341.5759173965541,316.67143647855164,350.8746955328759,135.4268062824549,171.72255749242916,69.8668425865701,173.8472938503048,179.47532434194122,99.64783137698763,109.49161185792659,245.7068571007389,192.13417207748034,252.85952546419233,258.7960166300213,163.30914590104365,190.3086289805548,112.75785774572364,423.4154517586814,649.7329633928131,261.3793093351038,599.3312852214428,502.08754509453826,394.07925968896103,971.5662913857034,1167.6361385069338,549.9521661988673,895.5069185508507,390.91594381162315,531.5519932285443,712.4882088129935,845.7342443715028,643.8529258423458,464.6428629288679,486.43498464016824,303.2193398073635,457.4767609352983,557.9237737296731,447.3060221317876,593.9726563120694,139.31624287529016,149.22095201284543,248.5855932262656,211.41589199140557,93.00478953548452,113.45286342007292,384.0000632675135,236.43042170134405,305.637028115811,289.42925284860934,251.99382707233954,319.4184699845174,432.5692037749742,144.57741304352336,110.79090048762733,171.78927397000533,230.09447032020262,388.02913343341214,251.0773552727806,329.0202116211077,177.8387981324432,184.35487066612518,205.66142458606188,156.0171325682864,146.94467383384185,297.26395311682614,206.39938028870358,439.8270513452712,335.79906618887344,102.28144249364105,106.18922802783044,233.04212875387202,367.2701435637557,292.0454205793429,316.0850617731963,250.4045565373768,331.9201370336582,380.5110704590458,315.7566756867733,349.9205018737005,448.65455053674395,401.5856819234906,355.2704901622485,403.74350722012076,421.80733194741504,412.6333006287219,495.4030559803713,358.0693285063537,440.2163726091475,575.2029086496402,279.70319011049355,421.5948044212781,547.5013081864606,439.447991645634,312.7765424481031,526.4155929808959,623.2763959167519,509.24811208724697,820.4192793523251,689.3658403418711,462.767724888635,232.92049227482443,242.21631020795365,149.3618522676734,227.0592502428077,206.89595629691632,136.8949885710395,155.7520904913092,125.13899398012227,216.39063609632632,119.54298112120797,112.73389368129551,101.6373718830468,141.25148629451348,89.05665345917745,113.13867581033813,187.60737722112736,172.2032758847109,136.021266446513,208.97732044523093,255.5403510848868,161.16734700412525,233.27977789765166,240.58500289006847,171.55718110867855,139.7292157277844,128.157858719361,100.53464504367916,157.00442467491914,159.21254273432626,151.6296633409977,95.89432723246749,103.93629277080342,284.75048062423133,262.99637006955663,216.15235232260108,183.58432075024623,196.50217803268936,88.1529647720724,95.0355889255652,194.16020222541704,324.08280804512066,295.40659518189364,407.0907403296919,263.47277508184976,298.78068803045215,188.51489581928004,216.1288932033835,110.12675763997824,255.43900547286717,173.07189006925807,286.8460741564501,89.71688985094003,108.90511789942762,92.37982353587023,219.81158588093408,120.60831629042555,273.9205284716565,536.2829249456003,245.31158276857235,486.16337906831546,398.3279797141145,588.6106183214547,780.2912885502468,348.51172839275574,380.3246828834987,513.3132381002556,383.73172553437115,364.2269643577532,567.4551139714707,504.34324357244844,568.6842657109042,580.3361885725732,619.5127159925138,540.2379996215324,478.7377254176774,618.3323696374232,763.3565094553599,341.82647969422374,417.8190695644386,590.0277026148242,646.5573140754602,570.9856339245283,493.9966811016763,525.9584969125975,506.6754538708207,445.1363042295746,423.81856313959287,103.6556399205605,121.59085569553547,93.15472873416194,132.30541386331439,129.96867544739123,138.06919626057214,126.83015392456522,114.53965603274571,237.62397971264457,163.7476938127538,142.5300234193525,149.66869592668453,193.50981981673192,313.61807557038867,214.66341849728258,355.11561424425514,252.50077286718007,536.6568596766456,573.4906761507693,582.9636744262813,620.3922768320855,848.7746242006682,827.554061377122,1166.0280351996403,872.8343645457735,515.2996813537292,738.8644726105628,419.2696698305754,623.1336962643529,479.70411073855723,490.236139356136,1113.9014542950242,896.5465496400249,1135.527408522668,548.939838043592,781.2429499193637,623.4767707080454,880.7752215352901,897.8979337923884,998.3539916267983,831.3725039382829,788.6500291954809,783.7233500680775,727.0564103723182,409.0627173362868,429.07430894685655,715.8026480188496,520.6543275854292,490.5568049363462,430.5811443421086,535.0638888040057,734.6656927901306,716.2014091946559,556.1205469852349,707.2957794327054,652.494244671423,573.8477252042168,615.861313415039,531.1246624346819,398.2260388047659,534.977009033977,619.2026507661137,634.0950641103257,537.930865437321,699.9267548813282,592.7703096046806,519.9705462954546,569.9005163366571,434.5663511108479,548.0976813993282,428.8320309703514,490.8963298364972,436.90467733976743,368.3748426224401,305.0456195959612,627.785122207884,582.7698311816301,553.6411575018395,532.7954756137368,475.4983733592228,493.3120408072241,396.0665828501191,414.27651018629916,306.6702279304767,432.12269042281815,467.93355090143723,413.1217161796599,493.8896025192969,368.60103836863135,384.12241366205757,384.9607286369574,491.242339210681,385.5434816784177,504.56259195884564,345.5282490311533,381.74024500189245,280.68010151837956,356.430490487321,327.3825329471051,459.7613135429649,454.9846094027427,573.8672460652539,249.13465282139717,227.10353613108052,235.65450164179063,220.996293369122,236.09983689856028,240.0629343550561,213.68350484688628,177.82388519947946,177.17288265998545,131.13535703849848,132.54101159513417,313.33978067098803,207.33635843867322,161.82873439396727,279.9270034229224,184.79898958374994,193.12938408541913,149.51278226534754,84.29686366001933,165.67088950891602,135.5043110763929,116.80885568001514,136.20833099863577,125.50101668174523,120.66321407628024,180.0348865546249,139.48469257979784,232.06728162190205,71.75177426781809,240.47801798927804,195.4597607564062,517.9809901398858,711.8132891058682,542.3894572181968,403.92404571751956,416.9659603348311,398.6215434057916,309.4625816077525,540.1221558301487,704.1892025445602,300.16915950976727,675.608420440355,554.3919012751004,358.579069967336,326.02015413972487,366.1103167947292,474.8004789157439,295.7547003529663,303.76824348134744,371.41148317022856,353.43687035238815,476.10274974449544,410.7719151770947,721.4137558201061,219.00723208839503,315.9468210968235,281.2404466872536,382.0200159836072,396.4144522978647,401.71317483636324,386.14879717656504,427.76176536260743,404.2715491355342,470.8744841145563,364.2294413209584,430.4574102183672,436.65603730861125,459.53335459335744,397.8366030240457,445.15550884279185,498.49639262237724,446.56676049560974,381.7396955062059,381.28461748658276,537.4099891087365,548.0036114649595,483.75181610322073,587.1794781233667,525.5762160019412,481.678379289864,575.4288391156032,292.58650149086986,395.0209685669252,330.51097351219903,417.6333288759153,414.1425753183473,513.1089360136958,610.9400930876789,375.17602194955396,605.2481269299478,565.951179160698,460.23315559702644,567.0247075953167,579.3557902140046,583.1713928588301,550.7489549290517,698.8080885264881,500.004330607803,892.3494027772545,834.4726354244486,743.2433995856637,1009.5327575989548,844.3387737798528,1044.8030268067027,1142.2556109963248,632.8310711225339,783.7791483683764,578.9175458770196,698.9094979292694,614.6454348629957,868.2863775219088,1090.0683498192643,553.3937682481709,1357.6667383483534,1414.8330411911372,1477.2327924052981,1105.5084264434763,659.569385106798,763.8984809267627,835.5623942235885,741.7429532468823,1002.7755187564,1005.0750574282791,725.3043037508128,716.6556220962702,699.1096916226924,218.5512137429904,137.33049611644256,588.4989308225162,432.18977832011745,449.39902335150106,609.1514841859143,580.552110410595,398.82386112299395,233.14498683225827,307.99162996495835,382.9469551924799,161.66282444960154,95.15132334856399,122.14467499656386,100.98134116867719,110.26688931038423,107.60801396996125,121.21920323756359,109.13199872364979,112.754457801511,105.63884502599522,142.5711287302121,134.4987394770957,146.53137408582728,208.88879825366126,139.67491115091792,101.70844165725767,122.23668205599252,126.18429453379332,128.7897133262184,113.09529223383028,105.14386111724548,164.19188375357012,110.12505537373572,141.0038723820081,150.53382944437845,585.2211641486493,525.7005931260823,426.8331075993229,595.846227457822,606.4855184585812,425.1502763853278,282.03376645296674,384.4329237446787,392.2652915741567,360.4478270127628,319.37932724230524,250.87982578560118,279.0079795196007,311.6245804814348,289.02520450259186,329.87244878956596,299.80555891718626];









x = sort(x);


hold off;
plot(x,'r-x');















% .
