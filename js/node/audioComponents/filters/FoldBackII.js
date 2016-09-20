
var utils = require('../../lib/utils');

// Distortion effect which folds waveform peaks back on themselves beyond a given threshold.

//-------------------------------------------------------------------------------------------
//  MONO
//-------------------------------------------------------------------------------------------

function foldBackII(input,threshold, power) {
    if (input>threshold) {
        input = threshold - ((input-threshold)*power);
    }
    if (input<-threshold) {
        input = -threshold - ((input-(-threshold))*power);
    }
    return utils.valueInRange(input,-threshold,threshold);
}


//-------------------------------------------------------------------------------------------
//  STEREO
//-------------------------------------------------------------------------------------------


function stereoFoldBackII(signal,threshold,power) {
    return [
        foldBackII(signal[0],threshold,power),
        foldBackII(signal[1],threshold,power)
    ];
}

module.exports = stereoFoldBackII;