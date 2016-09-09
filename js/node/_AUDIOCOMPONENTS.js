

var Tombola = require('tombola');
var tombola = new Tombola();

function fmod(a,b) {
    return a % b;
}

//-------------------------------------------------------------------------------------------
//  VOICE OBJECT
//-------------------------------------------------------------------------------------------


function Voice(frequency) {
    this.frequency = frequency || 440;
    this.detune = 0;
    this.gain = 0.5;
    this.panning = 0;
    this.amplitude = 0;
    this.polarity = -1;
}


//-------------------------------------------------------------------------------------------
//  NOISE OBJECTS
//-------------------------------------------------------------------------------------------


// PINK NOISE //
function VoicePink() {
    this.gain = 0.5;
    this.panning = 0;
    this.amplitude = 0;
    this.b0 = this.b1 = this.b2 = this.b3 = this.b4 = this.b5 = this.b6 = 0.0;
}
VoicePink.prototype.process = function() {
    var white = Math.random() * 2 - 1;
    this.b0 = 0.99886 * this.b0 + white * 0.0555179;
    this.b1 = 0.99332 * this.b1 + white * 0.0750759;
    this.b2 = 0.96900 * this.b2 + white * 0.1538520;
    this.b3 = 0.86650 * this.b3 + white * 0.3104856;
    this.b4 = 0.55000 * this.b4 + white * 0.5329522;
    this.b5 = -0.7616 * this.b5 - white * 0.0168980;
    var total = this.b0 + this.b1 + this.b2 + this.b3 + this.b4 + this.b5 + this.b6 + white * 0.5362;
    this.b6 = white * 0.115926;
    total *= 0.2; // gain comp
    return total * this.gain;
};



// BROWN NOISE //
function VoiceBrown() {
    this.gain = 0.5;
    this.panning = 0;
    this.amplitude = 0;
}
VoiceBrown.prototype.process = function() {
    var white = Math.random() * 2 - 1;
    var total = (this.amplitude + (0.02 * white)) / 1.02;
    this.amplitude = total;
    total *= 3.5; // gain comp
    return total * this.gain;
};



// WHITE NOISE //
function VoiceWhite() {
    this.gain = 0.5;
    this.panning = 0;
    this.amplitude = 0;
}
VoiceWhite.prototype.process = function() {
    var white = (Math.random() * 2 - 1);
    return white * this.gain;
};



// ROAR NOISE //
function VoiceRoar(threshold) {
    this.gain = 0.5;
    this.panning = 0;
    this.amplitude = 0;
    this.threshold = threshold || 0.8;
}
VoiceRoar.prototype.process = function() {
    var white = (Math.random() * 2 - 1);
    if (white>(-this.threshold) && white<this.threshold) {
        white = this.amplitude;
    }
    this.amplitude = white;
    return white * this.gain;
};



// CRACKLE NOISE //
function VoiceCrackle(threshold) {
    this.gain = 0.5;
    this.panning = 0;
    this.amplitude = 0;
    this.threshold = threshold || 0.1;
}
VoiceCrackle.prototype.process = function() {
    var white = (Math.random() * 2 - 1);
    if (white<(-this.threshold) || white>this.threshold) {
        white = this.amplitude;
    }
    this.amplitude = white;
    return white * this.gain;
};



// CRACKLE PEAK NOISE //
function VoiceCracklePeak(threshold) {
    this.gain = 0.5;
    this.panning = 0;
    this.amplitude = 0;
    this.threshold = threshold || 0.001;
}
VoiceCracklePeak.prototype.process = function() {
    var white = (Math.random() * 2 - 1);
    if (white<(-this.threshold) || white>this.threshold) {
        white = this.amplitude;
    } else {
        this.amplitude = white;
        white *= (1/this.threshold);
    }
    return white * this.gain;
};


//-------------------------------------------------------------------------------------------
//  WAVE SHAPE ALGORITHMS
//-------------------------------------------------------------------------------------------


function waveShape(shape, voice, amp) {
    switch (shape) {
        case 'triangle' :
            this.waveTriangle(voice, amp);
            break;
        case 'sawtooth' :
            this.waveSawtooth(voice, amp);
            break;
        default :
            break;
    }
}


// TRIANGLE //
function waveTriangle(voice, amp) {
    // update voice value //
    var step = ((voice.frequency + voice.detune) * (4/sampleRate));
    voice.amplitude += (step * voice.polarity);

    // stay within amplitude bounds //
    var spill = 0;
    if (voice.amplitude > amp) {
        spill = voice.amplitude - amp;
        voice.amplitude = amp - spill;
        voice.polarity = - voice.polarity;
    }
    if (voice.amplitude < -amp) {
        spill = (voice.amplitude - (-amp));
        voice.amplitude = (-amp) - spill;
        voice.polarity = - voice.polarity;
    }
}


// SAWTOOTH //
function waveSawtooth(voice, amp) {
    voice.polarity = -1;
    // update voice value //
    var step = ((voice.frequency + voice.detune) * (2/sampleRate));
    voice.amplitude += (step * voice.polarity);

    // stay within amplitude bounds //
    var spill = 0;
    if (voice.amplitude < -amp) {
        spill = voice.amplitude - (-amp);
        voice.amplitude = (amp - spill);
    }
}


// ARC //
function waveArc(voice, amp, i) {
    var x = (sampleRate/voice.frequency);
    var a = x * Math.floor((i/sampleRate)*voice.frequency);
    voice.amplitude = (1 - ( Math.sqrt(Math.pow(x,2) - Math.pow(i-a,2)) / (x/2) )) * amp;
}


// ARC 2 //
// has a frequency leak
function waveArc2(voice, amp, i) {
    var x = (sampleRate/(voice.frequency));
    var m = Math.floor(i/x+1);
    var a = ((x) * m);
    if (m%2==0) {
        voice.amplitude = (-1 + ( Math.sqrt(Math.pow(x,2) - Math.pow(i-a,2)) / Math.round(x/2) )) * amp;
    } else {
        voice.amplitude = (1 - ( Math.sqrt(Math.pow(x,2) - Math.pow(i-a,2)) / Math.round(x/2) )) * amp;
    }
}


// ARC 3 //
// has an frequency leak
function waveArc3(voice, amp, i) {
    var t = i;
    var d = Math.floor((sampleRate)/(voice.frequency));
    var m = Math.floor(i/(d));
    var b = -1; // start
    var c = 2; // change
    if (m%2==0) {
        b = 1;
        c = -2;
    }
    t -= ((m * (d)));
    t /= (d);
    voice.amplitude =  (c*t*t*t*t + b) * amp;
}

function WavePlayer(wave) {
    this.waveforms = wave.waveforms;
    this.wave = tombola.item(this.waveforms);
    this.a = 0.3;
    this.f = 200;
    this.i = 0;
    this.p = 0;
}
WavePlayer.prototype.process = function(input, frequency) {

    this.f += 0.0001;
    this.f = valueInRange(this.f,5,18000);
    if (frequency) this.f = frequency;

    this.i += this.wave.length/(sampleRate/this.f);

    if (this.i>=(this.wave.length-1)) {
        this.i = 0;
        this.wave = tombola.item(this.waveforms);
    }

    // pan //
    this.p += tombola.rangeFloat(-0.008,0.008);
    this.p = valueInRange(this.p, -1, 1);

    var sample = [
        (this.wave[Math.round(this.i)] + tombola.fudgeFloat(2,0.1)) * (1 + -this.p),
        (this.wave[Math.round(this.i)] + tombola.fudgeFloat(2,0.1)) * (1 + this.p)
    ];

    input = [
        input[0] + (sample[0] * this.a),
        input[1] + (sample[1] * this.a)
    ];

    return input;
};

//-------------------------------------------------------------------------------------------
//  FILTERS
//-------------------------------------------------------------------------------------------


function FilterWrapper(settings) {
    this.filter = settings.filter;
    this.mods = [];
}
FilterWrapper.prototype.process = function(signal,index) {

};



// INLINE FILTERS //
////////////////////


function filterNoise(level) {
    return tombola.rangeFloat(-level,level);
}


// FEEDBACK //
function filterFeedback(level,delay,channel,index) {
    delay = Math.round(delay);
    if (index<delay) {
        return 0;
    }
    return (channel[index-delay]*level);
}


function filterStereoFeedbackX(signal,level,delay,channel,index) {
    return [
        signal[0] + filterFeedback(level,delay,channel[1],index),
        signal[1] + filterFeedback(level,delay,channel[0],index)
    ];
}


// FEEDBACK 2//
function filterFeedback2(input,level,delay,channel,index,l) {
    delay = Math.round(delay);
    if ((index + delay) < l) {
        channel[index+delay] = input*level;
    }
}

function filterStereoFeedback2X(signal,level,delay,channel,index,l) {
    filterFeedback2(signal[0],level,delay,channel[1],index,l);
    filterFeedback2(signal[1],level,delay,channel[0],index,l);
}


// REVERB //
function filterReverb(level,delay,size,channel,index) {
    var primes = [0, 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101];
    var out = 0;
    var r = 1/(size*1.3);
    for (var j=0; j<size; j++) {
        out += filterFeedback(((level) - (r*j))*0.15,delay + (primes[j]*60),channel,index);
    }
    return out;
}

function filterStereoReverb(signal,level,delay,size,channel,index) {
    return [
        signal[0] += filterReverb(level,delay,size,channel[1],index),
        signal[1] += filterReverb(level,delay,size,channel[0],index)
    ];
}


// REVERB 2 // NOT YET WORKING
function filterReverb2(level,delay,size,channel,index) {
    var primes = [0, 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101];
    var out = 0;
    var scale = 1;
    var r = 1/(size*1.3);
    for (var j=0; j<size; j++) {
        out += filterFeedback(((level) - (r*j))*0.15, delay + ((primes[size-1]*scale)-(primes[size-j]*scale)),channel,index);
        //out += filterFeedback(((level) - (r*(size-j)))*0.15,delay + ((primes[size-1]*scale)-(primes[j]*scale)),channel,index);
    }
    return out;
}


// FOLDBACK //
function filterFoldBack(input,threshold) {
    if (input>threshold || input<-threshold) {
        input = Math.abs(Math.abs(fmod(input - threshold, threshold*4)) - threshold*2) - threshold;
    }
    return input;
}

function filterStereoFoldBack(signal,threshold) {
    return [
        filterFoldBack(signal[0],threshold),
        filterFoldBack(signal[1],threshold)
    ];
}


// FOLDBACK2 //
function filterFoldBack2(input,threshold, power) {
    if (input>threshold) {
        input = threshold - ((input-threshold)*power);
    }
    if (input<-threshold) {
        input = -threshold - ((input-(-threshold))*power);
    }
    return valueInRange(input,-threshold,threshold);
}

function filterStereoFoldBack2(signal,threshold,power) {
    return [
        filterFoldBack2(signal[0],threshold,power),
        filterFoldBack2(signal[1],threshold,power)
    ];
}


// CLIPPING //
function filterClipping(input, threshold, output) {
    return (valueInRange(input, -threshold, threshold) * (1/threshold)) * output;
}

function filterStereoClipping(signal,threshold,output) {
    return [
        filterClipper(signal[0],threshold,output),
        filterClipper(signal[1],threshold,output)
    ];
}


// CLIPPING2 //
function filterClipping2(input,threshold, power) {
    if (input>threshold) {
        input = threshold + ((input-threshold)*power);
    }
    if (input<-threshold) {
        input = -threshold + ((input-(-threshold))*power);
    }
    return input;
}

function filterStereoClipping2(signal,threshold,power) {
    return [
        filterClipping2(signal[0],threshold,power),
        filterClipping2(signal[1],threshold,power)
    ];
}


// INVERT WAVEFORM //
function filterInvert(input,threshold) {
    var a = input;
    if (input>0) {
        a = threshold - (input*threshold);
        if (a<0) a=0;
    }
    if (input<0) {
        a = -threshold - (input*threshold);
        if (a>0) a=0;
    }
    return a;
}

function filterStereoInvert(signal,threshold) {
    return [
        filterInvert(signal[0],threshold),
        filterInvert(signal[1],threshold)
    ];
}


// ERODE ? //
function filterErode(input,width,index) {
    if (index % tombola.range(1,width)===0) {
        //input *= tombola.rangeFloat(0.85,0.95);
        input = -input;
    }
    return input;
}

function filterStereoErode(signal,width,index) {
    return [
        filterErode(signal[0],width,index),
        filterErode(signal[1],width,index)
    ];
}


// PANNER //
function filterStereoPanner(signal,panning) {
    if (panning<0) {
        signal = [
            (signal[0] * (1+panning)) + (signal[1] * (-panning)),
            signal[1] * (1+panning)
        ];
    } else {
        signal = [
            signal[0] * (1-panning),
            (signal[1] * (1-panning)) + (signal[0] * (panning))
        ];
    }
    return signal;
}


// PERSISTENT FILTERS //
////////////////////////

function PhaseSine() {
    this.f = 200;
    this.v = 0;

    this.mf1 = 10;
    this.mv1 = 0;
    this.ma1 = 1;

    this.mf2 = 10;
    this.mv2 = 0;
    this.ma2 = 0.6;
}
PhaseSine.prototype.process = function(f,mf1,mf2) {

    if (f) this.f = f;
    if (mf1) this.mf1 = mf1;
    if (mf2) this.mf2 = mf2;

    // modulation waves //
    this.mv1 += this.mf1/(sampleRate/4);
    if(this.mv1 > 2) this.mv1 -= 4;

    this.mv2 += this.mf2/(sampleRate/4);
    if(this.mv2 > 2) this.mv2 -= 4;

    var m1 = this.mv1 * this.ma1;
    var m2 = this.mv2 * this.ma2;
    //m1 = 1;


    // affected wave //
    this.v += (((this.f)/(sampleRate/4)));
    if(this.v > 2) this.v -= 4;
    return ((this.v * m1) + m2) * (2-Math.abs((this.v * m1) + m2));
};


function FilterWail() {
    this.voices = [];
    this.f = [];
    this.a = 0;
    this.i = -1;
    this.l = 0;
    this.d = 0;
    this.b = false;
}
FilterWail.prototype.process = function(input,ducking,chance) {

    if (tombola.chance(1,chance)) {
        this.b = tombola.chance(1,5);
        this.i = 0;
        this.a = 0;
        var f;
        if (this.b) {
            f = tombola.rangeFloat(100,800);
            this.l = tombola.range(30000,100000);
        } else {
            f = tombola.rangeFloat(60,800);
            this.l = tombola.range(5000,100000);
        }

        var voiceType = tombola.item([Metallic,Voice2,Voice3]);
        this.voices = [];
        this.f = [];
        var voiceNo = tombola.range(7,10);
        this.d = tombola.rangeFloat(-(f/400000), (f/400000));
        var mf = 0;
        for (var i=0; i<voiceNo; i++) {
            mf = (f + tombola.fudgeFloat(14,(f/40)));
            this.f.push(mf);
            this.voices.push(new WavePlayer(new voiceType()));
        }
    }


    if (this.i>=0 && this.i<this.l) {

        this.i++;

        var attack = (this.l*0.0005);
        var decay = (this.l*0.05);
        var sustain = 0.4;
        var release = this.l - (attack + decay);
        if (!this.b) {
            if (this.i<(this.l*0.4)) {
                this.a += (1/(this.l*0.4));
            }
            if (this.i>(this.l/2)) {
                this.a -= (1/(this.l/2));
            }
        } else {
            if (this.i<attack) {
                this.a += (1/attack);
            }
            if (this.i>attack && this.i<(attack + decay)) {
                this.a -= ((1-sustain)/decay);
            }
            if (this.i>(attack + decay)) {
                this.a -= (sustain/release);
            }
        }

        // pan //
        this.p += tombola.rangeFloat(-0.005,0.005);
        this.p = valueInRange(this.p, -1, 1);

        // voices//
        var signal = [0,0];
        var vl = this.voices.length;
        for (i=0; i<vl; i++) {
            this.f[i] += this.d;
            var voice = this.voices[i];
            signal = voice.process(signal,this.f[i]);
        }
        signal[0] *= (1/vl);
        signal[1] *= (1/vl);

        input = [
            (input[0] * (1-(this.a * ducking))) + (signal[0] * this.a),
            (input[1] * (1-(this.a * ducking))) + (signal[1] * this.a)
        ];

        if (this.i>=this.l) {
            this.i = -1;
        }
    }
    return input;
};




// RESAMPLER //
function FilterResampler() {
    this.s = 0;
    this.c = 0;
    this.i = -1;
    this.r = 0;
    this.sp = 3;
    this.l = 5000;
    this.m = [0,0];
}
FilterResampler.prototype.process = function(input,mode,chance,channel,index) {

    var ind;

    if (mode===0) {
        if (index>4000 && this.i<0 && tombola.chance(1,chance)) {
            // get sample //
            if (this.s===0) this.s = tombola.range(1,index);
            this.i = 0;
            this.sp = tombola.rangeFloat(-0.6,1.5);
            this.r = tombola.rangeFloat(0.01,2);
            this.l = tombola.range(5000,40000);
        }

        if (this.i>=0) {
            input =  [
                channel[0][this.s + Math.round(this.i)],
                channel[1][this.s + Math.round(this.i)]
            ];

            if (this.i<this.l) {
                this.r += (this.sp/sampleRate);
                this.i += this.r;
            } else {
                this.i =-1;
            }
        }
    }
    if (mode===1 || mode===2) {
        if (index>10000 && this.i<0 && tombola.chance(1,chance)) {
            // get sample //
            this.s = tombola.range(1,index);
            this.i = 0;
            this.sp = tombola.rangeFloat(-0.5,0.6);
            this.r = tombola.rangeFloat(0.7,2);
            this.l = tombola.range(700,7000);
            this.c = tombola.range(3,11);
        }


        if (this.i>=0) {
            ind = this.s + Math.round(this.i);

            if (ind<index) {
                input = [
                    channel[0][this.s + Math.round(this.i)],
                    channel[1][this.s + Math.round(this.i)]
                ];

                if (this.i < this.l) {
                    this.r += (this.sp / sampleRate);
                    this.i += this.r;
                } else {
                    this.i = -1;
                }

                if (this.c > 0 && this.i < 0) {
                    this.c -= 1;
                    this.i = 0;
                    this.r += (this.sp / sampleRate);
                    this.r += tombola.fudgeFloat(4, 0.05);
                    this.i += this.r;

                    if (mode === 2) this.s = tombola.range(1, index);
                    //this.r = tombola.rangeFloat(0.8,2);

                    if (this.r < 0) {
                        this.c = 0;
                        this.i = -1;
                    }
                }
            }
        }
    }
    if (mode===3) {
        if (index>5000 && this.i<0 && tombola.chance(1,chance)) {
            this.i = 0;
            this.sp = 0;
            this.l = tombola.range(6000,100000);
            this.s = tombola.range(200,5000);
            this.s = valueInRange(this.s,1,index-1);
        }

        if (this.i>=0) {

            this.i++;
            this.sp += tombola.fudge(18,1);
            this.sp = valueInRange(this.sp,-(index-1),this.s-40);

            input = [
                channel[0][index - this.s + Math.round(this.sp)],
                channel[1][index - this.s + Math.round(this.sp)]
            ];


            if (this.i > this.l || (this.m[0]==input[0] && this.m[1]==input[1])) {
                this.i = -1;
            }
            this.m = input;
        }
    }
    if (mode===4) {
        if (index>10000 && this.c<=0 && tombola.chance(1,chance)) {
            this.s = tombola.range(1,index-10000);
            this.i = 0;
            this.sp = tombola.rangeFloat(-0.05,0.05);
            this.r = tombola.rangeFloat(1,3);
            this.l = 380;
            this.c = tombola.range(90,160);
        }


        if (this.c>0 && this.i>=0) {
            ind = this.s + Math.round(this.i);

            if (ind<index) {

                input =  [
                    channel[0][ind],
                    channel[1][ind]
                ];

                if (this.i<this.l) {
                    this.r += (this.sp/sampleRate);
                    this.i +=this.r;
                } else {
                    this.i = -1;
                }

                if (this.i<0) {
                    this.c -= 1;
                    this.i = 0;
                    this.s += Math.floor(this.l/2);
                }

            } else {
                this.c = 0;
                this.i = -1;
            }


        }
    }
    return input;
};


// PULSE //
function FilterPulse() {
    this.t = 0;
    this.f = 50;
    this.a = 1;
    this.p = 0;
    this.i = -1;
    this.l = tombola.range(2000,10000);
}
FilterPulse.prototype.process = function(input,ducking,reverse) {
    ducking = ducking || 0;
    reverse = reverse || false;

    if (this.i<=0) {
        this.i = 0;
        this.f = tombola.range(20,40);
        this.a = 1;
        if (reverse) {
            this.f = tombola.range(2,22);
            this.a = 0;
        }
        this.t = 0;
        this.l += 1000;
        if (tombola.chance(1,5)) {
            this.l = tombola.range(500,20000);
        }
    }

    if (this.i>=0 && this.i<this.l) {

        this.i++;

        if (reverse) {
            this.f += (18/this.l);
            this.a += (1/this.l);
        } else {
            this.f -= (18/this.l);
            this.a -= (1/this.l);
        }

        // pan //
        this.p += tombola.rangeFloat(-0.008,0.008);
        this.p = valueInRange(this.p, -1, 1);

        this.t += (this.f * (4/sampleRate));
        if (this.t>3) this.t = (this.t - 4);
        var t = this.t;
        if (t>1) t = (1-this.t);

        var signal = [
            (t + tombola.fudgeFloat(2,0.1)) * (1 + -this.p),
            (t + tombola.fudgeFloat(2,0.1)) * (1 + this.p)
        ];

        input = [
            ((input[0]*0.95) * (1-(this.a * ducking))) + (signal[0] * this.a),
            ((input[1]*0.95) * (1-(this.a * ducking))) + (signal[1] * this.a)
        ];

        if (this.i>=this.l) {
            this.i = -1;
        }
    }
    return input;
};


// GROWL //
function FilterGrowl() {
    this.a = 0;
    this.ma = 0;
    this.i = -1;
    this.mi = 0;
    this.c = 0;
    this.f = 0;
    this.mf = 0;
    this.l = [];
    this.tl = 0;
    this.p = 0;
    this.v = 0;
    this.n = 0;
}
FilterGrowl.prototype.process = function(input,ducking,chance) {

    if (this.i<=0 && tombola.chance(1,chance)) {
        this.l = [];
        this.tl = 0;
        var pulses = tombola.range(10,30);
        var l = tombola.range(800,5000);
        var d = tombola.range(-400,400);
        for (var i=0; i<pulses; i++) {
            this.l.push(l);
            this.tl += l;
            if (tombola.chance(1,3)) {
                d = tombola.range(-400,400);
            }
            if ((l+d)<800) d = tombola.range(0,400);
            if ((l+d)>5000) d = tombola.range(-400,0);
            l += d;
        }

        this.mf = this.f = (6300 - this.l[0])/30;
        this.i = 0;
        this.a = 0;
        this.ma = 0;
        this.c = 0;
        this.v = 0;
        this.mi = 0;
        this.n = tombola.range(3,8);
    }

    if (this.c<(this.l.length-1) && this.i>=0) {

        if (this.i<this.l[this.c]) {
            this.i ++;
        } else {
            this.i = 0;
            this.c += 1;
            this.a = 0;
            this.mf = (6300 - this.l[this.c])/30;
            this.f = this.mf;
        }
        this.mi ++;

        // amp //
        var attack = this.l[this.c]*0.1;
        var release = this.l[this.c] - attack;
        if (this.i<attack) {
            this.a += (1/attack);
        }
        if (this.i>attack) {
            this.a -= (1/release);
        }

        // master amp //
        attack = this.tl*0.3;
        release = this.tl*0.4;
        if ((this.mi)<attack) {
            this.ma += (1/attack);
        }
        if ((this.mi)>(this.tl-release)) {
            this.ma -= (1/release);
        }

        // pitch //
        this.f -= ((this.mf*0.6)/this.l[this.c]);

        // pan //
        this.p += tombola.rangeFloat(-0.005,0.005);
        this.p = valueInRange(this.p, -1, 1);

        //voice //
        this.v += this.f/(sampleRate/4);
        if(this.v > 2) this.v -= 4;
        var t = this.v*(2-Math.abs(this.v));

        var signal = [
            (t + tombola.fudgeFloat(this.n,0.03)) * (1 + -this.p),
            (t + tombola.fudgeFloat(this.n,0.03)) * (1 + this.p)
        ];

        input = [
            (input[0] * (1-((this.a * this.ma) * ducking))) + (signal[0] * (this.a * this.ma)),
            (input[1] * (1-((this.a * this.ma) * ducking))) + (signal[1] * (this.a * this.ma))
        ];
    }

    return input;
};


// SUB SWELL //
function FilterSubSwell() {
    this.a = 0;
    this.v = 0;
    this.f = 0;
    this.i = -1;
    this.l = 0;
    this.p = 0;
    this.d = 0;
    this.m = [0];
}
FilterSubSwell.prototype.process = function(input,ducking,chance) {

    if (tombola.chance(1,chance)) {
        this.i = 0;
        this.a = 0;
        this.v = 15;
        this.f = 0;
        this.l = tombola.range(30000,300000);
        this.m = [0];
        this.d = tombola.rangeFloat(7,40);
    }

    if (this.i>=0 && this.i<this.l) {

        this.i++;

        var h = this.l/2;
        if (this.i<(this.l*0.4)) {
            this.a += (1/(this.l*0.4));
        }
        if (this.i>(this.l*0.6)) {
            this.a -= (1/(this.l*0.4));
        }
        this.f = 15 + (this.a * (this.d)) + tombola.rangeFloat(-0.0005,0.0005);

        // pan //
        this.p += tombola.rangeFloat(-0.005,0.005);
        this.p = valueInRange(this.p, -1, 1);

        // voice //
        /*this.v += (this.f * (4/sampleRate));
        if (this.v>3) this.v = (this.v - 4);
        var t = this.v;
        if (t>1) t = (1-this.v);*/
        this.v += this.f/(sampleRate/4);
        if(this.v > 2) this.v -= 4;
        var t = this.v*(2-Math.abs(this.v));

        var m = 0;
        if (this.m.length>=200) {
            m = this.m[this.m.length-1];
            this.m = this.m.slice(0,200);
        }
        this.m.push((t + tombola.fudgeFloat(2,0.002)) * (1 + this.p));

        var signal = [
            (t + tombola.fudgeFloat(2,0.002)) * (1 + -this.p),
            m
        ];

        var threshold = this.a*1.5;
        if (threshold>1) threshold = 1;

        input = [
            (input[0] * (1-(threshold * ducking))) + (signal[0] * this.a),
            (input[1] * (1-(threshold * ducking))) + (signal[1] * this.a)
        ];

        if (this.i>=this.l) {
            this.i = -1;
        }
    }

    return input;
};



// SIREN //

function SirenVoice(f) {
    this.f = f;
    this.v = 0;
}

function FilterSiren() {
    this.voices = [];
    this.a = 0;
    this.i = -1;
    this.l = 0;
    this.d = 0;
    this.p = 0;
    this.lp = new FilterStereoLowPass();
}


FilterSiren.prototype.process = function(input,ducking,chance) {

    if (this.i<=0 && tombola.chance(1,chance)) {
        this.i = 0;
        this.a = 0;
        this.l = tombola.range(5000,100000);
        this.d = tombola.rangeFloat(-0.0005, 0.0005);
        this.voices = [];
        var voiceNo = tombola.range(6,10);
        var f = tombola.rangeFloat(40,250);
        var mf = 0;
        for (var i=0; i<voiceNo; i++) {
            if (i===0) mf = (f/2);
            if (i===1) mf = (f*2);
            if (i>1) mf = (f + tombola.fudgeFloat(14,(f/100)));
            if (mf<10) mf = 10;
            this.voices.push(new SirenVoice(mf));
        }
    }


    if (this.i>=0 && this.i<this.l) {

        this.i++;
        if (this.i<(this.l*0.4)) {
            this.a += (1/(this.l*0.4));
        }
        if (this.i>(this.l/2)) {
            this.a -= (1/(this.l/2));
        }

        // pan //
        this.p += tombola.rangeFloat(-0.005,0.005);
        this.p = valueInRange(this.p, -1, 1);

        // voices//
        var vt = 0;
        var vl = this.voices.length;
        for (i=0; i<vl; i++) {
            var voice = this.voices[i];
            voice.v += (voice.f * (4/sampleRate));
            voice.f += (this.d + tombola.fudgeFloat(3,voice.f/5000));
            if (voice.v>3) voice.v = (voice.v - 4);
            var t = voice.v;
            if (t>1) t = (1-voice.v);
            vt += (t * (1/vl));
        }

        var signal = [
            (vt + tombola.fudgeFloat(2,0.01)) * (1 + -this.p),
            (vt + tombola.fudgeFloat(2,0.01)) * (1 + this.p)
        ];
        signal = this.lp.process(1 + (5000*this.a),signal);

        input = [
            (input[0] * (1-(this.a * ducking))) + (signal[0] * this.a),
            (input[1] * (1-(this.a * ducking))) + (signal[1] * this.a)
        ];

        if (this.i>=this.l) {
            this.i = -1;
        }
    }

    return input;
};

// FLIPPER //
function FilterFlipper() {
    this.c = 0;
    this.p = 1;
}
FilterFlipper.prototype.process = function(input,rate) {
    this.c += tombola.range(1,20);
    if (this.c>=(sampleRate/rate)) {
        this.c = 0;
        this.p = -this.p;
    }
    return input * this.p;
};


// CHOPPER //
function FilterChopper() {
    this.c = 0;
    this.p = 1;
    this.test = false;
}
FilterChopper.prototype.process = function(rate,depth) {
    this.c++;
    if (this.c>=rate) {
        this.c = 0;
        if (this.p===1) {
            this.p = depth;
        } else {
            this.p = 1;
        }
        this.test = true;
    }
    return this.p;
};


// DOWN SAMPLE //
function FilterDownSample() {
    this.memory = 0;
    this.c = -2;
}
FilterDownSample.prototype.process = function(size,input) {
    this.c ++;
    if (this.c>=size || this.c<0) {
        this.memory = input;
        this.c = 0;
    }
    return this.memory;
};


// LOW PASS //
function FilterLowPass() {
    this.b1 = this.a0 = this.temp = 0;
}
FilterLowPass.prototype.process = function(cutoff,input) {

    var x = Math.exp(-2.0*Math.PI*cutoff/sampleRate);
    this.a0 = 1.0-x;
    this.b1 = -x;

    var out = this.a0*input - this.b1*this.temp;
    this.temp = out;

    return out;
};

// LOW PASS //
function FilterStereoLowPass() {
    this.b1 = this.a0 = this.temp = 0;
    this.b1r = this.a0r = this.tempr = 0;
}
FilterStereoLowPass.prototype.process = function(cutoff,input) {

    var x = Math.exp(-2.0*Math.PI*cutoff/sampleRate);
    this.a0 = this.a0r = 1.0-x;
    this.b1 = this.b1r = -x;

    var l = this.a0*input[0] - this.b1*this.temp;
    this.temp = l;
    var r = this.a0r*input[1] - this.b1r*this.tempr;
    this.temp = r;

    return [l,r];
};


// LOW PASS 2 //
function FilterLowPass2() {
    this.a1 = this.a2 = this.a3 = this.b1 = this.b2 = this.in1 = this.in2 = this.out1 = this.out2 = 0;
}
FilterLowPass2.prototype.process = function(cutoff,res,input) {

    res = valueInRange(res,0.6,1.4);
    var c = 1.0 / Math.tan(Math.PI * cutoff / sampleRate);

    this.a1 = 1.0 / ( 1.0 + res * c + c * c);
    this.a2 = 2* this.a1;
    this.a3 = this.a1;
    this.b1 = 2.0 * ( 1.0 - c*c) * this.a1;
    this.b2 = ( 1.0 - res * c + c * c) * this.a1;

    var out = (this.a1 * input) + (this.a2 * this.in1) + (this.a3 * this.in2) - (this.b1 * this.out1) - (this.b2 * this.out2);

    this.in2 = this.in1;
    this.in1 = input;
    this.out2 = this.out1;
    this.out1 = out;

    return out;
};


//-------------------------------------------------------------------------------------------
//  CONTROLLERS
//-------------------------------------------------------------------------------------------



// LFO //
function LFO() {
    this.p = 0;
}
LFO.prototype.process = function(r) {
    r = r/sampleRate;
    this.p += r;
    if(this.p > 2) this.p -= 4;
    return  this.p*(2-Math.abs(this.p));
};

function Square() {
    this.p = -1;
    this.c = 0;
}
Square.prototype.process = function(r) {
    r = sampleRate/r;
    this.c ++;
    if(this.c > r) {
        this.p = -this.p;
        this.c = 0;
    }
    return  this.p;
};


// WALK //
function Walk() {
    this.p = tombola.rangeFloat(0,2);
    this.v = 0;
}
Walk.prototype.process = function(r,c) {
    this.p += this.v;
    if (this.p<0 || this.p>2) this.v = -this.v;
    if (tombola.chance(1,c)) this.v += (tombola.rangeFloat(-r,r)/sampleRate);
    return this.p-1;
};


// SMOOTH WALK //
function WalkSmooth() {
    this.p = tombola.rangeFloat(-1,1);
    this.v = 0;
    this.v2 = 0;
    this.b = sampleRate*0.5;
}
WalkSmooth.prototype.process = function(r,c) {
    this.v += this.v2;
    this.p += (this.v/sampleRate);
    var b = sampleRate/r;
    if (tombola.chance(1,c)) this.v2 = tombola.rangeFloat(-(r/b),(r/b));
    if (this.p<-0.5 && this.v<0) this.v2 = (r/b);
    if (this.p>0.5 && this.v>0) this.v2 = -(r/b);
    this.v = valueInRange(this.v,-r,r);

    return this.p;
};


// JUMP //
function Jump() {
    this.p = tombola.rangeFloat(-1,1);
}
Jump.prototype.process = function(c) {
    if (tombola.chance(1,c)) this.p = tombola.rangeFloat(-1,1);
    return this.p;
};


// GLIDE //
function Glide() {
    this.p = tombola.rangeFloat(-1,1);
    this.v = tombola.rangeFloat(-1,1)/sampleRate;
}
Glide.prototype.process = function(r,c,d) {
    this.p += this.v;
    if (this.p<-1 || this.p>1 || tombola.chance(1,c) || (d && d>0 && this.v<0) || (d && d<0 && this.v>0)) {
        var mn = -r;
        var mx = r;
        if (d && d>0) mn = 0;
        if (d && d<0) mx = 0;
        this.p = tombola.rangeFloat(-1,1);
        this.v = tombola.rangeFloat(mn,mx)/sampleRate;
    }
    return valueInRange(this.p,-1,1);
};


// TAKEOFF //
// needs work
function Takeoff() {
    this.p = tombola.rangeFloat(-1,1);
    this.v = tombola.rangeFloat(-1,1)/sampleRate;
}
Takeoff.prototype.process = function(r,c,d) {
    this.v += (this.v*(0.0005*r));
    this.p += this.v;
    if (this.p<-1 || this.p>1 || tombola.chance(1,c) || (d && d>0 && this.v<0) || (d && d<0 && this.v>0)) {
        var mn = -r;
        var mx = r;
        if (d && d>0) mn = 0;
        if (d && d<0) mx = 0;
        this.p = tombola.rangeFloat(-1,1);
        this.v = (tombola.rangeFloat(mn,mx)/sampleRate)/1000;
    }
    return valueInRange(this.p,-1,1);
};

function Metallic() {
    var a = [
        0, -0.7, -0.4, -0.6,
        -0.45, -0.1, -0.3, -0.35,
        0.4, 0.6, 0.7, 0.5,
        0.3, 0.2, -0.13, -0.07,
        0, -0.06, -0.12, -0.18

        -0.2, -0.18, -0.1, -0.03,
        0.25, 1, 0, -0.05,
        -0.15, -0.2, -0.25, -0.3,
        -0.32, -0.33, -0.33, -0.32,
        -0.25, -0.2, -0.15, -0.1
    ];
    var b = [
        0, -0.1, -0.2, -0.3,
        0, 0.5, 1, 0.5,
        -0.4, -0.6, -0.7, -0.6,
        -0.4, -0.6, -0.7, -0.8,
        -0.9, -0.6, -0.2, -0.1,

        0, 0.1, 0.2, 0.3,
        0, -0.5, -1, -0.5,
        0.4, 0.6, 0.7, 0.6,
        0.4, 0.6, 0.7, 0.6,
        0.25, 0.2, 0.15, 0.1
    ];
    var c = [
        0, 0.1, -0.05, 0.08,
        -0.12, 0, -0.12, 0,
        -0.15, -0.4, -0.9, -0.95,
        -1, -1, -0.5, -0.4,
        -0.1, -0.3, -0.2, -0.3,
        -0.65, -0.6, -0.7, -0.3,
        -0.1, -0.2, 0, 0.2,
        0.1, 0.2, 0.16, 0.7,
        0.6, 0.3, 0.3, 0.05,
        0.3, 0.6, 1, 0.95,
        0.9, 0.7, 0.8, 0.1
    ];


    this.waveforms = [b, c];
}

function Voice2() {
    var a = [
        0, 0.1, 0, 0.3,
        0.5, 0.4, 0.7, 0.5,
        -0.2, -0.4, -0.3, 0,
        0.4, 0.7, 0.9, 1,
        0.9, 0.7, 0.4, 0.2,

        0, -0.1, 0.2, 0,
        -0.1, -0.2, -0.3, -0.4,
        -0.9, 0.3, -0.2, -0.1,
        0, 0.1, 0.2, 0.1,
        -0.4, -0.5, -0.4, -0.1
    ];
    var b = [
        0, 0.5, 0.55, 0.6,
        0.65, 0.7, 0.75, 0.8,
        0.85, 0.9, 0.95, 1,
        0.8, 0.6, 0.4, 0.2,

        0, -0.5, -0.55, -0.6,
        -0.65, -0.7, -0.75, -0.8,
        -0.85, -0.9, -0.95, -1,
        -0.8, -0.6, -0.4, -0.2
    ];


    this.waveforms = [a, b];
}

function Voice3() {
    var a = [
        0, 1, 0, -1
    ];
    var b = [
        1, -1
    ];

    this.waveforms = [a, b];
}


function valueInRange(value,floor,ceiling) {
    if (value < floor) {
        value = floor;
    }
    if (value> ceiling) {
        value = ceiling;
    }
    return value;
}


module.exports = {
    Voice: Voice,
    VoicePink: VoicePink,
    VoiceBrown: VoiceBrown,
    VoiceWhite: VoiceWhite,
    VoiceCrackle: VoiceCrackle,
    VoiceCracklePeak: VoiceCracklePeak,
    VoiceRoar: VoiceRoar,

    waveTriangle: waveTriangle,
    waveSawtooth: waveSawtooth,
    WavePlayer: WavePlayer,

    filterNoise: filterNoise,
    filterFeedback: filterFeedback,
    filterStereoFeedbackX: filterStereoFeedbackX,
    filterFeedback2: filterFeedback2,
    filterStereoFeedback2X: filterStereoFeedback2X,
    filterReverb: filterReverb,
    filterStereoReverb: filterStereoReverb,
    filterFoldBack: filterFoldBack,
    filterStereoFoldBack: filterStereoFoldBack,
    filterFoldBack2: filterFoldBack2,
    filterStereoFoldBack2: filterStereoFoldBack2,
    filterClipping: filterClipping,
    filterStereoClipping: filterStereoClipping,
    filterClipping2: filterClipping2,
    filterStereoClipping2: filterStereoClipping2,
    filterInvert: filterInvert,
    filterStereoInvert: filterStereoInvert,
    filterErode: filterErode,
    filterStereoErode: filterStereoErode,
    filterStereoPanner: filterStereoPanner,

    PhaseSine: PhaseSine,
    FilterWail: FilterWail,
    FilterResampler: FilterResampler,
    FilterPulse: FilterPulse,
    FilterGrowl: FilterGrowl,
    FilterSubSwell: FilterSubSwell,
    FilterSiren: FilterSiren,

    FilterFlipper: FilterFlipper,
    FilterChopper: FilterChopper,
    FilterDownSample: FilterDownSample,
    FilterLowPass: FilterLowPass,
    FilterStereoLowPass: FilterStereoLowPass,
    FilterLowPass2: FilterLowPass2,

    LFO: LFO,
    Square: Square,
    Walk: Walk,
    WalkSmooth: WalkSmooth,
    Jump: Jump,
    Glide: Glide,
    Takeoff: Takeoff
};