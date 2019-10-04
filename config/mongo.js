let creds = require("./.env");

module.exports = {
  bomURL : 'mongodb://localhost:27017/devBLBOM',
  prodURL: 'mongodb://localhost:27017/' + creds.crudDB
}
