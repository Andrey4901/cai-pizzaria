const express = require('express');
const router = express.Router();
const User = require('../models/User');

// --- ROTA 1: CADASTRAR (POST /api/auth/register) ---
router.post('/register', async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    const userExists = await User.findOne({ $or: [{ username }, { email }] });
    
    if (userExists) {
      return res.status(400).json({ error: 'Usuário ou e-mail já estão em uso!' });
    }

    const newUser = new User({ name, username, email, password });
    await newUser.save();
    res.status(201).json({ message: 'Usuário cadastrado com sucesso!', user: newUser });
  } catch (error) {
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
});

// --- ROTA 2: LOGAR (POST /api/auth/login) ---
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1. Procura o usuário no MongoDB pelo "username"
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado!' });
    }

    // 2. Verifica se a senha bate com a do banco
    if (user.password !== password) {
      return res.status(401).json({ error: 'Senha incorreta!' });
    }

    // 3. Sucesso! Devolve os dados do usuário para o React
    res.status(200).json({
      message: 'Login bem-sucedido!',
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
});

module.exports = router;