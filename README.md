# VisionX-Socializing E-commerce
Follow the trend


## ❓ Problem Statement
Myntra aims to provide best in class services and products to all their customers. Social Commerce has many facets and one of the emerging areas is influencer led content communities and e-commerce. 
Hence, provide an innovative idea that can help narrow the gap between e-commerce and Influencers. 
How can Myntra build and scale the overall influencer ecosystem?

## ✈ Solution
A lot of consumers today start their shopping journey with seeking inspiration and before deciding on the products to purchase. 
This inspiration drives the customers to refer to online shopping platforms and look for the same or similar products. 
We propose a social media(twitter/Instagram) bot that can help the customers to get links and other related information for their favourite influencer’s wardrobe on Myntra, just by adding an commenting/tweeting with #myntra_discover

![image](https://user-images.githubusercontent.com/60667917/140643547-0b5f6166-bf3e-4ddf-8eb7-4f93c4eac2e6.png)

> Here is the step by step approach:

#### 1. Twitter API
- Twitter Stream Endpoint -  statuses/filter, to stream tweets with #myntra_discover
- We extract in_reply_to_status_id_str to which we reply our results 
- Twitter Reply Endpoint - statuses/update,  to give replies to the captured tweet

#### 2. Ximilar
- In order to get relevant tags based on image we use Ximilar API.
- Ximilar API use a fashion tag service to detect different tags related to the provided image URL.
- We primarily use Sub-category (t-shirt, pants, jackets etc), Gender(Male, Female, Unisex)

#### 3. Google Cloud Vision API 
- In order to get relevant colour based on image we use Google cloud vision api.
- Vision API provides colour in rgba form.
- This rgba is converted into hex code using rgb2hex package and then to colour name using color-namer package.

#### 4. URL Formation
- Myntra uses a special route for all categories along with gender.                      
- Example: For “Men T-Shirt” category, Myntra uses “/men-shirt” route.
- Myntra also uses URL query parameters to filter the results. 
- Example: For getting a “white color t-shirt for men. Myntra redirect to the “/men-shirt” route along with query parameters.    “?f=Color%3A<Color_Name>_<hex_value>”            - Myntra uses query parameters to select sorting pattern as well
- Example: For sorting the products based on popularity, Myntra adds “&sort=popularity”.
- Hence, the final URL is  https://www.myntra.com/men-tshirts?f=Color%3AWhite_f2f2f2&sort=popularity

#### 5. Web Scraping
- Scraping the products page of Myntra website and capturing the  products in a JSON format.
- Data could be found in 11th script tag of the page in window.__myx 
- Sample JSON is shown in the picture alongside.
- The appropriate scrapped data will be posted as tweet/reply by the bot to the consumer/customer so that they can choose the product as per their preferred choice.

## 💡 Features
- Auto Replies to the tweets with #myntra_discover with relevant product information present in the image of parent tweet
- Top 5 Product recommendations according to tagged photo through notifications and replies
- Product Recommendation with brand, ratings, sizes, discounts, MRP, price and a direct link to buy the product
- Can be used by anyone eg. influencers, common public etc


## 🤖 Tech Stacks & dependencies
- nodejs
- web scraping
- cloud vision api
- ximilar
- Twitter API
- ExpressJS
- Myntra



