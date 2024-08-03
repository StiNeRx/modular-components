const { MailtrapClient } = require("mailtrap");
const { toBase64 } = require("./base64converter");
const { API_TOKEN, SENDER_EMAIL,
    SENDER_NAME, RECIPENT_EMAIL,
    ENDPOINT_URL,SUBJECT, RECORDED_MESSAGE,
    ATTACHMENT_NAME, STATUS_SUCCESS,
    STATUS_NOT_FOUND, STATUS_INTERNAL_SERVER_ERROR } = require('./constants');

// credentials for authentication

const TOKEN = API_TOKEN;
const ENDPOINT = ENDPOINT_URL;

const client = new MailtrapClient({ endpoint: ENDPOINT, token: TOKEN });

const sender = {
  email: SENDER_EMAIL,
  name: SENDER_NAME,
};
const recipients = [
  {
    email: RECIPENT_EMAIL,
  }
];


async function sendMail(ATTACHMENT_PATH) {
    let response;
    console.log("inside sendMail");
    const attachment_content = toBase64(ATTACHMENT_PATH);
    client
  .send( {
    from: sender,
    to: recipients,
    subject: SUBJECT,
    text: RECORDED_MESSAGE,
    attachments: [
        {
          filename: ATTACHMENT_NAME,
          content_id: ATTACHMENT_NAME,
          disposition: "inline",
          content: attachment_content,
        },
    ],
  })
  .then(
    (response) => {
        console.log("Mail sent successfully");
        console.log(response);
        return STATUS_SUCCESS;
    }
  ).catch((err)=>{
    console.log(err);
  });

}

module.exports = {
    sendMail,
}
