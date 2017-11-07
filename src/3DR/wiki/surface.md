# Surface





### Algebraic Sphere

F = scalar field, describing distance from a surface @ F(x) = 0
x = point on plane

F = a&middot;x<sup>T</sup>&middot;x + b<sup>T</sup>&middot'x + c

u = coefficient set describing a sphere in F @ F=0
	u is dimension &Reals;<sup>d+2</sup>
	u = [a, b, c]
	eg  2D:
		u = [a, b1,b2, c]
	eg  3D:
		u = [a, b1,b2,b3, c]


center of sphere = c = (1/[2*u<sub>d+1</sub>)&middot;[u<sub>1</sub>,...,u<sub>d</sub>]<sup>T</sup>
	= (1/[2*u<sub>c</sub>)&middot;b<sup>T</sup>
radius of sphere = ( c<sup>T</sup>&middot;c - u<sub>0</sub>/u<sub>d+1</sub> )<sup>0.5</sup>
	= ( c<sup>T</sup>&middot;c - a/d )<sup>0.5</sup>
	@ d==0 &Rarr; equation of a plane: c is distance from origin, b is the normal vector



### Estimating Normals from point sets

...


### From a set of points






**Normal Equation**: 
A&middot;x = b
A<sup>T</sup>&middot;A&middot;x = A<sup>T</sup>&middot;b


PLUS WEIGHTS? = 
A<sup>T</sup>&middot;W&middot;A&middot;x = A<sup>T</sup>&middot;W&middot;b





**Weighted Least Squares**:


from:

Y = X&middot;&Beta; + &epsilon;     [W<sup>-1</sup> = I * sigma_i<sup>2</sup>]

normal equations:
X<sup>T</sup>&middot;W&middot;X&middot;b = X<sup>T</sup>&middot;W&middot;Y



TRANSLATED TO NORMAL HUMAN MATHS:



Y = A&middot;X + &epsilon;     [W = I * 1.0/&sigma;<sub>i</sub><sup>2</sup>]

normal equations:
A<sup>T</sup>&middot;W&middot;A&middot;b = A<sup>T</sup>&middot;W&middot;Y


SOLUTION:
b = (A<sup>T</sup>&middot;W&middot;A&middot;)<sup>-1</sup> &middot; A<sup>T</sup>&middot;W&middot;Y





EIGEN PROBLEM:
(A - &Lambda;I)x = 0

(A - lambda;C)x = 0 ????

(C<sup>-1</sup>&middot;A - &lambda;I)x = 0

Generalized Eigenproblem










