# Stereopsis



### Initial Pair F Guess

- Find Features
- Initial Feature Matches
- Best Features Aligning with F
- Corners Around Best Features, consistent with F
- Best Corners Aligning with F
- Semi-Dense Corners Aligning with F
- Seeded Search for Dense F Matching
	- Iterate:
		- Update F
		- Update Errors
			- F, N, S
		- Expand 2D Neighborhoods Around Existing Points
		- Drop Outliers
			- Global: F N S
			- Local: F N S
			- Local Regularization:
				- Affine mismatch predicted vs expected neighbors
			- Local F v Affine angle difference
				- worst outliers affine average angle not aligning with F
		- Subdivide Cells
=> F, Seed Points

### Coarse Pair

- Seed Points & Initial F & K
- Initial R Estimate
- Initial Patch Estimate
	- Use Image
- Iterate:
	- Update Errors
		- R, F, N, S
	- Optimize R
	- Update F
	- Update Point From View Change
	- Update Errors
		- R, F, N, S
	- Expand 2D Neighborhoods Around Existing Points
		- Initial Patch Estimate:
			- If 0 Subdivision
				- Use Image 
			- Else
				- Use Neighborhood Averaging
		- Update Patch Estimate:
			- If 0,1 Subdivision:
				- Use Image
			- Else
				- N/A
	- Drop Outliers
		- Global R F N S
		- Negative Points (Behind Cameras)
		- Local Regularization 2D (predicted v actual distances)
		- Local Regularization 3D (Backproject 2D neighborhood to 3D plane)
		- Local 2D->3D  &  3D->2D neighborhood percentage
		- Local 2D/3D consistent normals ??? 
		- Local 3D planar distance ??
		- Patch Obstruction
		- ...
		- ...

world.dropNegativePoints3D();
world.dropFurthest();
world.filterLocal3Dto2DSize();
world.filterNeighborConsistency();
// world.filterLocal3D(); // ...
// world.filterPairwiseSphere3D(1.0); // 2-3
world.filterGlobalPatchSphere3D(2.0, false);

// ?: start more rigid, allow for more error, finish rigid
// world.filterGlobalMatches(false, 0, 2.0,2.0,2.0,2.0, false);
world.filterGlobalMatches(false, 0, 3.0,3.0,3.0,3.0, false);
	
	- Subdivide Cells
	- Update Point From Size Change

=> R

### Dense Pair

- Search along F / R for Corner Point Matches
- Loop
	- Same As Coarse Pair ?

=> R low error, surface points/patches

### Dense Group

- patch points are only updated geometrically / neighborhood

- view visibility filter

### World






