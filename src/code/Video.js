// Video.js
function Video(){
    Code.extendClass(this,DO);
    this.images = new Array();
    this.addImage = function(img){
        this.images.push(img);
    }
    this.counter = -1;
    this.render = function(canvas){
        this.super.setupRender.call(this,canvas);
        var context = canvas.getContext();
        var wid, hei, i, j, r, g, b, a, col;
        // 
        this.counter++;
        if(this.counter>=this.images.length){
            this.counter=0;
        }
        var img = this.images[this.counter];
        var index = 0;
        wid = this.width;
        hei = this.height;
        var imageData = new Array();
        for(j=0;j<hei;++j){
            for(i=0;i<wid;++i){
                col = img[index];
                r = Code.getRedARGB(col);
                g = Code.getGrnARGB(col);
                b = Code.getBluARGB(col);
                a = Code.getAlpARGB(col);
                col = String.fromCharCode( b,g,r,0 );
                imageData[(hei-j-1)*wid+i] = col;
                ++index;
            }
        }
        var img = Code.generateImageFromData(wid,hei, imageData);
        context.drawImage(img, 0,0, wid,hei);
        this.super.takedownRender.call(this);
    }
    this.kill = function(){
        this.images = null;
    }
    // ----------------------------------------------- constructor
    var bits = new ByteData();
    var vidData = new VideoData1();
    bits.clearData();
    console.log("read/writ/ing...");
    bits.writeString64(vidData.data);
    console.log("saving");
    bits.initRead();
    var wid, hei, i, j, index;
    console.log( "videoType: " + bits.readUint8() );
    var dataAvailable = !bits.readEnd();
    while(dataAvailable){
        console.log( "imageType: " + bits.readUint8() );
        wid = bits.readUint16();
        hei = bits.readUint16();
        console.log("dimensions: "+wid+"x"+hei);
        if(wid*hei<=0){ break; }
        this.width = wid;
        this.height = hei;
        var img = new Array(wid*hei);
        index = 0;
        for(j=0;j<hei;++j){
            for(i=0;i<wid;++i){
                col = bits.readUint32();
                img[index] = col;
                ++index; // j*wid+i
            }
        }
        this.addImage(img);
        dataAvailable = !bits.readEnd();
    }
    console.log("...complete...");
// -----------------------------------------------
}
