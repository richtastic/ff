// Matrix.js
Matrix.temp = new Matrix();

Matrix.mult = function(c, a,b){ // c = a*b 
	//
}

function Matrix(){
	var self = this;
	this._elements = null;
	this._rows = 0;
	this._cols = 0;
// -----------------------------------------------
	this.identity = function(){
		//
	}
	this.set = function(a,b,c){
		self._elements[] = c;
	}
	this.copy = function(m){
		//
	}
	this.inverse = function(m){ // http://www.dr-lex.be/random/matrix_inv.html
		var det = 1/(m.a*m.d - m.b*m.c);
		var a = m.d*det;
		var b = -m.b*det;
		var x = (m.b*m.y-m.d*m.x)*det;
		var c = -m.c*det;
		var d = m.a*det;
		var y = (m.c*m.x-m.a*m.y)*det;
		self.a = a; self.b = b; self.c = c; self.d = d; self.x = x; self.y = y;
	};
	LU
// -----------------------------------------------
	this.getParameters = function(){
		return new Array(self.a,self.b,self.c,self.d,self.x,self.y);
	}
	this.toString = function(){
		return "[ Matrix ]";
	}
	this.kill = function(){
		//
	}
// ----------------------------------------------- constructor
	//this.identity();
}





