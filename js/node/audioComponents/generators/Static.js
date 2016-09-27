
var utils = require('../../lib/utils');
var Tombola = require('tombola');
var tombola = new Tombola();

var common = require('../common/Common');
var Noise = require('../filters/Noise');
var FudgeChance = require('../mods/FudgeChance');
var MultiPass = require('../filters/MultiPass');

// A finishing subtle noise layer that always goes at the end of a chain, to try and keep
// the right mood & consistency.

//-------------------------------------------------------------------------------------------
//  INIT
//-------------------------------------------------------------------------------------------

function Static() {
    this.noise = new Noise.stereo();
    this.filter = new MultiPass.stereo();
    this.threshold = tombola.rangeFloat(0.6,0.95);
    this.mod = new FudgeChance();
}

//-------------------------------------------------------------------------------------------
//  PROCESS
//-------------------------------------------------------------------------------------------

Static.prototype.process = function(signal,level) {
    level = utils.arg(level,tombola.rangeFloat(0.001,0.002));


    // create noise //
    var noiseLayer = [0,0];
    var nl = common.range(0,level,this.mod.process(4,0.025,600));
    noiseLayer = this.noise.process(noiseLayer,nl,this.threshold);


    // filter a little //
    noiseLayer = this.filter.process(noiseLayer,'LP',9000,0.8);


    return common.add(signal,noiseLayer);
};

module.exports = Static;