/// <reference types="node" />
import { EventEmitter } from "events";
import * as SerialPort from 'serialport';
import { Packet } from 'phychips-rcp';
import Q = require('q');
export declare class Pr9200Reader extends EventEmitter {
    private static instances;
    private rcpManager;
    private port;
    private queue;
    private busy;
    private current?;
    private constructor();
    static getInstance(path: string, options?: SerialPort.OpenOptions): Pr9200Reader;
    open(): void;
    isOpen(): boolean;
    close(): void;
    writeCommand(packet: Packet, callback?: Function): Q.Promise<{}>;
    private processQueue;
    private portOpen;
    private portClosed;
    private portData;
    private onPacket;
}
