const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id_producto: { type: Number, required: true, unique: true },
    Nombre: { type: String, required: true },
    unidades: { type: Number, required: true },
    Precio: { type: Number, required: true }
}, { collection: 'Inventario' });  // Especifica la colección aquí

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
