const UserModel = require('../models/user');

exports.postUser = function(req, res) {  

    const username = JSON.parse(req.body.User).username;
    const password = JSON.parse(req.body.User).password;

    UserModel.User.findOne({username: username}, (err, foundUser) =>{
        if(err)
        {
            console.log(err);
        }
        else{
            if(foundUser)
            {
                if(foundUser.password === password)
                {
                    res.send(foundUser.role);
                }
            }
        }
   });
}