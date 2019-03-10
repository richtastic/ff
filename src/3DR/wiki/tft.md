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

t = A + &alpha;&middot;B

t = t<sub>1</sub>&middot;t<sub>2</sub>&middot;t<sub>5</sub> - t<sub>2</sub>&middot;t<sub>3</sub>&middot;t<sub>5</sub> - t<sub>2</sub>&middot;t<sub>4</sub>&middot;t<sub>5</sub> - t<sub>1</sub>&middot;t<sub>3</sub>&middot;t<sub>4</sub> + t<sub>2</sub>&middot;t<sub>3</sub>&middot;t<sub>4</sub> + t<sub>3</sub>&middot;t<sub>4</sub>&middot;t<sub>5</sub>


t = (a<sub>1</sub> + &alpha;&middot;b<sub>1</sub>)&middot;(a<sub>2</sub> + &alpha;&middot;b<sub>2</sub>)&middot;(a<sub>5</sub> + &alpha;&middot;b<sub>5</sub>) - (a<sub>2</sub> + &alpha;&middot;b<sub>2</sub>)&middot;(a<sub>3</sub> + &alpha;&middot;b<sub>3</sub>)&middot;(a<sub>5</sub> + &alpha;&middot;b<sub>5</sub>) - (a<sub>2</sub> + &alpha;&middot;b<sub>2</sub>)&middot;(a<sub>4</sub> + &alpha;&middot;b<sub>4</sub>)&middot;(a<sub>5</sub> + &alpha;&middot;b<sub>5</sub>) - (a<sub>1</sub> + &alpha;&middot;b<sub>1</sub>)&middot;(a<sub>3</sub> + &alpha;&middot;b<sub>3</sub>)&middot;(a<sub>4</sub> + &alpha;&middot;b<sub>4</sub>) + (a<sub>2</sub> + &alpha;&middot;b<sub>2</sub>)&middot;(a<sub>3</sub> + &alpha;&middot;b<sub>3</sub>)&middot;(a<sub>4</sub> + &alpha;&middot;b<sub>4</sub>) + (a<sub>3</sub> + &alpha;&middot;b<sub>3</sub>)&middot;(a<sub>4</sub> + &alpha;&middot;b<sub>4</sub>)&middot;(a<sub>5</sub> + &alpha;&middot;b<sub>5</sub>)

t = A - B - C - D + E + F = 0

A = (a<sub>1</sub> + &alpha;&middot;b<sub>1</sub>)&middot;(a<sub>2</sub> + &alpha;&middot;b<sub>2</sub>)&middot;(a<sub>5</sub> + &alpha;&middot;b<sub>5</sub>)

=

a<sub>1</sub>&middot;a<sub>2</sub>&middot;a<sub>5</sub> + &alpha;&middot;a<sub>1</sub>&middot;b<sub>2</sub>&middot;a<sub>5</sub> + &alpha;&middot;a<sub>2</sub>&middot;b<sub>1</sub>&middot;a<sub>5</sub> + &alpha;<sup>2</sup>&middot;b<sub>1</sub>&middot;b<sub>2</sub>&middot;a<sub>5</sub>

&plus;

a<sub>1</sub>&middot;a<sub>2</sub>&middot;&alpha;&middot;b<sub>5</sub> + &alpha;&middot;a<sub>1</sub>&middot;b<sub>2</sub>&middot;&alpha;&middot;b<sub>5</sub> + &alpha;&middot;a<sub>2</sub>&middot;b<sub>1</sub>&middot;&alpha;&middot;b<sub>5</sub> + &alpha;<sup>2</sup>&middot;b<sub>1</sub>&middot;b<sub>2</sub>&middot;&alpha;&middot;b<sub>5</sub>



<br/>

=

a<sub>1</sub>&middot;a<sub>2</sub>&middot;a<sub>5</sub> +
&alpha;&middot;a<sub>1</sub>&middot;a<sub>5</sub>&middot;b<sub>2</sub> +
&alpha;&middot;a<sub>2</sub>&middot;b<sub>1</sub>&middot;a<sub>5</sub> +
&alpha;<sup>2</sup>&middot;a<sub>5</sub>&middot;b<sub>1</sub>&middot;b<sub>2</sub>

&plus;

&alpha;&middot;a<sub>1</sub>&middot;a<sub>2</sub>&middot;b<sub>5</sub> +
&alpha;<sup>2</sup>&middot;a<sub>1</sub>&middot;b<sub>2</sub>&middot;b<sub>5</sub> +
&alpha;<sup>2</sup>&middot;a<sub>2</sub>&middot;b<sub>1</sub>&middot;b<sub>5</sub> +
&alpha;<sup>3</sup>&middot;b<sub>1</sub>&middot;b<sub>2</sub>&middot;b<sub>5</sub>



<br/>

=

a<sub>1</sub>&middot;a<sub>2</sub>&middot;a<sub>5</sub>



&alpha;&middot;(a<sub>1</sub>&middot;a<sub>5</sub>&middot;b<sub>2</sub> + a<sub>2</sub>&middot;b<sub>1</sub>&middot;a<sub>5</sub> + a<sub>1</sub>&middot;a<sub>2</sub>&middot;b<sub>5</sub>)


&alpha;<sup>2</sup>&middot;(a<sub>5</sub>&middot;b<sub>1</sub>&middot;b<sub>2</sub> + a<sub>1</sub>&middot;b<sub>2</sub>&middot;b<sub>5</sub> + a<sub>2</sub>&middot;b<sub>1</sub>&middot;b<sub>5</sub>)

&alpha;<sup>3</sup>&middot;b<sub>1</sub>&middot;b<sub>2</sub>&middot;b<sub>5</sub>


<br/>

GENERICALLY:

=

a<sub>1</sub>&middot;a<sub>2</sub>&middot;a<sub>3</sub>



&alpha;&middot;(a<sub>1</sub>&middot;a<sub>3</sub>&middot;b<sub>2</sub> + a<sub>2</sub>&middot;b<sub>1</sub>&middot;a<sub>3</sub> + a<sub>1</sub>&middot;a<sub>2</sub>&middot;b<sub>3</sub>)


&alpha;<sup>2</sup>&middot;(a<sub>3</sub>&middot;b<sub>1</sub>&middot;b<sub>2</sub> + a<sub>1</sub>&middot;b<sub>2</sub>&middot;b<sub>3</sub> + a<sub>2</sub>&middot;b<sub>1</sub>&middot;b<sub>3</sub>)

&alpha;<sup>3</sup>&middot;b<sub>1</sub>&middot;b<sub>2</sub>&middot;b<sub>3</sub>






<br/>







B = (a<sub>2</sub> + &alpha;&middot;b<sub>2</sub>)&middot;(a<sub>3</sub> + &alpha;&middot;b<sub>3</sub>)&middot;(a<sub>5</sub> + &alpha;&middot;b<sub>5</sub>)

C = (a<sub>2</sub> + &alpha;&middot;b<sub>2</sub>)&middot;(a<sub>4</sub> + &alpha;&middot;b<sub>4</sub>)&middot;(a<sub>5</sub> + &alpha;&middot;b<sub>5</sub>)

D = (a<sub>1</sub> + &alpha;&middot;b<sub>1</sub>)&middot;(a<sub>3</sub> + &alpha;&middot;b<sub>3</sub>)&middot;(a<sub>4</sub> + &alpha;&middot;b<sub>4</sub>)

E = (a<sub>2</sub> + &alpha;&middot;b<sub>2</sub>)&middot;(a<sub>3</sub> + &alpha;&middot;b<sub>3</sub>)&middot;(a<sub>4</sub> + &alpha;&middot;b<sub>4</sub>)

F = (a<sub>3</sub> + &alpha;&middot;b<sub>3</sub>)&middot;(a<sub>4</sub> + &alpha;&middot;b<sub>4</sub>)&middot;(a<sub>5</sub> + &alpha;&middot;b<sub>5</sub>)




<br/>






<br/>






<br/>

Trifocal transfer
<br/>








[*x'*]<sub>&times;</sub> &middot; (&Sigma;<sub>i</sub> *x<sub>i</sub>* &middot; *T<sub>i</sub>*] ) &middot; [*x''*]<sub>&times;</sub> = *0*<sub>3&times;3</sub>

<br/>

[*x'*]<sub>&times;</sub> &middot; (&Sigma;<sub>i</sub> *x<sub>i</sub>* &middot; *T<sub>i</sub>*] ) &middot; [*x''*]<sub>&times;</sub>

<br/>

[*b*]<sub>&times;</sub> &middot; (&Sigma;<sub>i</sub> *a<sub>i</sub>* &middot; *T<sub>i</sub>*] ) &middot; [*c*]<sub>&times;</sub>

<br/>

Z = &Sigma;<sub>i</sub> *a<sub>i</sub>* &middot; *T<sub>i</sub>* = [z<sub>0,0</sub> z<sub>0,1</sub> z<sub>0,2</sub>; z<sub>1,0</sub> z<sub>1,1</sub> z<sub>1,2</sub> ; z<sub>2,0</sub> z<sub>2,1</sub> z<sub>2,2</sub>]

<br/>

[*b*]<sub>&times;</sub> &middot; *Z* &middot; [*c*]<sub>&times;</sub>

<br/>


[0 -1 b<sub>y</sub> ; 1 0 -b<sub>x</sub> ; -b<sub>y</sub> b<sub>x</sub> 0]
&middot;
[z<sub>0,0</sub> z<sub>0,1</sub> z<sub>0,2</sub>; z<sub>1,0</sub> z<sub>1,1</sub>; z<sub>1,2</sub> ; z<sub>2,0</sub> z<sub>2,1</sub> z<sub>2,2</sub>]
&middot;
[0 -1 c<sub>y</sub> ; 1 0 -c<sub>x</sub> ; -c<sub>y</sub> c<sub>x</sub> 0] = [0 0 0 ; 0 0 0 ; 0 0 0]

<br/>
<br/>

[0 -1 b<sub>y</sub>]
<br/>
[1 0 -b<sub>x</sub>]
<br/>
[-b<sub>y</sub> b<sub>x</sub> 0]
<br/>
&middot;
<br/>
[z<sub>0,0</sub> z<sub>0,1</sub> z<sub>0,2</sub>]
<br/>
[z<sub>1,0</sub> z<sub>1,1</sub> z<sub>1,2</sub>]
<br/>
[z<sub>2,0</sub> z<sub>2,1</sub> z<sub>2,2</sub>]
<br/>
&middot;
<br/>
[0 -1 c<sub>y</sub>]
<br/>
[1 0 -c<sub>x</sub>]
<br/>
[-c<sub>y</sub> c<sub>x</sub> 0]
<br/>
=
<br/>
[0 0 0]
<br/>
[0 0 0]
<br/>
[0 0 0]
<br/>

<br/>


[0 -1 b<sub>y</sub>]
<br/>
[1 0 -b<sub>x</sub>]
<br/>
[-b<sub>y</sub> b<sub>x</sub> 0]
<br/>
&middot;
<br/>
[ z<sub>0,1</sub> - z<sub>0,2</sub>&middot;c<sub>y</sub>
| z<sub>0,2</sub>&middot;c<sub>x</sub> - z<sub>0,0</sub>
| z<sub>0,0</sub>&middot;c<sub>y</sub> - z<sub>0,1</sub>&middot;c<sub>x</sub> ]
<br/>
[ z<sub>1,1</sub> - z<sub>1,2</sub>&middot;c<sub>y</sub>
| z<sub>1,2</sub>&middot;c<sub>x</sub> - z<sub>1,0</sub>
| z<sub>1,0</sub>&middot;c<sub>y</sub> - z<sub>1,1</sub>&middot;c<sub>x</sub> ]
<br/>
[ z<sub>2,1</sub> - z<sub>2,2</sub>&middot;c<sub>y</sub>
| z<sub>2,2</sub>&middot;c<sub>x</sub> - z<sub>2,0</sub>
| z<sub>2,0</sub>&middot;c<sub>y</sub> - z<sub>2,1</sub>&middot;c<sub>x</sub> ]
<br/>


<br/>
[ b<sub>y</sub>&middot;(z<sub>2,1</sub> - z<sub>2,2</sub>&middot;c<sub>y</sub>) - (z<sub>1,1</sub> - z<sub>1,2</sub>&middot;c<sub>y</sub>)
| b<sub>y</sub>&middot;(z<sub>2,2</sub>&middot;c<sub>x</sub> - z<sub>2,0</sub>) - (z<sub>1,2</sub>&middot;c<sub>x</sub> - z<sub>1,0</sub>)
| b<sub>y</sub>&middot;(z<sub>2,0</sub>&middot;c<sub>y</sub> - z<sub>2,1</sub>&middot;c<sub>x</sub>) - (z<sub>1,0</sub>&middot;c<sub>y</sub> - z<sub>1,1</sub>&middot;c<sub>x</sub>) ]
<br/>
[ (z<sub>0,1</sub> - z<sub>0,2</sub>&middot;c<sub>y</sub>) - b<sub>x</sub>&middot;(z<sub>2,1</sub> - z<sub>2,2</sub>&middot;c<sub>y</sub>)
| (z<sub>0,2</sub>&middot;c<sub>x</sub> - z<sub>0,0</sub>) - b<sub>x</sub>&middot;(z<sub>2,2</sub>&middot;c<sub>x</sub> - z<sub>2,0</sub>)
| (z<sub>0,0</sub>&middot;c<sub>y</sub> - z<sub>0,1</sub>&middot;c<sub>x</sub>) - b<sub>x</sub>&middot;(z<sub>2,0</sub>&middot;c<sub>y</sub> - z<sub>2,1</sub>&middot;c<sub>x</sub>) ]
<br/>
[ b<sub>x</sub>&middot;(z<sub>1,1</sub> - z<sub>1,2</sub>&middot;c<sub>y</sub>) - b<sub>y</sub>&middot;(z<sub>0,1</sub> - z<sub>0,2</sub>&middot;c<sub>y</sub>)
| b<sub>x</sub>&middot;(z<sub>1,2</sub>&middot;c<sub>x</sub> - z<sub>1,0</sub>) - b<sub>y</sub>&middot;(z<sub>0,2</sub>&middot;c<sub>x</sub> - z<sub>0,0</sub>)
| b<sub>x</sub>&middot;(z<sub>1,0</sub>&middot;c<sub>y</sub> - z<sub>1,1</sub>&middot;c<sub>x</sub>) - b<sub>y</sub>&middot;(z<sub>0,0</sub>&middot;c<sub>y</sub> - z<sub>0,1</sub>&middot;c<sub>x</sub>) ]
<br/>

---

<br/>
*0,0:*
<br/>
b<sub>y</sub>&middot;(z<sub>2,1</sub> - z<sub>2,2</sub>&middot;c<sub>y</sub>) - (z<sub>1,1</sub> - z<sub>1,2</sub>&middot;c<sub>y</sub>)
<br/>
b<sub>y</sub>&middot;z<sub>2,1</sub> - b<sub>y</sub>&middot;z<sub>2,2</sub>&middot;c<sub>y</sub> - z<sub>1,1</sub> + z<sub>1,2</sub>&middot;c<sub>y</sub>
<br/>
b<sub>y</sub>&middot;[a<sub>x</sub>&middot;T<sub>1<sub>2,1</sub> </sub>+ a<sub>y</sub>&middot;T<sub>2<sub>2,1</sub></sub> + T<sub>3<sub>2,1</sub></sub>] - b<sub>y</sub>&middot;[a<sub>x</sub>&middot;T<sub>1<sub>2,2</sub> </sub>+ a<sub>y</sub>&middot;T<sub>2<sub>2,2</sub></sub> + T<sub>3<sub>2,2</sub></sub>]&middot;c<sub>y</sub> - [a<sub>x</sub>&middot;T<sub>1<sub>1,1</sub> </sub>+ a<sub>y</sub>&middot;T<sub>2<sub>1,1</sub></sub> + T<sub>3<sub>1,1</sub></sub>] + [a<sub>x</sub>&middot;T<sub>1<sub>1,2</sub> </sub>+ a<sub>y</sub>&middot;T<sub>2<sub>1,2</sub></sub> + T<sub>3<sub>1,2</sub></sub>]&middot;c<sub>y</sub>
<br/>
b<sub>y</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>2,1</sub></sub> + b<sub>y</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>2,1</sub></sub> + b<sub>y</sub>&middot;T<sub>3<sub>2,1</sub></sub> - b<sub>y</sub>&middot;c<sub>y</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>2,2</sub></sub> - b<sub>y</sub>&middot;c<sub>y</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>2,2</sub></sub> - b<sub>y</sub>&middot;c<sub>y</sub>&middot;T<sub>3<sub>2,2</sub></sub> - a<sub>x</sub>&middot;T<sub>1<sub>1,1</sub></sub> - a<sub>y</sub>&middot;T<sub>2<sub>1,1</sub></sub> - T<sub>3<sub>1,1</sub></sub> + c<sub>y</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>1,2</sub></sub> + c<sub>y</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>1,2</sub></sub> + c<sub>y</sub>&middot;T<sub>3<sub>1,2</sub></sub>
<br/>

<br/>
*0,1:*
<br/>
b<sub>y</sub>&middot;(z<sub>2,2</sub>&middot;c<sub>x</sub> - z<sub>2,0</sub>) - (z<sub>1,2</sub>&middot;c<sub>x</sub> - z<sub>1,0</sub>)
<br/>
b<sub>y</sub>&middot;c<sub>x</sub>&middot;z<sub>2,2</sub> - b<sub>y</sub>&middot;z<sub>2,0</sub> - c<sub>x</sub>&middot;z<sub>1,2</sub> + z<sub>1,0</sub>
<br/>
b<sub>y</sub>&middot;c<sub>x</sub>&middot;[a<sub>x</sub>&middot;T<sub>1<sub>2,2</sub></sub> + a<sub>y</sub>&middot;T<sub>2<sub>2,2</sub></sub> + T<sub>3<sub>2,2</sub></sub>] - b<sub>y</sub>&middot;[a<sub>x</sub>&middot;T<sub>1<sub>2,0</sub></sub> + a<sub>y</sub>&middot;T<sub>2<sub>2,0</sub></sub> + T<sub>3<sub>2,0</sub></sub>] - c<sub>x</sub>&middot;[a<sub>x</sub>&middot;T<sub>1<sub>1,2</sub></sub> + a<sub>y</sub>&middot;T<sub>2<sub>1,2</sub></sub> + T<sub>3<sub>1,2</sub></sub>] + [a<sub>x</sub>&middot;T<sub>1<sub>1,0</sub></sub> + a<sub>y</sub>&middot;T<sub>2<sub>1,0</sub></sub> + T<sub>3<sub>1,0</sub></sub>]
<br/>
b<sub>y</sub>&middot;c<sub>x</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>2,2</sub></sub> + b<sub>y</sub>&middot;c<sub>x</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>2,2</sub></sub> + b<sub>y</sub>&middot;c<sub>x</sub>&middot;T<sub>3<sub>2,2</sub></sub> - b<sub>y</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>2,0</sub></sub> - b<sub>y</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>2,0</sub></sub> - b<sub>y</sub>&middot;T<sub>3<sub>2,0</sub></sub> - c<sub>x</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>1,2</sub></sub> - c<sub>x</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>1,2</sub></sub> - c<sub>x</sub>&middot;T<sub>3<sub>1,2</sub></sub> + a<sub>x</sub>&middot;T<sub>1<sub>1,0</sub></sub> + a<sub>y</sub>&middot;T<sub>2<sub>1,0</sub></sub> + T<sub>3<sub>1,0</sub></sub>
<br/>


<br/>
*0,2:*
<br/>
b<sub>y</sub>&middot;(z<sub>2,0</sub>&middot;c<sub>y</sub> - z<sub>2,1</sub>&middot;c<sub>x</sub>) - (z<sub>1,0</sub>&middot;c<sub>y</sub> - z<sub>1,1</sub>&middot;c<sub>x</sub>)
<br/>
b<sub>y</sub>&middot;c<sub>y</sub>&middot;z<sub>2,0</sub> - b<sub>y</sub>&middot;c<sub>x</sub>&middot;z<sub>2,1</sub> - c<sub>y</sub>&middot;z<sub>1,0</sub> + c<sub>x</sub>&middot;z<sub>1,1</sub>
<br/>
b<sub>y</sub>&middot;c<sub>y</sub>&middot;[a<sub>x</sub>&middot;T<sub>1<sub>2,0</sub></sub> + a<sub>y</sub>&middot;T<sub>2<sub>2,0</sub></sub> + T<sub>3<sub>2,0</sub></sub>] - b<sub>y</sub>&middot;c<sub>x</sub>&middot;[a<sub>x</sub>&middot;T<sub>1<sub>2,1</sub></sub> + a<sub>y</sub>&middot;T<sub>2<sub>2,1</sub></sub> + T<sub>3<sub>2,1</sub></sub>] - c<sub>y</sub>&middot;[a<sub>x</sub>&middot;T<sub>1<sub>1,0</sub></sub> + a<sub>y</sub>&middot;T<sub>2<sub>1,0</sub></sub> + T<sub>3<sub>1,0</sub></sub>] + c<sub>x</sub>&middot;[a<sub>x</sub>&middot;T<sub>1<sub>1,1</sub></sub> + a<sub>y</sub>&middot;T<sub>2<sub>1,1</sub></sub> + T<sub>3<sub>1,1</sub></sub>]
<br/>
b<sub>y</sub>&middot;c<sub>y</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>2,0</sub></sub> + b<sub>y</sub>&middot;c<sub>y</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>2,0</sub></sub> + b<sub>y</sub>&middot;c<sub>y</sub>&middot;T<sub>3<sub>2,0</sub></sub> - b<sub>y</sub>&middot;c<sub>x</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>2,1</sub></sub> - b<sub>y</sub>&middot;c<sub>x</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>2,1</sub></sub> - b<sub>y</sub>&middot;c<sub>x</sub>&middot;T<sub>3<sub>2,1</sub></sub> - c<sub>y</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>1,0</sub></sub> - c<sub>y</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>1,0</sub></sub> - c<sub>y</sub>&middot;T<sub>3<sub>1,0</sub></sub> + c<sub>x</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>1,1</sub></sub> + c<sub>x</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>1,1</sub></sub> + c<sub>x</sub>&middot;T<sub>3<sub>1,1</sub></sub>
<br/>

---

<br/>
*1,0:*
<br/>
(z<sub>0,1</sub> - z<sub>0,2</sub>&middot;c<sub>y</sub>) - b<sub>x</sub>&middot;(z<sub>2,1</sub> - z<sub>2,2</sub>&middot;c<sub>y</sub>)
<br/>
z<sub>0,1</sub> - c<sub>y</sub>&middot;z<sub>0,2</sub> - b<sub>x</sub>&middot;z<sub>2,1</sub> + b<sub>x</sub>&middot;c<sub>y</sub>&middot;z<sub>2,2</sub>
<br/>
[a<sub>x</sub>&middot;T<sub>1<sub>0,1</sub></sub> + a<sub>y</sub>&middot;T<sub>2<sub>0,1</sub></sub> + T<sub>3<sub>0,1</sub></sub>] - c<sub>y</sub>&middot;[a<sub>x</sub>&middot;T<sub>1<sub>0,2</sub></sub> + a<sub>y</sub>&middot;T<sub>2<sub>0,2</sub></sub> + T<sub>3<sub>0,2</sub></sub>] - b<sub>x</sub>&middot;[a<sub>x</sub>&middot;T<sub>1<sub>2,1</sub></sub> + a<sub>y</sub>&middot;T<sub>2<sub>2,1</sub></sub> + T<sub>3<sub>2,1</sub></sub>] + b<sub>x</sub>&middot;c<sub>y</sub>&middot;[a<sub>x</sub>&middot;T<sub>1<sub>2,2</sub></sub> + a<sub>y</sub>&middot;T<sub>2<sub>2,2</sub></sub> + T<sub>3<sub>2,2</sub></sub>]
<br/>
a<sub>x</sub>&middot;T<sub>1<sub>0,1</sub></sub> + a<sub>y</sub>&middot;T<sub>2<sub>0,1</sub></sub> + T<sub>3<sub>0,1</sub></sub> - c<sub>y</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>0,2</sub></sub> - c<sub>y</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>0,2</sub></sub> - c<sub>y</sub>&middot;T<sub>3<sub>0,2</sub></sub> - b<sub>x</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>2,1</sub></sub> - b<sub>x</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>2,1</sub></sub> - b<sub>x</sub>&middot;T<sub>3<sub>2,1</sub></sub> + b<sub>x</sub>&middot;c<sub>y</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>2,2</sub></sub> + b<sub>x</sub>&middot;c<sub>y</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>2,2</sub></sub> + b<sub>x</sub>&middot;c<sub>y</sub>&middot;T<sub>3<sub>2,2</sub></sub>
<br/>



<br/>
*1,1:*
<br/>
(z<sub>0,2</sub>&middot;c<sub>x</sub> - z<sub>0,0</sub>) - b<sub>x</sub>&middot;(z<sub>2,2</sub>&middot;c<sub>x</sub> - z<sub>2,0</sub>)
<br/>
c<sub>x</sub>&middot;z<sub>0,2</sub> - z<sub>0,0</sub> - b<sub>x</sub>&middot;c<sub>x</sub>&middot;z<sub>2,2</sub> + b<sub>x</sub>&middot;z<sub>2,0</sub>
<br/>
c<sub>x</sub>&middot;[a<sub>x</sub>&middot;T<sub>1<sub>0,2</sub></sub> + a<sub>y</sub>&middot;T<sub>2<sub>0,2</sub></sub> + T<sub>3<sub>0,2</sub></sub>] - [a<sub>x</sub>&middot;T<sub>1<sub>0,0</sub></sub> + a<sub>y</sub>&middot;T<sub>2<sub>0,0</sub></sub> + T<sub>3<sub>0,0</sub></sub>] - b<sub>x</sub>&middot;c<sub>x</sub>&middot;[a<sub>x</sub>&middot;T<sub>1<sub>2,2</sub></sub> + a<sub>y</sub>&middot;T<sub>2<sub>2,2</sub></sub> + T<sub>3<sub>2,2</sub></sub>] + b<sub>x</sub>&middot;[a<sub>x</sub>&middot;T<sub>1<sub>2,0</sub></sub> + a<sub>y</sub>&middot;T<sub>2<sub>2,0</sub></sub> + T<sub>3<sub>2,0</sub></sub>]
<br/>
c<sub>x</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>0,2</sub></sub> + c<sub>x</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>0,2</sub></sub> + c<sub>x</sub>&middot;T<sub>3<sub>0,2</sub></sub> - a<sub>x</sub>&middot;T<sub>1<sub>0,0</sub></sub> - a<sub>y</sub>&middot;T<sub>2<sub>0,0</sub></sub> - T<sub>3<sub>0,0</sub></sub> - b<sub>x</sub>&middot;c<sub>x</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>2,2</sub></sub> -  b<sub>x</sub>&middot;c<sub>x</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>2,2</sub></sub> -  b<sub>x</sub>&middot;c<sub>x</sub>&middot;T<sub>3<sub>2,2</sub></sub> + b<sub>x</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>2,0</sub></sub> + b<sub>x</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>2,0</sub></sub> + b<sub>x</sub>&middot;T<sub>3<sub>2,0</sub></sub>
<br/>



<br/>
*1,2:*
<br/>
(z<sub>0,0</sub>&middot;c<sub>y</sub> - z<sub>0,1</sub>&middot;c<sub>x</sub>) - b<sub>x</sub>&middot;(z<sub>2,0</sub>&middot;c<sub>y</sub> - z<sub>2,1</sub>&middot;c<sub>x</sub>)
<br/>
c<sub>y</sub>&middot;z<sub>0,0</sub> - c<sub>x</sub>&middot;z<sub>0,1</sub> - b<sub>x</sub>&middot;c<sub>y</sub>&middot;z<sub>2,0</sub> + b<sub>x</sub>&middot;c<sub>x</sub>&middot;z<sub>2,1</sub>
<br/>
c<sub>y</sub>&middot;[a<sub>x</sub>&middot;T<sub>1<sub>0,0</sub></sub> + a<sub>y</sub>&middot;T<sub>2<sub>0,0</sub></sub> + T<sub>3<sub>0,0</sub></sub>] - c<sub>x</sub>&middot;[a<sub>x</sub>&middot;T<sub>1<sub>0,1</sub></sub> + a<sub>y</sub>&middot;T<sub>2<sub>0,1</sub></sub> + T<sub>3<sub>0,1</sub></sub>] - b<sub>x</sub>&middot;c<sub>y</sub>&middot;[a<sub>x</sub>&middot;T<sub>1<sub>2,0</sub></sub> + a<sub>y</sub>&middot;T<sub>2<sub>2,0</sub></sub> + T<sub>3<sub>2,0</sub></sub>] + b<sub>x</sub>&middot;c<sub>x</sub>&middot;[a<sub>x</sub>&middot;T<sub>1<sub>2,1</sub></sub> + a<sub>y</sub>&middot;T<sub>2<sub>2,1</sub></sub> + T<sub>3<sub>2,1</sub></sub>]
<br/>
c<sub>y</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>0,0</sub></sub> + c<sub>y</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>0,0</sub></sub> + c<sub>y</sub>&middot;T<sub>3<sub>0,0</sub></sub> - c<sub>x</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>0,1</sub></sub> - c<sub>x</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>0,1</sub></sub> - c<sub>x</sub>&middot;T<sub>3<sub>0,1</sub></sub> - b<sub>x</sub>&middot;c<sub>y</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>2,0</sub></sub> - b<sub>x</sub>&middot;c<sub>y</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>2,0</sub></sub> - b<sub>x</sub>&middot;c<sub>y</sub>&middot;T<sub>3<sub>2,0</sub></sub> + b<sub>x</sub>&middot;c<sub>x</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>2,1</sub></sub> + b<sub>x</sub>&middot;c<sub>x</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>2,1</sub></sub> + b<sub>x</sub>&middot;c<sub>x</sub>&middot;T<sub>3<sub>2,1</sub></sub>
<br/>


---


<br/>
*2,0:*
<br/>
b<sub>x</sub>&middot;(z<sub>1,1</sub> - z<sub>1,2</sub>&middot;c<sub>y</sub>) - b<sub>y</sub>&middot;(z<sub>0,1</sub> - z<sub>0,2</sub>&middot;c<sub>y</sub>)
<br/>
b<sub>x</sub>&middot;z<sub>1,1</sub> - b<sub>x</sub>&middot;c<sub>y</sub>&middot;z<sub>1,2</sub> - b<sub>y</sub>&middot;z<sub>0,1</sub> + b<sub>y</sub>&middot;c<sub>y</sub>&middot;z<sub>0,2</sub>
<br/>
b<sub>x</sub>&middot;[a<sub>x</sub>&middot;T<sub>1<sub>1,1</sub></sub> + a<sub>y</sub>&middot;T<sub>2<sub>1,1</sub></sub> + T<sub>3<sub>1,1</sub></sub>] - b<sub>x</sub>&middot;c<sub>y</sub>&middot;[a<sub>x</sub>&middot;T<sub>1<sub>1,2</sub></sub> + a<sub>y</sub>&middot;T<sub>2<sub>1,2</sub></sub> + T<sub>3<sub>1,2</sub></sub>] - b<sub>y</sub>&middot;[a<sub>x</sub>&middot;T<sub>1<sub>0,1</sub></sub> + a<sub>y</sub>&middot;T<sub>2<sub>0,1</sub></sub> + T<sub>3<sub>0,1</sub></sub>] + b<sub>y</sub>&middot;c<sub>y</sub>&middot;[a<sub>x</sub>&middot;T<sub>1<sub>0,2</sub></sub> + a<sub>y</sub>&middot;T<sub>2<sub>0,2</sub></sub> + T<sub>3<sub>0,2</sub></sub>]
<br/>
b<sub>x</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>1,1</sub></sub> + b<sub>x</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>1,1</sub></sub> + b<sub>x</sub>&middot;T<sub>3<sub>1,1</sub></sub> - b<sub>x</sub>&middot;c<sub>y</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>1,2</sub></sub> - b<sub>x</sub>&middot;c<sub>y</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>1,2</sub></sub> - b<sub>x</sub>&middot;c<sub>y</sub>&middot;T<sub>3<sub>1,2</sub></sub> - b<sub>y</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>0,1</sub></sub> - b<sub>y</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>0,1</sub></sub> - b<sub>y</sub>&middot;T<sub>3<sub>0,1</sub></sub> + b<sub>y</sub>&middot;c<sub>y</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>0,2</sub></sub> + b<sub>y</sub>&middot;c<sub>y</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>0,2</sub></sub> + b<sub>y</sub>&middot;c<sub>y</sub>&middot;T<sub>3<sub>0,2</sub></sub>
<br/>



<br/>
*2,1:*
<br/>
b<sub>x</sub>&middot;(z<sub>1,2</sub>&middot;c<sub>x</sub> - z<sub>1,0</sub>) - b<sub>y</sub>&middot;(z<sub>0,2</sub>&middot;c<sub>x</sub> - z<sub>0,0</sub>)
<br/>
b<sub>x</sub>&middot;c<sub>x</sub>&middot;z<sub>1,2</sub> - b<sub>x</sub>&middot;z<sub>1,0</sub> - b<sub>y</sub>&middot;c<sub>x</sub>&middot;z<sub>0,2</sub> + b<sub>y</sub>&middot;z<sub>0,0</sub>
<br/>
b<sub>x</sub>&middot;c<sub>x</sub>&middot;[a<sub>x</sub>&middot;T<sub>1<sub>1,2</sub></sub> + a<sub>y</sub>&middot;T<sub>2<sub>1,2</sub></sub> + T<sub>3<sub>1,2</sub></sub>] - b<sub>x</sub>&middot;[a<sub>x</sub>&middot;T<sub>1<sub>1,0</sub></sub> + a<sub>y</sub>&middot;T<sub>2<sub>1,0</sub></sub> + T<sub>3<sub>1,0</sub></sub>] - b<sub>y</sub>&middot;c<sub>x</sub>&middot;[a<sub>x</sub>&middot;T<sub>1<sub>0,2</sub></sub> + a<sub>y</sub>&middot;T<sub>2<sub>0,2</sub></sub> + T<sub>3<sub>0,2</sub></sub>] + b<sub>y</sub>&middot;[a<sub>x</sub>&middot;T<sub>1<sub>0,0</sub></sub> + a<sub>y</sub>&middot;T<sub>2<sub>0,0</sub></sub> + T<sub>3<sub>0,0</sub></sub>]
<br/>
b<sub>x</sub>&middot;c<sub>x</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>1,2</sub></sub> + b<sub>x</sub>&middot;c<sub>x</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>1,2</sub></sub> + b<sub>x</sub>&middot;c<sub>x</sub>&middot;T<sub>3<sub>1,2</sub></sub> - b<sub>x</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>1,0</sub></sub> - b<sub>x</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>1,0</sub></sub> - b<sub>x</sub>&middot;T<sub>3<sub>1,0</sub></sub> - b<sub>y</sub>&middot;c<sub>x</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>0,2</sub></sub> - b<sub>y</sub>&middot;c<sub>x</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>0,2</sub></sub> - b<sub>y</sub>&middot;c<sub>x</sub>&middot;T<sub>3<sub>0,2</sub></sub> + b<sub>y</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>0,0</sub></sub> + b<sub>y</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>0,0</sub></sub> + b<sub>y</sub>&middot;T<sub>3<sub>0,0</sub></sub>
<br/>



<br/>
*2,2:*
<br/>
b<sub>x</sub>&middot;(z<sub>1,0</sub>&middot;c<sub>y</sub> - z<sub>1,1</sub>&middot;c<sub>x</sub>) - b<sub>y</sub>&middot;(z<sub>0,0</sub>&middot;c<sub>y</sub> - z<sub>0,1</sub>&middot;c<sub>x</sub>)
<br/>
b<sub>x</sub>&middot;c<sub>y</sub>&middot;z<sub>1,0</sub> - b<sub>x</sub>&middot;c<sub>x</sub>&middot;z<sub>1,1</sub> - b<sub>y</sub>&middot;c<sub>y</sub>&middot;z<sub>0,0</sub> + b<sub>y</sub>&middot;c<sub>x</sub>&middot;z<sub>0,1</sub>
<br/>
b<sub>x</sub>&middot;c<sub>y</sub>&middot;[a<sub>x</sub>&middot;T<sub>1<sub>1,0</sub></sub> + a<sub>y</sub>&middot;T<sub>2<sub>1,0</sub></sub> + T<sub>3<sub>1,0</sub></sub>] - b<sub>x</sub>&middot;c<sub>x</sub>&middot;[a<sub>x</sub>&middot;T<sub>1<sub>1,1</sub></sub> + a<sub>y</sub>&middot;T<sub>2<sub>1,1</sub></sub> + T<sub>3<sub>1,1</sub></sub>] - b<sub>y</sub>&middot;c<sub>y</sub>&middot;[a<sub>x</sub>&middot;T<sub>1<sub>0,0</sub></sub> + a<sub>y</sub>&middot;T<sub>2<sub>0,0</sub></sub> + T<sub>3<sub>0,0</sub></sub>] + b<sub>y</sub>&middot;c<sub>x</sub>&middot;[a<sub>x</sub>&middot;T<sub>1<sub>0,1</sub></sub> + a<sub>y</sub>&middot;T<sub>2<sub>0,1</sub></sub> + T<sub>3<sub>0,1</sub></sub>]
<br/>
b<sub>x</sub>&middot;c<sub>y</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>1,0</sub></sub> + b<sub>x</sub>&middot;c<sub>y</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>1,0</sub></sub> + b<sub>x</sub>&middot;c<sub>y</sub>&middot;T<sub>3<sub>1,0</sub></sub> - b<sub>x</sub>&middot;c<sub>x</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>1,1</sub></sub> - b<sub>x</sub>&middot;c<sub>x</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>1,1</sub></sub> - b<sub>x</sub>&middot;c<sub>x</sub>&middot;T<sub>3<sub>1,1</sub></sub> - b<sub>y</sub>&middot;c<sub>y</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>0,0</sub></sub> - b<sub>y</sub>&middot;c<sub>y</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>0,0</sub></sub> - b<sub>y</sub>&middot;c<sub>y</sub>&middot;T<sub>3<sub>0,0</sub></sub> + b<sub>y</sub>&middot;c<sub>x</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>0,1</sub></sub> + b<sub>y</sub>&middot;c<sub>x</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>0,1</sub></sub> + b<sub>y</sub>&middot;c<sub>x</sub>&middot;T<sub>3<sub>0,1</sub></sub>
<br/>











---



<br/>
*0,0:*
<br/>
+b<sub>y</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>2,1</sub></sub>
+b<sub>y</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>2,1</sub></sub>
+b<sub>y</sub>&middot;T<sub>3<sub>2,1</sub></sub>
-b<sub>y</sub>&middot;c<sub>y</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>2,2</sub></sub>
-b<sub>y</sub>&middot;c<sub>y</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>2,2</sub></sub>
-b<sub>y</sub>&middot;c<sub>y</sub>&middot;T<sub>3<sub>2,2</sub></sub>
-a<sub>x</sub>&middot;T<sub>1<sub>1,1</sub></sub>
-a<sub>y</sub>&middot;T<sub>2<sub>1,1</sub></sub>
-T<sub>3<sub>1,1</sub></sub>
+c<sub>y</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>1,2</sub></sub>
+c<sub>y</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>1,2</sub></sub>
+c<sub>y</sub>&middot;T<sub>3<sub>1,2</sub></sub>
<br/>


*a<sub>x</sub>,a<sub>y</sub>*
<br/>

a<sub>x</sub>:
+b<sub>y</sub>&middot;T<sub>1<sub>2,1</sub></sub>
-b<sub>y</sub>&middot;c<sub>y</sub>&middot;T<sub>1<sub>2,2</sub></sub>
-T<sub>1<sub>1,1</sub></sub>
+c<sub>y</sub>&middot;T<sub>1<sub>1,2</sub></sub>
<br/>

a<sub>y</sub>:
+b<sub>y</sub>&middot;T<sub>2<sub>2,1</sub></sub>
-b<sub>y</sub>&middot;c<sub>y</sub>&middot;T<sub>2<sub>2,2</sub></sub>
-T<sub>2<sub>1,1</sub></sub>
+c<sub>y</sub>&middot;T<sub>2<sub>1,2</sub></sub>
<br/>

1:
+b<sub>y</sub>&middot;T<sub>3<sub>2,1</sub></sub>
-b<sub>y</sub>&middot;c<sub>y</sub>&middot;T<sub>3<sub>2,2</sub></sub>
-T<sub>3<sub>1,1</sub></sub>
+c<sub>y</sub>&middot;T<sub>3<sub>1,2</sub></sub>
<br/>


---

*b<sub>x</sub>,b<sub>y</sub>*
<br/>

b<sub>x</sub>:
0
<br/>

b<sub>y</sub>:
+a<sub>x</sub>&middot;T<sub>1<sub>2,1</sub></sub>
+a<sub>y</sub>&middot;T<sub>2<sub>2,1</sub></sub>
+T<sub>3<sub>2,1</sub></sub>
-c<sub>y</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>2,2</sub></sub>
-c<sub>y</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>2,2</sub></sub>
-c<sub>y</sub>&middot;T<sub>3<sub>2,2</sub></sub>
<br/>

1:
-a<sub>x</sub>&middot;T<sub>1<sub>1,1</sub></sub>
-a<sub>y</sub>&middot;T<sub>2<sub>1,1</sub></sub>
-T<sub>3<sub>1,1</sub></sub>
+c<sub>y</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>1,2</sub></sub>
+c<sub>y</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>1,2</sub></sub>
+c<sub>y</sub>&middot;T<sub>3<sub>1,2</sub></sub>


---

*c<sub>x</sub>,c<sub>y</sub>*
<br/>



c<sub>x</sub>:
0
<br/>


c<sub>y</sub>:
-b<sub>y</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>2,2</sub></sub>
-b<sub>y</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>2,2</sub></sub>
-b<sub>y</sub>&middot;T<sub>3<sub>2,2</sub></sub>
+a<sub>x</sub>&middot;T<sub>1<sub>1,2</sub></sub>
+a<sub>y</sub>&middot;T<sub>2<sub>1,2</sub></sub>
+T<sub>3<sub>1,2</sub></sub>
<br/>


1:
+b<sub>y</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>2,1</sub></sub>
+b<sub>y</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>2,1</sub></sub>
+b<sub>y</sub>&middot;T<sub>3<sub>2,1</sub></sub>
-a<sub>x</sub>&middot;T<sub>1<sub>1,1</sub></sub>
-a<sub>y</sub>&middot;T<sub>2<sub>1,1</sub></sub>
-T<sub>3<sub>1,1</sub></sub>
<br/>



---


<br/>
*0,1:*
<br/>
+b<sub>y</sub>&middot;c<sub>x</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>2,2</sub></sub>
+b<sub>y</sub>&middot;c<sub>x</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>2,2</sub></sub>
+b<sub>y</sub>&middot;c<sub>x</sub>&middot;T<sub>3<sub>2,2</sub></sub>
-b<sub>y</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>2,0</sub></sub>
-b<sub>y</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>2,0</sub></sub>
-b<sub>y</sub>&middot;T<sub>3<sub>2,0</sub></sub>
-c<sub>x</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>1,2</sub></sub>
-c<sub>x</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>1,2</sub></sub>
-c<sub>x</sub>&middot;T<sub>3<sub>1,2</sub></sub>
+a<sub>x</sub>&middot;T<sub>1<sub>1,0</sub></sub>
+a<sub>y</sub>&middot;T<sub>2<sub>1,0</sub></sub>
+T<sub>3<sub>1,0</sub></sub>
<br/>



*a<sub>x</sub>,a<sub>y</sub>*
<br/>
a<sub>x</sub>:
+b<sub>y</sub>&middot;c<sub>x</sub>&middot;T<sub>1<sub>2,2</sub></sub>
-b<sub>y</sub>&middot;T<sub>1<sub>2,0</sub></sub>
-c<sub>x</sub>&middot;T<sub>1<sub>1,2</sub></sub>
+T<sub>1<sub>1,0</sub></sub>
<br/>


a<sub>y</sub>:
-b<sub>y</sub>&middot;T<sub>2<sub>2,0</sub></sub>
+b<sub>y</sub>&middot;c<sub>x</sub>&middot;T<sub>2<sub>2,2</sub></sub>
-c<sub>x</sub>&middot;T<sub>2<sub>1,2</sub></sub>
+T<sub>2<sub>1,0</sub></sub>
<br/>


1:
+b<sub>y</sub>&middot;c<sub>x</sub>&middot;T<sub>3<sub>2,2</sub></sub>
-b<sub>y</sub>&middot;T<sub>3<sub>2,0</sub></sub>
-c<sub>x</sub>&middot;T<sub>3<sub>1,2</sub></sub>
+T<sub>3<sub>1,0</sub></sub>
<br/>




*b<sub>x</sub>,b<sub>y</sub>*
<br/>
b<sub>x</sub>:
0
<br/>


b<sub>y</sub>:
+c<sub>x</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>2,2</sub></sub>
+c<sub>x</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>2,2</sub></sub>
+c<sub>x</sub>&middot;T<sub>3<sub>2,2</sub></sub>
-a<sub>x</sub>&middot;T<sub>1<sub>2,0</sub></sub>
-a<sub>y</sub>&middot;T<sub>2<sub>2,0</sub></sub>
-T<sub>3<sub>2,0</sub></sub>
<br/>


1:
-c<sub>x</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>1,2</sub></sub>
-c<sub>x</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>1,2</sub></sub>
-c<sub>x</sub>&middot;T<sub>3<sub>1,2</sub></sub>
+a<sub>x</sub>&middot;T<sub>1<sub>1,0</sub></sub>
+a<sub>y</sub>&middot;T<sub>2<sub>1,0</sub></sub>
+T<sub>3<sub>1,0</sub></sub>
<br/>



*c<sub>x</sub>,c<sub>y</sub>*
<br/>
c<sub>x</sub>:
+b<sub>y</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>2,2</sub></sub>
+b<sub>y</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>2,2</sub></sub>
+b<sub>y</sub>&middot;T<sub>3<sub>2,2</sub></sub>
-a<sub>x</sub>&middot;T<sub>1<sub>1,2</sub></sub>
-a<sub>y</sub>&middot;T<sub>2<sub>1,2</sub></sub>
-T<sub>3<sub>1,2</sub></sub>
<br/>


c<sub>y</sub>:
0
<br/>


1:
-b<sub>y</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>2,0</sub></sub>
-b<sub>y</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>2,0</sub></sub>
-b<sub>y</sub>&middot;T<sub>3<sub>2,0</sub></sub>
+a<sub>x</sub>&middot;T<sub>1<sub>1,0</sub></sub>
+a<sub>y</sub>&middot;T<sub>2<sub>1,0</sub></sub>
+T<sub>3<sub>1,0</sub></sub>
<br/>




---

<br/>
*0,2:*
<br/>
+b<sub>y</sub>&middot;c<sub>y</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>2,0</sub></sub>
+b<sub>y</sub>&middot;c<sub>y</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>2,0</sub></sub>
+b<sub>y</sub>&middot;c<sub>y</sub>&middot;T<sub>3<sub>2,0</sub></sub>
-b<sub>y</sub>&middot;c<sub>x</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>2,1</sub></sub>
-b<sub>y</sub>&middot;c<sub>x</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>2,1</sub></sub>
-b<sub>y</sub>&middot;c<sub>x</sub>&middot;T<sub>3<sub>2,1</sub></sub>
-c<sub>y</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>1,0</sub></sub>
-c<sub>y</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>1,0</sub></sub>
-c<sub>y</sub>&middot;T<sub>3<sub>1,0</sub></sub>
+c<sub>x</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>1,1</sub></sub>
+c<sub>x</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>1,1</sub></sub>
+c<sub>x</sub>&middot;T<sub>3<sub>1,1</sub></sub>
<br/>

---

*a<sub>x</sub>,a<sub>y</sub>*
<br/>
a<sub>x</sub>:
+b<sub>y</sub>&middot;c<sub>y</sub>&middot;T<sub>1<sub>2,0</sub></sub>
-b<sub>y</sub>&middot;c<sub>x</sub>&middot;T<sub>1<sub>2,1</sub></sub>
-c<sub>y</sub>&middot;T<sub>1<sub>1,0</sub></sub>
+c<sub>x</sub>&middot;T<sub>1<sub>1,1</sub></sub>
<br/>

a<sub>y</sub>:
+b<sub>y</sub>&middot;c<sub>y</sub>&middot;T<sub>2<sub>2,0</sub></sub>
-c<sub>y</sub>&middot;T<sub>2<sub>1,0</sub></sub>
-b<sub>y</sub>&middot;c<sub>x</sub>&middot;T<sub>2<sub>2,1</sub></sub>
+c<sub>x</sub>&middot;T<sub>2<sub>1,1</sub></sub>
<br/>

1:
+b<sub>y</sub>&middot;c<sub>y</sub>&middot;T<sub>3<sub>2,0</sub></sub>
-b<sub>y</sub>&middot;c<sub>x</sub>&middot;T<sub>3<sub>2,1</sub></sub>
-c<sub>y</sub>&middot;T<sub>3<sub>1,0</sub></sub>
+c<sub>x</sub>&middot;T<sub>3<sub>1,1</sub></sub>
<br/>




*b<sub>x</sub>,b<sub>y</sub>*
<br/>
b<sub>x</sub>:
0
<br/>


b<sub>y</sub>:
+c<sub>y</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>2,0</sub></sub>
+c<sub>y</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>2,0</sub></sub>
+c<sub>y</sub>&middot;T<sub>3<sub>2,0</sub></sub>
-c<sub>x</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>2,1</sub></sub>
-c<sub>x</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>2,1</sub></sub>
-c<sub>x</sub>&middot;T<sub>3<sub>2,1</sub></sub>
<br/>


1:
-c<sub>y</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>1,0</sub></sub>
-c<sub>y</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>1,0</sub></sub>
-c<sub>y</sub>&middot;T<sub>3<sub>1,0</sub></sub>
+c<sub>x</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>1,1</sub></sub>
+c<sub>x</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>1,1</sub></sub>
+c<sub>x</sub>&middot;T<sub>3<sub>1,1</sub></sub>
<br/>




*c<sub>x</sub>,c<sub>y</sub>*
<br/>
c<sub>x</sub>:
-b<sub>y</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>2,1</sub></sub>
-b<sub>y</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>2,1</sub></sub>
-b<sub>y</sub>&middot;T<sub>3<sub>2,1</sub></sub>
+a<sub>x</sub>&middot;T<sub>1<sub>1,1</sub></sub>
+a<sub>y</sub>&middot;T<sub>2<sub>1,1</sub></sub>
+T<sub>3<sub>1,1</sub></sub>
<br/>


c<sub>y</sub>:
+b<sub>y</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>2,0</sub></sub>
+b<sub>y</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>2,0</sub></sub>
+b<sub>y</sub>&middot;T<sub>3<sub>2,0</sub></sub>
-a<sub>x</sub>&middot;T<sub>1<sub>1,0</sub></sub>
-a<sub>y</sub>&middot;T<sub>2<sub>1,0</sub></sub>
-T<sub>3<sub>1,0</sub></sub>

<br/>


1:
0
<br/>





---

<br/>
*1,0:*
<br/>
+a<sub>x</sub>&middot;T<sub>1<sub>0,1</sub></sub>
+a<sub>y</sub>&middot;T<sub>2<sub>0,1</sub></sub>
+T<sub>3<sub>0,1</sub></sub>
-c<sub>y</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>0,2</sub></sub>
-c<sub>y</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>0,2</sub></sub>
-c<sub>y</sub>&middot;T<sub>3<sub>0,2</sub></sub>
-b<sub>x</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>2,1</sub></sub>
-b<sub>x</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>2,1</sub></sub>
-b<sub>x</sub>&middot;T<sub>3<sub>2,1</sub></sub>
+b<sub>x</sub>&middot;c<sub>y</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>2,2</sub></sub>
+b<sub>x</sub>&middot;c<sub>y</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>2,2</sub></sub>
+b<sub>x</sub>&middot;c<sub>y</sub>&middot;T<sub>3<sub>2,2</sub></sub>
<br/>

*a<sub>x</sub>,a<sub>y</sub>*
<br/>
a<sub>x</sub>:
+T<sub>1<sub>0,1</sub></sub>
-c<sub>y</sub>&middot;T<sub>1<sub>0,2</sub></sub>
-b<sub>x</sub>&middot;T<sub>1<sub>2,1</sub></sub>
+b<sub>x</sub>&middot;c<sub>y</sub>&middot;T<sub>1<sub>2,2</sub></sub>
<br/>

a<sub>y</sub>:
+T<sub>2<sub>0,1</sub></sub>
-c<sub>y</sub>&middot;T<sub>2<sub>0,2</sub></sub>
-b<sub>x</sub>&middot;T<sub>2<sub>2,1</sub></sub>
+b<sub>x</sub>&middot;c<sub>y</sub>&middot;T<sub>2<sub>2,2</sub></sub>
<br/>


1:
+T<sub>3<sub>0,1</sub></sub>
-c<sub>y</sub>&middot;T<sub>3<sub>0,2</sub></sub>
-b<sub>x</sub>&middot;T<sub>3<sub>2,1</sub></sub>
+b<sub>x</sub>&middot;c<sub>y</sub>&middot;T<sub>3<sub>2,2</sub></sub>
<br/>





*b<sub>x</sub>,b<sub>y</sub>*
<br/>
b<sub>x</sub>:
-a<sub>x</sub>&middot;T<sub>1<sub>2,1</sub></sub>
-a<sub>y</sub>&middot;T<sub>2<sub>2,1</sub></sub>
-T<sub>3<sub>2,1</sub></sub>
+c<sub>y</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>2,2</sub></sub>
+c<sub>y</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>2,2</sub></sub>
+c<sub>y</sub>&middot;T<sub>3<sub>2,2</sub></sub>
<br/>


b<sub>y</sub>:
0
<br/>


1:
-c<sub>y</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>0,2</sub></sub>
-c<sub>y</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>0,2</sub></sub>
-c<sub>y</sub>&middot;T<sub>3<sub>0,2</sub></sub>
+a<sub>x</sub>&middot;T<sub>1<sub>0,1</sub></sub>
+a<sub>y</sub>&middot;T<sub>2<sub>0,1</sub></sub>
+T<sub>3<sub>0,1</sub></sub>
<br/>



*c<sub>x</sub>,c<sub>y</sub>*
<br/>
c<sub>x</sub>:
0
<br/>


c<sub>y</sub>:
-a<sub>x</sub>&middot;T<sub>1<sub>0,2</sub></sub>
-a<sub>y</sub>&middot;T<sub>2<sub>0,2</sub></sub>
-T<sub>3<sub>0,2</sub></sub>
+b<sub>x</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>2,2</sub></sub>
+b<sub>x</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>2,2</sub></sub>
+b<sub>x</sub>&middot;T<sub>3<sub>2,2</sub></sub>
<br/>


1:
+a<sub>x</sub>&middot;T<sub>1<sub>0,1</sub></sub>
+a<sub>y</sub>&middot;T<sub>2<sub>0,1</sub></sub>
+T<sub>3<sub>0,1</sub></sub>
-b<sub>x</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>2,1</sub></sub>
-b<sub>x</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>2,1</sub></sub>
-b<sub>x</sub>&middot;T<sub>3<sub>2,1</sub></sub>
<br/>











---

<br/>
*1,1:*
<br/>
+c<sub>x</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>0,2</sub></sub>
+c<sub>x</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>0,2</sub></sub>
+c<sub>x</sub>&middot;T<sub>3<sub>0,2</sub></sub>
-a<sub>x</sub>&middot;T<sub>1<sub>0,0</sub></sub>
-a<sub>y</sub>&middot;T<sub>2<sub>0,0</sub></sub>
-T<sub>3<sub>0,0</sub></sub>
-b<sub>x</sub>&middot;c<sub>x</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>2,2</sub></sub>
-b<sub>x</sub>&middot;c<sub>x</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>2,2</sub></sub>
-b<sub>x</sub>&middot;c<sub>x</sub>&middot;T<sub>3<sub>2,2</sub></sub>
+b<sub>x</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>2,0</sub></sub>
+b<sub>x</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>2,0</sub></sub>
+b<sub>x</sub>&middot;T<sub>3<sub>2,0</sub></sub>
<br/>


*a<sub>x</sub>,a<sub>y</sub>*
<br/>
a<sub>x</sub>:
+c<sub>x</sub>&middot;T<sub>1<sub>0,2</sub></sub>
-T<sub>1<sub>0,0</sub></sub>
-b<sub>x</sub>&middot;c<sub>x</sub>&middot;T<sub>1<sub>2,2</sub></sub>
+b<sub>x</sub>&middot;T<sub>1<sub>2,0</sub></sub>
<br/>


a<sub>y</sub>:
+c<sub>x</sub>&middot;T<sub>2<sub>0,2</sub></sub>
-T<sub>2<sub>0,0</sub></sub>
-b<sub>x</sub>&middot;c<sub>x</sub>&middot;T<sub>2<sub>2,2</sub></sub>
+b<sub>x</sub>&middot;T<sub>2<sub>2,0</sub></sub>
<br/>


1:
+c<sub>x</sub>&middot;T<sub>3<sub>0,2</sub></sub>
-T<sub>3<sub>0,0</sub></sub>
-b<sub>x</sub>&middot;c<sub>x</sub>&middot;T<sub>3<sub>2,2</sub></sub>
+b<sub>x</sub>&middot;T<sub>3<sub>2,0</sub></sub>
<br/>
















*b<sub>x</sub>,b<sub>y</sub>*
<br/>
b<sub>x</sub>:
-c<sub>x</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>2,2</sub></sub>
-c<sub>x</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>2,2</sub></sub>
-c<sub>x</sub>&middot;T<sub>3<sub>2,2</sub></sub>
+a<sub>x</sub>&middot;T<sub>1<sub>2,0</sub></sub>
+a<sub>y</sub>&middot;T<sub>2<sub>2,0</sub></sub>
+T<sub>3<sub>2,0</sub></sub>
<br/>


b<sub>y</sub>:
0
<br/>


1:
+c<sub>x</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>0,2</sub></sub>
+c<sub>x</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>0,2</sub></sub>
+c<sub>x</sub>&middot;T<sub>3<sub>0,2</sub></sub>
-a<sub>x</sub>&middot;T<sub>1<sub>0,0</sub></sub>
-a<sub>y</sub>&middot;T<sub>2<sub>0,0</sub></sub>
-T<sub>3<sub>0,0</sub></sub>
<br/>






*c<sub>x</sub>,c<sub>y</sub>*
<br/>
c<sub>x</sub>:
+a<sub>x</sub>&middot;T<sub>1<sub>0,2</sub></sub>
+a<sub>y</sub>&middot;T<sub>2<sub>0,2</sub></sub>
+T<sub>3<sub>0,2</sub></sub>
-b<sub>x</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>2,2</sub></sub>
-b<sub>x</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>2,2</sub></sub>
-b<sub>x</sub>&middot;T<sub>3<sub>2,2</sub></sub>
<br/>


c<sub>y</sub>:
0
<br/>


1:
-a<sub>x</sub>&middot;T<sub>1<sub>0,0</sub></sub>
-a<sub>y</sub>&middot;T<sub>2<sub>0,0</sub></sub>
-T<sub>3<sub>0,0</sub></sub>
+b<sub>x</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>2,0</sub></sub>
+b<sub>x</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>2,0</sub></sub>
+b<sub>x</sub>&middot;T<sub>3<sub>2,0</sub></sub>
<br/>








---


<br/>
*1,2:*
<br/>
+c<sub>y</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>0,0</sub></sub>
+c<sub>y</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>0,0</sub></sub>
+c<sub>y</sub>&middot;T<sub>3<sub>0,0</sub></sub>
-c<sub>x</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>0,1</sub></sub>
-c<sub>x</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>0,1</sub></sub>
-c<sub>x</sub>&middot;T<sub>3<sub>0,1</sub></sub>
-b<sub>x</sub>&middot;c<sub>y</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>2,0</sub></sub>
-b<sub>x</sub>&middot;c<sub>y</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>2,0</sub></sub>
-b<sub>x</sub>&middot;c<sub>y</sub>&middot;T<sub>3<sub>2,0</sub></sub>
+b<sub>x</sub>&middot;c<sub>x</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>2,1</sub></sub>
+b<sub>x</sub>&middot;c<sub>x</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>2,1</sub></sub>
+b<sub>x</sub>&middot;c<sub>x</sub>&middot;T<sub>3<sub>2,1</sub></sub>
<br/>


*a<sub>x</sub>,a<sub>y</sub>*
<br/>

a<sub>x</sub>:
<br/>
+c<sub>y</sub>&middot;T<sub>1<sub>0,0</sub></sub>
-c<sub>x</sub>&middot;T<sub>1<sub>0,1</sub></sub>
-b<sub>x</sub>&middot;c<sub>y</sub>&middot;T<sub>1<sub>2,0</sub></sub>
+b<sub>x</sub>&middot;c<sub>x</sub>&middot;T<sub>1<sub>2,1</sub></sub>
<br/>


a<sub>y</sub>:
<br/>
+c<sub>y</sub>&middot;T<sub>2<sub>0,0</sub></sub>
-c<sub>x</sub>&middot;T<sub>2<sub>0,1</sub></sub>
-b<sub>x</sub>&middot;c<sub>y</sub>&middot;T<sub>2<sub>2,0</sub></sub>
+b<sub>x</sub>&middot;c<sub>x</sub>&middot;T<sub>2<sub>2,1</sub></sub>
<br/>


1:
+c<sub>y</sub>&middot;T<sub>3<sub>0,0</sub></sub>
-c<sub>x</sub>&middot;T<sub>3<sub>0,1</sub></sub>
-b<sub>x</sub>&middot;c<sub>y</sub>&middot;T<sub>3<sub>2,0</sub></sub>
+b<sub>x</sub>&middot;c<sub>x</sub>&middot;T<sub>3<sub>2,1</sub></sub>
<br/>











*b<sub>x</sub>,b<sub>y</sub>*
<br/>
b<sub>x</sub>:
-c<sub>y</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>2,0</sub></sub>
-c<sub>y</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>2,0</sub></sub>
-c<sub>y</sub>&middot;T<sub>3<sub>2,0</sub></sub>
+c<sub>x</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>2,1</sub></sub>
+c<sub>x</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>2,1</sub></sub>
+c<sub>x</sub>&middot;T<sub>3<sub>2,1</sub></sub>
<br/>


b<sub>y</sub>:
0
<br/>


1:
+c<sub>y</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>0,0</sub></sub>
+c<sub>y</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>0,0</sub></sub>
+c<sub>y</sub>&middot;T<sub>3<sub>0,0</sub></sub>
-c<sub>x</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>0,1</sub></sub>
-c<sub>x</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>0,1</sub></sub>
-c<sub>x</sub>&middot;T<sub>3<sub>0,1</sub></sub>
<br/>







*c<sub>x</sub>,c<sub>y</sub>*
<br/>
c<sub>x</sub>:
-a<sub>x</sub>&middot;T<sub>1<sub>0,1</sub></sub>
-a<sub>y</sub>&middot;T<sub>2<sub>0,1</sub></sub>
-T<sub>3<sub>0,1</sub></sub>
+b<sub>x</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>2,1</sub></sub>
+b<sub>x</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>2,1</sub></sub>
+b<sub>x</sub>&middot;T<sub>3<sub>2,1</sub></sub>
<br/>


c<sub>y</sub>:
+a<sub>x</sub>&middot;T<sub>1<sub>0,0</sub></sub>
+a<sub>y</sub>&middot;T<sub>2<sub>0,0</sub></sub>
+T<sub>3<sub>0,0</sub></sub>
-b<sub>x</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>2,0</sub></sub>
-b<sub>x</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>2,0</sub></sub>
-b<sub>x</sub>&middot;T<sub>3<sub>2,0</sub></sub>
<br/>


1:
0
<br/>








---

<br/>
*2,0:*
<br/>
+b<sub>x</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>1,1</sub></sub>
+b<sub>x</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>1,1</sub></sub>
+b<sub>x</sub>&middot;T<sub>3<sub>1,1</sub></sub>
-b<sub>x</sub>&middot;c<sub>y</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>1,2</sub></sub>
-b<sub>x</sub>&middot;c<sub>y</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>1,2</sub></sub>
-b<sub>x</sub>&middot;c<sub>y</sub>&middot;T<sub>3<sub>1,2</sub></sub>
-b<sub>y</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>0,1</sub></sub>
-b<sub>y</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>0,1</sub></sub>
-b<sub>y</sub>&middot;T<sub>3<sub>0,1</sub></sub>
+b<sub>y</sub>&middot;c<sub>y</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>0,2</sub></sub>
+b<sub>y</sub>&middot;c<sub>y</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>0,2</sub></sub>
+b<sub>y</sub>&middot;c<sub>y</sub>&middot;T<sub>3<sub>0,2</sub></sub>
<br/>



*a<sub>x</sub>,a<sub>y</sub>*
<br/>
a<sub>x</sub>:
+b<sub>x</sub>&middot;T<sub>1<sub>1,1</sub></sub>
-b<sub>x</sub>&middot;c<sub>y</sub>&middot;T<sub>1<sub>1,2</sub></sub>
-b<sub>y</sub>&middot;T<sub>1<sub>0,1</sub></sub>
+b<sub>y</sub>&middot;c<sub>y</sub>&middot;T<sub>1<sub>0,2</sub></sub>
<br/>


a<sub>y</sub>:
+b<sub>x</sub>&middot;T<sub>2<sub>1,1</sub></sub>
-b<sub>x</sub>&middot;c<sub>y</sub>&middot;T<sub>2<sub>1,2</sub></sub>
-b<sub>y</sub>&middot;T<sub>2<sub>0,1</sub></sub>
+b<sub>y</sub>&middot;c<sub>y</sub>&middot;T<sub>2<sub>0,2</sub></sub>
<br/>


1:
+b<sub>x</sub>&middot;T<sub>3<sub>1,1</sub></sub>
-b<sub>x</sub>&middot;c<sub>y</sub>&middot;T<sub>3<sub>1,2</sub></sub>
-b<sub>y</sub>&middot;T<sub>3<sub>0,1</sub></sub>
+b<sub>y</sub>&middot;c<sub>y</sub>&middot;T<sub>3<sub>0,2</sub></sub>
<br/>








*b<sub>x</sub>,b<sub>y</sub>*
<br/>
b<sub>x</sub>:
+a<sub>x</sub>&middot;T<sub>1<sub>1,1</sub></sub>
+a<sub>y</sub>&middot;T<sub>2<sub>1,1</sub></sub>
+T<sub>3<sub>1,1</sub></sub>
-c<sub>y</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>1,2</sub></sub>
-c<sub>y</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>1,2</sub></sub>
-c<sub>y</sub>&middot;T<sub>3<sub>1,2</sub></sub>
---
+b<sub>x</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>1,1</sub></sub>
+b<sub>x</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>1,1</sub></sub>
+b<sub>x</sub>&middot;T<sub>3<sub>1,1</sub></sub>
-b<sub>x</sub>&middot;c<sub>y</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>1,2</sub></sub>
-b<sub>x</sub>&middot;c<sub>y</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>1,2</sub></sub>
-b<sub>x</sub>&middot;c<sub>y</sub>&middot;T<sub>3<sub>1,2</sub></sub>
<br/>


b<sub>y</sub>:
-a<sub>x</sub>&middot;T<sub>1<sub>0,1</sub></sub>
-a<sub>y</sub>&middot;T<sub>2<sub>0,1</sub></sub>
-T<sub>3<sub>0,1</sub></sub>
+c<sub>y</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>0,2</sub></sub>
+c<sub>y</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>0,2</sub></sub>
+c<sub>y</sub>&middot;T<sub>3<sub>0,2</sub></sub>
---
-b<sub>y</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>0,1</sub></sub>
-b<sub>y</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>0,1</sub></sub>
-b<sub>y</sub>&middot;T<sub>3<sub>0,1</sub></sub>
+b<sub>y</sub>&middot;c<sub>y</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>0,2</sub></sub>
+b<sub>y</sub>&middot;c<sub>y</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>0,2</sub></sub>
+b<sub>y</sub>&middot;c<sub>y</sub>&middot;T<sub>3<sub>0,2</sub></sub>
<br/>


1:
0
<br/>












*c<sub>x</sub>,c<sub>y</sub>*
<br/>
c<sub>x</sub>:
0
<br/>


c<sub>y</sub>:
-b<sub>x</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>1,2</sub></sub>
-b<sub>x</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>1,2</sub></sub>
-b<sub>x</sub>&middot;T<sub>3<sub>1,2</sub></sub>
+b<sub>y</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>0,2</sub></sub>
+b<sub>y</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>0,2</sub></sub>
+b<sub>y</sub>&middot;T<sub>3<sub>0,2</sub></sub>
<br/>


1:
+b<sub>x</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>1,1</sub></sub>
+b<sub>x</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>1,1</sub></sub>
+b<sub>x</sub>&middot;T<sub>3<sub>1,1</sub></sub>
-b<sub>y</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>0,1</sub></sub>
-b<sub>y</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>0,1</sub></sub>
-b<sub>y</sub>&middot;T<sub>3<sub>0,1</sub></sub>
<br/>





+b<sub>x</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>1,1</sub></sub>
+b<sub>x</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>1,1</sub></sub>
+b<sub>x</sub>&middot;T<sub>3<sub>1,1</sub></sub>
-b<sub>x</sub>&middot;c<sub>y</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>1,2</sub></sub>
-b<sub>x</sub>&middot;c<sub>y</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>1,2</sub></sub>
-b<sub>x</sub>&middot;c<sub>y</sub>&middot;T<sub>3<sub>1,2</sub></sub>
-b<sub>y</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>0,1</sub></sub>
-b<sub>y</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>0,1</sub></sub>
-b<sub>y</sub>&middot;T<sub>3<sub>0,1</sub></sub>
+b<sub>y</sub>&middot;c<sub>y</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>0,2</sub></sub>
+b<sub>y</sub>&middot;c<sub>y</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>0,2</sub></sub>
+b<sub>y</sub>&middot;c<sub>y</sub>&middot;T<sub>3<sub>0,2</sub></sub>






---

<br/>
*2,1:*
<br/>
+b<sub>x</sub>&middot;c<sub>x</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>1,2</sub></sub>
+b<sub>x</sub>&middot;c<sub>x</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>1,2</sub></sub>
+b<sub>x</sub>&middot;c<sub>x</sub>&middot;T<sub>3<sub>1,2</sub></sub>
-b<sub>x</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>1,0</sub></sub>
-b<sub>x</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>1,0</sub></sub>
-b<sub>x</sub>&middot;T<sub>3<sub>1,0</sub></sub>
-b<sub>y</sub>&middot;c<sub>x</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>0,2</sub></sub>
-b<sub>y</sub>&middot;c<sub>x</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>0,2</sub></sub>
-b<sub>y</sub>&middot;c<sub>x</sub>&middot;T<sub>3<sub>0,2</sub></sub>
+b<sub>y</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>0,0</sub></sub>
+b<sub>y</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>0,0</sub></sub>
+b<sub>y</sub>&middot;T<sub>3<sub>0,0</sub></sub>
<br/>



*a<sub>x</sub>,a<sub>y</sub>*
<br/>
a<sub>x</sub>:
+b<sub>x</sub>&middot;c<sub>x</sub>&middot;T<sub>1<sub>1,2</sub></sub>
-b<sub>x</sub>&middot;T<sub>1<sub>1,0</sub></sub>
-b<sub>y</sub>&middot;c<sub>x</sub>&middot;T<sub>1<sub>0,2</sub></sub>
+b<sub>y</sub>&middot;T<sub>1<sub>0,0</sub></sub>
<br/>


a<sub>y</sub>:
+b<sub>x</sub>&middot;c<sub>x</sub>&middot;T<sub>2<sub>1,2</sub></sub>
-b<sub>x</sub>&middot;T<sub>2<sub>1,0</sub></sub>
-b<sub>y</sub>&middot;c<sub>x</sub>&middot;T<sub>2<sub>0,2</sub></sub>
+b<sub>y</sub>&middot;T<sub>2<sub>0,0</sub></sub>
<br/>


1:
+b<sub>x</sub>&middot;c<sub>x</sub>&middot;T<sub>3<sub>1,2</sub></sub>
-b<sub>x</sub>&middot;T<sub>3<sub>1,0</sub></sub>
-b<sub>y</sub>&middot;c<sub>x</sub>&middot;T<sub>3<sub>0,2</sub></sub>
+b<sub>y</sub>&middot;T<sub>3<sub>0,0</sub></sub>
<br/>


*b<sub>x</sub>,b<sub>y</sub>*
<br/>
b<sub>x</sub>:
+c<sub>x</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>1,2</sub></sub>
+c<sub>x</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>1,2</sub></sub>
+c<sub>x</sub>&middot;T<sub>3<sub>1,2</sub></sub>
-a<sub>x</sub>&middot;T<sub>1<sub>1,0</sub></sub>
-a<sub>y</sub>&middot;T<sub>2<sub>1,0</sub></sub>
-T<sub>3<sub>1,0</sub></sub>
<br/>


b<sub>y</sub>:
-c<sub>x</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>0,2</sub></sub>
-c<sub>x</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>0,2</sub></sub>
-c<sub>x</sub>&middot;T<sub>3<sub>0,2</sub></sub>
+a<sub>x</sub>&middot;T<sub>1<sub>0,0</sub></sub>
+a<sub>y</sub>&middot;T<sub>2<sub>0,0</sub></sub>
+T<sub>3<sub>0,0</sub></sub>
<br/>


1:
0
<br/>




*c<sub>x</sub>,c<sub>y</sub>*
<br/>
c<sub>x</sub>:
+b<sub>x</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>1,2</sub></sub>
+b<sub>x</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>1,2</sub></sub>
+b<sub>x</sub>&middot;T<sub>3<sub>1,2</sub></sub>
-b<sub>y</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>0,2</sub></sub>
-b<sub>y</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>0,2</sub></sub>
-b<sub>y</sub>&middot;T<sub>3<sub>0,2</sub></sub>
<br/>


c<sub>y</sub>:
0
<br/>


1:
-b<sub>x</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>1,0</sub></sub>
-b<sub>x</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>1,0</sub></sub>
-b<sub>x</sub>&middot;T<sub>3<sub>1,0</sub></sub>
+b<sub>y</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>0,0</sub></sub>
+b<sub>y</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>0,0</sub></sub>
+b<sub>y</sub>&middot;T<sub>3<sub>0,0</sub></sub>
<br/>



---


<br/>
*2,2:*
+b<sub>x</sub>&middot;c<sub>y</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>1,0</sub></sub>
+b<sub>x</sub>&middot;c<sub>y</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>1,0</sub></sub>
+b<sub>x</sub>&middot;c<sub>y</sub>&middot;T<sub>3<sub>1,0</sub></sub>
-b<sub>x</sub>&middot;c<sub>x</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>1,1</sub></sub>
-b<sub>x</sub>&middot;c<sub>x</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>1,1</sub></sub>
-b<sub>x</sub>&middot;c<sub>x</sub>&middot;T<sub>3<sub>1,1</sub></sub>
-b<sub>y</sub>&middot;c<sub>y</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>0,0</sub></sub>
-b<sub>y</sub>&middot;c<sub>y</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>0,0</sub></sub>
-b<sub>y</sub>&middot;c<sub>y</sub>&middot;T<sub>3<sub>0,0</sub></sub>
+b<sub>y</sub>&middot;c<sub>x</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>0,1</sub></sub>
+b<sub>y</sub>&middot;c<sub>x</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>0,1</sub></sub>
+b<sub>y</sub>&middot;c<sub>x</sub>&middot;T<sub>3<sub>0,1</sub></sub>
<br/>



*a<sub>x</sub>,a<sub>y</sub>*
<br/>
a<sub>x</sub>:
+b<sub>x</sub>&middot;c<sub>y</sub>&middot;T<sub>1<sub>1,0</sub></sub>
-b<sub>x</sub>&middot;c<sub>x</sub>&middot;T<sub>1<sub>1,1</sub></sub>
-b<sub>y</sub>&middot;c<sub>y</sub>&middot;T<sub>1<sub>0,0</sub></sub>
+b<sub>y</sub>&middot;c<sub>x</sub>&middot;T<sub>1<sub>0,1</sub></sub>
<br/>


a<sub>y</sub>:
+b<sub>x</sub>&middot;c<sub>y</sub>&middot;T<sub>2<sub>1,0</sub></sub>
-b<sub>x</sub>&middot;c<sub>x</sub>&middot;T<sub>2<sub>1,1</sub></sub>
-b<sub>y</sub>&middot;c<sub>y</sub>&middot;T<sub>2<sub>0,0</sub></sub>
+b<sub>y</sub>&middot;c<sub>x</sub>&middot;T<sub>2<sub>0,1</sub></sub>
<br/>


1:
+b<sub>x</sub>&middot;c<sub>y</sub>&middot;T<sub>3<sub>1,0</sub></sub>
-b<sub>x</sub>&middot;c<sub>x</sub>&middot;T<sub>3<sub>1,1</sub></sub>
-b<sub>y</sub>&middot;c<sub>y</sub>&middot;T<sub>3<sub>0,0</sub></sub>
+b<sub>y</sub>&middot;c<sub>x</sub>&middot;T<sub>3<sub>0,1</sub></sub>
<br/>







*b<sub>x</sub>,b<sub>y</sub>*
<br/>
b<sub>x</sub>:
+c<sub>y</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>1,0</sub></sub>
+c<sub>y</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>1,0</sub></sub>
+c<sub>y</sub>&middot;T<sub>3<sub>1,0</sub></sub>
-c<sub>x</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>1,1</sub></sub>
-c<sub>x</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>1,1</sub></sub>
-c<sub>x</sub>&middot;T<sub>3<sub>1,1</sub></sub>
<br/>


b<sub>y</sub>:
-c<sub>y</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>0,0</sub></sub>
-c<sub>y</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>0,0</sub></sub>
-c<sub>y</sub>&middot;T<sub>3<sub>0,0</sub></sub>
+c<sub>x</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>0,1</sub></sub>
+c<sub>x</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>0,1</sub></sub>
+c<sub>x</sub>&middot;T<sub>3<sub>0,1</sub></sub>
<br/>


1:
0
<br/>




*c<sub>x</sub>,c<sub>y</sub>*
<br/>
c<sub>x</sub>:
-b<sub>x</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>1,1</sub></sub>
-b<sub>x</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>1,1</sub></sub>
-b<sub>x</sub>&middot;T<sub>3<sub>1,1</sub></sub>
+b<sub>y</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>0,1</sub></sub>
+b<sub>y</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>0,1</sub></sub>
+b<sub>y</sub>&middot;T<sub>3<sub>0,1</sub></sub>
<br/>


c<sub>y</sub>:
+b<sub>x</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>1,0</sub></sub>
+b<sub>x</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>1,0</sub></sub>
+b<sub>x</sub>&middot;T<sub>3<sub>1,0</sub></sub>
-b<sub>y</sub>&middot;a<sub>x</sub>&middot;T<sub>1<sub>0,0</sub></sub>
-b<sub>y</sub>&middot;a<sub>y</sub>&middot;T<sub>2<sub>0,0</sub></sub>
-b<sub>y</sub>&middot;T<sub>3<sub>0,0</sub></sub>
<br/>


1:
0
<br/>











































---


*a<sub>x</sub>,a<sub>y</sub>*
<br/>
a<sub>x</sub>:
?
<br/>


a<sub>y</sub>:
?
<br/>


1:
?
<br/>



*b<sub>x</sub>,b<sub>y</sub>*
<br/>
b<sub>x</sub>:
?
<br/>


b<sub>y</sub>:
?
<br/>


1:
?
<br/>



*c<sub>x</sub>,c<sub>y</sub>*
<br/>
c<sub>x</sub>:
?
<br/>


c<sub>y</sub>:
?
<br/>


1:
?
<br/>
































<br/>
<br/>



<br/>

<br/>





Z = &Sigma;<sub>i</sub> *a<sub>i</sub>* &middot; *T<sub>i</sub>* = [z<sub>0,0</sub> z<sub>0,1</sub> z<sub>0,1</sub>; z<sub>1,0</sub>; z<sub>1,1</sub>; z<sub>1,1</sub> ; z<sub>2,0</sub>; z<sub>2,1</sub>; z<sub>2,1</sub>]

<br/>


z<sub>j,i</sub> = &Sigma;<sub>k</sub> *a<sub>k</sub>* &middot; T<sub>k</sub><sub>j,i</sub>
<br/>
z<sub>j,i</sub> = a<sub>x</sub>&middot;T<sub>1<sub>j,i</sub></sub> + a<sub>y</sub>&middot;T<sub>2<sub>j,i</sub></sub> + T<sub>3<sub>j,i</sub></sub>



<br/>
a<sub>x</sub>&middot;T<sub>1<sub>?</sub></sub> + a<sub>y</sub>&middot;T<sub>2<sub>?</sub></sub> + T<sub>3<sub>?</sub></sub>

a<sub>x</sub>&middot;T<sub>1<sub>0,0</sub></sub> + a<sub>y</sub>&middot;T<sub>2<sub>0,0</sub></sub> + T<sub>3<sub>0,0</sub></sub>
a<sub>x</sub>&middot;T<sub>1<sub>0,1</sub></sub> + a<sub>y</sub>&middot;T<sub>2<sub>0,1</sub></sub> + T<sub>3<sub>0,1</sub></sub>
a<sub>x</sub>&middot;T<sub>1<sub>0,2</sub></sub> + a<sub>y</sub>&middot;T<sub>2<sub>0,2</sub></sub> + T<sub>3<sub>0,2</sub></sub>

a<sub>x</sub>&middot;T<sub>1<sub>1,0</sub></sub> + a<sub>y</sub>&middot;T<sub>2<sub>1,0</sub></sub> + T<sub>3<sub>1,0</sub></sub>
a<sub>x</sub>&middot;T<sub>1<sub>1,1</sub></sub> + a<sub>y</sub>&middot;T<sub>2<sub>1,1</sub></sub> + T<sub>3<sub>1,1</sub></sub>
a<sub>x</sub>&middot;T<sub>1<sub>1,2</sub></sub> + a<sub>y</sub>&middot;T<sub>2<sub>1,2</sub></sub> + T<sub>3<sub>1,2</sub></sub>

a<sub>x</sub>&middot;T<sub>1<sub>2,0</sub></sub> + a<sub>y</sub>&middot;T<sub>2<sub>2,0</sub></sub> + T<sub>3<sub>2,0</sub></sub>
a<sub>x</sub>&middot;T<sub>1<sub>2,1</sub></sub> + a<sub>y</sub>&middot;T<sub>2<sub>2,1</sub></sub> + T<sub>3<sub>2,1</sub></sub>
a<sub>x</sub>&middot;T<sub>1<sub>2,2</sub></sub> + a<sub>y</sub>&middot;T<sub>2<sub>2,2</sub></sub> + T<sub>3<sub>2,2</sub></sub>


---
AGAIN
---

<br/>
[ b<sub>y</sub>&middot;(z<sub>2,1</sub> - z<sub>2,2</sub>&middot;c<sub>y</sub>) - (z<sub>1,1</sub> - z<sub>1,2</sub>&middot;c<sub>y</sub>)
| b<sub>y</sub>&middot;(z<sub>2,2</sub>&middot;c<sub>x</sub> - z<sub>2,0</sub>) - (z<sub>1,2</sub>&middot;c<sub>x</sub> - z<sub>1,0</sub>)
| b<sub>y</sub>&middot;(z<sub>2,0</sub>&middot;c<sub>y</sub> - z<sub>2,1</sub>&middot;c<sub>x</sub>) - (z<sub>1,0</sub>&middot;c<sub>y</sub> - z<sub>1,1</sub>&middot;c<sub>x</sub>) ]
<br/>
[ (z<sub>0,1</sub> - z<sub>0,2</sub>&middot;c<sub>y</sub>) - b<sub>x</sub>&middot;(z<sub>2,1</sub> - z<sub>2,2</sub>&middot;c<sub>y</sub>)
| (z<sub>0,2</sub>&middot;c<sub>x</sub> - z<sub>0,0</sub>) - b<sub>x</sub>&middot;(z<sub>2,2</sub>&middot;c<sub>x</sub> - z<sub>2,0</sub>)
| (z<sub>0,0</sub>&middot;c<sub>y</sub> - z<sub>0,1</sub>&middot;c<sub>x</sub>) - b<sub>x</sub>&middot;(z<sub>2,0</sub>&middot;c<sub>y</sub> - z<sub>2,1</sub>&middot;c<sub>x</sub>) ]
<br/>
[ b<sub>x</sub>&middot;(z<sub>1,1</sub> - z<sub>1,2</sub>&middot;c<sub>y</sub>) - b<sub>y</sub>&middot;(z<sub>0,1</sub> - z<sub>0,2</sub>&middot;c<sub>y</sub>)
| b<sub>x</sub>&middot;(z<sub>1,2</sub>&middot;c<sub>x</sub> - z<sub>1,0</sub>) - b<sub>y</sub>&middot;(z<sub>0,2</sub>&middot;c<sub>x</sub> - z<sub>0,0</sub>)
| b<sub>x</sub>&middot;(z<sub>1,0</sub>&middot;c<sub>y</sub> - z<sub>1,1</sub>&middot;c<sub>x</sub>) - b<sub>y</sub>&middot;(z<sub>0,0</sub>&middot;c<sub>y</sub> - z<sub>0,1</sub>&middot;c<sub>x</sub>) ]
<br/>





<br/>
























<br/>
