
import Peer from "peerjs";

export const openStream = () => {
    const config = { audio: true, video: true }; // Bật cả âm thanh và video
    return navigator.mediaDevices.getUserMedia(config);
};

export const playStream = (idVideoTag, stream) => {
    const video = document.getElementById(idVideoTag);
    if (video) {
        // Chỉ set lại srcObject nếu stream thực sự thay đổi
        if (video.srcObject !== stream) {
            video.srcObject = stream;
            video.onloadedmetadata = () => {
                video.play().catch(() => {});
            };
        }
    }
};

export const createPeer = () => {
    return new Peer({
        host: 'localhost', // Địa chỉ server PeerJS
        port: 9000,
        path: '/',
        secure: false,
    });
};
