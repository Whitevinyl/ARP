
var utils = require('../../lib/utils');
var Tombola = require('tombola');
var tombola = new Tombola();

// Distortion glitch effect which inverts random samples with a given chance, creating a
// fuzzy crackle

//-------------------------------------------------------------------------------------------
//  MONO
//-------------------------------------------------------------------------------------------

function erode(input,width,index) {
    if (index % tombola.range(1,width)===0) {
        input = -input;
    }
    return input;
}

//-------------------------------------------------------------------------------------------
//  STEREO
//-------------------------------------------------------------------------------------------

function stereoErode(signal,width,index,mix) {
    mix = utils.arg(mix,1);
    return [
        (signal[0] * (1-mix)) + (erode(signal[0],width,index)*mix),
        (signal[1] * (1-mix)) + (erode(signal[1],width,index)*mix)
    ];
}

module.exports = stereoErode;