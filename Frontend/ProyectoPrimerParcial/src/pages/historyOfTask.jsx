import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useState } from "react";
import { NavBar } from "../components/navBar";
const url = import.meta.env.VITE_URL;

/**
 * Función para obtener las tareas de un usuario específico
 * Realiza una petición GET al backend filtrando por ID de usuario
 */
const obtenerTasks=async(idUsuario)=>{
    try{
    const response=await fetch(url+`/task/obtenerTaskPorId?idUsuario=${idUsuario}`)
    const data=await response.json()
        console.log(data.data)
    return data.data
    }
    catch(error){
        console.log(error)
        return []
    }
}

/**
 * Componente de página para mostrar el historial de tareas completadas
 * Muestra solo las tareas que no tienen estado activo
 */
export const HistoryOfTask=()=>{
    const { usuario,loading } = useAuth();
   const navigate=useNavigate()
    const [tasks , setTasks]=useState([])
    
    /**
     * Efecto para cargar las tareas del usuario al montar el componente
     * Solo se ejecuta cuando el usuario está autenticado y disponible
     */
    useEffect(() => {
    
    if (!loading && usuario?.id){
        console.log(usuario)
    const fetchTasks = async () => {
      
        const data = await obtenerTasks(usuario.id);
        setTasks(data); 
    };
        fetchTasks();
    }


}, [usuario,loading]);

    return(
        <>
        <NavBar/>
        <div className="home-container">
 
             <button className="goToButton" onClick={()=>{navigate("/home")}}>Volver</button>
            <div className="tasks-container">
                {
                /**
                 * Iterar sobre las tareas y renderizar solo las completadas
                 * Filtra las tareas que no tienen estado activo
                 */
                tasks.map((task)=>{
                    if (task.estado==null || task.estado==undefined || task.estado=="activo"){
                        return
                    }
                    else{
                         return(
                    
                       /**
                        * Renderizar tarjeta de tarea con navegación al detalle
                        */
                        <div className="task-card" key={task.id} onClick={()=>{navigate('/taskDetail', 
                            { 
                            state: { 
                                task
                            } 
                            });}}>
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