# Normal Distribution





```
sigma = %
0.5 = 0.3829
1.0 = 0.6827
1.5 = 0.8664
2.0 = 0.9545
2.5 = 0.9875
3.0 = 0.9973
4.0 = 0.9999
```



# Exponential distribution

&mu; = average([x])
&sigma; = &mu;
&lambda; = 1/&mu;

pdf = &lambda; &middot; e<sup>(-&lambda;&middot;x)</sup>
cdf = 1 - &middot; e<sup>(-&lambda;&middot;x)</sup>

percent limit: limit = -log(1-p)/&lambda;



var a = [1,2,10];
var a = [0,1,2,3,10];
var a = [1,2,3,4,5,6,7];

var a = [1,2];


var a = [1,2,10];
var min = Code.min(a);
var b = [];
for(var i=0; i<a.length;++i){
	b[i] = a[i] - min;
}
var sigma = Code.averageNumbers(b);
var lambda = 1.0/sigma;
var percent = 0.01; // 0.90-0.95
var limit = -Math.log(1-percent)/lambda;
limit += min;
limit

 1% = 1.0335
10% = 1.35
25% = 1.95
50% = 3.31
75% = 5.6
90% = 8.67
95% = 10.98
99% = 16.35



// var sigma = Code.averageNumbers(a);



var sigma = Code.stdDev(a,min);










