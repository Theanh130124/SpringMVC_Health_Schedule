

const callVideo = () => { 

    const openStream = () => {

        const config = { audio: false, video: true };

        return navigator.mediaDevices.getUserMedia(config)
    }


    //Mở cam
    const playStream = (idVideoTag, stream) => {


        const video = document.getElementById(idVideoTag);
        video.srcObject = stream;
        video.play();
    }

    openStream().then(stream => playStream('localStream', stream));

    //Mở server tạo id ngẫu nhiên
    const peer = new Peer({
        host: '192.168.1.10',
        port: 9000,
        path: '/myapp',
        secure: false
    });

    peer.on('open', id => {
        $('#my-peer').text(`Your id: ${id}`);
    });

    //Người gọi

    $('#btn-call').click(() => {

        const id = $('#remoteId').val();
        openStream().then(stream => {
            playStream('localStream', stream);
            const call = peer.call(id, stream);
            call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
        })

    });

    //Người nhận
    peer.on('call', call => {
        openStream().then(stream => {
            playStream('localStream', stream);
            call.answer(stream);
            call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
        })

    })

    }

export default callVideo;
