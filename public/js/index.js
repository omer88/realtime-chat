var socket = io();

function scrollToBottom() {
  var messages = jQuery('#messages');
  var newMessage = messages.children('li:last-child');

  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if (
    clientHeight + scrollTop + newMessageHeight + lastMessageHeight >=
    scrollHeight
  ) {
    messages.scrollTop(scrollHeight);
  }
}

socket.on('connect', function() {
  console.log('Connected to server');
});

socket.on('newMessage', function(message) {
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = jQuery('#message-template').html();
  var html = Mustache.render(template, {
    from: message.from,
    text: message.text,
    createdAt: formattedTime,
  });
  jQuery('#messages').append(html);
  scrollToBottom();
  // var li = jQuery('<li></li>');
  // li.text(`${message.from} ${formattedTime}: ${message.text}`);
  // jQuery('#messages').append(li);
});

socket.on('newLocationMessage', function(message) {
  var formattedTime = moment(message.createdAt).format('h:mm a');

  var template = jQuery('#location-message-template').html();
  var html = Mustache.render(template, {
    from: message.from,
    url: message.url,
    createdAt: formattedTime,
  });
  jQuery('#messages').append(html);
  scrollToBottom();
  // var li = jQuery('<li></li>');
  // var a = jQuery('<a target= "_blank">my current location</a>');
  // a.attr('href', message.url);
  // li.text(`${message.from} ${formattedTime}: `);
  // li.append(a);
  // jQuery('#messages').append(li);
});

socket.on('disconnect', function() {
  console.log('Disconnected from server');
});

var messageTextbox = jQuery('input[name=message]');

jQuery('#message-form').on('submit', function(e) {
  e.preventDefault();
  socket.emit(
    'createMessage',
    {
      from: 'omer@example.com',
      text: messageTextbox.val(),
    },
    function(data) {
      messageTextbox.val('');
    }
  );
});

var locationButton = jQuery('#send-location');
locationButton.on('click', function() {
  if (!navigator.geolocation) {
    alert('Geolocation is not supported by this browser.');
  } else {
    locationButton.attr('disabled', 'disabled').text('Sending location...');
    navigator.geolocation.getCurrentPosition(
      function(position) {
        locationButton.removeAttr('disabled').text('Send location');
        socket.emit('createLocationMessage', {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        console.log(position);
      },
      function() {
        locationButton.removeAttr('disabled').text('Send location');
        alert('Unable to fetch location!');
      }
    );
  }
});
