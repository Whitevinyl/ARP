
var Twit = require('twit');

// Basic twitter API posting using the library twit.

//-------------------------------------------------------------------------------------------
//  INIT
//-------------------------------------------------------------------------------------------


function Twitter() {
    this.T = null;
}

Twitter.prototype.init = function(credentials) {
    this.T = new Twit(credentials);
};

//-------------------------------------------------------------------------------------------
//  POST
//-------------------------------------------------------------------------------------------


Twitter.prototype.post = function(tweet) {

    // upload media //
    if (tweet.media) {
        this.T.post('media/upload', tweet.media, uploaded);

        // callback from media upload //
        var that = this;
        function uploaded(err, data, response) {

            tweetError(err);

            // make the tweet //
            if (!err) {
                var id = data.media_id_string;
                var m = {
                    status: tweet.status,
                    media_ids: [id]
                };
                that.T.post('statuses/update', m, tweeted);
            }
        }
    }

    else {
        var m = {
            status: tweet.status
        };
        this.T.post('statuses/update', m, tweeted);
    }

};

//-------------------------------------------------------------------------------------------
//  CALLBACKS
//-------------------------------------------------------------------------------------------


// generic tweet callback //
function tweeted(err, data, response) {
    tweetError(err);
}


// generic tweet error handle //
function tweetError(err) {
    if (err) {
        console.log('tweet: something went wrong');
        console.log(err);
    } else {
        console.log('tweet: success');
    }
}

module.exports = Twitter;