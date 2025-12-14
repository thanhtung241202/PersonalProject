const path = require('path'); // Cần import module path của Node.js
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const app = require('./src/app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 3001;

const startServer = async () => {
    try {
        await connectDB();
        console.log('Database connected from server.js');

        app.listen(PORT, () => {
            console.log(`🚀 AuthService is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Failed to start AuthService:', error.message);
        process.exit(1); 
    }
};

startServer();

/*
{
    "email": "new.user@tester.com",
    "password": "strongpassword123",
    "role": "user"
}
*/