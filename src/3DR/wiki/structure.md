## STRUCTURE


3D POINT LOCALIZATION:


- 2 projected 2D points thru camera centers may not necessarily coincide
	- midpoint of closest points along rays
	- homogeneous DLT ? - algebraic average
		- x cross PX = 0
		- AX = 0
		- ||X|| = 1
		- 
			- 3.1,3.1.1 p 71,72
			- A3.4.2 p 563
	- inhomogeneous: <<<<< 
		- X = <X,Y,Z,1>
		- AX = 0
		- assumption of W = 1 is bad when last value is near 0
		- assumption that point is not at infinity
		- 
			- 3.1.2 p 73
			- A3.3.1 p 558
	- geometric error:
		- C(x,x') = d(x,x^)^2 + d(x',x^'')^2 [x^]
			=> squared distances between ideal 3D projections & sample points in 2D on N images
	- gemetric error cost function: sampson error
		- MLE
		- jacobian using F
	- optimal - 6th degree polynomial solution: - p 301 - 305
		- 
		- e, F, 


	- AVOIDING LOCAL MINIMA


	- covariance / uncertainty in a given pixel's projection volume?
		----------------?
		- p 301 - 305
		- 

	- NONLINEAR UPDATES:
		-?




HOMOGENEOUS: [equil-determined]
	=> pseudoinverse: A^T A x = A^T b
	- minimize ||Ax - b||

INHOMOGENEOUS: [over-determined]
	Ax = b
	=> SVD, x = Vy
	- minimize ||Ax - b||








..........................


patch initialization

- A: geometry - 3D --- use 
	- size is init using distances
	- size is refined by sphere projection
	- normal is average of view normal - inversed


- AFFINE INITIALIZATION:
	- B) from coarse estimate of patch sphere
		- project 3-6 points between 2 views & assume affine relationship

	- A) from neighborhood of points
		- filter on fitting scale & rotation
		- upgrade to affine (3-5 points)
	

- B: geometry - 2D --- use affine matching
	- size same as 3D
	- normal set using affine relative ?

patch update nonlinear

- A: image projection / compare
	- 
	- rotating normal <2 DoF>
	- moving point <1 or 3 DoF>
	-- 


- when 3D/2D point density is high:
	- can get average of 3-6 neighbors to init patch



### POINT PATCH SETUP
- assumed 2 view Rs are setup already

x (R) 3D point is determined from simple DLT 
- (O) 3D point can be updated to reduce 3D reprojection error
=> have P3D
x (R) patch normal and up are initialized as average of view normals & ups
=> have normal (coarse)
=> have up (coarse)
x (R) patch size is initialized by averaging nearest rays to center point --- OR BY doing some scaling math
x (R) patch size is updated iteritively by projecting plane points to 2D & minimizing desired size distances
=> have size
- (R) P3D relative affine are calculated by projecting plane points to 2D
=> have match affines

- (O) patch normal (& up) iteritively updated minimizing image difference scores



### when point location is re-estimated:
- if point has moved far, then the patch should be entirely re-innited
- if point is fairly close (relative location from cameras' previous place ~ 1E6) -> angle difference can be recalculated, normal & size can be nonlinearly updated


### when view orientation changes (1 or more)
- point location needs to be re-initted




### FROM ASSUMED PERFECT POINT 3D + PATCH:
	- affine derived from plane projection





learnings from sequential:
	- point difference is good way to line up the structure of the scene
	-> should use existing matches & not re-generate in the process



### ALGORITHM / PROCESS UPDATE:
	- SUMMARY & FEATURE EXTRACTION
	- DICTIONARY MATCHING [rough list of prioritized likely matches]
	- SPARSE [accurate view positions (motion)]
		- pairwise R & track discovery [calculate pair R & quantify error]
		- triples [cacluate pair relative baseline scales]
		- initial absolute global orientation estimate
		- tracks: iteritive view location adjustment [move single/multiple views to minimize reprojection error, possibly remove the 3-5 sigma (very) worst tracks]
		-> pair 
	- DENSE [accurate structure locations (line up across view pairs)]
		- pairwise R & track
		- triples
		- initial global orientation
		- tracks: iteritive view location adjustment [move single view to minimize structure point distances, possibly remove worst tracks, possibly also reprojection error optimizing?]
		- ? sequential: load view - by - view ?
	- BUNDLE
		- dense groups ?
		- 
	- SURFACE
		- 



		- 
		










...






...