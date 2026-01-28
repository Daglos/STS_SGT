import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { NavBar } from '../components/navBar';

const url = import.meta.env.VITE_URL;

const obtenerUsuarios = async () => {
    try {
        const response = await fetch(url + "/user/obtenerUsers");
        const data = await response.json();
        console.log(data);
        return data.data || data.usuarios || [];
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        return [];
    }
};

const crearTarea = async (taskData) => {
    try {
        const response = await fetch(url + "/task/crearTask", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(taskData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Error HTTP: ${response.status}`);
        }

        const datos = await response.json();
        return datos;
    } catch (error) {
        console.error("Error al crear tarea:", error);
        throw error;
    }
};

export const CreateTask = () => {
    const { usuario } = useAuth();
    const navigate = useNavigate();
    
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    
    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        fechaLimite: '',
        idEmpleado: '',
        idJefe: usuario?.id || ''
    });

    useEffect(() => {
        const fetchUsuarios = async () => {
            const data = await obtenerUsuarios();
            setUsuarios(data);
            setLoading(false);
        };
        fetchUsuarios();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
      
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        
        try {
           
            const taskData = {
                idEmpleado: formData.idEmpleado,
                idJefe: formData.idJefe,
                titulo: formData.titulo,
                descripcion: formData.descripcion,
                fechaLimite: new Date(formData.fechaLimite).toISOString()
            };

            const resultado = await crearTarea(taskData);
            
            if (resultado.success) {
                console.log("Tarea creada exitosamente:", resultado.data);
             
                navigate('/home');
            } else {
                setError('Error al crear la tarea');
            }
        } catch (error) {
            console.error("Error al crear tarea:", error);
            setError(error.message || 'Error al crear la tarea. Por favor intenta de nuevo.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigate('/home');
    };

    if (loading) {
        return (
            <>
                <NavBar />
                <div className="create-task-container">
                    <div className="create-task-card">
                        <h2>Cargando usuarios...</h2>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <NavBar />
            <div className="create-task-container">
                <div className="create-task-card">
                    <h1 className="create-task-title">Crear Nueva Tarea</h1>
                    <p className="create-task-subtitle">Completa los campos para asignar una tarea</p>

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <form className="create-task-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="titulo">Título *</label>
                            <input
                                type="text"
                                id="titulo"
                                name="titulo"
                                placeholder="Título de la tarea"
                                value={formData.titulo}
                                onChange={handleChange}
                                required
                                disabled={submitting}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="descripcion">Descripción *</label>
                            <textarea
                                id="descripcion"
                                name="descripcion"
                                placeholder="Describe la tarea en detalle..."
                                value={formData.descripcion}
                                onChange={handleChange}
                                rows="5"
                                required
                                disabled={submitting}
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="idEmpleado">Asignar a *</label>
                                <select
                                    id="idEmpleado"
                                    name="idEmpleado"
                                    value={formData.idEmpleado}
                                    onChange={handleChange}
                                    required
                                    disabled={submitting}
                                >
                                    <option value="">Selecciona un empleado</option>
                                    {usuarios.map((user) => (
                                        <option key={user.id} value={user.id}>
                                            {user.nombre} {user.apellido}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="fechaLimite">Fecha límite *</label>
                                <input
                                    type="datetime-local"
                                    id="fechaLimite"
                                    name="fechaLimite"
                                    value={formData.fechaLimite}
                                    onChange={handleChange}
                                    required
                                    disabled={submitting}
                                />
                            </div>
                        </div>

                        <div className="form-actions">
                            <button 
                                type="button" 
                                className="btn-cancel" 
                                onClick={handleCancel}
                                disabled={submitting}
                            >
                                Cancelar
                            </button>
                            <button 
                                type="submit" 
                                className="btn-submit"
                                disabled={submitting}
                            >
                                {submitting ? 'Creando...' : 'Crear Tarea'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};