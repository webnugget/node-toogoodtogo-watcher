const got = require("got");
const { config } = require("./config");

module.exports = {
  notifyWebhook,
};

function notifyWebhook(textMessage, htmlMessage, raw) {



  got.post(config.get("notifications.webhook.url"), {
	json: {
		textMessage,
        htmlMessage,
        raw,
	},
    headers: {
        authorization: config.get("notifications.webhook.key")
    }
}).json();

}
