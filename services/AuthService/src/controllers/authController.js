const authService = require('../services/authService');

exports.register = async (req, res) => {
    try {
        await authService.register(req.body);
        res.status(201).json({ message: 'Đăng ký thành công' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await authService.login(email, password);

        if (!user) {
            return res.status(401).json({ message: 'Email hoặc mật khẩu không chính xác' });
        }

        const token = authService.generateToken(user);
        res.status(200).json({
            message: 'Đăng nhập thành công',
            token,
            user: { id: user._id, role: user.role, plan: user.plan }
        });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};