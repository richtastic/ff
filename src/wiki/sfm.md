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

This is a less documented area seems people prefer to spend effort on the easier cases

*TODO: research methods*


#### Iterative Solving

The intrinsic camera (K) and distortion parameters are first approximated using a linear solution, then further refined using iterative algorithms (solvers), which minimize some calculated error (cost) to move the values toward more correct ones.


*TODO: cost functions*


<a name="MATCHING"></a>
### Feature Matching


CORNERS

SCALES SPACE

- corner maxima
- blob maxima
- attempted: entropy constant, range constant,

SIFT

SURF

DAISY

ORB

BRIEF

BRISK

BGM

LATCH

KVLD

CODE

GMS

LDA-HASH

BINBOOST - Binary

...


low res : low frequency -> high res iteritive F refinement



failure points: repeated objects,



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

# Bag of Words
Some summary statistics / features of each image can be used to compare overlap

- features = vocabulary

- individual features in each image are assigned a boolean value indicating if there is a similar enough feature in the opposite image
-


- need large part or entire dataset to be preprocessed before the discarding can begin


- with all image features loaded:
	- can find clusters / nearest neighbors / overlap


progressive comparisons
	- perform easy calculations early on to discard candidate / to avoid wasted time on complicated calculations later




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




<a name="TEXTURE"></a>
### Texturing


- available views based on angle and distance





<a name="RENDERING"></a>
### Rendering






- pipeline




*TODO: EXAMPLE IMAGES*




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
