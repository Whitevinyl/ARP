console.log("hello this is bot.");


var Colorflex = require('colorflex');
var config = require('./config');
var SunCalc = require('suncalc');
var Lexicon = require('./js/web/_LEXICON');


var Scheduler = require('./js/node/_SCHEDULER');
//var scheduler = new Scheduler();
var Action = require('./js/node/_ACTIONS');
var action = new Action();


global.color = new Colorflex();
global.lexicon = new Lexicon();

global.sampleRate = 44100;
global.scopeStyle = 2;



// GO //
action.init(config,soundCloudReady);


// callback once SoundCloud has initialised //
function soundCloudReady() {
    action.audio();
}
















