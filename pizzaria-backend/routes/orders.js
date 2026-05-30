const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// REGISTRAR NOVO PEDIDO (POST /api/orders)
router.post('/', async (req, res) => {
  try {
    const { userId, items, totalAmount, deliveryAddress } = req.body;

    const newOrder = new Order({
      userId,
      items,
      totalAmount,
      deliveryAddress
    });

    await newOrder.save();
    res.status(201).json({ message: 'Pedido gravado com sucesso no MongoDB!', order: newOrder });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao processar pedido' });
  }
});

module.exports = router;