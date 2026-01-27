import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useState } from "react";
const url = import.meta.env.VITE_URL;

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

export const HistoryOfTask=()=>{
    const { usuario,loading } = useAuth();
   const navigate=useNavigate()
    const [tasks , setTasks]=useState([])
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
        <div className="home-container">
             <button className="goToButton" onClick={()=>{navigate("/home")}}>Volver</button>
            <div className="tasks-container">
                {
                tasks.map((task)=>{
                    if (task.estado==null || task.estado==undefined || task.estado=="activo"){
                        return
                    }
                    else{
                         return(
                    
                       
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
    )
}