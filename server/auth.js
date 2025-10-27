import express from "express";
import db from "./db.js"; // <-- extensión .js
const router = express.Router();

// Registrar usuario
router.post('/register', (req, res) => {
  const { nombre, correo, contrasena } = req.body;
  db.run(
    'INSERT INTO usuarios (nombre, correo, contrasena) VALUES (?, ?, ?)',
    [nombre, correo, contrasena],
    function (err) {
      if (err) return res.status(400).json({ error: 'Correo ya registrado' });
      res.json({ id: this.lastID, nombre, correo });
    }
  );
});

// Login usuario
router.post('/login', (req, res) => {
  const { correo, contrasena } = req.body;
  db.get(
    'SELECT * FROM usuarios WHERE correo = ? AND contrasena = ?',
    [correo, contrasena],
    (err, user) => {
      if (user) return res.json({ id: user.id, nombre: user.nombre, correo: user.correo });
      res.status(401).json({ error: 'Credenciales incorrectas' });
    }
  );
});

export default router;