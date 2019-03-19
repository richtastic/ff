# COLOR:

white balance:
    known pixel color for white: w_r,w_g,w_b ; eg: 0.95,0.92,0.97
    multiply all pixels in image: 1.0/w_r, 1.0/w_g, 1.0/w_b
    ...
convert to LMS colorspace [or other color spaces?]

- bear fruit gray dataset
http://color.psych.upenn.edu/hyperspectral/bearfruitgray/bearfruitgray.html

https://medium.com/hipster-color-science/color-reproductions-of-hyperspectral-images-ad6210bbcd1d

https://en.wikipedia.org/wiki/Standard_illuminant
https://en.wikipedia.org/wiki/Illuminant_D65

https://en.wikipedia.org/wiki/SRGB

http://www.imatest.com/docs/colormatrix/



http://visionscience.com/vsImages.html





color matching:
COLOR MAPPING
COLOR TRASNFER

    - without matching points/features:
        - only a statistical correlation can be used
            - minimize energy fxn differences
        - transfer 'color style'

    - with features:
        - minimize color differences between features [use small subset of image in known transfer locations]



Histogram-Based Color Transfer for Image Stitching


???
for each channel R,G,B:
    calculate distances between image intensities
        (exact pixel or window averaging)
    calc mean distance
    calc linear transfer fxn?:
        colorB = offset + (scale * colorA)



- which image to use as 'reference'
    ) A map each toward eachother half-way
    ) use image with more contrast / larger ranging histograms

















































...
