// inilah backend/index.js

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json()); // Penting untuk membaca req.body

// Konfigurasi koneksi database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '@dlh010404', 
  database: 'mahasiswa', 
  port: 3309
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Successfully connected to the database.');
});

// === API ROUTES UNTUK CRUD ===

// 1. CREATE (Membuat data baru) - Method: POST
app.post('/biodata', (req, res) => {
  const { nama, nim, kelas } = req.body;
  const sql = "INSERT INTO biodata (nama, nim, kelas) VALUES (?, ?, ?)";
  
  db.query(sql, [nama, nim, kelas], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: 'Data berhasil ditambahkan', id: result.insertId });
  });
});

// 2. READ (Mengambil semua data) - Method: GET
app.get('/biodata', (req, res) => {
  const sql = "SELECT * FROM biodata ORDER BY id DESC"; // Tampilkan data terbaru di atas
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// 3. UPDATE (Mengubah data berdasarkan ID) - Method: PUT
app.put('/biodata/:id', (req, res) => {
  const { id } = req.params;
  const { nama, nim, kelas } = req.body;
  const sql = "UPDATE biodata SET nama = ?, nim = ?, kelas = ? WHERE id = ?";
  
  db.query(sql, [nama, nim, kelas, id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Data tidak ditemukan' });
    }
    res.json({ message: 'Data berhasil diperbarui' });
  });
});

// 4. DELETE (Menghapus data berdasarkan ID) - Method: DELETE
app.delete('/biodata/:id', (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM biodata WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Data tidak ditemukan' });
    }
    res.json({ message: 'Data berhasil dihapus' });
  });
});


// Menjalankan server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});