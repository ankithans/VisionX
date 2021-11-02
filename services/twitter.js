const Twit = require('twit');
const config = require('../config/twitter_config')
const Twitter = new Twit(config)

const stream = Twitter.stream('statuses/filter', { track: [ '#myntra_discover' ] })

const getParentTweet = (id) => {
    Twitter.get("search/tweets", { q: id, count: 1 }, function(err, data ,response) {
        console.log(data);
        console.log("---------")
        console.log(data['statuses'][0]['entities']);
        return data
    })
}


module.exports = {stream, getParentTweet}