import { CommandItem } from './../lib/command-item';
import { Packet } from 'phychips-rcp';
import { expect } from 'chai';
import Q = require('q');

describe('CommandItem class test', () => {
    it('should be a CommandItem', () => {
        let packet = Packet.from(Buffer.from([0xBB, 0x02, 0x7E]));
        let deferred = Q.defer();
        const result = new CommandItem(packet, deferred);
        expect(result).to.be.instanceof(CommandItem);
    });
});