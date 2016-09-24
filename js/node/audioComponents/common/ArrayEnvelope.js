
var utils = require('../../lib/utils');

// A simple envelope which accepts an array of gains in place of ADSR. The gains are treated
// as equally spaced, and there can be any number.

//-------------------------------------------------------------------------------------------
//  PROCESS
//-------------------------------------------------------------------------------------------

function ArrayEnvelope(t,d,gains) {
    var a = 0;
    var slice = d/gains.length;
    var currentSlice = Math.floor(t/slice);
    if (currentSlice>=0 && currentSlice<gains.length-1) {
        var sliceIndex = t - (currentSlice*slice);
        var currentChange = gains[currentSlice+1] - gains[currentSlice];
        a = gains[currentSlice] + ((currentChange/slice) * sliceIndex);
    }
    if (a!==a) a = 0;
    return a;
}

module.exports = ArrayEnvelope;