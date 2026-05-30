import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; 
import { Container, Row, Col } from 'react-bootstrap';

import ProductCard from './components/ProductCard';
import ProductDetailPage from './components/ProductDetailPage';
import AdminMenu from './components/AdminMenu';
import Login from './components/Login'; 

const App = () => {
  const [productList, setProductList] = useState([]); // Começa vazio, vai vir do banco
  const [cart, setCart] = useState([]); 
  const [currentUser, setCurrentUser] = useState(null); 

  // 👇 FUNÇÃO PARA BUSCAR PRODUTOS DO MONGODB 👇
  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products');
      const data = await response.json();
      if (response.ok) {
        setProductList(data);
      }
    } catch (error) {
      console.error("Erro ao carregar produtos do banco:", error);
    }
  };

  // Carrega os produtos assim que o app inicia ou quando um usuário loga
  useEffect(() => {
    if (currentUser) {
      fetchProducts();
    }
  }, [currentUser]);

  return (
    <Routes>
      <Route path="/login" element={<Login onLogin={setCurrentUser} />} />

      <Route path="/" element={
        currentUser ? (
          <div style={{ backgroundColor: 'var(--color-body-bg)', minHeight: '100vh' }}>
            {/* Passamos a função fetchProducts para o menu atualizar a tela pós-cadastro */}
            <AdminMenu 
              products={productList} 
              fetchProducts={fetchProducts}
              cart={cart} setCart={setCart} 
              currentUser={currentUser} setCurrentUser={setCurrentUser} 
            />
            
            <Container className="py-4">
              <Row>
                {productList.map((product) => (
                  <Col key={product._id} sm={12} md={6} lg={4} className="mb-4">
                    <ProductCard product={{...product, id: product._id}} />
                  </Col>
                ))}
              </Row>
              {productList.length === 0 && (
                <p className="text-center mt-5 text-muted">Nenhum produto cadastrado no banco de dados ainda.</p>
              )}
            </Container>
          </div>
        ) : <Navigate to="/login" /> 
      } />

      <Route path="/product/:id" element={
        currentUser ? (
          <ProductDetailPage products={productList} cart={cart} setCart={setCart} currentUser={currentUser} />
        ) : <Navigate to="/login" />
      } />
    </Routes>
  );
};

export default App;