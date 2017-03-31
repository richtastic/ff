# Dense Feature Matching

## Definitions
<br/>
**A** = image haystack 1, arbitrary pixel dimensions
<br/>
**B** = image haystack 2, arbitrary pixel dimensions
<br/>

Image haystacks are each divided up into a grid: **n** columns (x) by **m** rows (y), not necessarily equal for 
<br/>
**G<sub>i</sub>** = Grid for image i
<br/>
**G<sub>i<sub>n</sub></sub>** = number of cell columns of Grid G<sub>i</sub>
<br/>
**G<sub>i<sub>m</sub></sub>** = number of cell rows of Grid G<sub>i</sub>
<br/>

A feature is an object in an image, with an exact center which resides inside a single cell, but can have a size that may span multiple cells. A cell can have multiple features.
<br/>
**F<sub>i</sub>** = feature i, inside of a grid
<br/>

A match is an object that maps a single feature from one grid to a feature in another grid
<br/>
**M<sub>i,j</sub>** = match between feature i in first grid to feature j in second grid
<br/>

A feature can have multiple matches: features in a second grid which have some matching ranking describing the confidence that the features match
<br/>
**M<sub>p<sub>i,j</sub></sub>** = ranking metric/prioritization for features i and j
<br/>

To rank matches, queues area used
<br/>
**Q<sub>?</sub>** = queue prioritizing better matches at front
<br/>



cell > [feature] > [matches]




## Dense Matching
<br/>
**Input:** 2 Images A & B, initial _seed_ feature matches
<br/>
**Q<sub>g</sub>** = global queue for all purported matches between features in **G<sub>A</sub>** and **G<sub>B</sub>**
<br/>
- construct grids **G<sub>A</sub>** and **G<sub>B</sub>** with desired grid precision
- add seed matches to **Q<sub>g</sub>**
- while **Q<sub>g</sub>** has GOOD potential matches
	- **M<sub>top</sub>** = pop off top match
	- set cells **a** and **b** of **M<sub>top</sub>** as matched 
	- for each _neighbor_ in a (**a<sub>i</sub>**):
		- calculate best match **M<sub>best<sub>a<sub>i</sub>,b<sub>i</sub></sub></sub>** from each of (**b<sub>i</sub>**)
		- add to **Q<sub>g</sub>**
	- for each _neighbor_ in b (**b<sub>i</sub>**):
		- calculate best match **M<sub>best<sub>b<sub>i</sub>,a<sub>i</sub></sub></sub>** from each of (**a<sub>i</sub>**)
		- add to **Q<sub>g</sub>**
<br/>


## Best Match 
<br/>
For a given cell **C<sub>needle</sub>** and cell **B<sub>haystack</sub>**:
- F<sub>needle</sub> = main feature point
- for each neighbor in B<sub>haystack</sub>:
	- calculate SoSD
- best SoSD of all neighbors is best match


- main feature point = center of cell (lazy) or most prominent feature (most corner-like point)

## Progressive Dense Matching
<br/>
- begin with entire image A and B, finding dense matching grids
- for all grids with matches, repeat dense matching using only the matched grid's neighborhood

... could use new features as seeds & iterate again on finer-mesh
... could use individual grids(& surroundings) as new images

<br/>
