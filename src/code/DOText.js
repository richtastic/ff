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
	this.graphics().setFill(this._color);
	this.graphics().drawText(this._text,this._size,this._font,0,0,this._align);
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
DOText.prototype.kill = function(canvas){
	//
	DOText._.kill.call(this,canvas);
}
