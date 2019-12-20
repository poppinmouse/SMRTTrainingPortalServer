// const UserModel = require('../models/user');

// exports.postUser = function(req, res) {  
//     // const user = new UserModel.User({
//     //     username:"admin",
//     //     password: "123",
//     //     role: "admin"
//     // });
// console.log(UserModel.User);

//     const parsedUser = JSON.parse(req.body.User);
//     const username = parsedUser.username;
//     const password = parsedUser.password;

//     UserModel.User.findOne({username : username}, (err, foundUser) => {
// //         if(err)
// //         {
// //             console.log(err);
// //         }
// //         else{
// //             if(foundUser)
// //             {
// //                 if(foundUser.password === password)
// //                 {
// //                     res.sent(foundUser.username);
// //                 }
// //             }
// //         }
//     });
// }