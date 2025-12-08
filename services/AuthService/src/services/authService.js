const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Logic tạo Token
exports.generateToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role, plan: user.plan },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
    );
};

// Logic Đăng ký
exports.register = async (userData) => {
    const { email } = userData;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error('Email đã được sử dụng.');
    }
    const newUser = new User(userData);
    return await newUser.save();
};

// Logic Đăng nhập
exports.login = async (email, password) => {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
        return user;
    }
    return null;
};