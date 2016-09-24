
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
    return this.basic();
};

proto.filterCheck = function(filters) {
    for (var i=0; i<filters.length; i++) {
        // do something to check for null filters as a safety
    }
};


//-------------------------------------------------------------------------------------------
//  ALGORITHMS
//-------------------------------------------------------------------------------------------

// TESTING //
proto.test = function() {
    var filters = [];

    filters.push( orchestrator.createComponent('flocking') );

    // TESTING //
    filters.push( orchestrator.createComponent('testing') );
    return filters;
};


// BASIC //
proto.basic = function() {
    var filters = [];
    var count, i;

    //------------- SETUP DECKS -------------//

    // BED SETUP //
    var bedItems = ['flocking','cluster','voice','noise','rumble','subHowl','howl','fm','phaseSine'];
    var bedOptions = {
        weights:[1.5, 1, 2, 2, 1, 2, 2, 1, 1],
        instances:[1, 2, 1, 1, 1, 2, 3, 1, 1]
    };
    var bedDeck = tombola.weightedDeck(bedItems,bedOptions);


    // GENERATOR SETUP //
    var generatorItems = ['metallic','purr','pattern','growl','siren','pulse','noisePulse','beep','click','sub', 'wail','burst','ramp','fm','sweep','sweepII'];
    var generatorOptions = {
        weights:[1,1, 1.8, 2, 1.7, 2, 0.8, 2, 1.3, 1.5, 1, 1.4, 1.5, 1.2, 1, 1.5, 1.5],
        instances:[1, 1, 2, 1, 2, 1, 2, 1, 1, 1, 2, 2, 2, 1, 1, 1]
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
            filters.push( orchestrator.createComponent(effectDeck.draw()) );
        }

    }
    //filters.push( orchestrator.createComponent('testing') );

    // LAST //
    if (tombola.percent(40)) {
        filters.push( orchestrator.createComponent('reverb') );
    }
    filters.push( orchestrator.createComponent('clipping') );
    filters.push( orchestrator.createComponent('lowPass') );
    filters.push( orchestrator.createComponent('static') );

    // POST FILTER //
    if (tombola.percent(4)) {
        filters.push( orchestrator.createComponent('reverseDelay') );
    } else {
        if (tombola.percent(35)) {
            filters.push( orchestrator.createComponent('resampler') );
        }
    }


    return filters;
};


module.exports = Arranger;