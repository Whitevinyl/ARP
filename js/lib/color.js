//-------------------------------------------------------------------------------------------
//  SETUP
//-------------------------------------------------------------------------------------------

function Color() {
    this.master = new RGBA(0,0,0,0);
    this.highPass = new RGBA(0,0,-5,0);
    this.lowPass = new RGBA(0,0,0,0);
}
var color = new Color();



//-------------------------------------------------------------------------------------------
//  PUBLIC FUNCTIONS
//-------------------------------------------------------------------------------------------

Color.prototype.fill = function(ctx,col) {
    ctx.fillStyle = this.processRGBA(col.R,col.G,col.B,col.A);
};

Color.prototype.stroke = function(ctx,col) {
    ctx.strokeStyle = this.processRGBA(col.R,col.G,col.B,col.A);
};

Color.prototype.fillRGBA = function(ctx,r,g,b,a) {
    ctx.fillStyle = this.processRGBA(r,g,b,a);
};

Color.prototype.strokeRGBA = function(ctx,r,g,b,a) {
    ctx.strokeStyle = this.processRGBA(r,g,b,a);
};

Color.prototype.string = function(col) {
    return this.processRGBA(col.R,col.G,col.B,col.A);
};

Color.prototype.darkerColor = function(col,darkness) {
    var r = this.valueInRange(col.R - darkness,0,255);
    var g = this.valueInRange(col.G - darkness,0,255);
    var b = this.valueInRange(col.B - darkness,0,255);
    return new RGBA(r,g,b,col.A);
};

Color.prototype.lighterColor = function(col,lightness) {
    var r = this.valueInRange(col.R + lightness,0,255);
    var g = this.valueInRange(col.G + lightness,0,255);
    var b = this.valueInRange(col.B + lightness,0,255);
    return new RGBA(r,g,b,col.A);
};

//-------------------------------------------------------------------------------------------
//  PROCESSING / NORMALISING
//-------------------------------------------------------------------------------------------


// PASS R G B A //
Color.prototype.processRGBA = function(r,g,b,a) {

    // master color filter //
    var red = Math.round(r + this.master.R);
    var green = Math.round(g + this.master.G);
    var blue = Math.round(b + this.master.B);
    var alpha = a + this.master.A;

    // high & low pass color filters //
    var av = ((red + green + blue) / 3);
    var hp = av/255;
    var lp = 1 - (av/255);
    red += Math.round((this.highPass.R*hp) + (this.lowPass.R*lp));
    green += Math.round((this.highPass.G*hp) + (this.lowPass.G*lp));
    blue += Math.round((this.highPass.B*hp) + (this.lowPass.B*lp));

    // set to string //
    return this.buildColour(red,green,blue,alpha);
};

Color.prototype.buildColour = function(red,green,blue,alpha) {
    // RANGE //
    red = this.valueInRange(red,0,255);
    green = this.valueInRange(green,0,255);
    blue = this.valueInRange(blue,0,255);
    alpha = this.valueInRange(alpha,0,1);
    return "rgba("+red+","+green+","+blue+","+alpha+")";
};

function RGBA( r, g, b, a ) {
    this.R = r;
    this.G = g;
    this.B = b;
    this.A = a;

    this.toString = function() {
        return "rgba("+this.R+","+this.G+","+this.B+",1)";
    };

    this.clone = function () {
        return new RGBA(this.R, this.G, this.B, this.A);
    };
}

//-------------------------------------------------------------------------------------------
//  MATHS
//-------------------------------------------------------------------------------------------


Color.prototype.valueInRange = function(value,floor,ceiling) {
    if (value < floor) {
        value = floor;
    }
    if (value> ceiling) {
        value = ceiling;
    }
    return value;
};

Color.prototype.getLuminosity = function(col) {
    return ((0.299*col.R + 0.587*col.G + 0.114*col.B));
};