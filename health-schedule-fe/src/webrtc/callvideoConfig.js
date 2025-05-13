
import Peer from "peerjs";

export const openStream = () => {
    const config = { audio: true, video: true }; // Bật cả âm thanh và video
    return navigator.mediaDevices.getUserMedia(config);
};

export const playStream = (idVideoTag, stream) => {
    const video = document.getElementById(idVideoTag);
    if (video) {
        video.srcObject = stream;
        video.play();
    }
};

export const createPeer = () => {
    return new Peer({
        host: '192.168.1.10', // Địa chỉ server PeerJS
        port: 9000,
        path: '/myapp',
        secure: false,
    });
};
