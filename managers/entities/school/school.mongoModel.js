const mongoose = require('mongoose');

const SchoolSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('School', SchoolSchema);