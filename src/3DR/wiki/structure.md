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














...