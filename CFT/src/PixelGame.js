// PixelGame.js

function PixelGame(mcMain, screenWidth, screenHeight){
	var self = this;
	this.latticeOffX = 0, this.latticeOffY = 0;
	this.latticeCellX = 20, this.latticeCellY = 20;
	this.latticeNumX = 0, this.latticeNumY = 0;
	this.lattice = null;
	this.screenWidth = screenWidth, this.screenHeight = screenHeight;
	this.mcDisplay = mcMain;
		this.mcFront = null;
		this.mcOrder = null;
		this.mcBack = null;
	// 
	this.constructor = function(){
		self.latticeNumX = self.screenWidth/self.latticeCellX;
	    self.latticeNumY = self.screenHeight/self.latticeCellY;
	    self.lattice = new Lattice(self.latticeNumX, self.latticeNumY, Voxel);
	}
	this.render = function(){
		self.renderLattice();
	}
	this.renderLattice = function(){
		var wid = self.latticeNumX, hei = self.latticeNumY;
		var sizX = self.latticeCellX, sizY = self.latticeCellY;
		var offX = self.latticeOffX, offY = self.latticeOffY;
		//var can = self.canvas.getCanvas();
		//var con = self.canvas.getContext();
		var i, j, k, len;
		var img, arr, vox;
		var char, item, back, fore, coll;
		self.mcDisplay.removeAllChildren();
		
		for(j=0;j<hei;++j){
			for(i=0;i<wid;++i){
				vox = self.lattice.getElement(i,j);
				// backgrounds
				arr = vox.getBG(); len = arr.length;
				for(k=0;k<len;++k){
					back = arr[k];
					self.mcDisplay.addChild( back.mc );
					//con.drawImage(img, offX+sizX*i,offY+sizY*j, sizX,sizY);
				}
				// items
				arr = vox.getItems(); len = arr.length;
				for(k=0;k<len;++k){
					//img = arr[k];
					//con.drawImage(img, offX+sizX*i,offY+sizY*j, sizX,sizY);
				}
				// chars
				arr = vox.getChars(); len = arr.length;
				for(k=0;k<len;++k){
					//img = arr[k];
					//con.drawImage(img, offX+sizX*i,offY+sizY*j, sizX,sizY);
				}
			}
		}
	}

	this.constructor();
}

