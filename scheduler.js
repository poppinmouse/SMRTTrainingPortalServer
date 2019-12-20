const scheduleCallbackFunc = require("./scheduleCallback");

//run every 1 min
const check = schedule.scheduleJob('*/1 * * * *', scheduleCallbackFunc);

module.exports = check;