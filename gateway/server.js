require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const gatewayRoutes = require('./routes/routeGateway'); 

const app = express();

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("❌ Origin bị từ chối:", origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));


app.use('/api', gatewayRoutes);

app.get('/', (req, res) => {
    res.json({ status: "Gateway is running", environment: process.env.NODE_ENV || 'development' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Gateway đang chạy tại cổng: ${PORT}`);
});