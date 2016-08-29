
//-------------------------------------------------------------------------------------------
//  MAIN
//-------------------------------------------------------------------------------------------

// code here is super raw while I'm experimenting, but this will be tidied into methods &
// components which procedurally generate audio and create a stereo .WAV without using
// the web audio API or any other audio processing.

var scopeMode = vectorScope5;
var scopes = [vectorScope,vectorScope2,vectorScope3,vectorScope4,vectorScope5,vectorScope6];
var scopeStyle = 2;


var sampleRate = 44100;
var noiseSource;


function generateAudio() {

}

function genTest(x) {
    var startPerf = performance.now();
    var l = sampleRate*20;
    var i,j;
    var c = 40;

    if (x<halfX) {

        for (i=0; i<l; i++) {
            var signal = [0,0];
            for (j=0; j<c; j++) {
                signal[0] = tombola.range(1,10000);
                signal[1] = tombola.range(1,10000);
            }
        }

    } else {

        for (i=0; i<l; i++) {
            var signal0 = 0;
            var signal1 = 0;
            for (j=0; j<c; j++) {
                signal0 = tombola.range(1,10000);
                signal1 = tombola.range(1,10000);
            }
        }

    }


    // EXECUTION TIME //
    var endPerf = performance.now();
    console.log("Generated in: "+Math.round(endPerf - startPerf)+"ms");
}


function generateWaveform(seed) {

    // AUDIO LENGTH //
    var seconds = tombola.range(19,28);
    console.log(seconds);

    this.printWaveform(seconds);
}

function printWaveform(seconds) {

    var startPerf = performance.now();

    var l = sampleRate * seconds;
    var channels = [new Float32Array(l),new Float32Array(l)];
    var amp = 1;
    var peak = 0;


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

    var noise = [];
    noise.push(new VoiceCracklePeak());
    noise.push(tombola.item([new VoiceRoar(), new VoiceCrackle()]));


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
    var Lfo2 = new LFO();
    var Wlk = new Walk();
    var Wlk2 = new WalkSmooth();
    var Wlk3 = new Walk();
    var Wlk4 = new Walk();
    var walkVoice = new WalkSmooth();
    var chop = new FilterChopper();
    var chopRate = 4000;
    var chopDepth = 1;
    var glide = new Glide();
    var glide2 = new Glide();
    var takeoff = new Takeoff();
    var flipper = new FilterFlipper();
    var Jmp = new Jump();

    var resampler = new FilterResampler();
    var pulse = new FilterPulse();

    // LOOP THROUGH SAMPLES //
    for (var i=0; i<l; i++) {

        var signal = [0,0];


        // UPDATE VOICE //
        if (tombola.chance(1,500)) {
            voice.gain += (tombola.fudge(1, 1))*0.01;
        }
        voice.panning += (tombola.fudge(1,1)*0.005);

        voice.frequency = valueInRange(voice.frequency, 10, 19000);
        voice.gain = valueInRange(voice.gain, 0, 0.5);
        voice.panning = valueInRange(voice.panning, -1, 1);


        // UPDATE VOICE WAVE SHAPES //
        if (tombola.chance(1,5000)) {
            voice.type = -voice.type;
        }
        if (voice.type===-1) {
            waveSawtooth(voice, amp);
        } else {
            waveTriangle(voice, amp);
        }
        signal[0] += ((voice.amplitude * voice.gain) * (1 + (-voice.panning)));
        signal[1] += ((voice.amplitude * voice.gain) * (1 + voice.panning));


        // RUMBLE //
        if (rumble) {
            var wv = walkVoice.process(650,10) * 0.5;
            signal[0] += (wv);
            signal[1] += (wv);
        }


        // BIT CRUSH //
        signal[0] = holdL.process(hold,signal[0]);
        signal[1] = holdR.process(hold,signal[1]);
        if (tombola.chance(1,5000)) {
            hold += tombola.fudge(3, 2);
        }
        hold = valueInRange(hold, 10, 150);


        // NOISE CHANGE //
        /*if (tombola.chance(1,20000)) {
            var g = noise[1].gain;
            var p = noise[1].panning;
            noise[1] = tombola.item([new VoiceWhite(), new VoiceBrown(), new VoiceRoar(), new VoiceCracklePeak(), new VoiceCrackle()]);
            //noise[1].gain = g;
            noise[1].panning = p;
        }*/


        // NOISE LOOP //
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
            signal[0] += (noiseAmp  * (1 + (-noise[h].panning)) );
            signal[1] += (noiseAmp  * (1 + noise[h].panning) );
        }


        // BIT CRUSH //
        /*var hold2 = 10 + (glide2.process(1, 25000)*200);
        signal[0] = holdL.process(hold2,signal[0]);
        signal[1] = holdR.process(hold2,signal[1]);*/


        // PULSE //
        signal = pulse.process(signal,1);

        // RESAMPLER //
        //signal = resampler.process(signal,1,200000,channels,i);

        // FEEDBACK FILTER //
        if (tombola.chance(1,500)) {
            delay += (tombola.fudge(3, 2)*0.5);
        }
        delay = valueInRange(delay, 5, 5000);
        signal = filterStereoFeedbackX(signal,0.6,delay,channels,i);

        // FEEDBACK FILTER //
        var dt = modRoot + (Lfo.process(1.2)*1500);
        signal = filterStereoFeedbackX(signal,modLevel,dt,channels,i);


        // FOLDBACK DISTORTION //
        if (fold) {
            if (tombola.chance(1,500)) {
                foldback += (tombola.fudge(1, 1)*0.02);
            }
            foldback = valueInRange(foldback, 0.05, 1);
            signal = filterStereoFoldBack(signal,foldback);
        }


        // CHOPPER FILTER //
        chopRate = 6000 + (Wlk3.process(1,20000)*5800);
        chopDepth = 1 + (Wlk2.process(3,100));
        if (chopDepth>1) {
            chopDepth = 1;
        }
        var chp = chop.process(chopRate,chopDepth);
        signal[0] *= chp;
        signal[1] *= chp;


        // REVERB //
        if (reverb) {
            signal = filterStereoReverb(signal,0.5,20,11,channels,i);
        }


        // CLIPPER //
        //totalL = filterClipper(totalL, clipping, 1);
        //totalR = filterClipper(totalR, clipping, 1);


        // FOLDBACK 2 DISTORTION //
        //totalL = filterFoldBack2(totalL, 0.2, 2);
        //totalR = filterFoldBack2(totalR, 0.2, 2);


        // CLIPPING 2 DISTORTION //
        signal = filterStereoClipping2(signal,clipping,0.2);




        // RESAMPLER //
        signal = resampler.process(signal,1,200000,channels,i);

        //signal = pulse.process(signal);


        // LOW PASS FILTER //
        signal[0] = LPL.process(cutoff,0.92,signal[0]);
        signal[1] = LPR.process(cutoff,0.92,signal[1]);
        cutoff = 4700 + (Wlk.process(0.2, 30000)*4300);
        if (cutstyle) {
            cutoff = 4700 + (glide.process(1, 30000)*4300);
        }
        //cutoff = 4700 + (Wlk2.process(5, 200)*4300);
        //cutoff = 4700 + (Jmp.process(30000)*4300);
        //cutoff = 4700 + (takeoff.process(0.2, 30000)*4300);


        // FEEDBACK FILTER //
        /*if (i % tombola.range(2,3) === 0) {
            var ndt = 1000 + (glide.process(5, 30000, -1)*995);
            filterFeedback2(totalL, 0.6,ndt,channels[1],i,l);
            filterFeedback2(totalR, 0.6,ndt,channels[0],i,l);
        }*/


        // INVERT DISTORTION //
        /*if (i<(l/2)) {
            totalL = filterInvert(totalL, 0.5);
            totalR = filterInvert(totalR, 0.5);
        }*/


        // ERODE DISTORTION //
        /*totalL = filterErode(totalL,3000,i);
        totalR = filterErode(totalR,3000,i);*/


        // FLIPPER DISTORTION //
        /*var flp = 25 + (glide.process(0.5,20000)*10);
        totalL = flipper.process(totalL,flp);
        totalR = flipper.process(totalR,flp);*/


        // FOLDBACK DISTORTION //
        //totalL = filterFoldBack(totalL,1);
        //totalR = filterFoldBack(totalR,1);


        // PANNER //

        /*if (i>(sampleRate*8)) {
            var panRate = 20 + (Wlk4.process(0.5,26000)*19.8);
            signal = filterStereoPanner(signal,Lfo2.process(panRate));
        }*/


        // WRITE VALUES //
        if (channels[0][i]) {
            channels[0][i] += signal[0];
        } else {
            channels[0][i] = signal[0];
        }
        if (channels[1][i]) {
            channels[1][i] += signal[1];
        } else {
            channels[1][i] = signal[1];
        }


        // PEAK //
        // update highest peak from both channels //
        var ttl = channels[0][i];
        if (ttl<0) { ttl = -ttl; }
        var ttr = channels[1][i];
        if (ttr<0) { ttr = -ttr; }

        if (ttl > peak) { peak = ttl; }
        if (ttr > peak) { peak = ttr; }
    }


    // PASS 2 //
    var mult = 1/peak;
    var lw = units*0.75;

    for (i=0; i<l; i++) {

        // GET VALUES //
        signal[0] = channels[0][i];
        signal[1] = channels[1][i];

        // NORMALISE //
        signal[0] *= mult;
        signal[1] *= mult;

        // FADES //
        var f = 1;
        var fade = 2500;
        if (i<fade) { f = i / fade; }
        if (i>((l-1)-fade)) { f = ((l-1)-i) / fade; }

        // WRITE VALUES //
        channels[0][i] = signal[0] * f;
        channels[1][i] = signal[1] * f;

        // DRAW //
        if (i % 400 == 0) {
            if (signal[0]<0) {signal[0] = -signal[0];}
            if (signal[1]<0) {signal[1] = -signal[1];}
            cxa.fillRect(cx + (sx*i),cy - (he*1.3) - (signal[0] * he),lw,(signal[0] * he)*2);
            cxa.fillRect(cx + (sx*i),cy + (he*1.3) - (signal[1] * he),lw,(signal[1] * he)*2);
        }
    }


    // STEREO VECTORSCOPE //
    //drawVectorScopeChart(channels);


    // TIME SPECTRUM //
    //drawTimeSpectrumChart(generateTimeSpectrum(30,200));

    // SETUP AND PLAY AUDIO //
    var noiseBuffer = Tone.context.createBuffer(2, l, sampleRate);
    noiseBuffer.copyToChannel(channels[0],0,0);
    noiseBuffer.copyToChannel(channels[1],1,0);
    noiseSource = Tone.context.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.toMaster();
    noiseSource.start();

    // EXECUTION TIME //
    var endPerf = performance.now();
    console.log("Generated in: "+Math.round(endPerf - startPerf)+"ms");
}



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

function logValue(minpos,maxpos,minval,maxval,position) {
    var minlval = Math.log(minval);
    var maxlval = Math.log(maxval);
    var scale = (maxlval - minlval) / (maxpos - minpos);
    //console.log("" +minval + " | " +maxval + " | " +position);
    return Math.exp((position - minpos) * scale + minlval);
}

function logPosition(minpos,maxpos,minval,maxval,value) {
    var minlval = Math.log(minval);
    var maxlval = Math.log(maxval);
    var scale = (maxlval - minlval) / (maxpos - minpos);
    //console.log("" +minval + " | " +maxval + " | " +value);
    return minpos + (Math.log(value) - minlval) / scale;
}

function linValue(minpos,maxpos,minval,maxval,position) {
    var scale = (maxval - minval) / (maxpos - minpos);
    //console.log("" +minval + " | " +maxval + " | " +position);
    return (position - minpos) * scale + minval;
}

function linPosition(minpos,maxpos,minval,maxval,value) {
    var scale = (maxval - minval) / (maxpos - minpos);
    //console.log("" +minval + " | " +maxval + " | " +value);
    return minpos + (value - minval) / scale;
}

