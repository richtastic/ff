// SpaceTest.js
function SpaceTest(){
	this._canvas = new Canvas(null, 400,600, Canvas.STAGE_FIT_FILL, false);
	this._stage = new Stage(this._canvas, (1/10)*1000);
	// this._stage.start();



	this._canvas.addListeners();
	this._stage.addListeners();
	this._stage.start();

	this.test3DCone();

}
SpaceTest.prototype.test3DCone = function(){
	console.log("test3DCone")
	var min = new V3D(0,0,0);
	var max = new V3D(10,10,10);
	var siz = V3D.sub(max,min);
	// toPoint, max, min
	var space = new OctTree(null, min,max);

	var pointCount = 500;

	for(var i=0; i<pointCount; ++i){
		var point = new V3D();
		point.x = Math.random()*siz.x + min.x;
		point.y = Math.random()*siz.y + min.y;
		point.z = 0;
		space.insertObject(point);
	}


	var center = new V3D(2,9,0);
	var focus = new V3D(6,1,0);
	var radius = 0.50;
	var dir = V3D.sub(focus, center);
	var per = dir.copy().rotate(new V3D(0,0,1), Math.PI*0.5);
		per.length(radius);
	var ratio = radius/dir.length();

	var inside = space.objectsInsideCone(center,dir,ratio);

	var pointSizeB = 0.5;



	var displaySize = 800;
	var displayScale = displaySize/Math.max(siz.x,siz.y,siz.z);

	var display = new DO();
	this._stage.addChild(display);

	// background:
	var points = space.toArray();
	for(var i=0; i<points.length; ++i){
		break;
		var point = points[i];
		var px = point.x * displayScale;
		var py = point.y * displayScale;

		var d = new DO();
		d.graphics().setFill(0xFF999999);
			d.graphics().beginPath();
			d.graphics().drawCircle(px,py, 5);
			d.graphics().endPath();
			d.graphics().fill();
		display.addChild(d);
	}

	// inside:

	var points = inside;
	for(var i=0; i<points.length; ++i){
		var point = points[i];
		var px = point.x * displayScale;
		var py = point.y * displayScale;
		var r = pointSizeB * displayScale;
		var d = new DO();
		d.graphics().setFill(0x66FF0000);
			d.graphics().beginPath();
			d.graphics().drawCircle(px,py, r);
			d.graphics().endPath();
			d.graphics().fill();
		display.addChild(d);
	}


	// patch:
	var points = inside;
	for(var i=0; i<points.length; ++i){
		var point = points[i];
		var px = point.x * displayScale;
		var py = point.y * displayScale;
		var r = pointSizeB * displayScale;

		var pointSizeA = radius;
		var pointCenterB = point;



		var closestB = Code.closestPointLine3D(center,dir, pointCenterB);
		var distanceD = V3D.distance(center,focus); // === dir.length()
		var distanced = V3D.distance(center,closestB);
		if(distanced>distanceD){ // behind
			continue;
		}

		var localSizeA = (distanced/distanceD)*pointSizeA;

		var distance = V3D.distance(closestB, pointCenterB);
		if(distance < (localSizeA+pointSizeB)*1.0){  // possibly also add padding
			var d = new DO();
			d.graphics().setFill(0x6600CC00);
				d.graphics().beginPath();
				d.graphics().drawCircle(px,py, r);
				d.graphics().endPath();
				d.graphics().fill();
			display.addChild(d);
		}
	}

	// cone
	var px, py;
	var d = new DO();
	d.graphics().setLine(2.0,0xFFCC00CC);
		d.graphics().beginPath();
		px = (center.x + 0) * displayScale;
		py = (center.y + 0) * displayScale;
		d.graphics().lineTo(px,py);
		px = (focus.x + per.x + 0) * displayScale;
		py = (focus.y + per.y + 0) * displayScale;
		d.graphics().lineTo(px,py);
		px = (focus.x - per.x + 0) * displayScale;
		py = (focus.y - per.y + 0) * displayScale;
		d.graphics().lineTo(px,py);
		d.graphics().endPath();
		d.graphics().strokeLine();
	display.addChild(d);

	// line
	var d = new DO();
	d.graphics().setLine(2.0,0xFF0000CC);
		d.graphics().beginPath();
		px = (center.x + 0) * displayScale;
		py = (center.y + 0) * displayScale;
		d.graphics().moveTo(px,py);
		px = (focus.x + 0) * displayScale;
		py = (focus.y + 0) * displayScale;
		d.graphics().lineTo(px,py);
		d.graphics().endPath();
		d.graphics().strokeLine();
	display.addChild(d);
	// ...
	// NEW METHOD:
	// find closest point of sphere2 along ray from sphere1-viewcenter

	// find expected radius along cone



	// if distance between center & line point < rad1 + rad2 == intersection



	console.log(display)

	// ...
}



/*


*/
