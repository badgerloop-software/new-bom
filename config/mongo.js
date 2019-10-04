let creds = require("../creds.json");

module.exports = {
  bomURL : 'mongodb://localhost:27017/devBLBOM',
  prodURL: 'mongodb://localhost:27017/' + creds.crudDB
}
