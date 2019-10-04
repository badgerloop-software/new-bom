require('dotenv').config();

module.exports = {
  bomURL: `mongodb://localhost:27017/${process.env.bomDB}`,
  prodURL: `mongodb://localhost:27017/${process.env.crudDB}`
}
