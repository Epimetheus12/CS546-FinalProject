const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const check = require("../common/check");


async function create(username, email, passsword, gender, nickname) {

    check.args(arguments.length, 5);
    check.isStr(username, "username");
    check.isStr(email, "email");
    check.isEmail(email, "email");
    check.isStr(passsword, "password");
    check.isHashed(passsword, "password");
    check.isGen(gender, "gender");
    check.isStr(nickname, "nickname");

    const userCollection = await users();

    let newUser = {
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        password: passsword,
        nickname: nickname,
        gender: gender,
        video: [],
        follower: [],
        followed: [],
        history: {}
    };

    const insertInfo = await userCollection.insertOne(newUser);

    if (insertInfo.insertedCount === 0) throw `create users failed`;

    const id = insertInfo.insertedId;

    const user = await userCollection.findOne({
        _id: id
    });

    user._id = user._id.toString();
    return user;
}

async function getAll() {
    const userCollection = await users();

    const userAll = await userCollection.find({}).toArray();

    userAll.forEach(e => {
        e._id = e._id.toString();
    });

    return userAll;
}

async function get(id) {

    check.args(arguments.length, 1);
    check.isStr(id, "id");

    let newId = check.isObjID(id);

    const userCollection = await users();
    const userGet = await userCollection.findOne({
        _id: newId
    });

    if (userGet === null) throw `get user by id failed`;
    userGet._id = userGet._id.toString();
    return userGet;
}

// async function get_id_by_uuid(uuid){


//     const userCollection = await users();
//     const userGet = await userCollection.findOne({
//         uuid: uuid
//     });
//     if (userGet === null) throw `get user by id failed`;
//     userGet._id = userGet._id.toString();
//     return userGet._id;
// }


async function remove(id) {

    check.args(arguments.length, 1);
    check.isStr(id, "id");

    let newId = check.isObjID(id);

    let user = await get(id);
    let username = user.username;
    const userCollection = await users();
    const userRemove = await userCollection.deleteOne({
        _id: newId
    });
    if (userRemove.deletedCount === 0) throw `remove user by id failed`;
    return `${username} has been successfully deleted`;
}

async function get_attr(id, attr) {
    check.args(arguments.length, 2);
    check.isStr(attr, "attr");

    let newId = check.isObjID(id);

    const userCollection = await users();
    const userGet = await userCollection.findOne({
        _id: newId
    });
    if (userGet === null) throw `get attr by id failed`;
    
    return userGet[attr];

}

async function getByName(name) {
    check.args(arguments.length, 1);
    check.isStr(name, "name");

    let newName = name.toLowerCase();

    const userCollection = await users();
    const userGet = await userCollection.findOne({
        username: newName
    });

    if (userGet === null) return null;
    return userGet;
}

async function update_personal(id, ...info) {

    check.args(arguments.length, 2);
    check.isStr(id, "id");

    let newId = check.isObjID(id);

    let changeSet = {};

    if(info[0]){
        check.isStr(info[0], "email");
        check.isEmail(info[0], "email");
        changeSet.email = info[0];
    }
    if(info[1]) {
        check.isStr(info[1], "password");
        check.isHashed(info[1], "password");
        changeSet.passsword = info[1];
    }

    if(info[2]) {
        check.isStr(info[2], "nickname");
        changeSet.nickname = info[2];
    }

    const userCollection = await users();

    const userUpdate = await userCollection.updateOne({
        _id: newId
    }, {
        $set: changeSet
    });
    if (userUpdate.modifiedCount === 0) throw `update user by id failed`;
    return await get(id);
}


async function update_video(id, video_id){

    check.args(arguments.length, 2);
    check.isStr(id, "id");
    check.isStr(video_id, "video_id");
    check.isObjID(video_id, "video_id");
    let newId = check.isObjID(id);

    let videos = await get_attr(id, "video");

    if( videos.indexOf(video_id) === -1) videos.push(video_id);

    let changeSet = {
        video: videos
    };

    const userCollection = await users();

    const userUpdate = await userCollection.updateOne({
        _id: newId
    }, {
        $set: changeSet
    });
    if (userUpdate.modifiedCount === 0) throw `update user by id failed`;
    return await get(id);

}

async function del_video(id, video_id){
    check.args(arguments.length, 2);
    check.isStr(id, "id");
    check.isStr(video_id, "video_id");
    check.isObjID(video_id, "video_id");
    let newId = check.isObjID(id);

    let videos = await get_attr(id, "video");
    let index = videos.indexOf(video_id);

    if( index !== -1) videos.splice(index, 1);

    let changeSet = {
        video: videos
    };

    const userCollection = await users();

    const userUpdate = await userCollection.updateOne({
        _id: newId
    }, {
        $set: changeSet
    });
    if (userUpdate.modifiedCount === 0) throw `update user by id failed`;
    return await get(id);
}

async function update_follower(id, follower){

    check.args(arguments.length, 2);
    check.isStr(id, "id");
    check.isStr(follower, "follower");
    check.isObjID(follower, "follower");
    
    let newId = check.isObjID(id);
    
    let followers = await get_attr(id, "follower");

    if( followers.indexOf(follower) === -1) followers.push(follower);

    let changeSet = {
        follower: followers
    };

    const userCollection = await users();

    const userUpdate = await userCollection.updateOne({
        _id: newId
    }, {
        $set: changeSet
    });
    if (userUpdate.modifiedCount === 0) throw `update user by id failed`;
    return await get(id);
}

async function del_follower(id, follower){
    check.args(arguments.length, 2);
    check.isStr(id, "id");
    check.isStr(follower, "follower");
    check.isObjID(follower, "follower");
    
    let newId = check.isObjID(id);
    let followers = await get_attr(id, "follower");
    let index = followers.indexOf(follower);
    
    if(index !== -1) followers.splice(index, 1);

    let changeSet = {
        follower: followers
    };

    const userCollection = await users();

    const userUpdate = await userCollection.updateOne({
        _id: newId
    }, {
        $set: changeSet
    });
    if (userUpdate.modifiedCount === 0) throw `update user by id failed`;
    return await get(id);

}

async function update_followed(id, followed){

    check.args(arguments.length, 2);
    check.isStr(id, "id");
    check.isStr(followed, "followed");
    check.isObjID(followed, "followed");
    
    let newId = check.isObjID(id);
    
    let followeds = await get_attr(id, "followed");

    if( followeds.indexOf(followed) === -1) followeds.push(followed);

    let changeSet = {
        followed: followeds
    };

    const userCollection = await users();
    const userUpdate = await userCollection.updateOne({
        _id: newId
    }, {
        $set: changeSet
    });

    if (userUpdate.modifiedCount === 0) throw `update user by id failed`;
    return await get(id);
}

async function del_followed(id, followed){
    check.args(arguments.length, 2);
    check.isStr(id, "id");
    check.isStr(followed, "followed");
    check.isObjID(followed, "followed");
    
    let newId = check.isObjID(id);
    
    let followeds = await get_attr(id, "followed");

    let index = followeds.indexOf(followed);

    if( index !== -1) followeds.splice(index, 1);

    let changeSet = {
        followed: followeds
    };

    const userCollection = await users();
    const userUpdate = await userCollection.updateOne({
        _id: newId
    }, {
        $set: changeSet
    });

    if (userUpdate.modifiedCount === 0) throw `update user by id failed`;
    return await get(id);

}


async function update_history(id, history){

    check.args(arguments.length, 2);
    check.isStr(id, "id");
    check.isObj(history, "history");
    let video_id = Object.keys(history)[0];
    check.isStr(video_id);
    check.isObjID(video_id);
    check.isStr(history.video_id);

    let newId = check.isObjID(id);

    let historys = await get_attr(id, "history");

    historys.video_id = history.video_id;

    let keys = Object.keys(historys);

    if(keys.length > 50) delete historys.keys[0];

    const userCollection = await users();

    const userUpdate = await userCollection.updateOne({
        _id: newId
    }, {
        $set: changeSet
    });
    if (userUpdate.modifiedCount === 0) throw `update user by id failed`;
    return await get(id);
}

async function getAllName(){
    const usersCollection = await users();

    const result = await usersCollection.find({}, { _id: 0, 
        username: 1,
        nickname: 1,
        }).toArray();

    return result;
}


module.exports = {
    create,
    getAll,
    get,
    remove,
    getByName,
    update_personal,
    getAllName
};
