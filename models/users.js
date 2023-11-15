const usermodels = {
  getAll: `
  SELECT 
  * 
FROM 
  fifa`
  ,
    getPlayers: `
    SELECT 
    * 
  FROM 
    fifa
  LIMIT ?  OFFSET ?`,

    getByID: `
    SELECT
    *
    FROM
    fifa
    WHERE
    id= ?
    `,
    getByword: `
    SELECT *
    FROM fifa
    WHERE short_name LIKE CONCAT('%', ?, '%')
`,

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
   
    getByShortName: `
    SELECT 
    * 
    FROM
    fifa
    WHERE short_name = ?
    `,

    getByFull_name: `
    SELECT 
    id 
    FROM 
    fifa
     WHERE
      Full_name = ?
    `,
    getByclub_jersey_number: `
    SELECT 
    id 
    FROM 
    fifa
     WHERE
      Full_name = ?
    `,
    /*/updateUser: `
         UPDATE 
         Users
         SET 
             username = ?,
             email = ?,
             password = ?,
             name = ?,
             lastname = ?,
             phone_number = ?,
             role_id = ?,
             is_active = ?
         WHERE
             id = ?
  `,*/


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

  deleteRow:`DELETE FROM fifa WHERE id = ?`,
}

module.exports = usermodels;