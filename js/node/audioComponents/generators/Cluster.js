
var utils = require('../../lib/utils');
var Tombola = require('tombola');
var tombola = new Tombola();

var WavePlayer = require('../voices/WavePlayer');
var table = require('../voices/Tables');
var MultiPass = require('../filters/MultiPass');

// A multi-voice drone. Voices are clustered around a primary frequency,and sporadically
// splinter out before gliding back to the primary frequency.

//-------------------------------------------------------------------------------------------
//  INIT
//-------------------------------------------------------------------------------------------

function ClusterVoice(f,ratio,voice) {
    this.base = f;
    this.ratio = ratio;
    this.f = f;
    this.voice = voice;
    this.speed = tombola.rangeFloat(0.5,2);

}

function Cluster() {
    this.voices = [];
    this.a = 1;
    this.filter = new MultiPass.stereo();
    this.pass = '';
    this.res = 1;
    this.cutoff = 0;
}

//-------------------------------------------------------------------------------------------
//  PROCESS
//-------------------------------------------------------------------------------------------


Cluster.prototype.process = function(input,frequency,chance,amp) {
    frequency = frequency || 400;
    chance = chance || 40000;

    // CREATE VOICES //
    if (this.voices.length === 0) {

        // filter setup //
        this.pass = tombola.weightedItem(['LP','HP'],[2,1]);

        this.res = tombola.rangeFloat(0.1,0.7);
        if (this.pass=='LP') {
            this.cutoff = tombola.rangeFloat(200,500);
        } else {
            this.cutoff = tombola.rangeFloat(6000,7000);
        }

        var voiceNo = tombola.range(5,7);
        this.voices = [];
        for (var i=0; i<voiceNo; i++) {
            var f = 1 + (tombola.fudgeFloat(8,0.001));
            var voiceType = tombola.item([table.Metallic,table.Voice2]);
            var v = new WavePlayer(new voiceType());
            this.voices.push(new ClusterVoice( frequency, f, v ));
        }
    }

    // voices //
    var signal = [0,0];
    var vl = this.voices.length;
    for (i=0; i<vl; i++) {
        var voice = this.voices[i];
        voice.base = frequency;
        voice.f += (((voice.base-voice.f)/sampleRate)*voice.speed);
        signal = voice.voice.process(signal,voice.f*voice.ratio);
    }

    // chance //
    if (tombola.chance(1,chance)) {
        voice = this.voices[tombola.range(0,vl-1)];
        voice.f = tombola.range(voice.base*0.9,voice.base*1.1);
    }

    // alter volume based on number of voices //
    signal[0] *= (1/vl);
    signal[1] *= (1/vl);

    // filter //
    signal = this.filter.process(signal,this.pass,this.cutoff,this.res);

    return [
        (input[0] * (1-(amp))) + (signal[0] * amp),
        (input[1] * (1-(amp))) + (signal[1] * amp)
    ];
};


module.exports = Cluster;