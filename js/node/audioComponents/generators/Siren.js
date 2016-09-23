
var utils = require('../../lib/utils');
var easing = require('../../lib/easing');
var Tombola = require('tombola');
var tombola = new Tombola();
var MultiPass = require('../filters/MultiPass');

// A cluster of moaning filtered synth voices. Sounds either like dragging a desk across a
// lino floor, or a hover-car fly-by.

//-------------------------------------------------------------------------------------------
//  INIT
//-------------------------------------------------------------------------------------------

function SirenVoice(f) {
    this.f = f;
    this.v = 0;
}

function Siren() {
    this.voices = [];
    this.a = 0;
    this.i = -1;
    this.l = 0;
    this.d = 0;
    this.p = 0;
    this.lp = new MultiPass.stereo();
    this.pass = '';
    this.res = 1;
    this.cutoff = 0;
    this.filterMove = true;
    this.eased = false;
}

//-------------------------------------------------------------------------------------------
//  PROCESS
//-------------------------------------------------------------------------------------------

Siren.prototype.process = function(input,ducking,chance) {

    // setup event //
    if (this.i<=0 && tombola.chance(1,chance)) {
        this.i = 0;
        this.a = 0;

        // filter & length //
        this.pass = tombola.weightedItem(['LP','HP'],[2,1]);
        this.res = tombola.rangeFloat(0.1,1.2);

        if (this.pass=='LP') {
            this.filterMove = tombola.percent(75);
            this.cutoff = tombola.rangeFloat(100,500);
            this.l = tombola.range(11000,150000);
        } else {
            this.filterMove = tombola.percent(4);
            this.cutoff = tombola.rangeFloat(3000,5000);
            this.l = tombola.range(10000,90000);
        }

        // voices //
        this.d = tombola.rangeFloat(-0.0005, 0.0005);
        this.voices = [];
        var voiceNo = tombola.range(6,10);
        var f = tombola.rangeFloat(40,250);
        var mf = 0;
        for (var i=0; i<voiceNo; i++) {
            if (i===0) mf = (f/2);
            if (i===1) mf = (f*2);
            if (i>1) mf = (f + tombola.fudgeFloat(14,(f/100)));
            if (mf<10) mf = 10;
            this.voices.push(new SirenVoice(mf));
        }
    }

    // process event //
    if (this.i>=0 && this.i<this.l) {

        this.i++;
        if (this.i<(this.l*0.4)) {
            this.a += (1/(this.l*0.4));
        }
        if (this.i>(this.l/2)) {
            if (this.eased) {
                this.a = easing.circleInOut(this.i - (this.l/2), 1, -1, (this.l/2));
            } else {
                this.a -= (1/(this.l/2));
            }
        }

        // pan //
        this.p += tombola.rangeFloat(-0.005,0.005);
        this.p = utils.valueInRange(this.p, -1, 1);

        // voices//
        var vt = 0;
        var vl = this.voices.length;
        for (i=0; i<vl; i++) {
            var voice = this.voices[i];
            voice.v += (voice.f * (4/sampleRate));
            voice.f += (this.d + tombola.fudgeFloat(3,voice.f/12000));
            if (voice.v>3) voice.v = (voice.v - 4);
            var t = voice.v;
            if (t>1) t = (1-voice.v);
            vt += (t * (1/vl));
        }

        var signal = [
            (vt + tombola.fudgeFloat(2,0.01)) * (1 + -this.p),
            (vt + tombola.fudgeFloat(2,0.01)) * (1 + this.p)
        ];
        var cf = 1 + (this.cutoff*this.a);
        if (!this.filterMove) {
            cf = this.cutoff;
        }
        signal = this.lp.process(signal,this.pass,cf,this.res);

        input = [
            (input[0] * (1-(this.a * ducking))) + (signal[0] * this.a),
            (input[1] * (1-(this.a * ducking))) + (signal[1] * this.a)
        ];

        if (this.i>=this.l) {
            this.i = -1;
        }
    }
    return input;
};

module.exports = Siren;