const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    permission: { type: Number, required: true }
}, { collection: 'Usuarios' }); // Asegúrate de que el nombre de la colección coincide

module.exports = mongoose.model('User', UserSchema);

