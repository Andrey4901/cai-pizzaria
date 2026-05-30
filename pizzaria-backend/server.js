const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Product = require('./models/Product'); // Importando o modelo de produto

const app = express();

app.use(cors()); 
app.use(express.json()); 

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// 👇 FUNÇÃO PARA ALIMENTAR O BANCO SE ELE ESTIVER VAZIO (SEED) 👇
const seedDatabase = async () => {
  try {
    const count = await Product.countDocuments();
    
    if (count === 0) {
      console.log('🔄 Banco de dados de produtos vazio. Inserindo itens padrão...');
      
      const defaultProducts = [
        {
          name: "Marguerita",
          category: "Pizza",
          price: 49.90,
          description: "Deliciosa massa de fermentação caseira, molho pomodoro caseiro, queijo parmesão ralado, mussarela de búfala, manjericão e azeite!",
          image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?q=80&w=600&auto=format&fit=crop"
        },
        {
          name: "Pepperoni",
          category: "Pizza",
          price: 59.90,
          description: "Massa artesanal, molho de tomate pelati super saboroso, mussarela especial, fatias generosas de pepperoni premium e orégano.",
          image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=600&auto=format&fit=crop"
        },
        {
          name: "Portuguesa",
          category: "Pizza",
          price: 55.90,
          description: "A clássica portuguesa: molho de tomate, mussarela, presunto cozido picado, ovos, cebola fatiada, ervilhas frescas e azeitonas pretas.",
          image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?q=80&w=600&auto=format&fit=crop"
        },
        {
          name: "Quatro-queijos",
          category: "Pizza",
          price: 55.90,
          description: "Para os amantes de queijo: combinação perfeita de mussarela, provolone marcante, gorgonzola cremoso e catupiry original.",
          image: "https://images.unsplash.com/photo-1573821663912-569905455b1c?q=80&w=600&auto=format&fit=crop"
        },
        {
          name: "Calabresa",
          category: "Calzone",
          price: 35.90,
          description: "Calzone recheado com muita calabresa defumada moída, mussarela derretida, cebola e um toque de requeijão cremoso.",
          image: "https://images.unsplash.com/photo-1613564834644-a1708489863b?q=80&w=600&auto=format&fit=crop"
        },
        {
          name: "Frango",
          category: "Calzone",
          price: 39.90,
          description: "Massa fechada e crocante recheada com frango desfiado bem temperado, milho verde e muito catupiry.",
          image: "https://images.unsplash.com/photo-1544982503-9f984c14501a?q=80&w=600&auto=format&fit=crop"
        },
        {
          name: "Latinha 350ml",
          category: "Bebida",
          price: 7.99,
          description: "Refrigerante Coca-Cola em lata de 350ml trincando de gelada.",
          image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=600&auto=format&fit=crop"
        },
        {
          name: "Garrafa 500ml",
          category: "Bebida",
          price: 12.99,
          description: "Refrigerante Coca-Cola em garrafa pet de 500ml ideal para acompanhar sua refeição.",
          image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?q=80&w=600&auto=format&fit=crop"
        },
        {
          name: "Garrafinha 300ml",
          category: "Bebida",
          price: 8.99,
          description: "Suco natural de laranja Prats integral de 300ml, sem adição de conservantes ou açúcar.",
          image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?q=80&w=600&auto=format&fit=crop"
        }
      ];

      await Product.insertMany(defaultProducts);
      console.log('✅ 9 Itens padrão cadastrados com sucesso no MongoDB!');
    } else {
      console.log('📊 Produtos já existentes no banco de dados. Pulando carga inicial.');
    }
  } catch (error) {
    console.error('❌ Erro ao rodar a carga inicial:', error);
  }
};

// Conexão com o MongoDB
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ Conectado ao MongoDB com sucesso!');
    seedDatabase(); // Executa a função de carga inicial logo após conectar
  })
  .catch((err) => console.error('❌ Erro ao conectar ao MongoDB:', err));

// Rotas da API
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));

app.get('/', (req, res) => {
  res.send('🍕 API da Pizzaria está rodando perfeitamente!');
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});