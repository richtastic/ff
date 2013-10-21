// Voxel.js

function Voxel(){
	var self = this;
	this.fore = new Array();	// 
	this.char = new Array();	// 
	this.coll = new Array();	// 
	this.item = new Array();	// 
	this.back = new Array();	// 
	this.reserved = false;
	this.id = 0;
// -----------------------------------------------
	this.clear = function(){
		Code.emptyArray(self.fore);
		Code.emptyArray(self.char);
		Code.emptyArray(self.coll);
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
    this.addItem = function(it){
        self.item.push(it);
    }
    this.removeItem = function(it){
        Code.removeElement(self.item,it);
    }
// ----------------------------------------------- coll
	this.setColls = function(arr){
		Code.copyArray(self.coll,arr);
	}
	this.getColls = function(){
		return self.coll;
	}
    this.addColl = function(co){
        self.coll.push(co);
    }
    this.removeColl = function(co){
        Code.removeElement(self.coll,co);
    }
// ----------------------------------------------- back
	this.setBG = function(arr){
		Code.copyArray(self.back,arr);
	}
	this.getBG = function(){
		return self.back;
	}
	this.addBG = function(ba){
		self.back.push(ba);
	}
	this.removeBG = function(ba){
		Code.removeElement(self.back,ba);
	}
// -----------------------------------------------
	this.getReserved = function(){
		return self.reserved;
	}
	this.setReserved = function(bool){
		self.reserved = bool;
	}
}





