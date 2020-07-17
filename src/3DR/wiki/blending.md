# Blending
*Removing Seams At Region Boundaries*



1) Feathering 
2) Gradient
3) Poisson Equation

<br/>


## Feathering
Transparent/Alpha from 1-0 & 0-1
	Pyramid Blending
	




- frequency blending
    - blending textures at different frequencies (blurr)

pyramid blending
http://graphics.cs.cmu.edu/courses/15-463/2005_fall/www/Lectures/Pyramids.pdf
pyramid blending - gradients

http://www.bmva.org/bmvc/2002/papers/49/full_49.pdf

https://web.cs.dal.ca/~sbrooks/thesis/Interactive-Gradient-Domain-Texture-Blending.pdf

process:
    - graph cut on a low res image (faster)
        - if separate triangles:
            - do per-triangle
            - try to do in some kind of expanded planar way
    - pyramid blend around seams







Laplacian Blending? multiple levels?


&int;
&conint;
&cwint;
&cwconint;
&awconint;

&Int;
&Conint;

&iiint;
&Cconint;



## Common Definitions

### Gradient (vector [directional] derivative) [of scalar f]
*measure of direction (and magnitude) of greatest increase at a point*
<br/>
grad(f) &equiv; &nabla;f &equiv; &lt;&part;/&part;x,&part;/&part;y,&part;/&part;z&gt;f
<br/>

### Divergence (scalar [dot] derivative) [of vector f]
*measure of flux (source/sink-ness) of a point*
<br/>
div(f) &equiv; &nabla;&middot;f &equiv; (&part;/&part;x,&part;/&part;y,&part;/&part;z) &middot; f &equiv; lim<sub>V&rarr;0</sub> &Conint;<sub>S</sub> (**f**&dot;d**A**)/||**V**|| ; S=&part;**V**

### Curl (cross derivative) [of vector f]
*measure of rotation (direction and magnitude) of a given point*
<br/>
curl(f) &equiv; &nabla;&times;f &equiv; &lt;&part;/&part;x,&part;/&part;y,&part;/&part;z&gt; &times; f &equiv; lim<sub>A&rarr;0</sub> &conint;<sub>C</sub>(**f**&middot;d**S**/||**A**||) ; C=&part;**A**
<br/>

### Laplacian (Operator [scalar]) [div(grad(f))] [of scalar f]
Second derivative of a function
<br/>
**Laplacian** &equiv; &nabla;&middot;&nabla; &equiv; &nabla;<sup>2</sup> &equiv; (&part;<sup>2</sup>/&part;x<sup>2</sup> + &part;<sup>2</sup>/&part;y<sup>2</sup> + &hellip;)

### First Derivative
**1D numeric:**
<br/>
&fnof;&prime;(x) = [&fnof;(x+&Delta;) - &fnof;(x-&Delta;)] / [2&middot;&Delta;]
<br/>
**1D visualization:**
<br/>
```
[-1, 0, 1] * 1/(2*delta) ~ [-0.5, 0, 0.5]
```

### Second Derivative
**1D numeric:**
<br/>
&fnof;&Prime;(x) = [&fnof;(x+&Delta;) - 2&middot;&fnof;(x) + &fnof;(x-&Delta;)] / [&Delta;<sup>2</sup>]
<br/>
**1D Visual:**
<br/>
```
[1, -2,  1] * 1/(delta) ~ [-1, 2, 1]
```
<br/>
**2D visual:**
<br/>
```
[0  -1  0]                      [ 0 -1  0]
[-1  4 -1] * 1/(delta*delta) =  [-1  4 -1]
[0  -1  0]                      [ 0 -1  0]
```

### Poisson Equation
&nabla;<sup>2</sup>&middot;&fnof; = g ; [g = 4&pi;&rho;]

### Laplace Equation
*(poisson @ right hand null)*
<br/>
&nabla;<sup>2</sup>&middot;&fnof; = 0

### Dirichlet Boundary Condition (of function) [on a surface &Omega; with boundary &part;&Omega;]
&fnof;(x) = g(x) : &forall;x &isin; &part;&Omega;
<br/>
eg 1D: interval [a,b] : f(a) = &alpha;,  f(b) = &beta;

### Neumann Boundary Condition (of normal derivative) [on a surface &Omega; with boundary &part;&Omega;]
&nabla;&fnof;(x)&middot;**n**(x) = (&part;&fnof;/&part;**n**)(x) = g(x) : &forall;x &isin; &part;&Omega;
<br/>
eg 1D: interval [a,b] : f&prime;(a) = &alpha;,  f&prime;(b) = &beta;

### Edgel

<br/>
<br/>

<br/>


### Wavelet


<br/>
<br/>

<br/>


### Gauss-Seidel Iteration



<br/>
<br/>

<br/>



## Poisson Image Editing Terms:

Place an image ? on top of image ?, with final imaging in this intersect area appearing as ?.

<br/>
&fnof;&ast; = image destination (known)
<br/>
&fnof; = image overlay (unknown)
<br/>
S = destination region (subset of &reals;<sup>2</sup>)
<br/>
&Omega; = destination region, subset of S
<br/>
&part;&Omega; = boundary of &Omega;
<br/>
g = source image?
<br/>
**v** = guidance field = &nabla;g (always? &rarr; &nabla;<sup>2</sup>f = &nabla;<sup>2</sup>g)
<br/>
~&fnof; = correction function
<br/>
&fnof; = g + ~&fnof; (if **v** is conservative)
<br/>
&nabla;<sup>2</sup>~&fnof; = 0 (over &Omega;)
<br/>

find minimum of the absolute gradient:
<br/>
min<sub>&fnof;</sub>&Int;<sub>&Omega;</sub>||&nabla;&fnof; - **v**||<sup>2</sup>
<br/>
with boundary equal:
<br/>
&fnof;|<sub>&part;&Omega;</sub> = &fnof;&ast;|<sub>&part;&Omega;</sub>
<br/>
&rArr;
<br/>
&Delta;&fnof; = &nabla;<sup>2</sup>&fnof; = div(**v**) (over &Omega;)
<br/>

<br/>
**Discrete Definitions**
<br/>
p = pixel in &Omega;
<br/>
N<sub>p</sub> = 4-point neighborhood of pixel p
<br/>
|N<sub>p</sub>| = count of neighborhood of p &le; 4 (if S is on border)
<br/>
&lt;p,q&gt; = pixel pair p and q : q &isin; N<sub>p</sub>
<br/>
&part;&Omega; = {p &isin; S\&Omega; : N<sub>p</sub> &Intersection; &Omega; &ne; &empty;}
<br/>
&nu;<sub>p,q</sub> = projection of **v**((p+q)/2) on orientated edge [p,q]
<br/>
&nu;<sub>p,q</sub> = g<sub>p</sub> - g<sub>q</sub> [11] maybe not always?
<br/>
find minimization:
<br/>
min<sub>&fnof;|&Omega;</sub> &Sum;<sub>&lt;p,q&gt;&Intersection;&Omega;&ne;&empty;</sub> (&fnof;<sub>p</sub> - &fnof;<sub>q</sub> - &nu;<sub>p,q</sub>)<sup>2</sup> ; &fnof;<sub>p</sub> = &fnof;&ast;<sub>p</sub> , &forall;<sub>p</sub> &isin; &part;&Omega;
<br/>
will satisfy:
<br/>
|N<sub>p</sub>|&middot;&fnof;<sub>p</sub> - &Sum;<sub>q&isin;N<sub>p</sub>&Intersection;&Omega;</sub> &fnof;<sub>q</sub> = &Sum;<sub>q&isin;N<sub>p</sub>&Intersection;&part;&Omega;</sub> &fnof;&ast;<sub>q</sub> + &Sum;<sub>q&isin;N<sub>p</sub></sub> &nu;<sub>p,q</sub> , &forall;<sub>p</sub> &isin; &part;&Omega;
<br/>

<br/>


<br/>
**Mixing Gradients** -- retain stronger of guidance field [mixed seamless cloning?]
<br/>
&forall;<sub>**x** &isin; &Omega;</sub> **v**(**x**) = {&nabla;&fnof;&ast;(**x**) if |&nabla;&fnof;&ast;(**x**)| > |&nabla;g(**x**)| ; &nabla;g(**x**) else}
<br/>
&nu;<sub>p,q</sub> = { &fnof;&ast;<sub>p</sub> - &fnof;&ast;<sub>q</sub> if |&fnof;&ast;<sub>p</sub> - &fnof;&ast;<sub>q</sub>| > |g<sub>p</sub>-g<sub>q</sub>| , |g<sub>p</sub>-g<sub>q</sub>| else}
<br/>

<br/>

<br/>
<br/>
||&nabla;&fnof;||<sup>2</sup> = &fnof;<sub>x</sub><sup>2</sup> + &fnof;<sub>y</sub><sup>2</sup>
<br/>
&Delta;&fnof;(x,y) &asymp; f<sub>x-1,y</sub> - 2&middot;f<sub>x,y</sub> + f<sub>x+1,y</sub>  +  f<sub>x,y-1</sub> - 2&middot;f<sub>x,y</sub> + f<sub>x,y+1</sub> = f<sub>x-1,y</sub> + f<sub>x,y-1</sub> + f<sub>x+1,y</sub> + f<sub>x,y+1</sub> - 4&middot;f<sub>x,y</sub>
<br/>
f<sub>x,y-1</sub> = x<sub>i-w</sub>
<br/>
f<sub>x,y+1</sub> = x<sub>i+w</sub>
<br/>
x<sub>i-w</sub> + x<sub>i-1</sub> - 4&middot;x<sub>i</sub> + x<sub>i+1</sub> = - f(x,y+1)
<br/>
**A**<sub>N&times;N</sub> &middot; **x**<sub>N&times;1</sub> = **b**<sub>N&times;1</sub>
<br/>
```
[1 ... 1 -4 1 ... 1     ... ]   [x1]   [0]
[ 1 ... 1 -4 1 ... 1    ... ]   [x2]   [0]
[  1 ... 1 -4 1 ... 1   ... ] * [x3] = [b1]
[                       ... ]   [..]   [b2]
[                       ... ]   [..]   [0]
```
<br/>




<br/>

&ast;

&midast;

&star;

&Star;

&dot;

&sdot;

&middot;

<br/>
<br/>

<br/>

....
<br/>
<br/>


<br/>
<br/>



<br/>
<br/>
<br/>


<br/>


<br/>
<br/>





## Poisson Equation:



Blending 2nd derivatives

&nabla;<sup>2</sup> &middot; &phi; = &fnof;
<br/>
**in 3D:**
<br/>
(&part;<sup>2</sup>/&part;x<sup>2</sup>,&part;<sup>2</sup>/&part;y<sup>2</sup>,&part;<sup>2</sup>/&part;z<sup>2</sup>) &middot; &phi;(x,y,z) = &fnof;(x,y,z)
<br/>
**in 2D:**
<br/>
(&part;<sup>2</sup>/&part;x<sup>2</sup>,&part;<sup>2</sup>/&part;y<sup>2</sup>) &middot; &phi;(x,y) = &fnof;(x,y)
<br/>
&approx;
<br/>
[&phi;(x+2&middot;&Delta;<sub>x</sub>,y) - 2&middot;&phi;(x+&Delta;<sub>x</sub>,y) + &phi;(x,y)]/&Delta;<sub>x</sub> + [&phi;(x,y+2&middot;&Delta;<sub>y</sub>) - 2&middot;&phi;(x,y+&Delta;<sub>y</sub>) + &phi;(x,y)]/&Delta;<sub>y</sub> = &fnof;(x,y)
<br/>
<br/>
KNOWN: &phi;(x,y), &rArr; &nabla;<sup>2</sup>&middot;&phi;
<br/>
UNKNOWN: &fnof;(x,y) [solved for at energy minimization]
<br/>
In 2D pixel grid case: trying to solve for unknown pixel values [&phi;(x,y)] when some energy function describing border smoothness is minimized [ie SVD]

<br/>
<br/>

<br/>
<br/>

**E<sub>0</sub>**: energy function? to minimize?
<br/>
**E<sub>1</sub>**: energy function? to minimize?
<br/>
**E<sub>2</sub>**: energy function? to minimize? offset based equation to solve (h&rArr;f)
<br/>
**f<sub>i,j</sub>**: final (target) image 
<br/>
**g<sub>i,j</sub>**: final (target) image gradient [doesn't look true based on equations]
<br/>
**q<sub>i,j</sub> = ~g<sub>i,j</sub>**: final (target) image gradient offsets (0 away from seams)
<br/>
**s<sub>i,j</sub>**: gradient constraints (smoothness weights)
<br/>
**u<sub>i,j</sub>**: unblended (original) images
<br/>
**l<sub>i,j</sub>**: pixel labels (assigned image source for each pixel)
<br/>
**w<sub>i,j</sub>**: weight?
<br/>
**h<sub>i,j</sub>**: offset?
<br/>
**S**: pixel spacing (subsampling)
<br/>
<br/>

<br/>
Regular:
<br/>
*g<sup>x</sup><sub>i,j</sub>* = u<sup>l<sub>i,j</sub></sup><sub>i+1,j</sub> - u<sup>l<sub>i,j</sub></sup><sub>i,j</sub>
<br/>
*g<sup>y</sup><sub>i,j</sub>* = u<sup>l<sub>i,j</sub></sup><sub>i,j+1</sub> - u<sup>l<sub>i,j</sub></sup><sub>i,j</sub>
<br/>
<br/>
Around Boundaries = average (same when l<sub>i,j</sub> equal):
<br/>
*g<sup>x</sup><sub>i,j</sub>* = (u<sup>l<sub>i,j</sub></sup><sub>i+1,j</sub> - u<sup>l<sub>i,j</sub></sup><sub>i,j</sub> + u<sup>l<sub>i+1,j</sub></sup><sub>i+1,j</sub> - u<sup>l<sub>i+1,j</sub></sup><sub>i,j</sub>)/2
<br/>
*g<sup>y</sup><sub>i,j</sub>* = (u<sup>l<sub>i,j</sub></sup><sub>i,j+1</sub> - u<sup>l<sub>i,j</sub></sup><sub>i,j</sub> + u<sup>l<sub>i,j+1</sub></sup><sub>i,j+1</sub> - u<sup>l<sub>i,j+1</sub></sup><sub>i,j</sub>)/2
<br/>
<br/>

<br/>
*s<sup>x</sup><sub>i,j</sub>* = 1/[1 + (g<sup>x</sup><sub>i,j</sub>/a<sup>2</sup>)]
<br/>
a = 0.0313725 (5/255), [5 when range is 8-bits: 0-255]
<br/>
<br/>

E<sub>1</sub> = &Sum;<sub>i,j</sub> s<sup>x</sup><sub>i,j</sub>&middot;[f<sub>i+1,j</sub> - f<sub>i,j</sub> - g<sup>x</sup><sub>i,j</sub>]<sup>2</sup> + s<sup>y</sup><sub>i,j</sub>&middot;[f<sub>i,j+1</sub> - f<sub>i,j</sub> - g<sup>y</sup><sub>i,j</sub>]<sup>2</sup>

<br/>
<br/>

Weak Constraint (towards color in original image (u<sup>l<sub>i,j</sub></sup><sub>i,j</sub>):
<br/>

E<sub>0</sub> = &Sum;<sub>i,j</sub> w<sub>i,j</sub>&middot;[f<sub>i,j</sub> - u<sup>l<sub>i,j</sub></sup><sub>i,j</sub>]<sup>2</sup>

<br/>
<br/>
w<sub>i,j</sub> = 1E-4 (reduces low freq variation)
<br/>
<br/>



<br/>
f<sub>i,j</sub> = u<sup>l<sub>i,j</sub></sup><sub>i,j</sub> + h<sub>i,j</sub>
<br/>
<br/>


<br/>
Modified gradient ~q is zero outside boundaries, and valued as below on boundary regions:
<br/>
q<sup>x</sup><sub>i,j</sub> = ~g<sup>x</sup><sub>i,j</sub> = (u<sup>l<sub>i,j</sub></sup><sub>i,j</sub> - u<sup>l<sub>i+1,j</sub></sup><sub>i,j</sub> + u<sup>l<sub>i,j</sub></sup><sub>i+1,j</sub> - u<sup>l<sub>i+1,j</sub></sup><sub>i+1,j</sub>)/2
<br/>
q<sup>y</sup><sub>i,j</sub> = ~g<sup>y</sup><sub>i,j</sub> = (u<sup>l<sub>i,j</sub></sup><sub>i,j</sub> - u<sup>l<sub>i,j+1</sub></sup><sub>i,j</sub> + u<sup>l<sub>i,j</sub></sup><sub>i,j+1</sub> - u<sup>l<sub>i,j+1</sub></sup><sub>i,j+1</sub>)/2
<br/>


E<sub>2</sub> = &Sum;<sub>i,j</sub> s<sup>x</sup><sub>i,j</sub>&middot;[h<sub>i+1,j</sub> - h<sub>i,j</sub> - q<sup>x</sup><sub>i,j</sub>]<sup>2</sup> + s<sup>y</sup><sub>i,j</sub>&middot;[h<sub>i,j+1</sub> - h<sub>i,j</sub> - q<sup>y</sup><sub>i,j</sub>]<sup>2</sup> + w<sub>i,j</sub><sup>2</sup>&middot;[h<sub>i,j</sub>]<sup>2</sup>

<br/>
Multiple Offset Maps:
<br/>

f<sub>i,j</sub> = u<sup>l<sub>i,j</sub></sup><sub>i,j</sub> + h<sup>l<sub>i,j</sub></sup><sub>i,j</sub> [12]
<br/>

E<sub>3</sub> = &Sum;<sub>i,j</sub> s<sup>x</sup><sub>i,j</sub>&middot;[h<sup>l<sub>i+1,j</sub></sup><sub>i+1,j</sub> - h<sup>l<sub>i,j</sub></sup><sub>i,j</sub> - q<sup>x</sup><sub>i,j</sub>]<sup>2</sup> + s<sup>y</sup><sub>i,j</sub>&middot;[h<sup>l<sub>i,j+1</sub></sup><sub>i,j+1</sub> - h<sup>l<sub>i,j</sub></sup><sub>i,j</sub> - q<sup>y</sup><sub>i,j</sub>]<sup>2</sup> + w<sub>i,j</sub><sup>2</sup>&middot;[h<sup>l<sub>i,j</sub></sup><sub>i,j</sub>]<sup>2</sup> [13]

<br/>
<br/>
Spline Offset Maps:

c = ? spline control variables -- encodes *h* somehow
<br/>
b(i) = 1D B-Spline Basis Function
<br/>
B(i,j) = b(i)&middot;b(j) [15]
<br/>
h<sup>l</sup><sub>i,j</sub> = &Sum;<sub>k,m</sub> c<sup>l</sup><sub>k,m</sub>&middot;B(i-k&middot;S,j-m&middot;S) [14]

<br/>

E<sub>4</sub> = E3 with new h substituted

<br/>
<br/>
<br/>

<br/>
<br/>
K = order of interpolant
<br/>
d = dimensionality of field
<br/>
inner loop of least squares setup = iterating over all pixels, pulling out (K+1)<sup>d</sup> non-zero B-spline basis function values
<br/>
- sparse
- 4 off diagonal smoothness terms
- off diagonal terms at image boundaries
<br/>
nested dissection re-order
<br/>
<br/>


Inside spline patches where all pixels are from same source, simplifications apply (precompute ahead of time):
<br/>
s = s<sup>x</sup><sub>i,j</sub> = s<sup>y</sup><sub>i,j</sub>
<br/>
w = w<sub>i,j</sub>
<br/>
<br/>

 E<sup>l</sup> = &Sum;<sub>k,m</sub> s&middot;[c<sup>l</sup><sub>k+1,m</sub> - c<sup>l</sup><sub>k,m</sub>]<sup>2</sup> + s&middot;[c<sup>l</sup><sub>k,m+1</sub> - c<sup>l</sup><sub>k,m</sub>]<sup>2</sup> + S<sup>2</sup>&middot;w&middot;[c<sup>l</sup><sub>k,m</sub>]<sup>2</sup> [16]
<br/>
<br/>


Multiplicative Gain: take logarithm of input images before computing seam difference
<br/>
<br/>
<br/>
<br/>

<br/>
<br/>
<br/>


<br/>
<br/>
<br/>


<br/>
<br/>
<br/>

## Upsampling


### Bilateral Filter
*nonlinear edge-preserving smoother*
<br/>
I = original image
<br/>
I&ast; = filtered image &equiv; J
<br/>
x = operating pixel point (reference) &equiv; **x** &equiv; &lt;x,y&gt;
<br/>
||I(x<sub>i</sub>) - I(x<sub>j</sub>)|| = absolute intensity difference between pixels
<br/>
||x<sub>i</sub> - x<sub>j</sub>|| = absolute distance between pixels
<br/>
&Omega; = window centered on x
<br/>
f<sub>r</sub> = range kernel for smoothing differences in intensities
<br/>
g<sub>s</sub> = spacial kernal for smoothing differences in coordinates
<br/>
W<sub>x</sub> = &Sum;<sub>&Omega;</sub> f<sub>r</sub>(||I(x<sub>i</sub>) - I(x)||) &middot; g<sub>s</sub>(||x<sub>i</sub> - x||)
<br/>
I&ast;(x) = (1/W<sub>x</sub>) &Sum;<sub>&Omega;</sub> I(x<sub>i</sub>) &middot; f<sub>r</sub>(||I(x<sub>i</sub>) - I(x)||) &middot; g<sub>s</sub>(||x<sub>i</sub> - x||)
<br/>
```
for each pixel p in I
	J[p] = 0
    Wx = 0
    for each pixel q in I // in neighborhood only, ||p-q|| le 2*sigma_d
    	w = Gdis(distance(p,q)) * Gint(abs(I[p]-I[q]))
        J[p] += w * I[q]
        Wx += w
    end
    J[p] /= Wx
end
Gdis = Gaussian with sigma_d
Gint = Gaussing with sigma_i
```
<br/>
<br/>
https://en.wikipedia.org/wiki/Bilateral_filter
<br/>
http://www.sandia.gov/~egboman/papers/HUND.pdf
http://www.cs.tau.ac.il/~stoledo/Pubs/wide-simax.pdf

<br/>
<br/>
<br/>


<br/>
<br/>
<br/>

<br/>
<br/>
<br/>

<br/>
<br/>
<br/>

<br/>
<br/>
<br/>

<br/>
<br/>
<br/>


## Nested Dissection


<br/>
<br/>
<br/>
<br/>

[Poisson Image Editing](https://www.cs.jhu.edu/~misha/Fall07/Papers/Perez03.pdf)

[Drag-and-Drop Pasting](http://research.microsoft.com/pubs/69331/dragdroppasting_siggraph06.pdf)

[Efficient Gradient-Domain Compositing Using Quadtrees](http://www.agarwala.org/efficient_gdc/preprint.pdf)

[Fast Poisson Blending using Multi-Splines](http://www.msr-waypoint.net/pubs/144582/Szeliski-ICCP11.pdf)

[Seamless Image Stitching in the Gradient Domain](http://www.wisdom.weizmann.ac.il/~levina/papers/blendingTR.pdf)


[Efficient Poisson Blending for Seamless Image Stitching](http://zuhaagha.weebly.com/uploads/3/1/9/5/31957175/projectreport-poisson-14100196-14100103.pdf)

http://htmlarrows.com/math/anticlockwise-contour-integral/
http://dev.w3.org/html5/html-author/charref
