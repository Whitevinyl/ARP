
var utils = require('../../lib/utils');
var Tombola = require('tombola');
var tombola = new Tombola();

//  A cheap Low Pass filter, doesn't sound too great, but useful for some simple shaping.
// Modified from Scoofy's Simple 1 pole LP and HP filter:
// http://www.musicdsp.org/archive.php?classid=3#243

//-------------------------------------------------------------------------------------------
//  MONO INIT
//-------------------------------------------------------------------------------------------

function LowPassII() {
    this.b1 = this.a0 = this.temp = 0;
}

//-------------------------------------------------------------------------------------------
//  MONO PROCESS
//-------------------------------------------------------------------------------------------

LowPassII.prototype.process = function(cutoff,input) {

    var x = Math.exp(-2.0*Math.PI*cutoff/sampleRate);
    this.a0 = 1.0-x;
    this.b1 = -x;

    var out = this.a0*input - this.b1*this.temp;
    this.temp = out;

    return out;
};

//-------------------------------------------------------------------------------------------
//  STEREO INIT
//-------------------------------------------------------------------------------------------

function StereoLowPassII() {
    this.b1 = this.a0 = this.temp = 0;
    this.b1r = this.a0r = this.tempr = 0;
}

//-------------------------------------------------------------------------------------------
//  STEREO PROCESS
//-------------------------------------------------------------------------------------------

StereoLowPassII.prototype.process = function(cutoff,input) {

    var x = Math.exp(-2.0*Math.PI*cutoff/sampleRate);
    this.a0 = this.a0r = 1.0-x;
    this.b1 = this.b1r = -x;

    var l = this.a0*input[0] - this.b1*this.temp;
    this.temp = l;
    var r = this.a0r*input[1] - this.b1r*this.tempr;
    this.temp = r;

    return [l,r];
};

module.exports = {
    mono: LowPassII,
    stereo: StereoLowPassII
};