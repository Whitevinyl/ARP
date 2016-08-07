



//-------------------------------------------------------------------------------------------
//  MAIN
//-------------------------------------------------------------------------------------------


function timeInit() {
    // get today's sunlight times for Atacama
    timeNow = new Date();
    atacamaTime = SunCalc.getTimes(timeNow, -23.8, -67.4);

    morningLight = (timeNow > atacamaTime.dawn && timeNow < atacamaTime.goldenHourEnd);
    eveningLight = (timeNow > atacamaTime.goldenHour && timeNow < atacamaTime.nauticalDusk);
    nightTime = (timeNow < atacamaTime.dawn || timeNow > atacamaTime.nauticalDusk);
}


function generateTweet() {

    timeInit();

    //TweetTalk();
    tombola.weightedFunction([ TweetMessages, TweetJourney, TweetObservation, TweetToday, TweetTalk ], [3, 2, 1.5, 1.5, 0.5] );
}


//-------------------------------------------------------------------------------------------
//  TALK
//-------------------------------------------------------------------------------------------

function TweetTalk() {
    var string = "";

    var order = tombola.percent(50);
    var specify = tombola.percent(50);
    var style = tombola.range(0,2);
    var preframe = tombola.percent(50);
    var me = tombola.percent(20);
    var multiple = tombola.percent(20);

    if (preframe) {
        string += tombola.fromArray(LexTalk.frame) + " ";
    }
    if (me) {
        string += tombola.fromArray(LexTalk.me) + " ";
    } else {
        var people = new tombola.deck(['michael', 'sara']);
        string += LexTalk.who[people.draw()][style] + " ";

        if (multiple) {
            if (tombola.percent(70)) {
                string += "and " + LexTalk.who[people.draw()][style] + " ";
            } else {
                string += "and myself ";
            }
            string += tombola.fromArray(LexTalk.multiple) + " ";
        } else {
            string += tombola.fromArray(LexTalk.single) + " ";
        }
    }

    string += tombola.fromArray(LexTalk.doing) + " ";
    string += tombola.fromArray(LexTalk.talk) + " ";

    if (order) {
        string += "at " + tombola.fromArray(LexTalk.at) + " ";
    }

    string += "on ";
    if (tombola.percent(30) || !specify) {
        string += tombola.fromArray(LexTalk.our) + " ";
    }
    if (specify) {
        string += tombola.fromArray(LexTalk.on.a) + " ";
    }
    string += tombola.fromArray(LexTalk.on.b);

    if (!order) {
        string += " at " + tombola.fromArray(LexTalk.at);
    }
    if (!preframe) {
        string += " " + tombola.fromArray(LexTalk.frame);
    }

    conclude(string);
}


//-------------------------------------------------------------------------------------------
//  OBSERVATIONS
//-------------------------------------------------------------------------------------------

function TweetObservation() {

    var functions = [MessageSighting];
    var weights = [1];

    if (nightTime) {
        functions.push(MessageSky);
        weights.push(0.5);
    }
    if (morningLight || eveningLight) {
        functions.push(MessageLight);
        weights.push(0.5);
    }

    tombola.weightedFunction(functions, weights );
}


function MessageLight() {
    var string = "";
    var plural = tombola.weightedItem(['single', 'plural'],[ 1, 0.8 ] );
    var and = tombola.percent(35);
    var order = tombola.percent(50);
    var style = tombola.percent(60);
    var pre = tombola.percent(50);

    if (morningLight) {
        time = 'early';
    } else {
        time = 'late';
    }

    if (order) {
        if (style) {
            string += tombola.fromArray(['this', 'the']) + " ";
            string += tombola.fromArray(LexObservation.light[time].type) + " ";
            string += tombola.fromArray(LexObservation.light[time].light) + " makes ";
        } else {
            string += tombola.fromArray(['in this', 'in the']) + " ";
            string += tombola.fromArray(LexObservation.light[time].type) + " ";
            string += tombola.fromArray(LexObservation.light[time].light) + ", ";
        }
    }
    string += tombola.fromArray(LexObservation.light[plural].thing) + " ";
    if (style && order) {
        string += tombola.fromArray(LexObservation.light.plural.looks) + " ";
    } else {
        string += tombola.fromArray(LexObservation.light[plural].looks) + " ";
    }

    if (pre || !and) {
        string += tombola.fromArray(LexObservation.light.pre) + " ";
    }

    if (and) {
        if (tombola.percent(75) || !pre) {
            string += tombola.fromArray(LexObservation.light.property) + " ";
        }
        string += "and " + tombola.fromArray(LexObservation.light.and);
    } else {
        string += tombola.fromArray(LexObservation.light.property);
        if (order && tombola.percent(35)) {
            string += " in color";
        }
    }

    if (!order) {
        string += " " + tombola.fromArray(['in this', 'in the']) + " ";
        string += tombola.fromArray(LexObservation.light[time].type) + " ";
        string += tombola.fromArray(LexObservation.light[time].light);
    }

    conclude(string);
}

function MessageSighting() {
    var string = "";
    var just = tombola.percent(40);
    var thing = tombola.weightedItem(['eagle', 'fox', 'llama', 'flamingo', 'geese', 'owl', 'lizard', 'chinchilla', 'puma', 'dust'],[ 1, 1, 1, 1, 0.7, 0.8, 0.07, 0.05, 0.05, 1] );
    var order = tombola.percent(55);

    // Just saw first //
    if (just) {
        string += tombola.fromArray(LexObservation.sighting.just) + " ";
    } else {
        // Time frame first //
        if (order) {
            string += tombola.fromArray(LexObservation.sighting.frame) + " ";
        }
        string += tombola.fromArray(LexObservation.sighting.saw) + " ";
    }
    string += tombola.fromArray(LexObservation.sighting.thing[thing].thing) + " ";
    string += tombola.fromArray(LexObservation.sighting.thing[thing].action) + " ";
    string += tombola.fromArray(LexObservation.sighting.place);

    // Time frame last //
    if (!order && !just) {
        string += " " + tombola.fromArray(LexObservation.sighting.frame);
    }

    conclude(string);
}


function MessageSky() {
    var string = "";
    var plural = tombola.weightedItem(['single', 'plural'],[ 1, 1 ] );
    var order = tombola.percent(55);

    // sky first //
    if (order) {
        if (tombola.percent(40)) { string += tombola.fromArray(LexObservation.sky.pre) + " "; }
        string += tombola.fromArray(LexObservation.sky.looking) + " the ";
        string += tombola.fromArray(LexObservation.sky.type) + " ";
        string += tombola.fromArray(LexObservation.sky.sky) + ", ";
    }
    string += tombola.fromArray(LexObservation.sky[plural].object) + " ";
    string += tombola.fromArray(LexObservation.sky[plural].seems) + " ";
    string += tombola.fromArray(LexObservation.sky.appears);

    // sky last //
    if (!order) {
        string += " " + tombola.fromArray(LexObservation.sky.pre) + " ";
        string += tombola.fromArray(LexObservation.sky.looking) + " the ";
        string += tombola.fromArray(LexObservation.sky.type) + " ";
        string += tombola.fromArray(LexObservation.sky.sky);
    }

    conclude(string);
}


//-------------------------------------------------------------------------------------------
//  THE MESSAGES
//-------------------------------------------------------------------------------------------

function TweetMessages() {
    tombola.weightedFunction([ MessageQuality, MessageVoices, MessagePeaks, MessageUpdate ], [10, 1, 3, 1.5] );
}

function MessageUpdate() {
    var string = "";
    var complete = tombola.range(1,4);
    var broken = tombola.range(0,1);
    var poss = tombola.range(0,3);

    if (broken===0 && poss===0) {
        complete = tombola.range(2,4);
    }

    if (tombola.percent(70)) {
        string += "update" + tombola.fromArray([': ',' - ']);
    }
    string += tombola.fromArray(LexMessages.update.in) + " ";
    string += tombola.fromArray(LexMessages.update.frame) + " we've received ";
    string += LexMessages.update.number[complete-1] + " ";
    string += tombola.fromArray(LexMessages.update.confirmed) + " ";
    string += tombola.fromArray(LexMessages.update.messages);
    if (complete>1) {
        string += "s";
    }
    if (broken>0 && poss>0) {
        string += ", ";
    } else {
        if (broken>0 || poss>0) {
            string += " and ";
        }
    }
    if (broken) {
        string += LexMessages.update.number[broken-1] + " ";
        string += tombola.fromArray(LexMessages.update.truncated);
        if (broken>1) {
            string += "s";
        }
        if (poss>0) {
            string += " and ";
        }
    }
    if (poss) {
        string += LexMessages.update.number[poss-1] + " ";
        if (tombola.percent(50)) {
            string += "more ";
        }
        string += tombola.fromArray(LexMessages.update.unconfirmed);
    }

    conclude(string);
}

function MessageVoices() {
    var string = "";
    var preframe = tombola.percent(60);
    var prestudy = tombola.percent(65);

    // Time frame first //
    if (preframe) {
        string += tombola.fromArray(LexMessages.voices.frame) + " ";
    }
    // Studying first/second //
    if (prestudy) {
        string += tombola.fromArray(LexMessages.voices.study) + ", ";
    }
    // Time frame second //
    if (!preframe) {
        string += tombola.fromArray(LexMessages.voices.frame) + " ";
    }
    string += tombola.fromArray(LexMessages.voices.think) + " ";
    string += tombola.fromArray(LexMessages.voices.hear) + " ";
    string += tombola.fromArray(LexMessages.voices.type) + " ";
    string += tombola.fromArray(LexMessages.voices.sound);

    // additional context //
    if (tombola.percent(10)) {
        string += " " + tombola.fromArray(LexMessages.voices.noise);
    }
    // Time frame last //
    if (!prestudy) {
        string += " " + tombola.fromArray(LexMessages.voices.study);
    }

    conclude(string);
}


function MessagePeaks() {
    var string = "";

    // optional intro //
    if (tombola.percent(35)) {
        string += tombola.fromArray(LexMessages.peaks.intro) + " ";
    }

    string += tombola.fromArray(LexMessages.peaks.type) + " ";
    string += tombola.fromArray(LexMessages.peaks.messages) + " ";
    string += tombola.fromArray(LexMessages.peaks.display) + " ";

    // if freq peaks //
    if (tombola.percent(55)) {
        var htz = tombola.rangeArray(600,2400,3);

        // additional description //
        if (tombola.percent(70)) {
            string += tombola.fromArray(LexMessages.peaks.display2) + " "
        }

        // 1 freq //
        string += tombola.fromArray(LexMessages.peaks.frequency) + tombola.fromArray([' at ',' at around ']) + (htz[0]/100) + tombola.fromArray(['Hz','kHz']);

        // more than 1 freq //
        if (tombola.percent(50)) {

            // 3 freqs //
            if (tombola.percent(40)) {
                string += ", " + (htz[1]/100) + tombola.fromArray(['Hz','kHz']);
                string += " and " + (htz[2]/100) + tombola.fromArray(['Hz','kHz']);
            }
            // 2 freqs //
            else {
                string += " and " + (htz[1]/100) + tombola.fromArray(['Hz','kHz']);
            }
        }
    }
    // or some property other than peaks //
    else {
        string += tombola.fromArray(LexMessages.peaks.bridge) + " ";
        string += tombola.fromArray(LexMessages.peaks.property);
    }

    conclude(string);
}


function MessageQuality() {
    var string = "";
    var preframe = tombola.percent(60);
    var order = tombola.percent(70);
    var intro = tombola.percent(40);

    if (order) {

        // optional intro //
        if (intro) {
            string += tombola.fromArray(LexMessages.quality.intro) + " ";
        }

        // message //
        string += tombola.fromArray(LexMessages.quality.quantity) + " of ";
        if (preframe) {
            string += tombola.fromArray(LexMessages.quality.preframe) + " ";
        } else {
            string += "the ";
        }
        string += tombola.fromArray(LexMessages.quality.messages) + " ";
        if (!preframe) {
            string += tombola.fromArray(LexMessages.quality.postframe) + " ";
        }

        // displays //
        string += tombola.fromArray(LexMessages.quality.display.a) + " ";

        // Michael's descriptions... //
        if (!intro && tombola.percent(45)) {
            string += tombola.fromArray(LexMessages.quality.michael.a) + ' "';
            string += tombola.fromArray(LexMessages.quality.michael.b) + " ";
            string += tombola.fromArray(LexMessages.quality.michael.c) + '"';
        }
        else {
            string += tombola.fromArray(LexMessages.quality.display.b) + " ";
            string += tombola.fromArray(LexMessages.quality.display.c);
        }


    } else {

        string += tombola.fromArray(LexMessages.quality.display.d) + " ";
        string += tombola.fromArray(LexMessages.quality.display.b) + " ";
        string += tombola.fromArray(LexMessages.quality.display.c) + " in ";
        string += tombola.fromArray(LexMessages.quality.quantity) + " of ";
        if (preframe) {
            string += tombola.fromArray(LexMessages.quality.preframe) + " ";
        } else {
            string += "the ";
        }
        string += tombola.fromArray(LexMessages.quality.messages);
        if (!preframe) {
            string += " " + tombola.fromArray(LexMessages.quality.postframe);
        }
    }

    conclude(string);
}




//-------------------------------------------------------------------------------------------
//  THE DAY / GENERAL
//-------------------------------------------------------------------------------------------


function TweetToday() {
    var string = "";

    var DECK = new tombola.deck(['a', 'b', 'c', 'd', 'e']);
    var time = tombola.percent(75);
    var timePos = tombola.weightedNumber( [3,1,4] );
    var comment = tombola.percent(55);
    var commentType = tombola.weightedItem(['message'],[1] );
    var subComment = tombola.percent(45);


    if (time && timePos===1) {
        string += "" +   tombola.fromArray(LexToday.time) + " ";
    }
    var obs = tombola.fromArray(LexToday.observation);
    string += "" +  obs  + " ";
    if (time && timePos===2) {
        string += "" +   tombola.fromArray(LexToday.time) + " ";
    }
    string += "" +   tombola.fromArray(LexToday.method) + " ";
    string += "" +   tombola.fromArray(LexToday.description[DECK.draw()]);

    // second description //
    if (!subComment && tombola.percent(25) && obs.length<19) {
        string += tombola.weightedItem([' and ', ' & ', '/', ', and also ', ', ', ', but also ', ', and I guess '], [1,1,0.5,1,0.5,1,1] ) ;
        string += "" + tombola.fromArray(LexToday.description[DECK.draw()]);
    }

    if (time && timePos===3) {
        string += " " +   tombola.fromArray(LexToday.time);
    }

    if (comment) {
        // pause grammar //
        string += ". ";

        if (subComment && LexToday.comment[commentType].pre) {
            // sub comment //
            string += tombola.fromArray(LexToday.comment[commentType].pre.a) + " ";
            string += tombola.fromArray(LexToday.comment[commentType].pre.b) + " ";
            string += tombola.fromArray(LexToday.comment[commentType].pre.c) + ". ";
        }

        // comment //
        string += tombola.fromArray(LexToday.comment[commentType].a) + " ";
        string += tombola.fromArray(LexToday.comment[commentType].b);
    }

    conclude(string);
}



//-------------------------------------------------------------------------------------------
//  A JOURNEY
//-------------------------------------------------------------------------------------------

function TweetJourney() {
    var string = "";

    var tense = tombola.weightedItem(['past','present','future'],[6,1,3]);
    var order = tombola.weightedNumber([2,1]);
    var context = tombola.percent(70);
    var destination = tombola.weightedItem(['volcanic', 'salt', 'water', 'rocky', 'urban', 'hills', 'geyser', 'lava', 'life', 'abandoned', 'mines', 'observatory'],[25,17,17,12,10,10,6,6,6,3,3,3]);
    var comment = tombola.percent(98);
    var commentType = tombola.weightedItem(['witness','observation','area','feeling','thinking','learned'],[tense=='past',1,1,0.3,(tense!=='past')*0.2,tense=='past'] );

    // pre context //
    if (order===1 && context) {
        string += "" + tombola.fromArray(LexTravel.travel[tense].context) + " " + LexTravel.travel[tense].reference +" ";
    } else {
        if (tombola.percent(60)) {
            string += "" + LexTravel.travel[tense].reference +" ";
        }
    }

    // travel //
    string += "" + tombola.fromArray(LexTravel.travel[tense].travel) + " ";

    // place //
    string += "" + tombola.fromArray(LexTravel.places[destination]);

    // post context //
    if (order===2 && context) {
        string += " " + tombola.fromArray(LexTravel.travel[tense].context);
    }

    if (comment || !context) {
        // pause grammar //
        string += tombola.weightedItem(['. ',', ',' - '],[5,3,1]);

        // comment //
        string += tombola.fromArray(LexTravel.comment[commentType].a) + " ";
        string += tombola.fromArray(LexTravel.comment[commentType].b);
    }

    conclude(string);
}

//-------------------------------------------------------------------------------------------
//  UTIL
//-------------------------------------------------------------------------------------------

function conclude(string) {
    string += ".";
    string = capitalize(string);
    console.log(string);
    console.log(string.length);
}