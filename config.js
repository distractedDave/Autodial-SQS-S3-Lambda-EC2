// Define app configuration in a single location, but pull in values from
// system environment variables (so we don't check them in to source control!)
module.exports = {
    // Twilio Account SID - found on your dashboard
         accountSid: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
             // Twilio Auth Token - found on your dashboard
         authToken: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
           // A Twilio number that you have purchased through the twilio.com web
           // interface or API
          twilioNumber: 'xxxxxxxxxxxxx',
   // The port your web application will run on
          port: 8080 
 };
