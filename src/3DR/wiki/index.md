# Notes

1. [Math](#MATHS)
2. [Projective 2D Concepts](#2DSTUFF)
3. [Projective 3D Concepts](#3DSTUFF)
4. [Camera Modeling](#CAMERA)
5. [Feature Matching](#FEATURE)
6. [Triangulation](#TRIANGULATE)
7. [Surface Reconstruction](#SURFACE)
8. [Surface Texturing](#TEXTURE)
9. [?](#?)
10. [References](#REFERENCE)


# added line

# added another (2) lines

# I wamt to keep this line, but drop the others

TODO:
- simple y = mx +b RANSAC
- screw/axisAngle<->R+t (trans)
- walkthrough reconstruction piece-by-piece manually with set
...
- SIFT point extraction
- store points in file for later
- bundle adjustment feature matching to get F matrix

&lceil;A&rceil;

<a name="MATHS"></a>
## MATH

### Transpose(M)
**tra(M), M<sup>T</sup>**
<br/>
flip along y=-x axis


### Cofactor(M)
**cof(M)**
<br/>
+/- alternating (checkerboard) of sub determinant found by crossing out row j and col i


### Adjoint(M)
**adj(M)**
<br/>
= tra( cof(M) )


### Determinant(M)
**det(M)**
<br/>
sum of cofactors of a single row or column, in which the result is also multiplied by the value at row j, col i
<br/>
(Laplace Expansion)

### Inverse(M)
**inv(M)**
<br/>
inv(M) = 1/det(M) * adj(M)
<br/>


### NulSpace(M)
**nul(M)**
row? vector when multiplied by M yields 0 vector


### Rank(M)
**rank(M)**
Number of linearly independent columns


### Eigenvalues(M)
**eigs(M)**
roots of characteristic equation: det(M-&lambda;I)=0
(vector/values causing matrix to be singular)



### Conics and Conic Sections
**Geometrically**: Intersection of a plane and a (double-sided) cone &rarr; A CURVE
<br/>
**Algebraically for x,y,z**: a&middot;x<sup>2</sup> + b&middot;x&middot;y + c&middot;y<sup>2</sup> + d&middot;x&middot;z + e&middot;y&middot;z + f&middot;z<sup>2</sup> = 0
<br/>
**Matrix-ically**: 
```
    [ a  b/2 d/2]
C = [b/2  c  e/2]   x^T*C*x = 0  ; x = [x;y;z]
    [d /2 e/2  f]
```
<br/>
<br/>
C&middot;x = tangent line? = (a+b/2+d/2)&middot;x + (c+b/2+e/2)&middot;y + (f+d/2+e/2)
<br/>

<br/>
**Descriminant (desc)**: b<sup>2</sup> - 4&middot;a&middot;c ; derived by removing cross-term (B&middot;x&middot;y) knowing: *invariant to rotation* 
<br/>
<br/>
<br/>
**Degenerate**: equation does not have highest degree (2 in regular conic (a,b,c &ne; 0)- null, point, line, crossing-line pair, parallel-line pair)
<br/>
<br/>
<br/>

|         *TYPE*         | *DESC* |                  *EQUATION*                    |                                          *EXPLANATION*                                      |
| ---------------------- | ------ | ---------------------------------------------- | ------------------------------------------------------------------------------------------- |
|      **null set**      |    ?   |                                                | cone with vertex at infinity (cylinder), plane is parallel to cylinder with no intersection |
| **parallel line pair** |    ?   |                                                | cone with vertex at infinity (cylinder), plane intersects cylinder twice                    |
|       **point**        | desc<0 |                                                | plane intersects cone only at origin [degenerate ellipse]                                   |
|        **line**        | desc=0 |                                                | plane intersects cone at limiting edge (thru origin) [degenerate parabola]                  |
| **crossing line pair** | desc>0 |                                                | plane intersects cone edge twice (thru origin) [degenerate hyperbola]                       |
|       **circle**       | desc<0 | (x-h)^2/r^2 + (y-k)^2/r^2 - 1 = 0              | plane is perpendicular to principal axis                                                    |
|      **ellipse**       | desc<0 | (x-h)^2/a^2 + (y-k)^2/b^2 - 1 = 0              |                                                                                             |
|      **parabola**      | desc=0 | 4p(y-k) - (x-h)^2 = 0 OR 4p(x-h) - (y-k)^2 = 0 | plane is sloped parallel to conic generating line ; x^2 or y^2 coefficient = 0              |
|     **hyperbola**      | desc>0 | (x-h)^2/a^2 - (y-k)^2/b^2 - 1 = 0              |                                                                                             |
<br/>
After Rotation: x' = xcos&theta; - ysin&theta; ; y' = xsin&theta; + ycos&theta;
<br/>
<br/>
A' = Acos<sup>2</sup>&theta; + Bcos&theta;sin&theta; + Csin<sup>2</sup>&theta;
<br/>
B' = -2Acos&theta;sin&theta; + Bcos<sup>2</sup>&theta; - Bsin<sup>2</sup>&theta; + 2Ccos&theta;sin&theta;
<br/>
C' = Asin<sup>2</sup>&theta; + Bsin&theta;cos&theta; + Ccos<sup>2</sup>&theta;
<br/>
D' = Dcos&theta; + Esin&theta;
<br/>
E' = -Dsin&theta; + Ecos&theta;
<br/>
F' = F
<br/>
...
<br/>
B'<sup>2</sup> - 4A'C' &equiv; B<sup>2</sup> - 4AC [invariant]
<br/>
<br/>
Choose &theta; such that B'=0 (no cross term piece)
<br/>
&theta; = -atan( [ A - C &plusmn; sqrt((A-C)<sup>2</sup>+B<sup>2</sup>) ]/B )
<br/>
&rarr; B<sup>2</sup> - 4AC = -4A'C' &rarr; evaluate simpler equation: A'x<sup>2</sup> + C'y<sup>2</sup> + D'x + E'y + F
<br/>


**Plane**: a<sub>1</sub>x + a<sub>2</sub>y + a<sub>3</sub>z - b = 0
<br/>
**Cone**: c<sub>1</sub>x<sup>2</sup> + c<sub>2</sub>y<sup>2</sup> - c<sub>3</sub>z<sup>2</sup> = 0
<br/>

### Quadrics
**Geometrically**: intersection of a hypercone and hypersphere (in &reals;<sup>4</sup>) &rarr; A SURFACE
<br/>
**Algebraically**: a&middot;x<sup>2</sup> + b&middot;y<sup>2</sup> + c&middot;z<sup>2</sup> + 2&middot;d&middot;x&middot;y + 2&middot;e&middot;x&middot;z + 2&middot;f&middot;y&middot;z + g&middot;x + h&middot;y + i&middot;z + j = 0
<br/>
**Matrix-ically**: x<sup>T</sup>&middot;q&middot;x + L&middot;x + J = 0
```
    [a d e g]                   [a d e]
Q = [d b f h] = [q L^T]  ;  q = [d b f]  ; L = [g h i]
    [e f c i]   [L   j]         [e f c]
    [g h i j]
```

rank(q) = &rho;3
rank(Q) = &rho;4
sign(det(Q)) = &Delta;
sign(eigs(q))






ellipsoid (+sphere +spheroid)
elliptic (+circular) paraboloid
hyperbolic paraboloid
hyperboloid of 1 sheet
hyperboloid of 2 sheets
elliptic (+circular) cone
elliptic (+circular) cylinder (ellipse+z)
parabolic cylinder (parabola+z)
hyperbolic cylinder (hyperbola+z)
intersecting planes
parallel planes
coincident planes (share same plane) 


<br/>
**HyperPlane**: a<sub>1</sub>x + a<sub>2</sub>y + a<sub>3</sub>z + a<sub>4</sub>w - b  = 0  ~ 1/ a<sub>4</sub> ~ a<sub>1</sub>x + a<sub>2</sub>y + a<sub>3</sub>z + w - b  = 0
<br/>
**HyperCone**: c<sub>1</sub>x<sup>2</sup> + c<sub>2</sub>y<sup>2</sup> + c<sub>3</sub>z<sup>2</sup> - c<sub>4</sub>w = 0
<br/>



### Discrete Math
<br/>
**Jacobian**: &part;f<sub>i</sub>(x)/&part;x<sub>i</sub> ; f<sub>i</sub> &darr; ; x<sub>i</sub> &rarr;
<br/>
**Hessian**: &part;<sup>2</sup>f(x)/&part;x<sub>i</sub>&part;x<sub>j</sub> ; x<sub>i</sub> &darr; ; x<sub>j</sub> &rarr;
<br/>
<br/>
f(x+&delta;) &asymp; f(x) + J(x)&middot;&delta; + &frac12;&delta;<sup>T</sup>&middot;H(x)&middot;&delta; <sub> + O(&delta;<sup>3</sup>) </sub>
<br/>
<br/>
<br/>


<a name="2DSTUFF"></a>
## Projective 2D Concepts

### 2D Points
**Point x = [x<sub>1</sub>;x<sub>2</sub>;x<sub>3</sub>] = (x,y,w) ~ (x,y,1)**: 
<br/>
**Point At Infinity**: x = (x,y,0)
<br/>

### 2D Lines
![Line](./images/line.png "Line")
<br/>
**Line: a,b,c &equiv; [a,b,c]<sup>T</sup>**: ax + by + c = 0
<br/>
**&lt;a,b&gt;**: vector normal to line (from origin), ||&lt;a,b&gt;|| = ||ab|| = (a<sup>2</sup>+b<sup>2</sup>)<sup>1/2</sup>
<br/>
**c/||ab||**: *negative* signed distance along normal vector to line (closest to origin)
<br/>
Same line can be defined by different combinations of a,b,c (eg k&middot;a,k&middot;b,c/k)
<br/>
**Homogenious line**: ||ab|| = 1 ?
<br/>

### 2D Point on a Line
**Point (x,y,1), (x,y,1)<sup>T</sup>**: The point (k&middot;x,k&middot;y,k) represents the same point
<br/>
**Homogenious Point**: (x,y,1)
<br/>
**Inhomogenious Point**: (k&middot;x,k&middot;y,k) ? k&ne; 0 ?
<br/>
<br/>
Point x(x,y,1) is on line l(a,b,c) IFF: x<sup>T</sup>l = 0  (dot product=0)
<br/>

### 2D Line-Line Intersection
**Line l = [a,b,c]<sup>T</sup>**: line ax + by + c = 0
<br/>
**Line l' = [A,B,C]<sup>T</sup>**: line Ax + By + C = 0
<br/>
ax + by + c = 0
<br/>
Ax + By + C = 0
<br/>
**Intersection point p = (x,y,w)**: p = l &times; l' = [l]<sub>&times;</sub> l' = [l']<sup>T</sup><sub>&times;</sub> l
<br/>
= &lt;bC-cB, cA-aC, aB-bA&gt;
```
[x]   [0  -c  b] [A]
[y] = [c   0 -a]*[B]
[w]   [-b  a  0] [C]
```

### Parallel Line-Line Intersection
"parallel lines meet at infinity" <sub>(they never intersect)</sub>
<br/>
**Parallel line intersection point p**: p= &lt;bC-cB, cA-aC, aB-bA&gt;, with a=A, b=B &rarr;
<br/>
p = &lt;(C-c)b, (c-C)a, 0&gt;
<br/>
p ~ &lt;b, -a, 0&gt;
<br/>
p ~ &lt;-b, a, 0&gt;
<br/>

### Ideal Points
**Ideal point p is at infinity**: p = &lt;x,y,0&gt;
<br/>

### Line at infinity
**Line at infinity l<sub>&infin;</sub> contains all points at infinity**: l = &lt;0,0,1&gt;
<br/>
&lt;0,0,1&gt; &middot; &lt;x,y,0&gt; = 0
<br/>


### Projective Rays
**Ray in P<sup>2</sup> r = &lt;x,y,z&gt;**: a ray is a 'point' in P<sup>2</sup>
<br/>
**Planes in P<sup>2</sup>**: defined by 2 distint rays ; a 'line' in P<sup>2</sup> is the intersection of the plane defined -by 2 rays and the plane &pi; at z=1
<br/>


### Projective Planes
<br/>
?
<br/>


### Conic
**a&middot;x<sup>2</sup> + b&middot;x&middot;y + c&middot;y<sup>2</sup> + d&middot;x + e&middot;y + f = 0**
<br/>
**Homogenized**: a&middot;x<sup>2</sup> + b&middot;x&middot;y + c&middot;y<sup>2</sup> + d&middot;x&middot;z + e&middot;y&middot;z + f&middot;z<sup>2</sup> = 0
<br/>
**Transformation as x = Hx**: C' = H<sup>-T</sup>&middot;C&middot;H<sup>-1</sup>
<br/>
**Point on Conic**: x<sup>T</sup>&middot;C&middot;x = 0
<br/>
**Line Tanget to Conic at x**: l = C&middot;x
<br/>
**Point on Conic Tangent Line**: x = C<sup>-1</sup>&middot;l = 0
<br/>
```
        [ a  b/2 d/2] [x]
[x y z]*[b/2  c  e/2]*[y]
        [d/2 e/2  f ] [z]
```
**Degenerate**: not full (3) rank, instead rank 2 (nul(C)=) or rank 1
<br/>
**Conjugate Points of C**: Any two points x,y satisfying: y<sup>T</sup>Cx = 0
<br/>
C = U<sup>T</sup>&middot;D&middot;U
<br/>



### Dual Conic C&#42; (C&lowast;) (conic envelope)
**l<sup>T</sup>&middot;C&#42;&middot;l = 0**
<br/>
C&#42; = adj(C) ~ C<sup>-1</sup> <sup>[symmetric,nonsingular]</sup>
<br/>
**(Dual) Conjugate Lines of C**: Any two lines l,m satisfying: l<sup>T</sup>C&#42;m = 0
<br/>
**Transformation as x = Hx**: C&#42;' = H&middot;C&#42;&middot;H<sup>T</sup>
<br/>*



### Transforms
**Colineation, Projectivity, homography, projective transform**
<br/>
Invertable mapping of points on lines to points on lines, 8DOF
<br/>
**Point Transformation**: x' = H&middot;x
<br/>
**Line Transformation**: l' = H<sup>-T</sup>&middot;l
<br/>
**Conic Transformation**: C' = H<sup>-T</sup>&middot;C&middot;H<sup>-1</sup>
<br/>
**Dual Conic Transformation**: C&#42;' = H&middot;C&#42;&middot;H<sup>T</sup>
<br/>


### Transformation Hierarchy
**Isometry/Euclidean**: H<sub>E</sub> ; 3DOF: 1rot, 2trans
<br/>
*invariant: length, angle, area, parallel lines, ...*
<br/>
```
[x']   [ e*cos(t) -sin(t) tx ] [x]
[y'] = [ e*sin(t)  cos(t) ty ]*[y]
[1 ]   [   0       0       1 ] [1]
```
e = &plusmn;1 ; s=1 = orientation preserving
<br/>
R<sub>2&times;2</sub> is orthonormal rotation matrix; R&middot;R<sup>T</sup> = I
<br/>
**Similarity/Metric**: H<sub>M</sub> ; 4DOF: 1rot, 2trans, 1scale
<br/>
*invariant: angle, parallel lines, ratio of lengths, ratio of area, circular points: I, J*
<br/>
```
[x']   [ s*cos(t) -s*sin(t) tx ] [x]
[y'] = [ s*sin(t)  s*cos(t) ty ]*[y]
[1 ]   [    0         0      1 ] [1]
```
<br/>
**Affine/Affinity**: H<sub>A</sub> ; 6DOF: 2rot, 2trans, 2scale
<br/>
*invariant: parallel lines, ratio of lengths or parallel lines, ratio of area, I<sub>&infin;</sub>*
<br/>
```
[x']   [ a b tx ] [x]
[y'] = [ c d ty ]*[y]
[1 ]   [ 0 0  1 ] [1]
```
A<sub>2&times;2</sub>sub> = R(&theta;)&middot;R(-&phi;)&middot;D&middot;R(&phi;) ; D = [l1 0 ; 0 l2] (non-isotropic scaling)
<br/>
rotate by &phi;, scale by l1 in x and l2 in y, reverse rotate by &phi;, rotate by &theta;
<br/>
**Projective**: H<sub>P</sub> ; 8DOF
<br/>
*invariant: cross ratio: ratio of ratios, order, tangency*
<br/>
```
[x']   [ a b tx ] [x]     [x']   [ a b c ] [x]
[y'] = [ c d ty ]*[y]  =  [y'] = [ d e f ]*[y]
[1 ]   [ e f  v ] [1]     [1 ]   [ g h i ] [1]
```
<br/>
H = H<sub>M</sub>&middot;H<sub>A</sub>&middot;H<sub>P</sub> = H<sub>P</sub>&middot;H<sub>A</sub>&middot;H<sub>M</sub>
```
[sR t][K 0][I 0] = [A t]
[0  1][0 1][v u]   [v u]
```
A = sRK + tv
<br/>


### Infinite Dual(line) Conic C&#42;<sub>&infin;</sub>
*contains all information required to find metric reconstruction*
<br/>
l<sub>&infin;</sub> = nul(C&#42;<sub>&infin;</sub>)
<br/>
H<sub>P</sub>&middot; = [I<sub>2x2</sub> 0<sub>2x1</sub> ; v<sub>2x1</sub><sup>T</sup 1];
<br/>
H<sub>A</sub>&middot; = [K<sub>2x2</sub> 0<sub>2x1</sub> ; 0<sub>1x2</sub> 1];
<br/>
H<sub>M</sub>&middot; = [sR<sub>2x2</sub> t<sub>2x1</sub> ; 0<sub>1x2</sub> 1];
<br/>
C&#42;<sub>&infin;</sub>' = (H<sub>P</sub>&middot;H<sub>A</sub>&middot;H<sub>M</sub>) C&#42;<sub>&infin;</sub> (H<sub>P</sub>&middot;H<sub>A</sub>&middot;H<sub>M</sub>)<sup>T</sup>
<br/>
C&#42;<sub>&infin;</sub>' = U[1,0,0; 0,1,0; 0,0,0]U<sup>T</sup>, U = SVD left-eigenvalues
<br/>
C&#42;<sub>&infin;</sub>' = (H<sub>P</sub>H<sub>A</sub>)C&#42;<sub>&infin;</sub>(H<sub>P</sub><sup>T</sup>H<sub>A</sub><sup>T</sup>)
<br/>
C&#42;<sub>&infin;</sub>' = [K&middot;K<sup>T</sup> , K&middot;K<sup>T</sup>&middot;v ; v<sup>T</sup>&middot;K&middot;K<sup>T</sup> , v<sup>T</sup>&middot;K&middot;K<sup>T</sup>&middot;v]
<br/>
<br/>
**IF ONLY AFFINE**: C&#42;<sub>&infin;</sub>' = [(K&middot;K<sup>T</sup>)<sub>2x2</sub>,0<sub>2x1</sub>; 0,0,0];
<br/>
S = K&middot;K<sup>T</sup> ; find K by square rooting S (cholesky)
<br/>
<br/>


### Circular Points
**I and J**: I=[1;i;0], J=[1;-i;0] ; fixed under metric transform ; (when fixed: eigenvalues: exp(i&theta;) and exp(-i&theta;))
<br/>
**Dual of circular points: C&#42;<sub>&infin;</sub>**: C&#42;<sub>&infin;</sub> = I&middot;J<sup>T</sup> + J&middot;I<sup>T</sup> ~ [1,0,0; 0,1,0; 0,0,0] ; nul(C&#42;<sub>&infin;</sub>)=l<sub>&infin;</sub>
<br/>
**Fixed under metric transform (up to complex scale)**: I&middot;H<sub>M</sub> = I ; I = [cos&theta; + i&middot;sin&theta; ; cos&theta; - i&middot;sin&theta; ; 0] ; I = [e<sup>i&theta;</sup> ; i&middot;e<sup>i&theta;</sup> ; 0] ; I = e<sup>i&theta;</sup>[1;i;0]
<br/>
a=c=1 ; b=d=e=f=0 ; (up to scale?)
<br/>
**Projective Dot Product of lines l=(l<sub>1</sub>,l<sub>2</sub>,l<sub>3</sub>) and m=(m<sub>1</sub>,m<sub>2</sub>,m<sub>3</sub>)**: cos&theta; = [l<sup>T</sup>&middot;C&#42;<sub>&infin;</sub>&middot;m]/sqrt( (l<sup>T</sup>&middot;C&#42;<sub>&infin;</sub>&middot;l) &middot; (m<sup>T</sup>&middot;C&#42;<sub>&infin;</sub>&middot;m) ) ; invariant to projective transform
<br/>


### Fixed Points
3 fixed points and 3 fixed lines (through these points); points are eigenvectors of H, lines are eigenvectors of H<sup>-T</sup>(H<sup>T</sup>?) (H<sup>-T</sup>&middot;l=&lambda;&middot;l)
<br/>
<br/>
**Polar Line:** *pole* point (anywhere) x and corresponding *polar* line Cx is tangent to the conic C at point y, if y<sup>T</sup>Cx = 0
<br/>
**Correlation A**: invertible mapping from points and lines in P<sup>2</sup> : l = Ax
<br/>
<br/>


### Transformation Recovery
<br/>
locate l<sub>&infin;</sub> (contains points at infinity)
<br/>
H<sub>l&infin;</sub> = [1 0 0 ; 0 1 0; l<sub>1</sub> l<sub>2</sub> l<sub>3</sub>]  (l<sub>3</sub> &ne; 0)
<br/>
H = H<sub>A</sub>&middot;H<sub>l&infin;</sub>
<br/>
H&middot;H<sub>l&infin;</sub> = H<sub>A</sub>&middot;H<sub>l&infin;</sub>&middot;H<sub>l&infin;</sub><sup>-1</sup>
<br/>
H&middot;H<sub>l&infin;</sub> = H<sub>A</sub>
<br/>
???
<br/>
<br/>

<br/>
H<sub>M</sub> = ? SVDized C&infin; ?
<br/>



<br/>
C&#42;<sub>&infin;</sub>' = (H<sub>P</sub>&middot;H<sub>A</sub>&middot;H<sub>M</sub>)C&#42;<sub>&infin;</sub>(H<sub>P</sub>&middot;H<sub>A</sub>&middot;H<sub>M</sub>)<sup>T</sup>
<br/>
= [K&middot;K<sup>T</sup> , K&middot;K<sup>T</sup>&middot;v ; v<sup>T</sup>&middot;K&middot;K<sup>T</sup> , v<sup>T</sup>&middot;K&middot;K<sup>T</sup>&middot;v]
<br/>
S = K&middot;K<sup>T</sup> = [s<sub>1</sub>,s<sub>2</sub> ; s<sub>2</sub>,s<sub>3</sub>] ; (symmetric - 3 unknowns)
<br/>
~ U[1,0,0; 0,1,0; 0,0,0]U<sup>T</sup>
<br/>
H = U ?
<br/>
<br/>
Hm from Ha, using two orthogonal lines (l,m) in Ha
<br/>
l<sup>T</sup>C&#42;<sub>&infin;</sub>m = 0
<br/>
= [l<sub>1</sub>,l<sub>2</sub>,l<sub>3</sub>]C&#42;<sub>&infin;</sub>[m<sub>1</sub>;m<sub>2</sub>;m<sub>3</sub>] = 0
<br/>
= [l<sub>1</sub>&middot;m<sub>1</sub>, l<sub>1</sub>&middot;m<sub>2</sub>+l<sub>2</sub>&middot;m<sub>1</sub>, l<sub>1</sub>&middot;m<sub>1</sub>]&middot;[s<sub>1</sub>,s<sub>2</sub>,s<sub>3</sub>] = 0
<br/>
SOLVE FOR s1,s2,s3: [a b c; d e f; 0 0 0]&middot;[s1;s2;s3] = 0; [a,...,f] known from 2 orthogonal pairs as above^
<br/>

<br/>
<br/>



### 2D Homography
Solve for H where: x' = H&middot;x
<br/>
```
[x']   [a b c]   [x]
[y'] = [d e f] * [y]
[z']   [g h i]   [z]
```
<br/>
**Solve straight-forward version**:
<br/>
x' = a&middot;x + b&middot;y + c&middot;z ; y' = d&middot;x + e&middot;y + f&middot;z ;  z' = g&middot;x + h&middot;y + i&middot;z
<br/>
<br/>
x'/z' = (a&middot;x + b&middot;y + c&middot;z)/(g&middot;x + h&middot;y + i&middot;z)
<br/>
x'&middot;(g&middot;x + h&middot;y + i&middot;z) = z'&middot;(a&middot;x + b&middot;y + c&middot;z)
<br/>
g&middot;x&middot;x' + h&middot;y&middot;x' + i&middot;z&middot;x' = a&middot;x&middot;z' + b&middot;y&middot;z' + c&middot;z&middot;z'
<br/>
g&middot;x&middot;x' + h&middot;y&middot;x' + i&middot;z&middot;x' - a&middot;x&middot;z' - b&middot;y&middot;z' - c&middot;z&middot;z' = 0 **[1]**
<br/>
<br/>
y'/z' = (d&middot;x + e&middot;y + f&middot;z)/(g&middot;x + h&middot;y + i&middot;z)
<br/>
y'&middot;(g&middot;x + h&middot;y + i&middot;z) = z'&middot;(d&middot;x + e&middot;y + f&middot;z)
<br/>
g&middot;x&middot;y' + h&middot;y&middot;y' + i&middot;z&middot;y' = d&middot;x&middot;z' + e&middot;y&middot;z' + f&middot;z&middot;z'
<br/>
g&middot;x&middot;y' + h&middot;y&middot;y' + i&middot;z&middot;y' - d&middot;x&middot;z' - e&middot;y&middot;z' - f&middot;z&middot;z' = 0 **[2]**
<br/>
<br/>
[1] + [2]
```
%   a     b     c     d     e     f     g     h     i
[ -x*z' -y*z' -z*z'   0     0     0    x*x'  y*x'  z*x' ] 
[   0     0     0   -x*z' -y*z' -z*z'  x*y'  y*y'  z*y' ] * [a,b,c,d,e,f,g,h,i]' = [0]
[   .     .     .     .     .     .     .     .     .   ]
```
<br/>
<br/>

**Solve cross product version**:
<br/>
x'&times;x' = x'&times;Hx &rarr; 0 = x'&times;Hx
<br/>
[x' y' z']&times;[a&middot;x + b&middot;y + c&middot;z ; d&middot;x + e&middot;y + f&middot;z ; g&middot;x + h&middot;y + i&middot;z]
<br/>
**i**: y'&middot;(g&middot;x + h&middot;y + i&middot;z) - z'&middot;(d&middot;x + e&middot;y + f&middot;z) = 0
<br/>
g&middot;x&middot;y' + h&middot;y&middot;y' + i&middot;z&middot;y' - d&middot;x&middot;z' - e&middot;y&middot;z' - f&middot;z&middot;z' = 0 **[1]**
<br/>
**j**: z'&middot;(a&middot;x + b&middot;y + c&middot;z) - x'&middot;(g&middot;x + h&middot;y + i&middot;z) = 0
<br/>
a&middot;x&middot;z' + b&middot;y&middot;z' + c&middot;z&middot;z' - g&middot;x&middot;x' - h&middot;y&middot;x' - i&middot;z&middot;x' = 0 **[2]**
<br/>
**k**: x'&middot;(d&middot;x + e&middot;y + f&middot;z) - y'&middot;(a&middot;x + b&middot;y + c&middot;z) = 0
<br/>
d&middot;x&middot;x' + e&middot;y&middot;x' + f&middot;z&middot;x' - a&middot;x&middot;y' - b&middot;y&middot;y' - c&middot;z&middot;y' = 0 **[3]**
<br/>
<br/>
[1] + [2] + [3]
```
%   a     b     c     d     e     f     g     h     i
[   0     0     0   -x*z' -y*z' -z*z'  x*y'  y*y'  z*y' ] 
[  x*z'  y*z'  z*z'   0     0     0   -x*x' -y*x' -z*x' ] * [a,b,c,d,e,f,g,h,i]' = [0]
[ -x*y' -y*y' -z*y'  x*x'  y*x'  z*x'   0     0     0   ]
[   .     .     .     .     .     .     .     .     .   ]
```
<br/>
<br/>
**With Lines**: Solve for H<sup>T</sup>, where l' = H<sup>T</sup>&middot;l
<br/>
<br/>


### 
<br/>


### 
<br/>


### 
<br/>


<br/>

<br/>
<br/>
**Cross-Ratio: a,b,c,d &isin; colinear**: |ab|&middot;|cd| / |ac|&middot;|bd|
|ab|&middot;|cd| / |ad|&middot;|bc|
|ac|&middot;|bd| / |ad|&middot;|bc|


&star;
&lowast;
elation
homology
homography
perspectivity
killmenow


<a name="3DSTUFF"></a>
## Projective 3D Concepts
**Points and Planes are Dual**: ?
<br/>
**Lines are Self-Dual**: ?

### 3D Points
**Point X = [X<sub>1</sub>;X<sub>2</sub>;X<sub>3</sub>;X<sub>4</sub>] = (X,Y,Z,W) ~ (X,Y,Z,1)**: 
<br/>
**Point At Infinity**: X = (X,Y,Z,0)
<br/>
M = [W&#42; &pi;<sup>T</sup>] ; W&#42;&isin;plane, &pi;&isin;point ; nul(M) = point
<br/>


### 3D Planes
**Plane &pi; = [&pi;<sub>1</sub>;&pi;<sub>2</sub>;&pi;<sub>3</sub>;&pi;<sub>4</sub>]** &pi;<sub>1</sub>&middot;X = &pi;<sub>2</sub>&middot;Y + &pi;<sub>3</sub>&middot;Z + &pi;<sub>4</sub> = 0
<br/>
&lt;&pi;<sub>1</sub>,&pi;<sub>2</sub>,&pi;<sub>3</sub>&gt; is normal vector to &pi; , &pi;<sub>4</sub>/||normal|| is distance along normal vector to closest point of &pi; from the origin
<br/>
**Homogenized**: &pi;<sub>1</sub>&middot;X = &pi;<sub>2</sub>&middot;Y + &pi;<sub>3</sub>&middot;Z + &pi;<sub>4</sub>W = 0
<br/>
**Definition From 3 Points**: [X<sub>A</sub><sub>4x1</sub> ; X<sub>B</sub><sub>4x1</sub> ; X<sub>C</sub><sub>4x1</sub>]&middot;&pi;<sub>4x1</sub> = 0
<br/>
**3 Planes Define Point**: [&pi;<sub>A</sub><sub>4x1</sub> ; &pi;<sub>B</sub><sub>4x1</sub> ; &pi;<sub>C</sub><sub>4x1</sub>]&middot;X<sub>4x1</sub> = 0
<br/>
**Parameterized From 3 Points**: X = M&middot;x ; &pi;<sup>T</sup>&middot;M = 0 ; x&isin;P<sup>2</sup> ; M = [X|X<sub>1</sub>|X<sub>2</sub>|X<sub>3</sub>] ; ?
<br/>
M = [W; X<sup>T</sup>] ; W&isin;line, X&isin;point ; nul(M) = plane
<br/>
<br/>
<br/>
**Plane at infinity &pi;<sub>&infin;</sub>**: (&pi;<sub>1</sub>,&pi;<sub>2</sub>,&pi;<sub>3</sub>,0) ; contains all points at infinity
<br/>
- fixed under affinity
<br/>
- 2 parallel planes intersect at &pi;<sub>&infin;</sub>
<br/>
<br/>
**Projective Dot Product of planes &pi;<sub>A</sub>=(&pi;<sub>A1</sub>,&pi;<sub>A2</sub>,&pi;<sub>A3</sub>,&pi;<sub>A4</sub>) and &pi;<sub>B</sub>=(&pi;<sub>B1</sub>,&pi;<sub>B2</sub>,&pi;<sub>B3</sub>,&pi;<sub>B4</sub>)**: cos&theta; = [&pi;<sub>A</sub><sup>T</sup>&middot;Q&#42;<sub>&infin;</sub>&middot;&pi;<sub>B</sub>]/sqrt( (&pi;<sub>A</sub><sup>T</sup>&middot;Q&#42;<sub>&infin;</sub>&middot;&pi;<sub>A</sub>) &middot; (&pi;<sub>B</sub><sup>T</sup>&middot;Q&#42;<sub>&infin;</sub>&middot;&pi;<sub>B</sub>) ) ; invariant to projective transform
<br/>


### 3D Lines
4DOF
<br/>
**Null-Space/Span Representation**:  A,B &isin; points;  W = [A<sub>1x4</sub> ; B<sub>1x4</sub>] ; 
<br/>
*span(W<sup>T</sup>)* = pencil of points
<br/>
*span(right-nul(W))* = pencil of planes (thru line?)
<br/>
P,Q &isin; planes; Dual W = W&#42; = [P<sub>1x4</sub> ; Q<sub>1x4</sub>] ; intersection of 2 planes
<br/>
W&#42; = ???W???
<br/>
*span(W&#42;<sup>T</sup>)* = pencil of planes
<br/>
*span(right-nul(W&#42;))* = pencil of points on line
<br/>
**Plucker Matrices Representation**: 4-space representation of l=x&times;y
<br/>
A,B &isin; points ; L = A&middot;B<sup>T</sup> - B&middot;A<sup>T</sup>
<br/>
L<sub>4x4</sub>, skew-symmetric, rank(L)=2, span(nul(L))=pencil of lines, 
<br/>
L' = H&middot;L&middot;H<sup>T</sup>
<br/>
P,Q &isin; planes, Dual L&#42; = P&middot;Q<sup>T</sup> - Q&middot;P<sup>T</sup>
<br/>
L&#42;' = HH<sup>-T</sup>&middot;L&#42;&middot;H<sup>-1</sup>
<br/>
&pi; = L&#42;&middot;X (plane = line joined with point)
<br/>
L&#42;X = 0 iff X is on L
<br/>
X = L&middot;&pi; (point = intersection of line and plane)
<br/>
L&middot;&pi; = 0 iff L is on &pi;
<br/>
M = [L<sub>1</sub>,...,L<sub>i</sub>,...,L<sub>n</sub>] ; M&middot;pi; = 0 iff lines are all coplanar (nul(M)==&pi;)
<br/>
**Plucker Line Coords Representation**: set of 6 elements from matrix representation (element in P<sup>5</sup> [Klein Quadric])
<br/>
L = {l<sub>1,2</sub>,l<sub>1,3</sub>,l<sub>1,4</sub>,l<sub>2,3</sub>,l<sub>4,2</sub>,l<sub>3,4</sub>}
<br/>
l<sub>1,2</sub>&middot;l<sub>3,4</sub> + l<sub>1,3</sub>&middot;l<sub>4,2</sub> + l<sub>1,4</sub>&middot;l<sub>2,3</sub> = 0
<br/>
Two lines only intersect if coplanar: det[A,B,A',B'] = (L|L') = l<sub>1,2</sub>&middot;l'<sub>3,4</sub> + l<sub>1,3</sub>&middot;l'<sub>4,2</sub> + l<sub>1,4</sub>&middot;l'<sub>2,3</sub> + l'<sub>1,2</sub>&middot;l<sub>3,4</sub> + l'<sub>1,3</sub>&middot;l<sub>4,2</sub> + l'<sub>1,4</sub>&middot;l<sub>2,3</sub> = 0
<br/>
Two lines L,L' intersection of two planes: P,Q and P',Q': (L|L')=det[P,Q,P',Q']
<br/>
<br/>


### Absolute Conic &Omega;<sub>&infin;</sub>
Conic fixed to &pi;<sub>&infin;</sub> under metric transform: x<sub>4</sub> = 0 && x<sub>1</sub><sup>2</sup> + x<sub>2</sub><sup>2</sup> + x<sub>3</sub><sup>2</sup> = 0
<br/>
[x<sub>1</sub>,x<sub>2</sub>,x<sub>3</sub>]&middot;I&middot;[x<sub>1</sub>,x<sub>2</sub>,x<sub>3</sub>]<sup>T</sup> = 0 
<br/>
Imaginary points on &pi;<sub>&infin;</sub> only
<br/>
- All circles intersect &Omega;<sub>&infin;</sub> at two points (circular points); support plane (&pi;) of circle intersects &pi;<sub>&infin;</sub> at a line
<br/>
- All spheres intersect &pi;<sub>&infin;</sub> in &Omega;<sub>&infin;</sub> (circular/elliptic intersection?)
<br/>
- Pole/Polar relation with tangent line pairs on &Omega;<sub>&infin;</sub> and line thru tangent points &rarr; orthogonality?
<br/>


### Absolute Dual Quadric Q&#42;<sub>&infin;</sub> (Dual of &Omega;<sub>&infin;</sub>)
Q&#42;<sub>&infin;</sub> ~ [1,0,0,0; 0,1,0,0; 0,0,1,0; 0,0,0,0];
<br/>
rank(Q&#42;<sub>&infin;</sub>) = 3 ; 8DOF
<br/>
null(Q&#42;<sub>&infin;</sub>) = &pi;<sub>&infin;</sub> <sub> Q&#42;<sub>&infin;</sub>&middot;&pi;<sub>&infin;</sub> = 0 </sub>
<br/>
Consists of all planes tangent to &Omega;<sub>&infin;</sub>
<br/>
<br/>
<br/>



### Points on Planes
<br/>



### Plane-Plane Intersection
<br/>



### P<sup>3</sup> Transform Hierarchy
<br/>
**Projective H**: 15DOF projective transform (collineation)
<br/>
*invariant: intersection of line and plane, order of contact*
<br/>
```
[X']   [a b c d]   [X]
[Y'] = [e f g h] * [Y]
[Z']   [i j k l]   [Z]
[1 ]   [m n o p]   [1]
```
<br/>
<br/>
<br/>



### Quadric Q
**a&middot;x<sup>2</sup> + b&middot;y<sup>2</sup> + c&middot;z<sup>2</sup> + 2&middot;d&middot;x&middot;y + 2&middot;e&middot;x&middot;z + 2&middot;f&middot;y&middot;z + g&middot;x + h&middot;y + i&middot;z + j = 0**
<br/>
**Homogenized**: a&middot;x<sup>2</sup> + b&middot;y<sup>2</sup> + c&middot;z<sup>2</sup> + 2&middot;d&middot;x&middot;y + 2&middot;e&middot;x&middot;z + 2&middot;f&middot;y&middot;z + g&middot;x&middot;w + h&middot;y&middot;w + i&middot;z&middot;w + j&middot;w<sup>2</sup> = 0
<br/>
X<sup>T</sup>&middot;Q&middot;X = 0
<br/>
9DOF
```
    [a d e g]   [X]
    [d b f h] * [Y] = 0
    [e f c i]   [Z]
    [g h i j]   [W]
```
<br/>
Q = U<sup>T</sup>&middot;D&middot;U <sub>(symmetric)</sub> ~ H<sup>T</sup>&middot;D&middot;H ; &sigma(D) = signatire of D = &Sigma;+1 - abs(&Sigma;-1)
<br/>
**Polar Plane &pi; = Q&middot;X**: polar plane
<br/>
<br/>
<br/>
Q' = H<sup>-T</sup>&middot;Q&middot;H<sup>-1</sup>
<br/>
<br/>
<br/>
<br/>
<br/>

**Absolute conic**: &Omega;<sub>&infin;</sub>


### Dual Quadric Q&#42;
Q&#42; = adj(Q) ~ Q<sup>-1</sup> <sub>(Q is invertible)</sub>
<br/>
**Plane defined by Quadric**: &pi;<sup>T</sup>&middot;Q&#42;&middot;&pi; = 0
<br/>
Q&#42;' = H&middot;Q&#42;&middot;H<sup>T</sup>
<br/>
<br/>
<br/>



### Transforms
<br/>
**Points**: X' = HX
<br/>
**Planes**: &pi;' = H<sup>-T</sup>&middot;&pi;
<br/>
**Quadrics**: Q' = H<sup>-T</sup>&middot;Q&middot;H<sup>-1</sup>
<br/>
**Dual Quadrics**: Q&#42;' = H&middot;Q&#42;&middot;H<sup>T</sup>
<br/>


### 3D Transformation Hierarchy
**Euclidean**: H<sub>E</sub> ; 6DOF: 3 translation, 3 rotation
<br/>
volume
<br/>
```
[X']   [ R3x3  t3x1 ]   [X]
[Y'] = [            ] * [Y]
[Z']   [            ]   [Z]        t translation
[1 ]   [ 0  0  0  1 ]   [1]        R rotation matrix
```
<br/>
<br/>

**Similarity/Metric**: H<sub>A</sub> ; 7DOF: +1 scale
<br/>
angles, &Omega;<sub>&infin;</sub>
<br/>
```
[X']   [ s*R3x3 t3x1 ]   [X]
[Y'] = [             ] * [Y]
[Z']   [             ]   [Z]
[1 ]   [ 0  0   0  1 ]   [1]
```
<br/>
<br/>

**Affine**: H<sub>A</sub> ; 12DOF
<br/>
plane parallelism, volume ratios, centroid, &pi;<sub>&infin;</sub>
<br/>
```
[X']   [ A3x3  t3x1 ]   [X]
[Y'] = [            ] * [Y]
[Z']   [            ]   [Z]
[1 ]   [ 0  0  0  1 ]   [1]      A invertible
```
<br/>
<br/>

**Projective**: H<sub>P</sub> ; 15DOF
<br/>
intersection, tangency, gaussian curvature sign
<br/>
```
[X']   [a b c d]   [X]     [ A3x3  t3x1 ]
[Y'] = [e f g h] * [Y]  =  [            ]
[Z']   [i j k l]   [Z]     [            ]
[1 ]   [m n o p]   [1]     [ v1x3    v  ]     v scalar
```
<br/>
<br/>
<br/>



<a name="CAMERA_ABSOLUTE"/>
## Camera transform from absolute truth 3D points known:

**Finding camera pose in 3D space:**
```
[x]   [a b c d]   [X]
[y] = [e f g h] * [Y]
[w]   [i j k l]   [Z]

aX + bY + cZ + d = x
eX + fY + gZ + h = y
iX + jY + kZ + l = w

screenX = x/w = (aX + bY + cZ + d) / (iX + jY + kZ + l)
screenY = y/w = (eX + fY + gZ + h) / (iX + jY + kZ + l)

(iX + jY + kZ + l)x = (aX + bY + cZ + d)
iXx + jYx + kZx + lx = aX + bY + cZ + d
-aX  - bY  - cZ -  d  +  0  +  0  +  0  +  0  + iXx + jYx + kZx + lx = 0

(iX + jY + kZ + l)y = (eX + fY + gZ + h) 
iXy + jYy + kZy + ly = eX + fY + gZ + h
 0  +  0  +  0  +  0  -  eX - fY  -  gZ - h   + iXy + jYy + kZy + ly = 0
-aX  - bY  - cZ -  d  +  0  +  0  +  0  +  0  + iXx + jYx + kZx + lx = 0

[ 0  0  0  0 -X -Y -Z -1 xX xY xZ] * [a b c d e f g h i j k l] = [0]
[-X -Y -Z -1  0  0  0  0 xX xY xZ]

3*4 = 12 unknowns
each point provides 2 equations
[unknowns are also restricted by euclidean reality]
=> need 6+ points

```

?
(x,y,w are (aspect-preserved?) normalized points [-1,1])


Camera 1: H<sub>1</sub>
Camera 2: H<sub>2</sub>

The transform that transforms Camera1 to Camera2 = H<sub>1</sub><sup>-1</sup> &middot; H<sub>2</sub> 



F<sub>rank2</sub><sup>hat</sup> = H'<sup>-T</sup> F H'<sup>-1</sup>

**Essential Matrix, E**: E = K'<sup>T</sup> &middot; F &middot; K
<br/>
P = camera matrix = K &middot; [R | t]
<br/>
E = R[R<sup>T</sup>|t]<sub>&times;</sub> = [t]<sub>&times;</sub>&middot;R = S&middot;R
<br/>
E has 5 DOF (3 rot, 3 trans, 1 scale ambiguity)
<br/>
E has two equal non-zero singular values (and a 0 singular value)
<br/>
E = U &middot; &Sigma;<sub>1,1,0</sub> &middot; V<sup>T</sup>
<br/>
``` 
        [1 0 0]
E = U * [0 1 0] * Vt
        [0 0 0]
```
```
    [ 0 -1  0]
W = [ 1  0  0]
    [ 0  0  1]
```
```
    [ 0  1  0]
Z = [-1  0  0]
    [ 0  0  0]
```
S = (k)&middot;U&middot;Z&middot;U<sup>T</sup>
<br />
&there4; Z = &Sigma;<sub>1,1,0</sub>&middot;W
<br />
&rArr; S = U&middot;&Sigma;<sub>1,1,0</sub>&middot;W&middot;U<sup>T</sup>
<br />
&there4; E = S&middot;R = U&middot;&Sigma;<sub>1,1,0</sub>&middot;(W&middot;U<sup>T</sup>&middot;R)
<br />
<br />
_extraction: 4 possibilities_
<br />
[1 & 3] S = U&middot;Z&middot;U<sup>T</sup>, R = U&middot;W&middot;V<sup>T</sup>
<br/>
[2 & 4] S = U&middot;Z&middot;U<sup>T</sup>, R = U&middot;W&middot;<sup>T</sup>V<sup>T</sup>
<br/>
<br/>
E is only up to scale, translate by &plusmn; u<sub>2</sub>
<br/>
<br/>
[1] P' = [U&middot;W&middot;V<sup>T</sup> | u<sub>2</sub>]
<br/>
[2] P' = [U&middot;W&middot;V<sup>T</sup> | -u<sub>2</sub>]
<br/>
[3] P' = [U&middot;W<sup>T</sup>&middot;V<sup>T</sup> | u<sub>2</sub>]
<br/>
[3] P' = [U&middot;W<sup>T</sup>&middot;V<sup>T</sup> | -u<sub>2</sub>]
<br/>
<br/>
<br/>




<br/>







**Normalized Image Coordinate**:
x<sup>hat</sup> = K<sup>-1</sup> &middot; x



**Camera parameter matrix**:
```
    [ax  s  x0]
K = [0  ay  y0]
    [0   0   1]
```


P = projectildy reconstructed matrix

X<sub>Ei</sub> = REAL WORLD (Euclidean) position
X<sub>i</sub> = projectedly calculated position

X<sub>Ei</sub> = h &middot; X<sub>i</sub>

x<sub>i</sub> = P &middot; H<sup>-1</sup> &middot; X<sub>Ei</sub>










#### Camera Calibration (Finding Intrinsic K Matrix):
- use planar object (2D chess-grid) so 2D z points can be assumed 0
- identify known points in picture on grid
```
[x]   [fx  s cx]   [r11 r12 r13 t1]   [X]
[y] ~ [ 0 fy cy] * [r21 r22 r23 t2] * [Y]
[1]   [ 0  0  1]   [r31 r32 r33 t3]   [Z=0]
                                      [1]
```
- reduce to simple homography
```
[x]   [fx  s cx]   [r11 r12 t1]   [X]
[y] ~ [ 0 fy cy] * [r21 r22 t2] * [Y]
[1]   [ 0  0  1]   [r31 r32 t3]   [Z]
```
- i & j are reference image indexes
- H = [h<sub>1</sub> h<sub>2</sub> h<sub>3</sub>] = &lambda; &middot; K &middot; [r1 r2 t]
	- ? H is found form knowing that a set of 3D points X homographize into image points x
		- solve
- by the magic of matrix algebra (no idea):
    - r1 & r2 are orthonormal
- h<sub>1</sub><sup>T</sup>K<sup>-T</sup>&middot;</sup>K<sup>-1</sup>h<sub>2</sub> = 0
- h<sub>1</sub><sup>T</sup>K<sup>-T</sup>&middot;K<sup>-1</sup>h<sub>1</sub> = h<sub>2</sub><sup>T</sup>K<sup>-T</sup>&middot;K<sup>-1</sup>h<sub>2</sub>
- B = K<sup>-T</sup>&middot;K<sup>-1</sup>
```
    [b11 b12 b13]   [b11 b12 b13]     [ 1/(fx^2)          -s/(fx^2*fy)                       (v0*s - u0*fy)/(fx^2*fy)           ]
B = [b21 b22 b23] = [b12 b22 b23] = l*[    -       s^2/(fx^2*fy^2) + 1/(fy^2)        s(v0*s - u0*fy)/(fx^2*fy^2) - v0/(fy^2)    ]
    [b31 b32 b33]   [b13 b23 b33]     [    -                   -               (v0*s - u0*fy)^2/(fx^2*fy^2) + (v0^2)/(fy^2) + 1 ]
```
b = [b11,b12,b22,b13,b23,b33]
hi = [hi1,hi2,hi3]<sup>T</sup>
```
vij = [hi1*hj1 , hi1*hj2 + hi2*hj1 , hi2*hj2 , hi3*hj1 + hi1*hj3 , hi3*hj2 + hi2*hj3 , hi3*hj3 ]^T
```
h<sub>i</sub><sup>T</sup>&middot;B&middot;h<sub>j</sub> = v<sub>ij</sub><sup>T</sup>&middot;b
```
V = [    v12^T    ]
    [ (v11-v22)^T ]
```
solve for b: V&middot;b = 0
need at least 2 images, each with 8+ known 3D-2D matches
N = 3+ images to find all K
N = 2, assume s=0
N = 1, assume s=0, fx=0, fy=0
<br/>

v0 = (b12&middot;b13 - b11&middot;b23)/(b11&middot;b22-b12&middot;b12)
<br/>
&lambda; = b33 - [b13&middot;b13 + v0&middot;(b12&middot;b13 - b11&middot;b23)]/b11
<br/>
fx = sqrt( &lambda;/b11 )
<br/>
fy = sqrt( (&lambda;&middot;b11)/(b11&middot;b22 - b12&middot;b12) )
<br/>
s = -b12&middot;fx<sup>2</sup>&middot;fy / &lambda;
<br/>
u0 = s&middot;v0/fx - b13&middot;fx<sup>2</sup>/&lambda;
<br/>
(Extrinsic Matrix calculations if care)



a point-set in this case is:
X,Y,0, x,y
each point-set defines 1/8 points for an H matrix


*) get 9 points on plane
*) calculate homography:
	H = R3D.projectiveDLT(pointsFr,pointsTo)
	* use nonlinear to refine H starting point
*) decompose the H from each of the images to hi1,hi2,hi3
*) construct the lines of the V matrix from h's
*) SVD V*b=0
*) use b values to compute K (6) properties


[Camera Calibration - Zhang](http://research.microsoft.com/en-us/um/people/zhang/papers/zhangpami-02-calib.pdf)






<br/>
<br/>
<br/>

Forward radial distortion:

<br/>
<br/>
<br/>

Radial Distortion recovery:
x<sub>corrected</sub> = x(1 + k<sub>1</sub>r<sup>2</sup> + k<sub>2</sub>r<sup>4</sup> + k<sub>3</sub>r<sup>6</sup>)
y<sub>corrected</sub> = y(1 + k<sub>1</sub>r<sup>2</sup> + k<sub>2</sub>r<sup>4</sup> + k<sub>3</sub>r<sup>6</sup>)

Tangental Distortion recovery
x<sub>corrected</sub> = x + (2p<sub>1</sub>xy + p<sub>2</sub>(r<sup>2</sup> + 2x<sup>2</sup>))
y<sub>corrected</sub> = y + (2p<sub>2</sub>xy + p<sub>1</sub>(r<sup>2</sup> + 2y<sup>2</sup>))

k1, k2, k3, p1, p2 &isin; distortion coefficients

r = sqrt(x&middot;x + y&middot;y)
x & y measured from center (principal point)


ITERATE:
A) calculate intrinsic matrix
B) calculate radial (+ tangental) distortion






**2D Calibration:**
* use checkerboard 2D plane, and take picture [need 4+ points per plane]
```
    [u]   [fx 0 cx]   [r11 r12 r13 t1]   [X]
b = [v] ~ [0 fy cy] * [r21 r22 r23 t2] * [Y]
    [1]   [0  0  1]   [r31 r32 r33 t3]   [Z]
                                         [1]
```
choose z=0 in plane => r13,r23,r33 don't matter => H is 3x3
H = (h1,h2,h3) = K * (r1,r2,t) 

B = K<sup>-T</sup> &middot; K<sup>-1</sup> = symmetirc positive definite
=> cholesky factorize
```
    [b11 b12 b13]
B = [b21 b22 b23]
    [b31 b32 b33]
```
b12 = b21
b31 = b23
b32 = b32
b = [b11,b12,b13,b22,b23,b33]


V = constructed with the following:
h1<sup>T</sup> &middot; B &middot; h2 = 0
h1<sup>T</sup> &middot; B &middot; h1 - h2<sup>T</sup> &middot; B &middot; h2 = 0


DLT:
V*b = 0
b = argminb in Vb


Levenberg-Marquart:
lense distortion ...



<br/>
<br/>
<br/>


<br/>
<br/>
<br/>


<br/>
<br/>
<br/>




<a name="RANDOM"/>
## Random Stuff


### Screw/Helical Decomposition (3D)
P(t) = **C** + t**S** <sub>P=line, C=center, S=screwAxis</sub>
<br/>
**Origin of Screw Frame C = &lt;C<sub>x</sub>,C<sub>y</sub>,C<sub>z</sub>&gt;**: Origin of Screw Frame
<br/>
**Screw Vector S = &lt;S<sub>x</sub>,S<sub>y</sub>,S<sub>z</sub>&gt;**: Direction of rotation vector, with magnitude of translation
<br/>
**Rotation Angle &phi;**: &isin; [0,pi]
<br/>
<br/>
**Screw Unit Direction Vector s = unit(S)**: Unit vector version of S
<br/>
**Magnitude of Screw Vector d = ||S||**: 
<br/>
<br/>
**From R matrix and t vector**:
<br/>
somewhere in this mess?: http://www.kwon3d.com/theory/jkinem/helical.html
<br/>
R decomposed into r(unit direction), and &theta; - about origin
<br/>
C = ?
<br/>
&phi; = ?
<br/>
s = ?
<br/>
S = ?
<br/>
<br/>
**To R matrix and t vector**:
<br/>
move to origin. rotate vector, move in S
<br/>
<br/>
<br/>
<br/>



NOTES:
C = [R]C + d - (d*S)S
C = [bxd - bx(bxd)]/[2b*b]
b = tan(&phi;/2)*S



### Algebraic Distance
algebraic discrepancy vector from A&middot;h = 0 <sub>minimized by least squares</sub>
<br/>
d<sub>alg</sub>(**a**,**b**) = ||A&middot;h|| = ||**&epsilon;**||
<br/>
 =?= (**a**&times;**b**)<sup>1/2</sup>
<br/>
<br/>


### Geometric (Euclidean) Distance
d<sub>geo</sub>(**a**,**b**) = ( &Sum;(a<sub>i</sub> - b<sub>i</sub>) )<sup>1/2</sup>
<br/>
Euclidean distance
<br/>
**Single Space error**: ( &Sum;d(x'<sub>i</sub>,H&middot;x<sub>i</sub>)<sup>2</sup> )<sup>1/2</sup>
<br/>
**Symmetric transfer (errors in space A and space B)**: ( &Sum;d(x<sub>i</sub>,H<sup>-1</sup>H&middot;x'<sub>i</sub>)<sup>2</sup> + d(x'<sub>i</sub>,H&middot;x<sub>i</sub>)<sup>2</sup> )<sup>1/2</sup>
<br/>
**Reprojection (perfect: x,x' ; changing: &chi;,&chi;')**: ( &Sum;d(x<sub>i</sub>,&chi;<sub>i</sub>)<sup>2</sup> + d(x'<sub>i</sub>,&chi;'<sub>i</sub>)<sup>2</sup> )<sup>1/2</sup>
<br/>
&rarr; fitting a surface in P/&Reals;<sup>2&middot;dim</sup>, (x<sub>i</sub>,y<sub>i</sub>,x'<sub>i</sub>,y'<sub>i</sub>,..)
<br/>
<br/>



### Sampson Error ~ Mahalanobis Norm
Approximation to Geometric Error *(reduces to geometric error in linear case)*
<br/>
||&Delta;<sub>x</sub>||<sup>2</sup> : (min) distance from variety surface
<br/>
C<sub>H</sub>(x) = A&middot;h (for finding coefficients a,..,i of H for point correspondences)
<br/>
C<sub>H</sub>(x+&Delta;<sub>x</sub>) = C<sub>H</sub>(x) + (&part;C<sub>H</sub>/&part;x)&middot;&Delta;<sub>x</sub>
<br/>
&Delta;<sub>x</sub> = &chi; - x
<br/>
**Find:**
<br/>
C<sub>H</sub>(x) + (&part;C<sub>H</sub>/&part;x)&middot;&Delta;<sub>x</sub> = 0
<br/>
&chi; = point on verity(4D-surface) : C<sub>H</sub>(&chi;) = 0
<br/>
<br/>
C<sub>H</sub>(x) + (&part;C<sub>H</sub>/&part;x)&middot;&Delta;<sub>x</sub> = 0 &harr; J&middot;&Delta;<sub>x</sub> = -&epsilon;
<br/>
&epsilon; &equiv; C<sub>H</sub>(x) &equiv; cost
<br/>
<br/>
*Want vector &Delta;<sub>x</sub> that minimizes ||&Delta;<sub>x</sub>||*
<br/>
&rarr; &Delta;<sub>x</sub> = -J<sup>T</sup>(J&middot;J<sup>T</sup>)<sup>-1</sup>&epsilon;
<br/>
||&Delta;<sub>x</sub>||<sup>2</sup> = &epsilon;<sup>T</sup>(J&middot;J<sup>T</sup>)<sup>-1</sup>&epsilon;
<br/>
Distance<sub>&perp;</sub> = &Sum;&epsilon;<sub>i</sub><sup>T</sup>(J<sub>i</sub>&middot;J<sub>i</sub><sup>T</sup>)<sup>-1</sup>&epsilon;<sub>i</sub>
<br/>
<br/>
<br/>
<br/>


2D: Finding best H, given x<sub>i</sub>&isin;P<sup>3</sup> and x'<sub>i</sub>&isin;P<sup>3</sup>
<br/>
n = number of matching pairs (4 total knowns: x<sub>i</sub>;y<sub>i</sub>;x'<sub>i</sub>;y'<sub>i</sub>)
<br/>
h<sub>9&times;1</sub> = [a,b,c,d,e,f,g,h,i]
<br/>
H = <sub>3&times;3</sub> = [a,b,c; d,e,f; g,h,i]
<br/>
A = <sub>2n&times;9</sub> = matrix formed from 2 equations of: x' = Hx ; x'/z' = ... ; y'/z' = ... 
<br/>
x<sub>4n&times;1</sub> = [x<sub>i</sub>;y<sub>i</sub>;x'<sub>i</sub>;y'<sub>i</sub>]
<br/>
e<sub>2n?or?4n&times;1</sub> = [|x<sub>i</sub> - H<sup>-1</sup>&middot;x'<sub>i</sub>|; |y<sub>i</sub> - H<sup>-1</sup>&middot;x'<sub>i</sub>|; |x'<sub>i</sub> - H&middot;x<sub>i</sub>|; |y'<sub>i</sub> - H&middot;y<sub>i</sub>|]
Hx = C<sub>H</sub>(x)
<br/>
-> could possibly be 2nx1 using GEOMETRIC DISTANCE as error
-> is actually NOT be absolute values, but that the magnitude is taken afterwards
<br/>
&Delta;<sub>x</sub><sub>9&times;1</sub> = change in h, that reduces the error (gradient?), THIS IS WHAT IS SOLVED FOR ON EACH ITERATION
<br/>
= &middot;(J&middot;J<sup>T</sup> + &Lambda;)<sup>-1</sup>&middot;J<sup>T</sup> &middot; error
<br/>
&lambda; = some scale factor for LM iteration
<br/>
&Lambda;<sub>x</sub><sub>9&times;9</sub> = &lambda;&middot;I
<br/>
J<sub>2n?or?4n&times;9</sub> = &part;()/&part;x<sub>i</sub>
 = matrix formed from DERIVATIVES OF 2 equations of: x' = Hx ; x'/z' = ... ; y'/z' = ... 
(numerical or explicit)
<br/>
<br/>
h (H) are updated each iteration
<br/>
<br/>
<br/>





### Mahalanobis Distance
Takes into account error/spread in different directions (covariance &Sigma;)
<br/>
**||x-&chi;||<sub>&Sigma;</sub><sup>2</sup>**: (x-&chi;)<sup>T</sup>&Sigma;<sup>-1</sup>(x-&chi;)
<br/>
**independent error 2 images**: ||&middot;||<sub>&Sigma;</sub> = &Sum; ||x<sub>i</sub>-&chi;<sub>i</sub>||<sub>&Sigma;<sub>i</sub></sub><sup>2</sup> + ||x'<sub>i</sub>-&chi;'<sub>i</sub>||<sub>&Sigma;'<sub>i</sub></sub><sup>2</sup>
<br/>
<br/>


### Maximum Liklihood Estimation (MLE) of homography H
**MLE Minimizes Geometric Error**: (approximated by Sampson Error?)
<br/>
&Sum;d(x'<sub>i</sub>,H&middot;&chi;<sub>i</sub>)<sup>2</sup> *1 image*
<br/>
&Sum; d(x<sub>i</sub>,x&tilde;<sub>i</sub>)<sup>2</sup> + d(x'<sub>i</sub>,x'&tilde;<sub>i</sub>)<sup>2</sup> [ x'&tilde; = H&tilde;&middot;x&tilde; ] *2 images*
<br/>
**MLE Maximizes Log Liklihood**:
<br/>
ln(p(x<sub>i</sub>,x'<sub>i</sub>|H,&chi;<sub>i</sub>)) = &Sum; (1/[2&middot;&sigma;<sup>2</sup>])&middot;d(x'<sub>i</sub>,H&middot;&chi;<sub>i</sub>)<sup>2</sup> + c *1 image*
<br/>
? ln(p(x'<sub>i</sub>|H,&chi;<sub>i</sub>)) = &Sum; (1/[2&middot;&sigma;<sup>2</sup>])&middot;[ d(x<sub>i</sub>,&chi;<sub>i</sub>)<sup>2</sup> + d(x'<sub>i</sub>,H&middot;&chi;<sub>i</sub>)<sup>2</sup> ] + c *2 images*
<br/>
**True Point &chi; and H&middot;&chi;**: exact actual location, zero error
<br/>
**Best Estimates x&tilde; H&tilde; **: minimized error values (MLE)
<br/>
**assumed measurement error of x pdf**: p(x) = (1/[2&pi;&sigma;<sup>2</sup>])&middot;exp(-d(x,&chi;)/(2&middot;&sigma;<sup>2</sup>))
<br/>
<br/>

<br/>
? &Sum; d(x<sub>i</sub>,&chi;<sub>i</sub>)<sup>2</sup> + d(x'<sub>i</sub>,H&middot;&chi;<sub>i</sub>)<sup>2</sup> *2 images*
<br/>



### Invariance-Insuring Methods
DLT minimizing d<sub>geo</sub> is invariant under similarity transforms
<br/>
DLT minimizing d<sub>alg</sub> is not invariant to coordinate shift / scaling
<br/>
**Normalization**: position and scale values about some origin(0) and range(avg distance = &radic;2) (iso- or aniso- tropic), reverse after
<br/>
&crarr; to&#42; = H&middot;fr&#42;
<br/>
&rarr; T<sub>to</sub>&middot;to = H&#42;&middot;T<sub>fr</sub>&middot;fr
<br/>
&rarr; T<sub>to</sub><sup>-1</sup>&middot;T<sub>to</sub>&middot;to = T<sub>to</sub><sup>-1</sup>&middot;H&#42;&middot;T<sub>fr</sub>&middot;fr
<br/>
&rarr; to = T<sub>to</sub><sup>-1</sup>&middot;H&#42;&middot;T<sub>fr</sub>&middot;fr
<br/>
&there4; H = T<sub>to</sub><sup>-1</sup>&middot;H&#42;&middot;T<sub>fr</sub>
<br/>
<br/>
- NOT POINTS AT INFINITY? (128 iii)
<br/>
<br/>


### Iterative Minimization
**Cost Function**: feature to minimize
<br/>
**Parametrization**: Entity to be found
<br/>
**Function Specification**: finding X = f(P), or closest

- measurement vector x &issin; R<sup>N</sup>
- set of parameters P &isin; R<sup>M</sup>
- mapping f : R<sup>M</sup> &rarr; R<sup>N</sup> (parameters to 'measurements')
- S &isin; R<sup>N</sup> is surface of allowable measurements
- cost to be minimized: Mahalanobis distance: ||X - f(P)||<sub>&Sigma;</sub><sup>2</sup> = ||X-f(P)||<sup>T</sup>&middot;&Sigma;<sup>-1</sup>&middot;||X-f(P)||<sup>T</sup>

<br/>
**Single Image**: 
<br/>
**Symmetric Error**: 
<br/>
**Reprojection Error**: 
<br/>
<br/>
<br/>
<br/>


### RANSAC
<br/>
**inliers**: points that fit the set
<br/>
**outliers**: points that don't fit in the set - have smallest support sets
<br/>
**model**: mathematical structure constituting formulas data can fit to (eg: line, homography)
<br/>
**threshold t**: distance separating inliers and outliers (eg: 5&sigma;) - CHOOSE BASED ON 0-MEAN GAUSSIAN ERROR: &chi;<sup>2</sup><sub>m</sub>
<br/>
**consensus set C**: set of points that fit model <sub>i</sub>
<br/>
**support c = |C|**: number of points that lie within threshold of (fit) model<sub>i</sub>
<br/>
**full data set S**: set of all input points
<br/>
**sample set s**: minimum sample required to define/construct/predict model
<br/>
**minimum required support threshold T**: min support to constitute a valid model (could be &infin;)
<br/>
**probability of inlier w = 1-&epsilon;**: proportion of samples that are inliers
<br/>
**probability of outlier &epsilon; = 1-w**: proportion of samples that are outliers
<br/>
**samples s**: total number of data points (samples)
<br/>
**total (max) iterations N = ln(1-p)/ln(1-w<sup>2</sup>)**: number of tests performed based on p
<br/>
**probability p**: probability at least one sample contains no outliers
<br/>
**RANSAC Process**:
for N iterations:
- randomly select a minimum amount of data samples possible
- determine consensus set that fits model, and support count
- if c > T -> terminate ?
use largest consensus set, restimate model
**Restimation Process**:
- find optimal fit to inliers (least squares fit by mean distance)
- reclassify inliers
until converge (there may be oscillation)
[the % assumed worst outliers?]

<br/>
**s**: .
<br/>
<br/>
<br/>
CHOOSING THRESHOLD t = d&perp; = <sub>0</sub>&int;<sup>k<sup>2</sup></sup> &chi;<sub>m</sub><sup>2</sup>(&xi;) d&xi;
<br/>
&sigma; = STDDEV of error (in image units)

| DOF m | t<sup>2</sup> (&alpha;=90%) | t<sup>2</sup> (&alpha;=95%) | Model Example             |
|-------|-----------------------------|-----------------------------|---------------------------|
| 1     | 2.71&sigma;<sup>2</sup>     | 3.84&sigma;<sup>2</sup>     | line, F                   |
| 2     | 4.61&sigma;<sup>2</sup>     | 5.99&sigma;<sup>2</sup>     | homography, camera matrix |
| 3     | 6.25&sigma;<sup>2</sup>     | 7.81&sigma;<sup>2</sup>     | trifocal tensor           |

<br/>
<br/>
CHOOSING SAMPLE COUNTS N:
<br/>
probability of getting an outlier: 1-p = (1-w<sup>s</sup>)<sup>N</sup>  &rArr;  N = ln(1-p)/ln(1-(1-&epsilon;)<sup>s</sup>)
<br/>
<br/>


| SAMPLES p=0.99 |  5% OUT | 10% OUT | 20% OUT | 30% OUT | 50% OUT |
|----------------|---------|---------|---------|---------|---------|
| 2              | 2       | 3       | 5       | 7       | 17      |
| 3              | 3       | 4       | 7       | 11      | 35      |
| 4              | 3       | 5       | 9       | 17      | 72      |
| 5              | 4       | 6       | 12      | 26      | 146     |
| 6              | 4       | 7       | 16      | 37      | 293     |
| 7              | 4       | 8       | 20      | 54      | 588     |
| 8              | 5       | 9       | 26      | 78      | 1177    |
| 10             | 6       | 11      | 41      | 161     | 4714    |


| SAMPLES p=0.95 |  5% OUT | 10% OUT | 20% OUT | 30% OUT | 50% OUT |
|----------------|---------|---------|---------|---------|---------|
| 2              | 2       | 2       | 3       | 5       | 11      |
| 3              | 2       | 3       | 5       | 8       | 23      |
| 4              | 2       | 3       | 6       | 11      | 47      |
| 5              | 3       | 4       | 8       | 17      | 95      |
| 6              | 3       | 4       | 10      | 24      | 191     |
| 7              | 3       | 5       | 13      | 35      | 382     |
| 8              | 3       | 6       | 17      | 51      | 766     |
| 10             | 4       | 7       | 27      | 105     | 3067    |


<br/>
<br/>
<br/>
ADAPTIVE N: assume &epsilon; = 50%, as maximum consensus set grows, this ceilings the &epsilon; <= 1 - max_consensus/N
<br/>
<br/>
weighted (by distance) Least Squared
<br/>
<br/>
<br/>
<br/>
MLE: &delta;<sub>x</sub> = -J<sup>T</sup>(JJ<sup>T</sup>)<sup>-1</sup>&epsilon;
<br/>
Sampson: ||&delta;<sub>x</sub>||<sup>2</sup> = &epsilon;<sup>T</sup>(JJ<sup>T</sup>)<sup>-1</sup>&epsilon;
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>




### 
<br/>
<br/>
<br/>



### Total Least Squares (TLS): (MaxLikEst) (A+ &Delta;A)X = B + &Delta;B
*Least Squares solves for X where  only B is corrected/perturbed* ??? AX = B + &Delta;B
-> my understanding: A is formed by elements OF B, so they are both perturbed?
<br/>
best A and B for A&middot'X = B
<br/>
<br/>
<br/>



### 
<br/>
<br/>
<br/>




&hellip;
&vellip;
H&not;

H&prime;

&iquest;

H&deg;
H&sim;
~

&there4;


H&uml;

&weierp;



<a name="CAMERA"></a>
## Camera Modeling
Variabilities:
- Rotation
- Translation (parallax)
- Radial distortion
- Optical Center

Camera Matrices





<a name="FEATURE"></a>
## Feature Matching


corner

SIFT






<a name="TRIANGULATE"></a>
## Point Triangulation 

<br/>
Essential Matrix (known focal?) - 5 DOF? : R (3) + t(3) + scale
	- 2 singular values are equal, 3rd == 0
x<sub>B-norm</sub><sup>T</sup>&middot;F&middot;x<sub>A-norm</sub> = 0
<br/>
E = K<sub>B</sub><sup>T</sup>&middot;F&middot;K<sub>A</sub>
<br/>

<br/>
<br/>


<br/>
<br/>
Fundamental Matrix - 8 unknowns + rank2  = [7 DOF]
<br/>
x<sub>B</sub><sup>T</sup>&middot;F&middot;x<sub>A</sub> = 0
<br/>
l<sub>A in B</sub> = F&middot;x<sub>A</sub>
<br/>
<br/>
F = [t]<sub>&times;</sub>&middot;M & t=e' &hArr; P = [I | 0], P'=[M | t]
<br/>
M = ?
<br/>
<br/>
P' = [ [e']<sub>&times;</sub>&middot;F + e'&middot;v<sup>T</sup> | &lambda;&middot;e' ]
<br/>
e' = epipole in image B
<br/>
v = any 3 vector
<br/>
&lambda; = nonzero scalar
<br/>
_choose v = [0,0,0]<sup>T</sup>, &lambda; = 1_
<br/>
<br/>

Pfolleys:
<br/>
P2 = [[e<sup>12</sup>]<sub>&times;</sub>&middot;F<sub>12</sub> + e<sub>12</sub>&middot;&pi;<sup>T</sup> | &sigma;&middot;e<sub>12</sub>]

(what is / how to find Hinfin:i,j)?






<br/>
<br/>
epipole: F&middot;e<sub></sub> = 0 ; F<sup>T</sup>&middot;e' = 0
<br/>
e / e' = eigenvectors..
<br/>
e = right null vector of V (of F)  (right null vector of F?)
<br/>
e' = right null vector of U (of F)  (left null vector of F?)
<br/>
<br/>
e = svd(F).V.col(2).homo()
<br/>
<br/>
epipolar lines: l = F&middot;x



**Linear Triangulation**:
<br/>
x = P&middot;X
<br/>
x' = P'&middot;X
<br/>
<br/>
**THIS IS NOT PROJECTIVE INVARIANT**
<br/>
```
[x]   [a b c d][X]
[y] = [e f g h][Y]
[^]   [i j k l][Z]
               [1]
```
<br/>
x = a&middot;X + b&middot;Y + c&middot;Z + d
<br/>
y = e&middot;X + f&middot;Y + g&middot;Z + h
<br/>
&lambda; = i&middot;X + j&middot;Y + k&middot;Z + l
<br/>
**homogeneous**: x ~ x/&lambda;, y ~ y/&lambda;
<br/>
x&middot;(i&middot;X + j&middot;Y + k&middot;Z + l) = a&middot;X + b&middot;Y + c&middot;Z + d
<br/>
y&middot;(i&middot;X + j&middot;Y + k&middot;Z + l) = e&middot;X + f&middot;Y + g&middot;Z + h
<br/>
&rArr;
<br/>
x&middot;(i&middot;X + j&middot;Y + k&middot;Z + l) - (a&middot;X + b&middot;Y + c&middot;Z + d) = 0
<br/>
y&middot;(i&middot;X + j&middot;Y + k&middot;Z + l) - (e&middot;X + f&middot;Y + g&middot;Z + h) = 0
<br/>
&rArr;
<br/>
X&middot;(x&middot;i - a) + Y&middot;(x&middot;j - b) + Z(x&middot;k - c) - d = 0
<br/>
X(y&middot;i - e) + Y(y&middot;j - f) + Z(y&middot;k - g) - h = 0
<br/>
<br/>
x&middot;(P<sub>2,:</sub>&middot;X) - (P<sub>0,:</sub>&middot;X) = 0
<br/>
y&middot;(P<sub>2,:</sub>&middot;X) - (P<sub>1,:</sub>&middot;X) = 0
<br/>
<br/>
```
#        X         Y         Z      1
    [ x*i - a   x*j - b   x*k - c   -d  ]   [0]
A = [ y*i - e   y*j - f   y*k - g   -h  ] = [0]
    [ x'*i'-a'  x'*j'-b'  x'*k'-c'  -d' ]   [0]
    [ y'*i'-e'  y'*j'-f'  y'*k'-g'  -h' ]   [0]
```
<br/>
SVD(A) &rarr; nul(V)
<br/>
<br/>








#### forming distance equation
d(x&prime;,l&prime;)<sup>2</sup> = z<sup>2</sup>/(x<sup>2</sup> + y<sup>2</sup>)
<br/>
...
<br/>
s(t) = t<sup>2</sup>/(1 + f<sup>2</sup>) + ()/()


#### forming derivative polynomial
s&prime;(t) = ...
<br/>
<br/>


#### reducing root polynomial
g(t) = t&middot;[(a&middot;t + b)<sup>2</sup> + f&prime;<sup>2</sup>&middot;(c&middot;t + d)<sup>2</sup>] - (a&middot;b - b&middot;c)&middot;(1 + f<sup>2</sup>&middot;t<sup>2</sup>)<sup>2</sup>&middot;(a&middot;t + b)&middot;(c&middot;t + d)
<br/>
= t&middot;(a&middot;t + b)&middot;(a&middot;t + b) + t&middot;f&prime;<sup>2</sup>&middot;(c&middot;t + d)&middot;(c&middot;t + d)
<br/>
t&middot;(a&middot;t<sup>2</sup> + b<sup>2</sup> + 2&middot;a&middot;t&middot;b) + t&middot;f&prime;<sup>2</sup>&middot;(c&middot;t<sup>2</sup> + d<sup>2</sup> + 2&middot;c&middot;t&middot;d)
<br/>
a&middot;t<sup>3</sup> + b<sup>2</sup>&middot;t + 2&middot;a&middot;b&middot;t<sup>2</sup> + f&prime;<sup>2</sup>&middot;c&middot;t<sup>3</sup> + f&prime;<sup>2</sup>&middot;d<sup>2</sup>&middot;t + f&prime;<sup>2</sup>&middot;2&middot;c&middot;d&middot;t<sup>2</sup>
<br/>
t&middot;(b<sup>2</sup> + f&prime;<sup>2</sup>&middot;d<sup>2</sup>) + t<sup>2</sup>&middot;(2&middot;a&middot;b + f&prime;<sup>2</sup>&middot;2&middot;c&middot;d) + t<sup>3</sup>&middot;(a + f&prime;<sup>2</sup>&middot;c)
<br/>
<br/>
<br/>
-
<br/>
<br/>
(a&middot;b - b&middot;c)&middot;(1 + f<sup>2</sup>&middot;t<sup>2</sup>)&middot;(1 + f<sup>2</sup>&middot;t<sup>2</sup>)&middot;(a&middot;t + b)&middot;(c&middot;t + d)
<br/>
(a&middot;b + a&middot;b&middot;f<sup>2</sup>&middot;t<sup>2</sup> - b&middot;c - b&middot;c&middot;f<sup>2</sup>&middot;t<sup>2</sup>)&middot;(1 + f<sup>2</sup>&middot;t<sup>2</sup>)&middot;(a&middot;t&middot;c&middot;t +a&middot;t&middot;d + b&middot;c&middot;t + b&middot;d)
<br/>
(a&middot;b + a&middot;b&middot;f<sup>2</sup>&middot;t<sup>2</sup> - b&middot;c - b&middot;c&middot;f<sup>2</sup>&middot;t<sup>2</sup> +  a&middot;b&middot;f<sup>2</sup>&middot;t<sup>2</sup> + a&middot;b&middot;f<sup>2</sup>&middot;t<sup>2</sup>&middot;f<sup>2</sup>&middot;t<sup>2</sup> - b&middot;c&middot;f<sup>2</sup>&middot;t<sup>2</sup> - b&middot;c&middot;f<sup>2</sup>&middot;t<sup>2</sup>&middot;f<sup>2</sup>&middot;t<sup>2</sup>)&middot;(a&middot;t&middot;c&middot;t +a&middot;t&middot;d + b&middot;c&middot;t + b&middot;d)
<br/>
<br/>
<br/>
<br/>
<br/>


<br/>




#### long simplification of cost polynomial / root polynomial:








#### forming distance equation
d(x,l)<sup>2</sup> = z<sup>2</sup>/(x<sup>2</sup> + y<sup>2</sup>)
<br/>
...
<br/>
s(t) = t<sup>2</sup>/(1 + f<sup>2</sup>&middot;t<sup>2</sup>) + (c&middot;t + d)<sup>2</sup>/[(a&middot;t + b)<sup>2</sup> + f&prime;<sup>2</sup>&middot;(c&middot;t + d)<sup>2</sup>]


#### forming derivative polynomial
s&prime;(t) = 2&middot;t/(1 + f<sup>2</sup>&middot;t<sup>2</sup>)<sup>2</sup> - [2&middot;(a&middot;b - c&middot;d)&middot;(a&middot;t + b)&middot;(c&middot;t + d)]/[(a&middot;t + b)<sup>2</sup> + f&prime;<sup>2</sup>&middot;(c&middot;t + d)<sup>2</sup>]<sup>2</sup>
<br/>
<br/>


#### reducing root polynomial
roots @ s&prime;(t) = 0 = 2&middot;g(t)
<br/>
g(t) = t&middot;[(a&middot;t + b)<sup>2</sup> + f&prime;<sup>2</sup>&middot;(c&middot;t + d)<sup>2</sup>] - (a&middot;b - b&middot;c)&middot;(1 + f<sup>2</sup>&middot;t<sup>2</sup>)<sup>2</sup>&middot;(a&middot;t + b)&middot;(c&middot;t + d)
<br/>
= A - B
<br/>
A:
<br/>
t&middot;(a&middot;t + b)&middot;(a&middot;t + b) + t&middot;f&prime;<sup>2</sup>&middot;(c&middot;t + d)&middot;(c&middot;t + d)
<br/>
t&middot;(a<sup>2</sup>&middot;t<sup>2</sup> + b<sup>2</sup> + 2&middot;a&middot;t&middot;b) + t&middot;f&prime;<sup>2</sup>&middot;(c<sup>2</sup>&middot;t<sup>2</sup> + d<sup>2</sup> + 2&middot;c&middot;t&middot;d)
<br/>
a<sup>2</sup>&middot;t<sup>3</sup> + b<sup>2</sup>&middot;t + 2&middot;a&middot;b&middot;t<sup>2</sup> + f&prime;<sup>2</sup>&middot;c<sup>2</sup>&middot;t<sup>3</sup> + f&prime;<sup>2</sup>&middot;d<sup>2</sup>&middot;t + f&prime;<sup>2</sup>&middot;2&middot;c&middot;d&middot;t<sup>2</sup>
<br/>
t&middot;(b<sup>2</sup> + f&prime;<sup>2</sup>&middot;d<sup>2</sup>) + t<sup>2</sup>&middot;(2&middot;a&middot;b + 2&middot;f&prime;<sup>2</sup>&middot;c&middot;d) + t<sup>3</sup>&middot;(a<sup>2</sup> + f&prime;<sup>2</sup>&middot;c<sup>2</sup>)
<br/>
t<sup>0</sup>:
<br/>
(-)
<br/>
t<sup>1</sup>:
<br/>
b<sup>2</sup> + f&prime;<sup>2</sup>&middot;d<sup>2</sup>
<br/>
t<sup>2</sup>:
<br/>
2&middot;a&middot;b + 2&middot;f&prime;<sup>2</sup>&middot;c&middot;d
<br/>
t<sup>3</sup>:
<br/>
a<sup>2</sup> + f&prime;<sup>2</sup>&middot;c<sup>2</sup>
<br/>
<br/>
B:
<br/>
(a&middot;b - b&middot;c)&middot;(1 + f<sup>2</sup>&middot;t<sup>2</sup>)&middot;(1 + f<sup>2</sup>&middot;t<sup>2</sup>)&middot;(a&middot;t + b)&middot;(c&middot;t + d)
<br/>
(a&middot;b + a&middot;b&middot;f<sup>2</sup>&middot;t<sup>2</sup> - b&middot;c - b&middot;c&middot;f<sup>2</sup>&middot;t<sup>2</sup>)&middot;(1 + f<sup>2</sup>&middot;t<sup>2</sup>)&middot;(a&middot;t&middot;c&middot;t + a&middot;t&middot;d + b&middot;c&middot;t + b&middot;d)
<br/>
(a&middot;b + a&middot;b&middot;f<sup>2</sup>&middot;t<sup>2</sup> - b&middot;c - b&middot;c&middot;f<sup>2</sup>&middot;t<sup>2</sup> +  a&middot;b&middot;f<sup>2</sup>&middot;t<sup>2</sup> + a&middot;b&middot;f<sup>2</sup>&middot;t<sup>2</sup>&middot;f<sup>2</sup>&middot;t<sup>2</sup> - b&middot;c&middot;f<sup>2</sup>&middot;t<sup>2</sup> - b&middot;c&middot;f<sup>2</sup>&middot;t<sup>2</sup>&middot;f<sup>2</sup>&middot;t<sup>2</sup>)&middot;(a&middot;t&middot;c&middot;t +a&middot;t&middot;d + b&middot;c&middot;t + b&middot;d)
<br/>
=
<br/>
a&middot;b&middot;a&middot;t&middot;c&middot;t + a&middot;b&middot;f<sup>2</sup>&middot;t<sup>2</sup>&middot;a&middot;t&middot;c&middot;t - b&middot;c&middot;a&middot;t&middot;c&middot;t - b&middot;c&middot;f<sup>2</sup>&middot;t<sup>2</sup>&middot;a&middot;t&middot;c&middot;t + a&middot;b&middot;f<sup>2</sup>&middot;t<sup>2</sup>&middot;a&middot;t&middot;c&middot;t + a&middot;b&middot;f<sup>2</sup>&middot;t<sup>2</sup>&middot;f<sup>2</sup>&middot;t<sup>2</sup>&middot;a&middot;t&middot;c&middot;t - b&middot;c&middot;f<sup>2</sup>&middot;t<sup>2</sup>&middot;a&middot;t&middot;c&middot;t - b&middot;c&middot;f<sup>2</sup>&middot;t<sup>2</sup>&middot;f<sup>2</sup>&middot;t<sup>2</sup>&middot;a&middot;t&middot;c&middot;t
<br/>
+
<br/>
a&middot;b&middot;a&middot;t&middot;d + a&middot;b&middot;f<sup>2</sup>&middot;t<sup>2</sup>&middot;a&middot;t&middot;d - b&middot;c&middot;a&middot;t&middot;d - b&middot;c&middot;f<sup>2</sup>&middot;t<sup>2</sup>&middot;a&middot;t&middot;d + a&middot;b&middot;f<sup>2</sup>&middot;t<sup>2</sup>&middot;a&middot;t&middot;d + a&middot;b&middot;f<sup>2</sup>&middot;t<sup>2</sup>&middot;f<sup>2</sup>&middot;t<sup>2</sup>&middot;a&middot;t&middot;d - b&middot;c&middot;f<sup>2</sup>&middot;t<sup>2</sup>&middot;a&middot;t&middot;d - b&middot;c&middot;f<sup>2</sup>&middot;t<sup>2</sup>&middot;f<sup>2</sup>&middot;t<sup>2</sup>&middot;a&middot;t&middot;d
<br/>
+
<br/>
a&middot;b&middot;b&middot;c&middot;t + a&middot;b&middot;f<sup>2</sup>&middot;t<sup>2</sup>&middot;b&middot;c&middot;t - b&middot;c&middot;b&middot;c&middot;t - b&middot;c&middot;f<sup>2</sup>&middot;t<sup>2</sup>&middot;b&middot;c&middot;t + a&middot;b&middot;f<sup>2</sup>&middot;t<sup>2</sup>&middot;b&middot;c&middot;t + a&middot;b&middot;f<sup>2</sup>&middot;t<sup>2</sup>&middot;f<sup>2</sup>&middot;t<sup>2</sup>&middot;b&middot;c&middot;t - b&middot;c&middot;f<sup>2</sup>&middot;t<sup>2</sup>&middot;b&middot;c&middot;t - b&middot;c&middot;f<sup>2</sup>&middot;t<sup>2</sup>&middot;f<sup>2</sup>&middot;t<sup>2</sup>&middot;b&middot;c&middot;t
<br/>
+
<br/>
a&middot;b&middot;b&middot;d + a&middot;b&middot;f<sup>2</sup>&middot;t<sup>2</sup>&middot;b&middot;d - b&middot;c&middot;b&middot;d - b&middot;c&middot;f<sup>2</sup>&middot;t<sup>2</sup>&middot;b&middot;d + a&middot;b&middot;f<sup>2</sup>&middot;t<sup>2</sup>&middot;b&middot;d + a&middot;b&middot;f<sup>2</sup>&middot;t<sup>2</sup>&middot;f<sup>2</sup>&middot;t<sup>2</sup>&middot;b&middot;d - b&middot;c&middot;f<sup>2</sup>&middot;t<sup>2</sup>&middot;b&middot;d - b&middot;c&middot;f<sup>2</sup>&middot;t<sup>2</sup>&middot;f<sup>2</sup>&middot;t<sup>2</sup>&middot;b&middot;d
<br/>
=
<br/>
a<sup>2</sup>&middot;b&middot;c&middot;t<sup>2</sup> + a<sup>2</sup>&middot;b&middot;c&middot;f<sup>2</sup>t<sup>4</sup> - a&middot;b&middot;c<sup>2</sup>&middot;t<sup>2</sup> - a&middot;b&middot;c<sup>2</sup>&middot;f<sup>2</sup>&middot;t<sup>4</sup> + a<sup>2</sup>&middot;b&middot;c&middot;f<sup>2</sup>&middot;t<sup>4</sup> + a<sup>2</sup>&middot;b&middot;c&middot;f<sup>4</sup>&middot;t<sup>6</sup> - a&middot;b&middot;c<sup>2</sup>&middot;f<sup>2</sup>&middot;t<sup>4</sup> - a&middot;b&middot;c<sup>2</sup>&middot;f<sup>4</sup>&middot;t<sup>6</sup>
<br/>
+
<br/>
a<sup>2</sup>&middot;b&middot;d&middot;t + a<sup>2</sup>&middot;b&middot;d&middot;f<sup>2</sup>&middot;t<sup>3</sup> - a&middot;b&middot;c&middot;d&middot;t - a&middot;b&middot;c&middot;d&middot;f<sup>2</sup>&middot;t<sup>3</sup> + a<sup>2</sup>&middot;b&middot;d&middot;f<sup>2</sup>&middot;t<sup>3</sup> + a<sup>2</sup>&middot;b&middot;d&middot;f<sup>4</sup>&middot;t<sup>5</sup> - a&middot;b&middot;c&middot;d&middot;f<sup>2</sup>&middot;t<sup>3</sup> - a&middot;b&middot;c&middot;d&middot;f<sup>4</sup>&middot;t<sup>5</sup>
<br/>
+
<br/>
a&middot;b<sup>2</sup>&middot;c&middot;t + a&middot;b<sup>2</sup>&middot;c&middot;f<sup>2</sup>&middot;t<sup>3</sup> - b<sup>2</sup>&middot;c<sup>2</sup>&middot;t - b<sup>2</sup>&middot;c<sup>2</sup>&middot;f<sup>2</sup>&middot;t<sup>3</sup> + a&middot;b<sup>2</sup>&middot;c&middot;f<sup>2</sup>&middot;t<sup>3</sup> + a&middot;b<sup>2</sup>&middot;c&middot;f<sup>4</sup>&middot;t<sup>5</sup> - b<sup>2</sup>&middot;c<sup>2</sup>&middot;f<sup>2</sup>&middot;t<sup>3</sup> - b<sup>2</sup>&middot;c<sup>2</sup>&middot;f<sup>4</sup>&middot;t<sup>5</sup>
<br/>
+
<br/>
a&middot;b<sup>2</sup>&middot;d + a&middot;b<sup>2</sup>&middot;d&middot;f<sup>2</sup>&middot;t<sup>2</sup> - b<sup>2</sup>&middot;c&middot;d - b<sup>2</sup>&middot;c&middot;d&middot;f<sup>2</sup>&middot;t<sup>2</sup> + a&middot;b<sup>2</sup>&middot;d&middot;f<sup>2</sup>&middot;t<sup>2</sup> + a&middot;b<sup>2</sup>&middot;d&middot;f<sup>4</sup>&middot;t<sup>4</sup> - b<sup>2</sup>&middot;c&middot;d&middot;f<sup>2</sup>&middot;t<sup>2</sup> - b<sup>2</sup>&middot;c&middot;d&middot;f<sup>4</sup>&middot;t<sup>4</sup>
<br/>
<br/>

t<sup>0</sup>:
<br/>
(-)
<br/>
t<sup>1</sup>:
<br/>
b<sup>2</sup> + f&prime;<sup>2</sup>&middot;d<sup>2</sup>
<br/>
t<sup>2</sup>:
<br/>
2&middot;a&middot;b + 2&middot;f&prime;<sup>2</sup>&middot;c&middot;d
<br/>
t<sup>3</sup>:
<br/>
a<sup>2</sup> + f&prime;<sup>2</sup>&middot;c<sup>2</sup>
<br/>
<br/>

t<sup>0</sup>:
<br/>
+a&middot;b<sup>2</sup>&middot;d
-b<sup>2</sup>&middot;c&middot;d
<br/>
t<sup>1</sup>:
<br/>
+a<sup>2</sup>&middot;b&middot;d
-a&middot;b&middot;c&middot;d
+a&middot;b<sup>2</sup>&middot;c
-b<sup>2</sup>&middot;c<sup>2</sup>
<br/>
t<sup>2</sup>:
<br/>
+a<sup>2</sup>&middot;b&middot;c
-a&middot;b&middot;c<sup>2</sup>
+a&middot;b<sup>2</sup>&middot;d&middot;f<sup>2</sup>
-b<sup>2</sup>&middot;c&middot;d&middot;f<sup>2</sup>
+a&middot;b<sup>2</sup>&middot;d&middot;f<sup>2</sup>
-b<sup>2</sup>&middot;c&middot;d&middot;f<sup>2</sup>
<br/>
t<sup>3</sup>:
<br/>
+a<sup>2</sup>&middot;b&middot;d&middot;f<sup>2</sup>
-a&middot;b&middot;c&middot;d&middot;f<sup>2</sup>
+a<sup>2</sup>&middot;b&middot;d&middot;f<sup>2</sup>
-a&middot;b&middot;c&middot;d&middot;f<sup>2</sup>
+a&middot;b<sup>2</sup>&middot;c&middot;f<sup>2</sup>
-b<sup>2</sup>&middot;c<sup>2</sup>&middot;f<sup>2</sup>
+a&middot;b<sup>2</sup>&middot;c&middot;f<sup>2</sup>
-b<sup>2</sup>&middot;c<sup>2</sup>&middot;f<sup>2</sup>
<br/>
t<sup>4</sup>:
<br/>
+a<sup>2</sup>&middot;b&middot;c&middot;f<sup>2</sup>
-a&middot;b&middot;c<sup>2</sup>&middot;f<sup>2</sup>
+a<sup>2</sup>&middot;b&middot;c&middot;f<sup>2</sup>
-a&middot;b&middot;c<sup>2</sup>&middot;f<sup>2</sup>
+a&middot;b<sup>2</sup>&middot;d&middot;f<sup>4</sup>
-b<sup>2</sup>&middot;c&middot;d&middot;f<sup>4</sup>
<br/>
t<sup>5</sup>:
<br/>
+a<sup>2</sup>&middot;b&middot;d&middot;f<sup>4</sup>
-a&middot;b&middot;c&middot;d&middot;f<sup>4</sup>
+a&middot;b<sup>2</sup>&middot;c&middot;f<sup>4</sup>
-b<sup>2</sup>&middot;c<sup>2</sup>&middot;f<sup>4</sup>
<br/>
t<sup>6</sup>:
<br/>
+a<sup>2</sup>&middot;b&middot;c&middot;f<sup>4</sup>
-a&middot;b&middot;c<sup>2</sup>&middot;f<sup>4</sup>
<br/>
<br/>

**A-B:**
<br/>
t<sup>0</sup>:
<br/>
-a&middot;b<sup>2</sup>&middot;d
+b<sup>2</sup>&middot;c&middot;d

t<sup>1</sup>:
<br/>
+b<sup>2</sup>
+f&prime;<sup>2</sup>&middot;d<sup>2</sup>
-a<sup>2</sup>&middot;b&middot;d
+a&middot;b&middot;c&middot;d
-a&middot;b<sup>2</sup>&middot;c
+b<sup>2</sup>&middot;c<sup>2</sup>

t<sup>2</sup>:
<br/>
+2&middot;a&middot;b
+2&middot;f&prime;<sup>2</sup>&middot;c&middot;d
-a<sup>2</sup>&middot;b&middot;c
+a&middot;b&middot;c<sup>2</sup>
-a&middot;b<sup>2</sup>&middot;d&middot;f<sup>2</sup>
+b<sup>2</sup>&middot;c&middot;d&middot;f<sup>2</sup>
-a&middot;b<sup>2</sup>&middot;d&middot;f<sup>2</sup>
+b<sup>2</sup>&middot;c&middot;d&middot;f<sup>2</sup>

t<sup>3</sup>:
<br/>
+a<sup>2</sup>
+f&prime;<sup>2</sup>&middot;c<sup>2</sup>
+a<sup>2</sup>&middot;b&middot;d&middot;f<sup>2</sup>
-a&middot;b&middot;c&middot;d&middot;f<sup>2</sup>
+a<sup>2</sup>&middot;b&middot;d&middot;f<sup>2</sup>
-a&middot;b&middot;c&middot;d&middot;f<sup>2</sup>
+a&middot;b<sup>2</sup>&middot;c&middot;f<sup>2</sup>
-b<sup>2</sup>&middot;c<sup>2</sup>&middot;f<sup>2</sup>
+a&middot;b<sup>2</sup>&middot;c&middot;f<sup>2</sup>
-b<sup>2</sup>&middot;c<sup>2</sup>&middot;f<sup>2</sup>

t<sup>4</sup>:
<br/>
-a<sup>2</sup>&middot;b&middot;c&middot;f<sup>2</sup>
+a&middot;b&middot;c<sup>2</sup>&middot;f<sup>2</sup>
-a<sup>2</sup>&middot;b&middot;c&middot;f<sup>2</sup>
+a&middot;b&middot;c<sup>2</sup>&middot;f<sup>2</sup>
-a&middot;b<sup>2</sup>&middot;d&middot;f<sup>4</sup>
+b<sup>2</sup>&middot;c&middot;d&middot;f<sup>4</sup>

t<sup>5</sup>:
<br/>
-a<sup>2</sup>&middot;b&middot;d&middot;f<sup>4</sup>
+a&middot;b&middot;c&middot;d&middot;f<sup>4</sup>
-a&middot;b<sup>2</sup>&middot;c&middot;f<sup>4</sup>
+b<sup>2</sup>&middot;c<sup>2</sup>&middot;f<sup>4</sup>

t<sup>6</sup>:
<br/>
-a<sup>2</sup>&middot;b&middot;c&middot;f<sup>4</sup>
+a&middot;b&middot;c<sup>2</sup>&middot;f<sup>4</sup>

<br/>
**=**
<br/>
t<sup>0</sup>:
<br/>
-a&middot;b<sup>2</sup>&middot;d
+b<sup>2</sup>&middot;c&middot;d
<br/>
t<sup>1</sup>:
<br/>
+b<sup>2</sup>
+f&prime;<sup>2</sup>&middot;d<sup>2</sup>
-a<sup>2</sup>&middot;b&middot;d
+a&middot;b&middot;c&middot;d
-a&middot;b<sup>2</sup>&middot;c
+b<sup>2</sup>&middot;c<sup>2</sup>
<br/>
t<sup>2</sup>:
<br/>
+2&middot;a&middot;b
+2&middot;f&prime;<sup>2</sup>&middot;c&middot;d
-a<sup>2</sup>&middot;b&middot;c
+a&middot;b&middot;c<sup>2</sup>
-2&middot;a&middot;b<sup>2</sup>&middot;d&middot;f<sup>2</sup>
+2&middot;b<sup>2</sup>&middot;c&middot;d&middot;f<sup>2</sup>
<br/>
t<sup>3</sup>:
<br/>
+a<sup>2</sup>
+f&prime;<sup>2</sup>&middot;c<sup>2</sup>
+2&middot;a<sup>2</sup>&middot;b&middot;d&middot;f<sup>2</sup>
-2&middot;a&middot;b&middot;c&middot;d&middot;f<sup>2</sup>
+2&middot;a&middot;b<sup>2</sup>&middot;c&middot;f<sup>2</sup>
-2&middot;b<sup>2</sup>&middot;c<sup>2</sup>&middot;f<sup>2</sup>
<br/>
t<sup>4</sup>:
<br/>
-2&middot;a<sup>2</sup>&middot;b&middot;c&middot;f<sup>2</sup>
+2&middot;a&middot;b&middot;c<sup>2</sup>&middot;f<sup>2</sup>
-a&middot;b<sup>2</sup>&middot;d&middot;f<sup>4</sup>
+b<sup>2</sup>&middot;c&middot;d&middot;f<sup>4</sup>
<br/>
t<sup>5</sup>:
<br/>
-a<sup>2</sup>&middot;b&middot;d&middot;f<sup>4</sup>
+a&middot;b&middot;c&middot;d&middot;f<sup>4</sup>
-a&middot;b<sup>2</sup>&middot;c&middot;f<sup>4</sup>
+b<sup>2</sup>&middot;c<sup>2</sup>&middot;f<sup>4</sup>
<br/>
t<sup>6</sup>:
<br/>
-a<sup>2</sup>&middot;b&middot;c&middot;f<sup>4</sup>
+a&middot;b&middot;c<sup>2</sup>&middot;f<sup>4</sup>
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
<br/>
<br/>



















#### Finding All Roots of Arbitrary Polynomial
**ex: 2-degree:**
<br/>
x &equiv; 1/&lambda;
<br/>
a&middot;x<sup>2</sup> + b&middot;x + c = 0
<br/>
a&middot;(1/&lambda;)<sup>2</sup> + b&middot;(1/&lambda;) + c = 0
<br/>
a + b&middot;&lambda; + c&lambda;<sup>2</sup> = 0
<br/>
a/c + b/c &middot; &lambda; + &lambda;<sup>2</sup> = 0
<br/>
a/c + b/c &middot; &lambda; + &lambda;<sup>2</sup> = 0
<br/>
solve for characteristic equation: det(A - &Lambda;) = 0
<br/>
```
[ -b/c - 1/l ,    -a/c   ]
[      1     ,  0 - 1/l  ]
```
det = 0 = (b/c - 1/&lambda;)&middot;(0 - 1/&lambda;) - (-b/c)&middot;(1)
<br/>
0 = b/c/&lambda; + 1/&lambda;<sup>2</sup> + a/c 
<br/>
0 = b/c &middot; &lambda; + 1 + a/c &middot; &lambda;<sup>2</sup>
<br/>
0 = c + b&middot;&lambda; + a&middot;&lambda;<sup>2</sup>
<br/>
**generally, n-degree:**
<br/>
c<sub>0</sub> + c<sub>1</sub>&middot;x + ... + c<sub>n</sub>&middot;x<sup>n</sup> = 0
<br/>
```
[ -c_1/c_0 , -c_2/c_0 , ... , -c_n/c_0 ]
[     1    ,     0    , ... ,     0    ]
[     0    ,     1    , ... ,     0    ]
[     0    ,     0    , ... ,     0    ]
[    ...   ,    ...   , ... ,    ...   ]
[     0    ,     0    , ... ,     0    ]
```
&Lambda; = eig(A)
<br/>
<br/>
for c<sub>0</sub> &asymp; 0 &rArr; c &equiv; &epsilon;
<br/>
<br/>












### (V)EGADEAT|-|



<br/>
<br/>








(Simultaneous) Bundle Adjustment


N-View Geometry/Calibration/...


Point Triangulation

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

7 Point Determinant: det(&alpha;&middot;F<sub>A</sub> + (1-&alpha;)&middot;F<sub>B</sub>)
<br/>
```
     [a b c]
det( [d e f] )
     [g h i]
```
<br/>
a&middot;(e&middot;i - f&middot;h) - b&middot;(d&middot;i - f&middot;g) + c&middot;(d&middot;h  - e&middot;g)
<br/>
a&middot;e&middot;i - a&middot;f&middot;h + b&middot;f&middot;g - b&middot;d&middot;i + c&middot;d&middot;h - c&middot;e&middot;g
<br/>
(1) - (2) + (3) - (4) + (5) - (6)
<br/>
<br/>
a = &alpha;&middot;A<sub>0,0</sub> + (1-&alpha;)&middot;B<sub>0,0</sub>
<br/>
b = &alpha;&middot;A<sub>0,1</sub> + (1-&alpha;)&middot;B<sub>0,1</sub>
<br/>
c = &alpha;&middot;A<sub>0,2</sub> + (1-&alpha;)&middot;B<sub>0,2</sub>
<br/>
d = &alpha;&middot;A<sub>1,0</sub> + (1-&alpha;)&middot;B<sub>1,0</sub>
<br/>
e = &alpha;&middot;A<sub>1,1</sub> + (1-&alpha;)&middot;B<sub>1,1</sub>
<br/>
f = &alpha;&middot;A<sub>1,2</sub> + (1-&alpha;)&middot;B<sub>1,2</sub>
<br/>
g = &alpha;&middot;A<sub>2,0</sub> + (1-&alpha;)&middot;B<sub>2,0</sub>
<br/>
h = &alpha;&middot;A<sub>2,1</sub> + (1-&alpha;)&middot;B<sub>2,1</sub>
<br/>
i = &alpha;&middot;A<sub>2,2</sub> + (1-&alpha;)&middot;B<sub>2,2</sub>
<br/>
<br/>
(1) = (&alpha;&middot;A<sub>0,0</sub> + (1-&alpha;)&middot;B<sub>0,0</sub>) &middot; (&alpha;&middot;A<sub>1,1</sub> + (1-&alpha;)&middot;B<sub>1,1</sub>) &middot; (&alpha;&middot;A<sub>2,2</sub> + (1-&alpha;)&middot;B<sub>2,2</sub>)
<br/>
(2) = (&alpha;&middot;A<sub>0,0</sub> + (1-&alpha;)&middot;B<sub>0,0</sub>) &middot; (&alpha;&middot;A<sub>1,2</sub> + (1-&alpha;)&middot;B<sub>1,2</sub>) &middot; (&alpha;&middot;A<sub>2,1</sub> + (1-&alpha;)&middot;B<sub>2,1</sub>)
<br/>
(3) = (&alpha;&middot;A<sub>0,1</sub> + (1-&alpha;)&middot;B<sub>0,1</sub>) &middot; (&alpha;&middot;A<sub>1,2</sub> + (1-&alpha;)&middot;B<sub>1,2</sub>) &middot; (&alpha;&middot;A<sub>2,0</sub> + (1-&alpha;)&middot;B<sub>2,0</sub>)
<br/>
(4) = (&alpha;&middot;A<sub>0,1</sub> + (1-&alpha;)&middot;B<sub>0,1</sub>) &middot; (&alpha;&middot;A<sub>1,0</sub> + (1-&alpha;)&middot;B<sub>1,0</sub>) &middot; (&alpha;&middot;A<sub>2,2</sub> + (1-&alpha;)&middot;B<sub>2,2</sub>)
<br/>
(5) = (&alpha;&middot;A<sub>0,2</sub> + (1-&alpha;)&middot;B<sub>0,2</sub>) &middot; (&alpha;&middot;A<sub>1,0</sub> + (1-&alpha;)&middot;B<sub>1,0</sub>) &middot; (&alpha;&middot;A<sub>2,1</sub> + (1-&alpha;)&middot;B<sub>2,1</sub>)
<br/>
(6) = (&alpha;&middot;A<sub>0,2</sub> + (1-&alpha;)&middot;B<sub>0,2</sub>) &middot; (&alpha;&middot;A<sub>1,1</sub> + (1-&alpha;)&middot;B<sub>1,1</sub>) &middot; (&alpha;&middot;A<sub>2,0</sub> + (1-&alpha;)&middot;B<sub>2,0</sub>)
<br/>
<br/>
(1) = (&alpha;&middot;A<sub>0,0</sub>&middot;&alpha;&middot;A<sub>1,1</sub> + &alpha;&middot;A<sub>0,0</sub>&middot;(1-&alpha;)&middot;B<sub>1,1</sub> + (1-&alpha;)&middot;B<sub>0,0</sub>&middot;&alpha;&middot;A<sub>1,1</sub> + (1-&alpha;)&middot;B<sub>0,0</sub>&middot;(1-&alpha;)&middot;B<sub>1,1</sub>) ) &middot; (&alpha;&middot;A<sub>2,2</sub> + (1-&alpha;)&middot;B<sub>2,2</sub>)
<br/>
<br/>
&alpha;&middot;A<sub>0,0</sub>&middot;&alpha;&middot;A<sub>1,1</sub>&middot;&alpha;&middot;A<sub>2,2</sub>
+
&alpha;&middot;A<sub>0,0</sub>&middot;&alpha;&middot;A<sub>1,1</sub>&middot;(1-&alpha;)&middot;B<sub>2,2</sub>

&alpha;&middot;A<sub>0,0</sub>&middot;(1-&alpha;)&middot;B<sub>1,1</sub>&middot;&alpha;&middot;A<sub>2,2</sub>
+
&alpha;&middot;A<sub>0,0</sub>&middot;(1-&alpha;)&middot;B<sub>1,1</sub>&middot;(1-&alpha;)&middot;B<sub>2,2</sub>

(1-&alpha;)&middot;B<sub>0,0</sub>&middot;&alpha;&middot;A<sub>1,1</sub>&middot;&alpha;&middot;A<sub>2,2</sub>
+
(1-&alpha;)&middot;B<sub>0,0</sub>&middot;&alpha;&middot;A<sub>1,1</sub>&middot;(1-&alpha;)&middot;B<sub>2,2</sub>

(1-&alpha;)&middot;B<sub>0,0</sub>&middot;(1-&alpha;)&middot;B<sub>1,1</sub>&middot;&alpha;&middot;A<sub>2,2</sub>
+
(1-&alpha;)&middot;B<sub>0,0</sub>&middot;(1-&alpha;)&middot;B<sub>1,1</sub>&middot;(1-&alpha;)&middot;B<sub>2,2</sub>

<br/>
<br/>

&alpha;<sup>3</sup>&middot;A<sub>0,0</sub>&middot;A<sub>1,1</sub>&middot;A<sub>2,2</sub>
<br/>
+
<br/>
&alpha;<sup>2</sup>&middot;(1-&alpha;)&middot;A<sub>0,0</sub>&middot;A<sub>1,1</sub>&middot;B<sub>2,2</sub>
<br/>
<br/>

&alpha;<sup>2</sup>&middot;(1-&alpha;)&middot;A<sub>0,0</sub>&middot;B<sub>1,1</sub>&middot;A<sub>2,2</sub>
<br/>
+
<br/>
&alpha;&middot;(1-&alpha;)<sup>2</sup>&middot;A<sub>0,0</sub>&middot;B<sub>1,1</sub>&middot;B<sub>2,2</sub>
<br/>
<br/>


&alpha;<sup>2</sup>&middot;(1-&alpha;)&middot;B<sub>0,0</sub>&middot;A<sub>1,1</sub>&middot;A<sub>2,2</sub>
<br/>
+
<br/>
&alpha;&middot;(1-&alpha;)<sup>2</sup>&middot;B<sub>0,0</sub>&middot;&alpha;&middot;A<sub>1,1</sub>&middot;B<sub>2,2</sub>
<br/>
<br/>

&alpha;&middot;(1-&alpha;)<sup>2</sup>&middot;B<sub>0,0</sub>&middot;B<sub>1,1</sub>&middot;A<sub>2,2</sub>
<br/>
+
<br/>
(1-&alpha;)<sup>3</sup>&middot;B<sub>0,0</sub>&middot;B<sub>1,1</sub>&middot;B<sub>2,2</sub>
<br/>
<br/>

<br/>


...

&alpha;<sup>3</sup>&middot;A<sub>0,0</sub>&middot;A<sub>1,1</sub>&middot;A<sub>2,2</sub>
<br/>
+
<br/>
(&alpha;<sup>2</sup>-&alpha;<sup>3</sup>)&middot;A<sub>0,0</sub>&middot;A<sub>1,1</sub>&middot;B<sub>2,2</sub>
<br/>
+
<br/>
(&alpha;<sup>2</sup>-&alpha;<sup>3</sup>)&middot;A<sub>0,0</sub>&middot;B<sub>1,1</sub>&middot;A<sub>2,2</sub>
<br/>
+
<br/>
(&alpha;-2&middot;&alpha;<sup>2</sup>+&alpha;<sup>3</sup>)&middot;A<sub>0,0</sub>&middot;B<sub>1,1</sub>&middot;B<sub>2,2</sub>
<br/>
+
<br/>
(&alpha;<sup>2</sup>-&alpha;<sup>3</sup>)&middot;B<sub>0,0</sub>&middot;A<sub>1,1</sub>&middot;A<sub>2,2</sub>
<br/>
+
<br/>
(&alpha;-2&middot;&alpha;<sup>2</sup>+&alpha;<sup>3</sup>)&middot;B<sub>0,0</sub>&middot;&alpha;&middot;A<sub>1,1</sub>&middot;B<sub>2,2</sub>
<br/>
+
<br/>
(&alpha;-2&middot;&alpha;<sup>2</sup>+&alpha;<sup>3</sup>)&middot;B<sub>0,0</sub>&middot;B<sub>1,1</sub>&middot;A<sub>2,2</sub>
<br/>
+
<br/>
(1-3&middot;&alpha;+3&middot;&alpha;<sup>2</sup>-&alpha;<sup>3</sup>)&middot;B<sub>0,0</sub>&middot;B<sub>1,1</sub>&middot;B<sub>2,2</sub>
<br/>
<br/>




&alpha;&middot;(1-&alpha;)<sup>2</sup>
= 
&alpha;&middot;(1-&alpha;)&middot;(1-&alpha;)
= 
(&alpha;-&alpha;<sup>2</sup>)&middot;(1-&alpha;)
= 
&alpha; - &alpha;<sup>2</sup> - &alpha;<sup>2</sup> + &alpha;<sup>3</sup>
=
&alpha; - 2&middot;&alpha;<sup>2</sup> + &alpha;<sup>3</sup>
=


<br/>
<br/>


(1-&alpha;)<sup>3</sup>
= 
(1-&alpha;)&middot;(1-&alpha;)&middot;(1-&alpha;)
= 
(1 - 2&middot;&alpha; + &alpha;<sup>2</sup>)&middot;(1-&alpha;)
= 
(1 - 2&middot;&alpha; + &alpha;<sup>2</sup> - &alpha; + 2&middot;&alpha;<sup>2</sup> - &alpha;<sup>3</sup>)
= 
(1 - 3&middot;&alpha; + 3&middot;&alpha;<sup>2</sup> - &alpha;<sup>3</sup>)
=










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


























**Trifocal Tensor, T:** 3 cameras relate a line L, projected onto 3 images
<br/>
lines in images: l &hArr; l' &hArr; l''
<br/>
points (matching) in images: x &hArr; x' &hArr; x''
<br/>
camera centers: C, C', C''
<br/>
a<sub>4</sub> = e' = P'&middot;C
<br/>
b<sub>4</sub> = e'' = P''&middot;C
<br/>
P = [I|0] | P' = [A|a<sub>4</sub>] | P = [B|b<sub>4</sub>]
<br/>
&pi; = P<sup>T</sup>&middot;l = [1,1,1,0]<sup>T</sup>
<br/>
&pi;' = P'<sup>T</sup>&middot;l' = [(A<sup>T</sup>&middot;l')<sup>T</sup>, a<sub>4</sub>&middot;l']<sup>T</sup>
<br/>
&pi;'' = P''<sup>T</sup>&middot;l'' = [(B<sup>T</sup>&middot;l'')<sup>T</sup>, b<sub>4</sub>&middot;l'']<sup>T</sup>
<br/>
M = [&pi;,&pi;',&pi;''] = [m<sub>1</sub>,m<sub>2</sub>,m<sub>3</sub>], m<sub>1</sub> = &alpha;&middot;m<sub>2</sub> + &beta;&middot;m<sub>3</sub>
<br/>
3 planes meet at line: det(M) = 0
<br/>
<br/>
l<sub>i</sub> = l''<sup>T</sup>&middot;(b<sub>4</sub>&middot;a<sub>i</sub><sup>T</sup>)&middot;l' - l'<sup>T</sup>&middot;(a<sub>4</sub>&middot;b<sub>i</sub><sup>T</sup>)&middot;l''
<br/>
T<sub>i</sub> = a<sub>i</sub>&middot;b<sub>4</sub><sup>T</sup> - a<sub>4</sub>&middot;b<sub>i</sub><sup>T</sup>
<br/>
l<sub>i</sub> = l'<sup>T</sup>&middot;T<sub>i</sub>&middot;l''
<br/>
T = [T<sub>1</sub> T<sub>2</sub> T<sub>3</sub>]
<br/>
l<sup>T</sup> = l'<sup>T</sup>&middot;T&middot;l''
<br/>
<br/>
**3D Point P on 3D Line L**:
<br/>
l'<sup>T</sup>&middot;(&Sigma;<sub>i</sub> x<sup>i</sup>&middot;T<sub>i</sub>)&middot;l'' = 0
<br/>
[x']<sub>&times;</sub>&middot;(&Sigma;<sub>i</sub> x<sup>i</sup>&middot;T<sub>i</sub>)&middot;[x'']<sub>&times;</sub> = 0<sub>3&times;3</sub>
<br/>
<br/>
F<sub>2,1</sub> = [e']<sub>&times;</sub>&middot;T&middot;e''
<br/>
P' = [T&middot;e'' | e']
<br/>
<br/>
<br/>
<br/>





#### Modulus Contstraint
**Determine Plane at Infinity, H<sub>&infin;</sub>**
<br/>
H<sub>&infin;:i,j</sub> ~ H<sub>&infin;:1,j</sub>&middot;H<sub>&infin;:1,i</sub> ~ K&middot;R<sub>j</sub><sup>T</sup>&middot;R<sub>j</sub><sup>-T</sup>&middot;K<sup>-1</sup> ~ (H<sub>&infin;:1,j</sub> - e<sub>1,j</sub>&middot;&pi;<sub>&infin;</sub><sup>T</sup>)&middot;(H<sub>&infin;:1,i</sub> - e<sub>1,i</sub>&middot;&pi;<sub>&infin;</sub><sup>T</sup>)
<br/>
<br/>
H<sub>&infin;:i,j</sub> : conjugated with rotation matrix
<br/>
<br/>
&rArr; det(H<sub>&infin;:i,j</sub> - &Lambda;) = l<sub>3</sub>&middot;&lambda;<sup>3</sup> + l<sub>2</sub>&middot;&lambda;<sup>2</sup> + l<sub>1</sub>&middot;&lambda; + l<sub>0</sub> = 0
<br/>
&rarr;
<br/>
l<sub>3</sub>&middot;l<sub>1</sub><sup>3</sup> = l<sub>2</sub><sup>3</sup>&middot;l<sub>0</sub>
<br/>
M<sub>i,j</sub> : l<sub>3:i,j</sub>&middot;l<sub>1:i,j</sub><sup>3</sup> - l<sub>2:i,j</sub><sup>3</sup>&middot;l<sub>0:i,j</sub> = 0
<br/>
(64- possible solutions, only care about non-complex solutions)
<br/>
<br/>
Over 3+ Images. minimize cost:
<br/>
C<sub>MC<sub>: &Sigma;<sub>i</sub>&Sigma;<sub>j</sub> M<sub>i,j</sub><sup>2</sup>
<br/>








<br/>
<br/>
<br/>

<a name="ITERATION"></a>
## some iteration methods ...

<br/>
<br/>
<br/>

**LaGrange Multipliers:**
<br/>
Find max/min of f(x), subject to g(x) = c &rArr; F(x,&lambda;) = f(x) - &lambda;[g(x)-k] 
<br/>
Solve F<sub>x</sub> = 0 , F<sub>&lambda;</sub> = 0
<br/>
<br/>


**Gradient Descent**:
<br/>
<br/>

**Newton Method**:
<br/>
<br/>

**Levenberg-Marquart**:
<br/>
<br/>
<br/>
& Sparse Specific
<br/>

**Simplex**:
<br/>
<br/>

**Powell**:
<br/>
http://mathfaculty.fullerton.edu/mathews/n2003/PowellMethodMod.html
<br/>


## Some Linear Algebra Concepts

**Cholesky Decomposition**:
<br/>
Find A from some matrix M = A&middot;A<sup>T</sup> (square root of positive definite matrix)
<br/>
result is a lower trianglular (L) or upper triangular (U) matrix: L = U<sup>T</sup>
<br/>

**QR Decomposition**:
<br/>
<br/>


**Rodriguez's Formula**: Compute Rotation Vector or Matrix from 3 basis vectors - identifying parallel and perpendicular components:
<br/>
**R = &lt;R<sub>x</sub>,R<sub>y</sub>,R<sub>z</sub>&gt;**: unit rotation vector
<br/>
**v = &lt;v<sub>x</sub>,v<sub>y</sub>,v<sub>z</sub>&gt;**: vector to rotate
<br/>
**u = &lt;u<sub>x</sub>,u<sub>y</sub>,u<sub>z</sub>&gt;**: vector result by rotating v about R
<br/>
**&theta**: rotation angle
<br/>
v<sub>&parallel;</sub> = R(R&middot;v)
<br/>
v<sub>&perp;</sub> = v - v<sub>&parallel;</sub> = v - R(R&middot;v)
<br/>
&rarr;
<br/>
u = v&middot;cos&theta; + (R&times;u)sin&theta; + R(R&middot;v)(1-cos&theta;)
<br/>
<br/>



<br/>
**"Aperature Problem"**: Looking at only a small portion of a larger object, the perceived motion could be off by ~90 degrees, or motion may not be perceived at all. EG: looking only at an edge of a rectangle moving in a corner direction may appear to be moving only perpendicular to the edge
<br/>
<br/>

<br/>
**Image Flow / Flow Field**: Apparent movement of objects in a scene/image (feature location change)/gradient
<br/>
<br/>


<br/>
**Parametric Deformation (Camera) Model**: x,y  f&rarr; u,v ; u = a<sub>0</sub> + a<sub>1</sub>x + a<sub>2</sub>y + ... ; v = b<sub>0</sub> + b<sub>1</sub>x + b<sub>2</sub>y + ... 
<br/>
*typically radial basis polynomial*: &rho; = c<sub>0</sub> + c<sub>1</sub>((x-c<sub>x</sub>)<sup>2</sup>+(y-c<sub>y</sub>)<sup>2</sup>)<sup>1/2</sup> + c<sub>2</sub>((x-c<sub>x</sub>)<sup>2</sup>+(y-c<sub>y</sub>)<sup>2</sup>) + ... 
<br/>
<br/>


<br/>
<br/>
foreshortening
<br/>
<br/>




### ?
![?](./images/?.png "?")
<br/>





<a name="SURFACE"></a>
## Surface Reconstruction
*(Triangulating Point Set Surfaces with Bounded Error)*
<br/>
**Input:** Point Cloud (list of 3D points), &rho; (curvature coverage &prop; 1/error), &tau; (smoothing factor)
<br/>
**Output:** Triangle Soup
<br/>

### Definitions:
<br/>
**Osculating Sphere**: A point in a plane (P) and a normal to that plane (N) has a curvature that can be approximated at the single point (P) by a sphere with radius (R) exactly tangent to the plane (N+P). A larger sphere translates to less curvature *[lim<sub>R&rarr;&infin;</sub> = a plane]*.
<br/>
center of ^^^ sphere = a = x + &rho;N + (&rho;'/&tau;)B
a = center of sphere
x = ?
&rho; = radius of curvature;
&tau; = torsion
N = unit normal vector
B = unit binormal vector
<br/>
radius of ^^^ sphere R = sqrt(&rho;<sup>2</sup> + (&rho;'/&tau;)<sup>2</sup>)
R &equiv; 1/&kappa;
<br/>
T = unit tangent vector = r'/|r|
N = (1/&kappa;)&dot;T'
&tau = -N&dot;B'
<br/>
<br/>
**Radial Basis Function (RBF)**: some function that only depends on distance from some center point: &Phi;(x,c) = &Phi;(||x-c||)
<br/>
solid angle = "3D" angle - a cone (measured in steradians)
<br/>
<br/>
Lipshitz Continuity is a condition on the maximum rate of change of smoothness
modulus of uniform continuity
<br/>
Lipshitz Condition = ?
<br/>
Lipshitz Number = ?
<br/>
<br/>
Hausdorf Distance = measures how far two sets *of metric space* are from eachother: h(A,B) = MAX<sub>a&in;A</sub>[ MIN<sub>b&in;B</sub> d(a-b) ]
- *d() is some distance measure, for simple points d can be ||a-b||*
```
for each a &in; A
    for each b &in; B 
        d = min(||a-b||, d)
    D = max(d,D)
```
*d() = distance, a = point, b = point*
<br/>
Hausdorf Error = distance between the triangle and subtended osculating sphere
<br/>


<br/>
<br/>
sin(2&beta;)/b = sin(&gamma;)/c = sin(3&beta;)/c
<br/>
The upper bound on gamma is 3&beta; &rarr; when isosceles: 3&beta; = &pi; ?

&beta; + &beta; + 3&beta; =  &pi;
5&beta; = pi?

&gamma; =?= 3&beta;
<br/>
b = c&dot;sin(2&beta;)/sin(3&beta;) = &eta;c


<br/>
ideal triangle = subtends a constant solid angle
<br/>
&rho; = angle of osculating circle = inverse of absolute curvatrure &kappa;
<br/>
c = 
<br/>
b = maximum querying radius (of guidance field) => result of maximum possible curvature
<br/>
&beta; = isosceles base angle (only free param of new triangle)
<br/>
&gamma; = ?
<br/>
&kappa;<sub>1</sub> = maximum curvature (in local area?)
<br/>
&kappa;<sub>2</sub> = minimum curvature (in local area?)
<br/>
&kappa; = max(|&kappa;<sub>1</sub>|,|&kappa;<sub>2</sub>|) = minimum of absolute curvature
<br/>
L = &rho;/&kappa; = ideal edge length
<br/>
? = approximation error - directly defined by &rho; subtending certain arc-length
<br/>
&tau; = smoothing factor, relates MLS h value to neighborhood radius
<br/>
&epsilon; = Hausdorf distance between triangle mesh and surface patch under it is AT MOST: r(1 - sqrt(1+8cos(&rho;))/3) *(r is curvature radius)* => upperbound on the Hausdorf Error
- **ALTERNATIVE INPUT**: could be &epislon;, then having &rho; vary with &epsilon; and r:
    - &rho; = acos(9/[8(1 - &epsilon;/r)<sup></sup>] - 1)
<br/>
normal = integral of curvature 
<br/>
**L(x,y,z)** = guidance field (global information) is ideal edge size for a triangle at each point in space (scalar) ; ideal edge length at any point in &reals;<sup>3</sup> is ideal edge length at closest point (which is in turn projected onto MLS surface)
<br/>
local bivariate polynomials = ? ?x*y?
<br/>
<br/>
<br/>
seed triangle: first triangle, generated at random location on surface
<br/>
always grow with isosceles triangles
<br/>
**Edge-Front**: List of edges representing the border of the current triangulated surface
<br/>
**Triangle-Grow**: create triangle from from front edge and new vertex
<br/>
**Ear-Cut**: create triangle from 3 vertices on front (can cause merge/split event)
<br/>
**Merge-Event**: ? uses existing front vertex
<br/>
**Split-Event**: ? uses existing front vertex 
<br/>
<br/>
<br/>
**MLS (Moving Least Squares**: specifies the underlying surface ? 
<br/>
<br/>
**MLS Projection**:  projects point r in &reals;<sup>3</sup> to surface: r' = P(r)
- surface = set of points that project to themselves
- 1:
    - fit a reference plane H = (q,n) to neighborhood of r (q is point on plane, n is unit normal vector)
    - H is selected to minimize the energy function: min<sub>q</sub> &sum;<sub>i</sub>&lt;n,p<sub>i</sub>-q&gt;<sup>2</sup> &dot; &Theta;(||p<sub>i</sub>-q||)
    - p<sub>i</sub> = i<sup>th</sup> neighbor of r
    - n = (r-q)/||r-q||
    - &Theta(&dot;) = smooth, monotonically decreasing function
    - minimum is found via gradient descent
- 2:
    - locally fit bivariate polynomial of low degree g over H
    - p<sub>i</sub> = (u<sub>i</sub>,v<sub>i</sub>,w<sub>i</sub>) = coordinates defined by H
    - g = polynomial that minimizes weighted least squares error: &Sigma;<sub>i</sub> (g(u<sub>i</sub>,v<sub>i</sub>) - w<sub>i</sub>)<sup>2</sup> &dot; &Theta;(||p<sub>i</sub>-q||)
    - projection r' = P(r) = q + g(0,0)&dot;n
    - weight function has scalar parameter h = determines amount of smoothing applied to the data = function lof local feature size
    - L(x) = local feature size of point x = radius of the k nearest neighbors of x
    - h(x) = scale = &tau;&dot;weighted_average(L(Nbhd(x)))
    - &tau; = amount of smoothing/denoising to apply (user input)
    - q<sub>0</sub> = initial guess for minimum point for minimizing process of q
        - heuristic: q<sub>near</sub>, q<sub>far</sub>
        - c<sub>0</sub> = centroid of neighborhood of r
        - n<sub>0</sub> = normalized eigenvector of covariant matrix of neighborhood of r
        - q<sub>near</sub> = projection of r onto plane defined by c<sub>0</sub> and n<sub>0</sub>
            - q<sub>near</sub> = r - &lt;nq<sub>near</sub>,r-cq<sub>near</sub>&gt;nq<sub>near</sub>
        - q<sub>far</sub> = c<sub>0</sub>
    - q<sub>0</sub> = &alpha;&dot;q<sub>near</sub> + (1-&alpha;)q<sub>far</sub>
        - &alpha; = 1 for r = c<sub>0</sub>  and  &alpha; = 0 for ||r-c<sub>0</sub>|| = Lc<sub>0</sub>
<br/>
<br/>
? = surface = implicit surface (zero-set)
surface is defined by a single real number, the radius of curvature
<br/>
<br/>
**Bounded Hausdorff Distance:** Hausdorff distance between two surfaces A and B in &reals;<sup>3</sup> = &epsilon;(A,B) = max<sub>a&isin;A</sub>(min<sub>b&isin;B</sub>||a-b||)
<br/>
<br/>
barycenter of triangle &equiv; CoM = centroid of triangle (lines from center of edge to opposite vertex all meet at point)
<br/>
incenter of triangle = lines from vertex at half-angle direction meet at point
<br/>
circumcenter of triangle = perpendicular lines from midpoint of each edge meet at point (could be outside)
<br/>
orthocenter of triangle = perpendicular lines from each edge that pass through opposite vertex meet at point (could be outside)
<br/>
<br/>
grand (great) circle of a sphere: largest circle that intersects a sphere (have same diameter) (infinite number)
<br/>
<br/>
```
# demonstration of instantanious surface curvature at point
theta = pi/2;
dTheta = 0.00001;
R = 4.0;

r1 = [R*cos(theta-dTheta) R*sin(theta-dTheta)]
r2 = [R*cos(theta) R*sin(theta)]
r3 = [R*cos(theta+dTheta) R*sin(theta+dTheta)]
dr1 = (r2-r1)
dr2 = (r3-r2)
dr = ( sqrt(dot(dr1,dr1)) + sqrt(dot(dr2,dr2)))/2
T1 = dr1./sqrt(dot(dr1,dr1))
T2 = dr2./sqrt(dot(dr2,dr2))

K = (T2-T1)/(dr)
k = sqrt(dot(K,K))
r = 1/k
```
<br/>

### Algorithm
- input
    - &rho;: solid angle (eg: &pi;/4)
    - &tau;: some additional smoothing constant (eg: ?)
- initial seed triangle:
    - random point of cloud
    - projected point to MLS surface
    - find edge size appropriate for region (lookup L(x,y,z)?)
    - decide triangle edge length: force equalateral
    - inductively find best initial size:
        - query curvature and bracket and interval bisection to find best initial size
        - best triangle is one where query length = length (fixed point of f)

midpoint = randomPointInCloud()
midpoint = project(midpoint)
curvature = curvatureAtProjectedPoint(midpoint)
edgeLengthA = &rho/curvature

searchLength = ?

edgeLengthB = fieldMin(searchLength)
lenMin = min(edgeLengthA,edgeLengthB)
lenMax = max(edgeLengthA,edgeLengthB)
BISECTION:
  lenMid = (lenMin+lenMax)/2
  len = fieldMin(lenMid)
  if len ~= lenMid
    done
  else if len < lenMid
    lenMax = len
  else if len > lenMid
    lenMin = len
  ...

- add new vertex
    - Vertex-Prediction: vertex position is first estimated via prediction operator... ?
        - consider current edge length
            - ?
                - &beta; = current? isosceles base angle 
                - c = ?front edge length
                - querying radius b = (sin2&beta;/sin3&beta;)c
                
            - L &le; &rho;/&kappa; = &rho;&middot;r 
        - consider maximum curvature in triangle neighborhood
            - sample bivariate surface at CLOSEST POINTS IN SET
            - &kappa; = max(&kappa;<sub>min</sub>,&kappa;<sub>max</sub>)
    - vertex projected to MLS surface
        - locally approximate surface as plane containing #? points
            - weighted least squares
        - locally approximate surface as bivariate polynomial (3rd/4th degree) in plane coord system
            - weighted least squares, h varies locally 
        - projected point = bivarate surface at f(x=0,y=0)
- neighborhood = ? k nearest neighbors? = ?
- ?

- primary loop:
    - frontsList = firstFront()
        - ?edges of first primary triangle?
    - while: there are fronts in the frontsList
        - currentFront = frontsList.first()
            - if: there are only 3 edges in currentFront
                - this should probly only be allowed:
                    - A: edges are not all part of same triangle (inward joining)
                    - B: edge length at center is larger than each of the 3 edges (is this ever not the case?)
                - currentFront.close()
                - frontsList.remove(currentFront)
                - CONTINUE LOOP
            - edge = currentFront.bestEdge()
            - if: .CanCutEar(edge) # can join edge to front
                - .CutEar(edge)
                - CONTINUE LOOP
            - vertex = .VertexPredict(edge,) # have to add a new vertex to front
            - if: .TriangleTooClose(edge,vertex)
                - front = .ClosestFront(edge,vertex)
                - if: front==currentFront # added vertex cuts the front into separate objects (connected at point?)
                    - frontsList.add( currentFront.split(?vertex?/?edge?)  )
                - else: # added vertex causes seperate fronts to unify
                    - currentFront.mergeIn(front)
                    - frontsList.remove(front)
            - else:
                - .GrowTriangle(edge)

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


**Front**: doubly linked list (traversal) plus priority queue (best edge [(ideal length)/(actual length) closest to 1])

deferred edge: second priority - because edge will introduce a bad triangle

boundary: anisotropy (using best fit local plane) maximum angle between local points and reference point if above a threshold (150&deg;)

**firstFront()**
- ? is this the first triangle edges? - what stops a 3-edge front from eating itself?

**vertexPredict(edge, field)**
- need to know absolute curvature &kappa; (from &kappa;<sub>1</sub> and &kappa;<sub>2</sub>). L = &rho;/&kappa;

&eta; = ?
c = edge.length();
b =  c * &eta;
midpoint = e.midpoint()
i = fieldMinInSphere(field, midpoint,b)
&beta; = ?
baseAngle = min(max(t,60-&beta;),60+&beta;) // clamp base angle of triangle &isin; [60-&beta;,60+&beta;]
p = Point() // forms angle 180-2*baseAngle with edge
return MLSProject(p)

**fieldMinInSphere(field, center,radius)**
-smallest edge length within given sphere
    - query each point in cloud and find max curvature = min r &rarr; L = &rho;&middot;r

**MLSProject(point)**
-project ANY POINT IN R3 onto MLS Surface?

**Triangulate(field)**
- main loop iterating over fronts dealing with point addition, edge addition, merge, splits

**triangleTooClose()**
- whether added point is closer than allowed to to existing triangulation (half ideal edge length at point p), if yes, topological even occurs

x growTriangle()

closestFront()

**canCutEar()**
- returns true if possible to form 'good' triangle (all resulting angles &lt; 70&deg;) by connecting edge e to any adjacent edges

x cutEar()

bestEdge()

split()

merge()

closeFront()



How do you choose the next point/location to add as a vertex (predict)?




<br/>
**Determining maximum search radius**:
<br/>
![Unbounded Curvature](./images/triangle_unbounded.png "Unbounded Curvature Searching")
<br/>
**Added Triangles are always isosceles**: To account for infinite curvature, the search radius max only need be **b**
<br/>
**Triangle angles sum to &pi;**: &gamma; + 3&beta; = &pi; &rarr; &gamma; = &pi; - 3&beta;
<br/>
**sin(&theta;) = sin(&pi; - &theta;)**: sin(&gamma;) = sin(3&beta;)
<br/>
**Law of Sines**: sin(&gamma;)/c = sin(2&beta;)/b
<br/>
&rarr; sin(3&beta;)/c = sin(2&beta;)/b
<br/>
&rarr; b = c&middot;sin(2&beta;)/sin(3&beta;) = &eta;c
<br/>
**&beta;=60&deg;**&rarr;*&eta;=&infin;* | **&beta;=59&deg;**&rarr;*&eta;=17* | **&beta;=55&deg;**&rarr;*&eta;=3.7* | **&beta;=50&deg;**&rarr;*&eta;=2*
<br/>
<br/>










PointCloud
    - organize()

Front:
    - edges[] (doubly-linked list & priority queue)
    - TriangleGrow(vertex,edge)
        - create new triangle with vertex and internal edge - remove old edge from front, add 2 new edges
        - if vertex is too close, merge with existing - causes topoligical event:
            - split
            - merge
    - EarCut(edgeA,edgeB)
        - create new triangle with 3 vertices on front - remove 2 old edges, add 1 new edge
Full-Front:
    - fronts[]
    





initial vertex should be oriented such that the surface points in the correct direction (for culling)
triangles may need to, be checked for orientation after algorithm completes by checking with *outside* points or some idea of surface normals

what about 'disconnected' surfaces? specify some border (convex hull)?

### Curvature
**measurement of how quickly a curve/surface changes direction - sharpness - deviation from straight line**
#### 2D (Curve) Observances:
![2D Curvature](./images/curve_2D_legend.png "2D Curvature")



theta = pi/2;
dTheta = 0.00001;
R = 4.0;

r1 = [R*cos(theta-dTheta) R*sin(theta-dTheta)]
r2 = [R*cos(theta) R*sin(theta)]
r3 = [R*cos(theta+dTheta) R*sin(theta+dTheta)]
dr1 = (r2-r1)
dr2 = (r3-r2)
dr = ( sqrt(dot(dr1,dr1)) + sqrt(dot(dr2,dr2)))/2
T1 = dr1./sqrt(dot(dr1,dr1))
T2 = dr2./sqrt(dot(dr2,dr2))

K = (T2-T1)/(dr)
k = sqrt(dot(K,K))
r = 1/k


<br />
**Change in Position Vector dR**: (infitesimal arc) &approx; [r(x+&Delta;x,f(x+&Delta;x)) - r(x-&Delta;x,f(x-&Delta;x))]/[2&Delta;x]
<br/>
**Unit Tangent Vector T**: dR/||dR||  (unit version of dR)
<br/>
**Curvature-Normal Vector &Kappa;** = ||dT/ds|| = ||T'(s)|| &approx; [T(x+&Delta;x) - T(x-&Delta;x)]/[2&Delta;x] (~length of second vector derivative)
<br/>
**Unit Normal VectorN**: &Kappa;/||&Kappa;|| (always on side of osculating circle), *similar* Normal vector can be chosen using dR to be orthogonal to T - consistent 'side' of curve/path
<br/>
**Unit Binormal Vector B**: T &times; N ,change of B shows how curve twists out of osculating plane
<br/>
**Curvature &kappa;**: = ||&Kappa;||
<br/>
**Radius of Curvature r**: 1/&kappa; (radius of osculating sphere)
<br/>
**Torsion &tau;**: dB = &tau;N , dN = -(&tau;B + &kappa;T)
<br/>
**Osculating Plane**: Defined at each point as containing *both* T and N (perpendicular to B)
<br/>
**Frenet Frame**: T,N,B,&tau;,&kappa; define curve local behavior completely
<br/>
**Other Notes**: need to double-check...
- arc length s = &int; ||dR|| dt
- curvature of line = 0; curvature of circle = 1/R
- Change in normal along a CURVE: dN = -&kappa;T + &tau;B
- &kappa;<sub>n</sub>(X) = dot( -df(X), dN(X) ) / |df(x)|<sup>2</sup>
- B = T &cross; N
- dT = &kappa;N
- dN = -&kappa;T + &tau;B
- dB = -&tau;B
    - (tangent-, principal normal-, binormal)-indicatrix
- As the three points that define any circle on a curve get closer to eachother (on the curve [arc length]) the circle approaches the oscilating circle 


searching for a 2D closed form ...
- WRONG: I have never found this to be correct: (1+f'^2)^3/2 / f''
- CORRECT: this gives &asymp; same result as numerical approximation: ( x'&middot;x' + y'&middot;y' )^(3/2) / abs(x''&middot;y' - y''&middot;x')

#### 3D Surface Observances:
![3D Surface Curvature](./images/curve_3D_legend.png "3D Surface Curvature")
<br/>
**Surface S = S(x,y,z=f(x,y))**: topologially equivalent to a plane (explicitly defined), locus of curves
<br/>
**Point P = (P<sub>x</sub>,P<sub>y</sub>,P<sub>y</sub>)**: Point on the surface in 3D Space
<br/>
**Position Vector r = r(r<sub>x</sub>,r<sub>y</sub>,r<sub>z</sub>)**: Parametric Surface defining S in terms of u and v, r(u,v)
<br/>
**Tangent Vector dr = (dr<sub>x</sub>,dr<sub>y</sub>,dr<sub>z</sub>) = r<sub>u</sub> + r<sub>v</sub> **: Orthogonal surface tangent vectors with magnitudes equal to the derivative of arc length in respective direction (simply: dv + du)
<br/>
**r<sub>u</sub> = r<sub>u</sub>(r<sub>u1</sub>,r<sub>u2</sub>,r<sub>u3</sub>)**: Surface unit tangent vector in direction of derivative wrt u
<br/>
**r<sub>v</sub> = r<sub>v</sub>(r<sub>v1</sub>,r<sub>v2</sub>,r<sub>v3</sub>)**: Surface unit tangent vector in direction of derivative wrt v
<br/>
**r<sub>uu</sub> = r<sub>uu</sub>(r<sub>uu1</sub>,r<sub>uu2</sub>,r<sub>uu3</sub>)**: Second derivative in respective direction
<br/>
**r<sub>uv</sub> = r<sub>uv</sub>(r<sub>uv1</sub>,r<sub>uv2</sub>,r<sub>uv3</sub>)**: Second derivative in respective direction
<br/>
**r<sub>vv</sub> = r<sub>vv</sub>(r<sub>vv1</sub>,r<sub>vv2</sub>,r<sub>vv3</sub>)**: Second derivative in respective direction
<br/>
**Unit Surface Normal Vector n = (n<sub>x</sub>,n<sub>y</sub>n<sub>z</sub>)**: r<sub>u</sub>&times;r<sub>v</sub>/||r<sub>u</sub>&times;r<sub>v</sub>||
<br/>
**Differential Area dA**: ||r<sub>u</sub>&times;r<sub>v</sub>||*du*dv ; ||r<sub>u</sub>&times;r<sub>v</sub>|| = (EG - F<sup>2</sup>)<sup>1/2</sup>
<br/>
<br/>
**First Fundamental Form (I)**: Encodes: distance, area, angle; Magnitude of a given curve's arc-length at a point on the surface, *metric property of surface*: ds<sup>2</sup> = E*du*<sup>2</sup> + 2F*du*<sup>2</sup>*dv*<sup>2</sup> + G*dv*<sup>2</sup>
<br/>
**Second Fundamental Form (II)**: Change in the normal direction (second derivative) in direction of a given curve, *extrinsic property of surface / shape operator* : L*du*<sup>2</sup> + 2M*du*<sup>2</sup>*dv*<sup>2</sup> + dn*dv*<sup>2</sup> = &kappa;<sub>n</sub>
<br/>
**Shape Operator / Weingarten Map:** The negative derivative of the unit normal surface vector (n)
<br/>
<br/>
*First Fundamental Form (FFF) coefficients (I)* I = dr &middot; dr = E*du*<sup>2</sup> + 2F*du*dv + G*dv*<sup>2</sup> (arc length of a curve on the surface)
<br/>
**E**: r<sub>u</sub> &middot; r<sub>u</sub>
<br/>
**F**: r<sub>u</sub> &middot; r<sub>v</sub>
<br/>
**G**: r<sub>v</sub> &middot; r<sub>v</sub>
<br/>

*Second Fundamental Form (SFF) coefficients (II)* II = -(dr &middot; n) = L*du*<sup>2</sup> + 2M*du*dv + N*dv*<sup>2</sup> (arc length change in direction of normal)
<br/>
**L**: r<sub>uu</sub> &middot; n
<br/>
**M**: r<sub>uv</sub> &middot; n
<br/>
**N**: r<sub>vv</sub> &middot; n
<br/>
<br/>
**Solving (II) = 0**: du = dv&middot;(-M&plusmn;sqrt(M<sup>2</sup>-LN))/L
<br/>
**&lambda; = dv/du = direction of normal curve**: Extrema @ d&kappa;<sub>i</sub>/d&lambda; = 0 = (E+2F&lambda;+G&lambda;)(N&lambda;+M) - (L+2M&lambda;+N&lambda;<sup>2</sup>)(G&lambda;+F) = 0
<br/>
&rarr; (EG-F<sup>2</sup>)&kappa;<sub>i</sub><sup>2</sup> - (EN+GL-2FM)&kappa;<sub>i</sub> + (LN-M<sup>2</sup>) = 0
<br/>
<br/>
**Principal Curvatures &kappa;<sub>max</sub> and &kappa;<sub>min</sub>**: Each direction on a surface has a curvature, but a single maximum and minimum curvature exist - the direction of each is called the *principal tangent direction* (or the curvatures are equal in all directions if &kappa;<sub>max</sub>=&kappa;<sub>min</sub>). A negative curvature means the osculating sphere for that direction is opposite of the defined normal direction.
<br/>
**Gaussian Curvature K**: &kappa;<sub>min</sub>&kappa;<sub>max</sub> = (LN-M<sup>2</sup>) / (EG-F<sup>2</sup>) ; *(determinant of [dn])*
<br/>
**Mean Curvature H**: (&kappa;<sub>min</sub>+&kappa;<sub>max</sub>)/2 = (EN+GL-2FM) / 2(EG-F<sup>2</sup>) ; *(half the trace of [dn])*
<br/>
<br/>
**&kappa;<sub>n</sub> (a curvature)**: &kappa;<sub>n</sub> = II/I : &kappa;<sub>n</sub><sup>2</sup> - 2H&kappa;<sub>n</sub> + K = 0 ; &kappa;<sub>n</sub> = &kappa;<sub>max</sub>cos<sup>2</sup>&theta; + &kappa;<sub>min</sub>sin<sup>2</sup>&theta;
<br/>
**&kappa;<sub>min</sub> (min curvature)**: H - (H<sup>2</sup> - K)<sup>1/2</sup>
<br/>
**&kappa;<sub>max</sub> (max curvature)**: H + (H<sup>2</sup> - K)<sup>1/2</sup>
<br/>
**Principal Directions e<sub>min</sub>, e<sub>max</sub>**: directions of min and max curvature (equal if &kappa;<sub>min</sub>=&kappa;<sub>max</sub>)
<br/>
<br/>
**Matrix Solutions**: The shape operator (primarily II, but also I) is a matrix representation of the problem, where the eigenvalues are the curvatures, and the eigenvectors are the corresponding principal directions (Hessian of f)
<br/>
*Renaming of coefficients*: The values from (I) are typically referred to as **e**=L, **f**=M, **g**=N, in this context
<br/>
1/det([E F; F G])&middot;[eG-fF f-gF ; fE-eF gE-fF]
```
- [e f]inv([E F])  =  -1/(EG-FF)[e f][G -F]  =  1/(EG-FF)[eG-fF fE-eF]
  [f g]   ([F G])  =            [f g][-F E]  =           [fG-gF gE-fF]
```
Which is also shown by some sources as the negative diagonal-reversed shape operator:
```
1/(EG-FF)[eG-fF fG-gF]
         [fE-eF gE-fF]
```
<br/>
**Other Interesting Equation**:
<br/>
A = [L(EG-2F<sup>2</sup>) + 2EFM - E<sup>2</sup>N] / [2E(EG-F<sup>2</sup>)]
<br/>
B = (EM - FL)/[E(EG-F<sup>2</sup>)<sup>1/2</sup>]
<br/>
k<sub>n</sub> = H + Acos2&theta; + Bsin2&theta;
<br/>
<br/>
**Note: complex dot product (inner product, vector product)**:
<br/>
x = aX<sub>u</sub> + bX<sub>v</sub> , y = cX<sub>u</sub> + dX<sub>v</sub>
<br/>
x &middot; y = (aX<sub>u</sub> + bX<sub>v</sub>) &middot; (cX<sub>u</sub> + dX<sub>v</sub>)
<br/>
= (ac)(X<sub>u</sub>&middot;X<sub>u</sub>) + (a+d)(X<sub>u</sub>&middot;X<sub>v</sub>) + (b+c)(X<sub>u</sub>&middot;X<sub>v</sub>) + (bd)(X<sub>v</sub>&middot;X<sub>v</sub>)
<br/>
= (ac)(X<sub>u</sub>&middot;X<sub>u</sub>) + (ad+bc)(X<sub>u</sub>&middot;X<sub>v</sub>) + (bd)(X<sub>v</sub>&middot;X<sub>v</sub>)
<br/>
<br/>
**Other Notes:**
- All curves at a point share the same tangent plane and normal vector*
- Two ways of defining a surface:
    - Level sets: scalar field, gradient vector points normal to surface
    - Position Vector: Derivative is arc-length tangent to surface, Second derivative is normal to surface
- r(t) = r(u(t),v(t)) = Parametric Curve on r(u,v)
- &tau; = -N&middot;B'
- &kappa; = |r' &times; r''|/|r'<sup>3</sup>|



### Definition of 3D Plane
<br/>
**Equation of a plane**: ax + by + cz + d = 0 &rarr; normal vector (n): &lt;a,b,c&gt; point in plane (q): (a&middot;d,b&middot;d,c&middot;d)/||n||
<br/>
**Plane including origin**: d=0 &rarr; ax + by + cz = 0
<br/>
**Useful definition of a plane**: normal to plane: n, point in plane: q
<br/>
n = &lt;a,b,c&gt;, q = &lt;r,s,t&gt;, p = (x,y,z)
<br/>
dot(n,p-q) = 0
<br/>
&lt;a,b,c&gt;*&lt;x-r,y-s,z-t&gt; = 0
<br/>
ax + by + cz - (ar+bs+ct) = 0
<br/>
d = -(ar+bs+ct)
<br/>
assuming q specifies a point from the origin, along the normal: q = g*(a,b,c) = (r,s,t)
<br/>
d = (a*ga+b*gb+c*gc)
<br/>
d = g(aa+bb+cc)
<br/>
assuming n is a normal vector (aa+bb+cc) = 1, and g = d
<br/>
is n is not normal, d = g||n||<sup>2</sup>
<br/>
<br/>

### (Geometric) Least Squares Planar Surface From Set of Points
<br/>
**Set of points (&reals;<sup>3</sup>) to fit**: P
<br/>
**Covarint Matrix A**: measures orthogonal error to a plane
```
[ cov(x,x), cov(x,y), cov(x,z) ]
[ cov(y,x), cov(y,y), cov(y,z) ]
[ cov(z,x), cov(z,y), cov(z,z) ]
```
**Number of elements N**
<br/>
**Covariance cov(a,b)**: &Sum;<sub>i</sub> (a-&mu;<sub>a</sub>)(b-&mu;<sub>b</sub>)
<br/>
**Mean &mu;<sub>a</sub>** = (1/N)&Sum;<sub>i</sub> a
<br/>
**Index of i<sup>th</sup> element i**
<br/>
**i<sup>th</sup> Point P<sub>i</sub> P(x,y,z)**
<br/>
**Point in plane?**: center of mass of points?
<br/>
function should be weighted based on point distance to origin point of plane (projected point)
&Sum;<sub>i</sub> (n&middot;p<sub>i</sub> - d)<sup>2</sup> &middot; function(&prop;1/||p<sub>i</sub>-o||)
<br/>
**...**: ?
<br/>
Solve Ax = b &rarr; x = pinv(A)b ?
<br/>
? Solve SVD ?: smallest eigenvector = normal to surface (direction in which the data varies the least)
<br/>
<br/>
Locally, the surface must be defined by some bivariate polynomial - ie: z = f(x,y) (in terms of the local coordinate system).
&Sum;<sub>i</sub> (f(x<sub>i</sub>,y<sub>i</sub>) - z<sub>i</sub>)<sup>2</sup> &middot; function(&prop;1/||p<sub>i</sub>-o||)
z<sub>i</sub> = height of point in plane coordinate system = n&middot;(p<sub>i</sub>-o)
f() is some bivariate representation (?#? coefficients?)
<br/>
function(&prop;1/||p<sub>i</sub>-o||) suggested to be: exp(-d<sup>2</sup>/h<sup>2</sup>), where h is some input smoothing parameter (larger h = more ssmoothing)
<br/>
<br/>
<br/>
<br/>
<br/>
Minimize squared distance from plane:
<br/>
**r = (r<sub>x</sub>,r<sub>y</sub>,r<sub>z</sub>)**: point near surface
<br/>
**cloud point p = p<sub>i</sub> = (p<sub>x</sub>,p<sub>y</sub>,p<sub>z</sub>)**: point p in point cloud
<br/>
**projected point q = (q<sub>x</sub>,q<sub>y</sub>,q<sub>z</sub>)**: point p projected onto plane (origin of plane system)
<br/>
**plane unit normal n = &lt;n<sub>x</sub>,n<sub>y</sub>,n<sub>z</sub>&gt;**: plane unit normal ||n||=1
<br/>
**weight function &theta;(d)**: weighting based on point distance (d), exp(-d<sup>2</sup>/h<sup>2</sup>)
<br/>
**distance d**: distance
<br/>
**feature size h**: some user input, larger h smooths more
<br/>
**count N**: total number of cloud points
<br/>
&Sum;<sub>i=[0,N]</sub> (dot(n,p<sub>i</sub>-D))<sup>2</sup>&theta;(||p<sub>i</sub>-q||)
<br/>
let q = r + tn
<br/>
D &equiv; distance from origin to plane in direction of n (shortest distance to plane from origin)
<br/>
D = ||q||
<br/>
D = dot(n,q)
<br/>
D = dot(n,r+tn)
<br/>
D = dot(n,r)+t(n<sub>x</sub>+n<sub>y</sub>+n<sub>z</sub>)
<br/>
&rarr;
<br/>
dot(n,p<sub>i</sub>-D) = dot(n,p<sub>i</sub>-q)
<br/>
dot(n,p<sub>i</sub>-D) = dot(n,p<sub>i</sub>-(r+tn))
<br/>
dot(n,p<sub>i</sub>-D) = dot(n,p<sub>i</sub> - r - tn)
<br/>
&rarr;
<br/>
&Sum;<sub>i=[0,N]</sub> (dot(n,p<sub>i</sub> - r - tn))<sup>2</sup>&theta;(||p<sub>i</sub> - r - tn||)
<br/>
**Q(r)**: minimimum solution at smallest t
<br/>
<br/>
Nonlinear iteration minimization:
<br/>
t = 0
<br/>
n = linear covariance SVD min U solution
<br/>
t is expected to be &isin; [-h/2,h/2]
<br/>
<br/>
Partial derivative:
<br/>
2&Sum;<sub>i=[1,N]</sub>(dot(n,p<sub>i</sub> - r - tn))(1 + [dot(n,p<sub>i</sub> - r - tn)]<sup>2</sup>/h<sup>2</sup>)exp(||p<sub>i</sub> - r - tn||<sup>2</sup>/h<sup>2</sup>)
<br/>
<br/>
reference numerical methods in C
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
...P(r) = minimum of projection onto surface = q + g(0,0)n = r + (t+g(0,0)n
<br/>
P(P(r)) = P(r) (projection of surface point &equiv surface point)
<br/>
<br/>
<br/>



### Weighted Least Squares Planar Surface

<br/>
**Weight w<sub>i</sub>**: w &prop; 1/distance
<br/>
**Weighted Center of Mass x&#x0304; = &lt;x&#x0304;,y&#x0304;,z&#x0304;&gt;**: &lt; &Sum;<sub>i&in;[1,n]</sub> w<sub>i</sub>x<sub>i</sub> , &Sum;<sub>i&in;[1,n]</sub> w<sub>i</sub>y<sub>i</sub> , &Sum;<sub>i&in;[1,n]</sub> w<sub>i</sub>z<sub>i</sub> &gt; / &Sum;<sub>i&in;[1,n]</sub>w<sub>i</sub>
<br/>
**Weighted Covariance cov(a,b)**: &Sum;<sub>i&in;[1,n]</sub>w<sub>i</sub>(a<sub>i</sub>-a&#x0304;)(b<sub>i</sub>-b&#x0304;)
<br/>
**Weighted Covariance Matrix**: &Sum;<sub>i&in;[1,n]</sub>w<sub>i</sub>||x<sub>i</sub>-x&#x0304;||<sup>2</sup>
```
[ cov(x,x) cov(x,y) cov(x,z) ]
[ cov(y,x) cov(y,y) cov(y,z) ]
[ cov(z,x) cov(z,y) cov(z,z) ]
```
<br/>
**Minimization**: min &Sum;<sub>i&in;[1,n]</sub>w<sub>i</sub>||x<sub>i</sub>-x&#x0304;||<sup>2</sup>
<br/>
Finding the best plane fit is equivalent to minimizing the sum of squared errors (covariance matrix) &rarr; this corresponds to the eigenvector direction corresponding to the smallest eigenvalue (ie: the direction the data varies in the least).
<br/>


### Weighted Least Squares Bivariate Surface
<br/>
**Minimize weighted sum of squared errors (F)**: min&Sum;<sub>i&in;[1,N]</sub> w<sub>i</sub>(f(p<sub>i<sub>x</sub></sub>,p<sub>i<sub>y</sub></sub>) - p<sub>i<sub>z</sub></sub>)<sup>2</sup>
<br/>
**Point Set P**: set of points 1 to N
<br/>
**Point Weight w<sub>i</sub>**: weighting applied for point<sub>i</sub>
<br/>
**Point p = p<sub>i</sub> = p(p<sub>x</sub>,p<sub>y</sub>,p<sub>z</sub>)**:
<br/>
**Approximating function f(x,y) = b(x,y)<sup>T</sup>c**: (polynomial) bivariate surface z value, defined at all &reals;<sup>3</sup>
<br/>
**Polynomial basis (column) vector b = b(x,y)**: [1, x, y, x<sup>2</sup>, xy, y<sup>2</sup>, x<sup>3</sup>, x<sup>2</sup>y, xy<sup>2</sup>, y<sup>3</sup> ...]<sup>T</sup>
<br/>
**Polynomial coefficient (column) vector c**: [c<sub>1</sub> ... c<sub>count</sub>]<sup>T</sup>
<br/>
**Polynomial Degree deg**: maximum exponent of polynomial (eg: x<sup>3</sup> = 3, x<sup>2</sup>y<sup>2</sup> = 4)
<br/>
**Coefficient count**: For a given degree, there are at most (deg<sup>2</sup> + 3*deg)/2 + 1 coefficients
<br/>
<br/>
F = &Sum; w<sub>i</sub>&middot;(f(x<sub>i</sub>,y<sub>i</sub>) - z<sub>i</sub>)<sup>2</sup>
<br/>
F = &Sum; w<sub>i</sub>&middot;((b(x<sub>i</sub>,y<sub>i</sub>)<sup>T</sup>c - z<sub>i</sub>)<sup>2</sup>
<br/>
<br/>
w(x&middot;c - z)<sup>2</sup>
<br/>
(d/dx) w(x&middot;c - z)<sup>2</sup> = 2w(x&middot;c - z)&middot;c
<br/>
<br/>
&part;F/&part;b = &Sum; 2 w<sub>i</sub>&middot;b(x<sub>i</sub>,y<sub>i</sub>)&middot;(b(x<sub>i</sub>,y<sub>i</sub>)<sup>T</sup>c-z<sub>i</sub>)
<br/>
<br/>
Minimize at derivative = 0
<br/>
2 &Sum; w<sub>i</sub>&middot;b(x<sub>i</sub>,y<sub>i</sub>)&middot;b(x<sub>i</sub>,y<sub>i</sub>)<sup>T</sup>c - b(x<sub>i</sub>,y<sub>i</sub>)z<sub>i</sub> = 0 
<br/>
&Sum; [w<sub>i</sub>&middot;b(x<sub>i</sub>,y<sub>i</sub>)&middot;b(x<sub>i</sub>,y<sub>i</sub>)<sup>T</sup>]c = &Sum; b(x<sub>i</sub>,y<sub>i</sub>)z<sub>i</sub>
<br/>
Ac = b'
<br/>
<br/>
**Numerical Stability**: to keep all values in the same range, points are typically pre-transformed to place them at the origin (around their centroid), and perhaps scaled to fit between say [-1,1] in x,y,z
<br/>
<br/>
Weighting function takes on forms like:
- exp(-(d<sup>2</sup>/h<sup>2</sup>)
- (1-d/h)<sup>4</sup>(4d/h+1)
- 1/(d<sup>2</sup> - &epsilon;<sup>2</sup>)
<br/>
**Distance d**: distance between a point p<sub>i</sub> and some reference point (centroid)
<br/>
**Feature Size h**: basically a scale factor to enhance or limit the weighting
<br/>
constant, linear, quadratic, cubic, quartic, quintic, sextic, septic/septimic, octic/octavic, nonic, decic, 100=hectic
<br/>


### Oct Trees (Octrees)
*Optimizations for searching through 3D points/objects compared to brute force O(n<sup>2</sup>)+*
<br/>
![Oct Trees](./images/octrees.png "Octrees")
<br/>
**Oct/Voxel**: 
<br/>
<br/>
An Octree is first defined but it's outer limiting cube/cuboid. This can be an assumed volume that no objects are expected to be outside, or it can be a derived volume by first looking at the min/max values of all the static data that is to be inserted.
<br/>
<br/>
Octree's get their optimizations by allowing for discarding unnecessary passes in their algorithms. Cubic octrees are more efficient compared to generic cuboid octrees because the circumsphere volume to voxel volume is minimized. The less efficient use of space is compensated for by the effective use of discarded passes.
<br/>
<br/>
- check for points inside cuboid
- check for points inside sphere
- check for k nearest neighbors
<br/>
<br/>
<br/>
c = center of sphere
<br/>
r = sphere radius
<br/>
m = midpoint (center) of oct voxel
<br/>
R = maximum outer 'radius' of voxel
<br/>
distance between voxel center and sphere center: d &equiv; ||m-c||
<br/>
A point inside the voxel will only be inside the sphere if at least the circumsphere of the voxel meets the sphere:
<br/>
d &le; (r+R)
<br/>
d<sup>2</sup> = (r+R)<sup>2</sup>
<br/>
d<sup>2</sup> = r<sup>2</sup> + R<sup>2</sup> + 2rR
<br/>
<br/>
(when comparing squared distances [to save calls to sqrt] don't mistake the [Freshman's Dream](https://www.google.com/search?q=freshman+dream)
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>



### Intersection of Line and Plane (Point Projected onto Plane)
![Line Plane Intersection](./images/line_plane_intersect.png "Line Plane Intersection")
<br/>
**Plane (q,n)**: defined by point: q and unit normal: n
<br/>
**Ray (o,d)**: origin: o and direction: d, point = o + t&middot;d
<br/>
**Point p**: point in space (&real;<sup>3</sup>), point along ray and also in plane (intersection)
<br/>
**Plane Normal and Line-in-Plane Orthogonality**: dot(n, p - q) = 0
<br/>
dot(n, p - q) = 0
<br/>
dot(n, o + t&middot;d - q) = 0
<br/>
dot(n,o) + t&middot;dot(n,d) - dot(n,q) = 0
<br/>
t&middot;dot(n,d) = dot(n,q) - dot(n,o)
<br/>
t = [dot(n,q) - dot(n,o)]/dot(n,d)
<br/>
t = dot(n,q-o)/dot(n,d)
<br/>
<br/>
**KEY NOTES:**
<br/>
if the denominator equals zero (dot(n,d)) &rarr; the line is parallel to the plane
<br/>
if t equals zero (dot(n,q-o) equals zero) &rarr; ray origin is in plane
<br/>
<br/>

### Point in Plane Inside Polygon(Triangle) Check
![Line Triangle Intersection](./images/line_triangle_intersect.png "Line Triangle Intersection")
<br/>
**Triangle a,b,c (n)**: Triangle defined by 3 points which define a plane
<br/>
**Point p**: point inside triangle plane, not necessarily inside triangle bounds
<br/>
**Consistent Direction**: For each edge e &isin; (ab,bc,ca): (e.b-e.a)&times;(p-e.a) should all point in same direction
<br/>
n = unit(ab&times;ac)
<br/>
u = (ap &times; ab) &middot; n
<br/>
v = (bp &times; bc) &middot; n
<br/>
w = (cp &times; ca) &middot; n
<br/>
(u>=0 && v>=0 && w>=0) || (u<=0 && v<=0 && w<=0)
<br/>
<br/>
**Area Method**: The area of the triangle abc ||ab&times;ac||/2, should always be equal to the summed areas of the 3 'sub'-trianges defined by point p: abp, bcp, cap. The summed area is only greater if the point is outside the triangle. This method is more sbject to numerical stability.
<br/>
<br/>

### Closest Point on Line-Segment to Point (Min Distance Line and Point)
![Point Line Segment Distance](./images/linesegment_point_3D.png "Point to Line Segment Distance")
<br/>
**Line Segment AB**: points A and B represent a line segment
<br/>
**Ray o + td**: Ray representation of line segment, o&isin;&real;<sup>3</sup>, d&isin;&#8477;<sup>3</sup>, t&isin;&reals;, any t value outside [0,1] means point is outside segment
<br/>
**Ray Origin o = (o<sub>x</sub>,o<sub>y</sub>,o<sub>z</sub>)**: same point as A
<br/>
**Ray Direction d = &lt;d<sub>x</sub>,d<sub>y</sub>,d<sub>x</sub>&gt;**: ray direction A-B, (magnitude &equiv; ||A-B||)
<br/>
**Point p = (p<sub>x</sub>,p<sub>y</sub>,p<sub>z</sub>)**: Point in &reals;<sup>3</sup>, to find distance from line
<br/>
**Closest Point q = (q<sub>x</sub>,q<sub>y</sub>,q<sub>z</sub>)**: Closest point on LINE (may be outside line segment) to point p
<br/>
<br/>
**Dissect Definition of q into 3 Equations**:
<br/>
*q = o + td*
<br/>
q<sub>x</sub> = o<sub>x</sub> + td<sub>x</sub>
<br/>
q<sub>y</sub> = o<sub>y</sub> + td<sub>y</sub>
<br/>
q<sub>z</sub> = o<sub>z</sub> + td<sub>z</sub>
<br/>
<br/>
**Closest Point direction q-p is orthogonal to line**:
<br/>
*dot(q-p,d) = 0 = &lt;q-p&gt; &middot; d = 0*
<br/>
&lt;q-p&gt; &middot; d = d<sub>x</sub>(q<sub>x</sub>-p<sub>x</sub>) + d<sub>y</sub>(q<sub>y</sub>-p<sub>y</sub>) + d<sub>z</sub>(q<sub>z</sub>-p<sub>z</sub>) = 0
<br/>
<br/>
**Solve for t from previous equations**
<br/>
d<sub>x</sub>(o<sub>x</sub>+td<sub>x</sub>-p<sub>x</sub>) + d<sub>y</sub>(o<sub>y</sub>+td<sub>y</sub>-p<sub>y</sub>) + d<sub>z</sub>(o<sub>x</sub>+td<sub>z</sub>-p<sub>z</sub>) = 0
<br/>
d<sub>x</sub>o<sub>x</sub>+td<sub>x</sub>d<sub>x</sub>-d<sub>x</sub>p<sub>x</sub> + d<sub>y</sub>o<sub>y</sub>+td<sub>y</sub>d<sub>y</sub>-d<sub>y</sub>p<sub>y</sub> + d<sub>z</sub>o<sub>x</sub>+td<sub>z</sub>d<sub>z</sub>-d<sub>z</sub>p<sub>z</sub> = 0
<br/>
t(d<sub>x</sub>d<sub>x</sub> + d<sub>y</sub>d<sub>y</sub> + d<sub>z</sub>d<sub>z</sub>) + (d<sub>x</sub>o<sub>x</sub> + d<sub>y</sub>o<sub>y</sub> + d<sub>z</sub>o<sub>x</sub>) - (d<sub>x</sub>p<sub>x</sub> + d<sub>y</sub>p<sub>y</sub> + d<sub>z</sub>p<sub>z</sub>) = 0
<br/>
t(d<sub>x</sub>d<sub>x</sub> + d<sub>y</sub>d<sub>y</sub> + d<sub>z</sub>d<sub>z</sub>) = (d<sub>x</sub>p<sub>x</sub> + d<sub>y</sub>p<sub>y</sub> + d<sub>z</sub>p<sub>z</sub>) - (d<sub>x</sub>o<sub>x</sub> + d<sub>y</sub>o<sub>y</sub> + d<sub>z</sub>o<sub>x</sub>)
<br/>
t = [(d<sub>x</sub>p<sub>x</sub>+d<sub>y</sub>p<sub>y</sub>+d<sub>z</sub>p<sub>z</sub>) - (d<sub>x</sub>o<sub>x</sub>+d<sub>y</sub>o<sub>y</sub>+d<sub>z</sub>o<sub>x</sub>)]/(d<sub>x</sub>d<sub>x</sub>+d<sub>y</sub>d<sub>y</sub>+d<sub>z</sub>d<sub>z</sub>)
<br/>
t = [dot(d,p) - dot(d,o)]/dot(d,d)
<br/>
t = [(d &middot; p) - (d &middot; o)]/(d &middot; d)
<br/>
<br/>

**KEY NOTES:**
<br/>
if the denominator equals zero (dot(d,d)) &rarr; there is no direction
<br/>
if t is outside [0,1], the best point is outside the segment, but t is capped to [0,1]



### Closest Points Between Line Segments
![Line-Line Segment Distance](./images/linesegments_3D.png "Min Line to Line Segment Distance")
<br/>
**Line Segment 1**: o + td = a (for some a)
<br/>
**Line Segment 2**: &sigma; + &lambda;&delta; = &alpha; (for some &alpha;)
<br/>
<br/>
**a-&alpha; orthogonal to both lines**: (a - &alpha;) &middot; d = 0 [1]; (a - &alpha;) &middot; &delta; = 0 [2];
<br/>
<br/>
*Expanding [1], solving for &lambda;*
<br/>
(a - &alpha;) &middot; d = 0
<br/>
(a<sub>x</sub>-&alpha;<sub>x</sub>)d<sub>x</sub> + (a<sub>y</sub>-&alpha;<sub>y</sub>)d<sub>y</sub> + (a<sub>z</sub>-&alpha;<sub>z</sub>)d<sub>z</sub> = 0
<br/>
(o<sub>x</sub>+td<sub>x</sub> - &sigma;<sub>x</sub>-&lambda;&delta;<sub>x</sub>)d<sub>x</sub> + (o<sub>y</sub>+td<sub>y</sub> - &sigma;<sub>y</sub>-&lambda;&delta;<sub>y</sub>)d<sub>y</sub> + (o<sub>z</sub>+td<sub>z</sub> - &sigma;<sub>z</sub>-&lambda;&delta;<sub>z</sub>)d<sub>z</sub> = 0
<br/>
dot(o,d) + t&middot;dot(d,d) - dot(&sigma;,d) - &lambda;&middot;dot(&delta;,d) = 0
<br/>
dot(o,d) + t&middot;dot(d,d) - dot(&sigma;,d) = &lambda;&middot;dot(&delta;,d)
<br/>
[dot(o,d) + t&middot;dot(d,d) - dot(&sigma;,d)]/dot(&delta;,d) = &lambda; [3]
<br/>
<br/>
*Expanding [2], solving for &lambda;*
<br/>
(a - &alpha;) &middot; &delta; = 0
<br/>
(a<sub>x</sub>-&alpha;<sub>x</sub>)&delta;<sub>x</sub> + (a<sub>y</sub>-&alpha;<sub>y</sub>)&delta;<sub>y</sub> + (a<sub>z</sub>-&alpha;<sub>z</sub>)&delta;<sub>z</sub> = 0
<br/>
(o<sub>x</sub>+td<sub>x</sub> - &sigma;<sub>x</sub>-&lambda;&delta;<sub>x</sub>)&delta;<sub>x</sub> + (o<sub>y</sub>+td<sub>y</sub> - &sigma;<sub>y</sub>-&lambda;&delta;<sub>y</sub>)&delta;<sub>y</sub> + (o<sub>z</sub>+td<sub>z</sub> - &sigma;<sub>z</sub>-&lambda;&delta;<sub>z</sub>)&delta;<sub>z</sub> = 0
<br/>
dot(o,&delta;) + t&middot;dot(d,&delta;) - dot(&sigma;,&delta;) - &lambda;&middot;dot(&delta;,&delta;) = 0
<br/>
dot(o,&delta;) + t&middot;dot(d,&delta;) - dot(&sigma;,&delta;) = &lambda;&middot;dot(&delta;,&delta;)
<br/>
[dot(o,&delta;) + t&middot;dot(d,&delta;) - dot(&sigma;,&delta;)]/dot(&delta;,&delta;) = &lambda; [4]
<br/>
<br/>
*Combining [3] = [4], solve for t*
<br/>
[dot(o,d) + t&middot;dot(d,d) - dot(&sigma;,d)]/dot(&delta;,d) = [dot(o,&delta;) + t&middot;dot(d,&delta;) - dot(&sigma;,&delta;)]/dot(&delta;,&delta;)
<br/>
dot(&delta;,&delta;)[dot(o,d) + t&middot;dot(d,d) - dot(&sigma;,d)] = dot(&delta;,d)[dot(o,&delta;) + t&middot;dot(d,&delta;) - dot(&sigma;,&delta;)]
<br/>
dot(&delta;,&delta;)dot(o,d) + t&middot;dot(&delta;,&delta;)dot(d,d) - dot(&delta;,&delta;)dot(&sigma;,d) = dot(&delta;,d)dot(o,&delta;) + t&middot;dot(&delta;,d)dot(d,&delta;) - dot(&delta;,d)dot(&sigma;,&delta;)
<br/>
t[dot(&delta;,&delta;)dot(d,d) - dot(&delta;,d)dot(d,&delta;)] = dot(&delta;,d)dot(o,&delta;) + dot(&delta;,&delta;)dot(&sigma;,d) - dot(&delta;,d)dot(&sigma;,&delta;) - dot(&delta;,&delta;)dot(o,d)
<br/>
t = [dot(&delta;,d)dot(o,&delta;) + dot(&delta;,&delta;)dot(&sigma;,d) - dot(&delta;,d)dot(&sigma;,&delta;) - dot(&delta;,&delta;)dot(o,d)]/[dot(&delta;,&delta;)dot(d,d) - dot(&delta;,d)dot(d,&delta;)]
<br/>
t = [dot(&delta;,d)(dot(o,&delta;)-dot(&sigma;,&delta;)) + dot(&delta;,&delta;)(dot(&sigma;,d)-dot(o,d))]/[dot(&delta;,&delta;)dot(d,d) - dot(&delta;,d)dot(d,&delta;)]
<br/>
<br/>
*Expanding [1], solving for t*
<br/>
dot(o,d) + t&middot;dot(d,d) - dot(&sigma;,d) - &lambda;&middot;dot(&delta;,d) = 0
<br/>
t&middot;dot(d,d) = dot(&sigma;,d) + &lambda;&middot;dot(&delta;,d) - dot(o,d)
<br/>
t = [dot(&sigma;,d) + &lambda;&middot;dot(&delta;,d) - dot(o,d)]/dot(d,d) [5]
<br/>
<br/>
*Expanding [2], solving for t*
<br/>
dot(o,&delta;) + t&middot;dot(d,&delta;) - dot(&sigma;,&delta;) - &lambda;&middot;dot(&delta;,&delta;) = 0
<br/>
t&middot;dot(d,&delta;) = dot(&sigma;,&delta;) + &lambda;&middot;dot(&delta;,&delta;) - dot(o,&delta;)
<br/>
t = [dot(&sigma;,&delta;) + &lambda;&middot;dot(&delta;,&delta;) - dot(o,&delta;)]/dot(d,&delta;) [6]
<br/>
<br/>
*Combining [5] = [6], solve for &lambda;*
<br/>
[dot(&sigma;,d) + &lambda;&middot;dot(&delta;,d) - dot(o,d)]/dot(d,d) = [dot(&sigma;,&delta;) + &lambda;&middot;dot(&delta;,&delta;) - dot(o,&delta;)]/dot(d,&delta;)
<br/>
dot(d,&delta;)[dot(&sigma;,d) + &lambda;&middot;dot(&delta;,d) - dot(o,d)] = dot(d,d)[dot(&sigma;,&delta;) + &lambda;&middot;dot(&delta;,&delta;) - dot(o,&delta;)]
<br/>
dot(d,&delta;)dot(&sigma;,d) + &lambda;&middot;dot(d,&delta;)dot(&delta;,d) - dot(d,&delta;)dot(o,d) = dot(d,d)dot(&sigma;,&delta;) + &lambda;&middot;dot(d,d)dot(&delta;,&delta;) - dot(d,d)dot(o,&delta;)
<br/>
&lambda;[dot(d,&delta;)dot(&delta;,d) - dot(d,d)dot(&delta;,&delta;)] = dot(d,&delta;)dot(o,d) + dot(d,d)dot(&sigma;,&delta;) - dot(d,d)dot(o,&delta;) - dot(d,&delta;)dot(&sigma;,d)
<br/>
&lambda; = [dot(d,&delta;)dot(o,d) + dot(d,d)dot(&sigma;,&delta;) - dot(d,d)dot(o,&delta;) - dot(d,&delta;)dot(&sigma;,d)]/[dot(d,&delta;)dot(&delta;,d) - dot(d,d)dot(&delta;,&delta;)]
<br/>
&lambda; = [dot(&delta;,d)dot(&sigma;,d) + dot(d,d)dot(o,&delta;) - dot(&delta;,d)dot(o,d) - dot(d,d)dot(&sigma;,&delta;)]/[dot(d,d)dot(&delta;,&delta;) - dot(&delta;,d)dot(&delta;,d)]
<br/>
&lambda; = [dot(&delta;,d)(dot(&sigma;,d)-dot(o,d)) + dot(d,d)(dot(o,&delta;)-dot(&sigma;,&delta;))]/[dot(d,d)dot(&delta;,&delta;) - dot(&delta;,d)dot(&delta;,d)]
<br/>
<br/>
*Solutions Juxtaposed to Observe Symmetry*
<br/>
t = [dot(&delta;,d)(dot(o,&delta;)-dot(&sigma;,&delta;)) + dot(&delta;,&delta;)(dot(&sigma;,d)-dot(o,d))]/[dot(&delta;,&delta;)dot(d,d) - dot(&delta;,d)dot(&delta;,d)]
<br/>
&lambda; = [dot(&delta;,d)(dot(&sigma;,d)-dot(o,d)) + dot(d,d)(dot(o,&delta;)-dot(&sigma;,&delta;))]/[dot(&delta;,&delta;)dot(d,d) - dot(&delta;,d)dot(&delta;,d)]
<br/>
<br/>
**KEY NOTES:**
<br/>
if the denominator equals zero [dot(&delta;,&delta;)dot(d,d) - dot(&delta;,d)dot(&delta;,d)] &rarr; the lines are parallel/anti-parallel
<br/>
if t and/or &lambda; are outside [0,1] the closest points between the segments needs some minimization (below)
<br/>
Parallel closest points need to be determined in a more detailed fashion


#### Minimizing for t,&lamdba; outside [0,1]
If t or lambda; are outside [0,1], the problem converts to a shortest distance between (end)point and line-segment.
<br/>
For each particular situation (t<0,t>1,&lambda;<0,&lambda;>1) the endpoint is checked for shortest distance to opposite line, which can be capped to [0,1]
<br/>
<br/>



### Closest Point on Plane from Point
![Plane-Point Distance](./images/plane_to_point_3D.png "Min Plane-Point Distance")
<br/>
**Point b**: Point of interest (known)
<br/>
**Plane n,q**: Normal n, point in plane q
<br/>
**Point p (intersection)**: Point in Plane closest to b (to be calculated)
<br/>
**Line p = b + td**: Line connecting known point and unknown point
<br/>
<br/>
**Point-Intersection and in-Plane Orthogonality**: &lt;p-q&gt; &middot; &lt;p-b&gt; = 0;
<br/>
**Point-Intersection and Normal Parallelity**: &lt;p-b&gt; &middot; d = ||p-b||&middot;||d|| &rarr; &lt;p-b&gt;/||p-b|| &equiv; d/||d|| &rarr; d &equiv; n
<br/>
dot(p-q,p-b) = 0
<br/>
dot(b+t&middot;n-q,b+t&middot;n-b) = 0
<br/>
dot(b+t&middot;n-q,t&middot;n) = 0
<br/>
t&middot;dot(b+t&middot;n-q,n) = 0
<br/>
dot(b+t&middot;n-q,n) = 0
<br/>
dot(b,n) + t&middot;dot(n,n) - dot(q,n) = 0
<br/>
t&middot;dot(n,n) = dot(q,n) - dot(b,n)
<br/>
t = [dot(q,n) - dot(b,n)]/dot(n,n)
<br/>
t = dot(q-b,n)/dot(n,n)
<br/>
<br/>
*Insight*
<br/>
Geometrically, this shows the simpler observation: t is the portion of &lt;q-p&gt; along n
<br/>
<br/>

### Minimum Distance of Line-Segment to Triangle-Plane
![?](./images/?.png "?")
<br/>
**Triangle a,b,c (n)**: Triangle defined by 3 points: a,b,c, and unit normal n = unit(ab&times;ac)
<br/>
**Line Segment o,d (AB)**: o + td t &isin; [0,1], or A=o and B=o+d
<br/>
**Check 1**: if AB intersects triangle inside &rarr; distance = 0
<br/>
**Check 2**: closest point from points A or B to plane is inside triangle &rarr; distance = ||min(A or B)||
<br/>
**Check 3**: closest point from AB and each edge: ab, bc, ca &rarr; distance = ||min(ab,bc,ca)||
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

1) intersect line-plane inside?
2) end points -to-plane inside?
3) closest of line and 3 line segments

<br/>
<br/>

### Triangle-Triangle (Plane-Segment) &times;2 Intersection
![?](./images/?.png "?")
<br/>
**Triangle A a<sub>A</sub>,b<sub>A</sub>,c<sub>A</sub>, n**: Triangle A defined by 3 points:  a<sub>A</sub>,b<sub>A</sub>,c<sub>A</sub>, unit-normal n = unit(&lt;b<sub>A</sub>-a<sub>A</sub>&gt; &times; &lt;c<sub>A</sub>-a<sub>A</sub>&gt;)
<br/>
**Triangle B a<sub>B</sub>,b<sub>B</sub>,c<sub>B</sub>, &eta;**: Triangle B defined by 3 points:  a<sub>B</sub>,b<sub>B</sub>,c<sub>B</sub>, unit-normal &eta; = unit(&lt;b<sub>B</sub>-a<sub>B</sub>&gt; &times; &lt;c<sub>B</sub>-a<sub>B</sub>&gt;)
<br/>
**Plane A n,p**: Plane of Triangle A with: unit-normal n, point in plane: p; d<sub>A</sub> = -n &middot; p (n&middot;x + d<sub>A</sub> = 0)
<br/>
**Plane B &eta;,&rho;**: Plane of Triangle A with: unit-normal &eta;, point in plane: &rho;; d<sub>B</sub> = -&eta; &middot; &rho; (&eta;&middot;x + d<sub>B</sub> = 0)
<br/>
**Line of Intersection q,d**: Plane-Plane Intersection Line with point q, unit direction d
<br/>
<br/>
**Direction must be perpendicular to both n and &eta;**: d = unit(n &times; &eta;)
<br/>
**q on line to respective plane points is also perpendicular to respective normals**:
<br/>
&lt;q-p&gt; &middot; n = 0
<br/>
&lt;q-&rho;&gt; &middot; &eta; = 0
<br/>
*Without any more requirements q is underdetermined (free parameter for q), choose additional criteria*:
<br/>
**Pick q as minimum distance from p**: *(alternate method is to choose some x or y or z for q)*
<br/>
&lt;q-p&gt; &middot; d = 0
<br/>
<br/>
*Expand q equations*:
<br/>
n<sub>x</sub>(q<sub>x</sub>-p<sub>x</sub>) + n<sub>y</sub>(q<sub>y</sub>-p<sub>y</sub>) + n<sub>z</sub>(q<sub>z</sub>-p<sub>z</sub>) = 0 [1]
<br/>
&eta;<sub>x</sub>(q<sub>x</sub>-&rho;<sub>x</sub>) + &eta;<sub>y</sub>(q<sub>y</sub>-&rho;<sub>y</sub>) + &eta;<sub>z</sub>(q<sub>z</sub>-&rho;<sub>z</sub>) = 0 [2]
<br/>
d<sub>x</sub>(q<sub>x</sub>-p<sub>x</sub>) + d<sub>y</sub>(q<sub>y</sub>-p<sub>y</sub>) + d<sub>z</sub>(q<sub>z</sub>-p<sub>z</sub>) = 0 [3]
<br/>
<br/>
**Solve via Ax = b (x = A<sup>-1</sup>b)**: *from [1], [2], [3]*
<br/>
n<sub>x</sub>q<sub>x</sub> + n<sub>y</sub>q<sub>y</sub> + n<sub>z</sub>q<sub>z</sub> = d<sub>x</sub>p<sub>x</sub> + n<sub>y</sub>p<sub>y</sub> + n<sub>z</sub>p<sub>z</sub>
<br/>
&eta;<sub>x</sub>q<sub>x</sub> + &eta;<sub>y</sub>q<sub>y</sub> + &eta;<sub>z</sub>q<sub>z</sub> = &eta;<sub>x</sub>&rho;<sub>x</sub> + &eta;<sub>y</sub>&rho;<sub>y</sub> + &eta;<sub>z</sub>&rho;<sub>z</sub>
<br/>
d<sub>x</sub>q<sub>x</sub> + d<sub>y</sub>q<sub>y</sub> + d<sub>z</sub>q<sub>z</sub> = d<sub>x</sub>p<sub>x</sub> + d<sub>y</sub>p<sub>y</sub> + d<sub>z</sub>p<sub>z</sub>
<br/>
```
[n.x n.y d.z] [q.x]   [n.x*p.x + n.y*p.y + n.z*p.z]
[e.x e.y d.z] [q.y] = [e.x*r.x + e.y*r.y + e.z*r.z]
[d.x d.y d.z] [q.z]   [d.x*p.x + d.y*p.y + d.z*p.z]
```
**KEY NOTES:**
<br/>
If planes are parallel (d=zero), there are zero or infinite solutions for plane-plane intersection
<br/>
<br/>
**Infinite-Line - Line-Segment Intersection**:
<br/>
**Line q,d**: Infinite Line with point q, direction d, any point p = q + t&middot;d
<br/>
**Segment p,e**: Line Segment with point b, direction e, any point p = b + u&middot;e, u&isin;[0,1]
<br/>
<br/>
**Line-Line Intersection**: p = q + t&middot;d = b + u&middot;e
<br/>
*Expand into 3 equations (Over-determined)*
<br/>
q<sub>x</sub> + t&middot;d<sub>x</sub> = b<sub>x</sub> + u&middot;e<sub>x</sub>
<br/>
q<sub>y</sub> + t&middot;d<sub>y</sub> = b<sub>y</sub> + u&middot;e<sub>y</sub>
<br/>
q<sub>z</sub> + t&middot;d<sub>z</sub> = b<sub>z</sub> + u&middot;e<sub>z</sub>
<br/>
<br/>
t = (b<sub>x</sub> + u&middot;e<sub>x</sub> - q<sub>x</sub>)/d<sub>x</sub> [1]
<br/>
t = (b<sub>y</sub> + u&middot;e<sub>y</sub> - q<sub>y</sub>)/d<sub>y</sub> [2]
<br/>
t = (b<sub>z</sub> + u&middot;e<sub>z</sub> - q<sub>z</sub>)/d<sub>z</sub> [3]
<br/>
*[1] = [2]*
<br/>
(b<sub>x</sub> + u&middot;e<sub>x</sub> - q<sub>x</sub>)/d<sub>x</sub> = (b<sub>y</sub> + u&middot;e<sub>y</sub> - q<sub>y</sub>)/d<sub>y</sub>
<br/>
d<sub>y</sub>(b<sub>x</sub> + u&middot;e<sub>x</sub> - q<sub>x</sub>) = d<sub>x</sub>(b<sub>y</sub> + u&middot;e<sub>y</sub> - q<sub>y</sub>)
<br/>
d<sub>y</sub>b<sub>x</sub> + u&middot;e<sub>x</sub>d<sub>y</sub> - d<sub>y</sub>q<sub>x</sub> = d<sub>x</sub>b<sub>y</sub> + u&middot;e<sub>x</sub>d<sub>y</sub> - d<sub>x</sub>q<sub>y</sub>
<br/>
u&middot;e<sub>x</sub>d<sub>y</sub> - u&middot;e<sub>x</sub>d<sub>y</sub> = d<sub>x</sub>b<sub>y</sub> - d<sub>x</sub>q<sub>y</sub> - d<sub>y</sub>b<sub>x</sub> + d<sub>y</sub>q<sub>x</sub>
<br/>
*[1]=[2], [1]=[3], [2]=[3]*:
<br/>
u = (d<sub>x</sub>b<sub>y</sub> - d<sub>y</sub>b<sub>x</sub> + d<sub>y</sub>q<sub>x</sub> - d<sub>x</sub>q<sub>y</sub>)/(e<sub>x</sub>d<sub>y</sub> - e<sub>x</sub>d<sub>y</sub>)
<br/>
u = (d<sub>x</sub>b<sub>z</sub> - d<sub>z</sub>b<sub>x</sub> + d<sub>z</sub>q<sub>x</sub> - d<sub>x</sub>q<sub>z</sub>)/(e<sub>x</sub>d<sub>z</sub> - e<sub>x</sub>d<sub>z</sub>)
<br/>
u = (d<sub>y</sub>b<sub>z</sub> - d<sub>z</sub>b<sub>y</sub> + d<sub>z</sub>q<sub>y</sub> - d<sub>y</sub>q<sub>z</sub>)/(e<sub>y</sub>d<sub>z</sub> - e<sub>y</sub>d<sub>z</sub>)
<br/>
<br/>
*Combinations of t=... and u=... need to be checked to avoid division by zero*
<br/>
<br/>
**Quick Check:** Use signed distances to initially determine if all points of tri are on a single side of the plane-plane intersection to quickly fail before doing unnecessary calculations
<br/>
**Signed Distances (triangle A with plane B)**:
<br/>
d<sub>aA</sub> = n &middot; a + d<sub>B</sub>
<br/>
d<sub>bA</sub> = n &middot; b + d<sub>B</sub>
<br/>
d<sub>cA</sub> = n &middot; c + d<sub>B</sub>
<br/>
**Signed Distances (triangle B with plane A)**:
<br/>
d<sub>aB</sub> = &eta; &middot; a + d<sub>A</sub>
<br/>
d<sub>bB</sub> = &eta; &middot; b + d<sub>A</sub>
<br/>
d<sub>cB</sub> = &eta; &middot; c + d<sub>A</sub>
<br/>
**Fast Fail Check A:** (d<sub>aA</sub>&lt;0 && d<sub>bA</sub>&lt;0 && d<sub>cA</sub>&lt;0) || (d<sub>aA</sub>&gt;0 && d<sub>bA</sub>&gt;0 && d<sub>cA</sub>&gt;0)
<br/>
**Fast Fail Check B:** (d<sub>aB</sub>&lt;0 && d<sub>bB</sub>&lt;0 && d<sub>cB</sub>&lt;0) || (d<sub>aB</sub>&gt;0 && d<sub>bB</sub>&gt;0 && d<sub>cB</sub>&gt;0)
<br/>
<br/>

<br/>
<br/>
<br/>
<br/>
*Just check for closest point between two infinite lines, then check if point is inside [0,1] on segment*
<br/>
do for all 3 triangle edges => either none or two must intersect
<br/>
<br/>
<br/>
**Coplanar Triangles**
<br/>
<br/>
<br/>
**KEY NOTES:**
<br/>
<br/>
<br/>
<br/>


<br/>
<br/>
<br/>
<br/>



# Debugging ... 

<br/>


<br/>

**Camera Matrix P**: P = M&middot;K

| P |   |   |   |
|---|---|---|---|
| a | b | c | d |
| e | f | g | h |
| i | j | k | l |

<br/>
**Extrinsic Camera Matrix M**: 
| M |   |   |   |
|---|---|---|---|
| r<sub>1,1</sub> | r<sub>1,2</sub> | r<sub>1,3</sub> | t<sub>x</sub> |
| r<sub>2,1</sub> | r<sub>2,2</sub> | r<sub>2,3</sub> | t<sub>y</sub> |
| r<sub>3,1</sub> | r<sub>3,2</sub> | r<sub>3,3</sub> | t<sub>z</sub> |

<br/>
**Intrinsic Camera Matrix K**: 
| K |   |   |
|---|---|---|
| f<sub>x</sub> | s | c<sub>x</sub> |
|0 | f<sub>y</sub> | c<sub>x</sub> |
|0 | 0 | 1 |

<br/>


<br/>
**Essential Matrix**:
E = K<sup>T</sup>&middot;F&middot;K
<br/>
E = R&middot;[t]<sub>&mult;</sub>
<br/>
E = U&middot;&Sigma;&middot;V<sup>T</sup>
<br/>
...
https://en.wikipedia.org/wiki/Essential_matrix



**Orthonormal Rotational Matrix Properties:**
<br/>
&lt; r<sub>1,1</sub>, r<sub>1,2</sub>, r<sub>1,3</sub> &gt; &middot; &lt; r<sub>2,1</sub>, r<sub>2,2</sub>, r<sub>2,3</sub> &gt; = 0
<br/>
&lt; r<sub>1,1</sub>, r<sub>1,2</sub>, r<sub>1,3</sub> &gt; &middot; &lt; r<sub>3,1</sub>, r<sub>3,2</sub>, r<sub>3,3</sub> &gt; = 0
<br/>
&lt; r<sub>2,1</sub>, r<sub>2,2</sub>, r<sub>2,3</sub> &gt; &middot; &lt; r<sub>3,1</sub>, r<sub>3,2</sub>, r<sub>3,3</sub> &gt; = 0
<br/>
<br/>
&lt; r<sub>1,1</sub>, r<sub>1,2</sub>, r<sub>1,3</sub> &gt; &middot; &lt; r<sub>1,1</sub>, r<sub>1,2</sub>, r<sub>1,3</sub> &gt; = 1
<br/>
&lt; r<sub>2,1</sub>, r<sub>2,2</sub>, r<sub>2,3</sub> &gt; &middot; &lt; r<sub>2,1</sub>, r<sub>2,2</sub>, r<sub>2,3</sub> &gt; = 1
<br/>
&lt; r<sub>3,1</sub>, r<sub>3,2</sub>, r<sub>3,3</sub> &gt; &middot; &lt; r<sub>3,1</sub>, r<sub>3,2</sub>, r<sub>3,3</sub> &gt; = 1
<br/>
<br/>

&lt; x&prime;, y&prime;, z&prime; &gt; = P &middot; &lt; X, Y, Z &gt;
<br/>

<br/>
<br/>

<br/>
x = x&prime;/z&prime;
<br/>
y = y&prime;/z&prime;
<br/>
<br/>
x&prime; = a&middot;X + b&middot;Y + c&middot;Z + d
<br/>
y&prime; = e&middot;X + f&middot;Y + g&middot;Z + h
<br/>
z&prime; = i&middot;X + j&middot;Y + k&middot;Z + l
<br/>
<br/>
a = r<sub>1,1</sub>&middot;f<sub>x</sub> + r<sub>2,1</sub>&middot;s + r<sub>3,1</sub>&middot;c<sub>x</sub>
<br/>
b = r<sub>1,2</sub>&middot;f<sub>x</sub> + r<sub>2,2</sub>&middot;s + r<sub>3,2</sub>&middot;c<sub>x</sub>
<br/>
c = r<sub>1,3</sub>&middot;f<sub>x</sub> + r<sub>2,3</sub>&middot;s + r<sub>3,3</sub>&middot;c<sub>x</sub>
<br/>
d = t<sub>x</sub>&middot;f<sub>x</sub> + t<sub>y</sub>&middot;s + t<sub>z</sub>&middot;c<sub>x</sub>
<br/>
<br/>
e = r<sub>2,1</sub>&middot;f<sub>y</sub> + r<sub>3,1</sub>&middot;c<sub>y</sub>
<br/>
f = r<sub>2,2</sub>&middot;f<sub>y</sub> + r<sub>3,2</sub>&middot;c<sub>y</sub>
<br/>
g = r<sub>2,3</sub>&middot;f<sub>y</sub> + r<sub>3,3</sub>&middot;c<sub>y</sub>
<br/>
h = t<sub>y</sub>&middot;f<sub>y</sub> + t<sub>z</sub>&middot;c<sub>y</sub>
<br/>
<br/>
i = r<sub>3,1</sub>
<br/>
j = r<sub>3,2</sub>
<br/>
k = r<sub>3,3</sub>
<br/>
l = t<sub>z</sub>
<br/>
<br/>
KNOWN:
<br/>
K: f<sub>x</sub>, f<sub>y</sub>, s, c<sub>x</sub>, c<sub>y</sub> 
<br/>
X<sub>i</sub>, Y<sub>i</sub>, Z<sub>i</sub> &lrarr; x<sub>i</sub>, y<sub>i</sub>
<br/>
<br/>
UNKNOWN:
<br/>
P: a, b, c, d, e, f, g, h, i, k, l
<br/>
M: r<sub>1,1</sub>, r<sub>1,2</sub>, r<sub>1,3</sub>, r<sub>2,1</sub>, r<sub>2,2</sub>, r<sub>2,3</sub>, r<sub>3,1</sub>, r<sub>3,1</sub>, r<sub>3,2</sub>, r<sub>3,3</sub>, t<sub>x</sub>, t<sub>y</sub>, t<sub>z</sub>
<br/>



<br/>
P = M&middot;K
<br/>
P&middot;K<sup>-1</sup> = M&middot;K&middot;K<sup>-1</sup>
<br/>
P&middot;K<sup>-1</sup> = M
<br/>

<br/>


<br/>
<br/>
<br/>
<br/>
<br/>
<br/>














### ?
![?](./images/?.png "?")
<br/>

**TODO:**

- wavy torus
- priorities for edges need to be minimum of BOTH VERTEXES
- initial triangle is too big
    - generate first triangle - iterate
- vertex predict improve
    - use arc-distance projection
- simulate with real point cloud source
- N-object octree leaves


RESULTS DATA:

cactusPoi = 3.3E3;
cactusTim = [63.6,20.3,9.4];
cactusTri = [21E3,7E3,3E3];
torusPoi = 30E3;
torusTim = [80.8,32.5,22.5];
torusTri = [24E3,8E3,3E3];
igeaPoi = 276E3;
igeaTim = [892,357,100];
igeaTri = [91E3,32E3,11E3];
hold off;
plot(cactusTim,cactusTri,"r-x");
hold on;
plot(torusTim,torusTri,"b-x");
plot(igeaTim,igeaTri,"m-x");




<a name="TEXTURE"></a>

## Texture Stitching / Blending / Synthesis / Mosaics
![Texture Stitching](./images/stitching.png "Texture Stitching")
<br/>
- Global vs Local point registration
- Vertex-Images registrations
    - find projection of each vertex on each of n images (camera image plane)
        - intersects positively - in front of (for cameras INSIDE the scene),
        - intersects positive normal (not interrior of surface)
        - not occluded by (intersects) model
    - primary mapping of vertex is to image with best normal fit (largest dot product)
- Find Transitional-Triangles
    - triangles in which all vertexes map to the same image/perspective don't need to be blended
    - triangles where 2 or 3 vertexes map to seperate images must be blended
- Local Vertex-Image 
    - use ssd/conv to find best homography/projection between various images which vertex project to
    - coarse-to-fine pyramid 32/16/8/.. correlation matching
- Blending
    - use barycentric coords to blend in/out between textures
        - color(point) = &alpha;v<sub>A</sub> + &beta;v<sub>B</sub> + &gamma;v<sub>C</sub>
        - &alpha; + &beta; + &gamma; = 1
    - use highest resolution for texture?
    - image planes closer to face (higher resolution) should be preferred
        -> somehow related to final projected pixel size: distorted res. vs low res.
        -> effective pixel size
- Texture (Rectangle) Packing
    - what resolution to map to?
    - use blocks of source image where possible
    - account for distortion in perspective
<br/>
<br/>
Feathering - Transparancy Fading between images
<br/>
<br/>
<br/>











---
<a name="REFERENCE"></a>
## References
<br/>
[Hausdorf Distance - Gregoire, Bouillot](http://cgm.cs.mcgill.ca/~godfried/teaching/cg-projects/98/normand/main.html)
<br/>
[Osculating Sphere of a Curve - Wolfram Alpha](http://mathworld.wolfram.com/OsculatingSphere.html)
<br/>
[Curvature - Patrikalakis, Maekawa, Cho](http://web.mit.edu/hyperbook/Patrikalakis-Maekawa-Cho/)
<br/>
[Curvature - Adrian Secord](http://cs.nyu.edu/~ajsecord/shells_course/html/shells_course.html)
<br/>
[Curvature - Math Wiki](http://mathwiki.ucdavis.edu/Calculus/Vector_Calculus/Vector-Valued_Functions_and_Motion_in_Space/Curvature_and_Normal_Vectors_of_a_Curve)
<br/>
[Curvature - Simon Willerton](http://golem.ph.utexas.edu/category/2010/03/intrinsic_volumes_for_riemanni.html)
<br/>
[The Second Fundamental Form - Outline](http://math.bard.edu/belk/math352/Outline%20-%20Second%20Fundamental%20Form.pdf)
<br/>
[Simple 3D Surface Curvature - Kurita, Boulanger](Computation of Surface Curvature from Range Images Using Geometrically Intrinsic Weights)
<br/>
[Weighted Least Squares](www.nealen.net/projects/mls/asapmls.pdf)
<br/>
[Random Points on a Sphere](http://mathworld.wolfram.com/SpherePointPicking.html)
<br/>
[Sample Point Files](http://users.cms.caltech.edu/~cs175/cs175-03/homework)
<br/>
[Fast Tri-Tri Intersection - Tomas Moller](fileadmin.cs.lth.se/cs/Personal/Tomas_Akenine-Moller/pubs/tritri.pdf)
<br/>
[Acquiring, Stitching and Blending ... - Rocchini, Cignoni, Montani, Scopigno](www.cs.hunter.cuny.edu/~ioannis/3DP_S09/rocchini.stitch.pdf)
<br/>
[Multiple View Geometry in Computer Vision - 2002 - Richard Hartly + Andrew Zisserman](?)
<br/>
[Conic Sections Beyond Reals^2- Mzuri S. Handlin](http://www.whitman.edu/mathematics/SeniorProjectArchive/2013/Handlin.pdf)
<br/>
[Review of the Geometry of Screw Axes - Nasser M. Abbasi - 2006](http://12000.org/my_notes/screw_axis/index.pdf)
<br/>
[Numerical Recipes in C - Press, Teukolsky, Vetterling, Flannery - 1992](http://apps.nrbook.com/c/index.html)


