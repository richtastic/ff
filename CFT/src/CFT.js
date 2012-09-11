// CFT.js

function CFT(){
	var self = this;
	this.resource = null, this.keyboard = null, this.canvas = null, this.stage = null;
	this.scriptLoader = null;
	//
	this.mcContent = null;
		this.mcCover = null;
		this.mcScreen = null;
			this.mcGame = null;
	//
	this.phoneDimX = 480, this.phoneDimY = 320;
	// 
	this.game = null;
	this.charMain = null;
	//
	this.constructor = function(){
    	self.classesLoadedFxn();
	}
	this.classesLoadedFxn = function(){
    	self.resource = new ResourceCFT();
    	self.resource.setFxnComplete( self.resourceLoadedFxn );
    	self.resource.load();
	}
	self.resourceLoadedFxn = function(){
	    self.canvas = new Canvas(self.resource,null,10,10,Canvas.STAGE_FIT_FILL);// phoneDimX,phoneDimY,Canvas.STAGE_FIT_FIXED);
	    self.stage = new Stage(self.canvas, (1/24)*1000);
	    self.keyboard = new Keyboard();
	    // -------------
	    self.mcContent = new DO();
	    self.mcContent.setFillRGBA(0xFFFF99FF);
	    self.mcContent.drawRect(-self.phoneDimX/2,-self.phoneDimY/2,self.phoneDimX,self.phoneDimY);

	    var img = self.resource.tex[ResourceCFT.TEX_IPHONE_1];
	    self.mcCover = new DOImage(img);
	    self.mcCover.matrix.identity();
	    self.mcCover.matrix.translate((img.width/2),(img.height/2));
	    self.mcCover.matrix.rotate(Math.PI/2);
	    self.mcCover.matrix.translate(1,0); // pic is off a titch

	    self.mcScreen = new DO();
	    self.mcScreen.matrix.identity();
	    self.mcScreen.matrix.translate(-self.phoneDimX/2,-self.phoneDimY/2);

		self.mcGame = new DO();
	    self.mcGame.matrix.identity();
	    //
	    self.stage.addChild(self.mcContent);
	    self.mcContent.addChild(self.mcScreen);
	    self.mcContent.addChild(self.mcCover);
	    self.mcScreen.addChild(self.mcGame);
	    
	    self.game = new PixelGame(self.mcGame, self.phoneDimX, self.phoneDimY);
	    var im = new DOImage(self.resource.tex[ResourceCFT.TEX_CHAR_GIRL_1])
	    var ob = new Obj2D( im );
	    self.game.lattice.getElement(2,2).addBG( ob );

	    
	    var doa = new DOAnim();
	    doa.clearGraphics();
	    doa.addFrame( new DOImage(self.resource.tex[ResourceCFT.TEX_PIXY_REGULAR_1]), 2 );
	    doa.addFrame( new DOImage(self.resource.tex[ResourceCFT.TEX_PIXY_TALL_1]), 2 );
	    doa.addFrame( new DOImage(self.resource.tex[ResourceCFT.TEX_PIXY_REGULAR_1]), 2 );
	    doa.addFrame( new DOImage(self.resource.tex[ResourceCFT.TEX_PIXY_WIDE_1]), 2 );
	    self.stage.addChild(doa);
	    
	    

	    // 
	    self.addListeners();
	    self.resource.alertLoadCompleteEvents();
	    self.stage.start();
	    console.log("CFT complete");
	}
	this.addListeners = function(){
		self.canvas.addFunction(Canvas.EVENT_WINDOW_RESIZE,self.windowResizeFxn);
	    self.stage.addFunction(Stage.EVENT_ON_ENTER_FRAME,self.enterFrameFxn);
	    self.stage.addFunction(Stage.EVENT_ON_EXIT_FRAME,self.exitFrameFxn);
	    self.canvas.addFunction(Canvas.EVENT_CLICK,self.canvasClickFxn);
		self.keyboard.addFunction(Keyboard.EVENT_KEY_DOWN,self.keyDownFxn);
		self.keyboard.addFunction(Keyboard.EVENT_KEY_UP,self.keyUpFxn);
		self.keyboard.addListeners();
	}
	this.removeListeners = function(){
		self.canvas.removeFunction(Canvas.EVENT_WINDOW_RESIZE,self.windowResizeFxn);
	    self.stage.removeFunction(Stage.EVENT_ON_ENTER_FRAME,self.enterFrameFxn);
	    self.stage.removeFunction(Stage.EVENT_ON_EXIT_FRAME,self.exitFrameFxn);
	    self.canvas.removeFunction(Canvas.EVENT_CLICK,self.canvasClickFxn);
		self.keyboard.removeFunction(Keyboard.EVENT_KEY_DOWN,self.keyDownFxn);
		self.keyboard.removeFunction(Keyboard.EVENT_KEY_UP,self.keyUpFxn);
		self.keyboard.removeListeners();
	}
	this.keyDownFxn = function(key){
		/*
		var dir = null;
		if(key==Keyboard.KEY_LF){
			dir = new V2D(-1,0);
		}else if(key==Keyboard.KEY_RT){
			dir = new V2D(1,0);
		}else if(key==Keyboard.KEY_UP){
			dir = new V2D(0,-1);
		}else if(key==Keyboard.KEY_DN){
			dir = new V2D(0,1);
		}
		*/
	}
	this.keyUpFxn = function(key){

	}
	this.windowResizeFxn = function(o){
	    self.mcContent.matrix.identity();
	    self.mcContent.matrix.translate(o.x/2,o.y/2);
	}
	this.enterFrameFxn = function(o){
		self.game.render();
	}
	this.exitFrameFxn = function(o){
		self.drawPhoneCover();
	}
	this.drawPhoneCover = function(){
		/*
		var can = self.canvas.getCanvas();
		var con = self.canvas.getContext();
		var img = self.resource.tex[ResourceCFT.TEX_IPHONE_1];
		con.save();
		var prevAlpha = con.globalAlpha;
		con.globalAlpha = 0.5;
		con.translate(1,0);
		con.translate((self.screenWidth/2), (self.screenHeight/2));
		con.rotate(-Math.PI/2);
		con.translate(-(img.width/2),-(img.height/2));
		con.drawImage(img, 0,0); 
		con.globalAlpha = prevAlpha;
		con.restore();
		*/
	}
	this.canvasClickFxn = function(o){

	}
// -------------------------------------------------------------------------------- constructor
	this.constructor();
}
/*
	Obj2D
		- DO/DOImage -> display image
		- portrait -> grid-based description of what it looks like - reference is bottom-left
			- portraitWidth
			- portraitHeight
	> (BG) (bg)
		<as is>
		
	> Block (still block)
		- occupy space
		> Char (moveable)
			- TO MOVE - none of portrait blocks intersect in direction -> set reserved before move
	> Item (fg) - INTERACT: add to char inventory | add/sub char heath
		- 
	> Evt (not rendered) - enable character ability (ladder-climb) | kill character (gas-) | 



*/

/*CFT.MAP_BLANK = " ";
	CFT.MAP_ITEM_SPARKLE = "^";
	CFT.MAP_BLOCK_DEFAULT = "*";
	CFT.MAP_PORTAL_DEFAULT = "P";
	CFT.MAP_BLOCK_CHAR_MAIN = "M";
	this.initLattice = function(){
				//   123456789012345678901234
		var str = 	"                        "+ // 1
					"                        "+ // 2
					"         ^         P    "+ // 3
					"        *************** "+ // 4
					"                        "+ // 5
					"                        "+ // 6
					" *********              "+ // 7
					"  *     *               "+ // 8
					"  *   ^ *               "+ // 9
					"************************"+ // 10
					"                        "+ // 11
					"                        "+ // 12
					"  ********************  "+ // 13
					"                        "+ // 14
					" M ^                  ^ "+ // 15
					"************************"; // 16
		var i, len, x, y, vox, ch;
		var img = self.resource.tex[ResourceCFT.TEX_BOX_GRASS_1];
		len = str.length;
		for(i=0;i<len;++i){
			vox = self.lattice.getIndex(i);//Element(x,y);
			ch = str.charAt(i);
			if(ch==CFT.MAP_BLOCK_DEFAULT){
				vox.setBG( new Array(self.resource.tex[ResourceCFT.TEX_BOX_BLANK_1]) );
			}else if(ch==CFT.MAP_PORTAL_DEFAULT){
				vox.setBG( new Array(self.resource.tex[ResourceCFT.TEX_PORTAL_BLANK_1]) );
			}else if(ch==CFT.MAP_ITEM_SPARKLE){
				vox.setItems( new Array(self.resource.tex[ResourceCFT.TEX_DIAMOND_YELLOW_1]) );
			}else if(ch==CFT.MAP_BLOCK_CHAR_MAIN){
				self.charMain = self.resource.tex[ResourceCFT.TEX_CHAR_BLANK_1];
				vox.setChars( new Array(self.resource.tex[ResourceCFT.TEX_CHAR_BLANK_1]) );
			}
		}
	}*/