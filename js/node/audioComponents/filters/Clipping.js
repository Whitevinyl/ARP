
var utils = require('../../lib/utils');

// Distortion effect which squashes the waveform beyond a given threshold.

//-------------------------------------------------------------------------------------------
//  MONO
//-------------------------------------------------------------------------------------------


function clipping(input,threshold, power) {
    if (input>threshold) {
        input = threshold + ((input-threshold)*power);
    }
    if (input<-threshold) {
        input = -threshold + ((input-(-threshold))*power);
    }
    return input;
}


//-------------------------------------------------------------------------------------------
//  STEREO
//-------------------------------------------------------------------------------------------


function stereoClipping(signal,threshold,power) {
    return [
        clipping(signal[0],threshold,power),
        clipping(signal[1],threshold,power)
    ];
}

module.exports = stereoClipping;