var utils = require('../../lib/utils');
var Tombola = require('tombola');
var tombola = new Tombola();

// A hard sounding noise algorithm

//-------------------------------------------------------------------------------------------
//  INIT
//-------------------------------------------------------------------------------------------

function Roar(threshold) {
    this.gain = 0.2;
    this.panning = 0;
    this.amplitude = 0;
    this.threshold = threshold || 0.8;
}

//-------------------------------------------------------------------------------------------
//  PROCESS
//-------------------------------------------------------------------------------------------

Roar.prototype.process = function() {
    var white = (Math.random() * 2 - 1);
    if (white>(-this.threshold) && white<this.threshold) {
        white = this.amplitude;
    }
    this.amplitude = white;
    return white * this.gain;
};

module.exports = Roar;