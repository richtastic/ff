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







DISPARITY
2D disparity = leftImagePos.x - rightImagePos.x
(positions are from the camera center line?)
z/f = 







:

**Hungarian [Kuhn-Munkres] Algorithm**: solve **Assignment Problem** in O(n<sup>4</sup>)
<br/>
Bipartite graph 
<br/>
minimize cost of &Sigma;<sub>i</sub> cost(e<sub>a<sub>i</sub>,b<sub>j</sub></sub>)
<br/>
**1)**
<br/>
- for each e<sub>a<sub>i</sub></sub> &isin; a<sub>i</sub>
	- e<sub>a<sub>i</sub></sub> = e<sub>a<sub>i</sub></sub> - min(e<sub>a<sub>i</sub></sub>)
- for each e<sub>b<sub>i</sub></sub> &isin; b<sub>i</sub>
	- e<sub>b<sub>i</sub></sub> = e<sub>b<sub>i</sub></sub> - min(e<sub>b<sub>i</sub></sub>)
<br/>
**2)**
<br/>
- create graph using only 0-weight edges
- find max flow / min cut
	- perfect => done ?
- find min vertex cover V of 0-weight graph (max matching)
<br/>
**3)**
<br/>
- &Delta; = min(e<sub>i,j</sub>)
- adjust weights:
	- w<sub>a<sub>i</sub>,b<sub>j</sub></sub> += 
		- &plus;&Delta; : a<sub>i</sub> &isin; V && b<sub>j</sub> &isin; V
		- &minus;&Delta; : a<sub>i</sub> &notin; V && b<sub>j</sub> &notin; V
		- 0 :  a<sub>i</sub> &isin; V || b<sub>j</sub> &isin; V



**Konig's Theorem**:



O(n<sup>3</sup>):


<br/>
[R] *https://www.topcoder.com/community/data-science/data-science-tutorials/assignment-problem-and-hungarian-algorithm/*






min<sub>a<sub>i</sub></sub> = &Sigma;e<sub>i</sub>








entropy max @ 

entropy min @ all equal:
p = 1/n
sum p * log(p) = 
n * [ (1/n) * log(1/n) ] = 

[log(1/n)] = 







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



TODO:


---- ENTROPY SELECTION: SHOULD USE:
	MAX ENTROPY
	OR ENTROPY AT A SPECIFIC VALUE ? (0.5)
	OR (0.5 OF A MAX VALUE)

- test differntly scaled identical images

- test more points
- R3D.optimalpointdescriptor?
	- scale
	- rotation
	- 
- AREA SAVE FEATURES IN MEMORY TO REDUCE REPEATED PROCESSING


x average median offset mean SSD NOT BETTER
	=> YES IT MIGHT BE ?

WANT GRADIENT + ORTHOGONAL GRADIENT

> FILTER ITERITIVELY RATHER THAN ALL AT ONCE:
x> GET CORNERS
-> REMOVE LOW RANGE [bottom %?]
-> REMOVE LOW GRADIENT [?]
-> REMOVE LOW MOVE-COST
=> REMOVE HIGH-SIMILARITY MATCHES
=> 


HOW TO GET : MINIMIUM VIABLE TEXTURE AREA
- RANGE:
	- a 
	- range can be low if there are enough different variations
	- very low range == not so much variation

- RANGE OF GRADIENT:
	- if item is centered exactly on a high-gradient point, then not so useful

- AVERAGE GRADIENT ?
	- 

- ENTROPY
	- 


- loop thru all image pairs to show all at once
- show changed non-asymetric scaling
	-> covariant matrix
	-> gradient
		=> primary & secondary gradient values
		=> are max and min gradients always orthogonal?
- create rotation field that populates as queried
	=> start off at NULL
	=> determine rotation on request, & return



x change entropy best scale to only use oriinal image data points --- NOT HELP AT ALL
	- start at 5x5 => 21x21, record entropy value at each point
	- relative scale assumes eg a 15x15 pixel area:
		reference_size / entropy_size
		eg: 15 / 5, 15 / 21


- remove low-range points before they are selected for the search ?

- compare GRADIENT of SAD?
	- x SAD x
	- y SAD y

- best match is one where match is top choice in both of the items lists'

- save global arrays to lazily generate as features are procured, of:
	- optimum scale
	- optimum affine scale

x OPTIMUM ENTROPY SCALE:
	for s different scales (~10)
	*) scale image to s
	*) blur image
	*) calcualate entropy at each point by summing inside window (~25) [circle mask? gaussian mask?]
	*) scale entropy image up to orginal size
	*) blur entropies (?)
	*) record entropy at scale @ entropy-scale image
	=> for each pixel : find when entropy is @ value & convert to optimum scale value

- calcuating primary rotation from COV:
	- highly unstable around straight edges (after asymm scaling)

2 BEST MATCHING ALGORITHMS:
	- global optimized connections minimiziation of total error:
		- have list of next best match
		- initialize the current match-set by popping the next-best-available matches off the top and matching those
		- take the top match from list
			- match 2 points, and recursively re-match andy changed sets until stable match-set is reached
			- if the final result is a better global minimum than previously, keep the new match-set
				- else: take the NEXT top match from list
	- limit non-unique matching:
		for each point in [A | B]
			- if point has multiple good matches, add to list of non-unique-to-remove
		for each non-unique-point
			- remove the point from all existing matches & remove these matches from their lists
		reassess best possible matches (goto top)
		=> non-unique points will be removed from 

UNIQUENESS:
	- if more items have a lower score => less unique
	- histogram that is 'right heavy'
	- of final 'best points' then score based on uniqueness -- best = WORST SSD score amongst others in same image
	- only match top unique ones / drop worst under threshold
	- METRIC 1: line slope at first best matches [2~10]
	- METRIC 2: feature which is the first (top N) match to others
		- 1/CHOICE_IN_F_1 + 1/CHOICE_IN_F_2 + ... 
		- 1/1 + 1/2 + 1/3 ... 1/100
		- N * N * LOG(N)
	- ... 
=> SIMILARITY SHOULD NOT USE RANGE DIVISION ?
=> SHOULD REGULAR COMPARRISION USE IT?




SSD LEARNINGS
	CHANGES IN LIGHTING CAN MAGNIFY DIFFERENCE
		=> SUBTRACT MEDIAN ???
			=> subtracting median puts all levels of noise on equal field (black, grey, white)
	=> darker items will also  have a lower range 
		=> normalize ??
			=> low range points and high range points are then equal
			=> suseptible to noise
				=> multiply final score by difference in normalization required (or similar penalty)
	SCORES WITH LOW RANGE HAVE BETTER SCORE THAN HIGH-RANGE COUNTERPARTS
		=> divide by average of range
			=> average of range OR minimum of range?
			=> optimum division ?




	//
x normalize height SSD NOT BETTER
x page that selects points at random from image 1, computes best match from image 2, displays disparity match updated every iteration

- of final 'best points' then score based on uniqueness -- best = WORST SSD score amongst others in same image
- only match top unique ones / drop worst under threshold

- compare SSD & SAD in more detail
	- SSD of gradients instead of intensities
		=> what is SSD of a vector?
			- head-to-head distance?


points with a lot of 'good' /  matches ('similar' match scores) should be dropped ...
	- because of 


- optimum scale
	- maximize range, minimize scale/area/size
		=> will try to include the nearest black / white elements
	- penaltiy for high area (including many other features)
	- penalty for too small area (blurry - not enough of feature)
	- even number of high / low areas
	- at entropy = some common value
- get initial best points
	- high visual disparity (texture)
	- high gradient
	- high cornerness
	- 
- rank initial best points
	- how to similarize scores
		- scale all from 0 to 1 & multiply
- get way to compare features
	x overall orientation
	- overall scale
		- could do comparrison at several different zooms/scales and choose best
			=> more processing but also more generalized for any point type
			- ? interpolate the maximum score?
		- 
	- affine scale
		- shitty covariance approx only works for accidental grabs
- compare features (in circular window)
	- overall SAD
	- overall rotation via difference in gradient angles R G B Y
		- gradient magnitudes ?
	- local summed descriptors
		- zones
			- overall rotation via gradient R G B Y : error = angle / PI
				- scale based on gradient magnitudes?
			- gradient magnitudes R G B Y : error = 1.0 + lenLarger/lenSmaller || magLarger - magSmaller
			=> total gradient error = mag * rot
			- binning SAD
				=> error introduced in small bin change
			// 8 bins and 16 vectors
	- SSD OF OTHER FEATURES?
		- 1st derivative ?
		- 2nd derivative ? EDGES (laplacian)
	- how to combine different levels of sub-comparrisons
		- top is 1.0
			- zone is 1/4 or 1/16


- equations for depth from disparity
- iteritive asymmetric scale space
- more ways to get optimum scale & compare imageA and imageB results


- try SSDing with gaussianMask  -- weigh outside window less



- feature size = size where half of the SCORE(or other ) value is inside window
	- has to contain at least one 0 and one 1 (+/- some percentage?)
	- areas of constant intensity will have a very large scale (or jsut forget)






