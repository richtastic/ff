// CFT.js

function CFT(){
	var self = this;
	this.resource = null, this.keyboard = null, this.canvas = null, this.stage = null;
	//
	this.phoneScreenLong = null;
	this.phoneDimX = 480, this.phoneDimY = 320;
	// 
	this.latticeOffX = 0, this.latticeOffY = 0;
	this.latticeCellX = 20, this.latticeCellY = 20;
	this.latticeNumX = 0, this.latticeNumY = 0;
	this.lattice = null;
	this.charMain = null;
	//
	this.screenWidth = 0, this.screenHeight = 0;
	this.constructor = function(){
    	self.resource = new ResourceCFT();
    	self.resource.setFxnComplete( self.resourceLoadedFxn );
    	self.resource.load();
	}
	self.resourceLoadedFxn = function(){
	    self.canvas = new Canvas(self.resource,null,10,10,Canvas.STAGE_FIT_FILL);// phoneDimX,phoneDimY,Canvas.STAGE_FIT_FIXED);
	    self.stage = new Stage(self.canvas, (1/24)*1000);
	    self.keyboard = new Keyboard();
	    // -------------
	    self.phoneScreenLong = new DO();
	    self.phoneScreenLong.clearGraphics();
	    self.phoneScreenLong.setFillRGBA(0xFFFFFFFF);
	    self.phoneScreenLong.drawRect(-self.phoneDimX/2,-self.phoneDimY/2,self.phoneDimX,self.phoneDimY);
	    self.stage.addChild(self.phoneScreenLong);
	    /*
	    var do1 = new DO();
	    do1.clearGraphics();
	    do1.setFillRGBA(0xFF220099);
	    do1.drawRect(-50,-50,100,100);
	    do1.matrix.rotate(Math.PI/4);
	    do1.matrix.translate(220,100);
	    */
	    //stage.addChild(do1);
	    //phoneScreenLong.addChild(do1);
	    //phoneScreenLong.mask = true;
	    // world setup
	    var wid = self.phoneDimX, hei = self.phoneDimY;
	    self.latticeNumX = wid/self.latticeCellX;
	    self.latticeNumY = hei/self.latticeCellY;
	    self.lattice = new Lattice(self.latticeNumX,self.latticeNumY, Voxel);
	    self.initLattice();
	    // 
	    self.addListeners();
	    self.resource.alertLoadCompleteEvents();
	    self.stage.start();
	    console.log("CFT complete");
	}
	CFT.MAP_BLANK = " ";
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
		//len = 10;
		len = str.length;
		for(i=0;i<len;++i){
			//x = Math.floor(Math.random()*self.latticeNumX);
			//y = Math.floor(Math.random()*self.latticeNumY);
			//console.log(x+"/"+self.latticeNumX+" : "+y+"/"+self.latticeNumY);
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
		if(dir){
			var wid = self.latticeNumX, hei = self.latticeNumY;
			var i, j, k, len;
			var img, arr, vox;
			for(j=0;j<hei;++j){
				for(i=0;i<wid;++i){
					vox = self.lattice.getElement(i,j);
					arr = vox.getChars(); len = arr.length;
					for(k=0;k<len;++k){
						img = arr[k];
						if(img == self.charMain){
							i+=dir.x; j+=dir.y;
							if(0<=i&&i<wid && 0<=j&&j<hei){
								vox.setChars(new Array());
								vox = self.lattice.getElement(i,j);
								vox.setChars(new Array(self.charMain));
							}
							return;
						}
					}
				}
			}
		}
	}
	this.keyUpFxn = function(key){

	}
	this.windowResizeFxn = function(o){
		self.screenWidth = o.x, self.screenHeight = o.y;
	    self.phoneScreenLong.matrix.identity();
	    self.phoneScreenLong.matrix.translate(o.x/2,o.y/2);
	    self.latticeOffX = (o.x-self.phoneDimX)/2;
	    self.latticeOffY = (o.y-self.phoneDimY)/2;
	}
	this.enterFrameFxn = function(o){
		// pre
	}
	this.exitFrameFxn = function(o){
		// content
		/*var wid = self.latticeNumX, hei = self.latticeNumY;
		var sizX = self.latticeCellX, sizY = self.latticeCellY;
		var offX = self.latticeOffX, offY = self.latticeOffY;
		var can = self.canvas.getCanvas();
		var con = self.canvas.getContext();
		var i, j;
		var img = self.resource.tex[ResourceCFT.TEX_BOX_BLANK_1];
		for(j=0;j<hei;++j){
			for(i=0;i<wid;++i){
				con.drawImage(img, offX+sizX*i,offY+sizY*j, sizX,sizY);
			}
		}*/
		//
		self.renderLattice();
		// iphone cover
		var can = self.canvas.getCanvas();
		var con = self.canvas.getContext();
		var img = self.resource.tex[ResourceCFT.TEX_IPHONE_1];
		con.save();
		con.translate(1,0);
		con.translate((self.screenWidth/2), (self.screenHeight/2));
		con.rotate(-Math.PI/2);
		con.translate(-(img.width/2),-(img.height/2));
		con.drawImage(img, 0,0); 
		con.restore();
	}
	this.renderLattice = function(){
		var wid = self.latticeNumX, hei = self.latticeNumY;
		var sizX = self.latticeCellX, sizY = self.latticeCellY;
		var offX = self.latticeOffX, offY = self.latticeOffY;
		var can = self.canvas.getCanvas();
		var con = self.canvas.getContext();
		var i, j, k, len;
		var img, arr, vox;
		for(j=0;j<hei;++j){
			for(i=0;i<wid;++i){
				vox = self.lattice.getElement(i,j);
				// backgrounds
				arr = vox.getBG(); len = arr.length;
				for(k=0;k<len;++k){
					img = arr[k];
					con.drawImage(img, offX+sizX*i,offY+sizY*j, sizX,sizY);
				}
				// items
				arr = vox.getItems(); len = arr.length;
				for(k=0;k<len;++k){
					img = arr[k];
					con.drawImage(img, offX+sizX*i,offY+sizY*j, sizX,sizY);
				}
				// chars
				arr = vox.getChars(); len = arr.length;
				for(k=0;k<len;++k){
					img = arr[k];
					con.drawImage(img, offX+sizX*i,offY+sizY*j, sizX,sizY);
				}
			}
		}
	}
	this.canvasClickFxn = function(o){

	}
// -------------------------------------------------------------------------------- constructor
	this.constructor();
}