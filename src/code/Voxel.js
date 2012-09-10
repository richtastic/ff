// Voxel.js

function Voxel(){
	var self = this;
	this.fore = new Array();	// 
	this.char = new Array();	// 
	//this.coll = new Array();	// 
	this.item = new Array();	// 
	this.back = new Array();	// 
	this.reserved = false;
	this.id = 0;
// -----------------------------------------------
	this.clear = function(){
		Code.emptyArray(self.fore);
		Code.emptyArray(self.char);
		Code.emptyArray(self.item);
		Code.emptyArray(self.back);
		self.reserved = false;
	}
// ----------------------------------------------- fore
	this.setFG = function(arr){
		Code.copyArray(self.fore,arr);
	}
	this.getFG = function(){
		return self.fore;
	}
// ----------------------------------------------- char
	this.setChars = function(arr){
		Code.copyArray(self.char,arr);
	}
	this.getChars = function(){
		return self.char;
	}
	this.addChar = function(ch){
		self.char.push(ch);
	}
	this.removeChar = function(ch){
		Code.removeElement(self.char,ch);
	}
// ----------------------------------------------- item
	this.setItems = function(arr){
		Code.copyArray(self.item,arr);
	}
	this.getItems = function(){
		return self.item;
	}
// ----------------------------------------------- back
	this.setBG = function(arr){
		Code.copyArray(self.back,arr);
	}
	this.getBG = function(){
		return self.back;
	}
// -----------------------------------------------
	this.getReserved = function(){
		return self.reserved;
	}
	this.setReserved = function(bool){
		self.reserved = bool;
	}
}





