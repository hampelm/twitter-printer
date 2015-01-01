var moment = require('moment');
var Twit = require('twit');
var _ = require('underscore');
var request = require('request');

var settings = {};
settings.consumerKey = process.env.CONSUMER_KEY;
settings.consumerSecret = process.env.CONSUMER_SECRET;
settings.accessToken = process.env.ACCESS_TOKEN;
settings.accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
settings.faxURL = 'https://fax-machine.herokuapp.com/messages';

var T = new Twit({
  consumer_key:         settings.consumerKey,
  consumer_secret:      settings.consumerSecret,
  access_token: settings.accessToken,
  access_token_secret: settings.accessTokenSecret
});

var USERS = ['rethinkdetroit', 'bensheldon', 'nerdishtendency'];

function faxStatus(options) {
  var formData = {
    From: options.from,
    Body: options.body
  };
  request.post({
    url: settings.faxURL,
    formData: formData
  }, function(error, whatever) {
    // console.log(error, whatever);
  });
}

function getStatus(user) {
  T.get('statuses/user_timeline', { screen_name: 'matth' },  function (error, data, response) {
    if(error) {
      console.error(error);
      return;
    }

    _.each(data, function(tweet) {
      var name = tweet.user.name + ' - @' + tweet.user.screen_name;
      var date = moment(tweet.created_at, 'dd MMM DD HH:mm:ss ZZ YYYY', 'en');
      // Awkward date format: Wed Aug 29 17:12:58 +0000 2012

      // faxStatus({
      //   from: name,
      //   body: tweet.text
      // });

      console.log(tweet.text);
      console.log(name);
      console.log(date.format('ddd, hA'));
    });
  });
}

_.each(USERS, getStatus);
