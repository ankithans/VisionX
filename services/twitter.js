const Twit = require("twit");
const config = require("../config/twitter_config");
const Twitter = new Twit(config);
const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const stream = Twitter.stream("statuses/filter", {
  track: ["#myntra_discover"],
});

const getParentTweet = (id) => {
  Twitter.get(
    "search/tweets",
    { q: id, count: 1 },
    function (err, data, response) {
      // console.log(data);
      // console.log("---------")
      // console.log(data['statuses'][0]['entities']);
      return data;
    }
  );
};

const replyTweet = async (status, in_reply_to_status_id, username, url) => {
  try {
    const { data } = await axios.get(
      url == "" || url == null
        ? "https://www.myntra.com/men-suit-jackets-and-tuxedos?f=Color%3ABlue_273555&sort=popularity"
        : url
      // "https://www.myntra.com/men-t-shirts?f=Color%3AWhite_e9edf4&sort=popularity"
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
          var stat = status;
          if (products.length != 0) {
            var stat =
              stat +
              "\n\n" +
              "Rating - " +
              products[0]["rating"] +
              "\n" +
              "Brand - " +
              products[0]["brand"] +
              "\n" +
              "Sizes - " +
              products[0]["sizes"] +
              "\n" +
              "Discount - " +
              products[0]["discountDisplayLabel"] +
              "\n" +
              "mrp/price - " +
              products[0]["mrp"] +
              "/" +
              products[0]["price"] +
              "\n";
          }

          console.log(username);
          Twitter.post("statuses/update", {
            status: stat,
            // attachment_url: products[0]["searchImage"],
            in_reply_to_status_id,
            username: "@" + username,
          });
        });
      }
    });

    // return products;
  } catch (error) {
    var stat = status;

    console.log(username);
    Twitter.post("statuses/update", {
      status: stat,
      // attachment_url: products[0]["searchImage"],
      in_reply_to_status_id,
      username: "@" + username,
    });

    console.error(error);
    // throw error;

    // return [];
  }

  // return await Promise.resolve(

  // );
};

module.exports = { stream, getParentTweet, replyTweet };
