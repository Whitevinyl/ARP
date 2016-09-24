var utils = require('../../lib/utils');
var Tombola = require('tombola');
var tombola = new Tombola();

var Roar = require('../voices/Roar');
var Repeater = require('../common/Repeater');
var Tremolo = require('../filters/Tremolo');
var arrayEnvelope = require('../common/ArrayEnvelope');
var Sine = require('../voices/Sine');
var MultiPass = require('../filters/MultiPass');

// Experimenting with a call/howl sound

//-------------------------------------------------------------------------------------------
//  INIT
//-------------------------------------------------------------------------------------------

function Call() {
    this.f = 0; // frequency
    this.a = 0; // amp
    this.ma = 0; // master amp
    this.p = 0; // panning;
    this.i = -1; // count
    this.l = 0; // length
    this.cutoff = 0;
    this.voice = new Sine();
    this.hp = new MultiPass.mono();
    this.lp = new MultiPass.mono();
    this.dl1 = new Repeater();
    this.dl2 = new Repeater();
    this.plot = [];
    this.env = [0,0.1,1,1,0.2,0,0];
    this.menv = [0,1,1,1,1,0];
    this.mult = 0;
    this.ease = [];
}

//-------------------------------------------------------------------------------------------
//  PROCESS
//-------------------------------------------------------------------------------------------

Call.prototype.process = function(input,ducking,chance) {

//setup event //
    if (this.i<0 && tombola.chance(1,chance)) {
        this.l = tombola.range(12000,250000);
        this.i = 0;
        this.a = 0;
        this.ma = 0;
        this.mult = 0;
        this.plot = [tombola.rangeFloat(800,1000)];
        this.plot.push(tombola.rangeFloat(this.plot[0]+600, this.plot[0]+1000));
        this.ease = [tombola.rangeFloat(-20,30),tombola.rangeFloat(-20,30),tombola.rangeFloat(-20,30)];
    }

    if (this.i>=0) {

        // count //
        this.i++;
        if (this.i>=this.l) {
            this.i = -1;
            return input;
        }

        // envelope //
        this.a = arrayEnvelope(this.i,this.l,this.env);
        this.ma = arrayEnvelope(this.i,this.l,this.menv);

        // pan //
        this.p += tombola.rangeFloat(-0.005,0.005);
        this.p = utils.valueInRange(this.p, -1, 1);


        // voice //
        if (this.i>(this.l*0.25) && this.i<(this.l*0.75)) {
            this.mult = ease2(this.i - (this.l/4),this.l/2,this.ease);
        }
        this.f = this.plot[0] + ((this.plot[1] - this.plot[0]) * this.mult );
        this.f = utils.valueInRange(this.f,20,20000);
        var n = this.voice.process(this.f);

        // filter //
        n = this.hp.process(n,'HP',150 + (2000*this.a),1);
        n = this.lp.process(n,'LP',900 + (200*this.a),0.5);


        var signal = [
            n * ((1 + -this.p) * this.a),
            n * ((1 + this.p) * this.a)
        ];

        // delay //
        signal = this.dl1.process(signal,6000,0.3);
        signal = this.dl2.process(signal,4537,0.3);

        input = [
            (input[0] * (1-(this.a * ducking))) + (signal[0] * this.ma),
            (input[1] * (1-(this.a * ducking))) + (signal[1] * this.ma)
        ];
    }

    return input;
};




function ease(t,d) {
    if (t<=0) return 0;
    var ts=(t/=d)*t;
    var tc=ts*t;
    return -10.35*tc*ts + 11.5*ts*ts + 0.7*tc + -1*ts + 0.15*t;
}

function ease2(t,d,points) {
    if (t<=0) return 0;
    var ts=(t/=d)*t;
    var tc=ts*t;
    return points[0]*tc*ts + points[1]*ts*ts + points[2]*tc + -1*ts + 0.15*t;
}


module.exports = Call;