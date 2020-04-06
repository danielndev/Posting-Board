const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: String,
    username: String,
    password: String,
    followers: [String],
    following: [String],
    posts: [{postId: String}]
});

module.exports = mongoose.model('Users', userSchema);