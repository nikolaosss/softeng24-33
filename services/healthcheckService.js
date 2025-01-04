const dbConnection = require('../models/db');

exports.check = async (format = 'json') => {
  const dbConfig = {
    host: 'localhost',
    user: 'root',
    database: 'connect.oll',
  };

  try {
    const [stations] = await dbConnection.execute('SELECT COUNT(*) AS n_stations FROM toll_stations');
    const [passes] = await dbConnection.execute('SELECT COUNT(*) AS n_passes FROM passes');
    const [tags] = await dbConnection.execute('SELECT COUNT(DISTINCT tagRef_id) AS n_tags FROM passes');

    const responseData = {
      status: 'OK',
      dbconnection: `mysql://${dbConfig.user}@${dbConfig.host}/${dbConfig.database}`,
      n_stations: stations[0].n_stations,
      n_tags: tags[0].n_tags,
      n_passes: passes[0].n_passes, 
    };

    if (format === 'csv') {
      const headers = Object.keys(responseData);
      const values = Object.values(responseData);
      return { csv: `${headers.join(',')}\n${values.join(',')}` };
    }

    return responseData;
  } catch (error) {
    throw new Error('Failed to fetch data from the database: ' + error.message);
  }
};
