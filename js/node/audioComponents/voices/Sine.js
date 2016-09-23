
var Tombola = require('tombola');
var tombola = new Tombola();

// A simple sine wave voice

//-------------------------------------------------------------------------------------------
//  INIT
//-------------------------------------------------------------------------------------------

function Sine() {
    this.p = tombola.rangeFloat(-2,2);
}

//-------------------------------------------------------------------------------------------
//  PROCESS
//-------------------------------------------------------------------------------------------

Sine.prototype.process = function(frequency) {
    frequency = frequency/sampleRate;
    this.p += (frequency*2);
    if(this.p > 2) this.p -= 4;
    return  this.p*(2-Math.abs(this.p));
};

module.exports = Sine;