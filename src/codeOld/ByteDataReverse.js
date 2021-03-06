// ByteData.js
// ------------------------------------------------------------------------------------------------- class
ByteData.arrayString64 = null;
ByteData.arrayInverse64 = null;
ByteData.getString64Array = function(){
	if(ByteData.arrayString64){
		return ByteData.arrayString64;
	}
	var str = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ[]";
	var i, len = str.length;
	ByteData.arrayString64 = new Array();
	for(i=0;i<len;++i){
		ByteData.arrayString64[i] = str.charAt(i);
	}
	return ByteData.arrayString64;
}
ByteData.getString64Hash = function(){
	if(ByteData.arrayInverse64){
		return ByteData.arrayInverse64;
	}
	var arr = ByteData.getString64Array();
	var i, len = arr.length;
	ByteData.arrayInverse64 = new Array();
	for(i=0;i<len;++i){
		ByteData.arrayInverse64[ arr[i] ] = i;
	}
	return ByteData.arrayInverse64;
}
// ------------------------------------------------------------------------------------------------- official bit64 encoded
ByteData.arrayStringBit64 = null;
ByteData.arrayInverseBit64 = null;
ByteData.getStringBit64Array = function(){
	if(ByteData.arrayStringBit64){
		return ByteData.arrayStringBit64;
	}
	var str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
	var i, len = str.length;
	ByteData.arrayStringBit64 = new Array();
	for(i=0;i<len;++i){
		ByteData.arrayStringBit64[i] = str.charAt(i);
	}
	return ByteData.arrayStringBit64;
}
ByteData.getString64Hash = function(){
	if(ByteData.arrayInverseBit64){
		return ByteData.arrayInverseBit64;
	}
	var arr = ByteData.getString64BitArray();
	var i, len = arr.length;
	ByteData.arrayInverseBit64 = new Array();
	for(i=0;i<len;++i){
		ByteData.arrayInverseBit64[ arr[i] ] = i;
	}
	return ByteData.arrayInverseBit64;
}
// ----------------------------------------------------------------
ByteData.reverseUint = function(n,count){
	var i=0, m=0, ander = 1, toand = 1;
	ander <<= count-1;
	while(ander!=0){
		var anded = ander&n;
		if(anded != 0){
			m += toand;
		}
		ander >>= 1;
		toand <<= 1;
	}
	console.log(n+" => "+m);
	return m;
}
// ------------ instance
function ByteData(){
	// private:
	var bytes = [];
	var length = -1;
		// write
	var subIndex = 0;
	var subCount = 0;
		// read
	var readIndex = 0;
	var readSubIndex = 0;
	var signBit = false;
	// public:
	this.clearData = clearData;
	function clearData(){
		Code.emptyArray(bytes);
		length = -1;
		subIndex = 0;
		subCount = 0;
	}
	this.writeBit = writeBit;
	function writeBit(b){ // 0 or 1
		subIndex >>= 1;
		subIndex &= 0x7FFFFFFF;
		subCount++;
		if(subIndex==0){ // reached end of bytes
			subIndex = -2147483648;
			subCount = 0;
			++length; // add new byte
			bytes[length] = 0;
		}
		if(b!=0){
			if(subIndex<0){ // 2s compliment insanity
				bytes[length] = (~bytes[length]+1) | subIndex;// + 1;
			}else{
				bytes[length] |= subIndex;
			}
		}
	}
	this.initRead = initRead;
	function initRead(){
		readIndex = -1;
		readSubIndex = 0;
	}
	this.readBit = readBit;
	function readBit(){
		readSubIndex >>= 1;
		readSubIndex &= 0x7FFFFFFF;
		if(readSubIndex==0){
			readSubIndex = -2147483648;
			++readIndex;
			if(bytes[readIndex]<signBit){
				signBit = true;
			}else{
				signBit = false;
			}
		}
		return (bytes[readIndex]&readSubIndex)==0?0:1;
		/*
		if(signBit){ // even more 2s compliment insanity
			if(readSubIndex<0){ // 2s compliment insanity
				return (bytes[readIndex]&readSubIndex)==0?0:1;
			}else{
				return ((~bytes[readIndex]+1)&readSubIndex)==0?0:1;
			}
		}
		if(readSubIndex<0){ // 2s compliment insanity
			return ((~bytes[readIndex]+1)&readSubIndex)==0?1:0;
		}else{
			return (bytes[readIndex]&readSubIndex)==0?0:1;
		}
		*/
	}
	this.readEnd = readEnd;
	function readEnd(){
		return readIndex>length || (readIndex==length && (readSubIndex<=0&&subIndex<=0 || readSubIndex>0&&readSubIndex<=subIndex) );
	}
	this.getTotalBits = getTotalBits;
	function getTotalBits(){
		return 32*length + subCount + 1;
	}
	// --------------------------------------------------------------------------
	this.writeString64 = function(str){
		var arr = ByteData.getString64Hash();
		var i, len = str.length, num;
		console.log("length: "+len);
		for(i=0;i<len;++i){
			num = arr[str.charAt(i)];
			this.writeUint6( num );
		}
	}
    // ------------------------------------------------------------------------------------------------- Uint#
    this.writeUintN = function(n,b){
        var i, ander = 1;
        for(i=0;i<b;++i){
            (ander&n)==0?writeBit(0):writeBit(1);
            ander <<= 1;
        }
    }
    this.readUintN = function(b){
        var i, ander = 1, n=0;
        for(i=0;i<b;++i){
            readBit()==0?n:n|=ander;
            ander <<= 1;
        }
        return n;
    }
	// ------------------------------------------------------------------------------------------------- Uint4 nibble
	this.writeUint4 = function(n){
		var i, ander = 1;
		for(i=0;i<4;++i){
			(ander&n)==0?writeBit(0):writeBit(1);
			ander <<= 1;
		}
        //this.writeUintN(n,4);
	}
	this.readUint4 = function(){
		var i, ander = 1, n=0;
		for(i=0;i<4;++i){
			readBit()==0?n:n|=ander;
			ander <<= 1;
		}
		return n;
        //return this.readUintN(4);
	}
	// ------------------------------------------------------------------------------------------------- Uint6
	this.writeUint6 = function(n){
		var i, ander = 1;
		for(i=0;i<6;++i){
			(ander&n)==0?writeBit(0):writeBit(1);
			ander <<= 1;
		}
	}
	this.readUint6 = function(){
		var i, ander = 1, n=0;
		for(i=0;i<6;++i){
			readBit()==0?n:n|=ander;
			ander <<= 1;
		}
		return n;
	}
	// ------------------------------------------------------------------------------------------------- Uint8 byte
	this.writeUint8 = function(n){
		var i, ander = 1;
		for(i=0;i<8;++i){
			(ander&n)==0?writeBit(0):writeBit(1);
			ander <<= 1;
		}
	}
	this.readUint8 = function(){
		var i, ander = 1, n=0;
		for(i=0;i<8;++i){
			readBit()==0?n:n|=ander;
			ander <<= 1;
		}
		return n;
	}
	// ------------------------------------------------------------------------------------------------- Uint16
	this.writeUint16 = function(n){
		var i, ander = 1;
		for(i=0;i<16;++i){
			(ander&n)==0?writeBit(0):writeBit(1);
			ander <<= 1;
		}
	}
	this.readUint16 = function(){
		var i, ander = 1, n=0;
		for(i=0;i<16;++i){
			readBit()==0?n:n|=ander;
			ander <<= 1;
		}
		return n;
	}
	// ------------------------------------------------------------------------------------------------- Uint32
	this.writeUint32 = function(n){
		var i, ander = 1;
		for(i=0;i<32;++i){
			(ander&n)==0?writeBit(0):writeBit(1);
			ander <<= 1;
		}
	}
	this.readUint32 = function(){
		var i, ander = 1, n=0;
		for(i=0;i<32;++i){
			readBit()==0?n:n|=ander;
			ander <<= 1;
		}
		return n;
	}
	// ------------------------------------------------------------------------------------------------- Strings
	this.writeString = function(str,includeLength){
		var i, len = str.length;
		if( includeLength==null ){
			console.log("write len:"+len);
			this.writeUint32(len);
		}
		for(i=0;i<len;++i){
			this.writeASCII(str.charAt(i));
		}
	}
	this.readString = function(str,includeLength){
		if(includeLength==null){ includeLength = -1; }
		var i, len, str = "";
		if(includeLength<0){ // read byte length
			len = this.readUint32();
		}else if(includeLength==0){ // read to end
			len = this.getTotalBits()/8;
		}else{ // read param length
			len = includeLength;
		}
		for(i=0;i<len;++i){
			str = str + this.readASCII();
		}
		return str;
	}
	this.writeASCII = function(letter){
		var n = letter.charCodeAt(0);
		this.writeUint8(n);
	}
	this.readASCII = function(){
		var n = this.readUint8();
		return String.fromCharCode( n )
	}
	// ------------------------------------------------------------------------------------------------- 
	this.toStringBin = function(){
		var str = "", h, i, len = getTotalBits();
		initRead();
		for(i=0;i<len;++i){
			if ( i%8==0 && i>0){
				str = str + "|"
			}
			str = str+readBit();
		}
		return str;
	}
	this.toStringHex = function(){
		var str = "";
		var i, len = Math.ceil(getTotalBits()/4.0);
		initRead();
		for(i=0;i<len;++i){
			if ( i%8==0 && i>0){
				str = str + "|"
			}
			str = str+readUint4().toString(16).toUpperCase();
		}
		return str;
	}
	this.toString64 = function(){
		var arr = ByteData.getString64Array();
		initRead();
		var str = "";
		var i, len = Math.ceil(getTotalBits()/6.0);
		for(i=0;i<len;++i){
			str = str+ arr[ this.readUint6() ];
		}
		return str;
	}
	this.toString64BitEncoded = function(){
		var arr = ByteData.getStringBit64Array();
		initRead();
		var i, str = "";
		var totBits = getTotalBits();
		var len = Math.ceil(totBits/6.0);
		var rem = totBits - len*6;
		for(i=0;i<len;++i){
			str = str+ arr[ this.readUint6() ];
		}
		if(rem>=4){
			str = str + "==";
		}else if(rem>=2){
			str = str + "=";
		}
		return str;
	}
	this.toString = function(){
		return this.toStringBin();
	}
	// 
	/*this.printBinaryString = printBinaryString;
	function printBinaryString(){
		var i, len=length+1, str = "";
		for(i=0;i<len;++i){
			str = base10ToBinaryString(bytes[i],32) + str;
		}
		var rev = "";
		len = str.length;
		for(i=0;i<len;++i){
			rev = str.substr(i,1)+rev;
		}
		//document.write(str);
		document.write(rev);
	}*/
	this.getSubIndex = getSubIndex;
	function getSubIndex(){
		return subIndex;
	}
	/*
	this.getASCIICode = getASCIICode;
	function getASCIICode(){
		var charListASCII = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ()";
		var charArrayASCII = [];
		var i, len = charListASCII.length;
		for(i=0;i<len;++i){
			charArrayASCII[i] = charListASCII.charAt(i);
		}
		var val, str="";
		initRead();
		while(!readEnd()){
			val = 0;
			for(i=0;i<5;++i){
				val <<= 1;
				val |= readBit();
			}
			str += charArrayASCII[val];
		}
		document.write(str);
	}
	// ----------------
	this.getHuffmanCoding = getHuffmanCoding;
	function getHuffmanCoding(){
		//document.write("getHuffmanCoding:");
		var table = new Array();
		var bits = 6;// dat = [128,130,123,125,113,96,81,73,63,56,52,47];
		var i, len = Math.pow(2,bits);
		for(i=0;i<len;++i){
			table[i] = 0;
		}
		initRead();
		while(!readEnd()){
			val = 0;
			for(i=0;i<bits;++i){
				val <<= 1;
				val |= readBit();
			}
			table[val]++;
		}
		var node, nodeA, nodeB, obj;
		for(i=0;i<len;++i){
			obj = new Object(); obj.count = table[i]; obj.index = i;
			node = new Node(obj,null);
			table[i] = node;
		}
		while(table.length>1){
			table.sort(howToSortNodes);
			nodeA = table[table.length-1];
			nodeB = table[table.length-2];
			obj = new Object(); obj.count = nodeA.data.count+nodeB.data.count; obj.index = -1;
			node = new Node(obj);
			node.addChild(nodeA);
			node.addChild(nodeB);
			table.pop();
			table.pop();
			table.push(node);
			//document.write(" => ");
			len = table.length;
		}
		node = table.pop();
		recursiveDescent(node,"",table);
		
		//document.write("<br />");
		//for(i=0;i<table.length;++i){
		//	document.write(base10ToBinaryString(i,bits)+" => "+table[i]+" | ");
		//}
		//document.write("<br />");
		// RE-READ
		str = "";
		initRead();
		while(!readEnd()){
			val = 0;
			for(i=0;i<bits;++i){
				val <<= 1;
				val |= readBit();
			}
			str += table[val];
		}
		//document.write("<br />");
		document.write(str+" = "+str.length);
		document.write("<br />");
		len = str.length;
		i = 0;
		str2 = "";
		while(i<len){
			nodeA = node;
			inStr = "";
			while(nodeA!=null && i<len){
				val = parseInt( str.charAt(i) );
				nodeA = nodeA.getChildAt(val);
				if(nodeA){
					code = nodeA.data.index;
					inStr = inStr+""+val;
					++i;
				}
			}
			//--i;
			console.log( inStr+" => "+base10ToBinaryString(code,bits) );
			str2 = str2 + base10ToBinaryString(code,bits);
		}
		document.write(str2+" = "+str2.length);
		document.write("<br />");
		


		//DECODE HUFFMAN ... 
		//- how much data needs to be sent along with HC?
		//- tree structure | lookup table
		//alert(table);
	}
	function recursiveDescent(node,code,table){
		//alert(node.children.length);
		if(node.children.length==0){
			node.data.code = code;
			table[node.data.index] = node.data.code;
			//alert("CODE:"+node.data.index+" = "+node.data.code);
			return;
		}
		recursiveDescent(node.children[0],code+"0",table);
		recursiveDescent(node.children[1],code+"1",table);
	}
	function howToSortNodes(a,b){
		return a.data.count<b.data.count;
	}
	// ----------------
	function base10ToBinaryString(number,bitsMax){
		var str="", digit=1, isOdd, i;
		var sign = 0;
		if(number<0){
			sign = 1;
			number = -number;
		}
		while(number>0){
			isOdd = number % 2;
			str = ""+isOdd+str;
			digit <<= 1;
			number >>= 1;
		}
		if(str.length>bitsMax){
			return str.substr(str.length-bitsMax,bitsMax);
		}
		for(i=str.length;i<bitsMax;++i){
			str = "0"+str;
		}
		if(sign>0&&bitsMax==32){
			str = "1"+str.substr(1,str.length-1);
		}
		return str;
	}
	*/
}
