var app = {
  server: 'https://api.parse.com/1/classes/messages'
};

app.init = function() {
  setInterval(this.fetch.bind(this), 1000);
  $('.username').on('click', function() {
    this.handleUsernameClick($(this).text());
  }.bind(this));
};

app.send = function(post) {
  $.ajax({
    url: this.server,
    type: 'POST',
    data: JSON.stringify(post),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

app.fetch = function() {
  $.ajax({
    url: this.server,
    type: 'GET',
    success: function (data) {
      // console.log(data);
      var messages = data.results;
      messages.forEach(function(post) {
        this.renderMessage(post);
      }.bind(this));
    }.bind(this)
  });
};

app.clearMessages = function() {
  $('#chats').html('');
};

app.renderMessage = function(post) {
  var codedUser = escapeHtml(post.username);
  var codedMessage = escapeHtml(post.text);
  var codedRoom = escapeHtml(post.roomname);
  $('#chats').prepend('<p><span class="username">' + codedUser + '</span>:' + codedMessage + '(in Room ' + codedRoom + ')</p>');
};

app.renderRoom = function(newRoom) {
  $('#roomSelect').append('<option>' + newRoom + '</option>');
};

app.handleUsernameClick = function(username) {
  $('.username').filter(function() {
    return $(this).text() === username;
  }).toggleClass('friend');
};

app.handleSubmit = function() {
  var newMessage = $('.newMessage').val();
  this.send({
    username: window.location.search.slice(10),
    message: newMessage,
    room: 'lobby'
  });
};

var entityMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;'
};

var escapeHtml = function(string) {
  return String(string).replace(/[&<>"'\/]/g, function (s) {
    return entityMap[s];
  });
};

$(document).ready(function() {
  app.init();
});
