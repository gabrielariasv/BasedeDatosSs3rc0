require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User'); // Asegúrate de que la ruta sea correcta

// Conéctate a la base de datos
mongoose.connect(process.env.MONGODB_URI, {
    family: 4 // Usa solo IPv4
}).then(async () => {
    console.log('MongoDB connected...');
    try {
        const users = await User.find(); // Obtén todos los usuarios
        for (let user of users) {
            // Cifra la contraseña
            const hashedPassword = await bcrypt.hash(user.password, 10);
            // Actualiza el usuario con la contraseña cifrada
            await User.updateOne({ _id: user._id }, { password: hashedPassword });
            console.log(`Updated user ${user.username}`);
        }
        console.log('Passwords updated successfully');
    } catch (err) {
        console.error(err);
    } finally {
        mongoose.disconnect();
    }
}).catch(err => console.error(err));
