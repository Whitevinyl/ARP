/**
 * Created by luketwyman on 03/11/2014.
 */



// INIT //
var canvas;
var cxa;
var scene = 0;
var TWEEN;

var timeNow, atacamaTime;
var morningLight, eveningLight, nightTime;


// METRICS //
var halfX = 0;
var halfY = 0;
var fullX = 0;
var fullY = 0;
var units = 0;
var dx = halfX;
var dy = halfY;
var headerType = 0;
var midType = 0;
var dataType = 0;
var bodyType = 0;
var subType = 0;
var device = "desktop";


// INTERACTION //
var mouseX = 0;
var mouseY = 0;
var touchTakeover = false;
var touch;
var mouseIsDown = false;


// COLORS //
var bgCols = [new RGBA(10,15,22,1), new RGBA(255,236,88,1), new RGBA(30,34,37,1), new RGBA(120,122,124,1)];
var graphCols = [new RGBA(196,64,245,1), new RGBA(64,204,245,1), new RGBA(75,254,170,1), new RGBA(172,26,240,1), new RGBA(245,243,233,1), new RGBA(10,10,10,1), new RGBA(61,21,71,1), new RGBA(174,0,232,1), new RGBA(156,0,235,1), new RGBA(0,46,196,1), new RGBA(88,28,237,1), new RGBA(162,0,255,1), new RGBA(0,166,255,1), new RGBA(255,0,89,1), new RGBA(195,0,145,1), new RGBA(104,0,156,1), new RGBA(42,23,61,1), new RGBA(237,21,86,1), new RGBA(41,37,48,1), new RGBA(149,129,148,1), new RGBA(6,209,91,1), new RGBA(50,240,220,1), new RGBA(115,90,120,1)];
var masterCol = new RGBA(0,0,0,0);
var highPass = new RGBA(0,0,0,0);
var lowPass = new RGBA(0,0,0,0);

var res = new Point(30,175);
res = new Point(25,120);

//-------------------------------------------------------------------------------------------
//  INITIALISE
//-------------------------------------------------------------------------------------------


function init() {

    ////////////// SETUP CANVAS ////////////

    canvas = document.getElementById("cnvs");
    var target = canvas;

    // MOUSE //
    target.addEventListener("mousedown", mousePress, false);
    target.addEventListener("mouseup", mouseRelease, false);
    target.addEventListener("mousemove", mouseMove, false);

    // TOUCH //
    target.addEventListener('touchstart', function(event) {
        if (event.targetTouches.length == 1) {
            touch = event.targetTouches[0];
            touchTakeover = true;
        } else {
            touchTakeover = false;
        }
        clickOrTouch();
    }, false);
    target.addEventListener('touchmove', function(event) {
        event.preventDefault();
        if (event.targetTouches.length == 1) {
            touch = event.targetTouches[0];
        }
        mouseMove(event);
    }, false);
    target.addEventListener('touchend', function(event) {
        mouseRelease();
        touchTakeover = false;
    }, false);

    cxa = canvas.getContext("2d");
    cxa.mozImageSmoothingEnabled = false;
    cxa.imageSmoothingEnabled = false;

    // SET CANVAS & DRAWING POSITIONS //
    metrics();

    // DONE //
    Tone.Master.volume.value = -12;
    scene = 1;
    draw();



} // END INIT








//-------------------------------------------------------------------------------------------
//  LOOP
//-------------------------------------------------------------------------------------------




function draw() {
    if (scene==1) {
        update();
        drawBG();
        drawScene();
    }

    //requestAnimationFrame(draw,canvas);
}


//-------------------------------------------------------------------------------------------
//  UPDATE
//-------------------------------------------------------------------------------------------



function update() {
    if (TWEEN) {
        TWEEN.update();
    }
}


function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}






