import React, { useState } from 'react';
import { Container, Card, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  // Estados dos formulários
  const [formData, setFormData] = useState({
    name: '', username: '', email: '', password: '', confirmPassword: ''
  });

  // Simulação de banco de dados de usuários (só pra gente testar)
  const [mockUsers, setMockUsers] = useState([
    { username: 'admin', password: 'admin', role: 'admin' }
  ]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    
    // Regra especial: Administrador Padrão
    if (formData.username === 'admin' && formData.password === 'admin') {
      onLogin({ username: 'admin', role: 'admin' });
      navigate('/');
      return;
    }

    // Comunicação com o MongoDB para os outros usuários
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        onLogin(data.user); // Passa o usuário do banco para o App.jsx
        navigate('/'); // Vai para a tela inicial
      } else {
        alert(data.error || "Usuário ou senha incorretos!");
      }
    } catch (error) {
      alert("Erro ao conectar com o servidor!");
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }

    try {
      // MANDANDO DADOS PARA A PORTA 5000
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          username: formData.username,
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert("Cadastro realizado com sucesso! Agora você pode fazer o login.");
        setFormData({ name: '', username: '', email: '', password: '', confirmPassword: '' });
        setIsRegistering(false); // Volta para a tela de login
      } else {
        // Mostra o erro que o Back-end enviou (ex: "Usuário já existe")
        alert(data.error || "Erro ao cadastrar.");
      }
    } catch (error) {
      alert("Erro ao conectar com o servidor! Verifique se o Back-end está rodando.");
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--color-body-bg)', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Container className="d-flex justify-content-center">
        <Card style={{ width: '100%', maxWidth: '400px', borderRadius: '15px', overflow: 'hidden' }} className="shadow-lg">
          <Card.Header className="text-center py-3" style={{ backgroundColor: '#1e5128', color: '#f0e68c' }}>
            <h2 className="cursive-font mb-0">{isRegistering ? 'Criar Conta' : 'Pizzaria Login'}</h2>
          </Card.Header>
          
          <Card.Body style={{ backgroundColor: '#fdf5e6' }} className="p-4">
            {/* FORMULÁRIO DE LOGIN */}
            {!isRegistering ? (
              <Form onSubmit={handleLoginSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Usuário</Form.Label>
                  <Form.Control type="text" name="username" required value={formData.username} onChange={handleChange} />
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">Senha</Form.Label>
                  <Form.Control type="password" name="password" required value={formData.password} onChange={handleChange} />
                </Form.Group>
                
                <Button variant="success" type="submit" className="w-100 fw-bold mb-3">LOGAR</Button>
                <div className="text-center">
                  <span className="text-muted">Não tem uma conta? </span>
                  <a href="#" style={{ color: '#8B0000', fontWeight: 'bold' }} onClick={(e) => { e.preventDefault(); setIsRegistering(true); }}>
                    Cadastrar
                  </a>
                </div>
              </Form>
            ) : (
              /* FORMULÁRIO DE CADASTRO */
              <Form onSubmit={handleRegisterSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Nome Completo</Form.Label>
                  <Form.Control type="text" name="name" required value={formData.name} onChange={handleChange} />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Usuário</Form.Label>
                  <Form.Control type="text" name="username" required value={formData.username} onChange={handleChange} />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">E-mail</Form.Label>
                  <Form.Control type="email" name="email" required value={formData.email} onChange={handleChange} />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Senha</Form.Label>
                  <Form.Control type="password" name="password" required value={formData.password} onChange={handleChange} />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">Confirmar Senha</Form.Label>
                  <Form.Control type="password" name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange} />
                </Form.Group>
                
                <Button variant="success" type="submit" className="w-100 fw-bold mb-3">FINALIZAR CADASTRO</Button>
                <div className="text-center">
                  <span className="text-muted">Já possui conta? </span>
                  <a href="#" style={{ color: '#1e5128', fontWeight: 'bold' }} onClick={(e) => { e.preventDefault(); setIsRegistering(false); }}>
                    Fazer Login
                  </a>
                </div>
              </Form>
            )}
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default Login;