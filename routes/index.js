const express = require('express');
const router = express.Router();

registerRoutes = require('./register');
postRoutes = require('./post');

router.use('/', registerRoutes);
router.use('/', postRoutes);

router.post('/search', (req, res) => {
    res.redirect('/user?username='+req.body.search);
})
module.exports = router;