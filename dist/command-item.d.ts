import { Packet } from 'phychips-rcp';
import Q = require('q');
export declare class CommandItem {
    packet: Packet;
    promise: Q.Deferred<{}>;
    constructor(packet: Packet, promise: Q.Deferred<{}>);
}
