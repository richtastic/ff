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

**E**: energy function? to minimize?
<br/>
**f**: final (target) image 
<br/>
**g**: final (target) image gradient
<br/>
**s**: gradient constraints (smoothness weights)
<br/>
**u**: unblended (original) images
<br/>
**l**: pixel labels (assigned image source for each pixel)
<br/>

E<sub>1</sub> = &Sum;<sub>i,j</sub> s<sup>x</sup><sub>i,j</sub>&middot;[f<sub>i+1,j</sub> - f<sub>i,j</sub> - g<sup>x</sup><sub>i,j</sub>]<sup>2</sup> + s<sup>y</sup><sub>i,j</sub>&middot;[f<sub>i,j+1</sub> - f<sub>i,j</sub> - g<sup>y</sup><sub>i,j</sub>]<sup>2</sup>

<br/>
<br/>
<br/>






<br/>
<br/>
<br/>
<br/>


[Fast Poisson Blending using Multi-Splines](http://www.msr-waypoint.net/pubs/144582/Szeliski-ICCP11.pdf)

[seamless image stitching gradient domain](http://www.wisdom.weizmann.ac.il/~levina/papers/blendingTR.pdf)
