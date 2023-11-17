const { request, response } = require('express');
const bcrypt = require('bcrypt');
const playersModel = require('../models/users')
const pool = require('../db');

//####################################################
//              ENDPOINT'S --> OPERACIONES CRUD
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

    res.json({ msg: 'RESULT:', playersAll });
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

  //conexión a la base de datos
  let conn;

  try {
    // Obtiene una conexión del pool de conexiones a la base de datos
    conn = await pool.getConnection();
    //console.log('Conexión establecida');

    //PAGINACION
    // Obtiene los valores de la consulta query de 'limit' y 'offset' 
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
    const players = await conn.query(playersModel.getPlayers, [limit, offset], (err) => {
      if (err) {
        // Si hay un error en la consulta, se lanza una excepción
        throw err;
      }
    });

    // se muestra los resultados de lasolicitud HTTP  de la consulta en formato JSON
    res.json({ msg: 'RESULT:', players });
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

//###################### listUsersByID, busqueda porque ID #################
const listPlayersByID = async (req = request, res = response) => {
  const { id } = req.params; //recibe el id ingresado por parametros

  //si el id no es valido muestra el mensaje "--Invalid ID--"
  if (isNaN(id)) {
    res.status(400).json({ msg: '--Invalid ID--' });
    return;
  }

  let conn;

  try {
    conn = await pool.getConnection();
    //obtiene el id con ayuda de la consulta getByID
    const [player] = await conn.query(playersModel.getByID, [id]);

    //si el id proporcionado no se encunetra en l abase de datos 
    //Se muestra un mensaje indicándolo.
    if (!player) {
      res.status(404).json({ msg: 'Player not found' });
      return;
    }
    //si el ID es valido y se cuentra en la BD se mostraran los datos de este
    //en formato JSON
    res.json({ msg: 'RESULT', player });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  } finally {
    if (conn) conn.end();
  }
};

//#################### BUSQUEDA POR NOMBRE ####################

const listPlayersByPartialName = async (req = request, res = response) => {
  // Extraer el nombre del jugador desde el cuerpo de la solicitud.
  const { playerName } = req.body;

  // Verificar si el nombre del jugador es válido.
  if (!playerName) {
    res.status(400).json({ msg: '--Invalid Player Name--' }); // Enviar respuesta de error 400 si no hay nombre de jugador.
    return;
  }

  //conexión a la base de datos.
  let conn;

  try {
    // Establecer conexión con la base de datos.
    conn = await pool.getConnection();

    // Consultar la base de datos para obtener jugadores cuyo nombre coincida parcialmente.
    const [players] = await conn.query(playersModel.getByword, [`%${playerName}%`]);

    // Verificar si se encontraron jugadores.
    if (!players || players.length === 0) {
      res.status(404).json({ msg: 'No players found for the given name' }); // Enviar respuesta de error 404 si no se encontraron jugadores.
      return;
    }

    // Enviar la lista de jugadores en formato JSON como respuesta exitosa.
    res.json({ msg: 'RESULT:', players });
  } catch (error) {
    console.log(error); // Imprimir el error en la consola para propósitos de depuración.
    res.status(500).json(error); // Enviar respuesta de error 500 si ocurre un error durante la ejecución.
  } finally {
    if (conn) conn.end();
  }
};


//######################## ADDPLAYER #################################
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
//########################### UPDATE ########################
const updatePlayer = async (req = request, res = response) => {
  let conn;

    const { id } = req.params; // Obtiene el ID del jugador de los parámetros de la solicitud

    // Campos de la base de datos obtenidos del cuerpo de la solicitud
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

    // Arreglo con los datos del jugador
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
      // Conexión a la base de datos
      conn = await pool.getConnection();

    // Obtiene el jugador existente usando el ID
    const [playerExists] = await conn.query(
      playersModel.getByID,
      [id],
      (err) => { throw err; }
    );

    // Si el jugador no existe, devuelve un mensaje de error
    if (!playerExists) {
      res.status(404).json({ msg: `Player '${id}' not found` });
      return;
    }

    // Verifica si ya existe un jugador con el mismo nombre corto
    if (short_name === playerExists.short_name) {
      res.status(409).json({ msg: `Short name '${short_name}' already exists` });
      return;
    }

    // Verifica si ya existe un jugador con el mismo número de camiseta
    if (club_jersey_number === playerExists.club_jersey_number) {
      res.status(409).json({ msg: 'Club jersey number already exists' });
      return;
    }

    // Guarda la información actual del jugador
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

    // Reemplaza los campos vacíos del nuevo jugador con los valores actuales
    player.forEach((playerData, index) => {
      if (!playerData) {
        player[index] = oldPlayer[index];
      }
    });

    console.log('Player updated successfully');console.log('Player updated successfully');

    const playerUpdated = await conn.query(playersModel.updateUser, [...player, id], (err) => {
      if (err) throw err;
    });

    // Si no se actualizó ningún jugador, devuelve un mensaje de error
    if (playerUpdated.affectedRows === 0) {
        throw new Error('Player not updated' );
    }
    
    // Devuelve un mensaje de éxito y actualiza el jugador en la base de datos
    res.json({ msg: 'Player updated successfully',...oldPlayer});
    
  } catch (err) {
    // Manejo de errores, devuelve un mensaje de error
    res.status(400).json(err);
    return;
  } finally {
    // Libera la conexión a la base de datos en cualquier caso
    if (conn) conn.end();
  }
};


//############################## deteleUsers #####################
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
  listUsers,
  listPlayersByPartialName
};
