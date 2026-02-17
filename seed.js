/** * NOTE: One-time script to create the initial Superadmin.
 * This allows us to log in and get a JWT for testing.
 */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const config = require('./config/index.config.js');

const UserSchema = new mongoose.Schema({
    username: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, default: 'superadmin' }
});

const User = mongoose.model('User', UserSchema);

async function seed() {
    await mongoose.connect(config.dotEnv.MONGO_URI);
    
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    await User.create({
        username: 'superadmin',
        email: 'admin@system.com',
        password: hashedPassword,
        role: 'superadmin'
    });

    console.log('✅ Superadmin created: admin@system.com / admin123');
    process.exit();
}

seed();