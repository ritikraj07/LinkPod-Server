const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.MAIL_SENDER,
        pass: process.env.MAIL_PASS
    }
});

class Mail {

    constructor() {
        this.mailOptions = {
            from: {
                address: process.env.MAIL_SENDER,
                name: process.env.COMPANY_NAME
            },
            to: '',
            subject: '',
            text: 'Hello Devil'
        };
    }

    /**
     * Sets the name of the company that is sending the email.
     *
     * @param {string} name - The name of the company.
     */
    setCompanyName(name) {
        // Set the name of the company in the mail options.
        this.mailOptions.from.name = name;
    }

    /**
     * Sets the email address of the sender.
     *
     * @param {string} email - The email address of the sender.
     */
    setSenderEmail(email) {
        // Sets the email address of the sender in the mail options.
        //
        // @param {string} email - The email address of the sender.
        this.mailOptions.from.address = email;
    }

    /**
     * Sets the recipient email address.
     *
     * @param {string} receiver - The email address of the recipient.
     */
    setTo(receiver) {
        /**
         * The email address of the recipient.
         * @type {string}
         */
        this.mailOptions.to = receiver;
    }
    /**
     * Sets the subject of the email.
     *
     * @param {string} subject - The subject of the email.
     */
    setSubject(subject) {
        // Sets the subject of the email.
        // 
        // @param {string} subject - The subject of the email.
        this.mailOptions.subject = subject;
    }
    /**
     * Sets the text content of the email.
     *
     * @param {string} text - The text content of the email.
     */
    setText(text) {
        /**
         * The text content of the email.
         * @type {string}
         */
        this.mailOptions.text = text;
    }

    /**
     * Sets the HTML content of the email.
     *
     * @param {string} html - The HTML content of the email.
     */
    setHTML(html) {
        /**
         * The HTML content of the email.
         * @type {string}
         */
        this.mailOptions.html = html;
    }

    /**
     * Sends the email using the configured options.
     *
     * This function uses the nodemailer transporter to send the email.
     * If an error occursres during sending, it logs the error.
     * If the email is sent successfully, it logs the response from the server.
     *
     * @return {void} Does not return anything.
     */
    send() {
        // Sends the email using the configured options.
        // The method uses the nodemailer transporter to send the email.
        // If an error occurres, logs the error.
        // If the email is sent successfully, logs the response from the server.

        // Sends the email using the mail options and logs the result.
        transporter.sendMail(this.mailOptions, (error, info) => {
            // If an error occurres, logs the error.
            if (error) {
                console.log(error);
            } else {
                // If the email is sent successfully, logs the response from the server.
                console.log('Email sent: ' + info.response);
            }
        });
    }

}

module.exports = Mail;
