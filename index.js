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
          quote+=chunk;
          quote = JSON.parse(quote);
          quoteMessage = quote.quoteText + " ~" + quote.quoteAuthor   ;
      });
    callback(null, res.statusCode);
  }).on('error', (e) => {
    callback(Error(e));
  });
  console.log(quoteMessage)
  /*//SMS Publish Code*/
  var params = {
  Message:`  ${quoteMessage}  `, /* required */
  Subject: 'Daily Quote',
  TopicArn: 'arn:aws:sns:us-east-1:309793080404:Daily_Quote'
};
sns.publish(params, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(data);           // successful response
});
  
}