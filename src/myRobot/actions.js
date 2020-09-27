
const aiMotors = require('../ai-motors')


module.exports = {
    checkRadar,
    goTo,
    rotate,
    stop,
    goHomeQR,
    goHomeCible
}
async function goHomeCible() {
    return require('./piloteAuto').goToCible()
}


function checkRadar() {
    myRobot.sensorDevice.sendData("check")
}

function goTo({ x, y }) {
    myRobot.status.piloteAuto = false;
    aiMotors.goTo(x, y)
}

function stop() {
    myRobot.status.piloteAuto = false;
    aiMotors.stop()
}

function rotate({ x, y, z }) {
    myRobot.status.piloteAuto = false;
    console.log("*-*-*-rotate", z)
    aiMotors.rotate(x, y, z)
}





/**
 * Rentre au berkaille via cam et QR code
 */
async function goHomeQR() {
    let cam = myRobot.cameras.find(ca => ca.code == "heat")
    if (!cam) {
        console.error(new Error("camError"))
        return
    }


    myRobot.envAnalyser.local_qrCodeReader(cam.code).then(async qrCode => {


        if (!qrCode) {
            console.error(new Error("qrCode Error 123"))
    myRobot.status.piloteAuto = false;

            return
        }
        let positionActual = calculPosition(qrCode.location, cam.frame.sizes)
        console.log(positionActual);

        let nextAction = mouvAfterPosition(positionActual)
        console.log(nextAction);

        switch (nextAction.type) {
            case "stop":
                console.log("destination atteinte");
                stop()
                break;
            case "goTo":
                console.log("goHomeQR goTo");
                myRobot.status.piloteAuto = myRobot.aiMotors.convertCoordGoTo(nextAction.x, nextAction.y)
                // goTo({ x: nextAction.x, y: nextAction.y })
                setTimeout(() => {
                    myRobot.status.piloteAuto = { FR: 0, FL: 0, RR: 0, RL: 0 }
                    
                    // stop()
                    // stop()

                    // stop()

                    setTimeout(() => {
                        // stop()

                        goHomeQR()
                    }, 500)
                }, nextAction.time)

                break;
            case "rotate":
                console.log("goHomeQR rotate");
                // rotate({ x: 0, y: 0, z: nextAction.z })
                myRobot.status.piloteAuto = myRobot.aiMotors.convertCoordRotate(0,0, nextAction.z)

                setTimeout(() => {
                    myRobot.status.piloteAuto = { FR: 0, FL: 0, RR: 0, RL: 0 }

                    // stop()
                    setTimeout(() => {
                        // stop()

                        goHomeQR()
                    }, 500)
                }, nextAction.time)
                break;

        }
    })

}

function calculPosition(codeLocation, screenSize) {
    console.log(screenSize)
    console.log((codeLocation.bottomLeftFinderPattern.y - codeLocation.topLeftFinderPattern.y) +"/"+ screenSize[0])

    let codeHauteur = (codeLocation.bottomLeftFinderPattern.y - codeLocation.topLeftFinderPattern.y) / screenSize[0]
    let codeCenterPosX = codeLocation.topLeftFinderPattern.x + ((codeLocation.topRightFinderPattern.x - codeLocation.topLeftFinderPattern.x) / 2)

    return {
        size: codeHauteur,
        xPosition: (codeCenterPosX - (screenSize[1] / 2)) / screenSize[1]
    }

}

function mouvAfterPosition(positionActual) {
    if (positionActual.size > 0.6) {
        return { type: "stop" }
    }
    else if (positionActual.size > 0.4) {
        if (positionActual.xPosition > 0.15) {
            return { type: "goTo", x: 0.8, y: 0, time: 100 }
        } else if (positionActual.xPosition < -0.15) {
            return { type: "goTo", x: -0.8, y: 0, time: 100 }

        } else {
            return { type: "goTo", x: 0, y: 0.8, time: 1000 }
        }
    }
    else if (positionActual.size > 0.2) {
        if (positionActual.xPosition > 0.3) {
            return { type: "rotate", z: .8, time: 100 }
        } else if (positionActual.xPosition < -0.3) {
            return { type: "rotate", z: -.8, time: 100 }

        } else if (positionActual.xPosition > 0.15) {
            return { type: "goTo", x: 0.8, y: 0, time: 100 }
        } else if (positionActual.xPosition < -0.15) {
            return { type: "goTo", x: -0.8, y: 0, time: 100 }

        } else  {
            return { type: "goTo", x: 0, y: 0.8, time: 2000 }
        }
    }


    else {
        if (positionActual.xPosition > 0.3) {
            return { type: "rotate", z: .8, time: 100 }
        } else if (positionActual.xPosition < -0.3) {
            return { type: "rotate", z: -.8, time: 100 }

        } else {
            return { type: "goTo", x: 0, y:1, time: 3000 }
        }
    }
}