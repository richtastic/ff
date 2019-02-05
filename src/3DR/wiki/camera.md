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


