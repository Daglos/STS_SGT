import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { NavBar } from '../components/navBar';

const url = import.meta.env.VITE_URL;

const obtenerUsuarios = async () => {
    try {
        const response = await fetch(url + "/user/obtenerUsers");
        const data = await response.json();
        return data.data || data.usuarios || [];
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        return [];
    }
};

const obtenerGrupos = async () => {
    try {
        const response = await fetch(url + "/grupo");
        const data = await response.json();
        return data.data || [];
    } catch (error) {
        console.error("Error al obtener grupos:", error);
        return [];
    }
};

const obtenerGrupoPorId = async (groupId) => {
    try {
        const response = await fetch(url + `/grupo/${groupId}`);
        const data = await response.json();
        return data.data || null;
    } catch (error) {
        console.error("Error al obtener grupo:", error);
        return null;
    }
};

const crearTarea = async (taskData, isGroup = false, groupId = '') => {
    const endpoint = isGroup
        ? `${url}/task-groups/taskGroup/${groupId}/task`
        : `${url}/task/crearTask`;

    try {
        const response = await fetch(endpoint, {
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
    const [grupos, setGrupos] = useState([]);
    const [grupoSeleccionado, setGrupoSeleccionado] = useState('');
    const [miembrosGrupo, setMiembrosGrupo] = useState([]);
    const [assignAll, setAssignAll] = useState(false);
    const [assignedEmployees, setAssignedEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [mode, setMode] = useState('empleado');

    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        fechaLimite: '',
        idEmpleado: '',
        prioridad: 'Media',
        idJefe: usuario?.id || ''
    });

    useEffect(() => {
        const fetchData = async () => {
            const users = await obtenerUsuarios();
            const groups = await obtenerGrupos();
            setUsuarios(users);
            setGrupos(groups);
            setLoading(false);
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (!grupoSeleccionado) {
            setMiembrosGrupo([]);
            setAssignedEmployees([]);
            setAssignAll(false);
            return;
        }

        const fetchGroup = async () => {
            const group = await obtenerGrupoPorId(grupoSeleccionado);
            if (Array.isArray(group?.miembros)) {
                setMiembrosGrupo(group.miembros);
            } else if (Array.isArray(group?.members)) {
                setMiembrosGrupo(group.members);
            } else {
                setMiembrosGrupo([]);
            }
        };

        fetchGroup();
    }, [grupoSeleccionado]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (error) setError('');
    };

    const handleEmployeeCheckbox = (employeeId) => {
        setAssignedEmployees((prev) => {
            if (prev.includes(employeeId)) {
                return prev.filter((id) => id !== employeeId);
            }
            return [...prev, employeeId];
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            const baseTaskData = {
                titulo: formData.titulo,
                descripcion: formData.descripcion,
                fechaLimite: new Date(formData.fechaLimite).toISOString(),
                prioridad: formData.prioridad,
                idJefe: formData.idJefe,
            };

            let resultado;
            if (mode === 'grupo') {
                if (!grupoSeleccionado) {
                    throw new Error('Debes seleccionar un grupo para asignar la tarea');
                }

                if (!assignAll && assignedEmployees.length === 0) {
                    throw new Error('Debes seleccionar al menos un empleado del grupo o marcar asignar a todos');
                }

                const taskData = {
                    ...baseTaskData,
                    assignedEmployees: assignedEmployees,
                    assignAll,
                };

                resultado = await crearTarea(taskData, true, grupoSeleccionado);
            } else {
                if (!formData.idEmpleado) {
                    throw new Error('Debes seleccionar un empleado para la tarea');
                }

                const taskData = {
                    ...baseTaskData,
                    idEmpleado: formData.idEmpleado,
                };
                resultado = await crearTarea(taskData, false, '');
            }

            if (resultado.success) {
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
                        <h2>Cargando datos...</h2>
                    </div>
                </div>
            </>
        );
    }

    const miembroOptions = usuarios.filter((user) => miembrosGrupo.includes(user.id));

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
                            <label>Modo de asignación</label>
                            <div className="radio-group">
                                <label>
                                    <input
                                        type="radio"
                                        name="mode"
                                        value="empleado"
                                        checked={mode === 'empleado'}
                                        onChange={() => setMode('empleado')}
                                    />
                                    Empleado individual
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="mode"
                                        value="grupo"
                                        checked={mode === 'grupo'}
                                        onChange={() => setMode('grupo')}
                                    />
                                    Grupo de trabajo
                                </label>
                            </div>
                        </div>

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

                        {mode === 'grupo' ? (
                            <div className="group-task-section">
                                <div className="form-group">
                                    <label htmlFor="grupoSeleccionado">Grupo *</label>
                                    <select
                                        id="grupoSeleccionado"
                                        name="grupoSeleccionado"
                                        value={grupoSeleccionado}
                                        onChange={(e) => setGrupoSeleccionado(e.target.value)}
                                        disabled={submitting}
                                        required
                                    >
                                        <option value="">Selecciona un grupo</option>
                                        {grupos.map((group) => (
                                            <option key={group.id} value={group.id}>
                                                {group.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Asignar a</label>
                                    <label className="checkbox-inline">
                                        <input
                                            type="checkbox"
                                            checked={assignAll}
                                            onChange={(e) => setAssignAll(e.target.checked)}
                                            disabled={submitting || miembrosGrupo.length === 0}
                                        />
                                        Todos los miembros del grupo
                                    </label>
                                </div>

                                {!assignAll && (
                                    <div className="member-selection">
                                        <p className="member-selection-label">Selecciona empleados dentro del grupo</p>
                                        <div className="member-list">
                                            {miembroOptions.length === 0 ? (
                                                <p>No hay miembros en este grupo</p>
                                            ) : (
                                                miembroOptions.map((user) => (
                                                    <label key={user.id} className="member-checkbox">
                                                        <input
                                                            type="checkbox"
                                                            checked={assignedEmployees.includes(user.id)}
                                                            onChange={() => handleEmployeeCheckbox(user.id)}
                                                            disabled={submitting}
                                                        />
                                                        {user.nombre} {user.apellido}
                                                    </label>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
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
                        )}

                        <div className="form-row group-dates">
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

                        {mode === 'grupo' ? null : null}

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