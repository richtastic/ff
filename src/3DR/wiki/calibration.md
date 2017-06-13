### Manual Calibration


find K


MARKER /  TRACKING: 
http://studierstube.icg.tugraz.at/thesis/marker_detection.pdf
http://drops.dagstuhl.de/opus/volltexte/2011/3095/pdf/6.pdf

- detect grid on the screen
    - find corner points
    - detect squares / rects
    - estimate lines
    - hough transform
    - 

- orientate grid & find known points
- map known points into 







calibrateCameraMatrix


ALG:
    - find blobs (black squares)
    - find corners
    - find corners of blobs (based on nearest 4? points) => squares
    - join neighbor square corners => connected grid => (use local topology to drop extra connections ?)
        - items with 4 connections are interrior
        - others are exterrior
            - edges = 2 connections
            - corners = 1 connection
    - opposite of 4 corners is exterrior box
        - choose one corner to be 0 | 0
            - closest to R | G | B squares ?
    - iterate thru points







http://inside.mines.edu/~whoff/courses/EENG512/lectures/23-CameraCalibration.pdf
inverse radial distorition:
http://peterabeles.com/blog/?p=73


lense distortion:

[xd] = [x] * [1 + k1*r^2 + k2*r^4 + k5*r^6]
[yd]   [y]

+ dx


dx = [2*k3*x*y + k4*(r^2 + 2*x^2)]
     [k3*(r^2 + 2*y^2) + 2*k4*x*y]


[xp] = [f1*xd + cc1]
[yp]   [f2*yd + cc2]

cc = radial distortion center ?


9 params:
f1,f2,cc1,cc2,k1,k2,k3,k4,k5



INITIALIZE 9 params
ITERATE VIA COST FUNCTION MINIMIZING





radial (negative: pin-cushion) (positive: outward)

x_distorted = x(1 + k1*r^2 + k2*r^4 + k3*r^6)
y_distorted = y(1 + k1*r^2 + k2*r^4 + k3*r^6)
r^2 = x^2 + y^2

tangental distortion:
x_distorted = x + (2*p1*x*y + p2*(r^2 + 2*x^2))
y_distorted = y + (p1(r^2 + 2*y^2) + 2*p2*x*y)

http://swardtoolbox.github.io/ref/Zhang.pdf
https://www.microsoft.com/en-us/research/wp-content/uploads/2016/11/zhan99.pdf


https://pdfs.semanticscholar.org/6e20/c43a0077d6580975625c44411e8c3fcf3ffe.pdf


cx ? cy ?

[x_clean,y_clean,~1] = K*P*X

r_clean^2 = x_clean^2 + y_clean^2

x_distorted = x_clean + k1*x_clean*r_distorted^2 + k2*x_clean*r_distorted^4 + k3*x_clean*r_distorted^6
            + 2*p1*x_clean*y_clean + p2*(r_clean^2 + 2*x_clean^2)
y_distorted = y_clean + k1*y_clean*r_distorted^2 + k2*y_clean*r_distorted^4 + k3*y_clean*r_distorted^6
            + 2*p2*x_clean*y_clean + p1*(r_clean^2 + 2*y_clean^2)


[coeff] * [variables]' = [0]


k1: (x_c*r_d^2 + y_c*r_d^2)
k2: (x_c*r_d^4 + y_c*r_d^4)
k3: (x_c*r_d^6 + y_c*r_d^6)
p1: (2*x_c*y_c + (r_c^2 + 2*y_c^2))
p2: (r_c^2 + 2*x_c^2) + 2*x_c*y_c)
1:  (x_c - x_d + y_c - y_d)

[ (x_c*r_d^2 + y_c*r_d^2)  (x_c*r_d^4 + y_c*r_d^4)  (x_c*r_d^6 + y_c*r_d^6)  (2*x_c*y_c + (r_c^2 + 2*y_c^2)) ((r_c^2 + 2*x_c^2) + 2*x_c*y_c) (x_c - x_d) ] * [k1  k2  k3  p1  p2  1]' = [0] 





























