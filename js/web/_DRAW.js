/**
 * Created by luketwyman on 03/11/2014.
 */



//-------------------------------------------------------------------------------------------
//  BG
//-------------------------------------------------------------------------------------------


function drawBG() {

    //cxa.globalAlpha = 1;

    setColor(bgCols[0]);
    cxa.fillRect(0,0,fullX,fullY);
}




//-------------------------------------------------------------------------------------------
//  FOREGROUND
//-------------------------------------------------------------------------------------------




function drawScene() {



}

function drawGen() {
    setColor(bgCols[0]);
    cxa.fillRect(0,0,fullX,fullY);
    setRGBA(255,255,255,1);
    /*cxa.textAlign = 'center';
    cxa.font = '400 '+midType+'px Cabin';
    cxa.fillText('RECEIVING', halfX, halfY + (50*units));*/

    var cw = 50*units;
    var cx = halfX - (cw*0.5);
    var cy = halfY + (50*units);
    var rects = tombola.range(9,18);
    for (var i=0; i<rects; i++) {
        cxa.fillRect(cx + ((cw/(rects-1))*i) - (0.5*units),cy - (tombola.range(0,50)*units),units,-tombola.dice(4,18)*units);
    }

}

function drawWave() {
    var l = sampleRate*3;
    var w = 600*units;
    var h = 40*units;
    var cx = halfX - (w*0.5);
    var cy = halfY;
    var sx = w/l;
    var i,j;


    setColor(bgCols[0]);
    cxa.fillRect(0,0,fullX,fullY);
    setRGBA(255,255,255,1);
    cxa.fillRect(cx,cy,w,0.2);
    cxa.fillRect(cx,cy-h,w,0.2);
    cxa.fillRect(cx,cy+h,w,0.2);

    var voice = new Voice(20);
    // things to test //
    var totals = [];
    var tests = [
        //new WalkSmooth(),
        new Glide()
    ];

    var processes = [
        //function(n,n2){totals[n] = tests[n].process(20, 200);},
        //function(n,n2){totals[n] = tests[n].process(10, 10000, -1);}
        function(n,n2){totals[n] = waveArc3(voice,0.3,n2);}
    ];

    // LOOP THROUGH SAMPLES //
    for (i=0; i<l; i++) {

        // LOOP THROUGH TESTS //
        for (j=0; j<tests.length; j++) {

            // PROCESS //
            totals[j] = 0;
            //processes[j](j,i);
            waveArc3(voice,0.3,i);
            totals[j] += voice.amplitude;
            //totals[j] = waveArc(4,i);
            //console.log(totals[j]);


            // DRAW //
            cxa.fillRect(cx + (sx*i),cy + (totals[j] * h),0.2,0.2);
        }
    }
}


function drawTimeSpectrumChart(data,seconds) {

    // bg //
    color.master = new RGBA(1,-3,2,0);
    color.fill(cxa,bgCols[2]);
    cxa.fillRect(0,0,fullX,fullY);

    // metrics //
    var l = data.length;
    var step = (10 * (20/l))*units;
    var w = 500*units;
    var h = 130*units;
    var margin = (step * (l-1));
    var x = halfX - ((w + margin) * 0.5) + margin;
    var y = halfY - (margin * 0.5);

    // cols //
    var c1,c2;
    c1 = 21; //17
    c2 = 22; // 18

    c1 = 17;
    c2 = 18;

    drawLogo(halfX -((w+margin)*0.5) + (20*units), halfY - (margin*0.8), 20*units,new RGBA(70,255,240,1),new RGBA(255,255,255,1));


    // frequency markers //
    //setRGBA(255,255,255,1);
    color.fillRGBA(cxa,255,255,255,1);
    color.strokeRGBA(cxa,255,255,255,1);
    var markY = halfY + (margin * 0.5);
    var markH = (20*units);
    var xPos, yPos;
    var markers = [10,20,50,100,200,1000,2000,5000,10000,20000];
    var markerNames = ["Hz","20","50","100","200","1k","2k","5k","10k","20k"];
    cxa.textAlign = "center";
    cxa.font = "400 " + subType + "px Cabin";

    for (i=0; i<markers.length; i++) {
        xPos = logPosition(0,w,10,40000,markers[i]);
        cxa.fillText(markerNames[i],halfX - ((w+margin)*0.5) + xPos - markH + (2.5*units), markY + markH);

        if (i!==0) {
            cxa.beginPath();
            cxa.moveTo(halfX - ((w+margin)*0.5) + xPos - (10*units), markY + markH - (10*units));
            cxa.lineTo(halfX - ((w+margin)*0.5) + xPos - (5*units), markY + markH - (15*units));
            cxa.stroke();
        }
    }



    // seconds markers //
    cxa.textAlign = "left";
    for (i=0; i<seconds.length; i++) {
        xPos = (20*units) - ((margin/(seconds.length-1))*i);
        yPos = ((margin/(seconds.length-1))*i);

        var txt = ''+seconds[i];
        if (i===(seconds.length-1)) txt = ''+seconds[i]+'  seconds';
        cxa.fillText(txt,halfX + ((w+margin)*0.5) + xPos, halfY - (margin * 0.5) + yPos + (2.5*units));

        cxa.beginPath();
        cxa.moveTo(halfX + ((w+margin)*0.5) + xPos - (7.5*units), halfY - (margin * 0.5) + yPos);
        cxa.lineTo(halfX + ((w+margin)*0.5) + xPos - (12.5*units), halfY - (margin * 0.5) + yPos);
        cxa.stroke();
    }

    // back markers //
    cxa.lineWidth = units*2;
    color.strokeRGBA(cxa,255,255,255,1);
    cxa.beginPath();
    // L
    cxa.moveTo(x, y - h + step + (10*units));
    cxa.lineTo(x, y - h + step);
    cxa.lineTo(x + (10*units), y - h + step);

    cxa.moveTo(x + w, y - h + step + (10*units));
    cxa.lineTo(x + w, y - h + step);
    cxa.lineTo(x + w - (10*units), y - h + step);
    cxa.stroke();
    cxa.lineWidth = units;


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

    // graph layers //
    for (var i=0; i<l; i++) {
        var grad=cxa.createLinearGradient(0,y-h,0,y);
        grad.addColorStop(0,color.string(new RGBA(255,255,255,1)));
        grad.addColorStop(0.5,color.string(graphCols[c1]));
        grad.addColorStop(1,color.string(graphCols[c2]));
        cxa.fillStyle=grad;

        drawTimeSpectrum(data[i],x,y,w,h,grad);
        x -= step;
        y += step;
    }

    color.master = new RGBA(0,0,0,0);
}


function drawTimeSpectrum(signal,x,y,w,h,fill) {

    cxa.globalAlpha = 0.6;
    cxa.fillStyle=fill;
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

    cxa.globalAlpha = 1;
    color.fillRGBA(cxa,230,230,230,1);
    color.strokeRGBA(cxa,230,230,230,1);
    cxa.strokeStyle=fill;
    cxa.beginPath();
    var dot = units*0.1;
    cxa.lineWidth = units;
    for( j=0; j<l; j++) {
        if (j===0) {
            cxa.moveTo(x + ((w/(l-1))*j),y - (signal[j]*h));
        } else {
            cxa.lineTo(x + ((w/(l-1))*j),y - (signal[j]*h));
        }
        //cxa.fillRect(x + ((w/(l-1))*j) - (dot*0.5),y - (signal[j]*h) - (dot*0.5),dot,dot);
    }
    cxa.stroke();
}


function drawVectorScopeChart(data) {
    color.master = new RGBA(3,-5,4,0);
    // bg //
    color.fill(cxa,bgCols[2]);
    cxa.fillRect(0,0,fullX,fullY);


    var ls = 150*units;



    color.lowPass = new RGBA(230,30,50,0);
    //color.lowPass = graphCols[21];
    //color.lowPass = bgCols[2];

    drawLogo(halfX -(ls*2.2) + (20*units), halfY - (ls), 20*units,new RGBA(70,255,240,1),new RGBA(255,255,255,1));

    color.fillRGBA(cxa,230,230,230,1);
    color.strokeRGBA(cxa,230,230,230,1);

    scopeStyle = 2;
    cxa.globalAlpha = 0.05;
    drawVectorScope(data[0], scopeStyle, scopeMode, ls, units*0.85, halfX - (ls +(10*units)), halfY);
    drawVectorScope(data[1], scopeStyle, scopeMode, ls, units*0.85, halfX + (ls +(10*units)), halfY);

    scopeStyle = 0;
    cxa.globalAlpha = 1;
    drawVectorScope(data[0], scopeStyle, scopeMode, ls, units*0.85, halfX - (ls +(10*units)), halfY);
    drawVectorScope(data[1], scopeStyle, scopeMode, ls, units*0.85, halfX + (ls +(10*units)), halfY);

    color.lowPass = new RGBA(0,0,0,0);

    // GRAPH LINES (move to draw) //
    color.fillRGBA(cxa,255,255,255,1);
    color.strokeRGBA(cxa,255,255,255,1);

    cxa.textAlign = 'center';
    cxa.font = '400 '+bodyType+'px Cabin';
    cxa.fillText('L', halfX - ((ls*1.5) + (10*units)), halfY - ls + (5*units));
    cxa.fillText('R', halfX - ((ls*0.5) + (10*units)), halfY - ls + (5*units));
    cxa.fillText('R', halfX + ((ls*1.5) + (10*units)), halfY - ls + (5*units));
    cxa.fillText('L', halfX + ((ls*0.5) + (10*units)), halfY - ls + (5*units));

    cxa.lineWidth = units*2;
    cxa.beginPath();
    // L
    cxa.moveTo(halfX - (ls +(10*units)),halfY - (5*units) + ls);
    cxa.lineTo(halfX - (ls +(10*units)),halfY + ls);

    cxa.moveTo(halfX - (ls +(10*units)),halfY + (5*units) - ls);
    cxa.lineTo(halfX - (ls +(10*units)),halfY - ls);

    cxa.moveTo(halfX - (ls +(10*units)) - ls,halfY);
    cxa.lineTo(halfX - (ls +(10*units)) + (5*units) - ls,halfY);

    cxa.moveTo(halfX - (ls +(10*units)) + ls,halfY);
    cxa.lineTo(halfX - (ls +(10*units)) - (5*units) + ls,halfY);

    cxa.moveTo(halfX - (ls +(10*units)) - (10*units),halfY);
    cxa.lineTo(halfX - (ls +(10*units)) + (10*units),halfY);
    cxa.moveTo(halfX - (ls +(10*units)),halfY - (10*units));
    cxa.lineTo(halfX - (ls +(10*units)),halfY + (10*units));

    // R
    cxa.moveTo(halfX + (ls +(10*units)),halfY - (5*units) + ls);
    cxa.lineTo(halfX + (ls +(10*units)),halfY + ls);

    cxa.moveTo(halfX + (ls +(10*units)),halfY + (5*units) - ls);
    cxa.lineTo(halfX + (ls +(10*units)),halfY - ls);

    cxa.moveTo(halfX + (ls +(10*units)) - ls,halfY);
    cxa.lineTo(halfX + (ls +(10*units)) + (5*units) - ls,halfY);

    cxa.moveTo(halfX + (ls +(10*units)) + ls,halfY);
    cxa.lineTo(halfX + (ls +(10*units)) - (5*units) + ls,halfY);

    cxa.moveTo(halfX + (ls +(10*units)) - (10*units),halfY);
    cxa.lineTo(halfX + (ls +(10*units)) + (10*units),halfY);
    cxa.moveTo(halfX + (ls +(10*units)),halfY - (10*units));
    cxa.lineTo(halfX + (ls +(10*units)),halfY + (10*units));

    cxa.stroke();
    cxa.lineWidth = units;
    cxa.beginPath();

    // +
    cxa.moveTo(halfX + ((ls +(10*units))*2),halfY - (60*units));
    cxa.lineTo(halfX + ((ls +(10*units))*2),halfY - (40*units));
    cxa.lineTo(halfX + ((ls +(10*units))*2) + (20*units),halfY - (40*units));
    cxa.lineTo(halfX + ((ls +(10*units))*2) + (20*units),halfY - (60*units));
    cxa.lineTo(halfX + ((ls +(10*units))*2),halfY - (60*units));

    cxa.moveTo(halfX + ((ls +(10*units))*2) + (5*units),halfY - (50*units));
    cxa.lineTo(halfX + ((ls +(10*units))*2) + (15*units),halfY - (50*units));
    cxa.moveTo(halfX + ((ls +(10*units))*2) + (10*units),halfY - (55*units));
    cxa.lineTo(halfX + ((ls +(10*units))*2) + (10*units),halfY - (45*units));

    // -
    cxa.moveTo(halfX + ((ls +(10*units))*2),halfY + (60*units));
    cxa.lineTo(halfX + ((ls +(10*units))*2),halfY + (40*units));
    cxa.lineTo(halfX + ((ls +(10*units))*2) + (20*units),halfY + (40*units));
    cxa.lineTo(halfX + ((ls +(10*units))*2) + (20*units),halfY + (60*units));
    cxa.lineTo(halfX + ((ls +(10*units))*2),halfY + (60*units));

    cxa.moveTo(halfX + ((ls +(10*units))*2) + (5*units),halfY + (50*units));
    cxa.lineTo(halfX + ((ls +(10*units))*2) + (15*units),halfY + (50*units));
    cxa.stroke();


    /*var colW = (((ls*4)-(20*units))/3);
    var keyGrad=cxa.createLinearGradient(halfX + (colW*0.5) + (20*units),0,halfX + (colW) + (20*units),0);
    keyGrad.addColorStop(0,color.string(new RGBA(235,30,55,1)));
    keyGrad.addColorStop(1,color.string(new RGBA(255,255,255,1)));
    cxa.fillStyle=keyGrad;
    cxa.fillRect(halfX + (colW*0.5) + (20*units), halfY + (ls +(40*units)), colW*0.5, 10*units);*/

    color.master = new RGBA(0,0,0,0);
}


function drawVectorScope(channels,style,func,scale,line,x,y) {
    var i;
    var m = 0;
    var l = channels[0].length;
    var sx = 0;
    cxa.lineWidth = line;

    // CHOOSE SAMPLE //
    /*var sample = tombola.range(1000,channels[0].length-sampleSize - 1000);
     */

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
        switch (style) {
            case 0:
                cxa.fillRect(x + pos[0],y + pos[1],line,line);
                break;
            case 1:
                if (i===0) { cxa.moveTo(x + pos[0],y + pos[1]); }
                else { cxa.lineTo(x + pos[0],y + pos[1]); }
                break;
            case 2:
                if (func===vectorScope2) { sx = pos[0]; }
                cxa.beginPath();
                cxa.moveTo(x + sx,y);
                cxa.lineTo(x + pos[0],y + pos[1]);
                cxa.stroke();
                break;
        }

    }
    if (style==1) { cxa.stroke(); }
}


function drawLogo(x,y,s,c1,c2) {
    color.fill(cxa,c1);
    cxa.beginPath();
    cxa.arc(x,y,s,Math.PI*1.022,Math.PI*1.978); // outer
    cxa.arc(x,y,s*0.55,Math.PI*1.96,Math.PI*1.04,true);
    cxa.fill();

    color.fill(cxa,c2);
    cxa.beginPath();
    cxa.arc(x,y,s,Math.PI*0.895,Math.PI*0.105,true); // outer
    cxa.arc(x,y,s*0.55,Math.PI*0.201,Math.PI*0.799);
    cxa.fill();

    cxa.beginPath();
    cxa.moveTo(x,y + (s*0.1));
    cxa.lineTo(x - (s*0.2), y + (s*0.3));
    cxa.lineTo(x + (s*0.2), y + (s*0.3));
    cxa.closePath();
    cxa.fill();

    cxa.fillRect(x - (s*0.6), y + (s * 1.18), s*1.2, s*0.28);

    cxa.textAlign = "center";
    var f = Math.round(s*0.38);
    var fs = f*1.1;
    cxa.font = "400 " + f + "px Cabin";
    cxa.fillText("A",x - (s*1.5), y - (s*1.5) + (fs*1.5));
    cxa.fillText("R",x - (s*1.5), y - (s*1.5) + (fs*2.5));
    cxa.fillText("P",x - (s*1.5), y - (s*1.5) + (fs*3.5));
}


//-------------------------------------------------------------------------------------------
//  DRAW FUNCTIONS
//-------------------------------------------------------------------------------------------


// PASS COLOUR OBJECT //
function setColor(col) {

    // master color filter //
    var red = Math.round(col.R + masterCol.R);
    var green = Math.round(col.G + masterCol.G);
    var blue = Math.round(col.B + masterCol.B);
    var alpha = col.A + masterCol.A;

    // high & low pass color filters //
    var av = ((red + green + blue) / 3);
    var hp = av/255;
    var lp = 1 - (av/255);
    red += Math.round((highPass.R*hp) + (lowPass.R*lp));
    green += Math.round((highPass.G*hp) + (lowPass.G*lp));
    blue += Math.round((highPass.B*hp) + (lowPass.B*lp));

    buildColour(red,green,blue,alpha);
}


// PASS MANUAL R G B A //
function setRGBA(r,g,b,a) {
    var red = Math.round(r + masterCol.R);
    var green = Math.round(g + masterCol.G);
    var blue = Math.round(b + masterCol.B);
    var alpha = a + masterCol.A;

    // high & low pass color filters //
    var av = ((red + green + blue) / 3);
    var hp = av/255;
    var lp = 1 - (av/255);
    red += Math.round((highPass.R*hp) + (lowPass.R*lp));
    green += Math.round((highPass.G*hp) + (lowPass.G*lp));
    blue += Math.round((highPass.B*hp) + (lowPass.B*lp));

    buildColour(red,green,blue,alpha);
}


function buildColour(red,green,blue,alpha) {
    // RANGE //
    if (red<0) {
        red = 0;
    }
    if (red>255) {
        red = 255;
    }
    if (green<0) {
        green = 0;
    }
    if (green>255) {
        green = 255;
    }
    if (blue<0) {
        blue = 0;
    }
    if (blue>255) {
        blue = 255;
    }
    if (alpha<0) {
        alpha = 0;
    }
    if (alpha>1) {
        alpha = 1;
    }
    cxa.fillStyle = cxa.strokeStyle = "rgba("+red+","+green+","+blue+","+alpha+")";
}




//-------------------------------------------------------------------------------------------
//  EFFECTS
//-------------------------------------------------------------------------------------------


