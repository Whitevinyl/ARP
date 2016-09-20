
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



//-------------------------------------------------------------------------------------------
//  ALGORITHMS
//-------------------------------------------------------------------------------------------

// TESTING //
proto.test = function() {
    var filters = [];

    filters.push( orchestrator.createComponent('voice') );
    //filters.push( orchestrator.createComponent('howl') );

    // TESTING //
    filters.push( orchestrator.createComponent('thud') );


    //filters.push( orchestrator.createComponent('clipping') );
    //filters.push( orchestrator.createComponent('lowPass') );
    return filters;
};


// BASIC //
proto.basic = function() {
    var filters = [];
    var deck, items, options, count, i;

    // BED //
    items = ['voice','noise','rumble','subHowl','howl','fm','phaseSine'];
    options = {
        weights:[ 2, 2, 1, 2, 2, 1, 1],
        instances:[ 1, 1, 1, 2, 3, 1, 1]
    };
    deck = tombola.weightedDeck(items,options);
    count = tombola.range(2,3);
    for (i=0; i<count; i++) {
        filters.push( orchestrator.createComponent(deck.draw()) );
    }

    // MAIN //
    items = ['growl','siren','pulse','noisePulse','beep','click','sub', 'wail','burst','ramp','fm',tombola.weightedItem(['phaser','chorus'],[3,1]),'bitCrush'];
    options = {
        weights:[ 2, 2, 0.8, 2, 1.3, 1.5, 1, 1.4, 1, 1.2, 1, 2, 1],
        instances:[ 1, 2, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1]
    };
    deck = tombola.weightedDeck(items,options);
    count = tombola.range(3,6);
    for (i=0; i<count; i++) {
        filters.push( orchestrator.createComponent(deck.draw()) );
    }

    // EXTRA //
    items = ['chopper','foldBack','foldBackII','invert','panner','shear'];
    options = {
        weights:[ 2, 2, 1.6, 1, 1.2, 2, 0.8],
        instances:[ 1, 1, 1, 1, 1, 1, 1]
    };
    deck = tombola.weightedDeck(items,options);
    count = tombola.range(0,2);
    for (i=0; i<count; i++) {
        filters.push( orchestrator.createComponent(deck.draw()) );
    }

    // LAST //
    if (tombola.percent(40)) {
        filters.push( orchestrator.createComponent('reverb') );
    }

    filters.push( orchestrator.createComponent('thud') );
    filters.push( orchestrator.createComponent('clipping') );
    filters.push( orchestrator.createComponent('lowPass') );
    if (tombola.percent(4)) {
        filters.push( orchestrator.createComponent('reverseDelay') );
    } else {
        if (tombola.percent(32)) {
            filters.push( orchestrator.createComponent('resampler') );
        }
    }

    //filters.push( orchestrator.createComponent('phaser') );

    return filters;
};


module.exports = Arranger;