const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config();
const cors = require('cors');
const axios = require('axios'); 
const corsOptions = {
  origin: '*' 
};
app.use(cors(corsOptions));

app.use(express.json());


const FASTAPI_BASE_URL = process.env.FAST_URL || 'http://127.0.0.1:8000'; 
app.get('/daily/data/:symbol', async (req, res) => {
    try {
        const { symbol } = req.params;
        
        console.log(`Gateway nhận yêu cầu daily cho: ${symbol}`);

        const response = await axios.get(`${FASTAPI_BASE_URL}/daily/data`, {
            params: { symbol: symbol } 
        });

        res.json(response.data);
    } catch (error) {
        console.error('Lỗi khi gọi FastAPI (Daily):', error.message);
        if (error.code === 'ECONNREFUSED') {
            return res.status(502).json({ message: 'Không kết nối được tới FastAPI Backend' });
        }
        res.status(500).json({ message: 'Lỗi từ dịch vụ nội bộ' });
    }
});
app.get('/monthly/data/:symbol', async (req, res) => { 
    try {
        const { symbol } = req.params;
        console.log(`Gateway nhận yêu cầu monthly cho: ${symbol}`);

        const response = await axios.get(`${FASTAPI_BASE_URL}/monthly/data`, {
            params: { symbol: symbol } 
        });

        res.json(response.data);
    } catch (error) {
        console.error('Lỗi khi gọi FastAPI (Monthly):', error.message);
        res.status(500).json({ message: 'Lỗi từ dịch vụ nội bộ' });
    }
});

const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => {
  console.log(`Node.js Gateway đang chạy ở port ${PORT}`);
});