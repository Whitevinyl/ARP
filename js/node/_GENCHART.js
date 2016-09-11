
var utils = require('./lib/utils');
var RGBA = require('./lib/RGBA');
var Tombola = require('tombola');
var tombola = new Tombola();

var Simplex = require('perlin-simplex');
var audio = require('./_AUDIOCOMPONENTS');


// Here we generate all the data for the charts, as well as various meta data tags which
// are used by charts & audio, for tweet text, soundcloud descriptions etc


//-------------------------------------------------------------------------------------------
//  INIT
//-------------------------------------------------------------------------------------------


function Chart() {
    this.scopeStyle = 2;
}

//-------------------------------------------------------------------------------------------
//  WAVEFORM SECTION
//-------------------------------------------------------------------------------------------

Chart.prototype.generateWaveSection = function(length) {

    length = Math.floor(length * sampleRate);

    var channels = [new Float32Array(length),new Float32Array(length)];
    var map = [[],[]];
    var peak = 0;
    var i;


    var LPL = new audio.FilterLowPass2();
    var LPR = new audio.FilterLowPass2();
    var holdL = new audio.FilterDownSample();
    var holdR = new audio.FilterDownSample();
    var resampler = new audio.FilterResampler();

    var sampleMode = tombola.item([1,3]);


    var voices = [new audio.Voice(tombola.rangeFloat(30,70))];
    voices[0].panning = tombola.range(-1,1);

    var vx = tombola.range(0,5);
    for (i=0; i<vx; i++) {
        voices.push(new audio.Voice(tombola.rangeFloat(40, 400)));
        voices[i].panning = tombola.range(-1, 1);
    }


    var delay = tombola.range(20,200);

    var hold = tombola.range(10,200);
    var cutoff = tombola.range(20,2000);
    var noise = tombola.rangeFloat(0.0005,0.005);
    var amp = 1;
    if (tombola.chance(1,5)) {
        amp = tombola.rangeFloat(0.5,1);
    }
    var ampChance = 30000;
    var fold = tombola.chance(1,3);
    var clipping = tombola.chance(1,6);



    // LOOP SAMPLES //
    for (i=0; i<length; i++) {


        var signal = [0, 0];

        // UPDATE VOICE //
        for (var h=0; h<voices.length; h++) {
            if (tombola.chance(1, 500)) {
                voices[h].gain += tombola.fudgeFloat(1, 0.05);
            }
            voices[h].panning += tombola.fudgeFloat(6, 0.005);
            voices[h].gain = utils.valueInRange(voices[h].gain, 0, 0.5);
            voices[h].panning = utils.valueInRange(voices[h].panning, -1, 1);


            // UPDATE VOICE WAVE SHAPES //
            if (tombola.chance(1, 3000)) {
                voices[h].type = -voices[h].type;
            }
            if (voices[h].type === -1) {
                audio.waveSawtooth(voices[h], 1);
            } else {
                audio.waveTriangle(voices[h], 1);
            }
            signal[0] += ((voices[h].amplitude * voices[h].gain) * (1 + (-voices[h].panning)));
            signal[1] += ((voices[h].amplitude * voices[h].gain) * (1 + voices[h].panning));
        }

        // BIT CRUSH //
        signal[0] = holdL.process(hold,signal[0]);
        signal[1] = holdR.process(hold,signal[1]);
        if (tombola.chance(1,100)) {
            hold += tombola.fudge(20, 2);
            hold = utils.valueInRange(hold, 10, 200);
        }


        // FEEDBACK FILTER //
        if (tombola.chance(1,500)) {
            delay += (tombola.fudge(3, 2)*0.5);
        }
        delay = utils.valueInRange(delay, 5, 5000);
        signal = audio.filterStereoFeedbackX(signal,0.6,delay,channels,i);


        // FOLDBACK //
        if (fold) {
            signal[0] = (audio.filterFoldBack(signal[0],0.5)*2);
             signal[1] = (audio.filterFoldBack(signal[1],0.5)*2);
        }
        if (tombola.chance(1,30000)) {
            fold = !fold;
        }

        // CLIPPING //
        if (clipping) {
            signal = audio.filterStereoClipping2(signal,0.7,0.5);
        }
        if (tombola.chance(1,30000)) {
            clipping = !clipping;
        }

        // RESAMPLER //
        signal = resampler.process(signal,sampleMode,20000,channels,i);


        // LOW PASS FILTER //
        signal[0] = LPL.process(cutoff,0.92,signal[0]);
        signal[1] = LPR.process(cutoff,0.92,signal[1]);
        if (tombola.chance(1,200)) {
            cutoff += tombola.fudge(20, 20);
            cutoff = utils.valueInRange(cutoff, 20, 2000);
        }


        signal[0] += audio.filterNoise(noise);
        signal[1] += audio.filterNoise(noise);

        if (tombola.chance(1,ampChance)) {
            if (tombola.chance(1,3)) {
                amp = 1;
            } else {
                amp = tombola.rangeFloat(0.1,1);
                if (amp<0.5) {
                    ampChance = 10000;
                }
            }

        }

        signal[0] *= amp;
        signal[1] *= amp;


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


    // downsample to map //
    var d = tombola.range(300,400);
    peak = 0;
    for (i=0; i<length; i+=d) {
        map[0].push(channels[0][i]);
        map[1].push(channels[1][i]);

        // PEAK //
        ttl = channels[0][i];
        if (ttl<0) { ttl = -ttl; }
        ttr = channels[1][i];
        if (ttr<0) { ttr = -ttr; }

        if (ttl > peak) { peak = ttl; }
        if (ttr > peak) { peak = ttr; }
    }

    // NORMALISE Map//
    mult = 1/peak;
    var mapLength = map[0].length;
    for (i=0; i<mapLength; i++) {
        map[0][i] *= mult;
        map[1][i] *= mult;
    }


    //var map = channels;

    var date = this.generateDate();

    return {
        map: map,
        date: date,
        paragraph: this.generateWaveformParagraph(),
        time: this.generateTime(),
        id: this.generateID(),
        cat: this.generateCat(),
        truncated: tombola.chance(1,5)
    };
};


//-------------------------------------------------------------------------------------------
//  PERIODIC WAVES
//-------------------------------------------------------------------------------------------

Chart.prototype.generatePeriodicWaves = function(n) {

    var waves = [];
    var wavelength = tombola.range(60,90);



    // for each wave //
    for (var i=0; i<n; i++) {

        var id = this.generateID();
        var frequency = [tombola.range(18,4000)];
        if (tombola.chance(2,3)) {
            frequency.push(tombola.range(frequency[0] + 20,frequency[0] + 2000));
        }

        var walk = new audio.WalkSmooth();

        var lfo, lfo2,lfoAmp,lfoAmp2,lfoFreq,lfoFreq2 = null;
        if (tombola.chance(1,8)) {
            lfo = new audio.LFO();
            lfoAmp = tombola.rangeFloat(0.05,0.3);
            lfoFreq = tombola.range(12000,15000);
        }
        if (tombola.chance(1,9)) {
            lfo2 = new audio.LFO();
            lfoAmp2 = tombola.rangeFloat(0.05,0.3);
            lfoFreq2 = tombola.range(22000,29000);
        }


        var signal = [];
        var capping = tombola.chance(1,8);
        var noisy = tombola.chance(1,9);
        var jittery = tombola.chance(3,6);

        var spikeChance = null;
        if (tombola.chance(2,3)) {
            spikeChance = tombola.range(5, 60);
        }

        var shiftChance = null;
        if (tombola.chance(1,2)) {
            shiftChance = tombola.range(25,35);
        }
        if (tombola.chance(1,8)) {
            shiftChance = tombola.range(6,18);
        }

        var jumpChance = null;
        if (tombola.chance(1,5)) {
            jumpChance = tombola.range(40,60);
        }
        if (tombola.chance(1,8)) {
            jumpChance = tombola.range(6,18);
        }

        var peakChance = null;
        if (tombola.chance(3,5)) {
            peakChance = tombola.range(8,30);
        }

        var randomChance = null;
        if (tombola.chance(1,10)) {
            randomChance = tombola.range(10,40);
        }

        var flatChance = null;
        if (tombola.chance(1,6)) {
            flatChance = tombola.range(20,40);
        }
        var flat = 0;

        var baseFreq = tombola.rangeFloat(3500,7500);

        // primary wave //
        for (var j=0; j<wavelength; j++) {
            signal[j] = 0;

            if (shiftChance && tombola.chance(1,shiftChance)) {
                walk.p += tombola.fudgeFloat(5,0.02);
            }
            if (jumpChance && tombola.chance(1,jumpChance)) {
                walk.p = tombola.rangeFloat(-1,1);
            }
            if (walk.p>1) walk.p = 1;
            if (walk.p<-1) walk.p = -1;

            if (flat===0) {
                signal[j] = walk.process(baseFreq + tombola.rangeFloat(-500,500),2)*0.9;
                if (flatChance && tombola.chance(1,flatChance)) {
                    flat = tombola.range(wavelength*0.2,wavelength*0.4);
                }
            } else {
                signal[j] = signal[j-1];
                signal[j] += tombola.fudgeFloat(4,0.01);
                flat -= 1;
            }




            if (lfo) {
                signal[j] += lfo.process(lfoFreq)*lfoAmp;
            }
            if (lfo2) {
                signal[j] += lfo2.process(lfoFreq2)*lfoAmp2;
            }

            if (capping) {
                if (signal[j]>1) signal[j] = 0.9;
                if (signal[j]<-1) signal[j] = -0.9;
            }

        }

        var peak = 0;

        // peaks & noise //
        for (j=0; j<wavelength; j++) {

            // add wide peaks //
            if (peakChance && tombola.chance(1,peakChance)) {
                var w = tombola.range(1,30);
                var p = tombola.fudgeFloat(30,0.1);
                if ((signal+p)>1) p = (1-signal);
                if ((signal+p)<-1) p = (-1+signal);
                signal[j] += p;

                for (var h=1; h<w; h++) {

                    // before peak //
                    if ((j-h) >=0) {
                        signal[j-h] += (p * (1/h));
                        if (signal[j-h]>1) signal[j-h] = 1;
                        if (signal[j-h]<-1) signal[j-h] = -1;
                    }

                    // after peak //
                    if ((j+h) <= (wavelength-1)) {
                        signal[j+h] += (p * (1/h));
                        if (signal[j+h]>1) signal[j+h] = 1;
                        if (signal[j+h]<-1) signal[j+h] = -1;
                    }

                }
            }

            if (spikeChance && tombola.chance(1,spikeChance)) {
                var p2 = tombola.fudgeFloat(30, 0.1);
                if ((signal + p2) > 1) p2 = (1 - signal);
                if ((signal + p2) < -1) p2 = (-1 + signal);
                signal[j] += p2;
            }

            if (randomChance && tombola.chance(1,randomChance)) {
                signal[j] = tombola.rangeFloat(-1,1);
            }

            if (noisy) {
                signal[j] += tombola.rangeFloat(-0.2,0.2);
            }
            if (jittery) {
                signal[j] += tombola.fudgeFloat(30,0.01);
            }

            if (capping) {
                if (signal[j]>1) signal[j] = 1;
                if (signal[j]<-1) signal[j] = -1;
            }

            // PEAK //
            var ttl = signal[j];
            if (ttl<0) { ttl = -ttl; }
            if (ttl > peak) { peak = ttl; }
        }

        // crossover //
        var cIn = tombola.range(2,15);
        var cOut = tombola.range(2,15);

        var pk1 = 0;
        var pk2 = 0;

        var m = 1/peak;

        for (j=0; j<wavelength; j++) {

            // normalise
            signal[j] *= m;

            //fades //
            if (j<cIn) {
                signal[j] *= j/cIn;
            }
            if (j>(wavelength - cOut)) {
                signal[j] *= (wavelength - j)/cOut;
            }

            // get polarity peak //
            if (signal[j]>0 && signal[j]>pk1) pk1 = signal[j];
            if (signal[j]<0 && signal[j]<pk2) pk2 = signal[j];

        }



        // if completely one-sided, do over //
        if (pk1===0 || pk2 ===0) {
            //console.log('re-do: ' + i);
            i--;
            continue;
        }


        // bring up level of weaker side //
        var bm1 = 1;
        var bm2 = 1;
        pk2 = -pk2;

        bm1 = 1/pk1;
        bm2 = 1/pk2;


        //if (balance!==0) {
            for (j=0; j<wavelength; j++) {

                if (signal[j]>0) {
                    signal[j] *= bm1;
                }
                if (signal[j]<0) {
                    signal[j] *= bm2;
                }
            }
        //}


        waves.push({
            map: signal,
            id: id,
            frequency: frequency
        });
    }

    var date = this.generateDate();

    return {
        waves: waves,
        date: date,
        paragraph: 'Periodic waveforms which have been observed in a selection of audio signals received by ARP.',
        received: '' + date.strict + ' to ' + date.strictNext
    };
};


//-------------------------------------------------------------------------------------------
//  VETORSCOPES
//-------------------------------------------------------------------------------------------


Chart.prototype.vectorScope = function(signal,scale) {
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
};

Chart.prototype.vectorScope2 = function(signal,scale) {
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
};

Chart.prototype.vectorScope3 = function(signal,scale) {
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
};

Chart.prototype.vectorScope4 = function(signal,scale) {
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
};

Chart.prototype.vectorScope5 = function(signal,scale) {
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
    if (this.scopeStyle!==2) cp = 1;
    var col = new RGBA(255*cp,255*cp,255*cp,1);

    //color.strokeRGBA(cxa,(255 * cp),(255 * cp),(255 * cp),1);

    // ANGLE
    var angle = (1.5 + c) * Math.PI;
    var x = Math.cos(angle);
    var y = Math.sin(angle);

    return [
        (x * peak) * scale,
        (y * peak) * scale,
        col
    ];
};

Chart.prototype.vectorScope6 = function(signal,scale,n) {
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
};


//-------------------------------------------------------------------------------------------
//  VECTORSCOPE DATA
//-------------------------------------------------------------------------------------------


Chart.prototype.generateScopeData = function(length) {

    var map = [];
    var peak = 0;
    var i;
    var LPL = new audio.FilterLowPass2();
    var LPR = new audio.FilterLowPass2();
    var Lfo = new audio.LFO();


    for (var j=0; j<2; j++) {

        var channels = [new Float32Array(length),new Float32Array(length)];

        var voices = [new audio.Voice(tombola.rangeFloat(30,70))];
        voices[0].panning = tombola.range(-1,1);

        var vx = tombola.range(0,5);
        for (i=0; i<vx; i++) {
            voices.push(new audio.Voice(tombola.rangeFloat(30, 200)));
            voices[i].panning = tombola.range(-1, 1);
        }

        var modRoot = tombola.range(1500,7000);
        var modLevel = tombola.rangeFloat(0.05,0.6);

        var delay = tombola.range(20,100);
        var holdL = new audio.FilterDownSample();
        var holdR = new audio.FilterDownSample();
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
                voices[h].gain = utils.valueInRange(voices[h].gain, 0, 0.5);
                voices[h].panning = utils.valueInRange(voices[h].panning, -1, 1);


                // UPDATE VOICE WAVE SHAPES //
                if (tombola.chance(1, 3000)) {
                    voices[h].type = -voices[h].type;
                }
                if (voices[h].type === -1) {
                    audio.waveSawtooth(voices[h], 1);
                } else {
                    audio.waveTriangle(voices[h], 1);
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
            delay = utils.valueInRange(delay, 5, 5000);
            signal = audio.filterStereoFeedbackX(signal,0.6,delay,channels,i);


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

            signal[0] += audio.filterNoise(noise);
            signal[1] += audio.filterNoise(noise);


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
        map.push(channels);
    }

    // map data is drawn, now construct the json //
    var seconds = this.generateScopeSeconds();

    return {
        map: map,
        seconds: seconds,
        paragraph: this.generateScopeParagraph(seconds),
        date: this.generateDate(),
        time: this.generateTime(),
        id: this.generateID(),
        cat: this.generateCat(),
        truncated: tombola.chance(1,5)
    };
};


//-------------------------------------------------------------------------------------------
//  TIME SPECTRUM DATA
//-------------------------------------------------------------------------------------------


Chart.prototype.generateTimeSpectrum = function(layers,length) {

    // INIT //
    var simplex = new Simplex();
    var jScale = tombola.rangeFloat(length*0.2,length*0.5);
    var iScale = tombola.rangeFloat(layers*0.2,(layers*0.9));

    var map = [];
    var i, j, k;


    // peaks setup //
    var peaks = [];
    var peakNo = 0;
    var cluster = [];
    var clusterI = [];
    var peakLargeLayers = tombola.range(layers*0.1,layers*0.4);

    var peaksLarge = tombola.percent(70);
    if (tombola.percent(63)) {
        peakNo = tombola.range(2,10);
        cluster = tombola.clusterFudge(peakNo,0,length,18,1);

        if (tombola.percent(5)) {
            peakNo = tombola.range(15,30);
            peaksLarge = false;
        } else {
            if (peaksLarge) {
                clusterI = tombola.clusterFudge(peakNo,5,layers-5,10,1);
                cluster = tombola.clusterFudge(peakNo,10,length-10,20,3);

                if (tombola.percent(42)) {
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
    var bandsMod = tombola.percent(85);
    if (tombola.percent(56)) {
        bandsNo = tombola.range(1,6);
        for (i=0; i<bandsNo; i++) {
            bands.push( [tombola.range(0,length), tombola.range(1,30), tombola.rangeFloat(-0.3,0.35)] );
        }
    }

    //spike patch //
    var spikes = [];
    var spikeNo = 0;
    if (tombola.percent(46)) {
        spikeNo = tombola.range(20,200);
        var spikeX = tombola.clusterFudge(spikeNo,0,layers,tombola.range(3,layers+0.5),1);
        var spikeY = tombola.clusterFudge(spikeNo,0,length,tombola.range(4,35),1);

        for (i=0; i<spikeNo; i++) {
            spikes.push( [spikeX[i], spikeY[i], tombola.rangeFloat(0,0.7)] );
        }
    }

    // scream //
    var scream = null;
    if (tombola.percent(46)) {
        scream = [tombola.range(0,length), tombola.rangeFloat(0.01,0.5)];
    }

    // low pass //
    var cutoffLevel = 0;
    var cutoff = tombola.percent(63);
    var cutoffFreq = length;
    if (cutoff) {
        cutoffLevel = tombola.rangeFloat(0.1,0.5);
        cutoffFreq = Math.round(tombola.range(length*0.6,length*0.9));
    }

    // variance //
    var noisy = tombola.percent(28);
    var very = tombola.percent(30);
    var fluct = tombola.percent(30);
    var perlin2 = tombola.percent(25);


    // LOOP LAYERS //
    var fade = tombola.range(25,40);
    for (i=0; i<layers; i++) {

        var signals = [];
        fade += tombola.fudge(3,1);
        var s = tombola.rangeFloat(0,0.3);
        var s2;

        if (cutoff) {
            cutoffFreq += tombola.fudge(20,2);
            cutoffFreq = utils.valueInRange(cutoffFreq,Math.round(length*0.3),length);
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
            s2 = (1 + simplex.noise(i / iScale, j / jScale )) * 0.5;


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
                var per = (1 + simplex.noise( i / (iScale/perScale), j / (jScale/perScale) ) ) * 0.5;
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

                    p[1] = utils.valueInRange(p[1],0,cap);
                    p[0] = utils.valueInRange(p[0],0,length);
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
                    b[1] = utils.valueInRange(b[1],1,length);
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
                scream[1] = utils.valueInRange(scream[1],0.1,0.6);
                scream[0] = utils.valueInRange(scream[0],0,length);
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

                    p[1] = utils.valueInRange(p[1],0,cap);
                    p[0] = utils.valueInRange(p[0],0,length);
                }
            }

            s2 = utils.valueInRange(s2,0,1);
            signals.push(s2 * f);
        }
        map.push(signals);
    }


    // map data is drawn, now construct the json //

    var seconds = this.generateSpectrumSeconds();
    var min = seconds[0];
    var max = seconds[seconds.length-1];

    return {
        map: map,
        seconds: seconds,
        paragraph: this.generateSpectrumParagraph(min,max),
        date: this.generateDate(),
        time: this.generateTime(),
        id: this.generateID(),
        cat: this.generateCat(),
        truncated: tombola.chance(1,5)
    };
};


//-------------------------------------------------------------------------------------------
//  META DATA
//-------------------------------------------------------------------------------------------


Chart.prototype.generateSpectrumSeconds = function() {
    var sec = tombola.range(3,17);
    return [sec, sec+2, sec+4, sec+6, sec+8];
};


Chart.prototype.generateScopeSeconds = function() {
    var a = tombola.range(3,10);
    var b = tombola.range(a+4,a+11);
    return [a, a+tombola.range(2,4), b, b+tombola.range(2,4)];
};


Chart.prototype.generateSpectrumParagraph = function(min,max) {
    var insert = tombola.item(['of ','of an active section of ','of the loudest section of ']);
    return 'Frequency response map ' + insert + 'audio signal between ' + min + ' and ' + max + ' seconds.';
};


Chart.prototype.generateScopeParagraph = function(seconds) {
    var insert = tombola.item(['sections of ','active sections of ','of the clearest sections of ']);
    return 'Images of stereo phase correlation of two ' + insert + 'audio signal at ' + seconds[0] + ' and ' + seconds[2] + ' seconds.';
};


Chart.prototype.generateWaveformParagraph = function() {
    var secs = '';
    if (tombola.chance(2,3)) {
        secs += (tombola.range(50,200)/100) + ' seconds long ';
    }
    var insert = tombola.item(['twice ','three times ','four times ','five times ','six times ']);
    return 'A ' + secs + 'segment of repeated audio which appears ' + insert + 'within the overall recording.';
};


Chart.prototype.generateDate = function() {
    var time = new Date();
    time.setDate(time.getDate()-tombola.range(4,12));
    var d = time.getDate();
    if (d<10) d = '0'+d;
    var m = time.getMonth()+1;
    if (m<10) m = '0'+m;
    var y = time.getFullYear();

    time.setDate(time.getDate()+tombola.range(1,3));
    var d2 = time.getDate();
    if (d2<10) d2 = '0'+d2;
    var m2 = time.getMonth()+1;
    if (m2<10) m2 = '0'+m2;
    var y2 = time.getFullYear();

    return {
        string: 'Received: ' + d + '/' + m + '/' + y,
        strict: '' + d + '/' + m + '/' + y,
        strictNext: '' + d2 + '/' + m2 + '/' + y2
    };

};


Chart.prototype.generateTime = function() {
    var h = tombola.range(0,23);
    var m = tombola.range(0,59);
    var s = tombola.range(0,59);
    if (h<10) h = '0'+h;
    if (m<10) m = '0'+m;
    if (s<10) s = '0'+s;
    var z = ' UTC';

    return {
        string: 'Time: ' + h + ':' + m + ':' + s + z,
        strict: '' + h + ':' + m + ':' + s + z,
        short: '' + h + ':' + m + z
    };

};


Chart.prototype.generateID = function() {
    var n = tombola.range(1000000,9999999);
    return {
        string: 'ID: ' + n,
        strict: '' + n
    };
};


Chart.prototype.generateCat = function() {
    var c = tombola.weightedItem(['A','B','C','D'] , [8,6,3,1]);
    return {
        string: 'cat: ' + c,
        strict: c
    };
};


Chart.prototype.generateFrequency = function() {
    return {
        string: 'centimetre band, 8.92467255 GHz',
        strict: '8.92467255 GHz'
    };
};


Chart.prototype.generateBandWidth = function() {
    var bw = tombola.range(3000,6000)/100;
    return '' + bw + ' Hz';
};


Chart.prototype.generateLevel = function(bad) {
    var l;
    if (bad) {
        l = tombola.range(-30000,-20000)/100;
    } else {
        l = tombola.range(-6500,-2500)/100;
    }

    return '' + l + ' dB';
};


module.exports = Chart;