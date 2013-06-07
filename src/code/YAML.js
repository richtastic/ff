// YAML.js

function YAML(){
    var self = this;
    this.parse = function(blob){
        var i, s, len, obj, index, line;
        var documentList = new Array();
        var referenceTable = new Object();
        var lineList = blob.split("\n");
        len = lineList.length;
        documentList.push(new Object);
        while( lineList.length>0 ){
            if( self._removeLeadingAndTrailingWhitespace(lineList[0]) == "---" ){
                //console.log("NEW EXTERNAL: ------------------");
                documentList.push( new Object () );
                lineList.shift();
            }else if( self._removeLeadingAndTrailingWhitespace(lineList[0]) == "..." ){
                lineList.shift();
                break;
            }else{
                obj = self._parseObject(lineList, 0, documentList, referenceTable, self._getLastDocumentObject(documentList) );
            }
        }
        //
        // CLEANUP NON-REFERENCED | TABLE HERE
        // ,,,
        //
        for(s in referenceTable){
            referenceTable[s] = null;
        }
        len = documentList.length;
        if(len==0){
            return null;
        }else if(len==0){
            return documentList.pop();
        }
        return documentList;
    };
    /*this._parseArray = function(lines, prevIndents, docList, refTable, currArr){
        return currArr;
    };*/
    this._parseObject = function(lines, prevIndents, docList, refTable, currObj){
        var line, obj, str, tmp, obj, arr, key, value, indents;
        indents = prevIndents;
        while(indents>=prevIndents){
            line = lines.shift();
            if(!line){ break; }
            str = self._removeComment( self._checkTag( line ) );
            indents = self._getLeadingIndentCount(str);
            str = self._removeLeadingAndTrailingWhitespace(str);
            key = self._removeLeadingAndTrailingWhitespace( str.replace(/:.*/,"") );
            //console.log(key+" = "+prevIndents+" / "+indents);
            if(indents<prevIndents){ // this key belongs to previous object
                lines.unshift(line);
                break;
            }
            tmp = self._removeLeadingAndTrailingWhitespace( str );
            if( tmp=="---" ){
                //console.log("NEW INTERNAL ++++++++++++++++++++++++++++++++++++++++++++");
                docList.push( new Object() );
                break;
            }else if( tmp=="..." ){ 
                lines.unshift(); 
                break;
                //
            }else if( key.length==0 ){ // nothing
                // console.log("N/A");
            }else{
                value = self._removeLeadingAndTrailingWhitespace( str.replace(/.*:/,"") );
                console.log("'"+str+"' | key: '"+key+"' | value: '"+value+"'");
                if( value.length==0 ){ // object declaration
                    console.log("OBJECT/ARRAY DECLARATION");
                    var nextLine, nextKey;
                    if(lines.length>0){
                        nextLine = lines[0];
                        nextLine = self._removeComment( self._checkTag( nextLine ) );
                    }else{
                        continue; // no next line
                    }
                    nextIndents = self._getLeadingIndentCount(nextLine);
                    nextKey = self._removeLeadingAndTrailingWhitespace( nextLine.replace(/:.*/,"") );
                    if( nextKey.indexOf("-")==0 ){
                        console.log("   ARRAY");
                        arr = new Array();
                        value = self._parseObject(lines, nextIndents, docList, refTable, arr);
                    }else{
                        console.log("   OBJECT");
                        obj = new Object();
                        value = self._parseObject(lines, nextIndents, docList, refTable, obj);
                    }
                }else if( value.indexOf("&")==0 ){ // reference table declaration
                    console.log("REFERENCE DECLARATION");
                }else if( value.indexOf("*")==0 ){ // reference table reference
                    console.log("REFERENCE REFERENCE");
                }else if( str.indexOf("-")==0){ // array item
                    str = self._removeLeadingAndTrailingWhitespace( str.replace("-","") );
                    console.log("ARRAY ITEM '"+str+"'");
                    lines.unshift( line.replace("-","") );
                    obj = new Object();
                    var ret = self._parseObject(lines, nextIndents, docList, refTable, obj);
                    currObj.push(ret);
continue;
                }else if( value.length>1 && value.charAt(0)=='"' && value.charAt(value.length-1)=='"' ){ // explicit string declaration
                    //console.log("EXPLICIT ONE-LINE STRING");
                    value = value.substr(1,value.length-2)
                }else{ // primitive type
                    //console.log("PRIMITIVE TYPE");
                    if(value=="true" || value=="false"){ // boolean
                        if(value=="true"){ value=true; }else{ value=false; }
                    }else if( !isNaN(value) ){ // number
                        if( value.indexOf(".")>=0  ){ // floating point
                            value = parseFloat(value);
                        }else{ // integer
                            value = parseInt(value);
                        }
                    } // else - string
                }
                currObj[key] = value;
// NEED TO CHANGE THIS TO RETURN AN OBJECT - NOT ADD ...
//return value; 
            }
        }
        return currObj;
    };
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
    this.kill = function(){
        //
    };
}