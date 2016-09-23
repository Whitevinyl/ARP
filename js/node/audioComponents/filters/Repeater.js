
var utils = require('../../lib/utils');
var Tombola = require('tombola');
var tombola = new Tombola();

// A primitive delay, mainly just to use within other components for adding phasing/etc

//-------------------------------------------------------------------------------------------
//  INIT
//-------------------------------------------------------------------------------------------

function Repeater() {
    this.memory = [];
}

//-------------------------------------------------------------------------------------------
//  PROCESS
//-------------------------------------------------------------------------------------------

Repeater.prototype.process = function(signal,delay,mix) {
    this.memory.push(signal);

    if (this.memory.length>delay) {
        var m;
        while (this.memory.length>delay) {
            m = this.memory.shift();
        }
        signal = [
            (signal[0]*(1-mix)) + (m[0]*mix),
            (signal[1]*(1-mix)) + (m[1]*mix)
        ];
    }
    return signal;
};

module.exports = Repeater;
