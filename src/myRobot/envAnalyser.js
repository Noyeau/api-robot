const { analyzerImageMultiple, analyserFaceMark, analyzerImageSimple } = require('../opencv/media-analyse-api')
const tracking = require('../opencv/tracking')
const detectForme = require('../opencv/detectForme')
const classifyImgMulti = require('../opencv/classifyImgMulti')

const cv = require('opencv4nodejs');

const { drawZoneInFrame, frameToBase64, frameToBuffer } = require('../opencv/utils')

module.exports = {
    detectMultipleElems,
    faceMark,
    detectOneElem,
    local_Tracking,
    local_qrCodeReader,
    detectForme
}


function detectOneElem(cameraCode = null) {
    let ts = new Date().getTime()
    if (!myRobot.status.envAnalyser) {
        myRobot.status.envAnalyser = {}
    }
    myRobot.cameras.map(cam => {
        if (!cameraCode || (cameraCode && cameraCode == cam.code)) {
            if (!myRobot.status.envAnalyser['camera-' + cam.code]) {
                myRobot.status.envAnalyser['camera-' + cam.code] = {}
            }
            analyzerImageSimple(cam.frame.copy()).then(res => {
                myRobot.status.envAnalyser['camera-' + cam.code].oneElem = { ...res, imageSize: cam.frame.sizes, ts }
            })
        }
    })
}

function detectMultipleElems(cameraCode = null) {
    let ts = new Date().getTime()
    if (!myRobot.status.envAnalyser) {
        myRobot.status.envAnalyser = {}
    }
    myRobot.cameras.map(cam => {
        if (!cameraCode || (cameraCode && cameraCode == cam.code)) {
            if (!myRobot.status.envAnalyser['camera-' + cam.code]) {
                myRobot.status.envAnalyser['camera-' + cam.code] = {}
            }
            analyzerImageMultiple(cam.frame.copy()).then(res => {
                console.log("ext")
                console.log(res)

                myRobot.status.envAnalyser['camera-' + cam.code].multipleElems = { ...res, imageSize: cam.frame.sizes, ts }
            })

            // console.log("locallll")
            // let frame = cam.frame.copy()
            // body = classifyImgMulti(frame)
            // if(body) {
            //     if (body.length) {
            //         body.filter(p => p.confidence > 0.5).map((p, i) => {
            //             frame.drawRectangle(new cv.Point2(p.topLeft.x, p.topLeft.y), new cv.Point2(p.bottomRight.x, p.bottomRight.y), new cv.Vec3(255, 255, 255), 1)
            //             frame.putText(i + "-" + p.className + "(" + (+p.confidence * 100).toFixed() + "%)", new cv.Point2(p.topLeft.x, p.topLeft.y), 1, 1, new cv.Vec3(255, 255, 255))
            //         });
            //     }
            //     let image = cv.imencode('.jpg', frame).toString('base64')
            //     let res = { image: "data:image/jpeg;base64," + image, data: body };
            //     myRobot.status.envAnalyser['camera-' + cam.code].multipleElems = { ...res, imageSize: cam.frame.sizes, ts }
            // }




        }
    })
}


function faceMark(cameraCode = null) {
    let ts = new Date().getTime()
    if (!myRobot.status.envAnalyser) {
        myRobot.status.envAnalyser = {}
    }
    myRobot.cameras.map(cam => {
        if (!cameraCode || (cameraCode && cameraCode == cam.code)) {
            if (!myRobot.status.envAnalyser['camera-' + cam.code]) {
                myRobot.status.envAnalyser['camera-' + cam.code] = {}
            }
            analyserFaceMark(cam.frame.copy()).then(res => {
                myRobot.status.envAnalyser['camera-' + cam.code].faceMark = { ...res, imageSize: cam.frame.sizes, ts }
            })
        }
    })
}


function local_Tracking(cameraCode = null, withImage = true) {
    let ts = new Date().getTime()
    if (!myRobot.status.envAnalyser) {
        myRobot.status.envAnalyser = {}
    }
    myRobot.cameras.map(cam => {
        if (!cameraCode || (cameraCode && cameraCode == cam.code)) {
            if (!myRobot.status.envAnalyser['camera-' + cam.code]) {
                myRobot.status.envAnalyser['camera-' + cam.code] = {}
            }
            let frameRate = 2;
            if (cam.frameRate < 2) {
                frameRate = cam.frameRate
            }
            tracking(cam, frameRate, 8, (data) => {
                if (withImage) {
                    let frame = cam.frame.copy()
                    drawZoneInFrame(data, frame)
                    let image = frameToBase64(frame)
                    myRobot.status.envAnalyser['camera-' + cam.code].tracking = { image, data, ts }
                } else {
                    myRobot.status.envAnalyser['camera-' + cam.code].tracking = { data, ts }
                }
            })
        }
    })
}





const Jimp = require('jimp');
const jsQR = require("jsqr");

async function local_qrCodeReader(cameraCode = null) {
    return new Promise((resolve, reject) => {
        if (!cameraCode) {
            return resolve(false)
        }
        if (!myRobot.status.envAnalyser) {
            myRobot.status.envAnalyser = {}
        }
        cam = myRobot.cameras.find(ca => ca.code == cameraCode)

        if (!cam) {
            return resolve(false)
        }
        let ts = new Date().getTime()

        // Jimp.read(path.join(__dirname,'../../data/qrCodeTest.png'))// image path use path.join(__dirname,'/fileName')
        Jimp.read(frameToBuffer(cam.frame))// image path use path.join(__dirname,'/fileName')
            .then(image => {
                const code = jsQR(image.bitmap.data, image.bitmap.width, image.bitmap.height)
                if (!code) {
                    return resolve(false)
                }
                console.log("Found QR code", code);
                resolve(code)
                myRobot.status.envAnalyser['camera-' + cam.code].qrCode = { data: code, ts }
                return

                /**
                 * 
                 * code: {
                  binaryData: [
                    123,  34, 109, 121, 77,
                    115, 103,  34,  58, 34,
                    116, 101, 115, 116, 34,
                    125
                  ],
                  data: '{"myMsg":"test"}',
                  chunks: [
                    { type: 'eci', assignmentNumber: 26 },
                    { type: 'byte', bytes: [Array], text: '{"myMsg":"test"}' }
                  ],
                  location: {
                    topRightCorner: { x: 225.96434924399642, y: 109.64949599762822 },
                    topLeftCorner: { x: 162.81509041895987, y: 105.39357519937099 },
                    bottomRightCorner: { x: 222.77507539372277, y: 173.68133586507318 },
                    bottomLeftCorner: { x: 159.29589226602465, y: 170.06778513391515 },
                    topRightFinderPattern: { x: 216.75, y: 118 },
                    topLeftFinderPattern: { x: 171.25, y: 115 },
                    bottomLeftFinderPattern: { x: 168.75, y: 161.5 },
                    bottomRightAlignmentPattern: { x: 207.25, y: 156 }
                  }
                }
                
                 */


            })
            .catch(err => {
                return resolve(false)
            });
    })

}

