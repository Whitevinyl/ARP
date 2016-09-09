
//-------------------------------------------------------------------------------------------
//  MAIN
//-------------------------------------------------------------------------------------------

// code here is super raw while I'm experimenting, but this will be tidied into methods &
// components which procedurally generate audio and create a stereo .WAV without using
// the web audio API or any other audio processing.

var utils = require('./utils');
var Tombola = require('tombola');
var tombola = new Tombola();

var GenChart = require('./_GENCHART');
var genChart = new GenChart();

var audio = require('./_AUDIOCOMPONENTS');




var sampleRate = 44100;
//var noiseSource;


function GenerateAudio() {

}

GenerateAudio.prototype.generate = function() {

    // AUDIO LENGTH //
    var seconds = tombola.range(19,28);
    //seconds = 2;
    console.log('seconds: '+seconds);

    return printWaveform(seconds);
};

function printWaveform(seconds) {


    var l = sampleRate * seconds;
    var channels = [new Float32Array(l),new Float32Array(l)];
    var amp = 1;
    var peak = 0;



    // voices //
    var voice = new audio.Voice(tombola.rangeFloat(40,70));

    var noise = [];
    noise.push(new audio.VoiceCracklePeak());
    noise.push(new audio.VoiceCrackle());


    var LPL = new audio.FilterLowPass2();
    var LPR = new audio.FilterLowPass2();

    var holdL = new audio.FilterDownSample();
    var holdR = new audio.FilterDownSample();

    var cutoff = 8000;
    var cutstyle = tombola.chance(1,5);
    var delay = 10;
    var modRoot = tombola.range(1500,7000);
    modRoot = 1500;
    var modLevel = tombola.rangeFloat(0.05,0.6);
    var hold = 50;
    var holdMod = tombola.fudge(2,1);
    var foldback = tombola.rangeFloat(0.2,1);
    var clipping = 0.9;
    if (tombola.percent(20)) {
        clipping = tombola.rangeFloat(0.5,0.9);
    }

    var noiseShift = tombola.percent(50);
    console.log('noiseShift: '+noiseShift);
    var reverb = tombola.percent(40);
    console.log('reverb: '+reverb);
    var fold = tombola.chance(1,3);
    console.log('fold: '+fold);
    var rumble = tombola.percent(30);
    console.log('rumble: '+rumble);
    var pulsing = tombola.percent(30);
    console.log('pulsing: '+pulsing);
    var phaseWander = tombola.percent(30);
    console.log('phaseWander: '+phaseWander);
    var phaseLFO = tombola.percent(30);
    if (phaseWander) {
        phaseLFO = false;
    }
    console.log('phaseLFO: '+phaseLFO);
    var sampleMode = tombola.item([1,3]);

    var Lfo = new audio.LFO();
    var Lfo2 = new audio.LFO();
    var Wlk = new audio.Walk();
    var Wlk2 = new audio.WalkSmooth();
    var Wlk3 = new audio.Walk();
    var Wlk4 = new audio.Walk();
    var walkVoice = new audio.WalkSmooth();
    var chop = new audio.FilterChopper();
    var chopRate = 4000;
    var chopDepth = 1;
    var glide = new audio.Glide();
    var glide2 = new audio.Glide();
    var takeoff = new audio.Takeoff();
    var flipper = new audio.FilterFlipper();
    var Jmp = new audio.Jump();

    var resampler = new audio.FilterResampler();
    var pulse = new audio.FilterPulse();
    var siren = new audio.FilterSiren();
    var subSwell = new audio.FilterSubSwell();
    var wail = new audio.FilterWail();
    var growl = new audio.FilterGrowl();
    var phaseSine = new audio.PhaseSine();
    var phaseLfo = new audio.LFO();
    var phaseLfo2 = new audio.LFO();

    // LOOP THROUGH SAMPLES //
    for (var i=0; i<l; i++) {

        var signal = [0,0];


        // UPDATE VOICE //
        if (tombola.chance(1,500)) {
            voice.gain += (tombola.fudge(1, 1))*0.01;
        }
        voice.panning += (tombola.fudge(1,1)*0.005);

        voice.frequency = utils.valueInRange(voice.frequency, 10, 19000);
        voice.gain = utils.valueInRange(voice.gain, 0, 0.5);
        voice.panning = utils.valueInRange(voice.panning, -1, 1);


        // UPDATE VOICE WAVE SHAPES //
        if (tombola.chance(1,5000)) {
            voice.type = -voice.type;
        }
        if (voice.type===-1) {
            audio.waveSawtooth(voice, amp);
        } else {
            audio.waveTriangle(voice, amp);
        }
        signal[0] += ((voice.amplitude * voice.gain) * (1 + (-voice.panning)));
        signal[1] += ((voice.amplitude * voice.gain) * (1 + voice.panning));


        // RUMBLE //
        if (rumble) {
            var wv = walkVoice.process(650,10) * 0.3;  ////
            signal[0] += (wv);
            signal[1] += (wv);
        }


        // BIT CRUSH //
        signal[0] = holdL.process(hold,signal[0]);
        signal[1] = holdR.process(hold,signal[1]);
        /*if (tombola.chance(1,5000)) {
            hold += tombola.fudge(3, 1);
        }*/
        if (tombola.chance(1,40000)) {
            holdMod = tombola.fudgeFloat(8,0.0001);
        }
        hold += holdMod;
        //hold = valueInRange(hold, 10, 150);
        if (hold<10) {
            holdMod = 0.0001;
        }
        if (hold>150) {
            holdMod = -0.0001;
        }

        // NOISE CHANGE //
        if (noiseShift && tombola.chance(1,20000)) {
            var p = noise[1].panning;
            noise[1] = tombola.item([new audio.VoiceWhite(), new audio.VoiceBrown(), new audio.VoiceRoar(), new audio.VoiceCracklePeak(), new audio.VoiceCrackle()]);
            noise[1].panning = p;
        }


        // NOISE LOOP //
        for (var h=1; h<noise.length; h++) {
            noise[h].panning += tombola.rangeFloat(-0.005,0.005);
            noise[h].panning = utils.valueInRange(noise[h].panning, -1, 1);

            if (tombola.chance(1,500)) {
                noise[h].gain += tombola.rangeFloat(-0.01,0.01);
                noise[h].gain = utils.valueInRange(noise[h].gain, 0, 0.4);
            }

            if (noise[h].threshold && h>0 && tombola.chance(1,500)) {
                noise[h].threshold += tombola.rangeFloat(-0.01,0.01);
                noise[h].threshold = utils.valueInRange(noise[h].threshold, 0.05, 1);
            }

            var noiseAmp = noise[h].process();
            signal[0] += (noiseAmp  * (1 + (-noise[h].panning)) );
            signal[1] += (noiseAmp  * (1 + noise[h].panning) );
        }


        // BIT CRUSH //
        /*var hold2 = 10 + (glide2.process(1, 25000)*200);
        signal[0] = holdL.process(hold2,signal[0]);
        signal[1] = holdR.process(hold2,signal[1]);*/


        // PULSE //
        if (pulsing) {
            signal = pulse.process(signal,1,false);
        }

        // SIREN //
        signal = siren.process(signal,0.5,100000);

        // SUB //
        signal = subSwell.process(signal,0.6,200000);

        // WAIL //
        signal = wail.process(signal,0.6,200000);

        // GROWL //
        signal = growl.process(signal,0.6,200000);

        // PHASE SINE //
        /*var ps = phaseSine.process(200, 2 + (phaseLfo.process(0.6)*1), 80 + (phaseLfo2.process(0.35)*50));
        signal[0] += (ps*0.1);
        signal[1] += (ps*0.1);*/

        // FEEDBACK FILTER //
        if (phaseWander) {
            if (tombola.chance(1,500)) {
                delay += (tombola.fudge(3, 2)*0.5);
            }
            delay = utils.valueInRange(delay, 10, 5000);
            signal = audio.filterStereoFeedbackX(signal,0.5,delay,channels,i); ////
        }


        //signal = filterStereoFeedbackX(signal,0.4,310,channels,i);
        //signal = filterStereoFeedbackX(signal,0.1,900,channels,i);

        // FEEDBACK FILTER //
        if (phaseLFO) {
            var dt = 10 + modRoot + (Lfo.process(1.2)*1500);
            signal = audio.filterStereoFeedbackX(signal,modLevel,dt,channels,i); ////
        }



        // FOLDBACK DISTORTION //
        if (fold) {
            if (tombola.chance(1,500)) {
                foldback += (tombola.fudge(1, 1)*0.02);
            }
            foldback = utils.valueInRange(foldback, 0.05, 1);
            signal = audio.filterStereoFoldBack(signal,foldback);  /////
        }


        // CHOPPER FILTER //
        chopRate = 6000 + (Wlk3.process(1,20000)*5800);
        chopDepth = 1 + (Wlk2.process(3,100));
        if (chopDepth>1) {
            chopDepth = 1;
        }
        var chp = chop.process(chopRate,chopDepth);
        signal[0] *= chp;
        signal[1] *= chp;


        // REVERB //
        if (reverb) {
            signal = audio.filterStereoReverb(signal,0.5,20,11,channels,i); /////
        }


        // FOLDBACK 2 DISTORTION //
        //signal = filterStereoFoldBack2(signal,0.6, 1.4); // crisp, low-end color


        // CLIPPING 2 DISTORTION //
        signal = audio.filterStereoClipping2(signal,clipping,0.2);  /////


        // RESAMPLER //
        signal = resampler.process(signal,sampleMode,200000,channels,i);
        //signal = resampler.process(signal,4,200000,channels,i);


        // LOW PASS FILTER //
        signal[0] = LPL.process(cutoff,0.92,signal[0]);
        signal[1] = LPR.process(cutoff,0.92,signal[1]);
        cutoff = 4700 + (Wlk.process(0.2, 30000)*4300);
        if (cutstyle) {
            cutoff = 4700 + (glide.process(1, 30000)*4300);
        }
        //cutoff = 4700 + (Wlk2.process(5, 200)*4300);
        //cutoff = 4700 + (Jmp.process(30000)*4300);
        //cutoff = 4700 + (takeoff.process(0.2, 30000)*4300);


        // FEEDBACK FILTER //
        /*if (i % tombola.range(2,3) === 0) {
            var ndt = 1000 + (glide.process(5, 30000, -1)*995);
            filterFeedback2(totalL, 0.6,ndt,channels[1],i,l);
            filterFeedback2(totalR, 0.6,ndt,channels[0],i,l);
        }*/


        // INVERT DISTORTION //
        //signal = filterStereoInvert(signal, 0.5); // horrible :)

        // ERODE DISTORTION //
        //signal = filterStereoErode(signal,3000,i); // crackles


        // FLIPPER DISTORTION //
        /*var flp = 25 + (glide.process(0.5,20000)*10);
        totalL = flipper.process(totalL,flp);
        totalR = flipper.process(totalR,flp);*/


        // PANNER //
        /*var panRate = 20 + (Wlk4.process(0.5,26000)*19.8);
        signal = filterStereoPanner(signal,Lfo2.process(panRate));*/



        // WRITE VALUES //
        if (channels[0][i]) {
            channels[0][i] += signal[0];
        } else {
            channels[0][i] = signal[0];
        }
        if (channels[1][i]) {
            channels[1][i] += signal[1];
        } else {
            channels[1][i] = signal[1];
        }


        // PEAK //
        var ttl = channels[0][i];
        if (ttl<0) { ttl = -ttl; }
        var ttr = channels[1][i];
        if (ttr<0) { ttr = -ttr; }

        if (ttl > peak) { peak = ttl; }
        if (ttr > peak) { peak = ttr; }
    }


    // PASS 2 //
    var mult = 1/peak;
    //var lw = units*0.75;

    for (i=0; i<l; i++) {

        // GET VALUES //
        signal[0] = channels[0][i];
        signal[1] = channels[1][i];

        // NORMALISE //
        signal[0] *= mult;
        signal[1] *= mult;

        // FADES //
        var f = 1;
        var fade = 2500;
        if (i<fade) { f = i / fade; }
        if (i>((l-1)-fade)) { f = ((l-1)-i) / fade; }

        // WRITE VALUES //
        channels[0][i] = signal[0] * f;
        channels[1][i] = signal[1] * f;

        // DRAW //
        /*if (i % 400 == 0) {
            if (signal[0]<0) {signal[0] = -signal[0];}
            if (signal[1]<0) {signal[1] = -signal[1];}
            cxa.fillRect(cx + (sx*i),cy - (he*1.3) - (signal[0] * he),lw,(signal[0] * he)*2);
            cxa.fillRect(cx + (sx*i),cy + (he*1.3) - (signal[1] * he),lw,(signal[1] * he)*2);
        }*/
    }


    console.log('generated');
    return {
        audioData: {
            sampleRate: sampleRate,
            channelData: channels
        },
        seconds: seconds,
        id: genChart.generateID(),
        cat: genChart.generateCat(),
        date: genChart.generateDate(),
        time: genChart.generateTime(),
        frequency: genChart.generateFrequency()
    };
}




module.exports = GenerateAudio;