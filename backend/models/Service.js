const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  imagePath: {
    type: String,
    //required: true, // Path or URL to the service image
  },
  pricePerSquareFoot: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Service', ServiceSchema);
