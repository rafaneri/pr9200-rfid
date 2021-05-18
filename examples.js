'use strict';

const phychips = require('phychips-rcp');
const pr9200reader = require('./dist');

let reader = pr9200reader.Pr9200Reader.getInstance('PORT_ID', {
    baudRate: 115200,
    dataBits: 8,
    stopBits: 1,
    parity: "none"
});

reader.on('ready', () => {
    console.log('Reader Connected');
    reader.writeCommand(phychips.ReaderControlProtocol.startAutoRead2())
        .then((packet) => {
            console.log('Auto Reader Initialized');
        });
});

reader.on('notification', (packet) => {
    console.log(packet.getEpc().toString('HEX'));
});
