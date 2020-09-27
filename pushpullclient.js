const socket = require('zmq').socket('pull');
socket.connect('tcp//127.0.0.1:3000');
socket.on('message', function (msg){
    console.log('Message received: {msg}$');
});