# You're Converting Wrong: Colors
**round(p*255) &rarr; min(floor(p*256),255)**
<br />
*Converting between number scales (int)[0-255] and (float)[0.0,1.0]*
<br />

The goal in the conversion is to evenly distribute the values from one range to the other range (linearly).
<br />
Keep in mind that min(rangeA)=min(rangeB) (black should be black), similarly max(rangeA)=max(rangeB) (white should be white)

## [0,255] to [0.0,1.0]-(h to p)
**p = h/255.0**
<br/>
The distance between each element is equal, the minimum 0.0, and max 1.0 are mapped to correctly.
<br/>
Because it's floating point, the count of each 'value' is equal (ie 1) - evenly distributed
<br/>
**EX**:
```
# h is only 2 bits: 0,1,2,3
h = [0:3]; # h = [  0    1    2    3 ]
p = h/3.0; # p = [0.00 0.33 0.66 1.00]
```

## [0.0,1.0] to [0,255]-(P to H)
**Wrong: round(p*255)**
<br/>
The problem with this is that the values at the ends (0 and 255) are mapped to ~half as many values as a number in the middle of the range
<br/>
Imagine a range of 2 bit values: 0,1,2,3, and what their mappings would be:
```
scale -> [0.0,0.5) -> 0 ***
scale -> [0.5,1.5) -> 1
scale -> [1.5,2.5) -> 2
scale -> [2.5,3.0] -> 3 ***
```
The values 0 and 3 are mapped to from a smaller range. To see how this affects the distribution, an example:
<br/>
**EX**:
```
p = linspace(0.0,1.0,16); # p = [0.066 0.133 ... 0.933 1.00]
h = round(p*3.0); # h = [0 0 0 1 1 1 1 1 2 2 2 2 2 3 3 3]
distribution = [sum(h==0) sum(h==1) sum(h==2) sum(h==3)]
[3  5  5  3]

# the disparity becomes obvious with higher precision in p:
p = linspace(0.0,1.0,80); h = round(p*3.0); 
distribution = [sum(h==0) sum(h==1) sum(h==2) sum(h==3)]
[14  26  26  14]

# as precision -> inf, the proportion of range of the end values approaches 0.5:
[1334  2666  2666  1334]/2666 = [0.50  1.00  1.00  0.50]
```
<br/>

**Better: min(floor(p*256),255)**
<br/>
256 expresses the actual output range, so that the end values aren't short changed. The 255 cap is used, because otherwise the last value will map to 256.
<br/>
Again, imagine a range of 2 bit values, an example:
<br/>
**EX**:
```
p = linspace(0,1,16); # p = [0.066 0.133 ... 0.933 1.00]
h = min(floor(p*4),3); # h = [0 0 0 0 1 1 1 1 2 2 2 2 3 3 3 3]
distribution = [sum(h==0) sum(h==1) sum(h==2) sum(h==3)]
[4 4 4 4]

# The values are evenly distributed given any precision:
p = linspace(0,1,8000); h = min(floor(p*4),3);
d = [sum(h==0) sum(h==1) sum(h==2) sum(h==3)]
[2000 2000 2000 2000]/2000 = [1 1 1 1]
```

