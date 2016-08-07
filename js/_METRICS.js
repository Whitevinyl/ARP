/**
 * Created by luketwyman on 25/11/2015.
 */

//-------------------------------------------------------------------------------------------
//  METRICS
//-------------------------------------------------------------------------------------------



function metrics() {

    const width = window.innerWidth;
    const height = window.innerHeight;
    const ratio = getPixelRatio();

    canvas.width  = width * ratio;
    canvas.height = height * ratio;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    console.log(width);
    console.log(ratio);

    // UNIT SIZES //
    halfX = Math.round((width * ratio)/2);
    halfY = Math.round((height * ratio)/2);
    fullX = width * ratio;
    fullY = height * ratio;

    // DEVICE CHECK //
    if (fullY>(fullX*1.05)) {
        device = "mobile";
    } else if (fullY>(fullX*0.65)) {
        device = "tablet";
    } else {
        device = "desktop";
    }
    console.log(device);

    var u;

    if (device=="mobile") {

        u = (width * ratio) * 2.6;
        units = (u/1200);

        // TEXT SIZES //
        headerType = Math.round(u/25);
        midType = Math.round(u/80);
        dataType = Math.round(u/100);
        bodyType = Math.round(u/100);
        subType = Math.round(u/90);

    } else {

        u = (height * ratio) * 1.8;
        units = (u/800);

        // TEXT SIZES //
        headerType = Math.round(u/12);
        midType = Math.round(u/65);
        dataType = Math.round(u/82);
        bodyType = Math.round(u/42);
        subType = Math.round(u/90);

    }



    dx = halfX;
    dy = halfY;
}


function getPixelRatio() {
    var ctx = cxa;
    var dpr = window.devicePixelRatio || 1;
    var bsr = ctx.webkitBackingStorePixelRatio ||
        ctx.mozBackingStorePixelRatio ||
        ctx.msBackingStorePixelRatio ||
        ctx.oBackingStorePixelRatio ||
        ctx.backingStorePixelRatio || 1;

    return dpr / bsr;
}