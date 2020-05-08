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




	// make custom graph:
	graph = new Graph();
	var a = new V2D(3,9);
	var b = new V2D(1,8);
	var c = new V2D(0,6);
	var d = new V2D(1,4);
	var e = new V2D(3,3);
	var f = new V2D(3,6);
	var g = new V2D(6,6);
	var h = new V2D(6,8);
	var i = new V2D(9,6);
	var j = new V2D(9,8);
	var k = new V2D(12,8);
	var l = new V2D(15,8);
	var m = new V2D(15,6);
	var n = new V2D(18,6);
	var o = new V2D(12,6);
	var p = new V2D(15,4);
	var q = new V2D(13,3);
	var r = new V2D(9,4);
	var s = new V2D(11,3);
	var t = new V2D(8,3);
	var u = new V2D(9,1);
	var v = new V2D(11,0);
	var w = new V2D(13,1);
	var x = new V2D(9,-1);
	var y = new V2D(11,-2);
	var z = new V2D(13,-1);

	var points = [a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z];

	var vertexes = [];
	
	for(var i=0; i<points.length; ++i){
		points[i]
		var point = points[i];
		var data = {};
			data["index"] = i;
			data["point"] = point;
			data["group"] = null;
		v = graph.addVertex();
		v.data(data);
		vertexes.push(v);
	}
	a = vertexes[0];
	b = vertexes[1];
	c = vertexes[2];
	d = vertexes[3];
	e = vertexes[4];
	f = vertexes[5];
	g = vertexes[6];
	h = vertexes[7];
	i = vertexes[8];
	j = vertexes[9];
	k = vertexes[10];
	l = vertexes[11];
	m = vertexes[12];
	n = vertexes[13];
	o = vertexes[14];
	p = vertexes[15];
	q = vertexes[16];
	r = vertexes[17];
	s = vertexes[18];
	t = vertexes[19];
	u = vertexes[20];
	v = vertexes[21];
	w = vertexes[22];
	x = vertexes[23];
	y = vertexes[24];
	z = vertexes[25];
	// add edges: connect local components (wth some randomness)
	
	graph.addEdgeDuplex(f,a, 1.0);
	graph.addEdgeDuplex(f,b, 1.0);
	graph.addEdgeDuplex(f,c, 1.0);
	graph.addEdgeDuplex(f,d, 1.0);
	graph.addEdgeDuplex(f,e, 1.0);
	graph.addEdgeDuplex(f,g, 1.0);

	graph.addEdgeDuplex(g,h, 1.0);
	graph.addEdgeDuplex(g,i, 1.0);
	graph.addEdgeDuplex(i,o, 1.0);
	graph.addEdgeDuplex(i,r, 1.0);

	graph.addEdgeDuplex(i,j, 1.0);
	graph.addEdgeDuplex(j,k, 1.0);
	graph.addEdgeDuplex(k,l, 1.0);
	graph.addEdgeDuplex(l,m, 1.0);
	graph.addEdgeDuplex(m,n, 1.0);
	graph.addEdgeDuplex(m,p, 1.0);
	graph.addEdgeDuplex(m,o, 1.0);
	graph.addEdgeDuplex(p,q, 1.0);
	graph.addEdgeDuplex(q,s, 1.0);
	graph.addEdgeDuplex(r,s, 1.0);

	graph.addEdgeDuplex(s,t, 1.0);
	graph.addEdgeDuplex(s,u, 1.0);
	graph.addEdgeDuplex(s,v, 1.0);
	graph.addEdgeDuplex(s,w, 1.0);

	graph.addEdgeDuplex(v,x, 1.0);
	graph.addEdgeDuplex(v,y, 1.0);
	graph.addEdgeDuplex(v,z, 1.0);

	var edges = Code.copyArray(graph.edges());
	console.log(edges);
	// throw "?"



	// var data = {};
	// data["index"] = i;
	// data["point"] = p;
	// data["group"] = null;


	// var edge = graph.addEdgeDuplex(vertex,neighbor, weight);

// throw "..."





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


	// full
	var fullSkeletonEdges = [];
skeletonGroupEdges.push(skeletonEdges);
	// Code.arrayPushArrays(fullSkeletonEdges,skeletonGroupEdges);
	for(var i=0; i<skeletonGroupEdges.length; ++i){
		var group = skeletonGroupEdges[i];
		console.log(group);
		Code.arrayPushArray(fullSkeletonEdges, group);
	}
skeletonGroupEdges.pop();

console.log(fullSkeletonEdges);

	// for(var j=0; j<group.length; ++j){
	// 	var edge = group[j];
	// }


	var info = Graph.groupsFromEdges(fullSkeletonEdges, 4);
	var partitionGroups = info["groups"];
	console.log(partitionGroups);

// throw "?"
/*

	// partition groups
	var k = 5;
	var groups = Graph.groupsFromEdges(skeletonEdges, k);
	console.log(groups);
throw "?"
	// var partitions = Graph.partitionFromEdges(skeletonEdges, k);
	// ...
	// add overlap
*/

	// display
	var displayScale = 50.0;
	var displayOffset = new V2D(800,200);

	// for(var i=0; i<vertexCount; ++i){
	for(var i=0; i<vertexes.length; ++i){
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
		d.graphics().setLine(3.0,0xFF990000);
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
		// console.log(group);


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


	for(var i=0; i<fullSkeletonEdges.length; ++i){
		var edge = fullSkeletonEdges[i];
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
		d.graphics().setLine(8.0,0x6600CC00);
		d.graphics().beginPath();
		d.graphics().moveTo(pA.x*displayScale,pA.y*displayScale);
		d.graphics().lineTo(pB.x*displayScale,pB.y*displayScale);
		d.graphics().strokeLine();
		d.graphics().endPath();
		// 
		d.matrix().translate(displayOffset.x, displayOffset.y);
		GLOBALSTAGE.addChild(d);
	}
	
	// display groups:
	// var rad = 9.0;
	var colors = [0xFFFF0000,0xFF00FF00,0xFF0000FF,0xFFCCCC00,0xFFCC00CC,0xFF00CCCC,0xFFCCCCCC,0xFF6600CC,0xFFCC0066,0xFF0066CC,0xFF00CC66,0xFF333333];
	// var sizes = [5,7,9,11,13,15,17,19,21,23,25];
	var sizes = [15,17,19,21,23,25,27,29,31];
	for(var i=0; i<partitionGroups.length; ++i){
		var group = partitionGroups[i];
console.log(group.length);

		var points = [];
		for(var j=0; j<group.length; ++j){
			var vertexID = group[j];
			var vertex = vertexes[vertexID];
			var data = vertex.data();
			var p = data["point"];
			points.push(p);
		}
		/*
		// console.log(points);
		var hull = Code.convexHull(points);
		// console.log(hull);
		var distance = 11;
		// var polygon = Code.expandPolygon2D(hull,distance);
		var polygon = hull;
		// console.log(polygon);
		for(var j=0; j<polygon.length; ++j){
			polygon[j].scale(displayScale);
		}
		console.log(polygon);

		var d = new DO();
		var color = colors[i%colors.length];
		// var size = sizes[i%sizes.length]
			d.graphics().setLine(3.0,color);
			d.graphics().beginPath();
			d.graphics().drawPolygon(polygon);
			d.graphics().endPath();
			d.graphics().strokeLine();
			d.matrix().translate(displayOffset.x, displayOffset.y);
			GLOBALSTAGE.addChild(d);

		*/
		for(var j=0; j<group.length; ++j){
			var vertexID = group[j];
			var vertex = vertexes[vertexID];
			var data = vertex.data();
			var p = data["point"];
			// console.log(p);
			var d = new DO();
			// d.graphics().setLine(1.0,0xFF00CC00);
			var color = colors[i%colors.length];
			var size = sizes[i%sizes.length]
			// color = color & 0x00FFFFFF;
			// color = color | 0x66000000;
			// d.graphics().setFill(color);
			d.graphics().setLine(3.0,color);
			d.graphics().beginPath();
			d.graphics().drawCircle(p.x*displayScale,p.y*displayScale, size);
			// d.graphics().lineTo(pB.x*displayScale,pB.y*displayScale);
			d.graphics().strokeLine();
			d.graphics().endPath();
			// d.graphics().fill();
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







