import { CommandItem } from './command-item';
import { EventEmitter } from "events";
import * as SerialPort from 'serialport';
import { RcpManager, Packet, MessageTypes } from 'phychips-rcp';
import Q = require('q');

export class Pr9200Reader extends EventEmitter {

    private static instances: Array<Pr9200Reader> = [];
    private rcpManager: RcpManager;
    private port: SerialPort;
    private queue: Array<CommandItem>;
    private busy: boolean = false;
    private current?: CommandItem;

    private constructor(path: string, options?: SerialPort.OpenOptions) {
        super();
        this.queue = [];
        this.rcpManager = new RcpManager();
        this.rcpManager.on('packet', (packet: Packet) => {
            this.onPacket(packet);
        });
        this.port = new SerialPort(path, options);
        this.port.on('open', () => {
            this.portOpen();
        });
        this.port.on('close', () => {
            this.portClosed();
        });
        this.port.on('data', (data: any) => {
            this.portData(data);
        });
    }

    static getInstance(path: string, options?: SerialPort.OpenOptions) {
        let exists = false;
        let elementIndex = -1;
        for (let index = 0; index < Pr9200Reader.instances.length; index++) {
            const element = Pr9200Reader.instances[index];
            if (element.port.path === path) {
                exists = true;
                elementIndex = index;
                break;
            }
        }
        if (!exists) {
            Pr9200Reader.instances.push(new Pr9200Reader(path, options));
            elementIndex = Pr9200Reader.instances.length - 1;
        }
        return Pr9200Reader.instances[elementIndex];
    }

    open(): void {
        if (!this.port.isOpen) {
            this.port.open();
        }
    }

    isOpen(): boolean {
        return this.port.isOpen;
    }

    close(): void {
        if (this.port.isOpen) {
            this.port.close();
        }
    }

    writeCommand(packet: Packet, callback?: Function): Q.Promise<{}> {
        let deferred = Q.defer();
        this.queue.push(new CommandItem(packet, deferred));

        if (!this.busy) {
            this.busy = true;
            this.processQueue();
        }

        return deferred.promise;
    }

    private processQueue(): any {
        let next = this.queue.shift();

        if (!next) {
            this.busy = false;
            this.current = undefined;
            return;
        }

        this.current = next;
        this.port.write(next.packet.command());
    }

    private portOpen(): void {
        this.emit('ready');
    }

    private portClosed(): void {
        this.emit('finished');
    }

    private portData(data: any): void {
        setTimeout(() => {
            this.rcpManager.dataReceived(data);
        }, 0);
    }

    private onPacket(packet: Packet): void {
        if (packet.isValid()) {
            if (!this.current || packet.messageType == MessageTypes.MT_Notification) {
                this.emit('notification', packet);
            } else {
                if (this.current.packet.messageCode == packet.messageCode) {
                    this.current.promise.resolve(packet);
                } else {
                    this.current.promise.reject(packet);
                }
                this.processQueue();
            }
        }
    }
}