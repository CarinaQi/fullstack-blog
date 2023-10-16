const { v4: uuid } = require('uuid');
const express = require('express');
const router = express.Router();

const authDao = require('../../models/auth-dao');
const userDb = require('../../models/generic-dao');
const login = require('../../middleware/auth-middleware/login-auth')

router.post('/api/login', async function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    const user = await authDao.getUserWithCredentials(username, password);
    if (user) {
        const authToken = uuid();
        await authDao.setUserDbAuthToken(username, authToken); // Save token in the database
        res.cookie('authToken', authToken);
        res.locals.user = user;
        res.sendStatus(204); // I NEEDED TO SEND A 200 RESPONSE
    } else {
        res.status(401).send('Unauthorized');
    }
});

router.get('/api/logout', function (req, res) {
    res.clearCookie('authToken');
    res.status(200).send('Logged out successfully');
});

router.get('/api/users', async function (req, res) {
    const user = res.locals.user; 
    if (user && user.admin === 1) {
        const users = await userDb.getAllUserData();
        res.status(200).json(users);
    } else {
        res.status(401).send('Access Denied');
    }
});

// router.delete('/api/users/:id', async function (req, res) {
//     const userId = req.params.id;
//     const user = res.locals.user; 
//     if (user && user.admin === 1) {
//         await userDb.deleteUserById(userId);
//         res.status(204);
//     } else {
//         res.status(401).send('Access Denied');
//     }
// });

module.exports = router;