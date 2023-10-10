const express = require('express');
const router = express.Router();

const testDao = require('../models/test-dao.js');
const { verifyAuthenticated } = require('../middleware/auth-middleware.js');

router.get('/', verifyAuthenticated, async function (req, res) {
    res.locals.title = 'My route title!';
    res.locals.allTestData = await testDao.retrieveAllTestData();
    res.render('home');
});


router.get('/register', function(req, res) {
    res.render('register');
})

router.get('/login', function (req,res) {
    res.render('login');
})

module.exports = router;
