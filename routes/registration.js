const express = require('express');
const router = express.Router();
const data = require('../data/index');
const check = require('../common/check');
const bcrypt = require('bcrypt');

router.post('/', async (req, res) => {
    //set cookie here
    try {
        const info = req.body;
        //check params
        if (condition) {
            const user = await data.usersData.create(info.username, info.email, info.password, info.gender, info.nickname);
            //judge in jq
            req.session.user = {
                nickname: nickname,
                userID: userID
            };
            res.redirect('/login');
        } else res.status(401).render('users/login', {
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

router.get('/checkname/:name', async (req, res) => {
    try {
        let body = {used: false};
        const name = req.params.name;

        const result = await data.usersData.getAllName();

        for(let i = 0; i < result.length; i++){
            if(name === result[i].username){
                body.used = true;
            }
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

router.get('/checknick/:nick', async (req, res) => {
    try {
        let body = {used: false};
        const nick = req.params.nick;

        const result = await data.usersData.getAllName();

        for(let i = 0; i < result.length; i++){
            if(nick === result[i].nickname){
                body.used = true;
            }
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