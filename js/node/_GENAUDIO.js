
var utils = require('./lib/utils');
var Tombola = require('tombola');
var tombola = new Tombola();

var GenChart = require('./_GENCHART');
var genChart = new GenChart();
var Arranger = require('./_ARRANGER');
var arranger = new Arranger();

var audio = require('./_AUDIOCOMPONENTS');
var FilterWrapper = require('./_FILTERWRAPPER');

// Audio is generated here using javascript components in _AUDIOCOMPONENTS.js. Signals are
// generated and filtered in sequence and panned between stereo channels. Multiple techniques
// are used, subtractive & additive synthesis, wavetables, granular self-sampling, IIR & FIR
// filtering.

//-------------------------------------------------------------------------------------------
//  INIT
//-------------------------------------------------------------------------------------------


function GenerateAudio() {

}

var proto = GenerateAudio.prototype;

//-------------------------------------------------------------------------------------------
//  MAIN
//-------------------------------------------------------------------------------------------


proto.generate = function() {

    // AUDIO LENGTH //
    var seconds = tombola.range(19,29);
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


    rumble = false;
    pulsing = false;
    phaseLFO = false;
    sampleMode = 3;
    fold = false;
    reverb = false;
    phaseWander = true;
    noiseShift = true;

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
    var bitCrush = new audio.FilterStereoDownSample();
    var bitMod = new audio.Glide2();

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
        /*signal[0] = holdL.process(hold,signal[0]);
        signal[1] = holdR.process(hold,signal[1]);
        /!*if (tombola.chance(1,5000)) {
            hold += tombola.fudge(3, 1);
        }*!/
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
        }*/

        // BIT CRUSH //
        signal = bitCrush.process(signal,audio.controlRange(10,150,bitMod.process(0.07,10000)),0.5); ///

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
        /*chopRate = 6000 + (Wlk3.process(1,20000)*5800);
        chopDepth = 1 + (Wlk2.process(3,100));
        if (chopDepth>1) {
            chopDepth = 1;
        }
        var chp = chop.process(chopRate,chopDepth); /////
        signal[0] *= chp; ////
        signal[1] *= chp;*/


        // REVERB //
        if (reverb) {
            signal = audio.filterStereoReverb(signal,0.5,20,11,channels,i); /////
        }


        // FOLDBACK 2 DISTORTION //
        //signal = filterStereoFoldBack2(signal,0.6, 1.4); // crisp, low-end color


        // CLIPPING 2 DISTORTION //
        signal = audio.filterStereoClipping2(signal,clipping,0.2);  /////


        // RESAMPLER //
        signal = resampler.process(signal,sampleMode,200000,channels,i); ///


        // LOW PASS FILTER //
        signal[0] = LPL.process(cutoff,0.92,signal[0]); /////
        signal[1] = LPR.process(cutoff,0.92,signal[1]);
        cutoff = 4700 + (Wlk.process(0.2, 30000)*4300);
        if (cutstyle) {
            cutoff = 4700 + (glide.process(1, 30000)*4300);
        }
        //cutoff = 4700 + (Wlk2.process(5, 200)*4300);
        //cutoff = 4700 + (Jmp.process(30000)*4300);
        //cutoff = 4700 + (takeoff.process(0.2, 30000)*4300);

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
        frequency: genChart.generateFrequency(),
        bandwidth: genChart.generateBandWidth(),
        level: genChart.generateLevel()
    };
}


proto.test = function() {
    var seconds = 28;
    var peak = 0;
    var l = sampleRate * seconds;
    var inOut = new audio.InOut();

    console.log('test');
    //var filters = this.buildFilters();
    var filters = arranger.arrangement();
    var channels = [new Float32Array(l),new Float32Array(l)];

    for (var i=0; i<l; i++) {
        var signal = [0,0];


        for (var h=0; h<filters.length; h++) {
            // process //
            var process = filters[h].process(signal, channels, i);
            // failsafe //
            signal = signalTest(process,signal);
        }

        signal = inOut.process(signal,i,l);

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
        frequency: genChart.generateFrequency(),
        bandwidth: genChart.generateBandWidth(),
        level: genChart.generateLevel()
    };
};

function signalTest(signal,fallback) {
    if (signal!==undefined && signal[0]!==undefined && signal[1]!==undefined && signal[0]==signal[0] && signal[1]==signal[1]) {
        return signal;
    } else {
        return fallback;
    }
}


proto.buildFilters =  function() {
    var settings;
    var f = [];

    // SIREN //
    /*settings = {
        filter: new audio.FilterSiren(),
        args: [
            {context: true, value: 'signal'},
            {value: 0.5},
            {value: 100000}
        ],
        mods: []
    };
    f.push(new FilterWrapper(settings));*/


    // PULSE //
    /*settings = {
        filter: new audio.FilterPulse(),
        args: [
            {context: true, value: 'signal'},
            {value: 0.7},
            {value: true}
        ],
        mods: []
    };
    f.push(new FilterWrapper(settings));*/


    // VOICE // 20 - 40
    settings = {
        filter: new audio.Voice(tombola.rangeFloat(20,40)),
        args: [
            {context: true, value: 'signal'},
            {value: 'triangle'}
        ],
        mods: []
    };
    f.push(new FilterWrapper(settings));


    // BITCRUSH //
   /* settings = {
        filter: new audio.FilterStereoDownSample(),
        args: [
            {context: true, value: 'signal'},
            {mod:0, min:10, max: 150},
            {value: 0.5}
        ],
        mods: [
            {
                mod: new audio.Glide2(),
                args: [
                    {value: 0.07},
                    {value: 10000}
                ]
            }
        ]
    };
    f.push(new FilterWrapper(settings));*/


    // NOISE //
    settings = {
        filter: new audio.NoiseWrapper(),
        args: [
            {context: true, value: 'signal'}//,
            //{value: 20000}
        ],
        mods: []
    };
    f.push(new FilterWrapper(settings));


    // SIREN //
    settings = {
         filter: new audio.FilterSiren(),
         args: [
             {context: true, value: 'signal'},
             {value: 0.5},
             {value: 100000}
         ],
         mods: []
     };
     f.push(new FilterWrapper(settings));


    // SUB //
    settings = {
        filter: new audio.FilterSubSwell(),
        args: [
            {context: true, value: 'signal'},
            {value: 0.6},
            {value: 200000}
        ],
        mods: []
    };
    f.push(new FilterWrapper(settings));


    // WAIL //
    settings = {
        filter: new audio.FilterWail(),
        args: [
            {context: true, value: 'signal'},
            {value: 0.6},
            {value: 200000}
        ],
        mods: []
    };
    f.push(new FilterWrapper(settings));


    // GROWL //
    settings = {
        filter: new audio.FilterGrowl(),
        args: [
            {context: true, value: 'signal'},
            {value: 0.6},
            {value: 200000}
        ],
        mods: []
    };
    f.push(new FilterWrapper(settings));


    // PHASE WANDER //
    settings = {
        filterFunc: audio.filterStereoFeedbackX,
        args: [
            {context: true, value: 'signal'},
            {value: 0.4},
            {mod: 1, min: 10, max: 2000},
            //{mod: 1, min: -0.1, max: 0.5, floor: 0, ceil: 1},
            //{mod: 0, min: 500, max: 1000},
            {context: true, value: 'channel'},
            {context: true, value: 'index'}
        ],
        mods: [
            /*{
                mod: new audio.FudgeChance(),
                args: [
                    {value: 3},
                    {value: 0.018},
                    {value: 550}
                ]
            }*/
            {
                mod: new audio.Looper(),
                args: [
                    {value: 1000},
                    {value: 0.05},
                    {value: 50000}
                ]
            },
            {
                mod: new audio.MoveTo(),
                args: [
                    {value: 0.09},
                    {value: 20000}
                ]
            }
        ]
    };
    f.push(new FilterWrapper(settings));


    // CHOPPER //
    settings = {
        filter: new audio.FilterStereoChopper(),
        args: [
            {context: true, value: 'signal'},
            {mod:0, min:200, max: 12000},
            {mod:1, min:0, max: 2, floor: 0, ceil: 1}
        ],
        mods: [
            {
                mod: new audio.WalkSmooth(),
                args: [
                    {value: 3},
                    {value: 100}
                ]
            },
            {
                mod: new audio.Walk(),
                args: [
                    {value: 1},
                    {value: 20000}
                ]
            }
        ]
    };
    f.push(new FilterWrapper(settings));


    // CLIPPING //
    settings = {
        filterFunc: audio.filterStereoClipping2,
        args: [
            {context: true, value: 'signal'},
            {value: 0.9},
            {value: 0.2}
        ],
        mods: []
    };
    f.push(new FilterWrapper(settings));


    // RESAMPLER //
    settings = {
        filter: new audio.FilterResampler(),
        args: [
            {context: true, value: 'signal'},
            {value: 3},
            {value: 200000},
            {context: true, value: 'channel'},
            {context: true, value: 'index'}
        ],
        mods: []
    };
    f.push(new FilterWrapper(settings));


    // LOW PASS //
    settings = {
        filter: new audio.FilterStereoLowPass2(),
        args: [
            {context: true, value: 'signal'},
            {mod: 0, min: 400, max: 9000},
            {value: 0.92}
        ],
        mods: [
            {
                mod: new audio.Walk(),
                args: [
                    {value: 0.2},
                    {value: 30000}
                ]
            }
        ]
    };
    f.push(new FilterWrapper(settings));

    // WAIL //
    /*settings = {
        filter: new audio.FilterWail(),
        args: [
            {context: true, value: 'signal'},
            {value: 0.5},
            {value: 10000}
        ],
        mods: []
    };
    f.push(new FilterWrapper(settings));*/

    // GROWL //
    /*settings = {
        filter: new audio.FilterGrowl(),
        args: [
            {context: true, value: 'signal'},
            {value: 0.3},
            {value: 150000}
        ],
        mods: []
    };
    f.push(new FilterWrapper(settings));*/

    // WAIL //
    /*settings = {
        filter: new audio.FilterWail(),
        args: [
            {context: true, value: 'signal'},
            {value: 0.3},
            {value: 10000},
            {value: 200}
        ],
        mods: []
    };
    f.push(new FilterWrapper(settings));

    settings = {
        filter: new audio.FilterWail(),
        args: [
            {context: true, value: 'signal'},
            {value: 0.3},
            {value: 15000},
            {value: 300}
        ],
        mods: []
    };
    f.push(new FilterWrapper(settings));*/


    // HOWL //
    /*settings = {
        filter: new audio.FilterHowl(),
        args: [
            {context: true, value: 'signal'},
            {mod:0, min:150, max: 900},
            {mod:1, min:0, max: 0.7}
        ],
        mods: [
            {
                mod: new audio.Weave(),
                args: [
                    {value: 0.1},
                    {value: 7000}
                ]
            },
            {
                mod: new audio.Walk(),
                args: [
                    {value: 0.09},
                    {value: 15000}
                ]
            }
        ]
    };
    f.push(new FilterWrapper(settings));


    settings = {
        filter: new audio.FilterHowl(),
        args: [
            {context: true, value: 'signal'},
            {mod:0, min:150, max: 900},
            {mod:1, min:0, max: 0.7}
        ],
        mods: [
            {
                mod: new audio.Weave(),
                args: [
                    {value: 0.1},
                    {value: 7000}
                ]
            },
            {
                mod: new audio.Walk(),
                args: [
                    {value: 0.09},
                    {value: 15000}
                ]
            }/!*,
            {
                mod: new audio.Glide(),
                args: [
                    {value: 5},
                    {value: 25000},
                    {value: 1}
                ]
            },
            {
                mod: new audio.WeaveJump(),
                args: [
                    {value: 0.1},
                    {value: 7000},
                    {value: 80000}
                ]
            }*!/
        ]
    };
    f.push(new FilterWrapper(settings));*/


    // PHASE SINE //
    /*var ps1 = tombola.rangeFloat(20,300);
    //var ps2 = tombola.rangeFloat(0.001,1.1);
    var ps2 = tombola.rangeFloat(0.001,0.3);
    var ps3 = tombola.rangeFloat(20,300);
    console.log('f: ' + ps1 + ' f1: ' + ps2 + ' f2: ' + ps3);

    settings = {
        filter: new audio.PhaseWrapper(),
        args: [
            {context: true, value: 'signal'},
            {value: 0.3},
            //{value: ps1},
            {mod:1, min:16, max:200},
            {value: ps2},
            {value: ps3},
            {mod:0, min: -1, max: 1, floor: 0, ceil: 1}
        ],
        mods: [
            {
                mod: new audio.Walk(),
                args: [
                    {value: 0.09},
                    {value: 20000}
                ]
            },
            {
                mod: new audio.Weave(),
                args: [
                    {value: 0.085},
                    {value: 8000}
                ]
            }
        ]
    };
    f.push(new FilterWrapper(settings));


    // PHASE SINE //
    ps1 = tombola.rangeFloat(20,300);
    //ps2 = tombola.rangeFloat(0.001,1.1);
    ps2 = tombola.rangeFloat(0.001,0.3);
    ps3 = tombola.rangeFloat(20,300);
    console.log('f: ' + ps1 + ' f1: ' + ps2 + ' f2: ' + ps3);

    settings = {
        filter: new audio.PhaseWrapper(),
        args: [
            {context: true, value: 'signal'},
            {value: 0.3},
            //{value: ps1},
            {mod:1, min:16, max:200},
            {value: ps2},
            {value: ps3},
            {mod:0, min: -1, max: 1, floor: 0, ceil: 1}
        ],
        mods: [
            {
                mod: new audio.Walk(),
                args: [
                    {value: 0.09},
                    {value: 20000}
                ]
            },
            {
                mod: new audio.Weave(),
                args: [
                    {value: 0.085},
                    {value: 8000}
                ]
            }
        ]
    };
    f.push(new FilterWrapper(settings));*/


    // ERODE //
    /*settings = {
        filterFunc: audio.filterStereoErode,
        args: [
            {context: true, value: 'signal'},
            {value: 1000},
            {context: true, value: 'index'}
        ],
        mods: []
    };
    f.push(new FilterWrapper(settings));*/

    // GROWL //
    /*settings = {
        filter: new audio.FilterGrowl(),
        args: [
            {context: true, value: 'signal'},
            {value: 0.3},
            {value: 150000}
        ],
        mods: []
    };
    f.push(new FilterWrapper(settings));*/


    // BURST //
    /*settings = {
        filter: new audio.FilterBurst(),
        args: [
            {context: true, value: 'signal'},
            {value: 1},
            {value: 50000},
            {value: 300},
            {value: true},
            {value: 100}
        ],
        mods: []
    };
    f.push(new FilterWrapper(settings));
    // BURST //
    settings = {
        filter: new audio.FilterBurst(),
        args: [
            {context: true, value: 'signal'},
            {value: 1},
            {value: 160000},
            {value: 300},
            {value: true},
            {value: 500}
        ],
        mods: [
            {
                mod: new audio.Jump(),
                args: [
                    {value: 90000}
                ]
            }
        ]
    };
    f.push(new FilterWrapper(settings));*/






    // DISTORTION //
    /*settings = {
        filterFunc: audio.filterStereoFoldBack2,
        args: [
            {context: true, value: 'signal'},
            {value: 0.5},
            {value: 0.5}
        ],
        mods: []
    };
    f.push(new FilterWrapper(settings));


    // FEEDBACK //
    settings = {
        filterFunc: audio.filterStereoFeedbackX,
        args: [
            {context: true, value: 'signal'},
            {value: 0.5},
            //{mod: 0, min: 40, max: 400},
            {mod: 2, min: 10, max: 4000},
            //{mod: 1, min: 10, max: 1000},
            {context: true, value: 'channel'},
            {context: true, value: 'index'}
        ],
        mods: [
            {
                mod: new audio.Glide(),
                args: [
                    //{mod: 0, min: 0.02, max: 0.15},
                    {value: 1},
                    {value: 80000}
                ]
            },
            {
                mod: new audio.FudgeChance(),
                args: [
                    //{mod: 0, min: 0.02, max: 0.15},
                    {value: 3},
                    {value: 0.005},
                    {value: 600}
                ]
            },
            {
                mod: new audio.MoveTo(),
                args: [
                    //{mod: 0, min: 0.02, max: 0.15},
                    {value: 0.5},
                    {value: 100000}
                ]
            }
        ]
    };
    f.push(new FilterWrapper(settings));*/


    // CLIPPING //
    /*settings = {
        filterFunc: audio.filterStereoClipping2,
        args: [
            {context: true, value: 'signal'},
            {value: 0.9},
            {value: 0.1}
        ],
        mods: []
    };
    f.push(new FilterWrapper(settings));*/





    // LOW PASS //
    /*settings = {
        filter: new audio.FilterStereoLowPass2(),
        args: [
            {context: true, value: 'signal'},
            //{mod: 1, min: 350, max: 9000},
            {mod: 2, min: 500, max: 8000},
            {value: 0.92}
        ],
        mods: [
            {
                mod: new audio.WalkSmooth(),
                args: [
                    {value: 0.2},
                    {value: 1000}
                ]
            },
            {
                mod: new audio.Walk(),
                args: [
                    //{mod: 0, min: 0.02, max: 0.15},
                    {value: 0.1},
                    {value: 20000}
                ]
            },
            {
                mod: new audio.MoveTo(),
                args: [
                    //{mod: 0, min: 0.02, max: 0.15},
                    {value: 0.5},
                    {value: 100000}
                ]
            }
        ]
    };
    f.push(new FilterWrapper(settings));*/





    // RESAMPLER //
    /*var mode = tombola.weightedItem([1,2,3,4],[5,1,5,2]);
    console.log(mode);
    settings = {
        filter: new audio.FilterResampler(),
        args: [
            {context: true, value: 'signal'},
            {value: 6},
            {value: 200000},
            {context: true, value: 'channel'},
            {context: true, value: 'index'}
        ],
        mods: []
    };
    f.push(new FilterWrapper(settings));*/

    return f;
};



module.exports = GenerateAudio;