# fourier





# imaginary exponents


A<sup>i</sup> = x + i&middot;y
<br/>
A<sup>-i</sup> = x - i&middot;y
<br/>
<br/>
A<sup>i</sup>&middot;A<sup>-i</sup> = A<sup>i - i</sup> = A<sup>0</sup> = 1
<br/>
ALSO:
<br/>
A<sup>i</sup>&middot;A<sup>-i</sup> = (x + i&middot;y)&middot;(x - i&middot;y) = x<sup>2</sup> + y<sup>2</sup>
<br/>
&there4;
<br/>
|x<sup>2</sup> + y<sup>2</sup>| = 1


...
A<sup>x + i&middot;y</sup>
<br/>
exp( ln(A<sup>x + i&middot;y</sup>) )
<br/>
exp( ln(A<sup>x</sup>&middot;A<sup>i&middot;y</sup>) )
<br/>
exp( ln(A<sup>x</sup>) + ln(A<sup>i&middot;y</sup>) )
<br/>
A<sup>x</sup>&middot;exp(ln(A<sup>i&middot;y</sup>) )
<br/>
A<sup>x</sup>&middot;exp(i&middot;ln(A<sup>y</sup>) )
<br/>
A<sup>x</sup>&middot;exp(i&middot;y&middot;ln(A) )
<br/>
A<sup>x</sup>&middot;e<sup>i&middot;y&middot;ln(A)</sup>
<br/>
IF A&equiv;e &Rarr; e<sup>x + i&middot;y</sup> = e<sup>x</sup>&middot;e<sup>i&middot;y&middot;ln(e)</sup> = e<sup>x</sup>&middot;e<sup>i&middot;y</sup>
<br/>




rotations of exponential


<br/>
e<sup>i&middot;&theta;</sup> = cos(&theta;) + i&middot;sin(&theta;)
<br/>
i&middot;&theta; = ln( cos(&theta;) + i&middot;sin(&theta;) )
<br/>


<br/>
Series Expansion:
<br/>
e<sup>x</sup> = &Sigma;<sub>n &isin; [0,&infin;]</sub> (i&middot;x)<sup>n</sup> / n!
<br/>
<br/>
cos(x) = &Sigma;<sub>n &isin; [0,&infin;]</sub> (-1)<sup>n</sup>&middot;x<sup>2&middot;n</sup> / (2&middot;n)! [even]
<br/>
<br/>
sin(x) = &Sigma;<sub>n &isin; [1,&infin;]</sub> (-1)<sup>n-1</sup>&middot;x<sup>2&middot;n-1</sup> / (2&middot;n-1)! [odd]
<br/>

....




<sup>i</sup>
theory:
https://mathworld.wolfram.com/EulerFormula.html
https://betterexplained.com/articles/imaginary-multiplication-exponents/
https://betterexplained.com/articles/intuitive-understanding-of-eulers-formula/
https://betterexplained.com/articles/an-interactive-guide-to-the-fourier-transform/
https://math.stackexchange.com/questions/225896/why-eulers-formula-is-true


diagarams:
https://chem.libretexts.org/Bookshelves/Physical_and_Theoretical_Chemistry_Textbook_Maps/Map%3A_Physical_Chemistry_(McQuarrie_and_Simon)/32%3A_Math_Chapters/32.10%3A_Fourier_Analysis/32.10.01%3A_Fourier_Analysis_in_Matlab
https://www.nti-audio.com/en/support/know-how/fast-fourier-transform-fft


---

...
https://www.princeton.edu/~cuff/ele201/kulkarni_text/frequency.pdf
https://towardsdatascience.com/fourier-transformation-and-its-mathematics-fff54a6f6659



# 1D


Fourier Transform / Analysis: convert signal (time) into component frequencies ()

Fourier Analysis: ^ find principle frequency components of signal

Fourier Series: frequency/phase representation

Fourier Synthesis: reconstruct signal from frequency/phase


http://www.ee.cityu.edu.hk/~hcso/ee3202_7.pdf
https://www.robots.ox.ac.uk/~sjrob/Teaching/SP/l7.pdf


code:
https://www.nayuki.io/page/how-to-implement-the-discrete-fourier-transform
https://www.tutorialspoint.com/cplusplus-program-to-compute-discrete-fourier-transform-using-naive-approach
https://followtutorials.com/2013/05/calculation-of-discrete-fourier-transformdft-in-c-c-using-naive-and-fast-fourier-transform-fft-method.html

usage:
https://www.mathworks.com/help/signal/ug/discrete-fourier-transform.html
https://www.bogotobogo.com/Matlab/Matlab_Tutorial_DFT_Discrete_Fourier_Transform.php




Fourier Series




<br/>
X<sub>k</sub> &equiv; frequency component k, of form: A&middot;e<sup>-j&middot;&phi;</sup> (amplitude & phase)
<br/>
x<sub>n</sub> &equiv; time signal, of form: A (real amplitude only)
<br/>
N &equiv; total number of time samples of x<sub>n</sub> (and frequency components X<sub>k</sub>)
<br/>
n &equiv; time component index &isin; [0,N-1]
<br/>
k &equiv; frequency component index &isin; [0,N-1]
<br/>
<br/>
<br/>


X<sub>n</sub> &Rarr; X<sub>k</sub>
<br/>
X<sub>k</sub> = &Sigma;<sub>n &isin; [0,N-1]</sub> x<sub>n</sub> &middot; e<sup>-j&middot;2&middot;&pi;&middot;k&middot;n/N</sup>
<br/>
<br/>


X<sub>k</sub> &Rarr; X<sub>n</sub>
<br/>
X<sub>n</sub> = (1/N) &middot; &Sigma;<sub>k &isin; [0,N-1]</sub> X<sub>k</sub> &middot; e<sup>j&middot;2&middot;&pi;&middot;n&middot;k/N</sup>
<br/>
* only real component is used (not abs, not mag)
<br/>
<br/>


<br/>






https://www.ritchievink.com/blog/2017/04/23/understanding-the-fourier-transform-by-example/








frequencies are multiples of base frequency 1/T<sub>0</sub> ; T<sub>0</sub> is length of total signal




# 2D

<br/>
f(x,y) = X<sub>n,m</sub> (time domain)
<br/>
F(k,l) = F(u,v) = X<sub>u,v</sub> (freq domain)
<br/>

<br/>
N = horizontal pixel count
<br/>
M = vertical pixel count
<br/>

<br/>
X<sub>n,m</sub> &Rarr; X<sub>u,v</sub>
<br/>
X<sub>u,v</sub> = &Sigma;<sub>m &isin; [0,M-1]</sub> &Sigma;<sub>n &isin; [0,N-1]</sub> X<sub>n,m</sub> &middot; e<sup>-j&middot;2&middot;&pi;&middot;(k&middot;n/N + k&middot;m/M)</sup>
<br/>
<br/>




<br/>
X<sub>u,v</sub> &Rarr; X<sub>n,m</sub>
<br/>
X<sub>n,m</sub> = 1/(N*M) &middot; &Sigma;<sub>v &isin; [0,M-1]</sub> &Sigma;<sub>u &isin; [0,N-1]</sub> X<sub>u,v</sub> &middot; e<sup>-j&middot;2&middot;&pi;&middot;(n&middot;k/N + m&middot;l/M)</sup>
<br/>
<br/>











- source image


- magnitude image
- phase image
- 


- 2D image fourier transform


https://www.cs.unm.edu/~brayer/vision/fourier.html
https://homepages.inf.ed.ac.uk/rbf/HIPR2/fourier.htm
https://www.sciencedirect.com/topics/engineering/discrete-fourier-series



FORWARD
fft2d

REVERSE/INVERSE
ifft2d


MN:
https://matlabgeeks.com/tips-tutorials/how-to-do-a-2-d-fourier-transform-in-matlab/

http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.712.2180&rep=rep1&type=pdf







TUT:
http://apps.usd.edu/coglab/schieber/psyc707/pdf/2D-FFT.pdf

https://stackoverflow.com/questions/49922458/matlab-octave-2d-discrete-fourier-transform





https://www.mathworks.com/matlabcentral/answers/41464-fft-of-an-image
I=imread('imagename.pbm');
F=fft2(double(I));
S=fftshift(F);
L-log2(S);
A=abs(L);
imagesc(A)

https://www.mathworks.com/matlabcentral/answers/435932-image-processing-2d-fft



https://www.mathworks.com/help/matlab/ref/fft2.html



https://octave.org/doc/v4.2.1/Signal-Processing.html













	F(u,v) = SUM{ f(x,y)*exp(-j*2*pi*(u*x+v*y)/N) }
    and
	f(x,y) = SUM{ F(u,v)*exp(+j*2*pi*(u*x+v*y)/N) }

    where u = 0,1,2,...,N-1 and v = 0,1,2,...,N-1
	  x = 0,1,2,...,N-1 and y = 0,1,2,...,N-1
	  j = SQRT( -1 )
	  and SUM means double summation  over proper
	  x,y or u,v ranges



https://github.com/HyTruongSon/Fourier-Transform-Library

https://www.codeproject.com/Articles/44166/2D-FFT-of-an-Image-in-C




# FFT
2&middot;N<sup>2</sup> &Rarr; 2&middot;N&middot;lg(N) 


https://towardsdatascience.com/fast-fourier-transform-937926e591cb

https://www.drdobbs.com/cpp/a-simple-and-efficient-fft-implementatio/199500857

https://rosettacode.org/wiki/Fast_Fourier_transform

https://jakevdp.github.io/blog/2013/08/28/understanding-the-fft/

https://www.mathworks.com/help/matlab/ref/fft.html

https://jakevdp.github.io/blog/2013/08/28/understanding-the-fft/

http://apps.usd.edu/coglab/schieber/psyc707/pdf/2D-FFT.pdf











# Z-Transform (frequency-ish?)

- unit circle

Laplace transform: discrete time <-> frequency

- generalized fourier transform?


2-sided (bilateral)
<br/>
X(z) = Z{x[n]} = &Sigma;<sub>n &isin; [-&infin;,&infin;]</sub> x[n]i&middot;z<sup>-n</sup> 

unilateral
<br/>
X(z) = Z{x[n]} = &Sigma;<sub>n &isin; [0,&infin;]</sub> x[n]i&middot;z<sup>-n</sup>  (n>=0)

Inverse:

x[n] = Z<sup>-1</sup>{X(z)} = (1/2&pi;j) &conint;<sub>C</sub> X(z)&middot;z<sup>n-1</sup> dz


z = e<sup>jw</sup>


http://fourier.eng.hmc.edu/e102/lectures/Z_Transform/node1.html
http://www-pagines.fib.upc.es/~pds/Lect04.pdf
https://lpsa.swarthmore.edu/LaplaceZTable/LaplaceZFuncTable.html




...