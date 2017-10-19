## Bundle Adjustment


- refining camera positions

- refining 3d coordinates (and throwing out bad points)
	- how to differentiate good / vs bad ?
		- only use best of best, and if other points have higher variance => ignore ?
- 


3DPOINT
	- locations[]
		- image
		- point2d
	- ...



- multi-view points can be tracked along multiple images via point matches with similar SAD/NCC scores
- 


World
	- view list []
	- camera
	- 3D point list []

View/Screen:
	- image
	- 2d point list []
	- relationships/arrangements list []
		- view
		- transform TO (forward)

Screen Point / 2D
	- match list []
		- view
		- point2D
		- scale
		- angle
		- score
	- point3D









feature points via corner @ different scales
sift features for each point
sift matches
refined sift matches











































