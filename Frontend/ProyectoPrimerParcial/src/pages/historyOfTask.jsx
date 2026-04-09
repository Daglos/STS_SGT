import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useState } from "react";
import { NavBar } from "../components/navBar";
import { TaskCard } from "../components/taskcard";
const url = import.meta.env.VITE_URL;

/**
 * Función para obtener las tareas de un usuario específico
 * Realiza una petición GET al backend filtrando por ID de usuario
 */
const obtenerTasks = async (idUsuario) => {
    try {
        const response = await fetch(url + `/task/obtenerTaskPorId?idUsuario=${idUsuario}`)
        const data = await response.json()
        console.log(data.data)
        return data.data
    }
    catch (error) {
        console.log(error)
        return []
    }
}

/**
 * Componente de página para mostrar el historial de tareas completadas
 * Muestra solo las tareas que no tienen estado activo
 */
export const HistoryOfTask = () => {
    const { usuario, loading } = useAuth();
    const navigate = useNavigate()
    const [tasks, setTasks] = useState([])

    /**
     * Efecto para cargar las tareas del usuario al montar el componente
     * Solo se ejecuta cuando el usuario está autenticado y disponible
     */
    useEffect(() => {

        if (!loading && usuario?.id) {
            console.log(usuario)
            const fetchTasks = async () => {

                const data = await obtenerTasks(usuario.id);
                setTasks(data);
            };
            fetchTasks();
        }


    }, [usuario, loading]);

    const tareasInactivas = tasks.filter(task => task.estado === "inactivo");

    return (
        <>
            <NavBar />
            <div className="home-container">
                <h2>Historial de Tareas Completadas</h2>
                <div className="tasks-container history">
                    
                    <div className="tasks-section history">
                        {tareasInactivas.map(task => (
                            <TaskCard key={task.id} task={task} usuario={usuario} />
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}