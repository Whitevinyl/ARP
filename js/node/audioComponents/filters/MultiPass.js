
var utils = require('../../lib/utils');
var Tombola = require('tombola');
var tombola = new Tombola();

// Low Pass or High Pass filter converted from Java answer here:
// http://stackoverflow.com/questions/28291582/implementing-a-high-pass-filter-to-an-audio-signal
// I didn't realise at first but it looks to be the same as Patrice Tarrabia's tweaked
// butterworth used in LowPass.js: http://www.musicdsp.org/archive.php?classid=3#243

//-------------------------------------------------------------------------------------------
//  MONO INIT
//-------------------------------------------------------------------------------------------

function MultiPass() {
    this.c = this.a1 = this.a2 = this.a3 = this.b1 = this.b2 = 0;
    this.inputHistory = [0,0,0,0,0,0,0];
    this.outputHistory = [0,0,0,0,0,0,0];
}

//-------------------------------------------------------------------------------------------
//  MONO PROCESS
//-------------------------------------------------------------------------------------------

MultiPass.prototype.process = function (input,type,cutoff,resonance) {

    switch (type) {
        case 'LP':
            this.c = 1 / Math.tan(Math.PI * cutoff / sampleRate);
            this.a1 = 1 / (1 + resonance * this.c + this.c * this.c);
            this.a2 = 2 * this.a1;
            this.a3 = this.a1;
            this.b1 = 2 * (1 - this.c * this.c) * this.a1;
            this.b2 = (1 - resonance * this.c + this.c * this.c) * this.a1;
            break;
        case 'HP':
            this.c = Math.tan(Math.PI * cutoff / sampleRate);
            this.a1 = 1 / (1 + resonance * this.c + this.c * this.c);
            this.a2 = -2 * this.a1;
            this.a3 = this.a1;
            this.b1 = 2 * (this.c * this.c - 1) * this.a1;
            this.b2 = (1 - resonance * this.c + this.c * this.c) * this.a1;
            break;
    }
    var output = this.a1 * input + this.a2 * this.inputHistory[0] + this.a3 * this.inputHistory[1] - this.b1 * this.outputHistory[0] - this.b2 * this.outputHistory[1];

    this.inputHistory[1] = this.inputHistory[0];
    this.inputHistory[0] = input;

    this.outputHistory[2] = this.outputHistory[1];
    this.outputHistory[1] = this.outputHistory[0];
    this.outputHistory[0] = output;

    return this.outputHistory[0];
};

//-------------------------------------------------------------------------------------------
//  STEREO INIT
//-------------------------------------------------------------------------------------------

function StereoMultiPass() {
    this.f1 = new MultiPass();
    this.f2 = new MultiPass();
}

//-------------------------------------------------------------------------------------------
//  STEREO PROCESS
//-------------------------------------------------------------------------------------------

StereoMultiPass.prototype.process = function (signal,type,cutoff,resonance) {
    return [
        this.f1.process(signal[0],type,cutoff,resonance),
        this.f2.process(signal[1],type,cutoff,resonance)
    ];
};


module.exports = {
    mono: MultiPass,
    stereo: StereoMultiPass
};