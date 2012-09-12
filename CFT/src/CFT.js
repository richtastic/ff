// CFT.js
CFT.ITEM_ID_SPARKLE_1 = 1;
CFT.ITEM_ID_SPARKLE_2 = 2;
CFT.ITEM_ID_SPARKLE_3 = 3;
CFT.ITEM_ID_SPARKLE_4 = 4;
CFT.ITEM_ID_SPARKLE_5 = 5;
CFT.BLOCK_ID_DEFAULT = 10;
CFT.ITEM_ID_LADDER_DEFAULT = 11;
CFT.ITEM_ID_PORTAL_DEFAULT = 12;
//
CFT.GAME_MODE_GAME = 0;
CFT.GAME_MODE_DRAW = 1;

function CFT(){
	var self = this;
	this.resource = null, this.keyboard = null, this.canvas = null, this.stage = null;
	this.scriptLoader = null;
	//
	this.mcContent = null;
		this.mcCover = null;
		this.mcScreen = null;
			this.mcGame = null;
        this.mcBG = null;
	//
	this.phoneDimX = 480, this.phoneDimY = 320;
	// 
	this.game = null;
	this.charMain = null;
	//
    this.drawScreen = null;
    //
    this.gameMode = 0;
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
	    self.mcContent.setFillRGBA(0xFFFFFFFF);
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
	    
	    self.game = new PixelGame(self.mcGame, self.phoneDimX, self.phoneDimY, self.resource);
	    self.initLattice(self.game.lattice);
	    
	    self.drawScreen = new DrawScreen();
        //
        self.gameMode = CFT.GAME_MODE_GAME;
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
    CFT.MAP_BLOCK_CHAR_PIXY = "O";
    CFT.MAP_ITEM_LADDER_DEFAULT = "|";
    this.initLattice = function(lattice){
        var im, ob;
                //   123456789012345678901234
        var str =   "                        "+ // 1
                    "                        "+ // 2
                    "         ^  |      P |  "+ // 3
                    "        ****|********|* "+ // 4
                    "            |        |  "+ // 5
                    "    |       |        |  "+ // 6
                    " ***|*****  |        |  "+ // 7
                    "  * |   *   |        |  "+ // 8
                    "  * | ^ *   |        |  "+ // 9
                    "****|*******************"+ // 10
                    "    |                   "+ // 11
                    "    |              |    "+ // 12
                    "  *****************|**  "+ // 13
                    "                   |    "+ // 14
                    " M ^    O   ^      |  ^ "+ // 15
                    "************************"; // 16
        var i, len, x, y, vox, ch, scale;
        var img = self.resource.tex[ResourceCFT.TEX_BOX_GRASS_1];
        len = str.length;
        var sparkle_id = 1;
        x = y = 0;
        for(i=0;i<len;++i){
            ch = str.charAt(i);
            if(ch==CFT.MAP_BLOCK_DEFAULT){
                img = self.resource.tex[ResourceCFT.TEX_BOX_BLANK_1];
                scale = self.game.latticeCellX/img.width;
                obj = new Block2D(new DOImage(img), x,y, scale, 0,0);
                obj.id = CFT.BLOCK_ID_DEFAULT;
                self.game.addColl( obj );
            }else if(ch==CFT.MAP_BLOCK_CHAR_MAIN){
                img = self.resource.tex[ResourceCFT.TEX_CHAR_BLANK_1]
                scale = self.game.latticeCellX/img.width;
                obj = new Char2D(new DOImage(img), x,y, scale, 0,-8.333);
                self.game.addChar( obj );
                self.charMain = obj;
            }else if(ch==CFT.MAP_BLOCK_CHAR_PIXY){
                scale = 1.0;
                obj = new Comp2D(self.generatePixy(), x,y, scale, 0,0);
                obj.description.setDimensions(1,1);
                obj.description.setGrid(" ");
                if(self.charMain!=null){
                    obj.followPos = self.charMain.pos;
                }
                self.game.addChar( obj );
            }else if(ch==CFT.MAP_PORTAL_DEFAULT){
                img = self.resource.tex[ResourceCFT.TEX_PORTAL_BLANK_1];
                scale = 1.5;
                obj = new Obj2D(new DOImage(img), x,y, scale, -16,-34);
                obj.id = CFT.ITEM_ID_PORTAL_DEFAULT;
                self.game.addBG( obj );
            }else if(ch==CFT.MAP_ITEM_SPARKLE){
                img = self.resource.tex[ResourceCFT.TEX_DIAMOND_YELLOW_1];
                scale = 1.0;
                obj = new Obj2D(new DOImage(img), x,y, scale, 4,0);
                obj.id = sparkle_id;
                self.game.addItem( obj );
                ++sparkle_id;
            }else if(ch==CFT.MAP_ITEM_LADDER_DEFAULT){
                img = self.resource.tex[ResourceCFT.TEX_LADDER_BLANK_1];
                scale = 1.667;
                obj = new Obj2D(new DOImage(img), x,y, scale, 0,0);
                obj.id = CFT.ITEM_ID_LADDER_DEFAULT;
                self.game.addBG( obj );
            }
            ++x;
            if(x>=lattice.x){
                x = 0;
                ++y;
            }
        }
    }

    this.generatePixy = function(){
        var doa = new DOAnim();
        doa.clearGraphics();
        doa.addFrame( new DOImage(self.resource.tex[ResourceCFT.TEX_PIXY_REGULAR_1]), 2 );
        doa.addFrame( new DOImage(self.resource.tex[ResourceCFT.TEX_PIXY_TALL_1]), 2 );
        doa.addFrame( new DOImage(self.resource.tex[ResourceCFT.TEX_PIXY_REGULAR_1]), 2 );
        doa.addFrame( new DOImage(self.resource.tex[ResourceCFT.TEX_PIXY_WIDE_1]), 2 );
        return doa;
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
        var i,j,k;
		var dir = null;
        if(key==Keyboard.KEY_LF || key==Keyboard.KEY_RT || key==Keyboard.KEY_UP || key==Keyboard.KEY_DN){
            self.resource.playSound(self.resource.snd[0]);
        }
		if(key==Keyboard.KEY_LF){
			dir = new V2D(-1,0);
            self.charMain.moveLeft();
		}else if(key==Keyboard.KEY_RT){
			dir = new V2D(1,0);
            self.charMain.moveRight();
		}else if(key==Keyboard.KEY_UP){
			dir = new V2D(0,-1);
            self.charMain.moveUp();
		}else if(key==Keyboard.KEY_DN){
			dir = new V2D(0,1);
            self.charMain.moveDown();
		}else if(key==Keyboard.KEY_SPACE){
            var items = self.game.getItemsAt(self.charMain);
            for(i=0;i<items.length;++i){
                if(items[i].id==CFT.ITEM_ID_SPARKLE_3){
                    self.charMain.mc.image = self.resource.tex[ResourceCFT.TEX_CHAR_GIRL_1];
                    self.charMain.scale = 1.6;
                    self.charMain.offset.x = -5; self.charMain.offset.y = -13;
                    self.game.removeItem(items[i]);
//self.gameMode=CFT.GAME_MODE_GAME;
self.gameMode=CFT.GAME_MODE_DRAW;
//self.mcScreen.removeAllChildren();
self.mcScreen.addChild(self.drawScreen);

var scn0 = new DO();
var scn1 = new DOImage( self.resource.tex[ResourceCFT.TEX_DRAW_BACKGROUND_1] );
var scn2 = new DOImage( self.resource.tex[ResourceCFT.TEX_DRAW_TOOLBAR_1] );
    scn2.matrix.identity();
    scn2.matrix.translate(4,14);
//var scn3 = new DOImage( self.resource.tex[ResourceCFT.TEX_DRAW_BLOCK_BLANK_1] );
var scn3 = new DOImage( self.resource.tex[ResourceCFT.TEX_DRAW_BLOCK_COLOR_1] );
    scn3.matrix.identity();
    scn3.matrix.translate(150,60);
scn0.addChild(scn1);
scn0.addChild(scn2);
scn0.addChild(scn3);
self.drawScreen.addScreen(scn0);
self.drawScreen.gotoFirstScreen();
                }else if(items[i].id==CFT.ITEM_ID_SPARKLE_5){
                    var blocks = self.game.getAllObjectWithID(CFT.BLOCK_ID_DEFAULT);
                    for(j=0;j<blocks.length;++j){
                        blocks[j].mc.image = self.resource.tex[ResourceCFT.TEX_BOX_GRASS_1];
                    }
                    self.game.removeItem(items[i]);
                }else if(items[i].id==CFT.ITEM_ID_SPARKLE_2){
                    var blocks = self.game.getAllObjectWithID(CFT.ITEM_ID_LADDER_DEFAULT);
                    for(j=0;j<blocks.length;++j){
                        blocks[j].mc.image = self.resource.tex[ResourceCFT.TEX_LADDER_GOLD_1];
                    }
                    self.game.removeItem(items[i]);
                }else if(items[i].id==CFT.ITEM_ID_SPARKLE_1){
                    var blocks = self.game.getAllObjectWithID(CFT.ITEM_ID_PORTAL_DEFAULT);
                    for(j=0;j<blocks.length;++j){
                        blocks[j].mc.image = self.resource.tex[ResourceCFT.TEX_PORTAL_GOLD_1];
                    }
                    self.game.removeItem(items[i]);
                }else if(items[i].id==CFT.ITEM_ID_SPARKLE_4){
                    // background
                    var img = self.resource.tex[ResourceCFT.TEX_BACKGROUND_CLOUDS_1];
                    self.game.mcBack.image = img;
                    self.game.mcBack.matrix.identity();
                    self.game.mcBack.matrix.scale(self.game.screenWidth/img.width,self.game.screenHeight/img.height);
                    // 
                    self.game.removeItem(items[i]);
                }
            }
            
        }
	}
	this.keyUpFxn = function(key){

	}
	this.windowResizeFxn = function(o){
	    self.mcContent.matrix.identity();
	    self.mcContent.matrix.translate(o.x/2,o.y/2);
	}
    
	this.enterFrameFxn = function(o){

        if(self.gameMode==CFT.GAME_MODE_GAME){
        var can = self.mcContent.stage.canvas;
        var con = can.getContext();
        var img = self.resource.tex[ResourceCFT.TEX_BOX_BLANK_1];
        var wid = 50, hei = 50;
        var lenX = can.getWidth()/wid, lenY = can.getHeight()/hei;
        var i, j, r, g, b, a;
        /*
        for(i=0;i<lenX;++i){
            for(j=0;j<lenY;++j){
                a = 0xFF;
                r = 0x00;
                g = 0x00;
                b = Math.floor(Math.random()*0xFF);
                con.fillStyle = Code.getJSRGBA( Code.getColRGBA(r,g,b,a));

                con.fillRect(i*wid, j*hei, wid,hei);
            }
        }
        */
        //
        self.game.process();
		self.game.render();
        }else if(self.gameMode==CFT.GAME_MODE_DRAW){
            self.game.render();
        }
	}
	this.exitFrameFxn = function(o){
        /*var can = self.mcContent.stage.canvas;
        var con = can.getContext();
        var img = self.resource.tex[ResourceCFT.TEX_BOX_BLANK_1];
        con.save();
        //con.scale(2,2);
        //con.drawImage(img, 0,0,self.phoneDimX,self.phoneDimY);
        con.fillStyle = con.createPattern(img, "repeat");
        con.fillRect(0, 0, self.phoneDimX,self.phoneDimY);
        con.restore();*/
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


    var can = self.mcContent.stage.canvas;
        var con = can.getContext();
        var img = self.resource.tex[ResourceCFT.TEX_BOX_BLANK_1];
        con.save();
        con.scale(2,2);
        con.drawImage(img, 0,0);
        con.restore();
*/
