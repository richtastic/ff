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



*'Standard Form' of a parabola is given as: **(x-h)<sup>2</sup> = 4p(y-k)***
<br/>
Directrix = y = k-p
<br/>
Focus = (h,k+p)
<br/>
Vertex = (h,k)
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
*a*: 1/(4p), *b*: -h/(2p), *c*: (4pk+h<sup>2</sup>)/(4p)
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

**A parabola is the intersection of a plane parallel to the edge of a cone (eccentricity=1)**

*A parabola is then a simplification:*
<br />
Ax<sup>2</sup> + Dx + Ey + F = 0
<br />
y = -(A/E)x<sup>2</sup> - (D/E)x - (F/E)
<br />
y = ax<sup>2</sup> + bx + c


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
*ray*: origin, direction
<br/>
*two points*: A, B
<br/>
*slope and intercept*: y = mx + b
<br/>

**Line defined as a point can be converted to slope-intercept form:**
<br/>
m = (B.y-A.y)/(B.x-A.x)
<br/>
A.y = m*A.x + b
<br/>
b = A.y - m*A.x
<br/>

**Line defined as a ray can be converted to slope-intercept form:**
<br/>
m = direction.y/direction.x
<br/>
origin.y = m*origin.x + b
<br/>
b = origin.y - m*origin.x 
<br/>


**Set locations equal, sovle for (x,y)**
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
<br/>
if line is vertical (direction.x=0, A.x-B.x=0, m=inf) => single solution at y = f(A.x)
<br/>
if A equals 0 => single tangent point intersection: Bx + C = 0, solve linear equation
<br/>
if sqrt interrior (discriminant) equals 0 => single intersection at origin (also tangent)
<br/>
if sqrt interrior (discriminant) less-than zero => imaginary solutions, no intersection
<br/>
else => 2 unique solutions, solve quadratic equation
<br/>
[If the parabola is infinitely thin (focus.y=directrix.y) => intersection(s) possibly exists at (focus.x,?)]
<br/>


### Parabola-Parabola Intersections:
![Parabola Parabola Diagram](./images/parabola_parabola.png "Parabola Parabola Diagram")
<br/>

**Set locations equal, sovle for (x,y)**
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
if two of (A,B,C) are zero and one is non-zero (A=0,B=0,C=#) => equation is inconsistent, no solution (WHEN DOES THIS HAPPEN)
<br/>
if all of (A,B,C) are zero => parabolas are identical, infinite solutions
<br/>
if A equals 0 => parabolas are identical up to offset, single point intersection: Bx + C = 0, solve linear equation
<br/>
if sqrt interrior (discriminant) equals 0 => single intersection, repeated (WHEN DOES THIS HAPPEN)
<br/>
if sqrt interrior (discriminant) less-than zero => imaginary solutions, no intersection
<br/>
else => 2 unique solutions, solve quadratic equation
<br/>
[If A parabola is infinitely thin (focus.y=directrix.y) => intersection(s) possibly exists at (focus.x,?)]
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


