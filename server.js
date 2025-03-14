const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de base de datos
const db = new sqlite3.Database('./barberia.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err.message);
        process.exit(1);
    }
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
            console.error('Error fetching available appointments:', err.message);
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Reservar un turno
app.post('/reservar', (req, res) => {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: 'ID de turno requerido' });

    db.run('UPDATE turnos SET reservado = 1 WHERE id = ?', [id], function (err) {
        if (err) {
            console.error('Error reserving appointment:', err.message);
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Turno reservado con éxito' });
    });
});

// Agregar un turno
app.post('/agregar-turno', (req, res) => {
    const { servicio, hora } = req.body;
    if (!servicio || !hora) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    db.run('INSERT INTO turnos (servicio, hora, reservado) VALUES (?, ?, 0)', [servicio, hora], function (err) {
        if (err) {
            console.error('Error adding appointment:', err.message);
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Turno agregado con éxito', id: this.lastID });
    });
});

// Eliminar un turno
app.delete('/turnos/:id', (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: 'ID de turno requerido' });

    db.run('DELETE FROM turnos WHERE id = ?', [id], function (err) {
        if (err) {
            console.error('Error deleting appointment:', err.message);
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Turno eliminado con éxito' });
    });
});

// Servir archivos HTML
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'public', 'admin.html')));

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
