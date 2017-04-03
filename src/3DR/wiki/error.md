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



covariance multipliction


variance v = &sigma<sup>2</sup> = distance sample is from mean
?....... assume one sided = size of window over 2 = w/2
? EG:  |...x...| ; window = 6, v = 3, &sigma; = sqrt(3)
?? OR is window = 6, v = 3


http://www.physics.umd.edu/courses/Phys261/F06/ErrorPropagation.pdf
x_average = [sum (x_i/(s_i^2))] / [sum(1/(s_i^2))]

s_x^2 = ( 1/(sum(s_i^-2)) )^0.5


http://www.webassign.net/question_assets/unccolphysmechl1/measurements/manual.html








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


x = [3, 4]; % measurement
w = [2, 4]; % window
x_avg = sum(x./w) ./ sum(1./w);  % combined measurement
w_avg = ( 1./sum( w.^-1 ) )^0.5; % combined window
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

