// Matrix.js
function Matrix(r,c){
	this._init(r,c);
}
Matrix.prototype._init = function(r,c){
	this._rowCount = r;
	this._colCount = c;
	this._total = r*c;
	this._rows = new Array();
	var i, j, row = this._rowCount, col = this._colCount;
	for(j=0;j<row;++j){
		this._rows[j] = new Array(col);
		for(i=0;i<col;++i){
			this._rows[j][i] = 0.0;
		}
	}
}
// ------------------------------------------------------------------------------------------------------------------------ INSTANCE
Matrix.prototype.setFromArray = function(list){
	var i, j, row = this._rowCount, col = this._colCount;
	var index = 0, len = list.length;
	for(j=0;j<row;++j){
		for(i=0;i<col && index<len;++i){
			this._rows[j][i] = list[index];
			++index;
		}
	}
	return this;
}
Matrix.prototype.setSize = function(rows,cols){
	this._init(rows,cols);
	return this;
}
Matrix.prototype.rows = function(){
	return this._rowCount;
}
Matrix.prototype.cols = function(){
	return this._colCount;
}
Matrix.prototype.set = function(row,col,val){
	this.rows[row][col] = val;
}
Matrix.prototype.get = function(row,col){
	return this.rows[row][col];
}
// ------------------------------------------------------------------------------------------------------------------------ BASIC SETTING
Matrix.prototype.zero = function(){
	var i, j, row = this._rowCount, col = this._colCount;
	for(j=0;j<row;++j){
		for(i=0;i<col;++i){
			this._rows[j][i] = 0.0;
		}
	}
}
Matrix.prototype.identity = function(){
	var i, j, row = this._rowCount, col = this._colCount;
	for(j=0;j<row;++j){
		for(i=0;i<col;++i){
			if(i==j){
				this._rows[j][i] = 1.0;
			}else{
				this._rows[j][i] = 0.0;
			}
		}
	}
}
Matrix.prototype.randomize = function(mul,rnd){
	var i, j, row = this._rowCount, col = this._colCount;
	for(j=0;j<row;++j){
		for(i=0;i<col;++i){
			this._rows[j][i] = Math.random()*mul;
			if(rnd){
				this._rows[j][i] = Math.round(this._rows[j][i]);
			}
		}
	}
}
// ------------------------------------------------------------------------------------------------------------------------ FXN
Matrix.prototype.swapRows = function(rowA,rowB){
	temp = this._rows[rowB];
	this._rows[rowB] = this._rows[rowA];
	this._rows[rowA] = temp;
}
Matrix.prototype.copySizeXXX = function(m){
	if(m!==undefined){
		this._init(m.rows(),m.cols());
	}else{
		var j,i, row=this._rowCount, col=this._colCount;
		m = new Matrix(row,col);
		m.copySize(this);
		return m;
	}
}
Matrix.prototype.copy = function(m){ // this = m || return copy
	if(m!==undefined){
		this._init(m.rows(),m.cols());
		var i, j, row = this._rowCount, col = this._colCount;
		for(j=0;j<row;++j){
			for(i=0;i<col;++i){
				this._rows[j][i] = m._rows[j][i];
			}
		}
	}else{
		var j,i, row=this._rowCount, col=this._colCount;
		m = new Matrix(row,col);
		m.copy(this);
		return m;
	}
}
Matrix.prototype.kill = function(){
	//
}
Matrix.prototype.toString = function(exp){
	exp = exp===undefined?4:exp;
	var minLen = exp+6+1; // -#.E+#
	var i, j, rowm1 = this._rowCount-1, colm1 = this._colCount-1, num, val;
	var str = "";
	for(j=0;j<=rowm1;++j){
		str += "[ "
		for(i=0;i<=colm1;++i){
			num = this._rows[j][i];
			val = num.toExponential(exp);
			if(num>=0){ // +/1 prefix
				val = " " + val;
			}
			str += Code.padStringLeft(val,minLen," ");
		}
		str += " ]";
		if(j<rowm1){
			str += "\n";
		}
	}
	return str.replace(/e/g,"E");
}
// ------------------------------------------------------------------------------------------------------------------------ CLASS
/*
RREF:

for each col
	for each row below pivot row
		c = first-cell / pivot-cell
		for each col at and left of pivot col
			cell = cell - c * pivot[pivotRow,col]
		




*/
// ------------------------------------------------------------------------------------------------------------------------ MATHS
// assumes all sizes have been set beforehand
Matrix.RREF = function(B, A){ // B = rowReducedEchelonForm(A)
	B.copy(A);
	var i, j, jm1, row = B._rowCount, col = B._colCount;
	var thi, pre, nex, c;
	var pivotRow, pivotCol, pivotCell;
	for(pivotCol=0,pivotRow=0;pivotCol<col&&pivotRow<row;++pivotCol){ // ,++pivotRow
		for(j=pivotRow;j<row;++j){ // swap rows so first pivot-row entry is not zero
			if( B._rows[j][pivotCol] != 0 ){ // 
				if(j>pivotRow){
					B.swapRows(j,pivotRow);
				}
				pivotCell = B._rows[pivotRow][pivotCol];
				for(j=pivotRow+1;j<row;++j){ // 
					c = B._rows[j][pivotCol]/pivotCell;
					for(i=pivotCol;i<col;++i){
						B._rows[j][i] -= c*B._rows[pivotRow][i];
					}
				}
				for(j=0;j<row;++j){ // zero all entries in pivot column
					c = B._rows[j][pivotCol]/pivotCell;
					if(c!=0){ // skip useless iterations
						for(i=pivotCol;i<col;++i){
							if(j!=pivotRow){
								B._rows[j][i] -= c*B._rows[pivotRow][i];
							}
						}
					}
				}
				for(i=pivotCol;i<col;++i){ // scale pivot-row to first-entry = 1 => /pivotCell
					B._rows[pivotRow][i] /= pivotCell;
				}
				++pivotRow;
				break;
			}
		}
	}
}
/*
[ 1.0000E+0  2.0000E+0  3.0000E+0  4.0000E+0  5.0000E+0   ]
[ 0.0000E+0  1.0000E+0  -2.0000E+0 -8.0000E+0 -9.0000E+0  ]
[ 0.0000E+0  0.0000E+0  0.0000E+0  -1.1000E+1 -1.4000E+1  ] 
*/
Matrix.nullSpace = function(A){ // nul(A)
	
}
Matrix.eigenVectors = function(B, A){ // 
	//
}
Matrix.eigenValues = function(B, A){ // 
	//
}
Matrix.QR = function(){ // 
	
}
Matrix.SVD = function(){ // 
	
}
Matrix.LU = function(A){ // this = A^ 
	
}
Matrix.scale = function(c, a,b){ // c = a*b(constant)
	//
}
Matrix.mult = function(c, a,b){ // c = a*b 
	//
}
Matrix.inverse = function(c, a){ // c = a^-1  square inverse via gauss-jordan
	// via euler 
}
Matrix.pseudoinverse = function(c, a){ // c = aa^at non-square 
	// via euler 
}
Matrix.cp2tform = function(c, a){ // control points to transform - projective 3D transform
	// 
}
Matrix.a = function(c, a){ // 
	// 
}



/*
Matrix.prototype.inverse = function(m){ // http://www.dr-lex.be/random/matrix_inv.html
	var det = 1/(m.a*m.d - m.b*m.c);
	var a = m.d*det;
	var b = -m.b*det;
	var x = (m.b*m.y-m.d*m.x)*det;
	var c = -m.c*det;
	var d = m.a*det;
	var y = (m.c*m.x-m.a*m.y)*det;
	self.a = a; self.b = b; self.c = c; self.d = d; self.x = x; self.y = y;
}
*/

/*
RANK: actual dimension the matrix can produce
NULL SPACE: KERNEL SPACE: all x : Ax = 0
COL SPACE: volume that can be produced
ROW SPACE: 
IMAGE:
PREIMAGE:

SPAN === LINEAR COMBINATION

http://www.youtube.com/watch?v=abYAUqs_n6I

*/