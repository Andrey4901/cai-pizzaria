import React from 'react';
import { Card } from 'react-bootstrap';
import './ProductCard.css'; // Importa nosso CSS (agora mais forte)

import { useNavigate } from 'react-router-dom';

// Recebe um 'product' como propriedade
const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  // Formata o preço para R$ 00,00
  const formattedPrice = `R$ ${product.price.toFixed(2).replace('.', ',')}`;

  const handleCardClick = () => {
    // Esta função nos levará para a URL /product/ID_DO_PRODUTO
    navigate(`/product/${product.id}`);
  };

  return (
    // 1. O card principal tem a classe 'product-card'
    <Card className="product-card" onClick={handleCardClick}>
      
      {/* 2. O Header não precisa de classe customizada. 
         Nosso CSS vai estilizá-lo automaticamente. */}
      <Card.Header as="h5">
        {product.category}
      </Card.Header>

      {/* A MUDANÇA ESTÁ AQUI:
        Removemos o <div className="card-image-placeholder">...</div>
        e adicionamos o <Card.Img ... />
      */}
      <Card.Img 
        variant="top" 
        src={product.image} // Puxa o caminho da imagem do dummyData
        alt={product.name}
        className="product-card-image" // Classe para estilização
      />

      <Card.Footer>
        <div className="product-name">{product.name}</div>
        <div className="product-price">{formattedPrice}</div>
      </Card.Footer>

    </Card>
  );
};

export default ProductCard;