# QR

### definition
QR Code:= matrix symbology consisting of array of square modules in a square pattern (QR Code Model 2)
	- finder pattern
		- pattern at 3 corners
	- 4 levels of error correction
	- Module dimensions
		- Model 1: original spec
		- Model 2: enhanced symbology w new fetures -> new standard


Micro QR Code
DataMatrix ECC200


other standards
	ISO/IEC 15424: auto capture tech.
	ISO/IEC 15416: auto capture tech.
	EN 1556: Bar Coding 
	JIS X 0201: JIS 8-bit Character Set
	JIS X 0208-1997: Japanese Graphic Character Set 
	ANSI X3.4: Coded Character Sets - ASCII
	AIM International Technical Specification


- functional patterns
- encoding : data | error correction
- extended channel interpetation (ECI)
- ECI designator = 6-digit ECI assignment
- mask pattern reference: 3-bit ID for masking pattern applied to symbol
- masking: XORing bit patttern - to more evenly balance numbers
- representing mode - character set designation - 4-bit
- padding bit = filler after terminator
- remainder bit = empty region
- remainder codeword
- segment: sequence of data
- separator: functional pattern
- terminator: 0000 bit pattern
- timing pattern: alternating seq of dark & light
- version: size of symbol: from 21x21 (v1) to 177x177 (v40)
- version info: function pattern w/ info on symbol w/ error correction bits for data

................ conventions

module positions: row i, col j : (i,j) | (0,0) is upper left symbol corner
bytes are in hex
versions: V-E (version number [1-40] and error correction level[L,M,Q,H])

A) character set:
	a) digits 0-9
	b) alpha numeric: 0-9 A-Z (space) $ %, * + - . / : [10 + 26 + 9 = 45]
	c) 8-bit byte data
	d) kanji
B) representation
	dark = 1, light = 0
C) symbol sizes: 
	- 21x21 to 177x177 (1 to 40) incrementing in steps of 4
D) data characters per symbol (40-L)
	a) 7089
	b) 4296
	c) 2953
	d) 1817
E) error correction levels
	L - 7%
	M - 15%
	Q - 25%
	H - 30%
F) code type - matrix
G) orientation independence - yes

................ added

A) structure append (optional)
	- files of data to be represented logically & continuously up to 16 QR code symbols
B) masking (inherent)
	- ratio of light to dark approx 1:1
	- minimize occurrence of arrangements of adjoining
C) extended channel interp. (optional)
	- use character sets other than default (eg arabig, cyrillic, greek)


................ structure


................ encoding

- DATA ANALYSIS : choose charager sets
	- numeric: 0x30 - 0x39 | 
		10|0000 ... 10|1001
	- alphanumeric: 0x30...0x39...
	- 8-bit byte mode
	- kanji mode
- convert data to bit stream + mode indicators + terminator | 8-bit code words | pad for version
	- 
- divide into blocks | generate error correction corewords | append to data codeword sequence
- interleave data & error correction (8.6) | add remainder bits
- place codeword modules in matrix w/ finder pattern, separators, timing pattern, alignment pattern
- choose optimal dark/light module balance & mask patterns to region
- generate format & version info & complete symbol


- MODES
	- 

................ decoding

...

- ECI - extended channel interperation (mode)





1D -EAN (EAN-8 EAN-13)

2D Code

QR - quick response
DataMatrix codes
	sizes:
		12x12 - 6
		...
		40x40 - 169
		..
		144x144 - 

error correction level - data restoration
module size - dimension of minimum component squares
quiet zone - spacing around code

position detection pattern
pattern separater
timing patterns
alignment patterns
format data
version data
data & error correction




SEARCH TERMS:
Data Matrix Code Structure

Decoding the ISO 15415 Verification report



QR data matrix specification format




DEFINITION:

INTERNA TIONAL ISO/IEC STANDARD 18004
https://www.swisseduc.ch/informatik/theoretische_informatik/qr_codes/docs/qr_standard.pdf

https://courses.csail.mit.edu/6.857/2014/files/12-peng-sanabria-wu-zhu-qr-codes.pdf

https://www.controldesign.com/assets/13WPpdf/130520-keyence-2d-code-implementation.pdf

https://www.gs1.org/docs/barcodes/GS1_DataMatrix_Guideline.pdf



https://www.qr-code-generator.com/qr-code-marketing/qr-codes-basics/

https://www.gs1.org/docs/barcodes/GS1_DataMatrix_Guideline.pdf

http://cg.cs.tsinghua.edu.cn/people/~kun/2019qrcode/two_layer_qr_code.pdf

http://barcode-test.com/wp-content/uploads/2012/06/FINAL-VERSION-1-Compiled-Manual-August-2014.pdf
https://www.controldesign.com/assets/13WPpdf/130520-keyence-2d-code-implementation.pdf


https://arxiv.org/pdf/1803.02280.pdf
https://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.218.87&rep=rep1&type=pdf

https://people.sc.fsu.edu/~jburkardt/classes/tta_2015/qr_code.pdf

https://iopscience.iop.org/article/10.1088/1742-6596/1237/2/022006/pdf


https://www.gs1us.org/DesktopModules/Bring2mind/DMX/Download.aspx?Command=Core_Download&EntryId=169
https://www.theseus.fi/bitstream/handle/10024/85796/JI%20QIANYU-FINAL%20THESIS.pdf?sequence=1&isAllowed=y
https://core.ac.uk/download/pdf/187726676.pdf

http://cg.cs.tsinghua.edu.cn/people/~kun/2019qrcode/two_layer_qr_code.pdf

QUICK:
https://nsfsakai.nthsydney.tafensw.edu.au/access/content/group/179a89f1-0f5a-4f18-90a1-ecbe32dd40d4/Floristry/PrepareAndCareForFloristryStockAndMerchandise/QR%20codes.pdf
https://www.masslibsystem.org/wp-content/uploads/QRCodes.pdf



SUMMARY:

https://www.nyu.edu/content/dam/nyu/studentAffairs/images/Explained/qr_code.pdf


EXAMPLES TO TEST WITH:
https://www.dps61.org/cms/lib07/IL01000592/Centricity/Domain/1798/Black%20History%20Month%20QR%20Codes.pdf
file:///Users/richard.zirbes/Downloads/Copy-of-HMS-Parent_Student-QR-Codes-2.pdf









STEPS:

- how to place the data
	- V1 -> V40
- how to generate the error codes
	- ...4 versions
- how to generate the version data
	- ....
- how to do the masking
	- ... types?
- how to do the 

- reverse: reading the data
- reading the data with errors
	- how to use the error data to read
- ...

- EXAMPLE URL TEST

- HOW TO CONVERT IMAGE TO DATA ARRAY
- recognize data that is unknown / unreliable & mark as such




DEVELOPMENT STEPS:
	READ:
		- visual program to identify & parse image into QR code matrix
			- pre-filter image to get local contrast into grayscale assignments
			- find position patterns - centroidal square blocks
			- find 3 orthogonal-from-origin blocks
			- find QR region (affine)
			- determine module size
			- find timing patterns
			- find mini-centroidal alignment patterns - square blocks [1-module concentric circle objects]
			- discritize image into sections [global affine & local affine regularization]
		- parse:
			- locally get average color to threshold on light/dark to black or white
				- reference wider neighborhood 
			- 2D byte array (true/false)
			- known & unknown value matrix [for errors]
				- how to identify error / tear / ... ?
			- determine version (version info or patterns or ...)
			- error correction
			- extract data portion
			- convert into data matrix
	WRITE:
		- encode data into a byte array (or other mode?)
		- determine appropriate size
			- input data length
			- input error recovery
			- input / calculated masking ?
			- compression abilities
		- print to bit array / image


beautify:
http://graphics.csie.ncku.edu.tw/QR_code/QR_code_TMM.pdf
https://smartengines.com/qr-code-localization/





SAMPLES:
https://en.wikipedia.org/wiki/QR_code





RECOGNITION IDEAS:
	- border / boundary / contour
	- concentric circles
	- 
	- inverted color such that the 'black' is the same color as the position pattern
	- 

NEXT STEPS:
	x how to determine alignment pattern
	x read data
	x read version
	x read format
	- do error correction methods
	- print out data as examples
	- ...
	- 



30-32" wide ~ 2.5'
66" tall ~ 5.5'


https://www.degruyter.com/document/doi/10.1515/jisys-2020-0143/html


#ERROR CORRECTION CODES (ECC):


##BCH (Bose, Chaudhuri, Hocquenghem)
	- error correcting syclic code
	- generalization of hamming code for multiple errors
	- GF = Galois Field (finite field)
	- polynomial -> matrix math
	- decoder = syndrome

https://web.ntpu.edu.tw/~yshan/BCH_code.pdf


## Reed Solomon (RS)
	- block-based ECC
	- non-binary BCH
	- DATA + PARITY sections of data
		- RS(255,223) = 255 code word bytes # 223 are data and 32 bytes are parity
	- parity bit count: 2*t can correct up to t errors


https://www.cs.cmu.edu/~guyb/realworld/reedsolomon/reed_solomon_codes.html
https://en.wikiversity.org/wiki/Reed%E2%80%93Solomon_codes_for_coders





