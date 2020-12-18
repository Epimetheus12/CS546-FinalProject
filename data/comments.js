const mongoCollections = require("../config/mongoCollections");
const comments = mongoCollections.comments;
const check = require("../common/check");
const e = require("express");


async function create(authorID, details, level, parentID) {

    check.args(arguments.length, 3);
    check.isObjID(authorID, "authorID");
    check.isStr(details);
    check.isNum(level);
    check.isLv(level);

    const commCollection = await comments();

    let newComm = {
        authorID: authorID,
        details: details,
        level: level,
        like : 0, 
        comments: []
    };

    if(level === 2){
        newComm.parentID = parentID;
    }

    const insertInfo = await commCollection.insertOne(newComm);

    if (insertInfo.insertedCount === 0) throw `create users failed`;

    const id = insertInfo.insertedId;

    const comm = await commCollection.findOne({
        _id: id
    });

    comm._id = comm._id.toString();
    return comm;
}

async function getAll() {
    const commCollection = await comments();

    const commAll = await commCollection.find({}).toArray();

    commAll.forEach(e => {
        e._id = e._id.toString();
    });

    return commAll;
}

async function get(id) {

    check.args(arguments.length, 1);
    check.isStr(id, "id");

    let newId = check.isObjID(id);

    const commCollection = await comments();
    const commGet = await commCollection.findOne({
        _id: newId
    });

    if (commGet === null) throw `get user by id failed`;
    commGet._id = commGet._id.toString();
    return commGet;
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

    let comm = await get(id);
    let below = comm.comments;
    if(below.length != 0) {
        for(let i = 0; i < below.length; i++){
            await remove(below[i]);
        }
    }
    const commCollection = await comments();
    const commRemove = await commCollection.deleteOne({
        _id: newId
    });
    if (commRemove.deletedCount === 0) throw `remove user by id failed`;
    return `comments has been successfully deleted`;
}

async function get_attr(id, attr) {
    check.args(arguments.length, 2);
    check.isStr(attr, "attr");

    let newId = check.isObjID(id);

    const commCollection = await comments();
    const commGet = await commCollection.findOne({
        _id: newId
    });
    if (commGet === null) throw `get attr by id failed`;
    
    return commGet[attr];

}

async function update_comments(id, belowID) {

    check.args(arguments.length, 2);

    let coms = await get(id, "comments");

    let index = coms.indexOf(belowID);
    
    if(index === -1) coms.push(belowID);

    let changeSet = {
        comments: coms
    };

    const commCollection = await comments();

    const commUpdate = await commCollection.updateOne({
        _id: newId
    }, {
        $set: changeSet
    });
    if (commUpdate.modifiedCount === 0) throw `update user by id failed`;
    return await get(id);
}

async function del_comments(id, belowID) {

    check.args(arguments.length, 2);

    let coms = await get(id, "comments");

    let index = coms.indexOf(belowID);
    
    if(index !== -1) coms.splice(index, 1);

    let changeSet = {
        comments: coms
    };

    const commCollection = await comments();

    const commUpdate = await commCollection.updateOne({
        _id: newId
    }, {
        $set: changeSet
    });
    if (commUpdate.modifiedCount === 0) throw `update user by id failed`;
    return await get(id);
}



async function update_like(id){

    check.args(arguments.length, 2);

    let like = await get_attr(id, "like");

    let changeSet = {
        like: like + 1
    };

    const commCollection = await comments();

    const commUpdate = await commCollection.updateOne({
        _id: newId
    }, {
        $set: changeSet
    });
    if (commUpdate.modifiedCount === 0) throw `update user by id failed`;
    return await get(id);

}

async function dislike(id){
    check.args(arguments.length, 2);

    let like = await get_attr(id, "like");

    let changeSet = {
        like: like - 1
    };

    const commCollection = await comments();

    const commUpdate = await commCollection.updateOne({
        _id: newId
    }, {
        $set: changeSet
    });
    if (commUpdate.modifiedCount === 0) throw `update user by id failed`;
    return await get(id);
}


module.exports = {
    create,
    getAll,
    get,
    remove,
    update_comments,
    del_comments
};