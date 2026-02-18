const mongoose = require('mongoose');

const ClassroomSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    capacity: { 
        type: Number, 
        required: true 
    },
    resources: { 
        type: [String], // Array to store resources like 'Smartboard', 'Projector'
        default: [] 
    },
    schoolId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'School', 
        required: true 
    }
}, { timestamps: true });

module.exports = mongoose.model('Classroom', ClassroomSchema);