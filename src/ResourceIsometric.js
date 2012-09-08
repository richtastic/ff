// ResourceIsometic.js

// TEXTURES -----------------------------------
ResourceIsometric.TEX_1 = 0;
// MAPS ---------------------------------------
ResourceIsometric.MAP_1 = 0;
// SOUNDS -------------------------------------
ResourceIsometric.SND_1 = 0;
// SYMBOLS -------------------------------------

function ResourceIsometric(){
	Code.extendClass(this,Resource);
	var self = this;
	this.imgLoader.setLoadList( "images/", new Array("iso_gnd_stone.png"), this );
	this.fxnLoader.setLoadList( new Array(loadLevels), this );
	this.loadLevels = loadLevels;
	function loadLevels(ref){
		console.log("...");
	}
	
}

