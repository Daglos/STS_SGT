import { createContext, useState, useContext, useEffect } from 'react';


const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado));
    }
    setLoading(false);
  }, []);


  const login = (datosUsuario) => {
    setUsuario(datosUsuario);
    localStorage.setItem('usuario', JSON.stringify(datosUsuario));
  };


  const logout = async () => {
    setUsuario(null);
    localStorage.removeItem('usuario');
    
   
  };


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


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};