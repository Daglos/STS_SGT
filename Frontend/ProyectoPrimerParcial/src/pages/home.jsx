import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useState } from "react";
import { NavBar } from "../components/navBar";
import { TaskCard } from "../components/taskcard";
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
export const Home = () => {
    const { usuario, loading } = useAuth();

    const navigate = useNavigate()
    const [tasks, setTasks] = useState([])

    const [labelNoTasksDisponibles, setLabelNoTasksDisponibles] = useState("")

    /**
 * Función para obtener las tareas de un usuario específico
 * Realiza una petición GET al backend filtrando por ID de usuario
 */
    const obtenerTasks = async (idUsuario) => {
        try {
            const response = await fetch(url + `/task/obtenerTaskPorId?idUsuario=${idUsuario}`)
            const data = await response.json()
            console.log("hola: " + data.data)
            return data.data
        }
        catch (error) {
            console.log(error)
            return []
        }



    }

    /**
     * Funciones para gestionar la visibilidad del mensaje de "No hay tareas"
     * Actualizan el estado del label según la disponibilidad de tareas pendientes
     */
    const showLabelTagNoTasksDisponibles = () => {
        setLabelNoTasksDisponibles("No tienes tareas pendientes a realizar")
    }
    const hideLabelTagNoTasksDisponibles = () => {
        setLabelNoTasksDisponibles("")
    }


    /**
     * Efecto para cargar las tareas del usuario al montar el componente
     * Se ejecuta cuando el usuario está autenticado y los datos de sesión han cargado
     */
    useEffect(() => {


        if (!loading && usuario?.id) {
            console.log(usuario)
            const fetchTasks = async () => {
                const data = await obtenerTasks(usuario.id);
                setTasks(ordenarPorPrioridad(data || []));
            };
            fetchTasks();

            const verificarTareas = async () => {
                try {
                    await fetch(url + `/task/verificar-vencidas?idEmpleado=${usuario.id}`, {
                        method: 'PUT'
                    });
                } catch (error) {
                    console.log(error);
                }
            };

            if (usuario) {
                verificarTareas();
            }

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

    const tareasActivas = tasks.filter(task => task.estado === "activo");
    const tareasEnCurso = tasks.filter(task => task.estado === "En Curso");
    const tareasRetrasadas = tasks.filter(task => task.estado === "retrasada");


    if (!usuario) {
        return "";
    }
    return (
        <>
            <NavBar />

            <div className="home-container">
                <div className="tasks-container">
                    {labelNoTasksDisponibles && <h2>{labelNoTasksDisponibles}</h2>}

                    <div className="tasks-section">
                        <h2>Tareas Pendientes</h2>
                        {tareasActivas.map(task => (
                            <TaskCard key={task.id} task={task} usuario={usuario} />
                        ))}
                    </div>


                    <div className="tasks-section">
                        <h2>Tareas En Curso</h2>
                        {tareasEnCurso.map(task => (
                            <TaskCard key={task.id} task={task} usuario={usuario} />
                        ))}
                    </div>

                    <div className="tasks-section">
                        <h2>Tareas Retrasadas</h2>
                        {tareasRetrasadas.map(task => (
                            <TaskCard key={task.id} task={task} usuario={usuario} />
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}