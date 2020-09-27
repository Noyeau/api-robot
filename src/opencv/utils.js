const cv = require('opencv4nodejs');




module.exports = {
    drawZoneInFrame,
    frameToBase64,
    base64ToFrame,
    frameToBuffer,
    bufferToFrame,
    resizeFrame
}


function drawZoneInFrame(zones, frame, color = new cv.Vec(255, 0, 0), thickness = 2) {
    zones.map(zone => {
        frame.drawRectangle(
            new cv.Point(zone.topLeft.x, zone.topLeft.y),
            new cv.Point(zone.bottomRight.x, zone.bottomRight.y),
            { color, thickness }
        );
    })
}


function frameToBuffer(frame) {
    return cv.imencode('.jpg', frame)
}

function bufferToFrame(buffer) {
    return cv.imdecode(buffer); //Image is now represented as Mat
}


function frameToBase64(frame) {
    return "data:image/jpeg;base64," + frameToBuffer(frame).toString('base64')
}

function base64ToFrame(image) {
    const base64data = image.replace('data:image/jpeg;base64', '')
        .replace('data:image/png;base64', '');//Strip image type prefix
    const buffer = Buffer.from(base64data, 'base64');
    return bufferToFrame(buffer); //Image is now represented as Mat
}


function resizeFrame(frame, width){
    let size = frame.sizes
    let h = size[0]*(width/size[1])
   return frame.resize(new cv.Size(width,h))
}

