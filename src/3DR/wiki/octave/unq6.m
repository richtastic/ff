% 

% NON-EQUAL SSD

% distinct correct:
values0 = [0.12476976224789706,0.21418799108755165,0.28866855218937565,0.359940755388631];
values1 = [0.041234843461862604,0.05324280287736597,0.05382548442387504,0.05624124158196577,0.0672799187095454];
values2 = [0.01289990777098798,0.023952222487873962,0.02615988383992659,0.02677471761752278,0.03091548136743542,0.0318114351474845,0.034939548306653884,0.04858004361835344,0.05302152962770457];
values3 = [0.07222761010921351,0.15357560196248685,0.3721385233282235];



% distinct correct:
valuesA = [0.04299812298799202,0.05514046986190606,0.05578324024957601,0.058209648471400276,0.05894770062491766,0.05911326504650757,0.060482750024456175,0.062082986691816486,0.06545127132456388,0.06972127033449484,0.070252874365575,0.09515926404526266,0.10353289167453397];
% distinct incorrect:
valuesB = [0.07721757707808408,0.08147973836981626,0.08680083768811933,0.08684962383563337,0.09193552583563076,0.09405905276900339];


% indistinct correct:
valuesC = [0.005467202160260057,0.005618615405028864,0.005691635105882894,0.005894421383485965,0.006604324592667603,0.006731883064193236,0.006778650237209251,0.006885435085904124,0.007096944874157251,0.007252474611382187,0.007507317467414375,0.011420179331949578,0.011437137586709238,0.011632931997918464,0.011663088392476149,0.011850158869041102];
% indistinct wrong:
valuesD = [0.01956966134267812,0.021080878022612055];



% noise correct:
valuesE = [0.05912421592844335,0.06036903953103208,0.06108546635150734,0.06340485099410971,0.06548401497404964,0.06553039055219954,0.06584046116056073,0.06593633794005745,0.06605759548866555,0.06613385985561021,0.06618709318831505,0.06622839162203377,0.06651513056825963,0.06652959441951853,0.06676225108214796,0.06745429528305547,0.06760711736476438,0.068242091464582,0.06939416785120961,0.07051715457987343,0.07079169069433136,0.07162257383660031,0.07246093318398238,0.0726842985394885,0.07301248282888298,0.07317004851543929,0.07405127708859262,0.07419716075898537,0.07451008673576061,0.07556077075562481,0.07606534118036624,0.07617908690080007,0.07652020354428768,0.07681119610689821,0.07789274213758568,0.07826510634666414,0.07853169568164228,0.07894927285130195,0.07927733388014602,0.0795447367446835,0.07993820229764947,0.08010498596399877,0.08037671980164147,0.08073066716034612,0.08177678435556471,0.08282388893130066,0.08538250459888753];
% noise wrong:
valuesF = [0.10454517901775978,0.10515971062349087,0.11994344684511633,0.17412890113164506,0.17552332703549173,0.19349029799246648,0.2002341960181176,0.21604615184525067];




hold off;
plot( valuesA, 'r-' );
hold on;
plot( values0, 'r-' );
plot( values1, 'r-' );
plot( values2, 'r-' );
plot( values3, 'r-' );

plot( valuesC, 'm-' );
plot( valuesE, 'm-' );

plot( valuesB, 'b-' );
plot( valuesD, 'b-' );
plot( valuesF, 'b-' );

