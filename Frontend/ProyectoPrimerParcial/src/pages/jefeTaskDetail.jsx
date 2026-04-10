import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useState } from "react";
import { NavBar } from "../components/navBar";
import { TaskCard } from "../components/taskcard";
import "../less/pages/jefeTaskDetail.less";
const url = import.meta.env.VITE_URL;

const PRIORIDAD_ORDEN = {
    Alta: 0,
    Media: 1,
    Baja: 2,
};

const ordenarPorPrioridad = (tasks) => {
    return [...tasks].sort((a, b) => {
        const prioridadA = PRIORIDAD_ORDEN[a.prioridad] ?? Object.keys(PRIORIDAD_ORDEN).length;
        const prioridadB = PRIORIDAD_ORDEN[b.prioridad] ?? Object.keys(PRIORIDAD_ORDEN).length;
        return prioridadA - prioridadB;
    });
};



/**
 * Componente de página principal (Home)
 * Muestra las tareas pendientes del usuario y gestiona el acceso a la creación e historial
 */
export const JefeTaskDetail = () => {
    const { usuario, loading } = useAuth();

    const navigate = useNavigate()
    const [tasks, setTasks] = useState([])

    const [labelNoTasksDisponibles, setLabelNoTasksDisponibles] = useState("")

    /**
 * Función para obtener las tareas de un usuario específico
 * Realiza una petición GET al backend filtrando por ID de usuario
 */
    const obtenerTasks = async (idUsuario) => {
        console.log("ID del usuario:", idUsuario);
        console.log("Rol del usuario:", usuario.idRol);
        if (usuario.idRol !== "QUwARFWEdbC3A7iCBMBX") {
            return [];
        }
        try {
            const response = await fetch(url + `/task/obtenerTaskPorIdJefe?idjefe=${idUsuario}`)
            const data = await response.json()
            console.log(data.data)
            return Array.isArray(data.data) ? data.data : [];
        }
        catch (error) {
            console.log(error)
            return []
        }
    }

    const obtenerTareasDeGruposPorJefe = async (idJefe) => {
        try {
            const response = await fetch(url + `/task-groups/taskGroups`)
            const data = await response.json()
            const groups = Array.isArray(data.data) ? data.data : [];
            const tasks = [];

            groups.forEach((group) => {
                const groupTasks = Array.isArray(group.tasks) ? group.tasks : [];
                groupTasks.forEach((task) => {
                    if (task.idJefe === idJefe || group.adminId === idJefe) {
                        tasks.push({
                            ...task,
                            groupId: group.id,
                            groupName: group.groupName || group.nombre,
                        });
                    }
                });
            });

            return tasks;
        } catch (error) {
            console.log(error);
            return [];
        }
    }


    /**
     * Funciones para gestionar la visibilidad del mensaje de "No hay tareas"
     * Actualizan el estado del label según la disponibilidad de tareas pendientes
     */
    const showLabelTagNoTasksDisponibles = () => {
        setLabelNoTasksDisponibles("No haz asignado tareas")
    }
    const hideLabelTagNoTasksDisponibles = () => {
        setLabelNoTasksDisponibles("")
    }


    /**
     * Efecto para cargar las tareas del usuario al montar el componente
     * Se ejecuta cuando el usuario está autenticado y los datos de sesión han cargado
     */
    useEffect(() => {

        if (loading) return; // 👈 esperar a que cargue

        if (!usuario) {
            navigate("/");
            return;
        }

        if (usuario.idRol !== "QUwARFWEdbC3A7iCBMBX") {
            navigate("/home");
            return;
        }

        if (usuario?.id) {
            const fetchTasks = async () => {
                const [directTasks, groupTasks] = await Promise.all([
                    obtenerTasks(usuario.id),
                    obtenerTareasDeGruposPorJefe(usuario.id),
                ]);
                const allTasks = [...directTasks, ...groupTasks];
                setTasks(ordenarPorPrioridad(allTasks));
            };
            fetchTasks();
        }

    }, [usuario, loading]);

    /**
     * Efecto para verificar la existencia de tareas activas
     * Cuenta las tareas válidas y determina si se debe mostrar el mensaje de "No hay tareas"
     */
    useEffect(() => {
        let contadorTasksDisponibles = 0
        tasks.map((task) => {
            if (task.estado == null || task.estado == undefined || task.estado == "inactivo") {
                return
            }
            else {
                contadorTasksDisponibles += 1
            }
        }


        )
        if (contadorTasksDisponibles > 0) {
            hideLabelTagNoTasksDisponibles()

        }
        else {
            showLabelTagNoTasksDisponibles()
        }
    }, [tasks, usuario, loading])

    if (loading) {
        return (
            <div className="home-container">
                <p style={{ color: 'white', textAlign: 'center' }}>Cargando...</p>
            </div>
        );
    }


    if (!usuario) {
        return "";
    }

    const tareasDirectas = tasks.filter(task => !task.groupId);
    const tareasGrupales = tasks.filter(task => task.groupId);

    const directasActivas = tareasDirectas.filter(task => task.estado === "activo");
    const directasEnCurso = tareasDirectas.filter(task => task.estado === "En Curso");
    const directasRetrasadas = tareasDirectas.filter(task => task.estado === "retrasada");
    const directasInactivas = tareasDirectas.filter(task => task.estado === "inactivo");

    const grupalesActivas = tareasGrupales.filter(task => task.estado === "activo");
    const grupalesEnCurso = tareasGrupales.filter(task => task.estado === "En Curso");
    const grupalesRetrasadas = tareasGrupales.filter(task => task.estado === "retrasada");
    const grupalesInactivas = tareasGrupales.filter(task => task.estado === "inactivo");

    return (
        <>
            <NavBar />
            <div className="home-container jefe-task-detail">
                <div className="tasks-container jefe-tasks-container">
                    {labelNoTasksDisponibles && <h2>{labelNoTasksDisponibles}</h2>}
                    <h2>Tareas Directas</h2>
                    <div className="tasks-section jefe">
                        

                        <div className="tasks-subsection">
                            <h3>Pendientes</h3>
                            {directasActivas.map(task => (
                                <TaskCard key={task.id} task={task} usuario={usuario} />
                            ))}
                        </div>

                        <div className="tasks-subsection">
                            <h3>En Curso</h3>
                            {directasEnCurso.map(task => (
                                <TaskCard key={task.id} task={task} usuario={usuario} />
                            ))}
                        </div>

                        <div className="tasks-subsection">
                            <h3>Retrasadas</h3>
                            {directasRetrasadas.map(task => (
                                <TaskCard key={task.id} task={task} usuario={usuario} />
                            ))}
                        </div>

                        <div className="tasks-subsection">
                            <h3>Completadas</h3>
                            {directasInactivas.map(task => (
                                <TaskCard key={task.id} task={task} usuario={usuario} />
                            ))}
                        </div>
                    </div>

                    <div className="tasks-section jefe group-tasks-section">
                        <h2>Tareas Grupales</h2>

                        <div className="tasks-subsection">
                            <h3>Pendientes</h3>
                            {grupalesActivas.map(task => (
                                <TaskCard key={task.id} task={task} usuario={usuario} />
                            ))}
                        </div>

                        <div className="tasks-subsection">
                            <h3>En Curso</h3>
                            {grupalesEnCurso.map(task => (
                                <TaskCard key={task.id} task={task} usuario={usuario} />
                            ))}
                        </div>

                        <div className="tasks-subsection">
                            <h3>Retrasadas</h3>
                            {grupalesRetrasadas.map(task => (
                                <TaskCard key={task.id} task={task} usuario={usuario} />
                            ))}
                        </div>

                        <div className="tasks-subsection">
                            <h3>Completadas</h3>
                            {grupalesInactivas.map(task => (
                                <TaskCard key={task.id} task={task} usuario={usuario} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}