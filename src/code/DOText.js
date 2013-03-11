// DOText.js
DOText.ALIGN_LEFT = "left";
DOText.ALIGN_CENTER = "center";
DOText.ALIGN_RIGHT = "left";

function DOText(textIN,sizeIN,fontIN,colIN,alignIN,parentDO){
	var self = this;
	Code.extendClass(this,DO,[parentDO]);
	this._text = "";
	this._size = 12;
	this._font = "arial";
	this._color = 0x000000FF;
	this._align = DOText.ALIGN_CENTER;
	//
	this.render = Code.overrideClass(this, this.render, function(canvas){
		//console.log("TEXT RENDER");
		this.super(this.render).render.call(this,canvas);
	})
	this.text = function(t){
		if(arguments.length>0 && t!=undefined && t!=null){
			self._text = t;
		}else{
			return self._text;
		}
	}
	this.size = function(s){
		if(arguments.length>0 && s!=undefined && s!=null){
			self._size = s;
		}else{
			return self._size;
		}
	}
	this.font = function(f){
		if(arguments.length>0 && f!=undefined && f!=null){
			self._font = f;
		}else{
			return self._font;
		}
	}
	this.color = function(c){
		if(arguments.length>0 && c!=undefined && c!=null){
			self._color = c;
		}else{
			return self._color;
		}
	}
	this.align = function(a){
		if(arguments.length>0 && a!=undefined && a!=null){
			self._align = a;
		}else{
			return self._align;
		}
	}
	this.setText = function(txt,siz,fnt,col,aln){
		self.text(txt);
		self.size(siz);
		self.font(fnt);
		self.color(col);
		self.align(aln);
		self._updateGraphics();
	}
	this.callback = function(o){
		// for(str in o){ console.log(str+": "+o[str]); }
		console.log(o.width);
	}
	this._updateGraphics = function(){
		self.graphics.clear();
		self.graphics.setFill(self._color);
			//self.graphics.measureText("HIA duuude",self.callback);
			//console.log( self.graphics.measureText("HIA duuude") );
		self.graphics.drawText(self._text,self._size,self._font,0,0,self._align);
	}
// killing ---------------------------------------------------------------------------------
	this.kill = Code.overrideClass(this, this.kill, function(){
		// 
		this.super(this.kill).kill.call(this);
	})
// constructor ---------------------------------------------------------------------------------
	this.setText(textIN,sizeIN,fontIN,colIN,alignIN);
}



