const dbConnection = require('./mongoConnection');
const fs = require('fs');
const mongodb = require('mongodb');

const getCollection = (collection) => {
    let _col;

    return async () => {
        if (!_col) {
            const db = await dbConnection();
            _col = await db.collection(collection);
        }

        return _col;
    };
};

const upload = async (path, name) => {
    const db = await dbConnection();
    var bucket = new mongodb.GridFSBucket(db, {
        bucketName: 'videos'
    });

    const info = fs.createReadStream(path+name).
    pipe(bucket.openUploadStream(name)).
    on('error', function (error) {
        assert.ifError(error);
    }).
    on('finish', function () {
        console.log('done!');
        process.exit(0);
    });
    return {id: info.id, filename: info.filename};
};

const download = async (id, path) => {
    const db = await dbConnection();
    var bucket = new mongodb.GridFSBucket(db, {
        bucketName: 'videos'
    });
    let stream = await bucket.openDownloadStream(mongodb.ObjectID(id)); // <-- skip the first 1585 KB, approximately 41 seconds
    await stream.pipe(fs.createWriteStream(path)).
    on('error', function(error) {
    assert.ifError(error);
    }).
    on('end', function() {
    console.log('done!');
    process.exit(0);
  });
  return path+name;
};

module.exports = {
    users: getCollection("users"),
    comments: getCollection("comments"),
    videos: getCollection("videos"),
    upload: upload,
    download: download,
    videosFs: getCollection("videos.files")
};