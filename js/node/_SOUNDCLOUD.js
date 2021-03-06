var fs = require('fs');
var FormData = require('form-data');
var fetch = require('node-fetch');
var SC = require('soundcloud-nodejs-api-wrapper');

// this makes the best of two different SoundCloud API wrappers for node, auth is handled by
// 'soundcloud-node-api-wrapper', and track upload is adapted from 'soundcloudnodejs'.
// These methods are implemented in 'action' (_ACTIONS.js)

//-------------------------------------------------------------------------------------------
//  INIT
//-------------------------------------------------------------------------------------------


function SoundCloud() {
    this.sc = null;
    this.client = null;
    this.clientToken = null;
    this.tokenInterval = null;
}
var proto = SoundCloud.prototype;


proto.init = function(credentials,callback) {

    this.sc = new SC(credentials);
    this.client = this.sc.client();
    this.newToken(callback);
    if (opMode===modes.running) {
        this.tokenRefresh();
    }
};


//-------------------------------------------------------------------------------------------
//  NEW TOKEN
//-------------------------------------------------------------------------------------------


proto.newToken = function(callback) {
    var that = this;
    this.client.exchange_token(function(err, result) {

        var access_token = arguments[3].access_token;

        console.log('Full API auth response was:');
        console.log(arguments);

        // we need to create a new client object which will use the access token now
        that.client = that.sc.client({access_token : access_token});
        console.log(access_token);
        that.clientToken = access_token;

        if (callback) {
            callback();
        }
    });
};


//-------------------------------------------------------------------------------------------
//  REFRESH TOKEN PERIODICALLY
//-------------------------------------------------------------------------------------------

// possibly replace this with a non-expiring token, although SoundCloud have removed all
// documentation of this so not sure I trust it over refreshing.

var tokenTime = 1000 * 60 * 60 * 3; // every 3 hours
proto.tokenRefresh = function() {
    var that = this;
    this.tokenInterval = setInterval(function() {that.newToken();},tokenTime);
};
proto.stop = function() {
    clearInterval(this.tokenInterval);
};

//-------------------------------------------------------------------------------------------
//  UPLOAD TRACK
//-------------------------------------------------------------------------------------------


proto.upload = function addTrack(options, callback) {
    var form = new FormData();

    form.append('format', 'json');
    if (!options.title) {
        return callback('Error while addTrack track options.title is required but is null');
    } else {
        form.append('track[title]', options.title);
    }
    if (!options.description) {
        return callback('Error  while addTrack track options.description is required but is null');
    } else {
        form.append('track[description]', options.description);
    }
    if (!options.genre) {
        return callback('Error  while addTrack track options.genre is required but is null');
    } else {
        form.append('track[genre]', options.genre);
    }

    var exist_artwork_data = fs.existsSync(options.artwork_data);
    if (options.artwork_data && exist_artwork_data) {
        form.append('track[artwork_data]', fs.createReadStream(options.artwork_data));
    }

    if (options.tag_list) {
        form.append('track[tag_list]', options.tag_list);
    }

    if (options.license) {
        form.append('track[license]', options.license);
    }

    if (options.sharing) {
        form.append('track[sharing]', options.sharing);
    }

    if (options.downloadable) {
        form.append('track[downloadable]', options.downloadable);
    }

    if (!options.oauth_token) {
        return callback('Error  while addTrack track oauth_token is required but is null');
    } else {
        form.append('oauth_token', options.oauth_token);
    }


    if (!options.asset_data) {
        return callback('Error  while addTrack track options.asset_data is required but is null');
    } else {

        var exist_asset_data = fs.existsSync(options.asset_data);
        //console.log("addTrack, exist_asset_data, ", exist_asset_data);

        if (exist_asset_data) {
            form.append('track[asset_data]', fs.createReadStream(options.asset_data));
        } else {
            return callback('Error addTrack could not find options.asset_data --> fs.createReadStream(options.asset_data): ' + exist_asset_data);
        }
    }

    form.getLength(function (err, length) {

        fetch('https://api.soundcloud.com/tracks', {
            method: 'POST',
            body: form,
            headers: {'content-length': length}
        }).then(function (res) {
            return res.json(); // json?
        }).then(function (json) {
            if (err) {
                console.log(err);
            }
            console.log('soundcloud upload successful');
            callback(null, json);
        });
    });
};


//-------------------------------------------------------------------------------------------
//  DELETE TRACK
//-------------------------------------------------------------------------------------------


proto.delete = function(id,callback) {

    this.client.delete("/tracks/"+id,function(err,result) {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
        }
        callback(err,result);
    });

};


//-------------------------------------------------------------------------------------------
//  CHECK A TRACK'S STATE
//-------------------------------------------------------------------------------------------


proto.status = function(id,callback) {

    this.client.get('/tracks/'+id,function(err,result) {
        if (err) {
            console.log(err);
        } else {
            console.log(result.state);
        }
        if (result) {
            callback(err,result.state);
        } else {
            callback(err);
        }

    });

};



module.exports = SoundCloud;