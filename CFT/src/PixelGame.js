// PixelGame.js

function PixelGame(mcMain, screenWidth, screenHeight, rec){
	var self = this;
	this.latticeOffX = 0, this.latticeOffY = 0;
	this.latticeCellX = 20, this.latticeCellY = 20;
	this.latticeNumX = 0, this.latticeNumY = 0;
	this.lattice = null;
    this.time = 0;
	this.screenWidth = screenWidth, this.screenHeight = screenHeight;
	this.mcDisplay = mcMain;
        this.mcInfo = null;
		this.mcFront = null;
		this.mcOrder = null;
		this.mcBack = null;
    this.resource = rec;
	// 
	this.constructor = function(){
        self.mcBack = new DOImage(null);
        self.mcOrder = new DO();
        self.mcFront = new DO();
        self.mcInfo = new DO();
        //
        self.mcDisplay.addChild(self.mcBack);
        self.mcDisplay.addChild(self.mcOrder);
        self.mcDisplay.addChild(self.mcFront);
        self.mcDisplay.addChild(self.mcInfo);

		self.latticeNumX = self.screenWidth/self.latticeCellX;
	    self.latticeNumY = self.screenHeight/self.latticeCellY;
	    self.lattice = new Lattice(self.latticeNumX, self.latticeNumY, Voxel);
	}
    this.addListeners = function(){
        //
    }
    this.removeListeners = function(){
        //
    }
    // ----------------------------------------------------------------------- BGs
    this.addBG= function(o){
        self.lattice.getElement(o.pos.x,o.pos.y).addBG(o);
    }
    this.removeBG = function(o){
        self.lattice.getElement(o.pos.x,o.pos.y).removeBG(o);
    }
    // ----------------------------------------------------------------------- items
    this.addItem = function(o){
        self.lattice.getElement(o.pos.x,o.pos.y).addItem(o);
    }
    this.removeItem = function(o){
        self.lattice.getElement(o.pos.x,o.pos.y).removeItem(o);
    }
    // ----------------------------------------------------------------------- colls
    this.addColl = function(o){
        self.lattice.getElement(o.pos.x,o.pos.y).addColl(o);
    }
    this.removeColl = function(o){
        self.lattice.getElement(o.pos.x,o.pos.y).removeColl(o);
    }
    // ----------------------------------------------------------------------- chars
    this.removeChar = function(o){
        self.lattice.getElement(o.pos.x,o.pos.y).removeChar(o);
        self.removeCharListeners(o);
    }
    this.addChar = function(o){
        self.lattice.getElement(o.pos.x,o.pos.y).addChar(o);
        self.addCharListeners(o);
    }
    this.addCharListeners = function(o){
        o.addFunction(Block2D.EVENT_MOVE_UP,self.moveCharUpListener);
        o.addFunction(Block2D.EVENT_MOVE_DOWN,self.moveCharDownListener);
        o.addFunction(Block2D.EVENT_MOVE_LEFT,self.moveCharLeftListener);
        o.addFunction(Block2D.EVENT_MOVE_RIGHT,self.moveCharRightListener);
    }
    this.removeCharListeners = function(o){
        o.removeFunction(Block2D.EVENT_MOVE_UP,self.moveCharUpListener);
        o.removeFunction(Block2D.EVENT_MOVE_DOWN,self.moveCharDownListener);
        o.removeFunction(Block2D.EVENT_MOVE_LEFT,self.moveCharLeftListener);
        o.removeFunction(Block2D.EVENT_MOVE_RIGHT,self.moveCharRightListener);
    }
    this.moveCharLeftListener = function(ch){
        self.moveCharLeft(ch);
    }
    this.moveCharRightListener = function(ch){
        self.moveCharRight(ch);
    }
    this.moveCharUpListener = function(ch){
       self.moveCharUp(ch);
    }
    this.moveCharDownListener = function(ch){
       self.moveCharDown(ch);
    }
    // -----------------------------------------------
    this.moveCharUp = function(ch){
        if(ch.pos.y-ch.description.height<0){
            return;
        }
        if( self.moveChar(ch, ch.description.width,1,
            Math.floor(ch.pos.x),Math.floor(ch.pos.x)+ch.description.width,
            Math.floor(ch.pos.y)-ch.description.height,Math.floor(ch.pos.y)-ch.description.height,
            0,ch.description.width-1,
            0,0) ){
            self.lattice.getElement(ch.pos.x,ch.pos.y).removeChar(ch);
            ch.pos.y -= 1;
            self.lattice.getElement(ch.pos.x,ch.pos.y).addChar(ch);
        }
    }
    this.moveCharDown = function(ch){
        if(ch.pos.y>=self.latticeNumY){
            return;
        }
        if( self.moveChar(ch, ch.description.width,1,
            Math.floor(ch.pos.x),Math.floor(ch.pos.x)+ch.description.width,
            Math.floor(ch.pos.y)+1,Math.floor(ch.pos.y)+1,
            0,ch.description.width-1,
            ch.description.height-1,ch.description.height-1) ){
            self.lattice.getElement(ch.pos.x,ch.pos.y).removeChar(ch);
            ch.pos.y += 1;
            self.lattice.getElement(ch.pos.x,ch.pos.y).addChar(ch);
        }
    }
    this.moveCharRight = function(ch){
        if(ch.pos.x+ch.description.width>=self.latticeNumX){
            return;
        }
        if( self.moveChar(ch, 1,ch.description.height,
            Math.floor(ch.pos.x)+ch.description.width,Math.floor(ch.pos.x)+ch.description.width,
            Math.floor(ch.pos.y)-ch.description.height+1, Math.floor(ch.pos.y),
            ch.description.width-1,ch.description.width-1,
            0,ch.description.height-1) ){
            self.lattice.getElement(ch.pos.x,ch.pos.y).removeChar(ch);
            ch.pos.x += 1;
            self.lattice.getElement(ch.pos.x,ch.pos.y).addChar(ch);
        }
    }
    this.moveCharLeft = function(ch){
        if(ch.pos.x<=0){
            return;
        }
        if( self.moveChar(ch, 1,ch.description.height,
            Math.floor(ch.pos.x)-1,Math.floor(ch.pos.x)-1,
            Math.floor(ch.pos.y)-ch.description.height+1, Math.floor(ch.pos.y),
            0,0,
            0,ch.description.height-1) ){
            self.lattice.getElement(ch.pos.x,ch.pos.y).removeChar(ch);
            ch.pos.x -= 1;
            self.lattice.getElement(ch.pos.x,ch.pos.y).addChar(ch);
        }
    }
    this.moveChar = function(ch, w,h, sX1,eX1, sY1,eY1, sX2,eX2, sY2,eY2){
        var wid = 1, hei = h;
        var charRight = new BinaryGrid(wid,hei);
        var levelLeft = new BinaryGrid(wid,hei);
        var levelAll = new BinaryGrid(self.latticeNumX,self.latticeNumY);
        var i, len, j, x, y, vox, startX, endX, startY, endY;
        // entire level
        startX = 0; endX = self.latticeNumX-1;
        startY = 0; endY = self.latticeNumY-1;
        for(y=startY;y<=endY;++y){
            for(x=startX;x<=endX;++x){
                vox = self.lattice.getElement(x,y);
                self.setCells(levelAll,x,y, vox.char, ch);
                self.setCells(levelAll,x,y, vox.coll, ch);
            }
        }
        // leftmost level
        startX = sX1, endX = eX1;
        startY = sY1, endY = eY1;
        for(y=startY,j=0;y<=endY;++y,++j){
            for(x=startX,i=0;x<=endX;++x,++i){
                levelLeft.setCell(i,j, levelAll.getCell(x,y) );
            }
        }
        //rightmost character
        startX = sX2, endX = eX2;
        startY = sY2, endY = eY2;
        for(y=startY,j=0;y<=endY;++y,++j){
            for(x=startX,i=0;x<=endX;++x,++i){
                charRight.setCell(i,j, ch.description.getCell(x,y) );
            }
        }
        // addition check
        for(i=0;i<charRight.a.length;++i){
            if(charRight.a[i]+levelLeft.a[i]>1){
                return false;
            }
        }
        return true;
    }
    this.getItemsAt = function(blk){
        var items = new Array();
        var i=Math.floor(blk.pos.x), len1=i+blk.description.width;
        var j=Math.floor(blk.pos.y), len2=j+blk.description.height;
        var k, vox, arr;
        for(;i<len1;++i){
            for(;j<len2;++j){
                arr = self.lattice.getElement(i,j).getItems();
                for(k=0;k<arr.length;++k){
                    items.push(arr[k]);
                }
            }
        }
        return items;
    }
    this.setCells = function(bin,x,y,arr, ch){
        var i,j,k;
        for(k=0;k<arr.length;++k){
            obj = arr[k];
            if(obj != ch){
                for(j=0;j<obj.description.height;++j){ //for(j=obj.description.height-1;j>=0;--j){
                    for(i=0;i<obj.description.width;++i){
                        if(obj.description.getCell(i,j)==1){
                            bin.setCell(x+i,y-(obj.description.height-j-1), 1);
                        }
                    }
                }
            }
        }
    }
    this.process = function(){
        var i, j, wid = self.latticeNumX, hei = self.latticeNumY;
        for(j=0;j<hei;++j){
            for(i=0;i<wid;++i){
                vox = self.lattice.getElement(i,j);
                arr = vox.getBG(); len = arr.length;
                for(k=0;k<len;++k){ arr[k].process(self.time) }
                arr = vox.getItems(); len = arr.length;
                for(k=0;k<len;++k){ arr[k].process(self.time) }
                arr = vox.getColls(); len = arr.length;
                for(k=0;k<len;++k){ arr[k].process(self.time) }
                arr = vox.getChars(); len = arr.length;
                for(k=0;k<len;++k){ arr[k].process(self.time) }
            }
        }
        self.time++;
    }
	this.render = function(){
		self.renderLattice();
	}
	this.renderLattice = function(){
		var wid = self.latticeNumX, hei = self.latticeNumY;
		var sizX = self.latticeCellX, sizY = self.latticeCellY;
		var offX = self.latticeOffX, offY = self.latticeOffY;
		var i, j, k, len;
		var img, arr, vox;
		var char, item, back, fore, coll;
		var dispBG = new Array();
        var dispCHR = new Array();
        var dispBLK = new Array();
        var dispFG = new Array();
		
		for(j=0;j<hei;++j){
			for(i=0;i<wid;++i){
				vox = self.lattice.getElement(i,j);
				// backgrounds
				arr = vox.getBG(); len = arr.length;
				for(k=0;k<len;++k){
					back = arr[k];
                    back.render(sizX,sizY, dispBG);
				}
				// items
				arr = vox.getItems(); len = arr.length;
				for(k=0;k<len;++k){
					item = arr[k];
                    item.render(sizX,sizY, dispFG);
				}
				// colls
				arr = vox.getColls(); len = arr.length;
				for(k=0;k<len;++k){
					coll = arr[k];
                    coll.render(sizX,sizY, dispBLK);
				}
                // chars
                arr = vox.getChars(); len = arr.length;
                for(k=0;k<len;++k){
                    char = arr[k];
                    char.render(sizX,sizY, dispCHR);
                }
			}
		}
        //
        self.mcOrder.removeAllChildren();
        while(dispBG.length>0){
            self.mcOrder.addChild( dispBG.pop() );
        }
        while(dispBLK.length>0){
            self.mcOrder.addChild( dispBLK.pop() );
        }
        while(dispCHR.length>0){
            self.mcOrder.addChild( dispCHR.pop() );
        }
        while(dispFG.length>0){
            self.mcOrder.addChild( dispFG.pop() );
        }
	}
    this.getAllObjectWithID = function(id){
        var objs = new Array();
        var i, j, wid = self.latticeNumX, hei = self.latticeNumY;
        for(j=0;j<hei;++j){
            for(i=0;i<wid;++i){
                vox = self.lattice.getElement(i,j);
                arr = vox.getBG(); len = arr.length;
                for(k=0;k<len;++k){ if(arr[k].id==id){ objs.push(arr[k]); } }
                arr = vox.getItems(); len = arr.length;
                for(k=0;k<len;++k){ if(arr[k].id==id){ objs.push(arr[k]); } }
                arr = vox.getColls(); len = arr.length;
                for(k=0;k<len;++k){ if(arr[k].id==id){ objs.push(arr[k]); } }
                arr = vox.getChars(); len = arr.length;
                for(k=0;k<len;++k){ if(arr[k].id==id){ objs.push(arr[k]); } }
            }
        }
        return objs;
    }
    // 
	this.constructor();
}

