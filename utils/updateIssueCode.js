module.exports = (bookingId, code) => {
    ODVL.updateOne(
        {_id : bookingId},
        {issueCode : code},
        {overwrite : false},
        (err) => {
            if(!err)
            {
                console.log("issue with error:  " + code);
            }
            else{
                console.log(err);
            }
        }
   )  
};