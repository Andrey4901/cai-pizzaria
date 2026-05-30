import React, { useState } from 'react'; 
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Modal } from 'react-bootstrap';
import './ProductDetailPage.css'; 

// --- RECEBE O CARRINHO COMO PROP ---
const ProductDetailPage = ({ products, cart, setCart, currentUser }) => {
  const { id } = useParams();
  const navigate = useNavigate(); 
  
  const [selectedOption, setSelectedOption] = useState(null);
  const [cep, setCep] = useState(''); 
  const [address, setAddress] = useState(null); 
  const [isLoading, setIsLoading] = useState(false); 
  const [error, setError] = useState(null);
  const [addressNumber, setAddressNumber] = useState(''); 

  const [showModal, setShowModal] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  const product = products.find(p => p._id === id || p.id == id);

  if (!product) return <div>Produto não encontrado!</div>;
  
  const formattedPrice = `R$ ${product.price.toFixed(2).replace('.', ',')}`;

  const handleCepSearch = async () => {
    setAddress(null); setError(null); setAddressNumber('');
    if (cep.length < 8) { setError("CEP inválido."); return; }
    setIsLoading(true); 
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      if (data.erro) { setError("CEP não encontrado."); setAddress(null); } 
      else { setAddress(data); }
    } catch (e) { setError("Erro na conexão."); }
    setIsLoading(false); 
  };

  // --- NOVA FUNÇÃO: ADICIONAR AO CARRINHO ---
  const handleAddToCart = () => {
    if (!address || !addressNumber.trim()) {
      alert("Por favor, busque o CEP e informe o número para entrega.");
      return;
    }
    const newItem = {
      cartId: Date.now(), // ID único para o item no carrinho
      product: product,
      option: selectedOption,
      address: address,
      addressNumber: addressNumber,
      price: product.price
    };
    setCart([...cart, newItem]); // Salva no carrinho
    alert(`🛒 ${product.name} adicionado ao carrinho com sucesso!`);
    navigate('/'); // Volta para a tela inicial
  };

  const handleBuyClick = () => {
    if (!address || !addressNumber.trim()) {
      alert("Por favor, busque o CEP e informe o número para entrega.");
      return;
    }
    setShowModal(true);
  };

  const handleConfirmPurchase = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser?.id || null,
          totalAmount: product.price,
          deliveryAddress: {
            logradouro: address.logradouro,
            numero: addressNumber,
            bairro: address.bairro,
            cidade: address.localidade,
            uf: address.uf,
            cep: address.cep
          },
          items: [{
            productId: product._id,
            name: product.name,
            price: product.price,
            option: selectedOption || 'Nenhuma'
          }]
        })
      });

      if (response.ok) {
        setPurchaseSuccess(true);
        setTimeout(() => {
          navigate('/');
        }, 2500);
      } else {
        alert("Erro ao salvar o pedido.");
      }
    } catch (error) {
      console.error("ERRO REAL CAPTURADO:", error); 
      alert("Erro na conexão com o servidor. Verifique o console (F12).");
    }
  };

  return (
    <div className="detail-page-container">
      <header className="detail-header">
        <Button variant="outline-light" className="back-button" onClick={() => navigate(-1)}>&larr; Voltar</Button>
        <h1 className="cursive-font">{product.name}</h1>
      </header>

      <Container className="detail-body my-4">
        <Row>
          <Col md={6} className="d-flex flex-column align-items-center">
            <img src={product.image} alt={product.name} className="product-image-detail" />
            <div className="product-price-large mt-3">{formattedPrice}</div>
          </Col>
          <Col md={6}>
            <div className="product-description">
              <h2 className="cursive-font desc-title">Descrição:</h2>
              <p className="desc-text">{product.description}</p>
            </div>
            {product.options && product.options.length > 0 && (
              <div className="product-options">
                <Form>
                  {product.options.map((option, idx) => (
                    <Form.Check key={idx} type="radio" name="drink-option" label={option} value={option} onChange={(e) => setSelectedOption(e.target.value)} className="option-label" />
                  ))}
                </Form>
              </div>
            )}
          </Col>
        </Row>
      </Container>

      <footer className="detail-footer">
        <Container>
          <Row className="align-items-center">
            <Col xs={12} md={7}>
              <div className="cep-section">
                <Form.Group className="cep-input-group">
                  <Form.Label>CEP:</Form.Label>
                  <Form.Control type="text" maxLength={8} value={cep} onChange={(e) => setCep(e.target.value)} />
                </Form.Group>
                <Button variant="success" className="cep-button" onClick={handleCepSearch} disabled={isLoading}>{isLoading ? '...' : 'Buscar'}</Button>
                
                <div className="address-display">
                  {isLoading && <span>Buscando...</span>}
                  {error && <span className="cep-error">{error}</span>}
                  {address && (
                    <div style={{ lineHeight: '1.2' }}>
                      <span style={{ display: 'block', fontWeight: 'bold' }}>{address.logradouro} {address.bairro ? `- ${address.bairro}` : ''}</span>
                      <span style={{ display: 'block', fontSize: '0.9rem' }}>{address.localidade} / {address.uf} - {address.cep}</span>
                      <div className="d-flex align-items-center mt-2">
                        <label style={{ marginRight: '8px', fontWeight: 'bold', fontSize: '0.9rem' }}>Nº:</label>
                        <Form.Control type="text" size="sm" style={{ width: '80px' }} value={addressNumber} onChange={(e) => setAddressNumber(e.target.value)} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Col>
            
            {/* --- BOTÕES LADO A LADO --- */}
            <Col xs={12} md={5} className="d-flex justify-content-md-end gap-2 mt-3 mt-md-0">
              <Button variant="warning" className="fw-bold" onClick={handleAddToCart}>
                🛒 CARRINHO
              </Button>
              <Button variant="success" className="fw-bold px-4" onClick={handleBuyClick}>
                COMPRAR
              </Button>
            </Col>
          </Row>
        </Container>
      </footer>

      {/* Modal Compra Direta (Permanece Igual) */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        {!purchaseSuccess ? (
          <>
            <Modal.Header closeButton className="modal-header-custom"><Modal.Title>Confirmar Pedido</Modal.Title></Modal.Header>
            <Modal.Body className="modal-body-custom">
              <h5>Produto:</h5><p>{product.name} {selectedOption ? `(${selectedOption})` : ''}</p>
              <h5>Valor:</h5><p className="fw-bold text-success">{formattedPrice}</p>
              <h5>Endereço de Entrega:</h5>
              {address && <p className="small text-muted"><strong>{address.logradouro}, Nº {addressNumber}</strong><br/>{address.localidade} / {address.uf} - CEP: {address.cep}</p>}
              <hr/><p className="text-center mb-0">Deseja finalizar a compra?</p>
            </Modal.Body>
            <Modal.Footer className="modal-footer-custom">
              <Button variant="secondary" onClick={() => setShowModal(false)}>Não</Button>
              <Button variant="success" onClick={handleConfirmPurchase}>Sim</Button>
            </Modal.Footer>
          </>
        ) : (
          <Modal.Body className="text-center py-5">
            <h2 className="text-success mb-3">✅</h2><h4>Obrigado por comprar conosco!</h4>
          </Modal.Body>
        )}
      </Modal>
    </div>
  );
};
export default ProductDetailPage;