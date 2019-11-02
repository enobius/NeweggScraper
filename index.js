const express = require('express');
const scraper = require("./scraperr");


const app = express();

app.get('/', (req, res) => {
  res.json({
    message: 'Scraping is Fun!'
  });
});

app.get('/search/:name',(req,res) => {
     scraper.searchProduct(req.params.name).then(itemList => {
        console.log(itemList);
        res.json(itemList);
    });
});

app.get('/product', (req, res) => {
  scraper.getSpecInfo("https://www.newegg.com/p/N82E16883152455?Description=mini%20gaming%20pc&cm_re=mini_gaming_pc-_-83-152-455-_-Product")
  .then(product => {
    res.json(product);
  })
})


// /search/star warsx
// /search/fight club
// /search/office space


const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Listening on ${port}`);
});