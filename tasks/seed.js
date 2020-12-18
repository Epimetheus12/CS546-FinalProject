const data = require("../data");
const userTemp = require("./user");
const bcrypt = require("bcrypt");
const fs = require('fs');

const commentList = [{detail: "Good.", level: 1}, {detail: "Not bad.", level: 1},
    {detail: "Awesome.", level: 1}, {detail: "Pretty good.", level: 1},
    {detail: "I don't like it.", level: 1}, {detail: "I like it.", level: 1},
    {detail: "It is a shit.", level: 1}, {detail: "I don't like this actor..", level: 1},
    {detail: "This actress is really sexy.", level: 1}, {detail: "Nintendo is the master of the world.", level: 1}];

const path = "./sample/";


async function addUser() {
    const allFile = fs.readdirSync(path);
    console.log(allFile);
    for (let i = 0; i < userTemp.length; i++) {
        try {
            let pwd = await bcrypt.hash(userTemp[i].password, 12);
            let user = await data.usersData.create(
                userTemp[i].username,
                userTemp[i].email,
                pwd,
                userTemp[i].gender,
                userTemp[i].nickname);

            await data.commentsData.create(user._id, commentList[i].detail, commentList[i].level);
            
            const video = await data.videosData.create(user._id, allFile[i], path, allFile[i]);

        } catch (e) {
            console.log(e);
        }
    }
}

async function main() {
    await addUser();
}


main();