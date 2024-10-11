import express from 'express'
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Configurar la carpeta "public" para archivos estáticos (CSS y JS)
app.use(express.static(path.join(__dirname, 'public')));

// Simulación de una base de datos en memoria
let users = [];
let idCounter = 1;

// Ruta para servir el archivo HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Obtener lista de usuarios
app.get('/users', (req, res) => {
    res.json(users);
});

// Agregar un usuario
app.post('/users', (req, res) => {
    const { name, email } = req.body;
    const newUser = { id: idCounter++, name, email };
    users.push(newUser);
    res.json(newUser);
});

// Actualizar un usuario
app.put('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { name, email } = req.body;
    const user = users.find(u => u.id === id);
    if (user) {
        user.name = name;
        user.email = email;
        res.json(user);
    } else {
        res.status(404).send('Usuario no encontrado');
    }
});

// Eliminar un usuario
app.delete('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    users = users.filter(u => u.id !== id);
    res.json({ message: 'Usuario eliminado' });
});

// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
