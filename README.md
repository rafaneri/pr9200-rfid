[![Build Status](https://travis-ci.org/rafaneri/pr9200-rfid.svg?branch=master)](https://travis-ci.org/rafaneri/pr9200-rfid)
[![Coverage Status](https://coveralls.io/repos/github/rafaneri/pr9200-rfid/badge.svg?branch=master)](https://coveralls.io/github/rafaneri/pr9200-rfid?branch=master)

# pr9200-rfid
PR9200 RFID

## Using the example

Download the repository, **cd pr9200-rfid-master**, edit the port name in example.js file and run **npm install && node example.js**.

## How to use

```javascript
"use strict";

const phychips = require('phychips-rcp');
const pr9200reader = require('./dist');

let reader = pr9200reader.Pr9200Reader.getInstance('/dev/tty.wchusbserial1d1130', {
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
```
