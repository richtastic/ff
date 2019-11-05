# Circular Normal Distribution 




### Circular Normal
- directional statistics
- circular normal
- wrapped normal
- mises


### 2D Circle: von Mises
- approximation to Circular Normal, easier to calculate
n &isin; S<sup>1</sup>


```
u = preferred direction (mean)
n = given direction on circle
k = concentration parameter
q() = magnitude of propability at a given point
q(n) = 1/[2 * pi * I_0(k)] * exp(k * n * u)
I_n = moment
I_0 = first moment

E = expectation
E[q] = I_1(k)/I_0(k) * u
Var = variance
Var[q] = ....

```


### 3D Sphere: Fisher / Mises-Fisher

n &isin; S<sup>2</sup>

""

```
q(n) = k/[4 * pi * sinh(k)] * exp(k * n * u)
E[q] = (coth(k) - 1/k) * u
Var[q] = (...)
```






#### Modified Bessel functions of first kind and order k






Generating function:
```
exp(x * (t + 1/t) / 2) * Sum(n=-inf,inf) I_n(x)t^n
```








http://mathworld.wolfram.com/ModifiedBesselDifferentialEquation.html
http://mathworld.wolfram.com/ModifiedBesselFunctionoftheFirstKind.html




http://mathworld.wolfram.com/BesselFunctionoftheFirstKind.html








#### Ad Hoc:
- specific to finding the neighborhood density:

- get containing sphere [radius & center]
- if highly ellipsoid-flat (sigmaMid/sigmaMin > 4) => planar surface already
- get list of normals from points & center
A) radially:
	- spherically average normals to get center
	- spherical moment of normal angles to get extent
		distance_i = (theta)/pi     [0,1]
			exponential mapping?
		moment += (d_i ^ 2)
		- if very close: moment ~ 0
		- if very spread: moment ~ 0.5?
B) rectilinear?
	- sum up normals to get weighted direction
		- magnitude of normal is proportional to preferred direction
			- if very close: k ~1
			- if very spread: k ~0

i) Directional?
	- pick a direction x & y on spherical/plane
	- each point is in this?
















---

CIRCULAR / SPHERICAL DISTRIBUTIONS:
	- COM ANGLE/DIR [could be different from normal]
	- SIGMA == angle distance from COM


circular distribution: [circular, circular normal, mises, ]
	- mean of circular quantity: = first moment =
		- z = e^i*theta
		- m1 = 1/N * SUM z_i
		- R = | m1 |
		- variance = V(z) = 1 - R [0 to 1]
		- stddev = S(z) = ( -2*ln(R) )^1/2
		- dispersion = d =  (1 - R_2) / (2*R^2)
		- KAPPA ?

spherical distribution: [mises-fisher, Directional statistics, wrapped normal, kent dist, elliptical dist, ]
	-
	- confidence cone?

	https://en.wikipedia.org/wiki/Von_Mises%E2%80%93Fisher_distribution
	http://pascal.upf.edu/am/dades/h-s-mva-book/mvahtmlnode42.html
	https://freakonometrics.hypotheses.org/files/2015/11/distribution_workshop.pdf
	http://www2.compute.dtu.dk/~sohau/papers/fusion2018/paper.pdf
	https://en.wikipedia.org/wiki/Kent_distribution
	https://alexsingleton.files.wordpress.com/2014/09/25-directional-statistics.pdf
	http://suvrit.de/papers/sra_dirchap.pdf
	https://pdfs.semanticscholar.org/bdae/bf35908d4ce3a37d90d8fea26dc8a396c2d0.pdf
	http://palaeo.spb.ru/pmlibrary/pmbooks/mardia&jupp_2000.pdf
	http://library.sadjad.ac.ir/opac/temp/19108.pdf
	https://core.ac.uk/download/pdf/12009314.pdf


	- 
	...
