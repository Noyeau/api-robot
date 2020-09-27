const cv = require('opencv4nodejs');

class Camera {
    constructor(options) {
        Object.assign(this, options)
        if (!this.code) {
            this.code = this.label.toLocaleLowerCase().replace(/ /g, '_')
        }
    }
    label = "front";
    code = null;
    source = 0;
    captureWidth = null;
    captureHeight = null;
    frameRate = 7;
    status = 0; // -1 Error, 0 Disconnect, 1 Connect, 2 Stream
    disabled = false;
    getInfos=()=>{
        return {
            label: this.label,
            code: this.code,
            status: this.status,
            frameRate:this.frameRate,
            disabled:this.disabled
        }
    }
    initCamera = initCamera;
    resizeCapture = resizeCapture;
    startCapture = startCapture;
    connectCamera = connectCamera;
    stopCapture = stopCapture;
    onScreenDisplay=onScreenDisplay


}

module.exports = Camera


function initCamera(stream=true) {
    console.log('Camera:' + this.label + ' => initialisation')
    if (this.disabled) {
        console.log('Camera:' + this.label + ' => disabled')
        return
    }
    this.connectCamera()
    if (this.status > 0) {
        if (stream) {
            this.startCapture()
        }
    }
}
function connectCamera() {
    try {
        this.wCap = new cv.VideoCapture(this.source);
        this.status = 1;
        console.log('Camera:' + this.label + ' => connexion : OK')
        this.resizeCapture()
    }
    catch{
        this.wCap = false;
        this.status = -1;
        console.log('Camera:' + this.label + ' => connexion : ERROR')

    }
}

function stopCapture() {
    console.log('Camera:' + this.label + ' => stopCapture')
    if (this._intervalCapture) {
        clearTimeout(this._intervalCapture)
        this.status = 1;
    }
}

function resizeCapture() {
    if (this.captureWidth && this.wCap) {
        console.log('Camera:' + this.label + ' => resizeWidth : ' + this.captureWidth)
        this.wCap.set(cv.CAP_PROP_FRAME_WIDTH, this.captureWidth)
       

    }
    if (this.captureHeight && this.wCap) {
        console.log('Camera:' + this.label + ' => resizeHeight : ' + this.captureHeight)
        this.wCap.set(cv.CAP_PROP_FRAME_HEIGHT, this.captureHeight)
    }
   
    
}

function startCapture() {
    if(this.status >0){
        if (this._intervalCapture) {
            this.stopCapture()
        } else {
            console.log('Camera:' + this.label + ' => startCapture : ' + this.frameRate + 'img/s')
        }
        doIntervalCapture(this)
    }

}

function doIntervalCapture(elem){
    if(elem._intervalCapture){
        clearTimeout(elem._intervalCapture)
    }
    elem.status = 2;
    let frame = elem.wCap.read();

    if (elem.rotate && elem.wCap) {
        frame = frame.rotate(cv.ROTATE_180)
    }
    elem.frame = frame
    if(elem.frameRate<1){
        elem.frameRate=1
    }


    elem._intervalCapture = setTimeout(()=>{
        doIntervalCapture(elem)
    }, 1000/elem.frameRate)
}


/**
 * retourne une frame (Mat) avec OSD
 * @param {*} options Paramètres de l'OSD
 */
function onScreenDisplay(options={}) {
    let displayOption = {
        displayText: true,
        displayDate: true,
        displayTime: true,
        font_scale:1.5,
        displayBackground: true,
        backgroundColor: [0, 0, 0],
        textColor: [255, 255, 255]
    }
    Object.assign(displayOption, options)

    let text = this.label;
    let frame = this.frame.copy();
    let date = new Date().toLocaleDateString();

    let font_scale = displayOption.font_scale;
    let font = cv.FONT_HERSHEY_PLAIN //FONT_HERSHEY_PLAIN
    let text_size = cv.getTextSize(text, font, font_scale, 1);
    let date_size = cv.getTextSize(date, font, 1, 1);


    let time = new Date().toLocaleTimeString() + '.' + Math.floor(new Date().getMilliseconds() / 10)
    let time_size = cv.getTextSize(time, font, 1, 1);


    try {
        frame.drawRectangle(new cv.Point2(5, 5), new cv.Point2(text_size.size.width + 15, text_size.size.height + 15), new cv.Vec3(displayOption.backgroundColor[0], displayOption.backgroundColor[1], displayOption.backgroundColor[2]), cv.FILLED)
        frame.putText(text, new cv.Point2(10, 10 + text_size.size.height), 1, font_scale, new cv.Vec3(displayOption.textColor[0], displayOption.textColor[1], displayOption.textColor[2]))
        frame.drawRectangle(new cv.Point2(5, frame.sizes[0]), new cv.Point2((time_size.size.width > date_size.size.width?time_size.size.width:date_size.size.width) + 15, frame.sizes[0] - (date_size.size.height * 2) - 15), new cv.Vec3(displayOption.backgroundColor[0], displayOption.backgroundColor[1], displayOption.backgroundColor[2]), cv.FILLED)
        frame.putText(date, new cv.Point2(10, frame.sizes[0] - 10 - date_size.size.height), 1, 1, new cv.Vec3(displayOption.textColor[0], displayOption.textColor[1], displayOption.textColor[2]))
        frame.putText(time, new cv.Point2(10, frame.sizes[0] - 5), 1, 1, new cv.Vec3(displayOption.textColor[0], displayOption.textColor[1], displayOption.textColor[2]))
    }
    catch (err) {
        console.log(err);
    }


    return frame;

}
