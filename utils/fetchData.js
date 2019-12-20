module.exports = (collection) => {
    const promise = new Promise((resolve, reject) => {
        collection.find((err, bookings) => {
            if(err)
            {
                console.log(err);
            }
            else
            {
                resolve(bookings);
            }
        });     
    });

    return promise;
}
