// ResourceSpice.js
// TEXTURES -----------------------------------
ResourceSpice.TEX_BACKGROUND_GRID_1 = 0;
ResourceSpice.TEX_X = 0;
// MAPS ---------------------------------------
ResourceSpice.MAP_X = 0;
// SOUNDS -------------------------------------
ResourceSpice.SND_X = 0;
// SYMBOLS -------------------------------------
ResourceSpice.SYM_X = 0;

function ResourceSpice(){
	var self = this;
	Code.extendClass(self,Resource);
	// 
	self.loadMore = function(){
		// .. load something else
	};
	// CONSTRUCTOR
	self.imgLoader.setLoadList( "../spice/images/", new Array( "background_grid.png" ), self );
	self.fxnLoader.setLoadList( new Array(self.loadMore), self );
}
