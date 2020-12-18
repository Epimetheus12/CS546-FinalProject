const express = require('express');
const router = express.Router();
const users = require('../data/users');
const bcrypt = require('bcrypt');

router.get('/', async (req, res) => {
    try {
        let body = {
            title: 'MyAccount'
        };
        let user = req.session.user;

        if (user) {
            let history = [];
            let fol = [];
            let foled = [];
            let contri = [];
            const info = await users.get(user.userID);
            const userHis = Object.keys((info.history));
            for (let i = 0; i < userHis.length; i++) {
                let video = await data.videosData.get(userHis[i]);
                let author = await data.usersData.get(video.authorID);
                history.push({
                    id: video._id,
                    title: video.titile,
                    author: author.nickname,
                    lastWatch: info.history[userHis[i]]
                });
            }

            for (let i = 0; i < info.follower.length; i++) {
                let temp = await data.usersData.get(info.follower[i]);
                fol.push({
                    nickname: temp.nickname,
                });
            }

            for (let i = 0; i < info.followed.length; i++) {
                let temp = await data.usersData.get(info.followed[i]);
                foled.push({
                    nickname: temp.nickname,
                });
            }

            for (let i = 0; i < info.video.length; i++) {
                let video = await data.videosData.get(info.video[i]);
                contri.push({
                    id: video._id,
                    title: video.titile,
                });
            }

            body = {
                title: 'MyAccount',
                info: {
                    username: info.username,
                    nickname: info.nickname,
                    email: info.email,
                    gender: info.gender
                },
                history: history,
                follower: fol,
                followed: foled,
                contri: contri
            };
            return res.render('users/private', body);
        }
        res.status(401).redirect('/login');
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
        const email = req.body.email;
        const password = req.body.password;
        const nickname = req.body.nickname;

        // if check_three_attr_here;
        if(!email && !password && !nickname){
            return res.status(500).render("error", {
                title: "Error",
                status: 401,
                msg: error
            });
        }
        let session = req.session.user;
        if (session) {
            const user = await users.update_personal(session.userID, [email, password, nickname]);
            session.nickname = user.nickname;
            res.redirect('/private');

        } else res.status(401).redirect('/login');
    } catch (error) {
        res.status(500).render("error", {
            title: "Error",
            status: 500,
            msg: error
        });
    }
});

module.exports = router;