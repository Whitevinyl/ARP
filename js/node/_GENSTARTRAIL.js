
var utils = require('./lib/utils');
var RGBA = require('./lib/RGBA');
var Tombola = require('tombola');
var tombola = new Tombola();

var DrawStarTrail = require('./_DRAWSTARS');
var drawStars = new DrawStarTrail();

var glowCols = [new RGBA(14,77,213,0.7),new RGBA(123,29,131,0.7),new RGBA(180,140,45,0.7)];
var tempo = 0.055;


// Here we generate the data for the star trail long exposure photos thar Robert sometimes
// posts.


//-------------------------------------------------------------------------------------------
//  INIT
//-------------------------------------------------------------------------------------------


function StarTrails() {

}

//-------------------------------------------------------------------------------------------
//  GENERATE
//-------------------------------------------------------------------------------------------


StarTrails.prototype.generateTrails = function() {

    var fullX = drawStars.fullX;
    var fullY = drawStars.fullY;
    var units = drawStars.units;

    // determine longest dimension //
    var longSide = fullX;
    if (fullY > fullX) {
        longSide = fullY;
    }


    // set hemisphere - determines rotation direction //
    var hemisphere = tombola.item([1,-1]);


    // set celestial pole co-ords //
    var CSX = tombola.range(-fullX*0.1,fullX*1.1);
    var CSY = tombola.range(fullY*0.6,fullY*1.1);


    // set shutter timer //
    var shutter = tombola.range(2,12) * 60;


    // set Master Color Filter //
    var mb = tombola.range(0,5);
    var mv = 23;
    var masterCol = new RGBA( tombola.range(mb,mb+mv), tombola.range(mb,mb+mv), tombola.range(mb,mb+mv), 0);


    // Sky Color //
    var bgCol = new RGBA(tombola.range(2,15),tombola.range(2,15),tombola.range(2,15),1);
    var bgb = tombola.range(4,15);
    var bgv = 22;
    var bgCol2;
    //if (tombola.percent(90)) {
        bgCol2 = new RGBA(tombola.range(bgCol.R+bgb,bgCol.R+bgb+bgv),tombola.range(bgCol.G+bgb,bgCol.G+bgb+bgv),tombola.range(bgCol.B+bgb,bgCol.B+bgb+bgv),1);
    //} else {
    //    bgCol2 = bgCol;
    //}


    // SETUP STARS //
    var stars = [];

    // brightness point at which dull stars end and bright ones begin //
    var cutoff = tombola.range(160,220);

    // how many stars //
    var count = tombola.range(1500,3500);

    // color variation //
    var v = tombola.range(1,11);

    // for each star //
    for (var i=0; i<count; i++) {

        var glowing = false;

        // brightness //
        var b = tombola.range(50,cutoff);

        // depth //
        var ctx = 2;

        // for some, be brighter / larger //
        if (tombola.percent(5)) {
            b = tombola.range(220,290);
            glowing = tombola.percent(30);
            ctx = 1;
        }

        // size //
        var s = tombola.range(b/6,b/3);
        var rad, angle;

        // even //
        if (tombola.chance(3,5)) {
            var range = ((longSide*1.1)/units);
            var x = tombola.range(CSX - range, CSX + range);
            var y = tombola.range(CSY - range, CSY + range);

            var posDif = pointDif(new utils.Point(CSX,CSY), new utils.Point(x,y));
            rad = getRadius(posDif.x,posDif.y);
            angle = angleFromVector(posDif.x,posDif.y);
        } else {
            // centered //
            rad = tombola.range(1,(longSide*1.1)/units);
            angle = Math.random()*(2 * Math.PI);
        }


        // gen color //
        var cr = tombola.range(b-(v*0.6),b+(v*1.4));
        var cg = tombola.range(b-v,b+v);
        var cb = tombola.range(b-(v*0.6),b+(v*1.4));

        // stay brighter than bg //
        if (cr < bgCol2.R) {
            cr = bgCol2.R;
        }
        if (cg < bgCol2.G) {
            cg = bgCol2.G;
        }
        if (cb < bgCol2.B) {
            cb = bgCol2.B;
        }
        var col = new RGBA( cr, cg, cb, 1);

        // glow //
        if (glowing) {
            var g = tombola.range(80,120);
            var gv = tombola.range(8,30);
            var gb = tombola.item(glowCols);

            var gcol = new RGBA(  tombola.range(gb.R-gv,gb.R+gv), tombola.range(gb.G-gv,gb.G+gv), tombola.range(gb.B-gv,gb.B+gv), tombola.range(10,80)/100);
            stars.push( new Star( rad, angle, gcol, (tombola.range(s*1.5,s*2)/100), 2) );
        }

        // create star object and add it to the list //
        stars.push( new Star( rad, angle, col, (s / 100), ctx) );
    }

    // sort stars in order of brightness //
    stars.sort(compareBrightness);


    return {
        stars: stars,
        origin: [CSX,CSY],
        hemisphere: hemisphere,
        shutter: shutter,
        bgCols: [bgCol,bgCol2],
        masterCol: masterCol
    };
};

//-------------------------------------------------------------------------------------------
//  LOOP
//-------------------------------------------------------------------------------------------

// gets called multiple times (loop length dependent on shutter time) to rotate the stars.

StarTrails.prototype.update = function(data) {

    var length = data.stars.length;
    var cutoff = 500;
    var rate = 19;

    // PLOT STAR PATHS //
    for(var i=0;i<length;i++) {

        var star = data.stars[i];
        star.angle -= ( (((2 * Math.PI) / 360) * tempo) *data.hemisphere);


        // ANGLE //
        star.position.x = Math.cos(star.angle) * star.rad;
        star.position.y = Math.sin(star.angle) * star.rad;


        // DRAW READY //
        // an easing curve is used to determine how often each star should be drawn. Stars
        // close to the center should be drawn less as the aliasing becomes too pixelly because
        // they are moving smaller distances than those at larger radii from the center.

        star.ready -= 1;
        if (star.ready<0) {
            if (star.rad>=cutoff) {
                star.ready = 0;
            }
            star.ready = Math.floor(easeOutExpo(star.rad,rate,-rate,cutoff));
        }
    }

};

//-------------------------------------------------------------------------------------------
//  MATHS
//-------------------------------------------------------------------------------------------


function easeOutExpo(t, b, c, d) {
    return c * ( -Math.pow( 2, -10 * t/d ) + 1 ) + b;
}

function compareBrightness(a,b) {
    if ((a.color.R + a.color.G + a.color.B) < (b.color.R + b.color.G + b.color.B))
        return 1;
    if ((a.color.R + a.color.G + a.color.B) > (b.color.R + b.color.G + b.color.B))
        return -1;
    return 0;
}

function pointDif(p1,p2) {
    return new utils.Point(p1.x - p2.x, p1.y - p2.y);
}

function getRadius(a,b) {
    return Math.sqrt((a*a)+(b*b));
}

function angleFromVector(a,b) {
    return Math.atan2(a,b);
}

function Star(rad,angle,color,size,ctx) {
    this.position = new utils.Point(rad,0);
    this.angle = angle;
    this.rad = rad;
    this.color = color;
    this.size = size;
    this.ctx = ctx || 1;
    this.ready = 1;
}

module.exports = StarTrails;