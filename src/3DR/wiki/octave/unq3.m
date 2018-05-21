% 

% NON-EQUAL SSD

% distinct correct:
values0 = [0.025564059298542552,0.02703784889503461,0.03646997972976787,0.03815961412617235,0.03848205969823526,0.039877967062860904,0.04139289592888697,0.044687083031918,0.04646803384515178,0.046992195902127595,0.04725047752550343,0.05658749798105295,0.058388906834244546,0.06023121146075736,0.060394017031747314,0.06189796367112834,0.062233209603225564,0.062287637209518146,0.06468851343623462];

% distinct correct:
valuesA = [0.004630792405271082,0.006819972448698732,0.006830698655153193,0.006935067145972293,0.007055653126190643,0.007363569202623004,0.007496593179589075,0.007529703996195897,0.007716998755845113,0.007879847170192588,0.008540833481226555,0.009524135740666718,0.010557257215071,0.014288212205510523];
% distinct incorrect:
valuesB = [0.005421211920102435,0.0054318355278176805,0.0076187842026351794,0.007848597256033674];

% indistinct correct:
valuesC = [0.00007651170109512838,0.00007979631754361747,0.00009311179958555995,0.00010012597376950835,0.00010050567128202336,0.00010671014142366287,0.00010741907654905542,0.0001299831464566195,0.000167240527259704,0.0006577782757615043,0.0007209625599898713,0.0007369832711784394,0.0007379235944930254,0.0007438356737353701,0.0007467368940492267,0.0007545248579638441,0.0007580746160954609,0.0007666648869131751,0.0007820559557500621,0.0008364330584935257];
% indistinct wrong:
valuesD = [0.0005786977262153925,0.0007859726324868288,0.0010397333840649065];

% noise correct:
valuesE = [0.0025727227836480396,0.0028093794857915327,0.0028360506932655232,0.002849433582296554,0.002873127556140468,0.002900927927614201,0.0029200121985545747,0.0030937446935055523,0.0031033168847717165,0.0032502516657072537,0.003294768007729792,0.00330238738969001,0.003308839009551455,0.003320644721396634,0.003345435305773942,0.0033522738367114686,0.003380276340832696,0.0034346042519457953,0.0034604327767602016,0.0035556884869782125,0.003662591474788448,0.0037018722146430006,0.003890854371837098,0.0038918225596822837,0.0038966213650912535,0.004036072540905737,0.00419568803272673,0.004200839835614001,0.004329987427179505,0.004397478770972344,0.004482953581104004,0.004541613209322634,0.004934499794203703];
% noise wrong:
valuesF = [0.004263235440983259,0.00468456367440934,0.005519754156157155,0.009535257354261877,0.009659343516402259,0.010177058172256705,0.01021221712229979,0.010461604535868654];



hold off;
plot( valuesA, 'r-' );
hold on;
plot( values0, 'r-' );

plot( valuesC, 'm-' );
plot( valuesE, 'm-' );

plot( valuesB, 'b-' );
plot( valuesD, 'b-' );
plot( valuesF, 'b-' );

%plot( valuesX, 'k-' );


% ratio ... not so good
hold off;

values = valuesA;
stem(0,values(1)/values(2), 'r-');
hold on;
values = values0;
stem(1,values(1)/values(2), 'r-');


values = valuesC;
stem(2,values(1)/values(2), 'm-');
values = valuesE;
stem(3,values(1)/values(2), 'm-');

values = valuesB;
stem(4,values(1)/values(2), 'b-');
values = valuesD;
stem(5,values(1)/values(2), 'b-');
values = valuesF;
stem(6,values(1)/values(2), 'b-');




% difference ... OK
hold off;

values = valuesA;
stem(0,values(2)-values(1), 'r-');
hold on;
values = values0;
stem(1,values(2)-values(1), 'r-');


values = valuesC;
stem(2,values(2)-values(1), 'm-');
values = valuesE;
stem(3,values(2)-values(1), 'm-');

values = valuesB;
stem(4,values(2)-values(1), 'b-');
values = valuesD;
stem(5,values(2)-values(1), 'b-');
values = valuesF;
stem(6,values(2)-values(1), 'b-');


% inverse ... OK
hold off;

p = 0.1;

values = valuesA;
stem(0,1/(values(2)-values(1))^p, 'r-');
hold on;
values = values0;
stem(1,1/(values(2)-values(1))^p, 'r-');


values = valuesC;
stem(2,1/(values(2)-values(1))^p, 'm-');
values = valuesE;
stem(3,1/(values(2)-values(1))^p, 'm-');

values = valuesB;
stem(4,1/(values(2)-values(1))^p, 'b-');
values = valuesD;
stem(5,1/(values(2)-values(1))^p, 'b-');
values = valuesF;
stem(6,1/(values(2)-values(1))^p, 'b-');



% score + inverse ... BAD

hold off;

p = 0.1;

values = valuesA;
stem(0,values(1)/(values(2)-values(1))^p, 'r-');
hold on;
values = values0;
stem(1,values(1)/(values(2)-values(1))^p, 'r-');


values = valuesC;
stem(2,values(1)/(values(2)-values(1))^p, 'm-');
values = valuesE;
stem(3,values(1)/(values(2)-values(1))^p, 'm-');

values = valuesB;
stem(4,values(1)/(values(2)-values(1))^p, 'b-');
values = valuesD;
stem(5,values(1)/(values(2)-values(1))^p, 'b-');
values = valuesF;
stem(6,values(1)/(values(2)-values(1))^p, 'b-');




% ... 
hold off;

values = valuesA;
stem(0,values(1)/(values(2)-values(1)), 'r-');
hold on;
values = values0;
stem(1,values(1)/(values(2)-values(1)), 'r-');


values = valuesC;
stem(2,values(1)/(values(2)-values(1)), 'm-');
values = valuesE;
stem(3,values(1)/(values(2)-values(1)), 'm-');

values = valuesB;
stem(4,values(1)/(values(2)-values(1)), 'b-');
values = valuesD;
stem(5,values(1)/(values(2)-values(1)), 'b-');
values = valuesF;
stem(6,values(1)/(values(2)-values(1)), 'b-');


% ... BAD
hold off;

values = valuesA;
stem(0,range(values)/(values(2)-values(1)), 'r-');
hold on;
values = values0;
stem(1,range(values)/(values(2)-values(1)), 'r-');


values = valuesC;
stem(2,range(values)/(values(2)-values(1)), 'm-');
values = valuesE;
stem(3,range(values)/(values(2)-values(1)), 'm-');

values = valuesB;
stem(4,range(values)/(values(2)-values(1)), 'b-');
values = valuesD;
stem(5,range(values)/(values(2)-values(1)), 'b-');
values = valuesF;
stem(6,range(values)/(values(2)-values(1)), 'b-');




% ... BAD
hold off;

values = valuesA;
stem(0,range(values)*(values(2)-values(1)), 'r-');
hold on;
values = values0;
stem(1,range(values)*(values(2)-values(1)), 'r-');


values = valuesC;
stem(2,range(values)*(values(2)-values(1)), 'm-');
values = valuesE;
stem(3,range(values)*(values(2)-values(1)), 'm-');

values = valuesB;
stem(4,range(values)*(values(2)-values(1)), 'b-');
values = valuesD;
stem(5,range(values)*(values(2)-values(1)), 'b-');
values = valuesF;
stem(6,range(values)*(values(2)-values(1)), 'b-');



% ... BAD
hold off;

values = valuesA;
stem(0,(values(2)-values(1))/range(values), 'r-');
hold on;
values = values0;
stem(1,(values(2)-values(1))/range(values), 'r-');


values = valuesC;
stem(2,(values(2)-values(1))/range(values), 'm-');
values = valuesE;
stem(3,(values(2)-values(1))/range(values), 'm-');

values = valuesB;
stem(4,(values(2)-values(1))/range(values), 'b-');
values = valuesD;
stem(5,(values(2)-values(1))/range(values), 'b-');
values = valuesF;
stem(6,(values(2)-values(1))/range(values), 'b-');





