## Structure From Motion: (SFM) Algorithms



### Chapters

0) [Summary](#SUMMARY)


<a name="SUMMARY"></a>
### Summary

**Algorithm Investigations**
...


Image Sample Extracting
	- aliasing when zooming out (more pixels to choose from than area available)
		- pre-blurr, subsample
		- 
	- interpolating
		- bilinear
		- biquadric (not really used / uneven)
		- bicubic
	- pre-scale set by 2 & select on the fly
		- 



Basic Matching
	- picking out best match from list of possible matches

	Compare Data:
		Grayscale (single channel)
		R G B separate channels
		RGB vectors
		gradient variations of the above ^ 
	
Finding Needle / Haystack
	- finding location of feature A inside image B

	- size of area
		- coarse to fine
		- 

Local Area Transform Matching
	- rotation, scale, skew, asymmetric scale
	- affine
	- projective




Feature Descriptor / Matching
	- unknown point/feature relative rotation / scale
	- flat
		- grayscale
		- 3-channel
		- RGB vector
		- HSV, ...
	- 
	- SIFT
	- 

Optimal Comparrison Standard?
	- SCALE:
		- equal range (constant)
		- equal entropy (constant)
		- scale space extrema
		- corner space extrema
		- 
	- ANGLE:
		- dominant direction
			- gradient maximum
			- gradient average
			- circular mask gradient
		- ...









	- data: gray / color
	- data: flat / grad
	- SAD
	- SSD
	- CC / NCC
	- grad


- 



<br/>
<br/>
<br/>
<br/>
<br/>

















<br/>


---