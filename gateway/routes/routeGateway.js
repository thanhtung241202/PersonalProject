const express = require('express');
const router = express.Router();
const axios = require('axios');

const STOCK_SERVICE_URL = process.env.STOCK_SERVICE_URL || 'http://127.0.0.1:8000'; 
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:3001'; 
const AUTH_API_PATH = '/api/auth'; 

const handleProxyError = (error, res, defaultMessage) => {
    console.error(`❌ Proxy Error: ${defaultMessage}`, error.message);
    const statusCode = error.response?.status || 500;
    const data = error.response?.data || { message: defaultMessage, detail: error.message };
    res.status(statusCode).json(data);
};

router.get('/daily/data/:symbol', async (req, res) => {
    try {
        const { symbol } = req.params;
        const response = await axios.get(`${STOCK_SERVICE_URL}/daily/data`, {
            params: { symbol }
        });
        res.json(response.data);
    } catch (error) {
        handleProxyError(error, res, 'Lỗi kết nối Stock Service (Daily)');
    }
});

router.get('/monthly/data/:symbol', async (req, res) => {
    try {
        const { symbol } = req.params;
        console.log(`📡 Gateway đang gọi Stock Service tại: ${STOCK_SERVICE_URL}/monthly/data?symbol=${symbol}`);
        
        const response = await axios.get(`${STOCK_SERVICE_URL}/monthly/data`, {
            params: { symbol }
        });
        res.json(response.data);
    } catch (error) {
        handleProxyError(error, res, 'Lỗi kết nối Stock Service (Monthly)');
    }
});

// Auth Routes
router.post('/auth/register', async (req, res) => {
    try {
        const response = await axios.post(`${AUTH_SERVICE_URL}${AUTH_API_PATH}/register`, req.body);
        res.json(response.data);
    } catch (error) {
        handleProxyError(error, res, 'Lỗi Auth Service (Register)');
    }
});

router.post('/auth/login', async (req, res) => {
    try {
        console.log(`📡 Gateway đang gọi Auth Service tại: ${AUTH_SERVICE_URL}${AUTH_API_PATH}/login`);
        
        const response = await axios.post(`${AUTH_SERVICE_URL}${AUTH_API_PATH}/login`, req.body);
        const { token, user } = response.data;

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none', 
            maxAge: 30 * 24 * 60 * 60 * 1000 
        });

        res.status(200).json({user});
    } catch (error) {
        handleProxyError(error, res, 'Đăng nhập thất bại (Auth Service unreachable)');
    }
});

module.exports = router;