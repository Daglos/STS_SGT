import { useAuth } from "../context/authContext";

/**
 * Componente de barra de navegación superior
 * Proporciona identidad visual a la app y acceso a la gestión de perfil/sesión del usuario
 */
export const NavBar = () => {
    const { usuario, logout } = useAuth();

    return (
        <nav className="navbar">
            <div className="navbar-content">
                <div className="navbar-brand">
                    <span className="brand-text">Tareas</span>
                </div>
                
                <div className="navbar-user">
                    {/**
                     * Contenedor de información del perfil
                     * Renderiza un avatar dinámico basado en la inicial del nombre del usuario
                     */}
                    <div className="user-info">
                        <div className="user-avatar">
                            {usuario?.nombre?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <span className="user-name">{usuario?.nombre || 'Usuario'} {usuario?.apellido || ''}</span>
                    </div>
                    
                    {/**
                     * Botón de cierre de sesión
                     * Invoca la función logout del AuthContext para limpiar credenciales y redirigir
                     */}
                    <button className="logout-button" onClick={logout}>
                        Cerrar sesión
                    </button>
                </div>
            </div>
        </nav>
    );
};