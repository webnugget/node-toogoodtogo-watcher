const nodemailer = require('nodemailer');
const { config } = require("./config");


let mailer = undefined; 

function initializeNodemailer(){

        console.log('init mail', config.notifications.mail);
        mailer = nodemailer.createTransport({
            host: config.get("notifications.mail.host"),
            port: config.get("notifications.mail.port"),
            secure: config.get("notifications.mail.secure"), // upgrade later with STARTTL"S
            auth: {
                user: config.get("notifications.mail.auth.user"),
                pass: config.get("notifications.mail.auth.pass"),
            },
        });
}

function notifyMail(textMessage, htmlMessage) {

    if(!config.get("notifications.mail.enabled")){
        return;
    }

    if(mailer === undefined){
        initializeNodemailer();
    }    

    var message = {
        from: config.get("notifications.mail.senderAddress"),
        to: config.get("notifications.mail.receiverAddress"),
        subject: "Futterstatus geändert",
        text: textMessage,
        html: htmlMessage
    };

    console.log(textMessage);

    mailer.sendMail(message).then((result) => {
        console.log(JSON.stringify(result));
    });
    
}
  

module.exports = {
    notifyMail,
};
  
  