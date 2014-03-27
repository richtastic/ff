// Rice.js

function Rice(){
	//this.example1();
	this.example2();
}

Rice.prototype.example2 = function(){
	var lenOriginal, lenCompressed;
	var data = new ByteData();
	for(var i=0;i<20;++i){
		data.writeUint8(3);
		// data.writeUint8(12);
		// data.writeUint8(111);
		data.write( (Math.random()>=0.5)?1:0 );
	}
	lenOriginal = data.length();
	console.log(data.toString64());
	var compressed = data.compressedHuffman();
	lenCompressed = compressed.length();
	console.log(data.toString64());
	var decompressed = compressed.decompressedHuffman();
	data = decompressed;
	console.log(data.toString64());
	console.log("COMPRESSION RATIO: "+(lenOriginal*1.0/lenCompressed));
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


