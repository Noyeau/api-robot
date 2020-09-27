var file = '/dev/ttyAMA0';

var GPS = require('gps');
var SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline')
var port = new SerialPort(file, {
    baudRate: 9600,
//   parser: new Readline({ delimiter: '\r\n' })
});

var gps = new GPS;
console.log('*-*-*-*-*-init GPS*-*-*-*-*-*-*')
gps.on('data', function(data) {
    // console.log(data, gps.state);
  });
   
  port.on('data', function(data) {
    gps.updatePartial(data);
  });

module.exports = gps.state;