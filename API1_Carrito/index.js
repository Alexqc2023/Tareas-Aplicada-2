const express = require('express');
const app = express();

app.use(express.json());


app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

let carrito = [];
let nextId = 1;


const validarProducto = (req, res, next) => {
    const { nombre, precio, cantidad } = req.body;
    
    if (!nombre || precio === undefined || cantidad === undefined) {
        return res.status(400).json({ error: "Faltan datos requeridos (nombre, precio, cantidad)" });
    }
    if (typeof precio !== 'number' || precio <= 0 || typeof cantidad !== 'number' || cantidad <= 0) {
        return res.status(400).json({ error: "El precio y la cantidad deben ser números mayores a cero" });
    }
    next();
};

const validarDescuento = (req, res, next) => {
    const { porcentaje } = req.body;
    if (porcentaje === undefined || typeof porcentaje !== 'number' || porcentaje <= 0) {
        return res.status(400).json({ error: "El porcentaje debe ser un número válido mayor a cero" });
    }
    if (porcentaje > 50) {
        return res.status(400).json({ error: "El descuento máximo permitido es del 50%" });
    }
    next();
};



app.get('/productos', (req, res) => {
    res.json(carrito);
});

app.post('/productos', validarProducto, (req, res) => {
    const { nombre, precio, cantidad } = req.body;
    
    const productoExistente = carrito.find(p => p.nombre.toLowerCase() === nombre.toLowerCase());
    if (productoExistente) {
        productoExistente.cantidad += cantidad;
        return res.json({ mensaje: "Producto existente actualizado", producto: productoExistente });
    }

    const nuevoProducto = { id: nextId++, nombre, precio, cantidad };
    carrito.push(nuevoProducto);
    res.status(201).json(nuevoProducto);
});

app.put('/productos/:id', (req, res) => {
    const { cantidad } = req.body;
    if (cantidad === undefined || typeof cantidad !== 'number' || cantidad <= 0) {
        return res.status(400).json({ error: "La cantidad debe ser un número positivo" });
    }

    const producto = carrito.find(p => p.id === parseInt(req.params.id));
    if (!producto) return res.status(404).json({ error: "Producto no encontrado" });

    producto.cantidad = cantidad;
    res.json({ mensaje: "Cantidad actualizada", producto });
});

app.delete('/productos/:id', (req, res) => {
    const index = carrito.findIndex(p => p.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ error: "Producto no encontrado" });
    
    carrito.splice(index, 1);
    res.json({ mensaje: "Producto eliminado" });
});

app.get('/carrito/total', (req, res) => {
    const total = carrito.reduce((acumulador, prod) => acumulador + (prod.precio * prod.cantidad), 0);
    res.json({ total });
});

app.post('/carrito/aplicar-descuento', validarDescuento, (req, res) => {
    const { porcentaje } = req.body;
    const total = carrito.reduce((acc, prod) => acc + (prod.precio * prod.cantidad), 0);
    const montoDescuento = total * (porcentaje / 100);
    const totalFinal = total - montoDescuento;

    res.json({ 
        totalOriginal: total, 
        porcentajeAplicado: `${porcentaje}%`,
        descuento: montoDescuento, 
        totalFinal 
    });
});

app.listen(3000, () => console.log("API 1 (Carrito) ejecutándose en puerto 3000"));