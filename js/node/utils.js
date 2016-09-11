function Point( x, y ) {
    this.x = x || 0;
    this.y = y || 0;
}


function Vector( x, y ) {
    this.x = x || 0;
    this.y = y || 0;
}

function logPosition(minpos,maxpos,minval,maxval,value) {
    var minlval = Math.log(minval);
    var maxlval = Math.log(maxval);
    var scale = (maxlval - minlval) / (maxpos - minpos);
    return minpos + (Math.log(value) - minlval) / scale;
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

function stripUriMeta(uri) {
    return uri.split(',')[1];
}

module.exports = {
    Point: Point,
    Vector: Vector,

    logPosition: logPosition,
    valueInRange: valueInRange,
    stripUriMeta: stripUriMeta
};