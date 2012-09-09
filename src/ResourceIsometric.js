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
	var imgList = ["iso_gnd_stone.png"];
	this.load1 = function(ref){
		console.log("...");
	}
// ------------------------------------------------------- constructor
	this.imgLoader.setLoadList( "images/", imgList, this );
	this.fxnLoader.setLoadList( new Array(this.load1), this );
}

