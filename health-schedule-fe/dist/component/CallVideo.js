"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_bootstrap_1 = require("react-bootstrap");
const callvideoConfig_1 = require("../webrtc/callvideoConfig");
require("./Styles/CallVideo.css");
const react_router_dom_1 = require("react-router-dom");
//Chỉ nhận remotePeerId qua props:
const CallVideo = ({ remotePeerId }) => {
    const [peer, setPeer] = (0, react_1.useState)(null);
    const [localStream, setLocalStream] = (0, react_1.useState)(null);
    const [remoteStream, setRemoteStream] = (0, react_1.useState)(null);
    const [callActive, setCallActive] = (0, react_1.useState)(false);
    const localVideoRef = (0, react_1.useRef)(null);
    const remoteVideoRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        // Tạo Peer khi component được mount
        const newPeer = (0, callvideoConfig_1.createPeer)();
        setPeer(newPeer);
        newPeer.on("open", (id) => {
            console.log("Peer ID:", id);
        });
        // Xử lý khi nhận cuộc gọi
        newPeer.on("call", (call) => {
            (0, callvideoConfig_1.openStream)().then((stream) => {
                setLocalStream(stream);
                (0, callvideoConfig_1.playStream)("localStream", stream);
                call.answer(stream); // Trả lời cuộc gọi với stream của mình
                call.on("stream", (remoteStream) => {
                    setRemoteStream(remoteStream);
                    (0, callvideoConfig_1.playStream)("remoteStream", remoteStream);
                });
            });
        });
        return () => {
            newPeer.destroy(); // Dọn dẹp Peer khi component bị unmount
        };
    }, []);
    const handleCall = () => {
        (0, callvideoConfig_1.openStream)().then((stream) => {
            setLocalStream(stream);
            (0, callvideoConfig_1.playStream)("localStream", stream);
            const call = peer.call(remotePeerId, stream); // Gọi đến Peer ID của người nhận
            call.on("stream", (remoteStream) => {
                setRemoteStream(remoteStream);
                (0, callvideoConfig_1.playStream)("remoteStream", remoteStream);
            });
            setCallActive(true);
        });
    };
    const handleEndCall = () => {
        if (localStream) {
            localStream.getTracks().forEach((track) => track.stop()); // Dừng tất cả các track
        }
        setLocalStream(null);
        setRemoteStream(null);
        setCallActive(false);
    };
    return (<>
            <react_bootstrap_1.Row className="video-call-section">
                <react_bootstrap_1.Col xs={6}>
                    <video id="localStream" ref={localVideoRef} className="video-player" autoPlay muted></video>
                </react_bootstrap_1.Col>
                <react_bootstrap_1.Col xs={6}>
                    <video id="remoteStream" ref={remoteVideoRef} className="video-player" autoPlay></video>
                </react_bootstrap_1.Col>
            </react_bootstrap_1.Row>
            <react_bootstrap_1.Row className="call-controls">
                <react_bootstrap_1.Col xs={6}>
                    <react_bootstrap_1.Button onClick={handleCall} disabled={callActive}>
                        Gọi Video
                    </react_bootstrap_1.Button>
                </react_bootstrap_1.Col>
                <react_bootstrap_1.Col xs={6}>
                    <react_bootstrap_1.Button variant="danger" onClick={handleEndCall} disabled={!callActive}>
                        Kết thúc
                    </react_bootstrap_1.Button>
                </react_bootstrap_1.Col>
            </react_bootstrap_1.Row>
        </>);
};
exports.default = CallVideo;
