const GenerateOTP = (minLength = 6, maxLength = 6, ) => {
    
    const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
    let OTP = '';
    for (let i = 0; i < length; i++) {
        OTP += Math.floor(Math.random() * 10);
    }
    return OTP

}

module.exports = {GenerateOTP};