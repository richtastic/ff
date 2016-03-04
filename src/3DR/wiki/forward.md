# Notes


<br/>
**A**<sub>3&times;4</sub> = 3x4 matrix : only changing part of A<sub>4&times;4</sub>
<br/>
[r<sub>0,0</sub> r<sub>0,1</sub> r<sub>0,2</sub> t<sub>x</sub>]
<br/>
[r<sub>1,0</sub> r<sub>1,1</sub> r<sub>1,2</sub> t<sub>y</sub>]
<br/>
[r<sub>2,0</sub> r<sub>2,1</sub> r<sub>2,2</sub> t<sub>z</sub>]
<br/>
<br/>
**K**<sub>3&times;3</sub> = 3x3 : convert 2D plane points into screen-centered & scaled & skewed 2D points
<br/>
[f<sub>x</sub>  s c<sub>x</sub>]
<br/>
[ 0 f<sub>y</sub> c<sub>y</sub>]
<br/>
[ 0  0  1]
<br/>

**P**<sub>A</sub><sub>3&times;4</sub> = **K**<sub>3&times;3</sub>&middot;**A**<sub>3&times;4</sub>
<br/>
[r<sub>0,0</sub>&middot;f<sub>x</sub> + r<sub>1,0</sub>&middot;s  + r<sub>2,0</sub>&middot;c<sub>x</sub> | r<sub>0,1</sub>&middot;f<sub>x</sub> + r<sub>1,1</sub>&middot;s  + r<sub>2,1</sub>&middot;c<sub>x</sub> | r<sub>0,2</sub>&middot;f<sub>x</sub> + r<sub>1,2</sub>&middot;s  + r<sub>2,2</sub>&middot;c<sub>x</sub> | t<sub>x</sub>&middot;f<sub>x</sub> + t<sub>y</sub>&middot;s  + t<sub>z</sub>&middot;c<sub>x</sub>]
<br/>
[r<sub>1,0</sub>&middot;f<sub>y</sub> + r<sub>2,0</sub>&middot;c<sub>y</sub> | r<sub>1,1</sub>&middot;f<sub>y</sub> + r<sub>2,1</sub>&middot;c<sub>y</sub> | r<sub>1,2</sub>&middot;f<sub>y</sub> + r<sub>2,2</sub>&middot;c<sub>y</sub> | t<sub>y</sub>&middot;f<sub>y</sub> + t<sub>z</sub>&middot;c<sub>y</sub>]
<br/>
[r<sub>2,0</sub> | r<sub>2,1</sub> | r<sub>2,2</sub> | t<sub>z</sub>]
<br/>
<br/>
[p<sub>0,0</sub> p<sub>0,1</sub> p<sub>0,2</sub> p<sub>0,3</sub>]
<br/>
[p<sub>1,0</sub> p<sub>1,1</sub> p<sub>1,2</sub> p<sub>1,3</sub>]
<br/>
[p<sub>2,0</sub> p<sub>2,1</sub> p<sub>2,2</sub> p<sub>2,3</sub>]
<br/>

a<sub>x</sub> = f<sub>x</sub> &middot; (r<sub>0,0</sub>&middot;E<sub>x</sub> + r<sub>0,1</sub>&middot;E<sub>y</sub> + r<sub>0,2</sub>&middot;E<sub>z</sub> + t<sub>x</sub>) + s &middot; (r<sub>1,0</sub>&middot;E<sub>x</sub> + r<sub>1,1</sub>&middot;E<sub>y</sub> + r<sub>1,2</sub>&middot;E<sub>z</sub> + t<sub>y</sub>) + c<sub>x</sub> &middot; (r<sub>2,0</sub>&middot;E<sub>x</sub> + r<sub>2,1</sub>&middot;E<sub>y</sub> + r<sub>2,2</sub>&middot;E<sub>z</sub> + t<sub>z</sub>)
<br/>
a<sub>y</sub> = f<sub>y</sub> &middot; (r<sub>1,0</sub>&middot;E<sub>x</sub> + r<sub>1,1</sub>&middot;E<sub>y</sub> + r<sub>1,2</sub>&middot;E<sub>z</sub> + t<sub>y</sub>) + c<sub>y</sub> &middot; (r<sub>2,0</sub>&middot;E<sub>x</sub> + r<sub>2,1</sub>&middot;E<sub>y</sub> + r<sub>2,2</sub>&middot;E<sub>z</sub> + t<sub>z</sub>)
<br/>
a<sub>z</sub> = (r<sub>2,0</sub>&middot;E<sub>x</sub> + r<sub>2,1</sub>&middot;E<sub>y</sub> + r<sub>2,2</sub>&middot;E<sub>z</sub> + t<sub>z</sub>)
<br/>

#### separate knowns from unknowns

[r<sub>0,0</sub> | r<sub>0,1</sub> | r<sub>0,2</sub> | r<sub>1,0</sub> | r<sub>1,1</sub> | r<sub>1,2</sub> | r<sub>2,0</sub> | r<sub>2,1</sub> | r<sub>2,2</sub> | t<sub>x</sub> | t<sub>y</sub> | t<sub>z</sub>]
<br/>

a<sub>x</sub> = f<sub>x</sub>&middot;r<sub>0,0</sub>&middot;E<sub>x</sub> + f<sub>x</sub>&middot;r<sub>0,1</sub>&middot;E<sub>y</sub> + f<sub>x</sub>&middot;r<sub>0,2</sub>&middot;E<sub>z</sub> + f<sub>x</sub>&middot;t<sub>x</sub> + s&middot;r<sub>1,0</sub>&middot;E<sub>x</sub> + s&middot;r<sub>1,1</sub>&middot;E<sub>y</sub> + s&middot;r<sub>1,2</sub>&middot;E<sub>z</sub> + s&middot;t<sub>y</sub> + c<sub>x</sub>&middot;r<sub>2,0</sub>&middot;E<sub>x</sub> + c<sub>x</sub>&middot;r<sub>2,1</sub>&middot;E<sub>y</sub> + c<sub>x</sub>&middot;r<sub>2,2</sub>&middot;E<sub>z</sub> + c<sub>x</sub>&middot;t<sub>z</sub>
<br/>
a<sub>y</sub> = f<sub>y</sub>&middot;r<sub>1,0</sub>&middot;E<sub>x</sub> + f<sub>y</sub>&middot;r<sub>1,1</sub>&middot;E<sub>y</sub> + f<sub>y</sub>&middot;r<sub>1,2</sub>&middot;E<sub>z</sub> + f<sub>y</sub>&middot;t<sub>y</sub> + c<sub>y</sub>&middot;r<sub>2,0</sub>&middot;E<sub>x</sub> + c<sub>y</sub>&middot;r<sub>2,1</sub>&middot;E<sub>y</sub> + c<sub>y</sub>&middot;r<sub>2,2</sub>&middot;E<sub>z</sub> + c<sub>y</sub>&middot;t<sub>z</sub>
<br/>
a<sub>z</sub> = r<sub>2,0</sub>&middot;E<sub>x</sub> + r<sub>2,1</sub>&middot;E<sub>y</sub> + r<sub>2,2</sub>&middot;E<sub>z</sub> + t<sub>z</sub>
<br/>

#### screen points

a<sub>x/z</sub> = a<sub>x</sub> / a<sub>z</sub> (screen point)
<br/>
&rArr;
<br/>
a<sub>x/z</sub> = (f<sub>x</sub>&middot;r<sub>0,0</sub>&middot;E<sub>x</sub> + f<sub>x</sub>&middot;r<sub>0,1</sub>&middot;E<sub>y</sub> + f<sub>x</sub>&middot;r<sub>0,2</sub>&middot;E<sub>z</sub> + f<sub>x</sub>&middot;t<sub>x</sub> + s&middot;r<sub>1,0</sub>&middot;E<sub>x</sub> + s&middot;r<sub>1,1</sub>&middot;E<sub>y</sub> + s&middot;r<sub>1,2</sub>&middot;E<sub>z</sub> + s&middot;t<sub>y</sub> + c<sub>x</sub>&middot;r<sub>2,0</sub>&middot;E<sub>x</sub> + c<sub>x</sub>&middot;r<sub>2,1</sub>&middot;E<sub>y</sub> + c<sub>x</sub>&middot;r<sub>2,2</sub>&middot;E<sub>z</sub> + c<sub>x</sub>&middot;t<sub>z</sub>) / (r<sub>2,0</sub>&middot;E<sub>x</sub> + r<sub>2,1</sub>&middot;E<sub>y</sub> + r<sub>2,2</sub>&middot;E<sub>z</sub> + t<sub>z</sub>)
<br/>
a<sub>x/z</sub>&middot;(r<sub>2,0</sub>&middot;E<sub>x</sub> + r<sub>2,1</sub>&middot;E<sub>y</sub> + r<sub>2,2</sub>&middot;E<sub>z</sub> + t<sub>z</sub>) = f<sub>x</sub>&middot;r<sub>0,0</sub>&middot;E<sub>x</sub> + f<sub>x</sub>&middot;r<sub>0,1</sub>&middot;E<sub>y</sub> + f<sub>x</sub>&middot;r<sub>0,2</sub>&middot;E<sub>z</sub> + f<sub>x</sub>&middot;t<sub>x</sub> + s&middot;r<sub>1,0</sub>&middot;E<sub>x</sub> + s&middot;r<sub>1,1</sub>&middot;E<sub>y</sub> + s&middot;r<sub>1,2</sub>&middot;E<sub>z</sub> + s&middot;t<sub>y</sub> + c<sub>x</sub>&middot;r<sub>2,0</sub>&middot;E<sub>x</sub> + c<sub>x</sub>&middot;r<sub>2,1</sub>&middot;E<sub>y</sub> + c<sub>x</sub>&middot;r<sub>2,2</sub>&middot;E<sub>z</sub> + c<sub>x</sub>&middot;t<sub>z</sub>
<br/>
a<sub>x/z</sub>&middot;r<sub>2,0</sub>&middot;E<sub>x</sub> + a<sub>x/z</sub>&middot;r<sub>2,1</sub>&middot;E<sub>y</sub> + a<sub>x/z</sub>&middot;r<sub>2,2</sub>&middot;E<sub>z</sub> + a<sub>x/z</sub>&middot;t<sub>z</sub> = f<sub>x</sub>&middot;r<sub>0,0</sub>&middot;E<sub>x</sub> + f<sub>x</sub>&middot;r<sub>0,1</sub>&middot;E<sub>y</sub> + f<sub>x</sub>&middot;r<sub>0,2</sub>&middot;E<sub>z</sub> + f<sub>x</sub>&middot;t<sub>x</sub> + s&middot;r<sub>1,0</sub>&middot;E<sub>x</sub> + s&middot;r<sub>1,1</sub>&middot;E<sub>y</sub> + s&middot;r<sub>1,2</sub>&middot;E<sub>z</sub> + s&middot;t<sub>y</sub> + c<sub>x</sub>&middot;r<sub>2,0</sub>&middot;E<sub>x</sub> + c<sub>x</sub>&middot;r<sub>2,1</sub>&middot;E<sub>y</sub> + c<sub>x</sub>&middot;r<sub>2,2</sub>&middot;E<sub>z</sub> + c<sub>x</sub>&middot;t<sub>z</sub>
<br/>
f<sub>x</sub>&middot;r<sub>0,0</sub>&middot;E<sub>x</sub> + f<sub>x</sub>&middot;r<sub>0,1</sub>&middot;E<sub>y</sub> + f<sub>x</sub>&middot;r<sub>0,2</sub>&middot;E<sub>z</sub> + f<sub>x</sub>&middot;t<sub>x</sub> + s&middot;r<sub>1,0</sub>&middot;E<sub>x</sub> + s&middot;r<sub>1,1</sub>&middot;E<sub>y</sub> + s&middot;r<sub>1,2</sub>&middot;E<sub>z</sub> + s&middot;t<sub>y</sub> + r<sub>2,0</sub>&middot;E<sub>x</sub>&middot;(c<sub>x</sub> - a<sub>x/z</sub>) + r<sub>2,1</sub>&middot;E<sub>y</sub>&middot;(c<sub>x</sub> - a<sub>x/z</sub>) + r<sub>2,2</sub>&middot;E<sub>z</sub>&middot;(c<sub>x</sub> - a<sub>x/z</sub>) + t<sub>z</sub>&middot;(c<sub>x</sub> - a<sub>x/z</sub>) = 0
<br/>
<br/>
| f<sub>x</sub>&middot;E<sub>x</sub> | f<sub>x</sub>&middot;E<sub>y</sub> | f<sub>x</sub>&middot;E<sub>z</sub> | s&middot;E<sub>x</sub> | s&middot;E<sub>y</sub> | s&middot;E<sub>z</sub> | E<sub>x</sub>&middot;(c<sub>x</sub> - a<sub>x/z</sub>)| E<sub>y</sub>&middot;(c<sub>x</sub> - a<sub>x/z</sub>) | E<sub>z</sub>&middot;(c<sub>x</sub> - a<sub>x/z</sub>) | f<sub>x</sub> | s | c<sub>x</sub> - a<sub>x/z</sub> | = | 0 | 
<br/>
[r<sub>0,0</sub> | r<sub>0,1</sub> | r<sub>0,2</sub> | r<sub>1,0</sub> | r<sub>1,1</sub> | r<sub>1,2</sub> | r<sub>2,0</sub> | r<sub>2,1</sub> | r<sub>2,2</sub> | t<sub>x</sub> | t<sub>y</sub> | t<sub>z</sub>]
<br/>
<br/>

a<sub>y/z</sub> = a<sub>y</sub> / a<sub>z</sub> (screen point)
<br/>
&rArr;
<br/>
a<sub>y/z</sub> = (f<sub>y</sub>&middot;r<sub>1,0</sub>&middot;E<sub>x</sub> + f<sub>y</sub>&middot;r<sub>1,1</sub>&middot;E<sub>y</sub> + f<sub>y</sub>&middot;r<sub>1,2</sub>&middot;E<sub>z</sub> + f<sub>y</sub>&middot;t<sub>y</sub> + c<sub>y</sub>&middot;r<sub>2,0</sub>&middot;E<sub>x</sub> + c<sub>y</sub>&middot;r<sub>2,1</sub>&middot;E<sub>y</sub> + c<sub>y</sub>&middot;r<sub>2,2</sub>&middot;E<sub>z</sub> + c<sub>y</sub>&middot;t<sub>z</sub>) / (r<sub>2,0</sub>&middot;E<sub>x</sub> + r<sub>2,1</sub>&middot;E<sub>y</sub> + r<sub>2,2</sub>&middot;E<sub>z</sub> + t<sub>z</sub>)
<br/>
a<sub>y/z</sub>&middot;(r<sub>2,0</sub>&middot;E<sub>x</sub> + r<sub>2,1</sub>&middot;E<sub>y</sub> + r<sub>2,2</sub>&middot;E<sub>z</sub> + t<sub>z</sub>) = f<sub>y</sub>&middot;r<sub>1,0</sub>&middot;E<sub>x</sub> + f<sub>y</sub>&middot;r<sub>1,1</sub>&middot;E<sub>y</sub> + f<sub>y</sub>&middot;r<sub>1,2</sub>&middot;E<sub>z</sub> + f<sub>y</sub>&middot;t<sub>y</sub> + c<sub>y</sub>&middot;r<sub>2,0</sub>&middot;E<sub>x</sub> + c<sub>y</sub>&middot;r<sub>2,1</sub>&middot;E<sub>y</sub> + c<sub>y</sub>&middot;r<sub>2,2</sub>&middot;E<sub>z</sub> + c<sub>y</sub>&middot;t<sub>z</sub>
<br/>
a<sub>y/z</sub>&middot;r<sub>2,0</sub>&middot;E<sub>x</sub> + a<sub>y/z</sub>&middot;r<sub>2,1</sub>&middot;E<sub>y</sub> + a<sub>y/z</sub>&middot;r<sub>2,2</sub>&middot;E<sub>z</sub> + a<sub>y/z</sub>&middot;t<sub>z</sub> = f<sub>y</sub>&middot;r<sub>1,0</sub>&middot;E<sub>x</sub> + f<sub>y</sub>&middot;r<sub>1,1</sub>&middot;E<sub>y</sub> + f<sub>y</sub>&middot;r<sub>1,2</sub>&middot;E<sub>z</sub> + f<sub>y</sub>&middot;t<sub>y</sub> + c<sub>y</sub>&middot;r<sub>2,0</sub>&middot;E<sub>x</sub> + c<sub>y</sub>&middot;r<sub>2,1</sub>&middot;E<sub>y</sub> + c<sub>y</sub>&middot;r<sub>2,2</sub>&middot;E<sub>z</sub> + c<sub>y</sub>&middot;t<sub>z</sub>
<br/>
f<sub>y</sub>&middot;r<sub>1,0</sub>&middot;E<sub>x</sub> + f<sub>y</sub>&middot;r<sub>1,1</sub>&middot;E<sub>y</sub> + f<sub>y</sub>&middot;r<sub>1,2</sub>&middot;E<sub>z</sub> + f<sub>y</sub>&middot;t<sub>y</sub> + r<sub>2,0</sub>&middot;E<sub>x</sub>&middot;(c<sub>y</sub> - a<sub>y/z</sub>) + r<sub>2,1</sub>&middot;E<sub>y</sub>&middot;(c<sub>y</sub> - a<sub>y/z</sub>) + r<sub>2,2</sub>&middot;E<sub>z</sub>&middot;(c<sub>y</sub> - a<sub>y/z</sub>) + t<sub>z</sub>&middot;(c<sub>y</sub> - a<sub>y/z</sub>)
<br/>

| 0 | 0 | 0 | f<sub>y</sub>&middot;E<sub>x</sub> | f<sub>y</sub>&middot;E<sub>y</sub> | f<sub>y</sub>&middot;E<sub>z</sub> | E<sub>x</sub>&middot;(c<sub>y</sub> - a<sub>y/z</sub>) | E<sub>y</sub>&middot;(c<sub>y</sub> - a<sub>y/z</sub>) | E<sub>z</sub>&middot;(c<sub>y</sub> - a<sub>y/z</sub>) | 0 | f<sub>y</sub> | c<sub>y</sub> - a<sub>y/z</sub> | = | 0 |
<br/>
[r<sub>0,0</sub> | r<sub>0,1</sub> | r<sub>0,2</sub> | r<sub>1,0</sub> | r<sub>1,1</sub> | r<sub>1,2</sub> | r<sub>2,0</sub> | r<sub>2,1</sub> | r<sub>2,2</sub> | t<sub>x</sub> | t<sub>y</sub> | t<sub>z</sub>]
<br/>
<br/>

- need minimum of 12 rows for matrix solution
- every 3D world point  -to- 2D screen point provides 2 lines
- &rarr; need minimum of 6 points

<br/>
<br/>


#### from P = K*A matrix
<br/>


**P**<sub>A</sub><sub>3&times;4</sub> = **K**&middot;**A**
<br/>
&rArr;
<br/>
p<sub>0,0</sub> = r<sub>0,0</sub>&middot;f<sub>x</sub> + r<sub>1,0</sub>&middot;s  + r<sub>2,0</sub>&middot;c<sub>x</sub>
<br/>
p<sub>0,1</sub> = r<sub>0,1</sub>&middot;f<sub>x</sub> + r<sub>1,1</sub>&middot;s  + r<sub>2,1</sub>&middot;c<sub>x</sub> 
<br/>
p<sub>0,2</sub> = r<sub>0,2</sub>&middot;f<sub>x</sub> + r<sub>1,2</sub>&middot;s  + r<sub>2,2</sub>&middot;c<sub>x</sub>
<br/>
p<sub>0,3</sub> = t<sub>x</sub>&middot;f<sub>x</sub> + t<sub>y</sub>&middot;s  + t<sub>z</sub>&middot;c<sub>x</sub>
<br/>
p<sub>1,0</sub> = r<sub>1,0</sub>&middot;f<sub>y</sub> + r<sub>2,0</sub>&middot;c<sub>y</sub>
<br/>
p<sub>1,1</sub> = r<sub>1,1</sub>&middot;f<sub>y</sub> + r<sub>2,1</sub>&middot;c<sub>y</sub>
<br/>
p<sub>1,2</sub> = r<sub>1,2</sub>&middot;f<sub>y</sub> + r<sub>2,2</sub>&middot;c<sub>y</sub>
<br/>
p<sub>1,3</sub> = t<sub>y</sub>&middot;f<sub>y</sub> + t<sub>z</sub>&middot;c<sub>y</sub>
<br/>
p<sub>2,0</sub> = r<sub>2,0</sub>
<br/>
p<sub>2,1</sub> = r<sub>2,1</sub>
<br/>
p<sub>2,2</sub> =  r<sub>2,2</sub>
<br/>
p<sub>2,3</sub> = t<sub>z</sub>
<br/>
<br/>
[p<sub>0,0</sub> p<sub>0,1</sub> p<sub>0,2</sub> p<sub>0,3</sub>]
<br/>
[p<sub>1,0</sub> p<sub>1,1</sub> p<sub>1,2</sub> p<sub>1,3</sub>]
<br/>
[p<sub>2,0</sub> p<sub>2,1</sub> p<sub>2,2</sub> p<sub>2,3</sub>]
<br/>
<br/>
**a** = **P**&middot;**E**
<br/>
<br/>
a<sub>x</sub> = p<sub>0,0</sub>&middot;E<sub>x</sub> + p<sub>0,1</sub>&middot;E<sub>y</sub> + p<sub>0,2</sub>&middot;E<sub>z</sub> + p<sub>0,3</sub>&middot;1
<br/>
a<sub>y</sub> = p<sub>1,0</sub>&middot;E<sub>x</sub> + p<sub>1,1</sub>&middot;E<sub>y</sub> + p<sub>1,2</sub>&middot;E<sub>z</sub> + p<sub>1,3</sub>&middot;1
<br/>
a<sub>z</sub> = p<sub>2,0</sub>&middot;E<sub>x</sub> + p<sub>2,1</sub>&middot;E<sub>y</sub> + p<sub>2,2</sub>&middot;E<sub>z</sub> + p<sub>2,3</sub>&middot;1
<br/>
<br/>
a<sub>x/z</sub> = a<sub>x</sub> / a<sub>z</sub>
<br/>
a<sub>x/z</sub> = (p<sub>0,0</sub>&middot;E<sub>x</sub> + p<sub>0,1</sub>&middot;E<sub>y</sub> + p<sub>0,2</sub>&middot;E<sub>z</sub> + p<sub>0,3</sub>) / (p<sub>2,0</sub>&middot;E<sub>x</sub> + p<sub>2,1</sub>&middot;E<sub>y</sub> + p<sub>2,2</sub>&middot;E<sub>z</sub> + p<sub>2,3</sub>)
<br/>
a<sub>x/z</sub>&middot;(p<sub>2,0</sub>&middot;E<sub>x</sub> + p<sub>2,1</sub>&middot;E<sub>y</sub> + p<sub>2,2</sub>&middot;E<sub>z</sub> + p<sub>2,3</sub>) = (p<sub>0,0</sub>&middot;E<sub>x</sub> + p<sub>0,1</sub>&middot;E<sub>y</sub> + p<sub>0,2</sub>&middot;E<sub>z</sub> + p<sub>0,3</sub>)
<br/>
a<sub>x/z</sub>&middot;p<sub>2,0</sub>&middot;E<sub>x</sub> + a<sub>x/z</sub>&middot;p<sub>2,1</sub>&middot;E<sub>y</sub> + a<sub>x/z</sub>&middot;p<sub>2,2</sub>&middot;E<sub>z</sub> + a<sub>x/z</sub>&middot;p<sub>2,3</sub> = p<sub>0,0</sub>&middot;E<sub>x</sub> + p<sub>0,1</sub>&middot;E<sub>y</sub> + p<sub>0,2</sub>&middot;E<sub>z</sub> + p<sub>0,3</sub>
<br/>
0 = p<sub>0,0</sub>&middot;E<sub>x</sub> + p<sub>0,1</sub>&middot;E<sub>y</sub> + p<sub>0,2</sub>&middot;E<sub>z</sub> + p<sub>0,3</sub> - a<sub>x/z</sub>&middot;p<sub>2,0</sub>&middot;E<sub>x</sub> - a<sub>x/z</sub>&middot;p<sub>2,1</sub>&middot;E<sub>y</sub> - a<sub>x/z</sub>&middot;p<sub>2,2</sub>&middot;E<sub>z</sub> - a<sub>x/z</sub>&middot;p<sub>2,3</sub>
<br/>
<br/>
a<sub>y/z</sub> = a<sub>y</sub> / a<sub>z</sub>
<br/>
a<sub>y/z</sub> = (p<sub>1,0</sub>&middot;E<sub>x</sub> + p<sub>1,1</sub>&middot;E<sub>y</sub> + p<sub>1,2</sub>&middot;E<sub>z</sub> + p<sub>1,3</sub>) / (p<sub>2,0</sub>&middot;E<sub>x</sub> + p<sub>2,1</sub>&middot;E<sub>y</sub> + p<sub>2,2</sub>&middot;E<sub>z</sub> + p<sub>2,3</sub>)
<br/>
a<sub>y/z</sub>&middot;(p<sub>2,0</sub>&middot;E<sub>x</sub> + p<sub>2,1</sub>&middot;E<sub>y</sub> + p<sub>2,2</sub>&middot;E<sub>z</sub> + p<sub>2,3</sub>) = (p<sub>1,0</sub>&middot;E<sub>x</sub> + p<sub>1,1</sub>&middot;E<sub>y</sub> + p<sub>1,2</sub>&middot;E<sub>z</sub> + p<sub>1,3</sub>)
<br/>
a<sub>y/z</sub>&middot;p<sub>2,0</sub>&middot;E<sub>x</sub> + a<sub>y/z</sub>&middot;p<sub>2,1</sub>&middot;E<sub>y</sub> + a<sub>y/z</sub>&middot;p<sub>2,2</sub>&middot;E<sub>z</sub> + a<sub>y/z</sub>&middot;p<sub>2,3</sub> = p<sub>1,0</sub>&middot;E<sub>x</sub> + p<sub>1,1</sub>&middot;E<sub>y</sub> + p<sub>1,2</sub>&middot;E<sub>z</sub> + p<sub>1,3</sub>
<br/>
0 = p<sub>1,0</sub>&middot;E<sub>x</sub> + p<sub>1,1</sub>&middot;E<sub>y</sub> + p<sub>1,2</sub>&middot;E<sub>z</sub> + p<sub>1,3</sub> - a<sub>y/z</sub>&middot;p<sub>2,0</sub>&middot;E<sub>x</sub> - a<sub>y/z</sub>&middot;p<sub>2,1</sub>&middot;E<sub>y</sub> - a<sub>y/z</sub>&middot;p<sub>2,2</sub>&middot;E<sub>z</sub> - a<sub>y/z</sub>&middot;p<sub>2,3</sub>
<br/>
<br/>
| E<sub>x</sub> | E<sub>y</sub> | E<sub>z</sub> | 1 | 0 | 0 | 0 | 0 | -a<sub>x/z</sub>&middot;E<sub>x</sub> | -a<sub>x/z</sub>&middot;E<sub>y</sub> | -a<sub>x/z</sub>&middot;E<sub>z</sub> | -a<sub>x/z</sub> | = | 0 |
<br/>
| 0 | 0 | 0 | 0 | E<sub>x</sub> | E<sub>y</sub> | E<sub>z</sub> | 1 | -a<sub>y/z</sub>&middot;E<sub>x</sub> | -a<sub>y/z</sub>&middot;E<sub>y</sub> | -a<sub>y/z</sub>&middot;E<sub>z</sub> | -a<sub>y/z</sub> | = | 0 |
<br/>
<br/>
<br/>

| E<sub>x</sub> | E<sub>y</sub> | E<sub>z</sub> | 1 | 0 | 0 | 0 | 0 | -a<sub>x/z</sub>&middot;E<sub>x</sub> | -a<sub>x/z</sub>&middot;E<sub>y</sub> | -a<sub>x/z</sub>&middot;E<sub>z</sub> | -a<sub>x/z</sub> | = | 0 |
<br/>
| 0 | 0 | 0 | 0 | E<sub>x</sub> | E<sub>y</sub> | E<sub>z</sub> | 1 | -a<sub>y/z</sub>&middot;E<sub>x</sub> | -a<sub>y/z</sub>&middot;E<sub>y</sub> | -a<sub>y/z</sub>&middot;E<sub>z</sub> | -a<sub>y/z</sub> | = | 0 |
<br/>
[p<sub>0,0</sub> | p<sub>0,1</sub> | p<sub>0,2</sub> | p<sub>0,3</sub> | p<sub>1,0</sub> | p<sub>1,2</sub> | p<sub>1,2</sub> | p<sub>1,3</sub> | p<sub>2,0</sub> | p<sub>2,1</sub> | p<sub>2,2</sub> | p<sub>2,3</sub>]

<br/>
<br/>
| f<sub>x</sub>&middot;E<sub>x</sub> | f<sub>x</sub>&middot;E<sub>y</sub> | f<sub>x</sub>&middot;E<sub>x</sub> | s&middot;E<sub>x</sub> | s&middot;E<sub>y</sub> | s&middot;E<sub>z</sub> | E<sub>x</sub>&middot;(c<sub>x</sub> - a<sub>x/z</sub>)| E<sub>y</sub>&middot;(c<sub>x</sub> - a<sub>x/z</sub>) | E<sub>z</sub>&middot;(c<sub>x</sub> - a<sub>x/z</sub>) | f<sub>x</sub>&middot;t<sub>x</sub> +  s&middot;t<sub>y</sub> + t<sub>z</sub>&middot;(c<sub>x</sub> - a<sub>x/z</sub>) | = | 0 | 
<br/>
| 0 | 0 | 0 | E<sub>y</sub>&middot;(c<sub>y</sub> - a<sub>y/z</sub>) | f<sub>y</sub>&middot;E<sub>x</sub> | f<sub>y</sub>&middot;E<sub>y</sub> | f<sub>y</sub>&middot;E<sub>z</sub> | E<sub>z</sub>&middot;(c<sub>y</sub> - a<sub>y/z</sub>) | E<sub>x</sub>&middot;(c<sub>y</sub> - a<sub>y/z</sub>) |  f<sub>y</sub>&middot;t<sub>y</sub> + t<sub>z</sub>&middot;(c<sub>y</sub> - a<sub>y/z</sub>) | = | 0 |
<br/>
<br/>
[r<sub>0,0</sub> | r<sub>0,1</sub> | r<sub>0,2</sub> | t<sub>x</sub> | r<sub>1,0</sub> | r<sub>1,1</sub> | r<sub>1,2</sub> | t<sub>y</sub> | r<sub>2,0</sub> | r<sub>2,1</sub> | r<sub>2,2</sub> | t<sub>z</sub>]
<br/>
...







<br/>
<br/>
<br/>


...




#### CHECKS:

p<sub>0,0</sub> = r<sub>0,0</sub>&middot;f<sub>x</sub> + r<sub>1,0</sub>&middot;s  + r<sub>2,0</sub>&middot;c<sub>x</sub>
<br/>
p<sub>0,1</sub> = r<sub>0,1</sub>&middot;f<sub>x</sub> + r<sub>1,1</sub>&middot;s  + r<sub>2,1</sub>&middot;c<sub>x</sub> 
<br/>
p<sub>0,2</sub> = r<sub>0,2</sub>&middot;f<sub>x</sub> + r<sub>1,2</sub>&middot;s  + r<sub>2,2</sub>&middot;c<sub>x</sub>
<br/>
p<sub>0,3</sub> = t<sub>x</sub>&middot;f<sub>x</sub> + t<sub>y</sub>&middot;s  + t<sub>z</sub>&middot;c<sub>x</sub>
<br/>
<br/>
p<sub>1,0</sub> = r<sub>1,0</sub>&middot;f<sub>y</sub> + r<sub>2,0</sub>&middot;c<sub>y</sub>
<br/>
p<sub>1,1</sub> = r<sub>1,1</sub>&middot;f<sub>y</sub> + r<sub>2,1</sub>&middot;c<sub>y</sub>
<br/>
p<sub>1,2</sub> = r<sub>1,2</sub>&middot;f<sub>y</sub> + r<sub>2,2</sub>&middot;c<sub>y</sub>
<br/>
p<sub>1,3</sub> = t<sub>y</sub>&middot;f<sub>y</sub> + t<sub>z</sub>&middot;c<sub>y</sub>
<br/>
<br/>
p<sub>2,0</sub> = r<sub>2,0</sub>
<br/>
p<sub>2,1</sub> = r<sub>2,1</sub>
<br/>
p<sub>2,2</sub> =  r<sub>2,2</sub>
<br/>
p<sub>2,3</sub> = t<sub>z</sub>
<br/>
<br/>

a<sub>x</sub> = f<sub>x</sub>&middot;r<sub>0,0</sub>&middot;E<sub>x</sub> + f<sub>x</sub> &middot;r<sub>0,1</sub>&middot;E<sub>y</sub> + f<sub>x</sub>&middot;r<sub>0,2</sub>&middot;E<sub>z</sub> + f<sub>x</sub>&middot;t<sub>x</sub> + s&middot;r<sub>1,0</sub>&middot;E<sub>x</sub> + s&middot;r<sub>1,1</sub>&middot;E<sub>y</sub> + s&middot;r<sub>1,2</sub>&middot;E<sub>z</sub> + s&middot;t<sub>y</sub> + c<sub>x</sub>&middot;r<sub>2,0</sub>&middot;E<sub>x</sub> + c<sub>x</sub>&middot;r<sub>2,1</sub>&middot;E<sub>y</sub> + c<sub>x</sub>&middot;r<sub>2,2</sub>&middot;E<sub>z</sub> + c<sub>x</sub>&middot;t<sub>z</sub>
<br/>
a<sub>x</sub> = p<sub>0,0</sub>&middot;E<sub>x</sub> + p<sub>0,1</sub>&middot;E<sub>y</sub> + p<sub>0,2</sub>&middot;E<sub>z</sub> + p<sub>0,3</sub>&middot;1
<br/>
a<sub>x</sub> = (f<sub>x</sub>&middot;r<sub>0,0</sub> + s&middot;r<sub>1,0</sub> +  c<sub>x</sub>&middot;r<sub>2,0</sub>)&middot;E<sub>x</sub>  + (s&middot;r<sub>1,1</sub> + c<sub>x</sub>&middot;r<sub>2,1</sub> + f<sub>x</sub> &middot;r<sub>0,1</sub>)&middot;E<sub>y</sub> + (f<sub>x</sub>&middot;r<sub>0,2</sub> + s&middot;r<sub>1,2</sub> + c<sub>x</sub>&middot;r<sub>2,2</sub>)&middot;E<sub>z</sub> + (f<sub>x</sub>&middot;t<sub>x</sub> + s&middot;t<sub>y</sub> + c<sub>x</sub>&middot;t<sub>z</sub>)
<br/>
<br/>
<br/>
a<sub>y</sub> = f<sub>y</sub>&middot;r<sub>1,0</sub>&middot;E<sub>x</sub> + f<sub>y</sub>&middot;r<sub>1,1</sub>&middot;E<sub>y</sub> + f<sub>y</sub>&middot;r<sub>1,2</sub>&middot;E<sub>z</sub> + f<sub>y</sub>&middot;t<sub>y</sub> + c<sub>y</sub>&middot;r<sub>2,0</sub>&middot;E<sub>x</sub> + c<sub>y</sub>&middot;r<sub>2,1</sub>&middot;E<sub>y</sub> + c<sub>y</sub>&middot;r<sub>2,2</sub>&middot;E<sub>z</sub> + c<sub>y</sub>&middot;t<sub>z</sub>
<br/>
a<sub>y</sub> = p<sub>1,0</sub>&middot;E<sub>x</sub> + p<sub>1,1</sub>&middot;E<sub>y</sub> + p<sub>1,2</sub>&middot;E<sub>z</sub> + p<sub>1,3</sub>&middot;1
<br/>
a<sub>y</sub> = (f<sub>y</sub>&middot;r<sub>1,0</sub> + c<sub>y</sub>&middot;r<sub>2,0</sub>)&middot;E<sub>x</sub> + (f<sub>y</sub>&middot;r<sub>1,1</sub> + c<sub>y</sub>&middot;r<sub>2,1</sub>)&middot;E<sub>y</sub> + (f<sub>y</sub>&middot;r<sub>1,2</sub> + c<sub>y</sub>&middot;r<sub>2,2</sub>)&middot;E<sub>z</sub> + (f<sub>y</sub>&middot;t<sub>y</sub> + c<sub>y</sub>&middot;t<sub>z</sub>)
<br/>

<br/>
a<sub>z</sub> = r<sub>2,0</sub>&middot;E<sub>x</sub> + r<sub>2,1</sub>&middot;E<sub>y</sub> + r<sub>2,2</sub>&middot;E<sub>z</sub> + t<sub>z</sub>
<br/>
a<sub>z</sub> = p<sub>2,0</sub>&middot;E<sub>x</sub> + p<sub>2,1</sub>&middot;E<sub>y</sub> + p<sub>2,2</sub>&middot;E<sub>z</sub> + p<sub>2,3</sub>&middot;1
<br/>
a<sub>z</sub> = r<sub>2,0</sub>&middot;E<sub>x</sub> + r<sub>2,1</sub>&middot;E<sub>y</sub> + r<sub>2,2</sub>&middot;E<sub>z</sub> + t<sub>z</sub>

<br/>
<br/>










...




projected:
x<sub>a</sub> = 



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
<br/>


------------------------------------------------------------------------------------------------------------------------------------------------


























#### factoids

- X/Z & Y/Z is projection from 3D points into 2D points on a plane in camera's units
- different focal lengths means pixels are not square
- height - cy : convert from plane y coordinate to image y coordinate (y starts at top and goes down)
- ...


KNOWN: N
X | A | a (screen)
X | B | b (screen)
...

UNKNOWN: 12 - 3 (dot self = 0) - 3 (dot others = 1) = 6
r<sub>0,0</sub>
r<sub>0,1</sub>
r<sub>0,2</sub>
<br/>
r<sub>1,0</sub>
r<sub>1,1</sub>
r<sub>1,2</sub>
<br/>
r<sub>2,0</sub>
r<sub>2,1</sub>
r<sub>2,2</sub>
<br/>
t<sub>x</sub>
t<sub>y</sub>
t<sub>z</sub>

<br/>
<br/>

6 actual extrinsic unknowns:
r<sub>x</sub>
r<sub>y</sub>
r<sub>z</sub>
<br/>
t<sub>x</sub>
t<sub>y</sub>
t<sub>z</sub>



#### DIVISION BY Z BE DONE BEFORE/AFTER MULTIPLICATION BY K

1) Before
<br/>
f<sub>x</sub>&middot;(X/Z) + s&middot;(Y/Z) + c<sub>x</sub>&middot;(1) = a<sub>x</sub>
<br/>
f<sub>y</sub>&middot;(Y/Z) + c<sub>y</sub>&middot;(1) = a<sub>y</sub>
<br/>
<br/>
2) After
<br/>
f<sub>x</sub>&middot;X + s&middot;Y + c<sub>x</sub>&middot;Z = a<sub>x</sub>
<br/>
f<sub>y</sub>&middot;Y + c<sub>y</sub>&middot;Z = a<sub>y</sub>
<br/>
Z = a<sub>z</sub>
<br/>
&rArr;
<br/>
a<sub>x</sub> / a<sub>z</sub> = (f<sub>x</sub>&middot;X + s&middot;Y + c<sub>x</sub>&middot;Z)/Z
<br/>
= f<sub>x</sub>&middot;X/Z + s&middot;Y/Z + c<sub>x</sub>
<br/>
= **YES**
<br/>
&rArr;
<br/>
a<sub>y</sub> / a<sub>z</sub> = (f<sub>y</sub>&middot;Y + c<sub>y</sub>&middot;Z)/Z
<br/>
= f<sub>y</sub>&middot;Y/Z + c<sub>y</sub>
<br/>
= **YES**
<br/>

#### whole bunch of equations written out:

**A**<sup>-1</sup><sub>4&times;4</sub> = 4x4 matrix : convert 3D points from camera coordinates to world coordinates (reverse)

**A**<sub>4&times;4</sub> = 4x4 matrix : convert 3D points from world coordinates to camera coordinates (camera's persepective) (forward)
<br/>
[a<sub>0,0</sub> a<sub>0,1</sub> a<sub>0,2</sub> a<sub>0,3</sub>]
<br/>
[a<sub>1,0</sub> a<sub>1,1</sub> a<sub>1,2</sub> a<sub>1,3</sub>]
<br/>
[a<sub>2,0</sub> a<sub>2,1</sub> a<sub>2,2</sub> a<sub>2,3</sub>]
<br/>
[0 0 0 1]
<br/>
<br/>
**A**<sub>3&times;4</sub> = 3x4 matrix : only changing part of A<sub>4&times;4</sub>
<br/>
[r<sub>0,0</sub> r<sub>0,1</sub> r<sub>0,2</sub> t<sub>x</sub>]
<br/>
[r<sub>1,0</sub> r<sub>1,1</sub> r<sub>1,2</sub> t<sub>y</sub>]
<br/>
[r<sub>2,0</sub> r<sub>2,1</sub> r<sub>2,2</sub> t<sub>z</sub>]
<br/>
<br/>
**K**<sub>3&times;3</sub> = 3x3 : convert 2D plane points into screen-centered & scaled & skewed 2D points
<br/>
[f<sub>x</sub>  s c<sub>x</sub>]
<br/>
[ 0 f<sub>y</sub> c<sub>y</sub>]
<br/>
[ 0  0  1]
<br/>

**P**<sub>A</sub><sub>3&times;4</sub> = **K<sub>3&times;3</sub>**&middot;**A<sub>3&times;4</sub>**
<br/>
[r<sub>0,0</sub>&middot;f<sub>x</sub> + r<sub>2,0</sub>&middot;s  + r<sub>1,0</sub>&middot;c<sub>x</sub> | r<sub>0,1</sub>&middot;f<sub>x</sub> + r<sub>1,1</sub>&middot;s  + r<sub>2,1</sub>&middot;c<sub>x</sub> | r<sub>0,2</sub>&middot;f<sub>x</sub> + r<sub>1,2</sub>&middot;s  + r<sub>2,2</sub>&middot;c<sub>x</sub> | t<sub>x</sub>&middot;f<sub>x</sub> + t<sub>y</sub>&middot;s  + t<sub>z</sub>&middot;c<sub>x</sub>]
<br/>
[r<sub>1,0</sub>&middot;f<sub>y</sub> + r<sub>2,0</sub>&middot;c<sub>y</sub> | r<sub>1,1</sub>&middot;f<sub>y</sub> + r<sub>2,1</sub>&middot;c<sub>y</sub> | r<sub>1,2</sub>&middot;f<sub>y</sub> + r<sub>2,2</sub>&middot;c<sub>y</sub> | t<sub>y</sub>&middot;f<sub>y</sub> + t<sub>z</sub>&middot;c<sub>y</sub>]
<br/>
[r<sub>2,0</sub> | r<sub>2,1</sub> | r<sub>2,2</sub> | t<sub>z</sub>]
<br/>
<br/>
[p<sub>0,0</sub> p<sub>0,1</sub> p<sub>0,2</sub> p<sub>0,3</sub>]
<br/>
[p<sub>1,0</sub> p<sub>1,1</sub> p<sub>1,2</sub> p<sub>1,3</sub>]
<br/>
[p<sub>2,0</sub> p<sub>2,1</sub> p<sub>2,2</sub> p<sub>2,3</sub>]
<br/>

...



*x*<sub>a</sub> = &lt;x<sub>a</sub>, y<sub>a</sub>&gt;

*X*<sub>A</sub> = &lt;X<sub>A</sub>, Y<sub>A</sub>, Z<sub>A</sub>, 1&gt;

*X*<sub>E</sub> = &lt;X<sub>E</sub>, Y<sub>E</sub>, Z<sub>E</sub>, 1&gt;


### LISTED EQUATIONS WRITTEN OUT EXPLICITLY:

**E** = world 3D point &lt;E<sub>X</sub>,E<sub>Y</sub>,E<sub>Z</sub>&gt;
<br/>
**A** = camera 3D point &lt;A<sub>X</sub>,A<sub>Y</sub>,A<sub>Z</sub>&gt;
<br/>
**a** = camera 2D point &lt;a<sub>x</sub>,a<sub>y</sub>&gt;
<br/>
**a**<sub>x/z,y/z</sub> = image 2D point &lt;a<sub>x/z</sub>,a<sub>y/z</sub>&gt;
<br/>
<br/>
**A** = **A**<sub>3&times;4</sub> &middot; **E**
<br/>
A<sub>x</sub> = r<sub>0,0</sub>&middot;E<sub>x</sub> + r<sub>0,1</sub>&middot;E<sub>y</sub> + r<sub>0,2</sub>&middot;E<sub>x</sub> + t<sub>x</sub>&middot;1
<br/>
A<sub>y</sub> = r<sub>1,0</sub>&middot;E<sub>x</sub> + r<sub>1,1</sub>&middot;E<sub>y</sub> + r<sub>1,2</sub>&middot;E<sub>z</sub> + t<sub>y</sub>&middot;1
<br/>
A<sub>z</sub> = r<sub>2,0</sub>&middot;E<sub>x</sub> + r<sub>2,1</sub>&middot;E<sub>y</sub> + r<sub>2,2</sub>&middot;E<sub>z</sub> + t<sub>z</sub>&middot;1
<br/>
<br/>


**a** = **K**<sub>3&times;3</sub> &middot; **A** = (**K**<sub>3&times;3</sub> &middot; **A**<sub>3&times;4</sub>) &middot; **E** = **P**<sub>3&times;4</sub> &middot; **E** 
<br/>
a<sub>x</sub> = f<sub>x</sub> &middot; A<sub>x</sub> + s &middot; A<sub>y</sub> + c<sub>x</sub> &middot; A<sub>z</sub>
<br/>
a<sub>y</sub> = f<sub>y</sub> &middot; A<sub>y</sub> + c<sub>y</sub> &middot; A<sub>z</sub>
<br/>
a<sub>z</sub> = A<sub>z</sub>
<br/>
&rArr;
<br/>
a<sub>x</sub> = f<sub>x</sub> &middot; (r<sub>0,0</sub>&middot;E<sub>x</sub> + r<sub>0,1</sub>&middot;E<sub>y</sub> + r<sub>0,2</sub>&middot;E<sub>x</sub> + t<sub>x</sub>) + s &middot; (r<sub>1,0</sub>&middot;E<sub>x</sub> + r<sub>1,1</sub>&middot;E<sub>y</sub> + r<sub>1,2</sub>&middot;E<sub>z</sub> + t<sub>y</sub>) + c<sub>x</sub> &middot; (r<sub>2,0</sub>&middot;E<sub>x</sub> + r<sub>2,1</sub>&middot;E<sub>y</sub> + r<sub>2,2</sub>&middot;E<sub>z</sub> + t<sub>z</sub>)
<br/>
a<sub>y</sub> = f<sub>y</sub> &middot; (r<sub>1,0</sub>&middot;E<sub>x</sub> + r<sub>1,1</sub>&middot;E<sub>y</sub> + r<sub>1,2</sub>&middot;E<sub>z</sub> + t<sub>y</sub>) + c<sub>y</sub> &middot; (r<sub>2,0</sub>&middot;E<sub>x</sub> + r<sub>2,1</sub>&middot;E<sub>y</sub> + r<sub>2,2</sub>&middot;E<sub>z</sub> + t<sub>z</sub>)
<br/>
a<sub>z</sub> = (r<sub>2,0</sub>&middot;E<sub>x</sub> + r<sub>2,1</sub>&middot;E<sub>y</sub> + r<sub>2,2</sub>&middot;E<sub>z</sub> + t<sub>z</sub>)
<br/>
<br/>

#### getting extrinsic camera matrix parameters from point/screen matches

**1) orientate from 3D world point to local camera model 3D point**
<br/>

**X**<sub>A</sub><sub>*4&times;1*</sub> = **A**<sub>*4&times;4*</sub> &middot; **X**<sub>E</sub><sub>*4&times;1*</sub>
<br/>
X<sub>A</sub> = a<sub>0,0</sub>&middot;X<sub>E</sub> + a<sub>0,1</sub>&middot;Z<sub>E</sub> + a<sub>0,2</sub>&middot;Y<sub>E</sub> + a<sub>0,3</sub>&middot;1
<br/>
Y<sub>A</sub> = a<sub>1,0</sub>&middot;X<sub>E</sub> + a<sub>1,1</sub>&middot;Z<sub>E</sub> + a<sub>1,2</sub>&middot;Y<sub>E</sub> + a<sub>1,3</sub>&middot;1
<br/>
Z<sub>A</sub> = a<sub>2,0</sub>&middot;X<sub>E</sub> + a<sub>2,1</sub>&middot;Z<sub>E</sub> + a<sub>2,2</sub>&middot;Y<sub>E</sub> + a<sub>2,3</sub>&middot;1
<br/>
W<sub>A</sub> = 1
<br/>


**2) project from camera model to 2D plane**
<br/>

x<sub>a</sub> = X<sub>A</sub> / Z<sub>A</sub>
<br/>
y<sub>a</sub> = Y<sub>A</sub> / Z<sub>A</sub>
<br/>

**3) orientate 2D plane to image position/scale/skew**
<br/>

**x**<sub>a</sub><sub>*2&times;1*</sub> = **K**<sub>*3&times;3*</sub> &middot; **x**<sub>a</sub><sub>*2&times;1*</sub>
<br/>

x<sub>a</sub> = x<sub>a</sub>&middot;f<sub>x</sub> + x<sub>b</sub>&middot;s + c<sub>x</sub>
<br/>
y<sub>a</sub> = y<sub>a</sub>&middot;f<sub>y</sub> + c<sub>y</sub>

<br/>
<br/>


#### finding SVD least squares solutions from equations

[r<sub>0,0</sub> | r<sub>0,1</sub> | r<sub>0,2</sub> | r<sub>1,0</sub> | r<sub>1,1</sub> | r<sub>1,2</sub> | r<sub>2,0</sub> | r<sub>2,1</sub> | r<sub>2,2</sub> | t<sub>x</sub> | t<sub>y</sub> | t<sub>z</sub>]
<br/>
<br/>
a<sub>x</sub> = f<sub>x</sub> &middot; (r<sub>0,0</sub>&middot;E<sub>x</sub> + r<sub>0,1</sub>&middot;E<sub>y</sub> + r<sub>0,2</sub>&middot;E<sub>z</sub> + t<sub>x</sub>) + s &middot; (r<sub>1,0</sub>&middot;E<sub>x</sub> + r<sub>1,1</sub>&middot;E<sub>y</sub> + r<sub>1,2</sub>&middot;E<sub>z</sub> + t<sub>y</sub>) + c<sub>x</sub> &middot; (r<sub>2,0</sub>&middot;E<sub>x</sub> + r<sub>2,1</sub>&middot;E<sub>y</sub> + r<sub>2,2</sub>&middot;E<sub>z</sub> + t<sub>z</sub>)
<br/>
a<sub>x</sub> = f<sub>x</sub>&middot;r<sub>0,0</sub>&middot;E<sub>x</sub> + f<sub>x</sub> &middot;r<sub>0,1</sub>&middot;E<sub>y</sub> + f<sub>x</sub>&middot;r<sub>0,2</sub>&middot;E<sub>z</sub> + f<sub>x</sub>&middot;t<sub>x</sub> + s&middot;r<sub>1,0</sub>&middot;E<sub>x</sub> + s&middot;r<sub>1,1</sub>&middot;E<sub>y</sub> + s&middot;r<sub>1,2</sub>&middot;E<sub>z</sub> + s&middot;t<sub>y</sub> + c<sub>x</sub>&middot;r<sub>2,0</sub>&middot;E<sub>x</sub> + c<sub>x</sub>&middot;r<sub>2,1</sub>&middot;E<sub>y</sub> + c<sub>x</sub>&middot;r<sub>2,2</sub>&middot;E<sub>z</sub> + c<sub>x</sub>&middot;t<sub>z</sub>
<br/>
<br/>
a<sub>y</sub> = f<sub>y</sub> &middot; (r<sub>1,0</sub>&middot;E<sub>x</sub> + r<sub>1,1</sub>&middot;E<sub>y</sub> + r<sub>1,2</sub>&middot;E<sub>z</sub> + t<sub>y</sub>) + c<sub>y</sub> &middot; (r<sub>2,0</sub>&middot;E<sub>x</sub> + r<sub>2,1</sub>&middot;E<sub>y</sub> + r<sub>2,2</sub>&middot;E<sub>z</sub> + t<sub>z</sub>)
<br/>
a<sub>y</sub> = f<sub>y</sub>&middot;r<sub>1,0</sub>&middot;E<sub>x</sub> + f<sub>y</sub>&middot;r<sub>1,1</sub>&middot;E<sub>y</sub> + f<sub>y</sub>&middot;r<sub>1,2</sub>&middot;E<sub>z</sub> + f<sub>y</sub>&middot;t<sub>y</sub> + c<sub>y</sub>&middot;r<sub>2,0</sub>&middot;E<sub>x</sub> + c<sub>y</sub>&middot;r<sub>2,1</sub>&middot;E<sub>y</sub> + c<sub>y</sub>&middot;r<sub>2,2</sub>&middot;E<sub>z</sub> + c<sub>y</sub>&middot;t<sub>z</sub>
<br/>
<br/>
a<sub>z</sub> = r<sub>2,0</sub>&middot;E<sub>x</sub> + r<sub>2,1</sub>&middot;E<sub>y</sub> + r<sub>2,2</sub>&middot;E<sub>z</sub> + t<sub>z</sub>
<br/>
<br/>

a<sub>x/z</sub> = a<sub>x</sub> / a<sub>z</sub> (screen point)
<br/>
&rArr;
<br/>
a<sub>x/z</sub> = (f<sub>x</sub>&middot;r<sub>0,0</sub>&middot;E<sub>x</sub> + f<sub>x</sub> &middot;r<sub>0,1</sub>&middot;E<sub>y</sub> + f<sub>x</sub>&middot;r<sub>0,2</sub>&middot;E<sub>z</sub> + f<sub>x</sub>&middot;t<sub>x</sub> + s&middot;r<sub>1,0</sub>&middot;E<sub>x</sub> + s&middot;r<sub>1,1</sub>&middot;E<sub>y</sub> + s&middot;r<sub>1,2</sub>&middot;E<sub>z</sub> + s&middot;t<sub>y</sub> + c<sub>x</sub>&middot;r<sub>2,0</sub>&middot;E<sub>x</sub> + c<sub>x</sub>&middot;r<sub>2,1</sub>&middot;E<sub>y</sub> + c<sub>x</sub>&middot;r<sub>2,2</sub>&middot;E<sub>z</sub> + c<sub>x</sub>&middot;t<sub>z</sub>) / (r<sub>2,0</sub>&middot;E<sub>x</sub> + r<sub>2,1</sub>&middot;E<sub>y</sub> + r<sub>2,2</sub>&middot;E<sub>z</sub> + t<sub>z</sub>)
<br/>
a<sub>x/z</sub>&middot;(r<sub>2,0</sub>&middot;E<sub>x</sub> + r<sub>2,1</sub>&middot;E<sub>y</sub> + r<sub>2,2</sub>&middot;E<sub>z</sub> + t<sub>z</sub>) = f<sub>x</sub>&middot;r<sub>0,0</sub>&middot;E<sub>x</sub> + f<sub>x</sub> &middot;r<sub>0,1</sub>&middot;E<sub>y</sub> + f<sub>x</sub>&middot;r<sub>0,2</sub>&middot;E<sub>z</sub> + f<sub>x</sub>&middot;t<sub>x</sub> + s&middot;r<sub>1,0</sub>&middot;E<sub>x</sub> + s&middot;r<sub>1,1</sub>&middot;E<sub>y</sub> + s&middot;r<sub>1,2</sub>&middot;E<sub>z</sub> + s&middot;t<sub>y</sub> + c<sub>x</sub>&middot;r<sub>2,0</sub>&middot;E<sub>x</sub> + c<sub>x</sub>&middot;r<sub>2,1</sub>&middot;E<sub>y</sub> + c<sub>x</sub>&middot;r<sub>2,2</sub>&middot;E<sub>z</sub> + c<sub>x</sub>&middot;t<sub>z</sub>
<br/>
a<sub>x/z</sub>&middot;r<sub>2,0</sub>&middot;E<sub>x</sub> + a<sub>x/z</sub>&middot;r<sub>2,1</sub>&middot;E<sub>y</sub> + a<sub>x/z</sub>&middot;r<sub>2,2</sub>&middot;E<sub>z</sub> + a<sub>x/z</sub>&middot;t<sub>z</sub> = f<sub>x</sub>&middot;r<sub>0,0</sub>&middot;E<sub>x</sub> + f<sub>x</sub> &middot;r<sub>0,1</sub>&middot;E<sub>y</sub> + f<sub>x</sub>&middot;r<sub>0,2</sub>&middot;E<sub>z</sub> + f<sub>x</sub>&middot;t<sub>x</sub> + s&middot;r<sub>1,0</sub>&middot;E<sub>x</sub> + s&middot;r<sub>1,1</sub>&middot;E<sub>y</sub> + s&middot;r<sub>1,2</sub>&middot;E<sub>z</sub> + s&middot;t<sub>y</sub> + c<sub>x</sub>&middot;r<sub>2,0</sub>&middot;E<sub>x</sub> + c<sub>x</sub>&middot;r<sub>2,1</sub>&middot;E<sub>y</sub> + c<sub>x</sub>&middot;r<sub>2,2</sub>&middot;E<sub>z</sub> + c<sub>x</sub>&middot;t<sub>z</sub>
<br/>
f<sub>x</sub>&middot;r<sub>0,0</sub>&middot;E<sub>x</sub> + f<sub>x</sub> &middot;r<sub>0,1</sub>&middot;E<sub>y</sub> + f<sub>x</sub>&middot;r<sub>0,2</sub>&middot;E<sub>z</sub> + f<sub>x</sub>&middot;t<sub>x</sub> + s&middot;r<sub>1,0</sub>&middot;E<sub>x</sub> + s&middot;r<sub>1,1</sub>&middot;E<sub>y</sub> + s&middot;r<sub>1,2</sub>&middot;E<sub>z</sub> + s&middot;t<sub>y</sub> + r<sub>2,0</sub>&middot;E<sub>x</sub>&middot;(c<sub>x</sub> - a<sub>x/z</sub>) + r<sub>2,1</sub>&middot;E<sub>y</sub>&middot;(c<sub>x</sub> - a<sub>x/z</sub>) + r<sub>2,2</sub>&middot;E<sub>z</sub>&middot;(c<sub>x</sub> - a<sub>x/z</sub>) + t<sub>z</sub>&middot;(c<sub>x</sub> - a<sub>x/z</sub>) = 0
<br/>
<br/>
| f<sub>x</sub>&middot;E<sub>x</sub> | f<sub>x</sub>&middot;E<sub>y</sub> | f<sub>x</sub>&middot;E<sub>z</sub> | s&middot;E<sub>x</sub> | s&middot;E<sub>y</sub> | s&middot;E<sub>z</sub> | E<sub>x</sub>&middot;(c<sub>x</sub> - a<sub>x/z</sub>)| E<sub>y</sub>&middot;(c<sub>x</sub> - a<sub>x/z</sub>) | E<sub>z</sub>&middot;(c<sub>x</sub> - a<sub>x/z</sub>) | f<sub>x</sub> | s | c<sub>x</sub> - a<sub>x/z</sub> | = | 0 | 
<br/>
<br/>

a<sub>y/z</sub> = a<sub>y</sub> / a<sub>z</sub> (screen point)
<br/>
&rArr;
<br/>
a<sub>y/z</sub> = (f<sub>y</sub>&middot;r<sub>1,0</sub>&middot;E<sub>x</sub> + f<sub>y</sub>&middot;r<sub>1,1</sub>&middot;E<sub>y</sub> + f<sub>y</sub>&middot;r<sub>1,2</sub>&middot;E<sub>z</sub> + f<sub>y</sub>&middot;t<sub>y</sub> + c<sub>y</sub>&middot;r<sub>2,0</sub>&middot;E<sub>x</sub> + c<sub>y</sub>&middot;r<sub>2,1</sub>&middot;E<sub>y</sub> + c<sub>y</sub>&middot;r<sub>2,2</sub>&middot;E<sub>z</sub> + c<sub>y</sub>&middot;t<sub>z</sub>) / (r<sub>2,0</sub>&middot;E<sub>x</sub> + r<sub>2,1</sub>&middot;E<sub>y</sub> + r<sub>2,2</sub>&middot;E<sub>z</sub> + t<sub>z</sub>)
<br/>
a<sub>y/z</sub>&middot;(r<sub>2,0</sub>&middot;E<sub>x</sub> + r<sub>2,1</sub>&middot;E<sub>y</sub> + r<sub>2,2</sub>&middot;E<sub>z</sub> + t<sub>z</sub>) = f<sub>y</sub>&middot;r<sub>1,0</sub>&middot;E<sub>x</sub> + f<sub>y</sub>&middot;r<sub>1,1</sub>&middot;E<sub>y</sub> + f<sub>y</sub>&middot;r<sub>1,2</sub>&middot;E<sub>z</sub> + f<sub>y</sub>&middot;t<sub>y</sub> + c<sub>y</sub>&middot;r<sub>2,0</sub>&middot;E<sub>x</sub> + c<sub>y</sub>&middot;r<sub>2,1</sub>&middot;E<sub>y</sub> + c<sub>y</sub>&middot;r<sub>2,2</sub>&middot;E<sub>z</sub> + c<sub>y</sub>&middot;t<sub>z</sub>
<br/>
a<sub>y/z</sub>&middot;r<sub>2,0</sub>&middot;E<sub>x</sub> + a<sub>y/z</sub>&middot;r<sub>2,1</sub>&middot;E<sub>y</sub> + a<sub>y/z</sub>&middot;r<sub>2,2</sub>&middot;E<sub>z</sub> + a<sub>y/z</sub>&middot;t<sub>z</sub> = f<sub>y</sub>&middot;r<sub>1,0</sub>&middot;E<sub>x</sub> + f<sub>y</sub>&middot;r<sub>1,1</sub>&middot;E<sub>y</sub> + f<sub>y</sub>&middot;r<sub>1,2</sub>&middot;E<sub>z</sub> + f<sub>y</sub>&middot;t<sub>y</sub> + c<sub>y</sub>&middot;r<sub>2,0</sub>&middot;E<sub>x</sub> + c<sub>y</sub>&middot;r<sub>2,1</sub>&middot;E<sub>y</sub> + c<sub>y</sub>&middot;r<sub>2,2</sub>&middot;E<sub>z</sub> + c<sub>y</sub>&middot;t<sub>z</sub>
<br/>
f<sub>y</sub>&middot;r<sub>1,0</sub>&middot;E<sub>x</sub> + f<sub>y</sub>&middot;r<sub>1,1</sub>&middot;E<sub>y</sub> + f<sub>y</sub>&middot;r<sub>1,2</sub>&middot;E<sub>z</sub> + f<sub>y</sub>&middot;t<sub>y</sub> + r<sub>2,0</sub>&middot;E<sub>x</sub>&middot;(c<sub>y</sub> - a<sub>y/z</sub>) + r<sub>2,1</sub>&middot;E<sub>y</sub>&middot;(c<sub>y</sub> - a<sub>y/z</sub>) + r<sub>2,2</sub>&middot;E<sub>z</sub>&middot;(c<sub>y</sub> - a<sub>y/z</sub>) + t<sub>z</sub>&middot;(c<sub>y</sub> - a<sub>y/z</sub>)
<br/>

| 0 | 0 | 0 | f<sub>y</sub>&middot;E<sub>x</sub> | f<sub>y</sub>&middot;E<sub>y</sub> | f<sub>y</sub>&middot;E<sub>z</sub> | E<sub>x</sub>&middot;(c<sub>y</sub> - a<sub>y/z</sub>) | E<sub>y</sub>&middot;(c<sub>y</sub> - a<sub>y/z</sub>) | E<sub>z</sub>&middot;(c<sub>y</sub> - a<sub>y/z</sub>) | 0 | f<sub>y</sub> | c<sub>y</sub> - a<sub>y/z</sub> | = | 0 |
<br/>
<br/>

- need minimum of 12 rows for matrix solution
- every 3D world point  -to- 2D screen point provides 2 lines
- &rarr; need minimum of 6 points

<br/>
<br/>


#### WHAT IF camera intrinsic camera parameters are not known?
<br/>


**P**<sub>A</sub><sub>3&times;4</sub> = **K**&middot;**A**
<br/>
&rArr;
<br/>
p<sub>0,0</sub> = r<sub>0,0</sub>&middot;f<sub>x</sub> + r<sub>1,0</sub>&middot;s  + r<sub>2,0</sub>&middot;c<sub>x</sub>
<br/>
p<sub>0,1</sub> = r<sub>0,1</sub>&middot;f<sub>x</sub> + r<sub>1,1</sub>&middot;s  + r<sub>2,1</sub>&middot;c<sub>x</sub> 
<br/>
p<sub>0,2</sub> = r<sub>0,2</sub>&middot;f<sub>x</sub> + r<sub>1,2</sub>&middot;s  + r<sub>2,2</sub>&middot;c<sub>x</sub>
<br/>
p<sub>0,3</sub> = t<sub>x</sub>&middot;f<sub>x</sub> + t<sub>y</sub>&middot;s  + t<sub>z</sub>&middot;c<sub>x</sub>
<br/>
p<sub>1,0</sub> = r<sub>1,0</sub>&middot;f<sub>y</sub> + r<sub>2,0</sub>&middot;c<sub>y</sub>
<br/>
p<sub>1,1</sub> = r<sub>1,1</sub>&middot;f<sub>y</sub> + r<sub>2,1</sub>&middot;c<sub>y</sub>
<br/>
p<sub>1,2</sub> = r<sub>1,2</sub>&middot;f<sub>y</sub> + r<sub>2,2</sub>&middot;c<sub>y</sub>
<br/>
p<sub>1,3</sub> = t<sub>y</sub>&middot;f<sub>y</sub> + t<sub>z</sub>&middot;c<sub>y</sub>
<br/>
p<sub>2,0</sub> = r<sub>2,0</sub>
<br/>
p<sub>2,1</sub> = r<sub>2,1</sub>
<br/>
p<sub>2,2</sub> =  r<sub>2,2</sub>
<br/>
p<sub>2,3</sub> = t<sub>z</sub>
<br/>
<br/>
[p<sub>0,0</sub> p<sub>0,1</sub> p<sub>0,2</sub> p<sub>0,3</sub>]
<br/>
[p<sub>1,0</sub> p<sub>1,1</sub> p<sub>1,2</sub> p<sub>1,3</sub>]
<br/>
[p<sub>2,0</sub> p<sub>2,1</sub> p<sub>2,2</sub> p<sub>2,3</sub>]
<br/>
<br/>
**a** = **P**&middot;**E**
<br/>
<br/>
a<sub>x</sub> = p<sub>0,0</sub>&middot;E<sub>x</sub> + p<sub>0,1</sub>&middot;E<sub>y</sub> + p<sub>0,2</sub>&middot;E<sub>z</sub> + p<sub>0,3</sub>&middot;1
<br/>
a<sub>y</sub> = p<sub>1,0</sub>&middot;E<sub>x</sub> + p<sub>1,1</sub>&middot;E<sub>y</sub> + p<sub>1,2</sub>&middot;E<sub>z</sub> + p<sub>1,3</sub>&middot;1
<br/>
a<sub>z</sub> = p<sub>2,0</sub>&middot;E<sub>x</sub> + p<sub>2,1</sub>&middot;E<sub>y</sub> + p<sub>2,2</sub>&middot;E<sub>z</sub> + p<sub>2,3</sub>&middot;1
<br/>
<br/>
a<sub>x/z</sub> = a<sub>x</sub> / a<sub>z</sub>
<br/>
a<sub>x/z</sub> = (p<sub>0,0</sub>&middot;E<sub>x</sub> + p<sub>0,1</sub>&middot;E<sub>y</sub> + p<sub>0,2</sub>&middot;E<sub>z</sub> + p<sub>0,3</sub>) / (p<sub>2,0</sub>&middot;E<sub>x</sub> + p<sub>2,1</sub>&middot;E<sub>y</sub> + p<sub>2,2</sub>&middot;E<sub>z</sub> + p<sub>2,3</sub>)
<br/>
a<sub>x/z</sub>&middot;(p<sub>2,0</sub>&middot;E<sub>x</sub> + p<sub>2,1</sub>&middot;E<sub>y</sub> + p<sub>2,2</sub>&middot;E<sub>z</sub> + p<sub>2,3</sub>) = (p<sub>0,0</sub>&middot;E<sub>x</sub> + p<sub>0,1</sub>&middot;E<sub>y</sub> + p<sub>0,2</sub>&middot;E<sub>z</sub> + p<sub>0,3</sub>)
<br/>
a<sub>x/z</sub>&middot;p<sub>2,0</sub>&middot;E<sub>x</sub> + a<sub>x/z</sub>&middot;p<sub>2,1</sub>&middot;E<sub>y</sub> + a<sub>x/z</sub>&middot;p<sub>2,2</sub>&middot;E<sub>z</sub> + a<sub>x/z</sub>&middot;p<sub>2,3</sub> = p<sub>0,0</sub>&middot;E<sub>x</sub> + p<sub>0,1</sub>&middot;E<sub>y</sub> + p<sub>0,2</sub>&middot;E<sub>z</sub> + p<sub>0,3</sub>
<br/>
0 = p<sub>0,0</sub>&middot;E<sub>x</sub> + p<sub>0,1</sub>&middot;E<sub>y</sub> + p<sub>0,2</sub>&middot;E<sub>z</sub> + p<sub>0,3</sub> - a<sub>x/z</sub>&middot;p<sub>2,0</sub>&middot;E<sub>x</sub> - a<sub>x/z</sub>&middot;p<sub>2,1</sub>&middot;E<sub>y</sub> - a<sub>x/z</sub>&middot;p<sub>2,2</sub>&middot;E<sub>z</sub> - a<sub>x/z</sub>&middot;p<sub>2,3</sub>
<br/>
<br/>
a<sub>y/z</sub> = a<sub>y</sub> / a<sub>z</sub>
<br/>
a<sub>y/z</sub> = (p<sub>1,0</sub>&middot;E<sub>x</sub> + p<sub>1,1</sub>&middot;E<sub>y</sub> + p<sub>1,2</sub>&middot;E<sub>z</sub> + p<sub>1,3</sub>) / (p<sub>2,0</sub>&middot;E<sub>x</sub> + p<sub>2,1</sub>&middot;E<sub>y</sub> + p<sub>2,2</sub>&middot;E<sub>z</sub> + p<sub>2,3</sub>)
<br/>
a<sub>y/z</sub>&middot;(p<sub>2,0</sub>&middot;E<sub>x</sub> + p<sub>2,1</sub>&middot;E<sub>y</sub> + p<sub>2,2</sub>&middot;E<sub>z</sub> + p<sub>2,3</sub>) = (p<sub>1,0</sub>&middot;E<sub>x</sub> + p<sub>1,1</sub>&middot;E<sub>y</sub> + p<sub>1,2</sub>&middot;E<sub>z</sub> + p<sub>1,3</sub>)
<br/>
a<sub>y/z</sub>&middot;p<sub>2,0</sub>&middot;E<sub>x</sub> + a<sub>y/z</sub>&middot;p<sub>2,1</sub>&middot;E<sub>y</sub> + a<sub>y/z</sub>&middot;p<sub>2,2</sub>&middot;E<sub>z</sub> + a<sub>y/z</sub>&middot;p<sub>2,3</sub> = p<sub>1,0</sub>&middot;E<sub>x</sub> + p<sub>1,1</sub>&middot;E<sub>y</sub> + p<sub>1,2</sub>&middot;E<sub>z</sub> + p<sub>1,3</sub>
<br/>
0 = p<sub>1,0</sub>&middot;E<sub>x</sub> + p<sub>1,1</sub>&middot;E<sub>y</sub> + p<sub>1,2</sub>&middot;E<sub>z</sub> + p<sub>1,3</sub> - a<sub>y/z</sub>&middot;p<sub>2,0</sub>&middot;E<sub>x</sub> - a<sub>y/z</sub>&middot;p<sub>2,1</sub>&middot;E<sub>y</sub> - a<sub>y/z</sub>&middot;p<sub>2,2</sub>&middot;E<sub>z</sub> - a<sub>y/z</sub>&middot;p<sub>2,3</sub>
<br/>
<br/>
| E<sub>x</sub> | E<sub>y</sub> | E<sub>z</sub> | 1 | 0 | 0 | 0 | 0 | -a<sub>x/z</sub>&middot;E<sub>x</sub> | -a<sub>x/z</sub>&middot;E<sub>y</sub> | -a<sub>x/z</sub>&middot;E<sub>z</sub> | -a<sub>x/z</sub> | = | 0 |
<br/>
| 0 | 0 | 0 | 0 | E<sub>x</sub> | E<sub>y</sub> | E<sub>z</sub> | 1 | -a<sub>y/z</sub>&middot;E<sub>x</sub> | -a<sub>y/z</sub>&middot;E<sub>y</sub> | -a<sub>y/z</sub>&middot;E<sub>z</sub> | -a<sub>y/z</sub> | = | 0 |
<br/>
<br/>
<br/>

| E<sub>x</sub> | E<sub>y</sub> | E<sub>z</sub> | 1 | 0 | 0 | 0 | 0 | -a<sub>x/z</sub>&middot;E<sub>x</sub> | -a<sub>x/z</sub>&middot;E<sub>y</sub> | -a<sub>x/z</sub>&middot;E<sub>z</sub> | -a<sub>x/z</sub> | = | 0 |
<br/>
| 0 | 0 | 0 | 0 | E<sub>x</sub> | E<sub>y</sub> | E<sub>z</sub> | 1 | -a<sub>y/z</sub>&middot;E<sub>x</sub> | -a<sub>y/z</sub>&middot;E<sub>y</sub> | -a<sub>y/z</sub>&middot;E<sub>z</sub> | -a<sub>y/z</sub> | = | 0 |
<br/>
[p<sub>0,0</sub> | p<sub>0,1</sub> | p<sub>0,2</sub> | p<sub>0,3</sub> | p<sub>1,0</sub> | p<sub>1,2</sub> | p<sub>1,2</sub> | p<sub>1,3</sub> | p<sub>2,0</sub> | p<sub>2,1</sub> | p<sub>2,2</sub> | p<sub>2,3</sub>]

<br/>
<br/>
| f<sub>x</sub>&middot;E<sub>x</sub> | f<sub>x</sub>&middot;E<sub>y</sub> | f<sub>x</sub>&middot;E<sub>x</sub> | s&middot;E<sub>x</sub> | s&middot;E<sub>y</sub> | s&middot;E<sub>z</sub> | E<sub>x</sub>&middot;(c<sub>x</sub> - a<sub>x/z</sub>)| E<sub>y</sub>&middot;(c<sub>x</sub> - a<sub>x/z</sub>) | E<sub>z</sub>&middot;(c<sub>x</sub> - a<sub>x/z</sub>) | f<sub>x</sub>&middot;t<sub>x</sub> +  s&middot;t<sub>y</sub> + t<sub>z</sub>&middot;(c<sub>x</sub> - a<sub>x/z</sub>) | = | 0 | 
<br/>
| 0 | 0 | 0 | E<sub>y</sub>&middot;(c<sub>y</sub> - a<sub>y/z</sub>) | f<sub>y</sub>&middot;E<sub>x</sub> | f<sub>y</sub>&middot;E<sub>y</sub> | f<sub>y</sub>&middot;E<sub>z</sub> | E<sub>z</sub>&middot;(c<sub>y</sub> - a<sub>y/z</sub>) | E<sub>x</sub>&middot;(c<sub>y</sub> - a<sub>y/z</sub>) |  f<sub>y</sub>&middot;t<sub>y</sub> + t<sub>z</sub>&middot;(c<sub>y</sub> - a<sub>y/z</sub>) | = | 0 |
<br/>
<br/>
[r<sub>0,0</sub> | r<sub>0,1</sub> | r<sub>0,2</sub> | t<sub>x</sub> | r<sub>1,0</sub> | r<sub>1,1</sub> | r<sub>1,2</sub> | t<sub>y</sub> | r<sub>2,0</sub> | r<sub>2,1</sub> | r<sub>2,2</sub> | t<sub>z</sub>]
<br/>
...







<br/>
<br/>
<br/>


...




#### CHECKS:

p<sub>0,0</sub> = r<sub>0,0</sub>&middot;f<sub>x</sub> + r<sub>1,0</sub>&middot;s  + r<sub>2,0</sub>&middot;c<sub>x</sub>
<br/>
p<sub>0,1</sub> = r<sub>0,1</sub>&middot;f<sub>x</sub> + r<sub>1,1</sub>&middot;s  + r<sub>2,1</sub>&middot;c<sub>x</sub> 
<br/>
p<sub>0,2</sub> = r<sub>0,2</sub>&middot;f<sub>x</sub> + r<sub>1,2</sub>&middot;s  + r<sub>2,2</sub>&middot;c<sub>x</sub>
<br/>
p<sub>0,3</sub> = t<sub>x</sub>&middot;f<sub>x</sub> + t<sub>y</sub>&middot;s  + t<sub>z</sub>&middot;c<sub>x</sub>
<br/>
<br/>
p<sub>1,0</sub> = r<sub>1,0</sub>&middot;f<sub>y</sub> + r<sub>2,0</sub>&middot;c<sub>y</sub>
<br/>
p<sub>1,1</sub> = r<sub>1,1</sub>&middot;f<sub>y</sub> + r<sub>2,1</sub>&middot;c<sub>y</sub>
<br/>
p<sub>1,2</sub> = r<sub>1,2</sub>&middot;f<sub>y</sub> + r<sub>2,2</sub>&middot;c<sub>y</sub>
<br/>
p<sub>1,3</sub> = t<sub>y</sub>&middot;f<sub>y</sub> + t<sub>z</sub>&middot;c<sub>y</sub>
<br/>
<br/>
p<sub>2,0</sub> = r<sub>2,0</sub>
<br/>
p<sub>2,1</sub> = r<sub>2,1</sub>
<br/>
p<sub>2,2</sub> =  r<sub>2,2</sub>
<br/>
p<sub>2,3</sub> = t<sub>z</sub>
<br/>
<br/>

a<sub>x</sub> = f<sub>x</sub>&middot;r<sub>0,0</sub>&middot;E<sub>x</sub> + f<sub>x</sub> &middot;r<sub>0,1</sub>&middot;E<sub>y</sub> + f<sub>x</sub>&middot;r<sub>0,2</sub>&middot;E<sub>z</sub> + f<sub>x</sub>&middot;t<sub>x</sub> + s&middot;r<sub>1,0</sub>&middot;E<sub>x</sub> + s&middot;r<sub>1,1</sub>&middot;E<sub>y</sub> + s&middot;r<sub>1,2</sub>&middot;E<sub>z</sub> + s&middot;t<sub>y</sub> + c<sub>x</sub>&middot;r<sub>2,0</sub>&middot;E<sub>x</sub> + c<sub>x</sub>&middot;r<sub>2,1</sub>&middot;E<sub>y</sub> + c<sub>x</sub>&middot;r<sub>2,2</sub>&middot;E<sub>z</sub> + c<sub>x</sub>&middot;t<sub>z</sub>
<br/>
a<sub>x</sub> = p<sub>0,0</sub>&middot;E<sub>x</sub> + p<sub>0,1</sub>&middot;E<sub>y</sub> + p<sub>0,2</sub>&middot;E<sub>z</sub> + p<sub>0,3</sub>&middot;1
<br/>
a<sub>x</sub> = (f<sub>x</sub>&middot;r<sub>0,0</sub> + s&middot;r<sub>1,0</sub> +  c<sub>x</sub>&middot;r<sub>2,0</sub>)&middot;E<sub>x</sub>  + (s&middot;r<sub>1,1</sub> + c<sub>x</sub>&middot;r<sub>2,1</sub> + f<sub>x</sub> &middot;r<sub>0,1</sub>)&middot;E<sub>y</sub> + (f<sub>x</sub>&middot;r<sub>0,2</sub> + s&middot;r<sub>1,2</sub> + c<sub>x</sub>&middot;r<sub>2,2</sub>)&middot;E<sub>z</sub> + (f<sub>x</sub>&middot;t<sub>x</sub> + s&middot;t<sub>y</sub> + c<sub>x</sub>&middot;t<sub>z</sub>)
<br/>
<br/>
<br/>
a<sub>y</sub> = f<sub>y</sub>&middot;r<sub>1,0</sub>&middot;E<sub>x</sub> + f<sub>y</sub>&middot;r<sub>1,1</sub>&middot;E<sub>y</sub> + f<sub>y</sub>&middot;r<sub>1,2</sub>&middot;E<sub>z</sub> + f<sub>y</sub>&middot;t<sub>y</sub> + c<sub>y</sub>&middot;r<sub>2,0</sub>&middot;E<sub>x</sub> + c<sub>y</sub>&middot;r<sub>2,1</sub>&middot;E<sub>y</sub> + c<sub>y</sub>&middot;r<sub>2,2</sub>&middot;E<sub>z</sub> + c<sub>y</sub>&middot;t<sub>z</sub>
<br/>
a<sub>y</sub> = p<sub>1,0</sub>&middot;E<sub>x</sub> + p<sub>1,1</sub>&middot;E<sub>y</sub> + p<sub>1,2</sub>&middot;E<sub>z</sub> + p<sub>1,3</sub>&middot;1
<br/>
a<sub>y</sub> = (f<sub>y</sub>&middot;r<sub>1,0</sub> + c<sub>y</sub>&middot;r<sub>2,0</sub>)&middot;E<sub>x</sub> + (f<sub>y</sub>&middot;r<sub>1,1</sub> + c<sub>y</sub>&middot;r<sub>2,1</sub>)&middot;E<sub>y</sub> + (f<sub>y</sub>&middot;r<sub>1,2</sub> + c<sub>y</sub>&middot;r<sub>2,2</sub>)&middot;E<sub>z</sub> + (f<sub>y</sub>&middot;t<sub>y</sub> + c<sub>y</sub>&middot;t<sub>z</sub>)
<br/>

<br/>
a<sub>z</sub> = r<sub>2,0</sub>&middot;E<sub>x</sub> + r<sub>2,1</sub>&middot;E<sub>y</sub> + r<sub>2,2</sub>&middot;E<sub>z</sub> + t<sub>z</sub>
<br/>
a<sub>z</sub> = p<sub>2,0</sub>&middot;E<sub>x</sub> + p<sub>2,1</sub>&middot;E<sub>y</sub> + p<sub>2,2</sub>&middot;E<sub>z</sub> + p<sub>2,3</sub>&middot;1
<br/>
a<sub>z</sub> = r<sub>2,0</sub>&middot;E<sub>x</sub> + r<sub>2,1</sub>&middot;E<sub>y</sub> + r<sub>2,2</sub>&middot;E<sub>z</sub> + t<sub>z</sub>

<br/>
<br/>










...




projected:
x<sub>a</sub> = 



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
<br/>


