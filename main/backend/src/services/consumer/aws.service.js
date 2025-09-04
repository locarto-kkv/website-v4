import AWS from "../../lib/aws.js";

const sns = new AWS.SNS();
const ses = new AWS.SES();

async function sendSmsByAws(phoneNumber, message) {
  const params = {
    Message: message,
    PhoneNumber: phoneNumber, // must be in E.164 format: +1234567890
  };

  try {
    const result = await sns.publish(params).promise();
    console.log("SMS sent:", result.MessageId);
    return result;
  } catch (err) {
    console.error("Error sending SMS:", err);
    throw err;
  }
}

async function sendEmailByAws(toAddress, bodyText) {
  const params = {
    Source: "no-reply@yourdomain.com", // must be a verified SES sender
    Destination: { ToAddresses: [toAddress] },
    Message: {
      Subject: { Data: "OTP for Locarto Signup" },
      Body: {
        Text: { Data: bodyText },
      },
    },
  };

  try {
    const result = await ses.sendEmail(params).promise();
    console.log("Email sent:", result.MessageId);
    return result;
  } catch (err) {
    console.error("Error sending email:", err);
    throw err;
  }
}
