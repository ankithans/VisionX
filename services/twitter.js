const Twit = require('twit');
const config = require('../config/twitter_config')
const Twitter = new Twit(config)

const stream = Twitter.stream('statuses/filter', { track: [ '#myntra_discover' ] })

const getParentTweet = (id) => {
    Twitter.get("search/tweets", { q: id, count: 1 }, function(err, data ,response) {
        // console.log(data);
        // console.log("---------")
        // console.log(data['statuses'][0]['entities']);
        return data
    })
}

const replyTweet = (status, in_reply_to_status_id) =>
  Twitter.post('statuses/update', {
    status,
    in_reply_to_status_id,
    username: '@',
  })

module.exports = {stream, getParentTweet, replyTweet}