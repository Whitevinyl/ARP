
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
    return (tombola.range(-level,level)/100);
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
        input = Math.abs(Math.abs(this.fmod(input - threshold, threshold*4)) - threshold*2) - threshold;
    }
    return input;
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


// CLIPPING //
function filterClipper(input, threshold, output) {
    return (valueInRange(input, -threshold, threshold) * (1/threshold)) * output;
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


// ERODE ? //
function filterErode (input,width,index) {
    if (index % tombola.range(1,width)===0) {
        //input *= tombola.rangeFloat(0.85,0.95);
        input = -input;
    }
    return input;
}



// PERSISTENT FILTERS //
////////////////////////


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
