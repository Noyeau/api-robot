const cv = require('opencv4nodejs');



const bgSubtractor = new cv.BackgroundSubtractorMOG2();



/**
 * Trop lourd pour une utilisation locale
 */
// module.exports = (camera, frameRate, callBack)=>{
//     let delay = 1000/frameRate
//     grabFrames(camera, delay, (frame) => {
//         const foreGroundMask = bgSubtractor.apply(frame);

//         const iterations = 2;
//         const dilated = foreGroundMask.dilate(
//           cv.getStructuringElement(cv.MORPH_ELLIPSE, new cv.Size(4, 4)),
//           new cv.Point(-1, -1),
//           iterations
//         );
//         const blurred = dilated.blur(new cv.Size(10, 10));
//         const thresholded = blurred.threshold(200, 255, cv.THRESH_BINARY);

//         const minPxSize = 4000;
//         drawRectAroundBlobs(thresholded, frame, minPxSize);
//         camera.motionFrame = frame
//         callBack(blurred)
//       });
// }



module.exports = tracking

function tracking(camera, frameRate, sensi, callBack, firstframe = null) {
    //inspiré de https://www.pyimagesearch.com/2015/05/25/basic-motion-detection-and-tracking-with-python-and-opencv/
    let frame = camera.frame.copy()
    let gray = frame.cvtColor(cv.COLOR_BGR2GRAY)
    gray.gaussianBlur(new cv.Size(21, 21), 0)
    if (!firstframe) {
        tracking(camera, frameRate, sensi, callBack, gray)
        return

    }
    let frameDelta = firstframe.absdiff(gray)
    let thresh = frameDelta.threshold(sensi, 255, cv.THRESH_BINARY)
    thresh.dilate(cv.getStructuringElement(cv.MORPH_ELLIPSE, new cv.Size(4, 4)), new cv.Point(-1, -1), 2)


    cnts = thresh.copy().findContours(cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE)
    // console.log("cnts*-*-*",cnts)
    let data = calculZones(thresh, 500);
    callBack(data)
    setTimeout(() => {
        tracking(camera, frameRate, sensi, callBack, gray)
    }, 1000 / frameRate)
}


function calculZones(binaryImg, minPxSize, fixedRectWidth){
    const {
        centroids,
        stats
    } = binaryImg.connectedComponentsWithStats();

    let rep = []
    // pretend label 0 is background
    for (let label = 1; label < centroids.rows; label += 1) {
        const [x1, y1] = [stats.at(label, cv.CC_STAT_LEFT), stats.at(label, cv.CC_STAT_TOP)];
        const [x2, y2] = [
            x1 + (fixedRectWidth || stats.at(label, cv.CC_STAT_WIDTH)),
            y1 + (fixedRectWidth || stats.at(label, cv.CC_STAT_HEIGHT))
        ];

        const size = stats.at(label, cv.CC_STAT_AREA);
        if (minPxSize < size) {
            rep.push({ size, topLeft: { x: x1, y: y1 }, bottomRight: { x: x2, y: y2 } })
        }
    }
    return rep.map(a => {
        let display = true;
        rep.map(b => {
            if ((a.topLeft.x > b.topLeft.x && a.topLeft.y > b.topLeft.y) && (a.bottomRight.x < b.bottomRight.x && a.bottomRight.y < b.bottomRight.y)) {
                display = false
            }
            else if ((a.topLeft.x > b.topLeft.x-50 && a.topLeft.y > b.topLeft.y-50) && (a.bottomRight.x < b.bottomRight.x && a.bottomRight.y < b.bottomRight.y)) {
                display = false
            }
            else if ((a.topLeft.x > b.topLeft.x && a.topLeft.y > b.topLeft.y) && (a.bottomRight.x < b.bottomRight.x+50 && a.bottomRight.y < b.bottomRight.y+50)) {
                display = false
            }
        })
        if (display) {
            return a
        }

    }).filter(a=>a)
   
}

const drawRectAroundBlobs = (binaryImg, dstImg, minPxSize, fixedRectWidth) => {
    const {
        centroids,
        stats
    } = binaryImg.connectedComponentsWithStats();

    let tmp = []
    // pretend label 0 is background
    for (let label = 1; label < centroids.rows; label += 1) {
        const [x1, y1] = [stats.at(label, cv.CC_STAT_LEFT), stats.at(label, cv.CC_STAT_TOP)];
        const [x2, y2] = [
            x1 + (fixedRectWidth || stats.at(label, cv.CC_STAT_WIDTH)),
            y1 + (fixedRectWidth || stats.at(label, cv.CC_STAT_HEIGHT))
        ];

        const size = stats.at(label, cv.CC_STAT_AREA);
        const blue = new cv.Vec(255, 0, 0);
        if (minPxSize < size) {
            tmp.push({ size, topLeft: { x: x1, y: y1 }, bottomRight: { x: x2, y: y2 } })
            // dstImg.drawRectangle(
            //     new cv.Point(x1, y1),
            //     new cv.Point(x2, y2),
            //     { color: blue, thickness: 2 }
            // );
        }
    }
    console.log(tmp)
    const blue = new cv.Vec(255, 0, 0);
    const red = new cv.Vec(0, 0, 255);

    tmp.map(a => {
        let display = true;
        tmp.map(b => {
            if ((a.topLeft.x > b.topLeft.x && a.topLeft.y > b.topLeft.y) && (a.bottomRight.x < b.bottomRight.x && a.bottomRight.y < b.bottomRight.y)) {
                display = false
            }
            else if ((a.topLeft.x > b.topLeft.x-50 && a.topLeft.y > b.topLeft.y-50) && (a.bottomRight.x < b.bottomRight.x && a.bottomRight.y < b.bottomRight.y)) {
                display = false
            }
            else if ((a.topLeft.x > b.topLeft.x && a.topLeft.y > b.topLeft.y) && (a.bottomRight.x < b.bottomRight.x+50 && a.bottomRight.y < b.bottomRight.y+50)) {
                display = false
            }
        })
        if (display) {
            dstImg.drawRectangle(
                new cv.Point(a.topLeft.x, a.topLeft.y),
                new cv.Point(a.bottomRight.x, a.bottomRight.y),
                { color: blue, thickness: 2 }
            );
        } else {
            dstImg.drawRectangle(
                new cv.Point(a.topLeft.x, a.topLeft.y),
                new cv.Point(a.bottomRight.x, a.bottomRight.y),
                { color: red, thickness: 2 }
            );
        }

    })
    return tmp;
};