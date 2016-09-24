
var utils = require('../../lib/utils');
var Tombola = require('tombola');
var tombola = new Tombola();

var HarmonicVoice = require('../voices/HarmonicVoice');
var WalkSmooth = require('../mods/WalkSmooth');
var MoveTo = require('../mods/MoveTo');
var common = require('../common/Common');
var Tremolo = require('../filters/Tremolo');
var Noise = require('../filters/Noise');
var LowPass = require('../filters/LowPass');
var MultiPass = require('../filters/MultiPass');

// A metallic pulsing drone with harmonic squeals. Needs some further work, mods sorting etc

//-------------------------------------------------------------------------------------------
//  INIT
//-------------------------------------------------------------------------------------------

function Metallic() {
    this.voice = new HarmonicVoice();
    this.voice2 = new HarmonicVoice();
    this.a = 0.5;
    this.mod = new MoveTo();
    this.mod2 = new WalkSmooth();
    this.mod3 = new MoveTo();
    this.mod4 = new WalkSmooth();
    this.tremolo = new Tremolo.stereo();
    this.noise = new Noise.stereo();
    this.filter = new LowPass.stereo();
    this.filter2 = new MultiPass.stereo();
    this.delay = new common.Repeater();
    this.direction = tombola.item([-1,1]);
}

//-------------------------------------------------------------------------------------------
//  PROCESS
//-------------------------------------------------------------------------------------------

Metallic.prototype.process = function(input, frequency, chance, rate) {

    if (tombola.chance(1,chance)) {
        this.direction = tombola.item([-1,1]);
    }

    var delayTime = common.range(1000,4000,this.mod2.process(1,8000));
    var cutoff = common.range(10,65,this.mod.process(1,25000));
    frequency = common.range(frequency,frequency*1.025,this.mod3.process(1,25000));

    var rateProc = this.mod4.process(2,10000);
    var tremoloRate = common.range(1,12,rateProc);
    var resonance = common.range(0.4,1.1,rateProc);



    var signal = [0,0];
    signal = this.voice.process(signal, frequency, cutoff, resonance, 'metallic');
    signal = this.voice2.process(signal, frequency*2, cutoff, resonance);

    signal = this.noise.process(signal, common.range(0,0.03,rateProc), 0.9);
    signal = this.tremolo.process(signal, tremoloRate, 0.8, this.direction);
    signal = this.delay.process(signal, delayTime, 0.4, true);
    signal = this.filter.process(signal, 2000, 0.85);
    signal = this.filter2.process(signal, 'HP', 100, 1);


    return [
        (input[0] * (1-(this.a))) + (signal[0] * this.a),
        (input[1] * (1-(this.a))) + (signal[1] * this.a)
    ];
};


module.exports = Metallic;
