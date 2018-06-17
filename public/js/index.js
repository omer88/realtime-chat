var socket = io();
socket.on('connect', function() {
  console.log('Connected to server');
});

socket.on('newMessage', function(message) {
  console.log('new message', message);
  const li = jQuery('<li></li>');
  li.text(`${message.from}: ${message.text}`);
  jQuery('#messages').append(li);
});

socket.on('newLocationMessage', function(message) {
  console.log('new message', message);
  const li = jQuery('<li></li>');
  const a = jQuery('<a target= "_blank">my current location</a>');
  a.attr('href', message.url);
  li.text(`${message.from}: `);
  li.append(a);
  jQuery('#messages').append(li);
});

socket.on('disconnect', function() {
  console.log('Disconnected from server');
});

jQuery('#message-form').on('submit', function(e) {
  e.preventDefault();
  socket.emit(
    'createMessage',
    {
      from: 'omer@example.com',
      text: jQuery('input[name=message]').val(),
    },
    function(data) {
      console.log('Got it!', data);
    }
  );
});

var locationButton = jQuery('#send-location');
locationButton.on('click', function() {
  if (!navigator.geolocation) {
    alert('Geolocation is not supported by this browser.');
  } else {
    navigator.geolocation.getCurrentPosition(
      function(position) {
        socket.emit('createLocationMessage', {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        console.log(position);
      },
      function() {
        alert('Unable to fetch location!');
      }
    );
  }
});
