// DrawScreen.js

function DrawScreen(){
	var self = this;
	Code.extendClass(this,DO,[]);
    this.imageList = new Array();
    this.currentImage = -1;
    this.mcBase = new DO();
    this.mcContent = new DO();
    this.addChild(this.mcBase);
    this.addChild(this.mcContent);
    this.addBase = function(scrn){
        self.mcBase.addChild(scrn);
    }
    this.addScreen = function(scrn){
        self.imageList.push( scrn );
    }
    this.emptyScreens = function(){
        Code.emptyArray(self.imageList);
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
        self.mcContent.removeAllChildren();
        self.mcContent.addChild( self.imageList[self.currentImage] );
        return true;
    }
}
