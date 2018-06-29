"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var command_item_1 = require("./command-item");
var events_1 = require("events");
var SerialPort = require("serialport");
var phychips_rcp_1 = require("phychips-rcp");
var Q = require("q");
var Pr9200Reader = /** @class */ (function (_super) {
    __extends(Pr9200Reader, _super);
    function Pr9200Reader(path, options) {
        var _this = _super.call(this) || this;
        _this.busy = false;
        _this.queue = [];
        _this.rcpManager = new phychips_rcp_1.RcpManager();
        _this.rcpManager.on('packet', function (packet) {
            _this.onPacket(packet);
        });
        _this.port = new SerialPort(path, options);
        _this.port.on('open', function () {
            _this.portOpen();
        });
        _this.port.on('close', function () {
            _this.portClosed();
        });
        _this.port.on('data', function (data) {
            _this.portData(data);
        });
        return _this;
    }
    Pr9200Reader.prototype.open = function () {
        if (!this.port.isOpen) {
            this.port.open();
        }
    };
    Pr9200Reader.prototype.close = function () {
        if (this.port.isOpen) {
            this.port.close();
        }
    };
    Pr9200Reader.prototype.writeCommand = function (packet, callback) {
        var deferred = Q.defer();
        this.queue.push(new command_item_1.CommandItem(packet, deferred));
        if (!this.busy) {
            this.busy = true;
            this.processQueue();
        }
        return deferred.promise;
    };
    Pr9200Reader.prototype.processQueue = function () {
        var next = this.queue.shift();
        if (!next) {
            this.busy = false;
            this.current = undefined;
            return;
        }
        this.current = next;
        this.port.write(next.packet.command());
    };
    Pr9200Reader.prototype.portOpen = function () {
        this.emit('ready');
    };
    Pr9200Reader.prototype.portClosed = function () {
        this.emit('finished');
    };
    Pr9200Reader.prototype.portData = function (data) {
        this.rcpManager.dataReceived(data);
    };
    Pr9200Reader.prototype.onPacket = function (packet) {
        if (packet.isValid()) {
            if (!this.current || packet.messageType == phychips_rcp_1.MessageTypes.MT_Notification) {
                this.emit('notification', packet);
            }
            else {
                if (this.current.packet.messageCode == packet.messageCode) {
                    this.current.promise.resolve(packet);
                }
                else {
                    this.current.promise.reject(packet);
                }
                this.processQueue();
            }
        }
    };
    return Pr9200Reader;
}(events_1.EventEmitter));
exports.Pr9200Reader = Pr9200Reader;
