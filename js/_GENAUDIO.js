
//-------------------------------------------------------------------------------------------
//  MAIN
//-------------------------------------------------------------------------------------------

// code here is super raw while I'm experimenting, but this will be tidied into methods &
// components which procedurally generate audio and create a stereo .WAV without using
// the web audio API or any other audio processing.




var sampleRate = 44100;
var noiseSource;

function generateAudio() {

}




function generateWaveform(seed) {

    // AUDIO LENGTH //
    var seconds = tombola.range(19,28);
    console.log(seconds);

    this.printWaveform(seconds);
}

function printWaveform(seconds) {

    var l = sampleRate * seconds;
    var channels = [];
    channels[0] = new Float32Array(l);
    channels[1] = new Float32Array(l);
    var amp = 1;
    var peak = 0;
    var peak2 = 0;


    // draw //
    var w = 600*units;
    var he = 40*units;
    var cx = halfX - (w*0.5);
    var cy = halfY;
    var sx = w/l;
    setColor(bgCols[0]);
    cxa.fillRect(0,0,fullX,fullY);
    setRGBA(255,255,255,1);


    // voices //
    var voice = new Voice(tombola.rangeFloat(40,70));
    var voice2 = new Voice(tombola.rangeFloat(80,200));
    var v2f = 1000;

    var noise = [];
    noise.push(new VoiceCracklePeak());
    noise.push(tombola.fromArray([new VoiceRoar(), new VoiceCrackle()]));


    var LPL = new FilterLowPass2();
    var LPR = new FilterLowPass2();

    var holdL = new FilterDownSample();
    var holdR = new FilterDownSample();

    var cutoff = 8000;
    var cutstyle = tombola.chance(1,5);
    var delay = 10;
    var modRoot = tombola.range(1500,7000);
    var modLevel = tombola.rangeFloat(0.05,0.6);
    var hold = 50;
    var foldback = tombola.rangeFloat(0.2,1);
    var clipping = 0.9;
    if (tombola.percent(20)) {
        clipping = tombola.rangeFloat(0.4,0.9);
    }
    var reverb = tombola.percent(40);
    var fold = tombola.chance(1,3);
    var rumble = tombola.percent(30);

    var Lfo = new LFO();
    var Wlk = new Walk();
    var Wlk2 = new WalkSmooth();
    var Wlk3 = new Walk();
    //var Jmp = new Jump();
    var walkVoice = new WalkSmooth();
    var chop = new FilterChopper();
    var chopRate = 4000;
    var chopDepth = 1;
    var glide = new Glide();
    var takeoff = new Takeoff();
    var flipper = new FilterFlipper();

    // LOOP THROUGH SAMPLES //
    for (var i=0; i<l; i++) {

        var totalL = 0;
        var totalR = 0;

        // UPDATE FREQUENCY //


        //voice.detune = (Lfo.process(12)*50);
        voice.frequency = valueInRange(voice.frequency, 10, 19000);

        if (tombola.chance(1,500)) {
            voice.gain += (tombola.fudge(1, 1))*0.01;
        }
        voice.gain = valueInRange(voice.gain, 0, 0.5);


        voice.panning += (tombola.fudge(1,1)*0.005);
        voice.panning = valueInRange(voice.panning, -1, 1);


        // UPDATE WAVE SHAPES //
        if (tombola.chance(1,5000)) {
            voice.type = -voice.type;
        }

        if (voice.type===-1) {
            waveSawtooth(voice, amp);
        } else {
            waveTriangle(voice, amp);
        }


        totalL += ((voice.amplitude * voice.gain) * (1 + (-voice.panning)));
        totalR += ((voice.amplitude * voice.gain) * (1 + voice.panning));

        // RUMBLE //
        if (rumble) {
            var wv = walkVoice.process(650,10);
            totalL += (wv * 0.5);
            totalR += (wv * 0.5);
        }


        // BIT CRUSH //
        totalL = holdL.process(hold,totalL);
        totalR = holdR.process(hold,totalR);

        if (tombola.chance(1,5000)) {
            hold += tombola.fudge(3, 2);
        }
        hold = valueInRange(hold, 10, 150);


        if (tombola.chance(1,20000)) {
            var g = noise[1].gain;
            var p = noise[1].panning;
            noise[1] = tombola.fromArray([new VoiceWhite(), new VoiceBrown(), new VoiceRoar(), new VoiceCracklePeak(), new VoiceCrackle()]);
            //noise[1].gain = g;
            noise[1].panning = p;
        }

        for (var h=1; h<noise.length; h++) {
            noise[h].panning += tombola.rangeFloat(-0.005,0.005);
            noise[h].panning = valueInRange(noise[h].panning, -1, 1);

            if (tombola.chance(1,500)) {
                noise[h].gain += tombola.rangeFloat(-0.01,0.01);
                noise[h].gain = valueInRange(noise[h].gain, 0, 0.4);
            }

            if (noise[h].threshold && h>0 && tombola.chance(1,500)) {
                noise[h].threshold += tombola.rangeFloat(-0.01,0.01);
                noise[h].threshold = valueInRange(noise[h].threshold, 0.05, 1);
            }


            var noiseAmp = noise[h].process();
            totalL += (noiseAmp  * (1 + (-noise[h].panning)) );
            totalR += (noiseAmp  * (1 + noise[h].panning) );
        }





        if (tombola.chance(1,500)) {
            delay += (tombola.fudge(3, 2)*0.5);
        }
        delay = valueInRange(delay, 5, 5000);

        // FEEDBACK FILTER //
        totalL += filterFeedback(0.6,delay,channels[1],i);
        totalR += filterFeedback(0.6,delay,channels[0],i);






        // FEEDBACK FILTER //
        var dt = modRoot + (Lfo.process(1.2)*1500);
        totalL += filterFeedback(modLevel,dt,channels[1],i);
        totalR += filterFeedback(modLevel,dt,channels[0],i);







        // FOLD BACK //
        if (fold) {
            if (tombola.chance(1,500)) {
                foldback += (tombola.fudge(1, 1)*0.02);
            }
            foldback = valueInRange(foldback, 0.05, 1);
            totalL = filterFoldBack(totalL,foldback);
            totalR = filterFoldBack(totalR,foldback);
        }


        chopRate = 6000 + (Wlk3.process(1,20000)*5800);
        chopDepth = 1 + (Wlk2.process(3,100));
        if (chopDepth>1) {
            chopDepth = 1;
        }
        var chp = chop.process(chopRate,chopDepth);
        totalL *= chp;
        totalR *= chp;





        // REVERB //
        if (reverb) {
            totalL += filterReverb(0.5,20,11,channels[1],i);
            totalR += filterReverb(0.5,20,11,channels[0],i);
        }



        // CLIPPER //
        //totalL = filterClipper(totalL, clipping, 1);
        //totalR = filterClipper(totalR, clipping, 1);

        //totalL = filterFoldBack2(totalL, 0.2, 2);
        //totalR = filterFoldBack2(totalR, 0.2, 2);

        totalL = filterClipping2(totalL, clipping, 0.2);
        totalR = filterClipping2(totalR, clipping, 0.2);

        // LOW PASS FILTER //
        totalL = LPL.process(cutoff,0.9,totalL);
        totalR = LPR.process(cutoff,0.9,totalR);
        /*if (tombola.chance(1,500)) {
            cutoff += tombola.fudge(4, 30);
        }
        cutoff = this.valueInRange(cutoff, 400, 9000);
        */
        cutoff = 4700 + (Wlk.process(0.2, 30000)*4300);
        //cutoff = 4700 + (Wlk2.process(5, 200)*4300);
        //cutoff = 4700 + (Jmp.process(30000)*4300);
        if (cutstyle) {
            cutoff = 4700 + (glide.process(1, 30000)*4300);
        }
        //cutoff = 4700 + (takeoff.process(0.2, 30000)*4300);


        // FEEDBACK FILTER //
        /*if (i % tombola.range(2,3) === 0) {
            var ndt = 1000 + (glide.process(5, 30000, -1)*995);
            filterFeedback2(totalL, 0.6,ndt,channels[1],i,l);
            filterFeedback2(totalR, 0.6,ndt,channels[0],i,l);
        }*/


        /*if (i<(l/2)) {
            totalL = filterInvert(totalL, 0.5);
            totalR = filterInvert(totalR, 0.5);
        }*/

        //voice2.frequency = 80 + (glide.process(1, 30000));
        /*voice2.frequency = (80*2) + (Lfo.process(1.2)*10);
        waveArc3(voice2, amp, i);
        //waveSawtooth(voice2, amp);
        totalL *= 0.1;
        totalR *= 0.1;

        totalL += ((voice2.amplitude * voice2.gain) * (1 + (-voice2.panning)));
        totalR += ((voice2.amplitude * voice2.gain) * (1 + voice2.panning));*/


        /*totalL = filterErode(totalL,3000,i);
        totalR = filterErode(totalR,3000,i);*/

        /*var flp = 25 + (glide.process(0.5,20000)*10);
        totalL = flipper.process(totalL,flp);
        totalR = flipper.process(totalR,flp);*/

        // BRICKWALL //
        //totalL = valueInRange(totalL,-1,1);
        //totalR = valueInRange(totalR,-1,1);

        //totalL = filterFoldBack(totalL,1);
        //totalR = filterFoldBack(totalR,1);


        if (channels[0][i]) {
            channels[0][i] += totalL;
        } else {
            channels[0][i] = totalL;
        }
        if (channels[1][i]) {
            channels[1][i] += totalR;
        } else {
            channels[1][i] = totalR;
        }

        // PEAK //
        var ttl = channels[0][i];
        if (ttl<0) {
            ttl = -ttl;
        }
        var ttr = channels[1][i];
        if (ttr<0) {
            ttr = -ttr;
        }

        if (ttl > peak) {
            peak = ttl;
        }
        if (ttr > peak) {
            peak = ttr;
        }



    }


    // PASS 2 //
    var mult = 1/peak;

    // LOOP THROUGH SAMPLES //
    for (i=0; i<l; i++) {

        totalL = channels[0][i];
        totalR = channels[1][i];

        // NORMALISE //
        totalL *= mult;
        totalR *= mult;

        // FADES //
        var f = 1;
        var fade = 2500;
        if (i<fade) {
            f = i / fade;
        }
        if (i>((l-1)-fade)) {
            f = ((l-1)-i) / fade;
        }


        channels[0][i] = totalL * f;
        channels[1][i] = totalR * f;


        // draw //
        if (i % 400 == 0) {
            if (totalL<0) {totalL = -totalL;}
            if (totalR<0) {totalR = -totalR;}

            cxa.fillRect(cx + (sx*i),cy - (he*1.3) - (totalL * he),units*0.75,(totalL * he)*2);
            cxa.fillRect(cx + (sx*i),cy + (he*1.3) - (totalR * he),units*0.75,(totalR * he)*2);
        }
    }

    console.log(peak);


    // SETUP AND PLAY AUDIO //
    var noiseBuffer = Tone.context.createBuffer(2, l, sampleRate);
    noiseBuffer.copyToChannel(channels[0],0,0);
    noiseBuffer.copyToChannel(channels[1],1,0);
    noiseSource = Tone.context.createBufferSource();
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

function waveArc(voice, amp, i) {
    var x = (sampleRate/voice.frequency);
    var a = x * Math.floor((i/sampleRate)*voice.frequency);
    voice.amplitude = (1 - ( Math.sqrt(Math.pow(x,2) - Math.pow(i-a,2)) / (x/2) )) * amp;
}

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

    //if (input<0) input = -input;

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

//-------------------------------------------------------------------------------------------
//  MATHS
//-------------------------------------------------------------------------------------------


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

