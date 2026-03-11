import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useState } from "react";
import { NavBar } from "../components/navBar";
const url = import.meta.env.VITE_URL;



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
            console.log("hola: "+data.data)
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
                setTasks(data);
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
    return (
        <>
            <NavBar />
            <div className="home-container">

                <div className="tasks-container">
                    {/**
                  * Mostrar mensaje de aviso si no hay tareas pendientes identificadas
                  */}
                    {labelNoTasksDisponibles == "" ? <></> : <h2>{labelNoTasksDisponibles}</h2>}

                    {

                        /**
                         * Iterar sobre las tareas y renderizar solo las que están en estado activo
                         * Ignora tareas inactivas, nulas o sin estado definido
                         */
                        tasks.map((task) => {
                            if (task.estado == null || task.estado == undefined || task.estado == "inactivo") {
                                return
                            }
                            else {
                                return (



                                    /**
                                     * Renderizar tarjeta de tarea con navegación al detalle
                                     * Envía el objeto de la tarea a través del estado de navegación
                                     */
                                    <div className="task-card" key={task.id} onClick={() => {
                                        navigate('/taskDetail',
                                            {
                                                state: {
                                                    task
                                                }
                                            });
                                    }}>
                                        
                                        <p className="task-title">
                                            {task.titulo}
                                        </p>
                                        <p className="task-description">
                                            {task.descripcion}
                                        </p>


                                    </div>

                                )
                            }

                        })}

                </div>
            </div>
        </>
    )
}