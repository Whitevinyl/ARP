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


