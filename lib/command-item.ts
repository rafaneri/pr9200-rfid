import { Packet } from 'phychips-rcp';
export class CommandItem {

    constructor(public packet: Packet,
        public callback?: Function) {
    }


}