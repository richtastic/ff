# App Experience / Capabilities

[ | moments | momento | yao | chumbee]

### MVP:
- calibrate camera
- import picture set
- run (low res) modeling
- view (low res) model locally
- save multiple (limited) models
- create picture of scene [basic 1920:1080 / panorama]
...
- view example / feature projects
- offload processing jobs to cloud [centralized code to prevent skews]
- share models [privately]
	- read/edit access

### Extended:

#### share model
	- save preview image & model resources on server
	- accessible via random hash
	=> moderation?

#### export to 3D-view scene (oculus, cardboard, ...) [+1]

#### add audio to scene [+1]

#### create video of scene [+1]

#### save unlimited models locally [+1]

#### export as PLY, STL, ... ETC [+1]

#### export texture map (+ model) [+1]

#### medium resolution [+1]

#### high resolution [+2]

#### community interaction (comment, like, sharing)


- adding features should have free try before buy
	- A) do it a maximum number of times ever (10)
	- B) do it a max number of times per n (24) hours
	- C)


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



### PITCHING
	- you're outside alone in a park, meditating, hiking, enjoying yourself, you think to yourself this would be a nice experience to relive later, or share with someone who couldn't make it
		- you take a dozen snapshots of the scene around you
		- you record 30 seconds of ambient audio of the area
		- you upload these to a new project in the app
		- next week you show your friend (via screen-view or cardboard) and they feel as if they were there

	- you're walking around a neighborhood, you become intrigued by a new kind of flower you've not seen before, but can't appreciate it as much because its so small
		- you take 6 photos, upload to the app
		- you zoom in to see the detail
		- you share a zoomed-in photo on the instagram

	- you're on vacation and you see one of the world wonders
		- there's tons of people in the way preventing you from getting a great shot
		- you take a dozen shots from various less-optimal angles/locations
		- the app allows you to see the wonder from a position you wouldn't be able to in the real world

	- you want to make a 3D print of something you see on the shelf
		- you take several photos of the object
		- you export to a 3d-file format
		- you print on your makerbot

	- you're a 3D modeler and there's a real-world scene you'd like to include in a new video you're making
		- you take dozens of pictures of the scene
		- you select some of the items you want removed from the scene, or scaled differently
		- you export the scene into a 3D studio file
		- you jumped ahead to a starting place for your video project

	- you're thinking of painting some walls in your house
		- you take a few photos of the room
		- you choose a filter to color part of the scene something else (or draw on it)
		- you send the picture to your friend to see if she agrees.

	- you're a museum historian and want to make public heritage artifacts available
		- you set up your artifact
		- take several photos from various angles
		- you put the model up on the museum website

	- social sharing

	- measure something?

	- artistic redesign / filter the world

	- export to oculus







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
	~N*N(0.2) pairs [ (n*)/2 - 2 pairs possible ]		CURRENT GUESS OF AVERAGE GRAPH CONNECTIVITY
	~N*N(0.1) triples [(n^2 -n)/2 - 2 triples possible]
	20~200 pairs
	10~100 triples

	[max 4032 x 3024]
	2016x1512 image @ hi res [triangles]
	1920x1080 image @ med res
	960x540 image @ lo res [BA]
	500x375 working res [features]

	1.2192768E7 pixels @ high res
	2.073600E6 pixels @ med res
	5.18400E5 pixels @ lo res

	100~1000 initial features
	50~100 matched pair features
	~10k matched dense pairs
	100~1000 track points per pair
	2-5 avg track length CURRENT GUESS OF AVG TRACK LENGTH

	[100-1000] * N track points total
	10K * N 2D dense points total
	10K * N/3 3D dense points total

	10 images:
		20 pairs
		10 triples
		1E3-1E4 track points [10,000]
		1E5 2D dense points [100,000]
	100 images:
		2000 pairs
		1000 triples
		1E4-1E5 track points [100,000]
		1E6 dense points [1,000,000]






# EXAMPLE USAGE:
- import camera calibration/registration images
- calculate camera calibration
- import all source images
- ? create mask images @ source resolution for undesired areas (eg people / variates) => this should maybe be automatic
- create feature locations & descriptions for each images
- n*n image source image matching (pairing) [higher res]
- ~n*log(n) image pair initial reconstruction / relative camera orientating (lower to higher res iterating too -- divide cell size until cells ~3)
- initial global camera absolute orientating
- BA+Track Expanding + point expanding camera absolute optimizing (multi-view point following)
- final global BA => 3D absolute point generation (structure) & camera geometry (motion)
- ? bundle/adjust to refine 3d coordinate positions
- 3d surface triangulation
- triangle texture mapping
- model viewing












APP TODO:

NEXT-STEPS-TO-DO:

=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

- individual image feature detection
	- high-cornerness
	- get feature absolute size / angle
	=> image features to compare to other images
- pairwise image feature matching
	- generate feature descriptors for each image
	- find best matching features
	=> matching feature points w/ relative affine transform
- pair-view relative orientation transforms
	- iterate cell size for finer detail (~5 iterations to cell~3 pixels)
	=> pairwise 3D transform
	=> pairwise dense point matches
- global absolute orientation initialization
	- rotation averaging
	- translation averaging
	=> initial abs camera locations & orientations
- global absolute orientation nonlinear minimization
	- use match count / reprojection error as edge weight
	- nonlinear minimize angle & trans.
	=> updated abs camera locations & orientations
- global absolute orientation bundle adjust
	- quasi-local-global bundle adjustment
	- group-bundle adjustment to iterate cameras to more optimal orientations
		- reupdate scene 3D points?
	=> final abs camera locations & orientations [motion final]
- global structure & motion bundle adjust
	- quasi-local-global bundle adjustment
	- increase resolution to finer detail
	=> final structure & motion
- pipelining
	- graph init
	- sparse tracks
	- dense points
-----> HERE <------
(04/15)
- surface triangulation(tessellation)
	- advancing-front, curvature-based tessellation
	=> scene triangle model
(05/06)
- texturing
	- view-based surface texturing
	- blending between triangles
	- separate triangles into texture lookup / files
		- TextureMap (from textures to atlas)
	=> scene textured model
(05/27)
- viewing output
	- locally
	- VR device
(06/17)
- MVP
	- example models
	- example screens
(07/01)

google app engine project - nodejs
https://cloud.google.com/appengine/docs/nodejs/
- hello world
- routing
- returning binary objects (eg images / data)
- doc storage DB
- sample API
- authentication
- compression
- encryption


^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

AFFINE FEATURES ...


CORNERS WITH CLEAR CORNERNESS:
A) need a very zoomed in image to find overall gradient of corner
B) need a medium zoomed in image to get angleness of corners
C) need a low zoomed in image for moment estimation
D) need a zoomed out image to get differntiating features

CORNERS THAT ARE MORE OF A DOT:
---- this is more of a blob ... are these picked up?
- gradient at center ~0



..........
- test different image/scene data set

	=> TEST ALGORITHMS SEPARATELY:

		- originating SIFT objects are not matching well
			-> branches have lots of noise
			-> medium change in perspective hides lots of matcheable areas
			-> not a lot of overlapping features to allow correct match opportunities
				-> try to get more initial points
					-> more initial points requires better approx of UNIQUE features to limit n^2 matching
		=> VISUALIZE ALL STEPS OF ALG IN NEW DOC

				=> better scaling/blurring : not just interpolation but pre/post blur for scaling
				=> larger blurring to get 'bigger' features and ignore noise
				=> better angle selection accuracy [try only centermost ?]
					- vizualize moments / COM
				=> better windowing / check: center more important than edges

	=> downstream results are trash

DECISIONS:

- how to LIMIT features

- how big the corner feature should be around point for MOMENT
- how much blurring should go on for MOMENT (ANGLE) extraction
- how big the corner feature should be around point for SIFT
- how much blurring should go on for SIFT extraction
- how to window SIFT importance [gaussian] tapering
- how to determine ASYMM angles/directions


R3D.calculateScaleCornerFeatures(imageMatrixA, maxCount);

R3D.generateSIFTObjects

R3D.compareSIFTSADVector

R3D.matchObjectsSubset





- initial affine matrix approx needs some taming
- 2D pairing needs to attempt propagating







- SEVERAL METRIC NEED TO CONSIDER FOR PROGRESS:
	- reprojection error - MATCH
	- reprojection error - ABS
	- PATCH COVERING
	- F?
	- R?

- uniform sampling inside sphere

- final BA still has high error & sporadic points

- nonlinear 3d point locations
 	- each MATCH would also need one ????

- increase samples - upsample [for tesselation]
	- TRIANGLES IN 2D [smallest] - delauny triangulation ?
	- hot spot - each pixel = minimum distance to nearest neighbor
	- ...



---- another step to re-sample pairs & get dense points from



- surface tesselation:
	- need dynamic local size count
		- some minimum number of point to start with (>>3)
			- & some max ...
		- some 'graph' to estimate when 'peak'/optimal sample size is achieved
=> instead of getting EVERY POINT to calculate, use some sampling count, eg inside a radius



- lots of DROP SCALE RATIO: AFTER previously validated ... why?
- propagating points doesn't seem to add much / they are pruned quickly
- divide R error by the number of points in track to allow for some sympathy for multi-connected components




- initial points locations are very separate
	- is this somewhat expected?




- if a point has a poor reprojection error, see what the 'better' match location would yield in a change of position in 2d





- check single-view logic for:
  .... gd_BACameraExtrinsic





DENSE POINT BA:
	- update views
	- update patches
	- update points
- upsampling ?

=> OUTPUT TO file

TESSELATION LOGISTICS:
- load final dense point set
- up-sample points?
- iterative surface front-propagation
- save to triangle file
...


- TRIANGULATION:
	- load ALL P3D from file
	- triangulate surface
	- save to triangle file



- view/match/triplet/epipolar - graph  consistency:
	- a separate pseudo-reconstruction can take place before final reconstruction (sequential/iterative)
		- reveal/prune bad pairs/triplets
		- possibly relative not need absolute locations
		- start at most reliable edges and work out from there




PLANAR STRUCTURE:
	=> 4 point algorithm for when all 3D points are found to be on a plane only
		- planar epipolar constraints


- adding point-camera edges in view graph processing ?
	- pick some subset of points to keep processing low


- dense initialization of points
	[1.5 rad pixel distances between p2d - to limit NOT EVERY PIXEL - 3x3 neighborhood]
	[patches ~ nearest patch averaging 2d neighbors & 3d distances]

- iterative 3-way dense BA to eliminate spurious points

+++++++++++++


- optimizing on dense data (to get ready for tessellation)
	- need patches for discarding some spurious points ?
	- can't use the patches on dense data (takes too long to init)






- view-view covariance matrix means WHAT?
	Covariance Matrix:
	Correlation Matrix: ...
		- problem with covariance matrix is sigmas/values need to be in some ABSOLUTE scale to compare
		-

- filter to 3x3 grid so processing is manageable
- import from filtered-dense file



- how to use TFT in stereopsis
	- figure out a TFT for every 3 views: A, B, C
		- include only subset of points that already have 3-way-matches
		- estimate TFT linearly (up to 100-1000 lowest-F/P-error scores)
		- shoe-horn in other possibly good 3-way matches ?
		x calculate relative PA-PB-PC

- determine if a tri-image set is good?:
	- A-B & A-C & B-C matches are all above some minimum count / error

- initializing trifocal:
	- 3 point spaces: for each view
		- drop points that are too close to existing point (<1px) [order on corner score / etc on insertion]
	- search radius ~ 2*Ferror [of Fab or Fac]
		for each seed point:
			- each point has list of potential matches for each other view
				- point
				- rotation [from F]
				- scale [init from affine / refine from NCC]
				- score (NCC / SIFT)

- get optimizing working for multi-view
	refineCameraAbsoluteOrientation

is the translation averaging: tij = Tj - Rij*Ti ? or are just the Ts involved ?

- get back to surface tessellation (once points are stable at surface)

- get back to texturing


- USE TRACK POINTS [100~1000 per pair] to initialize global solution [Pi]
	- BA step to reduce global errors [no images needed]
	- propagation step to [yes images]
		- loop:
			- load view groups [3-5] most likely to result in more overlap
			- propagate 2D-3D to fill out open areas/gaps
			- try init new points
				- [3D] using corners in open areas
				- 2D: TFT
	- drop outliers out [no images needed]



- USE OPTIMIZED VIEW GRAPH to break the problem up where possible
	- prefer lower error pairs
	- prune repetitive views
	- ...


- TEXTURING:
	- load triangles
	- optimize viewing angles
	- mark which triangles/vertexes are needed for each view
	- load view one-by-one
		- load texture_i & add alpha
		- all pixels start at: 0x0
		- pixel i = alpha*A + beta*B + gamma*C : A + B + C = 1.0 | values will be quantized to nearest [0-255] if using a PNG to store ...


- WHEN A NEW VIEW IS ADDED:
	- for each pair (~10)
		- PAIR F
		- PAIR P
		- TRI = relative SIZES
	- if change is MINOR: [near a lot of existing matches, 'surrounded' (initial location estimate is reliable)]
		- inject into existing solution with best estimate
	- else
		- TRACK ADDITIONS ?
		- TRACK UPDATES ?
		- INIT SKELETON GRAPH ONLY WHERE EDGES CONNECT ?
	- UPDATE DENSE LOCAL-GLOBAL SOLVE




- reprojection error:
	A) estimate 3D points (reprojective)
		Points3D_est=triangulation3D(ProjM,Corresp);
		project 3d point to 2D image planes
		error = sqrt( distanceA + dB + dC )



		- add repeat-till-convergence (error doesn't change) using direct edges for each vertex ON scale/translate/rotate optimum strategy


		- TRIPLE PAIRWISE RESULTS IS MORE LIKELY MORE ACCURATE THAN PAIR RESULTS:
			- WANT TO USE THESE RELATIVE PAIRS IN INITAL GLOBAL LOCATION?
				- how would scaling work then?



		- adjust differences in image lighting to match each other [move A toward B and B toward A OR just match]
			- color space
		- ADAPTIVE COLOR COMPENSATION - color balance [gray balance, neutral balance, white balance]
			- global adj of color intensities (RGB)
				- neutral colors correctly rendered
			=> 3D mapping:
				- each 3D->2D point set gives list of colors to be matched
				- different regions can be mapped differently




- will eventually need outlier detection in large scene/view graphs

	- inconsistent location/orientations - alternate path tests
	- rotational consistency
		- if error is much more than calculated ()
		- voting?
		- spanning tree inliers
	- loop statistics
	- baysian inference



- have not yet applied nonlinear triangulation (choose X to minimize x_i and x_j reprojection)
	- 6 degree polynomial solution


	- need to figure out how to get relative scale between different stereo pairs
		- combine multiple stereo camera matrix
		- relative scale camera matrix
		- multi view geometry unknown scale

	- get an initial estimate of camera PAIR relative 'world' scales

	- SEQUENTIAL METHOD: start with best pair, and gradually add views as parameters are more-well-defined (error minimized)

	- FACTORIZATION ?

	- TRIFOCAL TENSOR?

	- sample-point scalings:
		- random pairwise matches in 2D
			- limit to top corner match points
			- satisfy NCC @ each end?
			- get 3D distance [use error of each 3D point as weight]
		- plot distribution ; pick mean size w/ sigma error

	- multiple F1-F2-F3 to find 3-way matchings?

	=> only need an initial approximate scale [~1% error ] to get initial location estimates correct


notes:
projection / extrinsic camera matrix:
P = K[R, -RC]

) estimating R / F error should use sample subset to limit processing

) How to get rid of very isolated points?
	- each point track it's neighborhood distance
	- vote


----- add a step at end of median to improve points by getting a ZOOMED OUT affine, then ZOOMED IN affine (1/20 ~ 21) (1/100 ~ 11)
- take a while ... 1E4 * dozens



(test optimizing each point pair by another corner-point refinement (should do as part of MEDIUM, but can test in STEREO)



5) test fluid-movement point2D
	- see if R-error is useful for repositioning point (and if 3D destination point is good)



- only keep best NCC/corner per cell (3x3-11x11) ?
	- reduce processing











=> for 2 cameras .. might be hard to differentiate
	=> availability of alternative points ?
		- might be possible that this is not the case
	=>

=> for 3+ cameras:
	projecting from a correct 3D point will result in more matches for a point
	projecting from a wrong 3D point will limit that point to only 2 matches
	=> number of matches a point2D().point3D.matches.length) has can weight against correct/incorrect when voting

=>

SPORADICALLY BAD POINTS (ERROR) - can be voted out fairly unanumously
- small groups can be iteritively picked at until they are all removed




ANOTHER METHOD TO REDUCE R ERROR:
	- move a point in A/B to reduce reprojection error
		- needs to take into account NCC / distance to limit maximum relocation




- some super low-R-error points, but are obviously wrong in 3D
	- how to identify these?


- relative camera poses is not the same as inverse ....

http://www.cs.cmu.edu/~16385/s17/Slides/11.1_Camera_matrix.pdf


STEPS:
estimate3DErrors
	Stereopsis.ransacTransformF
		F = R3D.fundamentalFromUnnormalized(pointsA,pointsB);
			F = R3D.fundamentalMatrix(pointsA, pointsB) == Linear DLT
			F = R3D.fundamentalMatrixNonlinear(F, pointsA, pointsB); == distance from projected line error
		P = R3D.transformFromFundamental(bestPointsA, bestPointsB, F, Ka,KaInv, Kb,KbInv, null, force, true);
			E =  KbT*F*Ka
		transform.calculateErrorF();
		transform.relativeEstimatePoints3D();
		transform.calculateErrorR();
...
this.estimate3DViews(); // find absolute view locations
this.estimate3DPoints(); // find absolute point locations
	P3D.prototype.calculateAbsoluteLocation
this.estimate3DErrors(true, true);



R3D.inverseCameraMatrix = function(P)
R3D.componentwiseRelativeCameraMatrix = function(transformA,transformB)


R3D.projectPoint3DToCamera2DForward:
	x = K * [P = R|t] * X
	P = EXTRINSIC CAMERA MATRIX [inversISH of camera location matrix?]



var projected2DA = R3D.projectPoint3DToCamera2DForward(estimated3D, transformInverseA, Ka, null, true);
var projected2DB = R3D.projectPoint3DToCamera2DForward(estimated3D, transformInverseB, Kb, null, true);



- can points be 'shifted' in 2D space if they have high error?
	- get a haystack for one of the views and look for better location?
		- rotate slightly / zoom slightly / ...



- when requiring eg 1000 point estimations, maybe use bottom 1/2 of points ordered on lower F error ? (not whole population)

criteria for dropping points has to be improved
- can't use global well, need local solutions
	- 2d grid ...
		=> check logic in prob2d
			=> better corner localizing ?


- back to how pairs are performing
	[does the cell size need to be smaller?]

- back to how initial view orientations are (error)

	=> do simulation and see where approx fails
		-> need a 3D scene model ....



... why is uniqueness dropping so bad ?



SAD/SIFT compare of matches rather than NCC
	- 10x longer


- maybe there are other errors - camera ? radial distortion ?

=> try to get a set of pairs that have very low (<1px) error initially
=> then also need absolute estimate to have very low error



- a lot of initial matches wrong immediately -- in vague areas [from Medium V]
- add step at end of medium match:
 	- that compares elements NCC/SAD
	- ignores low corner scores
	- drop highest F-error points
	- drop points with very high secondary choice (non-unique) -- difference larger than window size









- drop points that are very isolated (not around MEAN locations)?

- maybe point3D 3-way matches not working as expected?
	=> show some 3-way pairs / scores and see what what




- how should patch normal be initialized / optimized?
	- camera normals and camera-center-to-point vectors


- newly added 3-pair points are not being kept: <10% keep ratio ????
	-> linear dropping is too much/fast
=> show some of the items being dropped (& WHY?)
	=> RERROR: [2-12]
		- very far away from existing solutions


- prevent patches from being re-evaluated in probe3d (checked:)



- something that works in F but is very wrong might be able to be obviously removed in R ? very very close or


- add sub-pixel precision in several places along pipeline




=> if there's a bad zooming problem maybe REMOVE
	[if eg size is much larger or smaller than expected based on average camera distance]



- when update patch should be called (if is has a patch but NOT checked update (need a var))
	-- or of view structure has changed enough:
		- R error in any of possible views
		- relative distance to any cameras of possible views >> some ratio (1.5-4)
- if a patch IS CHANGED, it should require RE-APPROXIMATING THE PATCH/ NORMAL


? DENSE F MATCHES - plot pairwise matches for 1 & 2
? extracted probe3d points are flipped?


looks like initial F-Match is quite wrong image 0-2 ...
	- best match fwd / bak maybe needs larger windows
		- maybe drop matches that have minimal cornerness /

possiblyVisibleViews == wrong ?

initialEstimatePatch



for each pair:
	- pick 100 best canidate points to project to other views
		- avg corner score
		- lower R error
	- do projection to each other view and see if match is good enough
		- R / F / M
	-


bundleAdjustViews - BundleAdjustCameraExtrinsic working?


focus combining code on merging points to more force multi-way alignment

-- SEE what dropping worst corner points looks like
	- 'random', or more depth-based?

- drop worst corners from pairwise solution:
	-> drop any corner score worse than bottom ~10% of images

- add back patch-3D projection in group solution
- check 2D expansion algorithm
- outlier rejection algorithm from local 2D affine error
	=> CAN'T USE SIGMA because outliers trap data ... need some kind of sigma-finder


HOW TO OPTIMIZE Fs GLOBALLY RATHER THAN Rs?


IS IT POSSIBLE TO DIRECT ABSOLUTE R IN DIRECTIONS THAT ARE BASED ON RELATIVE R - DERIVED FROM F ?

* IF STILL CORNER MATCH DROPPING = MOVE INTO CENTRAL LOCATION SO PROBED POINTS ARE DISREGARDED IF WANTED TO ADD


=> other BA methods work on optimizing F, not R


NONLINEAR MINIMIZING

- error for edge should be weighted by some ratio of 1/weight


CONVERTING BETWEEN QUATERNION AND TWIST BREAKS STUFF ...
	- AVERAGE QUATERNIONS ? ....
	- ROTOR ?
	- SPECIFICALLY WHY DON'T TWISTS WORK?

ERROR MINIMIZING




initial pair estimate: drop points until under 1 px sigmaA





















- corner features ANGLES are not aligned so well ...
- STUDY WHAT A MOMENT IS
- WHY IS GRADIENT NOT AS GOOD (shouldn't this be good?)
=> could be related to anisotropy (need to asymmetrically scale area?)



- any way to make initial F estimates more consistent?
	- adaptive matching error limits (shitty matching conditions allow for more error)



- HOW TO HANDLE CAMERA IMAGE ROTATIONS?
	-> IMAGE METADATA:
	identify -verbose ~/image.jpg
		Orientation: TopLeft | TopRight | BottomRight | LeftBottom
  		Properties . exif:Orientation: 1 | 6 | 3 | 8





- HOW TO COMBINE POINTS W/ AFFINE MATCH VS DENSE MATCH POINTS
	- closest point?
	- closest N points & average?
	- local:
		- relative angle comes epipolar line directions
		- scale cam be an optimized check (~3 sizes w/ maxima check?)




- allow 'loop' around for scenes with epipole interrior [or some lines wont get matched]
	- (copy) top / bottom explicitly
	- modulo 0 when -1 or +hei



- F MATCHING
	- line but start at best match point for each line and go left & right
	- optimal locations:

		- HOW TO DO CELL BELIEF PROPAGATION
			- there are confident cells & less confident cells
				- confident ones are pinned down
				- non-confident ones can float around
			- 9-neighborhood dist
			- L / M / R neighbor dists
			- keep track of 'confidences / locations' at previous scales
		- how to allow for occluded pixels?
			- pinching in left or right image ?
				- along with poor matching scores

	- vizualize confidence areas
		- different confidence measures

- polar rectification
- polar F-matching
	- offset image by starting line points
	- allow MODULAR SAERCHING FOR WHEN EPIPOLE IS INSIDE




- re-check affine matching --- display features on image for viz
	- try to add affine restoration to points by getting center point and assessing the min/max directions & unscaling
	- moment
	- COM
	- COV
	=> DOES THIS REQUIRE ITERATIVE SEEKING ?

- saving corner affine to yaml / loading from yaml






- stero matching:
	- path costs with vertical / horizontal neighbor costs


- convert from F corner matches to relative size/angle [keep track of epipole angle]
	- get optimal corner scale size ?
		: for each match:
			-

- image rectification re-do [direction matters]

- how to do dense matching wth F
	- rectify
	- map lines together
	-
		- 1D epipolar search
		- brightness constancy
		- uniqueness: 1 to 1 matching

		- monotonic ordering: [not preserved in all scenarios wih large disparity]
			- occlusions
		- smooth depth of field
		- continuity:
		- disparity limits:
		- grouping: structure/connectivity is consistent
	- hierarchy ordering
	- incorporate scale difference from source points



- MEDIUM MATCHING
	- pick out corners & match along F lines
		- high gradient values (corner or edge)
	in: 50-100
	out: 100-1000





- rotate moment by additional cov angle

- check cov and mom sizes




- GET PEAK PROMINANCE IN PCT OF TOTAL > DROP PROMINANCE < 50%





- image compare epipole / line search testing - experiments




x try minimizing error using GRADIENT DESCENT
	- 2nd view's roatation (from starting point) & translation [separate?]



- points behind camera in PAIR:
	R3D.cameraExtrinsicRANSACFromPoints sometimes has a null P ?
		- R3D.transformFromFundamental
		- transformFromFundamental3 wrong in particular scenarios


- point3d from match3d.estimate3d should also be combined based on depth error based on view positioning
	-> frustrum-projected-pixel

- after orientation is established and outliers are reduced=> [after pair-wise or after global merge]
	- should try to expore high-cornerness areas


- plane seems to take over & not propagate to other areas
	=> possibly from RANSAC only grabbing the planar points as max fitting
- allow cell propagating always?
	- TEST

- faster failing on 3D steropsis : if R error is really high with lots of matches => fail
	matches: cellCount [width * height] * 25%
	R error: > 10.0
	F error: > 5.0


- pairs of cameras with transforms > 90 degrees are invalid


try to speed up: transformFromFundamental2 -- used a lot



* really bad matches need low cellsize to allow good groups to grow and push out the poor group
* bad matches exceed good matches & takeover F-RANSACing [9OC9F69F & H1DXVCYR = 94SG6X20]
	- local iteration minima?
	- too much of a skew
	- too much of a scale
* really poor R pairs can be used to estimate relative locations but MATCHES should not be used


- IGNORE PROCESS FOR MATCHES OVER CERTAIN PIXEL ERROR | MATCH COUNT





IMPEMENT: corner - scales

- unstable corner angles ?

- try using corner points and assigning them the scale of the closest sift circle

---- TYPES OF MATCHES:
	- corners
		- corners (point) ; SIFT OR gradient => (angle) ; assume => (size)
	- corners w/ geometry
	- SIFT blobs
	- MSER
	- MSER+corners
NEED:
	- POSITION
	- ROTATION
	- SCALE


- sift points still suck


convert to objects: DENORMALIZED:
- object:
	center: V2D
	angle: number
	size: pixels




- get basic triangles processed
	~ filter out odd-shaped ones
	- set patch normals to just be averge of views of 2D points
	- output to file


- smoothing on the projection

- optimizing plane via minimizing energy fxn

- voronoi point upsampling


- bilateral filtering for smoothing

=> curvature of area shouldn't be more than the minimum neighbor distance


- smooth points out before triangulating ?
	- groups items into clusters
	=> push away from a location rather than pull towards?
		- initialize all deltas = 0
		- for all points:
			- find all neighbors on a local plane
			- push the neighbors away on the plane based on distance falloff & first-neighbor-distance

- spherical projection ...



- with a lot of noise, need larger sample size (~10 => ~25) so the planes are more gradual and not crazy projecting
	- also curvature is assumed too small with all the wild flailing


* why is APSS curvature wrong?
* why can't plane sampling size be small (or why is sparse sampled areas poor)
	- show local projected plane @ area
* how to find optimal sampling size for area? -- read paper




MLS surface projection -- bad at ears / low sample areas
	- how to get


- stereopsis patch normals are clearly wrong
	- try homography instead of affine
	- larger patch size
	-


- consistent normals (single-sided) propagation using MLS



- VERIFY minimum edge size reasoning & search radius



- MLS surface projection
	- variable sample size
		- 'scale larger than noise level'
		- figure out best nearest-neighbors to use
	- PLANE:
		- minimize energy fxn: Sum_i:  (dot(normal,pi) - dot(normal,POINT))^2 * THETA(||pi-q||)
		- THETA = smooth, radial monotone decreasing fxn, positive in whole space
			- theta(d) = exp(-d^2/h^2) ; h = variance





- App: import 'model' file
- App: import all required assets & start TexVieBln





- what is an adaptive sampling count mean - around areas of different sampling densities / error rates
	 - not a constant neighbor count
	 - not a constant distance
		 - start with minimum amount [5-7]
		 - increase radius until containing ellipsoid sigma0 & sigma1 are 2x as big as sigma3 [ensure some amount of planarness]

	- pre-op on data to find best K sampling for each point
		- start at (random?) point
		- determine K linearly from ~5 to ~100
			- set K
			- recursive op on neighbors, using self as reference
		- [repeat for other 'seed' points]



- search radius | curvature | ideal-lengths --- something is wrong & smoothness between triangles nonexistant




- HOW TO OPTIMIZE VERTEX POSITION IF IMAGE NOT IN MEMORY
	- try to group vertexes by scene regions
		=> optimize


=> image matrix cache to hold most last used ~10 / 32MB



- if projected location is much different than projected size (eg 2.0), then mark as dead end


EDGES:
	-> if small triangles are used => lots of holes
	-> if large triangles are used => loose detail




- surface illumination-invariant (un-shaded) coloring processing of images
	- Lambertian surface
	- BRDF




=> if any perimeter-neighbor's normals are > theta (45~90 degrees)?
	=> smooth?


- if an edge-triangle intersection is not solvable -> set as boundary
	- to stop?


- 3D oct-tree objects within distance of circular plane & triangular plane






- PROJECT TO SURFACE:
	- closes sphere points
	- poisson gradient
		- bisector to minima [double gradient]
		- normal calculation from rolling sphere/circle
		- normal averaging (to smooth out normals for gradient descent)
	-

- sphere iteritive:
	- if less than radius: move toward closest sphere point
	- if beyond radius: toward point [points very far from surface]
		- if between radius & 2r: ignore ?
		- if beyond 2r: toward point


- patches don't need to be updated if the cameras/matches have not changed much
	- keep track of:
		: normal-to-view-angle average
		: average distance

- still some noisy points at end:
	- depth discontinuity checks?
	- need to remove spradic groupings


- color derivative @ directions SIFT vector
	- 9x9 grid
	- average color
	- 8 * R/G/B differential



- some parts of image aren't getting expanded on (wall, couch side, floor areas)
	-> probe2D = prelimited based on F/R scores
		-> allowing them to pass anyway brings more error to the scene

=----- some probing restriction is stopping

	- as points are dropped, does the probing2d get to keep track of searching?

	- SAD/NCC ?
	- affine transforms?
	- zooming out to 'best' cornerness size? - this does have an affect

- good with points seen by all cameras, but not if only visible in few ... ?
	- when a probe3D is projected onto another view, the point it covers might be a good projectino, but the object might be obscured
	-


-  point 2D merging
	- need to evaluate how good the additions are before they are combined
	- need to pick optimal locations
		- most cornerness point?
		- best NCC point?

image where each pixel shows distance to nearest corner with value >= threshold
	- for i = 0 to distnace amount:
		- record max-min & index








=> double surface points at end by interpolating in IMAGE grid where there are empty cells (at half size)
	- fixed grid
	-

=> ICON
	- optimal criteria:
		- original
		- gives some idea of what app does [but still abstract / not too specific]
		- obscure physics/math/science root
		- non-text
		- simple - solid coloring
		- cool
		- double meaning




- how to find 'lowest' increase of gradient? &&&&&& THE VALUE
	- get scores
	- turn each score into: 1/max(diff,eps)
	- get gradient
	- HOW TO GET THE VALUE THERE ? => 2D surface ?
- get uniqueness = lowest gradient per unit cell (@ 1/2 cell distance away)


- does the new resolution increasing iteration work OK at same resolution?
	 - may need new FXN that inserts a P3D as-is w no merging-conflict checking
	 	createP3DWithPointsAndMatches(V3D, [V2D], [affine])

~ final drop all 3D points with errors below 2*midpoint globally


- compare stereopsis affine transform with match affine transform
	=> use whichever has better score ?


SINGLE PIXEL UNIQUENESS VS MAXIMUM IN AREA UNIQUENESS


- add back validation
- need to restrict propagation of points into smooth areas
	>< range
	~ uniqueness
	- cornerness


- use uniqueness | cornerness when adding new match to limit matching more points in bland areas

































- graph combining error to final stable system
	-> markov states?
	-> GRAPH BASED SLAM

- tracked features across multiple
	- determine closest cameras (range of view / overlap)

- choose best cornerness point when picking probing points

- 'representative' graphs for reducing optimization of 'finer' positions till later
	- combine 'redundant' views

- should optimization happen using E points and not F points?

- speed up searching
	-> add pairs
		-> P3D.connect
	-> get added list for view i + j
		-> if item still has a point2D w/ point3D @ view j
			-> add neighbors to search queue
	-> search neighbors

- do final BUNDLE ADJUST

- RANSAC PLOT LIKLIHOOD OF GETTING A NEW MATCH (log ) and quit if very non likely (wasted iterations)

- use output of lowe-res solution (matches & Ps) as input to nex (x2) higher resolution

-> much of the effort goes into removing outliers and troublesome data before the bundle adjustments can find local minima (very good initialization)
	-> find average of rotations
	-> find translations
	-> BA


-> SYNTHETIC DATA FIND OUT WHY NONLINEAR SOPT SUCKS ...
	- can 3D error visualization work?
-> P RANSACing

- why is nonlinear optimizing failing?
	- investigate the 2 erroring camera views? []
	- analyze reprojection error measurements & why squared / linear error would be better or worse in given situation
		- bad points throwing off?
		- infinity reprojection is better?
	- add RANSAC somewhere and only use best inliers?
	- try LM instead of GD


- bundle adjustment : nonlinear camera reprojection error minimizing => pushes points/camera toward infinity
	- optimize single camera R|t against all other view-pairs
	- TRACKS
	- Levenberg-Marquardt
	- separate rotation & translation optimizing
	- optimize using normalized image coordinates (F->E)
	- BUNDLER: https://github.com/snavely/bundler_sfm
	- S. 7.3-7.5
	-






- keep track of changing cells for each view:
	- workingCellSets:
		- views:
			- 1
				- [{i,j}, ...]
	- update working set on add/remove point / match
	- need some 'previous attempted' metric (reprojection error?) to dis/allow retrying match


- nonlinear view camera optimizing:
	- set absolute camera positions on iteration ~ 3
	- camera-only BA one at a time for 10~100 iterations
	-> see if error goes down




>>> SKETCH
	- what simultaneous-optimality of 3D pose looks like visually
	-














- prefilter image with high edging / contrast / ...

- do a bundle adjustment step at end of 3-5 iterations

----- IS THE POINT COMBINING AT DIFFERENT VIEWS REALLY CORRECT>
- WHY IS THE CAMERA MATRIX INVERTED FOR DISPLAY ? [is maybe the z direction reversed or something?]


- when r error / point3d count is above some threshold, do incremental iteritive nonlinear changes [on absolute transform?]


- some iteritive loop method to change each point?
=> start to only use absolute values: P3D & Ps



- why are 3+ cams location bad ?
	- R gets pretty low for each
	=> but combined locations are still VERY off
-> some logic behind combining is wrong?


- remove orientation checking helps?

- patch check again


--- need way to force different views to align eachother

- 3D projection of low-error points (3D abs location) onto un-searched view


- patch refinement:
	- reconcile 3D location with projected location with 2D location
	- set point3D8 to be closest point of projected rays thru 2D points ?
		=> is it already the midpoint ?


- filter based on neighbor patch normals

- multiple-views


- 2D translations = affine approx from homography
	=> make into function



- back to surface via advancing-front propagating



> how to keep track/optimize of all:
	- 2D match points: x,y
	- 2D affine transform between image matches: X,Y
	- 3D patch plane: center, normal, A,B,C,D
	-> initialize patch
		- normal:
			- project patches, find 4/5 projected median points, approximate plane, approximate square
			- average of inverted camera normals
		- center:
			- closest projected line intersection
	-> optimize:
		- normal unit vector (pitch, yaw)
		- center point (X,Y,Z) [restricted along path to a reference camera to match point]
		-



> how to transfer 2D orientation between 3D cameras
	- get UP & RT unit vector for camera A & B
	- do projection of upA onto upB & rtB
	- do projection of rtA onto upB & rtB
	- get angles between projected up & rt vs upB & rtB => average

> how to estimate normal (or projection?) from affine matrix


- voting metrics
- score dropping
- affine & translation scoring reassess




- READ PAPER ON R - MODELING
-> ALGORITHM FOR THIS





- prioritize 'better' affine over possibly already existing 'worse' affine
	- based on?

- allow bad affine to happen, then pluck them off ?

=> an existing match might be the cause of a newly-created match
	=> which one to drop ?
	=> keep track of cause
- count those who agree / disagree ?
	=> pick based on votes ?




- VISUALIZE A CELL TO FIND OUT WHY BAD
- lots of overlapping should not be allowed
=> DROP BASED ON SOME CLOSENESS locallly


- and cells w/ affine matrices much worse than parents => drop
- any cells with opposite-sides predictions => drop




- plot metrics, try to learn:
	- sad
	- ncc
	- Ferror
	- relativeSAD
	- relativeNCC
	- pathScore
- find out why eg chair corner looks so bad & try to pre/post filter it out




- want to prevent bad matches so that don't have to recover from them





- predictive steps JUMP OVER? the correct matching location?
	- during expansion, match should also include initial translational costs [relax term] along side SAD/NCC costs for better optimal starting prediction
	- other routes having predictions would be good too ?
	- incorporate path cost? / lowest relative path cost
		=> look at path costs for the top n matches ?
- ability to 'override' matches with better one when found


- first cell propagating shouldn't be the only decider in what the best location is
- as cells are added, they should consider alternate locations
	->





if a new affine match has no conflicts => can set

if an affine match has conflicts
	=> for each conflicting match:
		if affine is better than all conflicting????
			- lower delta-predicted errors
	=> remove all conflicting neighbors




>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
- seed matches pick best match based solely on NCC/SAD score

when a match is set:
	- for each 4 neighbor:
		- estimate best next location:
			- @ predicted center
			- total error = a*score + b*distance from center  [* distance error is radius @ center w/ linear dropoff]
			- pick location w/ lowest total error
		- ??? get flat path cost?
	- for each 4 neighbor:
		- if no match currently exists:
			- if a previous match exists (neighbor was dropped)
				if new match is much better
					- set match
			- else no prev match exists
				- set match
		- else if new match is much better
			- ncc_new / ncc_old && sad_new / sad_old
			- relativeNCC_new/relativeNCC_old < ~0.95
			- set match

moving of a cell:
* based on origin cell?
	- estimate what new match would be
		- if match is much better than previous error:
			- update match with new one

match:
	- original location
	- original score
	- origial origin cell
	- current NCC score
	- current distance score?

>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>



STEREOPSIS:
++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
initial matching:
	Harris and Difference-of-Gaussians


match:


REPEAT:

	expand:
		- spread matches to nearby pixels

	filter:
		- visibility constraints
			- drop bad matches
		- 3D:
			- drop points outside surface -> |T(p)| is small & N(p)?
			- drop points inside surface -> revomputed depth maps result in |T(p)| is small
		- regularization: n-adjacent neighbor cells is below some threshold [threshold is lowered as algorithm progresses]

PATCH (p)
	- center c(p)
	- normal n(p) [toward camera]
	- reference image R(p) [image that is most parallel to retinal plane]
	- should_images S(p) [images patch should be visible - not expected to be occluded by any other patch]
	- truly_images T(p) [images where patch is truely found - must be at least gamma (2 or 3 in size)]

IMAGE I
	- cells C(i,j) [beta1xbeta1]
	- Qt patch list if I is in T(p)
	- Qf patch list if I is in S(p)\T(p) [in S(p) but not in T(p)]
	- depth of center patch [from image-camera]

estimating position:
	- initial guess for c(p): triangulated from putative matches
	- initial guess for n(p): direction of point to O of reference image

	NCC = N(p,I,J) for patch in image I and J
	maximize:  1/(|T(p)| - 1) * SUM(I in T(p), I!=R(p)) N(p,R(p),I)
		* depth for (reference) (or each? view)
		* normal pitch & yaw (?wrt reference)

initial guess for visibility is if NCC is above some threshold
S(p) => later estimate by thresholding is if depth_I(p,i,j) < depth_J(p,i,j) + rho [rho is deth of c(p) at beta displacement in R(p)]
T(p) => NCC is above some value


n-adjacent = |(c(p) - c(p')) * n(p)| + |(c(p) - c(p')) * n(p)'| < 2*rho 	[centers are close & normals are close to parallel] c-c' should be ~ orthogonal to n' and n

retinal plane
uxu = 5x5 or 7x7


++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
input:
	- images
	- sparse, putative, initial feature matches across images [pairings] (f_i, f_j)
		- scale & rotation

expand
	- look at unmatched adjacent cells
		-

filter
	- global:
		- NCC * SAD error
		- R error [distance from reprojected point]
		- F error [distance from epipolar line]
		- 3D kNN avg distance @ 3,5,7,9,... [isolated points are unlikely to be good estmiates]
	- local 2D: [cell voting]
		- difference in rotation angle [0,pi]
		- max(eigenvalue)/min(eigenvalue) [1,inf]
		- NCC
		- SAD
		- to-neighbor NCC
	- local 3D: [grouping voting]
		-
	- visibility?
		- [depths not consistent]?
		- [normals not consistent]?


CELL:
	- non actual ?

P3D:
	-X,Y,Z
	-NORMAL
	-P2Ds[]

P2D:
	-x,y
	-matches[]

MATCH:
	-P3D
	-P2DA
	-P2DB
	-

- P3D patch normal will have to be re-estimated as cameras change locations

propagation:
	- need to keep track of failed attempted locations so that propagation doesn't continue there [for another given image]
	- square cells?
regularization
	- need to allow lowly constrained matches (non-corners) to move a bit as their localization is fuzzy => NON PERMANENT


normals will have to be re-estimated as camera positions are refined












output:
	- dense image sets [2+ connected image points]
		- normal3D
		- point3D
		- points2D
			- x,y
		- affine between each image


>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>







- propagation step should also include affine checking
	=> limit over-reaching to poorer place



- letting dropped locations/cells back in the game?

- affine/translation cells are very bad



- gradient descent not finding minimum & not stopping
	- needs next destination to be better (not worse), or don't do at all?
	- should affine matrix be updated on pointB update?

- reassess affine & translation errors


- multiply vs add geo + ncc errors


- affine error doesn't seem to be critical enough
	- do affine matrices have too much leeway ?

- does the affine matrix need to be adjusted as the cell moves ?
- some logic to stop cells from being closer to eachother than the affine matrices would suggest







-> review flow field to analyze relazation steps


=> relaxation | data => local optimize

- error outside cell zone is infinite

criteria for dropping bad cell:
- best SAD/SSD score is much less than minimum score [self]
- error in geo is much worse than neighbors [voting]
-


++++++ ALG .... ++++++++++++++++++++++++++++++++++++++++++++++++++++++


for each seed:
	get NCC in area, place at optimal (forward) matching point
	add seed to Q


L = Q
Q = {}





L = Q
Q = {}
for each cell in L
	get local (3x3) NCC scores
	get local (3x3) forward & backwards edge (GEO) scores for all existing (4/8) neighbors
	calculate error scores for based on: c1 * NCC^e1  + c2 * GEO^e2
	calculate sobel gradient: (3x3) or pre-smoothed gradient

for each cell in L
	move cell in direction of -gradient [only up to 1 pixel?]
	if gradient > epsilon (~0.1) pixels
		add cell to Q (need to keep adjusting)
	if gradient > minimum (0.5~1.0) pixels || [if estimated to be very close]
		add 4/8 neighbors to Q (need to propagate changes)

for each cell in L
	update metrics from matched neighbors

for each cell in L
	update vote estimations for neighbors
	if bad cell
		remove match
		remove from Q


for each cell in L
	for each 4/8-neighbor:
		if neighbor doesn't have a match
			if have prior neighbor preduction, use this
			else predict best matching location for neighbor & store
			if prediction is much better than neighbor's initial / final score
				set neighbor match
				add neighbor to Q (need to validate/adjust)









.......

order L on highest error first
get local (3x3) forward edge (GEO) scores [backwards are opposite of neighbor's cell]



calculate pixel movement based on

^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
































bayesean optimization non convex






- how to do progressively better cell sizing

=> sub cell algorithm

--- very small cells have no cornerness & can't be localized & fail fwd-bak test
=> NEED SOME KIND OF GUIDANCE
- if it doesn't have enough variability it can't continue




minimization w/ criteria:
- each cell has a 'list' of possible locations + scores [or no location if no scores are good enough]
- each cell has a 'score' based on how 'smooth' the local topology/geomotry is

- match step: find top best location matches in area [SAD/NCC scores that pass minimum & fwd-bak constraint]
- relax step: move cells locally to minimize cost:
	COST: scoreNCC * A + scoreSAD * B + geometry * C
- geometry has something to do with local angles / distances -> offset from what would be the 'ideal' position

=> idea:
	NCC gradient for corners would be high in
	NCC gradient for edges would be high in single direction
	NCC gradient for non-unique would be low everywhere

gradient for connected components would be high for non-uniform areas
	- error cost = distance between expected location/orientation vs current location/orientation

unconnected components have no (edge) cost

-> if cell position goes past available score location => rematch at new location



-> FWD/BAK relaxed doesn't need 'best' score in same cell, just a 'good enough' score to be in same cell





- move cells toward lower-scored points
- only keep track of cells with high/changing gradients






=> hierarchical
- when EVERYTHING or LOCAL areas have become stable => divide cell at mid-point of edges




- zooming out until uniqueness is good enough / satisfy fwd-bak uniqueness

- fwd-bak validation is strict ...
	- try just 'in the right cell' limiting


- F dropping oscillating problem => how to determine if 'done' => terminal case



- precondition / pre-pare image
	- edgeness
	- histogram expand
	- ... ?

- if F-B location fails - try using different matching scheme ? SAD / SSD / NCC / .. ?




- test with 3/5/7 ... cell sizes


- is gradient more discriminatory / better at comparing?

- alg speedup?
	- save calc?

x display distance metric - not real depth?
- or rotation/flow metric



Affine Dense Matching method (AM)
Normal Aided Matching (NAM)

- how should hierarchy be done?
	- just seeds ?
- try different pixel sizes (compare size should change too)
	- 21 pixels => 21
	- 11 pixels => 15-11
	- 7 pixels => 11
	- 3 pixels => 7-5
	- 1 pixels => 5

- using surface normals to estimate affine transform / homography
- big changes in normal == edge
-


CONSTRAINTS:
- epipolar (F -> line search)
- brightness (SAD == 0)
- gradient (dImage == 0)
- edge gradient (disparity jumps in 3D should match intensity edges)
- ?disparity limit (disparities along epipolar lines)
- disparity smoothness (local disparity not have abrubt changes)
- correlation score smoothness (NCC locally not abrubt change)
- ordering (pairs along epiolar lines not change order) -------- real 3D scenes can violate this?
- uniquenes (each pixel has 0 or 1 match in opposite image)
- mutual correspondence (?)


current = 21
ceil( (current-1)*0.5 + 1)


(current-1)*0.5 + 1
[81, 41, 21, 11, 7, 3, 1]
~ 80 40 20 10 5 2.5 1

- Accurate, Dense, and Robust Multi-View Stereopsis



PMVS = Patch‐based Multi‐View Stereopsis
https://ags.cs.uni-kl.de/fileadmin/inf_ags/3dcv-ws11-12/3DCV_WS11-12_lec10.pdf





- change voting criteria
- change
- add geometric/topology
	- resolve pinching-ness / match

- uniquness dropping

- do zooming out until 'uniqueness' or variation or range or other is good enough



-


- use gradient

- check keep distance ... keep track of other changing things


- how to prevent/recover from bad estimates when groups meet

- monotonocity

- forward backward validation

x show object flow [image flow | field]

- matrix image extract error

- using affing transform vs prediction for filtering bad points
	=> is this not translation ?


- reduce calculation time by only updating based on only changed elements?


- how do matches work when good seed groups meet up with bad seed groups


- use gradient metrics too -> distance errors
	- gradient-vector differences in R/G/B channels
	- ||R|| + ||G|| + ||B|| = D^2


- prevent re-searching matched cell by remembering last search location
	- keep calculated:
		my: position, affine
		neighbor: position, affine
	- if


X:
- match every cell & get cost
- minimize cost by moving cells to less cost area
- until cost minimizes

- only check for possible match if neighbor doesn't alreay have one / in same area
	- 'already been tried' mark
	- 'previoius attemps' marks
- lattice connections not serious enough

- LOOK AT OPTICAL FLOW SOLUTIONS --- seem very setero based
 - Horn-Schunk
 - Lukas-Kanade


- ONLY UPDATE/CHECK WHEN SELF/NEIGHBORS CHANGE

- add 'pairing' for each cell link/edge

- group affine check against individual affine check

- if cells are removed and an island becoms small (~1) -- remove it

~ match pre-constraints

- when fronts meet: much better from should force worse front to recede

- for cells with obvious division between them [gap], they can STAY, but they shouldn't add new matches

- VOTING
	- cells with poor scores should have less weight --- nonequal voting

- keep record of compared neighbors / mark changed neighbor
	-> to prevent recalculating same stats [on match select]
	-> hasChanged
		- set when neighbors change or ...
		- unset when ?
	-> hasNeighborChanged
- only care if it's an 'edge' or recently an 'edge' ?

- stopping conditions

- pre-filtering matches
	- ordering constraint
- post-fitlerting
	- drop bad matches & mark for not-retrying unless point/transform changes enough



- LABELING
	- set on seed create
	- combine after expand/relax step
	-> if a group is found to have large error compared to other groups -> drop entire group ?


- searching for best matches is off by a lot


- using putative matches
	 - evaluation step
- pick match from choosing set []

-- comparing affine transforms to indicate similar/non-similar
	- X & Y vector distances summed / RMS

- try SAD vector that is more color based and not color derivative based

- compare methods to determine optimal localizations
	- SAD
	- SSD
	- SIFT-vector
	- SAD-vector
	- ZNCC

- new dense process
	- save features
	- get neighbors best locations
	- get statistics
	- belief choosing


2 main problems:
	- don't know when i have my own match vs just the best match available [wrong]
		=> recheck 'reference' scoring
	- don't know how to compare match scores globally

----- old areas not correctly removing priors ?

- look @ color histograms

- how to compare gradient
	-> which methods work best






- restrict before queuing / after popping:
	- is-homogeneous (close) matrix transform
	-

---- keep queue from getting real big -> ignore scores that are lower than existing minimum scores (asigned to a cell)

- Q with no ordering ?
	> only get score initially
	>
	> prne after the fact



- look at variables of a given cell / seed on propagation attempts
	- need way to differentiate good / vs bad matches - locally at least

		=> given a seed cenn
			- it's score
			- neighbors:
				- path scores


NO IDEA ON HOW TO ORDER CHOICES
=> try simultaneous minimization of error / cost

- for each seed match
	- find cost of match
	- for each neighbor [L/R/U/D]:
		- find next possible match / cost / path-cost
		-

Cost Volume

=> be able to not match cells who don't have matches
=>





semi-global matching SGM
filters: LoG, rank, mean,
mutial information
entropy of the histograms
graph cutting
- alpha expansion graph cut



cell:
	- maping costs[]: -- 1 entry for each searched cell
		adjacent[i]: cell(x,y), cost
			- neighbor costs[]: (L/R/U/D = 4):
				cell(x,y), path cost









- loopy belief propagation
https://www.cs.cmu.edu/~epxing/Class/10708-14/scribe_notes/scribe_note_lecture13.pdf
https://cseweb.ucsd.edu/classes/sp06/cse151/lectures/belief-propagation.pdf

- belief update
- reliability
-

Loopy Belief Propagation - Turbo Code
- Bethe approximation
- Gibbs Free energy
- cost computation, cost-volume filtering, winner-take-all



if bipartite -- what are the cuts?
- directional weights ?


graph iteitive ?
	 - expand
	 	- relative weights
	 - pick
	 - prune
	 => repeat

- keep track of 'candidates' in graph, not in queue
-

graph-queue-iteritive
	- go over all 'seeds', finding costs, constructing graph
	- pick best graph, prune
	=> repeat [keep prior graph for next iteration, remember failed edges to prevent re-searching]


'should i keep this neighbor'
'which match should i keep'



------ belief propagation
	- get list of histograms from neighbors
	- update myself
	- send histogram to other neighbors

- pixel i,j : disparity OR occluded
	- allows to treat edge-pixels differently





- compare gradients by directional / dot


- flow / optical flow

- interpolation bad?
- SAD metric bad?
- global compare param?
- fusion of: cell score, path score, uniqueness, ...




- placement / offset wrong?


- relative uniqueness based on range of scores in area

- 'expected' score
	- 'reference' error / score:
	- scale signal to [0,1]
	- add 10% [0.1] error [+/- 0.05]
	- get score as if comparing
		-> rank = (cell score / cell reference score) * (path score / path reference score)



- cells going into clearly the wrong locations
	- are transforms correct?
	- is replacement mechanism being checked ? [don't replace if worse]


- for each cell in left, +- disparity, fing best disparity in opposite image line
	=> limit disparity check to +/- like 50 pixels / 2 cells
- create disparity image from cell assignments

- calculate reversed-rectified image [use table mapping for reverse]






- drop on uniqueness

- what is relative uniquenesss look like?

- error-reference scores (~.1 error)

- are relative match scores good at determining better / worse ?



- progressively loosen matching constraints -> dropping limits, etc ...



- ordering constraints:
	- topoligically similar
	- half-plan ordering x
	- radial ordering x
	- angular ordering ? ... OK -> TEST



INPUT:
	- seed points
		- angle
		- scale
for each seed point:
	- get optimal affine transform
		- rotation, scaleX, scaleY, skewX
	- rank = neighborhood score / seed score
	- add to match queue
while queue is not empty:
	- pop match from queue
	- if cell A already has match || cell B already has match
		- if matchA->B is better than both existing cell matches && new match is of different cells
			- remove existing matches [may be the same]
		- else
			- match = null [not better]
	- if match != null
		- if match still satisfies constraints [ordering, ..?]
			- add matchA->B to final match set
			- TODO: PRUNING IN CONNECTED NEIGHBORHOOD
				-
			- for each neighbor of A and of B [4-or-8-neighbor]
				- interpolate best location as search starting point
				- vary affine transformation to find best local transform & location
					- rotation, scaleX, scaleY, skewX
				- get rank = path score / origin score
				- if match satisfies constraints [ordering, min uniqueness, max score, ... ?]
					- add match to queue



affine:
- rotate angle
- skewX mag
- scaleX mag
- scaleY mag





- fix uniqueness problem: stop repeated cells from showing up

- need to drop / replace duplicate matches [pick better one]



- if a collision (same-cell-match, invalid ordering, ??)
	-> how to resolve?:





RE-ASSESS INDIvIDUAL POINTS OF ALGORITHM:

- affine transform representation [3 points]

IMAGE PREP:
- contrast stretching
- adaptive histogram equalisation
- sharpening










































=> can uniquely find the optimal location
	-> if a location DOESN'T EXIST, it finds the best one available, which is wrong but may have a good score
=> SAD scores between optimal locations are not easily comparable
=> NEED WAY TO DIFFERENTIATE GOOD RESULTS / BAD RESULTS

-> secondary score metrics ?
-> test what a good result would be with addition of noise

- COMMON RESULT
	=> use next-best-score ratio test to drop
- BAD RESULT
	=> ?


- if predicted point is too far away (eg twice the scale distance away)
- if predicted point is in wrong direction (90 deg off of original direction)
- if predicted point has low uniqueness score
- if predicted point has same location when scaled up x2 (stability)
	=> stability also in rotational invariance wich is already been done - record all absolute-location changes in search

- angle error ???

- how to enforce uniqueness / direction


------ other methods to determing good / bad

- direction from pointA to pointB can be used in location A & B to determine separate SAD scores
- line from A to B can itself be tested as a SAD score
	- compare in segments ?
	-
- poorly localized points could still have good scores

-> score is now a 'path' score from getting from A to B [or some combination of the path]
- seed points wont have a path-score & might offset things
-




-> interpolation / prediction might be off

-> maybe triangle interpolation
-> convex hull interpolation

- ordering is still off


- might want to check for duplicate matches in queue?
-> when matching a POP -> if a point is already in cell, don't need to check
-> dup matches should be dropped already ?





https://pdfs.semanticscholar.org/ca92/4f6c0fce953f202547212dc19e7e49db3074.pdf


https://pdfs.semanticscholar.org/ab62/f870909b606f34f6c5843fa736aea65b06db.pdf


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
