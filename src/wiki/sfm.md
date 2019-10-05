## Structure From Motion: (SFM)



### Chapters

0) [Summary](#SUMMARY)
0) [Picture Acquisition](#PHOTOS)
0) [Camera Calibration](#CALIBRATION)
0) [Feature Matching](#MATCHING)
0) [Fundamental Matrix](#FUNDAMENTAL)
0) [Trifocal Tensor](#TRIFOCAL)
0) [Stereo Matching](#STEREO)
0) [Pair Guessing](#BAGOFWORDS)
0) [Dense Matching](#DENSE)
0) [Pair Reconstruction](#PAIRS)
0) [Triplet Reconstruction](#TRIPLES)
0) [Multi View Reconstruction](#MULTIVIEW)
0) [Surface Tessellation](#SURFACE)
0) [Texturing](#TEXTURE)
0) [Rendering](#RENDER)
0) [References](#REFERENCES)


<a name="SUMMARY"></a>
### Summary

Computer Vision
- Structure From Motion
- 3D Reconstruction
- Multiple View Geometry



<a name="PHOTOS"></a>
### Picture Acquisition







<a name="CALIBRATION"></a>
### Camera Calibration

The goal here is to obtain an accurate Intrinsic Camera matrix:

K:
```
[ fx  s   cx ]
[ 0   fy  cy ]
[ 0   0    1 ]
```

*fx* is the x-direction focal length, how the X/Z ratios translate into pixels in the x direction.
<br/>
*fy* is the y-direction focal length, how the Y/Z ratios translate into pixels in the y direction.
<br/>
*s* is the x-y axis skew, how far a line of pixels shifts compared to the line below it
<br/>
*cx* & *cy* are where in the image the camera center (focal point, principle/primary/center point) projects to.
<br/>


Cameras that vary from the linear model are said to have (nonlinear) _distortion_, modeled using polynomials:

"Center of distortion"
*Radial Distortion*:


*Tangental Distortion*:


The goal here is to obtain an accurate camera distortion parameters:

D:?
```
?
```
*p1*
*p2*
*p3*
*k1*
*k2*




*TODO: DIAGRAM*


#### Known Camera Calibration
If the source camera is available taking photos of a known geometry allows for values at each stage of projection to be known, to allow solving for the unknown model parameters


#### Calibration From Minimal Data
Modern Cameras and phones store metadata in images, with useful info like:

- EXIF (Exchangeable image file format)
    - date:create: 2019-03-06T09:22:11-08:00
    - date:modify: 2019-03-06T09:22:05-08:00
    - exif:ApertureValue: 54823/32325
    - exif:BrightnessValue: 97923/25988
    - exif:DateTime: 2019:03:06 08:46:43
    - exif:ExifImageLength: 3024
    - exif:ExifImageWidth: 4032
    - exif:FocalLength: 399/100
    - exif:FocalLengthIn35mmFilm: 28
    - exif:GPSAltitude: 237463/1937
    - exif:GPSDateStamp: 2019:03:06
    - exif:GPSDestBearing: 575385/4598
    - exif:GPSImgDirection: 575385/4598
    - exif:GPSLatitude: 34/1, 6/1, 21/100
    - exif:GPSLatitudeRef: N
    - exif:GPSLongitude: 118/1, 16/1, 4827/100
    - exif:GPSLongitudeRef: W
    - exif:Model: iPhone 7
    - exif:Orientation: 1
    - exif:ShutterSpeedValue: 63436/12923
    - ...

```
identify -verbose ./test.jpg
```

#### Calibration from unknown data:

For images without any camera data, *reasonable* values can be assumed, and final values rely on agorithms to solve for finding the best value.

- methods:
    - using lines in images
    -

*TODO: research methods*


#### Iterative Solving

The intrinsic camera (K) and distortion parameters are first approximated using a linear solution, then further refined using iterative algorithms (solvers), which minimize some calculated error (cost) to move the values toward more correct ones.


*TODO: cost functions*


<a name="MATCHING"></a>
### Feature Matching

#### Features
    - repeatably detectable locations in image
        - corners (per harris [eigenvalue] or similar detector)
        - blobs (as having a scale space extrema)
    - want to be able to orientate the feature for matching
    - size / area of influence:
        - scale space extrema (peaks only usually only for blob-type features) (good)
        - corner scale space extrema (scale at which a point is most corner-like) (smaller sized)
        - constant entropy (scale out until entropy reaches some constant) (difficult, poor)
        - range (scale out until range reaches some value) (noisy, poor)
        -
    - angle (rotation invariant):
        - covariance (mass direction) (ok)
        - center of mass (noisy)
        - dominant gradient (noisy)
        - histogram of gradients (ok)
        -
    - affine invariant:
        -
    - examples:
        - SIFT: Scale Invariant Feature Transforms
            - grayscale gradient (8-bin) histograms with 16 samples (4x4) repeated in 16 oriented (4x4 grid) locations
            - blob size is really well defined; total feature size ~ 2-8 x size of blob
            -
        - MSER: Maximally Stable Extremal Regions
            - very accurate outline, repeatable
            - typically only handful of points [10~100]
        - SURF:
        - DAISY:
        - MOPS: Multi Scale Oriented Patche(S)
            - 40x40 => 8x8 window ; subtract mean ; divide by sigma;
        - ORB:
        - GLOH: Gradient Location Oriented Histogram
            - circular SIFT binning
        - BRIEF:
        - BRISK:
        - BGM:
        - LATCH:
        - KVLD:
        - CODE:
        - GMS:
        - LDA-HASH:
        - BINBOOST - Binary



#### Matching

failure points: repeated objects,



low res : low frequency -> high res iterative F refinement




<a name="FUNDAMENTAL"></a>
### Fundamental Matrix



Projective camera extrinsic matrices:
<br/>
P<sub>A</sub> = [I|0]
<br/>
P<sub>B</sub> = [[e<sub>A</sub>]<sub>&times;</sub>&midot;F|e<sub>B</sub>]
<br/>

<a name="TRIFOCAL"></a>
### Trifocal Tensor (T)



### Quadrifocal [not used]


---

<a name="STEREO"></a>
### Stereo Matching



- rectification to parallel lines
    - homography
    - nonlinear

reduce searching to single line

hierarchical matching


<a name="BAGOFWORDS"></a>
### Pair Guessing
Large Image datasets are likely to have many pictures that share no overlapping regions.
Goal: avoid unnecessarily processing images that have no business being compared.
significant enough of overlap to consider being compared

# Bag of Words - Word Salad
Some summary statistics / features of each image can be used to compare overlap

- features = vocabulary

- individual features in each image are assigned a boolean value indicating if there is a similar enough feature in the opposite image
-


- need large part or entire dataset to be preprocessed before the discarding can begin


- with all image features loaded:
	- can find clusters / nearest neighbors / overlap


progressive comparisons
	- perform easy calculations early on to discard candidate / to avoid wasted time on complicated calculations later




<a name="DENSE"></a>
### Dense Matching
input:
    - fair number of accurate sparse matches [&approx;10+]
    - low reprojection error F [&approx;<1]
output:
    - dense (on order of image pixels: 10%-100%) matches

#### Stereo Matching
- pair matches with only small disparity changes (small baseline)

    - hierarchical ordered stereo matching
        - minimum path calculation
            - depends on only few occlusions per line sequence

    - Image Rectification
        - simply homogaphy of dominant plane
        - nonlinear common F-line mapping

#### Image Registration
- wide baseline / high disparity / sporatic disparity
    - cost functions:
        - SSD | SAD | NCC | Entropy | Mututal Information

    - hierarchical progressive localization

    - minor affine changes
        - inital guess/state is assumed very close to
            - affine cost minimization of patch
            - change in corner location to define affine transform

#### Belief Propagation / Message Passing
    - Specific application of MP: 2D 'stereo' searching
    - rather than minimize costs along a 1D path, try to minimize 2D costs using neighbor
    - cost: data term (match cost) + neighbor difference term (regularization) + drift term (non-textured areas)
    - messages use neighborhood to update current best guess of flow (eg avg / lowest cost)




<a name="PAIRS"></a>
### Pair Reconstruction

# Essential Matrix E
convert from image coordinates to camera coordinates

E = K<sub>B</sub><sup>-T</sup>&middot;F&middot;K<sub>A</sub><sup>-1</sup>
E = [t]<sub>&times;</sub>&middot;R




<a name="TRIPLES"></a>
### Triplet Reconstruction


#### Gauge Ambiguity
Goal: Find relative scale between pair transforms

- Pairwise camera matrixes are solved only up to scale
- The baseline recovered from E is unit length

Method 1:
- Assume Overlapping points in a common view have same 3D point (A-B & A-C have A in common)
- randomly pick 2 overlapping points in common view & their corresponding 3D points in both pairs
- calculate distances: AB.a-AB.b and AC.a AC.b and ratio: ACdistance / ABdistance
- some ratios will be obscurely very high or very low, but follow a narrow normal distribution
- drop outliers (+/- 1-2 sigma) and use mean ratio. [100-1K samples seems to be enough]

_TFT METHOD_

TFT camera matrices have same E -> P baseline unity problem
but it is assumed that the TFT has correctly calculated 3-way matches and is more correct than simply overlapping checks

Method 2:
- something to do with projecting the translation vector of AC onto AB after applying rotationAC
- then comparing various cross-product ratios and summing up / averaging (might also have outliers)

Method 3:
- something to do with solving an SVD related to the Pab and Pac

#### Camera Intrinsic from TFT?
    - ? simple camera intrinsic matrix assumption + TF + Absolute Conic = 4 possible solutions => choose positive semi-definite




<a name="MULTIVIEW"></a>
### Multi View Reconstruction


graph relating transforms - "image connectivity" - "view graph" - ""
- separate pairwise unknown baseline scale (gauge / ...)

- translation / rotation averaging

- outlier detection / rejection:
    - inconsistent rotation / translation






#### Tracks

sequence of a single point tracked along multiple images

#### Skeletal Graph
- time complexity should depend on complexity of scene geometry not the number of photos
- simplify possibly complicated connected view graph that narrows calculations to more critical paths
    - "maximize accuracy (minimize uncertainty) & minimize computation time"

- minimum connected dominating set . . == maximum leaf spanning tree


#### Surface Patches

normal, size



#### Bundle Adjust
- minimize cost function
    - camera - 6 params = MOTION
    - 3d points - 3 params  = STRUCTURE
Dense:


#### Distributed / Large Scale
(can't fit all in memory)



- load views with highest potential for error reduction first

iteratively solved





<a name="SURFACE"></a>
### Surface Tessellation


- points to triangles

#### Surface modeling
    - model local area with plane
        - at what point does
    - model local area with a sphere
        - ...

    - how many points to include?
        - need local estimate of 'noise' - sigma distance from true surface
        - the sample sphere size needs to be larger than the error [2-4 x] to find preferential direction

    - 3 points is perfect plane
    - as add more points: average distance goes up
    - add too many points ->


<a name="TEXTURE"></a>
### Texturing


- available views based on angle and distance





<a name="RENDERING"></a>
### Rendering




#### Pipeline
*Summary of steps & purpose/goals*
    - Camera Calibration
        - need K (at least initial estimate)
        - remove camera distortion from images
    - Feature Detection / Description: for each input image, find subset of points repeatably localizable
        - one time search for features
        - one time search for summary statistics: (color histograms, ??)
    - Image Similar Pair Search
        - limit total possible search space to pictures most likely to be successful in pairwise matching
            - color histogram to limit total number of pairs to test
            - load each other image to do feature compare
    - Image Pair F
        - good seed match points
        - find good F (~1px error) to initialize R in next step
    - Image Pair R
        - find semi-dense set of points starting with seed points
        - find good R (~1px error)
    - Tracks (from view pairs)
        - Smaller subset of best features to use in full view graph optimization, shared in at least 2 images
            - good corner score / textured, low R error, low F error, dominant corners first
        - good initial patch estimates
    - Image Triplets (from view pairs)
        - find relative scale of pairs
        - decrease relative error between camera matrices [only used to optimize TFT]
        - calculate TFT
    - Absolute Orientations (from pair & triplet camera matrices)
        - global absolute orientation of views in view graph
            - increase accuracy of camera initial orientations / reduce errors by using multiple measurements
    - Absolute RANSAC (from sparse track points) (using smaller set of points in order to use images )
        - build up multi-view-spanning tracks from individual pair-tracks (for long sequences if possible)
        - use tracks and initial view graph to find nonlinear best orientation
        - find new view pairs (and add to existing) via projection
    - Multiwise Dense (group dense iteration - use images: only load small subset of views at a time)
        - reduce errors on existing pairs using updated orientation
        - fill out more points in possibly mission sections [use TFT to estimate missing locations | project using known point]
        - create new pairs from previously unmatched relative orientations
    - USEFUL? Absolute Orientation 2 (better pairwise count & accuracy)
        - find improved absolute orientations of views, reducing error, using added & better estimates in view graph
    - Global RANSAC (load all dense points at same time [& views])
        - reduce error of all params at same time (or in randomized bunches)
        - final absolute camera orientations
        - final set of surface points
    - TODO:
        - Dense (increase surface resolution over what can fit in memory)
            - load pair/triple & allow each 2d cell area on order of pixels (3-5) opportunity to
                - support sectioning: store 'database' in single large or multiple file
                    - index between:
                        - track
                        - view
                        - voxel [divided/combined to max point count ~ 1E6]
                    - surface triangulation: only find surface a voxel at a time - propagation madness
    - Triangulate (simplify surface using curvature to estimate triangulated locations)
        - triangles
    - Texture (sourced from unobstructed views & blending)
        - textured triangles


- sparse seeds starts in 11x11 grid
- semi dense in ends in 5x5 grid
- should a 3x3 grid be run at end to add points to dense set? / HOW?



*TODO: EXAMPLE IMAGES*



<br/>
![Camera](./images/sfm/ex_pipeline_camera.png "Camera")
<br/>
*camera calibration using checkerboard pattern: matched corners, undistorted (radial & tangental)*
<br/>


<br/>
![Corners](./images/sfm/ex_pipeline_corners.png "Corners")
<br/>
*high confidence corner points found in an image, maximal corners suppressing less prominent ones*
<br/>


<br/>
![Features](./images/sfm/ex_pipeline_features.png "Features")
<br/>
*features derived from corners, using: most prominent direction (covariance or gradients), scale with peak corner value, and expanded area*
<br/>


<br/>
![Matches](./images/sfm/ex_pipeline_matches.png "Matches")
<br/>
*high confidence matches found using: simultaneous best match cost, limited cost, next-best-cost ratio, and F RANSACing*
<br/>


<br/>
![Pair](./images/sfm/ex_pipeline_pair.png "Pair")
<br/>
*reproduced 3D points & camera pair, using: minimizing error techniques, and propagating original matching seed points*
<br/>


<br/>
![Triple](./images/sfm/ex_pipeline_triple.png "Triple")
<br/>
*three camera triplet scene, used for finding relative scale of individual pair scenes*
<br/>


scene graph with edges / relative scales ...

<br/>
![Scene](./images/sfm/ex_pipeline_scene.png "Scene")
<br/>
*multi camera scene showing estimated points, again using error minimizing techniques and RANSACing*
<br/>


<br/>
![Triangles](./images/sfm/ex_pipeline_triangles.png "Triangles")
<br/>
*surface tessellation by estimating curvature, using advancing front techniques*
<br/>


<br/>
![Textures](./images/sfm/ex_pipeline_textures.png "Textures")
<br/>
*surface triangles using textures produced by merging best available camera images per triangle, example triangle packing*
<br/>







<br/>
![Image](./images/sfm/image.png "Image")
<br/>


### Other Info:

Data normalization - avoid hugely different magnitude of numbers that introduce rounding errors

Nonliner Estimation
Newton/'s method
Levenberg-Marquardt - need to construct/solve (large) matrix formulas for eg jacobian / hessian
Gradient Descent - do wtf you want [not necessarily as precise ]


#### Error:

#### Propagation: add normal distributions

&sigma;<sup>2</sup><sub>cummulative</sub>  = &Sigma;<sub>i</sub> &sigma;<sup>2</sup><sub>i</sub>
<br/>

&mu;<sub>cummulative</sub> = &Sigma; f( &mu;<sub>i</sub> )
<br/>


#### Combining: measurements to increase estimate confidence:

&mu;<sub>cummulative</sub> = [ &Sigma;<sub>i</sub>(&mu;<sub>i</sub>/&sigma;<sup>2</sup><sub>i</sub>) ] / [&Sigma;<sub>i</sub> (1/&sigma;<sup>2</sup><sub>i</sub>) ]
<br/>

&sigma;<sup>2</sup><sub>cummulative</sub> =  1 / (&Sigma;<sub>i</sub> 1/&sigma;<sup>2</sup><sub>i</sub>)
<br/>

(1/&sigma;<sup>2</sup><sub>i</sub>) ~ is like the percentage (weight)
<br/>

&Sigma;<sub>i</sub> (1/&sigma;<sup>2</sup><sub>i</sub>) ~ is a scale by the total weight, so that the total percent = 1
<br/>









---

<a name="REFERENCES"></a>
### References


#### General 3D Reconstruction

-

#### Camera Calibration



#### Feature Matching


Scale & Affine Invariant Interest Point Detectors : KRYSTIAN MIKOLAJCZYK AND CORDELIA SCHMID


#### Fundamental Matrix


#### Stereo Matching


#### Essential Matrix


#### Trifocal Tensor



#### Multiview



#### ...


#### ...



#### Author/ities:


Marc Pollefeys
Luc Van Gool

Richard Hartley
Andrew Zisserman
Philip Torr

Olivier Faugeras

Carlo Tomasi
Takeo Kanade
Zhengyou Zhang

Lowe - 2004


Keith N. Snavely - 2008


...
