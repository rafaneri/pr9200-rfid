import { Packet } from 'phychips-rcp';
export declare class CommandItem {
    packet: Packet;
    callback?: Function | undefined;
    constructor(packet: Packet, callback?: Function | undefined);
}
