
var utils = require('../../lib/utils');
var Tombola = require('tombola');
var tombola = new Tombola();

var WavePlayer = require('../voices/WavePlayer');
var table = require('../voices/Tables');

// A multi-voice drone. Voices are clustered around a primary frequency,and sporadically
// splinter out before gliding back to the primary frequency.

//-------------------------------------------------------------------------------------------
//  INIT
//-------------------------------------------------------------------------------------------

function FlockingVoice(f,ratio,voice) {
    this.f = f;
    this.ratio = ratio;
    this.voice = voice;
    this.ySpeed = 0;
}

function Flocking() {
    this.voices = [];
    this.a = 1;
}

//-------------------------------------------------------------------------------------------
//  PROCESS
//-------------------------------------------------------------------------------------------

Flocking.prototype.process = function(input,frequency,rate,amp) {
    frequency = frequency || 400;
    rate = rate || 40000;

    // CREATE VOICES //
    if (this.voices.length === 0) {

        var voiceNo = tombola.range(7,10);

        this.voices = [];
        for (var i=0; i<voiceNo; i++) {
            var ratio = tombola.rangeFloat(-0.1,0.1);
            var voiceType = tombola.item([table.Metallic,table.Voice2]);
            var v = new WavePlayer(new voiceType());
            this.voices.push(new FlockingVoice( frequency * tombola.rangeFloat(0.85,1.2), ratio, v ));
        }
    }

    // voices //
    var signal = [0,0];
    var vl = this.voices.length;
    for (i=0; i<vl; i++) {
        var voice = this.voices[i];

        if (voice.f > frequency) {
            voice.ySpeed -= tombola.rangeFloat(((rate*0.1)/sampleRate),(rate/sampleRate));
        }
        if (voice.f < frequency) {
            voice.ySpeed += tombola.rangeFloat(((rate*0.1)/sampleRate),(rate/sampleRate));
        }
        voice.ySpeed = utils.valueInRange(voice.ySpeed,-1,1);
        
        voice.f += voice.ySpeed;
        voice.f = utils.valueInRange(voice.f,10,20000);
        signal = voice.voice.process(signal,voice.f);
    }


    // alter volume based on number of voices //
    signal[0] *= (1/vl);
    signal[1] *= (1/vl);

    return [
        (input[0] * (1-(amp))) + (signal[0] * amp),
        (input[1] * (1-(amp))) + (signal[1] * amp)
    ];
};


module.exports = Flocking;
