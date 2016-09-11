var fs = require('fs');
var jsonfile = require('jsonfile');
var file = './schedule.json';
var Tombola = require('tombola');
var tombola = new Tombola();
var Action = require('./_ACTIONS');
var action = new Action();

var checkTime = 1000 * 60 * 20; // polling frequency: 20 minutes
var windowTime = 1000 * 60 * 60 * 48; // schedule window 48 hours

// Rather than generating tweets/audio etc with a regular interval, actions are scheduled
// in 48 hour blocks. This means actions can be scheduled with irregular timings, we can
// reduce unwanted repetition, and global events can create cohesive narrative across a
// group of actions, so we can think in larger time frames rather than each tweet being a
// world unto itself. It also means we can add in rare wildcard events to extend the time
// frame further.


var d = new Date();
var defaultSchedule;
function writeSchedule(d) {
    defaultSchedule = {
        reschedule: d.getTime() + windowTime,
        events: [
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
        ]
    };
}
writeSchedule(d);


//-------------------------------------------------------------------------------------------
//  INIT
//-------------------------------------------------------------------------------------------

function Scheduler() {
    this.checkInterval = null;
}

Scheduler.prototype.init = function() {
    var scheduleExists = fs.existsSync(file);
    if (!scheduleExists) {
        var that = this;
        jsonfile.writeFile(file, defaultSchedule, function(err) {
            if (err) {
                console.log("failed to write schedule");
            } else {
                console.log("written schedule");

                // START CHECK CLOCK //
                that.check();
            }
        });
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

Scheduler.prototype.check = function() {
    checkSchedule();
    this.checkInterval = setInterval(checkSchedule,checkTime);
};
Scheduler.prototype.stop = function() {
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
                        jsonfile.writeFile("schedule.json", updatedSchedule, function(err) {
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

// This is the part that gets called every 48 hours and divvies out the actions.

function actionDealer() {

    // DEAL OUT EVENTS AND SCHEDULE THEM //
    var events = [];
    var days = 2;
    var deck = [];

    // for each day //
    for (var h=0; h<days; h++) {
        var tweetNo = tombola.range(6,9);

        // pick each action //
        for (var i=0; i<tweetNo; i++) {

        }

    }




    var time = new Date();
    writeSchedule(time);
    jsonfile.writeFile("schedule.json", defaultSchedule, function(err) {
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

// When an action in the schedule is due, it gets interpreted here. In future I'd like to
// find a nicer way of passing these actions than using a big switch statement.

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


module.exports = Scheduler;