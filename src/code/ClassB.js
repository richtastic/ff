// ClassB.js
function ClassB(){
	Code.extendClass(this,ClassA,arguments);
	this.var.translate(10,0);
	Code.overrideClass(this, this.fxn, function(){
		console.log("B----");
		this.super(arguments.callee).fxn.call(this,arguments);
	});
}
