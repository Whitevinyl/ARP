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
var bgCols = [new RGBA(5,10,20,1),new RGBA(255,236,88,1)];
var masterCol = new RGBA(0,0,0,0);
var highPass = new RGBA(0,0,0,0);
var lowPass = new RGBA(0,0,0,0);



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






