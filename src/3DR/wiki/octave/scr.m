% scr.m


% [x, y, z] = peaks (20);
% scatter3 (x(:), y(:), z(:), [], z(:));







x = [47.91106483600935,-0.770313560163706,-0.8762131602865622,-1.5795853769514447,-1.2217019832467773,-1.3478053079059504,-1.3492956167356347,-1.1133654045237973,-1.13359873939136,-0.5801034707592684,-0.2106428190949682,0.019926445544697878,1.0817399958617588,2.7199155713239134,2.864636318252566,3.0899185812314913,5.5702532322920435,0.8455495593809353,0.26026989801948847,1.0978149703884394,0.8716202621277013,0.36105958962476375,0.49280177436112643,0.842272221211112,0.7115756505066486,0.9181026373012378,-1.4075310505321161,1.3921345777271237,3.8060630074655384,3.500635096131881,1.4267925807933703,2.068727255220402,3.407236391795819,3.398438905717315,3.771757891914186,3.748183181965284,2.8444470156909665,43.553874153433824,37.14323391390263,44.59976067256716,40.96032103037069,40.31817628549202,42.166547215029134,43.594567765743754,34.98201430438189,57.057303708632915,3.8781097738916968,4.565332538083778,4.187593009715535,4.426580800536882,4.702221454665863,0.18425407778029393,0.6620228728467309,0.9227304635599398,0.7694556934514873,0.6641821220282595,1.2031421296973102,0.9510431072268462,1.1282059312703687,0.27764421515357807,0.1918333317550908,0.8003094551341897,1.625079276662367,1.5661600999907404,1.9339113935285155,1.918910242468409,2.063728450928394,1.3181243878384215,1.5974539987355636,1.967248748069921,1.6474660227084967,2.493414277039164,2.2677673509197684,2.7743750693700817,2.3538989175305556,1.836938150640858,1.988903889646588,2.7239422639253363,2.253310549749033,1.617316456673279,1.4999930329735958,1.3188349829090864,1.8901986520971399,2.386258701653552,2.053199323324603,1.7034392395507236,1.985889430933489,2.0535652385954872,0.3130955847583835,0.8423783076594887,0.794596293131229,1.0995831129364795,1.1890426922912063,1.5862932033584336,1.850542072346033,1.6593091341208337,1.49273490171589,1.2511609229379248,1.4391403198903066,-0.10938950151287148,3.2880319657474364,3.304059169939324,3.1993443789154234,2.9625899158145477,2.698818349709182,3.278871415778702,3.3707694370530255,3.1039380918119166,3.5600168505339727,4.097386318382116,3.5176276088562792,3.796291768748344,3.847727074407016,2.6466862748332924,2.402468124690886,2.8518193628255815,2.1619557670519005,2.2287507103675823,2.332177761990859,2.604184663679858,3.310856410427334,3.1116395792977545,3.560070216561393,2.861145961055885,3.074287840317055,2.7714327149269016,3.0363677134789135,2.8497087839741435,3.439771060450404,4.202065922310833,4.252785071462728,4.35100958329931,4.431006765108448,4.320931955679507,4.54761171914079,4.9037895741270985,4.230393684802281,4.515345189041932,3.8467030313370043,3.704686302557515,3.424576958833583,4.987435269712252,4.033186654493429,2.3129541304005485,2.0921628074072776,2.5442374190199595,2.3837699175136073,2.266500634643331,2.1314676982709773,2.3557626505606586,2.5479852287671862,2.7408114920825066,2.997625081331262,2.9749991021756514,2.6539870363642333,2.4056080621787954,2.587560725343605,2.855905178559056,2.9754916938796883,2.85408705437315,2.187454226614168,2.097433997003994,2.3779786226227735,3.295096346184097,3.467432382400549,3.3015725652406114,3.485226854890997,3.264549021325468,3.2275086697195077,3.3846979130316606,3.333788681848981,3.137581711615838,3.1184746152645197,3.3382732977950473];

y = [46.54949923493425,-2.5869191943347793,-2.110582902366623,-1.3395179636421277,-1.581643111992457,-1.6681740350811585,-0.8607523263179526,-1.1847125687472275,-1.1009201802270523,-0.4648947108982907,-0.39685810145300227,0.3286232039759514,-4.20278067183228,-6.08551077299351,-6.3032072791317635,-5.757822815984728,-6.7029404533966765,-0.6422047004841496,-0.8794522786490321,-1.1356752866150657,-0.5476732355014328,-0.34159099623437317,-0.400950537647773,-0.4863516071651535,-0.2772458486390693,-0.04287504999978591,1.2026931558627432,-0.8321034573019485,-1.1940616889998146,-0.9655807092581968,-0.12298140171375947,0.1172638493906202,-0.3497322063177547,-0.4771836536923261,-0.15417766217114903,-0.19194907737814415,0.29220531315226167,-25.517513047741076,-20.659360435675392,-20.861413126920738,-22.001136117007718,-20.80516922079562,-19.842295425410104,-17.340623083259747,-16.064490943549153,-24.47448501406394,0.29122736384414516,-1.3450573766429708,0.04890218618471736,0.14316598964562494,0.29004459166465146,0.5166281750014895,0.4165363619402087,0.4721143806916029,0.8080515638341289,0.9075911276849533,0.8587019919797361,0.8439852541771737,0.9685336659406355,0.9564433107908882,1.2659029837260087,1.4498226198279573,0.6277585171740501,0.7382727960270408,0.5846430435414118,0.7113640135766732,0.709157292261909,0.9500864310439983,0.9040312684357825,0.8307534365636299,0.9834481875459518,0.547606080379311,0.7568131884143667,0.43993708964626466,0.8142211691100022,0.9795329577850354,1.1208970601432675,0.8708991662710349,1.038480710963446,1.2219256090936501,1.3298075919768042,1.3503623631015824,1.202217457432802,1.1776441677495602,1.280848943906168,1.3930582806798406,1.4934375844575636,1.6622950242640653,1.635874673279083,1.5257737374769471,1.8352452158656927,1.6624808165898768,1.7366650372230281,1.6516713983216595,1.6788367517470402,1.8268042834696447,1.8560764843138766,1.9458379194418178,2.013418287387727,-0.1725911613939402,0.6039578059271349,0.7805472460014965,0.8932014585285344,1.0758657413408443,1.2053444525040924,1.0055108197546048,0.9033450932225203,1.1847088495200202,0.7285079492464088,0.7031108189130959,1.0231804157414737,0.971858781504111,1.2144486160921593,1.3342135147785847,1.3557135718048108,1.2412166345771727,1.4649407860771964,1.4936562234435742,1.693733423609485,1.7580409359907572,1.3212501060834867,1.3822215169241205,1.2759483816484631,1.5149152659897371,1.501369118691301,1.7108746610290442,1.6659962463583902,1.7794512544928527,1.6510163544896035,0.5435560207706893,0.9618216456841171,0.9997193465759685,1.2322533593546234,1.1951420068417096,1.2729263111027687,1.1824331926976273,1.3369802025024584,1.454480551164636,1.7229556505960602,1.7968754875863304,1.7733836108060022,1.4583986330142165,1.5349109077901144,1.802851215469576,1.9078519094233606,1.843632313112967,1.8887722138832488,2.028286911109462,2.0910503914754854,2.1348402181499804,2.014711041578329,1.9993156001721404,1.9789877554446602,2.0633355807283467,2.1028261355826943,2.1781992545682285,2.2372111373059083,2.1944659509507782,2.2147677026980337,2.265331062364099,2.184469257378823,2.1528841271988566,2.2822216099284605,1.9551965657380328,1.914930206614515,1.7671123954164463,1.8558972639220244,1.8801182802857015,2.179884928275323,2.309829865875118,2.389681854268875,2.392826126239723,2.4983061438209395,2.463040279204303];

z = [-110.96987399324689,11.113561019687651,10.070209966423763,8.052124700908001,8.24613234729645,9.411161019645636,8.488002843081503,8.560501677753338,9.072952283726432,6.723254099699356,6.717005962006643,8.719672641145154,16.792933996339794,22.540403211067744,21.77077676232685,22.361022131560738,24.665062707519777,3.0429926283587845,8.718046643896251,8.910645657329516,6.585772548829263,7.878624192132332,8.042908012386729,9.009381328125734,8.096745734229993,6.963539780599447,-6.616960125298162,7.831059072418157,12.36094178567742,11.794848980824803,8.46775882945956,10.267695512637214,12.131528267556233,11.157373361700797,13.15085676865394,12.279698499988621,10.375139257835059,85.33845021879692,76.1255953236855,90.92670663909047,81.05957823417066,75.32497055231698,82.22836195880701,87.14747847223215,64.38439475424107,141.65948961136795,10.75661841920011,9.715242938808966,9.189410407243727,9.368268242625348,9.627101286050712,8.467555107660198,7.2952899910238775,7.240248899771581,7.593378522987428,7.1671322737564545,7.897613021103918,7.52554650909711,7.605874620135523,6.825285476395697,5.834525733418854,5.9804495784318865,8.850571109758306,8.60791056957117,9.332074825879417,9.006146493967059,9.027550413506322,7.731696665663889,8.220643582241149,8.744017070037492,7.99521175180042,10.135034492498702,9.199513107014331,9.676054174400898,9.04173802195126,7.736261634328961,7.919968991347118,9.186726186886235,8.470547152034776,7.345286317649056,7.072781575972396,6.949625320050165,7.598965336929658,7.948737422018706,7.345414500781437,7.0893964323139125,6.943422454391526,6.91491299598495,5.139476621493479,5.507071698585914,5.2534377676040025,5.914821237959569,5.901138029566916,6.415991193556866,6.671371836650845,6.123709922050926,5.906654022624251,5.41056451148309,5.525848958015807,-0.3858981024561659,10.305577419702391,9.423172831372806,9.434797804805063,8.736617736446961,8.340636856678636,9.395021565021628,9.194987114763917,8.764083123232634,9.308528487735765,9.193642206372644,9.297178063798771,9.311812595544483,9.212307859660786,7.892907011590233,7.385482202020442,8.335183017361802,7.144323309417172,6.876791651935307,6.965624903630372,7.05523443566475,8.626847978932009,8.212516388372116,8.634968118416946,7.442660452012026,7.429987024206029,7.112991552768018,7.34477726174121,7.084754355396598,7.826797819221128,9.070529035512958,9.09550434225791,9.006313977327235,9.528293149019339,8.899398290402678,9.01649654513858,9.447284538015147,8.739072963393792,8.981871150929068,8.09732158684045,7.865351974821273,7.585728210649778,9.384980574855382,7.481179696259116,6.857914382781738,6.4144657376032725,7.000425466162612,6.606667556231816,6.335821621944951,6.047661571183155,6.266237174184729,6.645898691680088,6.7903850067137785,6.989081250090556,6.8298847946044505,6.59252254085853,6.163185075455352,6.255350998614068,6.615027414521776,6.611320100123112,6.462310264140649,6.034913189978948,5.65374770648829,5.977588306884407,7.126556794844038,7.385442398478884,6.654486930484613,6.734858992637341,6.494457629665524,6.900181614346623,6.856849555946771,6.7681430225269965,6.54608171276171,6.402365251527367,6.656340309245181];

hold off;
x = [];
y = [];
z = [];
scatter3 (x(:), y(:), z(:), [], "r", "filled");
hold on;
scatter3 (0, 0, 0, [], "k", "");
scatter3 (1, 0, 0, [], "m", "");
scatter3 (0, 1, 0, [], "g", "");
scatter3 (0, 0, 1, [], "b", "");
axis("equal");




x = [-0.324535391561213,-0.4017955731071419,-0.4790557546530708,-0.5563159361989998,-0.6335761177449286,-0.7108362992908576,-0.7880964808367865,-0.8653566623827155,-0.9426168439286443,-1.0198770254745733,0.17001502846935512,0.0927548469234262,0.015494665377497302,-0.06176551616843168,-0.13902569771436057,-0.21628587926028947,-0.29354606080621837,-0.37080624235214743,-0.44806642389807627,-0.5253266054440052,-0.15045639851158873,-0.0536375870078937,0.04318122449580128,0.14000003599949637,0.23681884750319135,0.33363765900688636,0.43045647051058133,0.5272752820142765,0.6240940935179715,0.7209129050216665,0.34409402151897883,0.4409128330226738,0.5377316445263688,0.6345504560300639,0.7313692675337589,0.8281880790374538,0.9250068905411488,1.021825702044844,1.118644513548539,1.215463325052234];

y = [-0.2815670285665919,-0.28235267217133125,-0.2831383157760707,-0.2839239593808101,-0.2847096029855495,-0.2854952465902889,-0.28628089019502834,-0.28706653379976776,-0.28785217740450714,-0.28863782100924656,0.279995741357113,0.27921009775237365,0.2784244541476342,0.2776388105428948,0.2768531669381554,0.276067523333416,0.27528187972867657,0.27449623612393714,0.27371059251919777,0.27292494891445834,-0.25778688666780375,-0.2347923883737548,-0.21179789007970584,-0.18880339178565686,-0.16580889349160793,-0.14281439519755895,-0.11981989690351,-0.09682539860946102,-0.07383090031541206,-0.05083640202136311,0.3037758832559017,0.32677038154995064,0.3497648798439996,0.3727593781380486,0.3957538764320976,0.4187483747261465,0.44174287302019544,0.4647373713142445,0.4877318696082934,0.5107263679023424];

z = [0.8638866717652309,0.8004024444987955,0.7369182172323601,0.6734339899659245,0.609949762699489,0.5464655354330535,0.4829813081666181,0.41949708090018256,0.356012853633747,0.2925286263673116,-0.9908551262981019,-1.0543393535645373,-1.1178235808309729,-1.1813078080974084,-1.2447920353638438,-1.3082762626302793,-1.3717604898967148,-1.4352447171631502,-1.498728944429586,-1.5622131716960213,0.9175032353154184,0.9076355715991707,0.8977679078829229,0.8879002441666751,0.8780325804504274,0.8681649167341796,0.8582972530179318,0.848429589301684,0.8385619255854363,0.8286942618691885,-0.9372385627479141,-0.9471062264641619,-0.9569738901804096,-0.9668415538966574,-0.9767092176129052,-0.986576881329153,-0.9964445450454007,-1.0063122087616485,-1.0161798724778963,-1.0260475361941441];
scatter3 (x(:), y(:), z(:), [], "m", "filled");



x = [-0.2215173528442136,-0.19575949567314313,-0.17000163850207267,-0.14424378133100219,-0.1184859241599317,-0.09272806698886124,-0.06697020981779075,-0.04121235264672027,-0.015454495475649782,0.010303361695420676,0.27303306718635456,0.29879092435742505,0.3245487815284955,0.35030663869956596,0.37606449587063645,0.4018223530417069,0.42758021021277737,0.45333806738384785,0.47909592455491834,0.5048537817259888,-0.2687720166813301,-0.2902688233473764,-0.3117656300134227,-0.33326243667946903,-0.35475924334551534,-0.3762560500115617,-0.39775285667760796,-0.4192496633436543,-0.44074647000970063,-0.46224327667574694,0.22577840334923746,0.20428159668319112,0.18278479001714482,0.1612879833510985,0.1397911766850522,0.11829437001900589,0.09679756335295958,0.07530075668691324,0.053803950020866936,0.03230714335482063];

y = [-0.37256265882559386,-0.46434393268933527,-0.5561252065530766,-0.647906480416818,-0.7396877542805593,-0.8314690281443008,-0.9232503020080421,-1.0150315758717836,-1.106812849735525,-1.1985941235992663,0.18900011109811107,0.09721883723436969,0.00543756337062834,-0.08634371049311307,-0.17812498435685442,-0.2699062582205958,-0.3616875320843371,-0.4534688059480786,-0.5452500798118199,-0.6370313536755613,-0.18416168163274305,-0.08754197830363336,0.009077725025476269,0.10569742835458601,0.20231713168369564,0.29893683501280527,0.3955565383419149,0.49217624167102475,0.5887959450001343,0.685415648329244,0.3774010882909624,0.4740207916200721,0.5706404949491817,0.6672601982782915,0.7638799016074012,0.8604996049365108,0.9571193082656204,1.0537390115947303,1.15035871492384,1.2469784182529495];

z = [0.8971594680509328,0.8669480370701992,0.8367366060894654,0.8065251751087318,0.7763137441279981,0.7461023131472645,0.7158908821665309,0.6856794511857971,0.6554680202050635,0.6252565892243298,-0.9575823300124001,-0.9877937609931338,-1.0180051919738675,-1.048216622954601,-1.0784280539353348,-1.1086394849160686,-1.138850915896802,-1.1690623468775359,-1.1992737778582696,-1.2294852088390031,0.9416018593561649,0.9558328196806637,0.9700637800051624,0.9842947403296611,0.9985257006541598,1.0127566609786585,1.0269876213031572,1.041218581627656,1.0554495419521546,1.0696805022766533,-0.9131399387071676,-0.8989089783826688,-0.8846780180581701,-0.8704470577336714,-0.8562160974091727,-0.841985137084674,-0.8277541767601753,-0.8135232164356766,-0.7992922561111778,-0.7850612957866792];
scatter3 (x(:), y(:), z(:), [], "g", "filled");



x = [-0.30530448832757084,-0.3633337666398576,-0.4213630449521444,-0.4793923232644312,-0.5374216015767179,-0.5954508798890048,-0.6534801582012915,-0.7115094365135783,-0.7695387148258651,-0.8275679931381519,0.1892459317029973,0.1312166533907105,0.07318737507842374,0.015158096766136941,-0.04287118154614983,-0.1009004598584366,-0.15892973817072337,-0.2169590164830102,-0.27498829479529696,-0.33301757310758373,-0.23446876467808733,-0.22166231934089087,-0.20885587400369443,-0.196049428666498,-0.18324298332930156,-0.17043653799210512,-0.15763009265490868,-0.14482364731771222,-0.13201720198051578,-0.11921075664331934,0.26008165535248023,0.27288810068967667,0.2856945460268731,0.29850099136406955,0.311307436701266,0.3241138820384624,0.3369203273756589,0.34972677271285535,0.3625332180500518,0.3753396633872482];

y = [-0.32047496797063657,-0.36016855097942063,-0.3998621339882047,-0.4395557169969888,-0.47924930000577287,-0.5189428830145569,-0.5586364660233409,-0.5983300490321252,-0.6380236320409092,-0.6777172150496933,0.24108780195306836,0.20139421894428428,0.16170063593550021,0.12200705292671613,0.08231346991793206,0.042619886909148,0.0029263039003639135,-0.0367672791084202,-0.07646086211720426,-0.11615444512598833,-0.29243839902205737,-0.304095413082262,-0.3157524271424666,-0.32740944120267124,-0.3390664552628759,-0.3507234693230805,-0.3623804833832851,-0.3740374974434898,-0.3856945115036944,-0.397351525563899,0.2691243709016481,0.25746735684144345,0.24581034278123884,0.23415332872103423,0.22249631466082959,0.21083930060062495,0.19918228654042033,0.1875252724802157,0.17586825842001108,0.16421124435980644];

z = [0.9984836428015418,1.069596386571417,1.1407091303412924,1.2118218741111677,1.2829346178810428,1.354047361650918,1.4251601054207934,1.4962728491906687,1.567385592960544,1.6384983367304193,-0.8562581552617912,-0.7851454114919159,-0.7140326677220407,-0.6429199239521654,-0.5718071801822902,-0.5006944364124148,-0.4295816926425396,-0.35846894887266423,-0.28735620510278903,-0.21624346133291372,1.0258600303154053,1.1243491615991443,1.2228382928828834,1.3213274241666224,1.4198165554503617,1.5183056867341005,1.6167948180178398,1.7152839493015788,1.8137730805853178,1.9122622118690569,-0.8288817677479272,-0.7303926364641882,-0.6319035051804491,-0.53341437389671,-0.43492524261297094,-0.3364361113292319,-0.23794698004549286,-0.1394578487617537,-0.04096871747801467,0.05752041380572437];
scatter3 (x(:), y(:), z(:), [], "b", "filled");





















% ...