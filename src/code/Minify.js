// Minify.js
Minify.CONSTANT = 0;
function Minify(){
	// 
}
Minify.minifyJSString = function(fatty, tiny){ // tiny~obfuscate
	var i, len, matchIndex, nextIndex, isCommented;
	var lines = fatty.split("\n");
	len = lines.length;
	isCommented = false;
	for(i=0;i<len;++i){ // replace /* ... */ comments with space
		if(isCommented){ // looking for end
			nextIndex = lines[i].indexOf("*/",matchIndex+2);
			if(nextIndex>=0){ // found the end, update and recheck line
				lines[i] = lines[i].substring(nextIndex+2,lines[i].length);
				isCommented = false;
				--i;
			}else{ // blank line
				lines[i] = "";
			}
		}else{
			matchIndex = lines[i].indexOf("/*");
			if(matchIndex>=0){ // found start
				nextIndex = lines[i].indexOf("*/",matchIndex+2);
				if(nextIndex>=0){ // found end, update and recheck line
					lines[i] = lines[i].substring(0,matchIndex)+lines[i].substring(nextIndex+2,lines[i].length);
					--i;
				}else{ // not find end, update and check for end
					lines[i] = lines[i].substring(0,matchIndex);
					isCommented = true;
				}
			}
		}
		/*if(isCommented){ // looking for end
			console.log( lines[i].search(/\/g); );
		}else{ // looking for start
			lines[i].replace(/\/\*.* /,""); // remove 
			matchIndex = lines[i].search(/\/\* /);
			if(matchIndex>=0){
				lines[i].replace(/\/\*.* /,"");
				console.log("START");
				--i; // recheck same line
				isCommented = true;
			}
		}*/
		//lines[i] = lines[i].replace(/\/\/.*$/g,"REPLACED");
	}
	for(i=0;i<len;++i){
// THESE NEED TO PRESERVE STRINGS in single or double quotes
		lines[i] = lines[i].replace(/\/\/.*$/g,""); // double-slash comments to end-of-line
		lines[i] = lines[i].replace(/\t/g,""); // tabs
		lines[i] = lines[i].replace(/^[ ]*/g,""); // beginning spaces
		lines[i] = lines[i].replace(/[ ]*$/g,""); // end spaces
		lines[i] = lines[i].replace(/[ ]+/g," "); // multi-spaces
		lines[i] = Minify.removeCharSpaces(lines[i],"=");
		lines[i] = Minify.removeCharSpaces(lines[i],",");
		lines[i] = Minify.removeCharSpaces(lines[i],";");
		// check that end of line has semicolon?
	}
	var minified = "";
	for(i=0;i<len;++i){ // concatenate
		minified += lines[i];
	}
	console.log(lines);
	// COMPILE TIEM!
	// 
	// if(tiny) => basically need to do compile-type checking on vars, everything needs to be correctly scoped
	// 
	// 
	return minified;
}
Minify.removeCharSpaces = function(str,sym){
	return str.replace(" "+sym,sym).replace(sym+" ",sym);
}
Minify.stringFromScript = function(scriptElement){
	var everything = scriptElement.innerHTML;//Code.getProperty(scriptElement,;
	// insides are empty for external resources ...
	return everything;
}

/*
default: everything
{ body:true,head:true,src:true,nosrc:true,exclude:[],include:[]}
*/
Minify.stringFromDOM = function(settings){
	settings.head = (settings.head!==undefined)?settings.head:true;
	settings.body = (settings.body!==undefined)?settings.body:true;
	settings.src = (settings.src!==undefined)?settings.src:true;
	settings.nosrc = (settings.nosrc!==undefined)?settings.nosrc:true;
	settings.include = (settings.include!==undefined)?settings.include:[];
	settings.exclude = (settings.include!==undefined)?settings.include:[];
	// find all script tags in head/body with specified paramters & read into string
	var list, elements, i, len, element, everything = "";
	var root = document;
	if(!settings.body && settings.head){
		root = document.head;
	}else if(settings.body && !settings.head){
		root = document.body;
	}
	list = root.getElementsByTagName("script");
	elements = [];
	len = list.length;
	for(i=0; i<len; ++i){
		element = list[i];
		// if included in string ..
		// if not excluded in string ..
		elements.push(element);
	}
	len = elements.length;
	for(i=0; i<len; ++i){
		element = elements[i];
		//console.log( element );
		//console.log( Code.getProperty(element,"src") );
		//console.log( element.innerHTML );
		everything += Minify.stringFromScript(element);
	}
	return everything;
}

