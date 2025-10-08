// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();

// -------------------- CORS --------------------
// Allow your frontend and localhost
app.use(cors({
  origin: [
    'https://admin-dashboardfrontend.netlify.app',
    'http://localhost:3000'
  ],
  credentials: true
}));

// -------------------- Body Parser --------------------
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// -------------------- Static Files --------------------
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// -------------------- Routes --------------------
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// -------------------- Start Server --------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
