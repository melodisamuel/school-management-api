const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email:    { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role:     { type: String, enum: ['superadmin', 'school_admin'], default: 'school_admin' },
    schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', default: null }
});

module.exports = mongoose.model('User', userSchema);