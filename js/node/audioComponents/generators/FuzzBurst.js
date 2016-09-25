
var utils = require('../../lib/utils');
var Tombola = require('tombola');
var tombola = new Tombola();

var common = require('../common/Common');
var Roar = require('../voices/Roar');
var MultiPass = require('../filters/MultiPass');
var Resonant = require('../filters/Resonant');

// sustained bursts of low level fuzz

//-------------------------------------------------------------------------------------------
//  INIT
//-------------------------------------------------------------------------------------------

function FuzzBurst() {
    this.noise = new Roar(tombola.rangeFloat(0.8,0.99));
    this.bursts = [];
    this.i = -1;
    this.c = 0;
    this.a = 0;
    this.p = tombola.rangeFloat(-1,1);
    this.power = -1;
    this.filter = new Resonant.stereo();
    this.filter2 = new Resonant.stereo();
    this.f = tombola.rangeFloat(800,2500);
}

//-------------------------------------------------------------------------------------------
//  PROCESS
//-------------------------------------------------------------------------------------------

FuzzBurst.prototype.process = function(input,burstLength,spaceLength,mix) {

    // set up bursts //
    if (this.i<0) {
        this.bursts = [];

        // burst phrasing //
        var maxB = tombola.rangeFloat(0.1,1);
        var maxS = tombola.rangeFloat(0.1,1);
        if (tombola.percent(14)) {
            maxS = tombola.rangeFloat(2,7);
        }
        var bl = tombola.range(burstLength*0.05, burstLength*maxB);
        var sl = tombola.range(spaceLength*0.05, spaceLength*maxS);
        var bn = 1;

        // repetitions //
        if (maxB>0.5 && maxS<0.4 && tombola.percent(15)) {
            bn = tombola.range(2,3);
        }
        if (maxB>0.25 && maxS<0.25 && tombola.percent(50)) {
            bn = tombola.range(3,5);
        }

        for (var i=0; i<bn; i++) {
            this.bursts.push(bl);
            this.bursts.push(sl);
        }

        this.i = 0;
        this.c = 0;
        this.a = 0;
        this.power = 1;
    }

    // count //
    this.i++;
    if (this.i > this.bursts[this.c]) {
        this.c++;
        this.i = 0;
        this.power = -this.power;
    }
    if (this.c>=this.bursts.length) {
        this.i = -1;
    }


    // pan //
    this.p += tombola.rangeFloat(-0.005,0.005);
    this.p = utils.valueInRange(this.p, -1, 1);


    // noise //
    var n = this.noise.process();
    var signal = common.toStereo(n,this.p);


    // filter //
    this.f += tombola.fudgeFloat(6,this.f/1000);
    this.f = utils.valueInRange(this.f,700,4000);
    signal = this.filter.process(signal,550,0.8,0.8);
    signal = this.filter2.process(signal,this.f,0.7,0.6);


    // AMP //
    if (this.power>0 && this.a<0.5) {
        this.a += 0.005;
    }
    if (this.power<0 && this.a>0) {
        this.a -= 0.005;
    }
    this.a = utils.valueInRange(this.a,0,0.5);


    var ducking = 0.5;
    return [
        (input[0] * (1-((this.a*mix)*ducking))) + (signal[0] * (this.a*mix)),
        (input[1] * (1-((this.a*mix)*ducking))) + (signal[1] * (this.a*mix))
    ];
};

module.exports = FuzzBurst;