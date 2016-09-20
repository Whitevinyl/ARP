
var feedback = require('./Feedback');

// Not a real reverb, a pretty hacky effect using feedback (if you can make a nice reverb
// like this let me know!)

//-------------------------------------------------------------------------------------------
//  MONO
//-------------------------------------------------------------------------------------------

function reverb(level,delay,size,channel,index) {
    var primes = [0, 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101];
    var out = 0;
    var r = 1/(size*1.3);
    for (var j=0; j<size; j++) {
        out += feedback.mono(((level) - (r*j))*0.15,delay + (primes[j]*60),channel,index);
    }
    return out;
}

//-------------------------------------------------------------------------------------------
//  STEREO
//-------------------------------------------------------------------------------------------

function stereoReverb(signal,level,delay,size,channel,index) {
    return [
        signal[0] += reverb(level,delay,size,channel[1],index),
        signal[1] += reverb(level,delay,size,channel[0],index)
    ];
}

module.exports = stereoReverb;
