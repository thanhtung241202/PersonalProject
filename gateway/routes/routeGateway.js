const express = require('express');
const router = express.Router();
const axios = require('axios');


const FASTAPI_BASE_URL = process.env.FAST_URL || 'http://127.0.0.1:8000'; 
const AUTH_SERVICE_URL = 'http://localhost:3001'; 
const AUTH_API_PATH = '/api/auth'; 


const handleProxyError = (error, res, defaultMessage) => {
    const statusCode = error.response?.status || 500;
    const data = error.response?.data || { message: defaultMessage };
    res.status(statusCode).json(data);
};


router.get('/daily/data/:symbol', async (req, res) => {
    try {
        const { symbol } = req.params;
        const response = await axios.get(`${FASTAPI_BASE_URL}/daily/data`, {
            params: { symbol }
        });
        res.json(response.data);
    } catch (error) {
        handleProxyError(error, res, 'Lỗi Stock Service (Daily)');
    }
});

router.get('/monthly/data/:symbol', async (req, res) => {
    try {
        const { symbol } = req.params;
        const response = await axios.get(`${FASTAPI_BASE_URL}/monthly/data`, {
            params: { symbol }
        });
        res.json(response.data);
    } catch (error) {
        handleProxyError(error, res, 'Lỗi Stock Service (Monthly)');
    }
});




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
        const response = await axios.post(`${AUTH_SERVICE_URL}${AUTH_API_PATH}/login`, req.body);
        const { token, user } = response.data;

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 ngày
        });

        res.status(200).json({user});
    } catch (error) {
        handleProxyError(error, res, 'Login failed');
    }
});


module.exports = router;