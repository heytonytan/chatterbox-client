$(document).ready(function() {

  // $.ajax({
  //   // This is the url you should use to communicate with the parse API server.
  //   url: 'https://api.parse.com/1/classes/messages',
  //   type: 'POST',
  //   data: JSON.stringify(message),
  //   contentType: 'application/json',
  //   success: function (data) {
  //     console.log('chatterbox: Message sent');
  //   },
  //   error: function (data) {
  //     // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
  //     console.error('chatterbox: Failed to send message', data);
  //   }
  // });

  var messages = $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: 'https://api.parse.com/1/classes/messages',
    type: 'GET'
    // async: false
    // data: JSON.stringify(message),
    // contentType: 'application/json',
    // success: function (data) {
    //   console.log('chatterbox: Message sent');
    // },
    // error: function (data) {
    //   // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
    //   console.error('chatterbox: Failed to send message', data);
    // }
  }).done(function() {
    console.log(messages.responseJSON.results);
    messages.responseJSON.results.forEach(function(message) {      
      $('#chats').append('<p>' + message.username + ':' + message.text + '</p>');
    });
  });

  // console.log(messages);
  // console.log(message.responseText);
  // var message = {
  //   username: 'shawndrost',
  //   text: 'trololo',
  //   roomname: '4chan'
  // };



  // createdAt
  // :
  // "2016-09-26T19:04:37.326Z"
  // objectId
  // :
  // "RHdaTx1kte"
  // roomname
  // :
  // "other"
  // text
  // :
  // "TESTING 123 TESTING 123"
  // updatedAt
  // :
  // "2016-09-26T19:04:37.326Z"
  // username
  // :
  // "TESTtestTESTtestTEST"


});
