const express = require('express')
const usersRoutes = require('./routes/users.js')
const middlewareLogRequest = require('./middleware/logs.js')
const upload = require('./middleware/multer')
const pool = require('./database/db.js')
//jsonwebtoken digunakan untuk membuat dan memverifikasi token yang digunakan untuk autentikasi.
const jwt = require('jsonwebtoken') 
//bcrypt digunakan untuk mengenkripsi password sebelum disimpan ke database, dan kemudian membandingkan password yang diinput dengan password yang disimpan di database.
const bcrypt = require('bcrypt') 

const PORT = process.env.PORT || 4000
require('dotenv').config()

const app = express()

app.use(middlewareLogRequest)
app.use(express.json())

app.use('/users', usersRoutes)
app.use('/assets', express.static('public/image'))
app.post('/upload', upload.single('photo'),(req, res) => {
  res.json({
    message: 'Upload berhasil'
  })
})

app.use((err, req, res, next) => {
  res.json({
    message: err.message
  })
})

// fitur auth 
const secretKey = 'n8f8ufjjdfsdfwrsad';

// Route ini digunakan untuk mendaftarkan pengguna baru
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await pool.query(
    'INSERT INTO mahasiswa (username, password) VALUES ($1, $2) RETURNING *',
    [username, hashedPassword]
  );
  res.json(result.rows[0]);
});

// Route ini digunakan untuk melakukan login pengguna
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const result = await pool.query('SELECT * FROM mahasiswa WHERE username = $1', [username]);
  if (result.rowCount === 0) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const user = result.rows[0];
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  // dibuatkan token menggunakan jsonwebtoken.sign() dan dikembalikan ke client
  const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: '1h' });
  res.json({ token });
});

// middleware autentikasi: Middleware ini digunakan untuk memeriksa apakah header x-access-token sudah diset dan valid
app.use((req, res, next) => {
  const token = req.headers['x-access-token'];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  try {
    // Jika valid, maka akan diambil user dari token dan disimpan ke req.user
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Route ini hanya dapat diakses jika autentikasi berhasil. Memeriksa apakah req.user.id sudah diset, lalu mengambil data pengguna dari database dan mengembalikannya ke client.
app.get('/protected', async (req, res) => {
  const result = await pool.query('SELECT * FROM mahasiswa WHERE id = $1', [req.user.id]);
  res.send('Welcome to the protected route, ' + result.rows[0].username);
});

// menjalankan server 
app.listen(PORT, () => {
  console.log(`Server berhasil running di port ${PORT}`)
})
