// DOText.js
DOText.ALIGN_LEFT = "left";
DOText.ALIGN_CENTER = "center";
DOText.ALIGN_RIGHT = "left";

DOText.FONT_ARIAL = "arial";
// ------------------------------------------------------------------------------------------------------------------------ 
function DOText(textIN,sizeIN,fontIN,colIN,alignIN,parentDO){
	DOText._.constructor.call(this,parentDO);
	this._text = "";
	this._size = 12;
	this._fontObject = null;
	this._font = DOText.FONT_ARIAL;
	this._color = 0xFFFF0000;
	this._align = DOText.ALIGN_CENTER;
	this._shadowColor = null;
	this._shadowOffsetX = null;
	this._shadowOffsetY = null;
	this._shadowBlur = null;
	// this._shadowColor = 0xFF000000;
	// this._shadowOffsetX = 1;
	// this._shadowOffsetY = 1;
	// this._shadowBlur = 2;
	this.setText(textIN,sizeIN,fontIN,colIN,alignIN);
}
Code.inheritClass(DOText,DO);
// ------------------------------------------------------------------------------------------------------------------------ GET/SET
DOText.prototype.text = function(t){
	if(t!==undefined && t!==null){
		this._text = t;
		this._updateGraphics();
	}
	return this._text;
}
DOText.prototype.size = function(s){
	if(s!==undefined && s!==null){
		this._size = s;
		this._updateGraphics();
	}
	return this._size;
}
DOText.prototype.font = function(f){
	if(f!==undefined && f!==null){
		if(Code.isString(f)){
			this._font = f;
		}else{
			this._fontObject = f;
			this._font = f.name();
		}
		this._updateGraphics();
	}
	return this._font;
}
DOText.prototype.color = function(c){
	if(c!==undefined && c!==null){
		this._color = c;
		this._updateGraphics();
	}
	return this._color;
}
DOText.prototype.align = function(a){
	if(arguments.length>0 && a!=undefined && a!=null){
		this._align = a;
		this._updateGraphics();
	}else{
		return this._align;
	}
}
DOText.prototype.setText = function(txt,siz,fnt,col,aln){
	this.text(txt);
	this.size(siz);
	this.font(fnt);
	this.color(col);
	this.align(aln);
	this._updateGraphics();
}
DOText.prototype.shadow = function(color,rad,x,y){
	this._shadowColor = color;
	this._shadowBlur = rad;
	this._shadowOffsetX = x;
	this._shadowOffsetY = y;
	this._updateGraphics();
}
// ------------------------------------------------------------------------------------------------------------------------ OVERRIDES
DOText.prototype.render = function(canvas){
	DOText._.render.call(this,canvas);
}
// ------------------------------------------------------------------------------------------------------------------------ PROPERTIES
DOText.prototype.topSpace = function(){
	return this._fontObject.top()*this._size;
}
DOText.prototype.botSpace = function(){
	return this._fontObject.bot()*this._size;
}
DOText.prototype.outSpace = function(){
	return this._fontObject.out()*this._size;
}
DOText.prototype._updateGraphics = function(){
	this.graphics().clear();
	if(this._shadowColor){
		this.graphics().shadowColor(this._shadowColor);
	}
	if(this._shadowOffsetX && this._shadowOffsetY){
		this.graphics().shadowOffset(this._shadowOffsetX, this._shadowOffsetY);
	}
	if(this._shadowBlur){
		this.graphics().shadowBlur(this._shadowBlur);
	}
	this.graphics().setFill(this._color);
	this.graphics().drawText(this._text,this._size,this._font,0,0,this._align);
	if(this._shadowColor){
		this.graphics().shadowColor(null);
	}
	if(this._shadowOffsetX && this._shadowOffsetY){
		this.graphics().shadowOffset(null);
	}
	if(this._shadowBlur){
		this.graphics().shadowBlur(null);
	}
}

// wtf?
DOText.prototype.callback = function(o){
	console.log(o.width);
}

// this.addedToStage = Code.overrideClass(this, this.addedToStage, function(stage){
// 	this.super(arguments.callee).addedToStage.call(this,stage);
// 	console.log( this._size );
// 	this.size(this._size);
// });
// ------------------------------------------------------------------------------------------------------------------------ DEATH
DOText.prototype.kill = function(){
	this._text = null;
	this._size = null;
	this._fontObject = null;
	this._font = null;
	this._color = null;
	this._align = null;
	this._shadowColor = null;
	this._shadowOffsetX = null;
	this._shadowOffsetY = null;
	this._shadowBlur = null;
	DOText._.kill.call(this);
}
