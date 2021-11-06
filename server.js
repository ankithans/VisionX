const express = require('express')
const app = express()
var axios = require('axios');
require('dotenv').config()
const {getTag} = require("./services/get_media_tweet")
const { stream, replyTweet } = require("./services/twitter");


const streamRoute = require("./routes/search");

const tweetEvent = (tweet) => {
  console.log(tweet);
    // console.log(tweet['in_reply_to_status_id_str']);

    tweet_id = tweet['in_reply_to_status_id_str']
    // no parent; here is the photo
    if(tweet['in_reply_to_status_id_str'] == null) {
      tweet_id = tweet['id_str']
    }
    
    var config = {
        method: 'get',
        url: `https://api.twitter.com/2/tweets?ids=${tweet_id}&expansions=attachments.media_keys&media.fields=type,url`,
        headers: { 
          'Authorization': `Bearer ${process.env.BEARER_TOKEN}`
        }
      };
      
      
      axios(config)
      .then(async (response) => {
        // console.log(JSON.stringify(response.data));
        image = response.data.includes.media[0].url;

        await getTag(image, tweet['id_str'])

      })
      .catch(function (error) {
        console.log(error);
      });
      
}

stream.on('tweet', tweetEvent)



app.get('/', (req, res) => res.json({
    "success": true,
    "message": "welcome to the visonX"
}))

app.use('/api/v1/stream/', streamRoute)

const port = process.env.PORT || 8000

app.listen(port, () => console.log(`server listening at http://localhost:${port}`))