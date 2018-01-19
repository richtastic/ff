# Error


**sample number** : N
<br />
**sample value** : x<sub>i</sub>
<br />
**sample probability** : p<sub>i</sub> _[equal probabilities = (1/N)]_ , _[aka confidence]_
<br />
**mean** : &mu; = (1/N) &middot; &Sigma;<sub>i=1..N</sub>( x<sub>i</sub> )
<br />
**standard deviation** : &sigma; = sqrt(&Sigma;<sub>i=1..N</sub> (p<sub>i</sub> &middot;(x<sub>i</sub> - &mu;)<sup>2</sup>) ) _[unbias: 1/(N-1)]_
<br />


**rectangular distribution** : 3<sup>-1</sup>
**triangular distribution** : 6<sup>-1</sup>


measurement X = T (true value) + e<sub>r</sub> (random error) + e<sub>s</sub> (systematic/bias error)



**Measurement 1** : v<sub>1</sub> &plusmn; e<sub>1</sub>
**Measurement 2** : v<sub>2</sub> &plusmn; e<sub>2</sub>
&sigma;<sub>1</sub>
&sigma;<sub>2</sub>


**Combined Measurement** : v<sub>3</sub> &plusmn; e<sub>3</sub>



v<sub>3</sub> = ?
e<sub>3</sub> = ?


#### Uncertainty Propagation


1/&sigma;&radic;2&pi;) * e<sup>-(x-&mu;)<sup>2</sup>/(2&sigma;<sup>2</sup>)</sup>



x<sub>combined</sub> = &Sigma;<sub>i</sub>[x<sub>i</sub>/w<sub>i</sub>] / &Sigma;<sub>i</sub>[1/w<sub>i</sub>]
<br/>
= (x<sub>0</sub>/w<sub>0</sub> + &hellip; + x<sub>n-1</sub>/w<sub>n-1</sub>) / (1/w<sub>0</sub> + &hellip; + 1/w<sub>i</sub>)
<br/>
<br/>
w<sub>combined</sub> = 1/&radic;&Sigma;[1/(w<sub>i</sub>)])
<br/>
= 1/&radic;1/w<sub>0</sub> + &hellip; + 1/w<sub>n-1</sub>)
<br/>
&sigma;<sup>2</sup> = w
<br/>


with measurement x<sub>i</sub> &plusmn; e<sub>i</sub>:
<br/>
assume e<sub>i</sub> = &sigma;




x_avg = SUM(x_i / s_i / SUM(1/s_i) 
x_avg = [1/s_i * SUM(x_i)]/[ N / s_i ]
x_avg = 1/N * SUM(x_i)



x_avg = sum(x./w) ./ sum(1./w);  % combined measurement
w_avg = ( 1./sum( w.^-1 ) )^0.5; % combined window




covariance multipliction


variance v = &sigma<sup>2</sup> = distance sample is from mean
?....... assume one sided = size of window over 2 = w/2
? EG:  |...x...| ; window = 6, v = 3, &sigma; = sqrt(3)
?? OR is window = 6, v = 3


http://www.physics.umd.edu/courses/Phys261/F06/ErrorPropagation.pdf
x_average = [sum (x_i/(s_i^2))] / [sum(1/(s_i^2))]

s_x^2 = ( 1/(sum(s_i^-2)) )^0.5


http://www.webassign.net/question_assets/unccolphysmechl1/measurements/manual.html

http://ipl.physics.harvard.edu/wp-uploads/2013/03/PS3_Error_Propagation_sp13.pdf

https://en.wikipedia.org/wiki/Propagation_of_uncertainty








x = [3, 4]; % measurement
w = [2, 1]; % window
N = size(x,2); % sample size
pTot = sum(w); % total window
p = 1 - (w / pTot); % probabilities of x -- smaller window is 'more likely' ?
u = (1/N) * sum( x );
s = (sum( (p.*x).^2 ))^0.5;
N
u
s



sum(x./w) ./ sum(1./w) 

( 1./sum( w.^-1 ) )^0.5


x = 3.666

x = [3, 4, 5, 4.5]; % measurement
w = [2, 1, 3, 0.1]; % window
x_avg = sum(x./w) ./ sum(1./w);  % combined measurement
w_avg = ( 1./sum( w.^-2 ) )^0.5; % combined window
x_avg
w_avg




>> x = [3, 4]; % measurement
>> w = [1, 2]; % window
x_avg =  3.3333
w_avg =  0.81650


>> x = [3, 4]; % measurement
>> w = [2, 4]; % window
x_avg =  3.3333
w_avg =  1.1547




%%% COMBINING MULTIPLE MEASUREMENTS WITH DIFFERENT VALUES / ERROR WINDOWS
% get normal distribution
mu = 1.0;
sigma = 2.0;
N = 10;
x = zeros(1,N);
w = zeros(1,N);
% various error windows
for i=1:N
	value = normrnd(mu,sigma);
	x(1,i) = value;
	% err = normrnd(0,1.0);
	w(1,i) = abs(value-mu).^2 * 2.0;
end
% combine for best measurement:
x_avg = sum(x./w) ./ sum(1./w);  % combined measurement
w_avg = ( 1./sum( w.^-1 ) )^0.5; % combined window
x_avg
w_avg



### emperically why s = ...1/N-1 is not better than 1/N:
```



// estimates
var popMean = 2;
var popVariance = 4;
var popStdDev = Math.sqrt(popVariance);
var samples = 20;
var sampleList = [];
var str = "x = [";

var tests = 10000;
var error_x = 0;
var error_s = 0;
for(j=0; j<tests; ++j){
//var stry = "y = [";
for(i=0; i<samples; ++i){
	var sample = Code.randGauss();
	sample = (sample * popStdDev) + popMean;
	sampleList.push(sample);
	//console.log(sample);
	str = str + sample+" ";
	//stry = stry + i+" ";
}


var x_estimated = 0;
var s_estimated = 0;
var N = sampleList.length;

for(i=0; i<sampleList.length; ++i){
	var sample = sampleList[i];
	x_estimated += sample;
}
x_estimated = x_estimated * (1.0/(N));
for(i=0; i<sampleList.length; ++i){
	var sample = sampleList[i];
	s_estimated += Math.pow(sample - x_estimated, 2);
}
// s_estimated = s_estimated * (1.0/(N-1));
s_estimated = s_estimated * (1.0/(N));
error_x += Math.abs(x_estimated-popMean);
error_s += Math.abs(s_estimated-popVariance);
//console.log("N: "+x_estimated+" & "+s_estimated+" => "+(x_estimated/popMean)+" & "+(s_estimated/popVariance));
}
error_x = error_x / tests;
error_s = error_s / tests;
console.log("ERROR: X: "+error_x+"  S: "+error_s);

// AGGREGATED:
// N @ 10k & 20:
// X: 0.010171537715168193  S: 0.026244029764377716.  [2.58]
// X: 0.008408973875459944  S: 0.013207679045854464.  [1.57]
// X: 0.005789194575139369  S: 0.01434390243625075.   [2.47]
//      & 0.01793187041
//
// N-1 @ 10k & 20:
// X: 0.005450045354247298  S: 0.027262865072992467.  [5.00]
// X: 0.008961241158141018  S: 0.030953132866280323.  [3.45]
// X: 0.006134307205512736  S: 0.018307177948700255.  [2.98]

// N     @ 10k & 10:
// ERROR: X: 0.007762821957347239  S: 0.019499489417222852. []
// ERROR: X: 0.010252822528260831  S: 0.07121504387130675.  []
// ERROR: X: 0.005471236332167926  S: 0.02241726264357304.  []
//
// N-1 @  @ 10k & 10:
// ERROR: X: 0.007455169352202575  S: 0.024925373557877332. []
// ERROR: X: 0.009465612799499382  S: 0.02089171516581277.  []
// ERROR: X: 0.015548541668697877  S: 0.04981123578215828.  []

// N @ 10k & 5
// X: 0.02076282054702618   S: 0.04956882339157864
// X: 0.018423255403122667  S: 0.02464755123383738
// X: 0.020445589999276904  S: 0.04288936506995899

// N-1 @1k @ 5
// X: 0.0204126638010845.   S: 0.07432888574771175
// X: 0.019579319303822302  S: 0.025914802899428525
// X: 0.017250174054895026  S: 0.05406594154357116


// n-1 is for finding SOME population .. not necessarily THE population ... 







// N
// 10   2.098698019707279 & 4.457225784151487 => 1.0493490098536395 & 1.1143064460378718
// 50   2.224110106787248 & 4.171577588152065 => 1.1120550533936242 & 1.0428943970380162
// 100  1.976588026802131 & 4.458588232574254 => 0.9882940134010655 & 1.1146470581435635
// 500  2.091814634790062 & 3.574484241718978 => 1.045907317395031  & 0.8936210604297447

// N-1
// 10  2.708465612015692 & 7.032599729117983 => 1.354232806007846  & 1.7581499322794958
// 50  1.724706097197921 & 3.592799433402003 => 0.8623530485989604 & 0.8981998583505009
// 100 1.786921959765507 & 4.125880542291376 => 0.8934609798827535 & 1.031470135572844
// 500 2.088094479579666 & 4.034692133865853 => 1.044047239789833  & 1.0086730334664633

str = str + "];\n";
str = str + "y = ones(1,size(x,2));\n";
str = str + 'stem(x,y);\m';
str = str + "\n";
//str = str + 'plot(x,""r-*)';
//console.log(str);

return;
```

