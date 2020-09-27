const request = require('request')
const cv = require('opencv4nodejs');


function analyzerImageSimple(frame) {
    return new Promise((resolve, reject) => {

        console.log("analyzerImageSimple - START")

        let image = cv.imencode('.jpg', frame).toString('base64')
        let tmp = { b64: image }

        let url = "http://192.168.1.18:1905/image/simple"
        request({
            method: "POST",
            url: url,
            json: tmp
        }, (err, res, body) => {
            if (err) {
                console.log("Error analizerRequest")
                reject(false)
                return 
            }
            if (body.length) {
                body.map((p, i) => {
                    frame.putText(p.className + '->' + (+p.confidence * 100).toFixed() + "%", new cv.Point2(20, 15 + (i * 15)), 1, 1, new cv.Vec3(50, 50, 0))
                });
                // frame.putText(body.join(', '), new cv.Point2(10, 20), 1, 1)
            }
            let image = cv.imencode('.jpg', frame).toString('base64')
            resolve({ data: body,  image: "data:image/jpeg;base64,"+image })
        })
    })

}


async function faceMark(frame) {
    return new Promise((resolve, reject) => {
        console.log("faceMark - START")
        let image = cv.imencode('.jpg', frame).toString('base64')

        let tmp = { code: "analyse1", b64: image }
        // myRobot.io.emit('image', tmp);

        let url = "http://192.168.1.18:1905/image/face-mark"
        request({
            method: "POST",
            url: url,
            json: tmp
        }, (err, res, body) => {
            if (err) {
                console.log("Error analizerRequest")
                reject(false)
                return
            }
            if (body) {
                // const base64data = body.image.replace('data:image/jpeg;base64', '')
                //     .replace('data:image/png;base64', '');//Strip image type prefix
                // const buffer = Buffer.from(base64data, 'base64');
                // const image = cv.imdecode(buffer); //Image is now represented as Mat

                body.image="data:image/jpeg;base64,"+body.image;

                resolve(body)
                return
            }
            reject(false)

        })
    })

}

// function colormap(colorName) {
//     console.log("colormap - START")
//     const frame = this.frame.copy()
//     let image = cv.imencode('.jpg', frame).toString('base64')

//     let tmp = { code: "analyse1", b64: image }
//     // myRobot.io.emit('image', tmp);

//     let url = "http://192.168.1.18:1905/image/colormap"
//     console.log(url)
//     request({
//         method: "POST",
//         url: url,
//         json: tmp
//     }, (err, res, body) => {
//         if (err) {
//             console.log("Error analizerRequest")
//             return
//         }
//         if (body) {
//             myRobot.io.emit('image', { code: "analyse2", colorName: colorName, b64: body.image });
//         }

//     })

// }

function analyzerImageMultiple(frame) {
    return new Promise((resolve, reject) => {
        console.log("analyzerImageMultiple - START")
        let image = cv.imencode('.jpg', frame).toString('base64')
        let tmp = { b64: image }
        // myRobot.io.emit('image', tmp);


        let url = "http://192.168.1.18:1905/image/multiple"
        request({
            method: "POST",
            url: url,
            json: tmp
        }, (err, res, body) => {
            if (err) {
                console.log("Error analizerRequest")
                return reject(false)
            }
            if (body.length) {
                body.filter(p=>p.confidence > 0.5).map((p,i )=> {
                    frame.drawRectangle(new cv.Point2(p.topLeft.x, p.topLeft.y), new cv.Point2(p.bottomRight.x, p.bottomRight.y), new cv.Vec3(255, 255, 255), 1)
                    frame.putText(i+"-"+p.className+"("+(+p.confidence * 100).toFixed()+"%)", new cv.Point2(p.topLeft.x, p.topLeft.y), 1, 1, new cv.Vec3(255, 255, 255))
                });
                let image = cv.imencode('.jpg', frame).toString('base64')
                resolve({ image: "data:image/jpeg;base64,"+image, data: body});
                return
            }
            reject()

        })
    })
}




// function motionDetect() {
//     console.log("motionDetect - START")
//     const frame = this.frame.copy()
//     let image = cv.imencode('.jpg', frame).toString('base64')

//     let tmp = { code: "analyse1", b64: image }
//     // myRobot.io.emit('image', tmp);

//     let url = "http://192.168.1.18:1905/image/motion"
//     console.log(url)
//     request({
//         method: "POST",
//         url: url,
//         json: tmp
//     }, (err, res, body) => {
//         if (err) {
//             console.log("Error analizerRequest")
//             return
//         }
//         if (body) {
//             myRobot.io.emit('image', { code: "analyse2", b64: body.image });
//         }

//     })

// }





// exports.colormap = colormap
exports.analyzerImageMultiple = analyzerImageMultiple
exports.analyzerImageSimple = analyzerImageSimple
// exports.motionDetect = motionDetect
exports.analyserFaceMark = faceMark

