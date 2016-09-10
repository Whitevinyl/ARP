var jsonfile = require('jsonfile');
var file = './schedule.json';
var Tombola = require('tombola');
var tombola = new Tombola();

var d = new Date();

var checkTime = 1000 * 60 * 20; // polling frequency: 20 minutes
var windowTime = 1000 * 60 * 60 * 48; // schedule window 48 hours

// Rather than generating tweets/audio etc with a regular interval, actions are scheduled
// in 48 hour blocks. This means actions can be scheduled with irregular timings, we can
// reduce unwanted repetition, and global events can create cohesive narrative across a
// group of actions, so we can think in larger time frames rather than each tweet being a
// world unto itself. It also means we can add in rare wildcard events to extend the time
// frame further.

var testSchedule;
function writeSchedule(d) {
    testSchedule = {
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

    var that = this;
    jsonfile.writeFile("schedule.json", testSchedule, function(err) {
        if (err) {
            console.log("failed to write schedule");
        } else {
            console.log("written schedule");

            // START CHECK CLOCK //
            that.check();
        }
    });
}


//-------------------------------------------------------------------------------------------
//  MAIN SCHEDULING CLOCK
//-------------------------------------------------------------------------------------------

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

function actionDealer() {

    // DEAL OUT EVENTS AND SCHEDULE THEM //
    var time = new Date();
    writeSchedule(time);
    jsonfile.writeFile("schedule.json", testSchedule, function(err) {
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

function actionHandler(action) {

    // HANDLE A DUE EVENT //
    console.log(action);
}


module.exports = Scheduler;