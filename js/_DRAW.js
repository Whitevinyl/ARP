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


