var cron = require('node-cron');

cron.schedule('*/1 * * * * * *', () => {
    console.log(new Date());
});