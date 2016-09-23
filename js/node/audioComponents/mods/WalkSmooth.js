
var utils = require('../../lib/utils');
var Tombola = require('tombola');
var tombola = new Tombola();

// A random but smooth wave walker

//-------------------------------------------------------------------------------------------
//  INIT
//-------------------------------------------------------------------------------------------

function WalkSmooth() {
    this.p = tombola.rangeFloat(-1,1);
    this.v = 0;
    this.v2 = 0;
    this.b = sampleRate*0.5;
}

//-------------------------------------------------------------------------------------------
//  PROCESS
//-------------------------------------------------------------------------------------------


WalkSmooth.prototype.process = function(r,c) {
    this.v += this.v2;
    this.p += (this.v/sampleRate);
    var b = sampleRate/r;
    if (tombola.chance(1,c)) this.v2 = tombola.rangeFloat(-(r/b),(r/b));
    if (this.p<-0.5 && this.v<0) this.v2 = (r/b);
    if (this.p>0.5 && this.v>0) this.v2 = -(r/b);
    this.v = utils.valueInRange(this.v,-r,r);

    return this.p;
};

module.exports = WalkSmooth;