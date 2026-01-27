import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useState } from "react";
const url = import.meta.env.VITE_URL;

const obtenerTasks=async()=>{
    try{
    const response=await fetch(url+'/task/obtenerTasks')
    const data=await response.json()
        console.log(data.data)
    return data.data
    }
    catch(error){
        console.log(error)
        return []
    }
}

export const Home=()=>{
    const [tasks , setTasks]=useState([])
    useEffect(() => {
    const fetchTasks = async () => {
        const data = await obtenerTasks();
        setTasks(data); 
    };

    fetchTasks();
}, []);
    return(
        <div className="home-container">
            <div className="tasks-container">
                {
                tasks.map((task)=>{
                    return(
                        <div className="task-card" key={task.id}>
                        <p className="task-title">
                            {task.titulo}
                        </p>
                        <p className="task-description">
                            {task.descripcion}
                        </p>
                        <button>Tarea realizada</button>
                        </div>
                    )
                })}
                
            </div>
        </div>
    )
}