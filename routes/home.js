const express = require('express');
const {
    recommend
} = require('../common/search');
const router = express.Router();
const data = require('../data/index');


router.get('/', async (req, res) => {
    try {
        let body;
        body = {
            videos: false
        };

        if (req.session.user) {
            const user = await data.usersData.get(req.session.user.userID);
            let history = Object.keys(user.history);
            if (history.length > 0) {
                body = recommend(history);
            } else {
                try {
                    body = await data.videosData.getMostLike();
                } catch (error) {
                    body = {
                        videos: false
                    };
                }
            }
            res.render('basic/home', {
                data: body,
                nickname: req.session.user.nickname
            });
        } else {
            try {
                body = await data.videosData.getMostLike();
            } catch (error) {
                body = {
                    videos: false
                };
            }
            res.render('basic/home', {
                data: body,
                nickname: false
            });
        }
    } catch (error) {
        res.status(500).render("error", {
            title: "Error",
            status: 500,
            msg: error
        });
    }
});

module.exports = router;