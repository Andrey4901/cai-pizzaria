import React, { useState } from 'react';
import { Navbar, Container, Offcanvas, Nav, Button, Modal, Form, ListGroup } from 'react-bootstrap';

const AdminMenu = ({ products, fetchProducts, cart, setCart, currentUser, setCurrentUser }) => {
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const handleCloseOffcanvas = () => setShowOffcanvas(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', category: 'Pizza', price: '', description: '', image: '' });

  const [showCartModal, setShowCartModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  const handleLogout = () => setCurrentUser(null);

  // --- 🌟 CADASTRO DE PRODUTO NO MONGODB ---
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newItem.name,
          category: newItem.category,
          price: parseFloat(newItem.price.replace(',', '.')),
          description: newItem.description,
          image: newItem.image
        })
      });

      if (response.ok) {
        alert("Item cadastrado com sucesso no MongoDB!");
        setNewItem({ name: '', category: 'Pizza', price: '', description: '', image: '' });
        setShowAddModal(false); 
        fetchProducts(); // Recarrega a vitrine direto do banco!
      } else {
        alert("Erro ao cadastrar produto.");
      }
    } catch (error) {
      alert("Erro na conexão com o servidor.");
    }
  };

  // --- 🌟 REMOÇÃO DE PRODUTO NO MONGODB ---
  const handleDelete = async (id, name) => {
    if (window.confirm(`Tem certeza que deseja remover permanentemente do banco: ${name}?`)) {
      try {
        const response = await fetch(`http://localhost:5000/api/products/${id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          alert("Item removido do MongoDB!");
          fetchProducts(); // Recarrega a lista do banco atualizada!
        } else {
          alert("Erro ao remover produto.");
        }
      } catch (error) {
        alert("Erro na conexão com o servidor.");
      }
    }
  };

  // --- SEÇÃO DO CHECKOUT DO CARRINHO (VAMOS INTEGRAR NO PRÓXIMO PASSO) ---
  const removeFromCart = (cartId) => setCart(cart.filter(item => item.cartId !== cartId));
  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);
  const firstAddress = cart.length > 0 ? cart[0] : null;

  const handleFinalizeCart = () => {
    setShowCartModal(false); setShowCheckoutModal(true);
  };

  const handleConfirmCheckout = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id || null, // ID do usuário logado
          totalAmount: cartTotal,
          deliveryAddress: {
            logradouro: firstAddress.address?.logradouro,
            numero: firstAddress.addressNumber,
            bairro: firstAddress.address?.bairro,
            cidade: firstAddress.address?.localidade,
            uf: firstAddress.address?.uf,
            cep: firstAddress.address?.cep
          },
          items: cart.map(item => ({
            productId: item.product._id,
            name: item.product.name,
            price: item.price,
            option: item.option || 'Nenhuma'
          }))
        })
      });

      if (response.ok) {
        setCheckoutSuccess(true);
        setTimeout(() => {
          setCart([]); 
          setCheckoutSuccess(false); 
          setShowCheckoutModal(false);
        }, 2500);
      } else {
        alert("Erro ao salvar o pedido.");
      }
    } catch (error) {
      alert("Erro de conexão com o servidor.");
    }
  };

  return (
    <>
      <Navbar style={{ backgroundColor: '#1e5128' }} variant="dark" expand={false} className="mb-4 shadow-sm">
        <Container>
          <Navbar.Brand href="/" className="cursive-font" style={{ color: '#f0e68c', fontSize: '2rem' }}>Pizzaria</Navbar.Brand>
          
          <div className="d-flex align-items-center gap-3">
            <span style={{ color: '#fdf5e6', fontWeight: 'bold' }} className="d-none d-md-block">Olá, {currentUser?.username}!</span>
            <Button variant="warning" onClick={() => setShowCartModal(true)} className="fw-bold">🛒 ({cart.length})</Button>
            <Navbar.Toggle aria-controls="offcanvasNavbar" onClick={() => setShowOffcanvas(true)} />
          </div>

          <Navbar.Offcanvas show={showOffcanvas} onHide={handleCloseOffcanvas} placement="start">
            <Offcanvas.Header closeButton style={{ backgroundColor: '#fdf5e6' }}><Offcanvas.Title className="cursive-font" style={{ color: '#8B0000', fontSize: '2rem' }}>Menu</Offcanvas.Title></Offcanvas.Header>
            <Offcanvas.Body style={{ backgroundColor: '#fdf5e6' }}>
              <Nav className="justify-content-end flex-grow-1 pe-3">
                <Button variant="warning" className="mb-4 fw-bold" onClick={() => { setShowCartModal(true); handleCloseOffcanvas(); }}>🛒 VER CARRINHO ({cart.length} itens)</Button>
                {currentUser?.role === 'admin' && (
                  <>
                    <hr/><p className="text-muted small mb-2">Painel Admin</p>
                    <Button variant="success" className="mb-3 fw-bold" onClick={() => { setShowAddModal(true); handleCloseOffcanvas(); }}>+ CADASTRAR NOVO ITEM</Button>
                    <Button variant="danger" className="fw-bold mb-4" style={{ backgroundColor: '#8B0000' }} onClick={() => { setShowRemoveModal(true); handleCloseOffcanvas(); }}>- REMOVER ITEM EXISTENTE</Button>
                  </>
                )}
                <hr/><Button variant="outline-secondary" className="fw-bold mt-2" onClick={handleLogout}>Sair (Logout)</Button>
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>

      {/* MODAL DO CARRINHO */}
      <Modal show={showCartModal} onHide={() => setShowCartModal(false)} centered size="lg">
        <Modal.Header closeButton style={{ backgroundColor: '#1e5128', color: '#f0e68c' }}><Modal.Title>Seu Carrinho</Modal.Title></Modal.Header>
        <Modal.Body style={{ backgroundColor: '#fdf5e6' }}>
          {cart.length === 0 ? <p className="text-center py-4">Seu carrinho está vazio.</p> : (
            <ListGroup>
              {cart.map((item) => (
                <ListGroup.Item key={item.cartId} className="d-flex justify-content-between align-items-center mb-2 shadow-sm border-0">
                  <div><strong>{item.product.name} {item.option ? `(${item.option})` : ''}</strong><br/><small className="text-muted">Entrega: {item.address?.logradouro}, Nº {item.addressNumber}</small></div>
                  <div className="d-flex align-items-center gap-3"><span className="fw-bold text-success">R$ {item.price.toFixed(2).replace('.', ',')}</span><Button variant="outline-danger" size="sm" onClick={() => removeFromCart(item.cartId)}>X</Button></div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Modal.Body>
        {cart.length > 0 && (
          <Modal.Footer style={{ backgroundColor: '#fdf5e6', justifyContent: 'space-between' }}>
            <h4 className="mb-0 fw-bold">Total: R$ {cartTotal.toFixed(2).replace('.', ',')}</h4><Button variant="success" size="lg" onClick={handleFinalizeCart}>Finalizar Pedido</Button>
          </Modal.Footer>
        )}
      </Modal>

      {/* MODAL DE CHECKOUT */}
      <Modal show={showCheckoutModal} onHide={() => setShowCheckoutModal(false)} centered>
        {!checkoutSuccess ? (
          <><Modal.Header closeButton style={{ backgroundColor: '#8B0000', color: 'white' }}><Modal.Title>Confirmar Compra</Modal.Title></Modal.Header>
          <Modal.Body style={{ backgroundColor: '#fdf5e6' }}><h5>Itens do Pedido ({cart.length}):</h5><ul className="mb-3">{cart.map(item => <li key={item.cartId}>{item.product.name} {item.option ? `(${item.option})` : ''}</li>)}</ul><h5>Valor Total:</h5><p className="fw-bold text-success fs-4">R$ {cartTotal.toFixed(2).replace('.', ',')}</p><h5>Endereço de Entrega Principal:</h5>{firstAddress && (<p className="small text-muted border p-2 bg-light"><strong>{firstAddress.address?.logradouro}, Nº {firstAddress.addressNumber}</strong><br/>{firstAddress.address?.bairro} - {firstAddress.address?.localidade}/{firstAddress.address?.uf}</p>)}</Modal.Body>
          <Modal.Footer style={{ backgroundColor: '#fdf5e6', justifyContent: 'center' }}><Button variant="secondary" onClick={() => setShowCheckoutModal(false)}>Cancelar</Button><Button variant="success" onClick={handleConfirmCheckout}>Confirmar e Pagar</Button></Modal.Footer></>
        ) : (
          <Modal.Body className="text-center py-5"><h2 className="text-success mb-3">✅</h2><h4>Pedido Confirmado!</h4><p>Seus itens estão sendo preparados.</p></Modal.Body>
        )}
      </Modal>

      {/* MODAL CADASTRAR ITEM */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
        <Modal.Header closeButton style={{ backgroundColor: '#1e5128', color: '#f0e68c' }}><Modal.Title>Cadastrar Novo Item</Modal.Title></Modal.Header>
        <Form onSubmit={handleAddSubmit}>
          <Modal.Body style={{ backgroundColor: '#fdf5e6' }}>
            <Form.Group className="mb-3"><Form.Label className="fw-bold">Nome do Item</Form.Label><Form.Control type="text" required value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} /></Form.Group>
            <Form.Group className="mb-3"><Form.Label className="fw-bold">Categoria</Form.Label><Form.Select value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})}><option value="Pizza">Pizza</option><option value="Calzone">Calzone</option><option value="Bebida">Bebida</option></Form.Select></Form.Group>
            <Form.Group className="mb-3"><Form.Label className="fw-bold">Preço (R$)</Form.Label><Form.Control type="text" required placeholder="Ex: 49,90" value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} /></Form.Group>
            <Form.Group className="mb-3"><Form.Label className="fw-bold">Descrição</Form.Label><Form.Control as="textarea" rows={3} required value={newItem.description} onChange={e => setNewItem({...newItem, description: e.target.value})} /></Form.Group>
            <Form.Group className="mb-3"><Form.Label className="fw-bold">URL da Foto (Opcional)</Form.Label><Form.Control type="text" placeholder="Cole o link da imagem aqui" value={newItem.image} onChange={e => setNewItem({...newItem, image: e.target.value})} /></Form.Group>
          </Modal.Body>
          <Modal.Footer style={{ backgroundColor: '#fdf5e6' }}><Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancelar</Button><Button variant="success" type="submit">Salvar Item</Button></Modal.Footer>
        </Form>
      </Modal>

      {/* MODAL REMOVER ITEM */}
      <Modal show={showRemoveModal} onHide={() => setShowRemoveModal(false)} size="lg" centered>
        <Modal.Header closeButton style={{ backgroundColor: '#8B0000', color: 'white' }}><Modal.Title>Remover Item do Cardápio</Modal.Title></Modal.Header>
        <Modal.Body style={{ backgroundColor: '#fdf5e6', maxHeight: '60vh', overflowY: 'auto' }}>
          <ListGroup>
            {products.map(product => (
              <ListGroup.Item key={product._id} className="d-flex justify-content-between align-items-center mb-2 shadow-sm border-0">
                <div><strong>{product.name}</strong> - R$ {product.price.toFixed(2).replace('.', ',')}<br/><small className="text-muted">{product.category}</small></div>
                <Button variant="outline-danger" onClick={() => handleDelete(product._id, product.name)}>Remover</Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AdminMenu;