import { useState } from 'react';
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom'; 

const url = import.meta.env.VITE_URL;

/**
 * Función para autenticar al usuario en el backend
 * Envía las credenciales y retorna el resultado de la autenticación
 */
const logIn = async (email, password) => {
  const data = {
    correo: email,
    contrasena: password
  }
  
  try {
    /**
     * Realizar petición POST al endpoint de login
     */
    const respuesta = await fetch(url + "/login/login", {
      method: "POST",
      headers: {                              
        "Content-Type": "application/json",   
      },
      body: JSON.stringify(data)
    });

    const datos = await respuesta.json();
    
    /**
     * Validar si la respuesta fue exitosa
     */
    if (!respuesta.ok) {
      return { 
        error: true, 
        mensaje: datos.error || 'Error al iniciar sesión' 
      };
    }

    return { 
      error: false, 
      usuario: datos.usuario 
    };

  } catch (error) {
    console.error("Ocurrió un error al obtener los datos:", error.message);
    return { 
      error: true, 
      mensaje: 'Error de conexión. Verifica tu internet.' 
    };
  }
}

/**
 * Componente de página de inicio de sesión
 * Permite a los usuarios autenticarse en el sistema mediante correo y contraseña
 */
export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  /**
   * Maneja el proceso de inicio de sesión
   * Valida las credenciales y redirige al usuario si son correctas
   */
  const handleLogin = async (e) => { 
    e.preventDefault();
    setMensaje({ tipo: '', texto: '' }); 
    setLoading(true);
    
    /**
     * Intentar autenticar al usuario con las credenciales proporcionadas
     */
    const resultado = await logIn(email, password); 
    
    /**
     * Si la autenticación es exitosa, guardar usuario y redirigir a home
     */
    if (!resultado.error && resultado.usuario) { 
      setMensaje({ tipo: 'success', texto: '¡Inicio de sesión exitoso!' });
      
      setTimeout(() => {
        login(resultado.usuario); 
        navigate('/home'); 
      }, 1000);
    } else {
      /**
       * Si hay error, mostrar mensaje de credenciales incorrectas
       */
      setMensaje({ 
        tipo: 'error', 
        texto: resultado.mensaje || 'Credenciales incorrectas' 
      });
    }
    
    setLoading(false);
  };

  /**
   * Redirige a la página de registro
   */
  const handleCrearCuenta = () => {
    navigate('/register')
  };

  /**
   * Redirige a la página de recuperación de contraseña
   */
  const handleOlvidastePassword = () => {
    navigate('/forgotPassword')
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
              disabled={loading}
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
              disabled={loading}
              required
            />
          </div>

          <button 
            type="button" 
            className="forgot-password" 
            onClick={handleOlvidastePassword}
            disabled={loading}
          >
            ¿Olvidaste tu contraseña?
          </button>

          {mensaje.texto && (
            <div className={`mensaje-login mensaje-${mensaje.tipo}`}>
              {mensaje.texto}
            </div>
          )}

          <button 
            type="submit" 
            className="btn-login"
            disabled={loading}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>

          <div className="divider">
            <span>o</span>
          </div>

          <button 
            type="button" 
            className="btn-crear-cuenta" 
            onClick={handleCrearCuenta}
            disabled={loading}
          >
            Crear cuenta
          </button>
        </form>
      </div>
    </div>
  );
};