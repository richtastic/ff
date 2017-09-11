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
points.push( new V2D(205,155) ); // 28
points.push( new V2D(145,145) ); // 29
points.push( new V2D(15,215) ); // 30
points.push( new V2D(225,65) ); // 31
points.push( new V2D(165,125) ); // 32
points.push( new V2D(235,95) ); // 33
points.push( new V2D(325,245) ); // 34
points.push( new V2D(135,215) ); // 35
points.push( new V2D(15,165) ); // 36
points.push( new V2D(15,175) ); // 37
points.push( new V2D(25,185) ); // 38
points.push( new V2D(25,175) ); // 39
points.push( new V2D(35,195) ); // 40
points.push( new V2D(185,105) ); // 41
points.push( new V2D(315,245) ); // 42
points.push( new V2D(175,95) ); // 43
points.push( new V2D(165,85) ); // 44
points.push( new V2D(165,95) ); // 45
points.push( new V2D(155,85) ); // 46
points.push( new V2D(155,95) ); // 47
points.push( new V2D(375,185) ); // 48
points.push( new V2D(155,115) ); // 49
points.push( new V2D(145,85) ); // 50
points.push( new V2D(15,195) ); // 51
points.push( new V2D(5,195) ); // 52
points.push( new V2D(155,205) ); // 53
points.push( new V2D(125,225) ); // 54
points.push( new V2D(135,225) ); // 55
points.push( new V2D(365,195) ); // 56
points.push( new V2D(25,195) ); // 57
points.push( new V2D(165,115) ); // 58
points.push( new V2D(155,105) ); // 59
points.push( new V2D(25,225) ); // 60
points.push( new V2D(195,145) ); // 61
points.push( new V2D(195,155) ); // 62
points.push( new V2D(35,215) ); // 63
points.push( new V2D(35,205) ); // 64
points.push( new V2D(25,215) ); // 65
points.push( new V2D(15,205) ); // 66
points.push( new V2D(85,185) ); // 67
points.push( new V2D(85,175) ); // 68
points.push( new V2D(85,195) ); // 69
points.push( new V2D(245,105) ); // 70
points.push( new V2D(235,105) ); // 71
points.push( new V2D(225,115) ); // 72
points.push( new V2D(225,95) ); // 73
points.push( new V2D(165,75) ); // 74
points.push( new V2D(115,235) ); // 75
points.push( new V2D(105,235) ); // 76
points.push( new V2D(95,235) ); // 77
points.push( new V2D(95,225) ); // 78
points.push( new V2D(245,85) ); // 79
points.push( new V2D(215,95) ); // 80
points.push( new V2D(25,205) ); // 81
points.push( new V2D(15,185) ); // 82
points.push( new V2D(155,215) ); // 83
points.push( new V2D(215,145) ); // 84
points.push( new V2D(225,155) ); // 85
points.push( new V2D(235,155) ); // 86
points.push( new V2D(205,145) ); // 87
points.push( new V2D(225,135) ); // 88
points.push( new V2D(225,145) ); // 89
points.push( new V2D(95,185) ); // 90
points.push( new V2D(125,135) ); // 91
points.push( new V2D(135,135) ); // 92
points.push( new V2D(365,175) ); // 93
points.push( new V2D(355,185) ); // 94
points.push( new V2D(355,195) ); // 95
points.push( new V2D(345,175) ); // 96
points.push( new V2D(345,185) ); // 97
points.push( new V2D(335,195) ); // 98
points.push( new V2D(325,205) ); // 99
points.push( new V2D(335,205) ); // 100
points.push( new V2D(345,195) ); // 101
points.push( new V2D(345,205) ); // 102
points.push( new V2D(355,175) ); // 103
points.push( new V2D(145,95) ); // 104
points.push( new V2D(225,245) ); // 105
points.push( new V2D(185,95) ); // 106
points.push( new V2D(175,85) ); // 107
points.push( new V2D(145,125) ); // 108
points.push( new V2D(125,235) ); // 109
points.push( new V2D(5,185) ); // 110
points.push( new V2D(165,215) ); // 111
points.push( new V2D(325,185) ); // 112
points.push( new V2D(165,105) ); // 113
points.push( new V2D(135,205) ); // 114
points.push( new V2D(145,215) ); // 115
points.push( new V2D(355,205) ); // 116
points.push( new V2D(185,85) ); // 117
points.push( new V2D(185,125) ); // 118
points.push( new V2D(225,255) ); // 119
points.push( new V2D(235,255) ); // 120
points.push( new V2D(245,245) ); // 121
points.push( new V2D(255,255) ); // 122
points.push( new V2D(325,255) ); // 123
points.push( new V2D(235,85) ); // 124
points.push( new V2D(325,195) ); // 125
points.push( new V2D(315,255) ); // 126
points.push( new V2D(245,95) ); // 127
points.push( new V2D(155,195) ); // 128
points.push( new V2D(175,215) ); // 129
points.push( new V2D(185,205) ); // 130
points.push( new V2D(255,95) ); // 131
points.push( new V2D(35,185) ); // 132
points.push( new V2D(185,115) ); // 133
points.push( new V2D(225,105) ); // 134
points.push( new V2D(215,255) ); // 135
points.push( new V2D(5,235) ); // 136
points.push( new V2D(335,255) ); // 137
points.push( new V2D(145,105) ); // 138
points.push( new V2D(255,65) ); // 139
points.push( new V2D(375,215) ); // 140
points.push( new V2D(365,205) ); // 141
points.push( new V2D(5,175) ); // 142
points.push( new V2D(85,215) ); // 143
points.push( new V2D(85,225) ); // 144
points.push( new V2D(315,195) ); // 145
points.push( new V2D(185,195) ); // 146
points.push( new V2D(195,185) ); // 147
points.push( new V2D(195,195) ); // 148
points.push( new V2D(185,185) ); // 149
points.push( new V2D(235,145) ); // 150
points.push( new V2D(305,245) ); // 151
points.push( new V2D(305,255) ); // 152
points.push( new V2D(295,255) ); // 153
points.push( new V2D(315,185) ); // 154
points.push( new V2D(355,215) ); // 155
points.push( new V2D(135,195) ); // 156
points.push( new V2D(145,195) ); // 157
points.push( new V2D(345,245) ); // 158
points.push( new V2D(225,165) ); // 159
points.push( new V2D(345,215) ); // 160
points.push( new V2D(165,185) ); // 161
points.push( new V2D(265,85) ); // 162
points.push( new V2D(155,75) ); // 163
points.push( new V2D(145,165) ); // 164
points.push( new V2D(155,165) ); // 165
points.push( new V2D(335,215) ); // 166
points.push( new V2D(265,255) ); // 167
points.push( new V2D(275,255) ); // 168
points.push( new V2D(285,255) ); // 169
points.push( new V2D(175,115) ); // 170
points.push( new V2D(235,115) ); // 171
points.push( new V2D(335,175) ); // 172
points.push( new V2D(205,255) ); // 173
points.push( new V2D(195,255) ); // 174
points.push( new V2D(185,255) ); // 175
points.push( new V2D(175,255) ); // 176
points.push( new V2D(165,255) ); // 177
points.push( new V2D(155,255) ); // 178
points.push( new V2D(145,255) ); // 179
points.push( new V2D(65,115) ); // 180
points.push( new V2D(205,175) ); // 181
points.push( new V2D(335,185) ); // 182
points.push( new V2D(165,195) ); // 183
points.push( new V2D(175,195) ); // 184
points.push( new V2D(175,205) ); // 185
points.push( new V2D(135,255) ); // 186
points.push( new V2D(135,265) ); // 187
points.push( new V2D(125,265) ); // 188
points.push( new V2D(115,265) ); // 189
points.push( new V2D(105,265) ); // 190
points.push( new V2D(95,265) ); // 191
points.push( new V2D(95,275) ); // 192
points.push( new V2D(85,265) ); // 193
points.push( new V2D(145,265) ); // 194
points.push( new V2D(85,255) ); // 195
points.push( new V2D(75,265) ); // 196
points.push( new V2D(65,265) ); // 197
points.push( new V2D(55,265) ); // 198
points.push( new V2D(45,265) ); // 199
points.push( new V2D(55,255) ); // 200
points.push( new V2D(65,255) ); // 201
points.push( new V2D(75,255) ); // 202
points.push( new V2D(35,255) ); // 203
points.push( new V2D(25,255) ); // 204
points.push( new V2D(25,265) ); // 205
points.push( new V2D(35,265) ); // 206
points.push( new V2D(315,205) ); // 207
points.push( new V2D(145,135) ); // 208
points.push( new V2D(215,245) ); // 209
points.push( new V2D(255,75) ); // 210
points.push( new V2D(165,225) ); // 211
points.push( new V2D(95,255) ); // 212
points.push( new V2D(295,245) ); // 213
points.push( new V2D(285,245) ); // 214
points.push( new V2D(115,145) ); // 215
points.push( new V2D(105,155) ); // 216
points.push( new V2D(95,155) ); // 217
points.push( new V2D(85,155) ); // 218
points.push( new V2D(75,165) ); // 219
points.push( new V2D(125,145) ); // 220
points.push( new V2D(45,255) ); // 221
points.push( new V2D(95,145) ); // 222
points.push( new V2D(95,165) ); // 223
points.push( new V2D(15,255) ); // 224
points.push( new V2D(5,255) ); // 225
points.push( new V2D(215,55) ); // 226
points.push( new V2D(135,95) ); // 227
points.push( new V2D(275,165) ); // 228
points.push( new V2D(285,175) ); // 229
points.push( new V2D(285,155) ); // 230
points.push( new V2D(275,155) ); // 231
points.push( new V2D(245,65) ); // 232
points.push( new V2D(165,165) ); // 233
points.push( new V2D(195,95) ); // 234
points.push( new V2D(195,105) ); // 235
points.push( new V2D(125,275) ); // 236
points.push( new V2D(245,145) ); // 237
points.push( new V2D(345,255) ); // 238
points.push( new V2D(265,115) ); // 239
points.push( new V2D(5,225) ); // 240
points.push( new V2D(245,55) ); // 241
points.push( new V2D(235,75) ); // 242
points.push( new V2D(115,225) ); // 243
points.push( new V2D(185,155) ); // 244
points.push( new V2D(245,165) ); // 245
points.push( new V2D(205,135) ); // 246
points.push( new V2D(215,125) ); // 247
points.push( new V2D(275,145) ); // 248
points.push( new V2D(195,85) ); // 249
points.push( new V2D(205,95) ); // 250
points.push( new V2D(355,225) ); // 251
points.push( new V2D(85,165) ); // 252
points.push( new V2D(195,75) ); // 253
points.push( new V2D(195,135) ); // 254
points.push( new V2D(255,175) ); // 255
points.push( new V2D(235,135) ); // 256
points.push( new V2D(185,165) ); // 257
points.push( new V2D(215,135) ); // 258
points.push( new V2D(45,215) ); // 259
points.push( new V2D(205,65) ); // 260
points.push( new V2D(75,175) ); // 261
points.push( new V2D(75,185) ); // 262
points.push( new V2D(225,75) ); // 263
points.push( new V2D(75,215) ); // 264
points.push( new V2D(85,205) ); // 265
points.push( new V2D(125,255) ); // 266
points.push( new V2D(205,245) ); // 267
points.push( new V2D(125,125) ); // 268
points.push( new V2D(125,205) ); // 269
points.push( new V2D(375,175) ); // 270
points.push( new V2D(385,165) ); // 271
points.push( new V2D(195,175) ); // 272
points.push( new V2D(195,165) ); // 273
points.push( new V2D(115,255) ); // 274
points.push( new V2D(225,125) ); // 275
points.push( new V2D(5,165) ); // 276
points.push( new V2D(265,165) ); // 277
points.push( new V2D(355,165) ); // 278
points.push( new V2D(265,245) ); // 279
points.push( new V2D(275,245) ); // 280
points.push( new V2D(275,175) ); // 281
points.push( new V2D(265,105) ); // 282
points.push( new V2D(265,95) ); // 283
points.push( new V2D(255,85) ); // 284
points.push( new V2D(65,275) ); // 285
points.push( new V2D(375,205) ); // 286
points.push( new V2D(325,215) ); // 287
points.push( new V2D(175,165) ); // 288
points.push( new V2D(265,145) ); // 289
points.push( new V2D(255,145) ); // 290
points.push( new V2D(255,155) ); // 291
points.push( new V2D(265,155) ); // 292
points.push( new V2D(165,245) ); // 293
points.push( new V2D(215,115) ); // 294
points.push( new V2D(105,145) ); // 295
points.push( new V2D(275,85) ); // 296
points.push( new V2D(255,165) ); // 297
points.push( new V2D(235,65) ); // 298
points.push( new V2D(15,265) ); // 299
points.push( new V2D(5,265) ); // 300
points.push( new V2D(245,255) ); // 301
points.push( new V2D(75,115) ); // 302
points.push( new V2D(85,125) ); // 303
points.push( new V2D(95,115) ); // 304
points.push( new V2D(95,105) ); // 305
points.push( new V2D(105,255) ); // 306
points.push( new V2D(105,275) ); // 307
points.push( new V2D(195,125) ); // 308
points.push( new V2D(25,275) ); // 309
points.push( new V2D(375,195) ); // 310
points.push( new V2D(305,185) ); // 311
points.push( new V2D(155,265) ); // 312
points.push( new V2D(165,265) ); // 313
points.push( new V2D(195,245) ); // 314
points.push( new V2D(115,125) ); // 315
points.push( new V2D(75,145) ); // 316
points.push( new V2D(125,195) ); // 317
points.push( new V2D(285,135) ); // 318
points.push( new V2D(285,145) ); // 319
points.push( new V2D(125,105) ); // 320
points.push( new V2D(125,115) ); // 321
points.push( new V2D(135,125) ); // 322
points.push( new V2D(175,245) ); // 323
points.push( new V2D(115,275) ); // 324
points.push( new V2D(95,125) ); // 325
points.push( new V2D(95,135) ); // 326
points.push( new V2D(105,135) ); // 327
points.push( new V2D(105,245) ); // 328
points.push( new V2D(135,105) ); // 329
points.push( new V2D(15,275) ); // 330
points.push( new V2D(185,245) ); // 331
points.push( new V2D(55,275) ); // 332
points.push( new V2D(75,155) ); // 333
points.push( new V2D(65,145) ); // 334
points.push( new V2D(65,135) ); // 335
points.push( new V2D(215,175) ); // 336
points.push( new V2D(225,175) ); // 337
points.push( new V2D(235,175) ); // 338
points.push( new V2D(35,225) ); // 339
points.push( new V2D(65,165) ); // 340
points.push( new V2D(65,155) ); // 341
points.push( new V2D(115,195) ); // 342
points.push( new V2D(105,205) ); // 343
points.push( new V2D(115,205) ); // 344
points.push( new V2D(125,215) ); // 345
points.push( new V2D(155,175) ); // 346
points.push( new V2D(215,85) ); // 347
points.push( new V2D(145,225) ); // 348
points.push( new V2D(285,185) ); // 349
points.push( new V2D(295,135) ); // 350
points.push( new V2D(305,135) ); // 351
points.push( new V2D(315,135) ); // 352
points.push( new V2D(315,125) ); // 353
points.push( new V2D(325,125) ); // 354
points.push( new V2D(335,125) ); // 355
points.push( new V2D(345,125) ); // 356
points.push( new V2D(155,235) ); // 357
points.push( new V2D(185,75) ); // 358
points.push( new V2D(235,165) ); // 359
points.push( new V2D(275,95) ); // 360
points.push( new V2D(285,85) ); // 361
points.push( new V2D(345,265) ); // 362
points.push( new V2D(355,255) ); // 363
points.push( new V2D(365,245) ); // 364
points.push( new V2D(375,255) ); // 365
points.push( new V2D(385,255) ); // 366
points.push( new V2D(385,245) ); // 367
points.push( new V2D(365,255) ); // 368
points.push( new V2D(395,255) ); // 369
points.push( new V2D(355,245) ); // 370
points.push( new V2D(165,205) ); // 371
points.push( new V2D(215,75) ); // 372
points.push( new V2D(155,185) ); // 373
points.push( new V2D(135,245) ); // 374
points.push( new V2D(75,275) ); // 375
points.push( new V2D(85,275) ); // 376
points.push( new V2D(355,155) ); // 377
points.push( new V2D(345,155) ); // 378
points.push( new V2D(335,145) ); // 379
points.push( new V2D(335,155) ); // 380
points.push( new V2D(345,145) ); // 381
points.push( new V2D(325,145) ); // 382
points.push( new V2D(205,85) ); // 383
points.push( new V2D(285,125) ); // 384
points.push( new V2D(175,175) ); // 385
points.push( new V2D(345,165) ); // 386
points.push( new V2D(105,225) ); // 387
points.push( new V2D(175,265) ); // 388
points.push( new V2D(95,215) ); // 389
points.push( new V2D(365,165) ); // 390
points.push( new V2D(115,135) ); // 391
points.push( new V2D(155,245) ); // 392
points.push( new V2D(305,145) ); // 393
points.push( new V2D(295,85) ); // 394
points.push( new V2D(15,155) ); // 395
points.push( new V2D(145,245) ); // 396
points.push( new V2D(355,125) ); // 397
points.push( new V2D(365,125) ); // 398
points.push( new V2D(375,135) ); // 399
points.push( new V2D(385,145) ); // 400
points.push( new V2D(385,135) ); // 401
points.push( new V2D(375,125) ); // 402
points.push( new V2D(85,135) ); // 403
points.push( new V2D(75,125) ); // 404
points.push( new V2D(65,125) ); // 405
points.push( new V2D(255,115) ); // 406
points.push( new V2D(95,205) ); // 407
points.push( new V2D(335,265) ); // 408
points.push( new V2D(255,135) ); // 409
points.push( new V2D(175,185) ); // 410
points.push( new V2D(95,95) ); // 411
points.push( new V2D(265,135) ); // 412
points.push( new V2D(85,235) ); // 413
points.push( new V2D(75,195) ); // 414
points.push( new V2D(65,205) ); // 415
points.push( new V2D(275,185) ); // 416
points.push( new V2D(75,205) ); // 417
points.push( new V2D(115,215) ); // 418
points.push( new V2D(185,65) ); // 419
points.push( new V2D(145,275) ); // 420
points.push( new V2D(155,275) ); // 421
points.push( new V2D(135,275) ); // 422
points.push( new V2D(95,195) ); // 423
points.push( new V2D(105,195) ); // 424
points.push( new V2D(245,115) ); // 425
points.push( new V2D(235,125) ); // 426
points.push( new V2D(245,135) ); // 427
points.push( new V2D(195,205) ); // 428
points.push( new V2D(375,155) ); // 429
points.push( new V2D(385,155) ); // 430
points.push( new V2D(215,165) ); // 431
points.push( new V2D(175,75) ); // 432
points.push( new V2D(165,65) ); // 433
points.push( new V2D(175,55) ); // 434
points.push( new V2D(185,55) ); // 435
points.push( new V2D(195,45) ); // 436
points.push( new V2D(155,65) ); // 437
points.push( new V2D(185,45) ); // 438
points.push( new V2D(235,55) ); // 439
points.push( new V2D(165,275) ); // 440
points.push( new V2D(175,275) ); // 441
points.push( new V2D(335,115) ); // 442
points.push( new V2D(325,115) ); // 443
points.push( new V2D(135,115) ); // 444
points.push( new V2D(305,195) ); // 445
points.push( new V2D(315,165) ); // 446
points.push( new V2D(305,175) ); // 447
points.push( new V2D(345,115) ); // 448
points.push( new V2D(265,55) ); // 449
points.push( new V2D(275,55) ); // 450
points.push( new V2D(45,275) ); // 451
points.push( new V2D(295,155) ); // 452
points.push( new V2D(55,115) ); // 453
points.push( new V2D(185,275) ); // 454
points.push( new V2D(325,265) ); // 455
points.push( new V2D(215,105) ); // 456
points.push( new V2D(365,155) ); // 457
points.push( new V2D(205,55) ); // 458
points.push( new V2D(315,175) ); // 459
points.push( new V2D(165,55) ); // 460
points.push( new V2D(395,245) ); // 461
points.push( new V2D(305,75) ); // 462
points.push( new V2D(295,75) ); // 463
points.push( new V2D(315,85) ); // 464
points.push( new V2D(285,75) ); // 465
points.push( new V2D(115,245) ); // 466
points.push( new V2D(275,135) ); // 467
points.push( new V2D(255,55) ); // 468
points.push( new V2D(205,35) ); // 469
points.push( new V2D(195,25) ); // 470
points.push( new V2D(205,15) ); // 471
points.push( new V2D(195,15) ); // 472
points.push( new V2D(195,5) ); // 473
points.push( new V2D(185,15) ); // 474
points.push( new V2D(175,15) ); // 475
points.push( new V2D(185,25) ); // 476
points.push( new V2D(175,35) ); // 477
points.push( new V2D(165,25) ); // 478
points.push( new V2D(205,25) ); // 479
points.push( new V2D(175,25) ); // 480
points.push( new V2D(185,35) ); // 481
points.push( new V2D(215,15) ); // 482
points.push( new V2D(215,5) ); // 483
points.push( new V2D(165,35) ); // 484
points.push( new V2D(255,245) ); // 485
points.push( new V2D(215,35) ); // 486
points.push( new V2D(225,35) ); // 487
points.push( new V2D(205,165) ); // 488
points.push( new V2D(225,15) ); // 489
points.push( new V2D(265,65) ); // 490
points.push( new V2D(245,175) ); // 491
points.push( new V2D(35,275) ); // 492
points.push( new V2D(115,155) ); // 493
points.push( new V2D(125,155) ); // 494
points.push( new V2D(125,165) ); // 495
points.push( new V2D(245,45) ); // 496
points.push( new V2D(245,35) ); // 497
points.push( new V2D(255,35) ); // 498
points.push( new V2D(265,35) ); // 499
points.push( new V2D(225,25) ); // 500
points.push( new V2D(355,105) ); // 501
points.push( new V2D(355,115) ); // 502
points.push( new V2D(365,105) ); // 503
points.push( new V2D(375,95) ); // 504
points.push( new V2D(295,125) ); // 505
points.push( new V2D(205,115) ); // 506
points.push( new V2D(375,245) ); // 507
points.push( new V2D(55,205) ); // 508
points.push( new V2D(25,155) ); // 509
points.push( new V2D(255,25) ); // 510
points.push( new V2D(245,25) ); // 511
points.push( new V2D(255,15) ); // 512
points.push( new V2D(265,15) ); // 513
points.push( new V2D(275,25) ); // 514
points.push( new V2D(275,35) ); // 515
points.push( new V2D(275,5) ); // 516
points.push( new V2D(285,5) ); // 517
points.push( new V2D(285,35) ); // 518
points.push( new V2D(265,25) ); // 519
points.push( new V2D(235,15) ); // 520
points.push( new V2D(135,235) ); // 521
points.push( new V2D(175,135) ); // 522
points.push( new V2D(185,145) ); // 523
points.push( new V2D(165,135) ); // 524
points.push( new V2D(175,145) ); // 525
points.push( new V2D(315,145) ); // 526
points.push( new V2D(55,105) ); // 527
points.push( new V2D(45,95) ); // 528
points.push( new V2D(35,105) ); // 529
points.push( new V2D(35,95) ); // 530
points.push( new V2D(25,105) ); // 531
points.push( new V2D(45,85) ); // 532
points.push( new V2D(35,115) ); // 533
points.push( new V2D(45,105) ); // 534
points.push( new V2D(25,115) ); // 535
points.push( new V2D(15,115) ); // 536
points.push( new V2D(55,85) ); // 537
points.push( new V2D(15,125) ); // 538
points.push( new V2D(385,215) ); // 539
points.push( new V2D(385,205) ); // 540
points.push( new V2D(305,205) ); // 541
points.push( new V2D(295,215) ); // 542
points.push( new V2D(125,245) ); // 543
points.push( new V2D(295,35) ); // 544
points.push( new V2D(315,155) ); // 545
points.push( new V2D(105,185) ); // 546
points.push( new V2D(295,145) ); // 547
points.push( new V2D(285,25) ); // 548
points.push( new V2D(285,55) ); // 549
points.push( new V2D(295,55) ); // 550
points.push( new V2D(285,45) ); // 551
points.push( new V2D(45,205) ); // 552
points.push( new V2D(105,165) ); // 553
points.push( new V2D(35,125) ); // 554
points.push( new V2D(45,125) ); // 555
points.push( new V2D(55,125) ); // 556
points.push( new V2D(45,135) ); // 557
points.push( new V2D(55,135) ); // 558
points.push( new V2D(45,145) ); // 559
points.push( new V2D(45,115) ); // 560
points.push( new V2D(235,45) ); // 561
points.push( new V2D(395,175) ); // 562
points.push( new V2D(55,145) ); // 563
points.push( new V2D(45,155) ); // 564
points.push( new V2D(85,245) ); // 565
points.push( new V2D(315,75) ); // 566
points.push( new V2D(325,65) ); // 567
points.push( new V2D(335,65) ); // 568
points.push( new V2D(325,55) ); // 569
points.push( new V2D(305,85) ); // 570
points.push( new V2D(335,75) ); // 571
points.push( new V2D(345,85) ); // 572
points.push( new V2D(325,75) ); // 573
points.push( new V2D(345,75) ); // 574
points.push( new V2D(245,125) ); // 575
points.push( new V2D(75,105) ); // 576
points.push( new V2D(85,115) ); // 577
points.push( new V2D(185,265) ); // 578
points.push( new V2D(225,45) ); // 579
points.push( new V2D(375,145) ); // 580
points.push( new V2D(85,95) ); // 581
points.push( new V2D(85,85) ); // 582
points.push( new V2D(75,85) ); // 583
points.push( new V2D(285,165) ); // 584
points.push( new V2D(225,5) ); // 585
points.push( new V2D(235,5) ); // 586
points.push( new V2D(75,225) ); // 587
points.push( new V2D(55,225) ); // 588
points.push( new V2D(195,265) ); // 589
points.push( new V2D(205,275) ); // 590
points.push( new V2D(275,45) ); // 591
points.push( new V2D(345,225) ); // 592
points.push( new V2D(215,265) ); // 593
points.push( new V2D(225,275) ); // 594
points.push( new V2D(395,145) ); // 595
points.push( new V2D(375,165) ); // 596
points.push( new V2D(255,125) ); // 597
points.push( new V2D(155,145) ); // 598
points.push( new V2D(215,275) ); // 599
points.push( new V2D(275,65) ); // 600
points.push( new V2D(155,135) ); // 601
points.push( new V2D(285,65) ); // 602
points.push( new V2D(205,185) ); // 603
points.push( new V2D(295,5) ); // 604
points.push( new V2D(285,115) ); // 605
points.push( new V2D(295,105) ); // 606
points.push( new V2D(315,65) ); // 607
points.push( new V2D(305,35) ); // 608
points.push( new V2D(355,85) ); // 609
points.push( new V2D(365,85) ); // 610
points.push( new V2D(375,85) ); // 611
points.push( new V2D(345,65) ); // 612
points.push( new V2D(335,55) ); // 613
points.push( new V2D(235,35) ); // 614
points.push( new V2D(265,125) ); // 615
points.push( new V2D(125,95) ); // 616
points.push( new V2D(345,45) ); // 617
points.push( new V2D(355,45) ); // 618
points.push( new V2D(365,35) ); // 619
points.push( new V2D(365,45) ); // 620
points.push( new V2D(375,55) ); // 621
points.push( new V2D(385,45) ); // 622
points.push( new V2D(385,35) ); // 623
points.push( new V2D(375,35) ); // 624
points.push( new V2D(395,35) ); // 625
points.push( new V2D(375,45) ); // 626
points.push( new V2D(365,55) ); // 627
points.push( new V2D(365,65) ); // 628
points.push( new V2D(385,55) ); // 629
points.push( new V2D(395,55) ); // 630
points.push( new V2D(375,65) ); // 631
points.push( new V2D(355,35) ); // 632
points.push( new V2D(365,25) ); // 633
points.push( new V2D(375,15) ); // 634
points.push( new V2D(365,15) ); // 635
points.push( new V2D(385,15) ); // 636
points.push( new V2D(355,25) ); // 637
points.push( new V2D(355,15) ); // 638
points.push( new V2D(395,15) ); // 639
points.push( new V2D(85,145) ); // 640
points.push( new V2D(175,45) ); // 641
points.push( new V2D(355,95) ); // 642
points.push( new V2D(35,155) ); // 643
points.push( new V2D(235,275) ); // 644
points.push( new V2D(205,105) ); // 645
points.push( new V2D(25,125) ); // 646
points.push( new V2D(195,275) ); // 647
points.push( new V2D(65,85) ); // 648
points.push( new V2D(255,265) ); // 649
points.push( new V2D(255,275) ); // 650
points.push( new V2D(325,85) ); // 651
points.push( new V2D(275,75) ); // 652
points.push( new V2D(235,265) ); // 653
points.push( new V2D(275,15) ); // 654
points.push( new V2D(5,275) ); // 655
points.push( new V2D(375,25) ); // 656
points.push( new V2D(205,5) ); // 657
points.push( new V2D(355,75) ); // 658
points.push( new V2D(95,245) ); // 659
points.push( new V2D(245,265) ); // 660
points.push( new V2D(45,185) ); // 661
points.push( new V2D(45,175) ); // 662
points.push( new V2D(325,165) ); // 663
points.push( new V2D(305,55) ); // 664
points.push( new V2D(295,45) ); // 665
points.push( new V2D(315,45) ); // 666
points.push( new V2D(255,45) ); // 667
points.push( new V2D(245,5) ); // 668
points.push( new V2D(255,5) ); // 669
points.push( new V2D(265,5) ); // 670
points.push( new V2D(195,115) ); // 671
points.push( new V2D(185,5) ); // 672
points.push( new V2D(265,265) ); // 673
points.push( new V2D(275,275) ); // 674
points.push( new V2D(275,105) ); // 675
points.push( new V2D(225,265) ); // 676
points.push( new V2D(105,115) ); // 677
points.push( new V2D(105,125) ); // 678
points.push( new V2D(75,235) ); // 679
points.push( new V2D(205,265) ); // 680
points.push( new V2D(365,225) ); // 681
points.push( new V2D(55,235) ); // 682
points.push( new V2D(395,215) ); // 683
points.push( new V2D(395,205) ); // 684
points.push( new V2D(395,195) ); // 685
points.push( new V2D(355,55) ); // 686
points.push( new V2D(315,55) ); // 687
points.push( new V2D(45,165) ); // 688
points.push( new V2D(55,155) ); // 689
points.push( new V2D(395,135) ); // 690
points.push( new V2D(385,125) ); // 691
points.push( new V2D(245,15) ); // 692
points.push( new V2D(365,115) ); // 693
points.push( new V2D(325,45) ); // 694
points.push( new V2D(105,215) ); // 695
points.push( new V2D(155,225) ); // 696
points.push( new V2D(355,145) ); // 697
points.push( new V2D(305,155) ); // 698
points.push( new V2D(65,215) ); // 699
points.push( new V2D(295,185) ); // 700
points.push( new V2D(35,85) ); // 701
points.push( new V2D(55,165) ); // 702
points.push( new V2D(385,65) ); // 703
points.push( new V2D(215,195) ); // 704
points.push( new V2D(205,195) ); // 705
points.push( new V2D(345,5) ); // 706
points.push( new V2D(355,5) ); // 707
points.push( new V2D(365,5) ); // 708
points.push( new V2D(165,145) ); // 709
points.push( new V2D(265,275) ); // 710
points.push( new V2D(375,225) ); // 711
points.push( new V2D(55,215) ); // 712
points.push( new V2D(165,15) ); // 713
points.push( new V2D(65,185) ); // 714
points.push( new V2D(335,225) ); // 715
points.push( new V2D(95,85) ); // 716
points.push( new V2D(85,75) ); // 717
points.push( new V2D(385,25) ); // 718
points.push( new V2D(305,265) ); // 719
points.push( new V2D(295,275) ); // 720
points.push( new V2D(305,275) ); // 721
points.push( new V2D(315,275) ); // 722
points.push( new V2D(225,205) ); // 723
points.push( new V2D(245,275) ); // 724
points.push( new V2D(275,125) ); // 725
points.push( new V2D(225,55) ); // 726
points.push( new V2D(215,45) ); // 727
points.push( new V2D(165,175) ); // 728
points.push( new V2D(305,45) ); // 729
points.push( new V2D(275,115) ); // 730
points.push( new V2D(345,35) ); // 731
points.push( new V2D(275,265) ); // 732
points.push( new V2D(395,115) ); // 733
points.push( new V2D(395,105) ); // 734
points.push( new V2D(365,265) ); // 735
points.push( new V2D(285,95) ); // 736
points.push( new V2D(375,265) ); // 737
points.push( new V2D(35,175) ); // 738
points.push( new V2D(295,25) ); // 739
points.push( new V2D(165,155) ); // 740
points.push( new V2D(295,265) ); // 741
points.push( new V2D(395,65) ); // 742
points.push( new V2D(385,75) ); // 743
points.push( new V2D(395,75) ); // 744
points.push( new V2D(315,35) ); // 745
points.push( new V2D(155,155) ); // 746
points.push( new V2D(285,275) ); // 747
points.push( new V2D(335,85) ); // 748
points.push( new V2D(395,165) ); // 749
points.push( new V2D(395,45) ); // 750
points.push( new V2D(305,5) ); // 751
points.push( new V2D(5,155) ); // 752
points.push( new V2D(85,105) ); // 753
points.push( new V2D(55,175) ); // 754
points.push( new V2D(115,165) ); // 755
points.push( new V2D(165,45) ); // 756
points.push( new V2D(345,95) ); // 757
points.push( new V2D(345,15) ); // 758
points.push( new V2D(335,165) ); // 759
points.push( new V2D(75,135) ); // 760
points.push( new V2D(345,105) ); // 761
points.push( new V2D(335,95) ); // 762
points.push( new V2D(125,185) ); // 763
points.push( new V2D(125,175) ); // 764
points.push( new V2D(345,235) ); // 765
points.push( new V2D(325,155) ); // 766
points.push( new V2D(395,125) ); // 767
points.push( new V2D(315,265) ); // 768
points.push( new V2D(325,275) ); // 769
points.push( new V2D(335,275) ); // 770
points.push( new V2D(345,285) ); // 771
points.push( new V2D(375,115) ); // 772
points.push( new V2D(355,65) ); // 773
points.push( new V2D(35,165) ); // 774
points.push( new V2D(395,95) ); // 775
points.push( new V2D(225,195) ); // 776
points.push( new V2D(215,205) ); // 777
points.push( new V2D(315,285) ); // 778
points.push( new V2D(295,165) ); // 779
points.push( new V2D(325,95) ); // 780
points.push( new V2D(145,155) ); // 781
points.push( new V2D(305,105) ); // 782
points.push( new V2D(295,115) ); // 783
points.push( new V2D(295,95) ); // 784
points.push( new V2D(365,95) ); // 785
points.push( new V2D(285,265) ); // 786
points.push( new V2D(215,25) ); // 787
points.push( new V2D(385,105) ); // 788
points.push( new V2D(275,195) ); // 789
points.push( new V2D(275,205) ); // 790
points.push( new V2D(285,215) ); // 791
points.push( new V2D(265,215) ); // 792
points.push( new V2D(265,225) ); // 793
points.push( new V2D(285,195) ); // 794
points.push( new V2D(285,205) ); // 795
points.push( new V2D(385,115) ); // 796
points.push( new V2D(275,235) ); // 797
points.push( new V2D(285,225) ); // 798
points.push( new V2D(235,25) ); // 799
points.push( new V2D(325,285) ); // 800
points.push( new V2D(15,105) ); // 801
points.push( new V2D(185,215) ); // 802
points.push( new V2D(195,215) ); // 803
points.push( new V2D(175,225) ); // 804
points.push( new V2D(205,205) ); // 805
points.push( new V2D(335,45) ); // 806
points.push( new V2D(105,175) ); // 807
points.push( new V2D(355,235) ); // 808
points.push( new V2D(375,75) ); // 809
points.push( new V2D(5,245) ); // 810
points.push( new V2D(205,45) ); // 811
points.push( new V2D(195,35) ); // 812
points.push( new V2D(135,155) ); // 813
points.push( new V2D(45,225) ); // 814
points.push( new V2D(75,75) ); // 815
points.push( new V2D(305,25) ); // 816
points.push( new V2D(395,265) ); // 817
points.push( new V2D(305,125) ); // 818
points.push( new V2D(295,65) ); // 819
points.push( new V2D(335,5) ); // 820
points.push( new V2D(5,125) ); // 821
points.push( new V2D(355,275) ); // 822
points.push( new V2D(355,265) ); // 823
points.push( new V2D(295,235) ); // 824
points.push( new V2D(375,105) ); // 825
points.push( new V2D(315,95) ); // 826
points.push( new V2D(45,195) ); // 827
points.push( new V2D(145,235) ); // 828
points.push( new V2D(335,25) ); // 829
points.push( new V2D(345,25) ); // 830
points.push( new V2D(335,15) ); // 831
points.push( new V2D(65,235) ); // 832
points.push( new V2D(115,115) ); // 833
points.push( new V2D(325,25) ); // 834
points.push( new V2D(255,215) ); // 835
points.push( new V2D(245,225) ); // 836
points.push( new V2D(245,215) ); // 837
points.push( new V2D(245,205) ); // 838
points.push( new V2D(255,205) ); // 839
points.push( new V2D(375,235) ); // 840
points.push( new V2D(65,225) ); // 841
points.push( new V2D(385,85) ); // 842
points.push( new V2D(285,105) ); // 843
points.push( new V2D(285,235) ); // 844
points.push( new V2D(5,135) ); // 845
points.push( new V2D(305,165) ); // 846
points.push( new V2D(115,175) ); // 847
points.push( new V2D(325,5) ); // 848
points.push( new V2D(25,235) ); // 849
points.push( new V2D(15,145) ); // 850
points.push( new V2D(295,285) ); // 851
points.push( new V2D(195,65) ); // 852
points.push( new V2D(275,215) ); // 853
points.push( new V2D(25,95) ); // 854
points.push( new V2D(305,65) ); // 855
points.push( new V2D(305,285) ); // 856
points.push( new V2D(55,185) ); // 857
points.push( new V2D(265,75) ); // 858
points.push( new V2D(195,55) ); // 859
points.push( new V2D(365,285) ); // 860
points.push( new V2D(335,35) ); // 861
points.push( new V2D(325,105) ); // 862
points.push( new V2D(275,225) ); // 863
points.push( new V2D(385,95) ); // 864
points.push( new V2D(365,235) ); // 865
points.push( new V2D(345,275) ); // 866
points.push( new V2D(335,105) ); // 867
points.push( new V2D(15,135) ); // 868
points.push( new V2D(45,235) ); // 869
points.push( new V2D(15,235) ); // 870
points.push( new V2D(315,15) ); // 871
points.push( new V2D(305,115) ); // 872
points.push( new V2D(375,5) ); // 873
points.push( new V2D(315,105) ); // 874
points.push( new V2D(305,95) ); // 875
points.push( new V2D(305,15) ); // 876
points.push( new V2D(395,25) ); // 877
points.push( new V2D(315,215) ); // 878
points.push( new V2D(55,95) ); // 879
points.push( new V2D(315,5) ); // 880
points.push( new V2D(265,205) ); // 881
points.push( new V2D(185,225) ); // 882
points.push( new V2D(385,185) ); // 883
points.push( new V2D(385,195) ); // 884
points.push( new V2D(395,5) ); // 885
points.push( new V2D(105,105) ); // 886
points.push( new V2D(5,95) ); // 887
points.push( new V2D(15,85) ); // 888
points.push( new V2D(5,105) ); // 889
points.push( new V2D(55,245) ); // 890
points.push( new V2D(325,15) ); // 891
points.push( new V2D(25,145) ); // 892
points.push( new V2D(295,205) ); // 893
points.push( new V2D(295,175) ); // 894
points.push( new V2D(135,85) ); // 895
points.push( new V2D(215,215) ); // 896
points.push( new V2D(395,155) ); // 897
points.push( new V2D(25,85) ); // 898
points.push( new V2D(35,75) ); // 899
points.push( new V2D(45,75) ); // 900
points.push( new V2D(45,65) ); // 901
points.push( new V2D(55,55) ); // 902
points.push( new V2D(55,65) ); // 903
points.push( new V2D(55,75) ); // 904
points.push( new V2D(65,75) ); // 905
points.push( new V2D(35,65) ); // 906
points.push( new V2D(95,75) ); // 907
points.push( new V2D(65,195) ); // 908
points.push( new V2D(365,275) ); // 909
points.push( new V2D(5,145) ); // 910
points.push( new V2D(145,175) ); // 911
points.push( new V2D(65,65) ); // 912
points.push( new V2D(65,55) ); // 913
points.push( new V2D(65,45) ); // 914
points.push( new V2D(75,45) ); // 915
points.push( new V2D(75,35) ); // 916
points.push( new V2D(55,45) ); // 917
points.push( new V2D(115,185) ); // 918
points.push( new V2D(165,5) ); // 919
points.push( new V2D(355,285) ); // 920
points.push( new V2D(65,245) ); // 921
points.push( new V2D(215,185) ); // 922
points.push( new V2D(65,35) ); // 923
points.push( new V2D(15,95) ); // 924
points.push( new V2D(395,85) ); // 925
points.push( new V2D(75,245) ); // 926
points.push( new V2D(25,135) ); // 927
points.push( new V2D(45,55) ); // 928
points.push( new V2D(35,55) ); // 929
points.push( new V2D(255,235) ); // 930
points.push( new V2D(305,215) ); // 931
points.push( new V2D(365,75) ); // 932
points.push( new V2D(35,235) ); // 933
points.push( new V2D(25,75) ); // 934
points.push( new V2D(35,135) ); // 935
points.push( new V2D(325,225) ); // 936
points.push( new V2D(315,115) ); // 937
points.push( new V2D(315,25) ); // 938
points.push( new V2D(325,235) ); // 939
points.push( new V2D(225,215) ); // 940
points.push( new V2D(235,225) ); // 941
points.push( new V2D(305,235) ); // 942
points.push( new V2D(185,135) ); // 943
points.push( new V2D(375,275) ); // 944
points.push( new V2D(235,205) ); // 945
points.push( new V2D(345,55) ); // 946
points.push( new V2D(15,75) ); // 947
points.push( new V2D(115,95) ); // 948
points.push( new V2D(15,245) ); // 949
points.push( new V2D(75,55) ); // 950
points.push( new V2D(85,55) ); // 951
points.push( new V2D(95,45) ); // 952
points.push( new V2D(95,35) ); // 953
points.push( new V2D(75,65) ); // 954
points.push( new V2D(85,65) ); // 955
points.push( new V2D(85,45) ); // 956
points.push( new V2D(85,25) ); // 957
points.push( new V2D(95,25) ); // 958
points.push( new V2D(85,35) ); // 959
points.push( new V2D(75,25) ); // 960
points.push( new V2D(85,15) ); // 961
points.push( new V2D(105,15) ); // 962
points.push( new V2D(115,15) ); // 963
points.push( new V2D(105,5) ); // 964
points.push( new V2D(105,25) ); // 965
points.push( new V2D(65,25) ); // 966
points.push( new V2D(335,235) ); // 967
points.push( new V2D(5,85) ); // 968
points.push( new V2D(105,35) ); // 969
points.push( new V2D(105,45) ); // 970
points.push( new V2D(25,65) ); // 971
points.push( new V2D(325,135) ); // 972
points.push( new V2D(385,175) ); // 973
points.push( new V2D(55,35) ); // 974
points.push( new V2D(35,145) ); // 975
points.push( new V2D(5,65) ); // 976
points.push( new V2D(115,105) ); // 977
points.push( new V2D(75,15) ); // 978
points.push( new V2D(145,185) ); // 979
points.push( new V2D(175,155) ); // 980
points.push( new V2D(5,215) ); // 981
points.push( new V2D(65,15) ); // 982
points.push( new V2D(265,195) ); // 983
points.push( new V2D(25,245) ); // 984
points.push( new V2D(305,295) ); // 985
points.push( new V2D(205,215) ); // 986
points.push( new V2D(15,65) ); // 987
points.push( new V2D(85,285) ); // 988
points.push( new V2D(5,115) ); // 989
points.push( new V2D(255,225) ); // 990
points.push( new V2D(265,235) ); // 991
points.push( new V2D(265,185) ); // 992
points.push( new V2D(385,265) ); // 993
points.push( new V2D(335,295) ); // 994
points.push( new V2D(325,295) ); // 995
points.push( new V2D(335,285) ); // 996
points.push( new V2D(235,215) ); // 997
points.push( new V2D(295,15) ); // 998
points.push( new V2D(95,55) ); // 999
points.push( new V2D(105,65) ); // 1000
points.push( new V2D(245,195) ); // 1001
points.push( new V2D(65,95) ); // 1002
points.push( new V2D(95,5) ); // 1003
points.push( new V2D(255,195) ); // 1004
points.push( new V2D(115,5) ); // 1005
points.push( new V2D(95,65) ); // 1006
points.push( new V2D(5,55) ); // 1007
points.push( new V2D(5,45) ); // 1008
points.push( new V2D(105,55) ); // 1009
points.push( new V2D(55,195) ); // 1010
points.push( new V2D(65,5) ); // 1011
points.push( new V2D(155,55) ); // 1012
points.push( new V2D(225,225) ); // 1013
points.push( new V2D(125,15) ); // 1014
points.push( new V2D(125,5) ); // 1015
points.push( new V2D(135,5) ); // 1016
points.push( new V2D(15,285) ); // 1017
points.push( new V2D(5,35) ); // 1018
points.push( new V2D(5,25) ); // 1019
points.push( new V2D(5,15) ); // 1020
points.push( new V2D(385,235) ); // 1021
points.push( new V2D(105,95) ); // 1022
points.push( new V2D(45,45) ); // 1023
points.push( new V2D(315,235) ); // 1024
points.push( new V2D(65,175) ); // 1025
points.push( new V2D(345,295) ); // 1026
points.push( new V2D(95,15) ); // 1027
points.push( new V2D(15,45) ); // 1028
points.push( new V2D(15,35) ); // 1029
points.push( new V2D(225,185) ); // 1030
points.push( new V2D(115,25) ); // 1031
points.push( new V2D(55,15) ); // 1032
points.push( new V2D(45,5) ); // 1033
points.push( new V2D(55,5) ); // 1034
points.push( new V2D(35,15) ); // 1035
points.push( new V2D(25,35) ); // 1036
points.push( new V2D(15,25) ); // 1037
points.push( new V2D(15,15) ); // 1038
points.push( new V2D(25,15) ); // 1039
points.push( new V2D(15,55) ); // 1040
points.push( new V2D(25,55) ); // 1041
points.push( new V2D(45,245) ); // 1042
points.push( new V2D(165,235) ); // 1043
points.push( new V2D(115,35) ); // 1044
points.push( new V2D(125,35) ); // 1045
points.push( new V2D(125,25) ); // 1046
points.push( new V2D(35,245) ); // 1047
points.push( new V2D(65,285) ); // 1048
points.push( new V2D(45,15) ); // 1049
points.push( new V2D(115,85) ); // 1050
points.push( new V2D(45,35) ); // 1051
points.push( new V2D(35,35) ); // 1052
points.push( new V2D(25,25) ); // 1053
points.push( new V2D(5,75) ); // 1054
points.push( new V2D(75,5) ); // 1055
points.push( new V2D(115,55) ); // 1056
points.push( new V2D(175,5) ); // 1057
points.push( new V2D(75,95) ); // 1058
points.push( new V2D(135,175) ); // 1059
points.push( new V2D(55,25) ); // 1060
points.push( new V2D(35,45) ); // 1061
points.push( new V2D(35,25) ); // 1062
points.push( new V2D(245,185) ); // 1063
points.push( new V2D(235,185) ); // 1064
points.push( new V2D(325,35) ); // 1065
points.push( new V2D(135,25) ); // 1066
points.push( new V2D(135,15) ); // 1067
points.push( new V2D(285,15) ); // 1068
points.push( new V2D(195,225) ); // 1069
points.push( new V2D(265,45) ); // 1070
points.push( new V2D(125,75) ); // 1071
points.push( new V2D(385,225) ); // 1072
points.push( new V2D(85,5) ); // 1073
points.push( new V2D(5,5) ); // 1074
points.push( new V2D(395,225) ); // 1075
points.push( new V2D(25,45) ); // 1076
points.push( new V2D(115,45) ); // 1077
points.push( new V2D(145,5) ); // 1078
points.push( new V2D(45,25) ); // 1079
points.push( new V2D(395,185) ); // 1080
points.push( new V2D(385,5) ); // 1081
points.push( new V2D(145,25) ); // 1082
points.push( new V2D(145,15) ); // 1083
points.push( new V2D(235,235) ); // 1084
points.push( new V2D(315,225) ); // 1085
points.push( new V2D(375,285) ); // 1086
points.push( new V2D(295,195) ); // 1087
points.push( new V2D(115,75) ); // 1088
points.push( new V2D(105,85) ); // 1089
points.push( new V2D(5,285) ); // 1090
points.push( new V2D(135,35) ); // 1091
points.push( new V2D(15,5) ); // 1092
points.push( new V2D(155,25) ); // 1093
points.push( new V2D(255,185) ); // 1094
points.push( new V2D(145,65) ); // 1095
points.push( new V2D(25,285) ); // 1096
points.push( new V2D(175,235) ); // 1097
points.push( new V2D(125,55) ); // 1098
points.push( new V2D(215,225) ); // 1099
points.push( new V2D(35,5) ); // 1100
points.push( new V2D(305,225) ); // 1101
points.push( new V2D(135,185) ); // 1102
points.push( new V2D(155,125) ); // 1103
points.push( new V2D(395,235) ); // 1104
points.push( new V2D(25,5) ); // 1105
points.push( new V2D(105,75) ); // 1106
points.push( new V2D(5,295) ); // 1107
points.push( new V2D(155,35) ); // 1108
points.push( new V2D(5,205) ); // 1109
points.push( new V2D(225,235) ); // 1110
points.push( new V2D(155,45) ); // 1111
points.push( new V2D(115,65) ); // 1112
points.push( new V2D(135,65) ); // 1113
points.push( new V2D(365,145) ); // 1114
points.push( new V2D(235,195) ); // 1115
points.push( new V2D(245,235) ); // 1116
points.push( new V2D(135,75) ); // 1117
points.push( new V2D(235,285) ); // 1118
points.push( new V2D(245,285) ); // 1119
points.push( new V2D(255,285) ); // 1120
points.push( new V2D(265,285) ); // 1121
points.push( new V2D(275,295) ); // 1122
points.push( new V2D(275,285) ); // 1123
points.push( new V2D(285,295) ); // 1124
points.push( new V2D(285,285) ); // 1125
points.push( new V2D(225,285) ); // 1126
points.push( new V2D(215,285) ); // 1127
points.push( new V2D(205,285) ); // 1128
points.push( new V2D(225,295) ); // 1129
points.push( new V2D(125,45) ); // 1130
points.push( new V2D(95,285) ); // 1131
points.push( new V2D(155,15) ); // 1132
points.push( new V2D(215,295) ); // 1133
points.push( new V2D(195,285) ); // 1134
points.push( new V2D(205,225) ); // 1135
points.push( new V2D(155,5) ); // 1136
points.push( new V2D(255,295) ); // 1137
points.push( new V2D(235,295) ); // 1138
points.push( new V2D(125,65) ); // 1139
points.push( new V2D(295,225) ); // 1140
points.push( new V2D(75,285) ); // 1141
points.push( new V2D(195,235) ); // 1142
points.push( new V2D(185,285) ); // 1143
points.push( new V2D(205,295) ); // 1144
points.push( new V2D(245,295) ); // 1145
points.push( new V2D(295,295) ); // 1146
points.push( new V2D(145,55) ); // 1147
points.push( new V2D(135,55) ); // 1148
points.push( new V2D(45,285) ); // 1149
points.push( new V2D(205,235) ); // 1150
points.push( new V2D(135,285) ); // 1151
points.push( new V2D(115,285) ); // 1152
points.push( new V2D(155,285) ); // 1153
points.push( new V2D(125,285) ); // 1154
points.push( new V2D(55,285) ); // 1155
points.push( new V2D(195,295) ); // 1156
points.push( new V2D(185,235) ); // 1157
points.push( new V2D(135,45) ); // 1158
points.push( new V2D(35,285) ); // 1159
points.push( new V2D(165,285) ); // 1160
points.push( new V2D(265,295) ); // 1161
points.push( new V2D(215,235) ); // 1162
points.push( new V2D(145,35) ); // 1163
points.push( new V2D(145,285) ); // 1164
points.push( new V2D(65,295) ); // 1165
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
matrix.scale(3.0);
matrix.translate(100.0,1000.0);
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

		point = matrix.multV2D(new V2D(), new V2D(185,215));
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
	var perimeter = triangulator.perimeter();//this._datas;
	//var rays = triangulator.rays();
	var rays = Code.rayFromPointPerimeter(points,perimeter);
	console.log("DATA ..............................");
	// console.log(points);
	// console.log(datas);
	// console.log(tris);
	// console.log(perimeter);
	// console.log(rays);

	// console.log(perimeter.length);
	// console.log(rays.length);


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

	//var points = triangulator.points();
	//var perimeter = triangulator.perimeter();
	for(i=0; i<perimeter.length; ++i){
		var pointA = points[ perimeter[i] ];
		var pointB = points[ perimeter[(i+1)%perimeter.length] ];
		var ray = rays[i];//points[rays[i]];
		ray.scale(10.0);
		console.log(ray);
		var pointC = V2D.add(pointA,ray);
		//ray = matrix.multV2D(new V2D(), ray);
		pointA = matrix.multV2D(new V2D(), pointA);
		pointB = matrix.multV2D(new V2D(), pointB);
		pointC = matrix.multV2D(new V2D(), pointC);
		var wig = 5;
		pointA.wiggle(wig);
		pointB.wiggle(wig);
		// console.log(point); 
		var color = 0xFF0000FF;
		var c = new DO();
		c.graphics().setLine(2.0, color);
		c.graphics().beginPath();
		c.graphics().drawPolygon([pointA,pointB], true);
		c.graphics().strokeLine();
		c.graphics().endPath();
		GLOBALSTAGE.addChild(c);
		//

		var c = new DO();
		c.graphics().setLine(2.0, color);
		c.graphics().beginPath();
		c.graphics().drawPolygon([pointA,pointC], true);
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



