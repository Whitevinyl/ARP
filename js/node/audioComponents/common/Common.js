
// Just using this to combine the requires of commonly used utility components among other
// components

//-------------------------------------------------------------------------------------------
//  INIT
//-------------------------------------------------------------------------------------------

var Add = require('./Add');
var ArrayEnvelope = require('./ArrayEnvelope');
var ControlRange = require('./ControlRange');
var Pan = require('./Pan');
var Repeater = require('./Repeater');
var ToMono = require('./ToMono');
var ToStereo = require('./ToStereo');



module.exports = {
    add: Add,
    arrayEnvelope: ArrayEnvelope,
    range: ControlRange,
    pan: Pan,
    toMono: ToMono,
    toStereo: ToStereo,

    Repeater: Repeater
};