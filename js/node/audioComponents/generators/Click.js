
var utils = require('../../lib/utils');
var Tombola = require('tombola');
var tombola = new Tombola();
var Roar = require('../voices/Roar');
var White = require('../voices/White');

// Bursts of clicking sounds

//-------------------------------------------------------------------------------------------
//  INIT
//-------------------------------------------------------------------------------------------

function Click() {
    this.a = 0;
    this.ma = 0;
    this.i = -1;
    this.mi = 0;
    this.c = 0;
    this.l = [];
    this.tl = 0;
    this.p = 0;
    this.voice = null;
    this.s = 0;
}

//-------------------------------------------------------------------------------------------
//  PROCESS
//-------------------------------------------------------------------------------------------

Click.prototype.process = function(input,ducking,chance,mechanical) {

    if (this.i<=0 && tombola.chance(1,chance)) {
        mechanical = utils.arg(mechanical,tombola.percent(10));
        this.l = [];
        this.tl = 0;
        var min = 400;
        var max = 8000;
        if (mechanical) {
            max = 4000;
        }
        var drift = tombola.range(600,1200);
        var pulses = tombola.range(10,30);
        var l = tombola.range(min,max);
        var d = tombola.range(-drift,drift);
        for (var i=0; i<pulses; i++) {
            this.l.push(l);
            this.tl += l;
            if (!mechanical) {
                if (tombola.chance(1,3)) {
                    d = tombola.range(-drift,drift);
                }
                if ((l+d)<min) d = tombola.range(0,drift);
                if ((l+d)>max) d = tombola.range(-drift,0);
                l += d;
            }
        }
        this.i = 0;
        this.a = 0;
        this.ma = 0;
        this.c = 0;
        this.mi = 0;
        this.s = tombola.rangeFloat(0.01,0.07);
        this.voice = tombola.item( [new Roar(tombola.rangeFloat(0.2,0.9)), new White()]);
    }

    if (this.c<(this.l.length-1) && this.i>=0) {

        if (this.i<this.l[this.c]) {
            this.i ++;
        } else {
            this.i = 0;
            this.c += 1;
            this.a = 0;
        }
        this.mi ++;

        // amp //
        var attack = this.l[this.c]*0.001;
        var hold = this.l[this.c]*this.s;
        var release = this.l[this.c]*0.005;
        if (this.i<attack) {
            this.a += (1/attack);
        }
        if (this.i>=attack && this.i<(attack+hold)) {
            this.a = 1;
        }
        if (this.i>(attack+hold) && this.i<(attack+hold+release)) {
            this.a -= (1/release);
        }
        if (this.i>=(attack+hold+release)) {
            this.a = 0;
        }

        // master amp //
        attack = this.tl*0.3;
        release = this.tl*0.4;
        if ((this.mi)<attack) {
            this.ma += (1/attack);
        }
        if ((this.mi)>(this.tl-release)) {
            this.ma -= (1/release);
        }

        // pan //
        this.p += tombola.rangeFloat(-0.005,0.005);
        this.p = utils.valueInRange(this.p, -1, 1);

        //voice //
        var n = this.voice.process();
        var signal = [
            n * (1 + -this.p),
            n * (1 + this.p)
        ];

        input = [
            (input[0] * (1-((this.a * this.ma) * ducking))) + (signal[0] * (this.a * this.ma)),
            (input[1] * (1-((this.a * this.ma) * ducking))) + (signal[1] * (this.a * this.ma))
        ];
    }
    return input;
};

module.exports = Click;