// friend stuff
// move filters to objects
// refactor code to filter based on actual filters
// reduce # of classes

var app = {
  server: 'https://api.parse.com/1/classes/messages',
  existingPosts: {},
  existingRooms: {}
};

app.init = function() {
  
  setInterval(this.fetch.bind(this), 1000);
  
  

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
  $('.roomSelect').bind('change', function() {
    console.log('roomSelect is running');
    clearInterval(filterRooms);    
    var filterRooms = setInterval(function() {
      $('.room' + $('.roomSelect').val()).show();
      $('p:not(.room' + $('.roomSelect').val() + ')').hide();
    }, 100);
  });
  $('.newRoom').on('click', function() {
    this.renderRoom(escapeHtml(prompt('Name your new Room')));
  }.bind(this));

  // send form upon clicking enter
  $('.form-control').keypress(function (event) {
    if (event.which === 13) {
      app.handleSubmit();
      return false;    //<---- Add this line
    }
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
  $('#chats').prepend('<p class="fullMessage user' + codedUser + ' room' + codedRoom + '"><a href="#/" onclick="friender(event)" class="username ' + codedUser + '" >' + codedUser + '</a>: ' + codedMessage + ' (in Room ' + codedRoom + ')</p>');
};

app.renderRoom = function(newRoom) {
  console.log(escapeHtml(newRoom));
  $('.roomList').prepend('<option class="roomSelect">' + escapeHtml(newRoom) + '</option>');
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
    roomname: $('.roomSelect').val()
  });
  $('#message').val('');
};

var friender = function(event) {
  console.log('before', event.toElement.classList);
  // console.log('to change', $(event.toElement.classList[1]));
  $('.' + event.toElement.classList[1]).toggleClass('friend');
  console.log('after', event.toElement.classList);  
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
