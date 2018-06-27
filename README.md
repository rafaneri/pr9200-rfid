[![Build Status](https://travis-ci.org/rafaneri/pr9200-rfid.svg?branch=master)](https://travis-ci.org/rafaneri/pr9200-rfid)

# pr9200-rfid
PR9200 RFID

## How to use

```javascript
"use strict";

const phychips = require('phychips-rcp');
const pr9200reader = require('./dist');

let reader = new pr9200reader.Pr9200Reader('/dev/tty.wchusbserial1d1130', {
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

reader.on('epc', (packet) => {
    console.log(packet);
});
```
