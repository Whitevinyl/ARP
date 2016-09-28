

var utils = require('../../lib/utils');

// Distortion effect which folds waveform peaks back on themselves beyond a given threshold.
// From Hellfire's Fold Back Distortion: http://www.musicdsp.org/archive.php?classid=4#42

//-------------------------------------------------------------------------------------------
//  MONO
//-------------------------------------------------------------------------------------------


// FOLDBACK //
function foldBack(input,threshold) {
    if (input>threshold || input<-threshold) {
        input = Math.abs(Math.abs(utils.fmod(input - threshold, threshold*4)) - threshold*2) - threshold;
    }
    return input;
}


//-------------------------------------------------------------------------------------------
//  STEREO
//-------------------------------------------------------------------------------------------


function stereoFoldBack(signal,threshold) {
    return [
        foldBack(signal[0],threshold),
        foldBack(signal[1],threshold)
    ];
}

module.exports = stereoFoldBack;