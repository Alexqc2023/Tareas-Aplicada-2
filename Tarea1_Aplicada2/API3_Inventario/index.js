const express = require('express');
const app = express();
app.use(express.json());


app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

let inventario = [];
let nextId = 1;


const validarProducto = (req, res, next) => {
    let { producto, stock, stockMinimo } = req.body;
    
    if (!producto || stock === undefined) {
        return res.status(400).json({ error: "Faltan datos requeridos (producto, stock)" });
    }
    if (typeof stock !== 'number' || stock < 0) {
        return res.status(400).json({ error: "El stock debe ser un numero positivo" });
    }
    
   
    if (stockMinimo === undefined || typeof stockMinimo !== 'number') {
        req.body.stockMinimo = 5; 
    }
    
    next();
};

const validarCantidad = (req, res, next) => {
    const { cantidad } = req.body;
    if (cantidad === undefined || typeof cantidad !== 'number' || cantidad <= 0) {
        return res.status(400).json({ error: "La cantidad debe ser un numero mayor a cero" });
    }
    next();
};


app.get('/inventario', (req, res) => {
    res.json(inventario);
});


app.get('/inventario/alertas', (req, res) => {
    const productosEnAlerta = inventario.filter(p => p.stock < p.stockMinimo);
    
    
    const alertas = productosEnAlerta.map(p => {
        return {
            ...p,
            mensaje: `¡Alerta! Faltan ${p.stockMinimo - p.stock} unidades para llegar al stock minimo.`
        };
    });
    
    res.json(alertas);
});


app.post('/inventario', validarProducto, (req, res) => {
    const { producto, stock, stockMinimo } = req.body;
    const nuevoProducto = { id: nextId++, producto, stock, stockMinimo };
    inventario.push(nuevoProducto);
    res.status(201).json(nuevoProducto);
});


app.post('/inventario/:id/entrada', validarCantidad, (req, res) => {
    const { cantidad } = req.body;
    const item = inventario.find(i => i.id === parseInt(req.params.id));
    
    if (!item) return res.status(404).json({ error: "Producto no encontrado" });
    
    item.stock += cantidad;
    res.json({ mensaje: "Entrada registrada", producto: item });
});


app.post('/inventario/:id/salida', validarCantidad, (req, res) => {
    const { cantidad } = req.body;
    const item = inventario.find(i => i.id === parseInt(req.params.id));
    
    if (!item) return res.status(404).json({ error: "Producto no encontrado" });
    
    
    if (cantidad > item.stock) {
        return res.status(400).json({ 
            error: "Stock insuficiente", 
            stockDisponible: item.stock 
        });
    }
    
    item.stock -= cantidad;
    res.json({ mensaje: "Salida registrada", producto: item });
});


app.listen(3002, () => console.log("API 3 (Inventario) ejecutandose en puerto 3002"));