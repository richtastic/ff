## Structure From Motion: (SFM)



### Chapters

0) [Summary](#SUMMARY)
0) [Picture Acquisition](#PHOTOS)
0) [Camera Calibration](#CALIBRATION)
0) [Feature Matching](#MATCHING)
0) [Fundamental Matrix](#FUNDAMENTAL)
0) [Stereo Matching](#STEREO)
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
- ...



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


Cameras that vary significantly from the linear model are said to have _distortion_, modeled using polynomials:


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


#### Iteritive Solving

The intrinsic camera (K) and distortion parameters are first approximated using a linear solution, then further refined using iterative algorithms (solvers), which minimize some calculated error (cost) to move the values toward more correct ones.


*TODO: cost functions*


<a name="Feature Matching"></a>
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






<a name="FUNDAMENTAL"></a>
### Fundamental Matrix




<a name="STEREO"></a>
### Stereo Matching



- rectification to parallel lines
    - homography
    - nonlinear

reduce searching to single line

hierarchical matching


<a name="PAIRS"></a>
### Pair Reconstruction

# Essential Matrix E





<a name="TRIPLES"></a>
### Triplet Reconstruction




# Trifocal Tensor (T)




<a name="MULTIVIEW"></a>
### Multi View Reconstruction


graph relating transforms
- separate pairwise unknown base

- translation / rotation averaging

- skeletal graph




Dense:

patches



distributed (can't fit all in memory)

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


---

<a name="REFERENCES"></a>
### References


#### General 3D Reconstruction

-

#### Camera Calibration



#### Feature Matching


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



...
