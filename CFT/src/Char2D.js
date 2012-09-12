// Char2D.js

function Char2D(mc, x,y, sca, oX,oY){
    var self = this;
    Code.extendClass(this,Block2D,[mc,x,y,sca,oX,oY]);
    //
    this.description.setDimensions(1,2);
    this.description.setGrid("**");
    //
    // 
}
