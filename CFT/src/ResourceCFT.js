// ResourceIsometic.js

// TEXTURES -----------------------------------
ResourceCFT.TEX_BOX_BLANK_1 = 0;
ResourceCFT.TEX_BOX_GRASS_1 = 1;
ResourceCFT.TEX_CHAR_BLANK_1 = 2;
ResourceCFT.TEX_CHAR_GIRL_1 = 3;
ResourceCFT.TEX_LADDER_BLANK_1 = 4;
ResourceCFT.TEX_LADDER_GOLD_1 = 5;
ResourceCFT.TEX_PORTAL_BLANK_1 = 6;
ResourceCFT.TEX_PORTAL_GOLD_1 = 7;
ResourceCFT.TEX_DIAMOND_YELLOW_1 = 8;
ResourceCFT.TEX_IPHONE_1 = 9;
ResourceCFT.TEX_1 = 0;
// MAPS ---------------------------------------
ResourceCFT.MAP_1 = 0;
// SOUNDS -------------------------------------
ResourceCFT.SND_1 = 0;
// SYMBOLS -------------------------------------

function ResourceCFT(){
	Code.extendClass(this,Resource);
	this.load1 = function(ref){
		console.log("...");
	}
// ------------------------------------------------------- constructor
	var imgList = ["box_blank.png","box_filled.png","character_blank.png","character_filled.png",
		"ladder_blank.png","ladder_filled.png","portal_blank.png","portal_filled.png","sparkle_yellow.png",
		"iphone.png"];
	this.imgLoader.setLoadList( "images/", imgList, this );
	this.fxnLoader.setLoadList( new Array(this.load1), this );
}

