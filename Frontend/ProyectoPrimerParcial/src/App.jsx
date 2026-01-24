
import { Routes, Route, Navigate } from 'react-router-dom';
import {Login} from './pages/login';
import './less/index.less';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
    </Routes>
  );
}

export default App;