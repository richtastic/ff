## Localization
- triangulation
- trilateration



#### 2 sources:
when trying to solve without knowing power or location:
	=> solution exactly satisfies all equations
	=> not enough equations to produce an overdetermined System
		=> no error / iterate solver

base unknowns:
	pA
	pB
base knowns / assumed:
	Ax = 0
	Ay = 0
	Bx = 1
	By = 0
each reading consists of:
	2 kwn:
		SiA
		SiB
	2 unk:
		Six
		SiY
	2 eqn:
		SiA = pA/diA^2
		SiB = pB/diB^2


		error will always be exactly 0 ?







#### 3 sources:
base unknowns:
	pA
	pB
	pC
	Cx
	Cy
base knowns / assumed:
	Ax = 0
	Ay = 0
	Bx = 1
	By = 0
each reading consists of:
	3 kwn:
		SiA
		SiB
		SiC
	2 unk:
		Six
		SiY
	3 eqn:
		SiA = pA/diA^2
		SiB = pB/diB^2
		SiC = pC/diC^2



##### initial linear estimate:
	?
		=> how does the optimizing behave with different incorrect initial settings?

##### nonlinear error minimizing:
input: Cx, Cy, PA, PB, PC

	estimate distances:
		diA^2 = pA/SiA
		diB^2 = pB/SiB
		diC^2 = pC/SiC

	calculate optimum locations: closest intersect of 3 radiuses
		Six = ...
		Siy = ...

	calculate distances:
		diA^2 = (Ax-Six)^2 + (Ay-Siy)^2
		diB^2 = (Bx-Six)^2 + (By-Siy)^2
		diC^2 = (Cx-Six)^2 + (Cy-Siy)^2


	calculate error:
		error_i_I = SiA - (PA/diA^2)
		error_i = error_i_A + error_i_B + error_i_C


##### 3 - equations:
dA^2 = pA/SiA
dB^2 = pB/SiB
dC^2 = pC/SiC
dA^2 = Sx^2 + Sy^2
dB^2 = (1-Sx)^2 + Sy^2 =
dC^2 = (Cx-Sx)^2 + (Cy-Sy)^2 =
...
sub all to get single equation with only f(pA,pB,pC,Cx,Cy) = 0
...









#### circle - intersect with inexact distances:
known:
Ax,Ay, Bx,By, Cx,Cy, dA,dB,dC
=> best solution point: Sx, Sy

(Ax-Sx)^2 + (Ay-Sy)^2 = dA^2	= Ax^2 + Sx^2 - 2*Ax*Sx + Ay^2 + Sy^2 - 2*Ay*Sy - dA^2 = 0	[1]
(Bx-Sx)^2 + (By-Sy)^2 = dB^2	= Bx^2 + Sx^2 - 2*Bx*Sx + By^2 + Sy^2 - 2*By*Sy - dB^2 = 0	[2]
(Cx-Sx)^2 + (Cy-Sy)^2 = dC^2	= Cx^2 + Sx^2 - 2*Cx*Sx + Cy^2 + Sy^2 - 2*Cy*Sy - dC^2 = 0	[3]

[1-2]:
(Ax^2 - Bx^2) + (2*Bx*Sx - 2*Ax*Sx) + (Ay^2 - By^2) + (2*By*Sy - 2*Ay*Sy) + (dB^2 - dA^2) = 0
[1-3]:
(Ax^2 - Cx^2) + (2*Cx*Sx - 2*Ax*Sx) + (Ay^2 - Cy^2) + (2*Cy*Sy - 2*Ay*Sy) + (dC^2 - dA^2) = 0

[A-B]:
2*(Bx - Ax)*Sx + 2*(By - Ay)*Sy  +  Ax^2 + Ay^2 - Bx^2 - By^2 + dB^2 - dA^2  = 0



Sx = ?
Sy = ?

nonlinear:
improve Sx & Sy to reduce error:

rI = [ (Sx-Ix)^2 + (Sx-Ix)^2 ]^1/2

errorI = (dI - rI)^2
error = errorA + errorB + errorC


...
