// Comp2D.js

function Comp2D(mc, x,y, sca, oX,oY){
    var self = this;
    Code.extendClass(this,Char2D,[mc,x,y,sca,oX,oY]);
    this.followPos = null;
    this.lagTimeTotal = 10;
    this.lagTime = 0;
    this.follow = function(){
        if(self.followPos){
            console.log("following"+followPos.toString());
        }
    }
    //
    this.description.setDimensions(1,1);
    this.description.setGrid("*");
    //
    this.process = function(time){
        self.super.process.call(this,time);
        if(self.followPos){
            self.lagTime++;
            if(self.lagTime>=self.lagTimeTotal){
                self.lagTime = 0;
                var dir = new V2D( Math.floor(self.followPos.x-self.pos.x), Math.floor(self.followPos.y-self.pos.y) );
                if(Math.abs(dir.x)>1){
                    if(dir.x<0){
                        self.moveLeft();
                    }else{
                        self.moveRight();
                    }
                }else if(Math.abs(dir.y)>1){
                    if(dir.y<0){
                        self.moveUp();
                    }else{
                        self.moveDown();
                    }
                }
            }
        }
    }
}
