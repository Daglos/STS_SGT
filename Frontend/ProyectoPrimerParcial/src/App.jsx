
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from "./context/authContext";
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import {Login} from './pages/login';
import { HistoryOfTask } from './pages/historyOfTask';
import { Home } from './pages/home';
import { TaskDetail } from './pages/taskDetail';
import './less/index.less';

function App() {
  const { usuario, login, logout, loading, isAuthenticated } = useAuth();
    const navigate=useNavigate()
    useEffect(()=>{
        if (!usuario && !loading){
            navigate("/login")
        }
        if (usuario){
          navigate('/home')
        }
    },[usuario,login])
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/taskDetail" element={<TaskDetail/>}/>
      <Route path="/historyOfTask" element={<HistoryOfTask/>}/>
      <Route path="/home" element={<Home/>}/>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
    </Routes>
  );
}

export default App;