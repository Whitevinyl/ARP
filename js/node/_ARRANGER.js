
var utils = require('./lib/utils');
var Tombola = require('tombola');
var tombola = new Tombola();

var Orchestrator = require('./_ORCHESTRATOR');
var orchestrator = new Orchestrator();

// Here we randomly choose and organise the list of audio components, which will be used this
// time around to generate the audio. This component list then gets passed to 'genAudio'
// (_GENAUDIO.js) which writes the audio and meta data ready for encoding/uploading by
// 'action' (_ACTIONS.js).

//-------------------------------------------------------------------------------------------
//  INIT
//-------------------------------------------------------------------------------------------


function Arranger() {

}
var proto = Arranger.prototype;


//-------------------------------------------------------------------------------------------
//  ARRANGEMENT
//-------------------------------------------------------------------------------------------

proto.arrangement = function() {

    // select algorithm //
    var alg = tombola.weightedItem(['basic', 'ambient', 'classic' ],[3,1,1]);
    console.log(alg.toUpperCase());

    return this[''+alg]();
};

//-------------------------------------------------------------------------------------------
//  ALGORITHMS
//-------------------------------------------------------------------------------------------


// TESTING //
proto.test = function() {
    var filters = [];
    filters.push( orchestrator.createComponent('flocking') );

    filters.push( orchestrator.createComponent('fuzzBurst') );
    return filters;
};


// BASIC //
proto.basic = function() {
    var filters = [];
    var count, i;
    var reverbAllowed = true;

    //------------- SETUP DECKS -------------//

    // BED SETUP //
    var bedItems = ['flocking','cluster','voice','noise','rumble','subHowl','howl','fm','phaseSine'];
    var bedOptions = {
        weights:[1.5, 1, 2, 2, 1, 2, 2, 1, 1],
        instances:[1, 2, 1, 1, 1, 2, 3, 1, 1]
    };
    var bedDeck = tombola.weightedDeck(bedItems,bedOptions);


    // GENERATOR SETUP //
    var generatorItems = ['fuzzBurst','purr','pattern','growl','siren','pulse','noisePulse','beep','click','sub','wail','burst','ramp','fm','sweep','sweepII'];
    var generatorOptions = {
        weights:[1.5, 1.8, 2, 1.7, 2, 0.8, 2, 1.3, 1.5, 1, 1.4, 1.5, 1.2, 1, 1.5, 1.5],
        instances:[2, 1, 2, 1, 2, 1, 2, 1, 1, 1, 2, 2, 2, 1, 1, 1]
    };
    var generatorDeck = tombola.weightedDeck(generatorItems,generatorOptions);


    // EFFECT SETUP //
    var effectItems = ['saturation','chopper','foldBack','foldBackII','invert','panner','shear','bitCrush',tombola.weightedItem(['phaser','chorus'],[3,1])];
    var effectOptions = {
        weights:[1, 2.2, 2, 1.6, 0.5, 1.2, 0.5, 1, 2.5],
        instances:[1, 1, 1, 1, 1, 1, 1, 1, 1]
    };
    var effectDeck = tombola.weightedDeck(effectItems,effectOptions);



    //------------- DRAW ITEMS -------------//


    // BED //
    count = tombola.range(2,3);
    for (i=0; i<count; i++) {
        filters.push( orchestrator.createComponent(bedDeck.draw()) );
    }


    // MAIN //
    count = tombola.range(4,8);
    for (i=0; i<count; i++) {
        if (tombola.percent(70)) {
            filters.push( orchestrator.createComponent(generatorDeck.draw()) );
        }
        else {
            var effect = effectDeck.draw();
            filters.push( orchestrator.createComponent(effect) );
            if (effect==='phaser'||effect==='chorus') {
                reverbAllowed = false;
            }
        }
    }


    // LAST //
    if (reverbAllowed && tombola.percent(40)) {
        filters.push( orchestrator.createComponent('reverb') );
    }
    filters.push( orchestrator.createComponent('clipping') );
    if (tombola.percent(12)) {
        console.log('faster filter');
        filters.push( orchestrator.createComponent('lowPass',[],[orchestrator.createModType('movement','medium')]) );
    } else {
        filters.push( orchestrator.createComponent('lowPass') );
    }
    filters.push( orchestrator.createComponent('static') );


    // POST FILTER //
    if (reverbAllowed && tombola.percent(4)) {
        filters.push( orchestrator.createComponent('reverseDelay') );
    } else {
        if (tombola.percent(35)) {
            filters.push( orchestrator.createComponent('resampler') );
        }
    }


    return filters;
};



// AMBIENT //
proto.ambient = function() {
    var filters = [];
    var count, i;
    var reverbAllowed = true;

    //------------- SETUP DECKS -------------//

    // BED SETUP //
    var bedItems = ['flocking','cluster','voice','noise','rumble','subHowl','howl'];
    var bedOptions = {
        weights:[2, 1, 1, 1, 1.5, 2, 2],
        instances:[2, 2, 1, 1, 1, 2, 3]
    };
    var bedDeck = tombola.weightedDeck(bedItems,bedOptions);

    // GENERATOR SETUP //
    var generatorItems = ['fuzzBurst','flocking','howl','purr','pattern','growl','siren','pulse','noisePulse','beep','click','sub', 'wail','burst','ramp','fm','sweep','sweepII','phaseSine'];
    var generatorOptions = {
        weights:[1, 1, 1, 1.5, 1.5, 1.5, 1.5, 0.8, 1.2, 1.2, 1.5, 0.8, 1.5, 1.5, 1.2, 1, 0.8, 1.2, 1.5],
        instances:[1, 1, 1, 2, 2, 2, 2, 1, 2, 1, 2, 1, 2, 2, 2, 1, 1, 1, 2]
    };
    var generatorDeck = tombola.weightedDeck(generatorItems,generatorOptions);


    // EFFECT SETUP //
    var effectItems = ['saturation','chopper','foldBack','foldBackII','panner',tombola.weightedItem(['phaser','chorus'],[3,1])];
    var effectOptions = {
        weights:[0.8, 2, 0.5, 0.5, 1, 2],
        instances:[1, 1, 1, 1, 1, 1]
    };
    var effectDeck = tombola.weightedDeck(effectItems,effectOptions);


    //------------- DRAW ITEMS -------------//


    // BED //
    count = tombola.range(1,2);
    for (i=0; i<count; i++) {
        filters.push( orchestrator.createComponent(bedDeck.draw()) );
    }


    // MAIN //
    count = tombola.range(4,7);
    for (i=0; i<count; i++) {
        if (tombola.percent(92)) {
            filters.push( orchestrator.createComponent(generatorDeck.draw()) );
        }
        else {
            var effect = effectDeck.draw();
            filters.push( orchestrator.createComponent(effect) );
            if (effect==='phaser'||effect==='chorus') {
                reverbAllowed = false;
            }
        }
    }


    // LAST //
    if (reverbAllowed && tombola.percent(80)) {
        filters.push( orchestrator.createComponent('reverb') );
    }
    filters.push( orchestrator.createComponent('clipping') );
    filters.push( orchestrator.createComponent('lowPass') );
    filters.push( orchestrator.createComponent('static') );


    // POST FILTER //
    if (reverbAllowed && tombola.percent(3)) {
        filters.push( orchestrator.createComponent('reverseDelay') );
    } else {
        if (tombola.percent(20)) {
            filters.push( orchestrator.createComponent('resampler',[tombola.range(0,6),tombola.range(250000,350000)]) );
        }
    }

    return filters;
};


// CLASSIC //
//(ie the more rigid style I first got used to in testing...)
proto.classic = function() {
    var filters = [];
    var count, i;
    var reverbAllowed = true;


    //------------- SETUP DECKS -------------//

    // BED SETUP //
    var bedItems = ['flocking','cluster','rumble','subHowl','howl'];
    var bedOptions = {
        weights:[2, 1, 1.5, 2, 2],
        instances:[2, 2, 1, 2, 3]
    };
    var bedDeck = tombola.weightedDeck(bedItems,bedOptions);


    // GENERATOR SETUP //
    var generatorItems = ['fuzzBurst','metallic','flocking','howl','purr','pattern','growl','siren','pulse','noisePulse','beep','click','sub', 'wail','burst','ramp','fm','sweep','sweepII','phaseSine'];
    var generatorOptions = {
        weights:[1.1, 0.5, 1, 1, 1.5, 1.5, 1.5, 1.5, 0.8, 1.2, 1.2, 1.5, 0.8, 1.5, 1.5, 1.2, 1, 0.8, 1.2, 1.5],
        instances:[1, 1, 1, 1, 2, 2, 2, 2, 1, 2, 1, 2, 1, 2, 2, 2, 1, 1, 1, 2]
    };
    var generatorDeck = tombola.weightedDeck(generatorItems,generatorOptions);


    //------------- DRAW ITEMS -------------//

    // BED //
    if (tombola.percent(60)) {
        // VOICE //
        filters.push( orchestrator.createComponent('voice') );

        // RUMBLE //
        if (tombola.percent(30)) {
            filters.push( orchestrator.createComponent('rumble') );
        }
    } else {
        count = tombola.range(1,2);
        for (i=0; i<count; i++) {
            filters.push( orchestrator.createComponent(bedDeck.draw()) );
        }
    }


    // BITCRUSH //
    if (tombola.percent(35)) {
        filters.push( orchestrator.createComponent('bitCrush') );
    }


    // NOISE //
    var noiseArgs = [0];
    if (tombola.percent(50)) {
        noiseArgs = [tombola.range(10000,30000)];
    }
    filters.push( orchestrator.createComponent('noise',noiseArgs) );


    // MAIN //
    count = tombola.range(4,7);
    for (i=0; i<count; i++) {
        filters.push( orchestrator.createComponent(generatorDeck.draw()) );
    }


    // PHASE //
    if (tombola.percent(30)) {
        filters.push( orchestrator.createComponent('phaser',[tombola.rangeFloat(0.25,0.55),{mod:0, min:10, max:4000}],[orchestrator.createMod('fudgeChance',[5,0.05,600])]) );
        reverbAllowed = false;
    } else {
        if (tombola.percent(30)) {
            filters.push( orchestrator.createComponent('phaser',[tombola.rangeFloat(0.05,0.6),{mod:0, min:tombola.rangeFloat(10,400), max:tombola.rangeFloat(3000,3200)}],[orchestrator.createMod('LFO',[tombola.rangeFloat(1,1.4)])]) );
            reverbAllowed = false;
        }
    }


    // FOLDBACK //
    if (tombola.percent(28)) {
        filters.push( orchestrator.createComponent('foldBack') );
    }


    // CHOPPER //
    if (tombola.percent(80)) {
        filters.push( orchestrator.createComponent('chopper',[],[orchestrator.createMod('walk',[1,20000]), orchestrator.createMod('walkSmooth',[3,100])]) );
    }


    // REVERB //
    if (reverbAllowed && tombola.percent(40)) {
        filters.push( orchestrator.createComponent('reverb') );
    }


    // CLIPPING //
    filters.push( orchestrator.createComponent('clipping') );


    // RESAMPLER //
    filters.push( orchestrator.createComponent('resampler',[tombola.item([1,3]),200000]) );


    // LOW PASS //
    if (tombola.percent(20)) {
        filters.push( orchestrator.createComponent('lowPass',[],[orchestrator.createModType('movement','medium')]) );
    } else {
        filters.push( orchestrator.createComponent('lowPass',[{mod: 0, min: 400, max: 9000},0.92],[orchestrator.createMod('walk',[0.2,30000])]) );

    }


    // STATIC //
    filters.push( orchestrator.createComponent('static') );


    return filters;
};



module.exports = Arranger;