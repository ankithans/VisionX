const Twit = require('twit');
const vision = require('@google-cloud/vision');
var rgb2hex = require('rgb2hex');
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

const client = new vision.ImageAnnotatorClient({
    keyFilename: 'vision-creds.json'
});
const detectColour = async(file_name)=>{
    const [result] = await client.imageProperties(file_name);
    red = result.imagePropertiesAnnotation.dominantColors.colors[1].color.red;
    green = result.imagePropertiesAnnotation.dominantColors.colors[1].color.green;
    blue = result.imagePropertiesAnnotation.dominantColors.colors[1].color.blue;
    console.log(rgb2hex(`rgba(${red},${green},${blue})`).hex);
}
module.exports = {stream, getParentTweet, detectColour}