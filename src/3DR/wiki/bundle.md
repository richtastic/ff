## Bundle Adjustment
*Definition:*
<br/>
	- minimize reprojection error over:
		- all 3D points [X,Y,Z]
		- all camera parameters [rx,ry,rz,tx,ty,tz]

~10 views
~100 points per view

	- changing a single camera parameter
		=> re-estimate all 3D points connected to camera A/B

each camera variable change:
	10*100 = 1000 3D point & 2D reprojection calculations
	*6 params = 6000 calcs
	*100 iterations = 600,000 calcs



- refining camera positions

- refining 3d coordinates (and throwing out bad points)
	- how to differentiate good / vs bad ?
		- only use best of best, and if other points have higher variance => ignore ?
- 


3DPOINT
	- locations[]
		- image
		- point2d
	- ...



- multi-view points can be tracked along multiple images via point matches with similar SAD/NCC scores
- 


World
	- view list []
	- camera
	- 3D point list []

View/Screen:
	- image
	- 2d point list []
	- relationships/arrangements list []
		- view
		- transform TO (forward)

Screen Point / 2D
	- match list []
		- view
		- point2D
		- scale
		- angle
		- score
	- point3D









feature points via corner @ different scales
sift features for each point
sift matches
refined sift matches








- medium matching:
- want more best matches -- around mouse
	-- too deformed ???
iff distance too high => bad 'good' matches


- refining not work in some cases
	- using gry is better than RGB in general
	- 
- try gradient differences:
	- angle / direction ?
		error = magnitude of V2D.sub(gradA,gradB)





### bundle adjustment


**unknowns**:
- Cam-Dist : (4 params: p1 p2 q1 q2)
- Cam-Int-K : (5 params: cx cy fx fy s)
- Cam-Ext-P : (V views)*(6 params: tX tY tZ rX rY rZ)
- Points3D : (V views)*(3 params: X Y Z)*(N points)
<br/>

**knowns**:
- Points2D : (V views)*(2 params: x y)*(N points)
<br/>

**equation**:
<br/>
4 + 5 + 6*V + 3*N = 2*V*N
<br/>
9 + 6*V + 3*N = 2*V*N


#### 2-view:
*V = 2*
<br/>

*with refining calibrated cam*:
<br/>
21 + 3*N = 4*N
<br/>
&Rarr; N = 21+ points

<br/>
*ignoring calibrated cam*:
<br/>
12 + 3*N = 4*N
<br/>
&Rarr; N = 12+ points


#### 3-view:
*V = 3*
<br/>

*with refining calibrated cam*:
<br/>
27 + 3*N = 6*N
<br/>
&Rarr; N = 9+ points

<br/>
*ignoring calibrated cam*:
<br/>
18 + 3*N = 6*N
<br/>
&Rarr; N = 6+ points



FOR EACH MINIMIZING ERROR ITERATION:
	- pick random triple-set [non-bias sequential-remaining-set picking]
	- knows:
		- set of all projected 2D points
	- refining unknowns:
		- set of all 3D points
		- 3 view camera extrinsic parameters
		- 5 camera intrinsic parameters (optional)
		- 4 camera distortion parameters (optional)
	- [optionally also only select subset of 10-20 3D points if very large]
	- calculate current error: ()
		- square geometric distance from projected 3D points & known 2D points:
			- estimated 2D point = 
	- calculate new errors in each of directions:
		3 * (tX tY tZ rX rY rZ)
		N * (X,Y,Z)
		- lambda_i proportional to reduction in error
	- update variables to best direction gradient [make sure cost is less]










### tensors:

summation rules:
<br/>
only over indices that appear twice in the equation -- indices only appearing once are for offset placeholding


matrix multiplication:
<br/>
u<sub>n&times;1</sub> = A<sub>n&times;m</sub>&middot; v<sub>m&times;1</sub>
<br/>

u<sub>i</sub> = &Sum;<sub>j&in;[1,m]</sub> A<sub>i,j</sub> &middot; v<sub>j</sub> ; (i &in;[1,n])
<br/>
<br/>


<br/>
dot product: u &middot; v = u<sub>i</sub> v<sup>i</sup>
<br/>
cross product: (u &times; v)<sub>i</sub> = &epsilon;<sub>ijk</sub> u<sup>i</sup> v<sup>k</sup>
<br/>
permutation tensor: &epsilon;<sub>ijk</sub> = [x<sub>i</sub>,x<sub>j</sub>,x<sub>k</sub>]
<br/>
<br/>
<br/>



scalar, vector, dyad, triad, n-ad









### trifocal tensor:
<br/>
27 parameters
<br/>
18 dof
<br/>
[8 internal constraints]
<br/>
min 6 correspondences, 
<br/>
T = [G<sub>1</sub>;G<sub>2</sub>;G<sub>3</sub>]
<br/>
l<sub>3</sub>i = l<sub>1</sub><sup>T</sup> &middot; G<sub>i</sub> &middot; l<sub>2</sub>
<br/>
<br/>


x^i == b ???
[a]<sub>&times;</sub>(&Sum;<sub>i</sub> x<sup>i</sup> T<sub>i</sub>)[c]<sub>&times;</sub>
<br/>


P<sub>1</sub> = [I|0]
<br/>
P<sub>2</sub> = [A|a<sub>4</sub>]
<br/>
P<sub>3</sub> = [B|b<sub>4</sub>]
<br/>
a<sub>4</sub> = epipole from first camera center = P<sub>2</sub>C
<br/>
b<sub>4</sub> = epipole from first camera center = P<sub>3</sub>C



<br/>
paramiterization:
3 3&times;3 orthogonal matrices &plus; 10-vector








DLT: 27 params,
4 equations:
27/4 = 7 points


T<sub>0</sub>= 
<br/>
[a<sub>x</sub>, 0, -a<sub>x</sub>&middot;b<sub>x</sub>]
<br/>
[0, 0, 0]
<br/>
[-a<sub>x</sub>&middot;c<sub>x</sub>, 0, a<sub>x</sub>&middot;b<sub>x</sub>&middot;c<sub>x</sub>]
<br/>





















iteration i:
	lambda = 1.0;

	uniform dx local sampling:
	eps = 0.1;
	eps_x = eps;
	eps_y = eps;
	eps_z = eps;
	
	dx = eps_x;
	dy = eps_y;
	dz = eps_z;

	% errorPrev - errorNext
	de_x =  0.2;
	de_y =  0.1;
	de_z = -0.01;


gradient vector:
	new_x = x + de_x * lambda;









BUNDLE ADJUSTMENT / DATA FUSION / STRUCTURE FROM MOTION MORE NOTES:

INCREMENTAL- find an initial pair & add succsssive views incrementally
GLOBAL- 1) globally consistent rotations 2) structure & translation

RANSAC ON 3D DATA -> PICK MOST CONSISTENT ORIENTATION -> (MAX SUPPORT)









http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.664.2320&rep=rep1&type=pdf
https://pdfs.semanticscholar.org/f25c/1dce540e1477066e715d3ad92a5ec6f2491a.pdf










ALG GLOBAL:
	MAIN LOOP
		...
		when a pair has a low enough error / high enough count => send to 'absoluting state' & init transform based on average of all existing transforms
		...
		if pair isn't in absolute state, keep probing 2d for new points
		else if 3D error is low enough  (relative to volume of points < ~1/1000) && reprojection is low enough, 3D projecting for new points
		...
		error dropping
		...
		for all views in absoluting state
			- do a bundle-adjust for only a single view at a time, and only reduce error not too extremely
			- update all changed relative transforms & P3Ds



ALG LOCAL / INCREMENTAL:
for each pair
	- find best 3D relationship or NULL if 2D/3D not successful

for each view sorted on lowest avg reprojection error
	for each other view:
		- if first pair:
			init transforms from pair
		- if no matching pair already exists
			skip; recheck on next iteration
		- else
			add new view as average location / rotation based on all other view pairs
			bundle-adjust for all 3D points & camera parameters








COMBINING GAUSSIAN/NORMAL DISTRIBUTIONS:

s = sigma^2
k = s0/(s0 + s1)
u' = u0 + k*(u0 + u1)
s' = s0 - k*s0









KALMAN:
https://www.bzarg.com/p/how-a-kalman-filter-works-in-pictures/
https://www.cl.cam.ac.uk/~rmf25/papers/Understanding%20the%20Basis%20of%20the%20Kalman%20Filter.pdf
https://towardsdatascience.com/kalman-filter-an-algorithm-for-making-sense-from-the-insights-of-various-sensors-fused-together-ddf67597f35e
x = state (at time t)
u = control input
F = state transition
B = control input matrix
w = noise terms, from Q = cov
prediction


x = state








focal length from F:

minimize cost C (nonnegative, 0 for best):
C = ||EE^t||^2 - 0.5*||E||^4
E = K'^T * F * K
pick values for K & minimize
using a TRIPLET:
C' = C(F12) + C(F13) + C(F23)
https://www.cv-foundation.org/openaccess/content_iccv_2015/papers/Sweeney_Optimizing_the_Viewing_ICCV_2015_paper.pdf


ROTATION / TRANSLATION SOLVING:
http://imagine.enpc.fr/~monasse/Stereo/Projects/MartinecPajdla07.pdf








#### rotation averaging - initial estimate


**r**<sub>k</sub><sup>i</sup> &isin; **R**<sup>i</sup> = [**r**<sub>1</sub><sup>i</sup> **r**<sub>2</sub><sup>i</sup> **r**<sub>3</sub><sup>i</sup>] ; k &isin; [1,2,3]
<br/>
**r**<sub>k</sub><sup>j</sup> - **R**<sup>ij</sup>&middot;**r**<sub>k</sub><sup>i</sup> = **0**<sub>3&times;3</sub>
<br/>
&rArr;
<br/>
```
   j          R:ij         i
[ r1k ]   [ a  b  c ]   [ r1k ]
[ r2k ] - [ d  e  f ] = [ r2k ]
[ r3k ]   [ g  h  i ]   [ r3k ]
```

&rArr;



**[A]:**
<br/>
**r**<sup>j</sup><sub>1,k</sub> - (a&middot;**r**<sup>i</sup><sub>1,k</sub> + b&middot;**r**<sup>i</sup><sub>2,k</sub> + c&middot;**r**<sup>i</sup><sub>3,k</sub>) = 0
<br/>

**[B]:**
<br/>
**r**<sup>j</sup><sub>2,k</sub> - (d&middot;**r**<sup>i</sup><sub>1,k</sub> + e&middot;**r**<sup>i</sup><sub>2,k</sub> + f&middot;**r**<sup>i</sup><sub>3,k</sub>) = 0
<br/>

**[C]:**
<br/>
**r**<sup>j</sup><sub>3,k</sub> - (g&middot;**r**<sup>i</sup><sub>1,k</sub> + h&middot;**r**<sup>i</sup><sub>2,k</sub> + i&middot;**r**<sup>i</sup><sub>3,k</sub>) = 0
<br/>

**[1,2,3]: k = 1**
<br/>
**[4,5,6]: k = 2**
<br/>
**[7,8,9]: k = 3**




















































