# Tesselation

### point cloud to triangle tesselation

...



### Going from triangle list to textured triangles:



pixels per (volume)^1/3
	low res: ~ 0.01
	 hi res: ~ 0.0001

for each triangle:
	area ~ resolution
	- if the resolution area were to be larger than can fit in packing rect:
		- subdivide triangle up [4 smaller triangles], re-add each to stack
		- continue
	- use views that are withing some angle of normal (60 deg)
	- align texture rect with some side, and pad area used by 1 pixel 
		for each pixel in texture rect:
			if pixel is within 1 pixel of triangle projection:
				get mean/median pixel color from all available views
					~ weight by angle[obliqueness] and by distance[resolution] of view
	- store texture in rect packing squares (1024x1024)






