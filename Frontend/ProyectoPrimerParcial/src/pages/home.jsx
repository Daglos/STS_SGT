import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useState } from "react";
import { NavBar } from "../components/navBar";
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

export const Home=()=>{
    const { usuario,loading } = useAuth();
    
   const navigate=useNavigate()
    const [tasks , setTasks]=useState([])
    
    const [labelNoTasksDisponibles,setLabelNoTasksDisponibles]=useState("")

    const showLabelTagNoTasksDisponibles=()=>{
        setLabelNoTasksDisponibles("No tienes tareas pendientes a realizar")
    }
    const hideLabelTagNoTasksDisponibles=()=>{
        setLabelNoTasksDisponibles("")
    }


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

    useEffect(()=>{
        let contadorTasksDisponibles=0
        tasks.map((task)=>{
                    if (task.estado==null || task.estado==undefined || task.estado=="inactivo"){
                        return
                    }
                    else{
                        contadorTasksDisponibles+=1
                    }
                }
                
            
            )
        if (contadorTasksDisponibles>0){
            hideLabelTagNoTasksDisponibles()
            
        }
        else{
           showLabelTagNoTasksDisponibles()
        }
    },[tasks,usuario,loading])

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
    return(
        <>
        <NavBar/>
        <div className="home-container">
            {usuario.idRol=="QUwARFWEdbC3A7iCBMBX" ? <button className="createTaskButton" onClick={()=>{navigate('/createTask')}}>Crear tareas</button> : <></>}
            <button className="goToButton" onClick={()=>{navigate("/historyOfTask")}}>Mirar el historial de tareas realizadas</button>
            <div className="tasks-container">
                {labelNoTasksDisponibles=="" ? <></> : <h2>{labelNoTasksDisponibles}</h2> }
                
                {
                    
                tasks.map((task)=>{
                    if (task.estado==null || task.estado==undefined || task.estado=="inactivo"){
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
        </>
    )
}