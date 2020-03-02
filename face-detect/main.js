var vid = document.getElementById("video");

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri("./models"),
    faceapi.nets.faceLandmark68Net.loadFromUri("./models"),
    faceapi.nets.faceRecognitionNet.loadFromUri("./models"),
    faceapi.nets.faceExpressionNet.loadFromUri("./models")
]).then(startVideo);


function startVideo() {
    alert('ready');
    try {
        navigator.mediaDevices.getUserMedia({
            video: {}
        }).then(function (stream) {
            alert(stream);
            vid.srcObject = stream;
            vid.play();
        }, function (rej) {
            alert(rej);
        });
    } catch (e) {
        alert(e);
    }
}

vid.addEventListener("play", function () {
    setInterval(function () {
        faceapi.detectAllFaces(vid, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions()
        .then(function(r) {
            document.getElementById('output').innerText = JSON.stringify(r, '\t', 4);
        });
    }, 100);
});