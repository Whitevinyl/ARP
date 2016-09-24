var utils = require('../../lib/utils');
var Tombola = require('tombola');
var tombola = new Tombola();

// Add some delicious noise. Setting the threshold makes for a harsher, roaring unbalanced
// noise, zero threshold is plain white noise.

//-------------------------------------------------------------------------------------------
//  MONO INIT
//-------------------------------------------------------------------------------------------

function Noise() {
    this.a = 0;
}

//-------------------------------------------------------------------------------------------
//  MONO PROCESS
//-------------------------------------------------------------------------------------------

Noise.prototype.process = function(input,depth,threshold) {
    threshold = threshold || 0;
    var white = (Math.random() * 2 - 1);

    // hold if there's a threshold //
    if (white>(-threshold) && white<threshold) {
        white = this.a;
    }
    this.a = white;
    return input + (white * depth);
};

//-------------------------------------------------------------------------------------------
//  STEREO INIT
//-------------------------------------------------------------------------------------------

function StereoNoise() {
    this.n1 = new Noise();
    this.n2 = new Noise();
}

//-------------------------------------------------------------------------------------------
//  STEREO PROCESS
//-------------------------------------------------------------------------------------------

StereoNoise.prototype.process = function(input,depth,threshold) {
    return [
        this.n1.process(input[0],depth,threshold),
        this.n2.process(input[1],depth,threshold)
    ];
};

module.exports = {
    mono: Noise,
    stereo: StereoNoise
};