import { createContext, useState, useContext, useEffect } from 'react';

/**
 * Contexto centralizado para la autenticación
 * Permite compartir el estado del usuario y métodos de acceso en toda la aplicación
 */
const AuthContext = createContext();

/**
 * Proveedor de autenticación (Wrapper)
 * Gestiona el estado global del usuario, la persistencia en localStorage y el estado de carga inicial
 */
export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Efecto de inicialización
   * Verifica si existe una sesión guardada en el almacenamiento local al cargar la aplicación
   */
  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado));
    }
    setLoading(false);
  }, []);

  /**
   * Función para iniciar sesión
   * Actualiza el estado global y persiste los datos del usuario en el navegador
   */
  const login = (datosUsuario) => {
    setUsuario(datosUsuario);
    localStorage.setItem('usuario', JSON.stringify(datosUsuario));
  };

  /**
   * Función para cerrar sesión
   * Limpia el estado global y elimina la información del usuario del almacenamiento local
   */
  const logout = async () => {
    setUsuario(null);
    localStorage.removeItem('usuario');
  };

  /**
   * Objeto de valor del contexto
   * Expone datos del usuario, funciones de control y banderas de estado (cargando/autenticado)
   */
  const value = {
    usuario,
    login,
    logout,
    loading,
    isAuthenticated: !!usuario
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook personalizado para consumir el contexto de autenticación
 * Proporciona un acceso sencillo a los datos de sesión y lanza un error si se usa fuera del proveedor
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};