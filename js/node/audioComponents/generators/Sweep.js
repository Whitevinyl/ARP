
var utils = require('../../lib/utils');
var Tombola = require('tombola');
var tombola = new Tombola();
var Roar = require('../voices/Roar');
var LowPass = require('../filters/LowPass');

// Long opening or closing sounding filtered noise bursts

//-------------------------------------------------------------------------------------------
//  INIT
//-------------------------------------------------------------------------------------------

function Sweep() {
    this.a = 0;
    this.fa = 0;
    this.cutoff = 0;
    this.resonance = 0;
    this.i = -1;
    this.l = 0;
    this.p = 0;
    this.voice = null;
    this.style = '';
    this.filter = new LowPass.mono();
}

//-------------------------------------------------------------------------------------------
//  PROCESS
//-------------------------------------------------------------------------------------------

Sweep.prototype.process = function(input,ducking,chance) {

    if (this.i<=0 && tombola.chance(1,chance)) {
        this.cutoff = tombola.rangeFloat(100,3300);
        this.resonance = tombola.rangeFloat(0.4,1.2);
        this.l = tombola.range(30000,200000);
        this.i = 0;
        this.a = 0;
        this.style = tombola.item(['in','out']);
        if (this.style == 'in') {
            this.fa = 0;
        }
        if (this.style == 'out') {
            this.fa = this.cutoff;
        }
        this.voice = new Roar(tombola.rangeFloat(0.1,0.99));
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
                this.a = inOutCirc(this.i, 0, 1, attack);
                this.fa = inCirc(this.i, 0, this.cutoff, attack);
            } else {
                this.a = inOutCirc(this.i - attack, 1, -1, release);
            }
        }
        if (this.style == 'out') {
            attack = this.l *0.3;
            release = this.l - attack;
            if (this.i<attack) {
                this.a = inOutCirc(this.i, 0, 1, attack);
            } else {
                this.a = inOutCirc(this.i - attack, 1, -1, release);
                this.fa = outCirc(this.i - attack, this.cutoff, -this.cutoff, release);
            }
        }


        // pan //
        this.p += tombola.rangeFloat(-0.005,0.005);
        this.p = utils.valueInRange(this.p, -1, 1);


        //voice //
        var n = this.filter.process(utils.valueInRange(this.fa, 10, 20000), this.resonance, this.voice.process());
        var signal = [
            n * (1 + -this.p),
            n * (1 + this.p)
        ];

        input = [
            (input[0] * (1-(this.a * ducking))) + (signal[0] * (this.a * 0.8)),
            (input[1] * (1-(this.a * ducking))) + (signal[1] * (this.a * 0.8))
        ];
    }
    return input;
};

//-------------------------------------------------------------------------------------------
//  EASING FUNCTIONS
//-------------------------------------------------------------------------------------------


function inCirc(t, b, c, d) {
    t /= d;
    return -c * (Math.sqrt(1 - t*t) - 1) + b;
}

function outCirc(t, b, c, d) {
    t /= d;
    t--;
    return c * Math.sqrt(1 - t*t) + b;
}

function inOutCirc(t, b, c, d) {
    t /= d/2;
    if (t < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
    t -= 2;
    return c/2 * (Math.sqrt(1 - t*t) + 1) + b;
}


module.exports = Sweep;
