# Notes
**For now this will just be a place for random notes**

7. [Surface Reconstruction](#SURFACE)
9. [References](#REFERENCE)


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

<br/>

### Algorithm
- input
    - &rho;: solid angle (eg: &pi;/4)
    - &tau;: some additional cmoothing constant (eg: ?)
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
edgeLengthB = fieldMin(edgeLengthA)
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
-?smallest edge length within given sphere
    - query each point in cloud and find max curvature = min r &rarr; L = &rho;&middot;r

**MLSProject(point)**
-project point onto MLS Surface?

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


**Minimization via Powell Iteration**
<br/>
OMG another iteration method
<br/>
<br/>
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
**point in space (&reals;<sup>3</sup>)**: p
<br/>
**plane defined by point and unit normal**: q, n
<br/>
**projection of point p onto plane (result)**: r
<br/>
r is also equal to the intersection of the plane (q,n) with a line p,n (renamed o,d here)
<br/>
**Line to test for intersection**: o + t&middot;d (o=origin, d=direction, t=scale along direction)
<br/>


Solving for t, where o + t&middot;d = r (point of intersection):
<br/>
dot(n, r - q) = 0
<br/>
n.x(r.x - q.x) + n.y(r.y - q.y) + n.z(r.z - q.z) = 0
<br/>
n.x(o.x + t&middot;d.x - q.x) + n.y(o.y + t&middot;d.y - q.y) + n.z(o.z + t&middot;d.z - q.z) = 0
<br/>
n.x&middot;o.x + t&middot;n.x&middot;d.x - n.x&middot;q.x + n.y&middot;o.y + t&middot;n.y&middot;d.y + n.y&middot;o.y + t&middot;n.z&middot;d.z - n.z&middot;q.z = 0
<br/>
t&middot;n.x&middot;d.x + t&middot;n.y&middot;d.y + t&middot;n.z&middot;d.z = n.x&middot;q.x - n.x&middot;o.x + n.y&middot;q.y - n.y&middot;o.y + n.z&middot;q.z - n.z&middot;o.z
<br/>
t(n.x&middot;d.x + n.y&middot;d.y + n.z&middot;d.z) = n.x&middot;q.x - n.x&middot;o.x + n.y&middot;q.y - n.y&middot;o.y + n.z&middot;q.z - n.z&middot;o.z
<br/>
t(n.x&middot;d.x + n.y&middot;d.y + n.z&middot;d.z) = n.x(q.x-o.x) + n.y(q.y-o.y) + n.z(q.z-o.z)
<br/>
t = (n.x(q.x-o.x) + n.y(q.y-o.y) + n.z(q.z-o.z))/(n.x&middot;d.x + n.y&middot;d.y + n.z&middot;d.z)
<br/>
t = dot(n,q.x-o.x)/dot(n,d)
<br/>

**KEY NOTES:**
<br/>
if the denominator equals zero (dot(n,d)) &rarr; the line is in the plane
<br/>
if t equals zero (dot(n,q.x-o.x) equals zero) &rarr; point is already in the plane


<br/>
<br/>
<br/>
<br/>


**TODO:**
- generate first triangle
    x show plane and bivariate visually (triangles)
    - get curvature at surface (sphere should be 1/R)
    - determine edge size at point (field)
- MLS
    - minimization to find plane
    - 'snapping' to closest sample point?
    - neighborhood?
- how to 'query' field
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






---
<a name="REFERENCE"></a>
## References
<br/>
Topic - Author (Source/Title)
<br/>
(Hausdorf Distance - Gregoire, Bouillot)[http://cgm.cs.mcgill.ca/~godfried/teaching/cg-projects/98/normand/main.html]
<br/>
(Osculating Sphere of a Curve - Wolfram Alpha)[http://mathworld.wolfram.com/OsculatingSphere.html]
<br/>
(Curvature - Patrikalakis, Maekawa, Cho)[http://web.mit.edu/hyperbook/Patrikalakis-Maekawa-Cho/]
<br/>
(Curvature - Adrian Secord )[http://cs.nyu.edu/~ajsecord/shells_course/html/shells_course.html]
<br/>
(Curvature - Math Wiki)[http://mathwiki.ucdavis.edu/Calculus/Vector_Calculus/Vector-Valued_Functions_and_Motion_in_Space/Curvature_and_Normal_Vectors_of_a_Curve]
<br/>
(Curvature - Simon Willerton)[http://golem.ph.utexas.edu/category/2010/03/intrinsic_volumes_for_riemanni.html]
<br/>
(Second Fundamental Form - ?)[The Second Fundamental Form - Outline]
<br/>
[Simple 3D Surface Curvature - Kurita, Boulanger](Computation of Surface Curvature from Range Images Using Geometrically Intrinsic Weights)
<br/>
[Weighted Least Squares](www.nealen.net/projects/mls/asapmls.pdf)
<br/>
[Random Points on a Sphere](http://mathworld.wolfram.com/SpherePointPicking.html)
<br/>



