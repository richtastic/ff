

### Quadratic (O2) bezier:
<br/>
q = A(1-t)<sup>2</sup> + 2&middot;B&middot;t&middot;(1-t) + C&middot;t<sup>2</sup>
<br/>
q = A(1 - 2t + t<sup>2</sup>) + B(2t - 2t<sup>2</sup>) + C(t<sup>2</sup>)
<br/>
<br/>
q' = A(-2 + 2t) + B(2 - 4t) + C(2t)
<br/>
q' = -2&middot;A + 2&middot;A&middot;t + 2&middot;B - 4&middot;B&middot;t + 2&middot;C&middot;t
<br/>
q' = -2&middot;A + 2&middot;B + t(2&middot;A - 4&middot;B + 2&middot;C)
<br/>
<br/>
q'' = 2&middot;A - 4&middot;B + 2&middot;C
<br/>
<br/>
@ max/min:
<br/>
-t(2&middot;A - 4&middot;B + 2&middot;C) = -2&middot;A + 2&middot;B
<br/>
t = (2&middot;A - 2&middot;B)/(2&middot;A - 4&middot;B + 2&middot;C)
<br/>
t = (A - B)/(A - 2&middot;B + C)

<br/>
<br/>
<br/>





Cubic (O3) Bezier:
<br/>
q = A&middot;(1-t)<sup>3</sup> + 3&middot;B&middot;t&middot;(1-t)<sup>2</sup> + 3&middot;C&middot;t<sup>2</sup>&middot;(1-t) + D&middot;t<sup>3</sup>
<br/>
q = A&middot;(1+t<sup>2</sup>-2t)(1-t) + 3&middot;B&middot;t&middot;(1-2t+t<sup>2</sup>) + 3&middot;C&middot;(t<sup>2</sup>-t<sup>3</sup>) + D&middot;t<sup>3</sup>
<br/>
q = A&middot;(1-t + t<sup>2</sup>-t<sup>3</sup> + -2t+2t<sup>2</sup>) + 3&middot;B&middot;(t - 2t<sup>2</sup> + t<sup>3</sup>) + 3&middot;C&middot;(t<sup>2</sup>-t<sup>3</sup>) + D&middot;t<sup>3</sup>
<br/>
q = A&middot;(1 - 3t + 3t<sup>2</sup> - t<sup>3</sup>) + 3&middot;B&middot;(t - 2t<sup>2</sup> + t<sup>3</sup>) + 3&middot;C&middot;(t<sup>2</sup>-t<sup>3</sup>) + D&middot;t<sup>3</sup>
<br/>
<br/>

q' = A&middot;(-3 + 6t - 3t<sup>2</sup>) + 3&middot;B&middot;(1 - 4t + 3t<sup>2</sup>) + 3&middot;C&middot;(2t - 3t<sup>2</sup>) + 3&middot;D&middot;t<sup>2</sup>
<br/>
q' = -3&middot;A + 6&middot;A&middot;t - 3&middot;A&middot;t<sup>2</sup> + 3&middot;B - 12&middot;B&middot;t + 9&middot;B&middot;t<sup>2</sup> + 6&middot;C&middot;t - 9&middot;C&middot;t<sup>2</sup> + 3&middot;D&middot;t<sup>2</sup>
<br/>
q' = (-3&middot;A + 3&middot;B) + (6&middot;A - 12&middot;B + 6&middot;C)t + (-3&middot;A + 9&middot;B - 9&middot;C + 3&middot;D)t<sup>2</sup>
<br/>
<br/>
q'' = 6(A - 2&middot;B + C) + 6(-A + 3&middot;B - 3&middot;C + D)t
<br/>
<br/>
@ max/min: 0
<br/>
0 = (B - A) + (2&middot;A&middot; - 4&middot;B&middot; + 2&middot;C)t + (-A&middot; + 3&middot;B - 3&middot;C&middot; + D)t<sup>2</sup>
<br/>
a := -A + 3&middot;B - 3&middot;C + D
<br/>
b := 2&middot;A - 4&middot;B + 2&middot;C
<br/>
c := B - A
<br/>
<br/>
t = (-b &plusmn; sqrt(b<sup>2</sup> - 4ac) )/(2a)
<br/>
<br/>

@crossing:
<br/>
0 = (A - 2&middot;B + C) + (-A + 3&middot;B - 3&middot;C + D)t
<br/>
t = (-A + 2&middot;B - C)/(-A + 3&middot;B - 3&middot;C + D)
<br/>


<br/>



except that this doesn't always work :/






<br/>


<br/>


<br/>







