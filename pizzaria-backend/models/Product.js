const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true }, // Pizza, Bebida, Calzone...
  price: { type: Number, required: true },
  description: { type: String, required: true },
  image: { type: String } // Opcional
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);