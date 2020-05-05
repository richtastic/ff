// GraphPartition.js
function GraphPartition(){
	console.log("GraphPartition");
	this.handleLoaded();
}

GraphPartition.prototype.handleLoaded = function(){
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

GraphPartition.prototype.addListeners = function(){
	this._canvas.addListeners();
	this._stage.addListeners();
	this._keyboard.addListeners();
	this._stage.start();
	GLOBALSTAGE = this._stage;
}



GraphPartition.prototype.test1 = function(){
	console.log("test1");

	// var rectSize = 10;
	// var vertexCount = 20;
	// var neighborMin = 1;
	// var neighborRand = 3;

	var rectSize = new V2D(20,15);
	var vertexCount = 50;
	var neighborMin = 3;
	var neighborRand = 5;


	// var rectSize = new V2D(30,20);
	// var vertexCount = 150;
	// var neighborMin = 3;
	// var neighborRand = 10;

	// make random graph - 2D geometry
	var toPoint = function(v){
		return v.data()["point"];
	}
	var space = new QuadTree(toPoint);
	var graph = new Graph();
	var vertexes = [];
	
	for(var i=0; i<vertexCount; ++i){
		var p = new V2D();
		p.x = (Math.random()-0.5)*rectSize.x;
		p.y = (Math.random()-0.5)*rectSize.y;
		var data = {};
			data["index"] = i;
			data["point"] = p;
			data["group"] = null;
		v = graph.addVertex();
		v.data(data);
		vertexes.push(v);
		space.insertObject(v);
	}
	
	// add edges: connect local components (wth some randomness)
	var edges = [];
	for(var i=0; i<vertexCount; ++i){
		var vertex = vertexes[i];
		var data = vertex.data();
		var p = data["point"];
		var n = neighborMin + Math.round(Math.random()*neighborRand) + 1;
		// vertex,neighbor
		var neighbors = space.kNN(p,n);
		for(var n=0; n<neighbors.length; ++n){
			var neighbor = neighbors[n];
			if(vertex==neighbor){
				continue;
			}
			var edge = graph.edgeForVertexes(vertex,neighbor);
			if(!edge){ // vertex , neighbor
				var weight = Math.random();
				weight = 1.0;
				var edge = graph.addEdgeDuplex(vertex,neighbor, weight);
				edges.push(edge);
			}
		}
	}

	// skeleton backbone:	
	var skeletalEdges = [];
	for(var i=0; i<edges.length; ++i){
		var edge = edges[i];
		var a = edge.A();
			a = a.data()["index"];
		var b = edge.B();
			b = b.data()["index"];
		var w = edge.weight();
		skeletalEdges.push([a,b,w]);
	}
	console.log(skeletalEdges);
	// make skeletal graph
	var info = R3D.skeletalViewGraph(skeletalEdges);
	console.log(info);
	var skeletonVertexes = info["skeletonVertexes"];
	var skeletonEdges = info["skeletonEdges"];
	var skeletonGroupEdges = info["groupEdges"];


	// partition groups
	var k = 5;
	var partitions = Graph.partitionFromEdges(skeletonEdges, k);
	// ...
	// add overlap

	// display
	var displayScale = 50.0;
	var displayOffset = new V2D(800,500);

	for(var i=0; i<vertexCount; ++i){
		var v = vertexes[i];
		var data = v.data();
		var p = data["point"];
		// console.log(p);

		var d = new DO();
		// d.graphics().setLine(1.0,0xCC00FF00);
		d.graphics().setFill(0xFFFF0000);
		d.graphics().beginPath();
		d.graphics().drawCircle(p.x*displayScale + 0, p.y*displayScale + 0, 4.0);
		// d.graphics().moveTo(pA.x,pA.y);
		// d.graphics().lineTo(pB.x,pB.y + imageA.height());
		// d.graphics().strokeLine();
		d.graphics().fill();
		d.graphics().endPath();

		d.matrix().translate(displayOffset.x, displayOffset.y);
		GLOBALSTAGE.addChild(d);
	}


	for(var i=0; i<edges.length; ++i){
		var edge = edges[i];
		var a = edge.A().data();
		var b = edge.B().data();
		var pA = a["point"];
		var pB = b["point"];

		var d = new DO();
		d.graphics().setLine(1.0,0xFFCC00FF);
		// d.graphics().setFill(0xFFFF0000);
		d.graphics().beginPath();
		// d.graphics().drawCircle(p.x*displayScale + 0, p.y*displayScale + 0, 3);
		d.graphics().moveTo(pA.x*displayScale,pA.y*displayScale);
		d.graphics().lineTo(pB.x*displayScale,pB.y*displayScale);
		d.graphics().strokeLine();
		// d.graphics().fill();
		d.graphics().endPath();

		d.matrix().translate(displayOffset.x, displayOffset.y);
		GLOBALSTAGE.addChild(d);
	}

	for(var i=0; i<skeletonEdges.length; ++i){
		var edge = skeletonEdges[i];
		var a = edge[0];
		var b = edge[1];
			a = vertexes[a];
			b = vertexes[b];
		var edge = graph.edgeForVertexes(a,b);
		// 
		var a = edge.A().data();
		var b = edge.B().data();
		var pA = a["point"];
		var pB = b["point"];
		var d = new DO();
		d.graphics().setLine(2.0,0xFF330033);
		d.graphics().beginPath();
		d.graphics().moveTo(pA.x*displayScale,pA.y*displayScale);
		d.graphics().lineTo(pB.x*displayScale,pB.y*displayScale);
		d.graphics().strokeLine();
		d.graphics().endPath();
		// 
		d.matrix().translate(displayOffset.x, displayOffset.y);
		GLOBALSTAGE.addChild(d);
	}

	for(var i=0; i<skeletonGroupEdges.length; ++i){
		var group = skeletonGroupEdges[i];
		console.log(group);


		for(var j=0; j<group.length; ++j){
			var edge = group[j];
				
			var a = edge[0];
			var b = edge[1];
				a = vertexes[a];
				b = vertexes[b];
			var edge = graph.edgeForVertexes(a,b);
			var a = edge.A().data();
			var b = edge.B().data();
			var pA = a["point"];
			var pB = b["point"];

			var d = new DO();
			d.graphics().setLine(1.0,0xFF0000FF);
			d.graphics().beginPath();
			d.graphics().moveTo(pA.x*displayScale,pA.y*displayScale);
			d.graphics().lineTo(pB.x*displayScale,pB.y*displayScale);
			d.graphics().strokeLine();
			d.graphics().endPath();
			// 
			d.matrix().translate(displayOffset.x, displayOffset.y);
			GLOBALSTAGE.addChild(d);
		}
	}
	




throw "?"







throw "..."
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







