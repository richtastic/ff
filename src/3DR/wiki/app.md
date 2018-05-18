# App Experience / Capabilities

### MVP:
- calibrate camera
- import picture set
- run (low res) modeling
- view (low res) model locally
- save multiple (limited) models
- share models [privately]
	- 


### Extended:

#### share model
	=> needs to upload to server to share
		- save preview image & model resources on server
		- accessible via random hash
	=> would need moderation?


#### save unlimited models locally

#### export as PLY, STL, ... ETC

#### export texture map (+ model)

#### medium resolution

#### high resolution

#### offload processing jobs to cloud




### Screens:

#### main menu
	- browse shared projects [see other's models/images]
	- browse MY existing projects
	- new project

#### project browser
	- summarized with pictures / name / created / modified
		- source images
		- exported model screen capture
		- large model picture in BG [or slowly animating low-poly version]

#### project
	- add image [file browse from documents]
	- remove images
	- edit usable image area [masking out areas not to be used for: point matching / calculations]
	- calibrate camera settings [pick one of pre-existing cameras or do calibration]
	- execute/calculate [perform 3d reconstruction processes] -- iteritive: only do necessary update calculations
		- show progress / status?
			- image pairing/matching [sparse, dense]
			- 3d point projection [colored cloud]
			- texturing
	- view model
	- 
#### model viewer
	- 3d orientable/navigating
	- change camera settings [multiple cameras / views]
	- take picture [create novel perspective image]
	- share model
	- export
		- model
		- texture
	- apply filter (texture) [sephia, grayscale, solarize, smooth, invert, ...]
	- background color/image
#### image importer
	- images
	- video components [may need a separate camera calibration]
		- time-scale grabber
#### image editor
	- brush size
	- add / remove toggle mode



### data structures
- project
	- views[]
	- view pairings[]
	- points3d[]
	- surface model mesh (OUTPUT)
	- cameras[]
	- interactive experience
		- cameras[] 
		- background

- camera
	- calibration

- view
	- source image
	- features [point, size, angle]
	- masking image
	- camera ref

- pairing (matching)
	- view A ref
	- view B ref
	- forward transform (A to B)
	- matched A points2d[]
	- matched B points2d[]
	- points3D[] ref

- point2D
	- point in image
	- point3D is attached to ref

- point3D
	- point in 3D space
	- points2d[]

- mesh
	- triangles3d[]
	- textures[]

- triangle3d
	- texture ref
	- coords3D[]
	- coords2D[]






storage / memory info

project typical numbers:
	10~100  number of images
		each image has ~ 0.2 other matched images
	~N*(1 + 0.2) pairs
		~N! pairs of images
	20~200 pairs
	
	[max 4032 x 3024 ]
	2016x1512 image @ hi res
	1920x1080 image @ med res
	960x540 image @ lo res

	1.2192768E7 pixels @ high res
	2.073600E6 pixels @ med res
	5.18400E5 pixels @ lo res

	~100 medium feature points [medium]
	~0.25 * pixels * (1/25) match points [dense]
		0.25 * (1920*1080) * (1/25) = 2.0736E4 dense matches [20k per image pair]




# EXAMPLE USAGE:
- import camera calibration/registration images
- calculate camera calibration
- import all source images
- create mask images @ source resolution for undesired areas (eg people / variates)
- create feature set for each images
- n*n image source image matching [higher res]
- c*n image dense depth matching [lower res] [use camera calibration / inverse distortion]
- multi-view point following
- bundle/adjust to refine 3d coordinate positions
- 3d point generation
- 3d surface triangulation
- triangle texture mapping
- model viewing










APP TODO:


- show steps on demand as alg progresses
- set a display flag to true
pick up display flag & show the item


needle
haystack
heat map of SAD scores
display score, uniqueness








- review all steps of algorithm...


- how to remove/update queue
	- shouldn't have multiple matches for same cells ?
		[unless they match different to/from] --- injective


- is interpolation location/scale ok?

- is removing / re-adding matches / points ok
-> dropping from queue too ?

- maybe scaling needs some blurring steps?




- 2 BA modes:
1) get top 100~1000 points & best estimated P
	- racalculate P ongoing
	=> save to pair dirs
		- F, P, pairs
-) combine all view Ps & bundle adjust to get optimum Ps final
2) dense point finding given optimal Ps
	- don't recalculate P as it processd
	- more aggressive error dropping




- find out why particular BAD match is good & howit can be prevented



- dense point matching is letting in some bad matches


- local normalization of image


- look at derivatives


- RELIABITLITY (pick highest RANK)
	- maximum difference of local 4-neighborhood / average difference of 8-neighborhood








- save best ~100 pts from each view's P bundle-adjustment
- combine all bundle-adjustments into final BA
	- output to result view











- show when corner has peak 'cornerness' over scales
	- pixel movement error
- show peak corner scores at different scales for a feature
	- use sift orientation







- once matches have top ~3 do more detailed checks across scales/rotations

- once MSER have been matched [top ~3], match contained corners
	- after all have been considered, then do best-matching



https://github.com/vlfeat/vlfeat
- color histogram over entire area
- HOG:
	- 8x8 binning
	- combine over entire picture ???

VL DENSE SIFT
	http://www.vlfeat.org/overview/dsift.html
	http://www.vlfeat.org/api/dsift.html


https://ags.cs.uni-kl.de/fileadmin/inf_ags/2dip-ss17/2DIP_SS2017_lec07_Descriptors.pdf


https://en.wikipedia.org/wiki/Scale-invariant_feature_transform#Orientation_assignment



- get cutout of MSER feature @ even width/height
- how to get primary gradient orientation
	 - peaks in 'local' gradient goups / bins
- extract feature ~ 2~3 x zoom
- remove very similar match pairs from self-image
- feature compare



	 - get corner-score
	 - do blurring
	 - COM-to-corner * windowingFxn
	 - historgram binning






ORB (Oriented FAST and Rotated BRIEF) — OpenCV-Python Tutorials ...
FAST = Features_from_accelerated_segment_test
GLOH (Gradient Location and Orientation Histogram)
HOG = Histogram of oriented gradients





		R3D.ANMS_Full
		R3D.rangeProfileImagePoint
		R3D.variabilityForPoint

		- circular range gray hard to scale-match
		- variability range gray vaguely matches

- corner-geometry
	- first closest corner with score better than mine

-maximally stable extremal regions
-LaplaceAffine
-HessinanAffine

:::
Matas et al : http://cmp.felk.cvut.cz/~matas/papers/matas-bmvc02.pdf
http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.93.6657&rep=rep1&type=pdf
http://vbn.aau.dk/files/219488957/tip_preprint.pdf
https://www.mathworks.com/help/vision/ref/detectmserfeatures.html
http://vision.princeton.edu/projects/2012/SUN360/CVPR2012code/code/vlfeat-0.9.5/doc/api/mser_8h.html
http://icvl.ee.ic.ac.uk/DescrWorkshop/featw-papers/Paper_0007.pdf
https://www.hindawi.com/journals/mpe/2012/857210/
https://pdfs.semanticscholar.org/9ad2/74191ee7b41d1f16cccb1aff8ff2d0a026e2.pdf
http://vista.eng.tau.ac.il/publications/KimCuiBroBroPAMI09.pdf
https://github.com/idiap/mser



??? combine with 'corners' to produce different set of points ?
??? stability over scale SIMSER


-> objects only have coarse localization
-> precise localizations need to jiggle parameters [angle,scale,skew] around coarse approximation
-> exact localization needs to do sub-pixel maximizing around peak match




A) see how distortion-correcting helps R/F in current 100-500 iteration process
	-> converting image takes way too long: 10~30s
	-> correction doesn't seem better, maybe worse [line straigtness]
B) implement kNN dropping to output ~1000 best match points
	-
C) save pair match data in some format [F | P | 2d points | 3D points]
	- 


D) import pair match data & do real BA on 3 views / 3 pairs
	- how to combine P3D with multiple matches [eg average?]
E) add algorithm piece for doing cross-pair matching to get 3D points with 2+ pairs / 3+ matches
	- to add more points to BA approximation & help remove outliers
F) hierarchical dense matching
	- back to grid ?




UB2GL8EB
JS8R1VXQ



FF6ZQTUH:
from: "R04ZYF8K" 1
to: "9I774XQV" 2

H07XXFHR
from: "UB2GL8EB" 2
to: "9I774XQV" 3


JS8R1VXQ
from: "R04ZYF8K" 1
to: "UB2GL8EB" 3



- want well distributed optimizing points



~ preprocessing step to convert images into warped images from camera distorition
	- faster way to inverse-image ?


- DENSE/pair-P method
	-> determine a camera's best P & best points
- BA method
	-> combine 3+ views into single view



- R3D.BA pick best dense points to do BA
	- kNN error dropping

- BA for multiple cameras / points
	- new file format?



steps:
- initial feature matches
- initial high density matching
	-> best F/R points
- bundle-adjustment to combine multiple views
- restricted high density matching




- covariance of pair of images (via gauge scale)
	- tr(C(x,y,z)) = edge weight = sum of eigenvalues
	- DIRECTIONAL weights




- ...


- HOW TO COMBINE: / WORK WITH
	- multi-scaled dense matching
		- start with lower-res image
		- restrict higher-res searching 
	- relative extrinsic matrix determination
		- use most well placed dense matches [highest uniqueness & lowest F / R error]
		- determine top N points between pair
		- BA points+cameras => final
		- contract graph edge
		- ... repeat until all edges contracted




- how does lower-res image handle

- hierarchtical neighbor search structure

- low range dropping ?


- kNN worst score dropping
	~16
- gaussian smoothing ?

- need to bring error down:
	- lower threshold for F/M/R errors
	- lower SAD threshold
	- drop worst F/M/R at end

- do dropping at lower frequency: 20 -> 100 -> 200 ?

- looping behavior prevents new areas from being processed

- would image rectifying make it better?


- a way to exchange DROPPING points to not even saerching the points to begin with?








- DENSE MATCHING:
	- all low separate distance for neighbor SEARCHING vs neighbor 
	- larger patch size means search window would need to be different than just radial / angular saerch
		- masking of areas around found points / vs / unsearched area COMs


- on removing a final match -> research the area
	-> GOAL: ALL BEST-POINTS HAVE THEIR PERIMETERS SEARCHED

	- first find highest corner point in area
	- if a point exists, use that
	- else create a new one & corresponding match
	-> search-add-at area
- might this cause looping-ish behavior ?




REVISIT: BAD ESHAISTIVE MATCHING
R3D.bestPairMatchExhaustivePoint
R3D.searchNeedleHaystackImageFlatSADBin
R3D.searchNeedleHaystackImageFlat

=> FOR AREAS -> SIFT IS BETTER
=> FOR LOCAL -> SAD IS BETTER?




- 





- are best match points not being selected?
- are worse points not being dropped ?

- more opportunities to drop match because of bad rank

- use corner in metrics
- 
- sub-pixel accuracy using surface estimation


- why would combining / merging / overlap be breaking things?

- 




- multiple views don't all reduce in error as iteration increases
	- view match counts peaks ~300-400
		-> around 80-90 the R error went down to 

	-> see how views do individually ... 1 & 3, 2 & 3
		- 1 & 2 -> F:3, R:2å

- how to combine views' absolute transforms
	- 

- with sparse matches on an image how to go to dense matches?
	- 
	- pick lowest-error points to get best P relation ? @ end
	- look at directional errors ?
	- only include points with 3+ matches ?
	- 
	- use best points as seeds & double resolution & search there

- drop points with 'possibility' of higher error ?
	- angle / direction / distance

- epipolar line ordering constraints

- do basic triangulation using sets of 3 on a given image [delauny]



- POINT COUNT NOT MATCH MATCH SIZE:
	R3DBA.js:1720  0 QUEUE SIZE: 915 MATCHES SIZE: 3317
	R3DBA.js:316 NON-PUTATIVE POINT COUNTS: 0,0,3335


- absolute & relative locations of points / cameras during calculation

- draw matches on bundle image
	-> way to compare results are getting better or worse


- what does a full bundle adjust method look like?
	- 


----- overview entire logic again all through





- relative error between cameras is not reducing
	- look at F error
		-> good
	- r error fluctuates a lot


R3D.BA.rError MIGHT HAVE WRONG MATRICES ?
	=>
	errors are now very sporadic

testCams


transform.initialEstimatePoints3D();
info = transform.calculateErrorR(true);


...


- ransac using R not F error ?

- why is there inconsistency in calc of p3d in matches / views
- why do the P3D become fewer and fewer?
	- merging algorithm?

- how to include RANSAC in F / P estimation


- need to remove bad matches from queues too, not just final matches array
- as old matches are dropped, the area needs to be filled as good matches might be skipped over
	- 







algorithm with RANSAC
	- get best points for estimating F
		- at least ~50 points
		- at least ~50 lowest error points
		- at least ~50 groups of 3
	- get initial F
	- pixelError = record current average error with initial F [+ sigma]
	- inliers & inlierCounts = 
	- minimumInlierCount = ~50% of starting OR 15
	- while next-inlier-count > minimumInlierCount
		best inlier group = []
		for some minimal percent ?????
			- pick random points
			- calculate F
			- find inliers within pixelError
			- keep better inlier group
		pixelError *= 0.5
	- calculate best F with best group
	-> P



-> algs have final global bundle adjustment step:
	- minimize reprojection error over:
		- all 3D points [X,Y,Z]
		- all camera parameters [rx,ry,rz,tx,ty,tz]


http://www.robots.ox.ac.uk/~vgg/data1.html





-> trifocal tensor for merging multiple views
	- calc T from point correspondences
	- get F-,A,V,C from T
	- calc P-A,B,C from T / Fi
	- 
	- how to 'combine' these T / P into algorithm ?
		-> graph again ?
	- 






- are larger images better performing?

- when a point is dropped (match)
	-> record for when dropping is complete
	-> retry search in area ? (keep if better than previous dropped match)


--- each 2-vide pair has satisfactory 3D projections
	=> but when combined the averages are very noisy
		-> are the 3D positions ABSOLUTE or still somehwo relative?
		-> are the 3D positions averaged together well ?


--- PROBLEM:
	- getting triplets of points doesn't seem to help all that much...
		- only use triplets of points when possible to determine relative camera matrices
		- only keep very 'best' point3Ds for extrinsic matrix calculation
		- 
		- leave out putatives

- print out stats for only P3D with 3 nonputative matches

- averaging the positions messes it all up ..
	- try a single 3D from the first view ?
	- maybe the averaging is wrong?



-> NO POINTS3D AFTER 200 ITERATIONS???



--- go thru logics and see if anything doesn't add up

--- try increasing merge distances


--- try to find ways to get single pair matches to become group matches


- 'probing' around P3D results
	- if a neighbor 



-> a point3d says it only has a single view / point, but has a match with 2 views
	---> some point3D has a match that has a POINT2D that is not shared by another point2d
		=> after first match is made, subsequent matches are overridden
			eg: p3d = 1-2
				add 1-0
				add 2-0
					=> 2-0 replaces 1-0
	=> SOLUTIONS:
		- combine matches to single point?
			-> this is more like merging
		- use best match, ordered on eg: score / rank






- putative points seem to be orphaned ant left behind

--- match isn't being added / removed from list
-> a match has a point3D who's match is not it

- SHOULD there be a case where a match is replaced on a p3d (projection) ? 
	[cause there is]


x try increasing error on what constitutes a 'same' P2D on merge
x lower error drop rates




---- without projection, groups of 3D aren't merging




3D-neighbor probing
	- for each unknown view in P3D 
		- look for closest P2D neighbor that has a P3D with 'unknown' view [within some radius]
			=> if found:
				- use transform to look for matching point [neighborhood = radius * 2]
					- blind neighborhood or use directional offset
				- create match if good enough
				- add match as putative to P3D
	- ...




~ NEIGHBOR PROBING:
	- for each view pair
		- repeat until no open area available:
			- search local neighborhood for open area (min open angle), choose most corner-like point (peak?) here
				- include ALL non-putative points
				- exclude ALL putative points who do not have a same view-pair
			- interpolation for opposite view should only include non-putative points
			- create purely putative match

~ POINT3D PROJECTING:
	- for each P3D with a predicted 3D location
		- project 3D location onto un-projected views
		- create a putativ match

x INSERTING:
	- look for any intersection/collisins with NON-PUTATIVE POINTS
	- if no intersection:
		- connect P3D
	- else if intersection
		- remove intersection point
		- merge point and intersection
		- re-insert merged point

MERGING:
	- remove all putative points from P3DA & P3DB
	- each view has max of 2 points
		- if only 1 point, or 2 points are close enough together(set to center)
		- else 2 distinct points
	- each point get's vote based on average of each match's rank
	=> each view has final single location
	- for each view pair, to forward/reverse projection
	- while 'remaining' points error is larger than allowed neighbor distance:
		- the point for each view is the COM of 'remaining' points
		- point with worst error over all views is dropped -> repeat
	- create match for each remaining point-pair @ center points
	- combine matches into single P3D
	- return new P3D
-> if any views are not retained => should neighborhood be searched to add back points



x POPPING PUTATIVE:
	- remove next-best putative match from 
	- BEFORE insert:
		- if match is purely putative
			- set to nonputative
		- if match has non-putative elements:
			- disconnect P3D
			- set match to nonputative
			- drop non-putative elements
	- insert match

DROPPING:
	poor matches:
		...
	poor p3d:
		...
	poor p2d:


RESETTING:
	putative matches who's recorded errors have changed
		...




MERGING PROCESS:

	=> get initial view points:
	- for views with 1 point => choose this point
	- for views with more than 1:
		each match votes for a point in each view based on rank
	- choose point with lowest average score

	---- need to keep track of all of:
		- position
		- scale
		- angle

	=> for each view:
		calculate COM
		while any points are outside the COM target area:
			=> if only 2 points:
				drop 2 points -- nonagreed match
			else:
				=> each source point records:
					average total distance from each other point
				=> drop worst point, recalculate COM


	- for all remaining views [at least 2 points remaining]:
		- create a match between view pairs
			- relative angle / scale = AVERAGE of all 'points' involved [if a point is in BOTH views it can/should be counted twice]
				- if a
				- > if any relative angles/scales are off: drop?
		- get match score using averaged position/angles/scales 
		- if match score is too poor => drop match
			=> else add to match array


	if 0 matches remain:
		- return original P3D with best average match score?























---- keep all items connected to P3D
---- P2D should be duplicates so that removal is ?... ?
---- should point2d putative be added to the view pointspace?
---- match should remove from P3D if P3D has more than 2 points
---- P3D should remove all 'other' putative matches

how to merge putative with nonputative P3D


- rewrite insert / merge:
	from queue:
		- if P3D only contains 2 point2d
			ok
		- else P3D has at least 1 other nonputative point2d
			- remove match from P3D: [one of match's point2d should be nonputative]
				- if P3D has only 1 match ok
					- disconnect P3D from everything
				- else
					- for pointA & pointB
						- if has only 1 match ok
							- remove point2D from P3D point list
						- else 
							- duplicate point location and attach to match
					- remove match from P3D match list
					- create new P3D with same match core points, but new 
				- set match points as nonputative
				- insert (now) standalone match

		- set match points as nonputative
		- DO INSERT

	insert:
		- look for intersection of any point2D in corresponding view
		- if no intersections:
			- connect
		- else
			- disconnect intersection
			- merge point & intersection
			- re-insert merged point

	merge:
		- choose A = p3d with better average score as base
		- remove all putative points from p3dA & p3db
		- collect unknown & known view groups
		- for every unknown view of A:
			- for every known view on A:
				- find best location match for unknown view
			- average new locations
			- if new location is near all estimates [~2 pixels]
				- create matches between this new point & known points
		- create new P3D from all new points
		- return new p3D

-- markRemoved probly breaks stuff

--- match not checked for inside view before adding ...

- match intersection should check to see if it's intersecting with itself before doing merge
	=> remove self
	=> check for collision
	=> add self [non-putatives]
- collision:
	- ignore putative points in combining, replace any putatives in 

INTERSECTION / COLLISION:
	- remove putative match from P3D if P3D has more than 1 match
	(there should be no such thing as a P3D with all putatives)



- projection of known P3D into unknown views & making matches in queue

- dropping known matches due to P3D changes, P2D changes, 

- dropping pending matches to allow for P3D re-projection to possibly better points


---- does merging a single match at a time cause any conflict / duplicated points in same views ?
---- current logic just chooses more-matched set

R3DBA.js:3407 (5) [0, 0, 4338, 24, 0]




- allow closer neighbors : ~ 2 pixels
	- merge at larger distances: ~ 4 pixels

- revisit lense distortion using known method
	- does refinement need to also adjust K values ?
=> 1/1000 % error not tolerated for linear
=> 1/100 % error not tolerated for nonlinear
-> is accuracy the problem?




x keep a queue of matches ordered on rank
x on init, add matches to queue
- each 'iteration' is a series of:
	- pop M matches off queue, and attempt to add
		- insert match 
		- search 2D neighborhood to create more matches, until no more space exists
	- go thru all P3D
		- project point to unknown views, create 'temp' match add to queue
	- drop bad matches
		- if count > ~16 & and aspects are too far worse from mean 
			- drop
			- use points A & B from dropped match points as P2D neighborhood search

	- 

- use corner score as best way to choose base P3D on merging, instead of score / rank

-> get tabs or whatever in app to toggle between actual usage: image upload, view, edit, model

- is P calculation still way off
- is P inversed or altered in some way in the process ?
... why IS reprojection error so bad ?
- sometimes inverted, sometimes not?
	- are all transform methods being used correctly
=> CHECK ALL USAGES



- allow optimum orientation checking on initializing points

- get better population modeling of one-sided errors WHAT DISTRIBUTIONS ARE THESE
	- PRINT OUT DISTRIBUTIONS:
		- score
		- rank
		- f error
		- r error


- can the P3D error be minimized keeping the Ps constant?

	- calculate P
	- refine P
	- refine P3D
	REPEAT ?


- can dense match allow for dropping points ?
	- if it is very different than neighbors ?
	- if score is much worse than neighbors ?
	- 

- output dense results & import to BA



- once in a 'stable' location, maybe the Ps stop being linearly estimated?, and jsut reused from last location?

--  is camera K interpolateded correctly
fx / fy / s ?
	- test with different options and see ?


- after first initial matches: some point-pairs may not have a match
	- because match was inserted not derived


- P2D & P3D queue should be based on elements NOT ALREADY ADDRESSED
	- REPEATED CHECKING FOR ELEMENTS

~ if initial projection errors are very big, 3d-point-projection cost may not be worth it


- matching is not robust enough ... 


- progressively drop more points with higher criteria (sigma: 4->3->2->1)

- P3D Fail points [to discourage retesting failed locations]

- local P2D searches to see if there's a better match at a neighbor ?

- drop points that project far outside (past margin of error) outside the image

- more 'dense-depth-matching' type prioritization / iterating
	- rank

- worst-matches vs best matches to isolate location of points?

- drop worst P3D points when final exporting

- point scale/rotation may not be very optimal
	... try to retry / refine at some point?




- Trifocal tensor for 3 view approx ?


- look at points 'close' together in 3D space [kNN] and see if the are good matches in 2D
	=> merge

- frop

- is P3D absolute location calculated correctly? (multiple sources)
	- error windows, not just percent averaging


- 
projecting:
		- ERROR SOURCES:
			- projection location far off
			- position alignment
			- neighbor angle/scale far off
			- objects move in space [covering/obscuring]
			- asymm scaling of items

	 - optimal locations are wrong
	 	- print out compare points ?
	 - score should be ~ same as average [less than ~2x]
	 - if interpolated 2D points == projected optimal point => good indicator of converging estimations

	 - ignore points if optimal location is on border of search location

- NEED GOOD UNIQUENESS SCORES FOR PROJECTIONS & PROBINGS
	
	- uniqieness?


- projection via P3D average vs projection via several P3Ds ?? is this possible?


- criteria for removing P3D?
	- average scores median / sigma


CONSERVATION OF SCALE AND ANGLE [ACCURACY IS ONLY WITHIN .1s & 10deg]
- once around any loop in match2Ds should result on 0 angle and 1.0 scale
	-> check to see how off these are
	-> iterate to solution ???



- get new case study set & camera calibration @ same time



- see what undistorted images look like
	-> linear distortion is very bad for reprojection points
		- try nonlinear?
		- try nonlinear with K + dist.
		- 


- dynamic dense:
	~ not starting with best points
	~ clustering around other point happens too much
	~ print out images in sequence to test algorithm

- revisit failed points & how they are currently being used?
	- record/reset from F?

- what does using/updating F matrix entail?
	x F-matrix manager
		- on final point decided:
			- recalculate F from points
			- record error statistics
		- as error gets less, recalculate less often
			- stop ~100 ? or error < 1 pixel [or % of cell radius]
	
	- how to drop points afterwards when F is more accurate ?
		retro dropping
-> not using F actually results in better results
	- use lighter F scoring?

- forward-and back point match searching
	-> whats wrong with symmetric nextB = [] ?????
- sub-pixel accuracy in various points?




CHI-SQUARE DISTRIBUTIONS FOR ERROR:

	Chi-Square: squared normal distributed variable

	k = 1: X
	k = 2: X + X

	mean = k
	sigma = sqrt(2k)


	f(x) = 1/(GAMMA(k/2)*2^(k/2)) * x^(k/2-1) * exp(-x/2)

	@ k = 1:
	= 1/[GAMMA(0.5)*sqrt(2)*k^(-1/2)] * exp(-x/2)



	X^2 = sum [ (ob - ex)^2/ex ]



	MINIMUM => 0


	Observed = ?
	Calculated = ?
	sigma = ?
	chi^2 = sum(i=1 to N): (Observed - Calculated)^2 / sigma^2
		 = (x_i - u)/u


	reduced chi-squared statistic






- intermediary step:
	- pick cell points that look good at higher & higher scales 
	1 * cellScore @ 1
	0.5 * cellScore @ 2
	0.25 * cellScore @ 4 
	...

https://piazza-resources.s3.amazonaws.com/hz5ykuetdmr53k/i2c8h15sptx3kq/16.2_MOPS_Descriptor.pdf?AWSAccessKeyId=AKIAIEDNRLJ4AZKBW6HA&Expires=1519952044&Signature=ngbvKO9ykNMyu98oMKS4AgWucrg%3D
https://courses.cs.washington.edu/courses/cse576/13sp/projects/project1/artifacts/ykhlee/Report.htm
	- 40x40 subsampled every 5th pixel
		- low freq filtering
		- localization error
- multi-scale corner detector should use gaussian smoothing & halving, not arbitrary scales


- redesign bundle adjust:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
> need to keep track of attempted & failed neighbor projections [dead ends]
	- these need to be 'reversible' as the model changes & failed points may need revisiting
> need to keep track of projected attempts? [does this just happen every iteration for every point3D w/o a point2D in given view?]


SETUP STEPS:
	- define:
		minNeighborhoodRadius ~5			1		7
		avgNeighborhoodRadius ~11 [target]	2		15
		maxNeighborhoodRadius ~21			4		29

	STRUCTURE PASSING:
x		- for each camera
x			- create a camera object
x		- for each view
x			- create a view object
		- for each view image:
			- undistort image based on view's camera distortion
x		- create a blank transform / match pair for all view pairs
x		- for each match pair
x			- create match object & add to transform
x			- add points to views [using undistorted locations]
x	INITIAL METRICS
x		- for each point match
x			- get descriptor at each of 2 points
x				- record score
x		- for each view match
x			- create transform: R + F
x			- calculate F 
	REMOVE CLOSE POINTS:
x		- repeat until no pair is found:
x			- for each 2D point
x				- for each other point in same view
x					- if 2 points are closer than 1/2 min radius
x						COMBINE POINTS
	- RECALCULATE METRICS
		- view-pair M
ITERATION STEPS:
x	- INITIAL PROJECTION
x		- for every view pair with enough point matches [10~16] && no transform F yet:
x			- F
x			- R
x		- calculate METRICS:
x			- points: F, R
x			- pair: F, R
			
x	- GROUPS [GRAPH]:
x		- estimate absolute positions of each item
x			- error of relation ~ RMS / mean reprojection error
	
x	- SETUP:
x		prioritize projection queue with 3d points based on:
x			- possible projection exists [not already 'failed'] [if failed attempt is stale, set back to possible proj exsts (r changed less, f changed less)]
x			- average match score
x		prioritize neighbor queue with 2d points based on:
x			- possible check exists (all other views: minimum angle neighbor exists)

	- PROJECTING [expanding P3D base, merge, join, compound]
x		- for P3D in queue:
x			- for each P3D un-matched view:
				- project P3D into view image plane [projectedPoint3DFromPoint3D]
					- if inside image area [inset neighborhood min radius]
						- for each other P3D-matched view
							- use closest ~3-8 2D neighbors to interpolate location, scale, orientation
								- search for several combinations of scale/orientation to find peak match in neighborhood ~ min(rError*2, maxNeighborhoodRadius)
								- scale offset [0.9,1.0,1.1]
								- angle offset [-10,  0, 10]
							- choose best location for other view 
						- best point = average of individual other view best points
						- create decriptor at best point
						- if descriptor passes criteria: [minimum range, minimum variability, ?]
							- get matching scores for each other view
							- if each matching score for each other view is better than the average-matching-score for respective views:
								- good match point:
								- if there are other 2D neighbors [within minimum radius]
									- if projection of new point to all neighbors is inside cellRadius
										- combine P3Ds
											- merge all P2D to same P2D
												=> find median point in all other views
												=> need to recheck if any points are now too close to eachother
										- RECORD NEW SCORES FOR CHANGED FEATURES
									- else:
										- SET P3D PROJECTION ATTEMPT TO VIEW AS: FAILED
											- record point, existing views used, r error, f error
								- else:
									- set as new 2D matched point assigned to P3D

x	- PROBING NEIGHBORS [probing, extending]
x		- for P2D in queue:
			- get list of all points in view at distance maximum neighborhood radius
				- for each other view:
					- select only points that have match with other view [including dead-end points]
					- find smallest angle larger than minimum neighborhood angle [~45 degrees]
					- if no angle exists
						- record that point2d's neighborhood is full [dead end] to prevent future searches here
					- else
						- create serach map using minimum radius and maximum radius - min rad [window]
						- find best corner location in this window in view
						- create descriptor at best corner point
						- get ~8 NN around corner point [convex hull if possible] & interpolate scale, angle, position in other view
						- create neighborhood circle mask around estimated location of target radius size
						- search opposite view for best matching location
							- iterate over several relative scales & angles, s=[0.9,1.0,1.1], a=[-10,0,10]
						- create descriptor at points in each view with optimum relative scaling [ie larger item is scaled down]
						- if match score is good for both view's local point matches around:
							- create match between two views & 3D point
						- else 
							- create dead-end point in view (not opposite view?)
								- record:
									- m score
									- f error
									- r error [if a point was to be created]
						...
			- ...
	- BLIND SEARCH [guessing, seeding]
 		- pick points in un-covered areas with large corner values
 			- for each view
 				- find large areas with no p2Ds [or FAILs]
 				- pick best point with large corner values
 				- for each other view
 					- search along F line to find best point
 					- if points are good match (score, F, R)
 						=> create new match & P3D

	- RECALCULATE METRICS FROM P2D/P3D
		- each view re-estimate: F, F error, match score
		- determine P3D exact position from each view-pair P2D's putative guess based on reprojection error rates
		- each view re-estimate: R error
	- DROPPING BAD
		- for each view
			- for each p2d
				- drop if way outside (all/any) view's median scores: f, r, m - FOR VIEW GROUPS [compare the point's ferror to the view's ferror] [removes 'singles' with high error]
		- for each p3d
			- drop if way outside (any/all) median scores: f, r, m  - FOR P3D GROUPING [compare the point's reprojection RMS error (over all)] [removes 'groupings' with high error]
		- r check
		- f check
	- REFRESH FAILS
		- if a pair has fewer than ~10 points for F, then transform should be reset to 0 / nil / invalid
		- for each p3D
			- if any failed R or F error has changed [~ half of failed's recorded value] => reset to null to allow new reprojection attempt
		- for each view:
			- for each P2D-Fail
				- if any F error has changed [~ half of failed's recorded value] => remove from view point space [to allow new neighbor attempt]

	

INIT COMBINING POINTS:
	- P3DA already exists
	- P3DB is being added
		=> calculate scores for each of match pairs [2]
			- A->B & B->A should have close points
				> average midpoint
	P3DA & P3DB

		- choose P3D with better average score to be 'base'
		- for each view-point in P3DB
			- for each view-point P3DA [except for same view]
				- determine optimal scale | position | rotation @ new 'potential point'
			- if all scores and placements are < 2 * avg score & within radius:
				- add or replace P3DA-view-point with new optimal point
		- remove P3DA-set & readd
		- repeat until no collisions


COMBING P3D PROJECTIONS:
	- is score good:
		- add P2D to sets
		- is close:
			- each P3DB known p2d is close to each other known P3DA known
				- use P3D(A) with best score as base
				- remove P3DB
				- add P3DB new points to P3DA based on average location
				=> need to readd to check for other collisions
			- else
				=> FAILED P3D
	- else
		=> FAILED P3D

COMBINING P2D PROBES:
	- is score good:
		- is close:
			* SAME as P3D combine
		- else:
			=> failed P2d
	- else
		=> fail point p2d


camera
	- k
	- distortions
view
	- camera
	- image
	- size
	- points2D [quadtree]
	- absolute transform

transform2D
	- viewA
	- viewB
	- Ffwd / Frev
	- errorFMean
	- errorFSigma
	- errorRMean
	- errorRSigma
	- matches2D[]

point2D
	- x,y
	- matches2D[]
	- point3D
		> if null == DEAD END =>
			> list of attempted compared views & how 'long ago' (in model delta changes) this happened
	- isDeadEnd
		- matches will hold the views attempted

	
match2D
	- viewA
	- viewB
	- point2dA
	- point2dB
	- score
	- relativeScaleAB
	- relativeAngleAB
	- errorFdistanceAB
	- errorRdistanceAB
	- errorFdistanceBA
	- errorRdistanceBA
	- transform2D

point3D
	- x,y,z
	- points2d[] // place for each view, p2d = exists, fail = tried, null = not tried
	- matches2d[] *?

P3DDeadEnd
	-> result of failed projection
	- location [for single view]
	- R mean error   [for single view]
	- R sigma error
	- F mean error  [for single view]
	- F sigma error
	- M mean error  [if valid reprojection]
	- M sigma error

P2DDeadEnd
	-> result of failed neighbor search resulting in no matches
	- locations[1 for each view]
	- F mean error [across all views]
	- F sigma error
	- M mean error  across all views]
	- M sigma error

world
	- views
	- transforms [relate 2 views]


* if a point2d exists, it will always have a match, a 3d point
* a point2d might be a 'dead end' and have no content other than placed as an unmatched point

....... notes:

- GET LOW-RES DENSE MATCH TO UP F-ESTIMATE MATCHES
	- DROP:
		- 2D points with poor F-distance error (relative to group)
		- 2D points with poor R-distance error (relative to group)
		- 2D points with poor match score 
		- low variability (just don't include)
- USE THESE MATCHES AS BASE FOR BA
- IN BA, ALLOW FOR NON-PREDEFINED POINTS TO MATCH
	-> HOW TO MATCH NON-PREDEFINED POINTS?



COMBINING POINTS IN BA:
	- A-B-3D projected to C
		- use closest N points to approximate angle and scale
			- iteritively pic location ? wiggle?
	- if good match:
		- average the best points into single point
		
		- if not near anything
			- create new point
		- if near other points
			- if VERY CLOSE
				- combine both 3D points somehow
					- which points should adjust?
					- average optimum locations from P3DA with P3DB
			- HOW TO COMBINE ALL MATCHED POINTS?
			- NEED TO ALL HAVE SOME GOOD SIZE-SCALE COMPARRISION??????
				- this is the 'resolution' of the grid
				- min [eg 5] ~ 1/80
				- max [eg 21] ~ 1/20
				- ideal [eg 11] ~ 1/40
			- WHAT IS 'CLOSE'
	- P3d?
		- very close to other P3D
		- all matches are good
		- all F errors are good
		- all R errors are good


- dense matching iteritive cell size matching
	- higher res to lower res ?
	- take lower res best matches & do higher res
		- PREP:
			- each point should allow minor rotation/scale/movement to optimal location
	- adjust F as the number of points increases past original point set ????
		- keep list of matches & scores for calcuating F?
		- need to combine original points with matched points
... dense still trying to match low-range areas



DENSE -> F
drop lowest point matches by:
	score-error
	F-error
RE-DENSE with better F & lower error





- undistort images before F estimate ?
- does this result in better matching ?





-> F-estimate 0 ~ 100
-> dense neighbor search: 100 ~ 50 ~ 200
-> F-estimate 100 ~ 125
...
-> F-estimate ~ 200



- iteritive matching is not acually doing and point maximizing ...
	- currently reduces to the best of the best matches
	- if too few points, it starts grabbing worse point matches
	=> want to pick up more matches too
		- F error
		- match error
		- match second/first ratio

=> optimal F-error / match-score-error goal?
	lower of both
	f*m ?

average error
RMS error


GOAL: limiting F error => force to use more-correct points
	FAIL: lose existing match in 
GOAL: choose scores with lower error => choose more-correct points
	FAIL: a mildly better score might be a worse match [non-unique or bad matching]

- keep track of better / previous: match scores / match errors ?




- with best points, zoom out by 2 and pick still best matching -- more stable points?



--- rotational direction is still not accurate
--- feel like there needs to be more points in order to catch everything ==> this might require larger images



----- inner / outer concentric circle comparrisions


x ----- historgram max/min ratio
----- inner mask vs outer mask

- if using corners, how to get orientation?:
	- SIFT maxiumum gradient direction [+/- neighbors @ 80%]
	- corners should have 1 primary direction ?
		- pick zoomed-in carefully gradient primary direction

- extract area image by:
	A) scale to 2ce desired size
	B) blur
	C) scale by half


------ peak gradient average at middle
=> how does this behave AROUND corner ? ---- exact center matter
=> how does this behave with different window sizes
--- picking 'max'/'min' location: largest elevation change (not including end points) of EITHER min or max
--- throw away points that have multiple max/mins ?



- use neighbor corner with highest score [up to ~10 neighbors ... ?]
- use averaging of nearest ~3 neighbors radius sizes
x first neighbor to have a score higher than the next neighbor
- peak in ds/dr [division by 0]
x move-any direction at multiple scales [per pixel or static size] peaks


- corner geometry still not solved for size
	- corners look ok
	- scale for geometry corners not matching up

		- recheck how color gradient performs [currently is ]
		which is better:
			- as-is histograms
			- should offset minimize & normalize scale?

		- scale SAD-SIFT by maxium length >1 around cube intersection
			 -- closest intersction of 3 [6] planes => move into +,+,+ cube & intersect with positive .5,.5,.5 planes

		- figure out how to decide size
			- dcount / dradius
				- 1/2 => 1/1
				- fit parabola ?

		- parabola from point set

		- derivative of parabola => find when slope = m

		- circular sift pattern HOWTO
			- radius size (pixels)
			- r1 = entire inner circle
			- r2 = segmented portion outside r1
				- divide angles by % area in 
					- r1 = pi*r^2
					- r2 = pi*(r*3)^2
					- diff = pi*r^2*(9 - 1)
					- r^(i+2) / r^(i) => divide by FLOOR of difference
					: eg: 
r1 = 4
areaR1 = pi*r1^2
r2 = 2*r1
areaR2 = pi*r2^2
ratio = areaR2/areaR1 % 4 = (2)^2 => 4 angles
r3 = 3*r1
areaR3 = pi*r3^2
ratio = areaR3/areaR1 % 9 = (3)^2 => 9 angles
...
1   1
4   5
9   14
16  30
25  55
36  91
------ every other:
1   1     1
9   10    2/3
25  35    1/2

GLOH:
1 : 8 : 8
1

			- r3 
			... up to some outer r

- METRICS FOR THE ITERITIVE IMPROVEMENT OF 3D MODEL:
	- F point-line distance error
	- 3D->2d reprojection error distance
	- 3D location 'error volume'
	
	- average/mean error
	- 

	- adding a point/pair/3D should reduce error in some way
	- removing a match should reduce error in some way (don't want to remove everything)


- give corner-geometry points scores

- ratio-disqualifying does not seem good
- score subtraction rather than ratio?


x drop very close corner-geometry points

- dropping matches after initial grab
	- bymatch score
	- by F distance

TOO BIG AN AREA ~ everything has a poor score
TOO SMALL AN AREA ~ everything has a good score
	=> do sigma dropping



IMG_7521.JPG
IMG_7525.JPG
IMG_7523.JPG





-- 3DR refininig
	- initial 3-pair views are lined up bad
		- 
		
	- switch from SIFT comparrison to SAD comparrision

	- pair F-related try to aquire more neighbor matches

	- how to do point comparrisons if each point can have multiple scales
		... compare each ? take best score?
	- 
	- 
	- color 3D dots the color of the pixel(s) it subsumes





- one-sided R3D match search for epipolar lines inside/near image






SAD-SIFT SCORE:
		-- a fair amount of drift on non-distinct items
	- normalized: matches a lot of shitty things as it trails off of seed point
	- unnormalized: trails off





--- KEYS to SIFT DESCRIPTOR:
	- using histogram un-localizes the variables
		- not averaging
		- sums attributes in area
			- minor shifts are tolerated
			- minor changes in gradients are 'averaged' out

	/ saturation (also called “chroma”)

http://infohost.nmt.edu/tcc/help/pubs/colortheory/web/hsv.html


x) SIFT histogram using gray-center RGB 8 quadrants w/ mag = gray-offset vector length
x) color gradient histogram [average-color delta] 8-color quadrant
x) SIFT histogram using hue angle & grayscale-RGB-length as magnitude
x) SIFT histogram R/G/B values
-) 
-) 



- GOOD COLOR DISTANCE METRIC
	- red is just as different from blue as it is from black

		euclidean:
			sqrt( |ra-rb|^2 + |ga-gb|^2 + |ba-bb|^2 )
		?:
			?
		?:
			?
		?:
			?

	https://en.wikipedia.org/wiki/Color_difference


---- could keep top-matches & do another round of matches using only these tops



try to combine colors in same way SIFT adds gradients:
===== little summaries aggregated over
	color is a magnitude: (light/dark) & 2/3 angles ?
	- binning colors ~ just a lower res [not good differentiator]
	- centers of mass / devecits [seems like a color averaging/scaling]
	- histogram in sub-areas ~ averaging
	> do aggregation at the COMPARE step
		- for each sub-section:


--- in iteritive RANSAC, scores of matches should be used in error metrics

--- drop large corner-geometry features

- tinkering with feature descriptor more
	- size [3-5]
	- falloff
	- flat vs grad combinations
	- blurred vs original
	- rgb/hsv/..
	- clamp high grads
	- 2D vs 6d gradient vectors
	- offsets from 0, min, averages, 
	- 
	other proprerties:
	2nd derivative


	- scale by entire 144*8 vectors as individual components
	- can scale by maxium 144 vecto

	- HSV ==> HUE IMPORATNT, SAT/VAL LESS SO

	- combine multiple 'flat' metrics




- allow for increasing (dynamic fat matching cut-offs)
	- ~100 minimum


----- try to find scale space maxima for corner points
	- maximum blur - subtraction value for gray
		scale & check value of:
			blur
			entropy
			circular distance SAD subtraction per pixel
			variability per pixel
		- scale profiles
			fxn values at various scales
----- revisit SIFT descriptor


===== performance eval:
	pick a single feature & see the scores among a various bunch of other features 

-- plot entropy profiles / values at different scales along with picture of area

-- angle select: most prominant direction
	- high mass vs low mass [from average?]
	- gradients
	- 


- compare SAD scores
	- blurring / vs non-blurring
	- with various errors in angle [0,10,20,30,40]



=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-


- allow for multiple point2d with different scales at same point
	= to allow for more matches to be made


- initial matches still fairly poor
	- still have basic color mismatches
		- combine SAD w/ sift (initial try bad)



- add transform error for graph weight based on PAIR F/R error



- before/during feature matching: remove duplicate match-points







joining disjoint groups:









- how to go from refined X points to M matrices ?
	M = f(Xi,xi) @ 6 unknowns rx,ry,rz,tx,ty,tz
	"Pose" from known 3d points
	http://www.uio.no/studier/emner/matnat/its/UNIK4690/v16/forelesninger/lecture_5_2_pose_from_known_3d_points.pdf
	https://dsp.stackexchange.com/questions/1727/3d-position-estimation-using-2d-camera

	http://openmvg.readthedocs.io/en/latest/openMVG/multiview/multiview/

	6pt Direct Linear Transform [HZ],
		7: computaation of camera matrix P

	https://www.cs.umd.edu/class/fall2013/cmsc426/lectures/camera-calibration.pdf

	https://www.cs.utah.edu/~srikumar/cv_spring2017_files/Lecture3.pdf
	http://ags.cs.uni-kl.de/fileadmin/inf_ags/3dcv-ws11-12/3DCV_WS11-12_lec03.pdf

	https://www.safaribooksonline.com/library/view/programming-computer-vision/9781449341916/ch04.html
	http://www.cs.ucf.edu/~bagci/teaching/computervision16/Lec9.pdf
	http://teaching.csse.uwa.edu.au/units/CITS4402/lectures/Lecture08-CameraCalibration.pdf



	http://ksimek.github.io/2012/08/14/decompose/

	https://en.wikipedia.org/wiki/Perspective-n-Point


with known K ?

A) use DLT to find P
.) M = first P_3x3

.) C = null vector of P



A = QR
	R = upper triangular (upper-right)
	Q = orthogonal (Q*Qinv = I)

multiply by Kinv ???

isolate R & t

P = K[R|t]
	PC = 0
	M = KR
	QR decompose 
	=> if know K:
		R = Kinv * M ?
=> force orthonormal?
=> ????

numeric.QRFrancis


- upload camera images
	- camera double-check point location checks
	

- how to derive TFT minimization equations [4]
- trifocal tensor how-to-calculate (from points) / robust iterate
- TFT nonlinear estimation
- TFT sparse

- dense alg:
	- smaller cells are better:
		-for accuracy
	- larger cells are bette:
		- connect space
		- discard mismatching seeds
	- 
	- some SAD scores have to be horrible ??? 
	- does dense use SAD scores at different scales? eg: 1,2,4 ?

- corner feature size should be based on something ...



- recognizing outliers at various points in algorithms -- revisit

fullMatchesForObjects






- triangulate.html broke

- use 2d quadspace to display feature locations onto image

- how images perform with large image
- scrolling zoom gadget via mouse
- scale brush size with gadget


- triangulation not working
- POLY2D error

- triangulate projection textures from camera (from 3D points to 2D points [currently reversed])

- app visualizations
	- 2-view dense match [texture-show]
	- cameras in 3D space along with projections to 3d points
		- filter display by pair or tuple or ALL
	- 


ALGORITHM TODO:

TRIPLES:
- from 2 separate dense matches to 3-view tuple
	- for each matched pixel in image A [A-B]
		- is there a match within cellsize/2 radius in [A-C]
		- is the SAD/SIFT matching A-B, B-C, C-A all similar in score ?


BUNDLE ADJUST:

- use triples as a basis for bundle-adjusting
- iterate on: K, P3D (xN), p2d(xNx3), [A-B], [A-C]
	- while total error is decreasing with some minimum velocity:
		- for each triple:
			minimize error for all variables involved in triple
				[K should be fairly fixed ... was determined independently]
				[2d points should be fairly fixed ... ie high-movement should force high-error]
				[3d points should change]
				[Pa,Pb,Pc  should change]
				=>
					change 3D points by some minimum amount (maximum volume dimension * 1E-6)
					change camera positions by some minimum amount (maximum origin volume * 1E-6)
					change camera rotations by some minimum amount ()
		- need to be able to drop matches that contribute a large portion of error
				- if error created by point is above some stddev of rest of data
					- use BEST data [knee point / min count] as population to estimate stddev
		- total error = sum of individual triplet error

	variables: 

- data:
	Camera Matrix K:
		- [values]

	Point3D:
		- projections:
			point2D [view A]
			point2D [view B]
	View:
		- transforms:
			transform:
				- T3D[A-B]
		- points:
			- point2D
			...
		- camera K

	point2D:
		source: point3D
		view: View

	Transform3D:
		- viewA
		- viewB
		- matrix


OUTPUT:
	refined K, Camera_i, points2D, points3D


output can be used to:
	- only keep tripled/optimized 3D points [ignore many more ]
	- reproject 2D points to 3D (keep as-is 2d dense matches)
	- reuse triple 3D points as dense matching seeds, to reiterate bundle adjustment
	- 






SPEEDUPS:
	- 2x+ using native coding language
	- 2x+ using matrix libraries
	- 10x+ using file i/o [some places]
	- 2x+ using caching [some places]












