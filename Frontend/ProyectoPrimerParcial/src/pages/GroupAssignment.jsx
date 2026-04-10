import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NavBar } from '../components/navBar';
import { useAuth } from '../context/authContext';

export const GroupAssignment = () => {
  const { usuario } = useAuth();
  const isAdmin = usuario?.idrol === 'QUwARFWEdbC3A7iCBMBX' || usuario?.idRol === 'QUwARFWEdbC3A7iCBMBX';
  const userId = usuario?.id;

  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [groupDetails, setGroupDetails] = useState(null);
  const [users, setUsers] = useState([]);
  const [createName, setCreateName] = useState('');
  const [selectedUserToAssign, setSelectedUserToAssign] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const BACKEND_URL = import.meta.env.VITE_URL;

  const fetchGroups = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/grupo`);
      if (res.data?.data) {
        setGroups(res.data.data);
      } else {
        setGroups([]);
      }
    } catch (err) {
      console.error('Error cargando grupos:', err);
      setMessage('No se pudieron cargar los grupos');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/user/obtenerUsers`);
      const data = await response.json();
      setUsers(data.data || data.usuarios || []);
    } catch (err) {
      console.error('Error cargando usuarios:', err);
    }
  };

  const fetchGroupDetails = async (groupId) => {
    if (!groupId) {
      setGroupDetails(null);
      return;
    }

    try {
      const res = await axios.get(`${BACKEND_URL}/grupo/${groupId}`);
      if (res.data?.data) {
        setGroupDetails(res.data.data);
      }
    } catch (err) {
      console.error('Error cargando detalles del grupo:', err);
      setGroupDetails(null);
    }
  };

  useEffect(() => {
    fetchGroups();
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  useEffect(() => {
    fetchGroupDetails(selectedGroup);
    setSelectedUserToAssign('');
    setMessage('');
  }, [selectedGroup]);

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!createName || !userId) {
      setMessage('Debes ingresar el nombre del grupo');
      return;
    }

    try {
      const res = await axios.post(`${BACKEND_URL}/grupo/crear`, {
        nombre: createName,
        adminId: userId,
      });
      setMessage(res.data.message || 'Grupo creado');
      setCreateName('');
      fetchGroups();
    } catch (err) {
      console.error('Error creando grupo:', err);
      setMessage(err.response?.data?.error || 'No se pudo crear el grupo');
    }
  };

  const handleJoinGroup = async () => {
    if (!selectedGroup) {
      setMessage('Selecciona un grupo primero');
      return;
    }

    try {
      const res = await axios.post(`${BACKEND_URL}/grupo/unirse`, {
        idGrupo: selectedGroup,
        idUsuario: userId,
      });
      setMessage(res.data.message || 'Te uniste al grupo');
      fetchGroups();
      fetchGroupDetails(selectedGroup);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || 'Error al unirse al grupo');
    }
  };

  const handleAssignUser = async () => {
    if (!selectedGroup || !selectedUserToAssign) {
      setMessage('Selecciona un grupo y un empleado');
      return;
    }

    try {
      const res = await axios.post(`${BACKEND_URL}/grupo/asignar`, {
        idGrupo: selectedGroup,
        idUsuario: selectedUserToAssign,
      });
      setMessage(res.data.message || 'Usuario agregado al grupo');
      setSelectedUserToAssign('');
      fetchGroups();
      fetchGroupDetails(selectedGroup);
    } catch (err) {
      console.error('Error asignando usuario:', err);
      setMessage(err.response?.data?.error || 'Error al asignar usuario');
    }
  };

  const groupMembers = groupDetails?.miembros || [];
  const availableEmployees = users.filter((user) => !groupMembers.includes(user.id));
  const memberNames = groupMembers.map((memberId) => {
    const matched = users.find((user) => user.id === memberId);
    return matched ? `${matched.nombre} ${matched.apellido}` : memberId;
  });

  return (
    <>
      <NavBar />
      <div className="group-assignment-container">
        <div className="group-assignment-card">
          <h1>Administrar Grupos de Trabajo</h1>
          <p className="section-subtitle">Crea grupos, asigna empleados y permite a los colaboradores unirse.</p>

          {message && <div className="group-message">{message}</div>}

          {isAdmin && (
            <section className="section-block">
              <h2>Crear nuevo grupo</h2>
              <form className="group-form" onSubmit={handleCreateGroup}>
                <div className="form-group">
                  <label htmlFor="groupName">Nombre del grupo</label>
                  <input
                    id="groupName"
                    type="text"
                    value={createName}
                    onChange={(e) => setCreateName(e.target.value)}
                    placeholder="Nombre del grupo"
                  />
                </div>
                <button type="submit" className="btn-submit">Crear grupo</button>
              </form>
            </section>
          )}

          <section className="section-block">
            <h2>Seleccionar grupo</h2>
            <div className="form-group">
              <label htmlFor="selectGroup">Grupo</label>
              <select
                id="selectGroup"
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
              >
                <option value="">-- Selecciona un grupo --</option>
                {groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.nombre} ({group.miembros?.length || 0}/5)
                  </option>
                ))}
              </select>
            </div>

            {groupDetails && (
              <div className="group-details">
                <h3>{groupDetails.nombre}</h3>
                <p>Creado por: {groupDetails.adminId}</p>
                <p>Miembros: {groupMembers.length}/5</p>
                <div className="member-list">
                  {memberNames.length > 0 ? (
                    memberNames.map((name, index) => (
                      <span key={`${name}-${index}`} className="member-chip">{name}</span>
                    ))
                  ) : (
                    <p className="empty-text">Este grupo todavía no tiene miembros.</p>
                  )}
                </div>
              </div>
            )}

            <div className="action-buttons">
              {isAdmin ? (
                <div className="assign-section">
                  <label htmlFor="assignUser">Asignar empleado al grupo</label>
                  <select
                    id="assignUser"
                    value={selectedUserToAssign}
                    onChange={(e) => setSelectedUserToAssign(e.target.value)}
                  >
                    <option value="">-- Selecciona un empleado --</option>
                    {availableEmployees.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.nombre} {user.apellido}
                      </option>
                    ))}
                  </select>
                  <button onClick={handleAssignUser} disabled={!selectedGroup || !selectedUserToAssign}>
                    Asignar empleado
                  </button>
                </div>
              ) : (
                <button onClick={handleJoinGroup} disabled={!selectedGroup}>
                  Unirse al grupo
                </button>
              )}
            </div>
          </section>
        </div>
      </div>
    </>
  );
};
