import { useAuth } from "../context/authContext";
import { useNavigate, useLocation } from 'react-router-dom';

export const NavBar = () => {
    const { usuario, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { path: '/home', label: 'Inicio' },
        { path: '/createTask', label: 'Crear Tarea' },
        { path: '/historyOfTask', label: 'Historial' },
    ];

    return (
        <nav className="navbar">
            <div className="navbar-content">
                <div className="navbar-brand" onClick={() => navigate('/home')}>
                    <span className="brand-text">Tareas</span>
                </div>
                
                <div className="navbar-nav">
                    {navItems.map(item => (
                        <button 
                            key={item.path}
                            className={`nav-button ${location.pathname === item.path ? 'active' : ''}`}
                            onClick={() => navigate(item.path)}
                        >
                            {item.label}
                        </button>
                    ))}
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