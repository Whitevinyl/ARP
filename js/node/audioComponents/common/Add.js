
// combines two stereo signals

//-------------------------------------------------------------------------------------------
//  INIT
//-------------------------------------------------------------------------------------------

function add(signal1,signal2) {
    return [
        signal1[0] + signal2[0],
        signal1[1] + signal2[1]
    ];
}

module.exports = add;