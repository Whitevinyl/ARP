var fs = require('fs');
var FormData = require('form-data');
var fetch = require('node-fetch');
var SC = require('soundcloud-nodejs-api-wrapper');



//-------------------------------------------------------------------------------------------
//  SOUNDCLOUD HELLO WORLD
//-------------------------------------------------------------------------------------------


function SoundCloud() {
    this.client = null;
    this.clientToken = null;
}

SoundCloud.prototype.init = function(credentials,callback) {

    var sc = new SC(credentials);
    this.client = sc.client();

    var that = this;
    this.client.exchange_token(function(err, result) {

        var access_token = arguments[3].access_token;

        console.log('Full API auth response was:');
        console.log(arguments);

        // we need to create a new client object which will use the access token now
        that.client = sc.client({access_token : access_token});
        console.log(access_token);
        that.clientToken = access_token;

        callback();
    });
};




SoundCloud.prototype.upload = function addTrack(options, callback) {
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
    if (exist_artwork_data) {
        form.append('track[artwork_data]', fs.createReadStream(options.artwork_data));
    }

    if (options.tag_list) {
        form.append('track[tag_list]', options.tag_list);
    }

    form.append('track[sharing]', options.sharing);

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
            console.log('soundcloud upload successful');
            callback(null, json);
        });
    });
};

module.exports = SoundCloud;