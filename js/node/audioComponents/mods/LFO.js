
var Tombola = require('tombola');
var tombola = new Tombola();

// A simple sine LFO. It currently runs at half speed, didn't realise initially so have left
// it for now as other things rely on it, but will fix up in future. You can use 'voices/Sine'
// which is exactly the same but with the fix.

//-------------------------------------------------------------------------------------------
//  INIT
//-------------------------------------------------------------------------------------------

function LFO() {
    this.p = tombola.rangeFloat(-2,2);
}

//-------------------------------------------------------------------------------------------
//  PROCESS
//-------------------------------------------------------------------------------------------

LFO.prototype.process = function(frequency) {
    frequency = frequency/sampleRate;
    this.p += frequency;
    if(this.p > 2) this.p -= 4;
    return  this.p*(2-Math.abs(this.p));
};

module.exports = LFO;