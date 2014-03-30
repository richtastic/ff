// Rice.js

function Rice(){
	//this.example1();
	//this.example2();
	//this.example3();
	//this.example4();
	this.example5();
}
Rice.prototype.example5 = function(){
	var data = new ByteData();
	for(var i=0;i<10;++i){
		data.writeUint8( Math.floor(Math.random()*256) );
		//data.writeUint8(33);
	}
	//data.writeBinaryString("11010011101100");
	console.log(data.toStringBin());
	//data.appendCRC( parseInt("1011",2) );
	//data.appendCRC();
	//data.appendCRC(ByteData.CRC_32_A);
	data.appendCRC(ByteData.CRC_32_B);
	//data.appendCRC(ByteData.CRC_32_C);
	console.log(data.toStringBin());
	var was = data.checkCRC();
	// error
	var flipBit = 8;
	//var flipBit = Math.floor(data.length()*0.5);
	data.position(flipBit);
	var flipped = data.read();
	data.position(flipBit);
	data.write(flipped==0);
	// 
	console.log(data.toStringBin());
	var is = data.checkCRC();
	data.removeCRC()
	console.log(data.toStringBin());
	console.log(was);
	console.log(is);
}
Rice.prototype.example4 = function(){
	var data = new ByteData();
	for(var i=0;i<12500;++i){ // 100,000 bits * 1KB/(8bits*1024bytes) = 12.2 KB
		//data.writeUint8( Math.floor(Math.random()*256) );
		//data.writeUint8( Math.floor(Math.random()*128) ); //break even
		//data.writeUint8( Math.floor(Math.random()*64) );
		data.writeUint8( Math.floor(Math.random()*32) );
		//data.writeUint8( Math.floor(Math.random()*16) );
		//data.writeUint8( Math.floor(Math.random()*8) );
	}
	var compressed1 = data.compressedHuffman(4);
	var compressed2 = compressed1.compressedHuffman(2);
	var compressed3 = compressed2.compressedHuffman(2);
	console.log("COMPRESSION RATIO 1: "+( data.length()*1.0/compressed1.length() )+"   "+data.length()+" / "+compressed1.length());
	console.log("COMPRESSION RATIO 2: "+( data.length()*1.0/compressed2.length() )+"   "+data.length()+" / "+compressed2.length());
	console.log("COMPRESSION RATIO 3: "+( data.length()*1.0/compressed3.length() )+"   "+data.length()+" / "+compressed3.length());
}


Rice.prototype.example3 = function(){
	var data = new ByteData();
	for(var i=0;i<500;++i){
		//data.writeUint8( Math.floor(Math.random()*256) );// 0.98 | 0.95 | 0.92 | 0.83
		//data.writeUint8( Math.floor(Math.random()*32) ); // 1.10 | 1.05 | 1.11 | 0.93
		//data.writeUint8( Math.floor(Math.random()*16) ); // 1.20 | 1.17 | 1.24 | 1.00
		//data.writeUint8( Math.floor(Math.random()*8) );  // 1.35 | 1.35 | 1.48 | 1.11
	}
	var compressed2 = data.compressedHuffman(2);
	var compressed3 = data.compressedHuffman(3);
	var compressed4 = data.compressedHuffman(4);
	var compressed5 = data.compressedHuffman(5);
	console.log("COMPRESSION RATIO 2: "+( data.length()*1.0/compressed2.length() )+"   "+data.length()+" / "+compressed2.length());
	console.log("COMPRESSION RATIO 3: "+( data.length()*1.0/compressed3.length() )+"   "+data.length()+" / "+compressed3.length());
	console.log("COMPRESSION RATIO 4: "+( data.length()*1.0/compressed4.length() )+"   "+data.length()+" / "+compressed4.length());
	console.log("COMPRESSION RATIO 5: "+( data.length()*1.0/compressed5.length() )+"   "+data.length()+" / "+compressed5.length());
}

Rice.prototype.example2 = function(){
	var data = new ByteData();
	for(var i=0;i<20;++i){
		data.writeUint8(3);
		// data.writeUint8(12);
		// data.writeUint8(111);
		data.write( (Math.random()>=0.5)?1:0 );
	}
	//console.log(data.toString64());
	console.log(data.toString());
	var compressed = data.compressedHuffman();
	//console.log(compressed.toString64());
	console.log(compressed.toString());
	var decompressed = compressed.decompressedHuffman();
	//console.log(decompressed.toString64());
	console.log(decompressed.toString());
	
	console.log("COMPRESSION RATIO: "+( data.length()*1.0/compressed.length() ));
}

Rice.prototype.example1 = function(){
	var data = new ByteData();
	var lenOriginal, lenCompressed;
	// write
	for(var i=0;i<20;++i){
		//data.write( (Math.random()>=0.5)?1:0 );
		data.writeUint16(3);
		data.writeUint16(8);
		data.writeUint16(1111);
		data.writeUint16(18);
		data.writeUint16(2111);
	}
	lenOriginal = data.length();
	// show
	//console.log(data.toString());
	//console.log(data.toStringHex());
	console.log(data.toString64());
	// compress
	var compressed = data.compressedRice(8,16);
	//console.log(compressed.toString());
	//console.log(compressed.toStringHex());
	console.log(compressed.toString64());
	lenCompressed = compressed.length();
	// uncompress
	var decompressed = compressed.decompressedRice();
	//console.log(decompressed.toString());
	//console.log(decompressed.toStringHex());
	console.log(data.toString64());
	// read
	data = decompressed;
	data.position(0);
	// while(data.position()<data.length()){
	// 	//console.log(data.readUint8());
	// 	console.log(data.readUint16());
	// }
	console.log(".............");
	console.log("COMPRESSION RATIO: "+(lenOriginal*1.0/lenCompressed));
}


