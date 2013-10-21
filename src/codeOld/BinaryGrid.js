// BinaryGrid.js

function BinaryGrid(wid,hei,des){
    var self = this;
	this.a = new Array();
    // 
    this.setDimensions = function(w,h){
        self.width = w; self.height = h;
        Code.emptyArray(self.a);
        self.a = new Array(w*h);
        for(var i=0;i<self.a.length;++i){
            self.a[i] = 0;
        }
    }
    this.setCell = function(x,y, val){
        self.a[y*this.width+x] = val;
    }
    this.getCell = function(x,y){
        return self.a[y*this.width+x];
    }
    this.setGrid = function(str){
        var i, len = str.length;
        for(i=0;i<len;++i){
            if(str.charAt(i)==" "){
                self.a[i] = 0;
            }else{
                self.a[i] = 1;
            }
        }
    }
    this.toString = function(){
        var i, len=self.a.length, str="";
        var x = 0;
        for(i=0;i<len;++i){
            if(self.a[i]==0){
                str+=" ";
            }else{
                str+="*";
            }
            ++x;
            if(x>=self.width){
                x = 0;
                str += "\n";
            }
        }
        return str;
    }
// ----------------------------------------
    this.setDimensions(wid,hei);
    if(des!=null){
        this.setGrid(des);
    }
}

