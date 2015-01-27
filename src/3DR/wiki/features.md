# Features


<br/>
**Laplacean (Laplace operator):** &nabla;&middot;&nabla; = &nabla;<sup>2</sup> = &Sigma;<sub>i</sub> &part;<sup>2</sup>f/&part;x<sub>i</sub><sup>2</sup>
<br/>
&nabla;<sup>2</sup>&middot;f = (scalar) rate of change o of average value of f (measured over the a sphere: &rho; @ p) deviates from f(p) as &rho; increases
<br/>
<br/>
*2D Matrix Operator Form*: Sum of second derivative in x and y directions
```
[0   1   0]
[1  -4   1]
[0   1   0]
```

<br/>
**Gaussian:** G<sub>&sigma;</sub> = 1/(sqrt(2&pi;)&sigma;)&middot;exp[-x<sup>2</sup>/(2&sigma;<sup>2</sup>)]
<br/>
2D: G<sub>&sigma;</sub> = 1/(2&pi;&sigma;<sup>2</sup>)&middot;exp[-(x<sup>2</sup> + y<sup>2</sup>)/(2&sigma;<sup>2</sup>)]
<br/>
Used for smoothing / noise filtering
<br/>
<br/>
Succeessive Gaussian filtering: G<sub>&sigma;<sub>A</sub></sub> &lowast; G<sub>&sigma;<sub>B</sub></sub> = G<sub>&sigma;<sub>C</sub></sub>, &sigma;<sub>C</sub> = sqrt[(&sigma;<sub>A</sub>&middot;&sigma;<sub>B</sub>)/(&sigma;<sub>A</sub> + &sigma;<sub>B</sub>)]
<br/>
<br/>
G<sub>&sigma;<sub>C</sub></sub> = 1/(sqrt(2&pi;)&sigma;<sub>A</sub>)&middot;exp[-x<sup>2</sup>/(2&sigma;<sub>A</sub>)] &middot; 1/(sqrt(2&pi;)&sigma;<sub>B</sub>)&middot;exp[-x<sup>2</sup>/(2&sigma;<sub>B</sub>)]
<br/>
G<sub>&sigma;<sub>C</sub></sub> = 1/(sqrt(2&pi;)sqrt(2&pi;)&sigma;<sub>A</sub>&sigma;<sub>B</sub>)&middot;exp[-x<sup>2</sup>/(2&sigma;<sub>A</sub>) - x<sup>2</sup>/(2&sigma;<sub>B</sub>)]
<br/>
G<sub>&sigma;<sub>C</sub></sub> = 1/(2&pi;&sigma;<sub>A</sub>&sigma;<sub>B</sub>)&middot;exp[-x<sup>2</sup>(&sigma;<sub>A</sub>+&sigma;<sub>B</sub>)/(2&sigma;<sub>A</sub>&sigma;<sub>B</sub>)]
<br/>
G<sub>&sigma;<sub>C</sub></sub> = 1/(2&pi;&sigma;<sub>A</sub>&sigma;<sub>B</sub>)&middot;exp[-x<sup>2</sup>/(2(&sigma;<sub>A</sub>&sigma;<sub>B</sub>)/(&sigma;<sub>A</sub>+&sigma;<sub>B</sub>))]
<br/>
...derivation probably has to also account for non-zero mean...
<br/>
G<sub>&sigma;<sub>C</sub></sub> = 1/(sqrt(2&pi;)
sqrt[(&sigma;<sub>A</sub>&sigma;<sub>B</sub>)/(&sigma;<sub>A</sub>+&sigma;<sub>B</sub>)]
)&middot;exp[-x<sup>2</sup>/(2(&sigma;<sub>A</sub>&sigma;<sub>B</sub>)/(&sigma;<sub>A</sub>+&sigma;<sub>B</sub>))]
<br/>
G<sub>&sigma;<sub>C</sub></sub> = 1/(sqrt(2&pi;)&sigma;<sub>C</sub>)&middot;exp[-x<sup>2</sup>/(2&sigma;<sub>C</sub>))]
<br/>


<br/>
**Laplace/ian of Gaussian:** -1/(&pi;&sigma;<sup>4</sup>)&middot;[1 - (x<sup>2</sup> + y<sup>2</sup>)/(2&sigma;<sup>2</sup>)]&middot;exp[-(x<sup>2</sup> + y<sup>2</sup>)/(2&sigma;<sup>2</sup>)]
<br/>
Used to find edges in image
<br/>
*2D Matrix Operator Form*: ?
```
[0  -1   0]        [-1 -1 -1]
[-1  4  -1]   OR   [-1  8 -1]
[0  -1   0]        [-1 -1 -1]
```

<br/>
**Difference of Gaussian:**
<br/>
DoG(f) = f&lowast;G<sub>&sigma;<sub>1</sub></sub> - f&lowast;G<sub>&sigma;<sub>2</sub></sub>
<br/>
DoG(f) = 1/sqrt(2&pi;)&middot;[(1/&sigma;<sub>1</sub><sup>2</sup>)&middot;exp[-(x<sup>2</sup>+y<sup>2</sup>)/(2&sigma;<sub>1</sub><sup>2</sup>) - (1/&sigma;<sub>2</sub><sup>2</sup>)&middot;exp[-(x<sup>2</sup>+y<sup>2</sup>)/(2&sigma;<sub>2</sub><sup>2</sup>)]
<br/>

<br/>
<br/>
<br/>
<br/>


**Hessian Detector:** maximas of: det(H(x,&sigma;)) = I<sub>xx</sub>I<sub>yy</sub> - I<sub>xy</sub><sup>2</sup>
<br/>
[I<sub>xx</sub> I<sub>xy</sub>]
[I<sub>xy</sub> I<sub>yy</sub>]
<br/>
want large and about equal eigenvalues : tra(C)<sup>2</sup>/det(C) = (r+1)<sup>2</sup>/r
<br/>
det(C) - &alpha;tra(c)<sup>2</sup> &gt; t
<br/>
<br/>





Harris Corner Detector

<br/>
<br/>
<br/>
<br/>


Harris-Laplacian

<br/>
<br/>
<br/>
<br/>

<br/>
<br/>
<br/>
<br/>


**Ellipse-Fitting:**
<br/>





**Circle:**
<br/>
distance from point x<sub>i</sub> from edge of circle
<br/>
d<sub>i</sub> = ||c - x<sub>i</sub>|| - r
<br/>
d<sub>i</sub> = sqrt( (c<sub>x</sub>-x<sub>i</sub>)<sup>2</sup> + (c<sub>y</sub>-y<sub>i</sub>)<sup>2</sup> ) - r
<br/>
<br/>
_chain rule:_ [f(g)]'= f'(g) &middot; g'
<br/>
<br/>
f: x<sup>1/2</sup>
<br/>
f': (1/2)&middot;x<sup>-1/2</sup>
<br/>
g: (c<sub>x</sub>-x)<sup>2</sup> + (c<sub>y</sub>-y)<sup>2</sup>
<br/>
g': ((c<sub>x</sub>-x)<sup>2</sup>)' + 0 = (c<sub>x</sub><sup>2</sup> - 2c<sub>x</sub>&middot;x + x<sup>2</sup>)' = 2c<sub>x</sub> - 2x + 0 = 2(c<sub>x</sub> - x)
<br/>
f'(g)&middot;g' = (1/2)&middot;((c<sub>x</sub>-x)<sup>2</sup> + (c<sub>y</sub>-y)<sup>2</sup>)<sup>-1/2</sup> &middot; 2(c<sub>x</sub> - x) = 
<br/>
= (c<sub>x</sub>-x) / sqrt((c<sub>x</sub>-x)<sup>2</sup> + (c<sub>y</sub>-y)<sup>2</sup>)

<br/>
&part;d<sub>i</sub>/&part;c<sub>j</sub> = (c<sub>x</sub> - x<sub>i<sub>x</sub></sub>) / sqrt( (c<sub>x</sub> - x<sub>i<sub>x</sub></sub>)<sup>2</sup> + (c<sub>y</sub> - x<sub>i<sub>y</sub></sub>)<sup>2</sup> )
<br/>

<br/>
<br/>


**Ellipse:**
<br/>
x<sup>T</sup>&middot;A&middot;x + b<sup>T</sup>&middot;x + c = 0
<br/>
x = Q&middot;x' + t
<br/>
A' = Q<sup>T</sup>&middot;A&middot;Q
<br/>
b' = b<sup>T</sup>t
<br/>
c' = c ?
<br/>
<br/>
&rArr;
<br/>
<br/>
x'<sup>T</sup>&middot;A'&middot;x' + b'<sup>T</sup>&middot;x' + c' = 0
<br/>
<br/>
A' = diag(&lambda;<sub>1</sub>,&lambda;<sub>2</sub>)
<br/>
<br/>
z = t
<br/>
a = sqrt(-c'/&lambda;<sub>1</sub>)
<br/>
b = sqrt(-c'/&lambda;<sub>2</sub>)
<br/>
<br/>
det(A) = &lambda;<sub>1</sub>&middot;&lambda;<sub>2</sub>
<br/>
tra(A) = &lambda;<sub>1</sub> + &lambda;<sub>2</sub>
<br/>
<br/>
&kappa; = a/b
<br/>
&kappa;<sup>2</sup> = &mu; &plusmn; &radic; &mu;<sup>2</sup> - 1 )
<br/>
&mu = tra(A)<sup>2</sup>/(2&middot;det(A)) - 1

<br/>
<br/>
u = (a<sub>11</sub>,2a<sub>12</sub>,a<sub>22</sub>,b<sub>1</sub>,c)<sup>T</sup>
<br/>
v = (b<sub>1</sub>,b<sub>2</sub>,c)<sup>T</sup>
<br/>
w = (a<sub>1q</sub>,&radic;2)&middot;a<sub>12</sub>,a<sub>s2</sub>)<sup>T</sup>
<br/>

<br/>
<br/>

<br/>
<br/>

<br/>
<br/>

<br/>
<br/>

- algebraic (different constraints)
   - &lambda;<sub>1</sub> + &lambda;<sub>2</sub> = 1
   - ^ && dot(w,w) = 1
- geometric



<br/>
<br/>






(d/dx)|x| = x/|x|
<br/>
(d/dx)|u| = (u/|u|)*(du/dx)
<br/>





<br/>
<br/>
<br/>
http://www.emis.de/journals/BBMS/Bulletin/sup962/gander.pdf
<br/>

<br/>

<br/>

<br/>



(http://www.cs.utexas.edu/~grauman/courses/fall2009/papers/local_features_synthesis_draft.pdf)[yerp]

http://www.vlfeat.org/api/sift.html

http://www.inf.fu-berlin.de/lehre/SS09/CV/uebungen/uebung09/SIFT.pdf





- find best fit affine transform around feature area
- http://www.cs.cornell.edu/courses/cs664/2008sp/handouts/cs664-6-features.pdf
- 
- RANSAC BEST DLT
- 
- drop points that have multiple maxima/minima
- 
- 


