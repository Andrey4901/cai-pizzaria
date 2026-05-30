const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// 1. LISTAR TODOS OS PRODUTOS (GET /api/products)
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
});

// 2. CADASTRAR UM NOVO ITEM (POST /api/products)
router.post('/', async (req, res) => {
  try {
    const { name, category, price, description, image } = req.body;
    
    const newProduct = new Product({
      name,
      category,
      price,
      description,
      image
    });

    await newProduct.save();
    res.status(201).json({ message: 'Produto cadastrado com sucesso!', product: newProduct });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao cadastrar produto' });
  }
});

// 3. REMOVER UM ITEM (DELETE /api/products/:id)
router.delete('/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Produto removido com sucesso!' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover produto' });
  }
});

module.exports = router;