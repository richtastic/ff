// PageUserList.js < PageWeb
PageUserList.CONSTANT = 1;

// ------------------------------------------------------------------------------ constructor
function PageUserList(container, interface){
	PageUserList._.constructor.call(this,container);
	Code.addClass(this._root,"requestContainer");
	this._interface = interface;
	this._init();
	/*
		this._interface.getUsers(0,10, this, this.tmp);
		}
		Volunteer.prototype.tmp = function(o){
			console.log(o);
		}
	*/
}
Code.inheritClass(PageUserList, PageWeb);
// ------------------------------------------------------------------------------ 
PageUserList.prototype._init = function(){

}
// ------------------------------------------------------------------------------ 
PageUserList.prototype.wtf = function(){
	
}

