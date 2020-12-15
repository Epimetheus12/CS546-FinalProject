const {
    ObjectID
} = require("mongodb");
const bcrypt = require("bcrypt");
const genders = ['male', 'female'];

function checkIsObjId(id){
    try {
        return ObjectID(id);
    } catch (error) {
        throw `${id} is not a valid ObjectID.`;
    }
}

function checkArguments(argNum, length) {
    if (argNum < length) throw `Provided ${argNum} variable(s) less than ${length} required variable(s).`;
}

function checkIsStrAndIsEmpty(val, variableName) {
    if (typeof val !== 'string') throw `${variableName || "Provided variable"} is not a string.`;
    if (val.split(' ').join('').length === 0) throw `${variableName || "Provided variable"} is empty`;
}

function checkIsArr(val, variableName) {
    if (!Array.isArray(val)) throw `${variableName || "Provided variable"} is not an array.`;
}

function checkIsArrayWithAtLeastOneStr(val, variableName) {
    if (!Array.isArray(val)) throw `${variableName || "Provided variable"} is not an array.`;
    if (val.length === 0) throw `${variableName || "Provided variable"} is empty.`;
    let count = 0;
    val.forEach(e => {
        if (typeof e === 'string') {
            if (e.split(' ').join('').length !== 0) count++;
        }
    });
    if (count === 0) throw `${variableName || "Provided variable"} doesn't has at least one elment which is string and is not empty.`;
}

function checkIsObject(val, variableName) {
    if (Object.prototype.toString.call(val) !== "[object Object]") throw `${variableName || "Provided variable"} is not a object.`;
}

function checkObjKeysAndValues(val, variableName) {
    if (Object.keys(val).length === 0) throw `${variableName || "Provided variable"} is empty object.`;
    if (Object.keys(val).indexOf("authorFirstName") === -1) throw `${variableName || "Provided variable"} doesn't has key:authorFirstName.`;
    if (Object.keys(val).indexOf("authorLastName") === -1) throw `${variableName || "Provided variable"} doesn't has key:authorLastName.`;
    checkIsStrAndIsEmpty(val.authorFirstName);
    checkIsStrAndIsEmpty(val.authorLastName);
}

// function checkIsValidDate(val, variable){//val is string
//     let date = new Date(val);
//     if(isNaN(date.getTime())) throw `please enter date like month/date/year`;
//     // let valArr = val.split(/\D/);
//     let valArr = val.split('/');
//     if(valArr.length !== 3) throw `please use seperator like month/date/year`;
//     // if(date.getDate() !== valArr[1] && date.getDate() !== valArr[2]) throw ``;
//     if(date.getDate().toString() !== valArr[1]) throw `this is not a valid date`;
// }

function checkIsRating(num, variableName) {
    //is a num a positive integer
    if (typeof num !== "number") {
        throw `${variableName || "Provided variable"} is not a number.`;
    }
    if (isNaN(num)) {
        throw `${variableName || "Provided variable"} is NaN.`;
    }
    if (num < 1) {
        throw `${variableName || "Provided variable"} is less than 1.`;
    }
    if (num > 5) {
        throw `${variableName || "Provided variable"} is more than 5.`;
    }
}

function checkIsEmail(email, variableName) {
    var pattern= /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    if(!pattern.test(email)){
        throw `${variableName || "Provided variable"} is not a validate email address.`;
    }
}

function checkIsHashed(password, variableName){
    try {
        rounds = bcrypt.getRounds(password);
    } catch (error) {
        throw `${variableName || "Provided variable"} is not a validate hashed password.`;
    }
    if (rounds !== 12){
        throw `${variableName || "Provided variable"} is not a password with correct round.`;
    }
}

function checKIsGender(gender, variableName){
    if (genders.indexOf(gender.toLowerCase()) === -1){
        throw `${variableName || "Provided variable"} is not a validate gender`;
    }
}

function checkIsDate(date, variableName) {
    if(!(date instanceof Date)) {
        throw `${variableName || "Provided variable"} is not a date`;
    }
}

function checkIsNum(num, variableName) {
    if (typeof num !== "number") {
        throw `${variableName || "Provided variable"} is not a number.`;
    }
    if (isNaN(num)) {
        throw `${variableName || "Provided variable"} is NaN.`;
    }
}

function checkIsLevel(num, variableName) {
    if(num < 1 || num > 2){
        throw `${variableName || "Provided variable"} must larger than 1.`;
    }
}

module.exports = {
    args: checkArguments,
    isStr: checkIsStrAndIsEmpty,
    isArr: checkIsArr,
    isStrInArr: checkIsArrayWithAtLeastOneStr,
    isObj: checkIsObject,
    isObjID: checkIsObjId,
    isKandV: checkObjKeysAndValues,
    isRating: checkIsRating,
    isEmail: checkIsEmail,
    isHashed: checkIsHashed,
    isGen: checKIsGender,
    isDate: checkIsDate,
    isNum: checkIsNum,
    isLv: checkIsLevel
};