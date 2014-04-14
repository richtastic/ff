// Link3DR.js
function Link3DR(){
	this._A = null; // view A
	this._B = null; // view B
	this._F_AtoB = null; // points from A to lines in B
	this._F_BtoA = null; // points from B to lines in A
	this._extrinsic_AtoB = null; // camera pose B relative to A
	this._extrinsic_BtoA = null; // camera pose A relative to B
	this._rectificationA = null; // 
	this._rectificationB = null; // 
}
// ------------------------------------------------------------------------------------------------------------------------ 
Link3DR.prototype.rectify = function(){
	var epipoleA = 
	this._rectificationA = this._A.getRectification(epipoleA);
	this._rectificationB = this._B.getRectification(epipoleB);
}

Link3DR.prototype.x = function(){
	//
}
Link3DR.prototype.kill = function(){
	//
}
