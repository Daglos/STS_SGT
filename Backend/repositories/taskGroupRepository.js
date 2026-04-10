const { db } = require('../config/firebase');
const TASK_GROUPS_COLLECTION = 'grupos';

async function createTaskGroup({ groupName, adminId, members = [], tasks = [] }) {
  const docRef = db.collection(TASK_GROUPS_COLLECTION).doc();
  const newGroup = {
    id: docRef.id,
    groupName,
    adminId,
    members,
    tasks,
    createdAt: new Date().toISOString(),
  };
  await docRef.set(newGroup);
  return newGroup;
}

async function getAllTaskGroups() {
  const snapshot = await db.collection(TASK_GROUPS_COLLECTION).get();
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      groupName: data.groupName || data.nombre,
      ...data,
    };
  });
}

async function getTaskGroupById(groupId) {
  const docRef = db.collection(TASK_GROUPS_COLLECTION).doc(groupId);
  const doc = await docRef.get();

  if (!doc.exists) {
    throw new Error('Grupo de tareas no encontrado');
  }

  return { id: doc.id, ...doc.data() };
}

async function addTaskToGroup(groupId, taskData, assignAll) {
  const groupRef = db.collection(TASK_GROUPS_COLLECTION).doc(groupId);
  const groupSnap = await groupRef.get();

  if (!groupSnap.exists) {
    throw new Error('Grupo de tareas no encontrado');
  }

  const group = groupSnap.data();
  const members = Array.isArray(group.members)
    ? group.members
    : Array.isArray(group.miembros)
    ? group.miembros
    : [];

  const assignedEmployees = assignAll
    ? [...members]
    : Array.isArray(taskData.assignedEmployees)
    ? taskData.assignedEmployees
    : taskData.assignedEmployees
    ? [taskData.assignedEmployees]
    : [];

  if (assignedEmployees.length === 0) {
    throw new Error('Debe asignar al menos un empleado a la tarea');
  }

  const invalidEmployees = assignedEmployees.filter((id) => !members.includes(id));
  if (invalidEmployees.length > 0) {
    throw new Error('Uno o más empleados asignados no pertenecen al grupo');
  }

  const taskId = db.collection(TASK_GROUPS_COLLECTION).doc().id;
  const newTask = {
    id: taskId,
    ...taskData,
    assignedEmployees,
    estado: taskData.estado || 'activo',
  };

  const tasks = Array.isArray(group.tasks) ? [...group.tasks, newTask] : [newTask];
  await groupRef.update({ tasks });

  return {
    ...newTask,
    groupId,
    groupName: group.groupName || group.nombre,
  };
}

async function updateGroupTask(groupId, taskId, updateData) {
  const groupRef = db.collection(TASK_GROUPS_COLLECTION).doc(groupId);
  const groupSnap = await groupRef.get();

  if (!groupSnap.exists) {
    throw new Error('Grupo de tareas no encontrado');
  }

  const group = groupSnap.data();
  const tasks = Array.isArray(group.tasks) ? [...group.tasks] : [];
  const taskIndex = tasks.findIndex((task) => task.id === taskId);

  if (taskIndex === -1) {
    throw new Error('Tarea grupal no encontrada');
  }

  const members = Array.isArray(group.members)
    ? group.members
    : Array.isArray(group.miembros)
    ? group.miembros
    : [];

  if (Array.isArray(updateData.assignedEmployees) && updateData.assignedEmployees.length > 0) {
    const invalidEmployees = updateData.assignedEmployees.filter((id) => !members.includes(id));
    if (invalidEmployees.length > 0) {
      throw new Error('Uno o más empleados asignados no pertenecen al grupo');
    }
  }

  tasks[taskIndex] = {
    ...tasks[taskIndex],
    ...updateData,
    assignedEmployees: Array.isArray(updateData.assignedEmployees)
      ? updateData.assignedEmployees
      : tasks[taskIndex].assignedEmployees,
  };

  await groupRef.update({ tasks });

  return {
    ...tasks[taskIndex],
    groupId,
    groupName: group.groupName || group.nombre,
  };
}

async function findGroupTaskById(taskId) {
  const snapshot = await db.collection(TASK_GROUPS_COLLECTION).get();

  for (const doc of snapshot.docs) {
    const group = doc.data();
    const tasks = Array.isArray(group.tasks) ? group.tasks : [];
    const task = tasks.find((item) => item.id === taskId);
    if (task) {
      return {
        groupId: doc.id,
        groupName: group.groupName || group.nombre,
        adminId: group.adminId,
        members: Array.isArray(group.members) ? group.members : Array.isArray(group.miembros) ? group.miembros : [],
        task,
      };
    }
  }

  return null;
}

async function updateTaskStateByTaskId(taskId, updateData) {
  const groupTask = await findGroupTaskById(taskId);
  if (!groupTask) {
    throw new Error('Tarea grupal no encontrada');
  }

  return updateGroupTask(groupTask.groupId, taskId, updateData);
}

async function getTasksAssignedToEmployee(idUsuario) {
  const groups = await getAllTaskGroups();
  const assignedTasks = [];

  groups.forEach((group) => {
    const tasks = Array.isArray(group.tasks) ? group.tasks : [];
    tasks.forEach((task) => {
      if (Array.isArray(task.assignedEmployees) && task.assignedEmployees.includes(idUsuario)) {
        assignedTasks.push({
          ...task,
          id: task.id,
          groupId: group.id,
          groupName: group.groupName || group.nombre,
        });
      }
    });
  });

  return assignedTasks;
}

module.exports = {
  createTaskGroup,
  getAllTaskGroups,
  getTaskGroupById,
  addTaskToGroup,
  updateGroupTask,
  findGroupTaskById,
  updateTaskStateByTaskId,
  getTasksAssignedToEmployee,
};