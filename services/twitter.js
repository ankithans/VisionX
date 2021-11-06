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
          var stat1 = "";
          var stat2 = "";
          var stat3 = "";
          var stat4 = "";
          var stat5 = "";
          if (products.length != 0) {
            stat1 =
              "@" +
              username +
              " Rating ✨ - " +
              Number(products[0]["rating"]).toFixed(2) +
              "/5" +
              "\n" +
              "Brand 😎 - " +
              products[0]["brand"] +
              "\n" +
              "Sizes 👕 - " +
              products[0]["sizes"] +
              "\n" +
              "Discount 📉 - " +
              products[0]["discountDisplayLabel"] +
              "\n" +
              "MRP/Price ﹩ - " +
              "₹" +
              products[0]["mrp"] +
              "/" +
              "₹" +
              products[0]["price"] +
              "\n" +
              "Link 🔗 - " +
              "https://www.myntra.com/" +
              products[0]["landingPageUrl"];

            if (products.length >= 2)
              stat2 =
                "@" +
                username +
                " Rating ✨ - " +
                Number(products[1]["rating"]).toFixed(2) +
                "/5" +
                "\n" +
                "Brand 😎 - " +
                products[1]["brand"] +
                "\n" +
                "Sizes 👕 - " +
                products[1]["sizes"] +
                "\n" +
                "Discount 📉 - " +
                products[1]["discountDisplayLabel"] +
                "\n" +
                "MRP/Price ﹩ - " +
                "₹" +
                products[1]["mrp"] +
                "/" +
                "₹" +
                products[1]["price"] +
                "\n" +
                "Link 🔗 - " +
                "https://www.myntra.com/" +
                products[1]["landingPageUrl"];

            if (products.length >= 3)
              stat3 =
                "@" +
                username +
                " Rating ✨ - " +
                Number(products[2]["rating"]).toFixed(2) +
                "/5" +
                "\n" +
                "Brand 😎 - " +
                products[2]["brand"] +
                "\n" +
                "Sizes 👕 - " +
                products[2]["sizes"] +
                "\n" +
                "Discount 📉 - " +
                products[2]["discountDisplayLabel"] +
                "\n" +
                "MRP/Price ﹩ - " +
                "₹" +
                products[2]["mrp"] +
                "/" +
                "₹" +
                products[2]["price"] +
                "\n" +
                "Link 🔗 - " +
                "https://www.myntra.com/" +
                products[2]["landingPageUrl"];

            if (products.length >= 4)
              stat4 =
                "@" +
                username +
                " Rating ✨ - " +
                Number(products[3]["rating"]).toFixed(2) +
                "/5" +
                "\n" +
                "Brand 😎 - " +
                products[3]["brand"] +
                "\n" +
                "Sizes 👕 - " +
                products[3]["sizes"] +
                "\n" +
                "Discount 📉 - " +
                products[3]["discountDisplayLabel"] +
                "\n" +
                "MRP/Price ﹩ - " +
                "₹" +
                products[3]["mrp"] +
                "/" +
                "₹" +
                products[3]["price"] +
                "\n" +
                "Link 🔗 - " +
                "https://www.myntra.com/" +
                products[3]["landingPageUrl"];

            if (products.length >= 5)
              stat5 =
                "@" +
                username +
                " Rating ✨ - " +
                Number(products[4]["rating"]).toFixed(2) +
                "/5" +
                "\n" +
                "Brand 😎 - " +
                products[4]["brand"] +
                "\n" +
                "Sizes 👕 - " +
                products[4]["sizes"] +
                "\n" +
                "Discount 📉 - " +
                products[4]["discountDisplayLabel"] +
                "\n" +
                "MRP/Price ﹩ - " +
                "₹" +
                products[4]["mrp"] +
                "/" +
                "₹" +
                products[4]["price"] +
                "\n" +
                "Link 🔗 - " +
                "https://www.myntra.com/" +
                products[4]["landingPageUrl"];
          }

          console.log(username);
          var tweet_main_id = "";

          Twitter.post(
            "statuses/update",
            {
              status: status,
              // attachment_url: products[0]["searchImage"],
              in_reply_to_status_id,
              username: "@" + username,
            },
            function (err, data, response) {
              console.log(data);
              tweet_main_id = data["id_str"];
            }
          );

          // console.log(tweet_main);

          // var tweet_main_id = tweet_main["id_str"];
          // console.log(tweet_main_id);

          Twitter.post("statuses/update", {
            status: stat1,
            // attachment_url: products[0]["searchImage"],
            tweet_main_id,
            username: "@" + username,
          });

          if (products.length >= 2)
            Twitter.post("statuses/update", {
              status: stat2,
              // attachment_url: products[0]["searchImage"],
              tweet_main_id,
              username: "@" + username,
            });

          if (products.length >= 3)
            Twitter.post("statuses/update", {
              status: stat3,
              // attachment_url: products[0]["searchImage"],
              tweet_main_id,
              username: "@" + username,
            });

          if (products.length >= 4)
            Twitter.post("statuses/update", {
              status: stat4,
              // attachment_url: products[0]["searchImage"],
              tweet_main_id,
              username: "@" + username,
            });

          if (products.length >= 5)
            Twitter.post("statuses/update", {
              status: stat5,
              // attachment_url: products[0]["searchImage"],
              tweet_main_id,
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
