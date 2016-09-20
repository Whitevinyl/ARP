console.log("hello this is bot.");
var Tombola = require('tombola');
var tombola = new Tombola();

var Colorflex = require('colorflex');
var config = require('./config');

var Scheduler = require('./js/node/_SCHEDULER');
var scheduler = new Scheduler();
var Action = require('./js/node/_ACTIONS');
var action = new Action();


global.color = new Colorflex();
global.sampleRate = 44100;


// ARP Observatory by Luke Twyman | t: @whitevinyluk
// @arpobservatory
// soundcloud.com/arpobservatory

// All actions - tweet/audio/chart generation etc are in _ACTIONS.js
// Actions are initiated via the Scheduler, which every 48 hours plans out what actions the
// bot will made over the next 48 hr window.

//-------------------------------------------------------------------------------------------
//  INIT
//-------------------------------------------------------------------------------------------







// GO //
function init() {
    action.init(config,soundCloudReady);
    //action.print('tweetInterview');
    //action.chartPhase();
    action.audio();

    //action.audioTest();
}
init();


// callback once SoundCloud has initialised //
function soundCloudReady() {
    action.audio();

    //scheduler.init();


}



function logging(txt) {
    console.log(txt);
}












