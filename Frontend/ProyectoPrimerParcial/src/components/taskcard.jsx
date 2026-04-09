
import { useNavigate } from "react-router-dom";

export const TaskCard = ({ task }) => {
  const navigate = useNavigate();

  return (
    <div
      className="task-card"
      onClick={() => navigate("/taskDetail", { state: { task } })}
    >
      <span className={`priority-badge ${task.prioridad?.toLowerCase()}`}>
        {task.prioridad || 'Sin prioridad'}
      </span>
      <p className="task-title">{task.titulo}</p>
      <p className="task-description">{task.descripcion}</p>
      <p>{task.estado}</p>
    </div>
  );
};