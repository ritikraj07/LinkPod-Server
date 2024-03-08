const cron = require('node-cron');

let i = 0;
const j = 5;

function startCronJob() {
    const task = cron.schedule('*/5 * * * * * *', () => {
        if (i < j) {
            i++;
            console.log(new Date());
        } else {
            task.stop(); // Stop the cron job when i == j
        }
        console.log(i);
    });
}

startCronJob(); // Call the function to start the cron job

// Additional code here...
