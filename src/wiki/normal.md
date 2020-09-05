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




maximum a posteriori / parameter esimation / mode / maximum likelihood estimation
https://ermongroup.github.io/cs228-notes/inference/map/ ============================== https://github.com/ermongroup/cs228-notes/tree/master/inference
	- MAP inference

https://www.cse.ust.hk/bnbook/pdf/l06.h.pdf
https://www.cse.ust.hk/bnbook/pdf/l06.h.pdf
https://arxiv.org/pdf/1703.06045.pdf
http://pages.cs.wisc.edu/~dpage/cs760/BNall.pdf
http://www.stat.columbia.edu/~gelman/arm/chap18.pdf
http://www.cs.cmu.edu/~guestrin/Class/10701-S05/slides/EM-3-30-2005.pdf



https://www.csd.uoc.gr/~hy473/DHS_book/DHSChap3.pdf



- Bayesian Estimation MLE
- log liklihood

- Forward-backward algorithm is an instance of a generalized Expectation-Maximization algorithm. --- MN ?
- Baum–Welch algorithm -- MN ?
- Bayesian Expectation-Maximization-Maximization (Bayesian EMM, or BEMM). As a new maximum likelihood estimation (MLE) alternative to the marginal MLE EM (MMLE/EM) 

- The Chow-Liu algorithm
- GIBBS SAMPLING ???

- Prim’s algorithm for finding an MST
- Kruskal’s algorithm for finding an MST


https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/6-825-techniques-in-artificial-intelligence-sma-5504-fall-2002/lecture-notes/Lecture16FinalPart1.pdf
- sampling










INFERENCE:
https://ermongroup.github.io/cs228-notes/inference/jt/
http://pages.cs.wisc.edu/~dpage/cs760/BNall.pdf
https://people.eecs.berkeley.edu/~jordan/courses/281A-fall04/lectures/lec-11-16.pdf
- Junction Tree


exact:
https://www.cs.cmu.edu/~epxing/Class/10708-14/scribe_notes/scribe_note_lecture4.pdf
- VE












