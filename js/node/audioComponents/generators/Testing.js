
var utils = require('../../lib/utils');
var Tombola = require('tombola');
var tombola = new Tombola();

var WavePlayer = require('../voices/WavePlayer');
var table = require('../voices/Tables');
var HarmonicSine = require('../voices/HarmonicSine');
var partials = require('../../lib/partials');
var LFO = require('../mods/LFO');
var MoveTo = require('../mods/MoveTo');
var controlRange = require('../mods/controlRange');

// I just test component ideas here, whatever's here is the last thing I tested (& committed)

//-------------------------------------------------------------------------------------------
//  INIT
//-------------------------------------------------------------------------------------------

function Testing() {
    this.voice = new HarmonicSine;
    this.a = 0.5;
    this.partials = [1];
    this.mod = new MoveTo();
}

//-------------------------------------------------------------------------------------------
//  PROCESS
//-------------------------------------------------------------------------------------------

Testing.prototype.process = function(input, frequency, chance) {

    if (tombola.chance(1,chance)) {
        //this.partials = [];
        var l = tombola.range(20,60);
        var t = tombola.range(0,17);
        //this.partials = partials.setPartials(t,l);
        //this.partials.shift();
        //this.partials.push(1);
    }

    // sequentially open up partials //
    /*var index = 0;
    while (this.partials[index]>=1) {
        index++;
    }
    if (!this.partials[index]) this.partials[index] = 0;
    this.partials[index] += 3/sampleRate;
    if (this.partials[index]>1) this.partials[index] = 1;*/

    var p = floatToArray(controlRange(1,50,this.mod.process(1,25000)));

    //partials.negativeNoise(p,0.05);
    partials.negativeDisorganise(p,0.5,13);

    //p = partials.normalise(p, p.length);

    var signal = this.voice.process(frequency,p,0.95);
    return [
        (input[0] * (1-(this.a))) + (signal * this.a),
        (input[1] * (1-(this.a))) + (signal * this.a)
    ];
};


function floatToArray(n) {
    var l = Math.floor(n);
    var a = [];
    for (var i=0; i<l; i++) {
        a.push(1);
    }
    a.push(n-l);
    return a;
}



module.exports = Testing;