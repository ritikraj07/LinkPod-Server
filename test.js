var cron = require('node-cron');

cron.schedule('0 1 * * *', () => {
    console.log('Running a job at 01:00 at America/Sao_Paulo timezone');
}, {
    scheduled: true,
    timezone: "America/Sao_Paulo"
});