const { response } = require("express");
var axios = require("axios");
const vision = require("@google-cloud/vision");
var rgb2hex = require("rgb2hex");
const { v4: uuidv4 } = require("uuid");

const client = new vision.ImageAnnotatorClient({
  keyFilename: "./vision-creds.json",
});
const { replyTweet } = require("./twitter");

const getTag = async (image, id) => {
  console.log(id);
  var data = JSON.stringify({
    records: [
      {
        _id: uuidv4(),
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
    .then(async (response) => {
      console.log(response.data["records"][0]["_objects"]);
      var tags = response.data["records"][0]["_objects"][0]["_tags"];

      var tagsJsonObj = JSON.parse(JSON.stringify(tags));
      console.log(tagsJsonObj);

      var category = tagsJsonObj.hasOwnProperty("Category")
        ? tags["Category"][0]["name"]
        : "";
      var subcategory = tagsJsonObj.hasOwnProperty("Subcategory")
        ? tags["Subcategory"][0]["name"]
        : "";
      var color = tagsJsonObj.hasOwnProperty("Color")
        ? tags["Color"][0]["name"]
        : "White";
      var gender = tagsJsonObj.hasOwnProperty("Gender")
        ? tags["Gender"][0]["name"]
        : "male";
      //   const neckline = response.data['records'][0]['_objects'][0]['_tags']['Neckline'][0]['name']
      //   const sleeves = response.data['records'][0]['_objects'][0]['_tags']['Sleeves'][0]['name']
      //   const material = response.data['records'][0]['_objects'][0]['_tags']['Material'][0]['name']
      //   const style = response.data['records'][0]['_objects'][0]['_tags']['Style'][0]['name']
      //   const age = response.data['records'][0]['_objects'][0]['_tags']['Age'][0]['name']
      //   const design = response.data['records'][0]['_objects'][0]['_tags']['Design'][0]['name']
      //   const top_category = response.data['records'][0]['_objects'][0]['_tags']['Top Category'][0]['name']
      console.log(gender);
      newSubCategory = subcategory.replace(/\s+/g, "-");
      console.log(newSubCategory);
      console.log(color);
      var colorSplit = color.split(" ");
      color = colorSplit[colorSplit.length - 1];

      if (color == "Multicolor") {
      }
      const hex = await detectColour(image);

      const myntra_url = `https://www.myntra.com/${gender}-${newSubCategory}?f=Color%3A${capitalizeFirstLetter(
        color
      )}_${hex}&sort=popularity`;
      console.log(myntra_url);

      replyTweet("Hey we found your product here " + myntra_url, id)
        .then((tweet) => {
          // console.log(`tweet #1 ==>`, tweet)
        })
        .catch((error) => console.log(`error ==>`, error));

      return myntra_url;
    })
    .catch(function (error) {
      console.log(error);
    });
};

const detectColour = async (file_name) => {
  const [result] = await client.imageProperties(file_name);
  red = result.imagePropertiesAnnotation.dominantColors.colors[1].color.red;
  green = result.imagePropertiesAnnotation.dominantColors.colors[1].color.green;
  blue = result.imagePropertiesAnnotation.dominantColors.colors[1].color.blue;
  var hexcode = rgb2hex(`rgba(${red},${green},${blue})`).hex;
  return hexcode.substring(1);
};

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = { getTag };
