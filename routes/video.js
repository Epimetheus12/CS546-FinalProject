const express = require('express');
const router = express.Router();
const data = require('../data/index');
const fileAct = require('../common/fileAction');

const path = "../files/download/";

router.get('/:id', async (req, res) => {
    try {
        let body = {
            status: false
        };

        const reply = await data.videosData.download(req.params.id);

        if (reply) {
            body.status = true;
        }

        if (body.status) {
            let info = [];

            if (req.session.user) {
                const video = await data.videosData.get(req.params.id);
                for (let i = 0; i < video.comments.length; i++) {
                    let comm_1 = await data.commentsData.get(video.comments[i]);
                    let user_1 = await users.get(comm.authorID);
                    info.push({
                        id: comm_1._id,
                        nickname: user_1.nickname,
                        authorID: comm_1.authorID,
                        details: comm_1.details,
                        level: comm_1.level,
                        like: comm_1.like
                    });

                    // if (comm_1.comments.length > 0) {
                    //     for (let i = 0; i < comm_1.comments.length; i++) {
                    //         let comm_2 = await data.commentsData.get(comm_1.comments[i]);
                    //         let user_2 = await users.get(comm_2.authorID);
                    //         info[0].push({
                    //             id: comm_2._id,
                    //             nickname: user_2.nickname,
                    //             authorID: comm_2.authorID,
                    //             details: comm_2.details,
                    //             level: comm_2.level,
                    //             like: comm_2.like
                    //         });
                    //     }
                    // }
                }
            }
            const user = await data.usersData.get(reply.authorID);
            res.render('videos/video', {
                data: {
                    id: req.params.id,
                    title: reply.title,
                    authorName: user.nickname,
                    playedNum: reply.playedNum,
                    info: info
                }
            });

        } else {
            res.status(500).render("error", {
                title: "Error",
                status: 500,
                msg: error
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

router.post('/upload', async (req, res) => {
    try {
        let body = {
            status: false
        };

        const info = req.body;

        body = result(req.params.term);

        if (req.session.user) {
            const upload = await data.videosData.create(
                req.session.user.userID, info.title, info.filename);
            if (upload) {
                fileAct.deleteFile(path, info);
                body.status = true;
            }
            res.json(body);

        } else {
            res.json(body);
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