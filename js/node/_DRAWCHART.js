var utils = require('./utils');
var RGBA = require('./RGBA');
var GenChart = require('./_GENCHART');
var chart = new GenChart();

// COLORS //
var bgCols = [new RGBA(10,15,22,1), new RGBA(255,236,88,1), new RGBA(30,34,37,1), new RGBA(120,122,124,1), new RGBA(25,29,32,1)];
var graphCols = [new RGBA(235,26,76,1), new RGBA(39,37,46,1,1), new RGBA(75,254,170,1), new RGBA(172,26,240,1), new RGBA(245,243,233,1), new RGBA(10,10,10,1), new RGBA(61,21,71,1), new RGBA(174,0,232,1), new RGBA(156,0,235,1), new RGBA(0,46,196,1), new RGBA(88,28,237,1), new RGBA(162,0,255,1), new RGBA(0,166,255,1), new RGBA(255,0,89,1), new RGBA(195,0,145,1), new RGBA(104,0,156,1), new RGBA(42,23,61,1), new RGBA(237,21,86,1), new RGBA(41,37,48,1), new RGBA(149,129,148,1), new RGBA(6,209,91,1), new RGBA(50,240,220,1), new RGBA(115,90,120,1), new RGBA(200,200,200,1), new RGBA(39,40,41,1)];




//-------------------------------------------------------------------------------------------
//  MAIN
//-------------------------------------------------------------------------------------------

/*function RGBA( r, g, b, a ) {
    this.R = r;
    this.G = g;
    this.B = b;
    this.A = a;
}*/


function Draw() {

    this.fullX = 3000;
    this.fullY = 1850;
    this.halfX = Math.round(this.fullX/2);
    this.halfY = Math.round(this.fullY/2);

    var u = (this.fullX);
    this.units = (u/910);

    // TEXT SIZES //
    this.headerType = Math.round(u/12);
    this.midType = Math.round(u/45);
    this.bodyType = Math.round(u/65);
    this.dataType = Math.round(u/82);
    this.subType = Math.round(u/100);



    var Canvas = require('canvas')
        , Image = Canvas.Image;

    this.canvas = new Canvas(this.fullX, this.fullY);
    this.cxa = this.canvas.getContext('2d');
}


Draw.prototype.fillBackground = function(cxa) {
    color.master = new RGBA(0,0,0,0);
    color.lowPass = new RGBA(-4,-4,-4,0);
    color.fill(cxa,bgCols[4]);
    cxa.fillRect(0,0,this.fullX,this.fullY);
    color.lowPass = new RGBA(0,0,0,0);
};


//-------------------------------------------------------------------------------------------
//  WAVEFORM SECTION
//-------------------------------------------------------------------------------------------

Draw.prototype.drawWaveformChart = function(data) {

    var cxa = this.cxa;
    var units = this.units;
    var halfX = this.halfX;
    var halfY = this.halfY;
    var gutter = (40*this.units);
    var width = (658*this.units);
    var third = (width/3) - (gutter/2);

    // bg //
    this.fillBackground(cxa);
    color.master = new RGBA(1,-3,2,0);

    // TT //
    this.drawLogo((75*this.units), (55*this.units), 25*this.units,new RGBA(70,255,240,1),new RGBA(255,255,255,1));


    color.fillRGBA(cxa,230,230,230,1);
    color.strokeRGBA(cxa,230,230,230,1);

    // title
    cxa.textAlign = 'left';
    cxa.font = "400 " + this.midType + "px Cabin";
    cxa.fillText('REPEATED WAVEFORM',this.units*125, this.units*54);
    cxa.font = "400 " + this.dataType + "px Cabin";
    cxa.fillText('Recurring Audio Section',this.units*125, this.units*70);




    // chart //
    var sx = halfX - ((third * 1.5) + gutter);

    this.drawWaveSection(data.map, halfX - (width/2), halfY, width, 150*units);


    // text //
    cxa.lineWidth = this.units*2;
    color.strokeRGBA(cxa,230,230,230,1);
    color.fillRGBA(cxa,230,230,230,1);

    // paragraph //
    cxa.font = "400 " + this.dataType + "px Cabin";
    wordWrap(cxa, data.paragraph, sx + (third+gutter), this.halfY + (170*this.units) + this.dataType, this.dataType*1.5, third);

    // meta data //
    cxa.fillText(data.date.string,sx + ((third+gutter)*2), this.halfY + (170*this.units) + this.dataType);
    cxa.fillText(data.time.short,sx + ((third+gutter)*2) + (third*0.7), this.halfY + (170*this.units) + this.dataType);
    cxa.beginPath();
    cxa.moveTo(sx + ((third+gutter)*2), this.halfY + this.dataType + (170*this.units) + (this.dataType * 1.2));
    cxa.lineTo(sx + ((third+gutter)*2) + third, this.halfY + this.dataType + (170*this.units) + (this.dataType * 1.2));
    cxa.stroke();
    cxa.fillText(data.id.string,sx + ((third+gutter)*2), this.halfY + (170*this.units) + this.dataType + ((this.dataType * 1.5)*2));


    cxa.font = "400 " + this.subType + "px Cabin";
    cxa.fillText('trunc: ',sx + ((third+gutter)*2), this.halfY + (170*this.units) + this.dataType + ((this.dataType * 1.5)*3));
    cxa.textAlign = "right";
    cxa.fillText('cat: ',sx + ((third+gutter)*2) + (third*0.8), this.halfY + (170*this.units) + this.dataType + ((this.dataType * 1.5)*2));
    cxa.textAlign = "center";
    cxa.font = "400 " + this.midType + "px Cabin";
    cxa.fillText(data.cat.strict,sx + ((third+gutter)*2) + (third*0.92), this.halfY + (171*this.units) + this.dataType + ((this.dataType * 1.5)*3));
    cxa.textAlign = "left";


    var bx = 7 * this.units;
    cxa.beginPath();
    cxa.moveTo(sx + ((third+gutter)*2) + (third*0.15), this.halfY + (175*this.units) + ((this.dataType * 1.5)*3));
    cxa.lineTo(sx + ((third+gutter)*2) + (third*0.15) + bx, this.halfY + (175*this.units) + ((this.dataType * 1.5)*3));
    cxa.lineTo(sx + ((third+gutter)*2) + (third*0.15) + bx, this.halfY + (175*this.units) + ((this.dataType * 1.5)*3) + bx);
    cxa.lineTo(sx + ((third+gutter)*2) + (third*0.15), this.halfY + (175*this.units) + ((this.dataType * 1.5)*3) + bx);
    cxa.closePath();
    cxa.stroke();




    cxa.beginPath();
    cxa.moveTo(sx + ((third+gutter)*2) + (third*0.84), this.halfY + (159*this.units) + ((this.dataType * 1.5)*3));
    cxa.lineTo(sx + ((third+gutter)*2) + (third), this.halfY + (159*this.units) + ((this.dataType * 1.5)*3));
    cxa.lineTo(sx + ((third+gutter)*2) + (third), this.halfY + (159*this.units) + ((this.dataType * 1.5)*3) + (third*0.16));
    cxa.lineTo(sx + ((third+gutter)*2) + (third*0.84), this.halfY + (159*this.units) + ((this.dataType * 1.5)*3) + (third*0.16));
    cxa.closePath();
    cxa.stroke();

    cxa.lineWidth = units*0.5;
    if (data.truncated) {
        cxa.beginPath();
        cxa.moveTo(sx + ((third+gutter)*2) + (third*0.15), this.halfY + (175*this.units) + ((this.dataType * 1.5)*3));
        cxa.lineTo(sx + ((third+gutter)*2) + (third*0.15) + bx, this.halfY + (175*this.units) + ((this.dataType * 1.5)*3) + bx);
        cxa.moveTo(sx + ((third+gutter)*2) + (third*0.15) + bx, this.halfY + (175*this.units) + ((this.dataType * 1.5)*3));
        cxa.lineTo(sx + ((third+gutter)*2) + (third*0.15), this.halfY + (175*this.units) + ((this.dataType * 1.5)*3) + bx);
        cxa.stroke();
    }

};


Draw.prototype.drawWaveSection = function(data, x, y, w, h) {

    var l = data[0].length;
    var sw = w / l;
    var cxa = this.cxa;
    var i;

    // dash line divides //
    /*color.strokeRGBA(cxa,230,230,230,1);
    cxa.lineWidth = this.units*0.25;
    cxa.beginPath();
    var dw = this.units*2;
    var ds = this.units*9;
    for (i=0; i<(w/ds); i++) {
        cxa.moveTo(x + (i*ds), y);
        cxa.lineTo(x + (i*ds) + dw, y);
    }
    cxa.stroke();*/

    cxa.lineWidth = this.units*2;
    color.strokeRGBA(cxa,230,230,230,1);

    for (var j=0; j<data.length; j++) {
        var a = data[j][0];

        //cxa.beginPath();
        //cxa.moveTo(x, y + (h*a));

        for (i=0; i<l; i++) {

            a = data[j][i];


            var grad=cxa.createLinearGradient(0,y+(h*a),0,y);
            grad.addColorStop(0,color.string(new RGBA(255,255,255,1)));
            grad.addColorStop(0.1,color.string(new RGBA(255,255,255,1)));
            grad.addColorStop(0.5,color.string(new RGBA(255,255,255,0)));
            cxa.fillStyle = grad;

            cxa.fillRect(x + (sw*i),y,sw*2,(h*a));


            //cxa.lineTo(x + (sw*i), y + (h*a));
        }


        //cxa.stroke();

    }
    cxa.globalAlpha = 1;

};


//-------------------------------------------------------------------------------------------
//  PERIODIC WAVES
//-------------------------------------------------------------------------------------------

Draw.prototype.drawPeriodicWaveChart = function(data) {

    var cxa = this.cxa;
    var units = this.units;
    var halfX = this.halfX;
    var halfY = this.halfY;
    var gutter = (40*this.units);
    var third = ((638*this.units)/3) - (gutter/2);
    var thirdY = (115*units);


    // bg //
    this.fillBackground(cxa);
    color.master = new RGBA(1,-3,2,0);

    // TT //
    this.drawLogo((75*this.units), (55*this.units), 25*this.units,new RGBA(70,255,240,1),new RGBA(255,255,255,1));


    color.fillRGBA(cxa,230,230,230,1);
    color.strokeRGBA(cxa,230,230,230,1);

    // title
    cxa.textAlign = 'left';
    cxa.font = "400 " + this.midType + "px Cabin";
    cxa.fillText('PERIODIC WAVEFORMS',this.units*125, this.units*54);
    cxa.font = "400 " + this.dataType + "px Cabin";
    cxa.fillText('Observed Repeating Waves',this.units*125, this.units*70);




    // chart //
    var sx = halfX - ((third * 1.5) + gutter);
    var sy = halfY - thirdY;

    for (var y=0; y<3; y++) {
        for (var x=0; x<3; x++) {
            this.drawPeriodicWave(data.waves[(y*3)+x], sx + (x * (third+gutter)), sy + (y * thirdY), third, 32*units);
        }
    }

    // text //
    cxa.lineWidth = this.units*2;
    color.strokeRGBA(cxa,230,230,230,1);

    // paragraph //
    cxa.font = "400 " + this.dataType + "px Cabin";
    wordWrap(cxa, data.paragraph, sx + (third+gutter), this.halfY + (190*this.units) + this.dataType, this.dataType*1.5, third);

    // meta data //
    cxa.fillText('Received (multiple):',sx + ((third+gutter)*2), this.halfY + (190*this.units) + this.dataType);
    cxa.beginPath();
    cxa.moveTo(sx + ((third+gutter)*2), this.halfY + this.dataType + (190*this.units) + (this.dataType * 1.2));
    cxa.lineTo(sx + ((third+gutter)*2) + third, this.halfY + this.dataType + (190*this.units) + (this.dataType * 1.2));
    cxa.stroke();
    cxa.fillText(data.received,sx + ((third+gutter)*2), this.halfY + (190*this.units) + this.dataType + ((this.dataType*1.5)*2));
};



Draw.prototype.drawPeriodicWave = function(data, x, y, w, h) {

    var l = data.map.length;
    var sw = w / l;
    var cxa = this.cxa;

    color.fillRGBA(this.cxa,230,230,230,1);
    cxa.font = "400 " + this.subType + "px Cabin";
    cxa.fillText(data.id.string, x, y - h - (10*this.units));

    // dash line divides //
    color.strokeRGBA(cxa,230,230,230,1);
    cxa.lineWidth = this.units*0.25;
    cxa.beginPath();
    var dw = this.units*2;
    var ds = this.units*9;
    for (var i=0; i<(w/ds); i++) {
        cxa.moveTo(x + (i*ds), y);
        cxa.lineTo(x + (i*ds) + dw, y);
    }
    cxa.stroke();

    cxa.lineWidth = this.units*2;
    color.strokeRGBA(cxa,230,230,230,1);
    //color.strokeRGBA(cxa,70,255,240,1);
    //color.strokeRGBA(cxa,255,194,10,1);
    cxa.beginPath();
    var a = data.map[0];
    cxa.moveTo(x, y + (h*a));

    for (i=1; i<l; i++) {
        a = data.map[i];
        cxa.lineTo(x + (sw*i), y + (h*a));
    }
    cxa.stroke();
};


//-------------------------------------------------------------------------------------------
//  STEREO IMAGE
//-------------------------------------------------------------------------------------------

Draw.prototype.drawVectorScopeChart = function(data) {

    var cxa = this.cxa;
    var units = this.units;
    var halfX = this.halfX;
    var halfY = this.halfY;
    var gutter = (40*this.units);
    var third = (((700*this.units)-(40*this.units))/3) - (gutter/2);

    // temp //
    var c1 = 17;
    var c2 = 18;


    // bg //
    this.fillBackground(cxa);
    color.master = new RGBA(3,-5,4,0);

    // set size //
    var ls = 145*units;
    var ss = 15*units;



    this.drawLogo((75*this.units), (55*this.units), 25*this.units,new RGBA(70,255,240,1),new RGBA(255,255,255,1));


    color.fillRGBA(cxa,230,230,230,1);
    color.strokeRGBA(cxa,230,230,230,1);

    // title
    cxa.textAlign = 'left';
    cxa.font = "400 " + this.midType + "px Cabin";
    cxa.fillText('STEREO PHASE IMAGE',this.units*125, this.units*54);
    cxa.font = "400 " + this.dataType + "px Cabin";
    cxa.fillText('Phase Corellation over Time',this.units*125, this.units*70);

    // text //
    var thirdX = (third * 1.5) + gutter;
    cxa.lineWidth = this.units*2;

    // paragraph //
    cxa.font = "400 " + this.dataType + "px Cabin";
    wordWrap(cxa, data.paragraph, this.halfX - thirdX, this.halfY + (170*this.units) + this.dataType, this.dataType*1.5, third);

    // meta data //
    cxa.fillText(data.date.string,this.halfX - thirdX + (third+gutter), this.halfY + (170*this.units) + this.dataType);
    cxa.fillText(data.time.short,this.halfX - thirdX + (third+gutter) + (third*0.6), this.halfY + (170*this.units) + this.dataType);
    cxa.beginPath();
    cxa.moveTo(this.halfX - thirdX + (third+gutter), this.halfY + this.dataType + (170*this.units) + (this.dataType * 1.2));
    cxa.lineTo(this.halfX - thirdX + (third+gutter) + third, this.halfY + this.dataType + (170*this.units) + (this.dataType * 1.2));
    cxa.stroke();
    cxa.fillText(data.id.string,this.halfX - thirdX + (third+gutter), this.halfY + (170*this.units) + this.dataType + ((this.dataType * 1.5)*2));

    cxa.font = "400 " + this.subType + "px Cabin";
    cxa.fillText('trunc: ',this.halfX - thirdX + (third+gutter), this.halfY + (170*this.units) + this.dataType + ((this.dataType * 1.5)*3));
    cxa.textAlign = "right";
    cxa.fillText('cat: ',this.halfX - thirdX + (third+gutter) + (third*0.8), this.halfY + (170*this.units) + this.dataType + ((this.dataType * 1.5)*2));
    cxa.textAlign = "center";
    cxa.font = "400 " + this.midType + "px Cabin";
    cxa.fillText(data.cat.strict,this.halfX - thirdX + (third+gutter) + (third*0.92), this.halfY + (171*this.units) + this.dataType + ((this.dataType * 1.5)*3));
    cxa.textAlign = "left";

    var bx = 7 * this.units;
    cxa.beginPath();
    cxa.moveTo(this.halfX - thirdX + (third+gutter) + (third*0.15), this.halfY + (175*this.units) + ((this.dataType * 1.5)*3));
    cxa.lineTo(this.halfX - thirdX + (third+gutter) + (third*0.15) + bx, this.halfY + (175*this.units) + ((this.dataType * 1.5)*3));
    cxa.lineTo(this.halfX - thirdX + (third+gutter) + (third*0.15) + bx, this.halfY + (175*this.units) + ((this.dataType * 1.5)*3) + bx);
    cxa.lineTo(this.halfX - thirdX + (third+gutter) + (third*0.15), this.halfY + (175*this.units) + ((this.dataType * 1.5)*3) + bx);
    cxa.closePath();
    cxa.stroke();




    cxa.beginPath();
    cxa.moveTo(this.halfX - thirdX + (third+gutter) + (third*0.84), this.halfY + (159*this.units) + ((this.dataType * 1.5)*3));
    cxa.lineTo(this.halfX - thirdX + (third+gutter) + (third), this.halfY + (159*this.units) + ((this.dataType * 1.5)*3));
    cxa.lineTo(this.halfX - thirdX + (third+gutter) + (third), this.halfY + (159*this.units) + ((this.dataType * 1.5)*3) + (third*0.16));
    cxa.lineTo(this.halfX - thirdX + (third+gutter) + (third*0.84), this.halfY + (159*this.units) + ((this.dataType * 1.5)*3) + (third*0.16));
    cxa.closePath();
    cxa.stroke();

    cxa.font = "400 " + this.subType + "px Cabin";
    cxa.fillText('amplitude',this.halfX - thirdX + ((third+gutter)*2), this.halfY + (200*this.units));


    cxa.lineWidth = units*0.5;
    if (data.truncated) {
        cxa.beginPath();
        cxa.moveTo(this.halfX - thirdX + (third+gutter) + (third*0.15), this.halfY + (175*this.units) + ((this.dataType * 1.5)*3));
        cxa.lineTo(this.halfX - thirdX + (third+gutter) + (third*0.15) + bx, this.halfY + (175*this.units) + ((this.dataType * 1.5)*3) + bx);
        cxa.moveTo(this.halfX - thirdX + (third+gutter) + (third*0.15) + bx, this.halfY + (175*this.units) + ((this.dataType * 1.5)*3));
        cxa.lineTo(this.halfX - thirdX + (third+gutter) + (third*0.15), this.halfY + (175*this.units) + ((this.dataType * 1.5)*3) + bx);
        cxa.stroke();
    }

    // grad key //
    color.fill(cxa, colorBlend( new RGBA(230,30,50,1), new RGBA(255,255,255,1), 10 ) );
    cxa.fillRect( this.halfX - thirdX + ((third+gutter)*2), this.halfY + (170*this.units), third/4, 14*this.units );
    color.fill(cxa, colorBlend( new RGBA(230,30,50,1), new RGBA(255,255,255,1), 35 ) );
    cxa.fillRect( this.halfX - thirdX + ((third+gutter)*2) + (third*0.25), this.halfY + (170*this.units), third/4, 14*this.units );
    color.fill(cxa, colorBlend( new RGBA(230,30,50,1), new RGBA(255,255,255,1), 70 ) );
    cxa.fillRect( this.halfX - thirdX + ((third+gutter)*2) + (third*0.5), this.halfY + (170*this.units), third/4, 14*this.units );
    color.fill(cxa, new RGBA(255,255,255,1) );
    cxa.fillRect( this.halfX - thirdX + ((third+gutter)*2) + (third*0.75), this.halfY + (170*this.units), third/4, 14*this.units );



    // dash line divides //
    cxa.lineWidth = units*0.5;
    cxa.beginPath();
    var dw = units*2;
    var ds = units*6;
    for (var i=0; i<((ls*2)/ds); i++) {
        cxa.moveTo(halfX - (ls + ss) - ls + (i*ds), halfY);
        cxa.lineTo(halfX - (ls + ss) - ls + (i*ds) + dw, halfY);

        cxa.moveTo(halfX + (ls + ss) - ls + (i*ds), halfY);
        cxa.lineTo(halfX + (ls + ss) - ls + (i*ds) + dw, halfY);

        cxa.moveTo(halfX - (ls + ss), halfY - ls + (i*ds));
        cxa.lineTo(halfX - (ls + ss), halfY - ls + (i*ds) + dw);

        cxa.moveTo(halfX + (ls + ss), halfY - ls + (i*ds));
        cxa.lineTo(halfX + (ls + ss), halfY - ls + (i*ds) + dw);
    }
    cxa.stroke();


    color.lowPass = new RGBA(230,30,50,0);


    // CHART IMAGES //
    var scopeMode = chart.vectorScope5;
    cxa.globalAlpha = 1;
    this.drawVectorScope(data.map[0], scopeStyle, scopeMode, ls, units*0.85, halfX - (ls + ss), halfY);
    this.drawVectorScope(data.map[1], scopeStyle, scopeMode, ls, units*0.85, halfX + (ls + ss), halfY);

    /*scopeStyle = 0;
    cxa.globalAlpha = 1;
    this.drawVectorScope(data.map[0], scopeStyle, scopeMode, ls, units*0.85, halfX - (ls +(10*units)), halfY);
    this.drawVectorScope(data.map[1], scopeStyle, scopeMode, ls, units*0.85, halfX + (ls +(10*units)), halfY);
*/
    color.lowPass = new RGBA(0,0,0,0);

    // GRAPH LINES (move to draw) //
    color.fillRGBA(cxa,255,255,255,1);
    color.strokeRGBA(cxa,255,255,255,1);

    cxa.textAlign = 'left';
    cxa.font = "400 " + this.subType + "px Cabin";
    cxa.fillText(''+data.seconds[0]+'-'+data.seconds[1]+' s:', halfX - (ls + ss) - ls, halfY - ls + this.subType);
    cxa.fillText(''+data.seconds[2]+'-'+data.seconds[3]+' s:', halfX + (ls + ss) - ls, halfY - ls + this.subType);

    cxa.textAlign = 'center';
    cxa.font = '400 '+this.bodyType+'px Cabin';
    cxa.fillText('L', halfX - ((ls*1.5) + ss), halfY - ls - (10*units));
    cxa.fillText('R', halfX - ((ls*0.5) + ss), halfY - ls - (10*units));
    cxa.fillText('R', halfX + ((ls*1.5) + ss), halfY - ls - (10*units));
    cxa.fillText('L', halfX + ((ls*0.5) + ss), halfY - ls - (10*units));

    cxa.lineWidth = units*2;
    cxa.beginPath();
    // L
    cxa.moveTo(halfX - (ls + ss),halfY - (5*units) + ls);
    cxa.lineTo(halfX - (ls + ss),halfY + ls);

    cxa.moveTo(halfX - (ls + ss),halfY + (5*units) - ls);
    cxa.lineTo(halfX - (ls + ss),halfY - ls);

    cxa.moveTo(halfX - (ls + ss) - ls,halfY);
    cxa.lineTo(halfX - (ls + ss) + (5*units) - ls,halfY);

    cxa.moveTo(halfX - (ls + ss) + ls,halfY);
    cxa.lineTo(halfX - (ls + ss) - (5*units) + ls,halfY);

    cxa.moveTo(halfX - (ls + ss) - (10*units),halfY);
    cxa.lineTo(halfX - (ls + ss) + (10*units),halfY);
    cxa.moveTo(halfX - (ls + ss),halfY - (10*units));
    cxa.lineTo(halfX - (ls + ss),halfY + (10*units));

    // R
    cxa.moveTo(halfX + (ls + ss),halfY - (5*units) + ls);
    cxa.lineTo(halfX + (ls + ss),halfY + ls);

    cxa.moveTo(halfX + (ls + ss),halfY + (5*units) - ls);
    cxa.lineTo(halfX + (ls + ss),halfY - ls);

    cxa.moveTo(halfX + (ls + ss) - ls,halfY);
    cxa.lineTo(halfX + (ls + ss) + (5*units) - ls,halfY);

    cxa.moveTo(halfX + (ls + ss) + ls,halfY);
    cxa.lineTo(halfX + (ls + ss) - (5*units) + ls,halfY);

    cxa.moveTo(halfX + (ls + ss) - (10*units),halfY);
    cxa.lineTo(halfX + (ls + ss) + (10*units),halfY);
    cxa.moveTo(halfX + (ls + ss),halfY - (10*units));
    cxa.lineTo(halfX + (ls + ss),halfY + (10*units));

    cxa.stroke();



    cxa.lineWidth = units;
    cxa.beginPath();

    // +
    cxa.moveTo(halfX + ((ls +(30*units))*2),halfY - (60*units));
    cxa.lineTo(halfX + ((ls +(30*units))*2),halfY - (40*units));
    cxa.lineTo(halfX + ((ls +(30*units))*2) + (20*units),halfY - (40*units));
    cxa.lineTo(halfX + ((ls +(30*units))*2) + (20*units),halfY - (60*units));
    cxa.lineTo(halfX + ((ls +(30*units))*2),halfY - (60*units));

    cxa.moveTo(halfX + ((ls +(30*units))*2) + (5*units),halfY - (50*units));
    cxa.lineTo(halfX + ((ls +(30*units))*2) + (15*units),halfY - (50*units));
    cxa.moveTo(halfX + ((ls +(30*units))*2) + (10*units),halfY - (55*units));
    cxa.lineTo(halfX + ((ls +(30*units))*2) + (10*units),halfY - (45*units));

    // -
    cxa.moveTo(halfX + ((ls +(30*units))*2),halfY + (60*units));
    cxa.lineTo(halfX + ((ls +(30*units))*2),halfY + (40*units));
    cxa.lineTo(halfX + ((ls +(30*units))*2) + (20*units),halfY + (40*units));
    cxa.lineTo(halfX + ((ls +(30*units))*2) + (20*units),halfY + (60*units));
    cxa.lineTo(halfX + ((ls +(30*units))*2),halfY + (60*units));

    cxa.moveTo(halfX + ((ls +(30*units))*2) + (5*units),halfY + (50*units));
    cxa.lineTo(halfX + ((ls +(30*units))*2) + (15*units),halfY + (50*units));
    cxa.stroke();


    color.master = new RGBA(0,0,0,0);
};


Draw.prototype.drawVectorScope = function(channels,style,func,scale,line,x,y) {
    var i;
    var m = 0;
    var l = channels[0].length;
    var sx = 0;
    var cxa = this.cxa;
    var units = this.units;
    cxa.lineWidth = line;


    // NORMALISE SAMPLE //
    for (i=0; i<l; i++) {
        if (channels[0][i]>m) m = channels[0][i];
        if (channels[1][i]>m) m = channels[1][i];
        if (-channels[0][i]>m) m = -channels[0][i];
        if (-channels[1][i]>m) m = -channels[1][i];
    }


    if (style==1) { cxa.beginPath(); }
    // CALCULATE & DRAW //
    for (i=0; i<l; i+=2) {
        var signal = [ (channels[0][i] * (1/m)), (channels[1][i] * (1/m)) ] ;


        var pos = func(signal,scale);
        color.stroke(cxa,pos[2]);

        switch (style) {
            case 0:
                cxa.fillRect(x + pos[0],y + pos[1],line,line);
                break;
            case 1:
                if (i===0) { cxa.moveTo(x + pos[0],y + pos[1]); }
                else { cxa.lineTo(x + pos[0],y + pos[1]); }
                break;
            case 2:
                if (func===chart.vectorScope2) { sx = pos[0]; }
                cxa.beginPath();
                cxa.moveTo(x + sx,y);
                cxa.lineTo(x + pos[0],y + pos[1]);
                cxa.stroke();
                break;
        }

    }
    if (style==1) { cxa.stroke(); }
};



//-------------------------------------------------------------------------------------------
//  FREQUENCY SPECTRUM
//-------------------------------------------------------------------------------------------


Draw.prototype.drawTimeSpectrumChart = function(data) {



    var cxa = this.cxa;

    // bg //
    this.fillBackground(cxa);
    color.master = new RGBA(1,-3,2,0);
    //color.master = new RGBA(3,-5,4,0);

    // metrics //
    var l = data.map.length;
    var step = (10 * (20/l))*this.units;
    var w = 500*this.units;
    var h = 130*this.units;
    var margin = (step * (l-1));
    var x = this.halfX - ((w + margin) * 0.5) + margin;
    var y = this.halfY - (margin * 0.5);
    var gutter = (40*this.units);
    var third = (((w+margin)-(40*this.units))/3) - (gutter/2);

    // cols //
    var c1,c2;
    c1 = 21; //17
    c2 = 22; // 18

    c1 = 17;
    c2 = 18;
    c1 = 0;
    c2 = 24;
    c2 = 1;

    this.drawLogo((75*this.units), (55*this.units), 25*this.units,new RGBA(70,255,240,1),new RGBA(255,255,255,1));


    // frequency markers //
    cxa.lineWidth = this.units*0.5;
    color.fillRGBA(cxa,255,255,255,1);
    color.strokeRGBA(cxa,255,255,255,1);
    var markY = this.halfY + (margin * 0.5);
    var markH = (20*this.units);
    var xPos, yPos;
    var markers = [10,20,50,100,200,1000,2000,5000,10000,20000];
    var markerNames = ["Hz","20","50","100","200","1k","2k","5k","10k","20k"];
    cxa.textAlign = "center";
    cxa.font = "400 " + this.subType + "px Cabin";

    for (i=0; i<markers.length; i++) {
        xPos = utils.logPosition(0,w,10,40000,markers[i]);
        cxa.fillText(markerNames[i],this.halfX - ((w+margin)*0.5) + xPos - markH + (2.5*this.units), markY + markH);

        if (i!==0) {
            cxa.beginPath();
            cxa.moveTo(this.halfX - ((w+margin)*0.5) + xPos - (10*this.units), markY + markH - (10*this.units));
            cxa.lineTo(this.halfX - ((w+margin)*0.5) + xPos - (5*this.units), markY + markH - (15*this.units));
            cxa.stroke();
        }
    }


    // seconds markers //
    cxa.textAlign = "left";
    for (i=0; i<data.seconds.length; i++) {
        xPos = (20*this.units) - ((margin/(data.seconds.length-1))*i);
        yPos = ((margin/(data.seconds.length-1))*i);

        var txt = ''+data.seconds[i];
        if (i===(data.seconds.length-1)) txt = ''+data.seconds[i]+'  seconds';
        cxa.fillText(txt,this.halfX + ((w+margin)*0.5) + xPos, this.halfY - (margin * 0.5) + yPos + (2.5*this.units));

        cxa.beginPath();
        cxa.moveTo(this.halfX + ((w+margin)*0.5) + xPos - (7.5*this.units), this.halfY - (margin * 0.5) + yPos);
        cxa.lineTo(this.halfX + ((w+margin)*0.5) + xPos - (12.5*this.units), this.halfY - (margin * 0.5) + yPos);
        cxa.stroke();
    }

    // back markers //
    cxa.lineWidth = this.units*2;
    color.strokeRGBA(cxa,255,255,255,1);
    cxa.beginPath();
    // L
    /*cxa.moveTo(x, y - h + step + (10*this.units));
    cxa.lineTo(x, y - h + step);
    cxa.lineTo(x + (10*this.units), y - h + step);*/

    cxa.moveTo(x + w, y - h + step + (10*this.units));
    cxa.lineTo(x + w, y - h + step);
    cxa.lineTo(x + w - (10*this.units), y - h + step);
    cxa.stroke();



    // text //
    var thirdX = (third * 1.5) + gutter;


    // title
    cxa.font = "400 " + this.midType + "px Cabin";
    cxa.fillText('AUDIO FREQUENCY RESPONSE',this.units*125, this.units*54);
    cxa.font = "400 " + this.dataType + "px Cabin";
    cxa.fillText('Cascade over Time',this.units*125, this.units*70);




    // paragraph //
    cxa.font = "400 " + this.dataType + "px Cabin";
    wordWrap(cxa, data.paragraph, this.halfX - thirdX, this.halfY + (170*this.units) + this.dataType, this.dataType*1.5, third);

    // meta data //
    cxa.fillText(data.date.string,this.halfX - thirdX + (third+gutter), this.halfY + (170*this.units) + this.dataType);
    cxa.fillText(data.time.short,this.halfX - thirdX + (third+gutter) + (third*0.6), this.halfY + (170*this.units) + this.dataType);
    cxa.beginPath();
    cxa.moveTo(this.halfX - thirdX + (third+gutter), this.halfY + this.dataType + (170*this.units) + (this.dataType * 1.2));
    cxa.lineTo(this.halfX - thirdX + (third+gutter) + third, this.halfY + this.dataType + (170*this.units) + (this.dataType * 1.2));
    cxa.stroke();
    cxa.fillText(data.id.string,this.halfX - thirdX + (third+gutter), this.halfY + (170*this.units) + this.dataType + ((this.dataType * 1.5)*2));

    cxa.font = "400 " + this.subType + "px Cabin";
    cxa.fillText('trunc: ',this.halfX - thirdX + (third+gutter), this.halfY + (170*this.units) + this.dataType + ((this.dataType * 1.5)*3));
    cxa.textAlign = "right";
    cxa.fillText('cat: ',this.halfX - thirdX + (third+gutter) + (third*0.8), this.halfY + (170*this.units) + this.dataType + ((this.dataType * 1.5)*2));
    cxa.textAlign = "center";
    cxa.font = "400 " + this.midType + "px Cabin";
    cxa.fillText(data.cat.strict,this.halfX - thirdX + (third+gutter) + (third*0.92), this.halfY + (171*this.units) + this.dataType + ((this.dataType * 1.5)*3));
    cxa.textAlign = "left";

    var bx = 7 * this.units;
    cxa.beginPath();
    cxa.moveTo(this.halfX - thirdX + (third+gutter) + (third*0.15), this.halfY + (175*this.units) + ((this.dataType * 1.5)*3));
    cxa.lineTo(this.halfX - thirdX + (third+gutter) + (third*0.15) + bx, this.halfY + (175*this.units) + ((this.dataType * 1.5)*3));
    cxa.lineTo(this.halfX - thirdX + (third+gutter) + (third*0.15) + bx, this.halfY + (175*this.units) + ((this.dataType * 1.5)*3) + bx);
    cxa.lineTo(this.halfX - thirdX + (third+gutter) + (third*0.15), this.halfY + (175*this.units) + ((this.dataType * 1.5)*3) + bx);
    cxa.closePath();
    cxa.stroke();




    cxa.beginPath();
    cxa.moveTo(this.halfX - thirdX + (third+gutter) + (third*0.84), this.halfY + (159*this.units) + ((this.dataType * 1.5)*3));
    cxa.lineTo(this.halfX - thirdX + (third+gutter) + (third), this.halfY + (159*this.units) + ((this.dataType * 1.5)*3));
    cxa.lineTo(this.halfX - thirdX + (third+gutter) + (third), this.halfY + (159*this.units) + ((this.dataType * 1.5)*3) + (third*0.16));
    cxa.lineTo(this.halfX - thirdX + (third+gutter) + (third*0.84), this.halfY + (159*this.units) + ((this.dataType * 1.5)*3) + (third*0.16));
    cxa.closePath();
    cxa.stroke();

    cxa.font = "400 " + this.subType + "px Cabin";
    cxa.fillText('frequency amplitude',this.halfX - thirdX + ((third+gutter)*2), this.halfY + (200*this.units));


    cxa.lineWidth = this.units*0.5;
    if (data.truncated) {
        cxa.beginPath();
        cxa.moveTo(this.halfX - thirdX + (third+gutter) + (third*0.15), this.halfY + (175*this.units) + ((this.dataType * 1.5)*3));
        cxa.lineTo(this.halfX - thirdX + (third+gutter) + (third*0.15) + bx, this.halfY + (175*this.units) + ((this.dataType * 1.5)*3) + bx);
        cxa.moveTo(this.halfX - thirdX + (third+gutter) + (third*0.15) + bx, this.halfY + (175*this.units) + ((this.dataType * 1.5)*3));
        cxa.lineTo(this.halfX - thirdX + (third+gutter) + (third*0.15), this.halfY + (175*this.units) + ((this.dataType * 1.5)*3) + bx);
        cxa.stroke();
    }

    // grad key //

    color.fill(cxa, colorBlend( graphCols[c2], graphCols[c1], 10 ) );
    cxa.fillRect( this.halfX - thirdX + ((third+gutter)*2), this.halfY + (170*this.units), third/4, 14*this.units );
    color.fill(cxa, colorBlend( graphCols[c2], graphCols[c1], 75 ) );
    cxa.fillRect( this.halfX - thirdX + ((third+gutter)*2) + (third*0.25), this.halfY + (170*this.units), third/4, 14*this.units );
    color.fill(cxa, colorBlend( graphCols[c1], new RGBA(255,255,255,1), 40 ) );
    cxa.fillRect( this.halfX - thirdX + ((third+gutter)*2) + (third*0.5), this.halfY + (170*this.units), third/4, 14*this.units );
    color.fill(cxa, colorBlend( graphCols[c1], new RGBA(255,255,255,1), 90 ) );
    cxa.fillRect( this.halfX - thirdX + ((third+gutter)*2) + (third*0.75), this.halfY + (170*this.units), third/4, 14*this.units );




    // graph base //
    cxa.globalAlpha = 0.55;
    color.fill(cxa,graphCols[c2]);
    //color.fill(cxa,bgCols[2]);
    cxa.beginPath();
    cxa.moveTo(x + 1, y - 1);
    cxa.lineTo(x + w + 1, y - 1);
    cxa.lineTo(x + w - (step*(l-1)), y + (step*(l-1)));
    cxa.lineTo(x - (step*(l-1)), y + (step*(l-1)));
    cxa.closePath();
    cxa.fill();
    cxa.globalAlpha = 1;

    var sa = 0.63;
    var br = 1.5;
    var col1 = new RGBA(graphCols[c1].R,graphCols[c1].G,graphCols[c1].B,graphCols[c1].A*sa);
    var col2 = new RGBA(graphCols[c2].R,graphCols[c2].G,graphCols[c2].B,graphCols[c2].A*sa);
    var col3 = new RGBA(graphCols[c1].R*br,graphCols[c1].G*br,graphCols[c1].B*br,graphCols[c1].A);
    var col4 = new RGBA(graphCols[c2].R*br,graphCols[c2].G*br,graphCols[c2].B*br,graphCols[c2].A);

    // graph layers //
    for (var i=0; i<l; i++) {
        var grad=cxa.createLinearGradient(0,y-h,0,y);
        grad.addColorStop(0,color.string(new RGBA(255,255,255,sa)));
        grad.addColorStop(0.5,color.string(col1));
        grad.addColorStop(1,color.string(col2));

        var grad2=cxa.createLinearGradient(0,y-h,0,y);
        grad2.addColorStop(0,color.string(new RGBA(255,255,255,sa)));
        grad2.addColorStop(0.5,color.string(col3));
        grad2.addColorStop(1,color.string(col4));



        cxa.fillStyle=grad;




        this.drawTimeSpectrum(data.map[i],x,y,w,h,grad,grad2);
        x -= step;
        y += step;
    }

    //this.noiseLayer(0.02);

    color.master = new RGBA(0,0,0,0);
};


Draw.prototype.drawTimeSpectrum = function(signal,x,y,w,h,fill1,fill2) {

    var cxa = this.cxa;

    //cxa.globalAlpha = 0.6;
    cxa.fillStyle=fill1;
    //color.fill(cxa,graphCols[18]);
    //color.fill(cxa,bgCols[2]);
    cxa.beginPath();
    cxa.moveTo(x,y);
    var l = signal.length;
    for( var j=0; j<l; j++) {
        cxa.lineTo(x + ((w/(l-1))*j),y - (signal[j]*h));
    }
    cxa.lineTo(x + w, y);
    cxa.closePath();
    cxa.fill();

    //cxa.globalAlpha = 1;
    color.fillRGBA(cxa,230,230,230,1);
    color.strokeRGBA(cxa,230,230,230,1);
    cxa.strokeStyle=fill2;
    cxa.beginPath();
    var dot = this.units*0.1;
    cxa.lineWidth = this.units;
    for( j=0; j<l; j++) {
        if (j===0) {
            cxa.moveTo(x + ((w/(l-1))*j),y - (signal[j]*h));
        } else {
            cxa.lineTo(x + ((w/(l-1))*j),y - (signal[j]*h));
        }
        //cxa.fillRect(x + ((w/(l-1))*j) - (dot*0.5),y - (signal[j]*h) - (dot*0.5),dot,dot);
    }
    cxa.stroke();
};

Draw.prototype.drawLogo = function(x,y,s,c1,c2) {

    var cxa = this.cxa;

    color.fill(cxa,c1);
    cxa.beginPath();
    cxa.arc(x,y,s,Math.PI*1.022,Math.PI*1.978); // outer
    cxa.arc(x,y,s*0.6,Math.PI*1.96,Math.PI*1.04,true);
    cxa.fill();

    color.fill(cxa,c2);
    cxa.beginPath();
    cxa.arc(x,y,s,Math.PI*0.888,Math.PI*0.112,true); // outer
    cxa.arc(x,y,s*0.6,Math.PI*0.201,Math.PI*0.799);
    cxa.fill();

    cxa.beginPath();
    cxa.moveTo(x,y + (s*0.1));
    cxa.lineTo(x - (s*0.2), y + (s*0.3));
    cxa.lineTo(x + (s*0.2), y + (s*0.3));
    cxa.closePath();
    cxa.fill();

    cxa.fillRect(x - (s*0.6), y + (s * 1.22), s*1.2, s*0.25);

    cxa.textAlign = "center";
    var f = Math.round(s*0.38);
    var fs = f*1.1;
    cxa.font = "400 " + f + "px Cabin";
    cxa.fillText("A",x - (s*1.5), y - (s*1.5) + (fs*1.5));
    cxa.fillText("R",x - (s*1.5), y - (s*1.5) + (fs*2.5));
    cxa.fillText("P",x - (s*1.5), y - (s*1.5) + (fs*3.5));
};



function wordWrap( context , text, x, y, lineHeight, fitWidth) {
    fitWidth = fitWidth || 0;

    if (fitWidth <= 0)
    {
        context.fillText( text, x, y );
        return;
    }
    var words = text.split(' ');
    var currentLine = 0;
    var idx = 1;
    while (words.length > 0 && idx <= words.length)
    {
        var str = words.slice(0,idx).join(' ');
        var w = context.measureText(str).width;
        if ( w > fitWidth )
        {
            if (idx==1)
            {
                idx=2;
            }
            context.fillText( words.slice(0,idx-1).join(' '), x, y + (lineHeight*currentLine) );
            currentLine++;
            words = words.splice(idx-1);
            idx = 1;
        }
        else
        {idx++;}
    }
    if  (idx > 0)
        context.fillText( words.join(' '), x, y + (lineHeight*currentLine) );
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function colorBlend(col1,col2,percent) {

    var r = col1.R + Math.round((col2.R - col1.R) * (percent/100));
    var g = col1.G + Math.round((col2.G - col1.G) * (percent/100));
    var b = col1.B + Math.round((col2.B - col1.B) * (percent/100));
    var a = col1.A + Math.round((col2.A - col1.A) * (percent/100));

    return new RGBA(r,g,b,a);
}


module.exports = Draw;