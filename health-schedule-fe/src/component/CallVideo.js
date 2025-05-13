import React, { useEffect, useRef, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { createPeer, openStream, playStream } from "../webrtc/callvideoConfig";
import "./Styles/CallVideo.css";
import { useLocation } from "react-router-dom";

//Chỉ nhận remotePeerId qua props:
const CallVideo = ({ remotePeerId }) => {


    const [peer, setPeer] = useState(null);
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [callActive, setCallActive] = useState(false);

    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);

    useEffect(() => {
        // Tạo Peer khi component được mount
        const newPeer = createPeer();
        setPeer(newPeer);

        newPeer.on("open", (id) => {
            console.log("Peer ID:", id);
        });

        // Xử lý khi nhận cuộc gọi
        newPeer.on("call", (call) => {
            openStream().then((stream) => {
                setLocalStream(stream);
                playStream("localStream", stream);
                call.answer(stream); // Trả lời cuộc gọi với stream của mình
                call.on("stream", (remoteStream) => {
                    setRemoteStream(remoteStream);
                    playStream("remoteStream", remoteStream);
                });
            });
        });

        return () => {
            newPeer.destroy(); // Dọn dẹp Peer khi component bị unmount
        };
    }, []);

    const handleCall = () => {
        openStream().then((stream) => {
            setLocalStream(stream);
            playStream("localStream", stream);

            const call = peer.call(remotePeerId, stream); // Gọi đến Peer ID của người nhận
            call.on("stream", (remoteStream) => {
                setRemoteStream(remoteStream);
                playStream("remoteStream", remoteStream);
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
                <Col xs={6}>
                    <Button onClick={handleCall} disabled={callActive}>
                        Gọi Video
                    </Button>
                </Col>
                <Col xs={6}>
                    <Button variant="danger" onClick={handleEndCall} disabled={!callActive}>
                        Kết thúc
                    </Button>
                </Col>
            </Row>
        </>
    );
};

export default CallVideo;