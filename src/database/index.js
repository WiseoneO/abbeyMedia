const mongoose = require('mongoose');
const config = require('../config/default');

const connect = () => {
    return new Promise((resolve, reject) => {
      const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      };
      mongoose
        .connect(config.db_uri, options)
        .then((con) => resolve(con))
        .catch((err) => reject(err));
    });
  };
  
  module.exports = { connect };