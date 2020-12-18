const stemmer = require('stemmer');
const data = require("../data/index");
const js_search = require("js-search");



async function getDocument(){
    let videos = await data.videosData.getAll();
    for(let i = 0; i < videos.length; i++){
        let user = await data.usersData.get(videos[i].authorID);
        videos[i].authorname = user.nickname;
    }
    return videos;
}

async function result(term) {
    var search = new js_search.Search('_id');
    search.tokenizer =
        new js_search.StemmingTokenizer(
            stemmer, // Function should accept a string param and return a string
            new js_search.SimpleTokenizer());
    search.addIndex('title');
    search.addIndex('authorname');
    search.addIndex('filename');

    let target = await getDocument();

    search.addDocuments(target);
    
    return search.search(term);
}

async function getHistory(history){

    let keyword = [];
    for(let i = 0; i < history.length; i++){
        let video = await data.videosData.get(history[i]);
        let user = await data.usersData.get(video.authorID);
        keyword.push(video.titile);
        keyword.push(user.nickname);
        keyword.push(video.filename);
    }
}

async function recommend(history) {

    var search = new js_search.Search('_id');
    search.tokenizer =
        new js_search.StemmingTokenizer(
            stemmer, // Function should accept a string param and return a string
            new js_search.SimpleTokenizer());
    search.addIndex('title');
    search.addIndex('authorname');
    search.addIndex('filename');

    let terms = await getHistory(history);
    let target = await getDocument();
    let result = [];

    search.addDocuments(target);
    
    
    for(let i = 0; i < terms.length; i++){
        result.concat(search.search(terms[i]));
    }

    if(result.length > 0) {
        result.filter((e) => {
            return history.indexOf((e._id)) === -1;
        });
    }
    return result;
}



module.exports = {
    result,
    recommend
};