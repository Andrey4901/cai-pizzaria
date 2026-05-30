const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Quem comprou
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      name: String,
      price: Number,
      option: String
    }
  ],
  totalAmount: { type: Number, required: true },
  deliveryAddress: {
    logradouro: String,
    numero: String,
    bairro: String,
    cidade: String,
    uf: String,
    cep: String
  },
  status: { type: String, default: 'Pendente' } // Pendente, Em Preparo, Entregue
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);