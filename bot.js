
// running check //
console.log("hello this is bot.");

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

// All actions - tweet/audio/chart generation etc are in 'action' (_ACTIONS.js)
// Actions are initiated via the 'scheduler' (_SCHEDULER.js), which every 48 hours plans out
// what actions the bot will make during that 48 hr window.

//-------------------------------------------------------------------------------------------
//  INIT
//-------------------------------------------------------------------------------------------


// START THE BOT RUNNING //
function init() {
    action.init(config,soundCloudReady);
    //action.print('tweetInterview');
    action.audio();
}
init();

// callback once SoundCloud has initialised //
function soundCloudReady() {
    //scheduler.init();
}













