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
	this._rows[row][col] = val;
}
Matrix.prototype.get = function(row,col){
	return this._rows[row][col];
}
// ------------------------------------------------------------------------------------------------------------------------ BASIC SETTING
Matrix.prototype.zero = function(){
	var i, j, row = this._rowCount, col = this._colCount;
	for(j=0;j<row;++j){
		for(i=0;i<col;++i){
			this._rows[j][i] = 0.0;
		}
	}
	return this;
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
	return this;
}
Matrix.prototype.closeToIdentity = function(thresh){
	thresh = thresh===undefined?(1E-6):thresh;
	var i, j, row = this._rowCount, col = this._colCount;
	for(j=0;j<row;++j){
		for(i=0;i<col;++i){
			if(i==j){
				if( Math.abs(this._rows[j][i]-1.0 )>thresh ){
					console.log(j,i,"==");
					return false;
				}
			}else if( Math.abs(this._rows[j][i])>thresh ){
				console.log(j,i,"!=");
				return false;
			}
		}
	}
	return true;
}
Matrix.prototype.getSubMatrix = function(offRow,offCol, rows,cols){
	var i,j, m = new Matrix(rows,cols);
	for(j=0;j<rows;++j){
		for(i=0;i<cols;++i){
			m._rows[j][i] = this._rows[j+offRow][i+offCol];
		}
	}
	return m;
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
	return this;
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
		return this;
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
// ------------------------------------------------------------------------------------------------------------------------ INSTANCE MATHS
Matrix.prototype.multV2DtoV2D = function(out, inn){
	var x = this._rows[0][0]*inn.x + this._rows[0][1]*inn.y + this._rows[0][2];
	out.y = this._rows[1][0]*inn.x + this._rows[1][1]*inn.y + this._rows[1][2];
	out.x = x;
}
Matrix.prototype.multV2DtoV3D = function(out, inn){
	var x = this._rows[0][0]*inn.x + this._rows[0][1]*inn.y + this._rows[0][2];
	var y = this._rows[1][0]*inn.x + this._rows[1][1]*inn.y + this._rows[1][2];
	out.z = this._rows[2][0]*inn.x + this._rows[2][1]*inn.y + this._rows[2][2];
	out.x = x; out.y = y;
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
Matrix.transpose = function(B, Ain){ // B = A^T
	var A = Ain, C = Matrix._temp;
	if(Ain===undefined){ A = B; }
	var i, j, temp, row = A._rowCount, col = A._colCount;
	C.setSize(col,row);
	for(j=0;j<row;++j){
		for(i=0;i<col;++i){
			C._rows[i][j] = A._rows[j][i];
		}
	}
	if(Ain==undefined){ return C.copy(); }
	B.copy(C);
	return B;
}
Matrix.augment = function(A,B){
	var rowsA = A._rowCount, rowsB = B._rowCount, colsA = A._colCount, colsB = B._colCount;
	var i, j, temp, row = Math.max(rowsA,rowsB), col = colsA+colsB;
	var C = new Matrix(row,col);
	for(j=0;j<rowsA;++j){
		for(i=0;i<colsA;++i){
			C._rows[j][i] = A._rows[j][i];
		}
	}
	for(j=0;j<rowsB;++j){
		for(i=0;i<colsB;++i){
			C._rows[j][i+colsA] = B._rows[j][i];
		}
	}
	return C;
}
Matrix.RREF = function(B, A){ // B = rowReducedEchelonForm(A)
	if(A!==undefined){
		if(B!=A){ B.copy(A); }
	}else{
		B = B.copy();
	}
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
	return B;
}
Matrix.inverse = function(A){ // assumed square
	C = Matrix.augment(A,(new Matrix(A._rowCount,A._colCount)).identity());
	Matrix.RREF(C,C);
	B = C.getSubMatrix(0,0, A._rowCount,A._colCount);
	C = C.getSubMatrix(0,A._colCount, A._rowCount,A._colCount);
	if( !B.closeToIdentity() ){
		return null;
	}
	return C;
}
Matrix.pseudoInverse = function(cin, ain){ // c = aa^at non-square 
	var a = ain;
	if(ain===undefined){
		a = cin;
	}
	var at = Matrix.transpose(a);
	var c = Matrix.mult(at,a);
	c = Matrix.inverse(c);
	c = Matrix.mult(c,at);
	if(ain===undefined){
		return c;
	}
	return cin.copy(c);
}
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
Matrix.mult = function(r, ain,bin){ // c = a*b 
	var b = bin, a = ain;
	if(bin===undefined){
		a = r; b = ain;
	}
	var c = Matrix._temp;
	var i,j,k, v, rowsA=a._rowCount,rowsB=b._rowCount, colsA=a._colCount,colsB=b._colCount;
	c.setSize(rowsA,colsB);
	for(j=0;j<rowsA;++j){
		for(i=0;i<colsB;++i){
			v = 0;
			for(k=0;k<colsA;++k){ // rowsB
				v += a._rows[j][k]*b._rows[k][i];
			}
			c._rows[j][i] = v;
		}
	}
	if(bin===undefined){
		return c.copy();
	}
	r.copy(c);
}
Matrix.cp2tform = function(c, a){ // control points to transform - projective 3D transform
	// 
}
Matrix.a = function(c, a){ // 
	// 
}
Matrix._temp = new Matrix(1,1);


Matrix.get2DProjectiveMatrix = function(fromPoints, toPoints){
	var i, fr, to;
	var len = fromPoints.length;
	var matA = new Matrix(2*len,8);
	var matB = new Matrix(2*len,1);
	for(i=0;i<len;++i){
		fr = fromPoints[i];
		to = toPoints[i];
		matA.set(2*i,0,   fr.x);
		matA.set(2*i,1,   fr.y);
		matA.set(2*i,2,   1);
		matA.set(2*i,3,   0);
		matA.set(2*i,4,   0);
		matA.set(2*i,5,   0);
		matA.set(2*i,6,   -fr.x*to.x);
		matA.set(2*i,7,   -fr.y*to.x);
		matA.set(2*i+1,0, 0);
		matA.set(2*i+1,1, 0);
		matA.set(2*i+1,2, 0);
		matA.set(2*i+1,3, fr.x);
		matA.set(2*i+1,4, fr.y);
		matA.set(2*i+1,5, 1);
		matA.set(2*i+1,6, -fr.x*to.y);
		matA.set(2*i+1,7, -fr.y*to.y);
		matB.set(2*i  ,0, to.x);
		matB.set(2*i+1,0, to.y);
	}
	var x = Matrix.mult(Matrix.pseudoInverse(matA), matB);
	var projection = (new Matrix(3,3)).setFromArray([x.get(0,0),x.get(1,0),x.get(2,0), x.get(3,0),x.get(4,0),x.get(5,0), x.get(6,0),x.get(7,0),1]);
	// var pt = new V3D(0,0,0);
	// projection.multV2DtoV3D(pt,pt);
	// console.log(pt.toString());
	// projection.set(0,0, projection.get(0,0)/pt.z );
	// projection.set(1,1, projection.get(1,1)/pt.z );
	return projection;
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