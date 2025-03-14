const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Conectar a la base de datos
const db = new sqlite3.Database('./barberia.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) console.error(err.message);
    console.log('Conectado a la base de datos SQLite.');
});

// Crear tabla si no existe
db.run(`CREATE TABLE IF NOT EXISTS turnos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    servicio TEXT NOT NULL,
    hora TEXT NOT NULL,
    reservado INTEGER DEFAULT 0
)`);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Obtener turnos disponibles
app.get('/turnos', (req, res) => {
    db.all('SELECT * FROM turnos WHERE reservado = 0', [], (err, rows) => {
        if (err) {
            console.error('Error al obtener turnos:', err.message);
            return res.status(500).json({ error: 'Error al obtener turnos' });
        }
        res.json(rows);
    });
});

// Reservar un turno
app.post('/reservar', (req, res) => {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: 'ID requerido' });

    db.run('UPDATE turnos SET reservado = 1 WHERE id = ?', [id], function (err) {
        if (err) {
            console.error('Error al reservar turno:', err.message);
            return res.status(500).json({ error: 'Error al reservar turno' });
        }
        res.json({ message: 'Turno reservado con éxito' });
    });
});

// Agregar un turno
app.post('/agregar-turno', (req, res) => {
    const { servicio, hora } = req.body;
    if (!servicio || !hora) {
        return res.status(400).json({ error: 'Servicio y hora requeridos' });
    }

    db.run('INSERT INTO turnos (servicio, hora) VALUES (?, ?)', [servicio, hora], function (err) {
        if (err) {
            console.error('Error al agregar turno:', err.message);
            return res.status(500).json({ error: 'Error al agregar turno' });
        }
        res.json({ message: 'Turno agregado con éxito', id: this.lastID });
    });
});

// Servir archivos HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
