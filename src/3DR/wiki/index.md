# Notes
**For now this will just be a place for random notes**

7. [Surface Reconstruction](#SURFACE)



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
&kappa;<sub>1</sub> = ?
<br/>
&kappa;<sub>2</sub> = ?
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
**MSL Projection**:  projects point r in &reals;<sup>3</sup> to surface: r' = P(r)
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

- initial seed triangle:
    - random point of cloud
    - projected point to MLS surface
    - find edge size appropriate for region (lookup L(x,y,z)?)
    - decide triangle edge length: force equalateral
    - inductively find best initial size:
        - query curvature and bracket and interval bisection to find best initial size
        - best triangle is one where query length = length (fixed point of f)

- 


- add new vertex
    - Vertex-Prediction: vertex position is first estimated via prediction operator... ?
        - consider current edge length and maximum curvature in triangle neighborhood
    - vertex projected to MLS surface
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


**Front**: souble linked list (traversal) plus priority queue (best edge [(ideal length)/(actual length) closest to 1])

deferred edge: second priority - because edge will introduce a bad triangle

boundary: anisotropy (using best fit local plane) maximum angle between local points and reference point if above a threshold (150&deg;)

firstFront()

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
-?

**MLSProject(point)**
-project point onto MLS Surface?

**Triangulate(field)**
- ?
 
fronts = FirstFront()
while(frontSet.length>0){
    current = fronts.first()
    // close front with only 3 vertexes - what about initial front?
    if(current.vertexCount()==3){
        current.closeFront()
        fronts.removeFront(current)
        continue
    }
    // ?
    e = current.bestEdge()
    if(e.canCutEar()){
        e.cutEar()
        continue
    }
    // 
    p = vertexPredict(edge,field)
    if( !triangleTooClose(e,p) ){ // 
        e.growTriangle() // ?
    }else{ // 
        front = closestFront(e,p)
        if(front==current){ // same front?
            front = fronts.split(current-front) // separate front from current
            fronts.addFront( front ) // add as new front
        }else{ // different fronts
            front = merge(current,front) // combine
            fronts.removeFront(front) // remove second copy from list
        }
    }
}

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
As the three points that define any circle on a curve get closer to eachother (on the curve [arc length]) the circle approaches the oscilating circle 
<br />
**Change in Position Vector dR**: (infitesimal arc) &approx; [r(x+&Delta;x,f(x+&Delta;x)) - r(x-&Delta;x,f(x-&Delta;x))]/[2&Delta;x]
<br/>
**Unit Tangent Vector T**: dR/||dR||  (unit version of dR)
<br/>
**Curvature-Normal Vector &Kappa;** = ||dT/ds|| = ||T'(s)|| &approx; [T(x+&Delta;x) - T(x-&Delta;x)]/[2&Delta;x] (~second vector derivative)
<br/>
**Unit Normal VectorN**: &Kappa;/||&Kappa;|| (always on side of osculating circle), *similar* Normal vector can be chosen using dR to be orthogonal to T - consistent 'side' of curve/path
<br/>
**Binormal Vector B**: T &times; N (something to do with torsion - not useful in 2D?)
<br/>
**Curvature &kappa**: = ||&Kappa;||
<br/>
**Radius of Curvature**: 1/&Kappa; (radius of osculating sphere)
<br/>
**Arc Length s**: &int; |dR| dt
<br/>
curvature of line = 0; curvature of circle = 1/R
<br/>
Change in normal along a CURVE: dN = -&kappa;T + &tau;B
&kappa;<sub>n</sub>(X) = dot( -df(X), dN(X) ) / |df(x)|<sup>2</sup>
B = T &cross; N
dT = &kappa;N
dN = -&kappa;T + &tau;B
dB = -&tau;B
(tangent-, principal normal-, binormal)-indicatrix


#### 3D Scalar Field Observances:
**f(x,y,z)**: Scalar Field
<br/>
**&nabla;f = df/ds (Grad)**: Gradient (direction of maximum increase) is a normal vector to a surface of constant value
<br/>
&lt; &part;f/&part;x, &part;f/&part;y, &part;f/&part;z &gt;
<br/>
&lt; [f(x+&Delta;x,y,z) - f(x-&Delta;x,y,z)]/[2&Delta;x] , [f(x,y+&Delta;y,z) - f(x,y-&Delta;y,z)]/[2&Delta;y] , [f(x,y,z+&Delta;z) - f(x,y,z-&Delta;z)]/[2&Delta;z] &gt;
<br/>
**3D Unit Normal Vector N**: Grad/||Grad||
<br/>
**3D Curvature (C for now)**: dN/dS because the Normal is a vector, this is a vector of vectors:
<br/>
C<sub>x</sub> = &lt; (&part;N/&part;x)<sub>x</sub>, (&part;N/&part;x)<sub>y</sub>, (&part;N/&part;x)<sub>z</sub> &gt;
<br/>
C<sub>y</sub> = &lt; (&part;N/&part;y)<sub>x</sub>, (&part;N/&part;y)<sub>y</sub>, (&part;N/&part;y)<sub>z</sub> &gt;
<br/>
C<sub>z</sub> = &lt; (&part;N/&part;z)<sub>x</sub>, (&part;N/&part;z)<sub>y</sub>, (&part;N/&part;z)<sub>z</sub> &gt;
<br/>
Should this be projected to the tangent plane?
<br/>
<br/>

<br/>
**Tangent Plane**: cotains point: p=&lt;p<sub>x</sub>,p<sub>y</sub>,p<sub>z</sub>&gt; with normal: N=&lt;N<sub>x</sub>,N<sub>y</sub>,N<sub>z</sub>&gt; &rarr; N<sub>x</sub>(x-p<sub>x</sub>) + N<sub>y</sub>(y-p<sub>y</sub>) + N<sub>z</sub>(z-p<sub>z</sub>) = 0
<br/>
<br/>
**Principal Curvatures &kappa;1 and &kappa;2**: Each direction on a surface has a maximum and minimum curvature the direction of each is called the principal tangent direction (locally the surface is a plane [2 primary directions] and each direction has its own curvature) (which is max and which is min depends on who you ask)
<br/>
**Gauss Curvature &Kappa;(x)**: &kappa;1&middot;&kappa;2
**Mean Curvature H(x)**: (&kappa;1 and &kappa;2)/2
<br/>
<br/>
**First Fundamental Form (I)**: ?
<br/>
**Second Fundamental Form (II)**: ?
<br/>
**K** = detII/detI = (LN - MM)/(EG - FF)
<br/>
Simplification for surface F(x,y,z) = 0
<br/>
http://en.wikipedia.org/wiki/Gaussian_curvature
<br/>
<br/>
<br/>
<br/>




Surfaces:



&kappa; = |r' &times; r''|/|r'<sup>3</sup>|




Curves:
B = T&times;N
%tau; = -N*B'
&kappa; = |r' &times; r''|/|r'<sup>3</sup>|


&lt; &part;T/&part;x, &part;T/&part;y, &part;T/&part;z &gt;

X: &lt; &part;<sup>2</sup>f/&part;x&part;y, &part;<sup>2</sup>f/&part;x&part;y, &part;<sup>2</sup>f/&part;x&part;z &gt;

<br/>
<br/>
 Two ways of defining a surface: Level sets - in which case the gradient points in the normal. Position Vector - in which case the derivative is an arc-length, tangent to the surface.
<br/>

<br/>
**S = S(x,y,z=f(x,y))**: Surface topologially equivalent to a plane (explicitly defined)
<br/>
**P = (P<sub>x</sub>,P<sub>y</sub>,P<sub>y</sub>)**: Point on the surface in 3D Space
<br/>
**n = (n<sub>x</sub>,n<sub>y</sub>n<sub>z</sub>)**: Unit Normal vector = r<sub>u</sub>&times;r<sub>v</sub>/|r<sub>u</sub>&times;r<sub>v</sub>|
<br/>
<br/>
**r(t) = r(u(t),v(t)) = **: Parametric Curve on r(u,v)
<br/>
<br/>
**r = r(x,y,z)**: Position Vector / Parametric Surface defining S in terms of u and v, r(u,v)
<br/>
**r' = r<sub>u</sub>u' + r<sub>v</sub>v'**: Tangent vector of surface at P, u' and v' are the magnitudes in the directions of the unit directions r<sub>u</sub> and r<sub>v</sub>
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
<br/>
**k = &lt;k<sub>1</sub>,k<sub>2</sub>,k<sub>3</sub>&gt; = k<sub>n</sub>+k<sub>g</sub>**: curvature vector of some curve on surface
<br/>
**&kappa;<sub>n</sub>**: normal curvature of some curve on surface 
<br/>
**&kappa;<sub>g</sub>**: geodesic curvature of some curve on surface
<br/> 
**k<sub>n</sub> = &lt;k<sub>n1</sub>,k<sub>n2</sub>,k<sub>n3</sub>&gt;**: normal curvature vector of some curve on surface (in [+/-] direction of surface normal)
<br/> 
**k<sub>g</sub> = &lt;k<sub>g1</sub>,k<sub>g2</sub>,k<sub>g3</sub>&gt;**: geodesic curvature vector of some curve on surface (in tangent direction of surface)
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
*Second Fundamental Form (SFF) coefficients (II)* II = dr &middot;n = L*du*<sup>2</sup> + 2M*du*dv + N*dv*<sup>2</sup> (arc length change in direction of normal curve)
<br/>
**L**: r<sub>uu</sub> &middot; n
<br/>
**M**: r<sub>uv</sub> &middot; n
<br/>
**N**: r<sub>vv</sub> &middot; n
<br/>
<br/>
**@ (II) = 0**:du = dv&middot;(-M&plusmn;sqrt(M<sup>2</sup>-LN))/L
<br/>
**&lambda; = dv/du = direction of normal curve**: Extrema @ d&kappa;<sub>i</sub>/d&lambda; = 0 = (E+2F&lambda;+G&lambda;)(N&lambda;+M) - (L+2M&lambda;+N&lambda;<sup>2</sup>)(G&lambda;+F) = 0
<br/>
&rarr; (EG-F<sup>2</sup>)&kappa;<sub>i</sub><sup>2</sup> - (EN+GL-2FM)&kappa;<sub>i</sub> + (LN-M<sup>2</sup>) = 0
<br/>
<br/>
**K (gaussian curvature)**: &kappa;<sub>min</sub>&kappa;<sub>max</sub> = (LN-M<sup>2</sup>) / (EG-F<sup>2</sup>)
<br/>
**H (mean curvature)**: (&kappa;<sub>min</sub>+&kappa;<sub>max</sub>)/2 = (EN+GL-2FM) / 2(EG-F<sup>2</sup>)
<br/>
**&kappa;<sub>n</sub> (a curvature)**: &kappa;<sub>n</sub> = II/I : &kappa;<sub>n</sub><sup>2</sup> - 2H&kappa;<sub>n</sub> + K = 0
<br/>
**&kappa;<sub>min</sub> (min curvature)**: H - (H<sup>2</sup> - K)<sup>1/2</sup>
<br/>
**&kappa;<sub>max</sub> (max curvature)**: H + (H<sup>2</sup> - K)<sup>1/2</sup>
<br/>
<br/>
<br/>
<br/>
which directions are the principal (and minimal) directions?
```
Solve for eigenvalues/vectors of: ?
X1 = (a,b,c), X2 = (d,e,f) => some orthonormal basis for the tangent space
[ II(X1,X1) II(X1,X2) ]
[ II(X2,X1) II(X2,X2) ]
OR PERHAPS THE CORRECT DET=0 is:
[ L-kE M-kF ]
[ M-kF N-kG ]
```
<br/>
<br/>
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
<br/>
<br/>
<br/>

REJECTIONS:
X<sub>u</sub> = f(&part;a/&part;u, &part;b/&part;u, &part;c/&part;u)
<br/>
X<sub>v</sub> = f(&part;a/&part;v, &part;b/&part;v, &part;c/&part;v)
<br/>
X<sub>uv</sub> = f(&part;<sup>2</sup>a/&part;u&part;v, &part;<sup>2</sup>b/&part;u&part;v, &part;<sup>2</sup>c/&part;u&part;v)
**u**: independent set of &reals;
<br/>
**v**: independent set of &reals;
<br/>
**X**: is the surface, set of points (x,y,z), defined by a function over space in terms of u and v
<br/>
**X = (x,y,z)**: f(f<sub>1</sub>(u,v), f<sub>2</sub>(u,v), f<sub>3</sub>(u,v) )
<br/>
**X<sub>u</sub> and X<sub>v</sub>**: Orthogonal Tangent vectors on the surface @ P - 
<br/>

<br/>
**X<sub>u</sub> = f(&part;x/&part;u, &part;y/&part;u, &part;z/&part;u)**: f(&part;x/&part;x, &part;y/&part;x, &part;z/&part;x)
<br/>
**X<sub>v</sub> = f(&part;x/&part;v, &part;y/&part;v, &part;z/&part;v)**: f(&part;x/&part;y, &part;y/&part;y, &part;z/&part;y)
<br/>
**X<sub>uv</sub> = f(&part;<sup>2</sup>x/&part;u&part;v, &part;<sup>2</sup>y/&part;u&part;v, &part;<sup>2</sup>z/&part;u&part;v)**: f(&part;<sup>2</sup>x/&part;x&part;y, &part;<sup>2</sup>y/&part;x&part;y, &part;<sup>2</sup>z/&part;x&part;y)
<br/>
*In a numeric grid*: &part;x/&part;x=1, &part;x/&part;y=0, &part;y/&part;x=0, &part;y/&part;y=1, &part;<sup>2</sup>(x or y)/&part;(x or y)&part;(x or y) = 0
<br/>








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
*cov(a,b) = &Sum;<sub>i</sub> (a-&mu;<sub>a</sub>)(b-&mu;<sub>b</sub>)*
<br/>
*&mu;<sub>a</sub> = (1/N)&Sum;<sub>i</sub> a*
<br/>
*N = number of elements*
<br/>
*i = i<sup>th</sup> element*
<br/>
*x,y,z are coordinates of P<sub>i<sub>*
<br/>
**Point in plane?**: center of mass of points?
<br/>
function should be weighted based on point distance to origin point of plane (projected point)
&Sum;<sub>i</sub> (n&middot;p<sub>i</sub> - d)<sup>2</sup> &middot; function(&prop;1/||p<sub>i</sub>-o||)
<br/>
****: ?
<br/>
Solve Ax = b &rarr; x = pinv(A)b ?
<br/>
Solve SVD ?
<br/>
smallest eigenvector = normal to surface (direction in which the data varies the least)
<br/>
<br/>
<br/>
Locally, the surface must be defined by some bivariate polynomial - ie z = f(x,y) (in terms of the local coordinate system).
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


**Minimization via Powell Iteration**
<br/>
OMG another iteration method
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
- MLS
    x determing MLS surface for any point
    x display MLS as sampled points on surface
    - weighted?
	- 'snapping' to closest sample point?
    - neighborhood?
- how to get kappa - curvature of the MLS surface
	- maximum absolute curvature?
- container class for point cloud
- how to 'query' field
- how to generate first triangle


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

(Felix Hausdorff)[Felix Hausdorff]
(Hausdorf Distance)[http://cgm.cs.mcgill.ca/~godfried/teaching/cg-projects/98/normand/main.html]
(osculating sphere)[http://mathworld.wolfram.com/OsculatingSphere.html]
(Curvature - Surface Analysis, Fundamental Forms, etc)[http://web.mit.edu/hyperbook/Patrikalakis-Maekawa-Cho/]
(Curvature)[http://mathwiki.ucdavis.edu/Calculus/Vector_Calculus/Vector-Valued_Functions_and_Motion_in_Space/Curvature_and_Normal_Vectors_of_a_Curve]
(3D Curvature)[http://golem.ph.utexas.edu/category/2010/03/intrinsic_volumes_for_riemanni.html]
(Random Points on a Sphere)[http://mathworld.wolfram.com/SpherePointPicking.html]