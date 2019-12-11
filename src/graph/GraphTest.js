// GraphTest.js
function GraphTest(){
	console.log("create");
	this.handleLoaded();
}

GraphTest.prototype.handleLoaded = function(){
	this._canvas = new Canvas(null,600,400,Canvas.STAGE_FIT_FILL);
	this._stage = new Stage(this._canvas, 1000/20);
	this._keyboard = new Keyboard();
	this._root = new DO();
	this._stage.addChild(this._root);
	this._imageLoader = new ImageLoader();
	console.log("loaded");
	this.addListeners();

	this.test1();
}

GraphTest.prototype.addListeners = function(){
	this._canvas.addListeners();
	this._stage.addListeners();
	this._keyboard.addListeners();
	this._stage.start();
	GLOBALSTAGE = this._stage;
}



GraphTest.prototype.test1 = function(){
	console.log("test1");

	// skeletal graph

	// make list of nodes
	var a = {"i":0,  "p":new V2D(0,0), "n":"a"};
	var b = {"i":1,  "p":new V2D(0,0), "n":"b"};
	var c = {"i":2,  "p":new V2D(0,0), "n":"c"};
	var d = {"i":3,  "p":new V2D(0,0), "n":"d"};
	var e = {"i":4,  "p":new V2D(0,0), "n":"e"};
	var f = {"i":5,  "p":new V2D(0,0), "n":"f"};
	var g = {"i":6,  "p":new V2D(0,0), "n":"g"};
	var h = {"i":7,  "p":new V2D(0,0), "n":"h"};
	var i = {"i":8,  "p":new V2D(0,0), "n":"i"};
	var j = {"i":9,  "p":new V2D(0,0), "n":"j"};
	var k = {"i":10, "p":new V2D(0,0), "n":"k"};
	var l = {"i":11, "p":new V2D(0,0), "n":"l"};
	var m = {"i":12, "p":new V2D(0,0), "n":"m"};
	var n = {"i":13, "p":new V2D(0,0), "n":"n"};
	var o = {"i":14, "p":new V2D(0,0), "n":"o"};
	var p = {"i":15, "p":new V2D(0,0), "n":"p"};
	var q = {"i":16, "p":new V2D(0,0), "n":"q"};
	var r = {"i":17, "p":new V2D(0,0), "n":"r"};
	var s = {"i":18, "p":new V2D(0,0), "n":"s"};
	var t = {"i":19, "p":new V2D(0,0), "n":"t"};
	var u = {"i":20, "p":new V2D(0,0), "n":"u"};
	var v = {"i":21, "p":new V2D(0,0), "n":"v"};
	var w = {"i":22, "p":new V2D(0,0), "n":"w"};
	var x = {"i":23, "p":new V2D(0,0), "n":"x"};
	var y = {"i":24, "p":new V2D(0,0), "n":"y"};
	var z = {"i":25, "p":new V2D(0,0), "n":"z"};

	var letters = [a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z];
	var indexToLetter = {};
	for(var index=0; index<letters.length; ++index){
		var letter = letters[index];
		indexToLetter[letter["i"]] = letter;
	}


	// make list of edges
	var edges = [];


	// TESTING:
	// edges.push([a,b, 1.0]);
	// edges.push([a,c, 1.0]);
	// edges.push([b,c, 1.0]);
	// edges.push([a,d, 1.0]);

	edges.push([a,b, 1.0]);
	edges.push([a,c, 2.0]);
	edges.push([a,d, 1.0]);
	edges.push([b,d, 1.0]);
	edges.push([c,d, 1.0]);
	edges.push([d,e, 2.0]);
	edges.push([d,f, 1.0]);
	edges.push([d,g, 1.0]);
	edges.push([e,f, 1.0]);
	edges.push([f,h, 3.0]);
	edges.push([g,j, 1.0]);
	edges.push([g,k, 3.0]);
	edges.push([g,l, 1.0]);
	edges.push([h,i, 1.0]);
	edges.push([i,j, 2.0]);
	edges.push([j,k, 1.0]);
	edges.push([k,l, 1.0]);
	edges.push([k,m, 1.0]);
	edges.push([m,n, 1.0]);
	edges.push([m,w, 6.0]);
	edges.push([n,o, 1.0]);
	edges.push([n,q, 2.0]);
	edges.push([n,r, 1.0]);
	edges.push([o,p, 1.0]);
	edges.push([p,q, 1.0]);
	edges.push([r,s, 2.0]);
	edges.push([r,u, 1.0]);
	edges.push([s,t, 1.0]);
	edges.push([s,u, 1.0]);
	edges.push([s,v, 2.0]);
	edges.push([t,v, 2.0]);
	edges.push([u,x, 1.0]);
	edges.push([v,z, 1.0]);
	edges.push([w,x, 1.0]);
	edges.push([x,y, 1.0]);

	
	// ...

	
	for(var i=0; i<edges.length; ++i){
		var edge = edges[i];
		edge[0] = edge[0]["i"];
		edge[1] = edge[1]["i"];
	}

	// run alg:
	var info = R3D.skeletalViewGraph(edges);
	console.log(info);
	throw "?"
}
















