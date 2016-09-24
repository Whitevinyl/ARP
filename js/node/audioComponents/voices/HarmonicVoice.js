
var utils = require('../../lib/utils');
var Tombola = require('tombola');
var tombola = new Tombola();

var HarmonicSine = require('./HarmonicSine');
var partials = require('../../lib/partials');
var common = require('../common/Common');

// A voice wrapper for the 'HarmonicSine' which takes a cutoff value and converts it into
// partials, modulating that value then creates the sound of opening up or closing off the
// harmonics, feeling like a cutoff filter but with different timbre characteristics.

//-------------------------------------------------------------------------------------------
//  INIT
//-------------------------------------------------------------------------------------------

function HarmonicVoice() {
    this.voice = new HarmonicSine;
    this.a = 0.5;
    this.p = tombola.rangeFloat(-1,1);
    this.partials = [1];
}

//-------------------------------------------------------------------------------------------
//  PROCESS
//-------------------------------------------------------------------------------------------

HarmonicVoice.prototype.process = function(input, frequency, cutoff, resonance, mode) {

    // get partials from cutoff (1-100 ideal) //
    var p = floatToPartials(cutoff);

    // alter partials //
    mode = mode || null;
    switch (mode) {
        case 'metallic':
            partials.negativeDisorganise(p,0.4,3);
            break;

        default:
            break;
    }

    // voice //
    var signal = this.voice.process(frequency,p,resonance);

    // pan //
    this.p += tombola.rangeFloat(-0.008,0.008);
    this.p = utils.valueInRange(this.p, -1, 1);
    signal = common.toStereo(signal,this.p);

    return [
        (input[0] * (1-(this.a))) + (signal[0] * this.a),
        (input[1] * (1-(this.a))) + (signal[1] * this.a)
    ];
};


function floatToPartials(n) {
    var l = Math.floor(n);
    var a = [];
    for (var i=0; i<l; i++) {
        a.push(1);
    }
    a.push(n-l);
    return a;
}



module.exports = HarmonicVoice;

