// YAML.js

function YAML(){
    var self = this;
    // -------------------------------------------------------------------------------------------- FROM YAML TO JS
    this.parse = function(blob){
        var i, s, table, obj, index, line, list, ref, arr, hash;
        var documentList = new Array();
        var referenceTable = new Object();
        var lineList = blob.split("\n");
        // root doclist
        obj = documentList;
        while( obj!=null && lineList.length>0 ){
            if( self._removeLeadingAndTrailingWhitespace(lineList[0]) == "---" ){
                documentList.push( new Object () );
                lineList.shift();
            }else if( self._removeLeadingAndTrailingWhitespace(lineList[0]) == "..." ){
                lineList.shift();
                break;
            }
            obj = self._parseObject(lineList, 0, referenceTable, self._getLastDocumentObject(documentList) );
        }
        // clear
        for(s in referenceTable){
            table = referenceTable[s]; ref = table.reference; list = table.list;
            while(list.length>0){
                arr = list.pop(); obj = arr[0]; hash = arr[1];
                obj[hash] = ref;
                delete arr[0];
                delete arr[1];
            }
            table.reference = null; table.list = null;
            referenceTable[s] = null;
            delete referenceTable[s];
        }
        /*var retList = new Array();
        while(documentList.length>0){
            obj = documentList.pop();
            for(s in obj){
                retList.push(obj);
                break;
            }
        }
        return retList;
        */
        return documentList;
    };
    this._parseObject = function(lines, prevIndents, refTable, currObj, index){
        var line, lineNext, obj, str, tmp, tk, tv, obj, key, value, indents, isDef;
        index = index===undefined?0:index;
        while(true){
            self._popBlankLines(lines);
            if(lines.length==0){ break; }
            line = lines[0];
            tmp = self._removeLeadingAndTrailingWhitespace(line);
            if(tmp=="---"){
                //lines.shift();
                break;
            }else if(tmp=="..."){
                //lines.shift();
                break;
            }
            key = self._parseKey(line, refTable);
            if(key){
                indents = self._getLeadingIndentCount(line);
                if(indents<prevIndents){
                    return currObj;
                }
                value = self._parseValue(line, refTable);
                if(value.length>0 && value.charAt(0)=="&"){
                    isDef = value.replace(/&/,"");
                }else{
                    isDef = null;
                }
                lines.shift(); // used
                self._popBlankLines(lines);
                lineNext = lines.length>0?lines[0]:"";
                if(key == "-"){ // array item start - replace dash with index and redo
                    lineNext = line.replace(/-/,"");
                    tk = self._parseKey(lineNext, refTable);
                    tv = self._parseValue(lineNext, refTable);
                    tmp = index+":";
                    ++index;
                    if(tk!=""&&tv!=""){
                        lines.unshift( lineNext );
                        tmp = line.replace(/-.*/,tmp);
                        lines.unshift( tmp );
                    }else{
                        tmp = line.replace(/-/,tmp);
                        lines.unshift( tmp );
                    }
                    continue;
                }else if( value=="" || isDef ){ // object or array
                    indents = self._getLeadingIndentCount(lineNext);
                    tmp = self._parseKey(lineNext, refTable);
                    if(tmp=="-"){ obj = new Array(); }else{ obj = new Object(); }
                    if(isDef){ self._setReferenceTable(isDef, obj, refTable); }
                    obj = self._parseObject(lines, indents, refTable, obj, 0);
                    if( currObj instanceof Array ){
                        currObj.push( obj );
                    }else{
                        currObj[key] = obj;
                    }
                }else{ // terminal
                    if(value.length>0 && value.charAt(0)=="*"){
                        value = value.replace(/\*/,"");
                        self._appendReferenceTable(value, currObj, key, refTable );
                    }else{ // could return number 
                        value = self._parseTerminal(value);
                    }
                    if( currObj instanceof Array ){
                        currObj.push( value );
                    }else{
                        currObj[ key ] = value;
                    }
                }
            }else{
                break;
            }
        }
        return currObj;
    };
    this._parseKey = function(line, refTable){
        var str, key, i;
        if(line==""){ return null; }
        str = self._removeComment( self._checkTag( line ) );
        str = self._removeLeadingAndTrailingWhitespace(str);
        i = str.indexOf(":");
        if(i>0){
            key = self._removeLeadingAndTrailingWhitespace( str.substr(0, i) );
        }else{
            key = self._removeLeadingAndTrailingWhitespace( str );
        }
        if(key.charAt(0)=="-"){
            return "-";
        }
        return key;
    };
    this._parseValue = function(line, refTable){
        var str, value, i;
        if(line==""){ return null; }
        str = self._removeComment( self._checkTag( line ) );
        str = self._removeLeadingAndTrailingWhitespace(str);
        i = str.indexOf(":")+1;
        value = self._removeLeadingAndTrailingWhitespace( str.substr( i, str.length-i) );
        if(value.charAt(0)=="-"){
            value = self._removeLeadingAndTrailingWhitespace( value.replace(/-/,"") );
        }else if(line.indexOf(":")<0){// no assignment
            return "";
        }
        return value;
    };
    this._parseTerminal = function(value){
        if(value=="true" || value=="false"){ // boolean
            if(value=="true"){ value=true; }else{ value=false; }
        }else if( !isNaN(value) ){ // number
            if( value.indexOf(".")>=0  ){ // floating point
                value = parseFloat(value);
            }else{ // integer
                value = parseInt(value);
            }
        }else if(value.length>1 && value.charAt(0)=='"' && value.charAt(value.length-1)=='"' ){ // explicit string
            value = value.substr(1,value.length-2);
            value = self._cleanUpString(value);
        }else{
            value = self._cleanUpString(value);
        }
        return value;
    }
    this._popBlankLines = function(lines){
        var line;
        while(lines.length>0){
            line = lines[0];
            line = self._removeComment( self._checkTag( line ) );
            line = self._removeLeadingAndTrailingWhitespace( line );
            if(line!=""){
                return true;
            }
            lines.shift();
        };
        return false;
    };
    this._appendReferenceTable = function(hash, obj, key, refTable){
        if(!refTable[hash]){
            refTable[hash] = new Object();
            refTable[hash].reference = null;
            refTable[hash].list = new Array();
        }
        refTable[hash].list.push([obj, key] );
    }
    this._setReferenceTable = function(hash, obj, refTable){
        if(!refTable[hash]){
            refTable[hash] = new Object();
            refTable[hash].list = new Array();
        }
        refTable[hash].reference = obj;
    }
    this._getLastDocumentObject = function(docList){
        if(docList.length==0){ // ensure at least one object exists
            docList.push( new Object() );
        }
        return docList[docList.length-1];
    };
    this._getLeadingIndentCount = function(str){
        var i, len = str.length;
        for(i=0;i<len;++i){
            if( str.charAt(i) != "\t" ){
                return i;
            }
        }
        return len;
    }
    this._cleanUpString = function(str){
        return str.replace(/\\n/g,"\n");
    };
    this._removeLeadingAndTrailingWhitespace = function(str){
        return self._removeTrailingWhitespace( self._removeLeadingWhitespace(str) );
    };
    this._removeLeadingWhitespace = function(str){
        return str.replace(/^[ \t]+/,"");
    };
    this._removeTrailingWhitespace = function(str){
        return str.replace(/[ \t]+$/,"");
    };
    this._removeComment = function(str){
        return str.replace(/#.*/g,"");
    };
    this._checkTag = function(str){
        if(str.charAt(0)=="%"){
            //console.log("TAG INFO IGNORED: '"+str.replace(/%/,"")+"'");
            return str.replace(/%.*/g,"");
        }
        return str;
    };
    this._indentString = "\t";
    this._beforeString = "";
    this._afterString = " ";
    this._idString = "objRef";
    this._idNumber = 0;
    // -------------------------------------------------------------------------------------------- FROM JS TO YAML
    this.generate = function(obj, heading){
        if(!heading){
            heading = "";
        }
        var returnString = ""+heading+"\n";
        var referenceTable = new Array();
        returnString = returnString + "" + self._getTerminal(obj, "", referenceTable, true);
        return returnString;
    };
    this._checkTable = function(obj, table){ 
        var i, len = table.length;
        var found = false;
        for(i=0; i<len; ++i){
            if(table[i].object == obj){
                found = true;
                break;
            }
        }
        var newID = self._idString+""+self._idNumber;
        ++self._idNumber;
        table.push( { "object":obj, "id":newID } );
        return [found, table[i].object, table[i].id];
    };
    this._getTerminal = function(obj, indent, table, notUseRef){
        if(typeof obj == "string"){
            return '"'+obj+'"' + "\n";
        }else if(typeof obj == "number"){
            return ""+obj + "\n";
        }else if(typeof obj == "function"){
            console.log("function");
            return "function_was_here";
        }else if(typeof obj == "object"){
            var arr = self._checkTable(obj, table);
            var wa = arr[0], ob = arr[1], id = arr[2];
            if( wa ){
                return "*" + id + "\n";
            }
            var s, str = "&"+id+"\n";
            if(notUseRef){ str="\n"; }
            if( Array.isArray(obj) ){
                for(s=0;s<obj.length;++s){
                    str = str + indent + "-" + self._afterString + self._getTerminal(obj[s], indent+self._indentString, table) + "";
                }
            }else{
                for(s in obj){
                    str = str + indent + s + self._beforeString + ":" + self._afterString + self._getTerminal(obj[s], indent+self._indentString, table) + "";
                }
            }
            return str;
        }else{
            console.log( "UNKNOWN:" + (typeof obj) );
        }
    }
    /*
    make a table of all references
    
    ignore functions?
    */
    // --------------------------------------------------------------------------------------------
    this.kill = function(){
        //
    };
}