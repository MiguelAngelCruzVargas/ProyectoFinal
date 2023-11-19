const usermodels = {
  // Obtener todos los registros de la tabla 'fifa'
  getAll: `
  SELECT 
  * 
FROM 
  fifa`
  ,
  // Obtener jugadores con paginación
    getPlayers: `
    SELECT 
    * 
  FROM 
    fifa
  LIMIT ?  OFFSET ?`,

 // Obtener un jugador por su ID
    getByID: `
    SELECT
    *
    FROM
    fifa
    WHERE
    id= ?
    `,

    // Buscar jugadores por un patrón en su nombre corto (short_name)
    //CONCAT('%', ?, '%'); para que la busqueda sea mas flexible
    getByword: `
    SELECT *
    FROM fifa
    WHERE short_name LIKE CONCAT('%', ?, '%')
`,

 // Insertar un nuevo jugador en la tabla 'fifa'
    addRow:`
    INSERT INTO fifa (
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
      power
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?)
    `,
   
// Obtener un jugador por su nombre corto (short_name)
    getByShortName: `
    SELECT 
    * 
    FROM
    fifa
    WHERE short_name = ?
    `,

// Obtener el ID de un jugador por su nombre completo (Full_name)
    getByFull_name: `
    SELECT 
    id 
    FROM 
    fifa
     WHERE
      Full_name = ?
    `,

// Obtener el ID de un jugador por su número de camiseta en el club
    getByclub_jersey_number: `
    SELECT 
    id 
    FROM 
    fifa
     WHERE
      Full_name = ?
    `,

 // Actualizar la información de un jugador por su ID
  updateUser: `
  UPDATE fifa
    SET 
      short_name = ?,
      Full_name = ?,
      overall = ?,
      age = ?,
      dob = ?,
      height_cm = ?,
      weight_kg = ?,
      club_position = ?,
      Position = ?,
      club_name = ?,
      league_name = ?,
      nationality_name = ?,
      club_jersey_number = ?,
      preferred_foot = ?,
      player_traits = ?,
      pace = ?,
      shooting = ?,
      passing = ?,
      dribbling = ?,
      defending = ?,
      attacking = ?,
      power = ?
    WHERE id = ?
`,

// Eliminar un jugador por su ID
  deleteRow:`DELETE FROM fifa WHERE id = ?`,
}

module.exports = usermodels;