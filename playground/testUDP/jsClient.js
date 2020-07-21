/*
    This part of playground is to experiment with and understand udp service.
    udpServer created in C responds to message sent by this jsClient
*/

const dgram = require('dgram');
const parser = require('url').parse;

const message = Buffer.from('Hello from jsClient');

const socket = dgram.createSocket('udp4');
const url = parser('http://127.0.0.1:8080');

console.log('sending');
socket.send(message, 0, message.length, url.port, url.hostname, ()=>{ console.log('sent'); });

socket.on('message', msg => {
    console.log('Message received:', msg);
});
