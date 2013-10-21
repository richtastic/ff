// ClassA.js
function ClassA(){
	this.var = new Matrix2D();
	this.fxn = function(){
		console.log("A");
		console.log(this.var.toString());
	}
}
