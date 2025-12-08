const express = require('express');
const app = express();
const connectDB = require('./config/db');
const authRoutes = require('./src/routes/authRoutes');

app.use(express.json());
connectDB();

app.use('/api/auth', authRoutes);

app.listen(3001, () => console.log('AuthService running on port 3001'));