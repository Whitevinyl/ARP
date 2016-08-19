
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
    var Wlk = new Walk();
    var Wlk2 = new WalkSmooth();
    var Wlk3 = new Walk();
    var walkVoice = new WalkSmooth();
    var chop = new FilterChopper();
    var chopRate = 4000;
    var chopDepth = 1;
    var glide = new Glide();
    var takeoff = new Takeoff();
    var flipper = new FilterFlipper();
    var Jmp = new Jump();

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
        if (tombola.chance(1,20000)) {
            var g = noise[1].gain;
            var p = noise[1].panning;
            noise[1] = tombola.item([new VoiceWhite(), new VoiceBrown(), new VoiceRoar(), new VoiceCracklePeak(), new VoiceCrackle()]);
            //noise[1].gain = g;
            noise[1].panning = p;
        }


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




        // FEEDBACK FILTER //
        if (tombola.chance(1,500)) {
            delay += (tombola.fudge(3, 2)*0.5);
        }
        delay = valueInRange(delay, 5, 5000);
        signal[0] += filterFeedback(0.6,delay,channels[1],i);
        signal[1] += filterFeedback(0.6,delay,channels[0],i);


        // FEEDBACK FILTER //
        var dt = modRoot + (Lfo.process(1.2)*1500);
        signal[0] += filterFeedback(modLevel,dt,channels[1],i);
        signal[1] += filterFeedback(modLevel,dt,channels[0],i);


        // FOLDBACK DISTORTION //
        if (fold) {
            if (tombola.chance(1,500)) {
                foldback += (tombola.fudge(1, 1)*0.02);
            }
            foldback = valueInRange(foldback, 0.05, 1);
            signal[0] = filterFoldBack(signal[0],foldback);
            signal[1] = filterFoldBack(signal[1],foldback);
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
            signal[0] += filterReverb(0.5,20,11,channels[1],i);
            signal[1] += filterReverb(0.5,20,11,channels[0],i);
        }


        // CLIPPER //
        //totalL = filterClipper(totalL, clipping, 1);
        //totalR = filterClipper(totalR, clipping, 1);


        // FOLDBACK 2 DISTORTION //
        //totalL = filterFoldBack2(totalL, 0.2, 2);
        //totalR = filterFoldBack2(totalR, 0.2, 2);


        // CLIPPING 2 DISTORTION //
        signal[0] = filterClipping2(signal[0], clipping, 0.2);
        signal[1] = filterClipping2(signal[1], clipping, 0.2);

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

function lissajous(signal,scale,t,d) {
    return [
        scale * Math.sin(((signal[0]*0.2)*(t+d))),
        scale * Math.sin(((signal[1]*0.2)*t))
    ];
}

function vectorScope(signal,scale) {
    var a = signal[0];
    var b = signal[1];
    var arat = 1;
    var brat = 1;
    if (a<0) a = -a;
    if (b<0) b = -b;

    var peak = a;
    if (b>a) {
        peak = b;
        arat = a/b;
    } else {
        brat = b/a;
    }
    var c = (-arat + brat)*0.5;


    // ANGLE
    var angle = (1.5 + c) * Math.PI;
    var x = Math.cos(angle);
    var y = Math.sin(angle);

    return [
        (x * peak) * scale,
        (y * peak) * scale
    ];
}

function vectorScope2(signal,scale) {
    var a = signal[0];
    var b = signal[1];
    var arat = 1;
    var brat = 1;
    if (a<0) a = -a;
    if (b<0) b = -b;

    var peak = a;
    if (b>a) {
        peak = b;
        arat = a/b;
    } else {
        brat = b/a;
    }

    var c = (-arat + brat);
    return [
        c * scale,
        -peak * scale
    ];
}

function vectorScope3(signal,scale) {
    var a = signal[0];
    var b = signal[1];
    if (a<0) a = -a;
    if (b<0) b = -b;

    var peak = a;
    if (b>a) peak = b;

    return [
        signal[1] * scale,
        -peak * scale
    ];
}

function vectorScope4(signal,scale) {
    var a = signal[0];
    var b = signal[1];
    var ba = a;
    var bb = b;
    var arat = 1;
    var brat = 1;

    if (ba<0) ba = -ba;
    if (bb<0) bb = -bb;
    if (bb>ba) {
        arat = ba/bb;
    } else {
        brat = bb/ba;
    }
    var c = (-ba + bb);



    var peak = b;
    if (c>0) {
        peak = a;
    }
    /*if (peak>0 && b>peak) peak = b;
    if (peak<0 && b<peak) peak = b;*/

    return [
        c * scale,
        -peak * scale
    ];
}

function vectorScope5(signal,scale) {
    var a = signal[0];
    var b = signal[1];
    var ba = a;
    var bb = b;
    var arat = 1;
    var brat = 1;
    if (a<0) a = -a;
    if (b<0) b = -b;


    var peak = ba;
    if (peak>0 && bb>peak) peak = bb;
    if (peak<0 && bb<peak) peak = bb;

    if (b>a) {
        arat = a/b;
    } else {
        brat = b/a;
    }
    var c = (-arat + brat)*0.5;
    if (peak<0) c = -c;

    var cp = peak;
    if (cp<0) cp = -cp;
    setRGBA((255 * cp),(255 * cp),(255 * cp),1);

    // ANGLE
    var angle = (1.5 + c) * Math.PI;
    var x = Math.cos(angle);
    var y = Math.sin(angle);

    return [
        (x * peak) * scale,
        (y * peak) * scale
    ];
}

function vectorScope6(signal,scale,n) {
    var a = signal[0];
    var b = signal[1];
    var ba = a;
    var bb = b;
    var arat = 1;
    var brat = 1;

    if (ba<0) ba = -ba;
    if (bb<0) bb = -bb;
    if (bb>ba) {
        arat = ba/bb;
    } else {
        brat = bb/ba;
    }
    var c = (-ba + bb);



    var peak = b;
    if (c>0) {
        peak = a;
    }
    /*if (peak>0 && b>peak) peak = b;
     if (peak<0 && b<peak) peak = b;*/

    return [
        c * scale,
        signal[n] * scale
    ];
}

function generateTimeSpectrum(layers,length) {

    // INIT //
    noise.seed(Math.random());
    var jScale = tombola.rangeFloat(length*0.25,length*0.4);
    var iScale = tombola.rangeFloat(layers*0.4,(layers*0.9));
    var data = [];
    var i, j, k;


    // peaks setup //
    var peaks = [];
    var peakNo = 0;
    var cluster = [];
    var clusterI = [];
    var peakLargeLayers = tombola.range(layers*0.1,layers*0.4);

    var peaksLarge = tombola.percent(70);
    if (tombola.percent(60)) {
        peakNo = tombola.range(2,10);
        cluster = tombola.clusterFudge(peakNo,0,length,18,1);

        if (tombola.percent(4)) {
            peakNo = tombola.range(15,30);
            peaksLarge = false;
        } else {
            if (peaksLarge) {
                clusterI = tombola.clusterFudge(peakNo,5,layers-5,10,1);
                cluster = tombola.clusterFudge(peakNo,10,length-10,20,3);

                if (tombola.percent(40)) {
                    var pn = tombola.range(3,10);
                    peakNo += pn;
                    clusterI = clusterI.concat(tombola.clusterFudge(pn,5,layers-5,10,1));
                    cluster = cluster.concat(tombola.clusterFudge(pn,10,length-10,20,3));
                }
            }
        }
    }

    var drop = 1;
    var dropPeaks = false;

    if (peakNo>0 && tombola.percent(30)) {
        drop = tombola.rangeFloat(0.5,0.7);
        dropPeaks = tombola.percent(33);
    }

    // peaks push //
    for (i=0; i<peakNo; i++) {
        if (peaksLarge) {
            peaks.push([cluster[i], tombola.rangeFloat(0.3,0.6), clusterI[i]]);
        } else {
            peaks.push([cluster[i], tombola.rangeFloat(0,1)]);
        }
    }

    // bands //
    var bands = [];
    var bandsNo = 0;
    var bandsMod = tombola.percent(80);
    if (tombola.percent(40)) {
        bandsNo = tombola.range(1,6);
        for (i=0; i<bandsNo; i++) {
            bands.push( [tombola.range(0,length), tombola.range(1,30), tombola.rangeFloat(-0.28,0.28)] );
        }
    }

    //spike patch //
    var spikes = [];
    var spikeNo = 0;
    if (tombola.percent(40)) {
        console.log('spikes');
        spikeNo = tombola.range(20,200);
        var spikeX = tombola.clusterFudge(spikeNo,0,layers,tombola.range(3,layers+0.5),1);
        var spikeY = tombola.clusterFudge(spikeNo,0,length,tombola.range(4,35),1);

        for (i=0; i<spikeNo; i++) {
            spikes.push( [spikeX[i], spikeY[i], tombola.rangeFloat(0,0.7)] );
        }
    }

    // scream //
    var scream = null;
    if (tombola.percent(35)) {
        scream = [tombola.range(0,length), tombola.rangeFloat(0.01,0.5)];
    }

    // low pass //
    var cutoffLevel = 0;
    var cutoff = tombola.percent(60);
    var cutoffFreq = length;
    if (cutoff) {
        cutoffLevel = tombola.rangeFloat(0.1,0.5);
        cutoffFreq = Math.round(tombola.range(length*0.6,length*0.9));
    }

    // variance //
    var noisy = tombola.percent(25);
    var very = tombola.percent(25);
    var fluct = tombola.percent(28);
    var perlin2 = tombola.percent(22);







    // LOOP LAYERS //
    var fade = tombola.range(25,40);
    for (i=0; i<layers; i++) {

        var signals = [];
        fade += tombola.fudge(3,1);
        var s = tombola.rangeFloat(0,0.3);
        var s2;

        if (cutoff) {
            cutoffFreq += tombola.fudge(20,2);
            cutoffFreq = valueInRange(cutoffFreq,Math.round(length*0.3),length);
        }




        // LOOP FREQUENCIES //

        for (j=0; j<length; j++) {

            // FADES //
            var f = 1;
            if (j<fade) { f = j / fade; }
            if (j>((length-1)-fade)) { f = (((length-1)-j) / fade); }


            // cutoff //
            var c = 1;
            if (cutoff) {
                if (j>((cutoffFreq-1) - (fade*0.5))) { c = cutoffLevel + (((1-cutoffLevel) * ((cutoffFreq-1) - j))/(fade*0.5)) ; }
                if (j>(cutoffFreq-1)) { c = cutoffLevel; }
            }


            // underlying variation //
            s += tombola.fudgeFloat(5,0.05);
            s += tombola.rangeFloat(-0.03,0.03);
            if (tombola.percent(4)) {
                s = tombola.rangeFloat(0.1,1);
            }


            // perlin noise //
            s2 = (1 + noise.simplex2(i / iScale, j / jScale )) * 0.5;

            // erode perlin //
            s2 += tombola.fudgeFloat(4,0.03);
            if (tombola.percent(2)) { // spikes
                s2 += tombola.rangeFloat(-0.1,0.4);
            }
            if (noisy) {
                s2 += tombola.rangeFloat(-0.06,0.06);
                if (very) {
                    s2 += tombola.rangeFloat(-0.2,0.2);
                }
            }


            // combine perlin & underlying //
            s2 += (s*0.15);
            s2 *= 0.869;

            if (fluct) {
                s2 += (s*0.05);
                s2 *= 0.95;
            }

            if (perlin2) {
                var perScale = 3;
                var per = (1 + noise.simplex2( i / (iScale/perScale), j / (jScale/perScale) ) ) * 0.5;
                s2 += (per * 0.2);
                s2 *= 0.8333;
            }


            // drop overall level //
            if (peakNo>0) {
                s2 *= drop;
                if (dropPeaks && tombola.percent(7)) {
                    s2 += tombola.rangeFloat(-0.1,0.7);
                }
            }


            // small peaks //
            var p,cap;

            if (!peaksLarge) {
                for (k=0; k<peaks.length; k++) {
                    p = peaks[k];
                    cap = 0.5;

                    // correct slot //
                    if (j===p[0]) {
                        s2 += p[1];
                    }

                    // adjust peak //
                    p[1] += tombola.fudgeFloat(4,0.05);

                    // move peak //
                    if (tombola.chance(1,4)) {
                        p[0] += tombola.fudge(3,1);
                    }

                    p[1] = valueInRange(p[1],0,cap);
                    p[0] = valueInRange(p[0],0,length);
                }

            }


            // bands //
            for (k=0; k<bandsNo; k++) {
                var b = bands[k];

                var bt = 0;
                if (j>b[0] && j<(b[0]+b[1]) ) {
                    bt += b[2];
                }
                s2 += bt;

                if (j===0 && bandsMod) {
                    b[0] += tombola.fudge(3,1);
                    b[1] += tombola.fudge(3,1);
                    b[1] = valueInRange(b[1],1,length);
                }
            }






            //cutoff
            s2 *= c;




            // spikes //
            var spiked = false;
            for (k=0; k<spikeNo; k++) {
                var sp = spikes[k];

                if (i===sp[0] && j===sp[1] && !spiked) {
                    s2 += sp[2];
                    spiked = true;
                }
            }


            // normalise //
            s2 *= 0.5;

            // scream //
            var sr = 30;

            if (scream && j===0) {
                scream[1] += tombola.fudgeFloat(4,0.1);
                scream[0] += tombola.fudge(20,2);
                scream[1] = valueInRange(scream[1],0.1,0.6);
                scream[0] = valueInRange(scream[0],0,length);
            }

            if (scream && j> (scream[0]-sr) && j<(scream[0]+sr)) {

                // left //
                if (j<scream[0] && j>(scream[0]-sr)) {
                    s2 += (scream[1] * ((1/(scream[0]-j)) * scream[1]));
                }

                // right //
                if (j>scream[0] && j<(scream[0]+sr)) {
                    s2 += (scream[1] * ((1/(j-scream[0])) * scream[1]));
                }

                if (j===scream[0]) {
                    if (!spiked) {
                        s2 += (scream[1]);
                    }
                }
            }

            // large peaks //
            if (peaksLarge) {
                for (k=0; k<peaks.length; k++) {
                    p = peaks[k];

                    cap = 1;
                    // correct layer //
                    var r = 30;
                    var r2 = peakLargeLayers;
                    var lm = 0;

                    // in layer range //
                    if (i> (p[2]-r2) && i<(p[2]+r2)) {

                        // peak this layer //
                        if (i===p[2]) {
                            lm = 1;
                        }
                        // peak after //
                        if (i>p[2] && i<(p[2]+r2)) {
                            lm = ((1 / (i - p[2])) * p[1]);
                        }
                        // peak before //
                        if (i<p[2] && i>(p[2]-r2)) {
                            lm = ((1 / (p[2] - i)) * p[1]);
                        }


                        // sample //
                        if (j===p[0]) {
                            s2 += (p[1] * lm);
                        }
                        if (j<p[0] && j>(p[0]-r)) {
                            s2 += ((p[1] * ((1/(p[0]-j)) * p[1])) * lm);
                        }
                        if (j>p[0] && j<(p[0]+r)) {
                            s2 += ((p[1] * ((1/(j-p[0])) * p[1])) * lm);
                        }

                    }

                    p[1] = valueInRange(p[1],0,cap);
                    p[0] = valueInRange(p[0],0,length);
                }
            }



            s2 = valueInRange(s2,0,1);


            signals.push(s2 * f);

        }
        data.push(signals);
    }
    return data;
}

function generateSpectrumSeconds() {
    var sec = tombola.range(3,17);
    return [sec, sec+2, sec+4, sec+6, sec+8];
}