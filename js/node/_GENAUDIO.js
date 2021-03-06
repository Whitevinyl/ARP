
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
// filtering. Arranger (_ARRANGER.js) selects the components to be used, and the Orchestrator
// (_ORCHESTRATOR.js) creates them and wraps them for use here.

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

    // SETUP THIS AUDIO //
    var seconds = tombola.range(23,31);
    console.log('seconds: '+seconds);

    var l = sampleRate * seconds;
    var channels = [new Float32Array(l),new Float32Array(l)];
    var inOut = new audio.InOut();
    var peak = 0;

    // CHOOSE & CREATE OUR FILTERS/GENERATORS //
    var filters = arranger.arrangement();


    // LOOP EACH SAMPLE //
    for (var i=0; i<l; i++) {
        var signal = [0,0];

        // PROCESS EACH FILTER & CHECK IT RETURNS A GOOD SIGNAL //
        for (var h=0; h<filters.length; h++) {
            var process = filters[h].process(signal, channels, i);
            signal = signalTest(process,signal);
        }

        // ADD START/FINISH NOISE //
        signal = inOut.process(signal,i,l);

        // WRITE TO AUDIO CHANNELS //
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

        // MEASURE PEAK //
        var ttl = channels[0][i];
        if (ttl<0) { ttl = -ttl; }
        var ttr = channels[1][i];
        if (ttr<0) { ttr = -ttr; }

        if (ttl > peak) { peak = ttl; }
        if (ttr > peak) { peak = ttr; }
    }


    // SECOND PASS //
    var mult = 0.96875/peak;
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

    // DONE - ASSEMBLE TRACK DATA //
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


// TEST A FILTER'S RETURNED SIGNAL //
function signalTest(signal,fallback) {
    if (signal!==undefined && signal[0]!==undefined && signal[1]!==undefined && signal[0]==signal[0] && signal[1]==signal[1]) {
        return signal;
    } else {
        return fallback;
    }
}


// BIG MESSY TEST FUNCTION - IGNORE THIS //
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