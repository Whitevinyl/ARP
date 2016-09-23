var utils = require('../../lib/utils');
var Tombola = require('tombola');
var tombola = new Tombola();

var Roar = require('../voices/Roar');
var Repeater = require('../filters/Repeater');
var Tremolo = require('../filters/Tremolo');
var Resonant = require('../filters/Resonant');

// An organic noise adapted from the clap sound in my (still early WIP) EvolverDrum

//-------------------------------------------------------------------------------------------
//  INIT
//-------------------------------------------------------------------------------------------

function Purr() {
    this.voice = new Roar(0.8);
    this.a = 0; // amp
    this.p = 0; // panning;
    this.i = 0; // count
    this.l = 0; // length
    this.v = 0;
    this.tremolo = new Tremolo.stereo();
    this.rate = 0;
    this.depth = 0;
    this.bp = new Resonant.mono();
    this.hp = new Resonant.mono();
    this.attack = 0;
    this.ratio = 0;
    this.direction = 1;
    this.delay = new Repeater();
    this.delayTime = 1;
    this.delayAmp = 1;
}

Purr.prototype.process = function(input,ducking,chance) {

    //setup event //
    if (this.i<0 && tombola.chance(1,chance)) {
        this.voice = new Roar(tombola.rangeFloat(0.2,0.95));
        this.l = tombola.range(12000,100000);
        this.i = 0;
        this.a = 0;
        this.v = tombola.rangeFloat(0.95,1);
        this.rate = tombola.rangeFloat(4,35);
        this.depth = tombola.rangeFloat(1,0.3);
        this.direction = tombola.weightedItem([1,-1],[2,1]);
        this.attack = tombola.rangeFloat(0.5,10);
        this.ratio = tombola.rangeFloat(0.9,1.15);
        this.delayTime = tombola.range(5,500);
        this.delayAmp = tombola.rangeFloat(0,0.5);
    }

    if (this.i>=0) {

        // count //
        this.i++;
        if (this.i>=this.l) {
            this.i = -1;
        }

        // envelope //
        var a = this.attack; var d = 5; var s = 0.6; var r = 100 - (a+d);

        var slices = [(this.l/100)*a, (this.l/100)*d, (this.l/100)*r];
        var volumes = [0,this.v,s,0];
        var currentSlice = 0;
        var sliceIndex = this.i;
        var sl = 0;
        for (var i=0; i<slices.length; i++) {
            sl += slices[i];
            if (this.i>sl)  {
                currentSlice +=1;
                sliceIndex = this.i - sl;
            }
        }
        if (currentSlice < (slices.length)) {
            var currentChange = volumes[currentSlice+1] - volumes[currentSlice];
            this.a = volumes[currentSlice] + ((currentChange/slices[currentSlice]) * sliceIndex);
        }
        else {
            this.a = 0;
        }


        // pan //
        this.p += tombola.rangeFloat(-0.005,0.005);
        this.p = utils.valueInRange(this.p, -1, 1);


        // voice //
        var n = this.voice.process();
        n = this.hp.process(850*this.ratio,0.5,n,'HP');
        n = this.bp.process(1200*this.ratio,0.7,n,'BP');


        var signal = [
            n * ((1 + -this.p) * this.a),
            n * ((1 + this.p) * this.a)
        ];

        // tremolo //
        signal = this.tremolo.process(signal,this.rate,this.depth,this.direction);
        signal = this.delay.process(signal,this.delayTime,this.delayAmp);


        input = [
            (input[0] * (1-(this.a * ducking))) + signal[0],
            (input[1] * (1-(this.a * ducking))) + signal[1]
        ];
    }

    return input;
};

module.exports = Purr;