## Bundle Adjustment


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


























































