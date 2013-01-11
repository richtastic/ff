// DOButton.js
DOButton.FRAME_MOUSE_OUT = 0;
DOButton.FRAME_MOUSE_OVER = 1;
DOButton.FRAME_MOUSE_DOWN = 2;
DOButton.FRAME_DISABLED = 3;
DOButton.FRAME_CLICK_AREA = 4; // 

function DOButton(parentDO){
	var self = this;
	Code.extendClass(this,DOAnim);
// killing ---------------------------------------------------------------------------------
	self.kill = function(){
		//
		self.super.kill.call(this);
	};
// constructor ---------------------------------------------------------------------------------
	self.currentContent = self.getContentAtFrame(0);
}



