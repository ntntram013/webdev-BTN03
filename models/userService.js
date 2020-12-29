const {ObjectId} = require('mongodb');

const {db} = require("../dal/userDal");


// module.exports.auth = async (userInfo, pass) => {
//     let err = "";
//     // find
//     // let hasUsername = findone with username
//     // let hasEmail = findone with email
//     // let user = hasUsername || hasEmail
//     // if(user) {
//     // let checkPassword = await bcrypt,compare(pass,user.pass);
//     // if (!checkPassword){
//     //    err = "usernam pass not match";
//     // }
//     // else if( user.isActive == false){
//     //     err = "bi block roi conloz"
//     // }
//     // return err;
//
// }
