import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { NavBar } from "../components/navBar";
const url = import.meta.env.VITE_URL;

export const TaskDetail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { task } = location.state || {};
    
    const [taskState, setTaskState] = useState(task);
    const [loading, setLoading] = useState(false);

    const markAsCompleted = async () => {
        try {
            setLoading(true);
            
            const response = await fetch(url + `/task/actualizarState?id=${taskState.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
            
                body: JSON.stringify({ estado: "inactivo" })
            });

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const data = await response.json();
            console.log("Respuesta:", data);

            setTaskState({
                ...taskState,
                estado: "inactivo"
            });

   

        } catch (error) {
            console.error('Error:', error);
            alert("Error al actualizar la tarea");
        } finally {
            setLoading(false);
        }
    }

    if (!taskState) {
        return (
            <div className="task-detail-container">
                <div className="error-card">
                    <h2>No se encontró la tarea</h2>
                    <button onClick={() => navigate('/home')}>Volver al inicio</button>
                </div>
            </div>
        );
    }
    const formatearFecha = (timestamp) => {
    if (!timestamp) return "Sin fecha";
    

    if (timestamp._seconds) {
        const fecha = new Date(timestamp._seconds * 1000);
        return fecha.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    

    if (typeof timestamp === 'string') {
        const fecha = new Date(timestamp);
        return fecha.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    return "Formato de fecha no válido";
};
    return (
        <>
        <NavBar/>
        <div className="task-detail-container">
            <button className="back-button" onClick={() => navigate(-1)}>
                Volver
            </button>

            <div className="detail-card">
                <div className="detail-header">
                    <h1 className="detail-title">{taskState.titulo}</h1>
                    <span className={`status-badge ${taskState.estado}`}>
                        {taskState.estado === 'activo' ? 'Activo' : 'Inactivo'}
                    </span>
                </div>

                <div className="detail-content">
                    <div className="detail-section">
                        <h3 className="section-label">Descripción</h3>
                        <p className="section-text">{taskState.descripcion}</p>
                    </div>

                    <div className="detail-section">
                        <h3 className="section-label">Fecha Límite</h3>
                        <p className="section-text date-text">
                            {formatearFecha(taskState.fechaLimite)}
                        </p>
                    </div>

                    <div className="detail-section">
                        <h3 className="section-label">Estado</h3>
                        <p className="section-text status-text">
                            {taskState.estado === 'activo' ? 'Tarea Activa' : 'Tarea Inactiva'}
                        </p>
                    </div>
                </div>

                <div className="detail-actions">
                    <button 
                        className="action-button primary" 
                        onClick={markAsCompleted}
                        disabled={loading || taskState.estado === 'inactivo'}
                    >
                        {loading 
                            ? 'Actualizando...' 
                            : taskState.estado === 'inactivo' 
                                ? 'Completada' 
                                : 'Marcar como Completada'}
                    </button>
                </div>
            </div>
        </div>
        </>
    );
}