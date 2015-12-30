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


## Poisson Equation:
Blending 2nd derivatives

&nabla;<sup>2</sup> &middot; &phi; = &fnof;
<br/>
(&part;<sup>2</sup>/&part;x<sup>2</sup>,&part;<sup>2</sup>/&part;y<sup>2</sup>,&part;<sup>2</sup>/&part;z<sup>2</sup>) &middot; &phi;(x,y,z) = &fnof;(x,y,z)

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

f<sub>i,j</sub> = u<sup>l<sub>i,j</sub></sup><sub>i,j</sub> + h<sup>l<sub>i,j</sub></sup><sub>i,j</sub>
<br/>

E<sub>3</sub> = &Sum;<sub>i,j</sub> s<sup>x</sup><sub>i,j</sub>&middot;[h<sup>l<sub>i+1,j</sub></sup><sub>i+1,j</sub> - h<sup>l<sub>i,j</sub></sup><sub>i,j</sub> - q<sup>x</sup><sub>i,j</sub>]<sup>2</sup> + s<sup>y</sup><sub>i,j</sub>&middot;[h<sup>l<sub>i,j+1</sub></sup><sub>i,j+1</sub> - h<sup>l<sub>i,j</sub></sup><sub>i,j</sub> - q<sup>y</sup><sub>i,j</sub>]<sup>2</sup> + w<sub>i,j</sub><sup>2</sup>&middot;[h<sup>l<sub>i,j</sub></sup><sub>i,j</sub>]<sup>2</sup>

<br/>
<br/>
Spline Offset Maps:

c = ? spline control variables
<br/>
b(i) = 1D B-Spline Basis Function
<br/>
B(i,j) = b(i)&middot;b(j)
<br/>
h<sup>l</sup><sub>i,j</sub> = &Sum;<sub>k,m</sub> c<sup>l</sup><sub>k,m</sub>&middot;B(i-k&middot;S,j-m&middot;S)

<br/>

E<sub>4</sub> = E3 with new h substituted

<br/>
<br/>
<br/>


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
<br/>
<br/>

<br/>
<br/>


<br/>
<br/>
<br/>
<br/>


[Fast Poisson Blending using Multi-Splines](http://www.msr-waypoint.net/pubs/144582/Szeliski-ICCP11.pdf)

[seamless image stitching gradient domain](http://www.wisdom.weizmann.ac.il/~levina/papers/blendingTR.pdf)
