// YAML.js
// documental
YAML.DECLARATION="%";
YAML.COMMENT="#";
YAML.SEPARATOR=":";
YAML.INDENT="\t";
YAML.SPACE=" ";
YAML.STRING_MULTILINE=">";
YAML.REFERENCE_DEFINE="&";
YAML.REFERENCE_VALUE="*";
YAML.ARRAY_SEPARATOR="-";
YAML.DOCUMENT_SEPARATOR="---";
YAML.IGNORE="...";
YAML.NEWLINE="\n";
YAML.STRING_QUOTE="\"";
YAML.NULL="null";
YAML.TRUE="true";
YAML.FALSE="false";
YAML.REFERENCE_SUFFIX="ref";
// functional
YAML.STACK_UNKNOWN=0;
YAML.STACK_OBJECT=1;
YAML.STACK_ARRAY=2;

function YAML(inputString){
	this._lines = new Array();
	this._lineNumber = 0;
	this._indent = 0;
	this._stack = new Array();
	this._documents = new Array();
	this._references = new Object(); // [name] = {ref:object , table:[[obj,key],..]}
	this._refCount = 0; // writing
	// if(inputString!==undefined){
	// 	this.parse(inputString);
	// }
}
YAML.parse = function(inputString){
	return new YAML().parse(inputString);
}
YAML.prototype.parse = function(inputString){
	return this._parse(inputString);
}
// -------------------------------------------------------------------------------------------------- REFERENCE TABLE
YAML.prototype._addRefenceTableReference = function(referenceName,object,key){
	if(this._references[referenceName]===undefined){
		this._references[referenceName] = {ref:null, list:[]};
	}
	this._references[referenceName].list.push([object,key]);
}
YAML.prototype._addRefenceTableDefinition = function(referenceName,object){
	if(this._references[referenceName]===undefined){
		this._references[referenceName] = {ref:object, list:[]};
	}else{
		this._references[referenceName].ref = object;
	}
}
YAML.prototype._fillInReferences = function(){
	var s, obj, arr, key, ref, table, referenceTable = this._references;
	var unfound = [];
    for(s in referenceTable){
        table = referenceTable[s]; ref = table.ref; list = table.list;
        if(ref==null){
        	unfound.push(s);
        }
        while(list.length>0){
            arr = list.pop(); obj = arr[0]; key = arr[1];
            obj[key] = ref;
            delete arr[0];
            delete arr[1];
        }
        table.ref = null; table.list = null;
        referenceTable[s] = null;
        delete referenceTable[s];
    }
    if(unfound.length>0){
    	console.log("found "+unfound.length+" undefined references");
    }
}
// writing oriented
YAML.prototype.newRefenceObject = function(referenceName,object){
	this._addRefenceTableDefinition(referenceName,object);
}
YAML.prototype._newReferenceHash = function(){
	return YAML.REFERENCE_SUFFIX+""+(this._refCount++);
}
YAML.prototype._lookupReferenceFromObject = function(object){
	var s, referenceTable = this._references;
    for(s in referenceTable){
    	if(referenceTable[s].ref==object){
    		return s
    	}
    } // doesn't exist, create it
    s = this._newReferenceHash();
    this._addRefenceTableDefinition(s,object);
	return s;
}


// -------------------------------------------------------------------------------------------------- ------------------------ READING
// YAML.prototype._thisLine = function(){
// 	if(this._lineNumber<this._lines.length){
// 		return YAML._removeComment(this._lines[this._lineNumber]);
// 	}
// 	return null;
// }
// YAML.prototype._nextLine = function(){
// 	if((this._lineNumber+1)<this._lines.length){
// 		return YAML._removeComment(this._lines[this._lineNumber+1]);
// 	}
// 	return null;
// }
// YAML.prototype._gotoNextLine = function(){
// 	++this._lineNumber;
// 	var thisLine = this._thisLine();
// 	while(thisLine!=null && YAML._removeLeadingAndTrailingWhitespace(thisLine)==""){ // ignore empty lines
// 		++this._lineNumber;
// 		thisLine = this._thisLine();
// 	}
// }
// YAML.prototype._parse = function(inputString){
// 	this._documents = new Array();
// 	this._references = new Object();
// 	this._lines = inputString.split(YAML.NEWLINE);
// 	this._lineNumber = 0;
// 	this._indent = 0;
// 	var doc;
// 	var iteration = 0;
// 	while(this._thisLine()!=null){
// 		var line = this._thisLine();
// 		// console.log("line "+iteration+" :"+line);
// 		if( YAML._removeLeadingAndTrailingWhitespace(line)==YAML.IGNORE ){
// 			break;
// 		}
// 		doc = new Object();
// 		this._documents.push(doc);
// 		this._parseNextItem(doc,0);
// 		var line = this._thisLine();
// 		if(line!=null && YAML._removeLeadingAndTrailingWhitespace(line)==YAML.DOCUMENT_SEPARATOR ){
// 			this._gotoNextLine();
// 		}
// 		++iteration;
// 	}
// 	this._fillInReferences();
// 	return this._documents;
// }
// YAML.prototype._isNextItemArrayItem = function(index){
// 	index = (index!==undefined)?index:this._lineNumber;
// 	var i, line;
// 	for(i = index;i<this._lines.length;++i){
// 		line = YAML._removeLeadingAndTrailingWhitespace( YAML._removeComment(this._lines[i]) );
// 		if( line!="" ){
// 			return this._isLineArrayItem(line);
// 		}
// 	}
// 	return false;
// }
// YAML.prototype._parseNextItem = function(object,indents){
// 	var i, len, ch, str, key, value, thisLine, isArrayItem, obj, isNextArray, isKVP;
// 	var thisItemIndentCount, lineIndents;
// 	var isArrayObject = Code.isArray(object);
// 	thisLine = this._thisLine();
// console.log("_parseNextItem --- "+thisLine);
// 	if(thisLine!=null){
// 		thisItemIndentCount = YAML._countLineIndents(thisLine);
// 		lineIndents = thisItemIndentCount;
// 		// base for this object/array
// 		while(lineIndents>=thisItemIndentCount){
// //console.log(this._prefixIndent(lineIndents)+"indents: "+lineIndents);
// 			thisLine = this._thisLine();
// var removed = this._removeLeadingAndTrailingWhitespace(this._thisLine());
// if( removed == YAML.DOCUMENT_SEPARATOR ){
// 	return object;
// }else if(removed==YAML.IGNORE){
// 	return object;
// }
// 			lineIndents = this._countLineIndents(thisLine);
// 			isArrayItem = this._isLineArrayItem(thisLine);
// 			thisLine =  this._removeLeadingAndTrailingWhitespace( thisLine );
// 			if(isArrayItem){ // - ...
// 				thisLine = thisLine.substring(1,thisLine.length);
// 				thisLine =  this._removeLeadingAndTrailingWhitespace( thisLine );
// 			}else{ // ...
// 				//
// 			}
// 			i = thisLine.indexOf(YAML.SEPARATOR);
// 			if(i>0){
// 				key = thisLine.substring(0,i);
// 				value = thisLine.substring(i+1,thisLine.length);
// 				isKVP = true;
// 			}else{
// 				key = "";
// 				value = thisLine;
// 				isKVP = false;
// 			}
// 			key = this._removeLeadingAndTrailingWhitespace(key);
// 			value = this._removeLeadingAndTrailingWhitespace(value);
// this._gotoNextLine();
// 			if(key==""&&value==""){
// 				if(isArrayItem){ // pushing on a new object/array
// 					isNextArray = this._isNextItemArrayItem();
// 					if(isNextArray){
// 						obj = new Array();
// 					}else{
// 						obj = new Object();
// 					}
// 					if(isArrayObject){
// 						object.push(obj);
// 						this._parseNextItem(obj);
// 					}else{
// 						console.log("ERROR - ARRAY ITEM IS LISTED FOR OBJECT PARENT");
// 					}
// 				}else{ // empty line got thru (start of document?)
// 					//console.log("? '"+thisLine+"'");
// 				}
// 			}else{
// 				var isRefValue = false;
// 				var isRefDefine = false;
// 				var referenceName = null;
// 				if(value.charAt(0)==YAML.REFERENCE_DEFINE){
// 					referenceName = value.substring(1,value.length);
// 					isRefDefine = true;
// 					value = "";
// 				}else if(value.charAt(0)==YAML.REFERENCE_VALUE){
// 					referenceName = value.substring(1,value.length);
// 					isRefValue = true;
// 					value = "";
// 				}
// 				if(value==""){
// 					if(isArrayObject){
// 						if(isRefValue){ // reference
// 							key = object.length;
// 							this._addRefenceTableReference(referenceName,object,key);
// 						}else if(isRefDefine){ // defined
// 							console.log("Can you define an object as an array item?");
// 						}else{
// 							value = this._getTerminal(key);
// 							object.push(value);
// 						}
// 					}else{
// 						isNextArray = this._isNextItemArrayItem();
// 						if(isNextArray){
// 							obj = new Array();
// 						}else{
// 							obj = new Object();
// 						}
// 						if(isRefValue){ // reference
// 							this._addRefenceTableReference(referenceName,object,key);
// 						}else{ // define
// 							object[key] = obj;
// 							this._addRefenceTableDefinition(referenceName,obj);
// 							this._parseNextItem(obj);
// 						}
// 					}
// 				}else{ // key=value
// 					value = this._getTerminal(value);
// 					if(isArrayItem){
// 						object.push(value);
// 					}else{
// 						object[key] = value;
// 					}
// 				}
// 			}
// 			// check that next line is still same object
// 			lineIndents = this._countLineIndents( this._thisLine() );
// 		}
// 	}
// 	return object;
// }
// YAML.prototype._getTerminal = function(value){
//     if(value=="true" || value=="false"){ // boolean
//         if(value=="true"){ value=true; }else{ value=false; }
//     }else if(value==YAML.NULL){
//     	return null;
//     }else if( !isNaN(value) ){ // number
//         if( value.indexOf(".")>=0  ){ // floating point
//             value = parseFloat(value);
//         }else{ // integer
//             value = parseInt(value);
//         }
//     }else if(value.length>1 && value.charAt(0)=='"' && value.charAt(value.length-1)=='"' ){ // explicit string
//         value = value.substr(1,value.length-2);
//         value = this._cleanUpString(value);
//     }else{
//         value = this._cleanUpString(value);
//     }
//     return value;
// }



// -------------------------------------------------------------------------------------------------------------------------- READING

YAML.prototype.parse2 = function(inputString){
	this._documents = new Array();
	this._references = new Object();
	this._lines = inputString.split(YAML.NEWLINE);
	this._lineNumber = 0;
	this._indent = 0;
	// go to first non-empty line
	this._gotoNextLine(false);
	this._createNextDoc();
	var keep = true;
	// var maxCount = 10000;
	while(keep){ // iterate thru lines / objects
		keep = this._parseNext();
		// --maxCount;
		// if(maxCount<0){
		// 	break;
		// }
	}
	this._fillInReferences();
	return this._documents;
}
YAML.prototype._createNextDoc = function(auto){
	var doc = new Object();
	this._documents.push(doc);
	this._stack = [[doc,-1]];
	return doc;
}
YAML.prototype._nextLineIndex = function(index){
	var keep = true;
	var lines = this._lines;
	var maxIndex = lines.length;
	while(index<maxIndex){
		var line = lines[index];
		var clean = line;
			clean = YAML._removeComment(clean);
			clean = YAML._removeLeadingAndTrailingWhitespace(clean);
		if(clean===""){
			++index;
			continue;
		}
		break;
	}
	if(index>=maxIndex){
		return null;
	}
	return index;
}
YAML.prototype._gotoNextLine = function(auto){
	auto = Code.valueOrDefault(auto, true);
	if(auto){
		++this._lineNumber;
	}
	var nextLine = this._nextLineIndex(this._lineNumber);
	// console.log("nextLine: "+nextLine);
	this._lineNumber = nextLine;
}
YAML.prototype._getNextLine = function(){ // look-ahead
	var nextLine = this._nextLineIndex(this._lineNumber+1);
	nextLine = this._lines[nextLine];
	nextLine = YAML._removeComment(nextLine);
	return nextLine;
}
YAML.prototype._getNextLineObject = function(lineIndentCount){ // need to look at next line to see if: empty, object, array
	var nextLine = this._getNextLine();
	var nextIndentCount = YAML._countLineIndents(nextLine);
	var subContainer = null;
	if(nextIndentCount>lineIndentCount){ // else null item
		var isArray = YAML._isLineArrayItem(nextLine);
		if(isArray){
			subContainer = [];
		}else{
			subContainer = {};
		}
		this._stack.push( [subContainer, lineIndentCount] );
	}
	return subContainer;
}

YAML.prototype._parseNext = function(){
	// reached end of content
	if(this._lineNumber===null){
		return false;
	}
	// get status from stack
	var top = this._stack[this._stack.length-1];
	var container = top[0];
	var containerIndents = top[1];
	// get next line data
	var line = this._line(0);
	var clean = YAML._removeLeadingAndTrailingWhitespace(line);
	// explicit end
	if(clean==YAML.DOCUMENT_SEPARATOR){ // of document
		this._createNextDoc();
		this._gotoNextLine();
		return true;
	}else if(clean==YAML.IGNORE){ // of content
		return false;
	}
	var lineIndentCount = YAML._countLineIndents(line);
	// done with item if without indentation
	if(lineIndentCount<=containerIndents){
		this._stack.pop();
		return true;

	}
	// check for content
	var isArrayItem = YAML._isLineArrayItem(clean);
	if(isArrayItem){
		if(!Code.isArray(container)){
			console.log(container);
			console.log("? '"+clean+"'");
			throw "found array item on non array object?";
		}
		var val = clean;
		val = val.substring(1,val.length);
		val = YAML._removeLeadingAndTrailingWhitespace(val);
		if(val===YAML.STRING_MULTILINE){
			throw "multiline handle B";
		}
		val = this._checkAddReferenceValue(container,container.length,val);
		if(val===""){
			var subContainer = this._getNextLineObject(lineIndentCount);
			container.push(subContainer);
		}else{
			val = this._checkSubstituteValue(val);
			container.push(val);
		}
		this._gotoNextLine();
		return true;
	}
	var separatorIndex = clean.indexOf(YAML.SEPARATOR);
	var key = null;
	var val = null;
	if(separatorIndex>0){ // object
		key = clean.substring(0,separatorIndex);
		val = clean.substring(separatorIndex+1,clean.length);
		key = YAML._removeLeadingAndTrailingWhitespace(key);
		val = YAML._removeLeadingAndTrailingWhitespace(val);
		if(key===""){
			console.log(container);
			console.log(clean);
			throw "no key?";
		}
		if(val===YAML.STRING_MULTILINE){
			throw "multiline handle A";
		}
		val = this._checkAddReferenceValue(container,key,val);
		if(val===""){
			var subContainer = this._getNextLineObject(lineIndentCount);
			container[key] = subContainer;
		}else{
			if(!Code.isObject(container)){
				console.log(container);
				console.log(clean);
				console.log(key,val);
				throw "found object on non object"
			}
			val = this._checkSubstituteValue(val);
			container[key] = val;
		}
		this._gotoNextLine();
		return true;
	}
	throw "unhandled line";
}
YAML.prototype._line = function(offset){
	offset = offset!==undefined ? offset : 0;
	var index = this._lineNumber + offset;
	if(index>this._lines.length){
		return null;
	}
	return YAML._removeComment(this._lines[index]);
}

YAML.prototype._checkAddReferenceValue = function(object,key,value){
	if(value!==null || value!==""){
		if(value.charAt(0)==YAML.REFERENCE_DEFINE){
			referenceName = value.substring(1,value.length);
			this._addRefenceTableDefinition(referenceName,object,key);
			return "";
		}else if(value.charAt(0)==YAML.REFERENCE_VALUE){
			referenceName = value.substring(1,value.length);
			this._addRefenceTableReference(referenceName,object,key);
			return "";
		}
	}
	return value;
}
YAML.prototype._checkSubstituteValue = function(value){
	if(value==YAML.TRUE){
		value = true;
	}else if(value==YAML.FALSE){
		value = false;
	}else if(value===YAML.NULL){
		value = null;
	}else if(value.length>1 && value.charAt(0)==YAML.STRING_QUOTE && value.charAt(value.length-1)==YAML.STRING_QUOTE){
		value = value.substring(1,value.length-1);
		value = YAML._cleanUpString(value);
	}else if( !Code.isNaN(value) ){ // number
        if( value.indexOf(".")>=0 ){ // floating point
            value = parseFloat(value);
        }else{ // integer
            value = parseInt(value);
        }
	}else{
		value = YAML._cleanUpString(value);
	}
	return value;
}



// -------------------------------------------------------------------------------------------------- HELPERS READ
YAML._cleanUpString = function(str){
    return str.replace(/\\n/g,"\n");
}
YAML._removeLeadingAndTrailingWhitespace = function(str){
    return YAML._removeTrailingWhitespace( YAML._removeLeadingWhitespace(str) );
}
YAML._removeLeadingWhitespace = function(str){
    return str.replace(/^[ \t]+/,"");
}
YAML._removeTrailingWhitespace = function(str){
    return str.replace(/[ \t]+$/,"");
}
YAML._removeComment = function(str){
	return str.replace(/(%|#).*/g,"");
    // return str.replace(/#.*/g,"");
}
YAML._countLineIndents = function(str){
	if(str==null){return -1;}
	var i, ch, count=0, len=str.length;
	for(i=0;i<len;++i){
		ch = str.charAt(i);
		if(ch==YAML.INDENT){ // white space
			++count;
		}
	}
	return count;
}
YAML._isLineArrayItem = function(str){
	var i, ch, len=str.length;
	for(i=0;i<len;++i){
		ch = str.charAt(i);
		if(ch==YAML.INDENT){ // white space
			//
		}else if(ch==YAML.ARRAY_SEPARATOR){ // array item
			return true;
		}else{ // other
			return false;
		}
	}
	return false;
}
// -------------------------------------------------------------------------------------------------- HELPERS WRITE
YAML.prototype._stackIsObject = function(){
	return this._stack[this._stack.length-1] == YAML.STACK_OBJECT;
}
YAML.prototype._stackIsArray = function(){
	return this._stack[this._stack.length-1] == YAML.STACK_ARRAY;
}
YAML.prototype._prefixIndent = function(count){
	var i = (count!==undefined)?count:this._indent;
	var str = "";
	for(;i--;){
		str += YAML.INDENT;
	}
	return str;
}
// -------------------------------------------------------------------------------------------------- ------------------------ WRITING
YAML.prototype.startWrite = function(){
	this._lines = new Array();
	this._stack = new Array();
	this._references = new Array();
	this._refCount = 0;
	this._stack.push(YAML.STACK_OBJECT);
	this._indent = 0;
}
// -------------------------------------------------------------------------------------------------- DOCUMENTORIAL
YAML.prototype.separateDocument = function(){
	this._lines[this._lineNumber++] = YAML.DOCUMENT_SEPARATOR;
}
YAML.prototype.writeDocument = function(){
	this.separateDocument();
}
YAML.prototype.writeBlank = function(){
	this._lines[this._lineNumber++] = "";
}
YAML.prototype.writeIgnore = function(){
	this._lines[this._lineNumber++] = YAML.IGNORE;
}
YAML.prototype.writeComment = function(comment){
	this._lines[this._lineNumber++] = this._prefixIndent()+YAML.COMMENT+" "+comment;
}
// -------------------------------------------------------------------------------------------------- PRIMITIVES
YAML.prototype.writeNull = function(name){
	if(this._stackIsArray()){
		this._lines[this._lineNumber++] = this._prefixIndent()+YAML.ARRAY_SEPARATOR+YAML.SPACE+YAML.NULL;
	}else{
		this._lines[this._lineNumber++] = this._prefixIndent()+name+YAML.SEPARATOR+YAML.SPACE+YAML.NULL;
	}
}
YAML.prototype.writeBoolean = function(name,value){
	if(value===undefined){ value = name; name = null; }
	if(this._stackIsArray()){
		this._lines[this._lineNumber++] = this._prefixIndent()+YAML.ARRAY_SEPARATOR+YAML.SPACE+(value===true);
	}else{
		this._lines[this._lineNumber++] = this._prefixIndent()+name+YAML.SEPARATOR+YAML.SPACE+(value===true);
	}
}
YAML.prototype.writeNumber = function(name,value){
	if(value===undefined){ value = name; name = null; }
	if(this._stackIsArray()){
		this._lines[this._lineNumber++] = this._prefixIndent()+YAML.ARRAY_SEPARATOR+YAML.SPACE+value;
	}else{
		this._lines[this._lineNumber++] = this._prefixIndent()+name+YAML.SEPARATOR+YAML.SPACE+value;
	}
}
YAML.prototype.writeString = function(name,value){ // if intending to write null string, this messes up
	if(value===undefined){ value = name; name = null; }
	// if(name==null){
	// 	return;
	// }
	// if it starts or ends with a space, quote, doublequote ... needs to be enclosed in double quotes
	if(false){//value.indexOf('\n')>=0){ // multiline string
		arr = value.split('\n');
		console.log(arr);
		if(this._stackIsArray()){
			this._lines[this._lineNumber++] = this._prefixIndent()+YAML.ARRAY_SEPARATOR+YAML.INDENT+arr[0];
		}else{
			this._lines[this._lineNumber++] = this._prefixIndent()+name+YAML.SEPARATOR+YAML.INDENT+arr[0];
		}
		this._indent++;
		for(var i=1;i<arr.length; ++i){
			this._lines[this._lineNumber++] = this._prefixIndent()+YAML.INDENT+arr[i];
		}
		this._indent--;
	}else{
		//value = value.replace(/\\n/g,"\\\\n")
		if(value){
			value = value+""; // force to a string in case
			value = value.replace(/\n/g,"\\n");
			value = '"'+value+'"';
		}else{
			value = null;
		}
		if(this._stackIsArray()){
			this._lines[this._lineNumber++] = this._prefixIndent()+YAML.ARRAY_SEPARATOR+YAML.SPACE+value;
		}else{
			if(name==null){ // this is do to some bug / bad usage
				name = value;
				value = null;
			}
			this._lines[this._lineNumber++] = this._prefixIndent()+name+YAML.SEPARATOR+YAML.SPACE+value;
		}
	}
}
YAML.prototype.writeArrayLiteral = function(name,value){
	if(value===undefined){
		value = name;
		name = null;
	}
	this.writeArrayStart(name);
	for(var i=0; i<value.length; ++i){
		this._writeUnknownLiteral(value[i],undefined, true);
	}
	this.writeArrayEnd();
}
YAML.prototype.writeObjectLiteral = function(name,value){
	if(value!==undefined && value!==null){ // has name
		this.writeObjectStart(name);
			this.writeObjectLiteral(value);
		this.writeObjectEnd();
	}else{ // already at write location
		value = name;
		var keys = Code.keys(value);
		for(var i=0; i<keys.length; ++i){
			var key = keys[i];
			var val = value[key];
			this._writeUnknownLiteral(key,val);
		}
	}
}
YAML.prototype._writeUnknownLiteral = function(key,val, startObject){
	if(val===undefined){
		val = key;
		key = null;
	}
	if(Code.isObject(val)){
		if(key){
			this.writeObjectLiteral(key,val);
		}else{
			if(startObject){ // from array needs indent
				this.writeObjectStart();
					this.writeObjectLiteral(val);
				this.writeObjectEnd();
			}else{
				this.writeObjectLiteral(val);
			}
		}
	}else if(Code.isArray(val)){
		this.writeArrayLiteral(key,val);
	}else if(Code.isString(val)){
		if(key){
			this.writeString(key,val);
		}else{
			this.writeString(val);
		}
	}else if(Code.isNumber(val)){
		if(key){
			this.writeNumber(key,val);
		}else{
			this.writeNumber(val);
		}
	}else if(Code.isBoolean(val)){
		if(key){
			this.writeBoolean(key,val);
		}else{
			this.writeBoolean(val);
		}
	}else if(Code.isNull(val)){
		if(key){
			this.writeNull(key);
		}else{
			this.writeNull();
		}
	}else if(Code.isInstance(val) && Code.isFunction(val.toObject)){
		var obj = val.toObject();
		if(key){
			this.writeObjectLiteral(key,obj);
		}else{
			if(startObject){ // from array needs indent
				this.writeObjectStart();
					this.writeObjectLiteral(obj);
				this.writeObjectEnd();
			}else{
				this.writeObjectLiteral(obj);
			}
		}
	}else{
		console.log("ignoring: "+key);
		console.log(val);
		throw "?";
	}
}

// -------------------------------------------------------------------------------------------------- OBJECT
YAML.prototype.writeObjectReference = function(name, refHash){
	if( !Code.isString(refHash) ){
		refHash = this._lookupReferenceFromObject(refHash);
	}
	if(this._stackIsArray()){
		this._lines[this._lineNumber++] = this._prefixIndent()+YAML.ARRAY_SEPARATOR+YAML.SPACE+YAML.REFERENCE_VALUE+refHash;
	}else{
		this._lines[this._lineNumber++] = this._prefixIndent()+name+YAML.SEPARATOR+YAML.SPACE+YAML.REFERENCE_VALUE+refHash;
	}
}
YAML.prototype.writeObjectStart = function(name, refHash){
	if(refHash!==undefined && !Code.isString(refHash) ){
		refHash = this._lookupReferenceFromObject(refHash);
	}
	if(this._stackIsArray()){
		if(refHash!==undefined){
			this._lines[this._lineNumber++] = this._prefixIndent()+YAML.ARRAY_SEPARATOR+((refHash!==undefined)?(YAML.SPACE+YAML.REFERENCE_DEFINE+refHash):"")
		}else{
			this._lines[this._lineNumber++] = this._prefixIndent()+YAML.ARRAY_SEPARATOR;
		}
		//this._lines[this._lineNumber++] = this._prefixIndent()+((refHash!==undefined)?(YAML.SPACE+YAML.REFERENCE_DEFINE+refHash):"");
	}else{
		this._lines[this._lineNumber++] = this._prefixIndent()+name+YAML.SEPARATOR+((refHash!==undefined)?(YAML.SPACE+YAML.REFERENCE_DEFINE+refHash):"");
	}
	this._stack.push(YAML.STACK_OBJECT);
	this._indent++;
}
YAML.prototype.writeObjectEnd = function(name){
	this._indent--;
	this._stack.pop();
	// if(this._stackIsArray()){
	// 	this._indent--;
	// }
}

// -------------------------------------------------------------------------------------------------- ARRAY
YAML.prototype.writeArrayNumbers = function(name, array){
	this.writeArrayStart(name);
	for(var i=0; i<array.length; ++i){
		this.writeNumber(array[i]);
	}
	this.writeArrayEnd();
}
YAML.prototype.writeArrayStrings = function(name, array){
	this.writeArrayStart(name);
	for(var i=0; i<array.length; ++i){
		this.writeString(array[i]);
	}
	this.writeArrayEnd();
}
YAML.prototype.writeArrayStart = function(name){
	if(name!==undefined && name!==null){
		this._lines[this._lineNumber++] = this._prefixIndent()+name+YAML.SEPARATOR;
	}else{ // no name, start of something
		this._lines[this._lineNumber++] = this._prefixIndent()+YAML.ARRAY_SEPARATOR;
	}
	this._stack.push(YAML.STACK_ARRAY);
	this._indent++;
}
YAML.prototype.writeArrayEnd = function(name){
	this._indent--;
	this._stack.pop();
}

YAML.prototype.writeReferenceObject = function(name,object){
	//
}
YAML.prototype.writeReferenceString = function(name,object){
	//
}









YAML.prototype.toString = function(){
	var str = "";
	for(var i=0;i<this._lines.length;++i){
		str = str+this._lines[i]+"\n";
	}
	return str;
}






