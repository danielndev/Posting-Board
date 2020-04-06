const mongoose = require('mongoose');

const postListSchema = new mongoose.Schema({
    posts: {postId: String}
});

module.exports = mongoose.model('PostsList', postListSchema);