// Ransac.js

function Ransac(){
	this._canvas = new Canvas(null,0,0,Canvas.STAGE_FIT_FILL, false,false);
	this._stage = new Stage(this._canvas, 1000/20);
	this._root = new DO();
	this._stage.addChild(this._root);
	this._canvas.addListeners();
	this._stage.addListeners();
	this._stage.start();
	this._canvas.addFunction(Canvas.EVENT_MOUSE_CLICK,this.handleMouseClickFxn,this);
	// do stuff
	this.handleLoaded();
}
Ransac.prototype.handleMouseClickFxn = function(e){
	console.log(e.x,e.y)
}
Ransac.prototype.handleLoaded = function(e){
	console.log("Ransac");
	var lineM = 0.5, lineB = 2.0;
	var error = 0.2;
// SIGMA = ?
	var i, j, d, x, y, p, len, scale, offX, offY;
	var svd, coeff, m, b, y, L, A;
	var points = [];
	// inliers
	for(i=0;i<7;++i){
		x = Math.random()*10.0 - 0.0;
		y = lineM*x + lineB;
		// error
		x = x + Math.random()*error - error*0.5;
		y = y + Math.random()*error - error*0.5;
		// add
		points.push(new V2D(x,y));
	}
	// outliers
	points.push(new V2D(3.0,8.0));
	var minCount = 2;
	var epsilon = 1.0/points.length;
	var pOutlier = 0.5;
	var pDesired = 0.99;
	var maxIterations = Math.ceil(Math.log(1.0-pDesired)/Math.log( 1 - Math.pow(1-pOutlier,minCount) )); // initially assume 50% are outliers
	var maxLineDistance = 1.0; // this should be based on error
	console.log("ITERATIONS: "+maxIterations);
	console.log("DISTANCE: "+maxLineDistance);
	// show visually
	scale = 10.0;
	offX = 10.0;
	offY = 200.0;
	len = points.length;
	for(i=0;i<len;++i){
		p = points[i];
		d = new DO();
		d.graphics().clear();
		d.graphics().setFill(0x33FF0000);
		d.graphics().setLine(1.0,0xFFFF0000);
		d.graphics().beginPath();
		d.graphics().drawCircle(p.x*scale + offX,-p.y*scale + offY,3.0);
		d.graphics().endPath();
		d.graphics().strokeLine();
		d.graphics().fill();
		this._root.addChild(d);
	}
	// RANSAC
	var index, support, consensus, dist, org=new V2D(), dir=new V2D();
	len = points.length;
	var maxSupport = 0;
	var maxConsensus = null;
	var maxModel = null;
	A = new Matrix(minCount,3);
	for(j=0;j<maxIterations;++j){
		var pts = [];
		var indexList = [];
		for(i=0;i<len;++i){ indexList[i] = i; }
		for(i=0;i<minCount;++i){
			index = Math.floor(Math.random()*indexList.length);
			index = indexList.splice(index,1);
			pts.push( points[ index ] );
		}
		// line fitting
		for(i=0;i<minCount;++i){
			p = pts[i];
			A.set(i,0, p.x);
			A.set(i,1, 1.0);
			A.set(i,2, -p.y);
		}
		svd = Matrix.SVD(A);
		coeff = svd.V.colToArray(2);
		m = coeff[0];
		b = coeff[1];
		y = coeff[2]; // deviates from 1
		m /= y;
		b /= y;
		//L = new Matrix(1,2).setFromArray([m,b]);
		// find consensus set
		consensus = [];
// sum distances and rate based on inverse of average/total distance?
		for(i=0;i<len;++i){
			p = points[i];
			org.set(0,b)
			dir.set(1,m+b);
			dist = Code.distancePointLine2D(org,dir, p);
			if(dist <= maxLineDistance){
				consensus.push(p);
			}
		}
// SHOULD ALWAYS HAVE A MINIMUM OF 2
		console.log(consensus.length);
		// save consensus
		if(consensus.length>maxSupport){
			maxSupport = consensus.length;
			maxConsensus = consensus;
			maxModel = [m,b];
maxIterations = maxIterations// UPDATE THIS BASED ON NEW CEILING FOR OUTLIERS
		}

	}
	// get best model/consensus/support
	consensus = maxConsensus;
	support = maxSupport;
	m = maxModel[0];
	b = maxModel[1];
	console.log("CONSENSUS: "+support+" := "+m+" x + "+b);
	// show line
	d = new DO();
	d.graphics().clear();
	d.graphics().setFill(0xFF000000);
	d.graphics().setLine(1.0,0xFF0000FF);
	d.graphics().beginPath();
	x = 0.0; y = m*x + b;
	d.graphics().moveTo(scale*x + offX, -scale*y + offY);
	x = 10.0; y = m*x + b;
	d.graphics().lineTo(scale*x + offX, -scale*y + offY);
	d.graphics().endPath();
	d.graphics().strokeLine();
	d.graphics().fill();
	this._root.addChild(d);
	console.log(".........");
}
Ransac.prototype.handleEnterFrame = function(e){
	//console.log(e);
}




