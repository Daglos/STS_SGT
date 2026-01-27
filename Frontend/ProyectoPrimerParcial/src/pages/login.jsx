// src/pages/Login.jsx
import { useState } from 'react';
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom'; 

const url = import.meta.env.VITE_URL;

const logIn = async (email, password) => {
  const data = {
    correo: email,
    contrasena: password
  }
  
  try {
    const respuesta = await fetch(url + "/login/login", {
      method: "POST",
      headers: {                              
        "Content-Type": "application/json",   
      },

      body: JSON.stringify(data)
    });

    if (!respuesta.ok) {
      throw new Error(`Error HTTP: ${respuesta.status}`);
    }

    const datos = await respuesta.json();
    
  
    return datos.usuario;

  } catch (error) {
    console.error("Ocurrió un error al obtener los datos:", error.message);
    return null;
  }
}

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => { 
    e.preventDefault();
    
    const usuario = await logIn(email, password); 
    
    if (usuario) { 
      login(usuario); 
      console.log("Login exitoso");
      navigate('/home'); 
    } else {
      console.log("Error iniciando sesión");
    }
  };

  const handleCrearCuenta = () => {
    console.log('Crear cuenta');
  };

  const handleOlvidastePassword = () => {
    console.log('Olvidaste contraseña');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Bienvenido</h1>
        <p className="login-subtitle">Iniciar sesión</p>

        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              type="email"
              id="email"
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="button" className="forgot-password" onClick={handleOlvidastePassword}>
            ¿Olvidaste tu contraseña?
          </button>

          <button type="submit" className="btn-login">
            Iniciar Sesión
          </button>

          <div className="divider">
            <span>o</span>
          </div>

          <button type="button" className="btn-crear-cuenta" onClick={handleCrearCuenta}>
            Crear cuenta
          </button>
        </form>
      </div>
    </div>
  );
};