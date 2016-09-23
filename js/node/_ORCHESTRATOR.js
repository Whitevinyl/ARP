
var utils = require('./lib/utils');
var Tombola = require('tombola');
var tombola = new Tombola();

var audio = require('./_AUDIOCOMPONENTS');
var FilterWrapper = require('./_FILTERWRAPPER');

// Here we have methods that create all of the audio components, and set up their
// parameters/mods so that they can be used by the 'arranger' (_ARRANGER.js) when it creates
// & orders the components to be used in audio generation.

//-------------------------------------------------------------------------------------------
//  INIT
//-------------------------------------------------------------------------------------------

function Orchestrator() {

}
var proto = Orchestrator.prototype;


//-------------------------------------------------------------------------------------------
//  FILTERS
//-------------------------------------------------------------------------------------------

// Big ol switch statement handling the creation & setup of each individual type of component.

proto.createComponent = function(componentName,args,mods) {
    args = args || [];
    mods = mods || [];

    var settings = {
        filter: null,
        filterFunc: null,
        args: [{context:true, value: 'signal'}],
        mods: []
    };

    var pick = utils.arg;

    switch (componentName) {

        case 'voice':
            settings.filter = new audio.Voice(tombola.rangeFloat(20,80));
            if (args || tombola.percent(80)) {
                settings.args.push( {value: pick( args[0], 'triangle')} ); // non-changing wave
            }
            break;


        case 'noise':
            settings.filter = new audio.NoiseWrapper();
            if (args.length || tombola.percent(10)) {
                settings.args.push( {value: pick( args[0], tombola.range(10000,30000))} ); // changing noise
            }
            break;


        case 'foldBack':
            settings.filterFunc = audio.foldBack;
            settings.args.push( {value: pick( args[0], tombola.rangeFloat(0.65,0.95))} ); // threshold
            break;


        case 'foldBackII':
            settings.filterFunc = audio.foldBackII;
            settings.args.push( {value: pick( args[0], tombola.rangeFloat(0.65,0.95))} ); // threshold
            settings.args.push( {value: pick( args[1], tombola.rangeFloat(0.2,0.4))} ); // reduction power
            break;


        case 'clipping':
            settings.filterFunc = audio.clipping;
            settings.args.push( {value: pick( args[0], tombola.rangeFloat(0.7,0.95))} ); // threshold
            settings.args.push( {value: pick( args[1], tombola.rangeFloat(0.05,0.2))} ); // spill power
            break;


        case 'reverb':
            settings.filterFunc = audio.reverb;
            settings.args.push( {value: pick( args[0], tombola.rangeFloat(0.5,0.6))} ); // level
            settings.args.push( {value: pick( args[1], tombola.range(10,45))} ); // delay
            settings.args.push( {value: pick( args[2], 11)} ); // size
            settings.args.push( {context: true, value: 'channel'} ); // channel
            settings.args.push( {context: true, value: 'index'} ); // index
            break;


        case 'invert':
            settings.filterFunc = audio.invert;
            settings.args.push( {value: pick( args[0], tombola.rangeFloat(0.60,0.95))} ); // threshold
            settings.args.push( pick( args[1], {mod: 0, min: tombola.rangeFloat(-0.5,0), max: tombola.rangeFloat(0.1,0.3), floor: 0, ceil: 1 }) ); // mix
            settings.mods.push( pick( mods[0], this.createMod('walk')) );
            break;


        case 'erode':
            settings.filterFunc = audio.erode;
            settings.args.push( {value: pick( args[0], tombola.range(100,1500))} ); // width
            settings.args.push( {context: true, value: 'index'} ); // index
            settings.args.push( pick( args[1], {mod: 0, min: tombola.rangeFloat(-0.5,0), max: tombola.rangeFloat(0.2,0.6), floor: 0, ceil: 1 }) ); // mix
            settings.mods.push( pick( mods[0], this.createMod('walk')) );
            break;


        case 'shear':
            settings.filter = new audio.FilterShear();
            settings.args.push( {context: true, value: 'channel'} ); // channel
            settings.args.push( {context: true, value: 'index'} ); // index
            settings.args.push( pick( args[0], {mod: 0, min: 1, max: 200}) ); // frequency
            settings.mods.push( pick( mods[0], this.createMod('LFO')) );
            break;


        case 'saturation':
            settings.filterFunc = audio.saturation;
            settings.args.push( {value: pick( args[0], tombola.rangeFloat(0.6,0.9))} ); // threshold
            settings.args.push( {value: pick( args[1], tombola.rangeFloat(0.3,0.5))} ); // mix
            break;


        case 'panner':
            settings.filterFunc = audio.panner;
            var panWidth = tombola.rangeFloat(0.8,1);
            settings.args.push( pick( args[0], {mod: 0, min: -panWidth, max: panWidth }) ); // panning
            settings.mods.push( pick( mods[0], this.createModType('modulation',tombola.item(['medium','fast']))) );
            break;


        case 'rumble':
            settings.filter = new audio.FilterRumble();
            settings.args.push( {value: pick( args[0], tombola.rangeFloat(400,800))} ); // frequency
            settings.args.push( pick( args[1], {mod: 0, min: tombola.rangeFloat(-0.5,0), max: tombola.rangeFloat(0.2,0.6), floor: 0, ceil: 1 }) ); // mix
            settings.mods.push( pick( mods[0], this.createMod('moveTo')) );
            break;


        case 'siren':
            settings.filter = new audio.Siren();
            settings.args.push( {value: pick( args[0], tombola.rangeFloat(0.4,0.8))} ); // ducking
            settings.args.push( {value: pick( args[1], tombola.range(40000,270000))} ); // chance
            break;


        case 'sub':
            settings.filter = new audio.FilterSubSwell();
            settings.args.push( {value: pick( args[0], tombola.rangeFloat(0.4,0.8))} ); // ducking
            settings.args.push( {value: pick( args[1], tombola.range(180000,280000))} ); // chance
            break;


        case 'wail':
            settings.filter = new audio.FilterWail();
            settings.args.push( {value: pick( args[0], tombola.rangeFloat(0.4,0.8))} ); // ducking
            settings.args.push( {value: pick( args[1], tombola.range(160000,280000))} ); // chance
            break;


        case 'growl':
            settings.filter = new audio.FilterGrowl();
            settings.args.push( {value: pick( args[0], tombola.rangeFloat(0.4,0.8))} ); // ducking
            settings.args.push( {value: pick( args[1], tombola.range(160000,280000))} ); // chance
            break;


        case 'noisePulse':
            settings.filter = new audio.FilterNoisePulse();
            settings.args.push( {value: pick( args[0], tombola.rangeFloat(0.4,0.8))} ); // ducking
            settings.args.push( {value: pick( args[1], tombola.range(160000,280000))} ); // chance
            break;


        case 'click':
            settings.filter = new audio.Click();
            settings.args.push( {value: pick( args[0], tombola.rangeFloat(0.4,0.8))} ); // ducking
            settings.args.push( {value: pick( args[1], tombola.range(160000,280000))} ); // chance
            settings.args.push( {value: pick( args[2], null)} ); // mechanical
            break;


        case 'beep':
            settings.filter = new audio.FilterBeep();
            settings.args.push( {value: pick( args[0], tombola.rangeFloat(0.4,0.8))} ); // ducking
            settings.args.push( {value: pick( args[1], tombola.range(160000,280000))} ); // chance
            settings.args.push( {value: pick( args[2], null)} ); // mechanical
            break;


        case 'pattern':
            settings.filter = new audio.Pattern();
            settings.args.push( {value: pick( args[0], tombola.rangeFloat(0.4,0.8))} ); // ducking
            settings.args.push( {value: pick( args[1], tombola.range(100000,280000))} ); // chance
            break;


        case 'patternII':
            settings.filter = new audio.PatternII();
            settings.args.push( {value: pick( args[0], tombola.rangeFloat(0.4,0.8))} ); // ducking
            settings.args.push( {value: pick( args[1], 30000)} ); // chance
            break;


        case 'call':
            settings.filter = new audio.Call();
            settings.args.push( {value: pick( args[0], tombola.rangeFloat(0.4,0.8))} ); // ducking
            settings.args.push( {value: pick( args[1], 30000)} ); // chance
            break;


        case 'purr':
            settings.filter = new audio.Purr();
            settings.args.push( {value: pick( args[0], tombola.rangeFloat(0.6,0.9))} ); // ducking
            settings.args.push( {value: pick( args[1], tombola.range(90000,220000))} ); // chance
            break;


        case 'ramp':
            settings.filter = new audio.Ramp();
            settings.args.push( {value: pick( args[0], tombola.rangeFloat(0.4,0.8))} ); // ducking
            settings.args.push( {value: pick( args[1], tombola.range(160000,280000))} ); // chance
            settings.args.push( {value: pick( args[2], tombola.range(0.1,1.5))} ); // speed
            settings.args.push( {value: pick( args[3], false)} ); // retrigger
            break;


        case 'burst':
            settings.filter = new audio.FilterBurst();
            settings.args.push( {value: pick( args[0], tombola.rangeFloat(0.4,0.8))} ); // ducking
            settings.args.push( {value: pick( args[1], tombola.range(160000,280000))} ); // chance
            settings.args.push( {value: pick( args[2], tombola.range(200,400))} ); // max length
            settings.args.push( {value: pick( args[3], false)} ); // retrigger
            settings.args.push( {value: pick( args[2], tombola.range(100,300))} ); // max frequency
            break;


        case 'pulse':
            settings.filter = new audio.FilterPulse();
            settings.args.push( {value: pick( args[0], tombola.rangeFloat(0.4,0.8))} ); // ducking
            settings.args.push( {value: pick( args[1], tombola.weightedItem([true,false],[1,4])) } ); // reverse
            settings.args.push( pick( args[2], {mod: 0, min: tombola.rangeFloat(-0.2,0.2), max: tombola.rangeFloat(0.8,1), floor: 0, ceil: 1 }) ); // mix
            settings.mods.push( pick( mods[0], this.createMod('walk')) );
            break;


        case 'sweep':
            settings.filter = new audio.Sweep();
            settings.args.push( {value: pick( args[0], tombola.rangeFloat(0.5,0.8))} ); // ducking
            settings.args.push( {value: pick( args[1], tombola.range(25000,250000))} ); // chance
            break;


        case 'sweepII':
            settings.filter = new audio.SweepII();
            settings.args.push( {value: pick( args[0], tombola.rangeFloat(0.5,0.8))} ); // ducking
            settings.args.push( {value: pick( args[1], tombola.range(25000,250000))} ); // chance
            break;


        case 'phaseSine':
            settings.filter = new audio.PhaseWrapper();
            settings.args.push( {value: pick( args[0], tombola.rangeFloat(0.2,0.6))} ); // mix
            settings.args.push( pick( args[1], {mod: 0, min: tombola.rangeFloat(16,30), max: tombola.rangeFloat(80,120)}) ); // frequency
            settings.args.push( {value: pick( args[2], tombola.rangeFloat(0.001,0.3))} ); // f1
            settings.args.push( {value: pick( args[3], tombola.rangeFloat(20,200))} ); // f2
            settings.args.push( pick( args[4], {mod: 1, min: tombola.rangeFloat(-0.7,-0.5), max: tombola.rangeFloat(0.7,1), floor: 0, ceil: 1 }) ); // amp
            settings.mods.push( pick( mods[0], this.createMod('weave',[tombola.rangeFloat(0.05,0.1),tombola.range(7000,12000)])) );
            settings.mods.push( pick( mods[1], this.createMod('walk',[tombola.rangeFloat(0.01,0.2),tombola.range(15000,30000)])) );
            break;


        case 'fm':
            settings.filter = new audio.FM();
            settings.args.push( {value: pick( args[0], tombola.rangeFloat(0.4,0.5))} ); // mix
            settings.args.push( {value: pick( args[1], tombola.rangeFloat(16,30))} ); // frequency
            settings.args.push( pick( args[2], {mod: 0, min: 0, max: 1}) ); // a1
            settings.args.push( pick( args[3], {mod: 1, min: 0, max: 1}) ); // a1
            settings.args.push( pick( args[4], {mod: 2, min: tombola.rangeFloat(-0.5,-0.4), max: tombola.rangeFloat(0.7,1), floor: 0, ceil: 1 }) ); // amp
            settings.mods.push( pick( mods[0], this.createModType('movement','medium')) );
            settings.mods.push( pick( mods[1], this.createModType('movement','medium')) );
            settings.mods.push( pick( mods[2], this.createModType('amp','slow')) );
            break;


        case 'howl':
            settings.filter = new audio.FilterHowl();
            settings.args.push( pick( args[0], {mod: 0, min: tombola.rangeFloat(120,220), max: tombola.rangeFloat(800,1000) }) ); // frequency
            settings.args.push( pick( args[1], {mod: 1, min: tombola.rangeFloat(0,0.2), max: tombola.rangeFloat(0.5,0.8) }) ); // amp
            settings.mods.push( pick( mods[0], this.createMod('weave',[tombola.rangeFloat(0.05,0.12),tombola.range(8000,12000)])) );
            settings.mods.push( pick( mods[1], this.createMod('walk',[tombola.rangeFloat(0.05,0.25),tombola.range(11000,20000)])) );
            break;


        case 'subHowl':
            settings.filter = new audio.FilterSubHowl();
            settings.args.push( pick( args[0], {mod: 0, min: tombola.rangeFloat(0.2,0.3), max: tombola.rangeFloat(0.8,1) }) ); // amp
            settings.mods.push( pick( mods[0], this.createMod('weave',[tombola.rangeFloat(0.08,0.25),tombola.range(11000,20000)])) );
            break;


        case 'cluster':
            settings.filter = new audio.Cluster();
            settings.args.push( {value: pick( args[0], tombola.rangeFloat(500,600))} );  // frequency
            settings.args.push( {value: pick( args[1], tombola.rangeFloat(16000,30000))} );  // chance
            settings.args.push( pick( args[2], {mod: 1, min: 0.5, max: tombola.rangeFloat(0.5,0.8) }) ); // amp
            settings.mods.push( pick( mods[0], this.createMod('weave',[tombola.rangeFloat(0.05,0.12),tombola.range(8000,12000)])) );
            settings.mods.push( pick( mods[1], this.createMod('walk',[tombola.rangeFloat(0.05,0.25),tombola.range(11000,20000)])) );
            break;


        case 'flocking':
            settings.filter = new audio.Flocking();
            settings.args.push( pick( args[0], {mod: 0, min: 500, max: tombola.rangeFloat(700,800) }) );  // frequency
            settings.args.push( {value: pick( args[1], tombola.rangeFloat(0.001,0.002))} );  // rate
            settings.args.push( pick( args[2], {mod: 1, min: tombola.rangeFloat(0.3,0.4), max: tombola.rangeFloat(0.85,1) }) ); // amp
            settings.mods.push( pick( mods[0], this.createMod('weave',[tombola.rangeFloat(0.05,0.12),tombola.range(10000,30000)])) );
            settings.mods.push( pick( mods[1], this.createMod('walk',[tombola.rangeFloat(0.09,0.25),tombola.range(18000,25000)])) );
            break;


        case 'bitCrush':
            settings.filter = new audio.FilterStereoDownSample();
            settings.args.push( pick( args[0], {mod: 0, min: tombola.range(5,15), max: tombola.range(100,200) }) ); // bit size
            settings.args.push( pick( args[1], {mod: 1, min: tombola.rangeFloat(-0.5,0.2), max: tombola.rangeFloat(0.4,1), floor: 0, ceil: 1  }) ); // mix
            settings.mods.push( pick( mods[0], this.createMod('glide2',[tombola.rangeFloat(0.04,0.12),tombola.range(8000,18000)])) );
            settings.mods.push( pick( mods[1], this.createMod('walk',[tombola.rangeFloat(0.05,0.25),tombola.range(11000,20000)])) );
            break;


        case 'chopper':
            settings.filter = new audio.FilterStereoChopper();
            settings.args.push( pick( args[0], {mod: 0, min: tombola.rangeFloat(100,300), max: tombola.rangeFloat(8000,14000) }) ); // rate
            settings.args.push( pick( args[1], {mod: 1, min: tombola.rangeFloat(0,0.2), max: tombola.rangeFloat(1.5,2), floor: 0, ceil: 1  }) ); // depth
            settings.mods.push( pick( mods[0], this.createMod('walk',[tombola.rangeFloat(0.6,1.5),tombola.range(15000,30000)])) );
            settings.mods.push( pick( mods[1], this.createMod('walkSmooth',[tombola.rangeFloat(2,4),tombola.range(90,200)])) );
            break;


        case 'lowPass':
            settings.filter = new audio.StereoLowPass();
            settings.args.push( pick( args[0], {mod: 0, min: tombola.rangeFloat(400,600), max: tombola.rangeFloat(8000,11000) }) ); // cutoff
            settings.args.push( {value: pick( args[1], 0.92)} ); // resonance
            //settings.mods.push( pick( mods[0], this.createMod('walk',[tombola.rangeFloat(0.1,0.3),tombola.range(20000,40000)])) );
            settings.mods.push( pick( mods[0], this.createModType('movement','slow')) );
            break;


        case 'resonant':
            settings.filter = new audio.StereoResonant();
            settings.args.push( pick( args[0], {mod: 0, min: tombola.rangeFloat(100,500), max: tombola.rangeFloat(10000,15000) }) ); // frequency
            settings.args.push( {value: pick( args[1], 0.3)} ); // resonance
            settings.args.push( {value: pick( args[2], 0.6)} ); // mix
            settings.mods.push( pick( mods[0], this.createModType('movement','slow')) );
            break;


        case 'phaser':
            settings.filterFunc = audio.feedback;
            settings.args.push( {value: pick( args[0], tombola.rangeFloat(0.25,0.55))} ); // level
            settings.args.push( pick( args[1], {mod: 0, min: tombola.rangeFloat(5,10), max: tombola.rangeFloat(100,500) }) ); // delay
            settings.args.push( {context: true, value: 'channel'} );
            settings.args.push( {context: true, value: 'index'} );
            settings.mods.push( pick( mods[0], this.createModType('movement','slow')) );
            break;


        case 'chorus':
            settings.filterFunc = audio.feedback;
            settings.args.push( pick( args[0],{mod: 0, min: tombola.rangeFloat(0.1,0.3), max: tombola.rangeFloat(0.4,0.6)  }) ); // mix
            settings.args.push( pick( args[1], {mod: 1, min: tombola.rangeFloat(100,600), max: tombola.rangeFloat(800,1000) }) ); // delay
            settings.args.push( {context: true, value: 'channel'} );
            settings.args.push( {context: true, value: 'index'} );
            settings.mods.push( pick( mods[0], this.createMod('moveTo',[tombola.rangeFloat(0.05,0.25),tombola.range(11000,30000)])) );
            settings.mods.push( pick( mods[1], this.createMod('jump',[tombola.rangeFloat(1000,2000)])) );
            //settings.mods.push( this.createMod('walkSmooth',[tombola.rangeFloat(50,300),10]) );
            break;


        case 'reverseDelay':
            settings.filterFunc = audio.reverseDelay;
            settings.args.push( pick( args[0], {mod: 0, min: tombola.rangeFloat(0.2,0.4), max: tombola.rangeFloat(0.7,0.85)  }) ); // mix
            settings.args.push( {value: pick( args[1], tombola.range(2500,20000))} ); // delay
            settings.args.push( {value: pick( args[2], tombola.range(100,250))} ); // feedback
            settings.args.push( {context: true, value: 'channel'} );
            settings.args.push( {context: true, value: 'index'} );
            settings.mods.push( pick( mods[0], this.createModType('amp','medium')) );
            break;


        case 'resampler':
            settings.filter = new audio.Resampler();
            settings.args.push( {value: pick( args[0], tombola.range(0,6))} ); // mode
            settings.args.push( {value: pick( args[1], tombola.range(100000,350000))} ); // chance
            settings.args.push( {context: true, value: 'channel'} );
            settings.args.push( {context: true, value: 'index'} );
            break;


        case 'testing':
            settings.filter = new audio.Testing();
            settings.args.push( {value: pick( args[0], 90)} ); // frequency
            settings.args.push( {value: pick( args[1], 20000)} ); // chance
            break;


        default:
            console.log('Failed: ' + componentName.toUpperCase());
            return null;
    }

    console.log(componentName.toUpperCase());
    //console.log(settings.args);
    return new FilterWrapper(settings);
};


//-------------------------------------------------------------------------------------------
//  MODS
//-------------------------------------------------------------------------------------------


proto.createMod = function(modName,args) {
    args = args || [];

    var mod = {
        mod: null,
        args: []
    };

    var pick = utils.arg;

    switch (modName) {

        case 'LFO':
            mod.mod = new audio.LFO();
            mod.args.push( {value: pick( args[0], tombola.rangeFloat(0.01,1))} );
            break;

        case 'square':
            mod.mod = new audio.Square();
            mod.args.push( {value: pick( args[0], tombola.rangeFloat(0.01,1))} );
            break;

        case 'walk':
            mod.mod = new audio.Walk();
            mod.args.push( {value: pick( args[0], tombola.rangeFloat(0.01,1))} );
            mod.args.push( {value: pick( args[1], tombola.range(50000,100000))} );
            break;

        case 'walkSmooth':
            mod.mod = new audio.WalkSmooth();
            mod.args.push( {value: pick( args[0], tombola.rangeFloat(0.01,1))} );
            mod.args.push( {value: pick( args[1], tombola.range(10000,40000))} );
            break;

        case 'moveTo':
            mod.mod = new audio.MoveTo();
            mod.args.push( {value: pick( args[0], tombola.rangeFloat(0.01,1))} );
            mod.args.push( {value: pick( args[1], tombola.range(50000,100000))} );
            break;

        case 'weave':
            mod.mod = new audio.Weave();
            mod.args.push( {value: pick( args[0], tombola.rangeFloat(0.01,1))} );
            mod.args.push( {value: pick( args[1], tombola.range(10000,40000))} );
            break;

        case 'weaveJump':
            mod.mod = new audio.WeaveJump();
            mod.args.push( {value: pick( args[0], tombola.rangeFloat(0.01,1))} );
            mod.args.push( {value: pick( args[1], tombola.range(10000,30000))} );
            mod.args.push( {value: pick( args[2], tombola.range(90000,220000))} );
            break;

        case 'jump':
            mod.mod = new audio.Jump();
            mod.args.push( {value: pick( args[0], tombola.range(20000,100000))} );
            break;

        case 'glide':
            mod.mod = new audio.Glide();
            mod.args.push( {value: pick( args[0], tombola.rangeFloat(0.01,1))} );
            mod.args.push( {value: pick( args[1], tombola.range(10000,40000))} );
            mod.args.push( {value: pick( args[2], false)} );
            break;

        case 'glide2':
            mod.mod = new audio.Glide2();
            mod.args.push( {value: pick( args[0], tombola.rangeFloat(0.01,1))} );
            mod.args.push( {value: pick( args[1], tombola.range(10000,40000))} );
            break;

        case 'looper':
            mod.mod = new audio.Looper();
            mod.args.push( {value: pick( args[0], tombola.rangeFloat(200,500))} );
            mod.args.push( {value: pick( args[1], tombola.rangeFloat(0.01,0.1))} );
            mod.args.push( {value: pick( args[2], tombola.range(10000,40000))} );
            break;

        case 'fudgeChance':
            mod.mod = new audio.FudgeChance();
            mod.args.push( {value: pick( args[0], tombola.range(2,5))} );
            mod.args.push( {value: pick( args[1], tombola.rangeFloat(0.001,0.01))} );
            mod.args.push( {value: pick( args[2], tombola.range(500,1000))} );
            break;

        case 'rangeChance':
            mod.mod = new audio.RangeChance();
            mod.args.push( {value: pick( args[0], tombola.rangeFloat(0.001,0.01))} );
            mod.args.push( {value: pick( args[1], tombola.range(500,1000))} );
            break;


        default:
            return null;
    }

    return mod;
};


//-------------------------------------------------------------------------------------------
//  SELECTIONS
//-------------------------------------------------------------------------------------------

// "Pick one out for me" methods.
// give me a random mod with random settings, based on what I want to use it for.

proto.createModType = function(type,speed) {

    var mod;
    var args;

    // TYPE OF MOD //
    switch (type) {

        case 'amp':
            mod = tombola.item(['walk','moveTo','walkSmooth','weave']);
            switch (speed) {
                case 'slow':
                    args = [tombola.rangeFloat(0.01,0.2), tombola.range(12000,30000)];
                    break;
                case 'medium':
                    args = [tombola.rangeFloat(0.2,0.8), tombola.range(12000,30000)];
                    break;
                case 'fast':
                    args = [tombola.rangeFloat(0.8,2), tombola.range(12000,30000)];
                    break;
            }
            break;

        case 'movement':
            mod = tombola.item(['moveTo','weave','glide','glide2','jump','weaveJump','fudgeChance','rangeChance']);
            switch (speed) {
                case 'slow':
                    if (mod==='moveTo' || mod==='weave' || mod==='glide' || mod==='glide2') {
                        args = [tombola.rangeFloat(0.05,0.5)];
                    }
                    if (mod==='jump') {
                        args = [tombola.range(90000,200000)];
                    }
                    if (mod==='weaveJump') {
                        args = [tombola.rangeFloat(0.05,0.5),tombola.range(90000,150000),tombola.range(200000,300000)];
                    }
                    if (mod==='fudgeChance') {
                        args = [tombola.range(4,8),tombola.rangeFloat(0.001,0.01),tombola.range(10000,30000)];
                    }
                    if (mod==='rangeChance') {
                        args = [tombola.rangeFloat(-0.05,0.05),tombola.range(10000,30000)];
                    }
                    break;
                case 'medium':
                    if (mod==='moveTo' || mod==='weave' || mod==='glide' || mod==='glide2') {
                        args = [tombola.rangeFloat(0.5,1.5)];
                    }
                    if (mod==='jump') {
                        args = [tombola.range(10000,90000)];
                    }
                    if (mod==='weaveJump') {
                        args = [tombola.rangeFloat(0.5,1.5),tombola.range(10000,80000),tombola.range(100000,150000)];
                    }
                    if (mod==='fudgeChance') {
                        args = [tombola.range(4,8),tombola.rangeFloat(0.001,0.01),tombola.range(4000,10000)];
                    }
                    if (mod==='rangeChance') {
                        args = [tombola.rangeFloat(-0.05,0.05),tombola.range(4000,10000)];
                    }
                    break;
                case 'fast':
                    if (mod==='moveTo' || mod==='weave' || mod==='glide' || mod==='glide2') {
                        args = [tombola.rangeFloat(1.5,8)];
                    }
                    if (mod==='jump') {
                        args = [tombola.range(2000,10000)];
                    }
                    if (mod==='weaveJump') {
                        args = [tombola.rangeFloat(1.5,8),tombola.range(2000,10000),tombola.range(30000,80000)];
                    }
                    if (mod==='fudgeChance') {
                        args = [tombola.range(4,8),tombola.rangeFloat(0.001,0.01),tombola.range(2000,4000)];
                    }
                    if (mod==='rangeChance') {
                        args = [tombola.rangeFloat(-0.05,0.05),tombola.range(2000,4000)];
                    }
                    break;
            }
            break;

        case 'modulation':
            mod = tombola.item(['LFO','square','jump']);
            switch (speed) {
                case 'slow':
                    if (mod==='jump') {
                        args = [tombola.range(90000,200000)];
                    } else {
                        args = [tombola.rangeFloat(0.01,1)];
                    }
                    break;
                case 'medium':
                    if (mod==='jump') {
                        args = [tombola.range(10000,90000)];
                    } else {
                        args = [tombola.rangeFloat(1,10)];
                    }
                    break;
                case 'fast':
                    if (mod==='jump') {
                        args = [tombola.range(2000,10000)];
                    } else {
                        args = [tombola.rangeFloat(10,30)];
                    }
                    break;
            }
            break;

        default:
            return null;
    }

    console.log(mod);
    console.log(args);
    return this.createMod(mod,args);
};




module.exports = Orchestrator;