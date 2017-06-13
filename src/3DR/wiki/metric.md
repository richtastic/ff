## Upgrading from projective to metric

<br/>
&pi;<sub>&infin;</sub> : plane at infinity
<br/>
&omega; = (IAC) image of absolute conic
<br/>
&omega;<sup>&ast;</sup> = (DIAC) dual image of absolute conic
<br/>


<br/>
H<sub>P</sub> : Projective homography
<br/>
H<sub>A</sub> : Affine homography
<br/>
H<sub>M</sub> : Metric homography

&middot;




**i**: camera index
<br/>
**m**: camera total count
<br/>
**j**: point index (2D or 3D)
<br/>
**Projective Reconstruction**: P<sub>i</sub> = K<sub>i</sub>[R<sub>i</sub> | t<sub>i</sub>]
<br/>
**Metric Reconstruction**: P<sub>M<sub><sub>i</sub> = P<sub>i</sub>H
<br/>
**Assumed First Camera** = P<sub>M</sub><sub>1</sub> = K<sub>i</sub>[I | 0]
<br/>
&pi;<sub>&infin;</sub> = (p<sup>2</sup>,1)<sup>T</sup>
<br/>
A = ? K1 ?
<br/>
H = [A t ; v<sup>T</sup> k] = [K<sub>i</sub> 0 ; v<sup>T</sup> 1]
<br/>
v = (-p<sup>T</sup>K)<sup>T</sup>
<br/>
<br/>
<br/>


B = A<sub>i</sub> - a<sub>i</sub>p<sup>T</sup>
<br/>
K<sub>i</sub>K<sub>i</sub><sup>T</sup> = B K<sub>1</sub>K<sub>1</sub><sup>T</sup> B<sup>T</sup>
<br/>
&omega;<sub>i</sub> = K<sub>i</sub>K<sub>i</sub><sup>T</sup>
<br/>
&rArr;
<br/>
&omega;<sub>i</sub><sup>&ast;</sup> = B &omega;<sub>i</sub><sup>&ast;</sup> B<sup>T</sup>
<br/>
&omega;<sub>i</sub> = B &omega;<sub>i</sub> B<sup>T</sup>
<br/>


**Kruppa Equations**: algebraic representation of correspondence of epipolar lines tangent to a conic
	- weaker constraings
		- not engorce (dual) quadric is degenerate
		- ...ambiguities




Modulus Constraint: constraints on &pi;<sub>&inf;</sub> : modulus (magnitude) are equal

STRATIFIED:

<br/>
&rArr;
<br/>
H<sub>P</sub>
<br/>
&rArr;
<br/>
p
<br/>
&pi;<sub>&infin;</sub>
<br/>
&rArr;
<br/>
H<sub>A</sub>
<br/>
&rArr;
<br/>
H<sub>&infin;</sub>
&rArr;
<br/>
&omega;
<br/>
K
<br/>
&rArr;
<br/>
H ...
<br/>
&rArr;
<br/>
P<sub>M</sub><sub>i</sub>
<br/>

<br/>


19.2 p479
	i) find p (for &pi;<sub>&infin;</sub>)
		19.5.1 p 
			A - a&middot;p<sup>T</sup> = &mu;&middot;K&middot;R&middot;<sup>-1</sup>
			&mu; =?= 1
				eigen(A - a&middot;p<sup>T</sup>) = {&mu;,&mu;e<sup>i&theta;</sup>,&mu;e<sup>-i&theta;</sup>} (equal moduli)
			p = ?
			quartic equation solutions
			4^3 = 64 solutions ?
			- [Schaffalitzky-00a]
			- cubic equation
				 [Schaffalitzky-00a].
		- quasi-affine reconstruction
			[Hartley-94b]

		=> H<sub>P</sub> = [I 0 ; -p<sup>T</sup> 1]


		H<sub>A</sub> = P<sub>i</sub>H<sub>P</sub>
		X<sub>j</sub> = H<sub>P</sub><sup>-1</sup>
	ii)




Hartley [53]
[52]
Hartley’s cheirality [53]

Methods of bounding the position of π∞ using cheiral inequalities will be described in chapter 21
--- focal length is still unknown => rough estimated




http://homepages.inf.ed.ac.uk/rbf/CVonline/LOCAL_COPIES/FUSIELLO3/node5.html


...


[52] R.Hartley,“Cheiralityinvariants”,Proc.D.A.R.P.A.ImageUnderstandingWork- shop, pp. 743-753, 1993.
[53] R.Hartley,“Euclideanreconstructionfromuncalibratedviews”,in:J.L.Mundy, A. Zisserman, and D. Forsyth (eds.), Applications of Invariance in Computer Vision, Lecture Notes in Computer Science, Vol. 825, Springer-Verlag, pp. 237- 256, 1994.



[Schaffalitzky-00a] F.Schaffalitzky.Directsolutionofmodulusconstraints.InProceedingsoftheIndian Conference on Computer Vision, Graphics and Image Processing, Bangalore, pages 314–321, 2000.

[Hartley-94b] R. I. Hartley. Euclidean reconstruction from uncalibrated views. In J. Mundy, A. Zis- serman, and D. Forsyth, editors, Applications of Invariance in Computer Vision, LNCS 825, pages 237–256. Springer-Verlag, 1994.







http://mathworld.wolfram.com/QuarticEquation.html

https://jbt.github.io/markdown-editor/#HYw5DoAgEAD7fcVWRCsfAJIQbXzGikg24QrH/z3KmUkGAERhqdo4teB0c5Jq+QBEjs7TV4oW1Prvi8YVp/0w24zXoIAcyTvMN9LZchjdoc2JLbzbamqVAA8=


http://localhost/ff/3DR/manual.html
http://localhost/ff/3DR/matching.html
http://www.cc.gatech.edu/~hays/compvision/
http://www.cc.gatech.edu/~hays/compvision/results/proj2/html/dfan6/index.html
http://www.cc.gatech.edu/~hays/compvision/results/proj3/html/xwu72/index.html
http://www.vlfeat.org/api/sift.html
http://www.vlfeat.org/overview/sift.html
https://cseweb.ucsd.edu/classes/wi16/cse252B-a/









