
var utils = require('../../lib/utils');

// Distortion effect which inverts the wave shape when beyond a given threshold. Pretty
// horrible digital/bitcrushing sound :)

//-------------------------------------------------------------------------------------------
//  MONO
//-------------------------------------------------------------------------------------------


function invert(input,threshold) {
    var a = input;
    if (input>0) {
        a = threshold - (input*threshold);
        if (a<0) a=0;
    }
    if (input<0) {
        a = -threshold - (input*threshold);
        if (a>0) a=0;
    }
    return a;
}


//-------------------------------------------------------------------------------------------
//  STEREO
//-------------------------------------------------------------------------------------------


function stereoInvert(signal,threshold,mix) {
    mix = utils.arg(mix,1);
    return [
        (signal[0] * (1-mix)) + (invert(signal[0],threshold)*mix),
        (signal[1] * (1-mix)) + (invert(signal[1],threshold)*mix)
    ];
}


module.exports = stereoInvert;