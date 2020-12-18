const express = require('express');
const router = express.Router();
const users = require('../data/users');
const bcrypt = require('bcrypt');

router.get('/', async (req, res) => {
    try {
        let body = {title: 'login'};

        if (req.session.user) {
            
            return res.redirect('/');
        }
        
        res.render('users/login', {data:body});
    } catch (error) {
        res.status(500).render("error", {
            title: "Error",
            status: 500,
            msg: error
        });
    }
});

router.post('/', async (req, res) => {
    //set cookie here
    try {
        const username = req.body.username.toLowerCase();
        const password = req.body.password;
        let isAuth = false;
        let userID;
        let nickname;

        if (!username) return res.status(401).render('error', {
            title: "login",
            status: 401,
            error: "Provided username or password is not valid."
        });
        if (!password) return res.status(401).render('error', {
            title: "login",
            status: 401,
            error: "Provided username or password is not valid."
        });

        const user = await users.getByName(username);

        if(user){
            if (await bcrypt.compare(password, user.password)) {
                isAuth = true;
                userID = user._id;
                nickname = user.nickname;
            }
        }

        if (isAuth) {
            req.session.user = {
                nickname: nickname,
                userID: userID
            };
            res.redirect('/');
        } else res.status(401).render('error', {
            title: "login",
            status: 401,
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
        res.redirect("/", body);
    } catch (error) {
        res.status(500).render("error", {
            title: "Error",
            status: 500,
            msg: error
        });
    }
});

router.get('/status', async (req, res) => {
    try {
        let body = {login: false};

        if (req.session.user) {
            
            body.login = true;
        }

        res.json(body);

    } catch (error) {
        res.status(500).render("error", {
            title: "Error",
            status: 500,
            msg: error
        });
    }
});

module.exports = router;