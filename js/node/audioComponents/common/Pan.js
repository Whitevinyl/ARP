
// add panning to a stereo signal

//-------------------------------------------------------------------------------------------
//  INIT
//-------------------------------------------------------------------------------------------

function pan(signal,panning) {
    panning = panning || 0;
    return [
        signal[0] *= (1 + -panning),
        signal[1] *= (1 + panning)
    ];
}

module.exports = pan;