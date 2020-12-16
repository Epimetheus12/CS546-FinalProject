const data = require("../data");
const userTemp = require("./user");
const bcrypt = require("bcrypt");


async function addUser() {
    for (let i = 0; i < userTemp.length; i++) {
        try {
            let pwd = await bcrypt.hash(userTemp[i].password, 12);
            await data.usersData.create(
                userTemp[i].username,
                userTemp[i].email,
                pwd,
                userTemp[i].gender,
                userTemp[i].nickname);
        } catch (e) {
            console.log(e);
        }
    }
}

async function main() {
    await addUser();
}


main();