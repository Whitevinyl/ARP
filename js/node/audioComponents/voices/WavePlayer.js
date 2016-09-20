
var utils = require('../../lib/utils');
var Tombola = require('tombola');
var tombola = new Tombola();

// Plays arrays of amplitudes (-1 to 1) as waveforms

//-------------------------------------------------------------------------------------------
//  INIT
//-------------------------------------------------------------------------------------------

function WavePlayer(wave) {
    this.waveforms = wave.waveforms;
    this.wave = tombola.item(this.waveforms);
    this.a = 0.3;
    this.f = 200;
    this.i = 0;
    this.p = 0;
}

//-------------------------------------------------------------------------------------------
//  PROCESS
//-------------------------------------------------------------------------------------------

WavePlayer.prototype.process = function(input, frequency) {

    this.f += 0.0001;
    this.f = utils.valueInRange(this.f,5,18000);
    if (frequency) this.f = frequency;

    this.i += this.wave.length/(sampleRate/this.f);

    if (this.i>=(this.wave.length-1)) {
        this.i = 0;
        this.wave = tombola.item(this.waveforms);
    }

    // pan //
    this.p += tombola.rangeFloat(-0.008,0.008);
    this.p = utils.valueInRange(this.p, -1, 1);

    var sample = [
        (this.wave[Math.round(this.i)] + tombola.fudgeFloat(2,0.1)) * (1 + -this.p),
        (this.wave[Math.round(this.i)] + tombola.fudgeFloat(2,0.1)) * (1 + this.p)
    ];

    input = [
        input[0] + (sample[0] * this.a),
        input[1] + (sample[1] * this.a)
    ];

    return input;
};

module.exports = WavePlayer;