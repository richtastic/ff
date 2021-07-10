# Levenberg-Marquardt

Iterative Method to find optimal parameters, graduated mix between Gradient Descent & Newton Iteration.
<br/>


## Definitions

**P**: model parameters 
<br/>
**X<sup>&lowast;</sup>**: true (ideal) values, without any error
<br/>
**X**: observed values (measurements), with some error differing from ideal values
<br/>
**f(&theta;)**: function (model) mapping parameters to expected values (**P** &rarr; **X**)
<br/>
**&epsilon;**: error between observed values and calculated model values &equiv; **X** - **f(P)**
<br/>
**&Delta;**: computed increment of parameter values, solution to: J<sup>+</sup>&middot;**&Delta;** = **&epsilon;** &rArr; **&Delta;** &colone; (**M**<sup>-1</sup>&middot;J<sup>T</sup>)&middot;**&epsilon;**
<br/>
**J**: Jacobian matrix relating a change in a single parameter value to a column of value changes &part;**X**/&part;**P**
<br/>
**J<sup>+</sup>**: Jacobian pseudo-inverse &equiv; (**J**<sup>T</sup> &middot; **J**)<sup>-1</sup> &middot; **J**<sup>T</sup>
<br/>
**&omega;**: total error magnitude &equiv; ||&epsilon;||<sup>2</sup>
<br/>
**&lambda;**: lambda scaler (initial value ~ 1E-3)
<br/>
**N**: Normal equation &equiv; **J**<sup>T</sup>&middot;**J**
<br/>
**M**: modified Normal equation with diagonals multiplied by scaling (1+&lambda;) &equiv; M<sub>i,i</sub> = (1+&lambda;) &middot; N<sub>i,i</sub>
<br/>

Alternate:
<br/>
**E(&theta;)**: Error function mapping parameters to error values
<br/>



## Flow

The input to the algorithm is:
- **P**<sub>0</sub> : initial estimate of parameters for model
- One of:
	- **X** : Observed values & **f(&theta;)** : Function model
	- **E(&theta;)** : Error function - internalizes values & model ; allows for more general error estimation

_Init_
<br/>
&lambda; = 1E-3

_Get initial error:_
<br/>
**&epsilon;**<sub>0</sub> = **E**(**P**<sub>0</sub>)
<br/>
&omega;<sub>0</sub>  = ||**&epsilon;**<sub>0</sub>||<sup>2</sup><sub>i+1</sub> 
<br/>

_Iterating until convergence or maximum iterations:_
<br/>
**J**<sub>i</sub> = &part;**X**/&part;**P**<sub>i</sub>
<br/>
**N**<sub>i</sub> = **J**<sup>T</sup><sub>i</sub>&middot;**J**<sub>i</sub>
<br/>
**M**<sub>i</sub> = (1+&lambda;)<sub>i,i</sub> &middot; **N**<sub>i<sub>i,i</sub></sub>
<br/>
**&Delta;**<sub>i</sub> = (**M**<sup>-1</sup><sub>i</sub>&middot;J<sup>T</sup>)&middot;**&epsilon;**<sub>i</sub>
<br/>
**P**<sub>i+1</sub> = **P**<sub>i</sub> + &Delta;<sub>i</sub>
<br/>
**&epsilon;**<sub>i+1</sub> = **E**(**P**<sub>i+1</sub>)
<br/>
&omega;<sub>i+1</sub>  = ||**&epsilon;**<sub>i+1</sub>||<sup>2</sup>
<br/>

_if error has decreased_ (&omega;<sub>i+1</sub> &lt; &omega;<sub>i</sub>) &rarr; keep new **P**<sub>i+1</sub> & &lambda; &colone; &lambda;/10
<br/>
_else error has increased_ &rarr; keep old **P**<sub>i</sub> & &lambda; &colone; &lambda;&middot;10
<br/>

_if P values are not changing much_ &rarr; exit
<br/>
_if error hasn't changed after k iterations or lambda is very large(?/small)_ &rarr; exit
<br/>


The output of the algorithm is:
- **P**<sub>&infin;</sub> : best estimate of parameters for model
<br/>




## Notes

<br/>






### Pseudo Inverse / Moore-Penrose Inverse:

Left inverse (A<sup>+</sup> &middot; A = E)
<br/>
A<sup>+</sup> = (A<sup>T</sup> &middot; A)<sup>-1</sup> &middot; A<sup>T</sup>


Right inverse (A &middot; A<sup>+</sup> = E)
<br/>
A<sup>+</sup> = A<sup>T</sup> &middot; (A &middot; A<sup>T</sup>)<sup>-1</sup>












## References

docs

https://people.duke.edu/~hpgavin/ce281/lm.pdf

http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.135.865&rep=rep1&type=pdf



code

https://cdn.jsdelivr.net/npm/ml-levenberg-marquardt@3.1.1/lib/index.js

http://scribblethink.org/Computer/Javanumeric/index.html

https://jugit.fz-juelich.de/mlz/lmfit


?

http://users.ics.forth.gr/~lourakis/levmar/


SFM

https://engineering.purdue.edu/kak/courses-i-teach/ECE661.08/homework/HW5_LM_handout.pdf





---
