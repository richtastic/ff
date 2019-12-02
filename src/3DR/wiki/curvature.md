# Curvature 


- this is started elsewhere





Surface Curvature Computation



https://www.cs.auckland.ac.nz/~rklette/talks/07_Hiroshima.pdf

https://www.cs.auckland.ac.nz/~john-rugis/pdf/jr_thesis.pdf



http://web.mit.edu/hyperbook/Patrikalakis-Maekawa-Cho/node29.html

http://mathworld.wolfram.com/FundamentalForms.html

http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.413.3008&rep=rep1&type=pdf









if the calculated normal of surface is not what was sampled at, can use the difference in angle:


k_actual = kappa * cos(theta) = dot(normal,N)


















...

## curvature

### summary definitions

&rho; : radius of curvature (osculating sphere / circle)
<br/>
&kappa; : curvature = 1/&rho;
<br/>

&kappa;<sub>1</sub> : Principle Curvature 1 [min]
<br/>

&kappa;<sub>2</sub> : Principle Curvature 2 [max]
<br/>

K : Gaussian Curvature
<br/>
K = &kappa;<sub>1</sub>&middot;&kappa;<sub>2</sub>
<br/>

H : Mean Curvature
<br/>
H = &half;&middot;(&kappa;<sub>1</sub> + &kappa;<sub>2</sub>)


### directions & derivatives & partials & etc.

#### axes:

r(u,v) = &sigma;(x,y) : parametric surface
<br/>
r<sub>u</sub> = &sigma;<sub>x</sub> : arbitrary tangental direction 1
<br/>
r<sub>v</sub> = &sigma;<sub>y</sub> : arbitrary tangental direction 2
<br/>

|| &sigma;<sub>x</sub> || = ?
<br/>
|| &sigma;<sub>y</sub> || = ?


n<sup>^</sup> : unit normal direction = unit( &sigma;<sub>x</sub> &times; &sigma;<sub>y</sub> )

t = unit tangental direction ...




### First Fundamental Form: I

E&middot;du<sup>2</sup> + 2&middot;F&middot;du&middot;dv + G&middot;dv<sup>2</sup>
<br/>
E = &sigma;<sub>x</sub> &middot; &sigma;<sub>x</sub>
<br/>
F = &sigma;<sub>x</sub> &middot; &sigma;<sub>y</sub>
<br/>
G = &sigma;<sub>y</sub> &middot; &sigma;<sub>y</sub>
<br/>

F<sub>1</sub> = [E F ; F G]
<br/>
det(F<sub>1</sub>) = E + G - 2&middot;F


### Second Fundamental Form: II

L&middot;du<sup>2</sup> + 2&middot;M&middot;du&middot;dv + N&middot;dv<sup>2</sup>
<br/>
L = (e) = &sigma;<sub>xx</sub> &middot; n<sup>^</sup>
<br/>
M = (f) = &sigma;<sub>xy</sub> &middot; n<sup>^</sup>
<br/>
N = (g) = &sigma;<sub>yy</sub> &middot; n<sup>^</sup>
<br/>

F<sub>2</sub> = [L M ; M N]
<br/>
det(F<sub>2</sub>) = L + N - 2&middot;M
<br/>


### combined


F<sub>1,2</sub> = F<sub>1</sub><sup>-1</sup> &middot; F<sub>2</sub>
<br/>

F<sub>1,2</sub> = [] ???

<br/>


K = det(F<sub>1,2</sub>) = det(F<sub>2</sub>) / det(F<sub>1</sub>)
<br/>
K = (L&middot;N - M<sup>2</sup>) / (E&middot;G - F<sup>2</sup>)
<br/>


H = &half; &middot; tra(F<sub>1,2</sub>)
<br/>
H = &half; &middot; [L&middot;G - 2&middot;M&middot;F + N&middot;E]/[E&middot;G - F<sup>2</sup>]

<br/>
det(F<sub>2</sub> - &kappa;&middot;F<sub>1</sub>) = 0
<br/>
&kappa;<sup>2</sup> - 2&middot;H&middot;&kappa; + K = 0
<br/>
(E&middot;G - F<sup>2</sup>)&kappa;<sup>2</sup> - (L&middot;G - 2&middot;M&middot;F + N&middot;E)&kappa; + (L&middot;N - M<sup>2</sup>) = 0
<br/>


&kappa; = H &plmn; (H<sup>2</sup> - K)<sup>1/2</sup>
<br/>



&kappa;



### elevation surface: z = f(x,y)



<br/>
dx = dy = &delta;
<br/>


<br/>
f(-&delta;,0) = a
<br/>
f(0,0) = b
<br/>
f(+&delta;,0) = c
<br/>
f(0,-&delta;) = d
<br/>
f(0,+&delta;) = e
<br/>

f<sub>x</sub> = (c - a)/(2&middot;&delta;)
<br/>
f<sub>x<sub>ab</sub></sub> = (b - a)/(&delta;)
<br/>
f<sub>x<sub>bc</sub></sub> = (c - b)/(&delta;)
<br/>
f<sub>xx</sub> = (f<sub>x<sub>bc</sub></sub> - f<sub>x<sub>ab</sub></sub>)/(&delta;)
<br/>
f<sub>xx</sub> = (a + c - 2&middot;b)/(&delta;)
<br/>


f<sub>y</sub> = (c - a)/(2&middot;&delta;)
<br/>

<br/>

<br/>
#### grid:
```
[a b c]
[d e f]
[g h i]
```

<br/>
f(-&delta;,-&delta;) = a
<br/>
f(0,-&delta;) = b
<br/>
f(+&delta;,-&delta;) = c
<br/>
f(-&delta;,0) = d
<br/>
f(0,0) = e
<br/>
f(+&delta;,0) = f
<br/>
f(-&delta;,+&delta;) = g
<br/>
f(0,+&delta;) = h
<br/>
f(+&delta;,+&delta;) = i
<br/>


f<sub>x</sub> = (f - d)/(2&middot;&delta;)
<br/>
f<sub>y</sub> = (h - b)/(2&middot;&delta;)
<br/>
f<sub>xx</sub> = (d + f - 2&middot;e)/(&delta;)
<br/>
f<sub>yy</sub> = (b + h - 2&middot;e)/(&delta;)
<br/>

<br/>
f<sub>x<sub>-</sub></sub> = ((c+f)/2 - (a+d)/2/(2&middot;&delta;)
<br/>
f<sub>x<sub>+</sub></sub> = ((f+i)/2 - (d+g)/2)/(2&middot;&delta;)
<br/>
f<sub>xy</sub> = (f<sub>x<sub>+</sub></sub> - f<sub>x<sub>-</sub></sub>)/(2&middot;&delta;)
<br/>
f<sub>xy</sub> = (f + i - d - g - c - f + a + d)/(4&middot;&delta;<sup>2</sup>)
<br/>
f<sub>xy</sub> = (i - g - c + a)/(4&middot;&delta;<sup>2</sup>)
<br/>


<br/>
f<sub>y<sub>-</sub></sub> = ((g+h)/2 - (a+b)/2/(2&middot;&delta;)
<br/>
f<sub>y<sub>+</sub></sub> = ((h+i)/2 - (c+b)/2)/(2&middot;&delta;)
<br/>
f<sub>xy</sub> = (f<sub>y<sub>+</sub></sub> - f<sub>y<sub>-</sub></sub>)/(1&middot;&delta;)
<br/>
f<sub>xy</sub> = (h + i - c - b - g - h + a + b)/(4&middot;&delta;<sup>2</sup>)
<br/>
f<sub>xy</sub> = (i - c - g + a)/(4&middot;&delta;<sup>2</sup>)
<br/>




as a vector, sx = &lt;dx, 0, f(x2)-f(x1)&gt; / delta



&lt;&delta;,0,f<sub>x</sub>&gt; / &delta; = ... :


&sigma;<sub>x</sub> = &lt;1,0,f<sub>x</sub>&gt;
<br/>
&sigma;<sub>y</sub> = &lt;0,1,f<sub>y</sub>&gt;
<br/>
&sigma;<sub>xx</sub> = &lt;0,0,f<sub>xx</sub>&gt;
<br/>
&sigma;<sub>yy</sub> = &lt;0,0,f<sub>yy</sub>&gt;
<br/>
&sigma;<sub>xy</sub> = &lt;0,0,f<sub>xy</sub>&gt;
<br/>








<br/>





<br/>





<br/>



<br/>




<br/>



<br/>



<br/>




  .......


http://mathworld.wolfram.com/FirstFundamentalForm.html
http://mathworld.wolfram.com/SecondFundamentalForm.html
http://mathworld.wolfram.com/ThirdFundamentalForm.html

http://mathworld.wolfram.com/ShapeOperator.html

https://math.uchicago.edu/~may/REU2012/REUPapers/Chase.pdf

http://www.hao-li.com/cs599-ss2015/slides/
http://www.hao-li.com/cs599-ss2015/slides/Lecture03.1.pdf
http://www.hao-li.com/cs599-ss2015/slides/Lecture03.2.pdf
DISCRETE:
http://www.hao-li.com/cs599-ss2015/slides/Lecture04.1.pdf


http://resources.mpi-inf.mpg.de/departments/d4/teaching/ss2012/geomod/slides_public/05_DifferentialGeometry.pdf

https://www.cis.upenn.edu/~cis610/gma-v2-chap20.pdf


https://www.ljll.math.upmc.fr/frey/cours/Roscoff/slidesAusoni2014_2.pdf

http://web.mit.edu/hyperbook/Patrikalakis-Maekawa-Cho/node27.html
http://web.mit.edu/hyperbook/Patrikalakis-Maekawa-Cho/node28.html
http://web.mit.edu/hyperbook/Patrikalakis-Maekawa-Cho/node29.html
http://web.mit.edu/hyperbook/Patrikalakis-Maekawa-Cho/node30.html
http://web.mit.edu/hyperbook/Patrikalakis-Maekawa-Cho/node31.html
http://web.mit.edu/hyperbook/Patrikalakis-Maekawa-Cho/node32.html << explicit form - height map





















...



---