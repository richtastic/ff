# How To Voronoi
![Voronoi Diagram](./images/voronoi.png "Voronoi Diagram")
<br/>

## Listings
1. [Parabolas](#PARABOLAS)
2. [Intersections](#INTERSECTIONS)
3. [Voronoi](#VORONOI)
4. [Fortune &AElig;lgorithm](#FORTUNE)
5. [Data Structure Speedup](#OPTIMUM)
6. [Delaunay](#DELAUNAY)
7. [References](#REFERENCES)

<a name="PARABOLAS"></a>
## Parabolas
![Parabola Diagram](./images/parabola_definition.png "Parabola Diagram")
<br/>

### Definitions

A Parabola is the locus (set) of points equal distance from a point and a line

**Directrix**: Reference Line - This can be in any direction, but is taken as a horizontal line **y = constant** (directrix.y)
<br/>
**Focus**: Reference Point - a point anywhere in the 2D plane (focus.x,focus.y)
<br/>
**Vertex**: Basically derived as the midpoint between the focus point and directrix line (focus.x,[focus.y+directrix.y]/2)
<br/>


[2nd order parabolas are the locus of points equidistant from a point and a parabol, called a *pedal curve*]


**Distance between the focus point and a locus point:**
<br/>
sqrt( (locus.x-focus.x)<sup>2</sup> + (locus.y-focus.y)<sup>2</sup> )
<br/>


**Distance between the directrix line and a locus point:**
<br/>
sqrt( (locus.y-directrix.y)<sup>2</sup> )
<br/>


**Setting the locus point equidistant from the focus point and directrix line:**
<br/>
*locus = (x,y), focus = (a,b), directrix = (*,c)*
<br/>
sqrt( (x-a)<sup>2</sup> + (y-b)<sup>2</sup>  ) = sqrt( (y-c)<sup>2</sup> )
<br/>
(x-a)<sup>2</sup> + (y-b)<sup>2</sup> = (y-c)<sup>2</sup>
(x-a)<sup>2</sup> + (y-b)(y-b) = (y-c)<sup>2</sup>
<br/>
(x-a)<sup>2</sup> + y<sup>2</sup> + b<sup>2</sup> - 2by = (y-c)<sup>2</sup>
<br/>
(x-a)<sup>2</sup> + y<sup>2</sup> + b<sup>2</sup> - 2by = (y-c)(y-c)
<br/>
(x-a)<sup>2</sup> + y<sup>2</sup> + b<sup>2</sup> - 2by = y<sup>2</sup> + c<sup>2</sup> - 2cy
<br/>
(x-a)<sup>2</sup> + b<sup>2</sup> - 2by = c<sup>2</sup> - 2cy
<br/>
(x-a)<sup>2</sup> + b<sup>2</sup> - c<sup>2</sup> - 2by = -2cy
<br/>
(x-a)<sup>2</sup> + b<sup>2</sup> - c<sup>2</sup> - 2by = -2cy
<br/>
(x-a)<sup>2</sup> + b<sup>2</sup> - c<sup>2</sup> = 2by - 2cy
<br/>
(x-a)<sup>2</sup> + b<sup>2</sup> - c<sup>2</sup> = 2y(b-c)
<br/>
[(x-a)<sup>2</sup> + b<sup>2</sup> - c<sup>2</sup>] / [2(b-c)] = y
<br/>
y = [(x-a)<sup>2</sup> + b<sup>2</sup> - c<sup>2</sup>] / [2(b-c)]
<br/>


**Simplifed to:**
<br/>
*=>  e = 2(b-c)*
<br/>
y = [(x-a)<sup>2</sup> + b<sup>2</sup> - c<sup>2</sup>] / [2(b-c)]
<br/>
y = [(x-a)<sup>2</sup> + b<sup>2</sup> - c<sup>2</sup>] / e
<br/>
y = [x<sup>2</sup> + a<sup>2</sup> - 2ax + b<sup>2</sup> - c<sup>2</sup>] /e
<br/>
y = [x<sup>2</sup> - 2ax + a<sup>2</sup> + b<sup>2</sup> - c<sup>2</sup>] /e
<br/>
y = x<sup>2</sup>/e - 2ax/e + (a<sup>2</sup> + b<sup>2</sup> - c<sup>2</sup>)/e
<br/>
*=>  A = 1/e, B = -2a/e, C = (a<sup>2</sup> + b<sup>2</sup> - c<sup>2</sup>)/e*
<br/>
y = Ax<sup>2</sup> + Bx + C
<br/>



*'Standard Form' of a parabola is given as:* **(x-h)<sup>2</sup> = 4p(y-k)**
<br/>
**Directrix** = y = k-p
<br/>
**Focus** = (h,k+p)
<br/>
**Vertex** = (h,k)
<br/>


**Turning this into a normal 2nd order polynomial equation yields:**
<br/>
(x-h)<sup>2</sup> = 4p(y-k)
<br/>
x<sup>2</sup> + h<sup>2</sup> - 2hx = 4py - 4pk
<br/>
x<sup>2</sup> + h<sup>2</sup> - 2hx + 4pk = 4py
(1/(4p))x<sup>2</sup>  ((-h)/(2p))x + (4pk+h<sup>2</sup>)/(4p) = y
<br/>
**a**: 1/(4p), **b**: -h/(2p), **c**: (4pk+h<sup>2</sup>)/(4p)
<br/>


**Also, Noting that the derivative of y = ax<sup>2</sup> + bx + c  =>  y' = 2ax + b**
<br/>
The vertex is the maxima/minima of y, which is at the zero crossing of y' : 0 = 2ax + b
<br/>
x = -b/(2a) is the x coordinate of the vertex.
<br/>
**The Focus+Directrix pair can then simply be derived from the normal equation:**
<br/>
h = -b/(2a)
<br/>
k = ah<sup>2</sup> + bh + c
<br/>
p = 1/(4a)
<br/>



### Conic Relation
![Parabola Conic Diagram](./images/parabola_conic.png "Parabola Conic Diagram")
<br/>
*The General equation of a conic is:*
<br />
Ax<sup>2</sup> + Bxy + Cyx<sup>2</sup> + Dx + Ey + F = 0


*A parabola is then a simplification:*
<br />
Ax<sup>2</sup> + Dx + Ey + F = 0
<br />
y = -(A/E)x<sup>2</sup> - (D/E)x - (F/E)
<br />
y = ax<sup>2</sup> + bx + c

**A parabola is the intersection of a plane parallel to the edge of a cone**


**Eccentricity**: measure of how non-circular a conic is *(0=circle, (0,1)=ellipse, 1=parabola, (1,inf)=hyperbola, inf=non-circular)*
<br/>
eccentricity = e := sqrt( [2sqrt((A-C)<sup>2</sup>+B<sup>2</sup>)]/[(A+C) + sqrt((A-C)<sup>2</sup>+B<sup>2</sup>)] )
<br />
@ B=0, C=0
<br />
e = sqrt( [2sqrt((A-0)<sup>2</sup>+0<sup>2</sup>)]/[(A+0) + sqrt((A-0)<sup>2</sup>+0<sup>2</sup>)] )
<br />
e = sqrt( [2sqrt(A<sup>2</sup>)]/[A + sqrt(A<sup>2</sup>)] )
<br/>
e = sqrt( [2A]/[A + A] )
<br/>
e = sqrt( 2A/2A )
<br/>
e = sqrt( 1 )
<br/>
e = 1



<a name="INTERSECTIONS"></a>
## Intersections
*Because curves are only interesting when they interact with other curves*

### Solving for Zero
**Finding the solutions of two simple examples, allows for plug-and-chug later on**
<br/>

*Solving the linear equation: **Bx + C = 0**:*
<br/>
Bx + C = 0
<br/>
Bx = -C
<br/>
x = -C/B
<br/>
*Linear Solution:* **-C/B**
<br/>

*Solving the non-linear (quadratic) equation: **Ax<sup>2</sup> + Bx + C = 0**:*
<br/>
Ax<sup>2</sup> + Bx + C = 0
<br/>
Ax<sup>2</sup> + Bx = -C
<br/>
A<sup>2</sup>x<sup>2</sup> + ABx = -AC
<br/>
A<sup>2</sup>x<sup>2</sup> + ABx + B<sup>2</sup> = B<sup>2</sup> - AC
<br/>
4A<sup>2</sup>x<sup>2</sup> + 4ABx + 4B<sup>2</sup> = 4B<sup>2</sup> - 4AC
<br/>
(2Ax + B)*(2Ax + B) = B<sup>2</sup> - 4AC
<br/>
(2Ax + B)<sup>2</sup> = B<sup>2</sup> - 4AC
<br/>
2Ax + B = [+/-]sqrt(B<sup>2</sup> - 4AC)
<br/>
2Ax = -B [+/-]sqrt(B<sup>2</sup> - 4AC)
<br/>
x = [-B [+/-]sqrt(B<sup>2</sup> - 4AC)]/[2A]
<br/>
*=> Quadratic Equation:* **[-B +/- sqrt(B<sup>2</sup> - 4AC) ] / [2A]**


### Parabola-Line Intersections:
![Parabola Line Diagram](./images/parabola_line.png "Parabola Line Diagram")
<br/>

**Lines have multiple representations:**
<br/>
*two points*: A, B
<br/>
*slope and intercept*: y = mx + b
<br/>
*ray*: origin, direction
<br/>

Ray's are particularly useful representations, because they simplify calculations (remove repeated CPU operations), often we are only interested in the slope for various calculations/comparisons, and they are immediately useable for vector math.

**A line defined as two points can be converted to slope-intercept form:**
<br/>
m = (B.y-A.y)/(B.x-A.x)
<br/>
A.y = m&middot;A.x + b
<br/>
b = A.y - m&middot;A.x
<br/>

**A line defined as a ray can be converted to slope-intercept form:**
<br/>
m = direction.y/direction.x
<br/>
origin.y = m&middot;origin.x + b
<br/>
b = origin.y - m&middot;origin.x 
<br/>



**Parabola-Line Intersection: Set locations equal, solve for (x,y):**
<br/>
**PARABOLA**: y = Ax<sup>2</sup> + Bx + C
<br/>
**LINE**: y = mx + b
<br/>
Ax<sup>2</sup> + Bx + C = mx + b
<br/>
Ax<sup>2</sup> + Bx + mx + C = b
<br/>
Ax<sup>2</sup> + Bx + mx + C - b = 0
<br/>
Ax<sup>2</sup> + (B+m)x + (C-b) = 0
<br/>
Ax<sup>2</sup> + B'x + C' = 0
<br/>


**KEY NOTES:**
- if line is vertical (direction.x=0, A.x-B.x=0, m=inf) &rarr; single solution at y = f(A.x)
- if A equals 0 &rarr; single tangent point intersection: Bx + C = 0, solve linear equation
- if sqrt interrior (discriminant) equals 0 &rarr; single intersection at origin (also tangent)
- if sqrt interrior (discriminant) less-than zero &rarr; imaginary solutions, no intersection
- else &rarr; 2 unique solutions, solve quadratic equation


*If the parabola is infinitely thin (focus.y=directrix.y) it is a vertical line &rarr; intersection(s) possibly exists at (focus.x,---)*


### Parabola-Parabola Intersections:
![Parabola Parabola Diagram](./images/parabola_parabola.png "Parabola Parabola Diagram")
<br/>

**Set locations equal, solve for (x,y)**
<br/>
**PARABOLA 1**: y = ax<sup>2</sup> + bx + c
<br/>
**PARABOLA 2**: y = Ax<sup>2</sup> + Bx + C
<br/>
ax<sup>2</sup> + bx + c = Ax<sup>2</sup> + Bx + C
<br/>
ax<sup>2</sup> + bx + c - Ax<sup>2</sup> - Bx - C = 0
<br/>
(a-A)x<sup>2</sup> + (b-B)x + (c-C)= 0
<br/>
A'x<sup>2</sup> + B'x + C' = 0
<br/>


**KEY NOTES:**
<br/>
- if two of (A,B,C) are zero and one is non-zero (A=0,B=0,C=#) &rarr; equation is inconsistent, no solution (equal parabola above other parabola)
- if all of (A,B,C) are zero &rarr; parabolas are identical, infinite solutions
- if A equals 0 &rarr; parabolas are identical up to shift, single point intersection: Bx + C = 0, solve linear equation
- if sqrt interrior (discriminant) equals 0 &rarr; single intersection, repeated ('thinner' parabola above other parabola)
- if sqrt interrior (discriminant) less-than zero &rarr; imaginary solutions, no intersection
- else &rarr; 2 unique solutions, solve quadratic equation


*If A parabola is infinitely thin (focus.y=directrix.y) it is a vertical line &rarr; intersection(s) possibly exists at (focus.x,---)*


### Ray-Ray (Line) Intersections:
![Line Line Diagram](./images/ray_ray.png "Line Line Diagram")
<br/>
Ray = origin + direction, point along ray: point = origin + (t)direction
<br/>


*Ray 1:* a + (t1)b
<br/>
*Ray 2:* c + (t2)d
<br/>


*Solving For t2:*
<br/>
p.x = a.x + (t1)b.x
<br/>
p.x = c.x + (t2)d.x
<br/>
a.x + (t1)b.x = c.x + (t2)d.x
<br/>
(t1)b.x = c.x - a.x + (t2)d.x
<br/>
t1 = (c.x - a.x + (t2)d.x)/b.x  *[1]*
<br/>



p.y = a.y + (t1)b.y
<br/>
p.y = c.y + (t2)d.y
<br/>
a.y + (t1)b.y = c.y + (t2)d.y
<br/>
(t1)b.y = c.y - a.y + (t2)d.y
<br/>
t1 = (c.y - a.y + (t2)d.y)/b.y  *[2]*
<br/>


*[1]* = *[2]*
<br/>
(c.x - a.x + (t2)d.x)/b.x = (c.y - a.y + (t2)d.y)/b.y
<br/>
b.y(c.x - a.x + (t2)d.x) = b.x(c.y - a.y + (t2)d.y)
<br/>
b.y*c.x - b.y*a.x + t2*b.y*d.x = b.x*c.y - b.x*a.y + t2*b.x*d.y
<br/>
t2*b.y*d.x = b.x*c.y - b.x*a.y - b.y*c.x + b.y*a.x + t2*b.x*d.y
<br/>
t2*b.y*d.x - t2*b.x*d.y = b.x*c.y - b.x*a.y - b.y*c.x + b.y*a.x
<br/>
t2(b.y*d.x - b.x*d.y) = b.x*c.y - b.x*a.y - b.y*c.x + b.y*a.x
<br/>
t2 = (b.x*c.y - b.x*a.y - b.y*c.x + b.y*a.x)/(b.y*d.x - b.x*d.y)
<br/>
t2 = [b.x(c.y - a.y) + b.y(a.x - c.x)]/[b.y*d.x - b.x*d.y]
<br/>


*Solving For t1:*
<br/>
a.x + (t1)b.x = c.x + (t2)d.x
<br/>
a.x - c.x + (t1)b.x = (t2)d.x
<br/>
(a.x - c.x + (t1)b.x)/d.x = t2  *[3]*
<br/>



<br/>
a.y + (t1)b.y = c.y + (t2)d.y
<br/>
a.y - c.y + (t1)b.y = (t2)d.y
<br/>
(a.y - c.y + (t1)b.y)/d.y = t2  *[4]*
<br/>



*[3]* = *[4]*
<br/>
(a.x - c.x + (t1)b.x)/d.x = (a.y - c.y + (t1)b.y)/d.y
<br/>
d.y*(a.x - c.x + (t1)b.x) = d.x*(a.y - c.y + (t1)b.y)
<br/>
d.y*a.x - d.y*c.x + t1*d.y*b.x) = d.x*a.y - d.x*c.y + t1*d.x*b.y
<br/>
t1*d.y*b.x) = d.x*a.y - d.x*c.y - d.y*a.x + d.y*c.x + t1*d.x*b.y
<br/>
t1*d.y*b.x - t1*d.x*b.y = d.x*a.y - d.x*c.y - d.y*a.x + d.y*c.x
<br/>
t1(d.y*b.x - d.x*b.y) = d.x*a.y - d.x*c.y - d.y*a.x + d.y*c.x
<br/>
t1 = (d.x*a.y - d.x*c.y - d.y*a.x + d.y*c.x)/(d.y*b.x - d.x*b.y)
<br/>
t1 = [d.x(a.y - c.y) + d.y(c.x - a.x)]/[d.y*b.x - d.x*b.y]
<br/>


Side-By-Side:
<br/>
t1 = [d.x(a.y - c.y) + d.y(c.x - a.x)]/[d.y*b.x - d.x*b.y]
<br/>
t2 = [b.x(c.y - a.y) + b.y(a.x - c.x)]/[b.y*d.x - b.x*d.y]
<br/>


KEY NOTES:
<br/>
If the demonimator equals zero, there are zero or infinite points
<br/>
Otherwise there is an intersection at t1 (Ray 1) and t2 (Ray 2)
<br/>
To limit to only positive intersections (infinite rays), check that t1>=0 and t2>=0
<br/>
To limit to only finite rays, check that 0<=t1<=1 and 0<=t2<=1
<br/>




<a name="VORONOI"></a>
## Voronoi
*Voronoy Diagram*
<br/>
![Voronoi Diagram](./images/parabola_parabola.png "Voronoi Diagram")

A voronoi diagram is a graph that sections off sites (points) into cells, whereby any point in each cell is closer to the cell's site, than any other site.
<br/>
- sites
- equal distances
- cells
<br/>



<a name="FORTUNE"></a>
## Fortune Algorithm
![Fortune 1](./images/fortune_1.png "Fortune 1")
<br/>
- sweep line (directrix)
- wavefront (lsit of arcs)
- graph
  - sites
  - half-edges
  - vertexes
- site event (split)
- circle event (merge)
- converging arcs (1 location at 1 arc, convergence L-C-R focus check)
<br/>


Steps:
- Graph initialized empty
- Queue initialized with n input site events
- While Queue not empty
  - Site Event (split):
    - find arc above new site
    - remove old circle event for site if present (false alarm)
    - add new arc to wavefront
    - graph add: new half-edge
    - check for possible circle events "triplets"
  - Circle Event (merge):
  	- remove all circle from queue events that reference the merging arc
  	- graph add: new vertex, 1 new half-edge
    - collapse referenced arc (remove from wavefront)
    - check for possible circle events "triplets"
- Cleanup Graph
  - Combine coincident vertexes (where multiple events occurred simultaneously)
  - Cap infinite edges (eg via bounding box)
  - Consistently orientate half-edges around site



<a name="OPTIMUM"></a>
## Data Structure Speedup
*Optimum-ness of Fortune Algorithm relies on underlying data structures*
<br/>
![Red Black Trees](./images/red_black_tree.png "Red Black Trees")
<br/>
*Balanced Binary Search Tree - RedBlack*

A regular Binary Search Tree (BST) can become lopsided if interaction with it is less than random.
The Red-Black is a BST that guarantees non-lopsided ness, and has the following time complexities:
- insert: O(lg(n))
- delete: O(lg(n))
- search: O(lg(n))


*List of Operations/Classes/Objects in Fortune Algoritm and Time Complexity O():*
- find arc in wavefront: O(lg(n))
- add arc to wavefront: O(lg(n))
- remove arc from wavefront: O(lg(n))
- remove circle event: O(1)
- add vertex, half-edge, site, to graph: O(1)
- find arc from circle event: O(1)
- check for possible circle events: O(1)

<br/>

Maximum wavefront arcs: 2n-1 (show worst case: vertical sites)
<br/>
Maximum circle events: n (although more do show up as false alarms)
<br/>
Algorithm runtime: O(nlg(n))
<br/>


*Wavefront representations:*
<br/>
set of intersections
<br/>
set of arcs
<br/>

Notes:
- avoid methods that are suspect to numerical error
- book-keeping: keep only most pertinent data, as all references need to be updated, and more references = prone to error


<br/>


<a name="DELAUNAY"></a>
## Delaunay
*Delaunay Diagram / Triangulation*
<br/>
![Delaunay Diagram](./images/parabola_parabola.png "Delaunay Diagram")
<br/>

The delaunay diagram(triangulation) is the 'dual' of the voronoi diagram. It cannot be called not the 'inverse', because T(D(T)) != T





---

<a name="REFERENCES"></a>
## References
<br/>
[Voronoy](http://www.google.com/search?q=voronoy)
<br/>
[Delaunay](http://www.google.com/search?q=Robert+Delaunay)
<br/>
[Fortune's Algorithm](http://www.google.com/search?q=Steven+Fortune+Algorithm)
<br/>
<br/>
[Conic Sections](http://www.mathsisfun.com/geometry/conic-sections.html)
<br/>
<br/>

