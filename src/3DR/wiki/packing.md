# 2D Bin Packing
texture / rectangle / packing

2D rectangle bin packing - combinatorial optimization
NP-hard ; only heuristics




- online (in order as given)
- offline (know all data beforehand)

- open (multiple bins to choose from at any given time)

- orthogonal
- rotatable 90* [w,h] or [h,w]

algorithms

BNF

- top shelf - open
    - bottom shelves - closed


- Strip Packing
- Next Fit Decreasing Height [NFDH]
- Bottom Left (& Improved) [BL]
- Bottom Left Fill [BLF]
- Shelf
    - Next Fit (NF) - single open shelf O(n)
    - First Fit (FF) - keep all shelves & avail space open O(n ln(n))
    - Best Width Fit (BWF) - choose shelf resulting in minimum width remaining
    - Best Height Fit (BHF) - choose shelf with resulting in minimum height wasted
    - Best Area Fit (BAF) - choose shelf with best width & height
    - Worst Width Fit (WWF) - choose shelf with resulting in maximum width remaining (or prefer exactly 0)
    - Floor Ceiling (FC) - presort with longest size
    - Waste Map Improvement (WM) - keep track of unused areas and try those first O(n^2)
- Guillotine (+ variants) - a list of rectangles represents available area - split rules: hori/vert
    - Best Area Fit (BAF)
    - Best Short Side Fit (BSSF)
    - Best Long Side Fit (BLSF)
    - Worst Area Fit (WAF)
        - Worst Short Side Fit (WSSF)
        - Worst Long Side Fit (WLSF)
    - Rectangle Merge Improvement (RM) - merge empty rectangles
    - Split rules:
        - Shorter/Longer Axis Split Rule (SAS/LAS)
        - Shorter/Longer Leftover Axis Split Rule (SAS/LAS)
        - Min/Max Area Split Rule (MAXAS,MINAS) n
- Maximal Rectangles - store free area in bin (non disjoint 2 rect at each cut)
    - Bottom Left (Tetris) [Chazelle]
    - Best Area Fit
    - Best Short Side
    - Best Long Side
    - Chazelle
- Skyline - list of horizon (envelope) edges
    - Bottom Left
    - Best Fit
    - Waste Map Improvement
- Genetic
- Simulated Annealing
- Tabu Search
- next fit decreasing height

benchmarks
    -  asymptotic performance ratios




2DGK - ?
QPTAS - ?



references best first:

A Thousand Ways to Pack the Bin - A Practical Approach to Two-Dimensional Rectangle Bin Packing
http://pds25.egloos.com/pds/201504/21/98/RectangleBinPack.pdf
Approximation Algorithms for Rectangle Packing Problems
https://arxiv.org/pdf/1711.07851.pdf
PaunPacker - Texture Atlas Generator
https://smartech.gatech.edu/bitstream/handle/1853/54371/KHAN-DISSERTATION-2015.pdf
APPROXIMATION ALGORITHMS FOR MULTIDIMENSIONAL BIN PACKING
BPTX_2018_2_11320_0_511580_0_213747.pdf
GEOMETRIC BIN PACKING ALGORITHM FOR ARBITRARY SHAPES
http://etd.fcla.edu/UF/UFE0000907/pasha_a.pdf?fbclid=IwAR2E6OPgFO8VW81rMDllQEl-sT-kn20wuGJ-OXOgU4Van6cUyy8vtbaKP0U





# 1D bin packing

-  J. Csirik and G. J. Woeginger, On-line packing and covering problems,in Developments from a June 1996 seminar on Online algorithms, (London, UK), pp. 147177, Springer-Verlag, 1998.





