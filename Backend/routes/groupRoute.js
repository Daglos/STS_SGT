const express = require('express');
const router = express.Router();
const {
  crearGrupo,
  asignarUsuarioAGrupo,
  unirseAGrupo,
  listarGrupos,
  obtenerGrupoPorId,
  obtenerGruposPorUsuario,
} = require('../controllers/groupController');

// Admin crea grupo
router.post('/crear', crearGrupo);

// Admin asigna usuario a grupo
router.post('/asignar', asignarUsuarioAGrupo);

// Usuario se une a un grupo
router.post('/unirse', unirseAGrupo);

// Listar todos los grupos
router.get('/', listarGrupos);

// Obtener grupos donde un usuario es miembro
router.get('/usuario/:idUsuario', obtenerGruposPorUsuario);

// Obtener un grupo por ID
router.get('/:idGrupo', obtenerGrupoPorId);

module.exports = router;