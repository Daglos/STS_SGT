// src/pages/Login.jsx
import { useState } from 'react';

// se deberia usar import axios from "axios"; para crearel usuario

//desde aqui se inicia sesion y se ocuparia 
/*import { signInWithEmailAndPassword } from "firebase/auth";
import axios from "axios";
import { auth } from "../firebaseConfig";
*/


export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Login:', { email, password });

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