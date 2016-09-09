var utils = require('./utils');
var RGBA = require('./RGBA');
var DitheredLinearGradient = require('./DitheredLinearGradientRGB');
var Tombola = require('tombola');
var tombola = new Tombola();
var Perspective = require('./perspective');
var Canvas = require('canvas');

//-------------------------------------------------------------------------------------------
//  SETUP
//-------------------------------------------------------------------------------------------


function DrawStars() {
    this.fullX = 1200;
    this.fullY = 1200;
    this.halfX = Math.round(this.fullX/2);
    this.halfY = Math.round(this.fullY/2);

    var u = (this.fullX);
    this.units = (u/910);



    this.canvas = [];
    this.ctxi = [];

    for (var i=0; i<4; i++) {
        var c = new Canvas(this.fullX,this.fullY);
        this.canvas.push(c);
        this.ctxi.push(c.getContext("2d"));
    }

    this.noise = noisePattern(100,100,0.3,1.1);
}

//-------------------------------------------------------------------------------------------
//  BG
//-------------------------------------------------------------------------------------------


DrawStars.prototype.background = function(data) {

    var bgCol = data.bgCols[0];
    var bgCol2 = data.bgCols[1];
    var fullX = this.fullX;
    var fullY = this.fullY;
    var ctxi = this.ctxi;

    // CLEAR //
    for (var i=0; i<ctxi.length; i++) {
        ctxi[i].clearRect(0,0,fullX,fullY);
    }

    color.master = data.masterCol;


    // FILL //
    color.fill(ctxi[3],bgCol);
    ctxi[3].fillRect(0,0,fullX,fullY);


    // GRADIENT //
    if (bgCol !== bgCol2) {
        console.log('grad');
        var c1 = color.processRGBA(bgCol,true);
        var c2 = color.processRGBA(bgCol2,true);
        var image = ctxi[3].getImageData(0, 0, fullX, fullY);

        var grad = renderGrad( {r:c1.R, g:c1.G, b:c1.B}, {r:c2.R, g:c2.G, b:c2.B}, 0, 0, fullX, fullY, image);
        ctxi[3].putImageData(grad,0,0);
    }

    // NOISE //
    //noiseLayer(0, 0, 200, 200, 0.13, 1, ctxi[5]);
    //patternLayer(0, 0, fullX, fullY, canvas[5], 200, ctxi[4]);
};






//-------------------------------------------------------------------------------------------
//  FOREGROUND
//-------------------------------------------------------------------------------------------




DrawStars.prototype.stars = function(data) {

    var sl, h, sx, sy;
    var smoothStars = [];
    var units = this.units;
    var ctxi = this.ctxi;

    // STARS //
    sl = data.stars.length;
    for (h=0; h<sl; h++) {
        var star = data.stars[h];

        if (star.ready === 0) {

            sx = data.origin[0] + (star.position.x * units);
            sy = data.origin[1] + (star.position.y * units);


            color.fill(ctxi[star.ctx],star.color);

            ctxi[star.ctx].globalAlpha = 1;
            ctxi[star.ctx].beginPath();
            ctxi[star.ctx].arc(sx,sy,star.size*units,0,Math.PI*2,true);
            ctxi[star.ctx].closePath();
            ctxi[star.ctx].fill();

        }
        else {
            if (star.ctx === 0) {
                smoothStars.push(star);
            }
        }
    }


    /*// COMPOSITE //
    ctxi[1].drawImage(canvas[4],0,0);
    ctxi[1].drawImage(canvas[3],0,0);
    ctxi[1].drawImage(canvas[2],0,0);*/


    // draw smooth star movement on top //
    sl = smoothStars.length;
    for (h=0; h<sl; h++) {
        star = smoothStars[h];

        sx = data.origin[0] + (star.position.x * units);
        sy = data.origin[1] + (star.position.y * units);


        color.fill(ctxi[0],star.color);

        ctxi[0].globalAlpha = 1;
        ctxi[0].beginPath();
        ctxi[0].arc(sx,sy,star.size*units,0,Math.PI*2,true);
        ctxi[0].closePath();
        ctxi[0].fill();

    }
};


// COMPOSITE //
DrawStars.prototype.composite = function() {

    // merge stars & background //
    this.ctxi[3].drawImage(this.canvas[2],0,0);
    this.ctxi[3].drawImage(this.canvas[1],0,0);
    this.ctxi[3].drawImage(this.canvas[0],0,0);

    // distort perspective //
    var perspective = new Perspective(this.ctxi[3],this.canvas[3]);
    var p1 = [0,0];
    var p2 = [this.fullX,0];
    var p3 = [this.fullX,this.fullY];
    var p4 = [0,this.fullY];

    var tilt = tombola.range(-100,100);
    console.log(tilt);
    var elevation = tombola.rangeFloat(0.2,0.8);
    console.log(elevation);
    if (tilt < 0) {
        p1 = [tilt,tilt*elevation];
    } else {
        p2 = [this.fullX + tilt,-tilt*elevation];
    }
    perspective.draw([ p1, p2, p3, p4 ]);


    // vignetting //
    var c1 = [this.halfX + tombola.rangeFloat(-this.fullX*0.08,this.fullX*0.08), this.halfY + tombola.rangeFloat(-this.fullX*0.08,this.fullX*0.02)];
    var c2 = [this.halfX, this.halfY];

    var radM = tombola.rangeFloat(0.79,0.84);

    var ctx = this.ctxi[3];
    var grd=ctx.createRadialGradient(c1[0],c1[1],this.fullX*0.5,c2[0],c2[1],this.fullX*radM);
    grd.addColorStop(0,color.string(new RGBA(0,0,0,0)));
    grd.addColorStop(1,color.string(new RGBA(0,0,0,1)));

    ctx.fillStyle=grd;
    ctx.fillRect(0,0,this.fullX,this.fullY);

    // noise layer //
    drawPattern(0,0,this.fullX,this.fullY,this.noise,100,this.ctxi[3]);
};




//-------------------------------------------------------------------------------------------
//  EFFECTS
//-------------------------------------------------------------------------------------------


function noisePattern(w,h,alpha,size) {

    var c = Math.ceil(w/size);
    var r = Math.ceil(h/size);

    var canvas = new Canvas(w,h);
    var ctx = canvas.getContext('2d');

    var i,j;

    for (i=0; i<r; i++) { // for each row

        for (j=0; j<c; j++) { // for each col

            var n = 60 + Math.floor( Math.random() * 60 );
            ctx.fillStyle = "rgba(" + n + "," + n + "," + n + "," + tombola.rangeFloat(alpha*0.4,alpha) + ")";
            ctx.fillRect((j*size), (i*size), size, size);

        }
    }
    return canvas;
}

function drawPattern(x,y,w,h,pattern,size,ctx) {

    var c = Math.ceil(w/size);
    var r = Math.ceil(h/size);

    var i,j;

    for (i=0; i<r; i++) { // for each row

        for (j=0; j<c; j++) { // for each col

            var n = Math.floor( Math.random() * 90 );
            ctx.drawImage(pattern, 0, 0, size, size, x+(j*size), y+(i*size), size, size);

        }
    }
}





function renderGrad(c1,c2,x,y,w,h,imageData) {

    var gradX = tombola.range(w*0.1,w*0.9);
    var gradX2 = gradX + tombola.range(-w*0.9,w*0.9);
    var dgrad = new DitheredLinearGradient(gradX,0,gradX2,h);
    dgrad.addColorStop(0,c1.r,c1.g,c1.b);
    dgrad.addColorStop(1,c2.r,c2.g,c2.b);
    return dgrad.process(imageData,x,y,w,h);
}

module.exports = DrawStars;