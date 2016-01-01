# Blending
*Removing Seams At Region Boundaries*


1) Feathering 
2) Gradient
3) Poisson Equation

<br/>


## Feathering
Transparent/Alpha from 1-0 & 0-1
	Pyramid Blending
	


## Gradient?
1st Derivative?





Laplacian Blending? multiple levels?










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
https://en.wikipedia.org/wiki/Bilateral_filter

http://www.sandia.gov/~egboman/papers/HUND.pdf
http://www.cs.tau.ac.il/~stoledo/Pubs/wide-simax.pdf

<br/>
<br/>
<br/>



## Nested Dissection


<br/>
<br/>
<br/>
<br/>


[Fast Poisson Blending using Multi-Splines](http://www.msr-waypoint.net/pubs/144582/Szeliski-ICCP11.pdf)

[seamless image stitching gradient domain](http://www.wisdom.weizmann.ac.il/~levina/papers/blendingTR.pdf)


[Efficient Poisson Blending for Seamless Image Stitching](http://zuhaagha.weebly.com/uploads/3/1/9/5/31957175/projectreport-poisson-14100196-14100103.pdf)


