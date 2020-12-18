const mongoCollections = require("../config/mongoCollections");
const videos = mongoCollections.videos;
const check = require("../common/check");
const path = require('path');
const upPath = "../files/videos/upload/";


const downPath = process.cwd() + "/files/videos/download/";

async function create(authorID, title, path, filename) {

    check.args(arguments.length, 4);
    check.isObjID(authorID, "authorID");
    check.isStr(title, "title");
    // check.isObjID(videoFile, "videoFile");
    check.isStr(filename);

    let info = await mongoCollections.upload(path, filename);

    const videoCollection = await videos();

    let newVideo = {
        authorID: authorID,
        title: title,
        comments: [],
        playedNum: 0,
        like: 0,
        videoFile: info.id,
        filename: filename
    };

    const insertInfo = await videoCollection.insertOne(newVideo);

    if (insertInfo.insertedCount === 0) throw `create video failed`;

    const id = insertInfo.insertedId;

    const video = await videoCollection.findOne({
        _id: id
    });

    video._id = video._id.toString();
    return video;
}

async function download(id){
    let video = await get(id);
    info =  await mongoCollections.download(video.videoFile, path.resolve(downPath+video.filename));
    return {path: info, title: video.title, authorID: video.authorID, playedNum: video.playedNum};
} 

async function getAll() {
    const videoCollection = await videos();

    const videoAll = await videoCollection.find({}).toArray();

    videoAll.forEach(e => {
        e._id = e._id.toString();
    });

    return videoAll;
}

async function get(id) {

    check.args(arguments.length, 1);
    check.isStr(id, "id");

    let newId = check.isObjID(id);

    const videoCollection = await videos();
    const videoGet = await videoCollection.findOne({
        _id: newId
    });

    if (videoGet === null) throw `get user by id failed`;
    videoGet._id = videoGet._id.toString();
    return videoGet;
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

    let video = await get(id);
    let title = video.title;
    const videoCollection = await videos();
    const videoRemove = await videoCollection.deleteOne({
        _id: newId
    });
    if (videoRemove.deletedCount === 0) throw `remove user by id failed`;
    return `${title} has been successfully deleted`;
}

async function get_attr(id, attr) {
    check.args(arguments.length, 2);
    check.isStr(attr, "attr");

    let newId = check.isObjID(id);

    const videoCollection = await videos();
    const videoGet = await videoCollection.findOne({
        _id: newId
    });
    if (videoGet === null) throw `get attr by id failed`;
    
    return videoGet[attr];

}

async function update_played_num(id) {

    check.args(arguments.length, 2);
    check.isStr(id, "id");

    let newId = check.isObjID(id);

    let playedNum = await get_attr(id, "playedNum");

    let changeSet = {
        playedNum: playedNum+1
    };

    const videoCollection = await videos();

    const videoUpdate = await videoCollection.updateOne({
        _id: newId
    }, {
        $set: changeSet
    });
    if (videoUpdate.modifiedCount === 0) throw `update user by id failed`;
    return await get(id);
}

async function update_like(id){

    check.args(arguments.length, 2);
    check.isStr(id, "id");

    let newId = check.isObjID(id);

    let like = await get_attr(id, "like");

    let changeSet = {
        like: like + 1
    };

    const videoCollection = await videos();

    const videoUpdate = await videoCollection.updateOne({
        _id: newId
    }, {
        $set: changeSet
    });
    if (videoUpdate.modifiedCount === 0) throw `update user by id failed`;
    return await get(id);

}

async function dislike(id){
    check.args(arguments.length, 2);
    check.isStr(id, "id");

    let newId = check.isObjID(id);

    let like = await get_attr(id, "like");

    let changeSet = {
        like: like - 1
    };

    const videoCollection = await videos();

    const videoUpdate = await videoCollection.updateOne({
        _id: newId
    }, {
        $set: changeSet
    });
    if (videoUpdate.modifiedCount === 0) throw `update user by id failed`;
    return await get(id);
}

async function update_comments(id, cID){

    check.args(arguments.length, 2);
    check.isStr(id, "id");
    let newId = check.isObjID(id);
    check.isStr(cID, "cID");
    check.isObjID(cID, "cID");
    
    
    let coms = await get_attr(id, "comments");

    if( coms.indexOf(cID) === -1) coms.push(cID);

    let changeSet = {
        comments: coms
    };

    const videoCollection = await videos();

    const videoUpdate = await videoCollection.updateOne({
        _id: newId
    }, {
        $set: changeSet
    });
    if (videoUpdate.modifiedCount === 0) throw `update user by id failed`;
    return await get(id);
}

async function del_comments(id, cID){
    check.args(arguments.length, 2);
    check.isStr(id, "id");
    check.isStr(follower, "follower");
    check.isObjID(follower, "follower");
    
    let newId = check.isObjID(id);
    let coms = await get_attr(id, "comments");
    let index = coms.indexOf(cID);
    
    if(index !== -1) coms.splice(index, 1);

    let changeSet = {
        comments: coms
    };

    const videoCollection = await videos();

    const videoUpdate = await videoCollection.updateOne({
        _id: newId
    }, {
        $set: changeSet
    });
    if (videoUpdate.modifiedCount === 0) throw `update user by id failed`;
    return await get(id);

}

async function getMostLike(){
    const videoCollection = await videos();

    const mostLike = await videoCollection.find({}, { _id: 1, title: 1,
        authorID: 0,
        comments: 0,
        playedNum: 1,
        like: 1,
        videoFile: 0,
        filename: 0 }).sort({like : -1}).limit(8).toArray();

    return mostLike;
}

async function getEqualByfield(){}

module.exports = {
    create,
    getAll,
    get,
    remove,
    update_comments,
    getMostLike,
    download
};
