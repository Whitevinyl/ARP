
var audio = require('./_AUDIOCOMPONENTS');
var utils = require('./lib/utils');

// This is a generic wrapper for audio component filters. It means filters can be created
// dynamically in any order and with any arguments. Our audio processing/generating loop can
// then loop through all the wrapped filters and execute their process() method without
// needing to know their individual arguments.

//-------------------------------------------------------------------------------------------
//  INIT
//-------------------------------------------------------------------------------------------


function FilterWrapper(settings) {
    this.signal = null;
    this.channel = null;
    this.index = null;
    this.args = [];
    this.mods = [];
    this.settings = settings;
    if (settings.filter) {
        this.filterFunc = settings.filter.process;
    } else {
        this.filterFunc = settings.filterFunc;
    }
}


//-------------------------------------------------------------------------------------------
//  UPDATE ARGUMENTS
//-------------------------------------------------------------------------------------------


FilterWrapper.prototype.updateArgs = function() {

    // PROCESS MODS & MOD ARGS //
    var x, z, a;
    var ml = this.settings.mods.length;
    if (ml>0) {
        this.mods = [];
        for (x = 0; x < ml; x++) {
            var mod = this.settings.mods[x];
            var mal = mod.args.length;
            var mArgs = [];
            for (z = 0; z < mal; z++) {
                a = mod.args[z];
                if ('mod' in a) {
                    if ('floor' in a) {
                        mArgs.push(utils.valueInRange(audio.controlRange(a.min, a.max,this.mods[a.mod]), a.floor, a.ceil));
                    } else {
                        mArgs.push(audio.controlRange(a.min, a.max, this.mods[a.mod]));
                    }
                }
                else {
                    mArgs.push(a.value);
                }
            }
            this.mods.push( mod.mod.process.apply(mod.mod,mArgs) );
        }
    }

    // FILTER ARGUMENTS //
    this.args = [];
    var al = this.settings.args.length;
    for (z = 0; z < al; z++) {
        a = this.settings.args[z];
        if ('context' in a) {
            this.args.push(this[a.value]);
        }
        else if ('mod' in a) {
            if ('floor' in a) {
                this.args.push(utils.valueInRange(audio.controlRange(a.min, a.max,this.mods[a.mod]), a.floor, a.ceil));
            } else {
                this.args.push(audio.controlRange(a.min, a.max,this.mods[a.mod]));
            }
        }
        else {
            this.args.push(a.value);
        }
    }
};


//-------------------------------------------------------------------------------------------
//  PROCESS
//-------------------------------------------------------------------------------------------


FilterWrapper.prototype.process = function(signal,channel,index) {
    this.signal = signal;
    this.channel = channel;
    this.index = index;
    this.updateArgs();
    return this.filterFunc.apply(this.settings.filter,this.args);
};

module.exports = FilterWrapper;
