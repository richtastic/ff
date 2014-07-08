// YAML.js
// documental
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
YAML.NULL="null";
YAML.REFERENCE_SUFFIX="ref";
// functional
YAML.STACK_UNKNOWN=0;
YAML.STACK_OBJECT=1;
YAML.STACK_ARRAY=2;

function YAML(){
	this._lines = new Array();
	this._lineNumber = 0;
	this._indent = 0;
	this._stack = new Array();
	this._documents = new Array();
	this._references = new Object(); // [name] = {ref:object , table:[[obj,key],..]}
	this._refCount = 0; // writing
}
YAML.parse = function(inputString){
	return new YAML().parse(inputString);
}
YAML.prototype.parse = function(inputString){
	return this._parse(inputString);
}
// YAML.prototype.clear = function(){
// 	Code.emptyArray(this._lines);
// 	Code.emptyArray(this._stack);
// 	Code.emptyArray(this._documents);
// 	this._lineNumber = 0;
// 	this._indent = 0;
// 	this._refCount = 0;
// }
// -------------------------------------------------------------------------------------------------- REFERENCE TABLE
YAML.prototype._addRefenceTableReference = function(referenceName,object,key){
	if(this._references[referenceName]===undefined){
		this._references[referenceName] = {ref:object, list:[]};
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
    for(s in referenceTable){
        table = referenceTable[s]; ref = table.ref; list = table.list;
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
YAML.prototype._thisLine = function(){
	if(this._lineNumber<this._lines.length){
		return this._removeComment(this._lines[this._lineNumber]);
	}
	return null;
}
YAML.prototype._nextLine = function(){
	if((this._lineNumber+1)<this._lines.length){
		return this._removeComment(this._lines[this._lineNumber+1]);
	}
	return null;
}
YAML.prototype._gotoNextLine = function(){
	++this._lineNumber;
	var thisLine = this._thisLine();
	while(thisLine!=null && this._removeLeadingAndTrailingWhitespace(thisLine)==""){ // ignore empty lines
		++this._lineNumber;
		thisLine = this._thisLine();
	}
}
YAML.prototype._parse = function(inputString){
	this._documents = new Array();
	this._references = new Object();
	this._lines = inputString.split(YAML.NEWLINE);
	this._lineNumber = 0;
	this._indent = 0;
	var doc;
	while(this._thisLine()!=null){
		if( this._removeLeadingAndTrailingWhitespace(this._thisLine())==YAML.IGNORE ){
			break;
		}
		doc = new Object();
		this._documents.push(doc);
		this._parseNextItem(doc,0);
		if(this._thisLine()!=null && this._removeLeadingAndTrailingWhitespace(this._thisLine())==YAML.DOCUMENT_SEPARATOR ){
			this._gotoNextLine();
		}
	}
	this._fillInReferences();
	//console.log(this._references);
	return this._documents;
}
YAML.prototype._countLineIndents = function(str){
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
YAML.prototype._isLineArrayItem = function(str){
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
YAML.prototype._isNextItemArrayItem = function(index){
	index = (index!==undefined)?index:this._lineNumber;
	var i, line;
	for(i = index;i<this._lines.length;++i){
		line = this._removeLeadingAndTrailingWhitespace( this._removeComment(this._lines[i]) );
		if( line!="" ){
			return this._isLineArrayItem(line);
		}
	}
	return false;
}
YAML.prototype._parseNextItem = function(object,indents){
	var i, len, ch, str, key, value, thisLine, isArrayItem, obj, isNextArray, isKVP;
	var thisItemIndentCount, lineIndents;
	var isArrayObject = Code.isArray(object);
	thisLine = this._thisLine();
	if(thisLine!=null){
		thisItemIndentCount = this._countLineIndents(thisLine);
		lineIndents = thisItemIndentCount;
		// base for this object/array
		while(lineIndents>=thisItemIndentCount){
//console.log(this._prefixIndent(lineIndents)+"indents: "+lineIndents);
			thisLine = this._thisLine();
var removed = this._removeLeadingAndTrailingWhitespace(this._thisLine());
if( removed ==YAML.DOCUMENT_SEPARATOR ){
	return object;
}else if(removed==YAML.IGNORE){
	return object;
}
			lineIndents = this._countLineIndents(thisLine);
			isArrayItem = this._isLineArrayItem(thisLine);
			thisLine =  this._removeLeadingAndTrailingWhitespace( thisLine );
			if(isArrayItem){ // - ...
				thisLine = thisLine.substring(1,thisLine.length);
				thisLine =  this._removeLeadingAndTrailingWhitespace( thisLine );
			}else{ // ...
				// 
			}
			i = thisLine.indexOf(YAML.SEPARATOR);
			if(i>0){
				key = thisLine.substring(0,i);
				value = thisLine.substring(i+1,thisLine.length);
				isKVP = true;
			}else{
				key = "";
				value = thisLine;
				isKVP = false;
			}
			key = this._removeLeadingAndTrailingWhitespace(key);
			value = this._removeLeadingAndTrailingWhitespace(value);
this._gotoNextLine();
			if(key==""&&value==""){
				if(isArrayItem){ // pushing on a new object/array
					isNextArray = this._isNextItemArrayItem();
					if(isNextArray){
						obj = new Array();
					}else{
						obj = new Object();
					}
					if(isArrayObject){
						object.push(obj);
						this._parseNextItem(obj);
					}else{
						console.log("ERROR - ARRAY ITEM IS LISTED FOR OBJECT PARENT");
					}
				}else{ // empty line got thru (start of document?)
					//console.log("? '"+thisLine+"'");
				}
			}else{
				var isRefValue = false;
				var isRefDefine = false;
				var referenceName = null;
				if(value.charAt(0)==YAML.REFERENCE_DEFINE){
					referenceName = value.substring(1,value.length);
					isRefDefine = true;
					value = "";
				}else if(value.charAt(0)==YAML.REFERENCE_VALUE){
					referenceName = value.substring(1,value.length);
					isRefValue = true;
					value = "";
				}
				if(value==""){
					if(isArrayObject){
						if(isRefValue){ // reference
							key = object.length;
							this._addRefenceTableReference(referenceName,object,key);
						}else if(isRefDefine){ // defined
							console.log("Can you define an object as an array item?");
						}else{
							value = this._getTerminal(key);
							object.push(value);
						}
					}else{
						isNextArray = this._isNextItemArrayItem();
						if(isNextArray){
							obj = new Array();
						}else{
							obj = new Object();
						}
						if(isRefValue){ // reference
							this._addRefenceTableReference(referenceName,object,key);
						}else{ // define
							object[key] = obj;
							this._addRefenceTableDefinition(referenceName,obj);
							this._parseNextItem(obj);
						}
					}
				}else{ // key=value
					value = this._getTerminal(value);
					if(isArrayItem){
						object.push(value);
					}else{
						object[key] = value;
					}
				}
			}
			// check that next line is still same object
			lineIndents = this._countLineIndents( this._thisLine() );
		}
	}
	return object;
}
YAML.prototype._getTerminal = function(value){
    if(value=="true" || value=="false"){ // boolean
        if(value=="true"){ value=true; }else{ value=false; }
    }else if(value==YAML.NULL){
    	return null;
    }else if( !isNaN(value) ){ // number
        if( value.indexOf(".")>=0  ){ // floating point
            value = parseFloat(value);
        }else{ // integer
            value = parseInt(value);
        }
    }else if(value.length>1 && value.charAt(0)=='"' && value.charAt(value.length-1)=='"' ){ // explicit string
        value = value.substr(1,value.length-2);
        value = this._cleanUpString(value);
    }else{
        value = this._cleanUpString(value);
    }
    return value;
}
// -------------------------------------------------------------------------------------------------- HELPERS READ
YAML.prototype._cleanUpString = function(str){
    return str.replace(/\\n/g,"\n");
}
YAML.prototype._removeLeadingAndTrailingWhitespace = function(str){
    return this._removeTrailingWhitespace( this._removeLeadingWhitespace(str) );
}
YAML.prototype._removeLeadingWhitespace = function(str){
    return str.replace(/^[ \t]+/,"");
}
YAML.prototype._removeTrailingWhitespace = function(str){
    return str.replace(/[ \t]+$/,"");
}
YAML.prototype._removeComment = function(str){
    return str.replace(/#.*/g,"");
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
YAML.prototype.writeString = function(name,value){
	if(value===undefined){ value = name; name = null; }
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
		value = value.replace(/\n/g,"\\n");
		if(this._stackIsArray()){
			this._lines[this._lineNumber++] = this._prefixIndent()+YAML.ARRAY_SEPARATOR+YAML.SPACE+'"'+value+'"';
		}else{
			this._lines[this._lineNumber++] = this._prefixIndent()+name+YAML.SEPARATOR+YAML.SPACE+'"'+value+'"';
		}
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
YAML.prototype.writeArrayStart = function(name){
	this._lines[this._lineNumber++] = this._prefixIndent()+name+YAML.SEPARATOR;
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


