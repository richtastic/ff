// Vor.js

function Vor(){
	this._canvas = new Canvas(null,0,0,Canvas.STAGE_FIT_FILL);
	this._stage = new Stage(this._canvas,(1/10)*1000);
	this._root = new DO();
	this._stage.addChild(this._root);
	this._root.matrix().scale(1.0,-1.0);
	//this._canvas = new Canvas(null,0,0,Canvas.STAGE_FIT_FILL, false,false);
	this._canvas.addListeners();
	this._stage.addListeners();
	this._stage.start();
	//this._root.matrix().scale(2.0);
	this._root.matrix().translate(200,500);
	this._stage.start();
	this.voronoi();
	this._keyboard = new Keyboard();
	this._keyboard.addFunction(Keyboard.EVENT_KEY_DOWN, this.keyboardFxnKeyDown, this);
	this._keyboard.addFunction(Keyboard.EVENT_KEY_STILL_DOWN, this.keyboardFxnKeyDown2, this);
	this._keyboard.addFunction(Keyboard.EVENT_KEY_UP, this.keyboardFxnKeyUp, this);
	this._keyboard.addListeners();
	
}
	
Vor.prototype.keyboardFxnKeyUp = function(e){
	// console.log("key up "+e);
}
Vor.prototype.keyboardFxnKeyDown = function(e){
	// console.log("key down "+e);
	if(e.keyCode==Keyboard.KEY_SPACE){
		if(this._ticker.isRunning()){
			console.log("PAUSE");
			this._ticker.stop();
		}else{
			console.log("START");
			this._ticker.start();
		}
	}
}
Vor.prototype.keyboardFxnKeyDown2 = function(e){
	// console.log("key still down "+e);
}

Vor.prototype.voronoi = function(){
	var points = new Array();
// DISPLAY GROUP:
	// points.push( new V2D(-3,7) );
	// points.push( new V2D(-2,4) );
	// points.push( new V2D(-1,5) );
	// points.push( new V2D(-0.5,1) );
	// points.push( new V2D(0,3) );
	// points.push( new V2D(1,8) );
	// points.push( new V2D(2,4.5) );
	// points.push( new V2D(2.5,3) );
	// points.push( new V2D(3,7) );
	// points.push( new V2D(4,0) );
	// points.push( new V2D(4.5,4) );
	// points.push( new V2D(5,9) );
	// points.push( new V2D(6,2) );
	// points.push( new V2D(7,6) );
	// points.push( new V2D(7.5,3) );
	// points.push( new V2D(8,7) );
	// points.push( new V2D(9,6) );
	// points.push( new V2D(10,4) );
	// points.push( new V2D(11,3) );
	// points.push( new V2D(12,2) );
	// points.push( new V2D(13,0) );
	// points.push( new V2D(14,6) );
	// points.push( new V2D(15,9) );
	// points.push( new V2D(15.5,4) );
	// points.push( new V2D(16,8) );
	// points.push( new V2D(17,5.5) );
	// points.push( new V2D(18,2) );
	// points.push( new V2D(19,1) );
	// points.push( new V2D(20,6) );

// VALENCE 4 VERTEX IN HERE SOMEWHERE:
	// points.push( new V2D(-3,7) );
	// points.push( new V2D(-2,4) );
	// points.push( new V2D(-1,5) );
	// points.push( new V2D(-0.5,1) );
	// points.push( new V2D(0,3) );
	// points.push( new V2D(1,8) );
	// points.push( new V2D(2,4.5) );
	// points.push( new V2D(2.5,3) );
	// points.push( new V2D(3,7) );
	// points.push( new V2D(4,0) );
	// points.push( new V2D(4.5,4) );
	// points.push( new V2D(5,9) );
	// points.push( new V2D(6,2) );
	// points.push( new V2D(7,6) );
	// points.push( new V2D(7.5,3) );
	// points.push( new V2D(8,8) );
	// points.push( new V2D(9,6) );
	// points.push( new V2D(10,4) );
	// points.push( new V2D(11,3) );
	// points.push( new V2D(12,2) );
	// points.push( new V2D(13,0) );
	// points.push( new V2D(14,6) );
	// points.push( new V2D(15,9) );
	// points.push( new V2D(15.5,4) );


// NEW TEST
// points.push( new V2D(226,87) );
// points.push( new V2D(172,107) );
// points.push( new V2D(216,154) );
// points.push( new V2D(22.5,166) );
// points.push( new V2D(361,183) );
// points.push( new V2D(18,225) );

// points.push( new V2D(18,225) );
// points.push( new V2D(172,107) );
// points.push( new V2D(22.5,166) );


// points.push( new V2D(18,225) );
// points.push( new V2D(172,225) );
// points.push( new V2D(22.5,225) );
// points.push( new V2D(100,200) );

//<15,215> | <15,205> | <15,175> ::: false
/*
points.push( new V2D(15,215) );
points.push( new V2D(15,205) );
points.push( new V2D(15,175) );
Code.colinear(new V2D(15,215), new V2D(15,205), new V2D(15,175));
*/



/*
// real example:
points.push( new V2D(219,66) );
points.push( new V2D(250,72) );
points.push( new V2D(252.5,77.5) );
points.push( new V2D(247.5,82.5) );
points.push( new V2D(252.5,82.5) );
points.push( new V2D(226,87) );
points.push( new V2D(237.5,87.5) );
points.push( new V2D(242.5,87.5) );
points.push( new V2D(247.5,87.5) );
points.push( new V2D(227.5,92.5) );
points.push( new V2D(237.5,92.5) );
points.push( new V2D(242.5,92.5) );
points.push( new V2D(222.5,97.5) );
points.push( new V2D(242.5,97.5) );
points.push( new V2D(247.5,97.5) );
points.push( new V2D(252.5,97.5) );
points.push( new V2D(260,103) );
points.push( new V2D(172,107) );
points.push( new V2D(197.5,107.5) );
points.push( new V2D(202.5,107.5) );
points.push( new V2D(257.5,107.5) );
points.push( new V2D(167.5,112.5) );
points.push( new V2D(182.5,112.5) );
points.push( new V2D(192.5,112.5) );
points.push( new V2D(197.5,112.5) );
points.push( new V2D(202.5,112.5) );
points.push( new V2D(252.5,112.5) );
points.push( new V2D(182.5,117.5) );
points.push( new V2D(187.5,117.5) );
points.push( new V2D(192.5,117.5) );
points.push( new V2D(197.5,117.5) );
points.push( new V2D(202.5,117.5) );
points.push( new V2D(187.5,122.5) );
points.push( new V2D(202.5,122.5) );
points.push( new V2D(207.5,122.5) );
points.push( new V2D(202,127) );
points.push( new V2D(202.5,132.5) );
points.push( new V2D(207.5,132.5) );
points.push( new V2D(197.5,137.5) );
points.push( new V2D(202.5,137.5) );
points.push( new V2D(222.5,137.5) );
points.push( new V2D(227.5,137.5) );
points.push( new V2D(237.5,137.5) );
points.push( new V2D(192.5,142.5) );
points.push( new V2D(197.5,142.5) );
points.push( new V2D(202.5,142.5) );
points.push( new V2D(207.5,142.5) );
points.push( new V2D(212.5,142.5) );
points.push( new V2D(232.5,142.5) );
points.push( new V2D(187.5,147.5) );
points.push( new V2D(192.5,147.5) );
points.push( new V2D(207.5,147.5) );
points.push( new V2D(212.5,147.5) );
points.push( new V2D(217.5,147.5) );
points.push( new V2D(222.5,147.5) );
points.push( new V2D(227.5,147.5) );
points.push( new V2D(232.5,147.5) );
points.push( new V2D(242.5,147.5) );
points.push( new V2D(247.5,147.5) );
points.push( new V2D(182.5,152.5) );
points.push( new V2D(192.5,152.5) );
points.push( new V2D(197.5,152.5) );
points.push( new V2D(202.5,152.5) );
points.push( new V2D(207.5,152.5) );
points.push( new V2D(212.5,152.5) );
points.push( new V2D(216,154) );
points.push( new V2D(222.5,152.5) );
points.push( new V2D(227.5,152.5) );
points.push( new V2D(232.5,152.5) );
points.push( new V2D(242.5,152.5) );
points.push( new V2D(247.5,152.5) );
points.push( new V2D(252.5,152.5) );
points.push( new V2D(257.5,152.5) );
points.push( new V2D(212.5,157.5) );
points.push( new V2D(222.5,157.5) );
points.push( new V2D(227.5,157.5) );
points.push( new V2D(232.5,157.5) );
points.push( new V2D(237.5,157.5) );
points.push( new V2D(245,158) );
points.push( new V2D(247.5,157.5) );
points.push( new V2D(252.5,157.5) );
points.push( new V2D(257.5,157.5) );
points.push( new V2D(12.5,162.5) );
points.push( new V2D(232.5,162.5) );
points.push( new V2D(237.5,162.5) );
points.push( new V2D(247.5,162.5) );
points.push( new V2D(12.5,167.5) );
points.push( new V2D(17.5,167.5) );
points.push( new V2D(22.5,166) ); /////// no
points.push( new V2D(2.5,172.5) );
points.push( new V2D(7.5,172.5) );
points.push( new V2D(12.5,172.5) );
points.push( new V2D(17.5,172.5) );
points.push( new V2D(27.5,172.5) );
points.push( new V2D(7.5,177.5) );

points.push( new V2D(12.5,177.5) );
points.push( new V2D(17.5,177.5) ); //// problematic
points.push( new V2D(27.5,182.5) );

points.push( new V2D(27.5,187.5) );
points.push( new V2D(12.5,192.5) );
points.push( new V2D(22.5,192.5) );
points.push( new V2D(27.5,192.5) );
points.push( new V2D(32.5,192.5) );
points.push( new V2D(17.5,197.5) );
points.push( new V2D(22.5,197.5) );
points.push( new V2D(27.5,197.5) );
points.push( new V2D(32.5,197.5) );
points.push( new V2D(32.5,202.5) );
points.push( new V2D(17.5,207.5) );
points.push( new V2D(27.5,207.5) );
points.push( new V2D(32.5,207.5) );
points.push( new V2D(17.5,212.5) );
points.push( new V2D(22.5,212.5) );
points.push( new V2D(27.5,212.5) );
points.push( new V2D(32.5,212.5) );
points.push( new V2D(37.5,212.5) );
points.push( new V2D(42.5,212.5) );
points.push( new V2D(27.5,217.5) );
points.push( new V2D(32.5,217.5) );
points.push( new V2D(37.5,217.5) );
points.push( new V2D(7.5,222.5) );
points.push( new V2D(12.5,222.5) );
points.push( new V2D(18,225) );
points.push( new V2D(22.5,222.5) );
points.push( new V2D(27.5,222.5) );
points.push( new V2D(7.5,227.5) );
points.push( new V2D(12.5,227.5) );
points.push( new V2D(17.5,227.5) );
points.push( new V2D(361,183) );

// causal
points.push( new V2D(7.5,232.5) );
*/


// TEST GROUP:
/*
	points.push( new V2D(5,8) );
	points.push( new V2D(6,7.5) );
	points.push( new V2D(4,7) );
	points.push( new V2D(3,5) );
	points.push( new V2D(7,5) );
	points.push( new V2D(9.5,4) );
	points.push( new V2D(5,3) );
	points.push( new V2D(3,2.75) );
	points.push( new V2D(7,2.75) );
	points.push( new V2D(5.5,2.5) );
*/
// points.push( new V2D(3,6) );
// points.push( new V2D(4,6) );
// points.push( new V2D(5.5,4) );

// points.push( new V2D(3,6) );
// points.push( new V2D(5,6) );
// points.push( new V2D(4,6) );
// points.push( new V2D(5,5) );
// points.push( new V2D(5.5,4) );

// points.push( new V2D(3,6) );
// points.push( new V2D(5,6) );
// points.push( new V2D(4,6) );


	// points.push( new V2D(2,7) );
	// points.push( new V2D(3,4) );
	// points.push( new V2D(5,2) );
	// points.push( new V2D(5,6) );
	// points.push( new V2D(6,4) );
	// points.push( new V2D(8,2) );
	// points.push( new V2D(3,7.0) );
	// points.push( new V2D(3.5,7.0) );
	// points.push( new V2D(5,7.5) );

// points.push( new V2D(1,1) );
// points.push( new V2D(0,6) );
// points.push( new V2D(1,8) );
// points.push( new V2D(0.5,7) );
// points.push( new V2D(0,0) );
// points.push( new V2D(1.4,6.2) );
// points.push( new V2D(1.5,6.2) );
// points.push( new V2D(1.6,6.2) );
// points.push( new V2D(3.4,7.2) );
// points.push( new V2D(3.5,7.1) );
// points.push( new V2D(4.7,7.0) );
// points.push( new V2D(3.4,7.4) );
// points.push( new V2D(3.5,7.3) );
// points.push( new V2D(3.1,6.6) );
// points.push( new V2D(4.1,5.6) );
// points.push( new V2D(3.1,5.7) );
// points.push( new V2D(6.6,4.6) );
// points.push( new V2D(6.4,4.7) );
// for(i=0;i<50;++i){
// 	points.push( new V2D(Math.random()*30,Math.random()*10) );
// }
// remove duplicate points 

/*
// ALREADY ASSIGNED
points.push( new V2D(219,66) ); // 0
points.push( new V2D(225,65) ); // 1
points.push( new V2D(255,65) ); // 2
points.push( new V2D(145,75) ); // 3
points.push( new V2D(250,72) ); // 4
points.push( new V2D(255,75) ); // 5
points.push( new V2D(145,85) ); // 6
points.push( new V2D(155,85) ); // 7
points.push( new V2D(165,85) ); // 8
points.push( new V2D(175,85) ); // 9
points.push( new V2D(195,85) ); // 10
points.push( new V2D(205,85) ); // 11
points.push( new V2D(226,87) ); // 12
points.push( new V2D(245,85) ); // 13
points.push( new V2D(145,95) ); // 14
points.push( new V2D(155,95) ); // 15
points.push( new V2D(165,95) ); // 16
points.push( new V2D(175,95) ); // 17
points.push( new V2D(185,95) ); // 18
points.push( new V2D(235,95) ); // 19
points.push( new V2D(245,95) ); // 20
points.push( new V2D(145,105) ); // 21
points.push( new V2D(155,105) ); // 22
points.push( new V2D(165,105) ); // 23
points.push( new V2D(172,107) ); // 24
points.push( new V2D(260,103) ); // 25
points.push( new V2D(145,115) ); // 26
points.push( new V2D(155,115) ); // 27
points.push( new V2D(165,115) ); // 28
points.push( new V2D(175,115) ); // 29
points.push( new V2D(185,115) ); // 30
points.push( new V2D(165,125) ); // 31
points.push( new V2D(185,125) ); // 32
points.push( new V2D(175,135) ); // 33
points.push( new V2D(205,135) ); // 34
points.push( new V2D(225,135) ); // 35
points.push( new V2D(175,145) ); // 36
points.push( new V2D(205,145) ); // 37
points.push( new V2D(215,145) ); // 38
points.push( new V2D(235,145) ); // 39
points.push( new V2D(255,145) ); // 40
points.push( new V2D(265,145) ); // 41
points.push( new V2D(216,154) ); // 42
points.push( new V2D(225,155) ); // 43
points.push( new V2D(235,155) ); // 44
points.push( new V2D(245,158) ); // 45
points.push( new V2D(255,155) ); // 46
points.push( new V2D(15,165) ); // 47
points.push( new V2D(22.5,166) ); // 48
points.push( new V2D(15,175) ); // 49
points.push( new V2D(25,175) ); // 50
points.push( new V2D(355,175) ); // 51
points.push( new V2D(345,185) ); // 52
points.push( new V2D(355,185) ); // 53
points.push( new V2D(361,183) ); // 54
points.push( new V2D(375,185) ); // 55
points.push( new V2D(25,195) ); // 56
points.push( new V2D(35,195) ); // 57
points.push( new V2D(355,195) ); // 58
points.push( new V2D(365,195) ); // 59
points.push( new V2D(45,205) ); // 60
points.push( new V2D(375,205) ); // 61
points.push( new V2D(15,215) ); // 62
points.push( new V2D(35,215) ); // 63
points.push( new V2D(5,225) ); // 64
points.push( new V2D(18,225) ); // 65
points.push( new V2D(25,225) ); // 66
*/
points.push( new V2D(175,55) ); // 0
points.push( new V2D(245,55) ); // 1
points.push( new V2D(255,55) ); // 2
points.push( new V2D(165,65) ); // 3
points.push( new V2D(172,68) ); // 4
points.push( new V2D(185,65) ); // 5
points.push( new V2D(225,65) ); // 6
points.push( new V2D(235,65) ); // 7
points.push( new V2D(245,65) ); // 8
points.push( new V2D(255,65) ); // 9
points.push( new V2D(95,75) ); // 10
points.push( new V2D(141,76) ); // 11
points.push( new V2D(165,75) ); // 12
points.push( new V2D(185,75) ); // 13
points.push( new V2D(195,75) ); // 14
points.push( new V2D(204,75) ); // 15
points.push( new V2D(215,75) ); // 16
points.push( new V2D(225,75) ); // 17
points.push( new V2D(250,72) ); // 18
points.push( new V2D(255,75) ); // 19
points.push( new V2D(265,75) ); // 20
points.push( new V2D(55,85) ); // 21
points.push( new V2D(65,85) ); // 22
points.push( new V2D(75,85) ); // 23
points.push( new V2D(95,85) ); // 24
points.push( new V2D(129,88) ); // 25
points.push( new V2D(145,85) ); // 26
points.push( new V2D(155,85) ); // 27
points.push( new V2D(165,85) ); // 28
points.push( new V2D(175,85) ); // 29
points.push( new V2D(195,85) ); // 30
points.push( new V2D(205,85) ); // 31
points.push( new V2D(215,85) ); // 32
points.push( new V2D(226,87) ); // 33
points.push( new V2D(245,85) ); // 34
points.push( new V2D(265,85) ); // 35
points.push( new V2D(275,85) ); // 36
points.push( new V2D(55,95) ); // 37
points.push( new V2D(85,95) ); // 38
points.push( new V2D(95,95) ); // 39
points.push( new V2D(135,95) ); // 40
points.push( new V2D(145,95) ); // 41
points.push( new V2D(155,95) ); // 42
points.push( new V2D(165,95) ); // 43
points.push( new V2D(175,95) ); // 44
points.push( new V2D(185,95) ); // 45
points.push( new V2D(195,95) ); // 46
points.push( new V2D(205,95) ); // 47
points.push( new V2D(215,95) ); // 48
points.push( new V2D(235,95) ); // 49
points.push( new V2D(245,95) ); // 50
points.push( new V2D(275,95) ); // 51
points.push( new V2D(62,107) ); // 52
points.push( new V2D(135,105) ); // 53
points.push( new V2D(145,105) ); // 54
points.push( new V2D(155,105) ); // 55
points.push( new V2D(165,105) ); // 56
points.push( new V2D(172,107) ); // 57
points.push( new V2D(195,105) ); // 58
points.push( new V2D(215,105) ); // 59
points.push( new V2D(225,105) ); // 60
points.push( new V2D(235,105) ); // 61
points.push( new V2D(245,105) ); // 62
points.push( new V2D(260,103) ); // 63
points.push( new V2D(265,105) ); // 64
points.push( new V2D(65,115) ); // 65
points.push( new V2D(75,115) ); // 66
points.push( new V2D(135,115) ); // 67
points.push( new V2D(144,119) ); // 68
points.push( new V2D(155,115) ); // 69
points.push( new V2D(165,115) ); // 70
points.push( new V2D(175,115) ); // 71
points.push( new V2D(185,115) ); // 72
points.push( new V2D(195,115) ); // 73
points.push( new V2D(205,115) ); // 74
points.push( new V2D(215,115) ); // 75
points.push( new V2D(225,115) ); // 76
points.push( new V2D(235,115) ); // 77
points.push( new V2D(255,115) ); // 78
points.push( new V2D(55,125) ); // 79
points.push( new V2D(85,125) ); // 80
points.push( new V2D(95,125) ); // 81
points.push( new V2D(105,125) ); // 82
points.push( new V2D(115,125) ); // 83
points.push( new V2D(125,125) ); // 84
points.push( new V2D(135,125) ); // 85
points.push( new V2D(165,125) ); // 86
points.push( new V2D(175,128) ); // 87
points.push( new V2D(185,125) ); // 88
points.push( new V2D(195,125) ); // 89
points.push( new V2D(202,127) ); // 90
points.push( new V2D(215,125) ); // 91
points.push( new V2D(235,125) ); // 92
points.push( new V2D(255,125) ); // 93
points.push( new V2D(265,125) ); // 94
points.push( new V2D(45,135) ); // 95
points.push( new V2D(75,135) ); // 96
points.push( new V2D(95,135) ); // 97
points.push( new V2D(105,135) ); // 98
points.push( new V2D(125,135) ); // 99
points.push( new V2D(135,135) ); // 100
points.push( new V2D(145,135) ); // 101
points.push( new V2D(155,135) ); // 102
points.push( new V2D(165,135) ); // 103
points.push( new V2D(175,135) ); // 104
points.push( new V2D(195,135) ); // 105
points.push( new V2D(205,135) ); // 106
points.push( new V2D(215,135) ); // 107
points.push( new V2D(225,135) ); // 108
points.push( new V2D(235,135) ); // 109
points.push( new V2D(245,135) ); // 110
points.push( new V2D(265,135) ); // 111
points.push( new V2D(275,135) ); // 112
points.push( new V2D(285,135) ); // 113
points.push( new V2D(295,135) ); // 114
points.push( new V2D(25,145) ); // 115
points.push( new V2D(45,145) ); // 116
points.push( new V2D(55,145) ); // 117
points.push( new V2D(65,145) ); // 118
points.push( new V2D(85,145) ); // 119
points.push( new V2D(95,145) ); // 120
points.push( new V2D(105,145) ); // 121
points.push( new V2D(115,145) ); // 122
points.push( new V2D(125,145) ); // 123
points.push( new V2D(132,141) ); // 124
points.push( new V2D(145,145) ); // 125
points.push( new V2D(155,145) ); // 126
points.push( new V2D(165,145) ); // 127
points.push( new V2D(175,145) ); // 128
points.push( new V2D(185,145) ); // 129
points.push( new V2D(195,145) ); // 130
points.push( new V2D(205,145) ); // 131
points.push( new V2D(215,145) ); // 132
points.push( new V2D(225,145) ); // 133
points.push( new V2D(235,145) ); // 134
points.push( new V2D(245,145) ); // 135
points.push( new V2D(255,145) ); // 136
points.push( new V2D(265,145) ); // 137
points.push( new V2D(275,145) ); // 138
points.push( new V2D(285,145) ); // 139
points.push( new V2D(295,145) ); // 140
points.push( new V2D(5,155) ); // 141
points.push( new V2D(15,155) ); // 142
points.push( new V2D(25,155) ); // 143
points.push( new V2D(35,155) ); // 144
points.push( new V2D(45,155) ); // 145
points.push( new V2D(55,155) ); // 146
points.push( new V2D(65,155) ); // 147
points.push( new V2D(85,155) ); // 148
points.push( new V2D(95,155) ); // 149
points.push( new V2D(105,155) ); // 150
points.push( new V2D(115,155) ); // 151
points.push( new V2D(125,155) ); // 152
points.push( new V2D(165,155) ); // 153
points.push( new V2D(175,155) ); // 154
points.push( new V2D(185,155) ); // 155
points.push( new V2D(195,155) ); // 156
points.push( new V2D(205,155) ); // 157
points.push( new V2D(216,154) ); // 158
points.push( new V2D(225,155) ); // 159
points.push( new V2D(235,155) ); // 160
points.push( new V2D(245,158) ); // 161
points.push( new V2D(255,155) ); // 162
points.push( new V2D(295,155) ); // 163
points.push( new V2D(5,165) ); // 164
points.push( new V2D(22.5,166) ); // 165
points.push( new V2D(35,165) ); // 166
points.push( new V2D(45,165) ); // 167
points.push( new V2D(75,165) ); // 168
points.push( new V2D(85,165) ); // 169
points.push( new V2D(95,165) ); // 170
points.push( new V2D(115,165) ); // 171
points.push( new V2D(125,165) ); // 172
points.push( new V2D(131,166) ); // 173
points.push( new V2D(145,165) ); // 174
points.push( new V2D(155,165) ); // 175
points.push( new V2D(165,165) ); // 176
points.push( new V2D(175,165) ); // 177
points.push( new V2D(195,165) ); // 178
points.push( new V2D(225,165) ); // 179
points.push( new V2D(235,165) ); // 180
points.push( new V2D(255,165) ); // 181
points.push( new V2D(5,175) ); // 182
points.push( new V2D(15,175) ); // 183
points.push( new V2D(25,175) ); // 184
points.push( new V2D(35,175) ); // 185
points.push( new V2D(45,175) ); // 186
points.push( new V2D(55,175) ); // 187
points.push( new V2D(65,175) ); // 188
points.push( new V2D(85,175) ); // 189
points.push( new V2D(94,176) ); // 190
points.push( new V2D(115,175) ); // 191
points.push( new V2D(165,175) ); // 192
points.push( new V2D(175,175) ); // 193
points.push( new V2D(190,173) ); // 194
points.push( new V2D(195,175) ); // 195
points.push( new V2D(205,175) ); // 196
points.push( new V2D(215,175) ); // 197
points.push( new V2D(225,175) ); // 198
points.push( new V2D(245,175) ); // 199
points.push( new V2D(255,175) ); // 200
points.push( new V2D(265,178) ); // 201
points.push( new V2D(275,175) ); // 202
points.push( new V2D(285,175) ); // 203
points.push( new V2D(326,176) ); // 204
points.push( new V2D(335,175) ); // 205
points.push( new V2D(345,175) ); // 206
points.push( new V2D(355,175) ); // 207
points.push( new V2D(5,185) ); // 208
points.push( new V2D(25,185) ); // 209
points.push( new V2D(35,185) ); // 210
points.push( new V2D(45,185) ); // 211
points.push( new V2D(65,185) ); // 212
points.push( new V2D(75,185) ); // 213
points.push( new V2D(85,185) ); // 214
points.push( new V2D(95,185) ); // 215
points.push( new V2D(105,185) ); // 216
points.push( new V2D(155,185) ); // 217
points.push( new V2D(165,185) ); // 218
points.push( new V2D(175,185) ); // 219
points.push( new V2D(185,185) ); // 220
points.push( new V2D(195,185) ); // 221
points.push( new V2D(205,185) ); // 222
points.push( new V2D(275,185) ); // 223
points.push( new V2D(285,185) ); // 224
points.push( new V2D(295,185) ); // 225
points.push( new V2D(305,185) ); // 226
points.push( new V2D(315,185) ); // 227
points.push( new V2D(325,185) ); // 228
points.push( new V2D(335,185) ); // 229
points.push( new V2D(345,185) ); // 230
points.push( new V2D(355,185) ); // 231
points.push( new V2D(361,183) ); // 232
points.push( new V2D(372,181) ); // 233
points.push( new V2D(5,195) ); // 234
points.push( new V2D(15,195) ); // 235
points.push( new V2D(25,195) ); // 236
points.push( new V2D(35,195) ); // 237
points.push( new V2D(45,195) ); // 238
points.push( new V2D(65,195) ); // 239
points.push( new V2D(75,195) ); // 240
points.push( new V2D(85,195) ); // 241
points.push( new V2D(95,195) ); // 242
points.push( new V2D(105,195) ); // 243
points.push( new V2D(115,195) ); // 244
points.push( new V2D(125,195) ); // 245
points.push( new V2D(135,195) ); // 246
points.push( new V2D(145,195) ); // 247
points.push( new V2D(155,195) ); // 248
points.push( new V2D(175,195) ); // 249
points.push( new V2D(185,195) ); // 250
points.push( new V2D(195,195) ); // 251
points.push( new V2D(215,195) ); // 252
points.push( new V2D(225,195) ); // 253
points.push( new V2D(265,195) ); // 254
points.push( new V2D(275,195) ); // 255
points.push( new V2D(325,195) ); // 256
points.push( new V2D(335,195) ); // 257
points.push( new V2D(355,195) ); // 258
points.push( new V2D(365,195) ); // 259
points.push( new V2D(5,205) ); // 260
points.push( new V2D(15,205) ); // 261
points.push( new V2D(25,205) ); // 262
points.push( new V2D(35,205) ); // 263
points.push( new V2D(45,205) ); // 264
points.push( new V2D(65,205) ); // 265
points.push( new V2D(85,205) ); // 266
points.push( new V2D(95,205) ); // 267
points.push( new V2D(105,205) ); // 268
points.push( new V2D(125,205) ); // 269
points.push( new V2D(135,205) ); // 270
points.push( new V2D(145,203) ); // 271
points.push( new V2D(155,205) ); // 272
points.push( new V2D(185,205) ); // 273
points.push( new V2D(215,205) ); // 274
points.push( new V2D(225,205) ); // 275
points.push( new V2D(235,205) ); // 276
points.push( new V2D(245,205) ); // 277
points.push( new V2D(255,205) ); // 278
points.push( new V2D(265,205) ); // 279
points.push( new V2D(335,205) ); // 280
points.push( new V2D(345,205) ); // 281
points.push( new V2D(365,205) ); // 282
points.push( new V2D(375,205) ); // 283
points.push( new V2D(385,205) ); // 284
points.push( new V2D(5,215) ); // 285
points.push( new V2D(15,215) ); // 286
points.push( new V2D(25,215) ); // 287
points.push( new V2D(35,215) ); // 288
points.push( new V2D(55,215) ); // 289
points.push( new V2D(85,215) ); // 290
points.push( new V2D(95,215) ); // 291
points.push( new V2D(105,215) ); // 292
points.push( new V2D(135,215) ); // 293
points.push( new V2D(145,215) ); // 294
points.push( new V2D(155,215) ); // 295
points.push( new V2D(165,215) ); // 296
points.push( new V2D(175,215) ); // 297
points.push( new V2D(185,215) ); // 298
points.push( new V2D(195,215) ); // 299
points.push( new V2D(215,215) ); // 300
points.push( new V2D(235,215) ); // 301
points.push( new V2D(245,215) ); // 302
points.push( new V2D(335,215) ); // 303
points.push( new V2D(355,215) ); // 304
points.push( new V2D(362,213) ); // 305
points.push( new V2D(375,215) ); // 306
points.push( new V2D(395,215) ); // 307
points.push( new V2D(5,225) ); // 308
points.push( new V2D(18,225) ); // 309
points.push( new V2D(25,225) ); // 310
points.push( new V2D(35,225) ); // 311
points.push( new V2D(55,225) ); // 312
points.push( new V2D(95,225) ); // 313
points.push( new V2D(125,225) ); // 314
points.push( new V2D(135,225) ); // 315
points.push( new V2D(145,225) ); // 316
points.push( new V2D(165,225) ); // 317
points.push( new V2D(225,225) ); // 318
points.push( new V2D(235,225) ); // 319
points.push( new V2D(245,225) ); // 320
points.push( new V2D(335,225) ); // 321
points.push( new V2D(345,225) ); // 322
points.push( new V2D(355,225) ); // 323
points.push( new V2D(5,235) ); // 324
points.push( new V2D(25,235) ); // 325
points.push( new V2D(95,235) ); // 326
points.push( new V2D(105,235) ); // 327
points.push( new V2D(115,235) ); // 328
points.push( new V2D(125,235) ); // 329
points.push( new V2D(145,235) ); // 330
points.push( new V2D(295,235) ); // 331
points.push( new V2D(315,235) ); // 332
points.push( new V2D(85,245) ); // 333
points.push( new V2D(225,245) ); // 334
points.push( new V2D(240,248) ); // 335
points.push( new V2D(245,245) ); // 336
points.push( new V2D(275,245) ); // 337
points.push( new V2D(285,245) ); // 338
points.push( new V2D(295,245) ); // 339
points.push( new V2D(305,245) ); // 340
points.push( new V2D(315,245) ); // 341
points.push( new V2D(325,245) ); // 342
points.push( new V2D(332,249) ); // 343
points.push( new V2D(345,245) ); // 344
points.push( new V2D(5,255) ); // 345
points.push( new V2D(15,255) ); // 346
points.push( new V2D(35,255) ); // 347
points.push( new V2D(45,255) ); // 348
points.push( new V2D(55,255) ); // 349
points.push( new V2D(75,255) ); // 350
points.push( new V2D(85,255) ); // 351
points.push( new V2D(105,255) ); // 352
points.push( new V2D(125,255) ); // 353
points.push( new V2D(135,255) ); // 354
points.push( new V2D(145,255) ); // 355
points.push( new V2D(225,255) ); // 356
points.push( new V2D(235,255) ); // 357
points.push( new V2D(245,255) ); // 358
points.push( new V2D(255,255) ); // 359
points.push( new V2D(265,255) ); // 360
points.push( new V2D(275,255) ); // 361
points.push( new V2D(285,255) ); // 362
points.push( new V2D(295,255) ); // 363
points.push( new V2D(305,255) ); // 364
points.push( new V2D(315,255) ); // 365
points.push( new V2D(325,255) ); // 366
points.push( new V2D(355,255) ); // 367
points.push( new V2D(5,265) ); // 368
points.push( new V2D(15,265) ); // 369
points.push( new V2D(25,265) ); // 370
points.push( new V2D(35,265) ); // 371
points.push( new V2D(45,265) ); // 372
points.push( new V2D(55,265) ); // 373
points.push( new V2D(65,265) ); // 374
points.push( new V2D(75,265) ); // 375
points.push( new V2D(85,265) ); // 376
points.push( new V2D(95,265) ); // 377
points.push( new V2D(105,265) ); // 378
points.push( new V2D(115,265) ); // 379
points.push( new V2D(125,265) ); // 380
points.push( new V2D(135,265) ); // 381
points.push( new V2D(145,265) ); // 382
points.push( new V2D(325,265) ); // 383
points.push( new V2D(335,265) ); // 384
points.push( new V2D(15,275) ); // 385
points.push( new V2D(25,275) ); // 386
points.push( new V2D(95,275) ); // 387
points.push( new V2D(105,275) ); // 388
points.push( new V2D(125,275) ); // 389
points.push( new V2D(135,275) ); // 390
// ~215


/*
points.push( new V2D(190,75) ); // 0
points.push( new V2D(200,55) ); // 0
points.push( new V2D(205,50) ); // 1
points.push( new V2D(205,60) ); // 2
points.push( new V2D(210,55) ); // 3
*/


// ~145

	for(var i=0;i<points.length;++i){
	// 134.5
	//if(points[i].y<210 || points[i].x > 500 || points[i].x < 300){
		//if(points[i].y<150 || points[i].x > 150 || points[i].x < 70){
		//if(points[i].y<170 || points[i].y>200){
		if(false){
			points[i] = points[points.length-1];
			points.pop();
			--i;
		}else{
			console.log(points[i])
		}
	}

//console.log(points.length)

Voronoi.removeDuplicatePoints2D(points);
	

	var matrix = new Matrix2D();
	var origin = new V2D(10,180);
	var offset = new V2D(0,-100);
	// var origin = new V2D(0,0);
	// var offset = new V2D(0,0);
	var scale = 3.0;
	matrix.translate(-origin.x,-origin.y);
	matrix.scale(scale);
	matrix.translate(origin.x+offset.x,origin.y+offset.y);
this._MATRIX = matrix;

//Voronoi.removePointsBelow(points, new V2D(0,5.0));
	voronoi = new Voronoi();
	var scale = 30.0;
	//console.log( Code.infoArray(points) )
	for(i=0;i<points.length;++i){
		// points[i].x *= scale;
		// points[i].y *= scale;
		//points[i].y -= 57.502;
		//points[i].y += 100;
		//console.log( points[i]+"" )
		var point = points[i];
		point = matrix.multV2D(new V2D(), point);
		this._root.addChild( Vor.makePoint(point) );
	}
	// IF
//if(true){
if(false){
	animation:
	this._animPoints = points;
	var speed = 50;
	this._ticker = new Ticker(speed);
	this._ticker.addFunction(Ticker.EVENT_TICK,this.animation_tick,this);
	this._ticker.start();
	return;
}else{


	//delaunay
	//var res = Voronoi.delaunay(points, null);
	var res = Voronoi.delaunay(points, points);
	console.log(res)
	console.log(" CELLED CELLED CELLED CELLED CELLED CELLED CELLED CELLED CELLED CELLED CELLED CELLED CELLED CELLED CELLED CELLED  ");

	// ELSE
	this._D = Voronoi.fortune(points);
	var col = 0x0000FF00;
	var site, sites, edge, edges, A, B;
		sites = this._D.sites();
	this._animParabolas = new DO();
	this._root.addChild( this._animParabolas );

	//console.log( voronoi.toString() );
GLOBALSTAGE = this._root;
	//var triangles = Voronoi.delaunay(ponits);
	var display = GLOBALSTAGE;
	
/*
var sites = this._D.sites();
for(i=0; i<sites.length; ++i){
	var site = sites[i];
	//if(true){
	//if(i==0){ // 0, 1, 2, 6, 7, 11
		var edges = site.edges();
		for(j=0; j<edges.length; ++j){
			var edge = edges[j];
			console.log(edge.vertexA()+" => "+edge.vertexB());
			var a = edge.site();
			var b = edge.opposite().site();
			display.graphics().beginPath();
			display.graphics().setLine(5.0,0xFF00FF00);
			//display.graphics().setFill(0x330000FF);
			display.graphics().moveTo(a.point().x,a.point().y);
			display.graphics().lineTo(b.point().x,b.point().y);
			display.graphics().endPath();
			display.graphics().strokeLine();
			display.graphics().fill();
		}
	//}
}
*/
	
	var triangulate = this._D.triangulate();
	console.log(" TRIANGLED TRIANGLED TRIANGLED TRIANGLED TRIANGLED TRIANGLED TRIANGLED TRIANGLED TRIANGLED ");
	var triangles = triangulate["triangles"];
	var points = triangulate["points"];
	var perimeters = triangulate["perimeters"];
	var rays = triangulate["perpendiculars"];
	//
	// OR
	// var d = new Delaunay();
	// d.fromVoronoi(this._D.sites(),this._D.edges());
	// var triangles = d.triangles();

	for(i=0; i<triangles.length; ++i){
		var tri = triangles[i];
		//console.log(tri[0],tri[1],tri[2])
		var pointA = points[tri[0]];
		var pointB = points[tri[1]];
		var pointC = points[tri[2]];
if(!(pointA && pointB && pointC)){
	console.log("undefined point:  "+i+": "+triangles[i]+"");
	console.log(pointA,pointB,pointC);

	continue;
}
		pointA = matrix.multV2D(new V2D(), pointA);
		pointB = matrix.multV2D(new V2D(), pointB);
		pointC = matrix.multV2D(new V2D(), pointC);
		display.graphics().beginPath();
		display.graphics().setLine(1.0,0xFFFF0000);
		display.graphics().setFill(0x110000FF);
		display.graphics().moveTo(pointA.x,pointA.y);
		display.graphics().lineTo(pointB.x,pointB.y);
		display.graphics().lineTo(pointC.x,pointC.y);
		display.graphics().endPath();
		display.graphics().strokeLine();
		display.graphics().fill();
	}
	for(i=0; i<points.length; ++i){
		var point = points[i];
		var perimeter = perimeters[i];
		var ray = rays[i];
		//console.log(point,perimeter,ray);
		if(ray){
			ray = ray.copy().scale(100.0);
			var fr = points[i];
			var to = V2D.add(fr,ray);
				fr = matrix.multV2D(new V2D(), fr);
				to = matrix.multV2D(new V2D(), to);
			d = new DO();
			d.graphics().clear();
			d.graphics().setLine(2.0, 0x66009900);
			d.graphics().beginPath();
			d.graphics().drawPolygon([fr,to]);
			d.graphics().strokeLine();
			d.graphics().endPath();
			display.addChild(d);
		}
	}

	var convexHull = this._D.convexHull();
	for(var i=0; i<convexHull.length; ++i){
		convexHull[i] = matrix.multV2D(new V2D(), convexHull[i]);
	}
	display.graphics().beginPath();
	display.graphics().setLine(2.0,0x9900FF00);
	display.graphics().drawPolygon(convexHull,true);
	display.graphics().strokeLine();
	
// SHOW VORONOI DIAGRAM
	this._D.finalize(this._animParabolas);
		this._animParabolas.graphics().clear();
		// DRAW FINAL IMAGE
		//this._animParabolas.graphics().setLine(1.0,0xFF333399);
		for(i=0;i<sites.length;++i){
			//console.log("SITE:"+i);
			site = sites[i];
			edges = site.edges();
			var count = 0;
			edge = edges[0];
			var firstEdge = edge;
			count = 0;
			A = edge.vertexA();
			B = edge.vertexB();
		var pointA = A.point();
		var pointB = B.point();
		pointA = matrix.multV2D(new V2D(), pointA);
		pointB = matrix.multV2D(new V2D(), pointB);
			this._animParabolas.graphics().beginPath();
			//var col = Code.getColARGB(0x33,Math.floor(Math.random()*256.0),Math.floor(Math.random()*256.0),0xFF);
			this._animParabolas.graphics().setFill(col);
			this._animParabolas.graphics().setLine(2.0,0x55330099);
			if(A){
				this._animParabolas.graphics().moveTo(pointA.x+Vor.magRand(),pointA.y+Vor.magRand());
			}
			while(edge && count<15){
				B = edge.vertexB();
				if(B && (edge.next()!==firstEdge) ){
					pointB = B.point();
					pointB = matrix.multV2D(new V2D(), pointB);
					this._animParabolas.graphics().lineTo(pointB.x+Vor.magRand(),pointB.y+Vor.magRand());
				}
				edge = edge.next();
				if(edge==firstEdge){
					break;
				}
				++count;
			}
			this._animParabolas.graphics().endPath();
			this._animParabolas.graphics().strokeLine();
			this._animParabolas.graphics().fill();
		}
	}
}
Vor.prototype.animation_tick = function(t){
var matrix = this._MATRIX;
	var x, y, a, b, c, p, e, i, j, len, arc;
	var limitLeft = -500, limitRight = 800;
	if(this._animationTick===undefined){
		this._animationTick = 0;
		this._animDirectrix = new DO();
		this._animDirectrix.graphics().clear();
		this._animDirectrix.graphics().setLine(1.0,0xFF0000FF);
		this._animDirectrix.graphics().beginPath();
		this._animDirectrix.graphics().moveTo(limitLeft,0);
		this._animDirectrix.graphics().lineTo(limitRight,0);
		this._animDirectrix.graphics().endPath();
		this._animDirectrix.graphics().strokeLine();
		this._root.addChild(this._animDirectrix);
		this._animParabolas = new DO();
		this._stillVornoi = new DO();
		this._stillVornoi.graphics().setFill(0xFFDDAA33);
		this._root.addChild( this._stillVornoi );
		this._root.addChild( this._animParabolas );
		// ALGORITHM
		this._Q = new Voronoi.Queue();
		for(i=0;i<this._animPoints.length;++i){
			p = this._animPoints[i];
			e = new Voronoi.Event(p, Voronoi.EVENT_TYPE_SITE);
			e.site( new Voronoi.Site(p) );
			this._Q.addEvent( e );
		}
		this._T = new Voronoi.WaveFront();
		this._D = new Voronoi.EdgeGraph();
		this._directrix = new V2D();
	}
	var circleEvents, halfEdge, next, arc, directrix, node, left, right, leftPoint, intPoint, arr, parabola;

//
	this._directrix.y = this._animPosY;
	directrix = this._directrix.y;
	//
	//var offYStart = 720;//210;//420;
	//var offYStart = 250;
	var offYStart = 230;//224;
	var rateStart = 0.5;//12.5;

console.log("ITERATION");
	// ALGORITHM
	if( !this._Q.isEmpty() ){
		console.log("A");
//console.log("Q: "+this._Q);
		next = this._Q.peek();
		console.log("NEXT: "+next+" | "+next.point().y+" | "+this._directrix.y+" = "+(next.point().y>this._directrix.y) );
var looped = false;
		
		while(next && next.point().y>this._directrix.y){
looped = true;
var temp = new V2D(this._directrix.x,this._directrix.y);
			e = this._Q.next();
			console.log("NEXT: "+e);
this._directrix.copy( e.point() );
			if(e.isSiteEvent()){
				this._T.addArcAboveSiteAndDirectrixAndQueueAndGraph(e, this._directrix, this._Q, this._D);
			}else{
				this._T.removeArcAtCircleWithDirectrixAndQueueAndGraph(e, this._directrix, this._Q, this._D);
			}
			next = this._Q.peek();
this._directrix.copy( temp );
//console.log("-------------------------------------------------------------------------------------------------------");
		}
		if(looped){ // pause at event
			//this._ticker.stop();
		}
		console.log("DIR: "+directrix);
		//console.log(" TREE B:\n"+this._T._tree+"\n");
		var list = this._T._tree.toArray();
		var str = "";
		for(var kk=0; kk<list.length; ++kk){
			str = str + list[kk]+ "\n";
		}
		console.log(" TREE B:\n"+str+"\n");

		var list = this._Q._list;
		var str = "";
		for(var kk=0; kk<list.length; ++kk){
			str = str + list[kk]+ "\n";
		}
		console.log(" QUEUE B:\n"+str+"\n");

	}else{
		this._ticker.stop();
console.log("FINALIZE!");


//this._D.removeDuplicates();
		var site, sites, edge, edges, A, B;
		sites = this._D.sites();
		// for(i=0;i<sites.length;++i){
		// 	site = sites[i];
		// 	edges = site.edges();
		// 	edge.checkOrientation();
		// }
		var str = "";
		for(var kk=0; kk<sites.length; ++kk){
			var site = sites[kk];
			var edges = site._edges;
			str += "  "+kk+": "+site.point()+" \n";
			for(jj=0; jj<edges.length; ++jj){
				var edge = edges[jj];
				str += "      "+jj+": "+edge.vertexA()+" => "+edge.vertexB()+"\n";
			}
			//console.log(kk+": "+site);
			//console.log(site);
		}
		console.log(str);


this._D.finalize(this._animParabolas);
// CLEAR CURRENT SCREEN:
this._animParabolas.graphics().clear();
this._stillVornoi.graphics().clear();
this._animDirectrix.graphics().clear();
		// DRAW FINAL IMAGE
		//this._animParabolas.graphics().setLine(1.0,0xFF333399);
		for(i=0;i<sites.length;++i){
			//console.log("SITE:"+i);
			site = sites[i];
			edges = site.edges();
			var count = 0;
			edge = edges[0];
			var firstEdge = edge;
			count = 0;
			A = edge.vertexA();
			B = edge.vertexB();
			this._animParabolas.graphics().beginPath();
			//var col = Code.getColARGB(0x33,Math.floor(Math.random()*256.0),Math.floor(Math.random()*256.0),0xFF);
			this._animParabolas.graphics().setFill(col);
			this._animParabolas.graphics().setLine(2.0,0xFF330099);
			if(A){
				var pointA = A.point();
				pointA = matrix.multV2D(new V2D(), pointA);
				this._animParabolas.graphics().moveTo(pointA.x+Vor.magRand(),pointA.y+Vor.magRand());
			}
			while(edge && count<25){
				B = edge.vertexB();
				if(B && (edge.next()!==firstEdge) ){
					var pointB = B.point();
					pointB = matrix.multV2D(new V2D(), pointB);
					this._animParabolas.graphics().lineTo(pointB.x+Vor.magRand(),pointB.y+Vor.magRand());
				}
				edge = edge.next();
				if(edge==firstEdge){
					break;
				}
				++count;
			}
			this._animParabolas.graphics().endPath();
			this._animParabolas.graphics().strokeLine();
			this._animParabolas.graphics().fill();
/*
			// DRAW HALF-EDGE INSETS:
			var insetLen = 6.0;
			var sizeLen = 8.0;
			edge = firstEdge;
			this._animParabolas.graphics().setLine(2.0,0xFFCC0000);
			var dir, he1, he2;
			var count=0;
			while(edge && count<10){
				A = edge.vertexA();
				B = edge.vertexB();
				if(A && B){
					this._animParabolas.graphics().beginPath();
					//
					he1 = V2D.sub(edge.prev().vertexB().point(), edge.prev().vertexA().point());
					he2 = V2D.sub(edge.vertexB().point(), edge.vertexA().point());
					he1.flip();
					he1.norm();
					he2.norm();
					dir = V2D.add(he1,he2);
					dir.norm();
					dir.scale(insetLen);
					he1.scale(-sizeLen);
					he2.scale(sizeLen);
					this._animParabolas.graphics().moveTo(A.point().x+dir.x+he2.x,A.point().y+dir.y+he2.y);
					// 
					he1 = V2D.sub(edge.next().vertexB().point(), edge.next().vertexA().point());
					he2 = V2D.sub(edge.vertexB().point(), edge.vertexA().point());
					he2.flip();
					he1.norm();
					he2.norm();
					dir = V2D.add(he1,he2);
					dir.norm();
					dir.scale(insetLen);
					// 
					this._animParabolas.graphics().lineTo(B.point().x+dir.x,B.point().y+dir.y);
					// head
					this._animParabolas.graphics().lineTo(B.point().x+3.0*dir.x,B.point().y+2.0*dir.y);
					this._animParabolas.graphics().moveTo(B.point().x+dir.x,B.point().y+dir.y);
					//
					this._animParabolas.graphics().endPath();
					this._animParabolas.graphics().strokeLine();
				}
				edge = edge.next();
				if(edge==firstEdge){ break; }
				++count;
			}
*/
			//console.log(count)
		}
		return;
		// delaunay generation
		var delaunay = new Delaunay();
		delaunay.fromVoronoi( this._D );
		var triangles = delaunay.triangles();
		var tri;
		len = triangles.length;
		this._animParabolas.graphics().setLine(2.0,0xFFCC0033);
		//this._animParabolas.graphics().setFill(0x66FF0099);
		for(i=0;i<len;++i){
			tri = triangles[i];
			var col = Code.getColARGB(0x66,0xCC+Math.floor(Math.random()*(0xFF-0xCC+1) ),Math.floor(Math.random()*32.0),Math.floor(Math.random()*128.0));
			this._animParabolas.graphics().setFill(col);
			this._animParabolas.graphics().beginPath();
			this._animParabolas.graphics().moveTo(tri.A().point().x,tri.A().point().y);
			this._animParabolas.graphics().lineTo(tri.B().point().x +Vor.magRand(), tri.B().point().y +Vor.magRand());
			this._animParabolas.graphics().lineTo(tri.C().point().x +Vor.magRand(), tri.C().point().y +Vor.magRand());
			this._animParabolas.graphics().lineTo(tri.A().point().x,tri.A().point().y);
			this._animParabolas.graphics().endPath();
			this._animParabolas.graphics().strokeLine();
			this._animParabolas.graphics().fill();
		}
		return;
	}


	var position = matrix.multV2D(new V2D(), new V2D(0,this._animPosY));
	this._animPosY = offYStart - this._animationTick*rateStart;
	this._animDirectrix.matrix().identity();
	this._animDirectrix.matrix().translate(position.x,position.y);
	//
	this._animParabolas.graphics().clear();
	this._animParabolas.graphics().setLine(1.0,0xFF229933);
	this._animParabolas.graphics().beginPath();
	len = this._animPoints.length;
	var focus, left=limitLeft, right=limitRight;
	var deltaJ = (right-left)/500.0; // EACH PARABOLA
	for(i=0;i<len;++i){
		focus = this._animPoints[i];
		a = focus.x;
		b = focus.y;
		c = directrix;
		for(j=left;j<=right;j+=deltaJ){
			x = j;
			y = ((x-a)*(x-a) + b*b - c*c)/(2*(b-c));
			var point = new V2D(x,y);
				point = matrix.multV2D(new V2D(), point);
			if(j==left){
				this._animParabolas.graphics().moveTo(point.x,point.y);
			}else{
				this._animParabolas.graphics().lineTo(point.x,point.y);
			}
		}
	}
	this._animParabolas.graphics().moveTo(0,0);
	this._animParabolas.graphics().endPath();
	this._animParabolas.graphics().strokeLine();
	// DRAW WAVEFRONT INTERSECTIONS ...
	this._animParabolas.graphics().setLine(2.0,0xFFCC0066);
	this._animParabolas.graphics().beginPath();
	node = this._T.root().minimumNode();
		var count = 0;
		while(node){
			arc = node.data();
			parabola = arc.center().point();
			var intersections = arc.intersections();
			// left limit
			left = new V2D(limitLeft,0);
			if(intersections[0]){
				if(intersections[0].x>left.x){
					left = intersections[0];
						var ll = matrix.multV2D(new V2D(), left);
					this._stillVornoi.graphics().beginPath();
					this._stillVornoi.graphics().drawCircle(ll.x,ll.y,2.0);
					this._stillVornoi.graphics().endPath();
					this._stillVornoi.graphics().fill();
				}
			}
			// right limit
			right = new V2D(limitRight,0);
			if(intersections[1]){
				if(intersections[1].x<right.x){
					right = intersections[1];
						var rr = matrix.multV2D(new V2D(), right);
					this._stillVornoi.graphics().beginPath();
					this._stillVornoi.graphics().drawCircle(rr.x,rr.y,2.0);
					this._stillVornoi.graphics().endPath();
					this._stillVornoi.graphics().fill();
				}
			}
			deltaJ = (right.x-left.x)/100.0;
			arr = Code.parabolaABCFromFocusDirectrix(parabola,directrix);
			a = arr.a, b = arr.b, c = arr.c;
			//a = parabola.x; b = parabola.y; c = directrix;
			for(j=left.x, cc=0;j<=right.x && cc<100;j+=deltaJ, ++cc){ // hooray for finite precision
				x = j;
				y = a*x*x + b*x + c;
				point = new V2D(x,y);
				point = matrix.multV2D(new V2D(), point);
				//y = ((x-a)*(x-a) + b*b - c*c)/(2.0*(b-c));
				if(j==left.x && count==0){
					this._animParabolas.graphics().moveTo(point.x,point.y);
				}else{
					this._animParabolas.graphics().lineTo(point.x,point.y);
				}
			}
			node = this._T.nextNode(arc);
			if(count >= 100){
				console.log("errrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr");
				node = null;
				throw new Error();
			}
			++count;
		}
		node = null;
	this._animParabolas.graphics().moveTo(0,0);
	this._animParabolas.graphics().endPath();
	this._animParabolas.graphics().strokeLine();
	// DRAW CIRCLES IN QUEUE:
	var eventList = this._Q._list
	for(i=0;i<eventList.length;++i){
		var e = eventList[i];
		if(e.isCircleEvent()){
			var circle = e.circle();
			var point = matrix.multV2D(new V2D(), circle.center);
			// center
			this._animParabolas.graphics().setFill(0xFF0000FF);
			this._animParabolas.graphics().beginPath();
			this._animParabolas.graphics().drawCircle(point.x,point.y,3.0);
			this._animParabolas.graphics().endPath();
			this._animParabolas.graphics().fill();
			// perimeter
			this._animParabolas.graphics().setLine(1.0,0xFF3333CC);
			this._animParabolas.graphics().beginPath();
			this._animParabolas.graphics().drawCircle(point.x,point.y,circle.radius); // neet to muld radius by matrix scale
			this._animParabolas.graphics().endPath();
			this._animParabolas.graphics().strokeLine();
			// bottom
			var point = matrix.multV2D(new V2D(), e.point());
			this._animParabolas.graphics().setFill(0xFF00CCFF);
			this._animParabolas.graphics().beginPath();
			this._animParabolas.graphics().drawCircle(point.x,point.y,3.0);
			this._animParabolas.graphics().endPath();
			this._animParabolas.graphics().fill();
		}
	}

	// DRAW CURRENT GRAPH
	this._animParabolas.graphics().setLine(1.0,0xFFFF00FF);
	var face, halfEdge, edges, faces = this._D.sites();
	for(i=0;i<faces.length;++i){
		face = faces[i];
		edges = face.edges();
		for(j=0;j<edges.length;++j){
			halfEdge = edges[j];
			if(halfEdge.vertexA() && halfEdge.vertexB()){
				var pointA = halfEdge.vertexA().point();
				var pointB = halfEdge.vertexB().point();
					pointA = matrix.multV2D(new V2D(), pointA);
					pointB = matrix.multV2D(new V2D(), pointB);
				this._animParabolas.graphics().beginPath();
				this._animParabolas.graphics().moveTo(pointA.x,pointA.y);
				this._animParabolas.graphics().lineTo(pointB.x,pointB.y);
				this._animParabolas.graphics().endPath();
				this._animParabolas.graphics().strokeLine();
			}
		}
	}

	this._animationTick++;
}


Vor.magRand = function(){
	//return Math.random()*40.0 - 20.0;
	//return Math.random()*20.0 - 10.0;
	return 0;
}

Vor.makeLine = function(a,b,col,wid){
	col = col!==undefined?col:0xFFFF0000;
	wid = wid!==undefined?wid:1.0;
	var d = new DO();
	d.graphics().clear();
	d.graphics().setLine(wid,col);
	d.graphics().beginPath();
	d.graphics().moveTo(a.x,a.y);
	d.graphics().lineTo(b.x,b.y);
	d.graphics().endPath();
	d.graphics().strokeLine();
	return d;
}
Vor.makeCircle = function(v,r,col,wid){
	col = col!==undefined?col:0xFFFF0000;
	wid = wid!==undefined?wid:1.0;
	var d = new DO();
	d.graphics().clear();
	d.graphics().setLine(wid,col);
	d.graphics().beginPath();
	d.graphics().drawCircle(v.x,v.y,r);
	d.graphics().endPath();
	d.graphics().strokeLine();
	return d;
}
Vor.makePoint = function(v,r,cf,cl){
	r = r!==undefined?r:5.0;
	cf = cf!==undefined?cf:0xFF333333;
	cl = cl!==undefined?cl:0x00000000;
	r *= 2.0;
	var d = new DO();
	d.graphics().clear();
	d.graphics().setLine(1.0,cl);
	d.graphics().setFill(cf);
	d.graphics().beginPath();
	d.graphics().moveTo(v.x,v.y);
	d.graphics().drawEllipse(v.x,v.y,r,r,0);
	d.graphics().fill();
	d.graphics().endPath();

	d.graphics().strokeLine();
	return d;
}

