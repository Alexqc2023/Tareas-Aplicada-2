const express = require('express');
const app = express();
app.use(express.json());


app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

let turnos = [];
let nextId = 1;


const validarTurno = (req, res, next) => {
    const { cliente, servicio } = req.body;
    if (!cliente || !servicio) {
        return res.status(400).json({ error: "Faltan datos requeridos (cliente, servicio)" });
    }
    next();
};


app.get('/turnos', (req, res) => res.json(turnos));


app.get('/turnos/espera', (req, res) => {
    const cantidad = turnos.filter(t => t.estado === 'esperando').length;
    res.json({ enEspera: cantidad });
});


app.get('/turnos/siguiente', (req, res) => {
    const siguiente = turnos.find(t => t.estado === 'esperando');
    if (!siguiente) return res.status(404).json({ mensaje: "No hay turnos en espera" });
    res.json(siguiente);
});

app.post('/turnos', validarTurno, (req, res) => {
    const { cliente, servicio } = req.body;
    
    const nuevoTurno = { id: nextId++, cliente, servicio, estado: 'esperando' };
    turnos.push(nuevoTurno);
    res.status(201).json(nuevoTurno);
});


app.put('/turnos/llamar', (req, res) => {
    
    const hayAtendiendo = turnos.find(t => t.estado === 'atendiendo');
    if (hayAtendiendo) {
        return res.status(400).json({ 
            error: "Ya hay un cliente siendo atendido. Finalice ese turno primero.",
            turnoActual: hayAtendiendo 
        });
    }

    
    const siguiente = turnos.find(t => t.estado === 'esperando');
    if (!siguiente) return res.status(404).json({ error: "No hay clientes en espera" });

    siguiente.estado = 'atendiendo';
    res.json({ mensaje: "Cliente llamado a ventanilla", turno: siguiente });
});


app.put('/turnos/:id/finalizar', (req, res) => {
    const turno = turnos.find(t => t.id === parseInt(req.params.id));
    if (!turno) return res.status(404).json({ error: "Turno no encontrado" });
    
    turno.estado = 'finalizado';
    res.json({ mensaje: "Turno finalizado", turno });
});


app.listen(3003, () => console.log("API 4 (Turnos) ejecutandose en puerto 3003"));