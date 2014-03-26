// R2D.js

function R2D(){
	this.cat = "hat";
	console.log("cmlmete");

	this.simulatePoints();
}
R2D.prototype.simulatePoints = function(){
	var points2D = new Array();
	points2D.push( new V2D(-3,3) );
	points2D.push( new V2D(-1,4) );
	points2D.push( new V2D(0,4) );
	points2D.push( new V2D(1,5) );
	points2D.push( new V2D(2,4) );
	points2D.push( new V2D(3,5) );
	points2D.push( new V2D(4,4) );
	points2D.push( new V2D(5,3) );
	// 
	var cams2D = new Array();
	cams2D.push( new V3D(0,0, 0) );
	cams2D.push( new V3D(3,0, 0) );
	//
	var images = new Array();
	var correspondences = new Array();
	//
	var fieldOfView = 90*(Math.PI/180);
	var focalLength = 1.0;
	var imageWidth = 100;
	var i, j, k, cam, image, point, list, pixel, matrix;
	var v = new V2D();
	var cameraOrientation = new V2D();
	var imageCenter = new V2D();
	var imageLine = new V2D();
	var imageLeft = new V2D();
	var imageRight = new V2D();
	var imagePoint = new V2D();
	// generate images
	for(i=0;i<cams2D.length;++i){
		image = Code.newArrayZeros(imageWidth);
		cam = cams2D[i];
		cameraOrientation.set(0,1); // default +y
		cameraOrientation.scale(focalLength);
		V2D.rotate(cameraOrientation, cameraOrientation,cam.z); // rotate to camera direction
		imageCenter.x = cam.x + cameraOrientation.x;
		imageCenter.y = cam.y + cameraOrientation.y;
		imageLine.copy(cameraOrientation); // default = camera - 90deg
		V2D.rotate(imageLine,imageLine,-Math.PI*0.5);
		imageLine.norm();
		imageLine.scale(2.0*focalLength*Math.tan(fieldOfView*0.5));
		imageLeft.x = imageCenter.x - 0.5*imageLine.x;
		imageLeft.y = imageCenter.y - 0.5*imageLine.y;
		imageRight.x = imageCenter.x + 0.5*imageLine.x;
		imageRight.y = imageCenter.y + 0.5*imageLine.y;
		console.log("cam "+cam.toString());
		console.log("ori "+cameraOrientation.toString());
		console.log("cen "+imageCenter.toString());
		console.log("lin "+imageLine.toString());
		console.log("lef "+imageLeft.toString());
		console.log("rig "+imageRight.toString());
		// project points onto image
		list = correspondences[i] = new Array();
		for(j=0;j<points2D.length;++j){
			point = points2D[j];
			v = Code.lineSegIntersect(imageLeft,imageRight, point,cam);
			if(v){
				console.log("  "+point.toString()+" => "+v.toString());
				pixel = Math.floor(v.z*imageWidth);
				image[pixel] = 1.0; // set it
				list.push(pixel);
			}else{
				list.push(null);
			}
		}
		images.push(image);
	}
	// find solution
	var A, x, b;
	var matrices = new Array();
	for(i=0;i<cams2D.length;++i){
		camA = cams2D[i];
		matrices[i] = new Array();
		for(j=i+1;j<cams2D.length;++j){
			camB = cams2D[j];
			matrix = new Matrix(3,3); matrix.identity();
			console.log(correspondences[i]);
			console.log(correspondences[j]);
			A = new Array();
			for(k=0;k<correspondences[j].length;++k){
				point = correspondences[j][k];
				if(point!==null){
					point = 2.0*point/imageWidth - 1.0; // [-1,1]
					console.log(point);
					A.push([ focalLength, focalLength, focalLength, -point, -point, -point ]);
				}
			}
			A = new Matrix(A.length,6).setFromArrayMatrix(A);
			b = new Array(0,0,0,0,0,0);
			b = new Matrix(6,1).setFromArray(b);
			console.log(A.toString());
			console.log(b.toString());
			//x = Matrix.solve(A,b);
			console.log( x );
			matrices[i][j] = matrix;
		}
	}
}

/*
make up some 2D points
make up some 2D cameras
produce correspondences
run solving algorithm
*/
