const { request, response } = require('express');
const bcrypt = require('bcrypt');
const playersModel = require('../models/users')
const pool = require('../db');

//################### ENDPOINT ######################



//################ mostrar todo ######################
const listUsers = async (req = request, res = response) => {
  console.log('List All')
  let conn;

  try {
      conn = await pool.getConnection();

      const playersAll = await conn.query(playersModel.getAll, (err) => {
          if (err) {
              throw err
          }
      });

      res.json(playersAll);
  } catch (error) {
      console.log(error);
      res.status(500).json(error);
  } finally {
      if (conn) conn.end();
  }
};

// list with pagination
//http://localhost:3000/api/v1/?limit=10&offset=5

const listPlayers = async (req = request, res = response) => {
  console.log('List Players')

  // Declara una variable llamada 'conn' para la conexión a la base de datos
  let conn;

  try {
    // Obtiene una conexión del pool de conexiones a la base de datos
    conn = await pool.getConnection();
    //console.log('Conexión establecida');

    //PAGINACION
    // Obtiene los parámetros de consulta 'limit' y 'offset' 
    const limit = parseInt(req.query.limit); 
    const offset = parseInt(req.query.offset);
   
    /*
     La consulta utiliza el modelo 'playersModel.getPlayers' con los parámetros 'limit' y 'offset'
     El resultado se almacena en la variable 'players'
    */

     /*
     obtiene los resultados (tomando en cuenta la paginacion), y los almacena en la
     variable players
     */
    const players = await conn.query(playersModel.getPlayers, [limit , offset], (err) => { 
      if (err) {
        // Si hay un error en la consulta, se lanza una excepción
        throw err;
      }
    });

    // se muestra los resultados de lasolicitud HTTP  de la consulta en formato JSON
    res.json(players);
  } catch (error) {
    // Captura cualquier error que ocurra dentro del bloque 'try' y maneja la respuesta en caso de error
    console.log(error);
    res.status(500).json(error); // Responde con un código de estado 500 (Internal Server Error) y el error en formato JSON
  } finally {
    // Bloque 'finally' que se ejecuta siempre, independientemente de si hubo un error o no
    // Cierra la conexión a la base de datos si está abierta
    if (conn) conn.end();
  }
};

//###################### segun yo ya funciona #################
// 7.b. listUsersByID, busqueda porque ID 
const listPlayersByID = async (req = request, res = response) => {
  const { id } = req.params;

  if (isNaN(id)) {
    res.status(400).json({ msg: '--Invalid ID--' });
    return;
  }

  let conn;

  try {
    conn = await pool.getConnection();

    const [player] = await conn.query(playersModel.getByID, [id]);

    if (!player) {
      res.status(404).json({ msg: 'Player not found' });
      return;
    }

    res.json(player);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  } finally {
    if (conn) conn.end();
  }
};

//####################BUSQUEDA POR NOMBRE ####################
/*
const listPName = async (req = request, res = response) => {
  const { name } = req.params;


  let conn;

  try {
    conn = await pool.getConnection();

    const [player] = await conn.query(playersModel.getByword, [name]);

    if (!player) {
      res.status(404).json({ msg: 'Player not found' });
      return;
    }

    res.json(player);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  } finally {
    if (conn) conn.end();
  }
};
*/

//##########################################
//################## ADDUSER #################

//###############################################################
const addPlayer = async (req = request, res = response) => {
  // Imprime un mensaje en la consola cuando se ingresa a la función
  console.log('AddPlayer');

  // Extrae los datos del cuerpo de la solicitud (request)
  const {
    id,
    short_name,
    Full_name,
    overall,
    age,
    dob,
    height_cm,
    weight_kg,
    club_position,
    Position,
    club_name,
    league_name,
    nationality_name,
    club_jersey_number,
    preferred_foot,
    player_traits,
    pace,
    shooting,
    passing,
    dribbling,
    defending,
    attacking,
    power,
  } = req.body;

  // se Verifica si algún campo obligatorio falta en la solicitud
  if (
    !short_name ||
    !Full_name ||
    !overall ||
    !age ||
    !dob ||
    !height_cm ||
    !weight_kg ||
    !club_position ||
    !Position ||
    !club_name ||
    !league_name ||
    !nationality_name ||
    !club_jersey_number ||
    !preferred_foot ||
    !player_traits ||
    !pace ||
    !shooting ||
    !passing ||
    !dribbling ||
    !defending ||
    !attacking ||
    !power
  ) {

    // Si falta información, responde con un código de estado 400 y un mensaje 
    res.status(400).json({ msg: 'Missing information' });
    // Finaliza la ejecución de la función
    return;
  }

  // Crea un arreglo con los datos del jugador
  const player = [
    id,
    short_name,
    Full_name,
    overall,
    age,
    dob,
    height_cm,
    weight_kg,
    club_position,
    Position,
    club_name,
    league_name,
    nationality_name,
    club_jersey_number,
    preferred_foot,
    player_traits,
    pace,
    shooting,
    passing,
    dribbling,
    defending,
    attacking,
    power,
  ];

  // Inicializa la variable de conexión a la base de datos
  let conn;

  try {
    // Obtiene una conexión a la base de datos desde el pool
    conn = await pool.getConnection();

    // Realiza una consulta para verificar si ya existe el Id
    //esto para que no de error de llave primaria duplicada y pare el programa
    const [existingPlayer] = await conn.query(
      playersModel.getByID,
      [id]
    );

    // Si ya existeel id responde con un código de estado 409 y un mensaje JSON
    //esto para evitar que muestre error de id duplicado
    if (existingPlayer) {
      res.status(409).json({ msg: `id: ${id} already exists` });
      // Finaliza la ejecución de la función
      return;
    }


    // Realiza una consulta para verificar si ya existe un jugador con los campos 
    //que no se pueden repetir  (los campos son a consideracion)
    const [existingData] = await conn.query(
      playersModel.getByShortName,
      [short_name], playersModel.getByFull_name, [Full_name],
      playersModel.getByclub_jersey_number, [club_jersey_number]
    );
    if (existingData) {
      // se imprime el mensaje mostrando los campos existentes
      res.status(409).json({ msg: `The following fields cannot be repeated:short_name, full name: ${Full_name} , jersey number: ${club_jersey_number}` });
      // Finaliza la ejecución de la función
      return;
    }



    // Si no existe, realiza una consulta para agregar el nuevo jugador a la base de datos
    const playerAdded = await conn.query(playersModel.addRow, [...player]);

    // Verifica si se añadió algún jugador
    if (playerAdded.affectedRows === 0) {
      // Si no se añadió ningún jugador, lanza un error
      throw new Error({ message: 'Failed to add player' });
    }
    // Si todo fue exitoso, responde con un mensaje indicando que se añadio con exito
    res.json({ msg: 'Player added successfully' });

  } catch (error) {
    // Si ocurre un error, imprímelo en la consola y responde con un código de estado 500 y un mensaje JSON
    console.log(error);
    res.status(500).json(error);
  } finally {
    //cerrar la conexión a la base de datos, si está abierta
    if (conn) conn.end();
  }
};


//################### UPDATE ####################
// use patch
// 7.d. updateUser
const updatePlayer = async (req = request, res = response) => {
  let conn;

  const { id } = req.params; //

  //campos de la base de datos
  const {
    short_name,
    Full_name,
    overall,
    age,
    dob,
    height_cm,
    weight_kg,
    club_position,
    Position,
    club_name,
    league_name,
    nationality_name,
    club_jersey_number,
    preferred_foot,
    player_traits,
    pace,
    shooting,
    passing,
    dribbling,
    defending,
    attacking,
    power
  } = req.body;

  // Recibe los datos enviados por Postman u otro medio
  let player = [
    short_name,
    Full_name,
    overall,
    age,
    dob,
    height_cm,
    weight_kg,
    club_position,
    Position,
    club_name,
    league_name,
    nationality_name,
    club_jersey_number,
    preferred_foot,
    player_traits,
    pace,
    shooting,
    passing,
    dribbling,
    defending,
    attacking,
    power
  ];

  try {
    conn = await pool.getConnection(); // Conexión a la base de datos

    //obtine el id indicado para verificar si este existe
    const [playerExists] = await conn.query(
      playersModel.getByID,
      [id],
      (err) => { throw err; }
    );
//sino existe manda un mensaje indicando que el jugador no existe
    if (!playerExists) {
      res.status(404).json({ msg: 'Player not found' });
      return;
    }
//en las singuentes condicionales se realiza la misma operacion de verificacion
//en algunos campos que yo considero no se deben repetir
    if (short_name === playerExists.short_name) {
      res.status(409).json({ msg: 'Short name already exists' });
      return;
    }

    if (club_jersey_number === playerExists.club_jersey_number) {
      res.status(409).json({ msg: 'club jersey number already exists' });
      return;


    }
    // Contiene la información de la base de datos
    let oldPlayer = [
      playerExists.short_name,
      playerExists.Full_name,
      playerExists.overall,
      playerExists.age,
      playerExists.dob,
      playerExists.height_cm,
      playerExists.weight_kg,
      playerExists.club_position,
      playerExists.Position,
      playerExists.club_name,
      playerExists.league_name,
      playerExists.nationality_name,
      playerExists.club_jersey_number,
      playerExists.preferred_foot,
      playerExists.player_traits,
      playerExists.pace,
      playerExists.shooting,
      playerExists.passing,
      playerExists.dribbling,
      playerExists.defending,
      playerExists.attacking,
      playerExists.power
    ];
    //muestra los datos anteriores de los campos y un mensaje indicando que 
    //se actualizo correctamente
    res.json({ msg: 'Player updated successfully', ...oldPlayer });
    //return;
    
    player.forEach((playerData, index) => {
      if (!playerData) {
        player[index] = oldPlayer[index];
      };
    });

    const [playerUpdated] = conn.query(playersModel.updateUser, [...player, id], (err) => {
      throw err;
    });


    if (playerUpdated.affectedRows === 0) {
      throw new Error('Player not updated');
    }

  } catch (err) {
    res.status(400).json(err);
    return;
  } finally {
    if (conn) conn.end(); // Libera la conexión a la base de datos
  }
};

//############################## sirve #####################
// 7.e. deteleUsers

const deteleUsers = async (req = request, res = response) => {
  let conn;
  const { id } = req.params;

  try {
    conn = await pool.getConnection();
//se obtiene el ID pasado como paramrtro  en la url
    const [playerExists] = await conn.query(
      playersModel.getByID,
      [id],
      (err) => {
        throw err;
      }
    );
//si el ID no se encuentra en la base de datos se manda un mesaje indicando no encontrado
    if (!playerExists || playerExists.is_active === 0) {
      res.status(404).json({ msg: 'Player not found' });
      return;
    }

    const playerDelete = await conn.query(
      playersModel.deleteRow,
      [id],
      (err) => {
        if (err) throw err;
      }
    );
// en caso de error se manda un mensaje indicandolo
    if (playerDelete.affectedRows === 0) {
      throw new Error({ message: 'Failed to delete player' });
    }
//mensaje indicando que el jugador fue borrado exitosamente
    res.json({ msg: 'Player deleted successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  } finally {
    if (conn) conn.end();
  }
};

module.exports = {
  listPlayers,
  listPlayersByID,
  addPlayer,
  updatePlayer,
  deteleUsers,
  listUsers
};