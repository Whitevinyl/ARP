
var utils = require('../../lib/utils');
var Tombola = require('tombola');
var tombola = new Tombola();

var HarmonicVoice = require('../voices/HarmonicVoice');
var common = require('../common/Common');
var Tremolo = require('../filters/Tremolo');
var MultiPass = require('../filters/MultiPass');

// A metallic hit

//-------------------------------------------------------------------------------------------
//  INIT
//-------------------------------------------------------------------------------------------

function Chime() {
    this.voice = new HarmonicVoice();
    this.tremolo = new Tremolo.stereo();
    this.filter = new MultiPass.stereo();
    this.delay = new common.Repeater();
    this.env = []; // envelope points
    this.ads = []; // envelope points
    this.i = -1; // index
    this.l = 0; // hit length
    this.a = 0; // amp
    this.f = 100; // voice frequency
    this.cutoff = 60; // harmonic cutoff
    this.resonance = 1; //voice resonance
    this.tremoloRate = 2; // trem rate
    this.tremoloDepth = 0;
    this.direction = 1; // trem ramp direction
    this.delayTime = 10;
    this.type = '';
    this.filterCutoff = 1000;
}

//-------------------------------------------------------------------------------------------
//  PROCESS
//-------------------------------------------------------------------------------------------

Chime.prototype.process = function(input,ducking,chance) {

    // setup event //
    if (this.i<=0 && tombola.chance(1,chance)) {

        // voice //
        this.f = tombola.rangeFloat(300,1000);
        this.l = tombola.range(50000,300000);
        this.i = 0;
        //this.cutoff = tombola.range(150,300);
        this.cutoff = tombola.range(35,100);
        this.resonance = tombola.rangeFloat(1,1.1);
        this.tremoloRate = tombola.rangeFloat(0.5,22);
        this.tremoloDepth = tombola.rangeFloat(0,1);
        this.direction = tombola.item([-1,1]);
        this.delayTime = tombola.range(10,1000);
        this.type = tombola.item(['tine','metallic2']);
        this.filterCutoff = tombola.rangeFloat(2200,5200);

        // envelope //
        this.env = [];
        this.ads = [];
        var points = tombola.range(3,10);
        for (var i=0; i<points; i++) {
            this.env.push(tombola.rangeFloat(0,1));
        }
        this.a = 0;

        if (tombola.percent(50)) {
            this.ads.push(tombola.rangeFloat(0.1,2));
            this.ads.push(tombola.rangeFloat(1,2));
            this.ads.push(tombola.rangeFloat(0.4,0.7));
        } else {
            this.ads.push(tombola.rangeFloat(5,25));
            this.ads.push(tombola.rangeFloat(1,2));
            this.ads.push(1);
        }

    }


    if (this.i>=0) {

        // count //
        this.i++;
        if (this.i>=this.l) {
            this.i = -1;
            return input;
        }

        // envelope //
        this.a = common.ADSREnvelope(this.i,this.l,this.ads);

        var signal = [0,0];
        signal = this.voice.process(signal, this.f, this.cutoff, 1.1, this.type);
        signal = this.tremolo.process(signal, this.tremoloRate * (1 + (this.a/10)), this.tremoloDepth, this.direction);
        signal = this.delay.process(signal, this.delayTime, 0.5, true);
        signal = this.filter.process(signal, 'LP', this.filterCutoff * (1 + (this.a/10)), 1.2);

        input = [
            (input[0] * (1-(this.a * ducking))) + (signal[0] * this.a),
            (input[1] * (1-(this.a * ducking))) + (signal[1] * this.a)
        ];
    }

    return input;


};

module.exports = Chime;