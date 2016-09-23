
// A bunch of easing equations, usually used for animating things with smooth movement, but
// here I'm using them as a cheap way to algorithmically draw waveforms (I'm not mathsy
// enough to do it properly!)

//-------------------------------------------------------------------------------------------
//  CUBIC
//-------------------------------------------------------------------------------------------


function inCubic(t, b, c, d) {
    t /= d;
    return c*t*t*t + b;
}

function outCubic(t, b, c, d) {
    t /= d;
    t--;
    return c*(t*t*t + 1) + b;
}

function inOutCubic(t, b, c, d) {
    t /= d/2;
    if (t < 1) return c/2*t*t*t + b;
    t -= 2;
    return c/2*(t*t*t + 2) + b;
}

//-------------------------------------------------------------------------------------------
//  CIRCLE
//-------------------------------------------------------------------------------------------

function inCirc(t, b, c, d) {
    t /= d;
    return -c * (Math.sqrt(1 - t*t) - 1) + b;
}

function outCirc(t, b, c, d) {
    t /= d;
    t--;
    return c * Math.sqrt(1 - t*t) + b;
}

function inOutCirc(t, b, c, d) {
    t /= d/2;
    if (t < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
    t -= 2;
    return c/2 * (Math.sqrt(1 - t*t) + 1) + b;
}

//-------------------------------------------------------------------------------------------
//  CUSTOM
//-------------------------------------------------------------------------------------------

// curves made using:
// http://www.timotheegroleau.com/Flash/experiments/easing_function_generator.htm

function custom1(t, b, c, d) {
    var ts=(t/=d)*t;
    var tc=ts*t;
    return b+c*(21*tc*ts + -65*ts*ts + 70*tc + -30*ts + 5*t);
}

function custom2(t, b, c, d) {
    var ts=(t/=d)*t;
    var tc=ts*t;
    return b+c*(31*tc*ts + -90*ts*ts + 100*tc + -50*ts + 10*t);
}

function custom3(t, b, c, d) {
    var ts=(t/=d)*t;
    var tc=ts*t;
    return b+c*(41*tc*ts + -135*ts*ts + 160*tc + -80*ts + 15*t);
}

function custom4(t, b, c, d) {
    var ts=(t/=d)*t;
    var tc=ts*t;
    return b+c*(41*tc*ts + -135*ts*ts + 160*tc + -81*ts + 15*t);
}

function custom5(t, b, c, d) {
    var ts=(t/=d)*t;
    var tc=ts*t;
    return b+c*(80.9425*tc*ts + -232.08*ts*ts + 240.68*tc + -106.29*ts + 17.7475*t);
}


// DIFF STYLE //
function custom6(k) {
    if (k < (1 / 2.75)) {
        return 7.5625 * k * k;
    } else if (k < (2 / 2.75)) {
        return 7.5625 * (k -= (1.5 / 2.75)) * k + 0.75;
    } else if (k < (2.5 / 2.75)) {
        return 7.5625 * (k -= (2.25 / 2.75)) * k + 0.9375;
    } else {
        return 7.5625 * (k -= (2.625 / 2.75)) * k + 0.984375;
    }
}

function custom7(k) {
    if (k === 0) {
        return 0;
    }
    if (k === 1) {
        return 1;
    }
    return Math.pow(2, -10 * k) * Math.sin((k - 0.1) * 5 * Math.PI) + 1;
}

function custom8(k) {
    if (k === 0) {
        return 0;
    }
    if (k === 1) {
        return 1;
    }
    k *= 2;
    if (k < 1) {
        return -0.5 * Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);
    }
    return 0.5 * Math.pow(2, -10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI) + 1;
}


module.exports = {

    cubicIn: inCubic,
    cubicOut: outCubic,
    cubicInOut: inOutCubic,

    circleIn: inCirc,
    circleOut: outCirc,
    circleInOut: inOutCirc,

    custom1: custom1,
    custom2: custom2,
    custom3: custom3,
    custom4: custom4,
    custom5: custom5,
    custom6: custom6,
    custom7: custom7,
    custom8: custom8
};