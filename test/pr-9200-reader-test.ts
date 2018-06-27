import { Pr9200Reader } from './../lib/pr-9200-reader';
import { expect } from 'chai';
import { ReaderControlProtocol } from 'phychips-rcp';
import Q = require('q');

describe('Pr9200Reader class test', () => {
    it('should be a P9200Reader', () => {
        const result = new Pr9200Reader('/dev/tty.wchusbserial1d1130', {
            autoOpen: false,
            baudRate: 115200,
            dataBits: 8,
            stopBits: 1,
            parity: "none"
        });
        expect(result).to.be.instanceof(Pr9200Reader);
    });
    it('should be a true', () => {
        let reader = new Pr9200Reader('/dev/tty.wchusbserial1d1130', {
            autoOpen: false,
            baudRate: 115200,
            dataBits: 8,
            stopBits: 1,
            parity: "none"
        });
        const result = reader.writeCommand(ReaderControlProtocol.startAutoRead2());
        expect(result.isPending()).to.equal(true);
    });
});