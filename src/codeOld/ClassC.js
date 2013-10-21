// ClassC.js
function ClassC(){
	Code.extendClass(this,ClassB,arguments);
	this.var.translate(10,0);
	self.fxn = Code.overrideClass(this, this.fxn, function(){
		console.log("C----");
		this.super(self.fxn).fxn.call(this,arguments);
	});
}
/*
var A = new ClassA();
var B = new ClassB();
var C = new ClassC();
A.fxn();
B.fxn();
C.fxn();
*/