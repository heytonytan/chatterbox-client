var app = {
  server: 'https://api.parse.com/1/classes/messages',
  existingPosts: {},
  existingRooms: {}
};

app.init = function() {
  setInterval(this.fetch.bind(this), 1000);
  $('.username').on('click', function() {
    this.handleUsernameClick($(this).text());
  }.bind(this));
  $('.submit').on('click', function() {
    this.handleSubmit();
  }.bind(this));
  // $('.roomchoice').select(function() {
  //   $('.fullMessage').show();
  //   $('.fullMessage').filter(function() {
  //     console.log($('.roomchoice option:selected').text());
  //     return $('.roomchoice option:selected').text() !== $('.room').text();
  //   }).hide();
  // });
  $('#roomSelect').bind('change', function() {
    $('.room' + $('#roomSelect').val()).show();
    $('p:not(.room' + $('#roomSelect').val() + ')').hide();
  });
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
    order: 'createdAt',
    success: function (data) {
      // console.log(data);
      messages = data.results.reverse();
      messages.forEach(function(post) {
        if (this.existingPosts[post.objectId] === undefined) {
          this.existingPosts[post.objectId] = 1;
          this.renderMessage(post);
        }
        if (this.existingPosts[post.roomname] === undefined) {
          this.existingPosts[post.roomname] = 1;
          this.renderRoom(post.roomname);
        } 
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
  $('#chats').prepend('<p class="fullMessage user' + codedUser + ' room' + codedRoom + '">' + codedUser + ': ' + codedMessage + ' (in Room ' + codedRoom + ')</p>');
};

app.renderRoom = function(newRoom) {
  $('#roomSelect').prepend('<option>' + newRoom + '</option>');
};

app.handleUsernameClick = function(username) {
  $('.username').filter(function() {
    return $(this).text() === username;
  }).toggleClass('friend');
};

app.handleSubmit = function() {
  var newMessage = $('#message').val();
  this.send({
    username: window.location.search.slice(10),
    text: newMessage,
    roomname: 'BLACK'
  });
  $('#message').val('');
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
