const express = require('express');
const { result } = require('../common/search');
const router = express.Router();
const data = require('../data/index');


router.post('/', async (req, res) => {
    try {
        let body = [];

        if(!req.body.searchTerm){
            res.status(401).render("error", {
                title: "Error",
                status: 401,
                msg: "Invalid search Term"
            });
        }
        body = await result(req.body.searchTerm);
        res.render("search/search", {
            title: `Result of ${req.body.searchTerm}`,
            data: body, 
            searchTerm: req.body.searchTerm
        });
    } catch (error) {
        res.status(500).render("error", {
            title: "Error",
            status: 500,
            msg: error
        });
    }
});

module.exports = router;