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
ALT:
base unknowns:
	By
	Cx
	Cy
base knowns / assumed:
	Ax = 0
	Ay = 0
	Bx = ?
each reading consists of:
	3 kwn:
		dA
		dB
		dC
	2 unk:
		Six
		SiY


##### localizing sample locations when source locations are known
	dA^2 = (Sx-Ax)^2 + (Sy-Ay)^2
	dB^2 = (Sx-Bx)^2 + (Sy-By)^2
	dC^2 = (Sx-Cx)^2 + (Sy-Cy)^2
	=> circular point minimize
	-> with error ?

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
dB^2 = (1-Sx)^2 + Sy^2 = 1 + Sx^2 - 2*Sx  +  Sy^2
dC^2 = (Cx-Sx)^2 + (Cy-Sy)^2 = Cx^2 + Sx^2 - 2*Cx*Sx  +  Cy^2 + Sy^2 - 2*Cy*Sy
...
sub all to get single equation with only f(pA,pB,pC,Cx,Cy) = 0
...

[2-1] :
dB^2 - dA^2 = 1 - 2*Sx

[3-1] :
dC^2 - dA^2 = Cx^2 - 2*Cx*Sx  +  Cy^2 - 2*Cy*Sy
...

dB^2 - dA^2 = 1 - 2*Sx
->
Sx = (1 + dA^2 - dB^2)/2

dC^2 - dA^2 - Cx^2 - Cy^2 = - 2*Cx*Sx - 2*Cy*Sy
->
(dA^2 - dC^2 + Cx^2 + Cy^2)/2 = Cx*Sx + Cy*Sy
->
(dA^2 - dC^2 + Cx^2 + Cy^2)/2 - Cy*Sy = Cx*Sx
->
Sx = ((dA^2 - dC^2 + Cx^2 + Cy^2)/2 - Cy*Sy)/Cx							[div by zero]

==> Sx = Sx ...
(1 + dA^2 - dB^2)/2 = ((dA^2 - dC^2 + Cx^2 + Cy^2)/2 - Cy*Sy)/Cx
cX*(1 + dA^2 - dB^2)/2 = (dA^2 - dC^2 + Cx^2 + Cy^2)/2 - Cy*Sy
=>
cX*(1 + dA^2 - dB^2)/2 - (dA^2 - dC^2 + Cx^2 + Cy^2)/2 = -Cy*Sy
Sy = ((dA^2 - dC^2 + Cx^2 + Cy^2)/2 - Cx*(1 + dA^2 - dB^2)/2)/Cy		[div by zero]

==> INTO 1:
dA^2 = Sx^2 + Sy^2

A: Sx^2 = [ (1 + dA^2 - dB^2)/2 ]^2
->
	(1 + dA^2 - dB^2)^2 / 4
	(1 + dA^2 - dB^2) * (1 + dA^2 - dB^2) / 4
		->
		1 + dA^2 - dB^2
		dA^2 + dA^2*dA^2 - dA^2*dB^2
		-dB^2 - dA^2*dB^2 + dB^2*dB^2
		->
		1 + dA^2 - dB^2 + dA^2 + dA^2*dA^2 - dA^2*dB^2 - dB^2 - dA^2*dB^2 + dB^2*dB^2
		=>
		1 + 2*dA^2 - dB^2 + dA^2*dA^2 - 2*dA^2*dB^2 - dB^2 + dB^2*dB^2
		/ 4





B: Sy^2 = [ ((dA^2 - dC^2 + Cx^2 + Cy^2) - Cx*(1 + dA^2 - dB^2))/(2*Cy) ]^2
->
	(dA^2 - dC^2 + Cx^2 + Cy^2 - Cx - Cx*dA^2 + Cx*dB^2) / (2*Cy) ]^2
	(dA^2 - dC^2 + Cx^2 + Cy^2 - Cx - Cx*dA^2 + Cx*dB^2)^2 / (4*Cy^2)
	->
	(dA^2 - dC^2 + Cx^2 + Cy^2 - Cx - Cx*dA^2 + Cx*dB^2) * (dA^2 - dC^2 + Cx^2 + Cy^2 - Cx - Cx*dA^2 + Cx*dB^2) / (4*Cy^2)
		->
		dA^2*dA^2 - dA^2*dC^2 + dA^2*Cx^2 + dA^2*Cy^2 - dA^2*Cx - dA^2*dA^2*Cx + dA^2*dB^2*Cx
		-dA^2*dC^2 + dC^2*dC^2 - dC^2*Cx^2 - dC^2*Cy^2 + dC^2*Cx + dA^2*dC^2*Cx - dB^2*dC^2*Cx
		dA^2*Cx^2 - dC^2*Cx^2 + Cx^2*Cx^2 + Cx^2*Cy^2 - Cx*Cx^2 - dA^2*Cx*Cx^2 + dB^2*Cx*Cx^2
		dA^2*Cy^2 - dC^2*Cy^2 + Cx^2*Cy^2 + Cy^2*Cy^2 - Cx*Cy^2 - dA^2*Cx*Cy^2 + dB^2*Cx*Cy^2
		-dA^2*Cx + dC^2*Cx - Cx*Cx^2 - Cx*Cy^2 + Cx^2 + dA^2*Cx^2 - dB^2*Cx^2
		-Cx*dA^2*dA^2 + Cx*dA^2*dC^2 - Cx*dA^2*Cx^2 - Cx*dA^2*Cy^2 + dA^2*Cx^2 + dA^2*Cx^2*dA^2 - dA^2*Cx^2*dB^2
		Cx*dB^2*dA^2 - Cx*dB^2*dC^2 + Cx*dB^2*Cx^2 + Cx*dB^2*Cy^2 - dB^2*Cx^2 - dB^2*Cx^2*dA^2 + dB^2*Cx^2*dB^2


		=


		dA^2*dA^2 - 2*dA^2*dC^2 + 3*dA^2*Cx^2 + dA^2*Cy^2 - 2*dA^2*Cx - dA^2*dA^2*Cx + dA^2*dB^2*Cx + dC^2*dC^2 - 2*dC^2*Cx^2 - 2*dC^2*Cy^2 + 2*dC^2*Cx + dA^2*dC^2*Cx - dB^2*dC^2*Cx + dA^2*Cx^2 + Cx^2*Cx^2
		+ 2*Cx^2*Cy^2 - 2*Cx*Cx^2 + Cy^2*Cy^2 - dA^2*Cx*Cx^2 + dB^2*Cx*Cx^2 + dA^2*Cy^2 - 2*Cx*Cy^2 - dA^2*Cx*Cy^2 + dB^2*Cx*Cy^2 + Cx^2 - 2*dB^2*Cx^2
		- Cx*dA^2*dA^2 + Cx*dA^2*dC^2 - Cx*dA^2*Cx^2 - Cx*dA^2*Cy^2 + dA^2*Cx^2*dA^2 - dA^2*Cx^2*dB^2
		+ Cx*dB^2*dA^2 - Cx*dB^2*dC^2 + Cx*dB^2*Cx^2 + Cx*dB^2*Cy^2 - dB^2*Cx^2*dA^2 + dB^2*Cx^2*dB^2

have to be separable ...



..........



f(dA,dB,dC,Cx,Cy) = 0

... assume dA^4 >> dA^2 => only solve for highest powers ?


...






##### CAN BX DISTANCE ASSUMED TO BE 1 ???
	=> given signal strength vs given raw distances ?
	...
	=> scaling?

	p / d = s
	if d or p are in different units, equation becomes:
	cp * (1/cd^2) * (p/d) = s
	just a constant multiplier







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

errorI = wI * (dI - rI)^2			# wi = weighted error
error = errorA + errorB + errorC + ...


...
**


##### sphere - intersect of distances:
(Ax-Sx)^2 + (Ay-Sy)^2 + (Az-Sz)^2 = dA^2	= Ax^2 + Sx^2 - 2*Ax*Sx + Ay^2 + Sy^2 - 2*Ay*Sy + Az^2 + Sz^2 - 2*Az*Sz - dA^2 = 0	[1]
(Bx-Sx)^2 + (By-Sy)^2 + (Az-Sz)^2 = dA^2	= Ax^2 + Sx^2 - 2*Ax*Sx + Ay^2 + Sy^2 - 2*Ay*Sy + Az^2 + Sz^2 - 2*Az*Sz - dA^2 = 0	[1]
(Cx-Sx)^2 + (Cy-Sy)^2 + (Az-Sz)^2 = dA^2	= Ax^2 + Sx^2 - 2*Ax*Sx + Ay^2 + Sy^2 - 2*Ay*Sy + Az^2 + Sz^2 - 2*Az*Sz - dA^2 = 0	[1]
[1-2]:
(Ax^2 - Bx^2) + (Ay^2 - By^2) + (Az^2 - Bz^2) + (2*Bx*Sx - 2*Ax*Sx) + (2*By*Sy - 2*Ay*Sy) + (2*Bz*Sz - 2*Az*Sz) + (dB^2 - dA^2) = 0
[1-3]:
(Ax^2 - Cx^2) + (Ay^2 - Cy^2) + (Az^2 - Cz^2) + (2*Cx*Sx - 2*Ax*Sx) + (2*Cy*Sy - 2*Ay*Sy) + (2*Cz*Sz - 2*Az*Sz) + (dC^2 - dA^2) = 0
[2-3]:
(Bx^2 - Cx^2) + (By^2 - Cy^2) + (Bz^2 - Cz^2) + (2*Cx*Sx - 2*Bx*Sx) + (2*Cy*Sy - 2*By*Sy) + (2*Cz*Sz - 2*Bz*Sz) + (dC^2 - dB^2) = 0

[A-B]:
Ax^2 - Bx^2 + Ay^2 - By^2 + Az^2 - Bz^2 + 2*Sx*(Bx - Ax) + 2*Sy*(By - Ay) + 2*Sz*(Bz - Az) + dB^2 - dA^2 = 0
Ax^2 - Cx^2 + Ay^2 - Cy^2 + Az^2 - Cz^2 + 2*Sx*(Cx - Ax) + 2*Sy*(Cy - Ay) + 2*Sz*(Cz - Az) + dC^2 - dA^2 = 0
Bx^2 - Cx^2 + By^2 - Cy^2 + Bz^2 - Cz^2 + 2*Sx*(Cx - Bx) + 2*Sy*(Cy - By) + 2*Sz*(Cz - Bz) + dC^2 - dB^2 = 0

...





#### BLUETOOTH / BEACONS
iBeacon:
| prefix - 9 bytes | UUID - 16 bytes | Major - 2 bytes | Minor - 2 bytes | TxPower - 1 Byte |
prefix:
| ad flags - 3 | adv head - 2 | company id - 2 | ibeacon type - 1 | ibeacon length - 1 |



e2c56db5 dffb48d2 b060d0f5 a71096e0 00000000 00


REFERENCE RSSI VALUE AT 1 M ????

https://www.aislelabs.com/reports/beacon-guide/




#### RSSI & LOG
rssi = recieved signal strength indication in
??? dBm = absolute power, in mW
???
Math.pow(rssi * 1.0 / transmission, 10) =


sensors-18-02820%20(1).pdf:
RSSI = 10 * n * lg(d/d0) + A
d0 = 1 (reference)
d = distance between transmitter & receiver
n = path loss parameter : more loss = higher n;
A = RSSI at 1 m


=> inverse ? =>
d = 10^((rssi/(10*n)) - A)



RSSI[dbm] = −(10n log10(d) − A)




rssi = - K * log(D) + A
D = 10^((A - RSSI)/K)

eg:
rssi = -47
d =




RSSI | D: (m)	log(-rssi)		10^(rssi/10)
-25  | 0.01			1.39			0.0031
-27  | 0.02			1.43			0.0019
-44  | 0.13			1.64			0.0000398
-51  | 0.29			1.70			0.00000794
-55  | 0.52			1.74			0.0000031


RSSI - 95 = signal strength in dB

Math.pow(-25/-95,10)
0.0000015928102208281441

Math.pow(-55/-95,10)
0.004230491648658657


https://iotandelectronics.wordpress.com/2016/10/07/how-to-calculate-distance-from-the-rssi-value-of-the-ble-beacon/
N = 2
distance = 10^((power - rssi) / (10*N))


https://developer.radiusnetworks.com/2014/12/04/fundamentals-of-beacon-ranging.html


https://yalantis.com/blog/7-things-to-learn-about-ibeacon-and-beacons/



core location & notifications
https://www.raywenderlich.com/632-ibeacon-tutorial-with-ios-and-swift



power:
https://developer.apple.com/documentation/corelocation/clbeaconregion/1621494-peripheraldata
https://medium.com/mindorks/code-9-everything-about-beacons-bda53b961ac3
https://scribles.net/creating-a-simple-ble-scanner-on-iphone/
https://www.sciencedirect.com/topics/computer-science/received-signal-strength

LOOKUP TABLE:
https://support.kontakt.io/hc/en-gb/articles/201621521-Transmission-power-Range-and-RSSI


with shifted curve???::


##### BLUETOOTH:


http://download.ni.com/evaluation/rf/intro_to_bluetooth_test.pdf




...



##### steps in calibrating a world
- choose some easy set of coordinates
- walk around and take readings for coordinate
	- BEACON_I - KNOWN LOCATION, ESTIMATED DISTANCE
		=> triangulate with 3+ (dozens) of samples

- RSSI ???? VS LOCATION ???


- known:
	Sx
	Sy
- unknown:
	Bp
	Bx
	By
- data:
	+Sx
	+Sy
	+Sp
- equations:
	Sp = Bp/dB^2
		=>
	dB^2 = Bp/Sp
	(Bx-Sx)^2 + (By-Sy)^2 = Bp/Sp
	Bx^2 + Sx^2 - 2*Bx*Sx + By^2 + Sy^2 - 2*By*Sy - Bp/Sp = 0

	| Bx | Bx^2 | By | By^2 | Bp | 1 |

	WITH 2 SAMPLES:
	  Bx^2 + S1x^2 - 2*Bx*S1x + By^2 + S1y^2 - 2*By*S1y - Bp/S1p = 0
	- Bx^2 + S2x^2 - 2*Bx*S2x + By^2 + S2y^2 - 2*By*S2y - Bp/S2p = 0
	----------------------------------------------------------------------
	     0 + S1x^2 - S2x^2 - 2*Bx*S1x + 2*Bx*S2x + 0 + S1y^2 - S2y^2 - 2*By*S1y + 2*By*S2y - Bp/S1p + Bp/S2p = 0
	| Bx | By | Bp | 1 |
	Bx: - 2*S1x + 2*S2x
	By: - 2*S1y + 2*S2y
	Bp: - 1/S1p + 1/S2p
	c:  S1x^2 - S2x^2 + S1y^2 - S2y^2
	=> optimize nonlinearly:
		=> minimize error: distances?
		=> minimize error: Sp_estimate - Sp_i


COULD 2 PAIRS OF SAMPLES BE USED TO CALIBRATE AUTOMATICALLY ?
AGAIN:

##### 3 - equations:
dA^2 = pA/SiA
dB^2 = pB/SiB
dC^2 = pC/SiC
dA^2 = Sx^2 + Sy^2
dB^2 = (1-Sx)^2 + Sy^2 = 1 + Sx^2 - 2*Sx  +  Sy^2
dC^2 = (Cx-Sx)^2 + (Cy-Sy)^2 = Cx^2 + Sx^2 - 2*Cx*Sx  +  Cy^2 + Sy^2 - 2*Cy*Sy

[2-1] :
dB^2 - dA^2 = 1 - 2*Sx

[3-1] :
dC^2 - dA^2 = Cx^2 - 2*Cx*Sx  +  Cy^2 - 2*Cy*Sy
...


...
