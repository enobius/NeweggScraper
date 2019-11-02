const cheerio = require("cheerio");
const fetch = require("node-fetch");

const BASE_URL = "https://www.newegg.com/p/pl?d=";
var i = 1; 
var numPages;
const itemsList = [];

async function searchProduct(search) {
  const keyword = await urlFormat(search);
  const theUrl = BASE_URL + keyword + "&Page=" + i;
  console.log(theUrl);

  return fetch(theUrl).then(response => response.text())
  .then(body => {
      const $ = cheerio.load(body);
      $("div.items-view.is-grid div.item-container").each(function(index, elm) {
        const element = $(elm);
        const name = element.find("a.item-title").text();
        const link = element.find("a.item-title").attr("href");
        const thePrice = element.find("li.price-current").text();
        const img = element.find("a.item-img img").attr("src");
    
        const product = {
          name: name,
          link: link,
          thePrice: realPrice(thePrice),
          img: img,
        };
        itemsList.push(product);
      });

      var numOfPages = $("span.list-tool-pagination-text").text();

      console.log(numOfPages);
      if (i == 1) {
        numPages = pageLimit(numOfPages);
      } else if(numOfPages == "") {
        numPages = i;
      }
      console.log("dude");
      if (i == numPages) {
      //console.log(itemsList);
      console.log(`terminate recursion on: ${theUrl}`);
      console.log(itemsList);
      return itemsList;
      } else if(numPages == 1) {
        return itemsList;
      } else {
        i++;
        searchProduct(search);
      }

      return itemsList;
  });
}

searchProduct("ssd");

function getSpecInfo(key) {

  const aUrl = changeUrl(key);
  
  return fetch(aUrl).then(response => response.text())
  .then(body => {
    const $ = cheerio.load(body);

    const theSpecs = [];


    $("#Specs fieldset").each(function(index, elm) {
      const specTitle = $(elm)
        .find("h3.specTitle")
        .text();

      const infos = [];

      $(elm)
        .find("dl")
        .each(function(index, elme) {

          const infoTitle = $(elme)
            .find("dt")
            .text();


          const info = $(elme)
            .find("dd")
            .text();

          const specification = {
            name: infoTitle,
            info: info,
          }
          infos.push(specification);
        });
        //console.log(infos);
        const title = {
          name: specTitle,
          info: infos,
        }
        theSpecs.push(title);
    });
    const specificProduct = {
      theSpecs,
    }
    console.log(specificProduct);
    
    return specificProduct;
  })
}

// function realInfo(key) {
//   try {
//     const aUrl = changeUrl(key);
//     return getSpecInfo(aUrl);
//   } catch(error) {
//     const aUrl2 = changeUrl2(key);
//     return getSpecInfo(aUrl2);
//   }
// }

//getSpecInfo("N82E16811553036");

async function urlFormat(search) {
    // var userSearch;
    // var question = [{
    //     type: 'input',
    //     name: 'search',
    //     message: "what do you want to search?",
    // }] 
    // const input = await inquirer.prompt(question).then( answers => {
    //     userSearch = answers['search'];
    // });
    // console.log(userSearch);
    switch (search) {
      case null:
        return "";
      default:
        var theArray = search.split("");
        for (let i = 0; i < theArray.length; i++) {
          switch (theArray[i]) {
            case " ":
              theArray[i] = "+";
          }
        }
        var newSearch = theArray.join("");
        console.log(newSearch);
        return newSearch;
    }
    return search;
  }
  function realPrice(price) {
    var newPrice = " ";
    for (var o = 0; o < price.length; o++) {
      if (
        price.charAt(o) == "$" ||
        isNum(price.charAt(o)) == true ||
        price.charAt(o) == "."
      ) {
        newPrice = newPrice.concat(price.charAt(o));
        if (price.charAt(o) == ".") {
          newPrice = newPrice.concat(price.charAt(o + 1));
          newPrice = newPrice.concat(price.charAt(o + 2));
          o = price.length;
        }
      }
    }
    newPrice = newPrice.slice(1);
    //console.log(newPrice);
    return newPrice;
  }
  
  var pageNum = "0";
  
  function pageLimit(word) {
    for (var i = 0; i < word.length; i++) {
      if (word.charAt(i) == "/") {
        for (var f = i + 1; f < word.length; f++) {
          var booll = isNum(word.charAt(f));
          if (booll == true) {
            pageNum += word.charAt(f);
            console.log("no");
          } else {
            f = word.length;
            i = word.length;
          }
        }
      }
    }
    pageNum = pageNum.slice(1);
    console.log("Page Limit: " + pageNum);
    return pageNum;
  }
  
  function isNum(c) {
    if (c >= "0" && c <= "9") {
      return true;
    } else {
      return false;
    }
  }

  function fixUrl(aUrl) {
    var realUrl = "";
    for(var g = aUrl.length; g > 0; g--) {
      if(aUrl[g] != "/") {
        realUrl = aUrl[g] + realUrl;
      } else {
        g = 0;
      }
    }
    console.log(realUrl);
    const BASE_URL = "https://www.newegg.com/p/";
    realUrl = BASE_URL + realUrl;
    return realUrl;
  }

  fixUrl("https://www.newegg.com/corsair-32gb-288-pin-ddr4-sdram/p/N82E16820236455?Description=ram&cm_re=ram-_-20-236-455-_-Product");

  // function changeUrl(key) {
  //   const url = "https://www.newegg.com/p/";
  //   const realUrl = url + key;
  //   return realUrl;
  // }

  // function changeUrl2(key) {
  //   const url = "https://www.newegg.com/";
  //   const realUrl = url + key;
  //   return realUrl;
  // }

  module.exports = {
    searchProduct,
    getSpecInfo,
  };
  