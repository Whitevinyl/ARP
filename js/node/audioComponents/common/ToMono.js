
// Merges a stereo signal into a single value

//-------------------------------------------------------------------------------------------
//  INIT
//-------------------------------------------------------------------------------------------

function toMono(signal) {
    return (signal[0] + signal[1])/2;
}

module.exports = toMono;