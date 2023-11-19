const { Router } = require("express");

const {
  deteleUsers,
  listPlayers,
  listPlayersByID,
  addPlayer,
  updatePlayer,
  //listUsers,
  listPlayersByName,
} = require("../controllers/fifa");

const router = Router();

//http://localhost:3000/api/v1/fifa/

// Rutas
router.get("/short_name", listPlayersByName);//para busqueda por nombre corto (short_name)

router.get("/L", listPlayers);//Busqueda con paginacion

router.get("/:id", listPlayersByID); // obtiene la lista de  los usuarios en la  BD por ID--listo

//router.get('/', listUsers); // Busca obtiene todos los datos
//router.post('/search', listPlayersByPartialName); // Busca jugadores por nombre (parcial) utilizando POST

router.put("/", addPlayer); //Agrega un nuevo usuario //

router.delete("/:id", deteleUsers); //Borrar usuario

router.patch("/:id", updatePlayer); //  Actualiza un usuario por su ID //revisar

module.exports = router;
