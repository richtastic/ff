// LineOrder.js
LineOrder.wtf = "";
// ---------------------------------------------------------------------
function LineOrder(){
	this._list = new LinkedList();
}
LineOrder.prototype.kill = function(){
	this._list.kill();
	this._list = null;
}
/*



*/

