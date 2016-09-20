
var utils = require('../../lib/utils');
var Tombola = require('tombola');
var tombola = new Tombola();

// Low Pass filter (forget which type - will research). Res is a bit dangerous, I find a
// value of 0.92 is both safe and pleasing sounding.

//-------------------------------------------------------------------------------------------
//  MONO INIT
//-------------------------------------------------------------------------------------------

function LowPass() {
    this.a1 = this.a2 = this.a3 = this.b1 = this.b2 = this.in1 = this.in2 = this.out1 = this.out2 = 0;
}

//-------------------------------------------------------------------------------------------
//  MONO PROCESS
//-------------------------------------------------------------------------------------------

LowPass.prototype.process = function(cutoff,res,input) {

    res = utils.valueInRange(res,0.6,1.4);
    var c = 1.0 / Math.tan(Math.PI * cutoff / sampleRate);

    this.a1 = 1.0 / ( 1.0 + res * c + c * c);
    this.a2 = 2* this.a1;
    this.a3 = this.a1;
    this.b1 = 2.0 * ( 1.0 - c*c) * this.a1;
    this.b2 = ( 1.0 - res * c + c * c) * this.a1;

    var out = (this.a1 * input) + (this.a2 * this.in1) + (this.a3 * this.in2) - (this.b1 * this.out1) - (this.b2 * this.out2);

    this.in2 = this.in1;
    this.in1 = input;
    this.out2 = this.out1;
    this.out1 = out;

    return out;
};

//-------------------------------------------------------------------------------------------
//  STEREO INIT
//-------------------------------------------------------------------------------------------

function StereoLowPass() {
    this.lp1 = new LowPass();
    this.lp2 = new LowPass();
}

//-------------------------------------------------------------------------------------------
//  STEREO PROCESS
//-------------------------------------------------------------------------------------------

StereoLowPass.prototype.process = function(signal, cutoff, res) {
    return [
        this.lp1.process(cutoff,res,signal[0]),
        this.lp2.process(cutoff,res,signal[1])
    ];
};

module.exports = {
    mono: LowPass,
    stereo: StereoLowPass
};