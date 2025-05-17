import React, { useEffect, useRef, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { createPeer, openStream, playStream } from "../webrtc/callvideoConfig";
import "./Styles/CallVideo.css";
import { useLocation } from "react-router-dom";

//Chỉ nhận remotePeerId qua props:
const CallVideo = ({ remotePeerId, peer ,onEndCall }) => {



    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [callActive, setCallActive] = useState(false);

    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);

    // Phía nhận: lắng nghe cuộc gọi đến
    useEffect(() => {
        if (!peer) return;
        const handleIncomingCall = (call) => {
            openStream().then((stream) => {
                setLocalStream(stream);
                playStream("localStream", stream);
                call.answer(stream);
                setCallActive(true);
                call.on("stream", (remoteStream) => {
                    setRemoteStream(remoteStream);
                    playStream("remoteStream", remoteStream);
                });
            });
        };
        peer.on("call", handleIncomingCall);
        return () => {
            peer.off("call", handleIncomingCall);
        };
    }, [peer]);

    // Phía gọi: khi có remotePeerId, tự động gọi
    useEffect(() => {
        if (!peer || !remotePeerId) return;
        openStream().then((stream) => {
            setLocalStream(stream);
            playStream("localStream", stream);
            const call = peer.call(remotePeerId, stream);
            setCallActive(true);
            call.on("stream", (remoteStream) => {
                setRemoteStream(remoteStream);
                playStream("remoteStream", remoteStream);
            });
        });
    }, [peer, remotePeerId]);


    

    const handleEndCall = () => {
        if (localStream) {
            localStream.getTracks().forEach((track) => track.stop()); // Dừng tất cả các track
        }
        setLocalStream(null);
        setRemoteStream(null);
        setCallActive(false);
        if (typeof onEndCall === "function") {
      onEndCall();
    }
        
    };

        return (
        <>
            <Row className="video-call-section">
                <Col xs={6}>
                    <video
                        id="localStream"
                        ref={localVideoRef}
                        className="video-player"
                        autoPlay
                        muted
                    ></video>
                </Col>
                <Col xs={6}>
                    <video
                        id="remoteStream"
                        ref={remoteVideoRef}
                        className="video-player"
                        autoPlay
                    ></video>
                </Col>
            </Row>
            <Row className="call-controls">
                <Col xs={12}>
                    <Button variant="danger" onClick={handleEndCall} disabled={!callActive}>
                        Kết thúc
                    </Button>
                </Col>
            </Row>
        </>
    );
};

export default CallVideo;