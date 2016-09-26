
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

// MODES FOR TESTING //
// (only partially implemented) //
global.modes = {
    'running':          0,
    'audio':            1,
    'audioTweet':       2,
    'phase':            3,
    'phaseTweet':       4,
    'waveform':         5,
    'waveformTweet':    6,
    'periodic':         7,
    'periodicTweet':    8,
    'spectrum':         9,
    'spectrumTweet':    10,
    'starTrail':        11,
    'starTrailTweet':   12,
    'tweet':            13,
    'tweetTweet':       14
};

// SET MODE //
global.opMode = modes.running;


// START THE BOT RUNNING //
function init() {
    action.init(config,soundCloudReady);

    // IF WE'RE IN A TESTING MODE //
    switch(opMode) {

        case modes.audio:
        case modes.audioTweet:
            action.audio();
            break;

        case modes.phase:
        case modes.phaseTweet:
            action.chartPhase();
            break;

        case modes.waveform:
        case modes.waveformTweet:
            action.chartWaveform();
            break;

        case modes.periodic:
        case modes.periodicTweet:
            action.chartPeriodic();
            break;

        case modes.spectrum:
        case modes.spectrumTweet:
            action.chartSpectrum();
            break;

        case modes.starTrail:
        case modes.starTrailTweet:
            action.starTrails();
            break;

        case modes.tweet:
            action.print();
            break;

        case modes.tweetTweet:
            action.tweet();
            break;

        default:
            break;
    }
}
init();


// NORMAL RUNNING - START THE SCHEDULER //
// callback once SoundCloud has initialised in action.init //
function soundCloudReady() {
    scheduler.init();
}













