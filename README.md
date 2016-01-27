# Autodial-SQS-S3-Lambda-EC2
Uses AWS Lambda, S3, Ec2, SQS and twillio to call and deliver message to user


Setup

Create twilio account, get phone number, (verify another number for callerID if desired)
Take NOTE of PHONE NUMBER and APIKEY and AuthTOKEN
you will need to update config.js 

config.js

 +module.exports = {
	+ // Twilio Account SID - found on your dashboard
	+ accountSid: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
	+ // Twilio Auth Token - found on your dashboard
	+ authToken: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
	+ // A Twilio number that you have purchased through the twilio.com web
	+ // interface or API
	+ twilioNumber: 'xxxxxxxxxxxxx',
	+ // The port your web application will run on
	+ port: 8080



 
