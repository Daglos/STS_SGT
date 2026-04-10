
import { useNavigate } from "react-router-dom";

export const TaskCard = ({ task, usuario }) => {
  const navigate = useNavigate();

  return (
    <div
      className="task-card"
      onClick={() => navigate("/taskDetail", { state: { task } })}
    >
      <div className="Badges">
        <span className={`priority-badge ${task.prioridad?.toLowerCase()}`}>
          {task.prioridad || 'Sin prioridad'}
        </span>
        <span className={`Estado ${task.estado?.toLowerCase()}`}>
          {task.estado || 'Sin estado'}
        </span>
      </div>

      <p className="task-title">{task.titulo}</p>
      <p className="task-description">{task.descripcion}</p>
      {task.groupName ? <p className="task-group">Grupo: {task.groupName}</p> : null}

      {usuario.idRol == "QUwARFWEdbC3A7iCBMBX" ? <p className="task-employee">
        Empleado asignado: {task.nombreEmpleado || usuario.nombre + " " + usuario.apellido}
      </p> : <></>}


      {usuario.idRol == "QUwARFWEdbC3A7iCBMBX" ? <button className="updateTaskButton" onClick={(e) => {
        e.stopPropagation();
        navigate('/updateTask',
          {
            state: {
              task
            }
          }
        )
      }}>Modificar tarea</button> : <></>}
    </div>
  );
};