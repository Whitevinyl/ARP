var utils = require('../../lib/utils');
var Tombola = require('tombola');
var tombola = new Tombola();

// A simple tremolo, currently hard-coded as a sawtooth type

//-------------------------------------------------------------------------------------------
//  MONO INIT
//-------------------------------------------------------------------------------------------

function Tremolo() {
    this.a = 0;
}

//-------------------------------------------------------------------------------------------
//  MONO PROCESS
//-------------------------------------------------------------------------------------------

Tremolo.prototype.process = function(input,rate,depth,direction) {

    if (!direction || direction!==1 || direction!==-1) direction = 1;

    // perform ramp //
    this.a += (((rate*2)/sampleRate) * direction);
    if (this.a > 1) this.a -= 1;
    if (this.a < 0) this.a += 1;

    // calculate gain //
    var g = 1 - (this.a*depth);

    return input * g;
};

//-------------------------------------------------------------------------------------------
//  STEREO INIT
//-------------------------------------------------------------------------------------------

function StereoTremolo() {
    this.a = 0;
}

//-------------------------------------------------------------------------------------------
//  STEREO PROCESS
//-------------------------------------------------------------------------------------------

StereoTremolo.prototype.process = function(input,rate,depth,direction) {

    if (!direction || direction!==1 || direction!==-1) direction = 1;

    // perform ramp //
    this.a += ((rate/sampleRate) * direction);
    if (this.a > 1) this.a -= 1;
    if (this.a < 0) this.a += 1;

    // calculate gain //
    var g = 1 - (this.a*depth);

    return [
        input[0] * g,
        input[1] * g
    ];
};

module.exports = {
    mono: Tremolo,
    stereo: StereoTremolo
};