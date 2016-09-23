
// Used to set a max/min range that a controller (which all spit out between -1 & 1) operates
// within. e.g using an LFO to control a frequency between 220 - 400hz

//-------------------------------------------------------------------------------------------
//  INIT
//-------------------------------------------------------------------------------------------

function controlRange(min,max,process) {
    var range = (max-min)/2;
    return min + range + (process * range);
}

module.exports = controlRange;