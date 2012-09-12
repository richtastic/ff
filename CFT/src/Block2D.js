// Block2D.js
Block2D.EVENT_MOVE_RIGHT="blk2devtmovrt";
Block2D.EVENT_MOVE_LEFT="blk2devtmovlf";
Block2D.EVENT_MOVE_UP="blk2devtmovup";
Block2D.EVENT_MOVE_DOWN="blk2devtmovdn";

function Block2D(mc, x,y, sca, oX,oY){
    var self = this;
	Code.extendClass(this,Obj2D,[mc,x,y,sca,oX,oY]);
    // 
    this.description = new BinaryGrid(1,1);
    this.description.setGrid("*");
    this.moveRight = function(){
        self.alertAll(Block2D.EVENT_MOVE_RIGHT,self);
    }
    this.moveLeft = function(){
        self.alertAll(Block2D.EVENT_MOVE_LEFT,self);
    }
    this.moveUp = function(){
        self.alertAll(Block2D.EVENT_MOVE_UP,self);
    }
    this.moveDown = function(){
        self.alertAll(Block2D.EVENT_MOVE_DOWN,self);
    }
}
