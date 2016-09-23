var easing = require('../../lib/easing');
var utils = require('../../lib/utils');

// Tables for periodic waveforms used by the WavePlayer. The first of these were just manually
// written, 'SharkFin' populates it's table dynamically using a tweening/easing equation - I'll
// be trying more of these in future, although it only seems stable at lower frequencies (if
// stable is what you're going for).

//-------------------------------------------------------------------------------------------
//  MANUAL
//-------------------------------------------------------------------------------------------

function Metallic() {
    var a = [
        0, -0.7, -0.4, -0.6,
        -0.45, -0.1, -0.3, -0.35,
        0.4, 0.6, 0.7, 0.5,
        0.3, 0.2, -0.13, -0.07,
        0, -0.06, -0.12, -0.18

        -0.2, -0.18, -0.1, -0.03,
        0.25, 1, 0, -0.05,
        -0.15, -0.2, -0.25, -0.3,
        -0.32, -0.33, -0.33, -0.32,
        -0.25, -0.2, -0.15, -0.1
    ];
    var b = [
        0, -0.1, -0.2, -0.3,
        0, 0.5, 1, 0.5,
        -0.4, -0.6, -0.7, -0.6,
        -0.4, -0.6, -0.7, -0.8,
        -0.9, -0.6, -0.2, -0.1,

        0, 0.1, 0.2, 0.3,
        0, -0.5, -1, -0.5,
        0.4, 0.6, 0.7, 0.6,
        0.4, 0.6, 0.7, 0.6,
        0.25, 0.2, 0.15, 0.1
    ];
    var c = [
        0, 0.1, -0.05, 0.08,
        -0.12, 0, -0.12, 0,
        -0.15, -0.4, -0.9, -0.95,
        -1, -1, -0.5, -0.4,
        -0.1, -0.3, -0.2, -0.3,
        -0.65, -0.6, -0.7, -0.3,
        -0.1, -0.2, 0, 0.2,
        0.1, 0.2, 0.16, 0.7,
        0.6, 0.3, 0.3, 0.05,
        0.3, 0.6, 1, 0.95,
        0.9, 0.7, 0.8, 0.1
    ];
    this.waveforms = [b, c];
}

function Voice2() {
    var a = [
        0, 0.1, 0, 0.3,
        0.5, 0.4, 0.7, 0.5,
        -0.2, -0.4, -0.3, 0,
        0.4, 0.7, 0.9, 1,
        0.9, 0.7, 0.4, 0.2,

        0, -0.1, 0.2, 0,
        -0.1, -0.2, -0.3, -0.4,
        -0.9, 0.3, -0.2, -0.1,
        0, 0.1, 0.2, 0.1,
        -0.4, -0.5, -0.4, -0.1
    ];
    var b = [
        0, 0.5, 0.55, 0.6,
        0.65, 0.7, 0.75, 0.8,
        0.85, 0.9, 0.95, 1,
        0.8, 0.6, 0.4, 0.2,

        0, -0.5, -0.55, -0.6,
        -0.65, -0.7, -0.75, -0.8,
        -0.85, -0.9, -0.95, -1,
        -0.8, -0.6, -0.4, -0.2
    ];

    this.waveforms = [a, b];
}

function Voice3() {
    var a = [
        0, 1, 0, -1
    ];
    var b = [
        1, -1
    ];
    this.waveforms = [a, b];
}

//-------------------------------------------------------------------------------------------
//  ALGORITHMIC
//-------------------------------------------------------------------------------------------

// SHARKFIN //
function SharkFin(length) {
    var a = [];
    length = length || 2000;
    for (var i=0; i<length; i++) {
        a.push( easing.circleIn(i,-1,1,length) );
    }
    for (i=0; i<length; i++) {
        a.push( easing.circleIn(i,1,-1,length) );
    }
    this.waveforms = [a];
}


// curves for EaseWave //
var easeWaves = [
    easing.cubicIn,
    easing.circleInOut,
    easing.custom1,
    easing.custom2,
    easing.custom3,
    easing.custom4,
    easing.custom5
];

// EASE WAVE //
function EaseWave(type,length) {
    var ease = easeWaves[type];
    //console.log(ease);
    var a = [];
    length = length || 10000;
    for (var i=0; i<length; i++) {
        a.push( ease(i,-1,1,length) );
    }
    for (i=0; i<length; i++) {
        a.push( ease(i,1,-1,length) );
    }
    this.waveforms = [a];
}

// curves for EaseWave //
var easeWaves2 = [
    easing.custom6, // thin
    easing.custom7, // full more squared
    easing.custom8 // full & more harmonic
];

// EASE WAVE2 //
function EaseWave2(type,length) {
    var a = [];
    var easingFunction = easeWaves2[type];
    //console.log(easingFunction);
    var r,start,end;

    length = length || 10000;

    start = -1;
    end = 1;
    for (var i=0; i<length; i++) {
        r = easingFunction(i/length);
        a.push( utils.valueInRange(start + (end - start) * r) );
    }
    start = 1;
    end = -1;
    for (i=0; i<length; i++) {
        r = easingFunction(i/length);
        a.push( utils.valueInRange(start + (end - start) * r) );
    }
    this.waveforms = [a];
}


module.exports = {
    Metallic: Metallic,
    Voice2: Voice2,
    Voice3: Voice3,
    SharkFin: SharkFin,
    EaseWave: EaseWave,
    EaseWave2: EaseWave2
};