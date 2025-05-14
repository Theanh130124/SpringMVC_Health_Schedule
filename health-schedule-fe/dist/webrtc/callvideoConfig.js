"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPeer = exports.playStream = exports.openStream = void 0;
const peerjs_1 = __importDefault(require("peerjs"));
const openStream = () => {
    const config = { audio: true, video: true }; // Bật cả âm thanh và video
    return navigator.mediaDevices.getUserMedia(config);
};
exports.openStream = openStream;
const playStream = (idVideoTag, stream) => {
    const video = document.getElementById(idVideoTag);
    if (video) {
        video.srcObject = stream;
        video.play();
    }
};
exports.playStream = playStream;
const createPeer = () => {
    return new peerjs_1.default({
        host: '192.168.1.10', // Địa chỉ server PeerJS
        port: 9000,
        path: '/myapp',
        secure: false,
    });
};
exports.createPeer = createPeer;
