% maximals.m


% cost to move edge - bumpy
x = [0.5613806931867956,1.104245348477534,2.109153788566836,3.0280555553762563,2.9657467227643024,3.5653792378988087,5.2234235034006495,10.452537420714524,9.792394825492625,10.780424433163372,12.114464849398432,14.565620933917653,12.639974373076496];
x = [0.01051703633020079,0.03818699876252982,0.12510660823771538,0.22700796916152644,0.4927333690707887,1.1078625203552395,2.514993207077378,6.16359445511592,9.73514433676756,7.3480889749794835,7.065168143084311,8.020654192568802,14.148353718691457];

% SAD scale difference - bumpy
x = [0.014445171225788032,0.029033501557649926,0.04296168531600599,0.03776888480644146,0.023747172188653316,0.022742071278316567,0.04221148234627908,0.0563761343197893,0.05531678083389153,0.052262313110274294,0.05551009875669525,0.058680843992133504];
x = [0.00037485334390600634,0.0010214862220745181,0.0027299143835490085,0.0060933861831628635,0.00851595689786443,0.02042351788114802,0.0390396897490357,0.05761476370534377,0.055158363870869094,0.05058111135220095,0.05763331411590103,0.060532397888156814];

% entropy - typically always increases, bumpy
x = [0,0.16210938084661342,0.45972382991734256,0.5959319922473825,0.6628786483111216,0.6288636962608921,0.613668493474409,0.6640874789437993,0.6767475500645924,0.6881600976695305,0.7066751558534017,0.697493015513308,0.7070169338052363,0.7341242373922865,0.758856877815026,0.7473880676751987,0.7360607443537412,0.7180338999342243,0.737622466041045,0.7668837717269128];
% x = [0,0,0,0,0,0,0.10967644473526993,0.27312484285553,0.46761904044331976,0.5692643078364208,0.6262042681573251,0.6943795100112847,0.7582395963706469,0.7896314806984019,0.8151606404162837,0.825965680143078,0.8110849174901682,0.831611603147609,0.7937625280269596,0.7917635339580441];
% e - large
y = [0,0,0.10549397180000296,0.08821806010639363,0.24971632164323904,0.539371494777333,0.6546800736363672,0.6731105892779449,0.7009036589857828,0.6898479407608996,0.7147123325452014,0.7123679157986869,0.7355953819331835,0.7427266306800998,0.7444102945162707,0.7386029494225714,0.7513634537122368,0.7111371127779809,0.7228270416538612,0.7473094127021441];


%  range - increasing, bumpy
x = [0.06857724112558844,0.15702959361690694,0.31180966218459083,0.34532000221873915,0.41111303762262025,0.427156218588527,0.45247041402863597,0.487179753165892,0.4804502614589258,0.476591624303868,0.4780920818505741,0.4634403976776347,0.49358306189975354,0.5635553235593689,0.560348583877948,0.5502748920540296,0.5611387967654102,0.6043418166087708,0.6502145508837877,0.7906972312734651];
x = [0.0015019984103024908,0.0040149460438306805,0.014672676788514916,0.022781798387458835,0.06562625049980379,0.2534127075733812,0.3154714521502418,0.5545377233788822,0.6582734607104201,0.7034616315662261,0.7181359917402117,0.7679414622992797,0.7957056028803173,0.7879623430660353,0.7978697651899584,0.7995222074720976,0.7983141500388018,0.7951967923911589,0.8182374586155349,0.8000318216971711];

% entropy/range - bumpy
% x = [0,0,0,0,0,0,0.34765885783870243,0.4925270749685685,0.7103720085246292,0.8092329166112145,0.871985634141363,0.9042089066688176,0.952914738347889,1.0021182961940438,1.021671300230569,1.0330740940324703,1.0159971703504762,1.0457934578017483,0.9700882300964476,0.9896650514205962];
x = [0,1.0323492350244454,1.474373265717426,1.7257384119611348,1.6123999670368243,1.4722100929230926,1.3562621432206419,1.3631261862347295,1.4085694282059378,1.4439198311021293,1.4781151637526395,1.5050328348770285,1.432417334346921,1.3026657840007942,1.3542585805487035,1.3582085580634038,1.3117267039752714,1.188125461784905,1.1344293434197226,0.9698829607532591];
% large
y = [0,0,1.268204177507242,0.9327723592247891,0.5675594280553194,1.2340264961804914,1.4286931719956066,1.5101902261100209,1.2724943997760194,1.370546372134874,1.089291849590915,1.3629003227566934,1.1191149846304111,1.3723265501453275,1.3569493957896919,1.324766471898899,1.046948032898788,1.1778877776326637,1.145713673290473,0.9995836028840691];


% entropy * range - bumpy
x = [0,0,0.008775383556940118,0.008343328414451645,0.10987085794467961,0.23574988890334472,0.29999863316896785,0.3000137714870195,0.3860653054867115,0.34722661782743514,0.46894110011383944,0.37234421254881367,0.48350756924242694,0.4019763720690204,0.4083768254742537,0.4117965909219921,0.5392311956604605,0.4293414048209229,0.4560292369083115,0.558704001047919];


% variability
x = [0.0022305087835222544,0.004748277674547618,0.010794193312898737,0.01968646704454274,0.025598667344734375,0.028458380808535556,0.033735920914842524,0.04697265014556363,0.050631887637390724,0.05898651852223761,0.06272078575499096,0.07347315354830174,0.0769744783106587,0.09447577740213332,0.09604243426350384,0.09315083635506574,0.08736568016473908,0.08611311240312529,0.08419031529103169,0.0835030607436365];
y = [0.0007813050813807402,0.0017471454680660643,0.0030141085410259963,0.004724414582626253,0.01610169029726166,0.033348403905579936,0.05191611238105224,0.05232266552860063,0.05625346619467477,0.06226351702560445,0.06605178130721365,0.07372027832739045,0.08678766415205115,0.09024381972896606,0.0906696570624391,0.08846986944871195,0.09424719562224089,0.08467392869443559,0.08678515596639066,0.0867572487711207];


samples = 50;
samples = min(size(x,2),samples);
hold off;

% exact
plot( x(1:samples), 'r-' );
hold on;
plot( y(1:samples), 'b-' );


