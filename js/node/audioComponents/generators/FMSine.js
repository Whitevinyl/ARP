var utils = require('../../lib/utils');
var Tombola = require('tombola');
var tombola = new Tombola();

// Not real FM (at least I don't think), this was really the result of experimenting and I'm
// not 100% sure what's happening, but modulating a1 and/or a2 creates some great smooth
// timbre movement, opening uo the harmonics. Sounds like it's shifting from sine to square.

//-------------------------------------------------------------------------------------------
//  VOICE INIT
//-------------------------------------------------------------------------------------------

function FMVoice() {
    this.f = 200;
    this.v = 0;

    this.mf1 = 10;
    this.mv1 = 0;
    this.ma1 = 1;

    this.mf2 = 10;
    this.mv2 = 0;
    this.ma2 = 0.6;
}

//-------------------------------------------------------------------------------------------
//  VOICE PROCESS
//-------------------------------------------------------------------------------------------

FMVoice.prototype.process = function(f,a1,a2) {
    a1 = a1 || 0.5;
    a2 = a2 || 0.1;

    if (f) this.f = f;
    this.mf1 = f*4;
    this.mf2 = f*2;

    // modulation waves //
    this.mv1 += this.mf1/(sampleRate/4);
    if(this.mv1 > 2) this.mv1 -= 4;

    this.mv2 += this.mf2/(sampleRate/4);
    if(this.mv2 > 2) this.mv2 -= 4;

    var m1 = this.mv1 * a1;
    var m2 = this.mv2 * a2;

    // affected wave //
    this.v += (((this.f)/(sampleRate/4)));
    if(this.v > 2) this.v -= 4;
    return ((this.v * m1) + m2) * (2-Math.abs((this.v * m1) + m2));
};

//-------------------------------------------------------------------------------------------
//  WRAPPER INIT
//-------------------------------------------------------------------------------------------

function FMWrapper() {
    this.phase = new FMVoice();
    this.panning = tombola.rangeFloat(-1,1);
}

//-------------------------------------------------------------------------------------------
//  WRAPPER PROCESS
//-------------------------------------------------------------------------------------------

FMWrapper.prototype.process = function(signal, mix, frequency, a1, a2, amp) {

    a1 = a1 || 0.5;
    a2 = a2 || 0.1;
    amp = utils.arg(amp,1);

    var ps = this.phase.process(frequency, a1, a2)/2;
    this.panning += (tombola.fudge(1,1)*0.005);
    this.panning = utils.valueInRange(this.panning, -1, 1);

    return [
        (signal[0]*(1-(mix*amp))) + ((ps * (mix*amp)) * (1 + (-this.panning))),
        (signal[1]*(1-(mix*amp))) + ((ps * (mix*amp)) * (1 + this.panning))
    ];
};

module.exports = {
    voice: FMVoice,
    wrapper: FMWrapper
};

