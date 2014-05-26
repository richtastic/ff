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
*&rarr;  e = 2(b-c)*
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
*&rarr;  A = 1/e, B = -2a/e, C = (a<sup>2</sup> + b<sup>2</sup> - c<sup>2</sup>)/e*
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


**Also, Noting that the derivative of y = ax<sup>2</sup> + bx + c  &rarr;  y' = 2ax + b**
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
*&rarr; Quadratic Equation:* **[-B +/- sqrt(B<sup>2</sup> - 4AC) ] / [2A]**


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
- If line is vertical (direction.x=0, A.x-B.x=0, m=inf) &rarr; single solution at y = f(A.x)
- If A equals 0 &rarr; single tangent point intersection: Bx + C = 0, solve linear equation
- If sqrt interrior (discriminant) equals 0 &rarr; single intersection at origin (also tangent)
- If sqrt interrior (discriminant) less-than zero &rarr; imaginary solutions, no intersection
- Else &rarr; 2 unique solutions, solve quadratic equation


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
- If two of (A,B,C) are zero and one is non-zero (A=0,B=0,C=#) &rarr; equation is inconsistent, no solution (equal parabolas, one above other)
- If all of (A,B,C) are zero &rarr; parabolas are identical, infinite solutions
- If A equals 0 &rarr; parabolas are identical up to shift, single point intersection: Bx + C = 0, solve linear equation
- If sqrt interrior (discriminant) equals 0 &rarr; single intersection, repeated ('thinner' parabola above other parabola)
- If sqrt interrior (discriminant) less-than zero &rarr; imaginary solutions, no intersection
- Else &rarr; 2 unique solutions, solve quadratic equation


*If A parabola is infinitely thin (focus.y=directrix.y) it is a vertical line &rarr; intersection(s) possibly exists at (focus.x,---)*


### Ray-Ray (Line) Intersections:
![Line Line Diagram](./images/ray_ray.png "Line Line Diagram")
<br/>
Ray = origin + direction, point along ray: point = origin + t&middot;direction
<br/>


*Ray 1:* a + t1&middot;b
<br/>
*Ray 2:* c + t2&middot;d
<br/>


**Solving For t2:**
<br/>
p.x = a.x + t1&middot;b.x
<br/>
p.x = c.x + t2&middot;d.x
<br/>
a.x + t1&middot;b.x = c.x + t2&middot;d.x
<br/>
t1&middot;b.x = c.x - a.x + t2&middot;d.x
<br/>
t1 = (c.x - a.x + t2&middot;d.x)/b.x  **[1]**
<br/>



p.y = a.y + t1&middot;b.y
<br/>
p.y = c.y + t2&middot;d.y
<br/>
a.y + t1&middot;b.y = c.y + t2&middot;d.y
<br/>
t1&middot;b.y = c.y - a.y + t2&middot;d.y
<br/>
t1 = (c.y - a.y + t2&middot;d.y)/b.y  **[2]**
<br/>


**[1]** = **[2]**
<br/>
(c.x - a.x + t2&middot;d.x)/b.x = (c.y - a.y + t2&middot;d.y)/b.y
<br/>
b.y(c.x - a.x + t2&middot;d.x) = b.x(c.y - a.y + t2&middot;d.y)
<br/>
b.y&middot;c.x - b.y&middot;a.x + t2&middot;b.y&middot;d.x = b.x&middot;c.y - b.x&middot;a.y + t2&middot;b.x&middot;d.y
<br/>
t2&middot;b.y&middot;d.x = b.x&middot;c.y - b.x&middot;a.y - b.y&middot;c.x + b.y&middot;a.x + t2&middot;b.x&middot;d.y
<br/>
t2&middot;b.y&middot;d.x - t2&middot;b.x&middot;d.y = b.x&middot;c.y - b.x&middot;a.y - b.y&middot;c.x + b.y&middot;a.x
<br/>
t2(b.y&middot;d.x - b.x&middot;d.y) = b.x&middot;c.y - b.x&middot;a.y - b.y&middot;c.x + b.y&middot;a.x
<br/>
t2 = (b.x&middot;c.y - b.x&middot;a.y - b.y&middot;c.x + b.y&middot;a.x)/(b.y&middot;d.x - b.x&middot;d.y)
<br/>
t2 = [b.x(c.y - a.y) + b.y(a.x - c.x)]/[b.y&middot;d.x - b.x&middot;d.y]
<br/>


**Solving For t1:**
<br/>
a.x + t1&middot;b.x = c.x + t2&middot;d.x
<br/>
a.x - c.x + t1&middot;b.x = t2&middot;d.x
<br/>
(a.x - c.x + t1&middot;b.x)/d.x = t2  **[3]**
<br/>



a.y + t1&middot;b.y = c.y + t2&middot;d.y
<br/>
a.y - c.y + t1&middot;b.y = t2&middot;d.y
<br/>
(a.y - c.y + t1&middot;b.y)/d.y = t2  **[4]**
<br/>



**[3]** = **[4]**
<br/>
(a.x - c.x + t1&middot;b.x)/d.x = (a.y - c.y + t1&middot;b.y)/d.y
<br/>
d.y&middot;(a.x - c.x + t1&middot;b.x) = d.x&middot;(a.y - c.y + t1&middot;b.y)
<br/>
d.y&middot;a.x - d.y&middot;c.x + t1&middot;d.y&middot;b.x) = d.x&middot;a.y - d.x&middot;c.y + t1&middot;d.x&middot;b.y
<br/>
t1&middot;d.y&middot;b.x) = d.x&middot;a.y - d.x&middot;c.y - d.y&middot;a.x + d.y&middot;c.x + t1&middot;d.x&middot;b.y
<br/>
t1&middot;d.y&middot;b.x - t1&middot;d.x&middot;b.y = d.x&middot;a.y - d.x&middot;c.y - d.y&middot;a.x + d.y&middot;c.x
<br/>
t1(d.y&middot;b.x - d.x&middot;b.y) = d.x&middot;a.y - d.x&middot;c.y - d.y&middot;a.x + d.y&middot;c.x
<br/>
t1 = (d.x&middot;a.y - d.x&middot;c.y - d.y&middot;a.x + d.y&middot;c.x)/(d.y&middot;b.x - d.x&middot;b.y)
<br/>
t1 = [d.x(a.y - c.y) + d.y(c.x - a.x)]/[d.y&middot;b.x - d.x&middot;b.y]
<br/>


**Side-By-Side:**
<br/>
t1 = [d.x(a.y - c.y) + d.y(c.x - a.x)]/[d.y&middot;b.x - d.x&middot;b.y]
<br/>
t2 = [b.x(c.y - a.y) + b.y(a.x - c.x)]/[b.y&middot;d.x - b.x&middot;d.y]
<br/>


**KEY NOTES:**
- If the demonimator equals zero &rarr; there are zero or infinite intersections
- Else &rarr; there is an intersection at t1 (Ray 1) and t2 (Ray 2)
- To limit to only positive intersections (infinite rays) &rarr; check that t1>=0 and t2>=0
- To limit to only finite rays &rarr; check that 0<=t1<=1 and 0<=t2<=1



<a name="VORONOI"></a>
## Voronoi Diagram
![Voronoi Diagram](./images/voronoi_definition.png "Voronoi Diagram")

A voronoi diagram is a graph that sections off sites (points) into cells, whereby any point in each cell is closer to the cell's site, than any other site. It is infrequently referred to as the "Post Office Problem".
<br/>
**Site**: 2D point
<br/>
**Cell**: Container about site, the intersection of all half-planes that divide the site from all other sites. The perimeter is defined by a set of half-edges (typically ordered sequentially CCW or CW about the site). Any point inside the cell is closer to that cell's site than any other site.
<br/>
**Half-Edge**: An edge simply defined a border, but half-edges also enable 'ownership' of each side of a border. They also allow each side to be orientated independently of the opposite.
<br/>
**Neighbors**: Cells that share adjacent half-edges.
<br/>
**Vertex**: A point that is equidistant from three or more sites - a half-edge is geometrically defined by the connection of two vertexes.
<br/>



<a name="FORTUNE"></a>
## Fortune Algorithm
![Fortune 1](./images/fortune_definition.png "Fortune 1")
<br/>
Fortune's Algorithm (Steve Fortune 1986) is an optimal process for producing a voronoi diagram (graph) from a set of input sites in the 2D plane. The process can move from left-right, or up-down, but is assumed here to be top-down.
<br/>
**Sweep Line**: A common directrix used by all the arcs in the wavefront. It continuously moves top-down, where all sites above this line have been processed and all sites below await potential evaluation.
<br/>
**Wavefront (Beach Line)**: The set of arcs defined by the lowest points over all parabolas (of sites above the sweep line).
<br/>
**Site Event (Split)**: An input site before being processed - the site's location is defined as the site's position.
<br/>
**Circle Event (Merge)**: A convergence of three parabolas (which defines a circle) - the site's location is defined as the lowest point of the circle.
<br/>
**False Alarm**: If a new site 'shows up' causing a circle event to be rendered mute, the circle event is referred to as a 'false alarm'.
<br/>


### Data Structures
The Fortune Algorithm uses several tools to keep track of all the information required for the algorithm.
<br/>
**Event Queue [Q]**: This contains all site and circle events - they are ordered based on the times at which they will arrive at the sweep line: Events with a higher y value will appear before events with a lower y value. Events with the same y value can further be sorted based on their x value (increasing or decreasing doesn't matter as long as it's consistent).
<br/>
**Voronoi Graph [G]**: This contains all vertexes and half-edges (and sites) that are added as the algorithm progresses. When complete, this is the output of the algorithm.
<br/>
**Wavefront [W]**: This is a set of arcs (parabola segments) which serves as a way to keep track of the lowest parabola segments, as well as predict points of future convergence (which correspond to voronoi vertexes)
<br/>



### Algorithm


- Graph initialized empty
- Queue initialized with n input site events
- While Queue not empty
  - Site Event (split):
    - find arc above new site
    - remove old circle event for site if present (false alarm)
    - add new arc (formed by site) to wavefront (which is a vertical line)
    - graph add: new half-edge
    - check for possible circle events "triplets"
  - Circle Event (merge):
      - remove all circle from queue events that reference the merging arc
    - graph add: new vertex, 1 new half-edge
    - collapse referenced arc (remove from wavefront)
    - check for 2 possible circle events "triplets" formed by left 3 and right 3 sites
      - the center of the event is where the left/right arc may disappear, the bottom is the event location
      - converging arcs: focus are oriented Left-Center-Right about circle event center
- Cleanup Graph when Queue is empty
  - Combine coincident vertexes (where multiple events occurred simultaneously = valence 4+ vertex)
  - Consistently orientate half-edges around site
  - Cap infinite edges (eg via bounding box)


### Sequence
![Sequence 1](./images/fortune_01.png "Sequence 1")
<br/>
*initial empty sites*
<br/>
---
![Sequence 2](./images/fortune_02.png "Sequence 2")
<br/>
*first site/arc added*
<br/>
---
![Sequence 3](./images/fortune_03.png "Sequence 3")
<br/>
*second arc added*
<br/>
---
![Sequence 4](./images/fortune_04.png "Sequence 4")
<br/>
*third arc added, and circle event generated showing point of convergence*
<br/>
---
![Sequence 5](./images/fortune_05.png "Sequence 5")
<br/>
*arc convergence*
<br/>
---
![Sequence 6](./images/fortune_06.png "Sequence 6")
<br/>
*additional sites added, more circle events generated*
<br/>
---
![Sequence 7](./images/fortune_07.png "Sequence 7")
<br/>
*another merge - arcs with definite vertex shown in red*
<br/>
---
![Sequence 8](./images/fortune_08.png "Sequence 8")
<br/>
*another merge updates wavefront, revealing false-alarm circle event (removed)*
<br/>
---
![Sequence 9](./images/fortune_09.png "Sequence 9")
<br/>
*...ad infinitum...*
<br/>
---
![Sequence 10](./images/fortune_10.png "Sequence 10")
<br/>
*final voronoi diagram*
<br/>
---


<a name="OPTIMUM"></a>
## Data Structure Speedup
![Red Black Trees](./images/red_black_tree.png "Red Black Trees")
<br/>
*Optimum-ness of Fortune Algorithm relies on underlying data structures*
<br/>



**Balanced Binary Search Tree: RedBlack**
<br/>
A regular Binary Search Tree (BST) can become lopsided if interaction with it is less than random (or contrived).
The Red-Black Tree is a BST that guarantees non-lopsided ness, and has the following time complexities:
- insert: O(lg(n))
- delete: O(lg(n))
- search: O(lg(n))
<br/>

**List of Operations/Classes/Objects in Fortune Algoritm and Time Complexity O():**
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


**Wavefront representations:**
<br/>
set of intersections
<br/>
set of arcs
<br/>


**Notes:**
- avoid methods that are suspect to numerical error
- book-keeping: keep only most pertinent data, as all references need to be updated, and more references = prone to error


<br/>


<a name="DELAUNAY"></a>
## Delaunay
![Delaunay Diagram](./images/delaunay_definition.png "Delaunay Diagram")
<br/>
*Delaunay Diagram / Triangulation* is the 'dual' of the voronoi diagram. This simply means they share common properties/features, which often function equivalently or complimentary.
<br/>
They cannot be called 'inverses', because V(D(X)) != X
<br/>

**Relationships:**
<br/>
- Delaunay triangle edges are orthogonal to Voronoi cell edges
- Delaunay vertexes are Voronoi sites
- The convex hull of Delaunay vertexes is the convex hull of Voronoi sites
- 3 concentric voronoi sites define a vornoi vertex &lrarr; 3 concentric delaunay vertexes define voronoi vertex
- ...
<br/>
- If any voronoi vertex has a valence larger than 3, then the Delaunay ceases to be a triangulation, and faces with more then 3 edges are resulted.

###From Voronoi
- For Each Site:
  - For Each Edge
    - form a triangle from:
      - site
      - edge.opposite.site
      - edge.next.opposite.site

Alone, this will create each triangle 3 times, but doing some limiting based on 'visits' to each edge can result in the complete unique set of delaunay triangles.



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
[Dual / Duality](http://en.wikipedia.org/wiki/Dual_(mathematics))
<br/>

