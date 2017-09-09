// Texturing.js

function Texturing(){
	console.log("Texturing");
	this._canvas = new Canvas(null,0,0,Canvas.STAGE_FIT_FILL, false,false);
	this._stage = new Stage(this._canvas, 1000/20);
	this._root = new DO();
	this._stage.addChild(this._root);
	this._canvas.addListeners();
	this._stage.addListeners();
	this._stage.start();
	// resources
	this._resource = {};

	this._canvas.addFunction(Canvas.EVENT_MOUSE_CLICK,this.handleMouseClickFxn,this);



	/*
	// 3D stage
	this._canvas3D = new Canvas(null,0,0,Canvas.STAGE_FIT_FILL,false,true);
	this._stage3D = new StageGL(this._canvas3D, 1000.0/20.0, this.getVertexShaders1(), this.getFragmentShaders1());
  	this._stage3D.setBackgroundColor(0x00000000);
	this._stage3D.frustrumAngle(60);
	this._stage3D.enableDepthTest();
this._stage3D.addFunction(StageGL.EVENT_ON_ENTER_FRAME, this.onEnterFrameFxn3D, this);
	// this._stage3D.start();
	this._spherePointBegin = null;
	this._spherePointEnd = null;
	this._sphereMatrix = new Matrix3D();
	this._sphereMatrix.identity();
	this._userInteractionMatrix = new Matrix3D();
	this._userInteractionMatrix.identity();
	this._canvas3D.addFunction(Canvas.EVENT_MOUSE_DOWN, this.onMouseDownFxn3D, this);
	this._canvas3D.addFunction(Canvas.EVENT_MOUSE_UP, this.onMouseUpFxn3D, this);
	this._canvas3D.addFunction(Canvas.EVENT_MOUSE_MOVE, this.onMouseMoveFxn3D, this);
	this._canvas3D.addFunction(Canvas.EVENT_MOUSE_WHEEL, this.onMouseWheelFxn3D, this);
	this._canvas3D.addFunction(Canvas.EVENT_MOUSE_CLICK, this.onMouseClickFxn3D, this);
	*/
	//
GLOBALSTAGE = this._stage;
// GLOBALSTAGE.root().matrix().scale(1.0,-1.0);
// GLOBALSTAGE.root().matrix().translate(300.0,300.0);
	this.triangulate();
	return;
	var imageList, imageLoader;
	// import image to work with
	imageList = ["caseStudy1-0.jpg","caseStudy1-26.jpg"];
	imageLoader = new ImageLoader("./images/",imageList, this,this.handleSceneImagesLoaded,null);
	imageLoader.load();
}

Texturing.prototype.triangulate = function(){
	console.log("triangulate");

// lookup table for data from point
/*

point - 2d coord + data object
tri - 
*/



	var i, j, k;
	var points = [
		new V2D(1,0),
		//new V2D(0,1),
		new V2D(2,1),
new V2D(0.8,0.8),
		new V2D(1,1),
new V2D(1,-1),
		new V2D(2,-1),
		//new V2D(0.8,0.8),
		new V2D(2,2),
	];
// random tests
points = [];
var minX = -2;
var maxX = 2;
var minY = -2;
var maxY = 2;
for(i=0; i<15; ++i){
	points[i] = new V2D(Code.randomFloat(minX,maxX),Code.randomFloat(minY,maxY));
}
Triangulator.removeDuplicates(points);


points = [];



points.push( new V2D(175,105) ); // 0
points.push( new V2D(25,165) ); // 1
points.push( new V2D(365,185) ); // 2
points.push( new V2D(15,225) ); // 3
points.push( new V2D(225,85) ); // 4
points.push( new V2D(215,65) ); // 5
points.push( new V2D(245,75) ); // 6
points.push( new V2D(255,105) ); // 7
points.push( new V2D(215,155) ); // 8
points.push( new V2D(245,155) ); // 9
points.push( new V2D(205,125) ); // 10
points.push( new V2D(235,245) ); // 11
points.push( new V2D(335,245) ); // 12
points.push( new V2D(145,205) ); // 13
points.push( new V2D(175,65) ); // 14
points.push( new V2D(145,75) ); // 15
points.push( new V2D(205,75) ); // 16
points.push( new V2D(145,115) ); // 17
points.push( new V2D(175,125) ); // 18
points.push( new V2D(365,215) ); // 19
points.push( new V2D(325,175) ); // 20
points.push( new V2D(185,175) ); // 21
points.push( new V2D(265,175) ); // 22
points.push( new V2D(125,85) ); // 23
points.push( new V2D(135,145) ); // 24
points.push( new V2D(65,105) ); // 25
points.push( new V2D(95,175) ); // 26
points.push( new V2D(135,165) ); // 27
points.push( new V2D(235,85) ); // 28
points.push( new V2D(235,95) ); // 29
points.push( new V2D(145,145) ); // 30
points.push( new V2D(145,85) ); // 31
points.push( new V2D(85,175) ); // 32
points.push( new V2D(15,165) ); // 33
points.push( new V2D(205,155) ); // 34
points.push( new V2D(155,115) ); // 35
points.push( new V2D(165,125) ); // 36
points.push( new V2D(155,95) ); // 37
points.push( new V2D(185,105) ); // 38
points.push( new V2D(145,125) ); // 39
points.push( new V2D(225,65) ); // 40
points.push( new V2D(135,215) ); // 41
points.push( new V2D(125,225) ); // 42
points.push( new V2D(245,95) ); // 43
points.push( new V2D(165,95) ); // 44
points.push( new V2D(165,75) ); // 45
points.push( new V2D(145,95) ); // 46
points.push( new V2D(235,155) ); // 47
points.push( new V2D(25,225) ); // 48
points.push( new V2D(35,215) ); // 49
points.push( new V2D(35,205) ); // 50
points.push( new V2D(135,195) ); // 51
points.push( new V2D(155,215) ); // 52
points.push( new V2D(165,215) ); // 53
points.push( new V2D(175,95) ); // 54
points.push( new V2D(155,205) ); // 55
points.push( new V2D(25,215) ); // 56
points.push( new V2D(75,175) ); // 57
points.push( new V2D(155,75) ); // 58
points.push( new V2D(115,235) ); // 59
points.push( new V2D(105,235) ); // 60
points.push( new V2D(95,235) ); // 61
points.push( new V2D(155,85) ); // 62
points.push( new V2D(225,155) ); // 63
points.push( new V2D(255,75) ); // 64
points.push( new V2D(245,105) ); // 65
points.push( new V2D(205,145) ); // 66
points.push( new V2D(225,245) ); // 67
points.push( new V2D(135,225) ); // 68
points.push( new V2D(155,105) ); // 69
points.push( new V2D(135,205) ); // 70
points.push( new V2D(185,95) ); // 71
points.push( new V2D(165,85) ); // 72
points.push( new V2D(215,145) ); // 73
points.push( new V2D(225,135) ); // 74
points.push( new V2D(245,245) ); // 75
points.push( new V2D(225,145) ); // 76
points.push( new V2D(175,215) ); // 77
points.push( new V2D(185,205) ); // 78
points.push( new V2D(185,195) ); // 79
points.push( new V2D(355,205) ); // 80
points.push( new V2D(345,205) ); // 81
points.push( new V2D(335,195) ); // 82
points.push( new V2D(345,185) ); // 83
points.push( new V2D(195,135) ); // 84
points.push( new V2D(185,125) ); // 85
points.push( new V2D(365,195) ); // 86
points.push( new V2D(255,175) ); // 87
points.push( new V2D(25,205) ); // 88
points.push( new V2D(195,185) ); // 89
points.push( new V2D(15,215) ); // 90
points.push( new V2D(325,195) ); // 91
points.push( new V2D(145,195) ); // 92
points.push( new V2D(95,225) ); // 93
points.push( new V2D(185,185) ); // 94
points.push( new V2D(195,145) ); // 95
points.push( new V2D(235,105) ); // 96
points.push( new V2D(225,115) ); // 97
points.push( new V2D(325,255) ); // 98
points.push( new V2D(315,245) ); // 99
points.push( new V2D(155,195) ); // 100
points.push( new V2D(165,185) ); // 101
points.push( new V2D(305,255) ); // 102
points.push( new V2D(25,175) ); // 103
points.push( new V2D(25,185) ); // 104
points.push( new V2D(15,185) ); // 105
points.push( new V2D(85,215) ); // 106
points.push( new V2D(85,205) ); // 107
points.push( new V2D(85,195) ); // 108
points.push( new V2D(145,135) ); // 109
points.push( new V2D(5,195) ); // 110
points.push( new V2D(195,125) ); // 111
points.push( new V2D(245,85) ); // 112
points.push( new V2D(125,145) ); // 113
points.push( new V2D(255,65) ); // 114
points.push( new V2D(185,115) ); // 115
points.push( new V2D(15,175) ); // 116
points.push( new V2D(255,255) ); // 117
points.push( new V2D(85,225) ); // 118
points.push( new V2D(345,175) ); // 119
points.push( new V2D(95,185) ); // 120
points.push( new V2D(5,235) ); // 121
points.push( new V2D(195,155) ); // 122
points.push( new V2D(315,255) ); // 123
points.push( new V2D(165,195) ); // 124
points.push( new V2D(175,85) ); // 125
points.push( new V2D(25,195) ); // 126
points.push( new V2D(345,245) ); // 127
points.push( new V2D(355,195) ); // 128
points.push( new V2D(225,95) ); // 129
points.push( new V2D(365,175) ); // 130
points.push( new V2D(115,145) ); // 131
points.push( new V2D(35,195) ); // 132
points.push( new V2D(345,195) ); // 133
points.push( new V2D(15,195) ); // 134
points.push( new V2D(215,135) ); // 135
points.push( new V2D(125,205) ); // 136
points.push( new V2D(325,185) ); // 137
points.push( new V2D(335,185) ); // 138
points.push( new V2D(85,185) ); // 139
points.push( new V2D(335,205) ); // 140
points.push( new V2D(135,135) ); // 141
points.push( new V2D(5,225) ); // 142
points.push( new V2D(275,185) ); // 143
points.push( new V2D(285,175) ); // 144
points.push( new V2D(245,65) ); // 145
points.push( new V2D(335,175) ); // 146
points.push( new V2D(145,165) ); // 147
points.push( new V2D(155,165) ); // 148
points.push( new V2D(185,85) ); // 149
points.push( new V2D(195,175) ); // 150
points.push( new V2D(255,95) ); // 151
points.push( new V2D(205,175) ); // 152
points.push( new V2D(225,105) ); // 153
points.push( new V2D(225,255) ); // 154
points.push( new V2D(355,215) ); // 155
points.push( new V2D(125,195) ); // 156
points.push( new V2D(175,205) ); // 157
points.push( new V2D(295,245) ); // 158
points.push( new V2D(285,255) ); // 159
points.push( new V2D(275,255) ); // 160
points.push( new V2D(375,215) ); // 161
points.push( new V2D(225,125) ); // 162
points.push( new V2D(105,185) ); // 163
points.push( new V2D(345,215) ); // 164
points.push( new V2D(235,75) ); // 165
points.push( new V2D(235,145) ); // 166
points.push( new V2D(75,185) ); // 167
points.push( new V2D(365,205) ); // 168
points.push( new V2D(275,175) ); // 169
points.push( new V2D(195,195) ); // 170
points.push( new V2D(135,95) ); // 171
points.push( new V2D(185,155) ); // 172
points.push( new V2D(265,105) ); // 173
points.push( new V2D(325,245) ); // 174
points.push( new V2D(235,65) ); // 175
points.push( new V2D(155,135) ); // 176
points.push( new V2D(95,195) ); // 177
points.push( new V2D(105,205) ); // 178
points.push( new V2D(145,215) ); // 179
points.push( new V2D(345,225) ); // 180
points.push( new V2D(5,185) ); // 181
points.push( new V2D(235,115) ); // 182
points.push( new V2D(325,215) ); // 183
points.push( new V2D(165,165) ); // 184
points.push( new V2D(355,175) ); // 185
points.push( new V2D(125,165) ); // 186
points.push( new V2D(15,205) ); // 187
points.push( new V2D(175,135) ); // 188
points.push( new V2D(225,165) ); // 189
points.push( new V2D(125,155) ); // 190
points.push( new V2D(175,145) ); // 191
points.push( new V2D(95,205) ); // 192
points.push( new V2D(135,125) ); // 193
points.push( new V2D(115,175) ); // 194
points.push( new V2D(135,115) ); // 195
points.push( new V2D(135,105) ); // 196
points.push( new V2D(215,175) ); // 197
points.push( new V2D(265,85) ); // 198
points.push( new V2D(275,95) ); // 199
points.push( new V2D(335,215) ); // 200
points.push( new V2D(155,185) ); // 201
points.push( new V2D(185,145) ); // 202
points.push( new V2D(115,205) ); // 203
points.push( new V2D(115,225) ); // 204
points.push( new V2D(205,135) ); // 205
points.push( new V2D(245,165) ); // 206
points.push( new V2D(265,255) ); // 207
points.push( new V2D(105,195) ); // 208
points.push( new V2D(65,115) ); // 209
points.push( new V2D(175,55) ); // 210
points.push( new V2D(275,85) ); // 211
points.push( new V2D(215,85) ); // 212
points.push( new V2D(375,175) ); // 213
points.push( new V2D(295,255) ); // 214
points.push( new V2D(285,185) ); // 215
points.push( new V2D(195,115) ); // 216
points.push( new V2D(205,115) ); // 217
points.push( new V2D(175,195) ); // 218
points.push( new V2D(365,165) ); // 219
points.push( new V2D(355,155) ); // 220
points.push( new V2D(345,155) ); // 221
points.push( new V2D(335,145) ); // 222
points.push( new V2D(345,145) ); // 223
points.push( new V2D(325,145) ); // 224
points.push( new V2D(315,135) ); // 225
points.push( new V2D(315,125) ); // 226
points.push( new V2D(325,125) ); // 227
points.push( new V2D(305,125) ); // 228
points.push( new V2D(305,135) ); // 229
points.push( new V2D(315,145) ); // 230
points.push( new V2D(325,115) ); // 231
points.push( new V2D(335,125) ); // 232
points.push( new V2D(345,125) ); // 233
points.push( new V2D(355,125) ); // 234
points.push( new V2D(335,155) ); // 235
points.push( new V2D(35,185) ); // 236
points.push( new V2D(5,175) ); // 237
points.push( new V2D(375,165) ); // 238
points.push( new V2D(385,155) ); // 239
points.push( new V2D(385,145) ); // 240
points.push( new V2D(385,135) ); // 241
points.push( new V2D(375,125) ); // 242
points.push( new V2D(375,135) ); // 243
points.push( new V2D(115,195) ); // 244
points.push( new V2D(215,255) ); // 245
points.push( new V2D(215,245) ); // 246
points.push( new V2D(255,165) ); // 247
points.push( new V2D(265,155) ); // 248
points.push( new V2D(265,145) ); // 249
points.push( new V2D(315,155) ); // 250
points.push( new V2D(205,85) ); // 251
points.push( new V2D(195,95) ); // 252
points.push( new V2D(215,55) ); // 253
points.push( new V2D(175,115) ); // 254
points.push( new V2D(75,195) ); // 255
points.push( new V2D(65,205) ); // 256
points.push( new V2D(275,145) ); // 257
points.push( new V2D(285,155) ); // 258
points.push( new V2D(165,225) ); // 259
points.push( new V2D(275,195) ); // 260
points.push( new V2D(255,85) ); // 261
points.push( new V2D(335,255) ); // 262
points.push( new V2D(215,125) ); // 263
points.push( new V2D(175,185) ); // 264
points.push( new V2D(205,185) ); // 265
points.push( new V2D(215,195) ); // 266
points.push( new V2D(225,195) ); // 267
points.push( new V2D(225,205) ); // 268
points.push( new V2D(195,165) ); // 269
points.push( new V2D(245,145) ); // 270
points.push( new V2D(275,115) ); // 271
points.push( new V2D(375,145) ); // 272
points.push( new V2D(125,125) ); // 273
points.push( new V2D(115,125) ); // 274
points.push( new V2D(325,155) ); // 275
points.push( new V2D(345,115) ); // 276
points.push( new V2D(355,165) ); // 277
points.push( new V2D(205,105) ); // 278
points.push( new V2D(225,175) ); // 279
points.push( new V2D(255,55) ); // 280
points.push( new V2D(365,125) ); // 281
points.push( new V2D(205,255) ); // 282
points.push( new V2D(215,95) ); // 283
points.push( new V2D(195,105) ); // 284
points.push( new V2D(45,205) ); // 285
points.push( new V2D(355,185) ); // 286
points.push( new V2D(235,255) ); // 287
points.push( new V2D(305,145) ); // 288
points.push( new V2D(195,255) ); // 289
points.push( new V2D(185,255) ); // 290
points.push( new V2D(175,255) ); // 291
points.push( new V2D(165,255) ); // 292
points.push( new V2D(155,255) ); // 293
points.push( new V2D(145,255) ); // 294
points.push( new V2D(135,265) ); // 295
points.push( new V2D(125,255) ); // 296
points.push( new V2D(125,265) ); // 297
points.push( new V2D(125,275) ); // 298
points.push( new V2D(115,255) ); // 299
points.push( new V2D(105,265) ); // 300
points.push( new V2D(95,275) ); // 301
points.push( new V2D(85,265) ); // 302
points.push( new V2D(75,255) ); // 303
points.push( new V2D(105,275) ); // 304
points.push( new V2D(85,255) ); // 305
points.push( new V2D(265,75) ); // 306
points.push( new V2D(75,105) ); // 307
points.push( new V2D(105,145) ); // 308
points.push( new V2D(95,155) ); // 309
points.push( new V2D(85,155) ); // 310
points.push( new V2D(75,155) ); // 311
points.push( new V2D(95,145) ); // 312
points.push( new V2D(75,165) ); // 313
points.push( new V2D(85,165) ); // 314
points.push( new V2D(95,135) ); // 315
points.push( new V2D(85,125) ); // 316
points.push( new V2D(95,125) ); // 317
points.push( new V2D(345,165) ); // 318
points.push( new V2D(225,45) ); // 319
points.push( new V2D(165,115) ); // 320
points.push( new V2D(75,215) ); // 321
points.push( new V2D(385,165) ); // 322
points.push( new V2D(265,65) ); // 323
points.push( new V2D(215,75) ); // 324
points.push( new V2D(165,65) ); // 325
points.push( new V2D(75,205) ); // 326
points.push( new V2D(295,125) ); // 327
points.push( new V2D(105,135) ); // 328
points.push( new V2D(105,215) ); // 329
points.push( new V2D(95,265) ); // 330
points.push( new V2D(65,255) ); // 331
points.push( new V2D(55,265) ); // 332
points.push( new V2D(45,255) ); // 333
points.push( new V2D(35,255) ); // 334
points.push( new V2D(25,255) ); // 335
points.push( new V2D(25,265) ); // 336
points.push( new V2D(15,275) ); // 337
points.push( new V2D(5,265) ); // 338
points.push( new V2D(15,255) ); // 339
points.push( new V2D(45,265) ); // 340
points.push( new V2D(35,265) ); // 341
points.push( new V2D(15,265) ); // 342
points.push( new V2D(65,265) ); // 343
points.push( new V2D(105,255) ); // 344
points.push( new V2D(315,185) ); // 345
points.push( new V2D(5,255) ); // 346
points.push( new V2D(245,115) ); // 347
points.push( new V2D(245,55) ); // 348
points.push( new V2D(295,135) ); // 349
points.push( new V2D(235,125) ); // 350
points.push( new V2D(205,95) ); // 351
points.push( new V2D(285,245) ); // 352
points.push( new V2D(35,175) ); // 353
points.push( new V2D(245,255) ); // 354
points.push( new V2D(55,255) ); // 355
points.push( new V2D(195,85) ); // 356
points.push( new V2D(165,105) ); // 357
points.push( new V2D(205,75) ); // 358
points.push( new V2D(295,145) ); // 359
points.push( new V2D(235,175) ); // 360
points.push( new V2D(265,95) ); // 361
points.push( new V2D(185,245) ); // 362
points.push( new V2D(105,155) ); // 363
points.push( new V2D(325,205) ); // 364
points.push( new V2D(95,255) ); // 365
points.push( new V2D(375,195) ); // 366



	var matrix = new Matrix2D();
	matrix.identity();
	matrix.scale(1.0);
	for(i=0; i<points.length; ++i){
		points[i] = matrix.multV2D(new V2D(), points[i]);
	}
var matrix = new Matrix2D();
matrix.identity();
// matrix.scale(1.0,-1.0);
// matrix.scale(40.0);
// matrix.translate(140.0,180.0);
matrix.scale(1.0,-1.0);
matrix.scale(2.0);
matrix.translate(100.0,600.0);
	// show points:
	for(i=0; i<points.length; ++i){
		var point = points[i];
		var color = 0xFFFF0000;
		var rad = 3.0;
		var c = new DO();
		point = matrix.multV2D(new V2D(), point);
		c.graphics().setLine(1.0, color);
		c.graphics().beginPath();
		c.graphics().drawCircle(point.x, point.y, rad);
		c.graphics().strokeLine();
		c.graphics().endPath();
		c.matrix();
		GLOBALSTAGE.addChild(c);
	}

		point = matrix.multV2D(new V2D(), new V2D(155,95));
		c.graphics().setLine(1.0, 0xFF000000);
		c.graphics().beginPath();
		c.graphics().drawCircle(point.x, point.y, 4.0);
		c.graphics().strokeLine();
		c.graphics().endPath();
		c.matrix();
		GLOBALSTAGE.addChild(c);


	// ... do triangulation
	var triangulator = new Triangulator();
	var min = new V2D(minX,minY);
	var max = new V2D(maxX,maxY);
	triangulator.setLimits(min,max);
	triangulator.addPoints(points, points);
	var tri = triangulator.triangle( new V2D(0.5,0.25) );
	// console.log(tri);
	// if(tri){
	// 	var ps = tri.points();
	// 	console.log(ps);
	// }
console.log("DONE ..............................");


	var points = triangulator.points();//this._points;
	var datas = triangulator.datas();//this._cells;
	var tris = triangulator.triangles();//this._triangles;
	var perim = triangulator.perimeter();//this._datas;
	console.log("DATA ..............................");
	console.log(points);
	console.log(datas);
	console.log(tris);
	console.log(perim);


	var triangles = triangulator._mesh._tris;//.trianglesAsIs();
	for(i=0; i<triangles.length; ++i){
		var tri = triangles[i];
		var pts = tri.points();
		var pointA = pts[0].point();
		var pointB = pts[1].point();
		var pointC = pts[2].point();
		pointA = matrix.multV2D(new V2D(), pointA);
		pointB = matrix.multV2D(new V2D(), pointB);
		pointC = matrix.multV2D(new V2D(), pointC);
		var color = 0xFF00FF00;
		//var color = Code.getColARGBFromFloat(1.0,Math.random(),Math.random(),Math.random());
		var c = new DO();
		console.log()
		c.graphics().setLine(1.0, color);
		c.graphics().beginPath();
		var sc = 0.0;
		var ss = 0.0;
		var offX = (Math.random()-0.5)*ss;
		var offY = (Math.random()-0.5)*ss;
		pointA.x += (Math.random()-0.5)*sc + offX;
		pointA.y += (Math.random()-0.5)*sc + offY;
		pointB.x += (Math.random()-0.5)*sc + offX;
		pointB.y += (Math.random()-0.5)*sc + offY;
		pointC.x += (Math.random()-0.5)*sc + offX;
		pointC.y += (Math.random()-0.5)*sc + offY;

		c.graphics().drawPolygon([pointA,pointB,pointC], true);
		c.graphics().strokeLine();
		c.graphics().endPath();
		GLOBALSTAGE.addChild(c);
	}
}


Texturing.prototype.handleSceneImagesLoaded = function(imageInfo){
	var pointsA = [];
	var pointsB = [];
	var points = [pointsA,pointsB];
	var tris = [];
	var tri;

	// real
	pntO = new V3D(0,0,0);
	pntX = new V3D(1,0,0);
	pntY = new V3D(0,1,0);
	pntZ = new V3D(0,0,1);
	pntXY = new V3D(1,1,0);
	pntXZ = new V3D(1,0,1);
	pntYZ = new V3D(0,1,1);
	// A
	var pntAO = new V2D(173,108);
	var pntAX = new V2D(204,118);
	var pntAY = new V2D(172,69);
	var pntAXY = new V2D(205,76);
	// 1
	tri = new Tri2D( pntAY, pntAO, pntAX );
	tris.push([tri]);
	pointsA.push(tri.A(),tri.B(),tri.C());
	// 2
	tri = new Tri2D( pntAX, pntAXY, pntAY );
	tris.push([tri]);
	pointsA.push(tri.A(),tri.B(),tri.C());
	// B
	var pntBO = new V2D(173,108);
	var pntBX = new V2D(204,118);
	var pntBY = new V2D(172,69);
	var pntBXY = new V2D(205,76);
	// 1
	tri = new Tri2D( pntBY, pntBO, pntBX );
	tris.push([tri]);
	pointsB.push(tri.A(),tri.B(),tri.C());
	// 2
	tri = new Tri2D( pntBX, pntBXY, pntBY );
	tris.push([tri]);
	pointsB.push(tri.A(),tri.B(),tri.C());

	// 
	var imageList = imageInfo.images;
	var i, j, list = [], d, img, x=0, y=0;
	for(i=0;i<imageList.length;++i){
		img = imageList[i];
		//console.log(img)
		list[i] = img;
		d = new DOImage(img);
		d.enableDragging();
		this._root.addChild(d);
		d.matrix().identity();
		d.matrix().translate(x,y);
		//
		d.graphics().setLine(1.0,0xFFFF0000);
		d.graphics().beginPath();
		for(j=0;j<=points[i].length;++j){
			v = points[i][j % points[i].length];
			if(j==0){
				d.graphics().moveTo(v.x,v.y);
			}else{
				d.graphics().lineTo(v.x,v.y);
			}
		}
		d.graphics().endPath();
		d.graphics().strokeLine();
		//
		x += img.width;
		y += 0;
	}
	/*
this._resource.testImage0 = list[0];
this._resource.testImage1 = list[1];
	this._imageSources = list;
this.calibrateCameraMatrix();
	this.handleLoaded();
	this._stage3D.start();
	*/
	this._tris = tris;
	this._imgs = list;
	this.combineTriangles();
}
Texturing.prototype.combineTriangles = function(){
	var triList = this._tris;
	var imgList = this._imgs;
	console.log(triList);
	console.log(imgList);
/*
STEPS:
	MAPPING:
	find where wach triangle is on 
		- discard edge tris
		- discard small surface-area covered tris
		- discard occluded (& near occluded) triangles
	STITCHING:
	find best-set of triangle patch groups	: w = (area of projected triangle onto camera plane) / (area of true triangle)
		- where tri normal dot camera normal is as close to -1 as possible
		- where surface area coverage is large (higher res is better)
	patches with 2+ cameras can be blended together via averaging / median
	border patches need gradient transitioning (where only 2 cameras/patches are conserned)
	ATLAS-PACKING:
	texture-triangles should be mapped as proportionately as possible to a texture atlas
*/
	/*
	var inImgA = [0..1];
	var inTriA = new Tri();
	inputImages = []; // 
	*/
//	R3D.triangulateTexture(inputImages, inputTriangles, outputImage, outputTriangle);
}
Texturing.prototype.cameraResultsFromSet = function(fr,to, wid,hei,sca, params){
	// 
}


Texturing.prototype.textureBase2FromImage = function(texture){
	// var obj = new DOImage(texture);
	// this._root.addChild(obj);
	// var wid = texture.width;
	// var hei = texture.height;
	// var origWid = wid;
	// var origHei = hei;
	// wid = Math.pow(2.0, Math.ceil(Math.log(wid)/Math.log(2.0)) );
	// hei = Math.pow(2.0, Math.ceil(Math.log(hei)/Math.log(2.0)) );
	// wid = Math.max(wid,hei);
	// hei = wid;
	// var origWid = origWid/wid;
	// var origHei = origHei/hei;
	// texture = this._stage.renderImage(wid,hei,obj, null);
	// obj.removeParent();
	// var vert = 1-origHei;
	// var horz = origWid;
	// return {"texture":texture,"width":horz,"height":vert};
}
Texturing.prototype.handleEnterFrame = function(e){ // 2D canvas
	//console.log(e);
}
Texturing.prototype.handleMouseClickFxn = function(e){
	console.log(e.x%400,e.y)
}



