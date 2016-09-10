console.log("hello this is bot.");


var Twit = require('twit');
var fs = require('fs');
var wavEncoder = require('wav-encoder');


var utils = require('./js/node/utils');
var RGBA = require('./js/node/RGBA');
var Colorflex = require('colorflex');
var config = require('./atacama');
var atacama2 = require('./atacama2');
var SunCalc = require('suncalc');
var Lexicon = require('./js/web/_LEXICON');
var Tombola = require('tombola');
var tombola = new Tombola();


var Scheduler = require('./js/node/_SCHEDULER');
var scheduler = new Scheduler();
var GenTweet = require('./js/node/_GENTWEET');
var genTweet = new GenTweet();
var GenChart = require('./js/node/_GENCHART');
var genChart = new GenChart();
var DrawChart = require('./js/node/_DRAWCHART');
var drawChart = new DrawChart();
var GenStarTrail = require('./js/node/_GENSTARTRAIL');
var genStars = new GenStarTrail();
var DrawStarTrail = require('./js/node/_DRAWSTARS');
var drawStars = new DrawStarTrail();
var GenAudio = require('./js/node/_GENAUDIO');
var genAudio = new GenAudio();
var SoundCloud = require('./js/node/_SOUNDCLOUD');
var soundCloud = new SoundCloud();

var T = new Twit(config);



global.color = new Colorflex();
global.lexicon = new Lexicon();

global.sampleRate = 44100;
global.scopeStyle = 2;



var tweetText = '';


//chart3();
soundCloud.init(atacama2,scReady);


function scReady() {
    //generateAudio();
}



function generateAudio() {

    // generate audio data //
    var data = genAudio.generate();

    // encode to wav //
    wavEncoder.encode(data.audioData).then(function(buffer){
        console.log(buffer);

        // write wav as file //
        fs.writeFile("output.wav", new Buffer(buffer), 'utf-8', function(err) {

            if (err) {
                console.log("failed to save");
            } else {
                console.log("succeeded in saving");

                // upload file to soundcloud //
                var options = {
                    title: '#' + data.id.strict + '-' + data.cat.strict,
                    description: 'Audio received by ARP Observatory on ' + data.date.strict + ' | time: '+data.time.short + ' | length: '+data.seconds + ' seconds | ' + data.frequency.string + ' | BW: ' + data.bandwidth + ' | ' + data.level,
                    genre: 'astronomy',
                    sharing: 'private',
                    tag_list: 'astronomy space science radio',
                    oauth_token: soundCloud.clientToken,
                    asset_data: 'output.wav'
                };

                soundCloud.upload(options,function(err,track) {
                    if (err) {
                        console.log(err)
                    }
                    //console.log(track);

                    // cross post to twitter //
                    var tweet = {
                        status: 'Audio: signal received by ARP Observatory on ' + data.date.strict + ': '+ track.permalink_url
                    };

                    // tweet //
                    twitterPost(tweet);
                });

            }
        });
    });
}





//-------------------------------------------------------------------------------------------
//  STAR TRAILS
//-------------------------------------------------------------------------------------------



function starGen() {
    var data = genStars.generateTrails();
    console.log('generated');
    drawStars.background(data);
    console.log('background drawn');

    for (var k=0; k<data.shutter; k++) {
        genStars.update(data);
        drawStars.stars(data);
    }
    console.log('stars drawn');
    drawStars.composite();
    console.log('composite rendered');


    var b64 =  stripUriMeta(drawStars.canvas[3].toDataURL());
    var tweet = {
        media: {
            media_data: b64
        },
        status: 'Bronica SQA, '+ ((Math.round((data.shutter*0.45)/30)/2)) +' hours exposure:'
    };

    // tweet //
    twitterPost(tweet);
}



//-------------------------------------------------------------------------------------------
//  CHARTS
//-------------------------------------------------------------------------------------------


function pickChart() {
    tombola.weightedFunction([chart1,chart2,chart3,chart4],[1,1,1,1]);
}

function chart1() {

    // gen data //
    var data = genChart.generateTimeSpectrum(35,115);

    // draw chart image //
    drawChart.drawTimeSpectrumChart(data);
    console.log('drawn');
    var b64 =  stripUriMeta(drawChart.canvas.toDataURL());

    // tweet data //
    var tr = '';
    if (data.truncated) {
        tr = 'truncated ';
    }
    var tweet = {
        media: {
            media_data: b64
        },
        status: 'Frequency response from ' + tr + 'audio received by ARP on ' + data.date.strict + ':'
    };

    // tweet //
    twitterPost(tweet);
}

function stripUriMeta(uri) {
    return uri.split(',')[1];
}


function chart2() {
    var data = genChart.generateScopeData(7000);

    // draw chart image //
    drawChart.drawVectorScopeChart(data);
    console.log('drawn');
    var b64 =  stripUriMeta(drawChart.canvas.toDataURL());

    // tweet data //
    var tr = '';
    if (data.truncated) {
        tr = 'truncated ';
    }
    var tweet = {
        media: {
            media_data: b64
        },
        status: 'Stereo Image from sections of ' + tr + 'audio received by ARP on ' + data.date.strict + ':'
    };

    // tweet //
    twitterPost(tweet);
}

function chart3() {
    var data = genChart.generatePeriodicWaves(9);

    // draw chart image //
    drawChart.drawPeriodicWaveChart(data);
    console.log('drawn');
    var b64 =  stripUriMeta(drawChart.canvas.toDataURL());

    // tweet data //
    var tweet = {
        media: {
            media_data: b64
        },
        status: 'Periodic waves seen in a selection of recent audio received by ARP:'
    };

    // tweet //
    twitterPost(tweet);
}

function chart4() {
    var data = genChart.generateWaveSection(3.5);
    console.log('data generated');

    // draw chart image //
    drawChart.drawWaveformChart(data);
    console.log('drawn');
    var b64 =  stripUriMeta(drawChart.canvas.toDataURL());

    // tweet data //
    var tr = '';
    if (data.truncated) {
        tr = 'truncated ';
    }
    var tweet = {
        media: {
            media_data: b64
        },
        status: 'Waveform of a repeating signal present in ' + tr + 'audio received by ARP on ' + data.date.strict + ':'
    };

    // tweet //
    twitterPost(tweet);
}






//-------------------------------------------------------------------------------------------
//  TWITTER HELLO WORLD
//-------------------------------------------------------------------------------------------


function twitterPost(tweet) {

    // upload media //
    if (tweet.media) {
        T.post('media/upload', tweet.media, uploaded);

        // callback from media upload //
        function uploaded(err, data, response) {

            tweetError(err);

            // make the tweet //
            if (!err) {
                var id = data.media_id_string;
                var m = {
                    status: tweet.status,
                    media_ids: [id]
                };
                T.post('statuses/update', m, tweeted);
            }
        }
    }

    else {
        var m = {
            status: tweet.status
        };
        T.post('statuses/update', m, tweeted);
    }

}


// generic tweet callback //
function tweeted(err, data, response) {
    tweetError(err);
}


// generic tweet error handle //
function tweetError(err) {
    if (err) {
        console.log('tweet: something went wrong');
        console.log(err);
    } else {
        console.log('tweet: success');
    }
}






