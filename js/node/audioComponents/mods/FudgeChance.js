
var utils = require('../../lib/utils');
var Tombola = require('tombola');
var tombola = new Tombola();

// A simple controller which randomly changes value each step using the concept of
// 'Fudge dice' (see tombola.js chance library for mor info). This creates an erratic
// modifier, like a jerky random walk.

//-------------------------------------------------------------------------------------------
//  INIT
//-------------------------------------------------------------------------------------------

function FudgeChance() {
    this.p = tombola.rangeFloat(-1,1);
}

//-------------------------------------------------------------------------------------------
//  PROCESS
//-------------------------------------------------------------------------------------------

FudgeChance.prototype.process = function(d,s,c) {
    if (tombola.chance(1,c)) {
        this.p += tombola.fudgeFloat(d,s);
    }
    this.p = utils.valueInRange(this.p,-1,1);
    return this.p;
};

module.exports = FudgeChance;