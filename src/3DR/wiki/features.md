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


