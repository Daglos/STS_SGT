import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { NavBar } from '../components/navBar';

const url = import.meta.env.VITE_URL;

/**
 * Función para obtener la lista de usuarios del sistema
 * Realiza una petición GET al backend y retorna los datos de usuarios
 */
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

/**
 * Función para crear una nueva tarea en el sistema
 * Envía los datos de la tarea al backend mediante una petición POST
 */
const crearTarea = async (taskData) => {
    try {
        const response = await fetch(url + "/task/crearTask", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(taskData)
        });

        /**
         * Validar si la respuesta fue exitosa
         */
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

/**
 * Componente de página para crear nuevas tareas
 * Permite a los usuarios con rol de jefe asignar tareas a empleados
 */
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
        prioridad: 'Media',
        idJefe: usuario?.id || ''
    });

    /**
     * Efecto para cargar la lista de usuarios al montar el componente
     */
    useEffect(() => {
        const fetchUsuarios = async () => {
            const data = await obtenerUsuarios();
            setUsuarios(data);
            setLoading(false);
        };
        fetchUsuarios();
    }, []);

    /**
     * Maneja los cambios en los campos del formulario
     * Actualiza el estado del formulario y limpia mensajes de error
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
      
        if (error) setError('');
    };

    /**
     * Maneja el envío del formulario para crear la tarea
     * Valida los datos, envía la petición y redirige si es exitoso
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        
        try {
            /**
             * Construir el objeto de datos de la tarea con formato ISO para la fecha
             */
            const taskData = {
                idEmpleado: formData.idEmpleado,
                idJefe: formData.idJefe,
                titulo: formData.titulo,
                descripcion: formData.descripcion,
                fechaLimite: new Date(formData.fechaLimite).toISOString(),
                prioridad: formData.prioridad,
            };

            /**
             * Intentar crear la tarea en el backend
             */
            const resultado = await crearTarea(taskData);
            
            /**
             * Si la creación es exitosa, redirigir a la página principal
             */
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

    /**
     * Maneja la cancelación del formulario y regresa a la página principal
     */
    const handleCancel = () => {
        navigate('/home');
    };

    /**
     * Mostrar pantalla de carga mientras se obtienen los usuarios
     */
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

                            <div className="form-group">
                                <label htmlFor="prioridad">Prioridad *</label>
                                <select
                                    id="prioridad"
                                    name="prioridad"
                                    value={formData.prioridad}
                                    onChange={handleChange}
                                    required
                                    disabled={submitting}
                                >
                                    <option value="Alta">Alta</option>
                                    <option value="Media">Media</option>
                                    <option value="Baja">Baja</option>
                                </select>
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