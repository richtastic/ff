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






HIGH DESNE PROBLEMS WITH HIERARCHICAL ALGORITHM:
- areas with large 'stretch' don't fit error metric well
	=> need sub-pixel matching ?
- if an error in matching happens early on, then it is propagated thru the match sequence
	=> want anchor points at most reliable (best score) points beforehand
- want to force all pixels in A have a match in B AND all pixels in B have a match in A - order & uniqueness preserved too
	=> 












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


## DENSE MATCHING USING F
	=> epipolar line in image A matches up with epipolar line in image B
	- uniqueness constraint: each feature on epipolar line has 0 or at most 1 matches on corresponding epipolar line
	- order constraint: sequences of features have same order on given epipolar line pairs
	- smoothness behavior: typically 
		- discontinuity / occlusion: obstruction in image (something comes in front or goes behind) preventing 
	- start coarse [bound areas to blocks] -- use lower resolution image pairs
		- move to fine => only search in box [+error] for subsequent 
	- points on the lines also have relationships with points above/below as well [should also behave same?]
- can minimize energy fxn with graph cut [Fast Approximate Energy Minimization via Graph Cuts,]


a good point migh be one that if you move left/right or rotate or scale a little has a big change in SoSD
	- move left/right/up/down 
		- value = sum of 4 movements
		- best point has highest cost

=> spots with MOST texture will fit this best

http://www.ifp.uni-stuttgart.de/publications/phowo13/080Wenzel.pdf
http://ivizlab.sfu.ca/arya/Papers/IEEE/TransactMM/CD/DATA/00748168.PDF
https://pdfs.semanticscholar.org/c222/bde241a3916465423788eccd3d0623824f44.pdf

remotesensing-08-00799.pdf


global:
	- minimize costs globally
SGM (semi global matching) algorithm
	 (Hirschmüller, 2008).
	 [Hirschmüller, 2005] Accurate and Efficient Stereo Processing by Semi-Global Matching and Mutual Information
SURE (tSGM = tube shaped disparity range) algorithm
MI (mutual information) cost function




bundle block adjustment

stereo-pair vs multi-view

global solve via: 
	energy minimization approach, based on regularized Markov fields (MRFs), graph-cut, dynamic programming, or max-flow method
		http://www.dlr.de/rm/Portaldata/3/Resources/papers/modeler/cvpr05hh.pdf
census matching
cost

median filter
DIM point cloud

DIM (dense image matching)
joint ilateral filter & guided filter
-- should only consider the intersection area

start with very low resolution
	conceptualize 2D grid-graph projected over image

REFINEMENT: (MEDIUM DENSITY)
each match has a point & confidence
	- choose F-row with next-highest-confidence match
		- go over row and find most salient features (in image A & image B)
	- add highest matches in row to list of potentials


HIGH DENSITY:
...


http://www.int-arch-photogramm-remote-sens-spatial-inf-sci.net/XL-5/93/2014/isprsarchives-XL-5-93-2014.pdf

https://www.slideshare.net/KonradWenzel/150225-presentation-avila3darchdenseimagematching






REGION GROWING:
region->region tracking
 - search around point at perimeter [connected cell chunk]
- keep track of local scale (for optimal compare)
- keep track of local AREA/SIZE?





LATEST:.....

* how to correctly scale an image up / down

need to determine best window matching (cost aggregation) method:
TEST:
- pic matching point across 2 images: [use exact same image & different images]
- see how well each scoring method works:
	*) same
	*) rotation
	*) scale
	*) rot + scale
	*) asymm scale
	*) noise
	*) ligthing increase / decrease
	*) blurring
- how to the maximum peaks change?
METRIC:
point at which match becomes wrong (eg which rotation, which scale, which noise level, ...)

EX:
SAD
SSD
NCC
ZNCC
* flat
* gradient
* gaussian
maxValue
minValue
range
entropy
cornerness
histograms [eg: intensities]


CONCLUSIONS:
CC: BAD
	will find best offset of SELF signal, not under unknown signal
	eg: white image will match better than itself
NCC: normalized : BAD
	will match anything shifted

ZNCC: normalized + zero mean : BAD
	will match anything shifted or scaled
	eg: noise on gray solid BG could happen to match up well
SAD: OK - BEST
	matches items with similar brightness
NSAD:
	- 
ZSAD: seems to cause more false matches than SAD

GRAD-X: BAD
	- using gradient as-is, in place of image intensity, does not work well

SIFT-ISH-GRAD?:
	- is OK, larger area is better


NEXT:
ignore FLAT / non-textured areas (do last)
	TEST:
	x do multiple calculations to find local optimum score via rot/sca
		- does this find THE BEST match? or waste time finding other bad matches?
	ALG:
	x use local scale / rotation as offset to find local optimal

	ALG:
	- use smaller cells / smaller search areas to limit large-offset errors

	ALG:
	- initial SAD estimates seem different than the local ones

	ALG:
	- try 1,2,4 cell size

	~ show disparity map for current progress
	- measure non-texturedness & penalize scores for non-uniqueness
		- energy?
		- entropy?
		- moment?
		- entropy-from-center ? [remove 'average' color?]
		- directional entropy
		- homogeneity
		- contrast

		- 
	- backtracking if a bad situtation is found?
		- if a lot of cells are mapped to a particular cell:
			- remove all mapped .. and mark to not repeat?
	- areas with a lot of similar (peak) scores should be penalized
		- unstable points
	- indistinguishable cells / areas SHOULD have an ordering constraint
		- also uniqueness constraint?
	- penalize for further-away matches (higher disparity)
		- large 'delta' disparities == discontinutities
		- already-matched-neighbor's disparity == 9
	- 

- Zenforce some kind of directional flow
- instead of searching thru all neighbors, try to use matching 'flow'
	- maybe narrow down to half-plane ?
	- (assumes previous matchings were good)

PROBLEM: clearly the 'best' matches aren't getting chosen first
	- the metric for best is wrong
=> ATTEMPT:
	- try a different sift gradient metric for better similarity accuracy
	- disreguard elements with low range
	- disreguard elements wtih low gradients
	- try directional/ordering constraints on 2d-grids
	- if rectified images are very accurate (error < +/- 1 line), can use projective stereo line-matching
		- pinning of KNOWN points
			- no given point is actually 100% reliable even though the average is.




score: 1.0
	* SAD [lower better]
	* 1/textureness [higher better] entropy
	* uniqueness [lower better] score=histogram
	* 



http://www.cis.upenn.edu/~jshi/papers/ICCV99b_final.pdf


PROBLEM:
	- floating optimal scale tends to zoom out
	=> should always opt to compare with ZOOMED-IN image, rather than always zoom the needle



areas of flat-white match well with areas of flat-white
	- non-unique areas should be penalized so they aren't used first
		- lots of good-scoring OTHER-similarity matches in nearby window
		- lots of good scoring SELF-similarity matches in self-neighborhood
		=> some kind of summation in a neighborhood needle / haystack based off of similarity measurement SAD

		- flat areas should be penalized so that they are not at the top of the queue
			- low gradient
			- low entropy
			- low range

	=> HOW TO TRADE OFF GOOD SCORE WITH PENALIZING FACTOR ?
		[50/50, 10/90, ...]

		1 unique point is great
		2 is ok
		3+ starts to get bad


		weightidly ignore first few? 0, 0.1, 0.5, 0.9, 0.999 .... ?
	=> otherwise things with NO MATCHES (perfect uniqueness) will get weighted more
		=> some ideal histogram that should be desired ...


- 
http://mathworld.wolfram.com/LeastSquaresFittingLogarithmic.html




RELIABILITY / UNIQUENESS / PENALTIES 
~ distance from F-line
~ 1 seed point shouldn't change cell location
	=> do haystack search still around TO point (with enough error for 2x scale change)
	- if seed point was inaccurate, then is perpetually a wrong change
2 local relationship with assigned / neighbors
	=> MASK OUT INVALID AREA
~ 3 update affected queue cell points
	=> should remove old match-points that are no longer consistent with prediction ?




- assigned orientation should not be too much more crazy than current status (angle / scale can only change slightly)
	- this is already restricted somewhat by the choice of where
- WHEN COMPARING: compare size should include more than just the CELL neighborhood
	~ 2.0 x cell size (or cell min size)





Iteritive triangulation method:
	- is point inside hull?
		- find intersecting triangle
		- split triangle from 2 to 4 including that includes new point
	- else
		- add triangle
	=> recursively adjust triangles until angles are happy





SLOWNESS:
faster way to find intersected triangle
	-> quad-tree triangle placement
faster way to create delauny triangulation from voronoi diagram



dense match output:
	pointsA, pointsB


OVERALL NEXT TASKS:
* medium-seed point matching
	- need a more selective criteria to remove all false positives
		- comparrision at multiple scales [1,2,3,...]
		- score based on uniqueness
		- score based on mapping 
		- - does poorly around repeating pattern
- restict points that fall outside of neighbor image
- matching seems to fail aroudn occusions
	- repeated texture mapped elsewhere?
- better ranking (uniqueness)

--- map left->right && right->left => then only use points that are within ~pixel of eachother in mapping


* 2D -> 3D points
* visualize 3D points
* texture-map triangles / 3D points




FORMAT OF IN/OUTPUTS FROM VARIOUS FXNs


... expand locally based on nearest neighbor
	[bad???]
... expand globally based on triangulation
	[bad because of occlusions]


=> try interpolator in both modes to advance front


camera info:
	- radial distortion params
	- K matrix

initial point matches:
	imageA
		- file
		- scale
	imageB: file, ...
	pairList:[
		[pixelA.x,pixelA.y,pixelB.x,pixelB.y]
		..
		]

medium point match:
	...?

dense point match:

3d point set
	imageA
	imageB
	match list

model
	texture images
		- location
	triangles
		- 3d location
		- 



debugging:
	display seed-seed match area
	display needle & haystack & top scoring locations & SAD score
	display each possible final matched needleA-needleB


=> may need to revisit:
	- best score for a point should be based on reliability?, not just on score ?
		- maybe include wobbliness with uniqueness (best of best scores)
	- what scale should seed points be at originally?
		- 
	- scoring based on gradient / SIFT
	- combinging different scores

- simultaneous grid/mesh matching ?



uniqueness heat map:
	- for each pixel/area
	- SAD scores in neighborhood size [2-4x]
		- rotation?
		- scale?
	- 

distinct
reliable



- some initial points have very wrong rotation/scale
- reliable points will have consistent rotation/scale ratio at various scales around 'optimum' scale

	- see what angle is at various scales at 'ideal' rotation / scale
		=> throw out non-scaling points

=> SPARSE
obtain a good F

~1000 initial feature sites
~500 initial SIFT locations
~100 matched SIFT locations
~75 correctly matched sift locations
~50 F-matrix matched points


=> MEDIUM
given an F, find a lot of good matches

~1000 initial feature sites
~500 SIFT locations
~200 SIFT matches
~100 matched points

=> DENSE
given F & good seed points, match as many pixels/pixel-areas as possible

~100 initial seed sites
~mxn * 0.5 pixel-areas
~1/10 pixels matched

=>



radial distortion:
x cost function nonlinear optimization determine k1,k2,p1
x synthetic - planar to 3D - to estimate K / distortion
x calculate inverse image distortion from params

texturing:
x make compiled texture map

optimal point detection
x revisit corners
x how to get a non-peaked corner [all neighbors are peaks]
x combine scores at multiple scales

OPTIMIZING POINTS:
x pass in skew params to optimal check
x figure out: scale,rotation,s_s,s_r from a given matrix transformation
	x -theta,scalex,+theta ~ skew_x & skew_y & scale
x how to decompose an affine matrix into usable interpolation elements

MEDIUM BASICS
x refine from top results
- drop worst [SAD? NCC? SIFT?]
x export in format
x import in format
- REFINE LOCATION | ANGLE | SCALE
	- doesn't appear to be using angles / scales anywhere

DENSE MATCHING LIMITING
x don't add point if SAD score is too different than neighbors
x SHOULD HAVE A RANK


- USE SIFT-SCALE SPACE

- better comparator ? SAD is pretty shitty

- import prioritized on SAD score and on F line distances



- SEE HOW DIFFERENT 'SAD' score calculations change final result
- SEE HOW DIFFERENT 'uniqueness' score calculations change final result

- use best output score points from dense match as input to new dense matching ?

- SAD score is only good for comparing a single match with others'
	- NOT for comparing across different matches
- CURRENTLY: most unique goes next
	- most unique doesn't mean correct
	- want unique and correct
	- correct: in line with F location, good SAD score, good NCC score, good 
	- if the most unique item has no match, it will falsly select wrong one

- COARSE-TO-FINE matching
	- choose best to-from scores from eg 10 px
	- use as seed points for eg 5 px
AFFINE MATRIX: 6 DOF
	- x, y, angle, skew, scaleX, scaleY
	 - tx
	 - ty
	 - sx
	 - sy
	 - rot
	 - skew (x & y)

- USE 2x IMAGE WITH CORNER DETECTION
- TRY REFINEMENT ON ALL MATCHES TO GET BEST

--- REFINE SAD => REFINE SIFT & use SIFT SCORE AT END
	- show refined image comparrisions
	- extract sift vector from transformed images
	- compare sift score for ordering

- possible not getting equal matching points to allow for good matching
	- different key point / scale detection
		- variability

x point-based scaling
	- use nearest 2/3 points to create size
	- picked points is not reliable enough to do this

- SIFT dominant angles are sometimes not matching up
	x look for multiple (75% of max)
	- broke SIFT itself optimal rotations

- for each match, do refinement, discard points that don't reach some SAD minimum [over 3+ scales] [~1E-5 ^ 3]






DENSE error correction:
x if a neighbor is matched, but the score is poorer than a new match, can the match be un-joined?
	x use RANK score ?
	x use SAD score [better?]
	x is this worth increases processing time?



OPTIMIZING F:
- FIX LM METHOD
- optimize good points by shifting based on SAD needle/haystack
	- discard bad points by testing SAD needle/haystack point distances
- 
- try minimizing lm iteritively by moving the epipole(s?) rather than F


IMAGE-MATCHING-OPTIMIZING:
	- use r,sx,sy to find optimal SAD score


triangulation:
- show cameras in scene == rect (400x300?) + direction
- show images (behind)

camera control:
- center/scale points inside window
	- use spherical non-infinite projection
- zoom in/out about given COM



bad / ok / good
entropies - ok
	- doesn't differentiate gradual changes vs immediate changes
uniqueness - good
	- doesn't bias feature/non-feature, is 
	- takes longer to compute
	- precise metric (eg slope or difference or ratio) not known which is best yet
rangeness - ok
	- preference for black/white images
variability - good
	- items with more 'edges' / 'corners' are favored
	- can't differentiate simple patterns
roughness - ?
	- typically from the mean: rms, avg,  -- would seem to be overall & not differentiate locally




- concentric circles (sharing same point) => use as single object?
	- only compare each of same group [not as separate entitites]





============= next:::::


x speed up dense matching by dropping triangulator
x select FROM points as most cornerlike point inside cell area (fallback to center)


TODO:



x dense matching finalize
x display 3d points
~ rectangle packing -- too long
- tri2d display trangle depth ordering
- tri2d triangle glitching [numerical stability problem]
	- calculaing affine matrix is bad
		- try custom non SVD version?
- use iphone5 calibration K not iphone6 for case study
- 
- javascript + php combo to
	- save data to file
		- binary
		- text
	- delete file
- export model to files
- use stage3D to display model





x show the points in the 3D preview
	x delauny triangulate from single image to get rough surface texturing
- surface approximation from point cloud




- how to pick triangles in mesh
	- discontinutities?
- prefer smoother transitions over abrupt when @ fork














































DeepMatching Notes:

R = sift quadrant bin in 2x2x8
Ri,j is histogram of oriented gradients [pooled over local neighborhood]
sim(R,R') = 1/4 * max( sum( sim(R_i,R_i') ) )
sim(R,R') = 1/16 * sum( sum( Ri,j^T * R'i,j ) )

cap strong gradients with sigmoid: 2/(1 + exp(-a*x))




- can enforce ordering constraint around areas of low accuracy / non-uniqueness 
	- if uniqueness is poorer than some metric
		=> use direction?
		=> use ?

i,j = pixel in image
a = pixel in image A
b = pixel in image B
N_w(i) = w x w window around pixel i
n(a,b) = weighted intensity measure difference of pixels
	= 0.299*|r_a-r_b| + 0.587*|g_a-g_b| + 0.114*|b_a-b_b|
s(i) = roughness metric
	= max( n(i,j), i-j in {(1,0),(-1,0),(0,1),0,-1} )   [4-neighborhood pixel difference maximum]
s0 = lower threshold of roughness
	= 0.04
d(a,b) = image intensity / color difference between neighborhood
	= (1/9) * sum n(a+del,b+del) ; del in [-1,0,1]x[-1,0,1]
d0 = upper threshold of intensity difference
	= 0.07
r(a,b) = reliability measure of pixel pair [higher is better]
	= smallest of roughness estimate / intensity difference
	= min(s(a),s(b)) / d(a,b)



--- force some minimum distance from nearest neighbor ?
	go thru all matched cells
		find nearest in TO space
			if nearestTo/nearestFrom >= MIN_DIST_SCALE [~0.1 == 10x scale] 
				=> can match


--- why is haystack location off by small amount
--- better reliability metric
--- iterate over all perimeters before choosing












400 = 2/2/2/2/5/5
300 = 2/2/3/5/5
=> 2 2 5 5
2*2 = 4
2*5 = 10
2*2*5 = 20
5*5 = 25
2*2*5*5 = 100


x separate RANK/ORDER from SCORE
x display matching of A<->B
x try on actual different image
x determine what needle/haystack size to use based on cell size

- use lattice/mesh to enforce locations
	- use homography to estimate next best guess location for unassigned cells
	- use angles to limit next choice ?
	- use scales / relative distances to limit next choice?
	- NEED SOME KIND OF READJUSTMENT TO BACKTRACK FROM BAD ASSIGNMENTS
	- re-check uniqueness evaluation


	- global Q with all matches
	- add each seed [ADD FXN]
	- pop next best match off Q
		- if satisfies constraints:
			- doesn't cross lattice edge [only calculate with matched neighbors]
			- is minimum of 0.N pixels from neighbor [and perimiter line]
		=> set as matched point
			- remove all local scores from global Q
			- for each neighbor:
				- search local neighborhood as self.scale * cellSize * 4
				- F restriction affect rank:
					- distance from projection line:
						eg:   *  [ 1.0 + Math.max(distance - error,0) ]
		- else:
			- resolve by moving crossed neighbor & lowering score if average score is better
			- or NO-OP


	ADD FXN: [GOOD seeds don't need to, bad seeds might in order to readjust later]
		- record top ~10 matches in neighborhood in local Q
		- add top matches to global Q


	.. 


















- how to use initial findings (@ cell size 1) to guide next findings (@ cell size 2)
	- allow for possbile missmatches
	- enforce more ordering constraints

- first unique-match the group, then non-unique match to fill in gaps (should save for last to limit error)

- add R G B colors to scoring

- limit matches by relating distance from nearest neighbor (in 2nd image) with relative scale -- if too large, is probably a bad match
	- displarity gradient limit?

- is there a limit to how distorted (scaled / rotation) a cell should be allowd to changed ? detect problems?
	- also sort by least mutated cell pairs ?

- [variable] scale discrepancy throws off matching cell accuracy

- 
- how to estimate image [relative] blurriness -- https://stackoverflow.com/questions/7765810/is-there-a-way-to-detect-if-an-image-is-blurry/7768918#7768918
	- laplacian:
		gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
		numpy.max(cv2.convertScaleAbs(cv2.Laplacian(gray_image,3)))
	- http://www.pyimagesearch.com/2015/09/07/blur-detection-with-opencv/
		variance of laplacian
- how to optimize depth location (metric vs projective)
- 




- allow a better match to replace a previous match (& invalidate?) -- 
- when placing a match is there a way to statistically validate if the match is viable
	- may be off @ occlusions
- do low-dense 1:1 cell matching
- increase density, using previous grid as start search locations
- after 1-pixel matching
	A) do many-to-many cell matching, limiting 
	B) do gap-filling for all cells who have at least 2 neighbors
- extend areas radially about perimeter
	- enforce some kind of ordering

- stop criteria?
	- SAD scores limiting stops much too early
	- uniqueness N/A ?
- if reach border ... do ?




2ND MATCHING
for each cell
	- prioritized based on average uniqueness of neighbors (based solely on neighbor count => perpetually matching only existing areas)
		- further prioritize on uniqueness ?
	- estimate approx location based on neighbor locations
		- use narrow window ??
	- allow one->many matching 

EXPANDING TO AREAS OF UNIFORM SIMILARITY
- ordering constraint ????


ORDERING CONSTRAINT:
	- mapping a lattice to a lattice
		- neighbors are consistent
	- 'pin' a match down
	- any new match must have positive area about neighbors (/consistent orientation)
	- HOW TO UNDO BAD CHANGES ?

when choosing a single dell match
	- look at top N choices: from best match > to worst match (in neighborhood)
		- see what average group score would be at each scenario [up to 8 unmatched neighbors]
			- use best of group


FUNDAMETNAL MATRIX ORDERING CONSTRAINT
	- penzlize matches for distance from projected line ( *= 1+pixels)




disparity gradient
	- stero images:
		- rL = vector from 2 points in left image
		- rR = vector from 2 points in right image
		- |rL - rR| / |rL + rR|
	- only correct case if limit < 2

	ALSO:
	- disp(A)-disp(B) / S
	- cyclopean separation S = distance between midpoints of each pair = [ .5*(x+x') + y^2 ]^.5


disparity = difference in distance from (along) epipolar line?
















































































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







## ways to estimate optimum scale
- entropy = val
	- ?: seems to change a lot between images & appropriate zooms
- highest corner value
	- no: harris corner detector continually increases as you zoom out
- range = val
	- ?: seems to have high variability among same images
	- points with black/white have different behavior than grey
		-> fix with using each channel?
- covariant matrix maximum ? eigen ratios?
- ?

- Difference of Gaussian Scale space
	- ok ?

- http://courses.cs.washington.edu/courses/cse576/book/ch7.pdf
	- EDGE DENSITY
		- | {p | Mag(p) >= T} |/N
	- HISTOGRAM L1 DISTANCE:
		- SUM |H1(i) - H2(i)|
	- TEXTURE ENERGY x
		- SUM (N(i,j)^2)
	- CONTRAST:
		- SUM (i-j)^2 * N(i,j)
	- HOMOGENEITY: x
		SUM N(i,j) / (1 + |i-j|)
	- CORRELATION:
		- SUM (i-mu)*(j-mu)*N(i,j) / [sigI * sigJ]



FEEDBACK:

// average roughness A: 1/n SUM |y|
	=> mostly increasing with scale
	=> graphs are shifted, yvalues not precicely similar
	=> y=const is probly best, but lots of local min. max
// average roughness B: 1/n SUM |y-yavg|
	=> graphs are roughly shifted, yvalues are not precicely similar
	=> minimum is probly best, but not very accurate
*/ average roughness C: 1/n SUM |y-yavg|^2
	=> graphs are roughly shifted, yvalues are not precicely similar
	=> minimum , but x-shift does not look exact
// average derivative roughness A: 1/n SUM |dy|
	=> shifts not clearly visible
// average derivative roughness B: 1/n SUM |dy-avg|
	=> shifts not clearly visible
// average derivative roughness c: 1/n SUM |dy-avg|^2
	=> shifts not clearly visible
// covariance | moment
	=> all over the place
	=> first maxima from high zoom
// moment
	=> all over the place
	=> first maxima from high zoom
	=> or global maxima
// covariance | moment ratio
	=> all over the place
	=> first maxima from high zoom
// contrast


## ways to estimate optimum rotation
- gradient at center
	- can be picky at symmetric
- average gradient across 
	- 
- do several top choices


## SSD | SAD tests:
- SSD off by 0.5 a pixel results in trash
- SAD is better than SSD
- dynamic ranging (normalized) SSD is worse than without ranging




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




with camera calibration, a similarity camera transform can be determined [metric matrix]
without camera calibration, only a projective transform can be determined
	=> want the best projective transform that minimizes some error ?
	- in order to constrain a 3D point in 3+ images it must be marked as the same 3D point in those images
		- other 3D points may take the projected location in other 2D scenes, so the same projected point != same 3D point


dense depth ordering constraint
	- when searching along epipolar lines, ordering in cameras of points should be consistend: A-B-C-D...

TODO:


self calibration ???? using a grid
auto calibration : doing it via code
quasi-Euclidean initialization
kruppa equations : find OMEGA_inf -- weaker constraints
modulus constraint : find pi_inf -- stratified solution: 
trifocal tensor | 
cholskey decomposition



------
	other scale-space metrics:
		- 


- roughness: https://en.wikipedia.org/wiki/Surface_roughness
- http://www.mitutoyo.com/wp-content/uploads/2012/11/1984_Surf_Roughness_PG.pdf
- http://www.mitutoyo.com/wp-content/uploads/2015/04/Surface_Roughness_Measurement.pdf
x 1/n SUM |y|
x 1/n SUM y^2
	(subtract median)
	- SSDish
x 1/n SUM |dy|
	- dy & dx in 2D

TEXTURE MEASUREMENTS: https://en.wikipedia.org/wiki/Image_texture
x 2nd angular moment
x CONTRAST
- CORRELATION

CO-OCCURRENCE MATRIX:
- discretize image into levels L: [0,L-1]
- size of COM is L-1 x L-1
- multiple types of COM: right,down,diag
- for each pixel i
	u = I[i]
	- NEXT pixel j [j is right / down / diag of i] [except borders where j is not defined]
		v = I[j]
		- COM[u][v] += 1




https://courses.cs.washington.edu/courses/cse455/09wi/Lects/lect12.pdf


CONTRAST: https://en.wikipedia.org/wiki/Contrast_(vision)
	I - Ib / Ib
sqrt ( 1/N * SUM [I(i,j) - I]^2 )


https://www.ics.uci.edu/~irani/pubs/apgv06.pdf

https://www.google.com/search?q=surface+roughness+measurement&oq=surface+roughness+measurement&aqs=chrome..69i57j0l5.4231j0j7&sourceid=chrome&ie=UTF-8#safe=off&q=image+texture+measurement


https://courses.cs.washington.edu/courses/cse455/09wi/Lects/lect12.pdf
Edges per area:
	(|gradient| >= thresh) / N
histogram direction region:
	Fmagdir = Hmag(R), Hdir(R)





TODO:
x RETRY CORNER SCALE SPACE -- is it just there are too many points?
- SIFT POINTS ARE NOT CONSISTENT
- BETTER 
- TRY USING SIFT SCAPE SPACE MAXIMA (with blur) AS CORNER SPACE SCALE SIZE -- would need to possibly remove duplicated corner-detected-points ?
- SOLVE USING ASSIGNMENT PROBLEM
- RGB vectors
- IDENTIFY ASYMM SCALING / DIRECTION


TODO: CORNER SCALE SPACE
	- SET SCALE SPACE UP TO NEXT-NEAREST CORNER NEIGHBOR
	- PAIRS OF CORNERS
		- any 2?
		- me-to-next-highest peak?
	- GROUPS OF (K) corners


TODO: try refining the points to more accurate maxima in area
	- zoom, look at max in area, interpolate
	- sub-sub pixel ?
	- follow gradient ?
TODO: find maxima harris at multiple scales [200,100,50]
	- scale space maximized harris ?
TODO: use circular mask on harris detector ?

PROBS:
- optimal scales are very unstable by point
	- try corner detector scale-space - harris
- orientations seem very unstable
	- some more binaryish way to choose optimal orientation
- some (iteritive) way to determine asymm scaling
- visually confirm that assignment algorithm working with 






for feature matching, can also see how well the scale-space graphs line up -- since that is generated anyway

---- ENTROPY SELECTION: SHOULD USE:
	MAX ENTROPY
	OR ENTROPY AT A SPECIFIC VALUE ? (0.5)
	OR (0.5 OF A MAX VALUE)
- try fitting parabola?
- first substantial max?
- try blurring

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










REMOVED::




	https://brownmath.com/stat/shape.htm
	https://en.wikipedia.org/wiki/Standardized_moment
	https://en.wikipedia.org/wiki/Skewness
	https://en.wikipedia.org/wiki/Kurtosis
	https://www.spcforexcel.com/knowledge/basic-statistics/are-skewness-and-kurtosis-useful-statistics

	distribution analysis:

	skewness ~ pulled to side
		- 3rd moment
	kurtosis ~ pinched vertically - fatness of tails [normal kurtosis = 3] excess kurtosis = kertosis - 3
		- 4th central moment
	moment

	0 skew = no swek
	-skew = left
	+skew = right

	mean, median, mode


	want a left-skewed (right heavy) (negative skew), mean < median < mode
	
	skew = sum( (x_i - avg)^3 / (n*s^3) )
	avg = average
	x_i = ith sample
	n = total samples
	s = stddev

	kertosis = sum( (x_i - avg)^4 / (n*s^4) )

	*/
	// 0 / 99
	// 1 / 98
	// ... ?
	sad = 1.0 / sad;
	var result = sad / values.length;
	// a low range is bad
	//var result = sad * (1.0/rangeValue);
	return result;