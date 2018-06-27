import { Packet } from 'phychips-rcp';
import Q = require('q');

export class CommandItem {

    constructor(public packet: Packet,
        public promise: Q.Deferred<{}>) {
    }


}