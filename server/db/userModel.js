// Database imports: User: pfa and pw pfa and database "jobs"
// psql -h stampy.db.elephantsql.com -d nabcaedd -U nabcaedd
// Password:IXA9N6DfZg4bNpJJb3A6JgC9rI8EZNWG
const pg = require('pg');

const uri = 'postgres://nabcaedd:IXA9N6DfZg4bNpJJb3A6JgC9rI8EZNWG@stampy.db.elephantsql.com:5432/nabcaedd';
const client = new pg.Client(uri);

// encrypting the password using bcrypt
const bcrypt = require('bcrypt');

const saltRounds = 10;

// opening up a connection to the database
client.connect((err) => {
  err ? console.log(err) : console.log('connected to psql db');
});

const userModel = {};

// creating first instance of table in db
client
  .query(
    `
  CREATE TABLE IF NOT EXISTS users
    (
      _id SERIAL PRIMARY KEY,
      f_name VARCHAR(100),
      l_name VARCHAR(100),
      username text UNIQUE NOT NULL,
      email text UNIQUE,
      password text NOT NULL,
      created TIMESTAMP DEFAULT NOW() NOT NULL
  );
`,
  )
  .then(res => console.log(res.rows[0]))
  .catch(e => console.error(e.stack));

userModel.verify = async (req) => {
  const { username, password } = req.body;
  return client
    .query(`SELECT * FROM users WHERE username = '${username}'`)
    .then((res) => {
      if (bcrypt.compareSync(password, res.rows[0].password)) {
        return true;
      }
      return false;
    })
    .catch((err) => {
      console.log('ERROR with querying database', err);
      return false;
    });
};

// By default node-postgres reads rows and collects them into
// JavaScript objects with the keys matching the column names
// and the values matching the corresponding row value for each column
userModel.createUser = async (req, res) => {
  const {
    f_name, l_name, username, email, password,
  } = req.body;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(password, salt);

  // CREATE row of new user if it doesn't exist
  return client
    .query(
      `
    INSERT INTO users 
    (f_name, l_name, username, email, password)
    VALUES (
        '${f_name}', 
        '${l_name}', 
        '${username}', 
        '${email}', 
        '${hash}'
      );
  `,
    )
    .then(result => result)
    .catch(e => console.log('ERROR with creating user in database', e.stack));
};

module.exports = userModel;
