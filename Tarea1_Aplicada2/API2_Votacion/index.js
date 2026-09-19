const express = require('express');
const app = express();
app.use(express.json());


app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

let encuestas = [];
let nextId = 1;


const validarEncuesta = (req, res, next) => {
    const { pregunta, opciones } = req.body;
    if (!pregunta || !opciones) {
        return res.status(400).json({ error: "Faltan datos requeridos (pregunta, opciones)" });
    }
    
    if (!Array.isArray(opciones) || opciones.length < 2) {
        return res.status(400).json({ error: "La encuesta debe tener al menos 2 opciones" });
    }
    next();
};

const validarVoto = (req, res, next) => {
    if (!req.body.opcion) return res.status(400).json({ error: "Debe proporcionar la opcion por la cual desea votar" });
    next();
};

app.post('/encuestas', validarEncuesta, (req, res) => {

    const { pregunta, opciones } = req.body;

    const opcionesConVotos = opciones.map(opt => ({ nombre: opt, votos: 0 }));

    const nuevaEncuesta = { id: nextId++, pregunta, opciones: opcionesConVotos };

    encuestas.push(nuevaEncuesta);

    res.status(201).json(nuevaEncuesta);
});

app.get('/encuestas', (req, res) => {
    res.json(encuestas);
});

app.post('/encuestas/:id/votar', validarVoto, (req, res) => {
    const { opcion } = req.body;
    const encuesta = encuestas.find(e => e.id === parseInt(req.params.id));
    if (!encuesta) return res.status(404).json({ error: "Encuesta no encontrada" });
    
    
    const opcionEncontrada = encuesta.opciones.find(o => o.nombre.toLowerCase() === opcion.toLowerCase());
    if (!opcionEncontrada) return res.status(400).json({ error: "La opcion seleccionada no existe en esta encuesta" });
    
    opcionEncontrada.votos += 1;
    res.json({ mensaje: "Voto registrado con exito", encuesta });
});

app.get('/encuestas/:id/resultados', (req, res) => {
    const encuesta = encuestas.find(e => e.id === parseInt(req.params.id));
    if (!encuesta) return res.status(404).json({ error: "Encuesta no encontrada" });
    
    const totalVotos = encuesta.opciones.reduce((acc, opt) => acc + opt.votos, 0);
    

    const resultados = encuesta.opciones.map(opt => {
        const porcentaje = totalVotos === 0 ? 0 : ((opt.votos / totalVotos) * 100).toFixed(2);
        return { opcion: opt.nombre, votos: opt.votos, porcentaje: `${porcentaje}%` };
    });
    
    
    let ganador = "Ninguno (Sin votos aún)";
    if (totalVotos > 0) {
        const opcionesOrdenadas = [...encuesta.opciones].sort((a, b) => b.votos - a.votos);
        ganador = opcionesOrdenadas[0].nombre;
    }
    
    res.json({ encuesta: encuesta.pregunta, totalVotos, resultados, ganador });
});

app.listen(3001, () => console.log("API 2 (Votación) ejecutandose en puerto 3001"));