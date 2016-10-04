var utils = require('../../lib/utils');
var easing = require('../../lib/easing');

// A simple ADSR envelope, adsr should be an array w 4 index, a,d & r are percentages

//-------------------------------------------------------------------------------------------
//  PROCESS
//-------------------------------------------------------------------------------------------

function ADSREnvelope(t,d,adsr) {
    var a = 0;

    if (t<d) {
        var attack = Math.round((d/100) * adsr[0]);
        var decay = Math.round((d/100) * adsr[1]);
        var sustain = adsr[2];
        var release = d - (attack + decay);

        if (t<=attack) {
            //a = ((1/attack) * t);
            a = easing.circleIn(t, 0, 1, attack);
        }
        if (t>attack && t<=(attack + decay)) {
            //a = 1 - (((1-sustain)/decay) * (t-attack));
            a = easing.circleOut(t - attack, 1, -(1-sustain), decay);
        }
        if (t>(attack + decay)) {
            //a = sustain - ((sustain/release) * (t-(attack + decay)));
            a = easing.circleOut(t - (attack + decay), sustain, -sustain, release);
        }

        if (a!==a) a = 0;
    }

    return a;
}

module.exports = ADSREnvelope;