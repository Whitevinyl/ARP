
// Takes the current sample and adds it to previous samples with reducing power. Should
// always be at the end of a chain.

//-------------------------------------------------------------------------------------------
//  MONO
//-------------------------------------------------------------------------------------------

function reverseDelay(input,level,delay,feedback,channel,index) {
    for (var z=0; z<feedback; z++) {
        var lvl = Math.pow(level,z+1);
        var ind = Math.round(z * delay);
        if ((index-ind)>0) {
            channel[index-ind] += ((input*lvl)*0.8);
        }
    }
}

//-------------------------------------------------------------------------------------------
//  STEREO
//-------------------------------------------------------------------------------------------

function stereoReverseDelay(signal,level,delay,feedback,channel,index) {
    reverseDelay(signal[0],level,delay,feedback,channel[1],index);
    reverseDelay(signal[1],level,delay,feedback,channel[0],index);
    return [
        signal[0]*(1-level),
        signal[1]*(1-level)
    ];
}

module.exports = stereoReverseDelay;
