var utils = require('../../lib/utils');
var easing = require('../../lib/easing');
var Tombola = require('tombola');
var tombola = new Tombola();
var WalkSmooth = require('../mods/WalkSmooth');

var LowPass = require('../filters/LowPass');
var WavePlayer = require('../voices/WavePlayer');
var table = require('../voices/Tables');

// Long opening or closing sounding filtered noise bursts

//-------------------------------------------------------------------------------------------
//  INIT
//-------------------------------------------------------------------------------------------

function SweepII() {
    this.a = 0;
    this.fa = 0;
    this.cutoff = 0;
    this.resonance = 0;
    this.i = -1;
    this.l = 0;
    this.p = 0;
    var wave;
    if (tombola.chance(1,2)) {
        wave = new table.EaseWave(tombola.range(0,6));
    } else {
        wave = new table.EaseWave2(tombola.range(0,2));
    }
    this.voice = new WavePlayer(wave);
    this.style = '';
    this.filter = new LowPass.mono();
    this.pitch = 0;
    this.pitchStart = 0;
    this.pitchDiff = 0;
}

//-------------------------------------------------------------------------------------------
//  PROCESS
//-------------------------------------------------------------------------------------------

SweepII.prototype.process = function(input,ducking,chance) {

    if (this.i<=0 && tombola.chance(1,chance)) {
        this.cutoff = tombola.rangeFloat(400,8000);
        this.resonance = tombola.rangeFloat(0.5,1);
        this.pitchStart = tombola.rangeFloat(16,60);
        this.pitchDiff = this.pitchStart - (this.pitchStart * tombola.rangeFloat(0.9,1.12));
        this.pitch = this.pitchStart;
        this.l = tombola.range(50000,200000);
        this.i = 0;
        this.a = 0;
        this.style = tombola.item(['in','out']);
        if (this.style == 'in') {
            this.fa = 0;
        }
        if (this.style == 'out') {
            this.fa = this.cutoff;
        }
    }

    if (this.i>=0) {

        if (this.i<this.l) {
            this.i ++;
        } else {
            this.i = -1;
            this.a = 0;
        }

        // amp //
        var attack, release;
        if (this.style == 'in') {
            attack = this.l / 2;
            release = this.l - attack;
            if (this.i < attack) {
                this.a = easing.circleInOut(this.i, 0, 1, attack);
                this.fa = easing.circleIn(this.i, 0, this.cutoff, attack);
            } else {
                this.a = easing.circleInOut(this.i - attack, 1, -1, release);
            }
        }
        if (this.style == 'out') {
            attack = this.l *0.3;
            release = this.l - attack;
            if (this.i<attack) {
                this.a = easing.circleInOut(this.i, 0, 1, attack);
            } else {
                this.a = easing.circleInOut(this.i - attack, 1, -1, release);
                this.fa = easing.circleOut(this.i - attack, this.cutoff, -this.cutoff, release);

            }

        }
        this.pitch = easing.circleInOut(this.i, this.pitchStart, this.pitchDiff, this.l);
        this.pitch = utils.valueInRange(this.pitch, 20, 20000);

        // pan //
        this.p += tombola.rangeFloat(-0.005,0.005);
        this.p = utils.valueInRange(this.p, -1, 1);


        //voice //
        var signal = [0,0];
        this.voice.p = 0;
        signal = this.voice.process(signal,this.pitch);
        var n = (signal[0] + signal[1])/2;

        n = this.filter.process(utils.valueInRange(this.fa, 10, 20000), this.resonance, n);
        signal = [
            n * (1 + -this.p),
            n * (1 + this.p)
        ];

        input = [
            (input[0] * (1-(this.a * ducking))) + (signal[0] * this.a),
            (input[1] * (1-(this.a * ducking))) + (signal[1] * this.a)
        ];
    }
    return input;
};


module.exports = SweepII;
