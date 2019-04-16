# Variance



## covariance
Measure of the joint variability:
cov(X,Y) = E[ (X - E[X] &times; (Y - E[Y])]
cov = (x - &mu;<sub>x</sub>) * (y - &mu;<sub>y</sub>)

covariance 2D matrix: 2D gaussian distribution of data at 1 sigma
    - while it has a preferred / antipreferred direction, they are SYMMETRIC
    - flipping the primary eigenvector doesn't mean anything

gaussian:

sample = &lt;x,y,z&gt; @ w ; weight >= 0

mean: &mu;<sub>x</sub> = &Sigma; w<sub>i</sub> &times; x<sub>i</sub> / N

var = cov: &sigma;<sub>x</sub><sup>2</sup> = &Sigma; [ w<sub>i</sub> &times; (x<sub>i</sub> - &mu;<sub>x</sub>)(y<sub>i</sub> - &mu;<sub>y</sub>) ] / N

2D:
    [ cov(x,x)  cov(x,y) ]
    [ cov(x,y)  cov(y,y) ]

3D:
    [ cov(x,x)  cov(x,y)  cov(x,z) ]
    [ cov(x,y)  cov(y,y)  cov(y,z) ]
    [ cov(x,z)  cov(y,z)  cov(z,z) ]

covariance of 2 vectors:

    A = [3 6 4];
    B = [7 12 -9];
    cov(A,B)
    ans = 2×2

        2.3333    6.8333
        6.8333  120.3333

list of 2D points
get X properties
get Y properties

the covariances are of the AXIS, not of the vectors




## moment

com = &mu; = &Sigma; x &middot; P(x) &middot; dx

second moment: &sigma;<sup>2</sup> = &Sigma; (x - &mu;)<sup>2</sup> &middot; P(x) &middot; dx


## mass distribution


inertia: m * r^2 === m*(x-c)^2

=> DIFFERENCE: X Y Z are separate, whereas R is X


what about NON-SQUARED SIGMA ?






















...
