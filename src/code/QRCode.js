// QRCode.js

function QRCode(){
    this._version = null;
    this._error = null; // error correction 
    this._mask = null; // mask pattern
    this._moduleMatrix = null; // 
    this._width = null; // 
    this._height = null; // 
    // image -> data
    // data -> qr code
}
// ------------------------------------------------------------------------
QRCode.fromImage = function(matrix){ // find in image & return data
    var OFFX = 10;
    var OFFY = 10;

    // var img = matrix;
    var img = GLOBALSTAGE.getImageMatAsImage(matrix);
    var d = new DOImage(img);
    d.matrix().translate(OFFX + 0, OFFY + 0);
    GLOBALSTAGE.addChild(d);
    // dxxx += imgA.width();// widthA*scale;
    // 

    // scale to manageable size

    // get grayscale
    var gray = matrix.gry();

    // local range maximizing

    // local 0-1 thresholding

    var grayInverted = Code.copyArray(gray);
        ImageMat.invertFloat01(grayInverted);
// gray = grayInverted;
    var wid = matrix.width();
    var hei = matrix.height();
    console.log(gray,wid,hei);

    // var blobs = ImageMat.findBlobs(gray, wid, hei);
    // console.log(blobs);

    var info = ImageMat.findBlobsCOM(gray, wid, hei);
    ImageMat.describeBlobs(info);
    var blobsWhite = info["blobs"];

    var info = ImageMat.findBlobsCOM(grayInverted, wid, hei);
    ImageMat.describeBlobs(info);
    var blobsBlack = info["blobs"];
    

    // info
    var blobs = blobsBlack;
    for(var i=0; i<blobs.length; ++i){
        var blob = blobs[i];
        blob["color"] = "black";
        blob["point"] = new V2D(blob["x"],blob["y"]);
    }
    var blobs = blobsWhite;
    for(var i=0; i<blobs.length; ++i){
        var blob = blobs[i];
        blob["color"] = "white";
        blob["point"] = new V2D(blob["x"],blob["y"]);
    }


    console.log(blobs);

    // show
    var d = new DO();
    d.matrix().translate(OFFX + 0, OFFY + 0);
    GLOBALSTAGE.addChild(d);
    d.graphics().clear();
    var blobs = blobsWhite;
    for(var i=0; i<blobs.length; ++i){
        var blob = blobs[i];
        var x = blob["x"];
        var y = blob["y"];
        var radMin = blob["radiusMin"];
        var radMax = blob["radiusMax"];
        d.graphics().beginPath();
        d.graphics().setLine(1.0, 0xFFFF0000);
        d.graphics().drawCircle(x,y, radMin);
        d.graphics().endPath();
        d.graphics().strokeLine();

        d.graphics().beginPath();
        d.graphics().setLine(2.0, 0xFFFF0000);
        d.graphics().drawCircle(x,y, radMax);
        d.graphics().endPath();
        d.graphics().strokeLine();
    }
    
    // show
    var d = new DO();
    d.matrix().translate(OFFX + 0, OFFY + 0);
    GLOBALSTAGE.addChild(d);
    d.graphics().clear();
    var blobs = blobsBlack;
    for(var i=0; i<blobs.length; ++i){
        var blob = blobs[i];
        var x = blob["x"];
        var y = blob["y"];
        // console.log(x,y)
        // 
        var radMin = blob["radiusMin"];
        var radMax = blob["radiusMax"];
        d.graphics().beginPath();
        d.graphics().setLine(1.0, 0xFF00FF00);
        d.graphics().drawCircle(x,y, radMin);
        d.graphics().endPath();
        d.graphics().strokeLine();

        d.graphics().beginPath();
        d.graphics().setLine(2.0, 0xFF00FF00);
        d.graphics().drawCircle(x,y, radMax);
        d.graphics().endPath();
        d.graphics().strokeLine();
    }
    
    




    // put blobs into 2d quad space
    var blobToPoint = function(b){
        return b["point"];
        // return new V2D(b["x"],b["y"]);
    }
    var space = new QuadTree(blobToPoint);
    // insert
    for(var i=0; i<blobsWhite.length; ++i){
        var blob = blobsWhite[i];
        space.insertObject(blob);
    }
    for(var i=0; i<blobsBlack.length; ++i){
        var blob = blobsBlack[i];
        space.insertObject(blob);
    }

    console.log(space);
    var blobsAll = space.toArray();
    for(var i=0; i<blobsAll.length; ++i){
        var blob = blobsAll[i];
        blob["id"] = i;
    }

    // finder patterns: small black, larger white, largest black -- concentric
    var finderPatterns = {};
    for(var i=0; i<blobsWhite.length; ++i){
        var blobWhite = blobsWhite[i];
        var whiteID = blobWhite["id"];
        var center = blobWhite["point"];
        var radMin = blobWhite["radiusMin"];
        var radMax = blobWhite["radiusMax"];
        var radAvg = (radMin+radMax)*0.5;
        //...
        var blobs = space.objectsInsideCircle(center, radMin);
        //finderPatterns
        // console.log(blobs);
        // narrow by size
        for(var j=0; j<blobs.length; ++j){
            var blob = blobs[j];
            var color = blob["color"];
            if(color=="black"){

                var rMin = blob["radiusMin"];
                var rMax = blob["radiusMax"];
                var rAvg = (rMin+rMax)*0.5;
                var ratio = radAvg/rAvg;
                console.log(rAvg,radAvg,ratio);
                // 2.5/1.5 = 1.666
                // 1.36 ?
                if(1.20<ratio && ratio<1.60){ // 1.36
                    if(!finderPatterns[whiteID]){
                        finderPatterns[whiteID] = {"small":[],"large":[], "white":blobWhite};
                    }
                    finderPatterns[whiteID]["small"].push(blob);
                }
                if(0.50<ratio && ratio<0.75){ // 0.67
                    if(!finderPatterns[whiteID]){
                        finderPatterns[whiteID] = {"small":[],"large":[], "white":blobWhite};
                    }
                    finderPatterns[whiteID]["large"].push(blob);
                }

                // finderPatterns.push([blobWhite,blob]);
            }

        }
    }
    // pick only candidates 
    console.log(finderPatterns);
    var candidatePatterns = [];
    var keys = Code.keys(finderPatterns);
    for(var i=0; i<keys.length; ++i){
         var key = keys[i];
         var entry = finderPatterns[key];
         // console.log(entry);
         if(entry["small"].length==1 && entry["large"].length==1){
            var pattern = {};
            pattern["inner"] = entry["small"][0];
            pattern["center"] = entry["white"];
            pattern["outer"] = entry["large"][0];
            candidatePatterns.push(pattern);
         }
    }
    console.log(candidatePatterns);

    // throw "..."

    // show
    var d = new DO();
    d.matrix().translate(OFFX + 0, OFFY + 0);
    GLOBALSTAGE.addChild(d);
    d.graphics().clear();
    // var blobs = candidatePatterns;
    for(var i=0; i<candidatePatterns.length; ++i){
        var entry = candidatePatterns[i];
        var white = entry["center"];
        var point = white["point"];
        var x = point.x;
        var y = point.y;
        // var x = blob["x"];
        // var y = blob["y"];
        // console.log(x,y)
        // 
        // var radMin = blob["radiusMin"];
        // var radMax = blob["radiusMax"];
        // d.graphics().beginPath();
        // d.graphics().setLine(1.0, 0xFF00FF00);
        // d.graphics().drawCircle(x,y, radMin);
        // d.graphics().endPath();
        // d.graphics().strokeLine();

        d.graphics().beginPath();
        d.graphics().setLine(5.0, 0xFFFF00FF);
        d.graphics().drawCircle(x,y, 5.0);
        d.graphics().endPath();
        d.graphics().strokeLine();
    }

    // for all combinations of 3 finder patterns:
    if(candidatePatterns.length!=3){
        console.log(candidatePatterns);
        throw "different number of candidatePatterns != 3";
    }

    // estimate module size:
    for(var i=0; i<candidatePatterns.length; ++i){
        var entry = candidatePatterns[i];
        // console.log(entry);
        var innerMin = entry["inner"]["radiusMin"]*(2.0/3);
        var innerMax = entry["inner"]["radiusMax"]*(2.0/3/Math.sqrt(2));
        var centerMin = entry["center"]["radiusMin"]*(2.0/3);
        var centerMax = entry["center"]["radiusMax"]*(2.0/5/Math.sqrt(2));
        var outerMin = entry["outer"]["radiusMin"]*(2.0/5);
        var outerMax = entry["outer"]["radiusMax"]*(2.0/7/Math.sqrt(2));
        var size = (innerMin+innerMax+centerMin+centerMax+outerMin+outerMax)/6.0;
        // console.log(innerMin,innerMax,centerMin,centerMax,outerMin,outerMax, size);
        entry["module"] = size;
        entry["point"] = entry["inner"]["point"];
    }
    // throw "..."


    // discover which of 3 is corner : DISTANCES : TIMING PATTERNS?
    var a = candidatePatterns[0];
    var b = candidatePatterns[1];
    var c = candidatePatterns[2];
    var pA = a["center"]["point"];
    var pB = b["center"]["point"];
    var pC = c["center"]["point"];
    // var dirAB = V2D.sub(pB);
    var dAB = V2D.distance(pA,pB);
    var dAC = V2D.distance(pA,pC);
    var dBC = V2D.distance(pB,pC);

    console.log(dAB,dAC,dBC);

    var blobO = null;
    var blobX = null;
    var blobY = null;
    if(dAB>dAC && dAB>dBC){ // AB hypotenuse, C corner
        blobO = c;
        var dCA = V2D.sub(pA,pC);
        var dCB = V2D.sub(pB,pC);
        var angle = V2D.angleDirection(dCA,dCB);
        console.log("C: "+Code.degrees(angle));
        if(angle>=0){
            blobX = a;
            blobY = b;
        }else{
            blobX = b;
            blobY = a;
        }
    }else if(dAC>dAB && dAC>dBC){ // AC hypotenuse, B corner
        blobO = b;
        var dBA = V2D.sub(pA,pB);
        var dBC = V2D.sub(pC,pB);
        var angle = V2D.angleDirection(dBA,dBC);
        console.log("B: "+Code.degrees(angle));
        if(angle>=0){
            blobX = a;
            blobY = c;
        }else{
            blobX = c;
            blobY = a;
        }
    }else{ // BC hypotenuse, A corner
        blobO = a;
        var dAB = V2D.sub(pB,pA);
        var dAC = V2D.sub(pC,pA);
        var angle = V2D.angleDirection(dAB,dAC);
        console.log("A: "+Code.degrees(angle));
        if(angle>=0){
            blobX = b;
            blobY = c;
        }else{
            blobX = c;
            blobY = b;
        }
    }
    console.log(blobO,blobX,blobY);

    // DRAW
    var d = new DO();
    d.matrix().translate(OFFX + 0, OFFY + 0);
    GLOBALSTAGE.addChild(d);
    d.graphics().clear();
        d.graphics().beginPath();
        d.graphics().setLine(5.0, 0xFFCC0033);
        d.graphics().moveTo(blobO["center"]["point"].x,blobO["center"]["point"].y);
        d.graphics().lineTo(blobX["center"]["point"].x,blobX["center"]["point"].y);
        d.graphics().endPath();
        d.graphics().strokeLine();
        //
        d.graphics().beginPath();
        d.graphics().setLine(5.0, 0xFF00CC66);
        d.graphics().moveTo(blobO["center"]["point"].x,blobO["center"]["point"].y);
        d.graphics().lineTo(blobY["center"]["point"].x,blobY["center"]["point"].y);
        d.graphics().endPath();
        d.graphics().strokeLine();
    // .

    // calculate initial global affine matrix (container)
    var pointO = blobO["point"];
    var pointX = blobX["point"];
    var pointY = blobY["point"];
    var moduleSize = blobO["module"];
    var finderSize = moduleSize*7/2;
    var dirX = V2D.sub(pointX,pointO).norm();
    var dirY = V2D.sub(pointY,pointO).norm();

// console.log(dirX+"?");
// console.log(dirY+"?");

    var tl = new V2D(-finderSize*dirX.x - finderSize*dirY.x, - finderSize*dirX.y - finderSize*dirY.y ) .add(pointO);
    var tr = new V2D( finderSize*dirX.x + finderSize*dirY.x, - finderSize*dirX.y - finderSize*dirY.y ) .add(pointX);
    var bl = new V2D(-finderSize*dirX.x - finderSize*dirY.x,   finderSize*dirX.y + finderSize*dirY.y ) .add(pointY);
    var br = V2D.add( V2D.sub(tr,tl), V2D.sub(bl,tl)).add(pointO).add( V2D.sub(tl,pointO) );

    // DRAW enclosing square
    var d = new DO();
    d.matrix().translate(OFFX + 0, OFFY + 0);
    GLOBALSTAGE.addChild(d);
    d.graphics().clear();
        
        d.graphics().setLine(3.0, 0xFF9966FF);
        d.graphics().beginPath();
        d.graphics().moveTo(tl.x,tl.y);
        d.graphics().lineTo(tr.x,tr.y);
        d.graphics().lineTo(br.x,br.y);
        d.graphics().lineTo(bl.x,bl.y);
        d.graphics().endPath();
        d.graphics().strokeLine();

    // calc rough estimate of matrix size [from relative module sizes]
    var sizeX = V2D.sub(tr,tl).length()/moduleSize;
    var sizeY = V2D.sub(bl,tl).length()/moduleSize;
    
    var qrSize = Math.round( (sizeX+sizeY)*0.5 );
    console.log(sizeX,sizeY, qrSize);


    // extract squares from original image:
    var origin = new V2D(tl); // corner point
    var affine = new Matrix2D(); // affine matrix
    var count = qrSize;

    var oTR = V2D.sub(tr,tl);
    var oBL = V2D.sub(bl,tl);

    R3D.affineCornerMatrixLinear([new V2D(1,0), new V2D(0,1)],[oTR,oBL],affine);

    console.log(affine+"");

    // R3D.affineCornerMatrixLinear = function(pointsA,pointsB, reuse){

    var dataMatrix = Code.newArrayZeros(count*count);

var d = new DO();
d.matrix().translate(OFFX + 0, OFFY + 0);
GLOBALSTAGE.addChild(d);
d.graphics().clear();
    
    var p = new V2D();
    var v = new V3D();
    for(var y=0; y<count; ++y){
        for(var x=0; x<count; ++x){
            p.set((x+0.5)/count,(y+0.5)/count);
            affine.multV2DtoV2D(p,p);
            p.add(tl);
            // get at p ... 
            // console.log(gray,v);
            // gray.getAt(p,v);
            var ind = Math.round(p.y)*wid + Math.round(p.x);
            var v = gray[ind];
// console.log(v);
            var val = v>0.5 ? 1.0 : 0.0;

            var index = y*count + x;
            // var val = v.length();
            // console.log(gray,val);
            dataMatrix[index] = val;

// 
d.graphics().setLine(3.0, 0xFFFF00FF);
d.graphics().beginPath();
d.graphics().drawCircle(p.x,p.y, 3.0);
d.graphics().endPath();
d.graphics().strokeLine();
// 

        }
    }



console.log(dataMatrix);


// var img = GLOBALSTAGE.getImageMatAsImage(dataMatrix);
var img = GLOBALSTAGE.getFloatRGBAsImage(dataMatrix,dataMatrix,dataMatrix, count,count);

console.log(img);
console.log(wid,hei);

var d = new DOImage(img);
d.matrix().scale(5.0);
d.matrix().translate(OFFX + 400 + 0, OFFY + 0);
GLOBALSTAGE.addChild(d);

throw "..."
    

    

    

    // calc 

    // find alignment patterns inside square


    // ................


    // 
    // 
    

    // get 1D profile in X & Y of origin finder pattern

    // estimate corner of origin finder pattern

    // estimate module size

    // follow timing pattern 

    // from corner A: iteritively follow timing pattern to determing grid size
    // use local neighborhood for POSSIBLY differently colored neighbors to keep search toward middle of module line
        // -> gets the size of the qr data matrix
        // => know size of data

    // find alignment patterns [if expecting any?]

    // separate collection into a set of grids
    

    // for each grid section, using locally affine estimates:
    // record 1s & 0s into global bitmap

    // -> OUTPUT: QR PATTERN

    //








    throw "fromImage";

}
QRCode.fromGrid = function(){ // QR data matrix -> data
    // 

    throw "fromGrid";
}

QRCode.fromData = function(){ // create QR code from data
    // 

    throw "fromData";
}
// ------------------------------------------------------------------------
QRCode.prototype.x = function(){
    // 
}

QRCode.prototype.x = function(){
    // 
}

QRCode.prototype.x = function(){
    // 
}

QRCode.prototype.x = function(){
    // 
}

QRCode.prototype.x = function(){
    // 
}

/*





















*/























// ...

