// ResourceRect.js
// TEXTURES -----------------------------------
	ResourceRect.TEX_REX = 0;
	ResourceRect.TEX_SPINO = 1;

function ResourceRect(){
	var self = this;
	Code.extendClass(self,Resource);
	// 
	self.loadMore = function(){
		// .. load something else
	};
	// CONSTRUCTOR
	var texdir = "./";
	var tex = new Array();
	tex[ResourceRect.TEX_REX] = "rex.png";
	tex[ResourceRect.TEX_SPINO] = "spino.png";
	self.imgLoader.setLoadList( texdir, tex, self );
	self.fxnLoader.setLoadList( new Array(self.loadMore), self );
}

