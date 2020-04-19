/*global sns*/
var AWS = require('aws-sdk');
var sns = new AWS.SNS();
const https = require('https')
let url = "https://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=en"
let quote = "";
let quoteMessage = "";

exports.handler =  function(event, context, callback) {
  https.get(url, (res) => {
      res.on("data", chunk => {
          console.log(`quote received from API - ` + chunk)
          quote = JSON.parse(chunk);
          quoteMessage = quote.quoteText + " ~" + quote.quoteAuthor;
          
          var params = {
                Message: `${quoteMessage}`,
                Subject: 'Daily Quote',
                TopicArn: 'insert ARN HERE'
                
                //PhoneNumber:
              };
              
          sns.publish(params, function(err, data) {
            console.log(`sns is publishing`)
            if (err) console.log(err, err.stack); // an error occurred
            else     console.log(`successful`);           // successful response
           });
  
        });
        
      callback(null, res.statusCode);
  }).on('error', (e) => {
    callback(Error(e));
  });
};
