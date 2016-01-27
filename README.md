# Autodial-SQS-S3-Lambda-EC2
Uses AWS Lambda, S3, Ec2, SQS and twillio to call and deliver message to user


Setup

Files will need to be placed in directory on server.
config.js holds twilio credentials and phone number and server port

VIEWS directory contains templates for what the call will do, twiml instructions for twilio.
VIEWS/files  You will need to change the messgages in the files to match the location of your recordings.

package.json includes dependancies required.

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



Changes also need to be made to the routes index.js file

Key changes  Lockation URL 

Queue URL's for Dev and Prod

tier

TopicArn 

URL


The IAM role of the EC2 instance, or docker instance role will have privelege to access the sqs queue.  


