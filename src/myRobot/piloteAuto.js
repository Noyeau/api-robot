





module.exports = {
    goToCible
}

let tentative = 0;


let _timeOut;

let lastPosition;
/**
 * Rentre au berkaille via cam et QR code
 */
async function goToCible() {
    if(_timeOut){
        clearTimeout(_timeOut)
    }
    myRobot.status.piloteAuto = { FR: 0, FL: 0, RR: 0, RL: 0 }

    let cam = myRobot.cameras.find(ca => ca.code == "heat")
    if (!cam) {
        console.error(new Error("camError"))
        return
    }


    let zone = myRobot.envAnalyser.detectForme.forme1(cam)
    if (zone) {
       
        myRobot.sound.playR2D2("Look")

        tentative = 0;
        console.log(zone)

        let positionActual = calculPosition(zone, cam.frame.sizes)
        console.log(positionActual);
        lastPosition = positionActual
        let nextAction = mouvAfterPosition(positionActual)
        console.log(nextAction);


        switch (nextAction.type) {
            case "stop":

                myRobot.sound.playR2D2("Excited")
                lastPosition=false;
                console.log("destination atteinte");
                myRobot.status.piloteAuto = { FR: 0, FL: 0, RR: 0, RL: 0 }
                setTimeout(() => {
                    myRobot.status.piloteAuto = false;
                }, 100)

                break;
            case "goTo":
                console.log("goToCible goTo");
                myRobot.status.piloteAuto = myRobot.aiMotors.convertCoordGoTo(nextAction.x, nextAction.y)
                setTimeout(() => {
                    myRobot.status.piloteAuto = { FR: 0, FL: 0, RR: 0, RL: 0 }
                    _timeOut = setTimeout(() => {
                        // stop()
                        goToCible()
                    }, 500)
                }, nextAction.time)
                break;
            case "rotate":
                console.log("goToCible rotate");
                myRobot.status.piloteAuto = myRobot.aiMotors.convertCoordRotate(0, 0, nextAction.z)
                setTimeout(() => {
                    myRobot.status.piloteAuto = { FR: 0, FL: 0, RR: 0, RL: 0 }
                    _timeOut = setTimeout(() => {

                        goToCible()
                    }, 500)
                }, nextAction.time)
                break;

        }
    } else {
        console.log(tentative)
        tentative++
       
        if (tentative > 10) {
            myRobot.sound.playR2D2("Shocked")
            lastPosition=false
            tentative = 0
            myRobot.status.piloteAuto = { FR: 0, FL: 0, RR: 0, RL: 0 }
        }
        else if (tentative >= 6) {
            if(lastPosition && lastPosition.xPosition >0){
                myRobot.status.piloteAuto = myRobot.aiMotors.convertCoordRotate(0, 0, -.8)

            }else {
                myRobot.status.piloteAuto = myRobot.aiMotors.convertCoordRotate(0, 0, .8)
            }
            setTimeout(() => {
                myRobot.status.piloteAuto = { FR: 0, FL: 0, RL: 0, RR: 0 }
                _timeOut = setTimeout(() => {

                    goToCible()
                }, 1000)
            }, 50)
        }
        else  if (tentative >= 1) {
            if(lastPosition && lastPosition.xPosition >0){
                console.log(1)
                myRobot.status.piloteAuto = myRobot.aiMotors.convertCoordRotate(0, 0, .8)

            }else {
                console.log(2)

                myRobot.status.piloteAuto = myRobot.aiMotors.convertCoordRotate(0, 0, -.8)
            }
            setTimeout(() => {
                myRobot.status.piloteAuto = { FR: 0, FL: 0, RL: 0, RR: 0 }
                _timeOut = setTimeout(() => {

                    goToCible()
                }, 1000)
            }, 50)
         }
         else {
            _timeOut = setTimeout(() => {
                goToCible()
            }, 500)
        }
    }

}

function calculPosition(zoneInfo, screenSize) {
    let codeHauteur = (zoneInfo.height) / screenSize[0]
    let codeCenterPosX = zoneInfo.x + ((zoneInfo.width) / 2)

    return {
        size: codeHauteur,
        xPosition: (codeCenterPosX - (screenSize[1] / 2)) / screenSize[1]
    }

}

function mouvAfterPosition(positionActual) {
    if (positionActual.size > 0.55) {
        return { type: "stop" }
    }
    else if (positionActual.size > 0.2) {
        if (positionActual.xPosition > 0.15) {
            // return { type: "goTo", x: 0.6, y: 0, time: 75 }
            return { type: "rotate", z: .8, time: 75 }

        } else if (positionActual.xPosition < -0.15) {
            return { type: "rotate", z: -.8, time: 75 }

            // return { type: "goTo", x: -0.6, y: 0, time: 75 }

        } else {
            return { type: "goTo", x: 0, y: 0.8, time: 75 }
        }
    }
    // else if (positionActual.size > 0.2) {
    //     if (positionActual.xPosition > 0.25) {
    //         return { type: "rotate", z: .7, time: 100 }
    //     } else if (positionActual.xPosition < -0.25) {
    //         return { type: "rotate", z: -.7, time: 100 }

    //     } else if (positionActual.xPosition > 0.15) {
    //         return { type: "goTo", x: 0.7, y: 0, time: 100 }
    //     } else if (positionActual.xPosition < -0.15) {
    //         return { type: "goTo", x: -0.7, y: 0, time: 100 }

    //     } else {
    //         return { type: "goTo", x: 0, y: 0.7, time: 150 }
    //     }
    // }


    else {
        if (positionActual.xPosition > 0.25) {
            return { type: "rotate", z: .8, time: 75 }
        } else if (positionActual.xPosition < -0.25) {
            return { type: "rotate", z: -.8, time: 75 }

        // } else if (positionActual.xPosition > 0.15) {
        //     return { type: "goTo", x: 0.7, y: 0.7, time: 100 }
        // } else if (positionActual.xPosition < -0.15) {
        //     return { type: "goTo", x: -0.7, y: 0.7, time: 100 }

        }
        else {
            return { type: "goTo", x: 0, y: 0.8, time: 100 }
        }
    }
}