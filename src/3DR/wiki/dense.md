# Dense Feature Matching

## Definitions
<br/>
**A** = image haystack 1, arbitrary pixel dimensions
<br/>
**B** = image haystack 2, arbitrary pixel dimensions
<br/>

Image haystacks are each divided up into a grid: **n** columns (x) by **m** rows (y), not necessarily equal for 
<br/>
**G<sub>i</sub>** = Grid for image i
<br/>
**G<sub>i<sub>n</sub></sub>** = number of cell columns of Grid G<sub>i</sub>
<br/>
**G<sub>i<sub>m</sub></sub>** = number of cell rows of Grid G<sub>i</sub>
<br/>

A feature is an object in an image, with an exact center which resides inside a single cell, but can have a size that may span multiple cells. A cell can have multiple features.
<br/>
**F<sub>i</sub>** = feature i, inside of a grid
<br/>

A match is an object that maps a single feature from one grid to a feature in another grid
<br/>
**M<sub>i,j</sub>** = match between feature i in first grid to feature j in second grid
<br/>

A feature can have multiple matches: features in a second grid which have some matching ranking describing the confidence that the features match
<br/>
**M<sub>p<sub>i,j</sub></sub>** = ranking metric/prioritization for features i and j
<br/>

To rank matches, queues area used
<br/>
**Q<sub>?</sub>** = queue prioritizing better matches at front
<br/>



cell > [feature] > [matches]




## Dense Matching
<br/>
**Input:** 2 Images A & B, initial _seed_ feature matches
<br/>
**Q<sub>g</sub>** = global queue for all purported matches between features in **G<sub>A</sub>** and **G<sub>B</sub>**
<br/>
- construct grids **G<sub>A</sub>** and **G<sub>B</sub>** with desired grid precision
- add seed matches to **Q<sub>g</sub>**
- while **Q<sub>g</sub>** has GOOD potential matches
	- **M<sub>top</sub>** = pop off top match
	- get **a** and **b** of **M<sub>top</sub>** 
	- if cell **a** doesn't have a better match, add match to **a**
		- for each _neighbor_ in a (**a<sub>i</sub>**):
			- calculate best match **M<sub>best<sub>a<sub>i</sub>,b<sub>i</sub></sub></sub>** from each of (**b<sub>i</sub>**)
			- add to **Q<sub>g</sub>**
	- if cell **b** doesn't have a better match, add match to **b**
		- for each _neighbor_ in b (**b<sub>i</sub>**):
			- calculate best match **M<sub>best<sub>b<sub>i</sub>,a<sub>i</sub></sub></sub>** from each of (**a<sub>i</sub>**)
			- add to **Q<sub>g</sub>**
<br/>
<br/>
**Output:** List of cells & best matches;
<br/>
if cell **a** from match **M<sub>i,j</sub>** maps to cell **b**, cell  **b** doesn't necessarily have a corresponding match **M<sub>k,l</sub>** that maps to cell **a**
<br/>


## Best Match 
<br/>
For a given cell **C<sub>needle</sub>** and cell **B<sub>haystack</sub>**:
- F<sub>needle</sub> = main feature point
- for each neighbor in B<sub>haystack</sub>:
	- calculate SoSD
- best SoSD of all neighbors is best match


- main feature point = center of cell (lazy) or most prominent feature (most corner-like point)

## Progressive Dense Matching
<br/>
- begin with entire image A and B, finding dense matching grids
- for all grids with matches, repeat dense matching using only the matched grid's neighborhood

... could use new features as seeds & iterate again on finer-mesh
... could use individual grids(& surroundings) as new images


<br/>




a good point migh be one that if you move left/right or rotate or scale a little has a big change in SoSD
	- move left/right/up/down 
		- value = sum of 4 movements
		- best point has highest cost

=> spots with MOST texture will fit this best







Image Moment: &Sigma;&Sigma;(x<sub>i</sub>-x<sub>c</sub>)&middot;(y<sub>i</sub>-y<sub>c</sub>) * I(x<sub>i</sub>,y<sub>i</sub>)


Covariance matrix eigenvectors / eigenvalues
COV = measure of dispersion
inv(COV) = concentration matrix = precision matrix = measure of precision
[cov(x,x)  cov(x,y)  cov(x,z)]
[cov(y,x)  cov(y,y)  cov(y,z)]
[cov(z,x)  cov(z,y)  cov(z,z)]


**(co)variance**: VAR(X,Y) = &sigma;(x,y) = E[x - E(x)]&middot;E[y - E(y)] = (1/N)&middot;&Sum;((x<sub>i</sub>-&mu;<sub>x</sub>)&middot;(y<sub>i</sub>-&mu;<sub>y</sub>))
<br/>

could have x = .x, y = .y, z = value @ I[y*w+i]
could have x = .x, y = .y, weighted by z


COV(x,y) = E[x*y] - E[x]*E[y]





GETTING ACCURATE OVERALL SCALE:
	- centroid of feature should be @ 0.5 of total size ?
	- maximum of laplacian / gaussian at different scales ?
GETTING ACCURATE ASYMMETRIC SCALE:
	- 



var(X) = Sum_i_to_n( (x_i - x_c)*(y_i - y_c) ) / (n-1)

x_c is the centroid
x_i == coordinate ? value I(x) ?


?:

[I1,I2]
[I3,I4]
Im = (I1+I2+I3+I4)/4.0
Iim = Ii / Im
=>
[I1m,I2m]
[I3m,I4m]


GRADIENT: directional flow of a scaler field (direction of maximum change) [directional derivative]
<br/>
grad(f) = (VECTOR) &nabla;&middot;f
<br/>

DIVERGENCE: vector field gradient measurement of sinkness/sourceness, flux density @ point, div = flux / vol
<br/>
div(F) = (SCALAR) &nabla; &middot; F
<br/>

CURL: vector field measurement of twist at a point == cross product of vector field
<br/>
curl(F) = (VECTOR) &nabla; &times; F
<br/>

LAPLACIAN: div(grad), curvature of a field ?, change of change of a scaler field [&nabla;<sup>2</sup> &ne; &nabla;<sup></sup> &middot; &nabla;<sup></sup>]
<br/>
laplacian(f) = (SCALAR) &nabla;<sup>2</sup>f =  &nabla; &middot; &nabla;f = &Sigma;  &part;<sup>2</sup>f/&part;x<sub>i</sub><sup>2</sup>
<br/>
second derivative DOT PRODUCT
tells you where there's a maximum / minimum at = 0



SCALE IMAGE UP / DOWN, get LAPLACIAN at all scales, plot, look for maxima/minima ?





















matching individual features


- start with SSD to limit potential points [does not account for large rotation / scaling]
- 


- SSD off by 0.5 a pixel results in trash
- SAD is better than SSD
- dynamic ranging (normalized) SSD is worse than without ranging



- comparrisions:
	- SSD of gradient



- COMPARE @ OPTIMAL ROTATION:
	- want to create a 'rotation field'
- COMPARE @ OPTIMAL SCALE:
	- want to create a 'scale field'
- want major/minor scale directions
	- moment at area ?


NAIEVE TEST:
	- pick random point/feature from image 1
	- do ssd matching with entire other image
	- use best match to calculate disparity
	- repeat


RESULTS:


- rotated, asym-scaled:

zone rotations only:

Manual3DR.js:1560 0 = 6.741067661839523
Manual3DR.js:1560 1 = 14.862101371268377
Manual3DR.js:1560 2 = 16.891412876089106
Manual3DR.js:1560 3 = 19.914475886726883
Manual3DR.js:1560 4 = 22.448424954363453
Manual3DR.js:1560 5 = 29.09700466015




zone bin SAD:
Manual3DR.js:1560 0 = 640
Manual3DR.js:1560 1 = 874
Manual3DR.js:1560 2 = 882
Manual3DR.js:1560 3 = 898
Manual3DR.js:1560 4 = 916
Manual3DR.js:1560 5 = 926
Manual3DR.js:1560 6 = 926
Manual3DR.js:1560 



bin + rots:


Manual3DR.js:1560 0 = 57.71538843113383
Manual3DR.js:1560 1 = 77.4641341359983
Manual3DR.js:1560 2 = 86.2029626290181
Manual3DR.js:1560 3 = 98.27441132388014
Manual3DR.js:1560 4 = 99.83426214829632
Manual3DR.js:1560 5 = 102.5561866609676
Manual3DR.js:1560 6 = 103.3541176910412
Manual3DR.js:1560 




**f**: 2D scalar field
<br/>
**&nabla;**: &part;f/&part; **i** + &part;f/&part;y **j**
<br/>
**gradient**: grad(f) = &nabla; &middot; f = &part;f/&part;x **i** + &part;f/&part;y **j**
<br/>
**grad(grad(f))**: = &part;[&part;f/&part;x **i** + &part;f/&part;y **j**]&part;x **i**  + &part;[&part;f/&part;x **i** + &part;f/&part;y **j**]&part;x **j** 
<br/>
= tensor ?
<br/>
**laplacian**: &nabla;<sup>2</sup> &middot; f = &part;f/&part;x **i** + &part;f/&part;y **j**
<br/>



