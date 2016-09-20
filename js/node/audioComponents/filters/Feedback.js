
// Copies signal from previous samples and adds it to the current one

//-------------------------------------------------------------------------------------------
//  MONO
//-------------------------------------------------------------------------------------------

function feedback(level,delay,channel,index) {
    delay = Math.round(delay);
    if (index<delay) {
        return 0;
    }
    return (channel[index-delay]*level);
}

//-------------------------------------------------------------------------------------------
//  STEREO
//-------------------------------------------------------------------------------------------

function stereoFeedback(signal,level,delay,channel,index) {
    return [
        signal[0] + feedback(level,delay,channel[1],index),
        signal[1] + feedback(level,delay,channel[0],index)
    ];
}

module.exports = {
    mono: feedback,
    stereo: stereoFeedback
};