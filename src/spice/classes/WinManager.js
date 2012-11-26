// WinManager.js
WinManager.DEFAULT_WINDOW_STYLE = {
	bar_height: 25,
	x: 0,
	y: 0,
	width: 250,
	height: 200,
	// 
};
function WinManager(){
	var self = this;
	Code.extendClass(this,DO,arguments);
	this.addWin = function(style){
		Code.copyProperties(style,WinManager.DEFAULT_WINDOW_STYLE);
		var win = new Win(style);
		self.addChild(win);
		////this.win = new Win();
	};
}
