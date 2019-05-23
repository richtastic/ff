// TestDAE.js

function TestDAE(){
	console.log("TestDAE");

	// LOAD IMAGES
	var ajax = new Ajax();

	ajax.get("./cube.dae",this,this._handleLoaded,null);

}


TestDAE.prototype._handleLoaded = function(data){

	// var world = Formats3D.DAEtoWorld(data);
	// console.log(world);

	var image1 = {
		"id":"world_jpg",
		"file":"world.jpg",
	};

	var image2 = {
		"id":"tex2_png",
		"file":"tex2.png",
	};

	var sampler1 = {
		"id":"world_jpg-sampler",
	};

	var sampler2 = {
		"id":"tex2_png-sampler",
	};

	var material2 = {
		"id":"Material2-effect",
		"surface":
		{
			"id":"tex2_png-surface",
			"type":"2D",
			"image":image2,
			"sampler":{
				"id": "tex2_png-sampler",
			}
		},
		// "sampler": sampler2,
		"phong":
		{
			"emission":
			{
				"type":"color",
				"value":[0, 0, 0, 1],
			},
			"ambient":
			{
				"type":"color",
				"value":[0, 0, 0, 1],
			},
			"diffuse":
			{
				"type":"texture",
				// "value":sampler2,
			},
			"specular":
			{
				"type":"color",
				"value":[0.5, 0.5, 0.5, 1.0],
			},
			"shininess":{
				"type":"number",
				"value":50,
			},
			"ior":{
				"type":"number",
				"value":1,
			},
		},
	};

	var material1 = {
		"id":"Material1-effect",
		"surface":
		{
			"id":"world_jpg-surface",
			"type":"2D",
			"image":image1,
			"sampler":{
				"id": "world_jpg-sampler",
			}
		},
		"phong":
		{
			"emission":
			{
				"type":"color",
				"value":[0, 0, 0, 1],
			},
			"ambient":
			{
				"type":"color",
				"value":[0, 0, 0, 1],
			},
			"diffuse":
			{
				"type":"texture",
				// "value":sampler1,
			},
			"specular":
			{
				"type":"color",
				"value":[0.5, 0.5, 0.5, 1.0],
			},
			"shininess":{
				"type":"number",
				"value":50,
			},
			"ior":{
				"type":"number",
				"value":1,
			},
		},
	};


	// var materials = [
	// 	material,
	// ];

	var materialInstance1 = {
		"id":"Material1-material",
		"name":"Material1",
		"instance":material1,
	};

	var materialInstance2 = {
		"id":"Material2-material",
		"name":"Material2",
		"instance":material2,
	};

	var a = new V3D(0,0,0);
	var b = new V3D(1,0,0);
	var c = new V3D(1,1,0);
	var d = new V3D(0,1,0);
	var w = new V3D(0,0,1);
	var x = new V3D(1,0,1);
	var y = new V3D(1,1,1);
	var z = new V3D(0,1,1);
	var tri3Ds = [];
		// bot
		tri3Ds.push(new Tri3D(a,d,c));
		tri3Ds.push(new Tri3D(c,b,a));
		// top
		tri3Ds.push(new Tri3D(w,x,y));
		tri3Ds.push(new Tri3D(w,y,z));
		// left
		tri3Ds.push(new Tri3D(c,d,z));
		tri3Ds.push(new Tri3D(c,z,y));
		// right
		tri3Ds.push(new Tri3D(a,b,x));
		tri3Ds.push(new Tri3D(a,x,w));
		// back
		tri3Ds.push(new Tri3D(b,c,y));
		tri3Ds.push(new Tri3D(b,y,x));
		// front
		tri3Ds.push(new Tri3D(d,a,w));
		tri3Ds.push(new Tri3D(d,w,z));

	a = new V2D(0,0);
	b = new V2D(1,0);
	c = new V2D(1,1);
	d = new V2D(0,1);
	var tri2Ds = [];
		tri2Ds.push(new Tri2D(a,b,c)); //
		tri2Ds.push(new Tri2D(a,c,d));
		tri2Ds.push(new Tri2D(a,b,c)); //
		tri2Ds.push(new Tri2D(a,c,d));
		tri2Ds.push(new Tri2D(a,b,c)); //
		tri2Ds.push(new Tri2D(a,c,d));
		tri2Ds.push(new Tri2D(a,b,c)); //
		tri2Ds.push(new Tri2D(a,c,d));
		tri2Ds.push(new Tri2D(a,b,c)); //
		tri2Ds.push(new Tri2D(a,c,d));
		tri2Ds.push(new Tri2D(a,b,c)); //
		tri2Ds.push(new Tri2D(a,c,d));

	var cube = {
		"id":"Cube_MESH-mesh",
		"name":"Cube_MESH",
		"materials":[
			{
				"material":materialInstance1,
				"triangles2D":Code.subArray(tri2Ds,0,10),
				"triangles3D":Code.subArray(tri3Ds,0,10),
			},
			{
				"material":materialInstance2,
				"triangles2D":Code.subArray(tri2Ds,10,2),
				"triangles3D":Code.subArray(tri3Ds,10,2),
			}
		],
		// "triangles3D": tri3Ds, // unassigned
		"normals": null, // present or derive from triangles3d
	};

	var cubeInstance1 = {
		"id":"Cube_Instance_1",
		"name":"Cube_Instance_1",
		"instance": cube,
		"transform": new Matrix3D().identity(),
	};
	var cubeInstance2 = {
		"id":"Cube_Instance_2",
		"name":"Cube_Instance_2",
		"instance": cube,
		"transform": new Matrix3D().identity().translate(-3,0,1),
	};
	// 1 0 0 -3
	// 0 1 0 0
	// 0 0 1 1
	// 0 0 0 1

	var world = {
		"images":[
			image1,
			image2,
		],
		"effects":[ // source
			material1,
			material2,
		],
		"materials":[ // instance
			materialInstance1,
			materialInstance2,
		],
		"controllers":
		[
			// ?
		],
		"scenes":
		[
			{
				"id": "Scene",
				"name": "Scene",
				"default": true,
				"nodes": [
					cubeInstance1,
					cubeInstance2,
				],
			},
		],
		"meshes":
		[
			cube
		],
	};




	var world = Formats3D.daeWorldNew();
	var image1 = Formats3D.daeWorldAddImage(world, "world.jpg");
	var image2 = Formats3D.daeWorldAddImage(world, "tex2.png");
	var effect1 = Formats3D.daeWorldAddMaterialFromImage(world, image1);
	var effect2 = Formats3D.daeWorldAddMaterialFromImage(world, image2);
	var material1 = Formats3D.daeWorldAddInstanceFromMaterial(world, effect1);
	var material2 = Formats3D.daeWorldAddInstanceFromMaterial(world, effect2);
	var tris3D = [Code.subArray(tri3Ds,0,10), Code.subArray(tri3Ds,10,2)];
	var tris2D = [Code.subArray(tri2Ds,0,10), Code.subArray(tri2Ds,10,2)];
	var mats = [material1,material2];
	var mesh = Formats3D.daeWorldAddMesh(world, tris3D, tris2D, mats);
	var object1 = Formats3D.daeWorldAddInstanceFromMesh(world, mesh, new Matrix3D().identity());
	// var object2 = Formats3D.daeWorldAddInstanceFromMesh(world, mesh, new Matrix3D().identity().translate(-3,0,1));
	var object2 = Formats3D.daeWorldAddInstanceFromMesh(world, mesh, new Matrix3D().identity().rotateX(Code.radians(-45)).rotateZ(Code.radians(45)).translate(-2,0,1));
	var scene1 = Formats3D.daeWorldAddScene(world);
	Formats3D.daeWorldAddInstanceMeshToScene(world, scene1, object1);
	Formats3D.daeWorldAddInstanceMeshToScene(world, scene1, object2);

	console.log(world);

	var xml = Formats3D.worldToDAE(world);

	console.log(xml);
}
