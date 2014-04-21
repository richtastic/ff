// Scene3DR.js
function Scene3DR(){
	this._views = new Array();
	this._links = new Array();
	/*
	- 3D points [i]
	- triangle lattice
	- textures [i]
	- cameras [i]
	*/
}
// ------------------------------------------------------------------------------------------------------------------------ GET/SET
Scene3DR.prototype.addView = function(view){
	this._views.push(view);
}
Scene3DR.prototype.addLink = function(l,m){
	var link = l;
	if(m!==undefined){
		link = new Link3DR();
		link.A(l); link.B(m);
		this._links.push(link);
	}else{
		this._links.push(l);
	}
	link.A().addLink(link);
	link.B().addLink(link);
	return link;
}
Scene3DR.prototype.link = function(i){
	return this._links[i];
}
// ------------------------------------------------------------------------------------------------------------------------ 
Scene3DR.prototype.bundleAdjust = function(){
	// var A = link.A(), B = link.B();
	// multi-view bundle adjust goes here
	var link, i, len = this._links.length;
	for(i=0;i<len;++i){
		link = this._links[i];
		link.bundleAdjust();
	}
}
// ------------------------------------------------------------------------------------------------------------------------ 
Scene3DR.prototype.x = function(){
}
Scene3DR.prototype.kill = function(){
	//
}