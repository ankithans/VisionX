const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const getProductsInfo = async (url) => {
  try {
    const { data } = await axios.get(
      // url == "" || url == null
      //   ? "https://www.myntra.com/men-suit-jackets-and-tuxedos?f=Color%3ABlue_273555&sort=popularity"
      //   : url
      "https://www.myntra.com/men-t-shirts?f=Color%3AWhite_e9edf4&sort=popularity"
    );
    const $ = cheerio.load(data);
    var products = [];

    $("script").each((_idx, el) => {
      if (_idx == 11) {
        var jsonString = $(el.children[0]).text().substring(15);
        var cleanJsonString = jsonString.replace("\\", "");
        const pageDataJson = JSON.parse(JSON.stringify(cleanJsonString));
        var filename = uuidv4();
        fs.writeFileSync(`${filename}.json`, pageDataJson);
        fs.readFile(`./${filename}.json`, "utf8", (err, jsonString) => {
          if (err) {
            console.log("File read failed:", err);
            return;
          }
          var jsonData = JSON.parse(jsonString);
          //   console.log(jsonData["searchData"]["results"]["products"]);

          for (
            var i = 0;
            i <
            Object.keys(jsonData["searchData"]["results"]["products"]).length;
            i++
          ) {
            // console.log(jsonData["searchData"]["results"]["products"][i]);
            products[i] = jsonData["searchData"]["results"]["products"][i];
          }

          fs.unlinkSync(`./${filename}.json`);
        });
      }
    });

    return products;
  } catch (error) {
    console.error(error);
    // throw error;

    return [];
  }
};

// const getProductsInfoPromise = async (url) => {
//   return Promise.resolve(getProductsInfo(url));
// };

module.exports = { getProductsInfo };

// getPostTitles().then((postTitles) => console.log(postTitles));
