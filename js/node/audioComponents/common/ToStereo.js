
// splits a single value into a stereo channel with optional panning

//-------------------------------------------------------------------------------------------
//  INIT
//-------------------------------------------------------------------------------------------

function toStereo(signal,panning) {
    panning = panning || 0;
    return [
        signal * (1 + -panning),
        signal * (1 + panning)
    ];
}

module.exports = toStereo;
