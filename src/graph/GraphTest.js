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
	var a = {"i":0, "p":new V2D(0,0)};
	var b = {"i":1, "p":new V2D(0,0)};
	var c = {"i":2, "p":new V2D(0,0)};
	var d = {"i":3, "p":new V2D(0,0)};
	var e = {"i":4, "p":new V2D(0,0)};



	// make list of edges
	var edges = [];

	edges.push([a,b, 1.0]);

	var maxVertex = null;
	for(var i=0; i<edges.length; ++i){
		var edge = edges[i];
		edge[0] = edge[0]["i"];
		edge[1] = edge[1]["i"];
		if(maxVertex===null){
			maxVertex = edge[0];
		}
		maxVertex = Math.max(maxVertex,edge[0]);
		maxVertex = Math.max(maxVertex,edge[1]);
	}
	var vertexCount = maxVertex+1;
	console.log("vertexCount: "+vertexCount);
	// show graph
	var graph = new Graph();
	var gVertexes = [];
	var gEdges = [];

	// graph.fromEdges();
	// vertexCount
	for(var i=0; i<vertexCount; ++i){
		var vertex = graph.addVertex();
		gVertexes.push(vertex);
	}
	for(var i=0; i<edges.length; ++i){
		var edge = edges[i];
		var a = edge[0];
		var b = edge[1];
		var w = edge[2];
			a = gVertexes[a];
			b = gVertexes[b];
		edge = graph.addEdge(a,b, w, Graph.Edge.DIRECTION_DUPLEX);
		gEdges.push(edge);
	}

	graph.display2D();

	// run alg:
	R3D.skeletalViewGraph(edges);

	// show skeleton

	// results
}
















