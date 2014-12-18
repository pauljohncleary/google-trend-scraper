#!/usr/bin/env node

var fs = require('fs'),
    path = require('path'),
    request = require('request'),
    cheerio = require('cheerio');

var trend = process.argv[2];

console.log('Scraping Google Trends for the "' + trend + '" trend');

var trendUrl = 'http://www.google.com/trends/fetchComponent?hl=en-US&q=' + trend + '&cid=TIMESERIES_GRAPH_0&export=5&w=500&h=300';

request(trendUrl, function(error, response, body) {
  parseAndSave(body);
});

function parseAndSave(html) {
  var $ = cheerio.load(html);

  //check for quota limit :-(
  if($('.errorSubTitle').length) {
    return console.log($('.errorSubTitle').text());
  }

  //serialise and save  the ouput WONT WORK YET
  console.log($('tr')[0]);
  var rows = $('tr');

  var trendData = [];
  rows.forEach(function(row) {
    rowData = {};
    rowData.date = row[0];
    rowData.score = row[1];
    trendData.push(rowData);
  })

  fs.writeFile(Date.now() + '-' + trend + '.json', JSON.stringify(trendData, null, 2));

};
