const Robot = require('../class/robot')
const Camera = require('../class/camera')
const initSensorUpdate = require('./initSensorUpdate')
const actions = require('./actions')
const piloteAuto = require('./piloteAuto')

piloteAuto

/**
 * Configuration General des paramètres du robot avant initialisation
 */
let robotParams = {
    cameras: [
        // {
        //     label: "Robot Front",
        //     code: "front",
        //     source: 2,
        //     captureWidth: 800,
        //     // captureHeight: 450,
        //     frameRate: 5,
        //     rotate: false
        // },
        {
            label: "Robot Heat",
            code: "heat",
            captureWidth: 800,
            source: 0,
            frameRate: 10,
            rotate: false
        }
    ],
    obstacleDetection: true,
    obstacleReaction: "stop" // "back", "stop"
}



/**
 * INITIALISATION DU ROBOT
 */
exports.init = async function init() {
    console.log("*-*-*-*-*-*-*-*-*-*-*-*-*-*-*")
    console.log("DEBUT - Initialisation du Robot")
    console.log("*-*-*-*-*-*-*-*-*-*-*-*-*-*-*")

    global.myRobot = new Robot({
        sound: require('./sound'),
        actions: actions,
        params: robotParams,
        piloteAuto: piloteAuto,
        test: {}
    })

    initCameras()
    initSensorUpdate(15)
    piloteAutoCheck()



    myRobot.sound.playR2D2("Concerned")
    console.log("*-*-*-*-*-*-*-*-*-*-*-*-*-*-*")
    console.log("FIN - Initialisation du Robot")
    console.log("*-*-*-*-*-*-*-*-*-*-*-*-*-*-*")
}


function initCameras() {
    console.log('----****----**** Cameras - init - START ****----****----')
    myRobot.cameras = []
    myRobot.params.cameras.map(cam => {
        myRobot.cameras.push(new Camera(cam))
    })
    myRobot.cameras.map((cam, i) => {
        cam.initCamera(true)
    })
    console.log('----****----**** Cameras - init - END ****----****----')
}


function piloteAutoCheck() {
    setInterval(() => {

        if (myRobot.status && myRobot.status.piloteAuto) {
            let tmp = {
                FL: 0,
                FR: 0,
                RL: 0,
                RR: 0,
            }
            Object.assign(tmp, myRobot.status.piloteAuto)


            tmp = obstacleReduisVitesse(tmp)
            console.log(tmp)
            myRobot.motorDevice.sendData(myRobot.aiMotors.prepareToSend(tmp), true).then(
                (res) => {
                    // console.log(res)
                }, err => {
                    console.error(new Error("pb send Motor"))
                }
            )
        }

    }, 50)

}



function obstacleReduisVitesse(objMouv) {
    let minDist = myRobot.status.obstacle.minDist
    let reduc = 1;
    if (minDist) {
        if (minDist < 20) {
            reduc = 0
        }
        else if (minDist < 30) {
            reduc = 0.5
        }
        else if (minDist < 50) {
            reduc = 0.8
        }
    }
    if (reduc < 1) {
        console.log(reduc)
    }

    return {
        FL: objMouv.FL * reduc,
        FR: objMouv.FR * reduc,
        RL: objMouv.RL * reduc,
        RR: objMouv.RR * reduc,
    }

}


