var axios = require("axios");
const vision = require("@google-cloud/vision");
var rgb2hex = require("rgb2hex");
var namer = require("color-namer");
const { v4: uuidv4 } = require("uuid");

const client = new vision.ImageAnnotatorClient({
  keyFilename: "./vision-creds.json",
});
const { replyTweet } = require("./twitter");
// const { getProductsInfo } = require("./scrap");
var result = {};
var tagsJsonObj = {};

const getTag = async (image, id, username) => {
  try {
    var { tagsJson, detectColorResponse } = Promise.all([
      (tagsJsonObj = await ximilarTags(image)),
      ([result] = await client.imageProperties(image)),
    ]);

    // console.log(detectColorResponse);
    red = result.imagePropertiesAnnotation.dominantColors.colors[1].color.red;
    green =
      result.imagePropertiesAnnotation.dominantColors.colors[1].color.green;
    blue = result.imagePropertiesAnnotation.dominantColors.colors[1].color.blue;
    var hexcode = rgb2hex(`rgba(${red},${green},${blue})`).hex;
    var hex = hexcode.substring(1);
    var color = namer(hexcode).basic[0].name;
    console.log(color);
    console.log(hex);

    var subcategory = tagsJsonObj.hasOwnProperty("Subcategory")
      ? tagsJsonObj["Subcategory"][0]["name"]
      : "";
    subcategory = subcategory.replace(/\s+/g, "-");
    var gender = tagsJsonObj.hasOwnProperty("Gender")
      ? tagsJsonObj["Gender"][0]["name"]
      : "male";
    console.log(gender);
    var myntra_url = `https://www.myntra.com/${gender}-${subcategory}?f=Color%3A${capitalizeFirstLetter(
      color
    )}_${hex}&sort=popularity`;
    console.log(myntra_url);

    r = await replyTweet(
      "@" +
        username +
        " Look at your perfect match here " +
        myntra_url +
        " \nPlease check your notifications for specific products information.",
      id,
      username,
      myntra_url
    );

    return myntra_url;
  } catch (error) {
    console.log(error);
  }
};

const ximilarTags = async (image) => {
  var ximilarRequestData = JSON.stringify({
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

  var XimilarAxiosConfig = {
    method: "post",
    url: "https://api.ximilar.com/tagging/fashion/v2/detect_tags",
    headers: {
      Authorization: `Token ${process.env.FASHION_TOKEN}`,
      "Content-Type": "application/json",
    },
    data: ximilarRequestData,
  };

  var response = await axios(XimilarAxiosConfig);
  var tags = response.data["records"][0]["_objects"][0]["_tags"];
  var tagsJsonObj = JSON.parse(JSON.stringify(tags));

  return tagsJsonObj;
};

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = { getTag };
