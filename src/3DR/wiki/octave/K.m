% K.m
width = 816;
height = 612;
wth = width/height;
htw = 1.0/wth;


K_3 = [6.3968E+2  1.3995E+0  3.9999E+2 ; 
   0.0000E+0  7.2687E+2  5.5121E+2 ; 
   0.0000E+0  0.0000E+0  1.0000E+0 ; ];


K_3_N = [7.6998E-1 -1.3762E-3  4.8956E-1 ; 
   0.0000E+0  8.8197E-1  6.9728E-1 ; 
   0.0000E+0  0.0000E+0  1.0000E+0 ; ];



K_4 = [7.7010E+2  1.7690E+0  4.0330E+2 ; 
   0.0000E+0  7.7060E+2  3.1327E+2 ; 
   0.0000E+0  0.0000E+0  1.0000E+0 ; ];



K_4_N = [9.4291E-1  2.1627E-3  4.9426E-1 ; 
   0.0000E+0  9.4356E-1  3.8473E-1 ; 
   0.0000E+0  0.0000E+0  1.0000E+0 ; ];




K_5 = [7.6671E+2 -4.8574E-1  3.9730E+2 ; 
   0.0000E+0  7.6478E+2  3.1377E+2 ; 
   0.0000E+0  0.0000E+0  1.0000E+0 ; ];

K_5_N = [9.3896E-1 -4.3514E-4  4.8711E-1 ; 
   0.0000E+0  9.3662E-1  3.8504E-1 ; 
   0.0000E+0  0.0000E+0  1.0000E+0 ; ];



K_6 = [7.6500E+2  1.4537E+0  4.0247E+2 ; 
   0.0000E+0  7.6093E+2  3.1158E+2 ; 
   0.0000E+0  0.0000E+0  1.0000E+0 ;];

K_6_N = [ 9.3712E-1 -1.7608E-3  4.9322E-1 ; 
   0.0000E+0  9.3219E-1  3.8206E-1 ; 
   0.0000E+0  0.0000E+0  1.0000E+0 ;];





3

K_3(1,3)/width
K_3(2,3)/height

K_3_N(1,3)/1.0
K_3_N(2,3)/htw


4

K_4(1,3)/width
K_4(2,3)/height

K_4_N(1,3)/1.0
K_4_N(2,3)/htw


5

K_5(1,3)/width
K_5(2,3)/height

K_5_N(1,3)/1.0
K_5_N(2,3)/htw


6

K_6(1,3)/width
K_6(2,3)/height

K_6_N(1,3)/1.0
K_6_N(2,3)/htw




