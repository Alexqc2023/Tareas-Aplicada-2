const express = require('express');
const app = express();
app.use(express.json());


app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);

    next();
});

let habitos = [];
let nextId = 1;


const validarHabito = (req, res, next) => {
    const { nombre, meta } = req.body;
    if (!nombre || !meta) {
        return res.status(400).json({ error: "Faltan datos requeridos (nombre, meta)" });
    }
    next();
};




app.post('/habitos', validarHabito, (req, res) => {
    const { nombre, meta } = req.body;
    
    const fechaCreacion = new Date().toISOString().split('T')[0]; 

    const nuevoHabito = { id: nextId++, nombre, meta, fechaCreacion, registros: [] };
    
    habitos.push(nuevoHabito);
    res.status(201).json(nuevoHabito);
});


app.get('/habitos', (req, res) => res.json(habitos));


app.post('/habitos/:id/registrar', (req, res) => {
    const habito = habitos.find(h => h.id === parseInt(req.params.id));
    if (!habito) return res.status(404).json({ error: "Habito no encontrado" });

    
    const hoy = new Date().toISOString().split('T')[0];
    
    
    const yaRegistrado = habito.registros.find(r => r.fecha === hoy);
    if (yaRegistrado) {
        return res.status(400).json({ error: "Ya registraste este habito el día de hoy" });
    }

    habito.registros.push({ fecha: hoy, completado: true });
    res.json({ mensaje: "Habito registrado exitosamente por hoy", habito });
});


app.get('/habitos/:id/estadisticas', (req, res) => {
    const habito = habitos.find(h => h.id === parseInt(req.params.id));
    if (!habito) return res.status(404).json({ error: "Habito no encontrado" });

    const totalRegistros = habito.registros.length;
    
    
    const hoy = new Date();
    const creacion = new Date(habito.fechaCreacion);
    const diasPasados = Math.max(1, Math.ceil((hoy - creacion) / (1000 * 60 * 60 * 24)));
    const porcentaje = Math.round((totalRegistros / diasPasados) * 100);

  
    const fechas = habito.registros.map(r => new Date(r.fecha).getTime()).sort((a,b) => a - b);
    let rachaActual = fechas.length > 0 ? 1 : 0;
    let mejorRacha = rachaActual;

    for (let i = 1; i < fechas.length; i++) {
        const diferenciaDias = (fechas[i] - fechas[i-1]) / (1000 * 60 * 60 * 24);
        if (diferenciaDias <= 1.5) { 
            rachaActual++;
            if (rachaActual > mejorRacha) mejorRacha = rachaActual;
        } else {
            rachaActual = 1;
        }
    }

    res.json({
        habito: habito.nombre,
        rachaActual: `${rachaActual} dias`,
        mejorRacha: `${mejorRacha} dias`,
        cumplimiento: `${porcentaje > 100 ? 100 : porcentaje}%`
    });
});


app.delete('/habitos/:id', (req, res) => {
    const index = habitos.findIndex(h => h.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ error: "Habito no encontrado" });
    
    habitos.splice(index, 1);
    res.json({ mensaje: "Habito eliminado" });
});

app.listen(3004, () => console.log("API 5 (Habitos) ejecutandose en puerto 3004"));