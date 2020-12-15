const express = require('express');
const router = express.Router();
const users = require('../data/users');
const bcrypt = require('bcrypt');

router.get('/', async (req, res) => {
    try {
        if (req.session.user) return res.redirect('/private');
        const body = {
            title: 'login',
        };
        res.render('login/login', body);
    } catch (error) {
        res.status(500).render("error", {
            title: "Error",
            status: 500,
            msg: error
        });
    }
});

router.post('/login', async (req, res) => {
    //set cookie here
    try {
        const username = req.body.username.toLowerCase();
        const password = req.body.password;
        let isAuth = false;
        let userID;
        if (!username) return res.status(401).render('login/login', {
            title: "login",
            error: "Provided username or password is not valid."
        });
        if (!password) return res.status(401).render('login/login', {
            title: "login",
            error: "Provided username or password is not valid."
        });
        for (let i = 0; i < users.length; i++) {
            if (users[i].username === username) {
                if (await bcrypt.compare(password, users[i].hashedPassword)) {
                    isAuth = true;
                    userID = users[i]._id;
                }
            }
        }

        if (isAuth) {
            req.session.user = {
                firstName: users[userID].firstName,
                lastName: users[userID].lastName,
                userID: userID
            };
            res.redirect('/private');
        } else res.status(401).render('login/login', {
            title: "login",
            error: "Provided username or password is not valid."
        });
    } catch (error) {
        res.status(500).render("error", {
            title: "Error",
            status: 500,
            msg: error
        });
    }
});



router.get('/logout', async (req, res) => {
    //remove authcookies
    try {
        req.session.destroy();
        let body = {
            title: "logout"
        };
        res.render("logout/logout", body);
    } catch (error) {
        res.status(500).render("error", {
            title: "Error",
            status: 500,
            msg: error
        });
    }
});

module.exports = router;