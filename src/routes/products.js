
const express = require('express');
const bodyParser = require('body-parser');
const Product = require('../models/product'); // Importa el modelo
const router = express.Router();
const authMiddleware = require('../middleware/auth');

router.use(bodyParser.json());

router.get('/',authMiddleware(0), async (req, res) => {
    const { page = 1, limit = 10, nombre, id_producto } = req.query;
    const query = {};

    if (nombre) {
        query.Nombre = new RegExp(nombre, 'i');
    }

    if (id_producto) {
        query.id_producto = id_producto;
    }

    try {
        const products = await Product.find(query)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();
        const count = await Product.countDocuments(query);
        res.json({
            products,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', authMiddleware(2) ,async (req, res) => {
    const product = new Product(req.body);
    try {
        const newProduct = await product.save();
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/:id', authMiddleware(2) ,async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.patch('/:id/unidades', authMiddleware(1) ,async (req, res) => {
    const { unidades } = req.body;
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        product.unidades += unidades;
        await product.save();
        res.json(product);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;