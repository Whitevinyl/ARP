var fs = require('fs');
var utils = require('./lib/utils');
var SunCalc = require('suncalc');
var wavEncoder = require('wav-encoder');
var Tombola = require('tombola');
var tombola = new Tombola();

var GenAudio = require('./_GENAUDIO');
var genAudio = new GenAudio();
var GenTweet = require('./_GENTWEET');
var genTweet = new GenTweet();
var GenChart = require('./_GENCHART');
var genChart = new GenChart();
var DrawChart = require('./_DRAWCHART');
var drawChart = new DrawChart();
var GenStarTrail = require('./_GENSTARTRAIL');
var genStars = new GenStarTrail();
var DrawStarTrail = require('./_DRAWSTARS');
var drawStars = new DrawStarTrail();


var SoundCloud = require('./_SOUNDCLOUD');
var soundCloud = new SoundCloud();
var Twitter = require('./_TWITTER');
var twitter = new Twitter();


// All of the main generation actions get initiated here - audio, charts, tweets and star
// trail photos.


//-------------------------------------------------------------------------------------------
//  INIT
//-------------------------------------------------------------------------------------------


function Action() {

}
var proto = Action.prototype;


proto.init = function(config,soundCloudReady) {
    soundCloud.init(config.soundcloud,soundCloudReady);
    twitter.init(config.twitter);
};


//-------------------------------------------------------------------------------------------
//  AUDIO
//-------------------------------------------------------------------------------------------


proto.audio = function() {

    // generate audio data //
    var data = genAudio.generate();

    // encode audio data to wav //
    wavEncoder.encode(data.audioData).then(function(buffer){
        console.log(buffer);

        // write wav as file //
        fs.writeFile("output.wav", new Buffer(buffer), 'utf-8', function(err) {

            if (err) {
                console.log("failed to save");
            } else {
                console.log("succeeded in saving");

                // upload file to soundcloud //
                uploadAudio(data,3);
            }
        });
    });
};


function uploadAudio(data,attempts) {

    var options = {
        title: '#' + data.id.strict + '-' + data.cat.strict,
        description: 'Audio received by ARP Observatory on ' + data.date.strict + ' | time: '+data.time.short + ' | length: '+data.seconds + ' seconds | ' + data.frequency.string + ' | BW: ' + data.bandwidth + ' | ' + data.level,
        genre: 'astronomy',
        sharing: 'private',
        //license: 'cc-by-nc',
        //downloadable: 'true',
        //tag_list: 'astronomy space science radio',
        oauth_token: soundCloud.clientToken,
        asset_data: 'output.wav'
    };

    console.log('upload attempts: '+attempts);
    soundCloud.upload(options,function(err,track) {
        if (err) {
            console.log(err)
        }
        console.log(track);


        // after upload wait a bit to see if it processed. Sometimes SC gets stuck in the processing state //
        setTimeout(function() {

            //check upload status //
            console.log('track id: '+track.id);
            soundCloud.status(track.id, function(err,result) {

                // we're good, post it to twitter //
                if (result==='finished') {
                    console.log('done processing');
                    var tweet = {
                        status: 'Audio: signal received by ARP Observatory on ' + data.date.strict + ': '+ track.permalink_url
                    };
                    // tweet //
                    twitter.post(tweet);

                    // we're not good, Delete the track and try again //
                } else {
                    console.log('still processing or failed');
                    soundCloud.delete(track.id, function(err,result) {
                        // try again?
                        if (err.statusCode===500 && attempts>0) {
                            uploadAudio(data,attempts-1);
                        }
                    });
                }
            });

        },10000,track,data,attempts);

    });
}


//-------------------------------------------------------------------------------------------
//  STAR TRAILS
//-------------------------------------------------------------------------------------------


proto.starTrails = function() {

    // draw stars to canvas //
    var data = genStars.generateTrails();
    drawStars.background(data);
    for (var k=0; k<data.shutter; k++) {
        genStars.update(data);
        drawStars.stars(data);
    }
    drawStars.composite();

    // get image data //
    var b64 =  utils.stripUriMeta(drawStars.canvas[3].toDataURL());

    // tweet it //
    var tweet = {
        media: {
            media_data: b64
        },
        status: 'Bronica SQA, '+ ((Math.round((data.shutter*0.45)/30)/2)) +' hours exposure:'
    };
    twitter.post(tweet);
};


//-------------------------------------------------------------------------------------------
//  CHARTS
//-------------------------------------------------------------------------------------------


// SPECTRUM //
proto.chartSpectrum = function() {

    // gen data //
    var data = genChart.generateTimeSpectrum(35,115);

    // draw chart image //
    drawChart.drawTimeSpectrumChart(data);
    var b64 =  utils.stripUriMeta(drawChart.canvas.toDataURL());

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
    twitter.post(tweet);
};


// PHASE //
proto.chartPhase = function() {

    // gen data //
    var data = genChart.generateScopeData(7000);

    // draw chart image //
    drawChart.drawVectorScopeChart(data);
    var b64 =  utils.stripUriMeta(drawChart.canvas.toDataURL());

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
    twitter.post(tweet);
};


// PERIODIC //
proto.chartPeriodic = function() {

    // gen data //
    var data = genChart.generatePeriodicWaves(9);

    // draw chart image //
    drawChart.drawPeriodicWaveChart(data);
    var b64 =  utils.stripUriMeta(drawChart.canvas.toDataURL());

    // tweet data //
    var tweet = {
        media: {
            media_data: b64
        },
        status: 'Periodic waves seen in a selection of recent audio received by ARP:'
    };

    // tweet //
    twitter.post(tweet);
};


// WAVEFORM //
proto.chartWaveform = function() {

    // gen data //
    var data = genChart.generateWaveSection(3.5);

    // draw chart image //
    drawChart.drawWaveformChart(data);
    var b64 =  utils.stripUriMeta(drawChart.canvas.toDataURL());

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
    twitter.post(tweet);
};


//-------------------------------------------------------------------------------------------
//  TWEETS
//-------------------------------------------------------------------------------------------


proto.tweet = function(type) {

    // gen data //
    var data = genTweet.generateTweet(type);

    // tweet //
    var tw = {
        status: data
    };
    twitter.post(tw);
};

module.exports = Action;