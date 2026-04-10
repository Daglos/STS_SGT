import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from "./context/authContext";
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import {Login} from './pages/login';
import { HistoryOfTask } from './pages/historyOfTask';
import { Home } from './pages/home';
import { TaskDetail } from './pages/taskDetail';
import { Register } from './pages/register';
import { CreateTask } from './pages/createTask';
import { ForgotPassword } from './pages/forgotPassword';
import { UpdateTask } from './pages/updateTask';
import { JefeTaskDetail } from './pages/jefeTaskDetail';
import { GroupAssignment } from './pages/GroupAssignment';
import './less/index.less';

/**
 * Componente principal de la aplicación
 * Maneja el enrutamiento y la redirección basada en el estado de autenticación del usuario
 */
function App() {
  const { usuario, login, logout, loading, isAuthenticated } = useAuth();
    const navigate=useNavigate()
    
    /**
     * Efecto para redirigir al usuario según su estado de autenticación
     * Si no hay usuario autenticado y no está cargando, redirige a login
     * Si hay usuario autenticado, redirige a home
     */
    useEffect(()=>{
        if (!usuario && !loading){
            navigate("/login")
        }
        if (usuario){
          navigate('/home')
        }
    },[usuario,login])

  /**
   * Definición de las rutas de la aplicación
   */
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/taskDetail" element={<TaskDetail/>}/>
      <Route path="/jefeTaskDetail" element={<JefeTaskDetail/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path='/forgotPassword' element={<ForgotPassword/>}/>
      <Route path="/createTask" element={<CreateTask/>}/>
      <Route path="/historyOfTask" element={<HistoryOfTask/>}/>
      <Route path="/updateTask" element={<UpdateTask/>}/>
      <Route path="/home" element={<Home/>}/>
       {/* Agregamos la ruta de Asignación de Grupos */}
      <Route path="/grupos" element={<GroupAssignment userId={usuario?.id} isAdmin={usuario?.idrol === "QUwARFWEdbC3A7iCBMBX"} />} />
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
    </Routes>
  );
}

export default App;