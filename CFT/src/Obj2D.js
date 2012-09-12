// Obj2D.js
/*
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
*/

function Obj2D(mc, x,y, sca, oX,oY){
	var self = this;
	this.id = 0;
    this.remove = false;
	this.mc = null;
    this.pos = new V2D(x,y);
    this.offset = new V2D(oX,oY);
    this.scale = 1.0;
    Code.extendClass(this,Dispatchable);
    //
    if(sca!=null && sca!=undefined){
        this.scale = sca;
    }
	
	this.process = function(time){
        // 
	}
	this.render = function(scaleX, scaleY, arr){
        self.mc.matrix.identity();
        self.mc.matrix.scale(self.scale);
        self.mc.matrix.translate(self.pos.x*scaleX + self.offset.x,self.pos.y*scaleY + self.offset.y);
        arr.push(self.mc);
	}
	this.mc = mc;
}
