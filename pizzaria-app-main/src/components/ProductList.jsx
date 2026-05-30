import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import ProductCard from './ProductCard.jsx'; // Corrigido para .jsx se for o caso
import { products } from './dummyData';

//import { Link } from 'react-router-dom';

const ProductList = () => {
  return (
    <Container className="my-5"> {/* my-5 = margem no eixo Y */}
      <Row>
        {products.map(product => (
          // --- REGRA DE RESPONSIVIDADE (Mobile First) ---
          // lg={4}: Telas Grandes (Large) = 3 colunas (12/4 = 3)
          // md={6}: Telas Médias (Medium) = 2 colunas (12/6 = 2)
          // xs={12}: Telas Pequenas (Extra Small) = 1 coluna (12/12 = 1)
          
          <Col lg={4} md={6} xs={12} key={product.id} className="mb-4">
            <ProductCard product={product} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ProductList;