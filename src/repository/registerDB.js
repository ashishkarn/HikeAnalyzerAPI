var pg = require('pg');

const fs = require('fs');
const path = require('node:path');

let rawdata = fs.readFileSync(path.join(__dirname,'..', '..', "creds.json"));
let url = JSON.parse(rawdata);

var conString = url.URL
var client = new pg.Client(conString);
client.connect(function(err) {
  if(err) {
    return console.error('could not connect to postgres', err);
  }
  client.query('SELECT NOW() AS "theTime"', function(err, result) {
    if(err) {
      return console.error('error running query', err);
    }
    console.log(result.rows[0].theTime);
  });
});

module.exports = client;