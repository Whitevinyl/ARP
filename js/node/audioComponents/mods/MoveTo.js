
var utils = require('../../lib/utils');
var Tombola = require('tombola');
var tombola = new Tombola();

// A simple controller which randomly transitions to new values and holds there until it
// picks a new destination. Destinations are chosen randomly with a given chance ie a chance
// of 1000, means there's a one in 1000 chance (each time process is called) that a new
// destination is chosen. generally at a sampleRate of 44100 I'm using higher chances, in
// the range of 10,000 - 200,000.

//-------------------------------------------------------------------------------------------
//  INIT
//-------------------------------------------------------------------------------------------

function MoveTo() {
    this.p = tombola.rangeFloat(-1,1);
    this.d = this.p;
    this.v = 0;
}

//-------------------------------------------------------------------------------------------
//  PROCESS
//-------------------------------------------------------------------------------------------

MoveTo.prototype.process = function(r,c) {
    if (this.p !== this.d) {
        this.p += this.v;
    }
    if (tombola.chance(1,c)) {
        this.d = tombola.rangeFloat(-1,1);
        var dif = this.d - this.p;
        this.v = dif/(sampleRate/r);
    }
    return utils.valueInRange(this.p,-1,1);
};

module.exports = MoveTo;