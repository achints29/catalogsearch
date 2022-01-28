const express = require("express");
var axios = require("axios");

// function to get the data from the API
let getSearchResults = async (queryString, filterArray, page, limit) => {
  console.log(queryString);
  console.log(filterArray);
  console.log(page);
  console.log(limit);

  var searchTerm = {
    $search: {
      facet: {
        operator: {
          phrase: {
            path: {
              wildcard: "*",
            },
            query: queryString,
          },
        },
        facets: {
          colorsFacet: {
            type: "string",
            path: "skuColors",
          },
          sizesFacet: {
            type: "string",
            path: "skuSizes",
          },
          featuresFacet: {
            type: "string",
            path: "features",
          },
          brandsFacet: {
            type: "string",
            path: "brand",
          },
          categoriesFacet: {
            type: "string",
            path: "ancestorCategories",
          },
        },
      },
    },
  };
  var facetsMetaData = {
    $set: {
      facets: "$$SEARCH_META",
    },
  };
  //limit stage is not allowed in atlas M0 cluster
  var limitStage = {
    limit: limit,
  };
  
  var fullQuery = {
    collection: "ecomProductCatalog",
    database: "eComSearch",
    dataSource: "eComSearch",
    pipeline: [searchTerm, facetsMetaData],
  };

  var data = JSON.stringify(fullQuery);

  var config = {
    method: "post",
    url: "https://data.mongodb-api.com/app/data-tfkyx/endpoint/data/beta/action/aggregate",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Request-Headers": "*",
      "api-key":
        "U7TVtdFfo9vwKfEZCWoCJ9VZq675Kr7swo8ezRL5RghC6AqQK1V71iEjnbxneyvQ",
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
  let queryString = req.query.query;
  let filterArray = req.query.filter;
  let page = req.query.page;
  let limit = req.query.limit;
  //let limit = req.query.limit;
  let responseResults = await getSearchResults(
    queryString,
    filterArray,
    page,
    limit
  );
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.send(responseResults.documents);
};
