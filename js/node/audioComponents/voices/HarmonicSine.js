
var Tombola = require('tombola');
var tombola = new Tombola();

// Combines sinewaves as harmonic overtones of the root, using an array of partials

//-------------------------------------------------------------------------------------------
//  INIT
//-------------------------------------------------------------------------------------------

function HarmonicSine() {
    this.p = 0;
    this.partials = [];
}

//-------------------------------------------------------------------------------------------
//  PROCESS
//-------------------------------------------------------------------------------------------

HarmonicSine.prototype.process = function(frequency,partials,resonance) {
    frequency = (frequency*2)/sampleRate;
    partials = partials || [];

    // skip the root partial //
    //if (partials.length>0) partials.shift();

    this.p += (frequency);
    if(this.p > 2) this.p -= 4;

    var a = this.p;
    var out = a*(2-Math.abs(a));

    var totalLevel = 1;
    for (var i=1; i<partials.length; i++) {

        // if partial currently non-existant, zero it //
        if (!this.partials[i]) this.partials[i] = 0;

        // good frequency? //
        if ((frequency*i)>19999) continue;

        // calculate sine //
        this.partials[i] += (frequency*i);
        if(this.partials[i] > 2) this.partials[i] -= 4;
        var p = this.partials[i]*(2-Math.abs(this.partials[i]));

        var m = Math.pow(resonance,i+1);
        out += ((p*partials[i]) * m);
        totalLevel += (partials[i] * m);
    }

    // maybe somoe other division would be better, but this works //
    out = out/totalLevel;

    return  out;
};

module.exports = HarmonicSine;
