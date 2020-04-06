const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Posts = require('../models/Posts');
const PostsList = require('../models/PostsList');

router.use(express.json());
router.use(express.urlencoded({extended: false}));

router.post('/post', async (req, res) => {
    var today = new Date();
    
    var datePublished = today.getDate() + ":" + today.getMonth() + ":" + today.getFullYear();
    await User.findById(req.session.user._id, async (err, user)=>{
        if(err){ return next(err)}
        if(!user){ return next({message: "User doesn't exists"})}

        var post = new Posts({
            user: user.username,
            text: req.body.postText,
            date: datePublished
        });

        user.posts.push(post);
        
        await user.save();
        await post.save();

        await res.redirect('/main');
})});

router.post('/follow', async (req, res) => {
    if(!req.session.user.following.includes(req.body.followedUser)){  
        await User.findById(req.session.user._id, (err, user) => {
            user.following.push(req.body.followedUser);
            req.session.user = user;
            user.save();
        })

        await User.findOne({username: req.body.followedUser}, (err, user) => {
            user.followers.push(req.session.user.username);
            user.save();
        })
    }else{

        await User.findById(req.session.user._id, (err, user) => {
            for(let i = 0; i < user.following.length; i ++){
                if(user.following[i] === req.body.followedUser){
                    user.following.splice(i,1);
                }
            }
            req.session.user = user;
            user.save();
        })

        await User.findOne({username: req.body.followedUser}, (err, user) => {

            for(let i = 0; i < user.followers.length; i ++){
                if(user.followers[i] === req.session.user.username){
                    user.followers.splice(i,1);
                }
            }
            user.save();
        })
    }

    res.redirect('/user?username='+req.body.followedUser);
})

router.post('/delete_post', async (req, res) => {
    await Posts.findById(req.body.deleteButton, (err, post) => {
        post.remove();
    });

    await res.redirect('/main');
});

module.exports = router;