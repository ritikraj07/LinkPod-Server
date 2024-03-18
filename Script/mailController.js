const fs = require('fs');
const Mail = require("./mail");
const path = require('path');

const SendOTPforPasswordReset = async ({ user, otp }) => {
    console.log('log from SendOTPforPasswordReset', otp, user.email);
    try {
        const mail = new Mail();
        mail.setTo(user.email);
        mail.setSubject('LinkPod - Password Reset');

        const filePath = path.resolve(__dirname, '../Script/Template/passwordReset.html');
        const html = fs.readFileSync(filePath, 'utf8');

        const updatedHtml = html.replace('<span id="otpPlaceholder"></span>', otp)
            .replace('<span id="user_name"></span>', user.name);

        mail.setHTML(updatedHtml);
        await mail.send(); // Wait for the email to be sent before proceeding
        console.log('Email sent successfully');
    } catch (error) {
        console.log('Error from SendOTPforPasswordReset:', error);
        throw error; // Re-throw the error for the caller to handle
    }
};

module.exports = { SendOTPforPasswordReset };
