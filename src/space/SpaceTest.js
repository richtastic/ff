// SpaceTest.js
function SpaceTest(){
	this._canvas = new Canvas(null, 400,600, Canvas.STAGE_FIT_FILL, false);
	this._stage = new Stage(this._canvas, (1/10)*1000);
	// this._stage.start();



	this._canvas.addListeners();
	this._stage.addListeners();
	this._stage.start();

	// this.test3DCone();

	this.test2DSearch();

}
SpaceTest.prototype.test2DSearch = function(){
	console.log("test2DSearch")
	var min = new V2D(0,0);
	var max = new V2D(10,10);
	var siz = V2D.sub(max,min);
	var toRect = function(tri){
		var rect = Rect.fromPointArray([tri["A"],tri["B"],tri["C"]]);
		return rect;
	}
	var space = new QuadSpace(toRect, min,max);

	var triangleCount = 500;
	var tSize = Math.min(siz.x,siz.y)*0.2;
	var rangeX = siz.x-tSize;
	var rangeY = siz.y-tSize;

	for(var i=0; i<triangleCount; ++i){
		var p = new V2D(Math.random()*rangeX + min.x + tSize*0.5, Math.random()*rangeY + min.y + tSize*0.5);
		var a = new V2D(p.x + Math.random()*tSize*0.5, p.y + Math.random()*tSize*0.5);
		var b = new V2D(p.x + Math.random()*tSize*0.5, p.y + Math.random()*tSize*0.5);
		var c = new V2D(p.x + Math.random()*tSize*0.5, p.y + Math.random()*tSize*0.5);
		var t = {"A":a,"B":b,"C":c};
		space.insertObject(t);
	}

	// render

	var displaySize = 400;
	var displayScale = displaySize/Math.max(siz.x,siz.y);

	var display = new DO();
	this._stage.addChild(display);

	// background:
	// var tris = space.toArray();
	// for(var i=0; i<triangleCount; ++i){
	// 	var t = tris[i];
	// 	var ax = t["A"].x * displayScale;
	// 	var ay = t["A"].y * displayScale;
	// 	var bx = t["B"].x * displayScale;
	// 	var by = t["B"].y * displayScale;
	// 	var cx = t["C"].x * displayScale;
	// 	var cy = t["C"].y * displayScale;
	//
	// 	var d = new DO();
	// 	d.graphics().setFill(0x33990099);
	// 	d.graphics().setLine(1.0,0x99660066);
	// 		d.graphics().beginPath();
	// 		d.graphics().moveTo(ax,ay);
	// 		d.graphics().lineTo(bx,by);
	// 		d.graphics().lineTo(cx,cy);
	// 		d.graphics().lineTo(ax,ay);
	// 		d.graphics().endPath();
	// 		d.graphics().fill();
	// 		d.graphics().strokeLine();
	// 	display.addChild(d);
	// }
	var center = new V2D(3,3);
	var radius = 1.0;
	// var tris = space.objectsInsideCircle(center, radius);
	var rect = new Rect(3,4,4,1);

	console.log(rect)
	var tris = space.objectsInsideRect(rect.min(),rect.max());
	console.log(tris);
	for(var i=0; i<tris.length; ++i){
		var t = tris[i];
		t["marked"] = true;
	}

	var tris = space.toArray();
	for(var i=0; i<triangleCount; ++i){
		var t = tris[i];
		var ax = t["A"].x * displayScale;
		var ay = t["A"].y * displayScale;
		var bx = t["B"].x * displayScale;
		var by = t["B"].y * displayScale;
		var cx = t["C"].x * displayScale;
		var cy = t["C"].y * displayScale;

		var d = new DO();
		if(t["marked"]){
			d.graphics().setFill(0x33FF0000);
			d.graphics().setLine(1.0,0x99CC0000);
		}else{
			d.graphics().setFill(0x33990099);
			d.graphics().setLine(1.0,0x99660066);
		}
			d.graphics().beginPath();
			d.graphics().moveTo(ax,ay);
			d.graphics().lineTo(bx,by);
			d.graphics().lineTo(cx,cy);
			d.graphics().lineTo(ax,ay);
			d.graphics().endPath();
			d.graphics().fill();
			d.graphics().strokeLine();
		display.addChild(d);
	}

	// var d = new DO();
	// d.graphics().setFill(0x330099CC);
	// d.graphics().setLine(1.0,0x99006699);
	// 	d.graphics().beginPath();
	// 	d.graphics().drawCircle(center.x*displayScale, center.y*displayScale, radius*displayScale);
	// 	d.graphics().endPath();
	// 	d.graphics().fill();
	// 	d.graphics().strokeLine();
	// display.addChild(d);

	var d = new DO();
	d.graphics().setFill(0x330099CC);
	d.graphics().setLine(1.0,0xCC003399);
		d.graphics().beginPath();
		d.graphics().drawRect(rect.x()*displayScale, rect.y()*displayScale, rect.width()*displayScale, rect.height()*displayScale);
		d.graphics().endPath();
		d.graphics().fill();
		d.graphics().strokeLine();
	display.addChild(d);

	console.log(space);
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
