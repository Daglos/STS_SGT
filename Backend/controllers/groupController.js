const { db } = require('../config/firebase');

const crearGrupo = async (req, res) => {
  try {
    const { nombre, adminId } = req.body;
    if (!nombre || !adminId) return res.status(400).json({ success: false, error: 'Faltan el nombre del grupo o el ID del jefe' });

    const grupoExistente = await db.collection('grupos').where('nombre', '==', nombre).limit(1).get();
    if (!grupoExistente.empty) {
      return res.status(409).json({ success: false, error: 'El grupo ya existe' });
    }

    const newGroup = {
      nombre,
      adminId,
      miembros: [],
      createdAt: new Date().toISOString(),
    };

    const docRef = await db.collection('grupos').add(newGroup);

    res.status(201).json({ success: true, message: 'Grupo creado', data: { id: docRef.id, ...newGroup } });
  } catch (error) {
    console.error('Error crearGrupo:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const asignarUsuarioAGrupo = async (req, res) => {
  try {
    const { idGrupo, idUsuario } = req.body;
    if (!idGrupo || !idUsuario) return res.status(400).json({ success: false, error: 'Falta idGrupo o idUsuario' });

    const grupoRef = db.collection('grupos').doc(idGrupo);
    const grupoSnap = await grupoRef.get();
    if (!grupoSnap.exists) return res.status(404).json({ success: false, error: 'Grupo no encontrado' });

    const grupo = grupoSnap.data();
    if (grupo.miembros.includes(idUsuario)) return res.status(400).json({ success: false, error: 'Usuario ya en el grupo' });
    if (grupo.miembros.length >= 5) return res.status(400).json({ success: false, error: 'Grupo lleno (máx. 5 miembros)' });

    const miembros = [...grupo.miembros, idUsuario];
    await grupoRef.update({ miembros });

    res.json({ success: true, message: 'Usuario agregado al grupo', data: { id: idGrupo, ...grupo, miembros } });
  } catch (error) {
    console.error('Error asignarUsuarioAGrupo:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const unirseAGrupo = async (req, res) => {
  try {
    const { idGrupo, idUsuario } = req.body;
    if (!idGrupo || !idUsuario) return res.status(400).json({ success: false, error: 'Falta idGrupo o idUsuario' });

    const grupoRef = db.collection('grupos').doc(idGrupo);
    const grupoSnap = await grupoRef.get();
    if (!grupoSnap.exists) return res.status(404).json({ success: false, error: 'Grupo no encontrado' });

    const grupo = grupoSnap.data();
    if (grupo.miembros.includes(idUsuario)) return res.status(400).json({ success: false, error: 'Ya eres miembro del grupo' });
    if (grupo.miembros.length >= 5) return res.status(400).json({ success: false, error: 'Grupo lleno (máx. 5 miembros)' });

    const miembros = [...grupo.miembros, idUsuario];
    await grupoRef.update({ miembros });

    res.json({ success: true, message: 'Te uniste al grupo', data: { id: idGrupo, ...grupo, miembros } });
  } catch (error) {
    console.error('Error unirseAGrupo:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const listarGrupos = async (req, res) => {
  try {
    const snapshot = await db.collection('grupos').get();
    const grupos = [];
    snapshot.forEach(doc => grupos.push({ id: doc.id, ...doc.data() }));
    res.json({ success: true, data: grupos });
  } catch (error) {
    console.error('Error listarGrupos:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const obtenerGrupoPorId = async (req, res) => {
  try {
    const { idGrupo } = req.params;
    if (!idGrupo) return res.status(400).json({ success: false, error: 'Falta el id del grupo' });

    const grupoRef = db.collection('grupos').doc(idGrupo);
    const grupoSnap = await grupoRef.get();
    if (!grupoSnap.exists) return res.status(404).json({ success: false, error: 'Grupo no encontrado' });

    res.json({ success: true, data: { id: grupoSnap.id, ...grupoSnap.data() } });
  } catch (error) {
    console.error('Error obtenerGrupoPorId:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const obtenerGruposPorUsuario = async (req, res) => {
  try {
    const { idUsuario } = req.params;
    if (!idUsuario) return res.status(400).json({ success: false, error: 'Falta el id del usuario' });

    const snapshot = await db.collection('grupos').where('miembros', 'array-contains', idUsuario).get();
    const grupos = [];
    snapshot.forEach(doc => grupos.push({ id: doc.id, ...doc.data() }));

    res.json({ success: true, data: grupos });
  } catch (error) {
    console.error('Error obtenerGruposPorUsuario:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  crearGrupo,
  asignarUsuarioAGrupo,
  unirseAGrupo,
  listarGrupos,
  obtenerGrupoPorId,
  obtenerGruposPorUsuario,
};