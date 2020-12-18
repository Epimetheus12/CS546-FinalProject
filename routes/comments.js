const express = require('express');
const router = express.Router();
const data = require("../data/index");
// const comments = require('../data/comments');
// const videos = require("../data/videos");
// const users = require("../data/users");

router.get('/:video', async (req, res) => {
    try {
        let info = [];

        if (req.session.user) {
            const video = await data.videosData.get(req.params.video);
            for (let i = 0; i < video.comments.length; i++) {
                let comm_1 = await data.commentsData.get(video.comments[i]);
                let user_1 = await users.get(comm.authorID);
                info.push([{
                    id: comm_1._id,
                    nickname: user_1.nickname,
                    authorID: comm_1.authorID,
                    details: comm_1.details,
                    level: comm_1.level,
                    like: comm_1.like
                }]);

                if (comm_1.comments.length > 0) {
                    for (let i = 0; i < comm_1.comments.length; i++) {
                        let comm_2 = await data.commentsData.get(comm_1.comments[i]);
                        let user_2 = await users.get(comm_2.authorID);
                        info[0].push({
                            id: comm_2._id,
                            nickname: user_2.nickname,
                            authorID: comm_2.authorID,
                            details: comm_2.details,
                            level: comm_2.level,
                            like: comm_2.like
                        });
                    }
                }
            }
            res.json({
                info: info
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

router.post('/delete/:id', async (req, res) => {
    //set cookie here
    try {

        const session = req.session.user;
        if(session){
            const comm = await data.commentsData.get(req.params.id);

            if(comm.userID === session.userID){
                if(comm.level === 2){
                    await data.commentsData.del_comments(comm.parentID, req.params.id);
                }
                await data.commentsData.remove(req.params.id);
            }
        }else res.status(401).render('users/login', {
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



router.post('/:video/:level', async (req, res) => {
    //remove authcookies
    try {
        const user = req.session.user;
        let comm;
        //jq create form, class = level
        if (user) {
            if(req.body.level === 2){
                comm = await data.commentsData.create(
                    user.userID, req.body.details, req.body.level, req.body.comm);
            }
            
            comm = await data.commentsData.create(
                user.userID, req.body.details, req.body.level);
            if (req.body.level === 1) {
                await data.videosData.update_comments(req.params.video, comm._id);
            }
            if (req.body.level === 2) {
                await data.videosData.update_comments(req.body.comm, comm._id);
            }
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