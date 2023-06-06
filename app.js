require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const { DataSource } = require('typeorm');

const port = 3000;

// middleware:
app.use(cors());
app.use(express.json());

// connection with mysql
const dataSource = new DataSource({
  type: process.env.DB_TYPE,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

dataSource
  .initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.log('Error occurred during Data Source initialization', err);
    dataSource.destroy();
  });

// listen to express server on port 3000
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// get request to the databse server
app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

// get all information from users table
app.get('/users', async (req, res) => {
  const users = await dataSource.query(
    `
        SELECT * FROM users
        `
  );
  res.send(users);
});

// post name profileImage and password into users database
app.post('/users', async (req, res) => {
  const { name, profileImage, password } = req.body;
  try {
    await dataSource.query(
      `
        INSERT INTO users 
        (
            name, 
            profile_image, 
            password
        ) values ( ?, ?, ? )
        `,
      [name, profileImage, password]
    );
    res.send('reate success');
  } catch (error) {
    console.log(error);
    throw error;
  }
});
