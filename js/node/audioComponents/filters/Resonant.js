
var utils = require('../../lib/utils');
var Tombola = require('tombola');
var tombola = new Tombola();

// A resonant type filter with selectable outputs. From Paul Kellet's Resonant Filter:
// http://www.musicdsp.org/archive.php?classid=3#29

//-------------------------------------------------------------------------------------------
//  MONO INIT
//-------------------------------------------------------------------------------------------

function Resonant() {
    this.hp = this.bp = this.buf0 = this.buf1 = 0;
}

//-------------------------------------------------------------------------------------------
//  MONO PROCESS
//-------------------------------------------------------------------------------------------

Resonant.prototype.process = function(frequency,q,input,type) {
    var f = 2.0*Math.sin(Math.PI*frequency/sampleRate);
    var fb = q + q/(1.0 - f);

    this.hp = input - this.buf0;
    this.bp = this.buf0 - this.buf1;
    this.buf0 = this.buf0 + f * (this.hp + fb * this.bp);
    this.buf1 = this.buf1 + f * (this.buf0 - this.buf1);


    if (type && type==='LP') {
        return this.buf1; // lowpass
    }
    if (type && type==='HP') {
        return this.hp; // highpass
    }
    return this.bp; // bandpass
};

//-------------------------------------------------------------------------------------------
//  STEREO INIT
//-------------------------------------------------------------------------------------------

function StereoResonant() {
    this.bp1 = new Resonant();
    this.bp2 = new Resonant();
}

//-------------------------------------------------------------------------------------------
//  STEREO PROCESS
//-------------------------------------------------------------------------------------------

StereoResonant.prototype.process = function(signal, frequency, res, mix) {
    return [
        (signal[0] * (1-mix)) + (this.bp1.process(frequency,res,signal[0]) * mix),
        (signal[1] * (1-mix)) + (this.bp2.process(frequency,res,signal[1]) * mix)
    ];
};

module.exports = {
    mono: Resonant,
    stereo: StereoResonant
};