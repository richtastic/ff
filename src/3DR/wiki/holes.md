
# hole filling

- hole-filling
- surface completion


https://xiaoyuanguo.github.io/website/A%20Survey%20on%20Algorithms%20of%20Hole%20Filling%20in%203D%20Surface%20Reconstruction.pdf


https://www.inf.ufrgs.br/~oliveira/pubs_files/FHPC/Wang_Oliveira_Filling%20Holes%20on%20Locally%20Smooth%20Surfaces_Imavis_2007_Pre-print.pdf
MLS

https://imr.sandia.gov/papers/imr15/branch.pdf

~ https://hal.inria.fr/hal-01220900/document
	laplacian
	poisson
	get hole-adjacent points & edges
	get points all around hole to satisfy sample set size
	advance-front, surface = best/soln to poisson equation


~ https://graphics.stanford.edu/papers/holefill-3dpvt02/hole.pdf
	signed distance (0 = surface)
	volumetric diffusion ~ heat equation
	separate volume ino voxels: insiude / outside / border


x https://www.scitepress.org/papers/2017/62965/62965.pdf
	point cloud
	textureless region hole filling
	boundaries
	ROI -> use pixels as formation of statistical hypothesis

HERE http://www.cad.zju.edu.cn/home/hwlin/pdf_files/A-robust-hole-filling-algorithm-for-triangular-mesh.pdf
	poisson equation w/ Dirichlet boundary
	advancing - front


http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.409.3685&rep=rep1&type=pdf

http://www.jsoftware.us/vol7/jsw0701-20.pdf

http://www.apsipa.org/proceedings/2017/CONTENTS/papers2017/13DecWednesday/Poster%201/WA-P1.6.pdf
pattern-texture matching?


https://pdfs.semanticscholar.org/ed27/2c0064c4c077def41bca71760e13a607a39e.pdf




poisson eq = general laplace's equation & ~ heat equation

http://farside.ph.utexas.edu/teaching/em/lectures/node31.html
http://www.damtp.cam.ac.uk/user/reh10/lectures/nst-mmii-chapter2.pdf

https://eng.libretexts.org/Bookshelves/Electrical_Engineering/Electro-Optics/Book%3A_Electromagnetics_I_(Ellingson)/05%3A_Electrostatics/5.15%3A_Poisson%E2%80%99s_and_Laplace%E2%80%99s_Equations


https://fenicsproject.org/pub/tutorial/sphinx1/._ftut1003.html



https://www.youtube.com/watch?v=lsY7zYaezto
https://www.youtube.com/watch?v=rrIStn9XEkc







- some holes SHOULD remain
	- eg: window
	- things may or may not be visible thru item
	- if things ARE visible, definitely don't fill
=> what would make a hole 'safe' to fill ?

=> classify WHY a hole is not filled







- variables to work with:
- planar rate
- planar acceleration (curvature)
- normal change (also curvature)

- identifying 'candidates':
	- edge lists already
	- 

- iteritive edge-fence-propagation - advancing front
- global field 

















- update patch from subdivision ----- separate function
	lo
		- update visual
	me
		- init affine
	hi
		- none
	su
		- none


patch init for different resolutions:
	low
		- use image visuals
			- size = rotation/scale affine
			- normal = average pToV
	med
		- back-propagate affine to plane  ---- this isn't a 'smooth' transition: affine is optimized separately and may be poor
	hig
		- copy average of 2D/3D neighbors (with at least 1 of same view) 3-6
	sup
		- copy best neighbor


patch update for different resolutions (view location changes):
	lo
		- visuals update
	me
		- back-project affine to plane
	hi
		- orientation delta
			- size = change in distance
			- normal = change in rotation
	sup
		- N/A - assume change in camera orientations is negligable


probe2D update for different resolutions (affine2D update):
	low
		- affine comes from projected 3D point (OR optimized locally with images?)
	med
		- affine comes from optimized locally
	hig
		- affine comes from local point neighborhood average
	sup
		- affine comes from best neighbor



