
var utils = require('../../lib/utils');
var Tombola = require('tombola');
var tombola = new Tombola();

// A granular sampler which looks back over previous samples and recycles them, altering
// playback speed etc.
// Lots of experimentation with this so pretty messy, may separate out the operation modes
// to different methods or different components altogether in future.

//-------------------------------------------------------------------------------------------
//  INIT
//-------------------------------------------------------------------------------------------

function Resampler() {
    this.s = 0;
    this.c = 0;
    this.i = -1;
    this.r = 0;
    this.sp = 3;
    this.l = 5000;
    this.m = [0,0];
    this.mc = 0;
}

//-------------------------------------------------------------------------------------------
//  PROCESS
//-------------------------------------------------------------------------------------------

Resampler.prototype.process = function(input,mode,chance,channel,index) {
    var ind;

    if (mode===0) { // GRAIN BURST //
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
    if (mode===1 || mode===2) { // LOOP GRAIN //
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

                if (this.r < 0.0001) { // kill reverse //
                    this.c = 0;
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
                }
            }
        }
    }
    if (mode===3 || mode===5) { // DRAG //
        if (index>5000 && this.i<0 && tombola.chance(1,chance)) {
            this.i = 0;
            this.sp = 0;
            if (mode===5) {
                //this.r = tombola.rangeFloat(-3,3);
            }
            this.l = tombola.range(6000,80000);
            this.s = tombola.range(200,5000);
            this.s = utils.valueInRange(this.s,1,index-1);
            this.mc = 0;
        }

        if (this.i>=0) {

            this.i++;
            var g = 0.9;
            if (mode===3) {
                this.sp += tombola.fudge(18,1);
            } else {
                this.sp = tombola.fudge(10,1);
                //g = 1/Math.ceil((this.i/7)/this.s);
            }
            this.sp = utils.valueInRange(this.sp,-(index-1),this.s-40);

            input = [
                (channel[0][index - this.s + Math.round(this.sp)]) * g,
                (channel[1][index - this.s + Math.round(this.sp)]) * g
            ];

            if ((this.m[0]==input[0] && this.m[1]==input[1])) {
                this.mc++;
            } else {
                this.mc = 0;
            }

            if (this.i > this.l || this.mc>20) {
                this.i = -1;
            }
            this.m = input;
        }
    }
    if (mode===4) { // TIME STRETCH //
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
    if (mode===6) { // REVERSE STRETCH //
        if (index>35500 && this.c<=0 && tombola.chance(1,chance)) {
            this.l = 380;
            this.s = tombola.range(index-5000,index-this.l);
            this.i = 0;
            this.sp = tombola.rangeFloat(-0.05,0.05);
            this.r = tombola.rangeFloat(1,3);
            this.c = tombola.range(90,160);
        }


        if (this.c>0 && this.i>=0) {
            ind = this.s + Math.round(this.i);

            if (ind>1 && ind<index) {

                input =  [
                    (input[0]*0.5) + (channel[0][ind]*0.4),
                    (input[1]*0.5) + (channel[1][ind]*0.4)
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
                    this.s -= Math.floor(this.l/2);
                }

            } else {
                this.c = 0;
                this.i = -1;
            }
        }
    }
    return input;
};

module.exports = Resampler;