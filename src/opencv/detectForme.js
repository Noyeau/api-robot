

const cv = require('opencv4nodejs');
const { frameToBase64 } = require('./utils');
module.exports= {
    forme1
}

/**
 * Carré blanc contenant un carré noir
 */
function forme1 (camera){
    let lower = new cv.Vec3(100, 100, 100)
    let upper = new cv.Vec3(255, 255, 255)

    let frame = camera.frame.copy()

    let mask = frame.inRange(lower, upper)

    let contrs = mask.findContours(cv.RETR_TREE, cv.CHAIN_APPROX_TC89_KCOS)

    //   drawContours(contours: Contour[], color: Vec3, contourIdx?: number, maxLevel?: number, offset?: Point2, lineType?: number, thickness?: number, shift?: number): void;
  
    let zoneDef=false;
    let mask2
    contrs.map(cnt => {

        if (cnt.area > 200) {

            //On verifi si il est carré
            let point = cnt.getPoints()
            point = point.sort((a, b) => b.x - a.x)
            let xMin = point[point.length - 1].x
            let xMax = point[0].x

            let xSize = point[0].x - point[point.length - 1].x
            point = point.sort((a, b) => b.y - a.y)
            let yMin = point[point.length - 1].y
            let yMax = point[0].y
            let ySize = point[0].y - point[point.length - 1].y
            if (xSize / ySize > 0.8 && xSize / ySize < 1.2) {
                let rectZone = new cv.Rect(xMin, yMin, xSize, ySize)
                let zone = frame.getRegion(rectZone)
                let lower2 = new cv.Vec3(0, 0, 0)
                let upper2 = new cv.Vec3(150, 150, 150)

                mask2 = zone.inRange(lower2, upper2)
                let blurSize = mask2.sizes[0]/15
                mask2 = mask2.blur(new cv.Size(blurSize,blurSize))
                let contrs2 = mask2.findContours(cv.RETR_TREE, cv.CHAIN_APPROX_SIMPLE)
        
                contrs2.map(cnt2 => {
                    if (cnt2.area < (zone.sizes[0] * zone.sizes[1]) * 0.2 && cnt2.area > (zone.sizes[0] * zone.sizes[1]) * 0.1) {

                        let point2 = cnt2.getPoints()
                        point2 = point2.sort((a, b) => b.x - a.x)
                        let xMin2 = point2[point2.length - 1].x
                        let xMax2 = point2[0].x
                        let xSize2 = point2[0].x - point2[point2.length - 1].x
                        point2 = point2.sort((a, b) => b.y - a.y)
                        let yMin2 = point2[point2.length - 1].y
                        let yMax2 = point2[0].y
                        let ySize2 = point2[0].y - point2[point2.length - 1].y

                        if (xSize2 / ySize2 > 0.8 && xSize2 / ySize2 < 1.2) {
                            let center={
                                x:xMin2+(xSize2/2),
                                y:yMin2+(ySize2/2)
                            }
                            if(
                                center.x/zone.sizes[1] > 0.45 && center.x/zone.sizes[1] < 0.55 &&
                                center.y/zone.sizes[0] > 0.45 && center.y/zone.sizes[0] < 0.55 
                                ){
                                    zoneDef = rectZone
                                    // zone.drawRectangle(new cv.Point2(xMin2, yMin2), new cv.Point2(xMax2, yMax2), new cv.Vec3(0, 255, 0),2)
                                }
                        }
                    }

                })

            }

        }
    })

    // frame.drawContours(points, 0, new cv.Vec3(0, 255, 0), 3)
    if (zoneDef) {
        frame.drawRectangle(zoneDef, new cv.Vec3(0, 255, 0),2)
        myRobot.test.image = frameToBase64(frame)
    }
    

    return zoneDef
}

// getRegion(region: Rect): Mat;
// constructor(x: number, y: number, width: number, height: number);
//