const mongoose = require('mongoose');

async function connect() {
  try {
    await mongoose.connect('mongodb://localhost:27017/Sportswear');
    console.log('Connection successfully');
  } catch (error) {
    console.log(error);
  }
}

module.exports = { connect };
