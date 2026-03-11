import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { NavBar } from "../components/navBar";
import { useAuth } from "../context/authContext";
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
 * Componente de detalle de tarea
 * Muestra la información completa de una tarea seleccionada y permite marcarla como completada
 */
export const UpdateTask = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { task } = location.state || {};

    const { usuario } = useAuth();
    const [taskState, setTaskState] = useState(task);
    const [loading, setLoading] = useState(false);

    const [usuarios, setUsuarios] = useState([]);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({    });

    useEffect(() => {
    if (task) {
        setFormData({
            titulo: task.titulo || '',
            descripcion: task.descripcion || '',
            fechaLimite: task.fechaLimite
                ? new Date(task.fechaLimite).toISOString().slice(0,16)
                : '',
            idEmpleado: task.idEmpleado || '',
            idJefe: task.idJefe || usuario?.id || '',
            estado: task.estado || 'activo'
        });
    }
}, [task, usuario]);

    /**
     * Función para actualizar los datos de la tarea en el backend
     * Realiza una petición PUT al servidor y actualiza los datos locales tras el éxito
     */
    
    const actualizarTask = async (taskData) => {
        try {
            const response = await fetch(url + `/task/actualizarTask?id=${taskState.id}`, {
                method: "PUT",
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
            console.error("Error al actualizar tarea:", error);
            throw error;
        }
    }

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
                fechaLimite: new Date(formData.fechaLimite).toISOString()
            };

            /**
             * Intentar actualizar la tarea en el backend
             */
            const resultado = await actualizarTask(taskData);

            /**
             * Si la actualización es exitosa, redirigir a la página principal
             */
            if (resultado.success) {
                console.log("Tarea actualizada exitosamente:", resultado.data);
                navigate('/home');
            } else {
                setError('Error al actualizar la tarea');
            }
        } catch (error) {
            console.error("Error al actualizar tarea:", error);
            setError(error.message || 'Error al actualizar la tarea. Por favor intenta de nuevo.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigate('/home');
    };


    /**
     * Renderizado condicional en caso de que no existan datos de la tarea
     * Proporciona una opción de navegación para volver al inicio
     */
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

    /**
     * Función auxiliar para normalizar y mostrar fechas
     * Maneja formatos de Timestamp (Firebase) y cadenas de texto estándar
     */
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
                    <h1 className="create-task-title">Actualizar Tarea</h1>
                    <p className="create-task-subtitle">Completa los campos para actualizar la tarea</p>

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
                                {submitting ? 'Actualizando...' : 'Actualizar Tarea'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}