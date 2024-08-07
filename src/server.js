require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const productRoutes = require('./routes/products');
const authRoutes = require('./routes/auth');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

const parentDir = path.resolve(__dirname, '..');

mongoose.connect(process.env.MONGODB_URI, {
    family: 4 // Usa solo IPv4
}).then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));

  app.use(cors({
    origin: "*",
}));
app.use(express.json());

app.use('/products', productRoutes);
app.use('/auth', authRoutes);

app.use(express.static(path.join(parentDir, '/client/build')))

app.get('*', (req,res)=> res.sendFile(path.join(parentDir, '/client/build/index.html')))

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
