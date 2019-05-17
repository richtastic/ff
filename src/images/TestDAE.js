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


	var sampler = {
		"id":"world_jpg-sampler",
	};

	var material = {
		"id":"Material-effect",
		"surface":
		{
			"id":"world_jpg-surface",
			"type":"2D",
			"image":"world_jpg",
		},
		"sampler": sampler,
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
				"value":sampler,
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
		tri3Ds.push(new Tri3D(a,b,c));
		tri3Ds.push(new Tri3D(a,c,d));
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
		tri3Ds.push(new Tri3D(b,c,z));
		tri3Ds.push(new Tri3D(b,z,y));
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
		"id":"Cube-mesh",
		"name":"Cube",
"material": material, // ...
		"triangles3D": tri3Ds,
		"triangles2D": tri2Ds,
		"normals": null, // present or derive from triangles3d
	};

	var cubeInstance = {
		"id":"Cube",
		"name":"Cube",
		"instance": cube,
		"transform": new Matrix3D().identity(),
		"material": material,
	};

	var world = {
		"images":[
			{
				"id":"world_jpg",
				"file":"world.jpg",
			},
		],
		"effects":[
			material,
		],
		"controllers":
		[

		],
		"scenes":
		[
			{
				"id": "Scene",
				"name": "Scene",
				"default": true,
				"nodes": [
					cubeInstance,
				],
			},
		],
		"meshes":
		[
			cube
		],
	};
	var xml = Formats3D.worldToDAE(world);

	console.log(xml);
}
// 36 normals = 3 points per normal => 12 normals = 2 triangles per quad => 6 normals
// ...
/*
        <source id="Cube-mesh-positions">
          <float_array id="Cube-mesh-positions-array" count="24">1 1 -1 1 -1 -1 -1 -0.9999998 -1 -0.9999997 1 -1 1 0.9999995 1 0.9999994 -1.000001 1 -1 -0.9999997 1 -1 1 1</float_array>
          <technique_common>
            <accessor source="#Cube-mesh-positions-array" count="8" stride="3">
              <param name="X" type="float"/>
              <param name="Y" type="float"/>
              <param name="Z" type="float"/>
            </accessor>
          </technique_common>
        </source>
        <source id="Cube-mesh-normals">
          <float_array id="Cube-mesh-normals-array" count="36">0 0 -1 0 0 1 1 0 -2.38419e-7 0 -1 -4.76837e-7 -1 2.38419e-7 -1.49012e-7 2.68221e-7 1 2.38419e-7 0 0 -1 0 0 1 1 -5.96046e-7 3.27825e-7 -4.76837e-7 -1 0 -1 2.38419e-7 -1.19209e-7 2.08616e-7 1 0</float_array>
          <technique_common>
            <accessor source="#Cube-mesh-normals-array" count="12" stride="3">
              <param name="X" type="float"/>
              <param name="Y" type="float"/>
              <param name="Z" type="float"/>
            </accessor>
          </technique_common>
        </source>
        <source id="Cube-mesh-map-0">
          <float_array id="Cube-mesh-map-0-array" count="72">0.4317863 0.9852856 0.2651468 0.6520069 0.4317862 0.6520069 0.4317861 0.318728 0.2651467 -0.01455062 0.4317861 -0.01455092 0.4317861 -0.01455092 0.2651466 -0.3478295 0.4317861 -0.3478296 0.09850746 0.9852859 0.2651468 0.6520069 0.2651469 0.9852859 0.2651468 0.6520069 0.4317861 0.318728 0.4317862 0.6520069 0.4317863 0.9852856 0.5984255 0.6520066 0.5984257 0.9852854 0.4317863 0.9852856 0.2651469 0.9852859 0.2651468 0.6520069 0.4317861 0.318728 0.2651467 0.3187281 0.2651467 -0.01455062 0.4317861 -0.01455092 0.2651467 -0.01455062 0.2651466 -0.3478295 0.09850746 0.9852859 0.09850728 0.6520071 0.2651468 0.6520069 0.2651468 0.6520069 0.2651467 0.3187281 0.4317861 0.318728 0.4317863 0.9852856 0.4317862 0.6520069 0.5984255 0.6520066</float_array>
          <technique_common>
            <accessor source="#Cube-mesh-map-0-array" count="36" stride="2">
              <param name="S" type="float"/>
              <param name="T" type="float"/>
            </accessor>
          </technique_common>
        </source>
        <vertices id="Cube-mesh-vertices">
          <input semantic="POSITION" source="#Cube-mesh-positions"/>
        </vertices>
        <triangles material="Material-material" count="12">
          <input semantic="VERTEX" source="#Cube-mesh-vertices" offset="0"/>
          <input semantic="NORMAL" source="#Cube-mesh-normals" offset="1"/>
          <input semantic="TEXCOORD" source="#Cube-mesh-map-0" offset="2" set="0"/>
          <p>0 0 0 2 0 1 3 0 2 7 1 3 5 1 4 4 1 5 4 2 6 1 2 7 0 2 8 5 3 9 2 3 10 1 3 11 2 4 12 7 4 13 3 4 14 0 5 15 7 5 16 4 5 17 0 6 18 1 6 19 2 6 20 7 7 21 6 7 22 5 7 23 4 8 24 5 8 25 1 8 26 5 9 27 6 9 28 2 9 29 2 10 30 6 10 31 7 10 32 0 11 33 3 11 34 7 11 35</p>
        </triangles>
*/
