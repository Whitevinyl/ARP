var fs = require('fs');
var jsonfile = require('jsonfile');
var file = './schedule.json';
var SunCalc = require('suncalc');
var Tombola = require('tombola');
var tombola = new Tombola();
var Action = require('./_ACTIONS');
var action = new Action();

var DEBUG = true;

var checkTime = 1000 * 60 * 10; // polling frequency: 10 minutes
var windowTime = 1000 * 60 * 60 * 48; // schedule window 48 hours

if (DEBUG) {
    checkTime = 1000 * 60; // polling frequency: minute
    windowTime = 1000 * 60 * 60; // schedule window hour
}

// Rather than generating tweets/audio etc with a regular interval, actions are scheduled
// in 48 hour blocks. This means actions can be scheduled with irregular timings, we can
// reduce unwanted repetition, and global events can create cohesive narrative across a
// group of actions, so we can think in larger time frames rather than each tweet being a
// world unto itself. It also means we can add in rare wildcard events to extend the time
// frame further.


var d = new Date();
var scheduleID = 1;
var defaultSchedule;
var defaultEvents = [
    {
        action: 'one minute',
        time: d.getTime() + (60 * 1000 * 0.5)
    },
    {
        action: 'one minute b',
        time: d.getTime() + (60 * 1000)
    },
    {
        action: 'two minutes',
        time: d.getTime() + (60 * 1000 * 2)
    },
    {
        action: 'three minutes',
        time: d.getTime() + (60 * 1000 * 3)
    }
];

function writeSchedule(d,e) {
    return {
        reschedule: d.getTime() + windowTime,
        id: scheduleID,
        events: e
    };
}
defaultSchedule = writeSchedule(d,defaultEvents);


//-------------------------------------------------------------------------------------------
//  INIT
//-------------------------------------------------------------------------------------------

function Scheduler() {
    this.checkInterval = null;
}
var proto = Scheduler.prototype;

proto.init = function() {
    var scheduleExists = fs.existsSync(file);
    if (!scheduleExists) {
        var that = this;
        console.log("new schedule");
        actionDealer();
        setTimeout(function() {
            // START CHECK CLOCK //
            that.stop();
            that.check();
        },5000);
    } else {
        console.log("schedule exists");
        this.check();
    }
};


//-------------------------------------------------------------------------------------------
//  MAIN SCHEDULING CLOCK
//-------------------------------------------------------------------------------------------

// this setInterval runs regularly (default every 20 mins) and checks the schedule to see if
// any events are past due. If an event is due it's removed from the schedule and sent to the
// actionHandler.
// It also checks to see when we need a new schedule written by the actionDealer.

proto.check = function() {
    checkSchedule();
    this.checkInterval = setInterval(checkSchedule,checkTime);
};
proto.stop = function() {
    clearInterval(this.checkInterval);
};


// poll for due events/new schedule window //
function checkSchedule() {
    console.log('checking schedule...');

    // READ SCHEDULE JSON //
    jsonfile.readFile(file, function(err, obj) {
        if (err) {
            console.log('schedule read error');
        } else {


            // IF WE'RE DUE A NEW SCHEDULE WINDOW //
            var time = new Date();
            var rescheduling = false;
            if (obj.reschedule) {
                var rescheduleTime = new Date(obj.reschedule);
                if (time > rescheduleTime) {
                    rescheduling = true;
                }
            } else {
                console.log('obj.reschedule not found');
                rescheduling = true;
            }
            if (obj.id) {
                if (obj.id!==scheduleID) {
                    rescheduling = true;
                }
            } else {
                console.log('obj.id not found');
                rescheduling = true;
            }



            if (rescheduling) {
                actionDealer();
                return;
            }


            // IF THERE ARE WAITING EVENTS //
            if (obj.events && obj.events.length>0) {

                var events = obj.events;
                console.log('pending events: '+events.length);


                // LOOP THROUGH EVENTS //
                for (var i=0; i<events.length; i++) {
                    var event = events[i];
                    var eventTime = new Date(event.time);

                    // IF PAST DUE //
                    if (time > eventTime) {

                        // do event //
                        actionHandler(event.action);

                        // remove event from list //
                        events.splice(i,1);

                        // update schedule //
                        var updatedSchedule = {reschedule: obj.reschedule,events: events};
                        jsonfile.writeFile(file, updatedSchedule, function(err) {
                            if (err) {
                                console.log("failed to update schedule");
                            } else {
                                console.log("updated schedule");
                            }
                        });

                        //exit loop so that only one event can be called per schedule check //
                        return;
                    }
                } // loop end
            }
        } // readfile callback success end
    });
}


//-------------------------------------------------------------------------------------------
//  ACTION DEALER
//-------------------------------------------------------------------------------------------

// This is the part that gets called every 48 hours and divvies out the actions. //
function actionDealer() {

    // SETUP ACTIONS //
    var time = new Date();
    var dayTime = windowTime/2;
    var events = [];
    var days = 2;

    var chartActions = [
        'chartSpectrum','chartPhase','chartPeriodic','chartWaveform','starTrails'
    ];
    var chartOptions = {
        weights: [
            10, 9, 9, 10, 0.5
        ],
        instances: [
            1,1,1,2,1
        ]
    };

    var tweetActions = [
        'tweetJourney','tweetTalk','tweetToday','tweetSighting','tweetSky','tweetLight',
        'tweetQuality','tweetVoices','tweetPeaks','tweetUpdate', 'tweetMichael', 'tweetInterview'
    ];
    var tweetOptions = {
        weights: [
            8, 1.5, 1, 8, 4, 5,
            10, 1, 3, 2, 0.75, 1
        ],
        instances: [
            1,1,1,1,1,1,
            2,1,2,1,1,1
        ]
    };


    // CHOOSE ACTIONS //
    // for each day //
    for (var h=0; h<days; h++) {
        var chartDeck = tombola.weightedDeck(chartActions,chartOptions);
        var tweetDeck = tombola.weightedDeck(tweetActions,tweetOptions);


        var audioNo = tombola.range(5,8);
        var chartNo = tombola.range(2,5);
        var tweetNo = tombola.range(3,6);
        if (DEBUG) {
            audioNo = tombola.range(5,4);
            chartNo = tombola.range(1,3);
            tweetNo = tombola.range(1,3);
        }
        var i, action, t, ev;


        // AUDIO //
        for (i=0; i<audioNo; i++) {
            t = timeSlot();
            ev = {
                action: 'audio',
                time: t + (dayTime*h)
            };
            events.push(ev);
        }


        // CHARTS //
        for (i=0; i<chartNo; i++) {
            action = chartDeck.draw();
            if (action!==null) {

                t = timeSlot();
                ev = {
                    action: action,
                    time: t + (dayTime*h)
                };
                events.push(ev);
            }
        }


        // TWEETS //
        for (i=0; i<tweetNo; i++) {
            action = tweetDeck.draw();
            if (action!==null) {

                if (action==='tweetSky' || action==='tweetVoices') {
                    t = timeSlot('night');
                }
                else if (action==='tweetLight') {
                    t = timeSlot('golden');
                }
                else {
                    t = timeSlot('day');
                }
                ev = {
                    action: action,
                    time: t + (dayTime*h)
                };
                events.push(ev);
            }
        }
    }


    // WRITE IT //
    var s = writeSchedule(time,events);
    jsonfile.writeFile(file, s, function(err) {
        if (err) {
            console.log("failed to write new schedule window");
        } else {
            console.log("written new schedule window");
        }
    });
}



//-------------------------------------------------------------------------------------------
//  ACTION HANDLER
//-------------------------------------------------------------------------------------------

// When an action in the schedule is due, it gets interpreted here.

function actionHandler(event) {

    // HANDLE A DUE EVENT //
    console.log(event);
    switch (event) {

        case 'audio':
            action.audio();
            break;

        case 'chartSpectrum':
            action.chartSpectrum();
            break;

        case 'chartPhase':
            action.chartPhase();
            break;

        case 'chartPeriodic':
            action.chartPeriodic();
            break;

        case 'chartWaveform':
            action.chartWaveform();
            break;

        case 'starTrails':
            action.starTrails();
            break;

        default:
            action.tweet(event);
            break;
    }
}


//-------------------------------------------------------------------------------------------
//  TIME SLOT FINDER
//-------------------------------------------------------------------------------------------


function timeSlot(slot) {

    var t1 = new Date();
    var t2 = new Date();
    t2.setDate(t1.getDate()+1);
    if (DEBUG) {
        t2 = new Date();
        t2.setTime(t1.getTime()+(windowTime/2));
    }
    var p1 = SunCalc.getTimes(t1, -23.8, -67.4);
    var p2 = SunCalc.getTimes(t2, -23.8, -67.4);

    // return a random time within the given slots //
    var t = tombola.range(t1.getTime(),t2.getTime());
    var c = 0;
    if (!DEBUG) {
        if (slot==='day') {
            while ( c<100 && !( (t>p1.nauticalDawn.getTime() && t<p1.night.getTime()) || (t>p2.nauticalDawn.getTime() && t<p2.night.getTime()) ) ) {
                t = tombola.range(t1.getTime(),t2.getTime());
                c++;
            }
        }
        if (slot==='night') {
            while ( c<100 && !( t<p1.nauticalDawn.getTime() ||  (t>p1.night.getTime() && t<p2.nauticalDawn.getTime()) || t>p2.night.getTime() ) ) {
                t = tombola.range(t1.getTime(),t2.getTime());
                c++;
            }
        }
        if (slot==='golden') {
            while ( c<100 && !( (t>p1.dawn.getTime() && t<p1.goldenHourEnd.getTime()) || (t>p1.goldenHour.getTime() && t<p1.nauticalDusk.getTime()) || (t>p2.dawn.getTime() && t<p2.goldenHourEnd.getTime()) || (t>p2.goldenHour.getTime() && t<p2.nauticalDusk.getTime()) ) ) {
                t = tombola.range(t1.getTime(),t2.getTime());
                c++;
            }
        }
    }
    return t;
}


module.exports = Scheduler;