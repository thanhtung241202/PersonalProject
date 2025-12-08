const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true, 
            trim: true      
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ['admin', 'user'],
            default: 'user'
        },
        plan: {
            type: String,
            enum: ['free', 'bronze', 'silver', 'gold'],
            default: 'free'
        },
        planExpiresAt: { 
            type: Date 
        }
    },
    {
        timestamps: true 
    }
);
// Băm password, dùng với isModified để tránh trường hợp thay đổi password sẽ băm 2 lần
userSchema.pre('save', async function (next) {
    if(!this.isModified('password'))
    {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
}
)

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};


// Đã lấy user rồi
module.exports = mongoose.model('User', userSchema);