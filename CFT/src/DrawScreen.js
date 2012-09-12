// DrawScreen.js

function DrawScreen(){
	var self = this;
	Code.extendClass(this,DO,[]);
    this.imageList = new Array();
    this.currentImage = -1;
    this.addScreen = function(scrn){
        self.imageList.push( scrn );
    }
    this.gotoFirstScreen = function(){
        self.currentImage = -1;
        return self.gotoNextScreen();
    }
    this.gotoNextScreen = function(){
        self.currentImage++;
        if(self.currentImage>=self.imageList.length){
            self.currentImage--;
            return false;
        }
        self.removeAllChildren();
        self.addChild( self.imageList[self.currentImage] );
        return true;
    }
}
