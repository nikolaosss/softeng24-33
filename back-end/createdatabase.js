const mysql = require('mysql2');
const fs = require('fs');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  multipleStatements: true, 
};

const ddlScript = fs.readFileSync('schema.sql', 'utf-8');

const dmlScript = fs.readFileSync('data.sql', 'utf-8');

const connection = mysql.createConnection(dbConfig);

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.message);
    return;
  }
  console.log('Connected to MySQL!');

  connection.query(ddlScript, (err, results) => {
    if (err) {
      console.error('Error executing DDL:', err.message);
      return;
    }
    console.log('Database and tables created successfully!');

    connection.query(dmlScript, (err, results) => {
      if (err) {
        console.error('Error executing DML:', err.message);
        return;
      }
      console.log('Data inserted successfully!');
      connection.end();
    });
  });
});
