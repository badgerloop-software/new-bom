require('dotenv').config();

module.exports = {
  bomURL : 'mongodb://localhost:27017/devBLBOM',
  prodURL: 'mongodb://localhost:27017/' + config.crudDB
}
