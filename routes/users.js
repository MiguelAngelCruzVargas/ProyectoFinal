const { Router } = require('express')

const {
    
    deteleUsers,
    listPlayers,
    listPlayersByID,
    addPlayer,
    updatePlayer,
    listUsers,
    //listPName
} = require('../controllers/users');

const router = Router();

//http://localhost:3000/api/v1/fifa/

// Rutas
router.get('/L', listPlayers); //obtiene la lista de  los usuarios en la  BD--listo
router.get('/:id', listPlayersByID); // obtiene la lista de  los usuarios en la  BD por ID--listo
router.get('/', listUsers); // Busca jugadores por nombre
router.put(' /', addPlayer); //Agrega un nuevo usuario //
router.delete('/:id', deteleUsers);//sirve
router.patch('/:id', updatePlayer);//  Actualiza un usuario por su ID //revisar


module.exports = router;
