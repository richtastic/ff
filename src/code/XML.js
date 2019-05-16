// XML.js
XML.INDENT='\t';
XML.SPACE='';
XML.SYMBOL_START='<';
XML.SYMBOL_END='>';
XML.SYMBOL_END_PREFIX='/';
XML.SYMBOL_SPECIAL_PREFIX_Q='?';
XML.SYMBOL_SPECIAL_PREFIX_E='!';
XML.SYMBOL_QUOTE='"';
XML.SYMBOL_ASSIGN='=';
XML.ELEMENT_TYPE_REGULAR=0;
XML.ELEMENT_TYPE_XML=1;
XML.ELEMENT_TYPE_HTML=2;

// TODO: LOOPING - NOT STACK CALLS

// TODO: CDATA -- 'value' eith escapable content
// <![CDATA[ and ]]>
// TODO: escaping / subbing:
/*
&lt; <
&gt; >
&amp; &
&apos; '
&quot; "

*/
// TODO: COMMENTS: <!-- items -->

function XML(){ // creating xml structure
	this._root = new XML.Element();
	this._currentParent = this._root;
	this._currentElement = null;
}
XML.root = function(){
	return this._root;
}
XML.parse = function(inputString){
	var xml = new XML(inputString);
	var obj = xml.toObject();
	return obj;
}
XML.prototype.parse = function(inputString){
	return this._parse(inputString);
}
XML.escapeValues = function(value){
	value = value.replace(new RegExp("\"","g"),"\\\"");
	return value;
}
XML.unescapeValues = function(value){
	//value = value.replace(new RegExp('\\"',"g"),'"');
	value = value.replace(/\\"/g, '"');
	return value;
}
// -------------------------------------------------------------------------------------------------- ELEMENT
XML.Element = function(name, parent, type){
	this._name = name;
	this._parent = parent!==undefined ? parent : null;
	this._value = null;
	this._properties = {};
	this._children = [];
	this._type = XML.ELEMENT_TYPE_REGULAR;
	if(type!==undefined){
		this._type = type;
	}
}
XML.Element.prototype.name = function(){
	return this._name;
}
XML.Element.prototype.lastChildOrSelf = function(){
	if(this._children.length>0){
		return this._children[this._children.length-1];
	}
	return this;
}
XML.Element.prototype.parent = function(){
	return this._parent;
}
XML.Element.prototype.addChild = function(child){
	return this._children.push(child);
}
XML.Element.prototype.children = function(tag){
	if(tag!==undefined){ // matching tag
		var elements = [];
		var children = this._children;
		for(var i=0; i<children.length; ++i){
			var child = children[i];
			if(child.name()==tag){
				elements.push(child);
			}
		}
		return elements;
	}
	return this._children;
}
XML.Element.prototype.setAttribute = function(key,val){
	this._properties[key] = val;
}
XML.Element.prototype.setValue = function(val){
	this._value = val;
}
XML.Element.prototype.value = function(){
	return this._value;
}
XML.Element.prototype.appendToString = function(str, indent){
	indent = indent!==undefined ? indent : "";
	var isRoot = this._name == null;
	var nextIndent = indent + XML.INDENT;
	var children = this.children();
	var isEmpty = !this._value && !isRoot && children.length==0;
	if(!isRoot){
		var element = this._name;
		var nodePrefix = "<";
		var nodeSuffix = ">";
		if(this._type==XML.ELEMENT_TYPE_XML){
			nodePrefix = "<?";
			nodeSuffix = "?>";
		}
		str += indent+nodePrefix+element+"";
		var props = this._properties;
		var keys = Code.keys(props);
		if(keys.length>0){
			for(var i=0; i<keys.length; ++i){
				var key = keys[i];
				var val = props[key];
				str += ' '+key+'="'+XML.escapeValues(val)+'"';
			}
		}
		// empy
		if(isEmpty){
			if(this._type==XML.ELEMENT_TYPE_XML){
				str += nodeSuffix;
			}else{
				str += "/>";
			}
		}else{
			str += ">";
		}
	}

	if(!isRoot){
		// str += "\n";
	}
	var interriorIndent = indent;
	if(children.length>0){
		if(!isRoot){
			str += "\n";
		}
		for(var i=0; i<children.length; ++i){
			var child = children[i];
			str = child.appendToString(str, nextIndent);
			str += "\n";
		}
	}else{
		interriorIndent = "";
		if(this._value){
			interriorIndent = this._value;
		}
	}
	if(!isRoot && !isEmpty){
		// str += "\n";
		str += interriorIndent+"<"+"/"+element+">";
	}
	return str;
}
XML.Element.prototype.appendToObject = function(obj){
	throw "?"
	var children = this.children();
	for(var i=0; i<children.length; ++i){
		var child = children[i];
		child.appendToObject(obj);
	}
}
// -------------------------------------------------------------------------------------------------- WRITING
XML.prototype.startElement = function(name){
	var parent = this.parentElement();
	var element = new XML.Element(name, parent);
	parent.addChild(element);
	this.currentElement(element);
}
XML.prototype.startChildren = function(){
	var current = this.currentElement();
	if(current){
		this.parentElement(current);
		this.currentElement(null);
	}
}
XML.prototype.endChildren = function(){
	var parent = this.parentElement();
	this.parentElement(parent.parent());
	this.currentElement(parent);
}

XML.prototype.setAttribute = function(key,val){
	this.currentElement().setAttribute(key,val);
}
XML.prototype.setValue = function(val){
	this.currentElement().setValue(val);
}
XML.prototype.currentElement = function(next){
	if(next!==undefined){
		this._currentElement = next;
	}
	return this._currentElement;
}
XML.prototype.parentElement = function(next){
	if(next!==undefined){
		this._currentParent = next;
	}
	return this._currentParent;
}
// -------------------------------------------------------------------------------------------------- READING
XML.prototype._parse = function(inputString){
	if(!inputString){
		return null;
	}
	XML.processElement(this._root,inputString,0);
	return this;
}
XML._nextIndexIgnoreWhiteSpace = function(string,index){
	return XML._nextIndexType(string,index, 0);
}
XML._nextIndexToWhiteSpaceNotSpecial = function(string,index){
	return XML._nextIndexType(string,index, 2);
}

XML._nextIndexToWhiteSpace = function(string,index){
	return XML._nextIndexType(string,index, 1);
}
XML._nextIndexType = function(string,index, type){
	var i = index;
	for(; i<string.length; ++i){
		var char = string.charAt(i);
		var isWhiteSpace = false;
		var isSpecial = false;
		if(char==" " || char=="\t" || char=="\n" || char=="\r"){
			isWhiteSpace = true;
		}else if(char=="<" || char==">" || char=="/"){
			isSpecial = true;
		}
		if(type==0){
			if(isWhiteSpace){
				continue;
			}else{
				break;
			}
		}else if(type==1){
			if(!isWhiteSpace){
				continue;
			}else{
				break;
			}
		}else if(type==2){
			if(isWhiteSpace || isSpecial){
				break;
			}else{
				continue;
			}
		}else{
			throw "TYPE ? "+type;
		}
	}
	return i;
}
var XMLCOUNT = 9999;
XML.processElement = function(currentElement, inputString, currentIndex){
--XMLCOUNT;
if(XMLCOUNT<=0){
	throw "MAX"
}
	var totalLength = inputString.length;
	// console.log("processElement: "+currentIndex+"/"+totalLength);
	var index = currentIndex;
	var char;
	index = XML._nextIndexIgnoreWhiteSpace(inputString,index);
	char = inputString.charAt(index);
	var elementType = XML.ELEMENT_TYPE_REGULAR;
	if(char=="<"){
		// check if ending tag:
		var next = inputString.charAt(index+1);
		var isEnding = false;
		var isSpecialQ = false;
		if(next=="/"){
			isEnding = true;
			index += 1;
		}else if(next=="?"){
			index += 1;
			isSpecialQ = true;
			elementType = XML.ELEMENT_TYPE_XML;
		}else if(next=="!"){
			index += 1;
			throw "HTML?";
		}
		// get tag:
		var startIndex = XML._nextIndexIgnoreWhiteSpace(inputString,index+1);
		var endIndex = XML._nextIndexToWhiteSpaceNotSpecial(inputString,index+1);
		var tag = inputString.substring(startIndex,endIndex);
		// console.log(tag)
		index = endIndex;
		// OLD ELEMENT FINISH
		if(isEnding){
			var name = currentElement.name();
			if(name!==tag){
				throw "name mismatch: "+name+" != "+tag;
			}
			var nextIndex = XML._nextIndexToWhiteSpaceNotSpecial(inputString,index);
			var next = inputString.charAt(nextIndex);
			if(next!=">"){
				throw "expecting end with no content";
			}
			nextIndex += 1;
			XML.processElement(currentElement.parent(), inputString, nextIndex);
			return;
		}
		// NEW ELEMENT
		var element = new XML.Element(tag,currentElement,elementType);
		index = XML._nextIndexIgnoreWhiteSpace(inputString,index);
		char = inputString.charAt(index);
		startIndex = index;
		var key = null;
		var value = null;
		var hasQuote = false;
		var attributes = {};
		var foundEnd = false;
		var nextIndex = null;
		var isAssignment = false;
		for(var i=index; i<totalLength; ++i){
			var c = inputString.charAt(i);
			// console.log(c);
			if(isAssignment){
				if(c!='"'){ // waiting for quote
					continue;
				}
				if(!hasQuote){
					hasQuote = true;
					startIndex = i+1;
					continue;
				}
				var b = inputString.charAt(i-1);
				if(b=='\\'){ // escaped
					continue;
				}
				// actual ending "
				value = inputString.substring(startIndex,i);
				value = XML.unescapeValues(value);
				attributes[key] = value;
				// console.log("ASSIGNED: "+key+" = "+value);
				hasQuote = false;
				isAssignment = false;
				key = null;
				value = null;
				startIndex = i+1;

				continue;
			}

			if(c=="="){
				key = inputString.substring(startIndex,i);
				startIndex = i+1;
				isAssignment = true;
			}else if(c=='"'){
				throw "quote ?";
			}else if(c=='/'){ // end of tag
				var n = i+1;
				var d = inputString.charAt(n);
				if(d=='>'){
					foundEnd = true;
					nextIndex = n+1;
					break;
				}else{
					throw "unexpected END --- ignore whitespace ?";
				}
			}else if(c=='>'){ // end >
				if(startIndex<i){
					var sub = inputString.substring(startIndex,i);
					if(sub=="?"){
						if(isSpecialQ){
							// console.log("end xml");
						}
					}else{
						attributes[sub] = sub;
					}
				}
				var n = i+1;
				nextIndex = n;
				break;
			}else if(c==' ' || c=='\t' || c=='\n' || c=='\r'){
				if(startIndex<i){
					var sub = inputString.substring(startIndex,i);
					attributes[sub] = sub;
				}
				startIndex = i+1;
			}else{
				// throw "? "+c;
			}
		}
		// save attributes if found
		var keys = Code.keys(attributes);
		for(var i=0; i<keys.length; ++i){
			var k = keys[i];
			var v = attributes[k];
			element.setAttribute(k,v);
		}
		currentElement.addChild(element);
		if(nextIndex==null){
			return;
		}
		if(foundEnd){
			XML.processElement(currentElement, inputString, nextIndex);
			return;
		}else{
			if(isSpecialQ){ // no children
				XML.processElement(currentElement, inputString, nextIndex);
			}else{
				XML.processElement(element, inputString, nextIndex);
			}
			return;
		}
	}else if(char=="/"){
		throw "END PREFIX";
	}else{
		var nextIndex = null;
		for(var i=index; i<totalLength; ++i){
			var c = inputString.charAt(i);
			if(c=='<'){ // waiting for next start
				var value = inputString.substring(index,i);
				nextIndex = i;
				currentElement.setValue(value);
				break;
			}
		}
		if(nextIndex){
			XML.processElement(currentElement, inputString, nextIndex);
		}
		return;
	}
}

// -------------------------------------------------------------------------------------------------- ?
XML.prototype.toObject = function(inputString){ // string to object
	if(!this._root){
		return {};
	}
	return this._root.appendToObject({});
}
// -------------------------------------------------------------------------------------------------- ?
XML.prototype.toStringX = function(){ // object to string
	if(!this._root){
		return "";
	}
	return this._root.appendToString("");
}



/*
	- indents mean nothing
	- tokenized: spearate into characters ....
		< = START TAG
			POSSIBLE: / = END
			NECESSARY: ELEMENT-TYPE

			POSSIBLE: ATTRIBUTE
				POSSIBLE: = = VALUE
					NECESSARY: VALUE OR "VALUE"

			/ = POSSIBLE END
		> = END TAG
		POSSIBLE: TEXT = VALUE/CONTENT

	states:
	- string, index,

	- current operating object
		=> return when done



	writing:
	var xml = new XML();
*/
