var utils = require('../../lib/utils');
var Tombola = require('tombola');
var tombola = new Tombola();

var Roar = require('../voices/Roar');
var WavePlayer = require('../voices/WavePlayer');
var table = require('../voices/Tables');
var Repeater = require('../common/Repeater');
var MultiPass = require('../filters/MultiPass');

// A noise cluster with a randomised repeating envelope pattern

//-------------------------------------------------------------------------------------------
//  INIT
//-------------------------------------------------------------------------------------------

function PatternII() {
    this.voice = new WavePlayer(new table.Voice3());
    this.f = 0; // frequency
    this.a = 0; // amp
    this.ma = 1; // master amp;
    this.p = 0; // panning;
    this.env = []; // envelope points
    this.penv = []; // pitch envelope points
    this.l = []; // click lengths
    this.c = 0; // clicks count
    this.tl = 0; // total length
    this.i = -1;
    this.mi = -1;
    this.delay = new Repeater();
    this.filter = new MultiPass.stereo();
    this. filtered = true; // if filtering
    this.pass = ''; // filter type
    this.res = 1; // filter resonance
    this.cutoff = 0; // filter cutoff
    this.delayTime = 0; // delay offset
}

//-------------------------------------------------------------------------------------------
//  PROCESS
//-------------------------------------------------------------------------------------------

PatternII.prototype.process = function(input,ducking,chance) {

    // setup event //
    if (this.i<=0 && tombola.chance(1,chance)) {
        this.delayTime = tombola.range(5,100);

        // envelope //
        this.env = [];
        this.penv = [];
        var points = tombola.range(5,20);
        for (var i=0; i<points; i++) {
            if (i===0 || i===(points-1)) {
                this.env.push(tombola.item([0,1]));
            } else {
                this.env.push(tombola.rangeFloat(0,1));
            }
            this.penv.push(tombola.rangeFloat(40,1200));
        }
        this.a = this.env[0];
        this.f = this.penv[0];

        // filter //
        this.pass = tombola.weightedItem(['LP','HP'],[2,2]);
        this.res = tombola.rangeFloat(0.3,1.3);
        this.filtered = tombola.percent(60);
        if (this.pass=='LP') {
            this.cutoff = tombola.rangeFloat(600,800);
        } else {
            this.cutoff = tombola.rangeFloat(8000,9000);
        }

        // length //
        this.l = [];
        var drift = tombola.range(800,2000);
        var min = 9000;
        var max = 42000;
        var pulses = tombola.range(1,4);
        var l = tombola.range(min,max);
        var d = tombola.range(-drift,drift);
        for (i=0; i<pulses; i++) {
            this.l.push(l);
            this.tl += l;
            if (tombola.chance(1,3)) {
                d = tombola.range(-drift,drift);
            }
            if ((l+d)<min) d = tombola.range(0,drift);
            if ((l+d)>max) d = tombola.range(-drift,0);
            l += d;
        }
        this.c = 0;
        this.i = 0;
        this.mi = 0;
    }


    // process event //
    if (this.c<(this.l.length-1) && this.i>=0) {

        // counting //
        if (this.i<this.l[this.c]) {
            this.i ++;
        } else {
            this.i = 0;
            this.c += 1;
            this.a = 0;
        }
        this.mi ++;


        // envelope //
        var slice = this.l[this.c]/this.env.length;
        var currentSlice = Math.floor(this.i/slice);
        if (currentSlice<this.env.length-1) {
            var sliceIndex = this.i - (currentSlice*slice);
            var currentChange = this.env[currentSlice+1] - this.env[currentSlice];
            //this.a = this.env[currentSlice] +((currentChange/slice) * sliceIndex);
            this.a = ((currentChange/slice) * sliceIndex);
            if (this.a<0) {
                this.a = -this.a;
            }

            var pitchChange = this.penv[currentSlice+1] - this.penv[currentSlice];
            this.f = this.penv[currentSlice] + ((pitchChange/slice) * sliceIndex);
            //this.f = this.penv[currentSlice];
        }
        else {
            this.a = 0;
        }


        // pan //
        this.p += tombola.rangeFloat(-0.005,0.005);
        this.p = utils.valueInRange(this.p, -1, 1);


        //voice //
        var signal = this.voice.process([0,0],this.f);

        // amp //
        signal = [
            signal[0] * (this.a * this.ma),
            signal[1] * (this.a * this.ma)
        ];


        // delay & filter //
        signal = this.delay.process(signal,this.delayTime,0.5);
        this.delayTime += tombola.fudge(20,1);
        this.delayTime = utils.valueInRange(this.delayTime,1,2000);
        if (this.filtered) {
            signal = this.filter.process(signal,this.pass,this.cutoff,this.res);
        }



        input = [
            (input[0] * (1-((this.a * this.ma) * ducking))) + signal[0],
            (input[1] * (1-((this.a * this.ma) * ducking))) + signal[1]
        ];
    }
    return input;
};

module.exports = PatternII;
