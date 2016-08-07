
//-------------------------------------------------------------------------------------------
//  MAIN
//-------------------------------------------------------------------------------------------

var sampleRate = 44100;

function generateAudio() {

}


function generateWaveform(seed) {

    var gain = 1;

    // AUDIO LENGTH //
    var seconds = tombola.range(15,22);

    console.log(seconds);

    this.printWaveform(seconds);
}

function printWaveform(seconds) {

    var l = sampleRate * seconds;
    var channels = [];
    channels[0] = new Float32Array(l);
    channels[1] = new Float32Array(l);

    var amp = 1;
    var voice = new Voice(60);

    var noise = [];
    noise.push(new VoiceCracklePeak());
    noise.push(tombola.fromArray([new VoiceRoar(), new VoiceCrackle()]));


    var LPL = new FilterLowPass2();
    var LPR = new FilterLowPass2();

    var holdL = new FilterDownSample();
    var holdR = new FilterDownSample();

    var cutoff = 15000;
    var delay = 10;
    var modRoot = tombola.range(1500,7000);
    var modLevel = tombola.rangeFloat(0.05,0.6);
    var hold = 50;
    var foldback = tombola.rangeFloat(0.1,1);
    var clipping = 0.9;
    if (tombola.percent(20)) {
        clipping = tombola.rangeFloat(0.15,0.8);
    }

    var Lfo = new LFO();

    // LOOP THROUGH SAMPLES //
    for (var i=0; i<l; i++) {

        var totalL = 0;
        var totalR = 0;

        // UPDATE FREQUENCY //

        /*if (tombola.chance(1,10000)) {
            voice.frequency = tombola.range(30,300);
        }*/

        //voice.frequency += tombola.fudge(1,1);
        //voice.detune = (Lfo.process(12)*50);
        voice.frequency = this.valueInRange(voice.frequency, 10, 19000);

        if (tombola.chance(1,500)) {
            voice.gain += (tombola.fudge(1, 1))*0.01;
        }
        voice.gain = this.valueInRange(voice.gain, 0, 0.5);


        voice.panning += (tombola.fudge(1,1)*0.005);
        voice.panning = this.valueInRange(voice.panning, -1, 1);


        // UPDATE WAVE SHAPES //
        if (tombola.chance(1,5000)) {
            voice.type = -voice.type;
        }

        if (voice.type===-1) {
            this.waveSawtooth(voice, amp);
        } else {
            this.waveTriangle(voice, amp);
        }


        totalL += ((voice.amplitude * voice.gain) * (1 + (-voice.panning)));
        totalR += ((voice.amplitude * voice.gain) * (1 + voice.panning));


        // BIT CRUSH //
        /*totalL = holdL.process(hold,totalL);
        totalR = holdR.process(hold,totalR);

        if (tombola.chance(1,5000)) {
            hold += tombola.fudge(3, 2);
        }
        hold = this.valueInRange(hold, 10, 150);*/


        if (tombola.chance(1,20000)) {
            var g = noise[1].gain;
            var p = noise[1].panning;
            noise[1] = tombola.fromArray([new VoiceWhite(), new VoiceBrown(), new VoiceRoar(), new VoiceCracklePeak(), new VoiceCrackle()]);
            //noise[1].gain = g;
            noise[1].panning = p;
        }

        for (var h=0; h<noise.length; h++) {
            noise[h].panning += tombola.rangeFloat(-0.005,0.005);
            noise[h].panning = this.valueInRange(noise[h].panning, -1, 1);

            if (tombola.chance(1,500)) {
                noise[h].gain += tombola.rangeFloat(-0.01,0.01);
                noise[h].gain = this.valueInRange(noise[h].gain, 0, 0.4);
            }

            if (noise[h].threshold && h>0 && tombola.chance(1,500)) {
                noise[h].threshold += tombola.rangeFloat(-0.01,0.01);
                noise[h].threshold = this.valueInRange(noise[h].threshold, 0.05, 1);
            }


            var noiseAmp = noise[h].process();
            totalL += (noiseAmp  * (1 + (-noise[h].panning)) );
            totalR += (noiseAmp  * (1 + noise[h].panning) );
        }





        if (tombola.chance(1,500)) {
            delay += (tombola.fudge(3, 2)*0.5);
        }
        delay = this.valueInRange(delay, 5, 5000);

        // FEEDBACK FILTER //
        totalL += filterFeedback(0.6,delay,channels[1],i);
        totalR += filterFeedback(0.6,delay,channels[0],i);

        // LOW PASS FILTER //
        totalL = LPL.process(cutoff,0.6,totalL);
        totalR = LPR.process(cutoff,0.6,totalR);
        if (tombola.chance(1,500)) {
         cutoff += tombola.fudge(4, 15);
         }
         cutoff = this.valueInRange(cutoff, 400, 16000);
        //cutoff = 4000 + (Lfo.process(1)*3000);




        // FEEDBACK FILTER //
        var dt = modRoot + (Lfo.process(1.2)*1500);
        totalL += filterFeedback(modLevel,dt,channels[1],i);
        totalR += filterFeedback(modLevel,dt,channels[0],i);







        // FOLD BACK //
        if (tombola.chance(1,500)) {
            foldback += (tombola.fudge(1, 1)*0.02);
        }
        foldback = this.valueInRange(foldback, 0.05, 1);
        totalL = filterFoldBack(totalL,foldback);
        totalR = filterFoldBack(totalR,foldback);


        // CLIPPER //
        totalL = filterClipper(totalL, clipping, 1);
        totalR = filterClipper(totalR, clipping, 1);

        // REVERB //
        /*totalL += filterReverb(0.8,9,9,channels[1],i);
        totalR += filterReverb(0.8,9,9,channels[0],i);*/


        channels[0][i] = totalL;
        channels[1][i] = totalR;
    }


    // SETUP AND PLAY AUDIO //
    var noiseBuffer = Tone.context.createBuffer(2, l, sampleRate);
    noiseBuffer.copyToChannel(channels[0],0,0);
    noiseBuffer.copyToChannel(channels[1],1,0);
    var noiseSource = Tone.context.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.toMaster();
    noiseSource.start();
}




function Voice(frequency) {
    this.frequency = frequency || 440;
    this.detune = 0;
    this.gain = 0.5;
    this.panning = 0;
    this.amplitude = 0;
    this.polarity = -1;
}



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


//-------------------------------------------------------------------------------------------
//  FILTERS
//-------------------------------------------------------------------------------------------


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


// REVERB //
function filterReverb(level,delay,size,channel,index) {
    var primes = [0, 2, 3, 5, 7, 11, 13, 17, 19, 23, 29];
    var out = 0;
    var r = 1/(size*1.3);
    for (var j=0; j<size; j++) {
        out += filterFeedback(((level) - (r*j))*0.15,delay + (primes[j]),channel,index);
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


// CLIPPING //
function filterClipper(input, threshold, output) {
    return (valueInRange(input, -threshold, threshold) * (1/threshold)) * output;
}


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




function valueInRange(input,floor,ceiling) {
    if (input < floor) {
        input = floor;
    }
    if (input > ceiling) {
        input = ceiling;
    }
    return input;
}

function fmod(a,b) {
    return a % b;
}

