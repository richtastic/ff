// Obj2D.js
Obj2D.TYPE_NONE = 0;
Obj2D.TYPE_WALL = 1;
Obj2D.TYPE_CHAR = 2;
Obj2D.TYPE_ENEM = 3;
Obj2D.TYPE_ITEM = 4;
Obj2D.TYPE_EXIT = 5;

Obj2D.DIR_NA = 0;
Obj2D.DIR_UP = 1;
Obj2D.DIR_DN = 2;
Obj2D.DIR_LF = 3;
Obj2D.DIR_RT = 4;

function Obj2D(x,y, arr){
	this.amt = 0;
	this.complete = false;
	this.dir = Obj2D.DIR_NA;
	this.moving = false;
	this.origin = new V2D(x,y);
	this.pos = new V2D(x,y);
	this.dest = new V2D(x,y);
	this.type = Obj2D.TYPE_NONE;
	this.imgList = new Array();
	var imgSel = -1;
	setImageList(arr);
	// ----------------------------------------- INTERACTION AMONG OBJECTS
	this.checkMe = checkMe;
	function checkMe(obj){
		if( obj.type==Obj2D.TYPE_CHAR ){ // not ENEM
			if( this.type==Obj2D.TYPE_ITEM ){ // WAS ITEM
				if( imgSel == imgList.length-1){
					this.type = Obj2D.TYPE_NONE;
				}
			}else if( this.type==Obj2D.TYPE_EXIT ){ // WAS EXIT
				if( imgSel == imgList.length-1){
					obj.complete = true;
				}
			}else if(this.type==Obj2D.TYPE_NONE){ // IS MONEY
				obj.amt += this.amt;
				this.amt = 0;
			}
		}
	}
	// -----------------------------------------
	this.setImageList = setImageList;
	function setImageList(arr){
		Code.emptyArray(imgList);
		var i;
		if(arr!=null){
			for(i=0;i<arr.length;++i){
				imgList.push(arr[i]);
			}
		}
		setSelectedImage(0);
	}
	this.nextImage = nextImage;
	function nextImage(){
		setSelectedImage(imgSel+1);
	}
	this.setSelectedImage = setSelectedImage;
	function setSelectedImage(i){
		imgSel = Math.max(0,i);
		imgSel = Math.min(imgList.length-1,imgSel);
	}
	this.getSelectedImage = getSelectedImage;
	function getSelectedImage(){
		if(imgSel>=0){
			return imgList[imgSel];
		}
		return null;
	}
	// -----------------------------------------
	this.moveRight = moveRight;
	function moveRight(){
		
	}
/*
	// -----------------------------------------
	this.render = render;
	function render(){
		//
	}
	// -----------------------------------------
	this.process = process;
	function process(){
		//
	}
*/
}





