const express = require("express");
const { stream } = require("../services/twitter");
const router = express.Router();

router.get("/", (req, res) => {
    t = {}
    const tweetEvent = (tweet) => {
        console.log(tweet);
        t = tweet
    }

    stream.on('tweet', tweetEvent)
    
    
    return res.json({
        t
    })
})

module.exports = router