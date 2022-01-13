/*
  Building a super simple API project with Node, Express, Axios, Cheerio web scaper, Heroku & RapidAPI

 https://www.youtube.com/watch?v=GK4Pl-GmPHk

 Watch the tutorial for info on Heroku hosting and upload to RapidAPI
 */

const PORT = process.env.PORT || 8000;
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();

const sources = [
  {
    id: "times",
    name: "The Times",
    base: "",
    address: "https://www.thetimes.co.uk/environment/climate-change",
  },
  {
    id: "guardian",
    name: "The Guardian",
    base: "",
    address: "https://www.theguardian.com/environment/climate-crisis",
  },
  {
    id: "telegraph",
    name: "The Telegraph",
    base: "https://www.telegraph.co.uk",
    address: "https://www.telegraph.co.uk/climate-change",
  },
];
const articles = [];

sources.forEach((source) => {
  axios
    .get(source.address)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);

      $('a:contains("climate")', html).each(function () {
        const title = $(this).text();
        const url = $(this).attr("href");
        articles.push({
          title,
          url: `${source.base}${url}`,
          source: source.name,
        });
      });
    })
    .catch((err) => console.log(err));
});

app.get("/", (req, res) => {
  res.json("Welcome to my climate change news API");
});

app.get("/news", (req, res) => {
  res.json(articles);
});

app.get("/news/:sourceId", (req, res) => {
  const sourceId = req.params.sourceId;
  const filtered = sources.filter((source) => source.id === sourceId);
  if (!filtered.length) {
    res.json("Oops");
    return;
  }
  const address = filtered[0].address;
  if (!address) {
    res.json("Oops");
    return;
  }
  // make another axios call on the address here? do anything we want!
  res.json(`I could give you all the articles for ${filtered[0].name} now :)`);
});

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));
