// DependencyTest.js
function DependencyTest(){
	this._canvas = new Canvas(null,1,1,Canvas.STAGE_FIT_FILL);
	this._stage = new Stage(this._canvas, (1/5)*1000);
	this._canvas.addListeners();
	this._stage.addListeners();
	this._stage.start();
	// this._canvas.addFunction(Canvas.EVENT_MOUSE_CLICK,this.handleMouseClickFxn,this);
	this._root = new DO();
	this._stage.root().addChild(this._root);
	//
	
	GLOBALSTAGE = this._stage;

	this.loadData();
}
DependencyTest.prototype.loadData = function(o){
	console.log("loaded");
	var fileLoader = new FileLoader("./",["architecture.yaml"],this,this._handleFilesLoadedFxn);
	fileLoader.load();
}
DependencyTest.prototype._handleFilesLoadedFxn = function(e){
	console.log("_handleFilesLoadedFxn");
	// console.log(e);
	var contents = e["contents"][0];
	var yaml = YAML.parse(contents);
	// console.log(yaml);
	// var timeline = yaml[0]["timeline"];
	var object = yaml[0];

	this.displayDataGraph(object);

	// console.log("_x");
}
DependencyTest.prototype.displayDataGraph = function(object){
	console.log(object);


	var entities = object["entities"];
	var connections = object["connections"];

	// add parent->child relationship
	for(var i=0; i<entities.length; ++i){
		var entity = entities[i];
		entity["children"] = [];
	}
	for(var i=0; i<entities.length; ++i){
		var entity = entities[i];
		var parent = entity["parent"];
		if(parent!=null){
			parent["children"].push(entity);
		}
	}


	var root = {};
		root["name"] = "root";
		root["parent"] = null;

	var noParents = [];
	for(var i=0; i<entities.length; ++i){
		var entity = entities[i];
		// console.log(entity);
		if(entity["parent"]==null){
			noParents.push(entity);
			entity["parent"] = root;
		}
	}

	root["children"] = noParents;



	// console.log(root);

	// root = parent of all entities that have a null parent

	var availableWidth = 400;
	var availableHeight = 500;
	var availableColumns = 10;
	var maximumDepthEntity = 5;
	var maximumDepthConnection = 5;
	

	DependencyTest.findSizes(root, availableColumns, maximumDepthEntity, 0);

	console.log(root);

	// var display = GLOBALSTAGE;
	var d = new DO();
		// d.graphics().beginPath();
		// d.graphics().setLine(2.0, 0xCC990066);
		// d.graphics().setFill(0x66990033);
		// d.graphics().drawRect(0,0, size.x,size.y);
		// d.graphics().endPath();
		// d.graphics().fill();
		// d.graphics().strokeLine();
		d.matrix().translate(10,10);
		GLOBALSTAGE.addChild(d);
	var display = d;

	DependencyTest.renderEntities(root, entities, connections, display);

}
DependencyTest.renderEntities = function(root, entities, connections, display, offset){
	if(!offset){
		offset = new V2D(0,0);
	}
	console.log("renderEntities");
	var scale = 100.0;

	var size = new V2D(root["width"],root["height"]);
	size.scale(scale);
// console.log(size+"")
	var name = root["name"];

	var d = new DO();
		d.graphics().beginPath();
		d.graphics().setLine(2.0, 0xCC990066);
		d.graphics().setFill(0x66990033);
		d.graphics().drawRect(0,0, size.x,size.y);
		d.graphics().endPath();
		d.graphics().fill();
		d.graphics().strokeLine();
		d.matrix().translate(offset.x*scale,offset.y*scale);
		// d.matrix().translate(corner.x,corner.y);
		// d.matrix().translate(imageWidth*CALLED,imageHeight*0);
		display.addChild(d);
	var displayText = ""+name;//+": "+root["height"];
	var t = new DOText(displayText , 20, DOText.FONT_ARIAL, 0xFF660099, DOText.ALIGN_LEFT);
	// d = new DOText(" "+letter+"("+k+") ", 16, DOText.FONT_ARIAL, 0xFFFF0000, DOText.ALIGN_CENTER);
	t.matrix().translate(5,0 + 20);
	d.addChild(t);
	// t.matrix().translate(imageWidth*CALLED,imageHeight*1.0);

	var children = root["children"];
	var rects = root["rects"];
	var sizes = [];
	for(var i=0; i<children.length; ++i){
		var child = children[i];
		var o = new V2D();
		o.add(0,1); // empty header
		if(rects){
			var rect = rects[i];
			console.log(" "+i+" = "+rect);
			o.add(offset);
			o.add(rect.x(),rect.y());
		}
		DependencyTest.renderEntities(child,entities, connections, display, o);
	}

}
DependencyTest.findSizes = function(entity, availableColumns, maxDepth, depth){
	if(!depth){
		depth = 0;
	}
	if(!maxDepth){
		maxDepth = 10;
	}
	if(depth>maxDepth){
		throw "too far";
	}
	// console.log("findSizes");
	// console.log(entity);
	var children = entity["children"];
	var sizes = [];
	for(var i=0; i<children.length; ++i){
		var child = children[i];
		DependencyTest.findSizes(child, availableColumns, maxDepth, depth+1);
		var size = new V2D(child["width"],child["height"]);
		sizes.push(size);
	}
	var emptyHeight = 1;
	if(children.length==0){
		entity["width"] = 1;
		entity["height"] = emptyHeight;
	}else{
		console.log(sizes);
		var result = DependencyTest.LayoutGrid(sizes, availableColumns);
		console.log(result);
		entity["width"] = result["width"];
		entity["height"] = result["height"];
		entity["height"] += emptyHeight;
		entity["rects"] = result["rects"];
	}
	console.log(entity["name"]+" = "+entity["height"]);
}
DependencyTest.prototype.testGrid = function(){
	console.log("TEST");

	var items = [];
	items.push(new V2D(2,1));
	items.push(new V2D(2,2));
	items.push(new V2D(2,1));

	items.push(new V2D(1,1));
	items.push(new V2D(2,2));
	items.push(new V2D(1,1));

	items.push(new V2D(4,2));
	items.push(new V2D(2,1));

	items.push(new V2D(1,1));

	var totalColumns = 6;
	
	var result = DependencyTest.LayoutGrid(items, totalColumns, 100);
	console.log(result);
}
DependencyTest.LayoutGrid = function(items, totalColumns, totalWidthPixels){
	var rows = [];
	var row = {"width":0, "height":0, "items":[]};
	rows.push(row);
	var maxWidth = 0;
	for(var i=0; i<items.length; ++i){
		var item = items[i];
		var size = item;
		// var size = item["size"];
		if(size.x>totalColumns){
			console.log("can't");
			return null;
		}
		if(size.x > totalColumns-row["width"]){
			row = {"width":0, "height":0, "items":[]};
			rows.push(row);
		}
		row["items"].push(item);
		row["width"] += size.x;
		row["height"] = Math.max(row["height"],size.y);
		maxWidth = Math.max(maxWidth, row["width"]);
	}
	console.log(rows);
	// var sizes = [];
	var rects = [];
	var rowInfo = [];
	var positionY = 0;
	for(var i=0; i<rows.length; ++i){
		var row = rows[i];
		var rowWidth = row["width"];
		var rowHeight = row["height"];
		var items = row["items"];
		var rowCount = items.length;
		var paddingSeparationX = (1.0 - (rowWidth/totalColumns))/(rowCount+1);
		paddingSeparationX *= totalColumns; // proportion of columns
paddingSeparationX = 0;
		// paddingSeparationX *= totalWidthPixels; // proportion of pixels
// console.log(paddingSeparationX,rowWidth/totalColumns);
		var positionX = 0;
		positionX += paddingSeparationX;
		for(var j=0; j<items.length; ++j){
			var item = items[j];
			var size = item;
			var rect = new Rect(positionX,positionY, size.x,size.y);
			rects.push(rect)
			rowInfo.push(i);
			positionX += size.x;
			positionX += paddingSeparationX;
		}
		positionY += rowHeight;
	}
	// console.log("positionY: "+positionY);
	return {"rects":rects, "rows":rowInfo, "width":maxWidth, "height":positionY};
}


//