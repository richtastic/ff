// DOEdit.js
DOEdit.WIDTH_CONTROL_OUTLINE = 1.0;
DOEdit.COLOR_CONTROL_OUTLINE = 0xFF000000;
DOEdit.COLOR_CONTROL_FILL = 0xFFFFFFFF;
DOEdit.WIDTH_SUBCON_OUTLINE = 1.0;
DOEdit.COLOR_SUBCON_OUTLINE = 0xccff0000;
DOEdit.COLOR_SUBCON_FILL = 0x99ff0000;
DOEdit.generateScaler = function(d){
	var wid = 10, hei = 10;
	d.graphics().clear();
	d.graphics().setFill(DOEdit.COLOR_CONTROL_FILL);
	d.graphics().setLine(DOEdit.WIDTH_CONTROL_OUTLINE,DOEdit.COLOR_CONTROL_OUTLINE);
	d.graphics().beginPath();
	d.graphics().drawRect(-wid*0.5,-hei*0.5, wid,hei);
	d.graphics().fill();
	d.graphics().strokeLine();
}
DOEdit.generateSkewer = function(d){
	var wid = 20, hei = 20;
	d.graphics().clear();
	d.graphics().setFill(DOEdit.COLOR_SUBCON_FILL);
	d.graphics().setLine(DOEdit.WIDTH_SUBCON_OUTLINE,DOEdit.COLOR_SUBCON_OUTLINE);
	d.graphics().beginPath();
	d.graphics().drawRect(-wid*0.5,-hei*0.5, wid,hei);
	d.graphics().fill();
	d.graphics().strokeLine();
}
DOEdit.generateBorder = function(d, bb){
	d.graphics().clear();
	d.graphics().setFill(0x00FF0000);
	d.graphics().setLine(1.0,0xFF00AAFF);
	d.graphics().beginPath();
	d.graphics().drawRect(bb.x(),bb.y(), bb.width(),bb.height());
	d.graphics().strokeLine();
}

function DOEdit(parentDO){
	DOEdit._.constructor.call(this);
	this._crosshair = new DO();
	this._border = new DO();
	this._container = new DO();
	this._tlScale = new DO();
	this._tlRotate = new DO();
	this._tmScale = new DO();
	this._tmSkew = new DO();
	this._trScale = new DO();
	this._trRotate = new DO();
	this._mlScale = new DO();
	this._mlSkew = new DO();
	this._mrScale = new DO();
	this._mrSkew = new DO();
	this._blScale = new DO();
	this._blRotate = new DO();
	this._bmScale = new DO();
	this._bmSkew = new DO();
	this._brScale = new DO();
	this._brRotate = new DO();
	this._element = null;
	this.addChild(this._container);
	this.addChild(this._crosshair);
	this.addChild(this._border);
	// bedind
	this.addChild(this._tlRotate);
	this.addChild(this._tmSkew);
	this.addChild(this._trRotate);
	this.addChild(this._mlSkew);
	this.addChild(this._mrSkew);
	this.addChild(this._blRotate);	
	this.addChild(this._bmSkew);
	this.addChild(this._brRotate);
	// front
	this.addChild(this._tlScale);
	this.addChild(this._tmScale);
	this.addChild(this._trScale);
	this.addChild(this._mlScale);
	this.addChild(this._mrScale);
	this.addChild(this._blScale);
	this.addChild(this._bmScale);
	this.addChild(this._brScale);

	DOEdit.generateScaler(this._tlScale);
	DOEdit.generateSkewer(this._tlRotate);
}
Code.inheritClass(DOEdit, DO);
// ------------------------------------------------------------------------------------------------------------------------ GET/SET
DOEdit.prototype.element = function(e){
	if(e!==undefined){
		this._element = e;
		this._container.removeAllChildren();
		this._container.addChild(this._element);
		if(this._element!==null){
			var bb = this._element.boundingBox();
			console.log("BOXED: "+bb+"");
			DOEdit.generateBorder(this._border, bb);
			this._tlScale.matrix().identity();
			this._tlScale.matrix().translate(bb.x(),bb.y());
			this._tlRotate.matrix().identity();
			this._tlRotate.matrix().translate(bb.x(),bb.y());

			//
			this._tlScale.enableDragging();
		}
	}
	return this._element;
}



DOEdit.prototype._BLA = function(){
	
}








