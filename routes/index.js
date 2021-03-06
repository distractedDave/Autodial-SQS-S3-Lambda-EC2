var config = require("../config"),
    morgan = require('morgan'),
    path = require('path'),
    express = require('express');
    app = express();
    bodyParser = require('body-parser'),
    http = require('http').Server(app),
    httpclient = require('http'),
    io = require('socket.io')(http),
    AWS = require('aws-sdk'),
    sns = new AWS.SNS({region : 'us-east-1'}),
    sqs = new AWS.SQS({region : 'us-east-1'}),
    //QUEUE_URL ='https://sqs.us-east-1.amazonaws.com/337107942631/prod-autodialer-graduation-registration',
    iz = require('iz'),
    request = require('request');
    validators = iz.validators,
    are = iz.are,
    MsgExt = '.wav',
    LocationURL = 'http://ec2-52-7-131-166.compute-1.amazonaws.com/AUTODIAL/AUTODIAL-MSG/',
    Eintro = LocationURL + 'G.Eng.Intro' + MsgExt,
    Eintro2 = LocationURL + 'G.Eng.Part2' + MsgExt, 
    Ereplay = LocationURL + 'G.Eng.Replay.xt1' + MsgExt,
    Sreplay = LocationURL + 'G.Span.Replay.xt7' + MsgExt,
    Erep = LocationURL + 'G.Eng.Representative.xt3' + MsgExt,
    Srep = LocationURL + 'G.Span.Representative.xt9' + MsgExt,
    twilio = require('twilio'),
    SrcCall = '+18006694533',
    client = twilio(config.accountSid, config.authToken),
    tier = 'prod',
    XmlStream = require('xml-stream'),
    resp = new twilio.TwimlResponse();
 
    if (tier == 'dev'){
    port = 3000;
    QUEUE_URL ='https://sqs.us-east-1.amazonaws.com/337107942631/dev-autodialer-graduation-registration';
    }else if (tier == 'prod'){
    port = 8080;
    QUEUE_URL ='https://sqs.us-east-1.amazonaws.com/337107942631/prod-autodialer-graduation-registration';
    };

var smonth = new Array();
smonth[0] = "Enero";
smonth[1] = "Febrero";
smonth[2] = "Marzo";
smonth[3] = "Abril";
smonth[4] = "Mayo";
smonth[5] = "Junio";
smonth[6] = "Julio";
smonth[7] = "Agosto";
smonth[8] = "Septiembre";
smonth[9] = "Octubre";
smonth[10] = "Noviembre";
smonth[11] = "Diciembre";

var month = new Array();
month[0] = "January";
month[1] = "February";
month[2] = "March";
month[3] = "April";
month[4] = "May";
month[5] = "June";
month[6] = "July";
month[7] = "August";
month[8] = "September";
month[9] = "October";
month[10] = "November";
month[11] = "December";


var WeekDay =new Array();
WeekDay[1] = "Monday";
WeekDay[2] = "Tuesday";
WeekDay[3] = "Wednesday";
WeekDay[4] = "Thursday";
WeekDay[5] = "Friday";
WeekDay[6] = "Saturday";
WeekDay[0] = "Sunday";

var sWeekDay =new Array();
sWeekDay[1] = "Lunes";
sWeekDay[2] = "Martes";
sWeekDay[3] = "Miercoles";
sWeekDay[4] = "Jueves";
sWeekDay[5] = "Viernes";
sWeekDay[6] = "Sabado";
sWeekDay[0] = "Domingo";


app.use(express.static(path.join(__dirname, 'public')));


module.exports = function(app) {
                         app.set('view engine', 'jade');
                         app.use(bodyParser.urlencoded({
                                 extended: true
                                     }));
                         app.use(morgan('combined'));
};


var sqsIsAvail = function(sqsmessage){
   console.log('connecting to the ' + tier + 'Tier')
   console.log('connecting to QueueURL: ',QUEUE_URL)
   
   sqs.getQueueAttributes({
      QueueUrl: QUEUE_URL, /* required */
      AttributeNames: [
  'ApproximateNumberOfMessages'  /*All worked*/
]
   }, function(err, data){
      if (err) console.log(err); // an error occurred
      else {
    var sqsmessage = data.Attributes.ApproximateNumberOfMessages;
      io.emit('sqsmessagecount', sqsmessage);
    console.log('We have ' + sqsmessage + ' Customers to Call.');
     // if (sqsmessage == '0')        
     };
   });
};

var sqsmsgdata = function(sqsmessage){
   sqs.getQueueAttributes({
      QueueUrl: QUEUE_URL, /* required */
      AttributeNames: [
  'ApproximateNumberOfMessages'  /*All worked*/
]
   }, function(err, data){
      if (err) console.log(err); // an error occurred
      else {
           var sqsmessage = data.Attributes.ApproximateNumberOfMessages;
           console.log('How many messages do we have: ',sqsmessage);
           if (sqsmessage <= '1'){
           console.log('We are waiting for  messages');
           console.log('sleeping for 10 Seconds');
           setTimeout(sqsmsgdata1,15000);
           }else{
           console.log('How many messages do we have: ',sqsmessage);
           io.emit('sqsmessagecount', sqsmessage);
           };
     };
   });
};

var sqsmsgdata1 = function(sqsmessage){
   sqs.getQueueAttributes({
      QueueUrl: QUEUE_URL, /* required */
      AttributeNames: [
  'ApproximateNumberOfMessages'  /*All worked*/
]
   }, function(err, data){
      if (err) console.log(err); // an error occurred
      else {
         var sqsmessage = data.Attributes.ApproximateNumberOfMessages;
         console.log('How many messages do we have: ',sqsmessage);
         if (sqsmessage == '0'){
            console.log('We are waiting for messages');
            console.log('sleeping for 10 Seconds');
            setTimeout(sqsmsgdata,10000);
         }else{
            console.log('We have: ' + sqsmessage + ' messages.');
            io.emit('sqsmessagecount', sqsmessage);
         };
      };
  });
};


function checkDate(date){
     console.log('Entering CHECKDATE function with date: ',date);
   var minYear = 2015;
   var day = new Date(date)
   var maxYear = (new Date()).getFullYear();
   var errorMsg = "";
   var  re = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
   console.log('Date Value: ',day.getDay());
if(isNaN(day)){
     console.log(errorMsg);
     console.log('Date is NOT valid',date);
    return false;
}else{
     console.log('Entering CHECKDATE function with a value of date: ',date);
    console.log('Date is valid',date);
    return true; 
};
};

var statusEmail  = function (data){
     console.log('You have been sent to errorEmail: ',data)
    var message = data;
    var msg = data;
        var params = {
        Message: message,
        Subject: 'AutoDial '+ msg,
        TopicArn: 'arn:aws:sns:us-east-1:337107942631:AutodialerError'
        };
//   UNCOMMENT FOR MAIN FUNCTION
   sns.publish(params, function(err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else     console.log('You sent an email with the message: ',data);           // successful response
      });
};

var errorEmail = function (data){
     console.log('You have been sent to errorEmail: ',data)
    var message = data;
        var params = {
        Message: message,
        Subject: 'AutoDial Error',
        TopicArn: 'arn:aws:sns:us-east-1:337107942631:AutodialerError'
        };
//   UNCOMMENT FOR MAIN FUNCTION
   sns.publish(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
     else     console.log('You sent an email with the message: ',data);           // successful response
      });
};

var makeCall = function (data) {
          message = JSON.stringify(data.Messages[0]),
          customer = JSON.parse(message),
          data1 = JSON.stringify(customer.Body),
         // replace = data1.replace("\/t/g", ','),
          parsed = JSON.parse(data1).split(",");
         console.log("Here are the Parsed Values",parsed);
         
     if (!parsed){
         //Need to add validation to all Parsed fields I use
         errorEmail(data1)
         console.log("Not a valid phone number",parsed.phone);
         setTimeout(removeFromQueue(data2),10000);
         sqsIsAvail();
     }else{
          eventtype = parsed[0],
          apd = parsed[1].split(' ')[0],
          time= parsed[1].split(' ')[1];
          time1 = time.split(':')[0]
          time2 = time.split(':')[1]
          if (time1 > 12) {
             apt = time1 - 12 + ':' + time2 + 'pm';
          console.log('APT0', apt);
          }else if(time1 < 12) {
             apt = time + 'am';
          console.log('APT1', apt);
          }else if (time1 == 12){
              apt = time + 'pm';
          console.log('APT2', apt);
          }
          console.log('Time', time),
          console.log('APT', apt),
          console.log('APD', apd),
          language = parsed[2],
          day = new Date(parsed[1]),
          console.log('DAY', day),
          console.log('GetDay ',day.getDay());
          console.log('WeekDay ', WeekDay[day.getDay()]);
          console.log('1Time', apt);
          if (language == "English"){
             console.log('GetDay ',day.getDay());
          gmonth = month[day.getMonth()],
          DOW = WeekDay[day.getDay()];
          console.log('WeekDay1 ', DOW);
          }else if (language == "Spanish"){
          gmonth = smonth[day.getMonth()];
         console.log('GetDay ',day.getDay());
         console.log('WeekDay2 ',sWeekDay[day.getDay()]);
          DOW = sWeekDay[day.getDay()];
          console.log('WeekDay3 ', DOW);
          };
          console.log('2DayOfWeek: ', DOW)
          console.log('Month', gmonth);
          console.log('PHONE',parsed[3]);
          console.log('EventType',parsed[0]);
          console.log('language',parsed[2]);
        //  var query = '?date=' + day.getDate() + '&time=' + apt;
          query = '?date=' + day.getDate() + '&time=' + apt;
         //var URL  = 'http://ec2-52-7-131-166.compute-1.amazonaws.com:' + port + '/outbound/' + parsed[2] + '/' + parsed[3] + '/' + parsed[0] + '/' + parsed[4] + '/' + DOW + '/' +  gmonth + query; 
          URL  = 'http://ec2-52-7-131-166.compute-1.amazonaws.com:' + port + '/outbound/' + parsed[2] + '/' + parsed[3] + '/' + parsed[0] + '/' + parsed[4] + '/' + DOW + '/' +  gmonth + query; 
          console.log('URL: ', URL);
          console.log('We are calling Customer # ',parsed[4]);
          console.log('Your Appointment date and time is: ',parsed[1]);
          console.log('Your Call Language is: ',parsed[2]);
          console.log('We will be calling customer at: ',parsed[3]);
        //  console.log('Sending you to : ',query);
          console.log('Sending you to URL : ',URL);


        client.calls.create({
         url: URL,
         to: parsed[3],
         from: SrcCall,
         statusCallbackMethod: "POST",
         ifMachine: "continue",
         method: "GET"
            }, function(err, call) {
            console.log('Here is your Call ID',err);
            if (call.sid){
                   console.log('Deleting Message with Reicpt Handle: ',data2)
                   setTimeout(removeFromQueue(data2),1000);  
                   sqsIsAvail();
            }else {
            errorEmail(data1);
            console.log('Call attempt was not successfull Putting back in Queue');
            };
        });
      };
};

var getFromQueue = function(message) {
      console.log('Running getFromQueue')
      sqs.receiveMessage({
      QueueUrl: QUEUE_URL /* required */
      }, function(err, data){
      message = ' ';
        if (err) console.log("We had an error getting the SQS data: ",err); // an error occurred
        else{ 
          if (data == undefined) console.log('We had an error with message: ',message);
          if (data.Messages[0] == undefined) console.log('No more Messages');
          else{
	  message = JSON.stringify(data.Messages[0].Body);
          customer = JSON.parse(message);
          data1 = JSON.stringify(customer);
          data2 = data.Messages[0].ReceiptHandle;
          parsed = JSON.parse(data1).split(",");
          console.log('message: ',message);
          console.log('Location: ',parsed[0]);
          apd = parsed[1].split(' ')[0],
          apt= parsed[1].split(' ')[1],
          console.log('AppointmentDate: ',apd);
          sqsIsAvail();
          //This is where I need to sanitize the data and validate
           if (!parsed[0]||!parsed[4]){
                console.log("Not a valid Message",data1);
                console.log("Sending email with message data:",data1);
                errorEmail(data1)
                setTimeout(removeFromQueue(data2),10000);
                sqsIsAvail();
          }else{
               apd = parsed[1].split(' ')[0];
               if (!apd||!parsed[4]){
               //Need to add validation to all Parsed fields I use
                   console.log("Not a valid Message",data1);
                   console.log("Sending email with message data:",data1);
                   errorEmail(data1)
                   setTimeout(removeFromQueue(data2),10000);
                   sqsIsAvail();
               }else {
                   console.log('LOOK AT MY FORMAT : ' + parsed);
                   console.log('CheckingDate', apd);
                   var isValid = checkDate(apd);
                   console.log('Our Result is: ', isValid);
		   if ( isValid ===true){
                      console.log('CheckDate finished for Date',apd);
                      console.log('HERE is your REsponse',data);
                      makeCall(data);
                      sqsIsAvail();
                   }else if(isValid ===false){
                      console.log("DID NOT PASS checkDate function",data1);
                      console.log("Not a valid Message",data1);
                      console.log("Sending email with message data:",data1);
                      errorEmail(data1)
                      setTimeout(removeFromQueue(data2),10000);
                      sqsIsAvail();
                   }else console.log('Error in checkDate Function result is: ',isValid)
               };
           };
        };
       };
     });
};

var removeFromQueue = function(data2) {
var params = {QueueUrl: QUEUE_URL,ReceiptHandle: data2} 
console.log(params); 
   sqs.deleteMessage(params, function(err, data) {
      if (err) {

console.log(err);
console.log('QueueUrl: ',QUEUE_URL);
console.log('ReceiptHandle: ',data2);
}      else{
console.log( 'I deleted this message and got verification: ',data)
console.log('ReceiptHandle: ',data2); 
console.log('Message deleted')      
}
});
   };


var getFromQueue1 = function(message) {
      console.log('Running getFromQueue1')
      sqs.receiveMessage({
      QueueUrl: QUEUE_URL /* required */
   }, function(err, data){
     if (err) console.log("We had an error getting the SQS data: ",err); // an error occurred
     else if(data == undefined) console.log('We had an error with message: ',message);
     else{
     message = JSON.stringify(data.Messages[0].Body);
     customer = JSON.parse(message);
     data1 = JSON.stringify(customer.Body);
     data2 = customer.ReceiptHandle;
     parsed = JSON.parse(data1).split(",");
     apd = parsed[1].split(' ')[0],
     apt= parsed[1].split(' ')[1],
     console.log('message: ',message);
     console.log('Location: ',parsed[0]);
     console.log('AppointmentDate: ',apd);
        if (!apd||!parsed[4]){
           console.log("Not a valid Message",data1);
           console.log("Sending email with message data:",data1);
           errorEmail(data1)
           setTimeout(removeFromQueue(data2),10000);
        }else {
           console.log('LOOK AT MY FORMAT : ' + parsed);
           console.log('CheckingDate', apd);
           var isValid = checkDate(apd);
           console.log('Our Result is: ', isValid);
           if ( isValid = 'true'){
              console.log('CheckDate finished for Date',apd);
              console.log('Transfering to the PostOutbound function: ',parsed[4]);
              console.log('HERE is your REsponse',data);
              makeCall(data);
         }else if(isValid = 'false'){
              console.log("DID NOT PASS checkDate function",data1);
              console.log("Not a valid Message",data1);
              console.log("Sending email with message data:",data1);
              errorEmail(data1)
              setTimeout(removeFromQueue(data2),10000);
         }else console.log('Error in checkDate Function result is: ',isValid)
        }
      };
  });
};

var removeFromQueue = function(data2) {
           var params = {QueueUrl: QUEUE_URL,ReceiptHandle: data2}
           console.log(params);
              sqs.deleteMessage(params, function(err, data) {
                    if (err) {
                    console.log('QueueUrl: ',QUEUE_URL);
                    console.log('ReceiptHandle: ',data2);
                    }else{
                        console.log('Message deleted')
                        sqsIsAvail();
                    }      
                    });
};

var auth = function(req,res, next){
     if (req.headers.authorization) {
     auth = new Buffer(req.headers.authorization.substring(6), 'base64').toString().split(':');
     } 
     if (!auth || auth[0] !== 'dialadmin' || auth[1] !== 'Upstart7reg') {
        res.statusCode = 401;
        res.setHeader('WWW-Authenticate', 'Basic realm="AutoDialer"');
        res.end('Unauthorized');
     } else {
     next();
    }
};


app.get('/status', function(req, res){
  res.sendFile(__dirname + '/html/status.html');
});
app.get('/admin',auth , function(req, res){
  res.sendFile(__dirname + '/html/admin.html');
});
app.get('/testadmin', function(req, res){
  res.sendFile(__dirname + '/html/testadmin.html');
});


app.use(bodyParser());
app.use(bodyParser.json());

function GetXML(req, res, next) {
    console.log('YOU FIRED UP GetXML function');
    console.log('GetDay ', req.params)
       var answeredBy = req.query.AnsweredBy;
       var local = req.params.local;
       var date  = req.query.date;
       var time = req.query.time;
       var language = req.params.language;
       var month = req.params.month;
       var id = req.params.id;
       var phone = req.params.phone;
       var dow = req.params.dow
       var string = JSON.stringify(id + ',' + local + ','  + phone + ','  + language + ',' + dow + ',' + month + ' ' + date + ',' + time + ',' + answeredBy);
       //if local starts with TR- its a training meeting, if it starts with G. its a graduation meeting
       //
       console.log('GRADUATION TIME');
       console.log('string', string);
       console.log('GetXML AnsweredBy',req.query.AnsweredBy);
       console.log('PHONE',req.params.phone);
       console.log('language',req.params.language);
       res.set('Content-Type', 'text/xml');
    if (answeredBy == "machine") {
         if (req.params.language == 'English'){
              if (local.match(/^G./)){
              console.log('You are Graduating, sending to G-Emachine.jade');
              res.render('G-Emachine.jade',{data : {dow: req.params.dow, month: req.params.month, language: req.params.language, phone: req.params.phone, local: req.params.local, date: req.query.date, time: req.query.time}});
              }else if(local.match(/^TR-/)){
              console.log('You are Training, sending to TR-Emachine.jade');
               res.render('TR-Emachine.jade',{data : {dow: req.params.dow, month: req.params.month, language: req.params.language, phone: req.params.phone, local: req.params.local, date: req.query.date, time: req.query.time}});
              }
         } else if (req.params.language == 'Spanish'){
          if (local.match(/^G./)){
              console.log('You are Graduating, sending to G-Smachine.jade');
              res.render('G-Smachine.jade',{data : {dow: req.params.dow, month: req.params.month, language: req.params.language, phone: req.params.phone, local: req.params.local, date: req.query.date, time: req.query.time}});
              }else if(local.match(/^TR-/)){
              console.log('You are Training, sending to TR-Smachine.jade');
               res.render('TR-Smachine.jade',{data : {dow: req.params.dow, month: req.params.month, language: req.params.language, phone: req.params.phone, local: req.params.local, date: req.query.date, time: req.query.time}});
              }
         };

    }else{
         if (req.params.language == 'English'){
              if (local.match(/^G./))res.render('G-Escreen.jade',{data : {dow: req.params.dow, month: req.params.month, language: req.params.language, phone: req.params.phone, local: req.params.local, date: req.query.date, time: req.query.time}});
             else if(local.match(/^TR-/))res.render('TR-Escreen.jade',{data : {dow: req.params.dow, month: req.params.month, language: req.params.language, phone: req.params.phone, local: req.params.local, date: req.query.date, time: req.query.time}});
         }else if (req.params.language == 'Spanish'){
              if (local.match(/^G./))res.render('G-Sscreen.jade',{data : {dow: req.params.dow, month: req.params.month, language: req.params.language, phone: req.params.phone, local: req.params.local, date: req.query.date, time: req.query.time}});
             else if(local.match(/^TR-/))res.render('TR-Sscreen.jade',{data : {dow: req.params.dow, month: req.params.month, language: req.params.language, phone: req.params.phone, local: req.params.local, date: req.query.date, time: req.query.time}});
        };
    };
       var string = JSON.stringify(id + ',' + local + ','  + phone + ','  + language + ',' + dow + ',' + month + ' ' + date + ',' + time + ',' + answeredBy);
       console.log('string', string);
           io.emit('status', string);
};

function GetResponse(req,res,next){
       var answeredBy = 'human',
           local = req.params.local,
           date  = req.query.date,
           time = req.query.time,
           dow = req.params.dow,
           language = req.params.language,
           id = req.params.id,
           phone = req.params.phone;

            console.log('GetResponse AnsweredBy',answeredBy);
            console.log('GetResponse Digits: ',req.body.Digits);




     if (local.match(/^G./)){
       console.log('GRADUATION TIME');
       eventtype = "graduation";
     }else if (local.match(/^TR-/)){
       console.log('TRAINING TIME');
       eventtype = "training";
     };   


     if (req.body.Digits === undefined) console.log('No Digits Pressed',req.body.Digits)
     
     else if (req.body.Digits == 1) {
         console.log('You have pressed:1 Replaying message in English ', req.body.Digits);
         res.set('Content-Type', 'text/xml');

         if (eventtype == "graduation")res.render('G-Eoutbound.jade',{data : {dow: req.params.dow, month: req.params.month, language: req.params.language, phone: req.params.phone, local: req.params.local, date: req.query.date, time: req.query.time}});
         else if (eventtype == "training")res.render('TR-Eoutbound.jade',{data : {dow: req.params.dow, month: req.params.month, language: req.params.language, phone: req.params.phone, local: req.params.local, date: req.query.date, time: req.query.time}});


     }else if (req.body.Digits == 3) {
         console.log('You have pressed:3 Transfering to an English Rep ', req.body.Digits);
         res.set('Content-Type', 'text/xml');
         res.render('Erep.jade',{data : {dow: req.params.dow, month: req.params.month, language: req.params.language, phone: req.params.phone, local: req.params.local, date: req.query.date, time: req.query.time}});
     

     }else if (req.body.Digits == 7) {
         console.log('You have pressed:7  Replaying message in Spanish ', req.body.Digits);
         res.set('Content-Type', 'text/xml');

        if (eventtype == "graduation")res.render('G-Soutbound.jade',{data : {dow: req.params.dow, month: req.params.month, language: req.params.language, phone: req.params.phone, local: req.params.local, date: req.query.date, time: req.query.time}});
        else if (eventtype == "training")res.render('TR-Soutbound.jade',{data : {dow: req.params.dow, month: req.params.month, language: req.params.language, phone: req.params.phone, local: req.params.local, date: req.query.date, time: req.query.time}});


     }else if (req.body.Digits == 9) {
        console.log('You have pressed:9 Rep in message in Spanish ', req.body.Digits);
        res.set('Content-Type', 'text/xml');
        res.render('Srep.jade',{data : {dow: req.params.dow, month: req.params.month, language: req.params.language, phone: req.params.phone, local: req.params.local, date: req.query.date, time: req.query.time}});
     

     }else if (answeredBy == "machine"){
         res.set('Content-Type', 'text/xml');
         if (req.params.language == 'English'){
             if (eventtype == "graduation")res.render('G-Emachine.jade',{data : {dow: req.params.dow, month: req.params.month, language: req.params.language, phone: req.params.phone, local: req.params.local, date: req.query.date, time: req.query.time}});
             else if (eventtype == "training")res.render('TR-Emachine.jade',{data : {dow: req.params.dow, month: req.params.month, language: req.params.language, phone: req.params.phone, local: req.params.local, date: req.query.date, time: req.query.time}});


         }else if (req.params.language == 'Spanish'){
            if (eventtype == "graduation") res.render('G-Smachine.jade',{data : {dow: req.params.dow, month: req.params.month, language: req.params.language, phone: req.params.phone, local: req.params.local, date: req.query.date, time: req.query.time}});
            else if (eventtype == "training") res.render('TR-Smachine.jade',{data : {dow: req.params.dow, month: req.params.month, language: req.params.language, phone: req.params.phone, local: req.params.local, date: req.query.date, time: req.query.time}});
         };
     }else {
            if (req.params.language == 'English'){
                if (eventtype == "graduation")res.render('G-Eoutbound.jade',{data : {dow: req.params.dow, month: req.params.month, language: req.params.language, phone: req.params.phone, local: req.params.local, date: req.query.date, time: req.query.time}});
                else if (eventtype == "training")res.render('TR-Eoutbound.jade',{data : {dow: req.params.dow, month: req.params.month, language: req.params.language, phone: req.params.phone, local: req.params.local, date: req.query.date, time: req.query.time}});

            }else if (req.params.language == 'Spanish'){
                if (eventtype == "graduation")res.render('G-Soutbound.jade',{data : {dow: req.params.dow, month: req.params.month, language: req.params.language, phone: req.params.phone, local: req.params.local, date: req.query.date, time: req.query.time}});
                else if (eventtype == "training")res.render('TR-Soutbound.jade',{data : {dow: req.params.dow, month: req.params.month, language: req.params.language, phone: req.params.phone, local: req.params.local, date: req.query.date, time: req.query.time}});
            };
         };
    };

function GetScreenResponse(req,res,next){
       var answeredBy = 'human';
       var local = req.params.local;
       var date  = req.query.date;
       var time = req.query.time;
       var language = req.params.language;
       var id = req.params.id;
       var phone = req.params.phone;
       if (local.match(/^G./)){
       console.log('GRADUATION TIME');
       eventtype = "graduation";
       }else if (local.match(/^TR-/)){
       console.log('TRAINING TIME');
       eventtype = "training";
       };
     console.log('GetScreenResponse AnsweredBy',answeredBy);
     console.log('You have pressed: ', req.body.Digits);
     if (req.body.Digits) {
        console.log('Call screening Passed Human Detection with a press of:',req.body.Digits)
       if (req.params.language == "English"){
        console.log('Call We will be sending to English page:',req.params.language)
           res.set('Content-Type', 'text/xml');
           if (local.match(/^G./)){
           console.log('Call We will be sending to English Graduation Outbound page:',req.params.language)
           res.render('G-Eoutbound.jade',{data : {dow: req.params.dow, month: req.params.month, language: req.params.language, phone: req.params.phone, local: req.params.local, date: req.query.date, time: req.query.time}});
           }else if(local.match(/^TR-/)){
           console.log('Call We will be sending to English Training Outbound page:',req.params.language)
           res.render('TR-Eoutbound.jade',{data : {dow: req.params.dow, month: req.params.month, language: req.params.language, phone: req.params.phone, local: req.params.local, date: req.query.date, time: req.query.time}});
           }
       }else if(req.params.language == "Spanish") {
        console.log('Call We will be sending to Spanish page:',req.body.language)
           res.set('Content-Type', 'text/xml');
if (local.match(/^G./)){
           console.log('Call We will be sending to Spanish Graduation Outbound page:',req.params.language)
           res.render('G-Soutbound.jade',{data : {dow: req.params.dow, month: req.params.month, language: req.params.language, phone: req.params.phone, local: req.params.local, date: req.query.date, time: req.query.time}});
           }else if(local.match(/^TR-/)){
           console.log('Call We will be sending to Spanish Training Outbound page:',req.params.language)
           res.render('TR-Soutbound.jade',{data : {dow: req.params.dow, month: req.params.month, language: req.params.language, phone: req.params.phone, local: req.params.local, date: req.query.date, time: req.query.time}});
           }
       }
    };
    };


app.post('/outbound/:language/:phone/:local/:id/:dow/:month', GetResponse);
app.post('/screen/:language/:phone/:local/:id/:dow/:month', GetScreenResponse);
app.get('/outbound/:language/:phone/:local/:id/:dow/:month', GetXML);

//var running = setInterval(getFromQueue, Interval);

var interval;

function startCalling(rate) {
  if (rate !== "0") {
var  Interval = max /rate;
var  max = "3600000";
  console.log('Rate; ',rate);
  console.log('Interval; ',Interval);
  interval = setInterval(getFromQueue, Interval);
}else{
 console.log('Rate is 0 Stopping')
 stopCalling;
 console.log('Calling should be stopped.')
} 
};

function stopCalling() {
  clearInterval(interval);
  console.log('Clear Interval Ran');
};



io.on('connection', function(socket){
  console.log('user connected now');
  sqsIsAvail();
  
  socket.on('status', function(msg){
  io.emit('status',msg);

  });
  socket.on('started', function(msg){
  
  io.emit('started',msg);
  });
  


  socket.on('start', function(msg){
  io.emit('start',msg);
  var rate = msg;
  var max = "3600000";
  var Interval = max /rate;
  if (rate == '0') {
  console.log('ABOUT TO STOP ALL CALLING');
  clearInterval(interval);
  console.log('Stopping All Calling');
  statusEmail('Stopping all Calls');
  }else{
       console.log('Recieved a Start with a Rate of: ',rate);
       if(isNaN(rate))console.log(rate + ' Is not a number');
       else{ 
      console.log('Starting the Loop with the Intervals of:',Interval);
      statusEmail('Starting Autodial with rate of ' + rate + ' calls per hour');
      getFromQueue();
      var  Interval = max /rate;
      var  max = "3600000";
      console.log('Rate; ',rate);
      console.log('Interval; ',Interval);
      interval = setInterval(getFromQueue, Interval);

      }
      }
      });
});

http.listen(port, function(){
  console.log('listening on *: ',port);
});
