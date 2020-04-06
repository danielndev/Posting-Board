const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    user: String,
    text: String,
    date: String
});

module.exports = mongoose.model('Posts', postSchema);