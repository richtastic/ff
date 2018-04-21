# TFT (again)

*T* = [T<sub>1</sub>,T<sub>2</sub>,T<sub>3</sub>]
<br/>

canonical projective cameras P<sub>i</sub>:
<br/>
P<sub>1</sub> = (Id<sub>3</sub>|0)
<br/>
P<sub>2</sub> = (A|a<sub>4</sub>)
<br/>
P<sub>3</sub> = (B|b<sub>4</sub>)
<br/>


T<sub>i</sub> = a<sub>i</sub>&middot;b<sub>4</sub><sup>T</sup> - a<sub>4</sub>&middot;b<sub>i</sub><sup>T</sup>
<br/>
3 x 3 x 3 = 27 parameters
<br/>
DOG = 18
<br/>


<br/>
Triplets of points: x<sub>1</sub>, x<sub>2</sub>, x<sub>3</sub>
<br/>
[x<sub>2</sub>]<sub>&times;</sub>(&Sigma;<sub>i</sub>(x<sub>1</sub>)<sub>i</sub>&middot;T<sub>i</sub>)[x<sub>3</sub>]<sub>&times;</sub> = 0<sub>3x3</sub>
<br/>
4 Linearly independent equations from above equation:
<br/>
x<sub>2</sub><sup>T</sup>&middot;F<sub>2-1</sub>&middot;x<sub>1</sub> = 0
<br/>
x<sub>3</sub><sup>T</sup>&middot;F<sub>3-1</sub>&middot;x<sub>1</sub> = 0
<br/>
x<sub>3</sub><sup>T</sup>&middot;F<sub>3-2</sub>&middot;x<sub>2</sub> = 0
<br/>

F equations for above:
<br/>
F<sub>2-1</sub> = [a<sub>4</sub>]<sub>&cross;</sub>&middot;A
<br/>
F<sub>3-1</sub> = [b<sub>4</sub>]<sub>&cross;</sub>&middot;B
<br/>
F<sub>2-1</sub> = [b<sub>4</sub> - (B&middot;A<sup>-1</sup>)&middot;a<sub>4<sub>]&cross;</sub>&middot;(B&middot;A<sup>-1</sup>)

<br/>
Epipoles:
<br/>
e<sub>3-1</sub> = right null-vectors of T<sub>1</sub>, T<sub>2</sub>, T<sub>3</sub> (common intersection of lines)
<br/>
e<sub>2-1</sub> = left null-vectors of T<sub>1</sub>, T<sub>2</sub>, T<sub>3</sub> (common intersection of lines)
<br/>
F<sub>2-1</sub> = [e<sub>2-1</sub>]<sub>&cross;</sub>[T<sub>1</sub>&middot;e<sub>3-1</sub>, T<sub>2</sub>&middot;e<sub>3-1</sub>, T<sub>3</sub>&middot;e<sub>3-1</sub>]
<br/>
F<sub>3-1</sub> = [e<sub>3-1</sub>]<sub>&cross;</sub>[T<sub>1</sub>&middot;e<sub>2-1</sub>, T<sub>2</sub>&middot;e<sub>2-1</sub>, T<sub>3</sub>&middot;e<sub>2-1</sub>]
<br/>



Essential Matrix: (Given K<sub>i</sub>):
<br/>
[t<sub>i-j</sub>]<sub>&cross;</sub>R<sub>i-j</sub> = E<sub>i-j</sub> = K<sub>i</sub><sup>T</sup>&middot;F<sub>i-j</sub>&middot;K<sub>j</sub>
<br/>
(R<sub>2-1</sub>,t<sub>2-1</sub>) & (R<sub>3-1</sub>,t<sub>3-1</sub>) from SVD(E<sub>2-1</sub>) & SVD(E<sub>3-1</sub>)
<br/>

Overall scale: ||t<sub>2-1</sub>|| = 1
<br/>
Relative scale: &lamda; of t<sub>3-1</sub> = minimizing algebraic error on thrid image:
<br/>
arg min<sub>&lambda; &in; &Reals;</sub> &Sigma;<sub>n=1 to N</sub> || x<sub>3</sub><sup>n</sup> &Times; (K<sub>3</sub>(R<sub>3-1</sub>&middot;X<sup>n</sup> + &lambda;;(t<sub>3-1</sub>/||t<sub>3-1</sub>||))<sup>2</sup>
<br/>


<br/>
Constrain ||T|| = 1 => Linear SVD
<br/>


<br/>
Bundle Adjustment: minimize equared reprojection error (&epsilon;<sup>2</sup>) with N correspondences over M cameras
<br/>
<br/>
<br/>
<br/>

<br/>
<br/>


<br/>

<br/>
<br/>
<br/>

