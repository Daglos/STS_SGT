import { useAuth } from "../context/authContext";
export const NavBar = () => {
    const { usuario, logout } = useAuth();

    return (
        <nav className="navbar">
            <div className="navbar-content">
                <div className="navbar-brand">
                
                    <span className="brand-text">Tareas</span>
                </div>
                
                <div className="navbar-user">
                    <div className="user-info">
                        <div className="user-avatar">
                            {usuario?.nombre?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <span className="user-name">{usuario?.nombre || 'Usuario'} {usuario?.apellido || ''}</span>
                    </div>
                    
                    <button className="logout-button" onClick={logout}>
                  
                        Cerrar sesión
                    </button>
                </div>
            </div>
        </nav>
    );
};