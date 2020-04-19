# CAMERAS:




extrinsic matrix: describes how to rotate world => camera coordinates

|   R   T |
| 0 0 0 1 |


camera center: - R' * T


extrinsic inverse matrix:
|   Rc  C |
| 0 0 0 1 |

R = Rc'
T = -Rc'*C

Rc = R'
C = -R'*T ??





Look-at camera:
L = |p-c|
s = |L x u|
u' = |s x L|

R = | s; u'; -L|






---
m = # images [P]
n = # of fixed 3D points [X]

x<sub>i,j</sub> = P<sub>i</sub>&middot;X<sub>j</sub>

11 = DoF in P<sub>i</sub>
3 = DoF in X
15 = 4x4 projective matrix 

2&middot;m&middot;n = 11&middot;m + 3&middot;n - 15



---

M = K &middot; [R | t]
=> RQ factorization (not QR)
R (right diagonal) is K
Q (orthogonal basis) is R
t is inv(K) &middot; M(last column)
+ post process to make valid


calibrate by vanishing point


P = K[R| t]
  = K[R| -Rc]
  = [M| -Mc]
&Rarr; M = K&middot;R
&Rarr; RQ decomposition


---


camera center: c @ P&middot;c = 0
&Rarr; SVD(P)


---




## Ray Thru a Pixel:
X = 3D point
x = pixel in camera image, projected from X
K = camera intrinsic matrix
P = camera extrinsic matrix [P<sup>-1</sup> = camera absolute matrix]

x ~ K &middot; P &middot; X

P<sup>-1</sup> &middot; K<sup>-1</sup>  &middot; x ~ X
ray ~ X





```
ORIGIN:
| r1 r2 r3  t1 | | 0 |   | t1 |
| r4 r5 r6  t2 | | 0 | = | t2 |
| r7 r8 r9  t3 | | 0 |   | t3 |
|  0  0  0   1 | | 1 | = |  1 |

Z DIR:
| r1 r2 r3  t1 | | 0 |   | t1 + r3 |        | r3 |
| r4 r5 r6  t2 | | 0 | = | t2 + r6 | => Z = | r6 |
| r7 r8 r9  t3 | | 1 |   | t3 + r9 |        | r9 |
|  0  0  0   1 | | 1 | = |  1 |

```



GENERAL CASE OF CAMER TRANSFORM:


P = [R | t]


E = [t]<sub>&mult;</sub> &middot; R

E = S &middot; R

E = U &middot; diag(1,1,0) &middot; V<sup>T</sup>


S = U &middot; Z &middot; U<sup>t</sup>

R<sub>1</sub> = U &middot; W &middot; V<sup>t</sup>
R<sub>2</sub> = U &middot; W<sup>T</sup> &middot; V<sup>t</sup>

W = [0 -1 0  ;  1 0 0  ;  0 0 1]
Z = [0  1 0  ;  -1 0 0  ;  0 0 0]




SPECIAL CASES OF CAMERA TRANSFORM:


- pure translation:

P = [I | t]


???


- pure rotation:

P = [R | 0]









































































































































































































































....
