
// Stereo balance of mix.

//-------------------------------------------------------------------------------------------
//  STEREO
//-------------------------------------------------------------------------------------------

function stereoPanner(signal,panning) {
    if (panning<0) {
        signal = [
            (signal[0] * (1+panning)) + (signal[1] * (-panning)),
            signal[1] * (1+panning)
        ];
    } else {
        signal = [
            signal[0] * (1-panning),
            (signal[1] * (1-panning)) + (signal[0] * (panning))
        ];
    }
    return signal;
}

module.exports = stereoPanner;