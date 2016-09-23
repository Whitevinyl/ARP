var utils = require('../../lib/utils');
var Tombola = require('tombola');
var tombola = new Tombola();

var WavePlayer = require('../voices/WavePlayer');
var table = require('../voices/Tables');

// ramping voice cluster, sometimes noisy, sometimes glassy like a reverse sound

//-------------------------------------------------------------------------------------------
//  INIT
//-------------------------------------------------------------------------------------------

function Ramp() {
    this.voices = [];
    this.f = []; // voice frequencies
    this.a = 0; // amp
    this.d = 0; // frequency drift
    this.r = 0; // ramp speed
    this.m = 0; // ramp multiplier
}

//-------------------------------------------------------------------------------------------
//  PROCESS
//-------------------------------------------------------------------------------------------

Ramp.prototype.process = function(input,ducking,chance,speed,retrigger) {

    if (tombola.chance(1,chance) && (retrigger || this.a===0)) {
        speed = speed || 1;
        this.a = 0;
        var f = tombola.rangeFloat(50,6000); // root frequency
        this.r = tombola.rangeFloat(0.01, speed*2)/sampleRate;
        this.m = 1 + (tombola.rangeFloat(0.01, speed*10)/sampleRate);

        var voiceType = tombola.item([table.Metallic,table.Voice2,table.Voice3]);
        this.voices = [];
        this.f = [];
        var voiceNo = tombola.range(3,4);
        var dif = (1 + (this.r*sampleRate))*1000;
        this.d = tombola.rangeFloat(-(f/(dif*1000)), (f/(dif*1000)));
        var mf = 0;
        for (var i=0; i<voiceNo; i++) {
            mf = (f + tombola.fudgeFloat(14,(f/40)));
            this.f.push(mf);
            this.voices.push(new WavePlayer(new voiceType()));
        }
    }

    if (this.r>0) {

        // ramping //
        if (this.a<1) {
            this.a += this.r;
            this.r *= this.m;
        }
        // done //
        else {
            this.a = 0;
            this.r = 0;
        }

        // voices//
        var signal = [0,0];
        var vl = this.voices.length;
        for (i=0; i<vl; i++) {
            this.f[i] += this.d;
            this.f[i] = utils.valueInRange(this.f[i],10,20000);
            var voice = this.voices[i];
            signal = voice.process(signal,this.f[i]);
        }
        signal[0] *= (1/vl);
        signal[1] *= (1/vl);

        input = [
            (input[0] * (1-(this.a * ducking))) + (signal[0] * this.a),
            (input[1] * (1-(this.a * ducking))) + (signal[1] * this.a)
        ];

    }
    return input;
};

module.exports = Ramp;