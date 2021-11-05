const { response } = require("express");
var axios = require("axios");
const vision = require('@google-cloud/vision');
var rgb2hex = require('rgb2hex');
const client = new vision.ImageAnnotatorClient({
  keyFilename: './vision-creds.json'
});
const { replyTweet } = require("./twitter");



const getTag = async (image, id) => {
  var data = JSON.stringify({
    records: [
      {
        _id: "2342",
        _url: image,
        product_id: "unique product string",
        my_category: "customer category",
        product_price: 32.5,
        my_tags: ["one", "two", "three"],
      },
    ],
  });

  var config = {
    method: "post",
    url: "https://api.ximilar.com/tagging/fashion/v2/detect_tags",
    headers: {
      Authorization: `Token ${process.env.FASHION_TOKEN}`,
      "Content-Type": "application/json",
    },
    data: data,
  };

  axios(config)
    .then(async (response) =>{
      // console.log(JSON.stringify(response.data));
      // console.log(response.data['records'][0])
      // console.log("------------------------")
    //   console.log(response.data['records'][0]['_objects'][0]['_tags'])   
      // console.log("------------------------")
      // console.log(response.data['records'][0]['_objects'][0]['_tags'])
      // console.log(response.data['records'][0]['_objects'][0]['_tags']['Category'][0]['name'])
      const category = response.data['records'][0]['_objects'][0]['_tags']['Category'][0]['name']
      const subcategory = response.data['records'][0]['_objects'][0]['_tags']['Subcategory'][0]['name']
      const color = response.data['records'][0]['_objects'][0]['_tags']['Color'][0]['name']
      const gender = response.data['records'][0]['_objects'][0]['_tags']['Gender'][0]['name']
      const neckline = response.data['records'][0]['_objects'][0]['_tags']['Neckline'][0]['name']
      const sleeves = response.data['records'][0]['_objects'][0]['_tags']['Sleeves'][0]['name']
      const material = response.data['records'][0]['_objects'][0]['_tags']['Material'][0]['name']
      const style = response.data['records'][0]['_objects'][0]['_tags']['Style'][0]['name']
      const age = response.data['records'][0]['_objects'][0]['_tags']['Age'][0]['name']
      const design = response.data['records'][0]['_objects'][0]['_tags']['Design'][0]['name']
      const top_category = response.data['records'][0]['_objects'][0]['_tags']['Top Category'][0]['name']

      const hex = await detectColour(image)

      const myntra_url = `https://www.myntra.com/${gender}-${subcategory}?f=Color%3A${capitalizeFirstLetter(color)}_${hex}`
      console.log(myntra_url)

      replyTweet('Hey we found your product here '+myntra_url, id)
      .then(tweet => {

        // console.log(`tweet #1 ==>`, tweet)
      })
      .catch(error => console.log(`error ==>`, error))

      return myntra_url
    })
    .catch(function (error) {
      console.log(error);
    });
};

const detectColour = async(file_name)=>{
  const [result] = await client.imageProperties(file_name);
  red = result.imagePropertiesAnnotation.dominantColors.colors[1].color.red;
  green = result.imagePropertiesAnnotation.dominantColors.colors[1].color.green;
  blue = result.imagePropertiesAnnotation.dominantColors.colors[1].color.blue;
  // console.log(rgb2hex(`rgba(${red},${green},${blue})`).hex);
  var hexcode = rgb2hex(`rgba(${red},${green},${blue})`).hex
  return hexcode.substring(1);
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = { getTag };
