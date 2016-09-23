
var utils = require('../../lib/utils');
var Tombola = require('tombola');
var tombola = new Tombola();

var WavePlayer = require('../voices/WavePlayer');
var table = require('../voices/Tables');
var Repeater = require('../filters/Repeater');
var MultiPass = require('../filters/MultiPass');

// A multi-voice ambient sound. Voices are clustered around a primary frequency,and are
// contantly moving around it.

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
    this.delay = new Repeater();
    this.delay2 = new Repeater();
    this.delay3 = new Repeater();
    this.filter = new MultiPass.stereo();
}

//-------------------------------------------------------------------------------------------
//  PROCESS
//-------------------------------------------------------------------------------------------

Flocking.prototype.process = function(input,frequency,rate,amp) {
    frequency = frequency || 400;
    rate = rate || 40000;

    // CREATE VOICES //
    if (this.voices.length === 0) {

        var voiceNo = tombola.range(7,9);

        this.voices = [];
        for (var i=0; i<voiceNo; i++) {
            var ratio = tombola.rangeFloat(-0.1,0.1);
            var voiceType = tombola.item([table.Metallic,table.Voice2,table.SharkFin]);
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
            voice.ySpeed -= tombola.rangeFloat(((rate*0.001)/sampleRate),(rate/sampleRate));
        }
        if (voice.f < frequency) {
            voice.ySpeed += tombola.rangeFloat(((rate*0.001)/sampleRate),(rate/sampleRate));
        }
        voice.ySpeed = utils.valueInRange(voice.ySpeed,-1,1);
        
        voice.f += voice.ySpeed;
        voice.f = utils.valueInRange(voice.f,10,20000);
        signal = voice.voice.process(signal,voice.f);
    }


    // alter volume based on number of voices //
    signal[0] *= (1/vl);
    signal[1] *= (1/vl);

    // delay //
    signal = this.filter.process(signal,'LP',frequency*0.68,0.1);
    signal = this.delay.process(signal,2907,0.4);
    signal = this.delay2.process(signal,7730,0.4);
    signal = this.delay3.process(signal,12576,0.4);


    return [
        (input[0] * (1-(amp))) + (signal[0] * amp),
        (input[1] * (1-(amp))) + (signal[1] * amp)
    ];
};


module.exports = Flocking;
