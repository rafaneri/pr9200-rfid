/// <reference types="node" />
import { EventEmitter } from "events";
import * as SerialPort from 'serialport';
import { Packet } from 'phychips-rcp';
export declare class Pr9200Reader extends EventEmitter {
    private rcpManager;
    private port;
    private queue;
    private busy;
    private current?;
    constructor(path: string, options?: SerialPort.OpenOptions);
    writeCommand(packet: Packet, callback?: Function): void;
    private processQueue;
    private portOpen;
    private portClosed;
    private portData;
    private onPacket;
}
