
var utils = require('../../lib/utils');
var Tombola = require('tombola');
var tombola = new Tombola();

var HarmonicVoice = require('../voices/HarmonicVoice');
var common = require('../common/Common');
var MultiPass = require('../filters/MultiPass');

// A metallic hit

//-------------------------------------------------------------------------------------------
//  INIT
//-------------------------------------------------------------------------------------------

function ChimeVoice(f,cutoff,type,ads,l,d,parent) {
    this.voice = new HarmonicVoice();
    this.timer = d;
    this.i = 0;
    this.l = l;
    this.f = f;
    this.cutoff = cutoff;
    this.type = type;
    this.ads = ads;
    this.a = 0;
    this.parent = parent;
}


function ChimeCluster() {
    this.voices = [];
    this.ads = [];
    this.i = 0;
}

//-------------------------------------------------------------------------------------------
//  PROCESS
//-------------------------------------------------------------------------------------------

ChimeVoice.prototype.process = function(input,ducking) {
    var signal = [0,0];

    if (this.timer>0) {
        this.timer--;
    } else {
        if (this.i<this.l) {
            this.i++;
            this.a = common.ADSREnvelope(this.i,this.l,this.ads);
            signal = this.voice.process(signal, this.f, this.cutoff, 1.1, this.type);
        }
        else {
            // kill
            this.l = -1;
            var ind = this.parent.voices.indexOf(this);
            this.parent.voices.splice(ind,1);
            this.parent.i--;
        }
    }

    return [
        (input[0] * (1-(this.a*ducking))) + (signal[0] * this.a),
        (input[1] * (1-(this.a*ducking))) + (signal[1] * this.a)
    ];
};




ChimeCluster.prototype.process = function(input,ducking,chance) {

    // setup event //
    if (tombola.chance(1,chance)) {

        var ads = [1,1,tombola.rangeFloat(0.2,0.5)];
        ads = [98,1,tombola.rangeFloat(0.2,0.5)];
        var l = tombola.range(3000,60000);
        var type = tombola.item(['tine','metallic','metallic2','metallic2']);

        var n = tombola.range(5,20);
        for (var i=0; i<n; i++) {
            this.voices.push( new ChimeVoice(tombola.range(100,1100), tombola.range(30,100), type, ads, l, tombola.range(1,50000), this));
        }
    }

    var vl = this.voices.length;
    if (vl>0) {

        for (this.i=0; this.i<this.voices.length; this.i++) {
            input = this.voices[this.i].process(input,ducking);
        }

    }


    return input;
};

module.exports = ChimeCluster;