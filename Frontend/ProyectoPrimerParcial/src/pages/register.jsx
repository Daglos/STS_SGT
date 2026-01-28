import { useState } from 'react';
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';

const url = import.meta.env.VITE_URL;

const crearCuenta = async (nombre, apellido, email, password) => {
  const data = {
    idRol:"JN3KSuH83BfQrq314DHt",
    nombre,
    apellido,
    correo: email,
    contrasena: password
  };
  
  try {
    const respuesta = await fetch(url + "/user/crearUsers", {
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
    return datos.data;

  } catch (error) {
    console.error("Ocurrió un error al crear la cuenta:", error.message);
    return null;
  }
};

export const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    
    const usuario = await crearCuenta(nombre, apellido, email, password);
    console.log(usuario)
    if (usuario) {
      login(usuario);
      console.log("Cuenta creada exitosamente");
      navigate('/home');
    } else {
      console.log("Error al crear cuenta");
    }
  };

  const handleVolverLogin = () => {
    navigate('/login');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Crear Cuenta</h1>
        <p className="login-subtitle">Únete a nosotros</p>

        <form className="login-form" onSubmit={handleRegister}>
          <div className="form-group">
            <label htmlFor="nombre">Nombre</label>
            <input
              type="text"
              id="nombre"
              placeholder="Juan"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="apellido">Apellido</label>
            <input
              type="text"
              id="apellido"
              placeholder="Pérez"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              required
            />
          </div>

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
              minLength={6}
            />
          </div>

          <button type="submit" className="btn-login">
            Crear Cuenta
          </button>

          <div className="divider">
            <span>o</span>
          </div>

          <button type="button" className="btn-crear-cuenta" onClick={handleVolverLogin}>
            Ya tengo cuenta
          </button>
        </form>
      </div>
    </div>
  );
};