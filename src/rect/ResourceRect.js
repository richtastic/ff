// ResourceRect.js
// TEXTURES -----------------------------------
	ResourceRect.TEX_REX = 0;
	ResourceRect.TEX_SPINO = 1;

function ResourceRect(){
	ResourceRect._.constructor.call(this);
	var texdir = "./";
	var tex = new Array();
	tex[ResourceRect.TEX_REX] = "rex.png";
	tex[ResourceRect.TEX_SPINO] = "spino.png";
	this._imgLoader.setLoadList(texdir, tex);
}
Code.inheritClass(ResourceRect,Resource);
// ---------------------------------------------------------
ResourceRect.prototype.kill = function(){
	ResourceRect._.kill.call(this);
}
	