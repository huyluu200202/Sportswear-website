module.exports = {
  multipleMongooseToObject: function (mongooses) {
    if (mongooses && typeof mongooses.toObject === 'function') {
      return mongooses.toObject();
    } else {
      return mongooses; // Return as is if not a Mongoose document
    }
  },

  mongooseToObject: function (mongoose) {
    if (mongoose && typeof mongoose.toObject === 'function') {
      return mongoose ? mongoose.toObject() : mongoose;
    } else {
      return mongoose; // Return as is if not a Mongoose document
    }
  },
};
