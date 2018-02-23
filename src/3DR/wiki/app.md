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
		each imag has ~ 0.2 other matched images
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


better metric for: 'things going on'
	x entropy is net sum (order not matter)
	high differentials
		- cost to move?
		- variability?
			- min?
			- avg?
		- gradient magnitudes
	- algorithm for using original picture and doing on a zoom-basis
		- for each pixel in original image:
			- calculate average variability
			- keep accumulator sum maxiumum of entire image average
		- for each feature point
			- start at center pixel
			- circularly add concentric pixel circles?
				- size == rad/wid of circle




MOPS"?
http://graphics.cs.cmu.edu/courses/15-463/2005_fall/www/Papers/MOPS.pdf
https://piazza-resources.s3.amazonaws.com/hz5ykuetdmr53k/i2c8h15sptx3kq/16.2_MOPS_Descriptor.pdf?AWSAccessKeyId=AKIAIEDNRLJ4AZKBW6HA&Expires=1519171943&Signature=%2Fq3LL7Qj72NP0xvI772nyMd5Re8%3D
https://pdfs.semanticscholar.org/9a7d/bce8c3b041e9954cc90286657c5554c76533.pdf





----- corner geometry again,
	- further out scores pull the radius larger but proportional to 1.0/distance && 1.0*corner-score
PLOT MATCHING POINT IN A/B AND COMPARE SCALES/whatnot
-- better angle determiner



----- not ENTROPY, but some measurement of the variability of the area
	smooth ~ 0
	crazy ~ 1
	derivative entropy / gradient variability ?
	look at 'lifetime of area scale'


----- inner / outer concentric circle comparrisions
	- angle diff => 
	- histogram of angle differences



----- orientation binning ?
	- starting angle peak vs later peak?
----- inner gradient circle vs outer gradient circle compare ?
	- 
----- angle differences not dot
	- 

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



-- revisit dense-match
	- 


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

- roll up dense code into R3D fxn



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












