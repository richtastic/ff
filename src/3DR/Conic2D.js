// Conic2D.js

function Conic2D(){
	this._canvas = new Canvas(null,0,0,Canvas.STAGE_FIT_FILL, false,false);
	this._stage = new Stage(this._canvas, 1000/20);
	this._root = new DO();
	this._stage.addChild(this._root);
	this._canvas.addListeners();
	this._stage.addListeners();
	this._stage.start();
	this._canvas.addFunction(Canvas.EVENT_MOUSE_CLICK,this.handleMouseClickFxn,this);
	// import image to work with
	//var imageLoader = new ImageLoader("./images/",["desktop1.png"], this,this.handleImageLoaded,null);
	//imageLoader.load();
	this.handleLoaded();
}
Conic2D.prototype.handleMouseClickFxn = function(e){
	//console.log(e.x,e.y)
}
Conic2D.prototype.handleLoaded = function(){
	console.log("conicular");
	var i, j, k, l, m, d, u, v, t;
	var C = new Matrix(3,3);
	var x = new Matrix(3,1);
	var y = new Matrix(1,3);
	var v = new Matrix(3,1);
	var p = new V3D();
	var q = new V3D();
	//var C = new Matrix3D();


	// circle: 2,0,2,0,0,10
	// ellipse: 2,1,6,20,0,2
	// parabola:
	// hyperbola:
	var a = 2.0; // x*x
	var b = 1.0; // x*y
	var c = 0.0; // y*y
	var d = 3.0; // x*z | x
	var e = -1.0; // y*z | y
	var f = -1.0; // z*z | c
	C.setFromArray([a,b*0.5,d*0.5, b*0.5,c,e*0.5, d*0.5,e*0.5,f]);
	console.log( a+", "+b+", "+c+", "+d+", "+e+", "+f);
	console.log( C.toString() );

	var wid = 600;
	var hei = 400;
	var img = new Array(wid*hei);
	var col, val;
	var scale = 0.1;
	var minVal = 1E9;
	for(j=0;j<hei;++j){
		for(i=0;i<wid;++i){
			p.set(i-wid*0.5,j-hei*0.5,1.0);
			p.x *= scale; p.y *= scale;
			//var q = new V3D();
			//C.multV3DtoV3D(q,p);
			//q.homo();
			//x.setFromArray([p.x,p.y,p.z]);
			x.setFromArray([p.x,p.y,p.z]);
			y.setFromArray([p.x,p.y,p.z]);
			v = Matrix.mult(y,Matrix.mult(C,x));
			val = v.get(0,0);
			minVal = Math.min(minVal,val);
			//console.log(val)
			//val *= 0.1;
			val = Math.abs(val);
			//val = Math.random()*300.0;
			val = Math.round(val);
			val = Math.min(Math.max(0,val),255);
			val = 255-val;
			if(i==Math.floor(wid*0.5) && j==Math.floor(hei*0.5) ){
				val = 0;
			}
			col = Code.getColARGB(0xFF,val,val,val);
			img[(hei-j-1)*wid+i] = col;
		}
	}
	// plot some points
	p.set(-20,2,1);
	C.multV3DtoV3D(q,p);
	//q.homo();
console.log(p.toString()+" -> "+q.toString())
	i = Math.round(p.x+wid*0.5);
	j = Math.round(p.y+hei*0.5);
	img[j*wid+i] = 0xFFFF0000;
	i = Math.round(q.x+wid*0.5);
	j = Math.round(q.y+hei*0.5);
	img[j*wid+i] = 0xFF0000FF;
	// show image
	var imagePlane = this._stage.getARGBAsImage(img, wid,hei);
	d = new DOImage(imagePlane);
	d.matrix().identity();
	//d.matrix().translate(wid,0);
	this._root.addChild(d);
	console.log(".........");
	
console.log(minVal)

	/*
	var l1 = new V3D(2,2,1);
	var l2 = new V3D(2,2,2);
	var p = V3D.cross(l1,l2);
	// 1,2,1 x 1,2,2 =  2,-1,0
	//
	console.log(l1.toString());
	console.log(l2.toString());
	console.log(p.toString());
	*/

}
Conic2D.prototype.handleEnterFrame = function(e){
	//console.log(e);
}




