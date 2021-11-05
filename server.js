const express = require('express')
const app = express()
var axios = require('axios');
require('dotenv').config()
const {getTag} = require("./services/get_media_tweet")
const { stream, getParentTweet, detectColour } = require("./services/twitter");


const streamRoute = require("./routes/search");

const tweetEvent = (tweet) => {
    console.log(tweet['in_reply_to_status_id_str']);
    
    var config = {
        method: 'get',
        url: `https://api.twitter.com/2/tweets?ids=${tweet['in_reply_to_status_id_str']}&expansions=attachments.media_keys&media.fields=type,url`,
        headers: { 
          'Authorization': `Bearer ${process.env.BEARER_TOKEN}`
        }
      };
      
      
      axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        image = response.data.includes.media[0].url;
        // detectColour(image);
        getTag(image)
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