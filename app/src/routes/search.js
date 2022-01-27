const express = require("express");
var axios = require("axios");


// function to get the data from the API
let getSearchResults = async (queryString) => {
    console.log(queryString);
    var data = JSON.stringify({
        collection: "ecomProductCatalog",
        database: "eComSearch",
        dataSource: "eComSearch",
        projection: {
          _id: 1,
        },
        pipeline: [
            {
              '$search': {
                'facet': {
                  'operator': {
                    'phrase': {
                      'path': {
                        'wildcard': '*'
                      }, 
                      'query': queryString
                    }
                  }, 
                  'facets': {
                    'colorsFacet': {
                      'type': 'string', 
                      'path': 'skuColors'
                    }, 
                    'sizesFacet': {
                      'type': 'string', 
                      'path': 'skuSizes'
                    }, 
                    'featuresFacet': {
                      'type': 'string', 
                      'path': 'features'
                    }, 
                    'brandsFacet': {
                      'type': 'string', 
                      'path': 'brand'
                    }, 
                    'categoriesFacet': {
                      'type': 'string', 
                      'path': 'ancestorCategories'
                    }
                  }
                }
              }
            },  {
              '$set': {
                'facets': '$$SEARCH_META'
              }
            }
          ],
      });
      
      var config = {
        method: "post",
        url: "https://data.mongodb-api.com/app/data-tfkyx/endpoint/data/beta/action/aggregate",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Request-Headers": "*",
          "api-key":
            "U7TVtdFfo9vwKfEZCWoCJ9VZq675Kr7swo8ezRL5RghC6AqQK1V71iEjnbxneyvQW",
        },
        data: data,
      };
  console.log(config);
  let response = await axios(config);
  return response.data;
};
//controller function
module.exports = async (req, res) => {
  // Access the provided 'page' and 'limt' query parameters
  let queryString = req.query.search;
    //let limit = req.query.limit;
  let responseResults = await getSearchResults(queryString);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.send(responseResults.documents);
};
