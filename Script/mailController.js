const fs = require('fs');
const Mail = require("./mail")
const path = require('path');



const SendOTPforPasswordReset = async ({ user, otp }) => {
    console.log('log from SendOTPforPasswordReset', user, otp)
    try { 
        const mail = new Mail();
        mail.setSenderEmail(process.env.MAIL_SENDER);
        mail.setCompanyName('LinkPod');
        mail.setTo(user.email);
        mail.setSubject('LinkPod - Password Reset');

        const filePath = path.resolve(__dirname, '../Script/Template/passwordReset.html');
        fs.readFile(filePath, 'utf8', async (err, html) => {
            if (err) {
                console.error('Error reading HTML file:', err);
                return;
            }

            html = html.replace('<span id="otpPlaceholder"></span>', otp);
            html = html.replace('<span id="user_name"></span>', user.name);
            mail.setHTML(html)
            mail.send();
        })
    } catch (error) {
        console.log('error from SendOTPforPasswordReset', error)
    }

   

}

module.exports = { SendOTPforPasswordReset }



