// Matrix.js
Matrix.YAML = {
	ROWS:"row",
	COLS:"col",
	DATA:"data"
}
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
Matrix.prototype.saveToYAML = function(yaml){
	var i, j, r, row=this._rowCount, col=this._colCount;
	var DATA = Matrix.YAML;
	yaml.writeNumber(DATA.ROWS, this._rowCount);
	yaml.writeNumber(DATA.COLS, this._colCount);
	yaml.writeArrayStart(DATA.DATA);
		for(j=0;j<row;++j){
			r = this._rows[j];
			for(i=0;i<col;++i){
				yaml.writeNumber(r[i]);
			}
		}
	yaml.writeArrayEnd();
}
// ------------------------------------------------------------------------------------------------------------------------ INSTANCE
Matrix.prototype.setFromArray = function(list, newRow,newCol){
	if(newRow!==undefined){
		this.setSize(newRow,newCol);
	}
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
Matrix.prototype.setFromArrayMatrix = function(list, newRow,newCol){
	if(newRow!==undefined){
		this.setSize(newRow,newCol);
	}
	var i, j, row = this._rowCount, col = this._colCount;
	var len = row*col;
	for(j=0;j<row;++j){
		for(i=0;i<col;++i){
			this._rows[j][i] = list[j][i];
		}
	}
	return this;
}
Matrix.prototype.setDiagonalsFromArray = function(list){
	var i, len = Math.min(this.rows(), this.cols(), list.length);
	for(i=0;i<len;++i){
		this._rows[i][i] = list[i];
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
Matrix.prototype.scale = function(s){
	var i, j, row = this._rowCount, col = this._colCount;
	var index = 0, len = list.length;
	for(j=0;j<row;++j){
		for(i=0;i<col && index<len;++i){
			this._rows[j][i] = this._rows[j][i]*s;
			++index;
		}
	}
	return this;
}
Matrix.prototype.toV3D = function(){
	var i, j, v = new V3D();
	if(this._rows.length==1){ // row vector
		v.set(this._rows[0][0],this._rows[0][1],this._rows[0][2]);
	}else{ // column vector
		v.set(this._rows[0][0],this._rows[1][0],this._rows[2][0]);
	}
	return v;
}
Matrix.prototype.toArray = function(a){
	var i, j, row = this._rowCount, col = this._colCount, index = 0;
	if(!a){
		a = new Array(row*col);
	}
	for(j=0;j<row;++j){
		for(i=0;i<col;++i){
			a[index] = this._rows[j][i];
			++index;
		}
	}
	return a;
}
Matrix.prototype.colToArray = function(i){
	var j, row = this._rowCount;
	var a = new Array(row);
	for(j=0;j<row;++j){
		a[j] = this._rows[j][i];
	}
	return a;
}
Matrix.prototype.rowToArray = function(i){
	return Code.copyArray(this._rows[i]);
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
Matrix.prototype.dropOutIdentity= function(thresh){
	thresh = thresh===undefined?(1E-6):thresh;
	var i, j, row = this._rowCount, col = this._colCount;
	var found = false;
	for(i=0;i<col;++i){
		for(j=0;j<row;++j){
			if(found){
				this._rows[j][i] = 0.0;
			}else{
				if(i==j){
					if( Math.abs(this._rows[j][i]-1.0 )>thresh ){
						console.log(j,i,"==");
						this._rows[j][i] = 0.0;
						found = true;
					}
				}else if( Math.abs(this._rows[j][i])>thresh ){
					console.log(j,i,"!=");
					this._rows[j][i] = 0.0;
					found = true;
				}
			}
		}
	}
	return true;
}
Matrix.prototype.dropNonIdentity = function(){
	var i, j, row = this._rowCount, col = this._colCount;
	var found = false;
	for(i=0;i<col;++i){
		for(j=0;j<row;++j){
			if(i==j){
				// if( Math.abs(this._rows[j][i]-1.0 )>thresh ){
				// 	//this._rows[j][i] = 0.0;
				// }
			}else{// if( Math.abs(this._rows[j][i])>thresh ){
				this._rows[j][i] = 0.0;
			}
		}
	}
	return true;
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
// ------------------------------------------------------------------------------------------------------------------------ ...
Matrix.prototype.getColAsArray = function(col){
	var rows = this.rows(), i, a = [];
	for(i=0;i<rows;++i){
		a[i] = this._rows[i][col];
	}
	return a;
}
Matrix.prototype.getCol = function(col){
	return new Matrix(this.rows(),1).setFromArray(this.getColAsArray(col));
}
Matrix.prototype.getRowAsArray = function(row){
	return Code.copyArray( this._rows[row] );
}
Matrix.prototype.getRow = function(row){
	return new Matrix(1,this.rows()).setFromArray(this._rows[row]);
}
Matrix.prototype.setColFromCol = function(i, mat,j){
	var r, rows = Math.min(this.rows(),mat.rows());
	for(r=0;r<rows;++r){
		this._rows[r][i] = mat._rows[r][j];
	}
}
Matrix.prototype.setRowFromArray = function(i, arr){
	while(this._rows.length<=i){
		this._rows.push([]); // needs to be filled in
		this._rowCount++;
	}
	var c, cols = Math.min(arr.length,this.cols()), row = this._rows[i];
	for(c=0; c<cols; ++c){
		row[c] = arr[c];
	}
}
Matrix.prototype.dropLastRow = function(){
	this._rows.pop();
	this._rowCount--;
}
Matrix.prototype.dropLastCol = function(){
	var r, rows;
	for(r=0; r<rows; ++c){
		this._rows[r].pop();
	}
	this._colCount--;
}
// ------------------------------------------------------------------------------------------------------------------------ FXN
Matrix.prototype.swapRows = function(rowA,rowB){
	var temp = this._rows[rowB];
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
Matrix.prototype.cleanCheck = function(exp){
	var i, j, rowm1 = this._rowCount-1, colm1 = this._colCount-1, num, val;
	for(j=0;j<=rowm1;++j){
		for(i=0;i<=colm1;++i){
			num = this._rows[j][i];
			if(isNaN(num)||num===undefined){
				this._rows[j][i] = 0.0;
			}
		}
	}
}

Matrix.prototype.toString = function(exp){
	exp = exp===undefined?4:exp;
	var minLen = exp+6+1; // -#.E+#
	var i, j, rowm1 = this._rowCount-1, colm1 = this._colCount-1, num, val;
	var str = "";
	for(j=0;j<=rowm1;++j){
		//str += "[ ";
		str += " ";
		for(i=0;i<=colm1;++i){
			num = this._rows[j][i];
			val = num.toExponential(exp);
			if(num>=0){ // +/1 prefix
				val = " " + val;
			}
			str += Code.padStringLeft(val,minLen," ");
		}
		//str += " ]";
		str += "; ";
		if(j<rowm1){
			str += "\n";
		}
	}
	return str.replace(/e/g,"E");
}

Matrix._transformTemp = new Matrix(3,3);
Matrix.transform2DTranslate = function(a,tX,tY){
	var b = Matrix._transformTemp.setFromArray([1.0,0.0,tX, 0.0,1.0,tY, 0.0,0.0,1.0]);
	return Matrix.mult(a,b);
	//return Matrix.mult(b,a);
}
Matrix.transform2DScale = function(a,sX,sY){
	sY = sY!==undefined?sY:sX;
	var b = Matrix._transformTemp.setFromArray([sX,0.0,0.0, 0.0,sY,0.0, 0.0,0.0,1.0]);
	return Matrix.mult(a,b);
	//return Matrix.mult(b,a);
}
Matrix.transform2DRotate = function(a,ang){
	var b = Matrix._transformTemp.setFromArray([Math.cos(ang),-Math.sin(ang),0.0, Math.sin(ang),Math.cos(ang),0.0, 0.0,0.0,1.0]);
	return Matrix.mult(a,b);
	//return Matrix.mult(b,a);
}

Matrix.crossMatrixFromV3D = function(min,vin){ // v*M(u) = v x u
	var v = vin, m = min;
	if(vin===undefined){
		v = min;
		m = new Matrix(3,3);
	}
	m.setFromArray([0,-v.z,v.y, v.z,0,-v.x, -v.y,v.x,0]);
	return m;
}
// ------------------------------------------------------------------------------------------------------------------------ STATS
Matrix.matrixFromVectors = function(array){ // 
	var i, j;
	var cols = array.length;
	var rows = array[0].cols();
	var m = new Matrix();
	for(i=0;i<N;++i){
		// 
	}
	return m;
}
Matrix.zeroMeanMatrix = function(matrix){
	var N = matrix.cols();
	var center = new Array(N);
	// center[i] += [j][i]
	center = center/N;
	// ... subtract center
}
Matrix.square = function(c,a){ // dot
	// multiplication assuming a * a^T
	// ...
	return c;
}
Matrix.covarianceMatrix = function(matrix){
	matrix = Matrix.zeroMeanMatrix(matrix);
	var n = matrix.rows();
	var cov = Matrix.square(matrix); // dot
	var N = n-1;
	cov = cov / N;
	//var cov = new Matrix(n);
}
// ------------------------------------------------------------------------------------------------------------------------ INSTANCE MATHS
Matrix.prototype.multV2DtoV2D = function(out, inn){
	var x = this._rows[0][0]*inn.x + this._rows[0][1]*inn.y + this._rows[0][2];
	out.y = this._rows[1][0]*inn.x + this._rows[1][1]*inn.y + this._rows[1][2];
	out.x = x;
	return out;
}
Matrix.prototype.multV2DtoV3D = function(out, inn){
	var x = this._rows[0][0]*inn.x + this._rows[0][1]*inn.y + this._rows[0][2];
	var y = this._rows[1][0]*inn.x + this._rows[1][1]*inn.y + this._rows[1][2];
	out.z = this._rows[2][0]*inn.x + this._rows[2][1]*inn.y + this._rows[2][2];
	out.x = x; out.y = y;
	return out;
}
Matrix.prototype.multV3DtoV3D = function(out, inn){
	var x = this._rows[0][0]*inn.x + this._rows[0][1]*inn.y + this._rows[0][2]*inn.z;
	var y = this._rows[1][0]*inn.x + this._rows[1][1]*inn.y + this._rows[1][2]*inn.z;
	out.z = this._rows[2][0]*inn.x + this._rows[2][1]*inn.y + this._rows[2][2]*inn.z;
	out.x = x; out.y = y;
	return out;
}
Matrix.prototype.scale = function(c){
	var row, rows = this._rowCount, cols = this._colCount;
	for(j=0;j<rows;++j){
		row = this._rows[j];
		for(i=0;i<cols;++i){
			row[i] = row[i]*c;
		}
	}
	return this;
}
Matrix.prototype.offset = function(c){
	var row, rows = this._rowCount, cols = this._colCount;
	for(j=0;j<rows;++j){
		row = this._rows[j];
		for(i=0;i<cols;++i){
			row[i] = row[i] + c;
		}
	}
	return this;
}
Matrix.prototype.getNorm = function(){
	return Matrix.norm2D(this);
}
Matrix.prototype.normalize = function(){
	this.scale( 1.0/Matrix.norm2D(this) );
	return this;
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
Matrix.epsilon = 1.0E-15;
Matrix.isZero = function(num){
	return Math.abs(num)<Matrix.epsilon;
}
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
var det = 1.0;
	for(pivotCol=0,pivotRow=0;pivotCol<col&&pivotRow<row;++pivotCol){ // ,++pivotRow
		for(j=pivotRow;j<row;++j){ // swap rows so first pivot-row entry is not zero
			if( Math.abs(B._rows[j][pivotCol]) > Matrix.epsilon ){ // 
				if(j>pivotRow){
					B.swapRows(j,pivotRow);
det *= -1; // row swapping
				}
				pivotCell = B._rows[pivotRow][pivotCol];
				for(j=pivotRow+1;j<row;++j){ // 
					c = B._rows[j][pivotCol]/pivotCell;
					//if(c!=0){ // skip useless iterations
						for(i=pivotCol;i<col;++i){
							B._rows[j][i] -= c*B._rows[pivotRow][i];
						}
					//}
				}
				for(j=0;j<row;++j){ // zero all entries in pivot column
					c = B._rows[j][pivotCol]/pivotCell;
					//if(c!=0){ // skip useless iterations
						for(i=pivotCol;i<col;++i){
							if(j!=pivotRow){
								B._rows[j][i] -= c*B._rows[pivotRow][i];
							}
						}
					//}
				}
if(pivotCol<col){
	det *= pivotCell; // multiplying row
}
				for(i=pivotCol;i<col;++i){ // scale pivot-row to first-entry = 1 => /pivotCell
					B._rows[pivotRow][i] /= pivotCell;
				}
				++pivotRow;
				break;
			}
		}
		// console.log("B:"+pivotCol);
		// console.log(B.toString());
		// console.log("");
	}
//console.log("DETERMINANT: "+det)
	return B;
}
Matrix.RREF2 = function(B, A){ // B = rowReducedEchelonForm(A)
	if(A!==undefined){
		if(B!=A){ B.copy(A); }
	}else{
		B = B.copy();
	}
	var i, j, jm1, row = B._rowCount, col = B._colCount;
	var thi, pre, nex, c;
	var pivotRow, pivotCol, pivotCell;

var det = 1.0;
	for(pivotCol=0,pivotRow=0;pivotCol<col&&pivotRow<row;++pivotCol){ // ,++pivotRow
		for(j=pivotRow;j<row;++j){ // swap rows so first pivot-row entry is not zero
			if( Math.abs(B._rows[j][pivotCol]) > Matrix.epsilon ){ // 
				if(j>pivotRow){
					B.swapRows(j,pivotRow);
det *= -1; // row swapping
				}
				pivotCell = B._rows[pivotRow][pivotCol];
				for(j=pivotRow+1;j<row;++j){ // 
					c = B._rows[j][pivotCol]/pivotCell;
					if(c!=0){ // skip useless iterations
						for(i=pivotCol;i<col;++i){
							B._rows[j][i] -= c*B._rows[pivotRow][i];
						}
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
if(false){ // do this for RREF, don't do for REF=lambda
if(pivotCol<col){
	det *= pivotCell; // multiplying row
}
				for(i=pivotCol;i<col;++i){ // scale pivot-row to first-entry = 1 => /pivotCell
					B._rows[pivotRow][i] /= pivotCell;
				}
}
				++pivotRow;
				break;
			}
		}
	}
//console.log("DETERMINANT: "+det)
	return B;
}
Matrix.backPropagate = function(A,b){ // A*b = b0 => start with bottom-most variables, and solve upward
	// assumes A is nxn upper triangular
	var i, j, val, rows = A.rows(), cols = A.cols();
	for(i=cols-1;i>=0;--i){
		val = b._rows[i][0];
		for(j=rows-1;j>i;--j){
			//console.log("["+i+"]["+j+"] = "+ A._rows[i][j]);
			val -= A._rows[i][j] * b._rows[j][0];
		}
		if( Math.abs(A._rows[i][j]) > Matrix.epsilon ){
			val /= A._rows[i][j]; // pivot if not 1.0 ... 
		}
		b._rows[i][0] = val;
	}
	return b;
}
Matrix.norm2D = function(A){ // frobenius
	var rows = A.rows(), cols = A.cols(), u, t;
	var i, n = 0;
	for(j=0;j<rows;++j){
		row = A._rows[j];
		for(i=0;i<cols;++i){
			x = row[i];
			n += x*x;
		}
	}
	return Math.sqrt(n);
}
Matrix.normInfinite = function(x){ // x is a vector
	var rows = x.rows(), cols = x.cols(), u, t;
	var max = x.get(0,0);
	var maxAbs = Math.abs(max);
	var i, len = Math.max(rows,cols);
	if(rows>cols){ // vertical
		for(i=0;i<len;++i){
			u = x.get(i,0); t = Math.abs(u);
			if(t>maxAbs){
				max = u; maxAbs = t;
			}
		}
	}else{ // horizontal
		for(i=0;i<len;++i){
			u = x.get(0,i); t = Math.abs(u);
			if(t>maxAbs){
				max = u; maxAbs = t;
			}
		}
	}
	return maxAbs; // return max;
}
Matrix.inverse = function(A){ // assumed square
	//return new Matrix(A.rows(),A.cols()).setFromArrayMatrix( numeric.inv(A._rows) );
	C = Matrix.augment(A,(new Matrix(A._rowCount,A._colCount)).identity());
	Matrix.RREF(C,C);
	B = C.getSubMatrix(0,0, A._rowCount,A._colCount);
	C = C.getSubMatrix(0,A._colCount, A._rowCount,A._colCount);
	if( !B.closeToIdentity() ){
		console.log("not close")
		console.log(B.toString())
		//B.dropOutIdentity();
		//return null;
		//console.log(B.toString())
		// console.log(B.toString())
		// console.log(C.toString())
		// C.dropNonIdentity();
		// console.log(C.toString())
	}
	return C;
	// return new Matrix(A.rows(),A.cols()).setFromArrayMatrix( numeric.inv(A._rows) );
}
// RIGHT INVERSE n<=m: A^T[(A*A^T)^-1]
// LEFT INVERSE m<=n: [(A^T*A)^-1]A^T
Matrix.pseudoInverse = function(cin, ain){
	return Matrix.pseudoInverseSVD(cin,ain);
}
Matrix.pseudoInverseSimple = function(cin, ain){ // c = aa^at non-square
	var a = ain;
	if(ain===undefined){
		a = cin;
	}
	var at = Matrix.transpose(a);
	var c = Matrix.mult(at,a);
	c = Matrix.inverse(c);
	c = Matrix.mult(c,at);
	return cin.copy(c);
}
Matrix.pseudoInverseSVD = function(cin, ain){ // c = aa^at non-square
	var a = ain;
	if(ain===undefined){
		a = cin;
	}
	var SVD = Matrix.SVD(a);
	var U = SVD.U;
	var S = SVD.S;
	var V = SVD.V;
	var i, num, len = Math.min(U.rows(),V.cols());
	for(i=0;i<len;++i){
		num = S.get(i,i);
		if(num>Matrix.epsilon){
			S.set(i,i, 1/num);
		}
	}
	V = Matrix.transpose(V)
	c = Matrix.mult(U,S);
	c = Matrix.mult(c,V);
	if(ain===undefined){
		return c;
	}
	return cin.copy(c);
}
Matrix.solve = function(A,b){ // Ax = b => solve for x
	return Matrix.mult(Matrix.pseudoInverse(A), b);
}
Matrix.nullSpace = function(A){ // nul(A)
	
}
// Matrix.eigenValuesAndVectors = function(A){
// 	var values = new Array(), vectors = new Array();
// 	var arr = new Array(values,vectors);
// 	var rows = A.rows(), cols = A.cols();
// 	// 
// 	var x = new Matrix(cols,1), y = new Matrix(cols,1);
// 	var i, len=15, temp, lambda, p, convergence;
// 	x.set(0,0, 1);
// 	p = Matrix.normInfinite(x);
// 	lambda = x.get(0,0);
// 	convergence = lambda;
// 	for(i=0;i<len;++i){
// convergence = lambda;
// 		console.log( i+"  "+Matrix.transpose(x).toString() + " | " + lambda );//+ " | " + p );
// 		Matrix.mult(y, A,x);
// 		p = Matrix.normInfinite(x); // this is suppossed to be an index, not a value
// 		lambda = -p;
// 		temp = x; x = y; y = temp;
// 		x.scale(1.0/p);
// convergence -= lambda;
// 		if( Math.abs(convergence/lambda) < 1E-6 ){
// 			break;
// 		}
// 	}
// 	values.push(lambda);
// 	vectors.push( x.scale(1.0/p) );
// 	return arr;
// }
Matrix.upperHessenberg = function(A){
var me = A;
    var s = numeric.dim(A);
    if(s.length !== 2 || s[0] !== s[1]) { throw new Error('numeric: toUpperHessenberg() only works on square matrices'); }
    var m = s[0], i,j,k,x,v,A = numeric.clone(me),B,C,Ai,Ci,Q = numeric.identity(m),Qi;
    for(j=0;j<m-2;j++) {
        x = Array(m-j-1);
        for(i=j+1;i<m;i++) { x[i-j-1] = A[i][j]; }
        if(numeric.norm2(x)>0) {
            v = numeric.house(x);
            B = numeric.getBlock(A,[j+1,j],[m-1,m-1]);
            C = numeric.tensor(v,numeric.dot(v,B));
            for(i=j+1;i<m;i++) { Ai = A[i]; Ci = C[i-j-1]; for(k=j;k<m;k++) Ai[k] -= 2*Ci[k-j]; }
            B = numeric.getBlock(A,[0,j+1],[m-1,m-1]);
            C = numeric.tensor(numeric.dot(B,v),v);
            for(i=0;i<m;i++) { Ai = A[i]; Ci = C[i]; for(k=j+1;k<m;k++) Ai[k] -= 2*Ci[k-j-1]; }
            B = Array(m-j-1);
            for(i=j+1;i<m;i++) B[i-j-1] = Q[i];
            C = numeric.tensor(v,numeric.dot(v,B));
            for(i=j+1;i<m;i++) { Qi = Q[i]; Ci = C[i-j-1]; for(k=0;k<m;k++) Qi[k] -= 2*Ci[k]; }
        }
    }
    return {H:A, Q:Q};
}
Matrix.eigenValues = function(A){ // eigenValues[]
	return eigenValuesAndVectors(A).values;
	/*var arr = new Array();
	// upper hessian
	// QR 
	return arr;*/
}
Matrix.eigenVectorsFromValues = function(A,values){ // eigenVectors[ [] ]
	/*
	// solve equation given lambdas
	var i, j, k, len = values.length;
	var lambda, vector, repeated, rows = A.rows(), cols = A.cols();
	var vectors = new Array();
	var AI = new Matrix(rows,cols);
	for(k=0;k<len;++k){ // for each eigenvalue
		lambda = values[k]; // ignore repeated value, because the vector should have been discovered in the previous iteration(s) ?????
		repeated = 0;
		for(i=0;i<k;++i){
			if(values[i]==lambda){
				++repeated;
				console.log("REPEATED");
			}
		}
		for(j=0;j<rows;++j){ // A - lambda*I
			for(i=0;i<cols;++i){
				AI._rows[j][i] = A._rows[j][i];
				if(i==j){
					 AI._rows[j][i] -= lambda;
				}
			}
		}
		console.log("--------------------------------------------------------------------------------------------------");
		//console.log( AI.toString() );
		AI = Matrix.RREF(AI);
		vector = new Matrix(rows,1);
		// do this once for every zero row
		vector.set(rows-1-repeated,0, 1.0); //  this assumes only one value to set - wont work for repeated eigenvalues`
		// http://tutorial.math.lamar.edu/Classes/DE/RepeatedEigenvalues.aspx 
		Matrix.backPropagate(AI,vector);
		vector.normalize();
		console.log( AI.toString() );
		console.log( vector.toString() );
		// vectors.push();
	}
	return vectors;
	*/
	return null;
}
Matrix.eigenVectors = function(A){
	return eigenValuesAndVectors(A).vectors;
	/*
	return Matrix.eigenVectorsFromValues(A, Matrix.eigenValues(A));
	*/
}
Matrix.eigenValuesAndVectors = function(A){
	var x = numeric.eig(A._rows); // these aren't necessarily ordered
	var values = x.lambda.x;
	var vectors = x.E.x;
	var vects = new Array();
	//console.log(vectors);
	//console.log( numeric.prettyPrint(vectors) );
	var i, j;
	var rows = vectors.length;
	var cols = vectors[0].length;
	for(i=0; i<cols; ++i){
		vects[i] = new Matrix(rows,1);
		for(j=0; j<rows; ++j){
			vects[i].set(j,0, vectors[j][i]);
		}
	}
	// for(var i = vectors.length; i--;){
	// 	//vectors[i] = new Matrix(1,vectors.length).setFromArray(vectors[i]);
	// }
	return {values:values, vectors:vects};
	/*
	var values = Matrix.eigenValues(A);
	var vectors = Matrix.eigenVectorsFromValues(A,values);
	return [values, vectors];
	*/
}
Matrix.trace = function(){ // 
	// = sum of main diagonals
}
Matrix.SVD = function(A){ // A = UEV^t  //  Amxn = Umxm * Smxn * Vnxn
if(A.rows()<A.cols()){
return Matrix.nonShittySVD(A);
}
	var val = numeric.svd(A._rows);
	var U = new Matrix(A.rows(),A.rows()).setFromArrayMatrix(val.U);
	var S = new Matrix(A.rows(),A.cols()).zero().setDiagonalsFromArray(val.S);
	var V = new Matrix(A.cols(),A.cols()).setFromArrayMatrix(val.V);
	U.cleanCheck();
	S.cleanCheck();
	V.cleanCheck();
	return {U:U, S:S, V:V};
	// REQUIRES FINDING EIGEN VECTORS
	// ui of U = kth singular value = 
	// s1 >= s2 >= s3 >= .. sn/m
	// 
	//
}
Matrix.QRCore = function(){ // 
// Q = normal basis for col(A)
// Q^t * A = R
	// gram-schmidt process (less precise - and time)
	// OR householder (more precise - and time)

}
Matrix.QR = function(A){ // rows >= cols
	var rowsA = A.rows(), colsA = A.cols();
	var i, j, k, t;
	var maxT = Math.min(rowsA-1,colsA);
	var Q = new Matrix(rowsA,rowsA); // orthogonal - basis for A cols
	var R = new Matrix(rowsA,colsA); // upper triangular
	for(t=0;t<maxT;++t){
		// 
	}
	// Q = Q1' * Q2' * ... * Qt'
	// R = Qt * ... * Q2 * Q1 = Q' * A
}
Matrix.QRP = function(A){ // (nearly) rank defecit
	return null;
}
Matrix.houseHolder = function(A){
	// reflect = x - 2*dot(x,v)*v
	// 
}
Matrix.eig = function(A){
	// upper hessenberg(tri-diagonal)
	// QR factorize
		// householder
	// eigenvalues
	// nulspace
		// eigenvectors = nul(A - l*I)  && multiplicity=orthogonality
}
Matrix.nonShittySVD = function(A){
	var rows = A.rows(), cols = A.cols();
/*
V = eigenvectors of A^t * A (right singular vectors)
S = eigenvalues  of A^t * A
U = V*vi
*/
/*
	var At = Matrix.transpose(A);
	var AA = Matrix.mult(At,A);
console.log(A.toString());
console.log(At.toString());
console.log(AA.toString());
	var U = new Matrix(rows,rows);
	var S = new Matrix(rows,cols);
	var V = new Matrix(cols,cols);
	return {U:U, S:S, V:V};
*/
// current lazy solution:
	if(rows<cols){
		var r = rows, c = cols;
		var A_ = A.copy();
		while(rows<cols){
			A.setRowFromArray(rows, Code.newArrayZeros(cols));
			++rows;
		}
		var svd = Matrix.SVD(A);
console.log("\n");
console.log(svd.U.toString());
console.log("\n");
console.log(svd.S.toString());
console.log("\n");
console.log(svd.V.toString());

		while(r<rows){
			A.dropLastRow();
			svd.U.dropLastRow();
			svd.U.dropLastCol();
			svd.S.dropLastRow();
			++r;
		}
		return svd;
	}else{
		return Matrix.SVD(A);
	}
}
Matrix.fromSVD = function(U,S,V){ // USV
	return Matrix.mult(U, Matrix.mult(S,Matrix.transpose(V)) );
}
Matrix.LU = function(P,L,U, A, pivot){ // [P,L,U] = A : LU Decomposition (Factorization)
	/*
	P = pivot matrix (if necessary) - [0,1,2,..,n]
	L = lower left [nxm]
	U = upper right, 1 diagonals [mxn]

	li1 = ai1
		lij = aij/li1

	if a pivot is ~0, then row interchange must be done
	*/
}
Matrix.mult = function(r, ain,bin){ // c = a*b 
	var b = bin, a = ain, c = Matrix._temp;
	if(bin===undefined){
		a = r; b = ain;
	}
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
	return r;
}
Matrix.add = function(r, ain,bin){ // c = a + b
	var b = bin, a = ain, c = Matrix._temp;
	if(bin===undefined){
		a = r; b = ain;
	}
	var i,j, rowsA=a._rowCount,rowsB=b._rowCount, colsA=a._colCount,colsB=b._colCount;
	c.setSize(rowsA,colsB);
	for(j=0;j<rowsA;++j){
		for(i=0;i<colsB;++i){
			c._rows[j][i] = a._rows[j][i] + b._rows[j][i];
		}
	}
	if(bin===undefined){
		return c.copy();
	}
	r.copy(c);
	return r;
}
Matrix.sub = function(r, ain,bin){ // c = a - b
	var b = bin, a = ain, c = Matrix._temp;
	if(bin===undefined){
		a = r; b = ain;
	}
	var i,j, rowsA=a._rowCount,rowsB=b._rowCount, colsA=a._colCount,colsB=b._colCount;
	c.setSize(rowsA,colsB);
	for(j=0;j<rowsA;++j){
		for(i=0;i<colsB;++i){
			c._rows[j][i] = a._rows[j][i] - b._rows[j][i];
		}
	}
	if(bin===undefined){
		return c.copy();
	}
	r.copy(c);
	return r;
}

Matrix.cp2tform = function(c, a){ // control points to transform - projective 3D transform
	// 
}
Matrix._temp = new Matrix(1,1);


Matrix.getFundamentalMatrix = function(normPointsA, normPointsB){ // x^T * F * x = 0 | [a b c; d e f; g h i]
	var len = fromPoints.length;
	var matA = new Matrix(2*len,8);
	var matB = new Matrix(2*len,1);
	var mat = new Matrix(3,3);
	// force rank 2
	return mat;
}

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
	//var x = Matrix.solve(matA,matB);
	var x = Matrix.mult(Matrix.pseudoInverseSimple(matA), matB); // 
	var projection = (new Matrix(3,3)).setFromArray([x.get(0,0),x.get(1,0),x.get(2,0), x.get(3,0),x.get(4,0),x.get(5,0), x.get(6,0),x.get(7,0),1.0]);
	// var pt = new V3D(0,0,0);
	// projection.multV2DtoV3D(pt,pt);
	// console.log(pt.toString());
	// projection.set(0,0, projection.get(0,0)/pt.z );
	// projection.set(1,1, projection.get(1,1)/pt.z );
	return projection;
}


Matrix.choleskyDecomposition = function(A){ // A = L*L^t
	var i, j, k, sum, piv, rows = A.rows();
	var L = new Matrix(rows,rows);
	for(i=0;i<rows;++i){
		for(j=i;j<rows;++j){
			sum = 0.0;
			for(k=0;k<i;++k){
				sum += L.get(i,k)*L.get(j,k);
			}
			if(i==j){
				piv = Math.sqrt(A.get(i,j) - sum);
				L.set(j,i, piv);
			}else{
				L.set(j,i, (A.get(i,j) - sum)/piv);
			}
		}
	}
	return L;
} // inv(A) = trans(inv(L)) * inv(L)

Matrix.LU = function(A){ // A = L*U
	var rows = A.rows();
	var cols = A.cols();
	var L = new Matrix(rows,rows);
	var U = new Matrix(rows,cols);
	// somebody DO something!
	return {L:L, U:U};
}


Matrix.eigenValuesAndVectors2D = function(a,b,c,d){
	var trace = a + d;
	var det = a*d - b*c;
	var left = trace*0.5;
	var right = Math.sqrt(trace*trace*0.25 - det);
	var l1 = left - right;
	var l2 = left + right;

	var a1 = (a-l1);
	var v1x = 0, v1y = 1;
	if(a1!=0){
		v1x = -b/a1;
	}else{
		var d1 = (d-l1);
		if(d1!=0){
			v1x = -c/d1;
		}else{
			v1x = 1; v1y = 0;
		}
	}
	var m1 = Math.sqrt(v1x*v1x + v1y*v1y);

	var a2 = (a-l2);
	var v2x = 0, v2y = 1;
	if(a2!=0){
		v2x = -b/a2;
	}else{
		var d2 = (d-l2);
		if(d2!=0){
			v2x = -c/d2;
		}else{
			v2x = 0; v2y = 1;
		}
	}
	var m2 = Math.sqrt(v2x*v2x + v2y*v2y);
	return {values:[l1,l2], vectors:[[v1x/m1,v1y/m1],[v2x/m2,v2y/m2]]};
}
Matrix.eigenValues2D = function(a,b,c,d){
	var trace = a + d;
	var det = a*d - b*c;
	var left = trace*0.5;
	var right = Math.sqrt(trace*trace*0.25 - det);
	var l1 = left - right;
	var l2 = left + right;
	return [l1, l2];
}
Matrix.eigenVectors2D = function(a,b,c,d){
	return eigenValuesAndVectors2D(a,b,c,d).vectors;
}
Matrix.eigen = function(A){ // eigenValues[], eigenVectors[[]] 
	var ret = numeric.eig(A._rows);
	var lambda = ret.lambda.x;
	var v = ret.E.x;
	var eigVec = new Array();
	wid = A.rows(); hei = A.cols();
	for(i=0;i<wid;++i){ // col
		eigVec.push(new Array(hei));
		for(j=0;j<hei;++j){ // row
			eigVec[i][j] = v[j][i];
		}
	}
	return [lambda, eigVec];
}
Matrix.power = function(A,power){
	var ret = Matrix.eigen(A);
	var lambda = ret[0];
	var eigVec = ret[1];
	var i, j, k, l, q, r, wid, hei, len;
	wid = A.cols();
	hei = A.rows();
	len = wid*hei;
	var B = new Array(len);
	var b = new Array(len);
	var col;
	for(k=0;k<hei;++k){ // eig
		l = Math.pow(lambda[k],power);
		if(isNaN(l)){ l = Math.pow(-lambda[k],power); } // negative root-powers ... damn
		v = eigVec[k];
		for(i=0;i<hei;++i){ // row
			col = k*wid+i;
			b[col] = new Array();
			b[col][0] = l*v[i];
			B[col] = new Array();
			for(j=0;j<hei;++j){ // row
				for(q=0;q<wid;++q){ // col
					r = j*wid+q;
					B[col][r] = 0.0;
					if(i==j){
						B[col][r] = v[q];
					}
				}
			}
		}
	}
	// convert to matrix problem
	var matB = (new Matrix(len,len)).setFromArrayMatrix(B);
	var matb = (new Matrix(len,1)).setFromArrayMatrix(b);
	// res = Matrix.mult(Matrix.pseudoInverse(matB), matb);
	res = Matrix.solve(matB,matb);
	var Apow = new Array(hei);
	var index = 0;
	for(i=0;i<hei;++i){
		Apow[i] = new Array(wid);
		for(j=0;j<wid;++j){
			Apow[i][j] = res.get([index],0);
			++index;
		}
	}
	return (new Matrix(A.rows(),A.cols())).setFromArrayMatrix(Apow);
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
