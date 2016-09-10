function lissajous(signal,scale,t,d) {
    return [
        scale * Math.sin(((signal[0]*0.2)*(t+d))),
        scale * Math.sin(((signal[1]*0.2)*t))
    ];
}


//-------------------------------------------------------------------------------------------
//  VETORSCOPES
//-------------------------------------------------------------------------------------------


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
    if (scopeStyle!==2) cp = 1;
    color.strokeRGBA(cxa,(255 * cp),(255 * cp),(255 * cp),1);

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


//-------------------------------------------------------------------------------------------
//  VECTORSCOPE DATA
//-------------------------------------------------------------------------------------------


function generateScopeData(length) {

    var data = [];
    var peak = 0;
    var i;
    var LPL = new FilterLowPass2();
    var LPR = new FilterLowPass2();
    var Lfo = new LFO();


    for (var j=0; j<2; j++) {

        var channels = [new Float32Array(length),new Float32Array(length)];

        var voices = [new Voice(tombola.rangeFloat(30,70))];
        voices[0].panning = tombola.range(-1,1);

        var vx = tombola.range(0,5);
        for (i=0; i<vx; i++) {
            voices.push(new Voice(tombola.rangeFloat(30, 200)));
            voices[i].panning = tombola.range(-1, 1);
        }

        var modRoot = tombola.range(1500,7000);
        var modLevel = tombola.rangeFloat(0.05,0.6);

        var delay = tombola.range(20,100);
        var holdL = new FilterDownSample();
        var holdR = new FilterDownSample();
        var hold = tombola.range(20,900);
        var cutoff = tombola.range(40,1000);
        var thresh = tombola.rangeFloat(0.6,1);
        var noise = tombola.rangeFloat(0.0005,0.005);

        // LOOP SAMPLES //
        for (i=0; i<length; i++) {

            var signal = [0, 0];

            // UPDATE VOICE //
            for (var h=0; h<voices.length; h++) {
                if (tombola.chance(1, 500)) {
                    voices[h].gain += tombola.fudgeFloat(1, 0.05);
                }
                voices[h].panning += tombola.fudgeFloat(6, 0.005);
                voices[h].gain = valueInRange(voices[h].gain, 0, 0.5);
                voices[h].panning = valueInRange(voices[h].panning, -1, 1);


                // UPDATE VOICE WAVE SHAPES //
                if (tombola.chance(1, 3000)) {
                    voices[h].type = -voices[h].type;
                }
                if (voices[h].type === -1) {
                    waveSawtooth(voices[h], 1);
                } else {
                    waveTriangle(voices[h], 1);
                }
                signal[0] += ((voices[h].amplitude * voices[h].gain) * (1 + (-voices[h].panning)));
                signal[1] += ((voices[h].amplitude * voices[h].gain) * (1 + voices[h].panning));
            }

            // BIT CRUSH //
            signal[0] = holdL.process(hold,signal[0]);
            signal[1] = holdR.process(hold,signal[1]);



            // FEEDBACK FILTER //
            if (tombola.chance(1,500)) {
                delay += (tombola.fudge(3, 2)*0.5);
            }
            delay = valueInRange(delay, 5, 5000);
            signal[0] += filterFeedback(0.6,delay,channels[1],i);
            signal[1] += filterFeedback(0.6,delay,channels[0],i);


            /*signal[0] = filterFoldBack2(signal[0],thresh,0.5);
             signal[1] = filterFoldBack2(signal[1],thresh,0.5);*/

            /*signal[0] = filterFoldBack(signal[0],0.02);
             signal[1] = filterFoldBack(signal[1],0.02);*/

            /*signal[0] = filterInvert(signal[0],0.5);
             signal[1] = filterInvert(signal[1],0.5);*/

            //signal[0] = filterErode(signal[0],100,i);
            //signal[1] = filterErode(signal[1],10,i);

            // FEEDBACK FILTER //
            /*var dt = modRoot + (Lfo.process(1.2)*1500);
             signal[0] += filterFeedback(modLevel,dt,channels[1],i);
             signal[1] += filterFeedback(modLevel,dt,channels[0],i);
             */
            // REVERB //
            /*signal[0] += filterReverb(0.5,20,11,channels[1],i);
             signal[1] += filterReverb(0.5,20,11,channels[0],i);*/


            // LOW PASS FILTER //
            signal[0] = LPL.process(cutoff,0.92,signal[0]);
            signal[1] = LPR.process(cutoff,0.92,signal[1]);

            signal[0] += filterNoise(noise);
            signal[1] += filterNoise(noise);


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
            var ttl = channels[0][i];
            if (ttl<0) { ttl = -ttl; }
            var ttr = channels[1][i];
            if (ttr<0) { ttr = -ttr; }

            if (ttl > peak) { peak = ttl; }
            if (ttr > peak) { peak = ttr; }
        }

        // NORMALISE //
        var mult = 1/peak;
        for (i=0; i<length; i++) {
            channels[0][i] *= mult;
            channels[1][i] *= mult;
        }
        data.push(channels);
    }
    return data;
}


//-------------------------------------------------------------------------------------------
//  TIME SPECTRUM DATA
//-------------------------------------------------------------------------------------------



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
    if (tombola.percent(50)) {
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
